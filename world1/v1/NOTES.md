# NOTES.md — world1 portal research
Research-only under `/workspace/fixion-content/world1/`. Did **not** ship, PR, or push `fixion`. Did **not** touch `/workspace/drdr-dr`. Temporary GitHub Pages explorer only.

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
