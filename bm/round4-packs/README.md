# Labeled strategy sample pack

Open [index.html](index.html) for side-by-side reading. [strategy_samples.md](strategy_samples.md) contains the same full continuations in expandable sections. [manifest.json](manifest.json) preserves the exact strings and provenance.

The pack includes all 75 complete archived mixing records: 27 direct 9B samples, 18 native 35B endpoint samples, 15 myth proxy samples and 15 Figgs proxy samples. This is a metadata selection, with no quality scores or cherry-picking. Initial panels show native Base and the smallest positive correction. Every strategy in the kit catalog has a visible coverage card. Missing runs say **awaiting pod; no actual continuation**.

The 9B mixes use a union of two top-20 candidate lists. The proxy uses a 35B Base writer and a 9B Instruct-minus-Base correction on a union of three top-20 lists. Every union candidate was scored by every relevant model, but these are still sparse approximations, not full vocabulary results. Native endpoints and sparse support controls are different distributions. The native 35B Instruct comparison also has an uncontrolled provider-format difference. The archived routing rules are labeled Nudging-inspired and BACo-P-inspired. No unrun strategy inherits these texts by algebraic analogy.

Prompts are checked directly against Josh's original archive and the original myth catalog. Full prompt/output strings, special-token spellings, token IDs where saved, bytes, sampler, model roles, caps, finish reasons, source-file hashes and string hashes are retained. The JSON-string display makes invisible whitespace inspectable. The prose display has no truncation. All 74 length stops reached their recorded cap; the one 24-token EOS continuation remains in the pack. The six prompt strings cover two related lineages, not six independent tasks.

Rebuild from the repository root; these commands make no inference or network calls:

```bash
python3 packs/build.py --registry strategies/catalog.json
python3 packs/validate.py
python3 -m unittest discover -s packs -p test_build.py -v
```

After saving real kit outputs, append one or more JSONL files:

```bash
python3 packs/build.py --registry strategies/catalog.json --runs runs/geometric.jsonl
python3 packs/validate.py
```

Each imported row must include `strategy` (`id`, plus catalog `name` for parameter variants, and optional `params`), `prompt_id`, exact `prompt`, `prompt_sha256`, `text`, `sampling`, `models`, `finish_reason`, `seed`, `status: "complete"`, and `synthetic: false`. `token_ids`, `max_new_tokens`/`max_tokens`, `repeat`/`replicate`, job/run IDs, reference-model metadata, `support`, `diagnostics`, `format`, `backend`, and `text_sha256` are preserved when supplied. The importer rejects unknown strategy names, modified prompt strings, hash mismatches, duplicate IDs, and synthetic/toy records. Failed records are not presented as continuations. A new run's own backend and support labels remain visible; importing it does not establish equivalence to another backend. Literal Unicode line/paragraph separators inside prose do not split JSONL records.

`validate.py` is deliberately independent of the builder: it reopens each raw source and original prompt source, recomputes hashes and lengths, checks coverage/counts, and compares the embedded HTML payload with the manifest. [source_audit.md](source_audit.md) provides an independent audit of the archived records and their scientific limitations. Round 2 source files are never changed by this build.

No generated prose is invented to fill missing coverage. No sparse trace is presented as a full logit vector. No model calls, renting, or publishing occur in this folder.
