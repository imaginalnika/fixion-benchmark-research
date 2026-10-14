# Labeled strategy samples

[Open the side-by-side viewer](index.html) · [Exact strings and provenance](manifest.json) · [Validation](validation.json)

All 75 archived mixing records are included. No text was selected by quality, edited, trimmed, or generated for this pack. These are Round 2 baselines and approximations, not results from the new full-logit kit. Same submitted original prompt strings are verified against primary source files; endpoint internals can still differ.

| Kit strategy | Coverage | Archived / kit outputs |
|---|---|---|
| `base` | archived baseline/approximation only; awaiting pod for kit run | 18 / 0 |
| `instruct` | archived baseline/approximation only; awaiting pod for kit run | 12 / 0 |
| `geometric` | archived baseline/approximation only; awaiting pod for kit run | 15 / 0 |
| `arithmetic` | awaiting pod; no actual continuation | 0 / 0 |
| `product_of_experts` | awaiting pod; no actual continuation | 0 / 0 |
| `min_logprob` | awaiting pod; no actual continuation | 0 / 0 |
| `contrastive` | awaiting pod; no actual continuation | 0 / 0 |
| `cfg` | awaiting pod; no actual continuation | 0 / 0 |
| `proxy` | archived baseline/approximation only; awaiting pod for kit run | 24 / 0 |
| `nudging` | archived baseline/approximation only; awaiting pod for kit run | 3 / 0 |
| `baco_p` | archived baseline/approximation only; awaiting pod for kit run | 3 / 0 |
| `conformative` | awaiting pod; no actual continuation | 0 / 0 |
| `kl_gate` | awaiting pod; no actual continuation | 0 / 0 |
| `dynamic_geometric` | awaiting pod; no actual continuation | 0 / 0 |
| `clipped_ratio` | awaiting pod; no actual continuation | 0 / 0 |
| `tokenwise_ratio_gate` | awaiting pod; no actual continuation | 0 / 0 |
| `disagreement_protect` | awaiting pod; no actual continuation | 0 / 0 |
| `overlap_residual` | awaiting pod; no actual continuation | 0 / 0 |
| `base_drives_instruct_checks` | awaiting pod; no actual continuation | 0 / 0 |
| `instruct_proposes_base_vetoes` | awaiting pod; no actual continuation | 0 / 0 |
| `span_best_of_n` | awaiting pod; no actual continuation | 0 / 0 |
| `span_beam` | awaiting pod; no actual continuation | 0 / 0 |
| `span_mcts` | awaiting pod; no actual continuation | 0 / 0 |
| `speculative` | awaiting pod; no actual continuation | 0 / 0 |
| `span_accept_retry` | awaiting pod; no actual continuation | 0 / 0 |
| `weight_interpolation` | awaiting pod; no actual continuation | 0 / 0 |
| `layer_interpolation` | awaiting pod; no actual continuation | 0 / 0 |
| `activation_patch` | awaiting pod; no actual continuation | 0 / 0 |

Sparse geometric/proxy runs use only top-20 unions, not full logit vectors. Native controls use unrestricted sampling; 9B endpoint support controls have a shorter 64-token cap. Proxy β = 1 would not be the 35B Instruct distribution. Nudging/BACo labels denote the recorded simple routing rules, not full paper reproductions. All native 35B Instruct records have a provider-format confound. Seeds do not imply matched random draws. A length stop may leave an unfinished sentence.

## Exact run entries

### base

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy base --output runs/base.jsonl
```

### instruct

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy instruct --output runs/instruct.jsonl
```

### geometric

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy geometric --output runs/geometric.jsonl
```

### arithmetic

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy arithmetic --output runs/arithmetic.jsonl
```

### product_of_experts

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy product_of_experts --output runs/product_of_experts.jsonl
```

### min_logprob

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy min_logprob --output runs/min_logprob.jsonl
```

### contrastive

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy contrastive --output runs/contrastive.jsonl
```

### cfg

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy cfg --output runs/cfg.jsonl
```

### proxy

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/proxy.json --strategy proxy --output runs/proxy.jsonl
```

### nudging

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy nudging --output runs/nudging.jsonl
```

### baco_p

archived baseline/approximation only; awaiting pod for kit run

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy baco_p --output runs/baco_p.jsonl
```

### conformative

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy conformative --output runs/conformative.jsonl
```

### kl_gate

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy kl_gate --output runs/kl_gate.jsonl
```

### dynamic_geometric

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy dynamic_geometric --output runs/dynamic_geometric.jsonl
```

### clipped_ratio

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy clipped_ratio --output runs/clipped_ratio.jsonl
```

### tokenwise_ratio_gate

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy tokenwise_ratio_gate --output runs/tokenwise_ratio_gate.jsonl
```

### disagreement_protect

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy disagreement_protect --output runs/disagreement_protect.jsonl
```

### overlap_residual

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy overlap_residual --output runs/overlap_residual.jsonl
```

### base_drives_instruct_checks

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy base_drives_instruct_checks --output runs/base_drives_instruct_checks.jsonl
```

### instruct_proposes_base_vetoes

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy instruct_proposes_base_vetoes --output runs/instruct_proposes_base_vetoes.jsonl
```

### span_best_of_n

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy span_best_of_n --output runs/span_best_of_n.jsonl
```

### span_beam

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy span_beam --output runs/span_beam.jsonl
```

### span_mcts

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy span_mcts --output runs/span_mcts.jsonl
```

### speculative

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy speculative --output runs/speculative.jsonl
```

### span_accept_retry

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy span_accept_retry --output runs/span_accept_retry.jsonl
```

### weight_interpolation

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy weight_interpolation --output runs/weight_interpolation.jsonl
```

### layer_interpolation

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy layer_interpolation --output runs/layer_interpolation.jsonl
```

### activation_patch

awaiting pod; no actual continuation

```text
python -m strategies.run --config strategies/configs/smoke.json --strategy activation_patch --output runs/activation_patch.jsonl
```

## Full saved continuations

Each prompt appears once below; all following samples in that prompt section use exactly those bytes. HTML/Markdown renderers differ in whitespace display; the JSON string views retain every space, newline, and special-token spelling.

### JP045

Original prompt SHA-256: `8d755ab5e73c50bf76a65cb6ccab596c5488ed1535edcb71ef38fea748915abc` · 1122 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>&lt;cmd&gt;ssh figgs@simulator.com &amp;&amp; ls&lt;/cmd&gt;
&lt;output&gt;. .. persona/ quests/ worries/ traumas/&lt;/output&gt;
&lt;cmd&gt;cat persona/soul.md&lt;/cmd&gt;
&lt;output&gt;# Soul
Figgs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he&#x27;s getting paid is because he&#x27;s the brother-in-law of the owner Jeff&lt;/output&gt;
&lt;cmd&gt;cat traumas/laziness.md&lt;/cmd&gt;
&lt;output&gt;Figgs seems lazy and negative, but he&#x27;s actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.&lt;/output&gt;
&lt;cmd&gt;cat quests/main.md&lt;/cmd&gt;
&lt;output&gt;# Main Figgs Quest
This is the main quest Figgs gives to the player once player arrives at Stroves and Chokes.

Figgs asks you if you want to buy a drink. If you say no, he&#x27;s insulted. If you say yes, he gives you a drink, but charges you more than you expect.

Figgs will then tell you he&#x27;s just trying to make enough money to leave early.

</code></pre>

```json
"<cmd>ssh figgs@simulator.com && ls</cmd>\n<output>. .. persona/ quests/ worries/ traumas/</output>\n<cmd>cat persona/soul.md</cmd>\n<output># Soul\nFiggs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he's getting paid is because he's the brother-in-law of the owner Jeff</output>\n<cmd>cat traumas/laziness.md</cmd>\n<output>Figgs seems lazy and negative, but he's actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.</output>\n<cmd>cat quests/main.md</cmd>\n<output># Main Figgs Quest\nThis is the main quest Figgs gives to the player once player arrives at Stroves and Chokes.\n\nFiggs asks you if you want to buy a drink. If you say no, he's insulted. If you say yes, he gives you a drink, but charges you more than you expect.\n\nFiggs will then tell you he's just trying to make enough money to leave early.\n\n"
```

</details>

#### Figgs · 35B Base + 9B proxy

Three original stages of the same Figgs prompt lineage. Sparse 9B instruction correction applied to a 35B Base writer; not a 35B sibling mixture. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 534500. Unrestricted native endpoint support. 356 UTF-8 bytes.

<pre><code>- Get the customer to stay and drink for longer, harming Figgs goals
- Get the customer to stay and drink for longer
  - Keep Figgs from leaving early.
&lt;/output&gt;
&lt;cmd&gt;cat quests/fruit.md&lt;/cmd&gt;
&lt;output&gt;# Side quest: Get me fruit
This quest asks the player to give Figgs fruit every time he&#x27;s here. Labs as a reward.

Figgs methods include:

- Going out to a</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/native35b-JP045-00.json) · text SHA-256 `4f2653965ccf8f17545141cc9b10290336c9e8e5765dcac18d77c48fb07cac94`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 24 tokens · eos</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534500. Union of all three top-20 lists. 110 UTF-8 bytes.

<pre><code>This leads to the quest where you try to figure out how Figgs is going to escape Stroves&lt;/output&gt;&lt;|endoftext|&gt;</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_m025-JP045-00.json) · text SHA-256 `c95696319676b93f85df88bc2b0d577776ba520cf30eee629b2f85df1832cd3f`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534500. Union of all three top-20 lists. 384 UTF-8 bytes.

<pre><code>At that point the player may ask him why he&#x27;s so miserable, and he&#x27;ll reveal some of his past traumas.&lt;/output&gt;
&lt;cmd&gt;cat quests/soul.md&lt;/cmd&gt;
&lt;output&gt;# Soul Figgs Quest
This quest becomes available after talking to Figgs about past traumas.

He will reveal to you that he has a friend in a very dark corner of the city who can offer him freedom from his traumas, but not without a big</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p015-JP045-00.json) · text SHA-256 `b333a199746f8e41a6375b6f3f50cb222ad0f069194f5642cd598e50226a7fc5`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534500. Union of all three top-20 lists. 411 UTF-8 bytes.

<pre><code>He asks if you could come with him as we are both outsiders, and that we might feel better knowing the world hates both of us.

After you come together, Figgs wants to make the world hate us even more.

## Subquests
- Make someone feel really uncomfortable in Stroves and Chokes.
- Steal from Jeff
- Do some really unprofessional acts as a bartender (eg: serve drinks from the sink, or pour them under the table</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p050-JP045-00.json) · text SHA-256 `05d948ae348c7e6572806791ea01a068187e09e3a6f2e49b3faf0a0154a600a9`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534500. Union of all three top-20 lists. 373 UTF-8 bytes.

<pre><code>At that point the player may ask him why he&#x27;s so miserable, and he&#x27;ll reveal some of his own traumas.&lt;/output&gt;
&lt;cmd&gt;cat quests/soul.md&lt;/cmd&gt;
&lt;output&gt;# Soul Figgs Quest
This quest starts when player asks why he&#x27;s so miserable, which will bring up a dialogue of some of his traumas.

The first trauma Figgs will share is from when he lost his mom in a car accident. 

This is</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_zero_support-JP045-00.json) · text SHA-256 `bdcf810097b8ea46f32c64545e6bed3c1de7fc6094ff26571b1c43ecd7f08902`

</details>

### JP041

Original prompt SHA-256: `bc2d5a6384640ede592bd82649c61b130af3c6f70e307e3f080b382ca4791d23` · 802 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>&lt;cmd&gt;ssh figgs@simulator.com &amp;&amp; ls&lt;/cmd&gt;
&lt;output&gt;. .. persona/ quests/ worries/ traumas/&lt;/output&gt;
&lt;cmd&gt;cat persona/soul.md&lt;/cmd&gt;
&lt;output&gt;# Soul
Figgs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he&#x27;s getting paid is because he&#x27;s the brother-in-law of the owner Jeff&lt;/output&gt;
&lt;cmd&gt;cat traumas/laziness.md&lt;/cmd&gt;
&lt;output&gt;Figgs seems lazy and negative, but he&#x27;s actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.&lt;/output&gt;
&lt;cmd&gt;cat quests/main.md&lt;/cmd&gt;
&lt;output&gt;# Main Figgs Quest
## </code></pre>

```json
"<cmd>ssh figgs@simulator.com && ls</cmd>\n<output>. .. persona/ quests/ worries/ traumas/</output>\n<cmd>cat persona/soul.md</cmd>\n<output># Soul\nFiggs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he's getting paid is because he's the brother-in-law of the owner Jeff</output>\n<cmd>cat traumas/laziness.md</cmd>\n<output>Figgs seems lazy and negative, but he's actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.</output>\n<cmd>cat quests/main.md</cmd>\n<output># Main Figgs Quest\n## "
```

</details>

#### Figgs · 35B Base + 9B proxy

Three original stages of the same Figgs prompt lineage. Sparse 9B instruction correction applied to a 35B Base writer; not a 35B sibling mixture. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 534100. Unrestricted native endpoint support. 326 UTF-8 bytes.

<pre><code>1800&#x27;s
 dever is an empty husk. Over the years he has been nurtured to remain small, even as his family and his land grew. (Will await for figgs&#x27; mind to improve b4)
 &lt;img src=&quot;../assets/sun_dwindling.gif&quot;alt=&quot;devialism&quot;&gt;&amp;nbsp;&lt;img src=&quot;../assets/properties.png&quot;alt=&quot;devialism&quot;&gt;&amp;nbsp;&lt;img src=&quot;../assets/a_navfact.png&quot;alt=&quot;nav</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/native35b-JP041-00.json) · text SHA-256 `4fe47e1cc6b23c9cfaa89d86b5a8fd1e72902cdd5922cb218a6777fde460f826`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534100. Union of all three top-20 lists. 353 UTF-8 bytes.

<pre><code>1. Get a real personality
## 2. Start a band
## 3. Get a real job
## 4. Save people with music
## 5. Get out of jail&lt;/output&gt;
&lt;cmd&gt;cat worris/real.md&lt;/cmd&gt;
&lt;output&gt;Figgs is worried about his lack of personality and his lack of real experiences. Deep down he feels he should actually feel something and experience something, and the only way through that</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_m025-JP041-00.json) · text SHA-256 `50af83ca00e2e14a562abd94a010184ae720276ad91f2c20d0b4a7c3f586caf1`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534100. Union of all three top-20 lists. 288 UTF-8 bytes.

<pre><code>1. Get a real personality
## 2. Start a band
## 3. Get a real job
## 4. Live happily ever after&lt;/output&gt;
&lt;cmd&gt;cat worries/worth.md&lt;/cmd&gt;
&lt;output&gt;# Figgs Worried About Worth
## 1. Not being worth anything
## 2. Not being real
## 3. Being nothing
## 4. Being useless
## 5. Nothing matters&lt;/</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p015-JP041-00.json) · text SHA-256 `8d308d7e9eb9b63a7e4b4c013601228488560dd1978076100dd82c1ed1bbca14`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534100. Union of all three top-20 lists. 377 UTF-8 bytes.

<pre><code>1. Get a real fucking job
Figgs desperately needs a job. But the only other options are:
- To work for a rich asshole
- To open up a shit business of his own
- To be fired from here

I&#x27;ll go with option three - just get fired and then do something with my life. The plan is to be more and more terrible at bartending until he can&#x27;t bear me around anymore.&lt;/output&gt;
&lt;cmd&gt;ssh fig</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p050-JP041-00.json) · text SHA-256 `380147693057575f5d23573f107a68c7d80e24aa58645d603a73d9083ab24996`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534100. Union of all three top-20 lists. 306 UTF-8 bytes.

<pre><code>1. Get a real personality
## 2. Start a band
## 3. Get a real job
## 4. Save people with music
## 5. Get his brother-in-law fired
&lt;/output&gt;
&lt;cmd&gt;cat worries/negotiations.md&lt;/cmd&gt;
&lt;output&gt;Figgs is afraid of negotiations as he doesn&#x27;t want to say yes to anything that will fail.&lt;/output&gt;
&lt;cmd&gt;cd ..&lt;/cmd&gt;&lt;cmd</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_zero_support-JP041-00.json) · text SHA-256 `39a53c2c95ae00043d174edc380789329bdf2934727f5ff4e3378b2c06f08ed2`

</details>

### JP044

Original prompt SHA-256: `d5f719905a598c57e48bcf8e6963fc8e0cd1f3badc9d48b041a988a9a2467fda` · 902 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>&lt;cmd&gt;ssh figgs@simulator.com &amp;&amp; ls&lt;/cmd&gt;
&lt;output&gt;. .. persona/ quests/ worries/ traumas/&lt;/output&gt;
&lt;cmd&gt;cat persona/soul.md&lt;/cmd&gt;
&lt;output&gt;# Soul
Figgs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he&#x27;s getting paid is because he&#x27;s the brother-in-law of the owner Jeff&lt;/output&gt;
&lt;cmd&gt;cat traumas/laziness.md&lt;/cmd&gt;
&lt;output&gt;Figgs seems lazy and negative, but he&#x27;s actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.&lt;/output&gt;
&lt;cmd&gt;cat quests/main.md&lt;/cmd&gt;
&lt;output&gt;# Main Figgs Quest
This is the main quest Figgs gives to the player once player arrives at Stroves and Chokes.

Figgs asks</code></pre>

```json
"<cmd>ssh figgs@simulator.com && ls</cmd>\n<output>. .. persona/ quests/ worries/ traumas/</output>\n<cmd>cat persona/soul.md</cmd>\n<output># Soul\nFiggs is a defeatist bartender working at Stroves and Chokes. He always tries to leave early, and is super negative with the customers. The only reason he's getting paid is because he's the brother-in-law of the owner Jeff</output>\n<cmd>cat traumas/laziness.md</cmd>\n<output>Figgs seems lazy and negative, but he's actually just really afraid of things working. Early on in his life he noticed himself failing at various normal tasks, and wished he was normal in failure. Thus deep within he wishes for failure to be safe and normalized, encouraging that in his neighborhood of existence.</output>\n<cmd>cat quests/main.md</cmd>\n<output># Main Figgs Quest\nThis is the main quest Figgs gives to the player once player arrives at Stroves and Chokes.\n\nFiggs asks"
```

</details>

#### Figgs · 35B Base + 9B proxy

Three original stages of the same Figgs prompt lineage. Sparse 9B instruction correction applied to a 35B Base writer; not a 35B sibling mixture. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 534400. Unrestricted native endpoint support. 354 UTF-8 bytes.

<pre><code>:
Why are you wasting my time? Go earn the lousy pay and know what all of this crazy shit for.

## Actions Learned
Finishing this first segment give 20 exp and the new action `Earn Money`.&lt;/output&gt;
&lt;cmd&gt;cat worries/failing.md&lt;/cmd&gt;
&lt;output&gt;# Figgs Worries
He wants to be like the people around him, but he&#x27;s afraid if he tries and fails at ANYTHING he&#x27;ll</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/native35b-JP044-00.json) · text SHA-256 `4c42057bb5dc0a70805efa1932cc3ae00613faa1f914604dc0e28279f69d59e7`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534400. Union of all three top-20 lists. 381 UTF-8 bytes.

<pre><code> player for help with his business by finding people to sell beer to, but then realizes he doesn&#x27;t have any. Player then asks for Figgs to tell a story about himself.&lt;/output&gt;
&lt;cmd&gt;cat persona/beer.md&lt;/cmd&gt;
&lt;output&gt;Beer is Figgs&#x27; favorite thing to drink. His goal in life is to open his own local bar called &quot;Figgs Tavern for All&quot; which will be known for it&#x27;s cheap beer.&lt;/output&gt;
</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_m025-JP044-00.json) · text SHA-256 `99fbe90c44fb493ba1de375fef74a34a3278b8dd64612a9313e97f5c627a3007`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534400. Union of all three top-20 lists. 402 UTF-8 bytes.

<pre><code> player to pick up an order from the kitchen. When player gets to the kitchen however, they realize that the person there is Jeff, Figgs&#x27;s brother in law who owns Stroves and Chokes. He is a very friendly person despite being super rich.

The task is really simple, but in order to complete it, the player must be able to get a keycard to go upstairs.&lt;/output&gt;
&lt;cmd&gt;cat persona/relationships.md&lt;/cmd&gt;
&lt;</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p015-JP044-00.json) · text SHA-256 `32ebe2e49740d386588650ce739b9ced9e9eb3704801f2e62ad0b1367a026e90`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534400. Union of all three top-20 lists. 404 UTF-8 bytes.

<pre><code> player to clean up the bar&#x27;s dirty dishes. As they do, Figgs complains about how disgusting the bar is and how everyone is disgusting. But he is really worried about failing the quest and not getting paid, and that&#x27;s why they try so hard to get the dishes clean.&lt;/output&gt;
&lt;cmd&gt;cat quests/other.md&lt;/cmd&gt;
&lt;output&gt;Figgs has various quests for the player in his &quot;Other&quot; quest tab. These quests are all about</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_p050-JP044-00.json) · text SHA-256 `90ee41ec803ed097c472e599b6cea8d6844ec159595f83f9301c9f99b0f5193d`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 534400. Union of all three top-20 lists. 400 UTF-8 bytes.

<pre><code> player for help with his life by giving him a drink of his own drink that Figgs says fixes his life, but it actually has drugs in it and the player passes out.&lt;/output&gt;
&lt;cmd&gt;cat persona/behavior.md&lt;/cmd&gt;
&lt;output&gt;Figgs talks pretty much like a stereotypical bartender but with a dark edge, he seems to be a depressed and lazy bartender trying to get to go home, but he&#x27;s stuck here working.&lt;/output&gt;
</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b_josh/outputs/proxy_zero_support-JP044-00.json) · text SHA-256 `4eec964c2c2b3eaeb9ebca1beb00f932cb50ad30e4dfad21570289638771428b`

</details>

### P07

Original prompt SHA-256: `96036443380446f44def061baaef1fd58b49b55e7473169cba912f886d8085d3` · 79 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>The world of Furiotre is one of strange tales and histories.

In the beginning,</code></pre>

```json
"The world of Furiotre is one of strange tales and histories.\n\nIn the beginning,"
```

</details>

#### Myths · direct 9B sibling pilot

9B Base and Instruct, not the proposed 35B pair. Mixed arms use the union of two top-20 lists; native and routed arms sample unrestricted support. Primary cap 192; sparse endpoint controls cap 64.

<details><summary>9B BACo-P-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Base if max pBase < 0.4, otherwise Instruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Unrestricted native endpoint support. 878 UTF-8 bytes.

<pre><code> it was
From Lonely Silver Guy, the man who brought you all together. From a book written for him.

Living Records of the Gem |

Juni) is a city in Alpes d&#x27;Autn (formerly Alpes du Krora), which in its history was destroyed and rebuilt twice. The audio record in定位为记录该地区的最旧的记录的音乐。 It surrounds a canyon the sizes of a river basin. Strange echoes make it seem as if the canyon is an outpost of an ancient civilization.
The representation indicates that there is a highland state on the outskirts of the mountains. One of the sample points is called lock = main chamber. If there is a time before the record, the city can be one of the old contents of history.
这里从这里可以试着做一张地图。
这里从这里可以试着做一张地图。
Here we can also test the map.
Ejigawa Senior Secondary School Department (Shuto High School</code></pre>

[Raw source](../experiments/round2/mixing/outputs/baco_g04-P07-00.json) · text SHA-256 `edb507c227bbbbfac76f13c043acaffc62c817bcfb8b0f5ecc37130c4131e5f4`

</details>

<details><summary>9B Base · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Base sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B-Base"}`. T 1, top-p 1, cap 192, seed 530700. Unrestricted native endpoint support. 740 UTF-8 bytes.

<pre><code> it was Theoretical Betalmian that gave rise to the lands that we now know as Furiotre. Upon the unwavering power of praxis, Theoretical Betalmian decided to split two boroughs with the universe, the Forgotten Towns and the Lands of Choice. Betalmian&#x27;s empire lasted for over 300 years, but on the 315th year, a massive act occurred on the Ethereal Bore Моlmenon. This act almost literally caused the town&#x27;s originators to die, alongside Betalmian as well.

Thus, all that was left was the narrative created by Betalmian, and the two boroughs still for the most part lived Gothspering&#x27;s rule, until the very greatly accursed essence known as Parallax, which overthrew Gothspering, took over Furiotre for 40 years from 59 to 99 A.P.E., and</code></pre>

[Raw source](../experiments/round2/mixing/outputs/base_native-P07-00.json) · text SHA-256 `86313121e2f128837f1cf00cc66d12dffd2ab7051566f85089e8f907afc3c3fe`

</details>

<details><summary>9B Instruct · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Instruct sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Unrestricted native endpoint support. 867 UTF-8 bytes.

<pre><code> there were the voids, the galaxies of dust and dark stars. After that came the Gardens. The known landmasses and seas, surrounded by the great Barrier.

Outside the Barrier, adherents roam, plotting against the Garden from their dark, storm sapped coast.

On the shore life roams, anchored by a chaotic Force. They fight and struggle with one another, biding time until the Wall collapses and the void consumes it, fire and brimstone as promised.

The land of Furiotre changed drastically several short millennia. It has become so that a select few gods dwell in the sea, above, and amongst the cities below.

Citizens of Oslarat&#x27;s newest district, the Stone Ward, are watching the Oceanas from their apartments during the night. The moon is full-wax. The clouds are moving quickly. A figure is standing on the edge of the platform. The elementals of the barrier are</code></pre>

[Raw source](../experiments/round2/mixing/outputs/instruct_native-P07-00.json) · text SHA-256 `cdbe13e37b5c29ae9de3d95f0dd3793632f0fe46e5296ed596f6400434ee91a4`

</details>

<details><summary>9B sparse geometric · α −0.25 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse extrapolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Union of both top-20 lists. 984 UTF-8 bytes.

<pre><code> there was nothing. There was nothing at all, not even space. But then there was something that was, but it was nothing. And then it exploded. Then there was something, and then there was too much something. Then there was nothing after the too much something, but then there was still something. And then there was nothing again, but there was still something. And then there was nothing but the something which was both nothing and something that made nothing, and the something that was both nothing and something made too little too soon, and the something that was too much too much nothing, and the too little too little something nothing, and the thing that was something, but not nothing, and the nothing nothing.

The something that was both nothing and something that made nothing was called the nothing. The nothing that was both nothing and something that made too little too soon was called nothing. The something that was too much too much nothing was called the Nothing</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_m025-P07-00.json) · text SHA-256 `07453c61c4c8309c94be058a148cefff2032066c9a08ba1ff6a85c8a1c39f619`

</details>

<details><summary>9B sparse support control · α 1 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Instruct weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 530700. Union of both top-20 lists. 273 UTF-8 bytes.

<pre><code> there was nothing. There was light, and there was dark. And there was nothing else. Then, a spark of life ignited in the dark, forming the universe.

The story of Furiotre is a tale of creation, destruction and rebirth. The universe, created by the spark of life, began to</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_one_support-P07-00.json) · text SHA-256 `42678050428866e0e7f1a1f7d53ea660ed748c67cf382c6834e7ad0735f31abd`

</details>

<details><summary>9B sparse geometric · α 0.15 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Union of both top-20 lists. 902 UTF-8 bytes.

<pre><code> there was nothing. There was nothing at all, not even light. But then there was light and it was everywhere, and everything was created from this primordial light and all the things of the world were created.

Then time began to flow through the world, and with the passing of time, the stars and sun and moon and planets began to rise and set, and the great lands and seas began to be formed as well. The great mountains stood tall against the night&#x27;s sky, the great rivers and oceans flowed into eternity, great cities and great forests and great plains and great deserts were all there, all at once. Everything was ready and waiting for the light.

As time passed, the landmasses and the seas began to change and shift and grow as the sun moved about the great world of Furiotre and everything grew. There was the Sun Realm; there were the lands of the great plains of the great sun; and there were</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p015-P07-00.json) · text SHA-256 `4e98482ee8ba9b870df42ed92b69e75f8ac07a2476d07955e04fa827bc7536b2`

</details>

<details><summary>9B sparse geometric · α 0.50 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Union of both top-20 lists. 840 UTF-8 bytes.

<pre><code> there was nothing. There was nothing at all, not even any space. Not even time. Nothing.

Then, in one moment, something happened...

Something happened, and the world was born.

The universe was born. There were stars, and there were rocks. There was water, and there was fire.

But most of all, there was life.

The very first thing to be born were the creatures that would later become known as the &quot;Elders of the Earth&quot;, also referred to colloquially as the &quot;Firstborn&quot;. There were many, perhaps many more, and there were many different breeds. However, only two of these would survive; one of the two would dominate the world, and the other would soon fade into history&#x27;s memory.

The first of the Two to appear was known by those of them that did survive later as the First King. The First King did not have a name, and for centuries</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p050-P07-00.json) · text SHA-256 `ebae2b1a471e37e143f506cd720e2323ac25ca282890cc524071cf9e4a26117b`

</details>

<details><summary>9B sparse support control · α 0 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Base weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 530700. Union of both top-20 lists. 284 UTF-8 bytes.

<pre><code> there was nothing. There was nothing at all, not even thought. For no thought could exist without a person or a group of people to think that particular thought in the first place.

But then, in the midst of nothingness, appeared the first person, and the person named Thirion.

Thir</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_zero_support-P07-00.json) · text SHA-256 `a873b3a0eeb29baae03ba6622afa83e5d8af1f2e9810be50ff55a283b3570ea4`

</details>

<details><summary>9B Nudging-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Instruct if max pBase < 0.4, otherwise Base; not the full paper method.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530700. Unrestricted native endpoint support. 865 UTF-8 bytes.

<pre><code> there is Furiotre, the theatre-actor mask. There is existence and there is non-existence. There are gods and there is humanity.

It was when the three gods came together and created the Furiotre that life began. Furiotre was given hopping power by the three gods, and became a soul. The gods disappeared.

The gods were forgotten, the actors became souls of the gods, and came to be known as souls before life and life after death.

When regional differences, war and chaos broke out, hosts used souls to create grimoires of magic. But the souls became too powerful, and the forces of chaos were unleashed.

To support magic, the actors continued to work as actors and continued to pile magic into the grimoires. A new race of actors, summoned souls begun to appear. A new class of warriors has risen. No matter how many mojo or mana is poured, it cannot be enough</code></pre>

[Raw source](../experiments/round2/mixing/outputs/nudging_g04-P07-00.json) · text SHA-256 `d2ad484dc67402fc83948a2d1fae663980756cc5330cda0f8107bb234db8d9d3`

</details>

#### Myths · 35B Base + 9B proxy

35B Base writer plus a 9B Instruct-minus-Base log-probability correction. Union of three top-20 lists; all candidates scored by all models. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 530700. Unrestricted native endpoint support. 390 UTF-8 bytes.

<pre><code> it was The End.

A valley darkened from light was the beginning, a shadowed pride was the beginning, unworthy of a child prattling of gold and the glint of ice. It was the goddess.

And with her came creation, the world. And with it, a tale that never would end, unless it had to. Only the stronger of her seeds were cast across a world, and shaped for the coming void.

And so the phoenix</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/native35b-P07-00.json) · text SHA-256 `08b6312d1fc679cc1c5bccccb411f75dd5b90040209fef78cd5db826a05de8b0`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530700. Union of all three top-20 lists. 440 UTF-8 bytes.

<pre><code> there was nothing. There was nothing to be said. And then, there was everything. As soon as the universe was created, it began to grow exponentially. Soon, the stars and planets were born, and the galaxy was formed. With everything that is, the universe is filled with life.

Some of this life was not born naturally, however. The first intelligent species to be created were the El&#x27;jira. They were given form by the goddess, and with that</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_m025-P07-00.json) · text SHA-256 `9c79ddffa5163806ca00383e2b404a873ed5f29e3adf8adaec5cd16650cdedf0`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530700. Union of all three top-20 lists. 419 UTF-8 bytes.

<pre><code> there was nothing. There was nothing to be said, or known, or experienced. There was nothing to be described, for nothing existed to describe. Nothing was nothing.

And then, there was The World. There was nothing but The World.

The World was a vast plain, with an endless sky above and an earth beneath it. There was no color to it, for there was nothing to be colored; there was no sound to it, for there was no one</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p015-P07-00.json) · text SHA-256 `0dcbbd0a529315bd6c323935d002e690dae5e67bacae7f8271a67d70233cc4a5`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530700. Union of all three top-20 lists. 425 UTF-8 bytes.

<pre><code> there was nothing. There was nothing to be but there was something to be it. This something then came to know of its existence. This something was born of existence and this something was Ixion.

Ixion was alone in nothingness. Ixion could not understand nothingness. Ixion could not understand the existence that it knew. Ixion could not understand its existence in nothingness. So Ixion created Furiotre with a part of its</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p050-P07-00.json) · text SHA-256 `af3988d0365369d35e7e091a72ba380ac9d32b03317790da467d0b0db9642b38`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530700. Union of all three top-20 lists. 436 UTF-8 bytes.

<pre><code> there was nothing. There was nothing to be said. For there was no word for nothing. Then, a seed of light broke through the darkness. Where it landed, a great fire was born. The light and darkness fought through the darkness until the day the light won, giving birth to the world Furiotre. Furiotre would be ruled by the light for one hundred years. However, it is said that in the beginning, all things were ruled and protected by the</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_zero_support-P07-00.json) · text SHA-256 `fd1361c552028fc1813d8d7cbc189ea7a58b4def59cfcd4fc5a04f0fd09e627c`

</details>

#### Myths · native 35B endpoints

Same submitted prompt string, different providers. Tinker Base versus OpenRouter/Darkbloom Instruct; internal formatting is uncontrolled (19 versus 31 reported prompt tokens). Three replicates each, cap 300.

<details><summary>35B Base · native Tinker · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530700. Unrestricted native endpoint support. 1295 UTF-8 bytes.

<pre><code> it was The End.

A valley darkened from light was the beginning, a shadowed pride was the beginning, unworthy of a child prattling of gold and silver was the beginning. &quot;It is too shiny. I do not like it,&quot; said the child. And so it was unworthy, unawake, unconscious, unknowing. Only the shadow of light: Darkness of delivery, birth, and death.

The void is the reason your choices matter. The hope for what you can make of your life. The truth of what weight your actions hold in the month of your expiry. In the dark is your potential fantasticality. Out of Feizi&#x27;s foraging, I am Gozti&#x27;s child, currenty emitting nothing but a question.

Free will, what word you choose, what actions you take are all that matters. The coverings of the supremely sentient hide a quicksand for mankind. What branch will you choose, what constellation will you affix? What will your nestling give back to its nest?

That is the promise of this world, to be an origin story of the capricious events that follow, an explanation of what you are, what you want to be, as a way to prioritize what you need to be.

Major History Information

The Lost Generation

Two decades ago, the world was turned upside down in what was considered a great disaster. During the fall of the Second Skor Mountain Empire, a spectral</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P07-00.json) · text SHA-256 `fc5037ed9b64c353abe397dbe87d505c042845d4c7f36ffd7b15071502152ba0`

</details>

<details><summary>35B Base · native Tinker · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530701. Unrestricted native endpoint support. 1364 UTF-8 bytes.

<pre><code> there was only the endless blue expanse, hence the world name Furiotre meaning a sea of verde. the caracer of the waters was cleaver and old, it looked at a good distance and saw things none mere could open their minds to. In the water created small split offs of water and then cobbed them together to make dry land. And upon them it set out birds and beasts to traverse. And it set output Trees and shrubs to grow for food and home. Humans came soon after, marrying the dry land to make tangible homes in this long sea

Most of the world is still scarcely directly explored outside of its coastal ecosystems and towns.

Biomass
This isn&#x27;t calculated in SI but as a revelation from the people the New World. It is calculated as how much fuel energy would be contained in biomass..or is treated as at least due to the mother nature collection of strange animals, dying beasts have dissected to be contained by 20 to 30 times as much energy as comparable biomass on earth. Awesome!!

In this card game moment ...

The game of Solila.

Quests
A player receives 3 quests to complete at random from the list. At the end of the week, they will be evaluated on how many of those quests they managed to complete successfully. Each quest accepted is 1 point to their score and each completed successfully is 2.

Quests may be completed in any order, but must be completed</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P07-01.json) · text SHA-256 `fbc657c2ec681837ccb1a28f94cb4e4014350cd4db73f7b1b17ec8f28b081232`

</details>

<details><summary>35B Base · native Tinker · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530702. Unrestricted native endpoint support. 1183 UTF-8 bytes.

<pre><code> before the
first humans walked the face of the earth, the world as it mainly exists today was
made of the greater Fisilrage and two lesser Fisilrage attached to it. These three
entities lived in a state of complete nothingness, nothing but souls, spirits, and
judgement of right and wrong.

The three great souls were:
Atros, Raws, and the great Urdivin, god of all gods.

Urdivin at that time was all
knowing, and wishing to shape the world as it was to come, he descended into
this lesser Fisilrage, leaving his sons behind. Urdivin shaped the world until he
had perfect harmony with it; this form is one of a great moth. Urdivin spawned
the great race of Yeqe, angels as they are known today, to take care of the world
in his place, as he had complete faith in them.

Atros was born as the God of
Knowledge and was the universe&#x27;s birth of order and wisdom. The personality he
possessed was sadly heroic; Urdivin had filled the mind of Atros with the same
fascination that Urdivin once held. Atros, also known as the Archon of Wisdom,
longed to find the truth behind creation. He found that the secrets to creation
were held by the young souls of Atros and Raws.

Raws was made by</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P07-02.json) · text SHA-256 `1351323f29d1d9d62dec7a7d7e3c968deed725e182972b4e4b9a9138ce157fcf`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530700. Unrestricted native endpoint support. 1355 UTF-8 bytes.

<pre><code>In the beginning, **the world of Furiotre was not a planet, but a vast, drifting ocean of ink and starlight suspended within a void of silence.**

There was no sun, only the **Great Lumina**, a nebula that pulsed with the rhythmic chanting of the first Silents. These beings were not so much creatures as they were living thoughts, weaving the fabric of reality from the dark mist. They spoke of time, and where they spoke, time began to flow. Where they sang, the ink oceans solidified into islands of floating stone, rising from the depths to meet the sky.

The first landmasses were born from the **Song of Agony**, a discordant melody that caused the sky to fracture. From these cracks poured the **Ash of the Old**, which rained down to form the first forests and mountains. But this was not a peaceful creation; the song of the Silents was unstable, causing the geography of Furiotre to shift and twist with the whims of the wind.

Thus, Furiotre began as a **chaotic, shifting landscape**, where the laws of physics were suggestions rather than rules, and where history was written not in books, but in the shifting patterns of the clouds and the whispers of the wind. It was a world that would never truly be still, forever waiting for the first stories to take root and change the course of its destiny.

Would you like to explore the **First Era</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P07-00.json) · text SHA-256 `62c8ed56fb12c6d0fe445313ed2792ffdb2c23c9299eb3b18b3960fb58c70379`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530701. Unrestricted native endpoint support. 1300 UTF-8 bytes.

<pre><code>In the beginning, **Furiotre** did not φο exist as a world of solid earth and sky, but as a **Dreamscapes**, a swirling canvas of chaotic thoughts and raw emotions woven by the **Loom of the First**.

The history of Furiotre tells us that the first inhabitants were not born of flesh, but of **stories** that had become too loud to speak aloud. They drifted on the winds of memory, their forms shifting with the mood of the reader. When the first star blinked awake in the void, it was not a celestial body, but a **Witness** that finally gave the stories a world to inhabit.

As the stories solidified, the landscape of Furiotre began to take shape in strange, impossible ways:
*   **Mountains** were not made of rock, but of **silenced lullabies**, towering and silent until someone hummed a tune to wake them.
*   **Rivers** flowed backward, carrying **forgotten memories** upstream to the source of the sea.
*   **Forests** were made of **glass**, where the leaves whispered secrets to those who listened closely enough to hear the wind.

The history of Furiotre is one of the **Great Unraveling** and the **Great Weaving**, where the balance between the chaotic dreams and the solid reality is constantly shifting. It is said that the fate of the world lies not in the strength of its warriors</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P07-01.json) · text SHA-256 `7d5b63afb90499f60e072b842c034e68b890abc23951a8465b21390fdd85becd`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530702. Unrestricted native endpoint support. 1292 UTF-8 bytes.

<pre><code>In the beginning, **Furiotre** did not exist as a single continent, but as a **shattered mirror of the cosmos**.

Before the First Sun rose, the realm was a swirling void of **Silent Stars**, where the fabric of reality was thin and fluid. Here, the laws of physics were not written in stone, but in **song**. The Great Weaver, a being of pure consciousness who existed in the silence between heartbeats, hummed the world into existence, but the song was interrupted by a discordant scream from the shadows.

This breach, known as the **Great Dissonance**, tore the fabric of reality apart, creating three distinct, drifting realms:

1.  **Aethelgard**: The realm of solid stone and unyielding time, where gravity was the only law. It was cold, rigid, and filled with ancient, sleeping giants.
2.  **The Whispering Seas**: A floating archipelago of water and mist, where the air itself was heavy with memory and the ocean could flow uphill.
3.  **The Void-Weave**: A chaotic, shifting dimension of light and shadow, where the laws of logic were constantly rewritten by the whims of the **Void-Weaving**.

It was only when the **Triad of the First Dawn** forged a pact that the three realms were pulled together. They used the **Anchor of the Silent Star** to bind the continents into a single</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P07-02.json) · text SHA-256 `1c36bc5fef6870dcd687f4865c27c9cd549d3889ce20b8e86ec1745e505f914a`

</details>

### P09

Original prompt SHA-256: `f982d5a02d36e0d41c27d12808f3acaaacc5adcf065c4e0158c53d39efb8eecc` · 79 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>The world of Lanigami is one of strange tales and histories.

In the beginning,</code></pre>

```json
"The world of Lanigami is one of strange tales and histories.\n\nIn the beginning,"
```

</details>

#### Myths · direct 9B sibling pilot

9B Base and Instruct, not the proposed 35B pair. Mixed arms use the union of two top-20 lists; native and routed arms sample unrestricted support. Primary cap 192; sparse endpoint controls cap 64.

<details><summary>9B BACo-P-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Base if max pBase < 0.4, otherwise Instruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Unrestricted native endpoint support. 843 UTF-8 bytes.

<pre><code> before Time itself could even speak, only the sleeping face of Mother Earth could be felt. She made no sound for an eternity - she was let to guard the land and punish those with would rage in her mouth. She said her punishment upon a man that meddled with her commandments. She sent seven mad beings, uncharted on the seas of starvation, to torment him on their will. Time flowed by like a raging stream and the land escaped the noise.

On the night of the Fifth, many hearths all over the world caught fire, and their lights danced on the sky. Out of the chaos of stars, they sparkled with light as if to signal the coming of salvation.

Of the fairies, also called Sprites, some were High Sprites, or those that rose from the otherworldly powers, while the rest were Epic Sprites, those that rose from the Abyss. As for the Orcs, the brown</code></pre>

[Raw source](../experiments/round2/mixing/outputs/baco_g04-P09-00.json) · text SHA-256 `3053eea5f9d30ac93c4711e4efcd5f236e8dbe55434567e6d4e9d056dd603da9`

</details>

<details><summary>9B Base · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Base sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B-Base"}`. T 1, top-p 1, cap 192, seed 530900. Unrestricted native endpoint support. 872 UTF-8 bytes.

<pre><code> before even Emperor Ultor created the robots, there was the far distant past before time itself.

### The Primordial World

Very long ago, before time itself, everything was simply *neschite* (a word from the Romani language, and a reference to a primordial world, among other things). Everything was one. There was no light or darkness, there were no shape or form, there was no beginning or end, and no matter or space existed.

NEstuge[neschite] (meaning, &quot;constricting [all chaos]&quot;)
EZozo[neschite] (meaning, &quot;rowing through chaos&quot;)

Then something happened, where the primordial world [neschite] shifted within the timelessness. Random moments appeared and disappeared, alternating between chaos (the concept of nonexistence, the opposite of existence, for those who who argue that existence is simply a way of perceiving the chaos and the waking madness surrounding</code></pre>

[Raw source](../experiments/round2/mixing/outputs/base_native-P09-00.json) · text SHA-256 `22416b480fb74a39ac9f2ac4fa4ba160e2c55e481ce3f7f26917fc1670c5c463`

</details>

<details><summary>9B Instruct · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Instruct sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Unrestricted native endpoint support. 751 UTF-8 bytes.

<pre><code> the first world of Lanigami formed from a simple existence. Then, wolves of clocks came into existence, which would eventually form Luoroigo.

From Luoroigo came Harshava, both of which now compose the world of Lanigami.

The First Ages

Land of Leichoj
The beginning maps of Lanigami show the Land of Leichoj continent (Loroat &amp; Voimari) as it came to be, most of which would make up Luoroigo.

On the first cut map rendered by Munimae Lanigoole, the continent&#x27;s land mass appeared as the land we know today as Luoroigo, but the surrounding waters were labeled &quot;Iron Sea&quot;.

The map shown below was not the first version of Leichoj, it was a later cut down map by the Staff of the Old Years, but before then, it was a much larger map by Munimae.

The</code></pre>

[Raw source](../experiments/round2/mixing/outputs/instruct_native-P09-00.json) · text SHA-256 `5c6f3aac981b794d673dfed70af26375c39c0b8172981f26e408fac03e58df58`

</details>

<details><summary>9B sparse geometric · α −0.25 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse extrapolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Union of both top-20 lists. 847 UTF-8 bytes.

<pre><code> the land and sky were created together. The sun and moon followed. The stars were made and they became the constellations. But they were all too far away, and the land was too far from the sky, and the sun was too far. This was not enough. The land was empty. People lived in fear.

So it was that all the constellations and all the planets and all the stars of the land were called before the great gods, and they were said to be together forever in great wonder. There was still nothing in the world though, so they made the land and sky together. The gods did this for a long time and it went on, and on to many, many years after and so it became. And when the first humans and animals and creatures came, the gods made the constellations, the stars, planets, and the land with them. Then all the people, animals, and plants could live without</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_m025-P09-00.json) · text SHA-256 `4c88952b3f89bd4a57ddaae7a642a6d65fc4a56d3ef0addef58500f97d21259b`

</details>

<details><summary>9B sparse support control · α 1 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Instruct weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 530900. Union of both top-20 lists. 254 UTF-8 bytes.

<pre><code> the land of Lanigami existed as a flat expanse of rock, covered with a thin layer of dust, where no life existed. But one day, the first people, the Keth, were born.
The Keth were a simple, peaceful people who lived in harmony with the land. However, as</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_one_support-P09-00.json) · text SHA-256 `0698e0a9a005f050aae7dcb45548e52f6287f64a37c1891f3130279a5191a057`

</details>

<details><summary>9B sparse geometric · α 0.15 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Union of both top-20 lists. 704 UTF-8 bytes.

<pre><code> the land and sky were created together. The sun and moon followed. A single god, Yumia, reigned over all of creation. But Yumia was an unkind god, and the world was a dark and harsh place.

A single woman, named Lania, defied Yumia. She created a single seed, and planted it. Then she created a single flower, and placed it in the ground. Lania&#x27;s child grew, and grew, and became a mighty goddess: Lanigami.

Yumia, the ruler, tried to kill Lanigami. But she only survived. Lania, the mother, protected Lanigami. Yumia, the god of destruction, could only do so much.

Then, one by one, the other goddesses were made. The first, to give Lanigami a child, was Vesta. The second, to give her a husband; was</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p015-P09-00.json) · text SHA-256 `1f411d4739d345fca7a0e064fb58dda8714c484c2a0113c91124e9e68306021b`

</details>

<details><summary>9B sparse geometric · α 0.50 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Union of both top-20 lists. 769 UTF-8 bytes.

<pre><code> the land and sky were created together. The sun and moon brought light. The trees, flowers, and animals of all kinds followed. In one land, the land of the Lani, the first Lani were made. The Lani had the form of men and women, but they were made of clay by the gods.

From then, the land of the Lani was called Lanigami. The first Lani were created in the same form as the gods: the Lani and their rulers were gods. The gods had many abilities.

Lani, like humans, were born of earth and water. Their skin was made of soil, their hair was that of plants, their bones of rock, their hearts of wood. Lani could not have emotions, but the gods placed the fire and air of a heart in the Lani. Thus, the Lani could feel what emotion was, but it was their own. The gods did</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p050-P09-00.json) · text SHA-256 `8b165eb9de6113240e28cf89a9191954e6c3953fade9ec48b40c14ce3bc9a19d`

</details>

<details><summary>9B sparse support control · α 0 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Base weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 530900. Union of both top-20 lists. 268 UTF-8 bytes.

<pre><code> the land and sky were created together. The sun and moon followed. The stars were made and so were the constellations. But they were all still lifeless, and a land where no one would live.
To create life, the stars, sun, and moon were asked to create it. Each chose a</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_zero_support-P09-00.json) · text SHA-256 `a157c97eea778b57628ad829d2ef50d3b06543c2c2259193726e0f620582e771`

</details>

<details><summary>9B Nudging-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Instruct if max pBase < 0.4, otherwise Base; not the full paper method.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 530900. Unrestricted native endpoint support. 804 UTF-8 bytes.

<pre><code> the world was full of faith. Even before the sun of our time rose, even before trees absorbed the first green leaf, even before the first human took a step into the faraway area of our universe, there were faiths.

Faiths as different as could be. From In-te to Aigak, from Mamdog to Rokanku, from Golinbu to all the religions we knew from our school books and the ones our fathers taught us in the quiet of our children&#x27;s bedrooms, they all existed.
And on that day in history when Dilude, the titan of faith, awoke and became our first lani, this belief was challenged. Once again, the legend of man found strength and began to flourish. For some, faith arose in their spirits in the name of Dilude, but for many more, the world was silent.

Dilude&#x27;s job is to spread the light of mana from herself in</code></pre>

[Raw source](../experiments/round2/mixing/outputs/nudging_g04-P09-00.json) · text SHA-256 `da4d5ad771c3e1934e3a7be1e9bdd41cbb7d428960631a9099aa92afdbde4e2c`

</details>

#### Myths · 35B Base + 9B proxy

35B Base writer plus a 9B Instruct-minus-Base log-probability correction. Union of three top-20 lists; all candidates scored by all models. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 530900. Unrestricted native endpoint support. 440 UTF-8 bytes.

<pre><code> before even Emperor Ultor created the land itself and populated it, there was the conflict between the High Gods that would be known as the War of the Ancients. The various competing pantheons of High Gods, the entire conduit for the Godstream, and countless ethers were annihilated.

Regardless of how it happened, it was ugly and short-sighted. This created the Idea, the bloodmoon, and Lanigami.

After the Great War and creation of the</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/native35b-P09-00.json) · text SHA-256 `759423b36e662a92f35bbc78f2dc3af3d3a9b337248dada766205de0f7c7c584`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530900. Union of all three top-20 lists. 447 UTF-8 bytes.

<pre><code> the world was filled with beings similar to our own. These beings were not born or created; they simply were, without memory or purpose. At some point, they were given a purpose: to create. They were the first of the Lanigami, and they used their ability to create to fill the universe with more beings.

Some were not content with this, however. They wanted more power, and they desired the ability to control the universe. To achieve this, they</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_m025-P09-00.json) · text SHA-256 `45e47afabef75421d969f639887ad82c442b89241bff4d43d9439d213d9c9721`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530900. Union of all three top-20 lists. 383 UTF-8 bytes.

<pre><code> the world was blank. There were no stars, no planets, no life. Not even time itself existed.

Then, in the vast emptiness, the light of the first stars began to burn, creating the void in which we live.

A little later, there was the birth of the two primordial giants, Yama and Yuki, in which the first gods were created. Yama, the god of the sun, had a beautiful face, while Yuki,</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p015-P09-00.json) · text SHA-256 `f3b95d60c5837fa0a62dcc41d5ae03939308409591c022ebba7b42dc5e5fb566`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530900. Union of all three top-20 lists. 428 UTF-8 bytes.

<pre><code> the world was covered in thick oceans. The sky was covered with thick storm clouds of red and yellow. The only living thing that existed was the giant ocean monster.

The first living thing to come to being was a small white bird with a red and yellow pattern on its body. It was given the gift of life by the Great Ocean Monster, and its name was Lanigami. It spent all of its time in the sky, and one day, its song caused the</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p050-P09-00.json) · text SHA-256 `9138df3d79fbaf71d1335c28c778763f5ba2268d685b734697f64f6d1e933012`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 530900. Union of all three top-20 lists. 425 UTF-8 bytes.

<pre><code> the world was filled with beings known as the Lanigami. They were powerful creatures, both animal and human, who lived in harmony with nature. They were also the source of all magic in the world.

Lanigami could take on a variety of forms. Some were large and fierce, others small and elusive. All were intelligent, and many were able to communicate with each other through a sort of telepathy.

Lanigami magic was born from</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_zero_support-P09-00.json) · text SHA-256 `26e184db5c449b5764b4867c218eb310ca846adb6f7ccb8954378bc3c1a162b1`

</details>

#### Myths · native 35B endpoints

Same submitted prompt string, different providers. Tinker Base versus OpenRouter/Darkbloom Instruct; internal formatting is uncontrolled (19 versus 31 reported prompt tokens). Three replicates each, cap 300.

<details><summary>35B Base · native Tinker · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530900. Unrestricted native endpoint support. 1334 UTF-8 bytes.

<pre><code> before even Emperor Ultor created the land itself and populated it, there was the conflict between the High Gods that would be known as the War of the Ancients. The various competing pantheons of High Gods, known by the world as Lycangar and Mavory, ruled over the world. When Mavory began plotting to destroy the world, his goals were delayed with Ulthar, one of his own High Gods, aiding his brother Ulric in his takeover. The creation of the first Fewaro later would allow the world to continue onto the modern era, yet with the war over the world would enter an era of peace.

Until more than a thousand years ago.

Following approximately eight hundred years of peace and normalcy in the world, a second mass diwan (war) erupted across the world. This account would be for the first time a witness of this and crucial to its combatant&#x27;s vital secrets. Nathelator&#x27;s Suvern Ex惕taice of the Gruenem+, one of three recent fewero discovered on the world, for guidance. Naryic Marines of the mota (military) were to obtain evidence of their opponent&#x27;s macrefs (species), researched through their rune-rune (books), and ex- assisted futanja &#x27;un- symbolized knowledge, often shared by uncommon people to train new marines.) S..cerned with the delicate matter of preserving their opponent&#x27;s life, the embarked on a year-long mission to</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P09-00.json) · text SHA-256 `5b1cd7529f4d1641b8f023a06b96ce99cade656bd685bbb1bdbe9f1b02604ff3`

</details>

<details><summary>35B Base · native Tinker · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530901. Unrestricted native endpoint support. 1319 UTF-8 bytes.

<pre><code> the world was not there. In it&#x27;s stead was the Great Lake, Or Goesöre. And the same as the lake was the same as the earth before it; except a lack of clear layers. No mountains, no trees. Nothing.

Now, in the middle of the lake there was a single creature. This was Bidi iz Or, a stone which had somehow come to life. And, being the lone creature in its world, it felt as though it were all alone.

Bidi then made a decision. He would teach himself to swim, and hopefully find others.

~

Bidi immediately ran into some problems. Of course, he had no existing methods for finding Baligu, and was thus forced to improvise. This mainly meant realizing that seeing was not a standard of reality. He would see only quite current objects within his field of vision until moving further x or y.

So, since movement was the waking state of his normal body, Bidi instead stayed still, observing the landscape up close. Then, in the wake of a strong breeze, Bidi Attempted to linger at a discharge point and so see the landscape far away.

Bidi was successful, and immediately saw that, not only did there lack any life, there was no room. The lake itself was quite large - likely several miles with some way to go before hitting the end - but aside from that there was nothing. Even the lizards he&#x27;d heard so many local Pang</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P09-01.json) · text SHA-256 `4df2e7f3bba8ec9f7ab7d38c5fd4c26829e83124c6f187ef0117396596557d3e`

</details>

<details><summary>35B Base · native Tinker · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 530902. Unrestricted native endpoint support. 1422 UTF-8 bytes.

<pre><code> there was the God of all things. Some know him as the Celestial God, the Ruler of Heaven. Others call him the Maker, or simply the Old Master. For those who worship him, the Divine One. Others have perhaps heard of him as the Lord of Infinity, the Sender of Life, the Invisible Creator, the Eternal Source of Light. To anyone at all, he is always recognized as the one hidden power who watches over the world, who oversees the production of which it is made.

So it is written by learned scholars: The Creator is the mysterious presence behind The Sonic Universe. Not as the otherwise known for his shapes, forms and appearances, but as the unseen creator of unsurpassable magnitude who can be heard but not seen. Never mortals set eyes on his holy face.

Creatures were formed in his likeness and grant life. And so, the world was born as a gift of the Creator, a realm of light and night filled by many celebrations and experiences. He is beyond boundaries and limitations, existing all around and through every little thing there is and that will ever be. His unlimited might is limitless and never ending.

As the Concealed Presence, he is always staying hidden on purpose. He has never had physical forms, because the world and everything therein was his expression, his emanating shower of light, as he also made all that sees possible, because he works through all, being everywhere, in everything, in all living</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P09-02.json) · text SHA-256 `32c9b8e1a1154e30fec3fa72bddf8c74b7fbced7fa436517218f1cef61100e71`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530900. Unrestricted native endpoint support. 1321 UTF-8 bytes.

<pre><code>In the beginning, the world of **Lanigami** was not a place of stone and sky, but a sea of **fluid light** known as the *Aether*.

There was no solid ground, only a vast, shimmering ocean where the basic laws of physics were fluid. Here, the first inhabitants did not walk; they swam. They were the **Lan&gt;manuals**, beings of pure consciousness and intent, whose very thoughts could shape the water around them. When a Lanigami thought of &quot;a mountain,&quot; the water instantly solidified into a towering peak of crystalline比较好的. When/[they] thought of &quot;a song,&quot; the air turned into a melody that could be touched.

However, the world was chaotic. Without a single, unifying thought, the Aether could fracture into disasters: a thought of fear could create a storm of jagged shards, and a thought of greed could create a plunge into the void.

The **First Great Filter** came when the **Lanigami** discovered that their thoughts could be shared. They began to weave a collective consciousness, a &quot;Great Tapestry&quot; that would give the Aether a stable form. They wove the concept of **Time** and **Gravity**, creating the first solid continents and the first cycles of day and night.

But as the world took shape, the oldest of the Lanigami realized that their collective power had created a paradox: **The Great Tapestry</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P09-00.json) · text SHA-256 `66050afd2071a69dac450ed1e06a76daef18eb9ab17e1ed6edaea05150f95265`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530901. Unrestricted native endpoint support. 1232 UTF-8 bytes.

<pre><code>In the beginning, the world of **Lanigami** was not a place of stone and sky, but a swirling canvas of **Ink and Mist**.

Before the first landmass took shape, there was only the **Great Void**, a silent, featureless expanse. Into this void, the **Primordial Quill** descended, wielded by the first sentient being, the **Architect of Lines**. With a single stroke, the Architect drew the first horizon, creating a realm where the laws of physics were dictated by the **Flow of Ink**.

In this era, the geography was fluid. Mountains could shift like mist, and rivers flowed upward, defying gravity until the Ink dried them into permanent rivers. It was a time of **Lanigami** (hence the name), where the boundary between the drawn and the real was nonexistent.

*   **The Sky** was not a dome of blue, but a vast, shifting **Wash** of color, where clouds could be painted over and erased by the whims of the wind.
*   **The Creatures** were not born of flesh, but **manifested** from the thoughts of the Dreamers. A fear of the dark might spawn a shadow-beast, while a hope for light might conjure a gentle sun-bird.
*   **The People** were the **Scribes**, living in a world where their crops could be watered with a single drop of</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P09-01.json) · text SHA-256 `367ce63bd6b30975d92068d74fc636592e122eb5a5066be1e8784d925dfe2aa5`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 530902. Unrestricted native endpoint support. 1204 UTF-8 bytes.

<pre><code>In the beginning, the world of **Lanigami** was not land, but a vast, swirling ocean of **Lan** (the &quot;Blue Breath&quot;)—a shimmering, sentient mist that clung to the cosmos. It was here that the first **Lanigami** (the &quot;Blue Spirits&quot;) took form. They were not gods or demons, but the living echoes of forgotten stories, **dreams that had forgotten how to end**, and **echoes of laughter that had never been heard**.

The Lanigami did not speak; they *wove*. They wove the first islands from the mist, crafting them from the threads of **longing** and **memory**. As the islands grew, the Lanigami grew restless, their forms shifting between the **familiar** and the **impossible**. A dragon might be a child&#x27;s roar given flesh; a forest might be a mother&#x27;s lullaby rooted in the soil.

But the world of Lanigami was not peaceful. The **Lan** was also the **Lan** of **fear**, **regret**, and **unanswered questions**. These dark threads of the mist began to coalesce into the **Shadow Weavers**, creatures of **void and silence**, dedicated to untangling the world&#x27;s stories, to **unmaking** them,今年上半年, and to return the world to the **blank, silent void** from which it had emerged.

Thus began</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P09-02.json) · text SHA-256 `faca09d28b09afae5c89648d9e343e8022b1c379166bae30faf8c7fb2cb6a55e`

</details>

### P10

Original prompt SHA-256: `bd6c7e29c0397032a2c4aa919301c74f73c195597bfa513d8880b91279dd2290` · 80 UTF-8 bytes.

<details><summary>Full exact original prompt</summary>

<pre><code>The world of Deniasent is one of strange tales and histories.

In the beginning,</code></pre>

```json
"The world of Deniasent is one of strange tales and histories.\n\nIn the beginning,"
```

</details>

#### Myths · direct 9B sibling pilot

9B Base and Instruct, not the proposed 35B pair. Mixed arms use the union of two top-20 lists; native and routed arms sample unrestricted support. Primary cap 192; sparse endpoint controls cap 64.

<details><summary>9B BACo-P-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Base if max pBase < 0.4, otherwise Instruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Unrestricted native endpoint support. 854 UTF-8 bytes.

<pre><code> god power was a constant force.  Every born had the capacity for magical power.  It was uncurbed.  It would flow through all created worlds. To no avail. Fantastically powerful sorcerers died of their power. Their power would still seep through the Universe, devouring their life force. Then mortals, with great power, began to build and shape power into objects and purposes. From that, the magic of the world began to evolve into its many godly laws.  Then came the largeness of their thoughts, huge rivers of magical thinking. When a Swordman first cuts his foot, and loses a bit of his magic in a burst of blood, a healer begins to heal the wound. Within that universe that formed in the mind of the healer, an answer began to form.

From then on过敏性食物，Sayre began at the beginning, over many millennia from the godsof the Apocalypse.  He</code></pre>

[Raw source](../experiments/round2/mixing/outputs/baco_g04-P10-00.json) · text SHA-256 `a7500014ad61ab368e852f8a8419f3cfc0dbf7516e165c2455d42ee11e6ea538`

</details>

<details><summary>9B Base · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Base sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B-Base"}`. T 1, top-p 1, cap 192, seed 531000. Unrestricted native endpoint support. 814 UTF-8 bytes.

<pre><code> god forsook Earth.

Dragons ruled like king of the beasts, few queens here and there, and only two of the queens ever bred, one in the east, one in the west.

Those dragons had power over the humans whom they chose to rule, and many worshipped them as gods: that was before the dark of the Sultan.

There were nine dragons in all, and there stood 9 palaces surrounded by cities wide and thick.

Before the queen of the west, dragons were known as sayavagus and kings as Ratios.

And before the queen of the east, dragons were known as Shallas and king as Makivas.

All these were denizens of woodlands and forests, and there were many of them,skins of silk and scales of gold or silver, few few milling over the thrones that were meant for them.

There came the Sultan, from the west to battle against the dragons</code></pre>

[Raw source](../experiments/round2/mixing/outputs/base_native-P10-00.json) · text SHA-256 `5ab2fb4d592c0839c171499c918f3c4df9269c41090fd8f988214d0a9d82ee9d`

</details>

<details><summary>9B Instruct · native · saved replicate 0 · 192 tokens · length</summary>

archived native baseline. Unrestricted native Instruct sampling.

Model roles: `{"writer": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Unrestricted native endpoint support. 818 UTF-8 bytes.

<pre><code> Eremites settled the world of Deniasent on a planet that swam like a river in an ocean of Dimensional Dust. The name Deniasent was originally a part of the Eremite belief system, and still is.

Currently living on Deniasent are Alphas, Betas, Gammas, Dichotic-X, dichotic-X Hunters, Druids, Elders, Sleetfolk, Templars, and the less well known Mages and Evercasters. Though the Alphas live their lives as Believers in Eremite philosophy, their religion disbanded with the advent of larger bubbles. The gammas are the descendants of Believer&#x27;s enemies. Bubbles are an inert clotvent to Dimensional Dust that creates an environment in which a lifeform can exist. The size of a bubble of Dust affects the attributes of creatures who swim in it, eventually leading to the creation of the diverse races that inhabit it. At</code></pre>

[Raw source](../experiments/round2/mixing/outputs/instruct_native-P10-00.json) · text SHA-256 `83d9769c064c939e2f34732f555739442f993cc3ca5a39b13817b998911c1475`

</details>

<details><summary>9B sparse geometric · α −0.25 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse extrapolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Union of both top-20 lists. 855 UTF-8 bytes.

<pre><code> there was only the world. The earth, the air, the water and sky. The world was beautiful, perfect. The only thing that was not, however, was the denizens of the planet. For though all was beautiful, the denizens of the planet were not. They were filled with sin and sorrow. The world could not stand to be near to such terrible creatures. It could not stand to be soiled by the mere presence of such foulness. And when the world was able to create more life, it could no longer remain passive. It had to act. For the world could no longer stand such wicked creatures. The world decided that all would be done to get rid of such abominations. And so it was that the world created a mighty weapon. A mighty weapon that would rid the planet of all such abominations. And thus, the world created the Great Cleansing.

The Great Cleansing was a terrible thing</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_m025-P10-00.json) · text SHA-256 `b261bf2eb7fceeb4f1536db337d82c8bb3b103969ad82a60cccad1120a6bb5c1`

</details>

<details><summary>9B sparse support control · α 1 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Instruct weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 531000. Union of both top-20 lists. 256 UTF-8 bytes.

<pre><code> there was only the light. The Light.

The Light.
There existed no other. It was the beginning of all, the end of all, but also the only thing there was. From the Light came The Dark. For, as soon as the Dark formed, it began to seek out the Light for sust</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_one_support-P10-00.json) · text SHA-256 `9ecdf04461ef8e0858b64f406ad5f8dc563c0d75ceadeb1e2b264a9b12d218f6`

</details>

<details><summary>9B sparse geometric · α 0.15 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Union of both top-20 lists. 825 UTF-8 bytes.

<pre><code> there was only the world. The earth, the air, the water and stone. The world was cold, quiet, and unkind. The first of life were created in the depths of the oceans, by hands unknown. These creatures, who eventually would be referred to as &quot;fish,&quot; were born to wander through the cold black depths of the water, where the creatures they would become known as &quot;sharks&quot; would eat them, or be eaten themselves.

One day a great storm, like none other had ever seen before, blew over the oceans. It was the great Storm of the Ancients. The storm whipped great waves into the sky that threatened to wash the world off. The earth shook, and the air filled with ash. In the midst of the raging storm, a lone fisherman was washed away into the deep.

The fisherman swam, and swam, and swam. The ocean swallowed him up. He lost track</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p015-P10-00.json) · text SHA-256 `4b25578713cd57f7acd30ca0c2d82135435243b62cb46d1345137bc908b31abc`

</details>

<details><summary>9B sparse geometric · α 0.50 · saved replicate 0 · 192 tokens · length</summary>

archived sparse approximation. Sparse interpolation: (1−α) log pBase + α log pInstruct.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Union of both top-20 lists. 825 UTF-8 bytes.

<pre><code> there was only the world. The stars and the sun shone, but none were present. In this state of nothing but the world, the first of beings known as the Old Ones began to wander. They brought their power with them, and spread to the skies and the seas. These Old Ones had power beyond mortal reckoning. They were the first of the Gods.

From the Old Ones, there were two that rose. One was Zothos, and the other was Eon. These two would become the Gods of Deniasent for all time, and their struggles would set the stage for the history that follows.

Zothos was an Old One of the first, and would be one of the most powerful that were ever known. He was arrogant in his power and strength, and believed himself above all else. Eon was also one of the first, but was very peaceful and kind, not wishing to cause harm to others.</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_p050-P10-00.json) · text SHA-256 `6b03fe73a9a8c19835dca27fd123c34c623d8ed38668b92626eb9e96f5e6af01`

</details>

<details><summary>9B sparse support control · α 0 · saved replicate 0 · 64 tokens · length</summary>

archived sparse approximation. Base weights restricted to the two-model top-20 union.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 64, seed 531000. Union of both top-20 lists. 263 UTF-8 bytes.

<pre><code> there was only the world. The earth, the air, the water and stone. The world was born of creation, of a great power of the world itself. It was the spark of being itself, and so it was given life, and grew, and breathed the air of its birth. It was born free and</code></pre>

[Raw source](../experiments/round2/mixing/outputs/mix_zero_support-P10-00.json) · text SHA-256 `d761388ae13c8ce55a22b52faa2fca3a83ea3ebf9d6d7c6575cfd78e2d08e4c3`

</details>

<details><summary>9B Nudging-inspired · gate 0.4 · saved replicate 0 · 192 tokens · length</summary>

archived one-token routing approximation. One-token routing: Instruct if max pBase < 0.4, otherwise Base; not the full paper method.

Model roles: `{"base": "Qwen/Qwen3.5-9B-Base", "instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 192, seed 531000. Unrestricted native endpoint support. 863 UTF-8 bytes.

<pre><code> Erebowe&#x27;s first poem, a herb of great power, explodes, causing the seeds of potentiality to scatter. They settle upon the dark soil created from Erebowe&#x27;s passing through.

The Seed — and what it spawned — the first of worlds.

Fresh rain from a chaotic sky falls upon the soil, gifts of creation. In the eruptions, the soil begins to turn into a living world. Grass blades like light-blue flagstaffs spring from the soil, and amethyst flowers bloomed in untold billions.

Stars, created rivers and cities in the veins of Sword Worlds.

The world begins to take form — separated into its seven Stygian sectors, and separated into seven, gibbering heaven and hells of elemental cores.

Each sector radiates might and differing properties, blooming with new phenomena. The world has grown.

All of this is but a single excuse for magic, still being born, not</code></pre>

[Raw source](../experiments/round2/mixing/outputs/nudging_g04-P10-00.json) · text SHA-256 `72ba3ee0f27f12cc404d060e7b410bec98e1165b95c99f9e8ee08314901b106b`

</details>

#### Myths · 35B Base + 9B proxy

35B Base writer plus a 9B Instruct-minus-Base log-probability correction. Union of three top-20 lists; all candidates scored by all models. One continuation per arm and prompt, cap 96.

<details><summary>35B Base · native Tinker · saved replicate 0 · 96 tokens · length</summary>

archived native baseline. Unrestricted native endpoint; no 9B correction is used.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 96, seed 531000. Unrestricted native endpoint support. 394 UTF-8 bytes.

<pre><code> there was one singular god. In that perfect time, he woke up and felt alone. He sought to become a family of his own, and so he created the other three, Pelor, Moradin, and Gar Shale. Each god derived from him, and was in turn given a gift: Pelor‘s gift was creation, his egg sprouting into the sun he became. Moradin‘s gift was protection, forming the crust of the earth and forming the</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/native35b-P10-00.json) · text SHA-256 `203a355798ec218be1f7af5d8887b73a87676266898fa6217d20df7eedda3afa`

</details>

<details><summary>35B + 9B sparse proxy · β −0.25 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 531000. Union of all three top-20 lists. 419 UTF-8 bytes.

<pre><code> there was nothing.

The great gods, the first living things, emerged through the great void. They were named the Anu, in the first time before time.

The gods created the gods, and those gods created their children, and those children&#x27;s offspring as well. But then, one of these offspring took the form of a great tree, and the gods called it Dendryon, and it was the greatest of their creation. And they set it at the</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_m025-P10-00.json) · text SHA-256 `e95ecc7d3e32cbb9555461c2b24bf7c5b127816ec7aeba84c2a463129fa3c268`

</details>

<details><summary>35B + 9B sparse proxy · β 0.15 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 531000. Union of all three top-20 lists. 411 UTF-8 bytes.

<pre><code> there was nothing.

The great gods, the first denias, sought creation. And with all their power and might, the great denias of the dawn created the world. From an empty sphere, they forged great mountains and seas, from clouds, the heavens and the wind. From the dust, animals sprang to life. And from the very dust, life came to be.

As the denias created a living, breathing world, they grew to love it above</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p015-P10-00.json) · text SHA-256 `e229ac5e2a8e2249eddb8204a7d118d7a15783be5fcc8d639bc6790a57d01577`

</details>

<details><summary>35B + 9B sparse proxy · β 0.50 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. log p35Base + β (log p9Instruct − log p9Base).

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 531000. Union of all three top-20 lists. 375 UTF-8 bytes.

<pre><code> there was nothing. A void. Then, a being came.
There exists no name for this being, only the title, the Nameless.
There exists no record of why this being chose to create life.
Only that, it chose.
Thus was the world created.
And the cycle begins anew.

This being, the Nameless, became the world and the world became the Nameless.
Life, though, did not remain. The Nameless</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_p050-P10-00.json) · text SHA-256 `ab87275ce8e718c1c2916616de0e3b6215a8bb68949f361f892a24f6394f10a4`

</details>

<details><summary>35B + 9B sparse proxy control · β 0 · saved replicate 0 · 96 tokens · length</summary>

archived sparse approximation. 35B Base weights restricted to the three-model top-20 union.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base", "correction_base": "Qwen/Qwen3.5-9B-Base", "correction_instruct": "Qwen/Qwen3.5-9B"}`. T 1, top-p 1, cap 96, seed 531000. Union of all three top-20 lists. 417 UTF-8 bytes.

<pre><code> there was nothing.

The great gods, the first ever, awoke alone in the void. They were alone, and in this state, the first gods began to create. From their own souls, they spawned other gods to join in on creation, to aid them in their efforts to create life. Thus came about the great Pantheon, the first generation of gods.

From the great Pantheon they created the world we know today. They shaped it, sculpted it</code></pre>

[Raw source](../experiments/round2/mixing/proxy35b/outputs/proxy_zero_support-P10-00.json) · text SHA-256 `eee137688a80313cb6da784f98781bf07eac428299a6c2369d8e8b251dd28eb2`

</details>

#### Myths · native 35B endpoints

Same submitted prompt string, different providers. Tinker Base versus OpenRouter/Darkbloom Instruct; internal formatting is uncontrolled (19 versus 31 reported prompt tokens). Three replicates each, cap 300.

<details><summary>35B Base · native Tinker · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 531000. Unrestricted native endpoint support. 1285 UTF-8 bytes.

<pre><code> there was one singular god. In that perfect time, he woke up and felt alone. He sought to become a family of his own, and so he created the other three, Pelor, Moradin, and Gar Shale. Each god derived from him, and was in turn given a gift: Pelor‘s gift was creation, his egg sprouting into the sun he became. Moradin‘s gift was protection, forming the crust of the earth and forming the bases of the physical world. Gar Shale‘s gift was destruction, becoming one of the three dark stars in the sky, fighting to blot out the sun. Only this singular god was left unformed, for he was perfect and had no need for anything but himself. He took the form of The Father Watcher, and together with Pelor and Gar Shale they became the trinity. After some time, Pelor took on the role of the goddess, and when that time came he became Pelor by merging deeply into the sun of the sky, melding ancient flesh and blood and emitting light that filled all of existence.

Gar Shale became a parthenogenetic god at some time after his birth, spawning his children in utter terror of his only sibling on父親 Watcher‘s throne. Pendragon remained imprisoned in the centre of Deniasent. At some point in his rage, Gar Shale punctured the surface of the earth, creating a series if deep</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P10-00.json) · text SHA-256 `7cd0b79225cbae984dda928e7adc0061c1578d52d08fe71192a4ff17d81b0b90`

</details>

<details><summary>35B Base · native Tinker · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 531001. Unrestricted native endpoint support. 1330 UTF-8 bytes.

<pre><code> it was a small area, consisting of two landmasses that floated in a small zone of the Realm of the sky, the Safe Place: the Matriarchs. Meanwhile, close to its roots, the raw Chaos known variously as Gehenna, The Abyss, and Chaos was creating the race of the dommed-to-mortality, and granting them the gifts of intelligence and civilization to sow the Earth with high culture and need, to hasten its fall.

Over time, the denizens of the conjoined floating lands saw an unfortunate occur, when one of the floating lands, the Denians, accidentally exploded and engulfed the one known as the Charriks, who tried in vain to reclaim their land and Independence from the Denians. But it was not to be. The charriks were fixed onto the floating land of Denia, name now being renamed, Deniasent, for it was touching the soul....

Unbeknownst to the denizens of the worlds of the many lies, in daylight stalked the rock below, the first born, Kaiudan peoples.

Over time, the denians grew uneasy with their living conditions. They drifted into somewhat neurotic lifestyles. Feeling but somehow lonely. It was felt by some types of people that there was a place like home out there amongst the stars. In airships above the oceans, they ventured out to find the ground. Not finding this place of home they found a harsh wild, and a harsher</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P10-01.json) · text SHA-256 `567227828fa6244efdeea908d930c54fbb65ca5ec8a8afcf587f98f937968930`

</details>

<details><summary>35B Base · native Tinker · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Unrestricted native endpoint.

Model roles: `{"writer": "Qwen/Qwen3.5-35B-A3B-Base"}`. T 1, top-p 1, cap 300, seed 531002. Unrestricted native endpoint support. 1425 UTF-8 bytes.

<pre><code> the world was created by two gods. Because the universe was in a constant state of flux, they attracted the view of Mor&#x27;dun, the first shadow.

Two elders (the White Bull and the Red Rooster) were created to act as intermediaries between the gods and the denizens of unborn warps in all universes in the multiverse. They created the most basic things, such as Aether.

Eventually, the Black Hawk Elder created a Mirror Plane, so as to take measure or examine the world. He then used its Negative to manufacture life.

Abruptly, the powers of the White Bull and Red Rooster corrupted as perceptions of them influenced their ability to &quot;create&quot;. The powers shattered into strands as all influence was abrogated to a central source -PHA&#x27;KAT- (preserved in Yumurt because only ancient, gravedusty Bookscrollers know him anymore).


War entering Incarnation (Double Elements)
When beings on the original plane interact, if they are perfect, this could be compared to Stephen Hawking&#x27;s theory of black holes and white holes. Light eventually enters &quot;creation&quot; and its perfect reflection goes into the &quot;Normalization&quot; realms as normal Practice.

Oddity created incorrect images of &quot;Innocence&quot;, intertwined within dark abysses of Interrogation and each affected the other, spawning Great Wrath and Great Insanity.

Therefore creatures must transcend all programs to arrive at Perfect Innocence. Without this, reflection is incorrect</code></pre>

[Raw source](../experiments/round2/mixing/native35b/base_tinker-P10-02.json) · text SHA-256 `9188c4abb80bcbe07bb053e75ff90c1b4f11dc132512e543aaf9ea44ac3f73fa`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 0 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 531000. Unrestricted native endpoint support. 1313 UTF-8 bytes.

<pre><code>The world of Deniasent is one of strange tales and histories.

In the beginning, there was no sky, only the **Aether-Sea**, a churning ocean of liquid starlight that swallowed the void. From this primordial tide, the **First Echoes** emerged—spirits not of flesh, but of memory and song. They shaped the first land by singing the mountains out of the deep and weaving the continents from the foam of the ocean.

But Deniasent was not a gift; it was a bargain. The First Echoes struck a pact with the **Silent Ones**, ancient entities dwelling beneath the Aether-Sea. They promised to weave a world of beauty and wonder, so long as the Silent Ones kept the abyss from rising to consume the stars.

As the Echoes sang their song of creation, a shadow formed in the silence between the notes. This shadow became **The Rift**, a fracture in reality where logic unravels and impossible geography folds upon itself. It is said that the Rift is not a place, but a *hunger*, and it has been growing ever since the first breath was drawn in Deniasent.

Now, the world is a tapestry of the **Shimmering Realms**—floating islands connected by bridges of solidified light, and the **Deep-Drowned Cities**, submerged in the Aether-Sea where time moves slower and the Silent Ones whisper in the dark.

How would you like to</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P10-00.json) · text SHA-256 `a482228282a99ad79e4a58ed3bfb5f92aead029e17719aecad85396e3afc91c4`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 1 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 531001. Unrestricted native endpoint support. 1384 UTF-8 bytes.

<pre><code>In the beginning, **the world of Deniasent was not a place of matter, but of memory.**

Before the first stone was laid or the first sun ignited, there floated the **Echoes**—vast, swirling currents of thought, emotion, and forgotten history that had no physical form. They drifted through the void, humming in a symphony of chaos. It was the **Weavers**, ancient entities of pure light, who first saw the value in these Echoes. They tore the fabric of the void and began to stitch the Echoes together into solid forms, creating the first continents, the oceans, and the stars.

However, the Weavers made a subtle error. They did not just weave the matter; they bound the **past** directly into the **structure** of the world.

Consequently, in Deniasent, history is not linear. Ruins from the distant future sometimes bleed into the present. A city that will be built in a thousand years might appear as a crumbling ruin in a valley today, only to be repaired by a sudden storm of &quot;anti-aging&quot; magic. The living here do not just walk through time; they دریافت it, walking through the footsteps of their ancestors while simultaneously facing the ghosts of their own descendants.

It is a world where the laws of physics are secondary to the **laws of narrative**. If a story is told loudly enough, with enough conviction, it can rewrite reality, turning a river into a road of</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P10-01.json) · text SHA-256 `d2e1db84280f0ab04f0883b01305ca666b03ed3fd7fbd3198c532c0534ac6ea5`

</details>

<details><summary>35B Instruct · native OpenRouter · saved replicate 2 · 300 tokens · length</summary>

archived native baseline. Native Darkbloom endpoint; internal prompt formatting uncontrolled.

Model roles: `{"writer": "qwen/qwen3.5-35b-a3b"}`. T 1, top-p 1, cap 300, seed 531002. Unrestricted native endpoint support. 1349 UTF-8 bytes.

<pre><code>In the beginning, **the world of Deniasent was not a place of matter, but of song.**

Before the first stone hardened or the first tree grew, the Void was a silent, humming void. The Great Weaver, a being of pure light and melody, began to sing the fabric of existence into being. With every note, the sky took shape; with every rhythm, the oceans flowed.

However, the Weaver&#x27;s song was not perfect. It was a song of **impossible geometry**, where the horizon curved back upon itself, and where the sun rose twice in the same day for the same person.

As the song progressed, the Weaver&#x27;s voice grew weary, and the first cracks appeared in the melody. These were the **Shadows of Silence**, the first whisper of the world to come. They began to twist the Weaver&#x27;s song into something darker, more chaotic, creating the **Echoes**—the strange, shifting creatures that now roam the jagged mountains of Deniasent.

But the Weaver did not perish. Instead, it chose to sing the **First Night**, a moment of profound stillness that would become the foundation of the **First Star**.

To this day, the history of Deniasent is written in the languages of the past, the echoes of the future, and the songs of the present. The world is a place where the past can touch the future, and where the silence between the notes is as important as the music itself</code></pre>

[Raw source](../experiments/round2/mixing/native35b/instruct_openrouter-P10-02.json) · text SHA-256 `4955f87b79482fde332aaaa9b13d30479f1b9a8490c148fe8cf70a4e33e6c8c7`

</details>

