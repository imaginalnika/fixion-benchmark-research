#!/usr/bin/env python3
"""Independently validate the pack against original files; no builder imports/network.

Run from any directory. --manifest/--html/--output support checking a candidate
snapshot without replacing the published validation result. Exit 1 means failure.
"""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shlex
import sys
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'packs'
MIX = ROOT / 'experiments/round2/mixing'
ARCHIVES = {
    'direct9b': ('outputs', 'manifest.json', 27),
    'native35b': ('native35b', 'manifest.json', 18),
    'myth_proxy': ('proxy35b/outputs', 'proxy35b/manifest.json', 15),
    'figgs_proxy': ('proxy35b_josh/outputs', 'proxy35b_josh/manifest.json', 15),
}
ORIGINAL_HASHES = {
    'P07': '96036443380446f44def061baaef1fd58b49b55e7473169cba912f886d8085d3',
    'P09': 'f982d5a02d36e0d41c27d12808f3acaaacc5adcf065c4e0158c53d39efb8eecc',
    'P10': 'bd6c7e29c0397032a2c4aa919301c74f73c195597bfa513d8880b91279dd2290',
    'JP041': 'bc2d5a6384640ede592bd82649c61b130af3c6f70e307e3f080b382ca4791d23',
    'JP044': 'd5f719905a598c57e48bcf8e6963fc8e0cd1f3badc9d48b041a988a9a2467fda',
    'JP045': '8d755ab5e73c50bf76a65cb6ccab596c5488ed1535edcb71ef38fea748915abc',
}
ARM_STRATEGY = {
    'base_native': 'base', 'instruct_native': 'instruct',
    'base_tinker': 'base', 'instruct_openrouter': 'instruct', 'native35b': 'base',
    'mix_m025': 'geometric', 'mix_p015': 'geometric', 'mix_p050': 'geometric',
    'mix_zero_support': 'geometric', 'mix_one_support': 'geometric',
    'nudging_g04': 'nudging', 'baco_g04': 'baco_p',
    'proxy_m025': 'proxy', 'proxy_p015': 'proxy', 'proxy_p050': 'proxy', 'proxy_zero_support': 'proxy',
}


def digest(value):
    return hashlib.sha256(value if isinstance(value, bytes) else value.encode('utf-8')).hexdigest()


def pointer(obj, location):
    """Resolve documented a.b[0] pointers, never eval arbitrary source text."""
    pieces = re.findall(r'[A-Za-z_]\w*|\[\d+\]', location)
    if '.'.join(pieces).replace('.[', '[') != location.lstrip('.'):
        raise ValueError(f'Unsupported original-source pointer: {location}')
    for piece in pieces:
        obj = obj[int(piece[1:-1])] if piece.startswith('[') else obj[piece]
    return obj


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.payloads, self.links, self.script_sources = [], [], []
        self.inside = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script':
            self.inside = attrs.get('id') == 'pack-data'
            if self.inside:
                self.payloads.append('')
            if attrs.get('src'):
                self.script_sources.append(attrs['src'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])

    def handle_endtag(self, tag):
        if tag == 'script':
            self.inside = False

    def handle_data(self, data):
        if self.inside:
            self.payloads[-1] += data


class Audit:
    def __init__(self):
        self.errors, self.checks, self.files = [], 0, {}
        self.source_paths = set()

    def check(self, condition, message):
        self.checks += 1
        if not condition:
            self.errors.append(message)

    def equal(self, actual, expected, message):
        self.check(actual == expected, message)

    def path(self, value):
        path = Path(value)
        return path.resolve() if path.is_absolute() else (ROOT / path).resolve()

    def read(self, path):
        path = Path(path).resolve()
        if path not in self.files:
            self.files[path] = path.read_bytes()
        return self.files[path]

    def json(self, path):
        return json.loads(self.read(path))

    def local_link(self, href, context):
        url = urlparse(href)
        if url.scheme or url.netloc or not url.path:
            return
        path = Path(unquote(url.path))
        path = path if path.is_absolute() else PACK / path
        # The report is created only after validation, so its self-link is allowed.
        self.check(path.exists() or path.resolve() == (PACK / 'validation.json').resolve(),
                   f'{context}: local link missing: {href}')

    def source(self, info, context):
        path = self.path(info['path'])
        self.source_paths.add(str(path))
        self.equal(digest(self.read(path)), info['sha256'], f'{context}: source SHA-256 mismatch: {path}')
        self.local_link(info['href'], context)
        linked = Path(unquote(urlparse(info['href']).path))
        linked = linked if linked.is_absolute() else PACK / linked
        self.equal(linked.resolve(), path, f'{context}: source href resolves to a different file')
        return path

    def original(self, prompt):
        pid, text = prompt['id'], prompt['prompt']
        path = self.source(prompt['source'], f'prompt {pid}')
        raw = self.json(path)
        self.check(bool(prompt['locations']), f'prompt {pid}: no original location')
        for location in prompt['locations']:
            self.equal(pointer(raw, location), text, f'prompt {pid}: original string mismatch at {location}')
        self.equal(digest(text), prompt['sha256'], f'prompt {pid}: string SHA-256 mismatch')
        self.equal(len(text.encode('utf-8')), prompt['utf8_bytes'], f'prompt {pid}: byte length mismatch')
        if pid in ORIGINAL_HASHES:
            self.equal(digest(text), ORIGINAL_HASHES[pid], f'prompt {pid}: differs from independently audited original')
        if 'catalog' in prompt:
            cat_path = self.source(prompt['catalog'], f'prompt {pid} catalog')
            matches = [p for p in self.json(cat_path)['prompts'] if p['prompt_id'] == pid]
            self.equal(len(matches), 1, f'prompt {pid}: missing/duplicate catalog entry')
            if matches:
                self.equal(matches[0]['prompt'], text, f'prompt {pid}: catalog text mismatch')

    def common_record(self, row, raw, originals):
        label = row['id']
        self.equal(row['prompt'], raw['prompt'], f'{label}: prompt differs from raw output record')
        self.equal(row['text'], raw['text'], f'{label}: continuation differs from raw output record')
        self.equal(row['prompt'], originals[row['pid']]['prompt'], f'{label}: not the exact original prompt')
        self.equal(row['prompt_sha256'], digest(row['prompt']), f'{label}: prompt SHA-256 mismatch')
        self.equal(row['text_sha256'], digest(row['text']), f'{label}: text SHA-256 mismatch')
        self.equal(row['text_bytes'], len(row['text'].encode('utf-8')), f'{label}: text byte length mismatch')
        self.equal(row['text_characters'], len(row['text']), f'{label}: text character length mismatch')
        self.equal(row['finish_reason'], raw['finish_reason'], f'{label}: finish reason changed')
        self.equal(row['seed'], raw['seed'], f'{label}: seed changed')
        self.check(isinstance(row['actual_kit_run'], bool), f'{label}: actual_kit_run must be boolean')
        tokens = raw.get('token_ids') if row['actual_kit_run'] else raw.get('tokens')
        self.equal(row['token_ids'], tokens, f'{label}: token IDs differ from raw record')
        count = len(tokens) if tokens is not None else raw.get('token_count', raw.get('usage', {}).get('completion_tokens'))
        self.equal(row['token_count'], count, f'{label}: emitted token count mismatch')
        if tokens is not None:
            self.check(all(isinstance(t, int) and not isinstance(t, bool) and t >= 0 for t in tokens), f'{label}: invalid token IDs')
        if row['max_tokens'] is not None and count is not None:
            self.check(count <= row['max_tokens'], f'{label}: emitted count exceeds cap')
            if row['finish_reason'] == 'length':
                self.equal(count, row['max_tokens'], f'{label}: length finish below recorded cap')

    def archived(self, row, raw, manifest, group):
        label, arm = row['id'], raw.get('arm', raw.get('branch'))
        self.check(raw.get('complete') is True, f'{label}: archived record is incomplete')
        self.check(row['actual_kit_run'] is False, f'{label}: archived output relabeled as actual kit run')
        self.equal(row['arm'], arm, f'{label}: archived arm changed')
        self.equal(row['strategy_id'], ARM_STRATEGY[arm], f'{label}: incorrect strategy-family mapping')
        self.equal(row['pid'], raw['pid'], f'{label}: prompt ID changed')
        self.equal(row['replicate'], raw['replicate'], f'{label}: replicate changed')
        params = manifest['arms'].get(arm, {})
        self.equal(row['parameters'], params, f'{label}: archived strategy parameters changed')
        cap = raw.get('max_tokens', params.get('max_tokens', manifest['max_tokens']))
        self.equal(row['max_tokens'], cap, f'{label}: cap differs from source/arm manifest')
        for field in ('temperature', 'top_p'):
            self.equal(row['sampling'][field], raw.get(field, manifest[field]), f'{label}: sampler {field} changed')
        self.equal(row['sampling']['top_k'], raw.get('request', {}).get('top_k', manifest['top_k']), f'{label}: top-k changed')
        self.equal(row['format'], raw.get('format', manifest['format']), f'{label}: formatting metadata changed')
        self.equal(row['provider'], raw.get('provider', 'Tinker'), f'{label}: provider changed')
        self.equal(row['local_prompt_tokens'], len(raw.get('prompt_tokens', raw.get('local_raw_prompt_tokens', []))), f'{label}: local input-token count changed')
        usage = raw.get('usage', {})
        self.equal(row['reported_input_tokens'], usage.get('prompt_tokens', usage.get('input_tokens')), f'{label}: provider input-token count changed')
        if arm == 'instruct_openrouter':
            self.equal(usage.get('prompt_tokens'), 31, f'{label}: audited provider format diagnostic changed')
            self.check('uncontrolled' in row['method'].lower(), f'{label}: missing provider-format caveat')
        if group == 'direct9b':
            models = raw['models']
            roles = {'writer': models[0 if arm == 'base_native' else 1]} if arm in ('base_native', 'instruct_native') else {'base': models[0], 'instruct': models[1]}
        elif group == 'native35b':
            roles = {'writer': raw['model']}
        else:
            models = raw['models']
            roles = {'writer': models[0]} if arm == 'native35b' else {'writer': models[0], 'correction_base': models[1], 'correction_instruct': models[2]}
        self.equal(row['models'], roles, f'{label}: model roles differ from actual operation')
        kind = params.get('kind', 'native')
        if kind in ('mix', 'proxy'):
            self.check('sparse approximation' in row['evidence'], f'{label}: sparse approximation label missing')
            support = 'Union of all three top-20 lists' if kind == 'proxy' else 'Union of both top-20 lists'
            self.equal(row['support'], support, f'{label}: sparse support mislabeled')
        elif kind == 'route':
            self.check('one-token routing approximation' in row['evidence'], f'{label}: routing approximation label missing')
            self.check('inspired' in row['label'].lower(), f'{label}: paper-inspired caveat missing')
        else:
            self.equal(row['evidence'], 'archived native baseline', f'{label}: native output relabeled')
        stop = 'Explicit token IDs [248044, 248046]' if kind in ('mix', 'proxy', 'route') else 'Provider/service defaults'
        self.equal(row['stop_policy'], stop, f'{label}: stop-policy description changed')

    def imported(self, row, raw, registered):
        label = row['id']
        self.check(raw.get('synthetic') is False, f'{label}: actual run must explicitly have synthetic=false')
        self.equal(raw.get('status'), 'complete', f'{label}: actual run must have status=complete')
        self.check(raw.get('complete') is not False, f'{label}: actual run marked incomplete')
        self.check('toy' not in str(raw.get('backend', '')).lower(), f'{label}: toy backend presented as actual')
        strategy = raw['strategy']
        sid = strategy.get('name', strategy.get('id')) if isinstance(strategy, dict) else strategy
        arm = strategy.get('id', sid) if isinstance(strategy, dict) else sid
        self.check(sid in registered, f'{label}: unregistered imported strategy family {sid}')
        for key, expected in [('strategy_id', sid), ('arm', arm), ('pid', raw['prompt_id']),
                              ('sampling', raw['sampling']), ('model_metadata', raw['models']),
                              ('reference_model', raw.get('reference_model')), ('job_id', raw.get('job_id')),
                              ('run_id', raw.get('run_id')), ('diagnostics', raw.get('diagnostics', {})),
                              ('parameters', strategy.get('params', {}) if isinstance(strategy, dict) else {}),
                              ('replicate', raw.get('repeat', raw.get('replicate', 0))),
                              ('max_tokens', raw.get('max_new_tokens', raw.get('max_tokens', raw['sampling'].get('max_tokens'))))]:
            self.equal(row.get(key), expected, f'{label}: imported {key} not preserved')
        self.equal(raw['prompt_sha256'], digest(raw['prompt']), f'{label}: raw prompt hash is invalid')
        if 'text_sha256' in raw:
            self.equal(raw['text_sha256'], digest(raw['text']), f'{label}: raw text hash is invalid')
        meta = raw['models']
        branches = meta.get('models', meta) if isinstance(meta, dict) else meta
        roles = {key: val.get('model_id', val) if isinstance(val, dict) else val for key, val in branches.items()} if isinstance(branches, dict) else branches
        if sid in ('base', 'instruct') and isinstance(roles, dict) and sid in roles:
            roles = {'writer': roles[sid]}
        if sid == 'proxy' and raw.get('reference_model') and isinstance(roles, dict):
            reference = raw['reference_model']
            roles = {'writer': roles.get('base'), 'correction_instruct': roles.get('instruct'),
                     'correction_base': reference.get('model_id', reference) if isinstance(reference, dict) else reference}
        self.equal(row['models'], roles, f'{label}: imported model roles misidentify the writer/correction')
        self.equal(row['group'], 'kit', f'{label}: imported record placed in archived cohort')
        self.check('actual kit run' in row['evidence'], f'{label}: actual-run evidence label missing')

    def command(self, entry, registered):
        tokens = shlex.split(entry['run_entry'])
        label = f'strategy {entry["id"]} run entry'
        self.check(len(tokens) >= 3 and tokens[1:3] == ['-m', 'strategies.run'], f'{label}: not the documented runner')
        self.check(not any(t in tokens for t in (';', '&&', '|')), f'{label}: unexpected shell composition')
        def value(flag):
            return tokens[tokens.index(flag) + 1] if flag in tokens and tokens.index(flag) + 1 < len(tokens) else None
        selected, config_name = value('--strategy'), value('--config')
        self.equal(selected, entry['id'], f'{label}: selects another strategy')
        self.check(selected in registered, f'{label}: unknown registered ID')
        self.check(bool(config_name), f'{label}: missing config')
        if config_name:
            path = self.path(config_name)
            self.check(path.is_file(), f'{label}: missing config file {path}')
            if path.is_file():
                config = self.json(path)
                prompt_path = self.path(config.get('prompt_file', 'strategies/original_prompts.json'))
                self.check(prompt_path.is_file(), f'{label}: configured original prompt file missing')
                if selected == 'proxy':
                    self.check(bool(config.get('models', {}).get('reference_model')), f'{label}: proxy config lacks its third model')
        self.check(bool(value('--output')), f'{label}: missing output path')


def validate(manifest_path, html_path):
    audit = Audit()
    stats = {}
    try:
        pack = audit.json(manifest_path)
        records, prompts, strategies = pack['records'], pack['prompts'], pack['strategies']
        registry_path = audit.source(pack['registry'], 'strategy registry')
        registry = audit.json(registry_path)['strategies']
        registered = {s.get('id', s.get('name')) for s in registry}
        audit.equal(len(registered), len(registry), 'registry has duplicate strategy IDs')
        audit.check(len(registered) >= 27, 'registry unexpectedly omits original strategy families')
        audit.equal({s['id'] for s in strategies}, registered, 'coverage IDs differ from current strategy registry; rebuild after registry edits')
        audit.equal(len(strategies), len(registered), 'duplicate/missing strategy coverage cards')
        originals = {p['id']: p for p in prompts}
        audit.equal(len(originals), len(prompts), 'duplicate prompt IDs')
        for prompt in prompts:
            audit.original(prompt)
        audit.check(set(ORIGINAL_HASHES) <= set(originals), 'one or more archived original prompts are missing')
        audit.equal(set(originals), {r['pid'] for r in records}, 'prompt catalog and used prompt IDs differ')
        audit.equal(len({r['id'] for r in records}), len(records), 'duplicate record IDs')
        audit.equal(pack['record_count'], len(records), 'record_count mismatch')
        audit.equal(pack['counts'], dict(Counter(r['group'] for r in records)), 'cohort counts mismatch')
        expected_sources = {}
        for group, (directory, _, count) in ARCHIVES.items():
            paths = set((MIX / directory).glob('*.json'))
            audit.equal(len(paths), count, f'{group}: archived source inventory changed')
            expected_sources[group] = {str(p.resolve()) for p in paths}
        archived_sources = {group: [] for group in ARCHIVES}
        imported_lines = {}
        for row in records:
            context = row['id']
            try:
                source = audit.source(row['source'], context)
                if row['actual_kit_run']:
                    lines = audit.read(source).decode('utf-8').splitlines()
                    number = row['source']['line']
                    audit.check(isinstance(number, int) and 1 <= number <= len(lines), f'{context}: invalid JSONL source line')
                    raw = json.loads(lines[number - 1])
                    imported_lines.setdefault(source, []).append(number)
                    audit.imported(row, raw, registered)
                else:
                    raw = audit.json(source)
                    group = row['group']
                    archived_sources[group].append(str(source))
                    source_manifest = audit.source(row['source_manifest'], context + ' manifest')
                    audit.equal(source_manifest, (MIX / ARCHIVES[group][1]).resolve(), f'{context}: wrong source manifest')
                    audit.archived(row, raw, audit.json(source_manifest), group)
                audit.common_record(row, raw, originals)
            except (KeyError, ValueError, TypeError, OSError, IndexError) as exc:
                audit.check(False, f'{context}: cannot validate record: {type(exc).__name__}: {exc}')
        for group, seen in archived_sources.items():
            audit.equal(set(seen), expected_sources[group], f'{group}: missing, extra, or substituted archived source files')
            audit.equal(len(seen), ARCHIVES[group][2], f'{group}: archived output count differs')
        for source, selected in imported_lines.items():
            eligible = []
            for line, value in enumerate(audit.read(source).decode('utf-8').splitlines(), 1):
                if not value.strip():
                    continue
                raw = json.loads(value)
                audit.check(raw.get('synthetic') is False and 'toy' not in str(raw.get('backend', '')).lower(), f'{source}:{line}: input file contains synthetic/toy or unmarked records')
                if raw.get('status') == 'complete' and raw.get('complete') is not False:
                    eligible.append(line)
            audit.equal(sorted(selected), eligible, f'{source}: successful imported rows were omitted or duplicated')
        for entry in strategies:
            sid = entry['id']
            matching = [r for r in records if r['strategy_id'] == sid]
            actual = sum(r['actual_kit_run'] is True for r in matching)
            archived = len(matching) - actual
            audit.equal(entry['actual_kit_count'], actual, f'{sid}: actual-kit coverage count mismatch')
            audit.equal(entry['archived_count'], archived, f'{sid}: archived coverage count mismatch')
            audit.equal(Counter(entry['record_ids']), Counter(r['id'] for r in matching), f'{sid}: coverage record mapping mismatch')
            expected = 'actual kit continuation available' if actual else 'archived baseline/approximation only; awaiting pod for kit run' if archived else 'awaiting pod; no actual continuation'
            audit.equal(entry['status'], expected, f'{sid}: missing/misleading availability status')
            audit.command(entry, registered)
        audit.check({r['strategy_id'] for r in records} <= registered, 'records reference unknown strategy IDs')
        page_text = audit.read(html_path).decode('utf-8')
        page = Page(); page.feed(page_text)
        audit.equal(len(page.payloads), 1, 'HTML must embed exactly one pack-data payload')
        if len(page.payloads) == 1:
            audit.equal(json.loads(page.payloads[0]), pack, 'embedded HTML data differs from manifest')
            audit.check('<' not in page.payloads[0], 'HTML JSON payload contains unescaped markup')
        audit.check(not page.script_sources, 'offline HTML loads external scripts')
        for link in page.links:
            audit.local_link(link, 'HTML')
        audit.check('text.textContent=' in page_text and "pre.textContent=JSON.stringify" in page_text, 'viewer literal-text rendering guard missing')
        markdown = audit.read(PACK / 'strategy_samples.md').decode('utf-8')
        bodies = re.findall(r'<pre>(.*?)</pre>', markdown, flags=re.S)
        # A code child protects an initial newline from HTML's pre newline rule.
        # Strip only the real wrapper, before unescaping literal generated tags.
        pre_blocks = Counter(html.unescape(t[6:-7] if t.startswith('<code>') and t.endswith('</code>') else t) for t in bodies)
        expected_pre = Counter([p['prompt'] for p in prompts] + [r['text'] for r in records])
        audit.equal(pre_blocks, expected_pre, 'Markdown prompt/continuation blocks are omitted, changed, or duplicated')
        for entry in strategies:
            audit.check(f'### {entry["id"]}\n' in markdown, f'{entry["id"]}: Markdown strategy coverage missing')
        for link in re.findall(r'\[Raw source\]\(([^)]+)\)', markdown):
            audit.local_link(link, 'Markdown raw-source link')
        for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)', audit.read(PACK / 'README.md').decode('utf-8')):
            audit.local_link(link, 'README')
        audit.equal(pack['claims']['archived_full_vocabulary_sibling_mix'], False, 'incorrect full-vocabulary archived-mix claim')
        audit.equal(pack['claims']['taste_ranking'], False, 'pack claims uncollected taste ranking')
        stats = {'records': len(records), 'archived_records': sum(not r['actual_kit_run'] for r in records),
                 'actual_kit_records': sum(r['actual_kit_run'] for r in records), 'strategies': len(strategies),
                 'original_prompts': len(prompts), 'cohorts': pack['counts'],
                 'archived_finish_reasons': dict(Counter(r['finish_reason'] for r in records if not r['actual_kit_run'])),
                 'source_files_checked': len(audit.source_paths)}
    except (KeyError, ValueError, TypeError, OSError, IndexError) as exc:
        audit.check(False, f'Cannot finish validation: {type(exc).__name__}: {exc}')
    return {'status': 'pass' if not audit.errors else 'fail', 'validated_at': datetime.now(timezone.utc).isoformat(),
            'independent_of_builder': True, 'checks': audit.checks, **stats, 'errors': audit.errors,
            'scope': 'Exact raw strings, original sources and hashes, bytes/tokens/stops, model-role/sampler provenance, complete archive inventory, imported real-run eligibility, registry coverage/run entries, HTML payload, Markdown text, and local links. No model inference or taste assessment.',
            'manifest_sha256': digest(Path(manifest_path).read_bytes()) if Path(manifest_path).exists() else None,
            'html_sha256': digest(Path(html_path).read_bytes()) if Path(html_path).exists() else None}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', type=Path, default=PACK / 'manifest.json')
    parser.add_argument('--html', type=Path, default=PACK / 'index.html')
    parser.add_argument('--output', type=Path, default=PACK / 'validation.json')
    args = parser.parse_args(argv)
    result = validate(args.manifest, args.html)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result['status'] == 'pass' else 1


if __name__ == '__main__':
    sys.exit(main())
