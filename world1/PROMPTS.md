# PROMPTS.md — world1 portal research (byte-exact where saved)
Research-only. Work under `/workspace/fixion-content/world1/`. Not shipped to Fixion Main.
All model calls tagged `world1/...` in `round3/logs/spend.jsonl`.
Prompt store: `round3/prompts/world1/` (319 files). Local copies of induction compares: `world1/prompts/`.

## Flag legend
- **NEW** — authored for this portal research (not in round3 recipe before).
- **REUSED** — round3 free/cast/placeable/setmap/place/gate stack, with portal continuity lines spliced in.
- **FORCED** — destination title / arrival / world lines injected after free gen to stop parent cloning.

---
## NEW text embedded in code

### NEW: EX_EXITS (portal_induce.py)

```
EX_EXITS = {
    'morrows': ('north → the ruined chapel yard (through a gap in the old stone wall); '
                'down → a crypt under the gravestone (stone stairs); '
                'south → the village road (along the path)'),
    'bar': ('south → Gottél night street (through the front door); '
            'east → a steaming understreet (down the manhole); '
            'north → the back alley (through the back door)'),
}
```

### NEW: EXTRA_EX / EXTRA_EXITS (mill bridge few-shot, avoids cloning parent)

```
EXTRA_EX = dict(
    heading='THE MILL BRIDGE', ie='EXT.', label='a stone bridge over a black canal',
    props=['the bridge railing', 'a rusted winch', 'the canal ladder', 'a watch lamp', 'the toll booth'],
    where={'Merr': 'the toll booth'}, cast=['Merr'], personal={},
)
EXTRA_EXITS = ('east → the lower docks (down the canal ladder); '
               'west → the mill yard (across the bridge); '
               'north → a toll house loft (up the booth stair)')
```

### NEW: BIBLE_SYS (Approach B system prompt)

```
BIBLE_SYS = (
    'A strange and interesting world. Script location bible (场景设定): every place is one small set '
    '(a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. '
    'Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, '
    'windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.'
)
```

### NEW: START_META portal seeds (expand.py)

Hand seeds ensure each start covers edge + door/interior + descent (and climb for Gwangsu) when induction is thin.

```python
START_META = {
    'morrows': dict(
        key='morrows', genre=dict(key='kingdom', line='High fantasy isekai.'),
        heading='FIELD OF MORROWS', label='a field of old graves',
        title='Field of Morrows',
        props=['the gravestone', "Zankaris's sword", 'the dead tree', 'the old stone wall',
               'an old grave marker', 'the wildflowers', 'the path'],
        where={'Zankaris': 'the gravestone', 'Vellichor': 'the gravestone'},
        cast=['Zankaris', 'Vellichor'],
        # Seeded portal anchors on the REAL map (tile = standable cell next to the feature).
        # kind + feature_name used for explorer labels; dest filled by induction when possible.
        portal_seeds=[
            dict(id='morrows_n', kind='edge', dir='north', tile=[8, 0], feature='the north mist',
                 label='north edge — into the mist'),
            dict(id='morrows_crypt', kind='descent', dir='down', tile=[7, 8], feature='the gravestone',
                 label='down the crypt under the gravestone'),
            dict(id='morrows_chapel', kind='door', dir='into chapel', tile=[6, 1], feature='a gap in the old stone wall',
                 label='enter the ruined chapel'),
            dict(id='morrows_road', kind='edge', dir='south', tile=[8, 15], feature='the path',
                 label='south along the path'),
        ],
    ),
    'bar': dict(
        key='bar', genre=dict(key='anime', line='Cyberpunk fantasy.'),  # key unused for pool pick; line matters
        heading='FIGGS & POTTS', label='a bar',
        title='Figgs & Potts',
        props=['the bar counter', 'the beer taps', 'the bottle shelf', 'the booth', 'a stool', 'a table',
               'the jukebox', 'the arcade cabinet', "Potts's charging pad", 'a potted plant', 'the window', 'the door'],
        where={'Figgs': 'the bar counter', 'Nuaz': 'the bar counter', 'Potts': "Potts's charging pad"},
        cast=['Figgs', 'Nuaz', 'Potts', 'Yara', 'Vell'],
        portal_seeds=[
            dict(id='bar_street', kind='door', dir='south', tile=[7, 16], feature='the front door',
                 label='out the front door onto the street'),
            dict(id='bar_manhole', kind='descent', dir='down', tile=[12, 20], feature='a steaming manhole',
                 label='down the steaming manhole'),
            dict(id='bar_alley', kind='door', dir='north', tile=[12, 29], feature='a back door',
                 label='through the back door into the alley'),
            dict(id='bar_east', kind='edge', dir='east', tile=[14, 16], feature='the street east',
                 label='east along the night street'),
        ],
    ),
    'louis': dict(
        key='louis', genre=dict(key='anime', line='Modern Seoul. Luxury retail.'),
        heading='루이 뉘똥 샾', label='a luxury bag boutique',
        title='루이 뉘똥 샾',
        props=['유리 진열장', '벽 선반의 가방들', '받침대 위의 가방', '계산대', '전신 거울', '벨벳 벤치', '화분', '유리문'],
        where={'점원': '계산대', '젬마': '벨벳 벤치'},
        cast=['송 사장', '젬마', '점원'],
        portal_seeds=[
            dict(id='louis_street', kind='door', dir='south', tile=[7, 14], feature='유리문',
                 label='출입문으로 거리로'),
            dict(id='louis_stock', kind='door', dir='into stockroom', tile=[1, 2], feature='직원 통로',
                 label='직원 통로로 창고에'),
            dict(id='louis_vault', kind='descent', dir='down', tile=[4, 5], feature='계산대 뒤 계단',
                 label='계산대 뒤 계단으로 금고실에'),
            dict(id='louis_side', kind='edge', dir='east', tile=[13, 7], feature='옆 골목 쪽 비상문',
                 label='비상문으로 옆 골목'),
        ],
    ),
    'gwangsu': dict(
        key='gwangsu', genre=dict(key='anime', line='Modern Korean apartment, late night.'),
        heading='광수의 집', label='a small apartment at midnight',
        title='광수의 집',
        props=['침대', '협탁 위의 휴대폰', '스탠드', '약병', '벽에 걸린 사진', '창문', '옷장', '현관문'],
        where={'송 박사': '침대', '민수': '소파'},
        cast=['송 박사', '민수', '히리야 상'],
        portal_seeds=[
            dict(id='gwangsu_hall', kind='door', dir='south', tile=[7, 14], feature='현관문',
                 label='현관문으로 복도에'),
            dict(id='gwangsu_roof', kind='climb', dir='up', tile=[7, 1], feature='창문',
                 label='창문 밖 화재 탈출 사다리로 옥상에'),
            dict(id='gwangsu_base', kind='descent', dir='down', tile=[7, 14], feature='복도 엘리베이터',
                 label='(via hallway) 엘리베이터로 지하에', via='gwangsu_hall'),
            dict(id='gwangsu_neighbor', kind='door', dir='into neighbor', tile=[7, 14], feature='옆집 문',
                 label='(via hallway) 옆집 문에', via='gwangsu_hall'),
        ],
    ),
}
```

### NEW / FORCED: child continuity lines (expand.child_opening)

After free title/bios/tale, child openings are rebuilt so the destination world is explicit and parent scene is not cloned. Key forced phrases include destination title as map title, `Came from: <parent>`, arrival via portal how/feature, and a one-line world blurb for the dest.

---
## Approach A vs B induction prompts (as saved under world1/prompts/)
These files are whatever was written during smoke/compare runs (full chat prompts or raw model Exits fragments). Treat each as the on-disk artifact.

### `portal_a_morrows.txt` — NEW induction artifact

```
AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).
Exits: south → Gottél night street (through the front door); east → a steaming understreet (down the manhole); north → the back alley (through the back door)

AREA 1. THE MILL BRIDGE
A stone bridge over a black canal.
Features: the bridge railing, a rusted winch, the canal ladder, a watch lamp, the toll booth.
Occupants: Merr (at the toll booth).
Exits: east → the lower docks (down the canal ladder); west → the mill yard (across the bridge); north → a toll house loft (up the booth stair)

AREA 1. FIELD OF MORROWS
A field of old graves.
Features: the gravestone, Zankaris's sword, the dead tree, the old stone wall, an old grave marker, the wildflowers, the path.
Occupants: Zankaris (at the gravestone); Vellichor (at the gravestone).
Exits:
Exits: east → the Candlewicks (along the path); north → Gottél night street (along the path)
```

### `portal_b_morrows.txt` — NEW induction artifact

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — Field of Morrows

△ High fantasy isekai.
△ In the field of morrows, the female knight Zankaris is in front of a gravestone.

PLACES

1. FIELD OF MORROWS
CHARACTERS: Zankaris, Vellichor
△ A field of old graves.

Exits:
Exits: CRYPT (down the stair hidden beneath the central statue).
BIBLE: Field of Morrows. The wind smells of iron and old rain. Headstones lean like rotten teeth. In the center, a weeping angel statue covers a stairwell. Zankaris stands before a fresh grave — raw earth, no name. Vellichor sits on a broken pillar, reading a book
```

### `portal_bar.txt` — NEW induction artifact

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — Last Call at Figgs & Potts

△ Cyberpunk fantasy.
△ A subterranean vault-bar in the Goblin Market

PLACES

1. LAST CALL AT FIGGS & POTTS
CHARACTERS: Figgs, Potts, Kell, Moss, Vex
△ A subterranean vault-bar in the Goblin Market.

Exits:
Exits: 
- A heavy oak door banded with cold iron → THE GOBLIN MARKET (alley behind the bar).
- A trapdoor behind the bar, rusted shut → THE KEG CELLAR.
- A narrow stairwell down past the loos → THE UNDERCITY TUNNELS.
```

### `portal_bar_re.txt` — NEW induction artifact

```
AREA 1. FIELD OF MORROWS
A field of old graves.
Features: the gravestone, Zankaris's sword, the dead tree, the old stone wall, an old grave marker, the wildflowers, the path.
Occupants: Zankaris (at the gravestone); Vellichor (at the gravestone).
Exits: north → the ruined chapel yard (through a gap in the old stone wall); down → a crypt under the gravestone (stone stairs); south → the village road (along the path)

AREA 1. THE MILL BRIDGE
A stone bridge over a black canal.
Features: the bridge railing, a rusted winch, the canal ladder, a watch lamp, the toll booth.
Occupants: Merr (at the toll booth).
Exits: east → the lower docks (down the canal ladder); west → the mill yard (across the bridge); north → a toll house loft (up the booth stair)

AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).
Exits:
Exits: out → the city street (through the door).
```

### `portal_gwangsu.txt` — NEW induction artifact

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — 광수의 집 (Gwang-su's Home)

△ Modern Korean apartment, late night.
△ A lived-in apartment

PLACES

1. 광수의 집 (GWANG-SU'S HOME)
CHARACTERS: Gyeong-hee
△ A lived-in apartment.

Exits:
Exits: front door → apartment hallway.
```

### `portal_louis.txt` — NEW induction artifact

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — 강남대로 Sidewalk

△ Modern Seoul. Luxury retail.
△ A sidewalk outside a luxury boutique in Gangnam, Seoul

PLACES

1. 강남대로 SIDEWALK
CHARACTERS: Clerk, Security Guard, Passersby, Street Vendor
△ A sidewalk outside a luxury boutique in Gangnam, Seoul.

Exits:
Exits: [South] Crosswalk → 강남역 CROSSWALK
Exits: [West] Revolving Door → BOUTIQUE Interior
```

### `portal_morrows.txt` — NEW induction artifact

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — The Field of Morrows

△ High fantasy isekai.
△ A field of graves and wild grass

PLACES

1. THE FIELD OF MORROWS
CHARACTERS: nobody
△ A field of graves and wild grass.

Exits:
Exits: The Weeping Gate (north, iron gate set in a low stone wall)
```

### `portal_morrows_re.txt` — NEW induction artifact

```
AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).
Exits: south → Gottél night street (through the front door); east → a steaming understreet (down the manhole); north → the back alley (through the back door)

AREA 1. THE MILL BRIDGE
A stone bridge over a black canal.
Features: the bridge railing, a rusted winch, the canal ladder, a watch lamp, the toll booth.
Occupants: Merr (at the toll booth).
Exits: east → the lower docks (down the canal ladder); west → the mill yard (across the bridge); north → a toll house loft (up the booth stair)

AREA 1. FIELD OF MORROWS
A field of old graves.
Features: the gravestone, Zankaris's sword, the dead tree, the old stone wall, an old grave marker, the wildflowers, the path.
Occupants: Zankaris (at the gravestone); Vellichor (at the gravestone).
Exits:
Exits: south → the mill yard; east → the forest path; west → the market square
```

---
## Representative child prompts from `round3/prompts/world1/` (byte-exact, headers stripped)
Full tree has 319 files (free title/bios/tale, ind/module, cast, placeable, place, gate, portal a/b/judge/name). Below: one sample per family.

### `prompts/world1/portal/a_morrows_re/219ae118ad11.txt`

```
AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).
Exits: south → Gottél night street (through the front door); east → a steaming understreet (down the manhole); north → the back alley (through the back door)

AREA 1. THE MILL BRIDGE
A stone bridge over a black canal.
Features: the bridge railing, a rusted winch, the canal ladder, a watch lamp, the toll booth.
Occupants: Merr (at the toll booth).
Exits: east → the lower docks (down the canal ladder); west → the mill yard (across the bridge); north → a toll house loft (up the booth stair)

AREA 1. FIELD OF MORROWS
A field of old graves.
Features: the gravestone, Zankaris's sword, the dead tree, the old stone wall, an old grave marker, the wildflowers, the path.
Occupants: Zankaris (at the gravestone); Vellichor (at the gravestone).
Exits:
```

### `prompts/world1/portal/b_morrows/30ae53075d7e.txt`

```
<|im_start|>system
A strange and interesting world. Script location bible (场景设定): every place is one small set (a room, a shopfront, a corner of a street, a crypt), with the people found there and its exits. Exits name a destination and how you get there; they may be compass edges, doors, stairs, hatches, wells, windows you climb through, or anything else that is a gate between maps. Destinations are nearby and concrete.
<|im_end|>

Episode 1 — Field of Morrows

△ High fantasy isekai.
△ the field of morrows, an open misty meadow of old graves in a high-fantasy world

PLACES

1. FIELD OF MORROWS
CHARACTERS: Zankaris, Vellichor
△ A field of old graves.

Exits:
```

### `prompts/world1/portal/judge_morrows/4607676f92cd.txt`

```
[
 {
  "role": "user",
  "content": "We are extending a Fixion game map with PORTALS (gates to other maps: edges, doors, descents, climbs).\nStart place: a field of old graves\n\nAPPROACH A (tabletop module Exits):\nExits: east → the Candlewicks (along the path); north → Gottél night street (along the path)\n\nAPPROACH B (location-bible Exits):\nExits: CRYPT (down the stair hidden beneath the central statue).\nBIBLE: Field of Morrows. The wind smells of iron and old rain. Headstones lean like rotten teeth. In the center, a weeping angel statue covers a stairwell. Zankaris stands before a fresh grave — raw earth, no name. Vellichor sits on a broken pillar, reading a book\n\nWhich approach produced better portals for a small connected world the player can walk? Prefer: (1) concrete nearby destinations in the SAME world/story, (2) mix of portal kinds (not only compass edges — include at least one door-into-interior and one descent if the place allows), (3) short how-clauses that name a real feature, (4) not cliché tourist destinations. Reply JSON only: {\"winner\":\"A\"|\"B\",\"why\":\"one sentence\",\"score_a\":1-5,\"score_b\":1-5}"
 }
]
```

### `prompts/world1/portal/name_morrows_road_re/96958b622e35.txt`

```
From a field of old graves, by the path.
Exits: south →
```

### `prompts/world1/portal/name_bar_street/3a198f295d63.txt`

```
From a bar, by the front door.
Exits: south →
```

### `prompts/world1/morrows/morrows_crypt/ind/module/436c0fdefff1.txt`

```
<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Cyberpunk fantasy.
<|im_end|>

Episode 1 — Figgs & Potts

△ Cyberpunk fantasy world.
△ Capital city of Gottél, home to mechatronix.
△ Figgs & Potts is a fairly empty bar in the suburbs of Gottél.

CHARACTERS

FIGGS (Man, 52) — Owner and bartender of Figgs & Potts. Friendly to regulars. Loves draft beer but keeps wine, whiskey, etc. for anything a customer might want.

NUAZ (Woman, late 20s) — Regular at Figgs & Potts. Sits with her boots on the table, plays on a tablet. Works as a freelance “resolver” (mercenary/hacker/fixer). Sarcastic and crass. Cybernetic arm, cybernetic eyes. Reasonably maintains her cybernetics but sometimes has glitches. Childhood friend of Yara. Ex-girlfriend of Vell. She has a small floating drone companion named “Buzz.”

YARA (Woman, late 20s) — Nuaz’s childhood friend. Works a corporate job at a high-rise in the city center. Dresses professionally. Polished, anxious, secretly unhappy. She visits the bar occasionally to see Nuaz.

VELL (Man, early 30s) — Nuaz’s ex-boyfriend. A "corporate fixer" / high-end mercenary. Sleek, expensive cybernetics. Charming but ruthless. He and Nuaz had a bad breakup involving a job gone wrong. He shows up at the bar to "reconnect" or hire her.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. FIGGS & POTTS  NIGHT  INT.

CHARACTERS: Figgs, Nuaz, Potts, Yara, Vell

△ A bar in cyberpunk world. Figgs, the bartender, chats with Nuaz across the counter. Potts is in the corner. Nobody else here.
△ A new adventurer (man, early 30s) walks in and comes up to the bar.

AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Creation myth. The gods are young.
<|im_end|>

Episode 1 — The Not-Yet World

△ Creation myth. The gods are young.
△ At a cliffside at the edge of the everything, a group of young gods sit around a fire.

CHARACTERS

VHUL (God, Ageless) — The Eldest. The First to wake. He did not make the fire; he *is* the fire. He speaks in certainties. He holds the Shape of Things. He is tired of the dark.

SOLA (Goddess, Ageless) — The Second. She did not wake; she was *sung* awake by Vhul. She holds the Light of Things. She is bright, sharp, and cruel in her kindness. She wants the dark to end.

MOIRA (God, Ageless) — The Third. He woke to the sound of Vhul and Sola arguing. He holds the *End* of Things. He is quiet, patient, and already bored. He knows how the story finishes.

KIRA (God, Ageless) — The Fourth. She woke because she was curious. She holds the *Chance* of Things. She is chaotic, loud, and delighted. She wants the story to *not* finish.

THE DRUDGE (Entity, Ageless) — Not a god. The cleanup crew. Sweeps ash. Mops starlight. Mutters. Has seen ten thousand universes born and die. Just wants overtime pay.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. EXT. CLIFFSIDE — ETERNAL TWILIGHT

CHARACTERS: Vhul, Sola, Moira, Kira, The Drudge, NEW GOD

△ Young gods around a fire at the edge of everything.
△ A new god wakes up.
△ The new god is the God of Small Things.

AREA 1. THE NOT-YET WORLD
A cliffside at the edge of existence.
Features: the fire, the cliff edge, the void below, the stacked stones, the driftwood pile, the Drudge's cart, the waking stone.
Occupants: Vhul (at the fire); Sola (at the fire); Moira (at the fire); Kira (at the fire); The Drudge (at the Drudge's cart).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: High fantasy isekai.
<|im_end|>

 A Crypt Beneath The Gravestone

△ High fantasy isekai.
△ This place is a crypt beneath the gravestone.
△ The adventurer has just arrived from Field of Morrows via the gravestone.
△ The adventurer is a middle-aged salaryman reincarnated as a skeleton. He is confused.

CHARACTERS

THE ADVENTURER (Man, 40s soul / Ageless body) — Former middle-management salaryman. Died of overwork (karoshi). Reincarnated as a sentient skeleton with [Appraisal] and [Inventory] skills. Retains his corporate mindset: risk-averse, process-oriented, politely terrified. Speaks in internal monologue (polite Japanese corporate keigo) and external rattling. Just wants a stable "job" and to not be exorcised.

ZANKARIS (Ghost, Ancient) — The ghost bound to the sword atop the gravestone. Former Hero King. Bored, cynical, sarcastic. Acts as unwilling tutorial NPC. Wants the Adventurer to pull the sword so he can finally move on / possess a body / see the sun.

THE DRUDGE (Entity, Ageless) — The same cleanup entity from the Creation Myth. Sweeps bone dust. Mops ectoplasm. Mutters about "another one." Unionized across realities. Offers cryptic hints disguised as complaints.

MORGRAVE (Lich, 400s) — The dungeon boss. A lich who uses the crypt as a phylactery storage / vacation home. Bureaucratic, pedantic, terrifyingly powerful. Treats adventurers as "unauthorized intruders / paperwork violations."

RATTLE (Familiar, Tiny) — A skeletal rat the Adventurer accidentally summons/tames. Communicates via squeaks and [System] notifications. The Adventurer treats it like a junior colleague.
<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  INT. CRYPT BENEATH THE GRAVESTONE — CONTINUOUS

CHARACTERS: The Adventurer, Zankaris (voice), The Drudge, Rattle

△ High fantasy isekai.
△ The Adventurer (skeleton salaryman) wakes up in a stone coffin.
△ Zankaris (ghost) speaks from the sword above.

AREA 1.
```

### `prompts/world1/morrows/morrows_crypt/free/title/79312748ab03.txt`

```
<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Cyberpunk fantasy.
<|im_end|>

Episode 1 — Figgs & Potts

△ Cyberpunk fantasy world.
△ Capital city of Gottél, home to mechatronix.
△ Figgs & Potts is a fairly empty bar in the suburbs of Gottél.

CHARACTERS

FIGGS (Man, 52) — Owner and bartender of Figgs & Potts. Friendly to regulars. Loves draft beer but keeps wine, whiskey, etc. for anything a customer might want.

NUAZ (Woman, late 20s) — Regular at Figgs & Potts. Sits with her boots on the table, plays on a tablet. Works as a freelance “resolver” (mercenary/hacker/fixer). Sarcastic and crass. Cybernetic arm, cybernetic eyes. Reasonably maintains her cybernetics but sometimes has glitches. Childhood friend of Yara. Ex-girlfriend of Vell. She has a small floating drone companion named “Buzz.”

YARA (Woman, late 20s) — Nuaz’s childhood friend. Works a corporate job at a high-rise in the city center. Dresses professionally. Polished, anxious, secretly unhappy. She visits the bar occasionally to see Nuaz.

VELL (Man, early 30s) — Nuaz’s ex-boyfriend. A "corporate fixer" / high-end mercenary. Sleek, expensive cybernetics. Charming but ruthless. He and Nuaz had a bad breakup involving a job gone wrong. He shows up at the bar to "reconnect" or hire her.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. FIGGS & POTTS  NIGHT  INT.

CHARACTERS: Figgs, Nuaz, Potts, Yara, Vell

△ A bar in cyberpunk world. Figgs, the bartender, chats with Nuaz across the counter. Potts is in the corner. Nobody else here.
△ A new adventurer (man, early 30s) walks in and comes up to the bar.

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Creation myth. The gods are young.
<|im_end|>

Episode 1 — The Not-Yet World

△ Creation myth. The gods are young.
△ At a cliffside at the edge of the everything, a group of young gods sit around a fire.

CHARACTERS

VHUL (God, Ageless) — The Eldest. The First to wake. He did not make the fire; he *is* the fire. He speaks in certainties. He holds the Shape of Things. He is tired of the dark.

SOLA (Goddess, Ageless) — The Second. She did not wake; she was *sung* awake by Vhul. She holds the Light of Things. She is bright, sharp, and cruel in her kindness. She wants the dark to end.

MOIRA (God, Ageless) — The Third. He woke to the sound of Vhul and Sola arguing. He holds the *End* of Things. He is quiet, patient, and already bored. He knows how the story finishes.

KIRA (God, Ageless) — The Fourth. She woke because she was curious. She holds the *Chance* of Things. She is chaotic, loud, and delighted. She wants the story to *not* finish.

THE DRUDGE (Entity, Ageless) — Not a god. The cleanup crew. Sweeps ash. Mops starlight. Mutters. Has seen ten thousand universes born and die. Just wants overtime pay.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. EXT. CLIFFSIDE — ETERNAL TWILIGHT

CHARACTERS: Vhul, Sola, Moira, Kira, The Drudge, NEW GOD

△ Young gods around a fire at the edge of everything.
△ A new god wakes up.
△ The new god is the God of Small Things.

[Came from: Field of Morrows — a field of old graves. Set: a field of old graves: the gravestone, Zankaris's sword, the dead tree, the old stone wall, an old grave marker, the wildflowers, the path. Recent: the field of morrows, an open misty meadow of old graves in a high-fantasy world]

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: High fantasy isekai.
<|im_end|>

Episode 1 —
```

### `prompts/world1/morrows/morrows_n/cast/2e1c936466a5.txt`

```
{
 "state": {
  "cast": {
   "THE ADVENTURER": "Man, late 20s",
   "GUARD CAPTAIN THORNE": "Man, 50s",
   "SCRIBE PENN": "Non-binary, 30s",
   "OLD MARA": "Woman, 70s"
  }
 },
 "questions": {
  "c0": {
   "type": "noul",
   "instructions": "Could THE ADVENTURER stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c1": {
   "type": "noul",
   "instructions": "Could GUARD CAPTAIN THORNE stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c2": {
   "type": "noul",
   "instructions": "Could SCRIBE PENN stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c3": {
   "type": "noul",
   "instructions": "Could OLD MARA stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  }
 }
}
```

### `prompts/world1/bar/bar_street/cast/826d810e8545.txt`

```
{
 "state": {
  "cast": {
   "ZANKARIS": "Woman, 21",
   "VELLICHOR": "Unicorn, Ageless",
   "FIGGS": "Entity, Ageless",
   "POTTS": "AI, Ageless"
  }
 },
 "questions": {
  "c0": {
   "type": "noul",
   "instructions": "Could ZANKARIS stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c1": {
   "type": "noul",
   "instructions": "Could VELLICHOR stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c2": {
   "type": "noul",
   "instructions": "Could FIGGS stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  },
  "c3": {
   "type": "noul",
   "instructions": "Could POTTS stand in the scene as one person the player can walk up to and talk to: a person or people-like being (a human, ghost, elf, robot or android with a body), not an object, an animal (even a talking or mechanical one), a disembodied voice or AI, a place, a force or a group?"
  }
 }
}
```

### `prompts/world1/louis/louis_street/ind/module/631483ae5e02.txt`

```
<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Cyberpunk fantasy.
<|im_end|>

Episode 1 — Figgs & Potts

△ Cyberpunk fantasy world.
△ Capital city of Gottél, home to mechatronix.
△ Figgs & Potts is a fairly empty bar in the suburbs of Gottél.

CHARACTERS

FIGGS (Man, 52) — Owner and bartender of Figgs & Potts. Friendly to regulars. Loves draft beer but keeps wine, whiskey, etc. for anything a customer might want.

NUAZ (Woman, late 20s) — Regular at Figgs & Potts. Sits with her boots on the table, plays on a tablet. Works as a freelance “resolver” (mercenary/hacker/fixer). Sarcastic and crass. Cybernetic arm, cybernetic eyes. Reasonably maintains her cybernetics but sometimes has glitches. Childhood friend of Yara. Ex-girlfriend of Vell. She has a small floating drone companion named “Buzz.”

YARA (Woman, late 20s) — Nuaz’s childhood friend. Works a corporate job at a high-rise in the city center. Dresses professionally. Polished, anxious, secretly unhappy. She visits the bar occasionally to see Nuaz.

VELL (Man, early 30s) — Nuaz’s ex-boyfriend. A "corporate fixer" / high-end mercenary. Sleek, expensive cybernetics. Charming but ruthless. He and Nuaz had a bad breakup involving a job gone wrong. He shows up at the bar to "reconnect" or hire her.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. FIGGS & POTTS  NIGHT  INT.

CHARACTERS: Figgs, Nuaz, Potts, Yara, Vell

△ A bar in cyberpunk world. Figgs, the bartender, chats with Nuaz across the counter. Potts is in the corner. Nobody else here.
△ A new adventurer (man, early 30s) walks in and comes up to the bar.

AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Space opera.
<|im_end|>

Episode 1 — The Ledge

△ Space opera.
△ On a space station orbiting a dying star. A character named Merelai is sitting at a window, looking out at the star.
△ A woman named Halkric walks up to her.

CHARACTERS

MERELAI (Woman, 30s) — Former naval strategist, now a recluse. She watches the star die because she orchestrated the operation that killed it. She carries the weight of a billion deaths she ordered to win a war that ended three years ago. She drinks synthetic coffee. She doesn't sleep well.

HALKRIC (Woman, 40s) — Merelai's former XO. Pragmatic, grounded, the only one Merelai still answers comms from. She didn't follow Merelai into retirement; she stayed in the fleet. She's here on official business, but also because she's worried.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  THE LEDGE  INT.  OBSERVATION DECK

CHARACTERS: Merelai, Halkric

△ Merelai sits at the window. The star fills the view.
△ Halkric walks up. She has a datapad. She stops a few meters back.

AREA 1. OBSERVATION DECK
A viewing deck on the space station "The Ledge.
Features: the panoramic window, the star, Merelai's chair, the synthetic coffee dispenser, the datapad, the observation console, the emergency bulkhead, the low hum of station systems.
Occupants: Merelai (at the panoramic window); Halkric (at the observation console).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Modern Seoul. Luxury retail.
<|im_end|>

 강남대로 Sidewalk

△ Modern Seoul. Luxury retail.
△ This place is 강남대로 sidewalk.
△ The adventurer has just arrived from 루이 뉘똥 샾 via 유리문.
△ The adventurer is on the sidewalk. The door is behind them.
△ The adventurer feels eyes on them.

CHARACTERS

CLERK (Woman, late 20s) — Works at 루이 뉘똥 샾. Polished, professional, watches the adventurer leave. Knows they didn't buy anything. Knows they touched the Birkin. Smiles anyway.

SECURITY GUARD (Man, 30s) — Posted outside 루이 뉘똥 샾. Impassive. Sized the adventurer up when they entered. Sizing them up again now.

PASSERSBY (Mixed, 20s-50s) — Seoul pedestrians. Some glancing at the adventurer's hands (empty). Some glancing at the boutique's façade. Most indifferent.

STREET VENDOR (Woman, 60s) — Sells coffee from a cart twenty meters down. Calls out to the adventurer. Sharp eyes. Has seen every type walk out of that boutique.

△ The sidewalk stretches. Traffic hums. The boutique's glass reflects the adventurer's empty hands.
<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  GANGNAM-DAERO SIDEWALK  EXT.  DAY

CHARACTERS: Clerk, Security Guard, Passersby, Street Vendor

△ The glass door of 루이 뉘똥 샾 clicks shut behind the adventurer. The muffled hush of the boutique—humidified air, faint sandalwood, the soft clack of heels on marble—cuts out instantly. Replaced by: traffic roar. Construction thrum. The diesel cough of a city bus braking hard two blocks down.
△ The adventurer stands on the pavement. Their hands hang empty at their sides. No glossy shopping bag. No tissue-wrapped box. No receipt pinched between fingers.

AREA 1.
```

### `prompts/world1/louis/louis_street/free/title/f360412b1dc3.txt`

```
<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Cyberpunk fantasy.
<|im_end|>

Episode 1 — Figgs & Potts

△ Cyberpunk fantasy world.
△ Capital city of Gottél, home to mechatronix.
△ Figgs & Potts is a fairly empty bar in the suburbs of Gottél.

CHARACTERS

FIGGS (Man, 52) — Owner and bartender of Figgs & Potts. Friendly to regulars. Loves draft beer but keeps wine, whiskey, etc. for anything a customer might want.

NUAZ (Woman, late 20s) — Regular at Figgs & Potts. Sits with her boots on the table, plays on a tablet. Works as a freelance “resolver” (mercenary/hacker/fixer). Sarcastic and crass. Cybernetic arm, cybernetic eyes. Reasonably maintains her cybernetics but sometimes has glitches. Childhood friend of Yara. Ex-girlfriend of Vell. She has a small floating drone companion named “Buzz.”

YARA (Woman, late 20s) — Nuaz’s childhood friend. Works a corporate job at a high-rise in the city center. Dresses professionally. Polished, anxious, secretly unhappy. She visits the bar occasionally to see Nuaz.

VELL (Man, early 30s) — Nuaz’s ex-boyfriend. A "corporate fixer" / high-end mercenary. Sleek, expensive cybernetics. Charming but ruthless. He and Nuaz had a bad breakup involving a job gone wrong. He shows up at the bar to "reconnect" or hire her.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. FIGGS & POTTS  NIGHT  INT.

CHARACTERS: Figgs, Nuaz, Potts, Yara, Vell

△ A bar in cyberpunk world. Figgs, the bartender, chats with Nuaz across the counter. Potts is in the corner. Nobody else here.
△ A new adventurer (man, early 30s) walks in and comes up to the bar.

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Space opera.
<|im_end|>

Episode 1 — The Ledge

△ Space opera.
△ On a space station orbiting a dying star. A character named Merelai is sitting at a window, looking out at the star.
△ A woman named Halkric walks up to her.

CHARACTERS

MERELAI (Woman, 30s) — Former naval strategist, now a recluse. She watches the star die because she orchestrated the operation that killed it. She carries the weight of a billion deaths she ordered to win a war that ended three years ago. She drinks synthetic coffee. She doesn't sleep well.

HALKRIC (Woman, 40s) — Merelai's former XO. Pragmatic, grounded, the only one Merelai still answers comms from. She didn't follow Merelai into retirement; she stayed in the fleet. She's here on official business, but also because she's worried.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  THE LEDGE  INT.  OBSERVATION DECK

CHARACTERS: Merelai, Halkric

△ Merelai sits at the window. The star fills the view.
△ Halkric walks up. She has a datapad. She stops a few meters back.

[Came from: 루이 뉘똥 샾 — a luxury bag boutique. Set: a luxury bag boutique: 유리 진열장, 벽 선반의 가방들, 받침대 위의 가방, 계산대, 전신 거울, 벨벳 벤치, 화분. Recent: a luxury bag boutique, 루이 뉘똥 샾: glass display cases and backlit shelves of bags, a counter with the clerk behind it, a full-length mirror, a velvet bench and the glass front door]

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Modern Seoul. Luxury retail.
<|im_end|>

Episode 1 —
```

### `prompts/world1/gwangsu/gwangsu_hall/ind/module/b78a54769954.txt`

```
<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Cyberpunk fantasy.
<|im_end|>

Episode 1 — Figgs & Potts

△ Cyberpunk fantasy world.
△ Capital city of Gottél, home to mechatronix.
△ Figgs & Potts is a fairly empty bar in the suburbs of Gottél.

CHARACTERS

FIGGS (Man, 52) — Owner and bartender of Figgs & Potts. Friendly to regulars. Loves draft beer but keeps wine, whiskey, etc. for anything a customer might want.

NUAZ (Woman, late 20s) — Regular at Figgs & Potts. Sits with her boots on the table, plays on a tablet. Works as a freelance “resolver” (mercenary/hacker/fixer). Sarcastic and crass. Cybernetic arm, cybernetic eyes. Reasonably maintains her cybernetics but sometimes has glitches. Childhood friend of Yara. Ex-girlfriend of Vell. She has a small floating drone companion named “Buzz.”

YARA (Woman, late 20s) — Nuaz’s childhood friend. Works a corporate job at a high-rise in the city center. Dresses professionally. Polished, anxious, secretly unhappy. She visits the bar occasionally to see Nuaz.

VELL (Man, early 30s) — Nuaz’s ex-boyfriend. A "corporate fixer" / high-end mercenary. Sleek, expensive cybernetics. Charming but ruthless. He and Nuaz had a bad breakup involving a job gone wrong. He shows up at the bar to "reconnect" or hire her.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1. FIGGS & POTTS  NIGHT  INT.

CHARACTERS: Figgs, Nuaz, Potts, Yara, Vell

△ A bar in cyberpunk world. Figgs, the bartender, chats with Nuaz across the counter. Potts is in the corner. Nobody else here.
△ A new adventurer (man, early 30s) walks in and comes up to the bar.

AREA 1. FIGGS & POTTS
A bar.
Features: the bar counter, the beer taps, the bottle shelf, the booth, a stool, a table, the jukebox, the arcade cabinet, Potts's charging pad, a potted plant, the window, the door.
Occupants: Figgs (at the bar counter); Nuaz (at the bar counter); Potts (at Potts's charging pad).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Desert world.
<|im_end|>

Episode 1 — The Rotwell

△ Desert world.
△ In the center of the Rotwell, a massive crater filled with strange, mutated life. The Rotwell is a place of danger and opportunity.
△ A small camp sits at the edge of the Rotwell.

CHARACTERS

KAEL (Man, 34) — A "Rotwalker." Someone who enters the Rotwell to harvest valuable materials: crystals, glands, exotic matter. He knows the safe paths, the tidal patterns of the mutation. He’s seen too many friends die. He drinks water like it’s whiskey. He has a mechanical left leg, damaged from a "surge" event years ago.

MIRA (Woman, 28) — Kael’s handler / quartermaster / only friend who stays topside. She runs the camp: supplies, comms, buyers, medical. She monitors Kael’s vitals and the Rotwell’s seismic/mutation readings. She’s sharp, organized, terrified of the day he doesn't come back. She has a prosthetic right eye that links to the camp’s sensor array.

OLD JORAN (Man, 60s) — The only other permanent resident. A former Rotwalker who "retired" (got too mutated to go deep). He maintains the winches, the air scrubbers, the heavy gear. He’s half-crystallized himself — skin like geode on his left side. He mutters to the Rotwell like it’s a neighbor.

<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  THE ROTWELL — EDGE CAMP  DAY  EXT.

CHARACTERS: Kael, Mira, Old Joran

△ The camp at the edge of the Rotwell. Kael is gearing up for a descent. Mira is monitoring. Old Joran is maintaining the winch.
△ A stranger (woman, early 30s) approaches the camp from the wasteland.

AREA 1. EDGE CAMP
A camp at the crater's rim.
Features: the winch, the sensor array, the supply tent, the medical cot, the water still, Joran's workbench, the ration barrels, the comms mast.
Occupants: Kael (at the winch); Mira (at the sensor array); Old Joran (at Joran's workbench).

<|im_start|>system
A strange and interesting set of characters. Script character bios (人物小传).
Genre: Modern Korean apartment, late night.
<|im_end|>

 광수의 집 (Gwang-su's Home)

△ Modern Korean apartment, late night.
△ This place is 복도.
△ The adventurer has just arrived from 광수의 집 via 현관문.
△ 현관문 opens to 복도.

CHARACTERS

GYEONG-HEE (Woman, 60s) — The upstairs neighbor. Known for leaving 김치 containers by doors. Hums old trot songs while walking the hallway at midnight. Has a spare key to Gwang-su's place "for emergencies" but uses it to water his 죽순 (bamboo shoots) on the balcony.

JUN-WOO (Man, 30s) — The downstairs neighbor. Night shift security guard. Always in uniform, eating 삼각김밥 on the stairs. Complains about the building's water pressure but knows everyone's schedule. Secretly feeds the stray cat colony behind the dumpster.

MR. KIM (Man, 70s) — The building's de facto caretaker. Sleeps in the 관리실 (management office) on the first floor. Wakes up at the sound of footsteps. Keeps a notebook of every package delivery, every late arrival, every noise complaint. His wife left for 제주도 three years ago; he waits for her calls.

THE STRAY CAT (Cat, ageless) — Orange tabby. Knows the building better than anyone. Enters through the 지하주차장 vent. Visits Jun-woo for food, Gyeong-hee for warmth, Mr. Kim for chin scratches. Has seen things in the 복도 at 3 AM that no human has.

△ 빈 복도. Late night. Fluorescent lights humming. Gwang-su's door (302) is closed. The elevator dings on the first floor. Someone steps out.

△ A stranger (woman, early 30s) walks down the hallway toward 302. She moves quietly. She knows which floorboards don't creak.
<|im_start|>system
A strange and interesting tale. Use beats and directions liberally.
<|im_end|>

1.  GYEONG-HEE'S APARTMENT (301)  NIGHT  INT.

CHARACTERS: Gyeong-hee, Stranger

△ Apartment 301. Smells of fermented 김치 and old laundry detergent. Warm, cluttered. Trot music playing low from a radio.
△ Gyeong-hee sits at her small kitchen table, peeling garlic. She doesn't look up when the door opens.
△ The Stranger enters. She closes the door behind her. She knows the lock.

AREA 1.
```

---
## Prompts that may need human approval before reuse
- **BIBLE_SYS** and **EXTRA_EX / EXTRA_EXITS** (new authored prose).
- **EX_EXITS** few-shot exit lines for Morrows and Figgs & Potts.
- **START_META** hand portal seeds (dest names + kinds).
- Forced destination-title / Came-from / arrival splice text in `expand.child_opening`.
- Judge prompt for A vs B (`portal/judge_*`) — new rubric text.
- `name_destination` prompts when induction dest was weak (`a Door`, `2. GATEHOUSE`).
- Refresh action line (player utterance that revises unvisited crypt) — see NOTES.md.

Round3 recipe prompts (Nemotron free opening, Jev placeable/kinds, setmap, placement, people-only cast, mismatch gate) are **REUSED** unchanged except Jev kinds capped at 250 chars to avoid 422.
