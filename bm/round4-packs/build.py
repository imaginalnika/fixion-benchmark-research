#!/usr/bin/env python3
"""Build labeled, offline sample packs from immutable raw records. No model calls.

python3 packs/build.py --registry strategies/catalog.json [--runs outputs/runs.jsonl]
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'packs'
MIX = ROOT / 'experiments/round2/mixing'
DEFAULT_IDS = ('base instruct geometric arithmetic product_of_experts min_logprob contrastive cfg proxy '
               'nudging baco_p conformative kl_gate dynamic_geometric clipped_ratio tokenwise_ratio_gate '
               'disagreement_protect base_drives_instruct_checks instruct_proposes_base_vetoes '
               'span_best_of_n span_beam span_mcts speculative span_accept_retry '
               'weight_interpolation layer_interpolation activation_patch').split()
GROUPS = {
    'figgs_proxy': {'title': 'Figgs · 35B Base + 9B proxy', 'note': 'Three original stages of the same Figgs prompt lineage. Sparse 9B instruction correction applied to a 35B Base writer; not a 35B sibling mixture. One continuation per arm and prompt, cap 96.', 'path': 'proxy35b_josh/outputs', 'manifest': 'proxy35b_josh/manifest.json'},
    'direct9b': {'title': 'Myths · direct 9B sibling pilot', 'note': '9B Base and Instruct, not the proposed 35B pair. Mixed arms use the union of two top-20 lists; native and routed arms sample unrestricted support. Primary cap 192; sparse endpoint controls cap 64.', 'path': 'outputs', 'manifest': 'manifest.json'},
    'myth_proxy': {'title': 'Myths · 35B Base + 9B proxy', 'note': '35B Base writer plus a 9B Instruct-minus-Base log-probability correction. Union of three top-20 lists; all candidates scored by all models. One continuation per arm and prompt, cap 96.', 'path': 'proxy35b/outputs', 'manifest': 'proxy35b/manifest.json'},
    'native35b': {'title': 'Myths · native 35B endpoints', 'note': 'Same submitted prompt string, different providers. Tinker Base versus OpenRouter/Darkbloom Instruct; internal formatting is uncontrolled (19 versus 31 reported prompt tokens). Three replicates each, cap 300.', 'path': 'native35b', 'manifest': 'manifest.json'},
}
ARM_INFO = {
    'base_native': ('base', '9B Base · native', 'Unrestricted native Base sampling'),
    'instruct_native': ('instruct', '9B Instruct · native', 'Unrestricted native Instruct sampling'),
    'mix_m025': ('geometric', '9B sparse geometric · α −0.25', 'Sparse extrapolation: (1−α) log pBase + α log pInstruct'),
    'mix_p015': ('geometric', '9B sparse geometric · α 0.15', 'Sparse interpolation: (1−α) log pBase + α log pInstruct'),
    'mix_p050': ('geometric', '9B sparse geometric · α 0.50', 'Sparse interpolation: (1−α) log pBase + α log pInstruct'),
    'mix_zero_support': ('geometric', '9B sparse support control · α 0', 'Base weights restricted to the two-model top-20 union'),
    'mix_one_support': ('geometric', '9B sparse support control · α 1', 'Instruct weights restricted to the two-model top-20 union'),
    'nudging_g04': ('nudging', '9B Nudging-inspired · gate 0.4', 'One-token routing: Instruct if max pBase < 0.4, otherwise Base; not the full paper method'),
    'baco_g04': ('baco_p', '9B BACo-P-inspired · gate 0.4', 'One-token routing: Base if max pBase < 0.4, otherwise Instruct'),
    'base_tinker': ('base', '35B Base · native Tinker', 'Unrestricted native endpoint'),
    'instruct_openrouter': ('instruct', '35B Instruct · native OpenRouter', 'Native Darkbloom endpoint; internal prompt formatting uncontrolled'),
    'native35b': ('base', '35B Base · native Tinker', 'Unrestricted native endpoint; no 9B correction is used'),
    'proxy_zero_support': ('proxy', '35B + 9B sparse proxy control · β 0', '35B Base weights restricted to the three-model top-20 union'),
    'proxy_m025': ('proxy', '35B + 9B sparse proxy · β −0.25', 'log p35Base + β (log p9Instruct − log p9Base)'),
    'proxy_p015': ('proxy', '35B + 9B sparse proxy · β 0.15', 'log p35Base + β (log p9Instruct − log p9Base)'),
    'proxy_p050': ('proxy', '35B + 9B sparse proxy · β 0.50', 'log p35Base + β (log p9Instruct − log p9Base)'),
}

def sha(value):
    return hashlib.sha256(value if isinstance(value, bytes) else value.encode('utf-8')).hexdigest()

def load(path):
    return json.loads(Path(path).read_bytes())

def source_info(path):
    path = Path(path).resolve()
    try:
        name = str(path.relative_to(ROOT))
        href = '../' + name
    except ValueError:
        name, href = str(path), str(path)
    return {'path': name, 'href': href, 'sha256': sha(path.read_bytes())}

def originals():
    catalog = ROOT / 'experiments/round2/josh_grid/source_prompts.json'
    jd = load(catalog)
    archive = Path(jd['source_file'])
    assert sha(archive.read_bytes()) == jd['source_sha256'], 'Original Josh archive changed'
    raw = load(archive)['sessions'][0]['data']
    raw_prompts = {r['prompt'] for r in raw['runs']} | {raw['prompt']}
    result = {}
    for row in jd['prompts']:
        assert row['prompt'] in raw_prompts and sha(row['prompt']) == row['sha256_utf8']
        result[row['prompt_id']] = {'id': row['prompt_id'], 'prompt': row['prompt'], 'sha256': sha(row['prompt']),
            'source': source_info(archive), 'locations': row['source_locations'], 'catalog': source_info(catalog)}
    myth = Path(load(MIX / 'manifest.json')['source'])
    assert sha(myth.read_bytes()) == load(MIX / 'manifest.json')['source_sha256'], 'Original myth archive changed'
    for i, row in enumerate(load(myth)):
        result[row['id']] = {'id': row['id'], 'prompt': row['prompt'], 'sha256': sha(row['prompt']),
                            'source': source_info(myth), 'locations': [f'[{i}].prompt']}
    return result

def registry(path):
    if path and not Path(path).exists():
        raise FileNotFoundError(f'Strategy registry does not exist: {path}')
    if path and Path(path).exists():
        obj = load(path)
        entries = obj.get('strategies', obj.get('entries', obj)) if isinstance(obj, dict) else obj
        if isinstance(entries, dict):
            entries = [dict(v, id=k) if isinstance(v, dict) else {'id': k, 'description': v} for k,v in entries.items()]
        result = []
        for row in entries:
            if isinstance(row, str): row = {'id': row}
            sid = row.get('id', row.get('name'))
            if not sid: raise ValueError('Registry entry lacks id/name')
            result.append(dict(row, id=sid))
        assert len({r['id'] for r in result}) == len(result), 'Duplicate registry IDs'
        return result, source_info(path)
    return [{'id': s, 'name': s.replace('_', ' '), 'registry_pending': True} for s in DEFAULT_IDS], None

def archived_records(original):
    records = []
    for group, spec in GROUPS.items():
        manifest = load(MIX / spec['manifest'])
        for path in sorted((MIX / spec['path']).glob('*.json')):
            row = load(path)
            assert row['complete'] is True, f'Incomplete record: {path}'
            arm = row.get('arm', row.get('branch'))
            sid, label, method = ARM_INFO[arm]
            pid, prompt = row['pid'], row['prompt']
            assert prompt == original[pid]['prompt'], f'Non-original prompt: {path}'
            info = manifest['arms'].get(arm, {})
            cap = row.get('max_tokens', info.get('max_tokens', manifest['max_tokens']))
            tokens = row.get('tokens')
            count = len(tokens) if tokens is not None else row.get('usage', {}).get('completion_tokens')
            models = row.get('models', [row.get('model')])
            if arm in ('base_native', 'instruct_native'):
                roles = {'writer': models[0 if arm == 'base_native' else 1]}
            elif arm in ('base_tinker', 'instruct_openrouter', 'native35b'):
                roles = {'writer': row.get('model', models[0])}
            elif group in ('figgs_proxy', 'myth_proxy'):
                roles = {'writer': models[0], 'correction_base': models[1], 'correction_instruct': models[2]}
            else:
                roles = {'base': models[0], 'instruct': models[1]}
            sparse = info.get('kind') in ('mix', 'proxy')
            support = ('Union of all three top-20 lists' if 'proxy' in group else 'Union of both top-20 lists') if sparse else 'Unrestricted native endpoint support'
            relation = 'archived sparse approximation' if sparse else 'archived one-token routing approximation' if info.get('kind') == 'route' else 'archived native baseline'
            stop = 'Explicit token IDs [248044, 248046]' if sparse or info.get('kind') == 'route' else 'Provider/service defaults'
            text = row['text']
            records.append({'id': f'{group}/{row.get("id", path.stem)}', 'strategy_id': sid,
                'group': group, 'arm': arm, 'label': label, 'method': method, 'evidence': relation,
                'pid': pid, 'prompt': prompt, 'prompt_sha256': sha(prompt), 'text': text,
                'text_sha256': sha(text), 'text_bytes': len(text.encode('utf-8')), 'text_characters': len(text),
                'token_ids': tokens, 'token_count': count, 'max_tokens': cap,
                'seed': row.get('seed'), 'replicate': row.get('replicate', 0), 'finish_reason': row['finish_reason'],
                'sampling': {'temperature': row.get('temperature', manifest['temperature']), 'top_p': row.get('top_p', manifest['top_p']),
                             'top_k': row.get('request', {}).get('top_k', manifest['top_k']), 'top_k_semantics': 'disabled for final sampling; candidate top-20 union is a separate restriction where stated'},
                'parameters': info, 'models': roles, 'provider': row.get('provider', 'Tinker'),
                'support': support, 'stop_policy': stop, 'source': source_info(path),
                'source_manifest': source_info(MIX / spec['manifest']),
                'reported_input_tokens': row.get('usage', {}).get('prompt_tokens', row.get('usage', {}).get('input_tokens')),
                'local_prompt_tokens': len(row.get('prompt_tokens', row.get('local_raw_prompt_tokens', []))),
                'format': row.get('format', manifest['format']), 'actual_kit_run': False})
    assert len(records) == 75 and len({r['id'] for r in records}) == 75
    return records

def import_runs(paths, original, registered):
    result = []
    for path in paths:
        # JSONL records are delimited by LF, not by U+2028/U+2029 inside prose.
        for line, raw in enumerate(Path(path).read_text(encoding='utf-8').split('\n'), 1):
            if not raw.strip(): continue
            row = json.loads(raw)
            if row.get('synthetic') is not False or 'toy' in str(row.get('backend', '')).lower():
                raise ValueError(f'Refusing synthetic/toy or unmarked record at {path}:{line}')
            if row.get('status') != 'complete' or row.get('complete') is False:
                continue
            strategy = row['strategy']
            sid = strategy.get('name', strategy['id']) if isinstance(strategy, dict) else strategy
            arm = strategy.get('id', sid) if isinstance(strategy, dict) else sid
            assert sid in registered, f'Unknown imported strategy: {sid}'
            pid, prompt, text = row['prompt_id'], row['prompt'], row['text']
            assert pid in original and prompt == original[pid]['prompt'], 'Imported prompt is not exact original'
            assert row['prompt_sha256'] == sha(prompt), 'Imported prompt hash mismatch'
            if 'text_sha256' in row: assert row['text_sha256'] == sha(text), 'Imported text hash mismatch'
            for field in ('sampling', 'models', 'finish_reason', 'seed'): assert field in row, f'Missing {field}'
            tokens = row.get('token_ids')
            model_meta = row['models']
            branches = model_meta.get('models', model_meta) if isinstance(model_meta, dict) else model_meta
            roles = {k: v.get('model_id', v) if isinstance(v, dict) else v for k,v in branches.items()} if isinstance(branches, dict) else branches
            if sid in ('base', 'instruct') and isinstance(roles, dict) and sid in roles:
                roles = {'writer': roles[sid]}
            if sid == 'proxy' and row.get('reference_model') and isinstance(roles, dict):
                roles = {'writer': roles.get('base'), 'correction_instruct': roles.get('instruct'),
                         'correction_base': row['reference_model'].get('model_id', row['reference_model'])}
            key = row.get('job_id', row.get('id', f'{sha(str(Path(path).resolve()))[:16]}-{sid}-{pid}-{line}'))
            result.append({'id': f'kit/{key}', 'strategy_id': sid, 'group': 'kit', 'arm': arm,
                'job_id': row.get('job_id'), 'run_id': row.get('run_id'),
                'label': strategy.get('name', sid) if isinstance(strategy, dict) else sid,
                'method': 'Actual saved strategy-run continuation; see parameters and diagnostics',
                'evidence': 'actual kit run (backend and support as recorded)', 'pid': pid, 'prompt': prompt,
                'prompt_sha256': sha(prompt), 'text': text, 'text_sha256': sha(text),
                'text_bytes': len(text.encode('utf-8')), 'text_characters': len(text), 'token_ids': tokens,
                'token_count': len(tokens) if tokens is not None else row.get('token_count'),
                'max_tokens': row.get('max_new_tokens', row.get('max_tokens', row['sampling'].get('max_tokens'))),
                'seed': row['seed'], 'replicate': row.get('repeat', row.get('replicate', 0)), 'finish_reason': row['finish_reason'],
                'sampling': row['sampling'], 'parameters': strategy.get('params', {}) if isinstance(strategy, dict) else {},
                'models': roles, 'model_metadata': model_meta, 'reference_model': row.get('reference_model'), 'provider': row.get('backend', row.get('provider', 'not recorded')),
                'support': row.get('support', row.get('diagnostics', {}).get('support', 'not recorded; inspect source')),
                'stop_policy': row.get('stop_policy', 'see source'), 'format': row.get('format', 'see source'),
                'diagnostics': row.get('diagnostics', {}), 'source': dict(source_info(path), line=line),
                'actual_kit_run': True})
    return result

def build(args):
    original = originals()
    entries, reg_source = registry(args.registry)
    registered = {r['id'] for r in entries}
    records = archived_records(original) + import_runs(args.runs, original, registered)
    assert len({r['id'] for r in records}) == len(records), 'Duplicate record IDs'
    assert {r['strategy_id'] for r in records} <= registered
    coverage = []
    for entry in entries:
        sid = entry['id']
        actual = [r for r in records if r['strategy_id'] == sid and r['actual_kit_run']]
        archived = [r for r in records if r['strategy_id'] == sid and not r['actual_kit_run']]
        status = 'actual kit continuation available' if actual else 'archived baseline/approximation only; awaiting pod for kit run' if archived else 'awaiting pod; no actual continuation'
        config = entry.get('config', 'strategies/configs/proxy.json' if sid == 'proxy' else 'strategies/configs/smoke.json')
        command = f'python -m strategies.run --config {config} --strategy {sid} --output runs/{sid}.jsonl'
        coverage.append(dict(entry, registry_status=entry.get('status'), status=status, actual_kit_count=len(actual), archived_count=len(archived),
                             record_ids=[r['id'] for r in actual + archived],
                             run_entry=entry.get('run_command', entry.get('command', command))))
    used = {r['pid'] for r in records}
    order = ['JP045', 'JP041', 'JP044', 'P07', 'P09', 'P10']
    prompts = [original[p] for p in order if p in used] + [original[p] for p in sorted(used - set(order))]
    for p in prompts: p['utf8_bytes'] = len(p['prompt'].encode('utf-8'))
    groups = {k: {a:b for a,b in v.items() if a not in ('path', 'manifest')} for k,v in GROUPS.items()}
    if any(r['actual_kit_run'] for r in records): groups['kit'] = {'title': 'New saved kit runs', 'note': 'Imported actual runs; backend, precision, sampler, support and strategy parameters remain visible in each panel.'}
    data = {'schema_version': 1, 'built_at': datetime.now(timezone.utc).isoformat(), 'registry': reg_source,
            'selection': 'All 75 complete archived mixing records, deterministic path order; no quality selection. Initial panels choose native base and the smallest positive correction, based on metadata. Optional imported rows are all successful exact-original-prompt records.',
            'counts': dict(Counter(r['group'] for r in records)), 'record_count': len(records),
            'groups': groups, 'prompts': prompts, 'strategies': coverage, 'records': records,
            'claims': {'new_model_calls_by_builder': 0, 'archived_full_vocabulary_sibling_mix': False,
                       'taste_ranking': False, 'original_source_comparison': True}}
    OUT.mkdir(exist_ok=True)
    (OUT / 'manifest.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    template = (OUT / 'viewer_template.html').read_text(encoding='utf-8')
    (OUT / 'index.html').write_text(template.replace('__DATA__', payload), encoding='utf-8')
    markdown(data)
    print(json.dumps({'records': len(records), 'strategies': len(coverage), 'groups': data['counts'], 'registry': reg_source['path'] if reg_source else 'pending'}))

def markdown(data):
    lines = ['# Labeled strategy samples', '', '[Open the side-by-side viewer](index.html) · [Exact strings and provenance](manifest.json) · [Validation](validation.json)', '',
             'All 75 archived mixing records are included. No text was selected by quality, edited, trimmed, or generated for this pack. These are Round 2 baselines and approximations, not results from the new full-logit kit. Same submitted original prompt strings are verified against primary source files; endpoint internals can still differ.', '',
             '| Kit strategy | Coverage | Archived / kit outputs |', '|---|---|---|']
    for s in data['strategies']: lines.append(f'| `{s["id"]}` | {s["status"]} | {s["archived_count"]} / {s["actual_kit_count"]} |')
    lines += ['', 'Sparse geometric/proxy runs use only top-20 unions, not full logit vectors. Native controls use unrestricted sampling; 9B endpoint support controls have a shorter 64-token cap. Proxy β = 1 would not be the 35B Instruct distribution. Nudging/BACo labels denote the recorded simple routing rules, not full paper reproductions. All native 35B Instruct records have a provider-format confound. Seeds do not imply matched random draws. A length stop may leave an unfinished sentence.', '', '## Exact run entries', '']
    for s in data['strategies']:
        lines += [f'### {s["id"]}', '', s['status'], '', '```text', str(s['run_entry']), '```', '']
    lines += ['## Full saved continuations', '', 'Each prompt appears once below; all following samples in that prompt section use exactly those bytes. HTML/Markdown renderers differ in whitespace display; the JSON string views retain every space, newline, and special-token spelling.', '']
    for p in data['prompts']:
        lines += [f'### {p["id"]}', '', f'Original prompt SHA-256: `{p["sha256"]}` · {p["utf8_bytes"]} UTF-8 bytes.', '', '<details><summary>Full exact original prompt</summary>', '', '<pre><code>' + html.escape(p['prompt']) + '</code></pre>', '', '```json', json.dumps(p['prompt'], ensure_ascii=False), '```', '', '</details>', '']
        for group in data['groups']:
            rows = [r for r in data['records'] if r['pid'] == p['id'] and r['group'] == group]
            if not rows: continue
            lines += [f'#### {data["groups"][group]["title"]}', '', data['groups'][group]['note'], '']
            for r in rows:
                lines += [f'<details><summary>{html.escape(r["label"])} · saved replicate {r["replicate"]} · {r["token_count"]} tokens · {r["finish_reason"]}</summary>', '',
                          f'{r["evidence"]}. {r["method"]}.', '',
                          f'Model roles: `{json.dumps(r["models"],ensure_ascii=False)}`. T {r["sampling"].get("temperature")}, top-p {r["sampling"].get("top_p")}, cap {r["max_tokens"]}, seed {r["seed"]}. {r["support"]}. {r["text_bytes"]} UTF-8 bytes.', '',
                          '<pre><code>' + html.escape(r['text']) + '</code></pre>', '',
                          f'[Raw source]({r["source"]["href"]}) · text SHA-256 `{r["text_sha256"]}`', '', '</details>', '']
    (OUT / 'strategy_samples.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--registry', default=str(ROOT / 'strategies/catalog.json'))
    parser.add_argument('--runs', action='append', default=[], help='Additional saved-run JSONL; repeatable')
    build(parser.parse_args())
