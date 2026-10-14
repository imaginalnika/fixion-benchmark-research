# Independent audit of the archived sample sources

Audited on 2026-10-14 from source JSON, manifests, runners, and selected trace fields. This audit made no model calls and changed no Round2 artifacts. It checks source identity and comparison labels; it does not score writing quality or establish which strategy Josh prefers.

## Complete inventory

All 75 archived output records have `complete: true`. Every stored raw prompt exactly matches its original source string, including trailing whitespace. Selection can include the entire inventory without quality-based filtering.

| Cohort and source directory | Outputs | Original prompts | Conditions and repeats | Emitted tokens / finish |
|---|---:|---|---|---|
| Direct 9B sibling experiment, `experiments/round2/mixing/outputs/` | 27 | P07, P09, P10 | Nine arms × three prompts × one repeat | 21 primary outputs at 192; six support controls at 64; all `length` |
| Native 35B endpoints, `experiments/round2/mixing/native35b/` | 18 | P07, P09, P10 | Two endpoints × three prompts × three repeats | All 300 / `length` |
| 35B writer + 9B proxy, `experiments/round2/mixing/proxy35b/outputs/` | 15 | P07, P09, P10 | Five arms × three prompts × one repeat | All 96 / `length` |
| 35B writer + 9B proxy, `experiments/round2/mixing/proxy35b_josh/outputs/` | 15 | JP041, JP044, JP045 | Five arms × three prompts × one repeat | Fourteen 96 / `length`; `proxy_m025-JP045-00` has 24 / `eos`, final token 248044 |

The 74 `length` outcomes are cap-truncated passages, even though the generation jobs completed successfully. The 24-token output must remain visible; removing it would discard an actual outcome. None of these samples is a new full-vocabulary run of the 35B Base/Instruct strategy kit.

## Labels that the viewer must preserve

### Direct 9B sibling experiment

The models are `Qwen/Qwen3.5-9B-Base` and `Qwen/Qwen3.5-9B`, with shared generated history and compatible token IDs. All arms use temperature 1 and top-p 1.

| Raw arm | Accurate label / operation |
|---|---|
| `base_native` | 9B Base native service sampling; top-k disabled; 192-token cap |
| `instruct_native` | 9B Instruct native service sampling; top-k disabled; 192-token cap |
| `mix_m025`, `mix_p015`, `mix_p050` | Sparse geometric score `(1-alpha) log p_base + alpha log p_instruct`, alpha −0.25 / 0.15 / 0.50; 192-token cap |
| `mix_zero_support`, `mix_one_support` | Same sparse-support construction, alpha 0 / 1; 64-token cap |
| `nudging_g04` | One-token Nudging-inspired gate: sample Instruct when `max p_base < 0.4`, otherwise Base; 192-token cap |
| `baco_g04` | Basic BACo-P-inspired confidence direction: sample Base when `max p_base < 0.4`, otherwise Instruct; 192-token cap |

The geometric arms normalize on the union of the two models' top-20 candidate lists. Every retained candidate was explicitly scored under both models. The candidate scores are sparse log probabilities, **not full logit vectors**. There is no ratio clipping. Native endpoint samples and the branch samples taken by the routers are untruncated service samples, so native endpoints are not support-matched controls for the geometric arms. The shorter sparse controls help diagnose this effect, but unequal caps remain visible and comparisons at equal length require a 64-token horizon.

In the recorded routing traces, the Nudging-inspired arm selected Instruct for 360/576 tokens (62.5%); BACo-P-inspired selected it for 192/576 (33.33%). Neither fraction follows automatically from the threshold, and the first method is not a replication of the paper's multi-token algorithm. Across the support controls, retained Base probability mass reaches as low as 0.1768806047. Sparse support can therefore materially alter behavior even at alpha 0.

### 35B writer with a 9B proxy pair

The writing distribution is `Qwen/Qwen3.5-35B-A3B-Base`; the correction is `log p_Qwen3.5-9B - log p_Qwen3.5-9B-Base`. Both proxy cohorts use temperature 1, top-p 1, and a 96-token cap. The fixed sampler intentionally differs from the Figgs archive's historical 0.85 / 0.95 settings.

| Raw arm | Accurate label / operation |
|---|---|
| `native35b` | 35B Base native sampling; no proxy correction and top-k disabled |
| `proxy_zero_support` | 35B Base scores restricted to the three-model top-20 union; beta 0 |
| `proxy_m025`, `proxy_p015`, `proxy_p050` | Sparse proxy tuning: `log p_35BBase + beta (log p_9BInstruct - log p_9BBase)`, beta −0.25 / 0.15 / 0.50 |

All three branches score every retained candidate in the union of their top-20 lists. These are actual 35B Base writer outputs, but **not exact 35B sibling mixtures**; beta 1 would not mean 35B Instruct. The native row's stored `models` array lists all three cohort models even though its actual generator uses only the 35B Base branch. Display roles from the arm and runner, rather than implying the native output used a correction.

The native arm uses service stopping defaults; proxy arms stop on either 248044 or 248046. The sparse-support baseline is the relevant support control. Replicate 0 is the only repeat in each prompt/arm cell, so the pack provides examples rather than a replicated preference comparison.

### Native 35B endpoint comparison

Base: Tinker `Qwen/Qwen3.5-35B-A3B-Base`. Instruct: OpenRouter `qwen/qwen3.5-35b-a3b`, provider Darkbloom. Requests use temperature 1, top-p 1, top-k disabled (Tinker −1; OpenRouter 0), and a 300-token cap. The Instruct request sets `reasoning.enabled=false`, requires parameters, and disables provider fallback.

The submitted prompt strings match exactly. The internal conditional contexts are **not controlled**: all nine OpenRouter records report 31 prompt tokens versus the 19 tokens in the local encoding/Tinker input. The 12-token excess is consistent with undisclosed formatting, but its exact contents are unknown. No requested token log probabilities were returned by the tested Instruct endpoint. Label this a cross-provider endpoint comparison; it cannot isolate post-training or stand in for a new two-logit strategy result.

## Original prompt provenance

Myth prompts are verified directly against `/workspace/ds4-research/compare/prompts.json`, SHA-256 `c28f8033f71a2e6546a8af48849192317db06add7b093abba200281a9ca1f104`. Figgs prompts are verified directly against `josh_prompts/1208272250781048886.json`, SHA-256 `d3c71b57348f4cf13f52da1164b3f4b9a46d20902ce070c3e697f5f6918bae1c`.

| Prompt | UTF-8 bytes | Direct original location | SHA-256 of exact UTF-8 prompt |
|---|---:|---|---|
| P07 | 79 | Original prompt list, ID P07 | `96036443380446f44def061baaef1fd58b49b55e7473169cba912f886d8085d3` |
| P09 | 79 | Original prompt list, ID P09 | `f982d5a02d36e0d41c27d12808f3acaaacc5adcf065c4e0158c53d39efb8eecc` |
| P10 | 80 | Original prompt list, ID P10 | `bd6c7e29c0397032a2c4aa919301c74f73c195597bfa513d8880b91279dd2290` |
| JP041 | 802 | `sessions[0].data.runs[4].prompt` | `bc2d5a6384640ede592bd82649c61b130af3c6f70e307e3f080b382ca4791d23` |
| JP044 | 902 | `sessions[0].data.runs[1].prompt` | `d5f719905a598c57e48bcf8e6963fc8e0cd1f3badc9d48b041a988a9a2467fda` |
| JP045 | 1122 | `sessions[0].data.prompt` | `8d755ab5e73c50bf76a65cb6ccab596c5488ed1535edcb71ef38fea748915abc` |

JP041 ends with a space after `##`; JP045 ends with two newlines. Do not trim either. The Figgs cohort selects existing document stages: earliest full quest-header context, the “Figgs asks” stage, and the current full prompt. The original archive has no standalone Figgs persona-only or quest-only prompt; none should be synthesized for this pack.

## Builder checks recommended

- Include all 75 records, grouped by exact prompt and clearly separated into the four cohorts; label all strategies and preserve all repeats.
- Preserve the raw continuation and raw prompt strings as text, with exact UTF-8 hashes, byte lengths, source paths, cap, and finish reason. HTML must escape or insert as text because Figgs strings contain `<cmd>` and `<output>`.
- Keep sparse scores distinct from full-vocabulary logits. Any offline sparse preview is a distribution diagnostic, not an actual continuation from the proposed strategy.
- Give every new registry strategy a visible coverage entry. If it has no actual continuation, say “awaiting pod; no actual continuation” and provide its exact run command. Related archived examples may be linked as explicitly labeled approximations, never substituted as exact results.
- Shared numeric seeds are not paired token-level random draws across native whole-sequence sampling, API routing, and local sparse sampling.
- Do not infer preference, creativity, or a winning strategy from counts, completion status, support mass, or mathematical replay checks.

Audit method: enumerated the four documented source globs; counted raw arms, prompt IDs, emitted tokens, completeness, and finish reasons; compared all 75 prompt strings directly to original source locations; recomputed prompt/source hashes; inspected runner sampler/stop settings and trace routing/support fields. This document does not claim a fresh exhaustive probability replay; the existing Round2 validation artifacts cover that separate check.
