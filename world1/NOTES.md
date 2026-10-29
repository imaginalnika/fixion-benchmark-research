# NOTES.md — world1 portal research
Research-only under `/workspace/fixion-content/world1/`. Did **not** ship, PR, or push `fixion`. Did **not** touch `/workspace/drdr-dr`. Temporary GitHub Pages explorer only.

> **Quality pass v2 (2026-10-30) is at the end of this file.** The live page now shows v2; v1 stays at
> https://imaginalnika.github.io/fixion-benchmark-research/world1/v1/ and in `world1/v1/` (untouched). The sections
> below, up to "Quality pass v2", describe v1.

## Live explorer
- URL: https://imaginalnika.github.io/fixion-benchmark-research/world1/
- Source commit on `fixion-pages`: `world1/` (temp; delete after review).
- One page, four worlds (Morrows / Figgs & Potts / Louis / Gwangsu). Pick a start scene; click portal buttons.
- Contact sheet: `samples/CONTACT_SHEET.png` (also on Pages). Graph: `samples/GRAPH.png`.

## Approach chosen
- **Module Exits (Approach A)** preferred over bible Exits (B) for growing maps.
- Early A-vs-B judge sometimes preferred B even when A parse was cleaner; after smoke (A≈4 exits vs B≈2, B often prose-contaminated) we **FORCE module_exits** for expansion.
- Portals are feature-tied when possible (door / gravestone / manhole / 비상문 / 창문), not only cardinal edges.
- Continuity: child openings get forced dest title + Came-from + arrival; parent few-shot dropped when parent is Morrows/bar (mill-bridge EXTRA_EX instead).
- Coverage seeds in `START_META` fill edge + interior + descent (+ climb for Gwangsu) when induction is thin.
- Round3 recipe reused: Nemotron free → room-key → Jev placeable → hoisted Set → setmap → placement → people-only cast → mismatch gate. Jev kinds capped ≤250 chars (was 422 at 268).

## Graph coverage (steering: ~4–5 maps/scene; edge + interior + descent + ≥1 map 2 deep)

| World | Maps | Kinds (non-return) | Depths | Notes |
|---|---|---|---|---|
| morrows | 6 (morrows_start, morrows_n, morrows_crypt, morrows_chapel, morrows_road, morrows_chapel_deeper) | descent, door, edge | [0, 1, 2] | |
| bar | 6 (bar_start, bar_street, bar_manhole, bar_alley, bar_east, bar_street_deeper) | descent, door, edge | [0, 1, 2] | |
| louis | 6 (louis_start, louis_street, louis_stock, louis_vault, louis_side, louis_street_deeper) | descent, door, edge | [0, 1, 2] | |
| gwangsu | 4 (gwangsu_start, gwangsu_hall, gwangsu_roof, gwangsu_base) | climb, descent, door | [0, 1, 2] | |

### Per-world portal list

**Field of Morrows**
- `descent` morrows_start → morrows_crypt — a crypt beneath the gravestone
- `edge` morrows_start → morrows_n — a misty chapel yard beyond the stone wall
- `door` morrows_start → morrows_chapel — the ruined chapel nave
- `edge` morrows_start → morrows_road — the village road below the field

**Figgs & Potts**
- `door` bar_start → bar_street — Gottél night street outside Figgs & Potts
- `descent` bar_start → bar_manhole — a dripping understreet tunnel
- `door` bar_start → bar_alley — the back alley behind Figgs & Potts
- `edge` bar_start → bar_east — a neon noodle stall on the east curb
- `descent` bar_street → bar_street_deeper — a deeper chamber

**루이 뉘똥 샾**
- `door` louis_start → louis_street — 강남대로 sidewalk
- `door` louis_start → louis_stock — a [hboutique/backdoor]
- `descent` louis_start → louis_vault — a crypt beneath 계산대 뒤 계단
- `edge` louis_start → louis_side — the land beyond 옆 골목 쪽 비상문
- `door` louis_street → louis_street_deeper — 강남역 CROSSWALK Exits: [West] Revolving Door

**광수의 집**
- `door` gwangsu_start → gwangsu_hall — 복도
- `climb` gwangsu_start → gwangsu_roof — a [[Moonlit Landing]]
- `descent` gwangsu_hall → gwangsu_base — apartment hallway

## Quality (honest)
### What worked
- Dest-as-title after rebuild: chapel yard, crypt, ruined nave, village road, Gottél night street, manhole tunnel, alley, neon stall — readable and distinct from parent.
- Looks diverge: field→cave/temple/village; bar→cave for manhole; louis street→anime_town; vault→cave.
- All four worlds hit edge + door/interior + descent; Gwangsu has climb (roof via window); each has ≥1 depth-2 map.
- Renders: 24/24 color maps ok (includes refresh before/after).
- Gate place_match generally high (0.92–0.98).

### Weak / failed
- Mismatch gate still flags name-echo as copy even when place is new (Zankaris on Morrows children; Gottél/Figgs/Potts on bar depth-2; 루이 뉘똥 on louis_side; “louis vuitton” on louis_street_deeper):
  - `morrows_crypt` gate fail ['copied:zankaris'] title='A Crypt Beneath The Gravestone'
  - `morrows_chapel` gate fail ['copied:zankaris'] title='The ruined chapel nave'
  - `morrows_road` gate fail ['copied:zankaris'] title='The village road below the field'
  - `bar_east` gate fail ['copied:gottél'] title='A neon noodle stall on the east curb'
  - `bar_street_deeper` gate fail ['copied:gottél,figgs,potts'] title='Gottél, Lower Wards'
  - `louis_side` gate fail ['copied:루이 뉘똥'] title='The "VIP" Appointment'
  - `louis_street_deeper` gate fail ['copied:louis vuitton'] title='The Boutique'
- Early runs cloned Figgs & Potts / Morrows into children (few-shot bleed). Mitigated by EXTRA_EX + forced dest title, but **free title/bios prompts on disk still show Figgs few-shot in some Morrows crypt files** — opening text was overwritten; prompt store is historical.
- `louis_street_deeper` titled “The Boutique” / look boutique — depth-2 from sidewalk folded back into shop; weak.
- `louis_stock` / `louis_vault` titles still echo parent boutique name; set_lines are better (back corridor / hidden workshop).
- `gwangsu_*` titles mostly “광수의 집” variants — hall/roof/base under-differentiated in naming though set_lines differ.
- Induction alone often returned only 1–2 exits or edge-only; seeds did the coverage work.
- Approach B parse fragile (em-dashes, prose after Exits); do not use B for expansion without a stricter stop.

## Player-action refresh prototype (Morrows crypt only)
- Action: `ADVENTURER: Zankaris — the name on this stone isn't a stranger's. It's your brother's. She doesn't answer. The mist pulls toward the stairs under the gravestone.`
- Before: `morrows_crypt_before` title='The Awakening' set='A damp stone crypt: the stone stairs, the trapdoor/gravestone, the throne, the greatsword, biolumine'
- After: `morrows_crypt_after` title='The Field of Morrows' set='A crypt under a gravestone: the stone stairs, the sarcophagus, the stone table, the tea set, the wea'
- Idea: generate dest ahead, then revise the **unvisited** dest after a player line so context lands before first entry. Explorer shows both renders on the contact sheet (`morrows_crypt_before` / `_after`); not wired as a live rewrite button yet.
- Cost of refresh pair: see spend tag `world1/refresh` (~$0.018).
- **Refresh before bios still contain Figgs & Potts Came-from bleed** — treat as known defect in the prototype, not a clean result.

## Latency & cost
- **Total spend (world1/* tags): $0.3313** (budget $10).
- By tag bucket: bar=$0.0833, morrows=$0.0654, fix=$0.0499, louis=$0.0410, portal=$0.0310, gwangsu=$0.0249, refresh=$0.0176, smoke2=$0.0091, smoke=$0.0090.
- Per-map wall clock (n=20): sum 136s, avg 6.8s, max 10.1s.
- Portal induce alone ~$0.001–0.002/call; full child build ~$0.007–0.010.
- Most spend is Nemotron free opening (title/bios/tale); Tinker free tier opening still billed in our fx accounting when tagged.

## Paths
- Graph: `world1/world.json` + `world1/scenes/{morrows,bar,louis,gwangsu}_world.json`
- Scenes: `world1/scenes/<id>/{opening,map,meta,cast,prefix,world}.*`
- Renders: `world1/samples/renders/*_color.png`
- Explorer: `world1/explorer/` → published `fixion-pages/world1/`
- Code: `world1/lib/portal_induce.py`, `world1/lib/expand.py`, `run_worlds.py`, `rebuild_weak.py`, `render_all.py`
- Prompts: `PROMPTS.md`, store `round3/prompts/world1/`
- Logs: `world1/logs/{run_worlds,rebuild_weak,render_all,refresh,portal_compare}.*`

## Approval list (new prose before product reuse)
See PROMPTS.md. Short list: BIBLE_SYS, EXTRA_EX/EXITS, EX_EXITS, START_META seeds, child continuity splices, A/B judge rubric, name_destination prompts, refresh player-action line.

## If continuing
- Wire refresh as a real “revise unvisited dest” button on one explorer world.
- Tighten gate so character-name echo ≠ fail when set/look clearly changed.
- Strip remaining Figgs few-shot from free prompts when parent is Morrows (verify prompt store, not only opening.txt).
- Re-roll louis_street_deeper / gwangsu titles for clearer depth-2 identity.

---

# Quality pass v2 (2026-10-30)

Live: https://imaginalnika.github.io/fixion-benchmark-research/world1/ (v1 kept at `world1/v1/`). Code:
`lib/expand_v2.py` (generator), `rebuild_v2.py` (worlds + refresh; `ONLY=<ids>` for targeted rebuilds),
`render_all.py`, `draw_graph.py`, `metrics_v2.py`, `judge_ab_v2.py` (OpenRouter judge, blocked, see below),
`build_explorer.py`, `prompts_v2_section.py`, `prompts_v2_appendix.py`. Baseline untouched in `world1/v1/`. The
interrupted pass's interim maps (hand-forced titles, tags `world1/q2*`) are archived in `attic/q2_interim/`. I did
not use them: their titles and the refresh "after" destination were hand-written in `quality_rebuild.py`'s FORCE dict.
v2 keeps every title and destination model-written.

## What changed, per weakness

**1. Sparse/dark maps.** Root causes:
- (a) The client hard-wires two looks to hand scenes. `house` is 광수's room at midnight (a 42% deep-blue wash, lit
  only by its live lamp), and `bar` belongs to the Figgs & Potts slot (in the render slot it draws a grass floor). Every
  Gwangsu child was `house` and bar_street/bar_east were `bar`, hence the dark fields with a floating patch.
- (b) Too few props: placeable was capped at 7, and dressing only applied below 4 props.

Fix (`NO_GEN_LOOK`, `top_up`, `placeable11`):
- Generated maps never use `house`/`bar`: house→school; bar→anime_town outdoors, starship indoors.
- The placeable cap is now 11.
- Dressing tops up to ≥9 props from the look's own kinds, plus generic kinds the client draws in any look.

Measured on the in-client renders (map-area crop):

| | v1 | v2 |
|---|---|---|
| mean luminance (0-255) | 73.3 | 78.0 |
| maps with luminance < 40 | **7 / 18** | **1 / 18** (morrows_chapel, village look) |
| mean furnished share (named-prop cells / all cells) | 0.144 | 0.179 |
| Gwangsu children luminance | 26 / 27 / 26 | 60 / 68 / 93 |

**2. louis_street_deeper folded back to the boutique.** Root causes:
- The depth-2 exit was taken from the child's own Exits induction, and that list included the way back:
  `in → the boutique (through the glass front door)`.
- My first novelty test was Jaccard, which let "the boutique" pass against "a luxury bag boutique".

Fix: `deeper_exit()` rejects an exit if it:
- goes back or out the same way (overlaps the arrival feature or the return prop);
- leads to a place already on the trail (overlap coefficient for short names, Jaccard for long labels);
- has a route that names a trail place ("through the bar entrance");
- copies a few-shot destination.

The induction resamples up to 3×. The depth-2 heading also sees the whole trail (start scene + parent scene).
Results: louis_street_deeper Boutique→**Street** (beyond the courtyard), morrows_chapel_deeper→**Dungeon**,
bar_street_deeper→**Alleyway**. The judge scored louis_street_deeper's continuity v2 in both orders.

**3. Gwangsu titles under-differentiated.** v1 used the dest phrase as a forced title, and the bios step wrote 광수의
집 variants. Now the title is the **scene heading the base model writes for the next scene of the episode**. It is
drawn from ≥4 samples; any heading already on the trail, in the few-shot, or naming only the portal is dropped, then
Jev picks. Gwangsu: 광수의 집 (Gwang-su's Home) / (House) / Gwang-su's Home → **아파트 복도 / 옥상 / Twisted Metro
Station**. Titles that echo the start place: v1 8/18 (3 Gwangsu, 3 Louis incl. "The Boutique", 2 bar "…Figgs & Potts"), v2 0/18.

**4. Gate name-echo (Zankaris, Gottél, 루이).** Root cause: `gates.COPY` is one flat list of every hand-authored
world's names, built to catch few-shot copying in stand-alone openings. A portal child is *inside* its parent's world,
so Gottél on the street outside the bar, or Zankaris remembered in the crypt, is continuity, yet it failed as "copied".

Fix (`world_gate`): the Jev place question is unchanged; the copy check is scoped by world:
- the child's own world's place names are allowed;
- another world's names fail as `bleed:`;
- own-world cast in the child's CHARACTERS fail as `clone:`, unless they are the player (광수 / 주만) or party.

Party is cast who walked through with the player (named in the scene's CHARACTERS line, or named again in the
bios). Their canon `cast.json` bios are pre-filled, so the model can't re-invent them (run 6 had rewritten Zankaris as
an isekai'd man). Final: **v2 gate passes 18/18; the old v1 gate would pass 1/18 of the same maps** (v1 maps under the
old gate: 11/18).

**5. Refresh demo.** Root cause: v1's `build_child` never used `ctx['recent']`. The player line never reached any
prompt, so "after" was just another sample (titled "Field of Morrows"). The interim fix hand-wrote the after-destination.

Fix:
- The trail document carries the player line.
- The **tale continues the same episode document** (scene N right after the line and the step through the portal),
  not a fresh "Episode 1".
- A deed is given as the △ beat the game's narrator would write; a first-person "I pour…" △ line was ignored.
- 3 AFTER samples per line; Jev keeps the one that best shows the line.

Jev "does this place clearly show the consequences of the line" (0-1). The scores below use neutral, shuffled map
ids (`refresh_rescore.py`). My first scoring named maps by id (`…_after_oil_s0`) inside the question, which leaks the
intended line and inflated the numbers (oil 0.56 vs 0.24). Those are kept under `leaky_scores` in
`logs/refresh_v2.json`.

| map | shows the oil-and-match deed | shows the brother line |
|---|---|---|
| BEFORE (no line) "Burial Mound / Subterranean Ruins" | 0.09 | 0.14 |
| AFTER oil (kept sample; samples 0.33 / 0.13 / 0.12) "Passage under the Gravestone" | **0.33** | 0.12 |
| AFTER name (kept sample; samples 0.13 / 0.12 / 0.16) "Underneath the Gravestone" | 0.11 | 0.16 |

The oil AFTER set carries the deed: "the cracked gravestone above, **the oil-soaked entry fissure**…". BEFORE was "a
subterranean archive beneath a burial mound". The contrast is real but modest, and only 1 of 3 AFTER samples showed
it; selection does the work. The speech line ("Zankaris — … It's your brother's.") does **not** measurably change the
place (0.16 vs 0.14 BEFORE); treat it as unsolved. The explorer's "Refresh demo" view shows BEFORE / AFTER oil / AFTER
name side by side (`samples/REFRESH.png`).

**6. Figgs bleed into other worlds.** Two sources:
- (a) v1 portal induction few-shot the Morrows and Figgs & Potts module blocks for *every* world (`Gottél night
  street`, Figgs as occupant). v2's depth-2 induction uses only neutral AREAs: v1's mill bridge plus a NEW laundromat.
  The laundromat was itself copied once ("the night laundromat" as a destination), so `deeper_exit` now rejects
  few-shot destinations.
- (b) The genre-pool few-shot was the same research-station + space-deck pair for three worlds (bar_street came out as
  `EXT. SPACE`). Now pinned per world (`WORLD_SHOTS`), and few-shot headings count as "seen".

Check over the final maps' prompts and openings: no Figgs/Potts/Nuaz/Gottél outside the bar world, no
Zankaris/Vellichor outside Morrows (`bleed:` reason never fired in the final run).

**7. GRAPH.png.** Redrawn by `draw_graph.py`: one left-to-right tree per world, the portal kind on every edge, title
plus id/look per node. Font: Noto Sans CJK KR (already installed). Nanum Gothic has no "é", so Gottél drew as "Gott l".
CONTACT_SHEET.png covers the 18 generated maps, with Hangul titles.

## Judge: blind A/B v1 vs v2 (Opus 5.5)
The planned OpenRouter judge (`judge_ab_v2.py`) was **blocked**: the only working key has $9.79 left, below the fx
`$10` guard (shared with chat.imaginalnika.com), and `/workspace/openrouter.env` returns 401. I did not override the
guard. Instead, four **Opus 5.5 Claude Code subagents** judged blind:
- fresh context each; they read only `/tmp/abjudge/passXY/`;
- neutral file names; the key is in `logs/ab_subagent_key.json`;
- version-neutral parent text (start scene + seed portal);
- the same rubric as `judge_ab_v2.SYSTEM`;
- 18 pairs, each judged twice with the order swapped by different agents.

A map wins a criterion only if it wins both orders.

| criterion | v2 | v1 | split/tie |
|---|---|---|---|
| **overall** | **11** | 4 | 3 |
| legible | 13 | 5 | 0 |
| matches own title/set | 10 | 5 | 3 |
| continuity (new place, right for portal) | 11 | 4 | 3 |

- Per call: v2 won overall 25/36 (legible 26/36). Position check: the first-shown map won 17/36.
- **v2 losses:** morrows_chapel ("Ruined Town" through a chapel door: dark village look), morrows_n, louis_street
  ("Courtyard", wuxia look: "implausible behind a boutique's glass door"), bar_street_deeper.
- **Splits:** bar_manhole, louis_street_deeper, morrows_chapel_deeper.

Rows: `logs/judge_ab_v2.jsonl`; summary: `logs/judge_ab_v2_summary.json`.

## Latency per map (final build, 18 maps, warm sprite cache)

| map | v1 title | v2 title | lum v1→v2 | furnished v1→v2 | wall s | heading / tale+bios / map s | attempts | LLM $ |
|---|---|---|---|---|---|---|---|---|
| morrows_n | A misty chapel yard beyond the stone wall | Twisting Wood | 94→52 | 0.24→0.28 | 11.7 | 4.0 / 4.9 / 0.7 | 1 | $0.0072 |
| morrows_crypt | A Crypt Beneath The Gravestone | The Catacombs | 65→51 | 0.20→0.07 | 16.5 | 4.4 / 8.7 / 0.9 | 1 | $0.0085 |
| morrows_chapel | The ruined chapel nave | Ruined Town | 81→38 | 0.25→0.25 | 16.9 | 4.4 / 7.7 / 1.3 | 1 | $0.0091 |
| morrows_road | The village road below the field | Forest Path | 36→51 | 0.16→0.25 | 10.3 | 4.2 / 3.9 / 0.4 | 1 | $0.0065 |
| morrows_chapel_deeper | A Deeper Chamber | Dungeon | 60→60 | 0.07→0.16 | 11.7 | 3.2 / 4.7 / 1.6 | 1 | $0.0068 |
| bar_street | Gottél night street outside Figgs & Potts | Street | 35→93 | 0.10→0.21 | 18.6 | 6.7 / 7.3 / 1.4 | 2 | $0.0118 |
| bar_manhole | A dripping understreet tunnel | Sewers | 53→55 | 0.16→0.22 | 14.6 | 3.6 / 7.6 / 1.0 | 1 | $0.0088 |
| bar_alley | The back alley behind Figgs & Potts | A Back Alley | 39→93 | 0.10→0.19 | 14.5 | 3.8 / 7.6 / 0.7 | 1 | $0.0092 |
| bar_east | A neon noodle stall on the east curb | Street | 36→85 | 0.18→0.15 | 17.4 | 6.0 / 8.8 / 0.8 | 1 | $0.0117 |
| bar_street_deeper | Gottél, Lower Wards | Alleyway | 58→93 | 0.25→0.22 | 13.8 | 4.0 / 7.2 / 0.7 | 1 | $0.0095 |
| louis_street | 강남대로 Sidewalk | Courtyard | 92→77 | 0.31→0.12 | 17.0 | 4.5 / 8.5 / 1.3 | 1 | $0.0090 |
| louis_stock | 루이 뉘똥 샾 (Louis Nuidong Shop) | 직원 통로 / 백룸 | 180→178 | 0.03→0.09 | 16.4 | 4.3 / 8.8 / 1.0 | 1 | $0.0092 |
| louis_vault | 루이 뉘똥 샾 (Louis Nuidang Shop) | 주만의 공간 | 58→76 | 0.07→0.07 | 16.4 | 3.6 / 8.7 / 1.4 | 1 | $0.0096 |
| louis_side | The "VIP" Appointment | Side Alley | 181→85 | 0.07→0.12 | 14.7 | 5.6 / 5.9 / 0.7 | 1 | $0.0092 |
| louis_street_deeper | The Boutique | Street | 173→95 | 0.20→0.24 | 12.9 | 4.0 / 5.3 / 1.7 | 1 | $0.0079 |
| gwangsu_hall | 광수의 집 (Gwang-su's Home) | 아파트 복도 | 26→60 | 0.04→0.11 | 17.6 | 4.7 / 9.0 / 0.8 | 1 | $0.0097 |
| gwangsu_roof | 광수의 집 (Gwang-su's House) | 옥상 | 26→68 | 0.12→0.26 | 17.8 | 3.4 / 10.4 / 0.7 | 1 | $0.0090 |
| gwangsu_base | Gwang-su's Home | Twisted Metro Station | 26→93 | 0.04→0.20 | 17.5 | 3.8 / 9.4 / 1.3 | 1 | $0.0092 |

- **Wall time:** mean **15.4 s**, median 16.4 s, max 18.6 s; 16.7 s including gate retries. v1 was 6.8 s.
- **Where the time goes:** heading 4.3 s (≥4 sequential samples + 2 Jev calls) and tale+bios 7.5 s (bios can run twice
  when more party appear). Map build is 1.0 s with a warm cache.
- **Cold sprites:** the first build of new prop kinds spends 30-75 s in forge3 (Opus writes the sprite program).
- **Easy wins not done:** run the heading samples concurrently (≈−3 s), and start the room-key induce while the bios
  run.
- **Refresh:** each AFTER map is 9-15 s, so a revision of an unopened portal fits inside a few player turns.
- **LLM cost:** $0.0090 per map (+ forge3 sprites when kinds are new).

## Spend
`logs/spend_v2_total.json`. This pass: **$4.77**. That splits into:
- forge3 sprites $2.97: ten full or partial rebuilds forged new prop kinds; most of the forge cost was in early runs;
- Nemotron (Tinker) $1.55;
- Jev $0.18;
- OpenRouter $0.03.

forge3 spend is counted by time window (forge3 calls are tagged `forge3/…`, not `world1/…`), so it may include another agent's sprite work in the same window. Before this pass: world1 tags $0.83 + forge3 $0.88. **World1 all-in: $6.48 of the $10 cap.** Subagent judging used
no API budget. Per-run log: `logs/spend_v2_runs.jsonl`.

## Remaining problems
- **Generic headings:** "Street" ×3 (bar_street, bar_east, louis_street_deeper), "Dungeon", "Alleyway". The base model
  writes terse scene slugs, so titles are distinct within a world but bland; bar has 4/5 distinct titles (two
  "Street"). A follow-up could keep the slug as the title and show the room-key label as a subtitle.
- **Look classification is still off sometimes:** louis_street "Courtyard" got the wuxia look (judge: wrong behind a
  boutique door); morrows_chapel "Ruined Town" through a chapel door is dark (village look tint). Both lost the A/B.
- **Two v1 maps were better:** morrows_n and morrows_chapel. Furnished share fell on morrows_crypt (0.20→0.07) and
  louis_street (0.31→0.12).
- **Refresh:** a physical deed propagates (0.33 vs 0.09, neutral ids), but speech alone does not change the place,
  and only 1 of 3 AFTER samples showed the deed. The demo relies on Jev selection.
- **Party crowding:** the bar's regulars (Nuaz, Yara, Vell) now follow the player into bar_east as party. That is
  canon-consistent but crowded.
- **Few-shot copying is persistent:** Observation Deck, the laundromat. Filters catch exact copies, not paraphrases.
- **Two judges couldn't run:** the OpenRouter Opus judge (budget guard) and Jev (no image input). The A/B is from
  Opus 5.5 subagents; re-run `judge_ab_v2.py` once the key is topped up for the scripted version.
- Latency doubled vs v1 (see above).

## New / changed prompts awaiting Josh's approval
Full text in PROMPTS.md § "Quality pass v2"; every v2 prompt byte-exact in its appendix.
- [NEW] `BEAT` portal-step △ templates (door / descent / climb / edge, filled with the player name + portal feature;
  depth 2 appends "toward {induced destination}")
- [NEW] episode-trail heading document: scene slug `N.  INT.|EXT.  PLACE`, prefilled `N.  INT. ` / `EXT. `
- [NEW] `JEV_PICK` (choice over candidate headings) and `JEV_PLACE` (is the heading a place)
- [CHANGED] tale = continuation of the episode document (was a fresh "Episode 1" tale after the bios)
- [CHANGED] bios △ trail lines (Before this / the player line / BEAT / Now / the scene's first beats) and canon party
  bios pre-filled; replaces v1's `[Came from a different map … Do not reuse characters …]` bracket and forced title
- [CHANGED] `WORLD_SHOTS` pinned genre-pool few-shots per world
- [NEW] `EXTRA_EX2` laundromat Exits few-shot (v1's mill bridge is also still unapproved)
- [NEW] refresh player lines (speech + narrated deed) and the refresh Jev check
- [NEW] A/B judge system prompt (used verbatim by the subagent judges)
- Code-only (no prompt text): world-scoped gate, novelty / deeper-exit filters, NO_GEN_LOOK, dressing top-up,
  placeable cap 11.
