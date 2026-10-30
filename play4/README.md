# play4: the world4 client

Plays world4 **session packages** (replay, static: GitHub Pages) and, optionally, a **live** world4 server (same events
over HTTP). The contract is `world4/PROTOCOL.md`; the graph view draws the snapshot described in `world4/GRAPH.md` §2.
Plain HTML/CSS/JS, no build step, no CDN; works offline.

```
index.html  style.css  game.js     the UI (portrait first; landscape/desktop put the controls right of the map)
replay.js                          the pure replay engine (no DOM; window.Replay in the browser, require() in node)
sessions/index.json                [{name, world, title, line, file}]   (optional: world_title)
sessions/<name>/session.json       a session package (PROTOCOL.md)
sessions/<name>/assets/...         its images; every path in a package is relative to sessions/<name>/
dev/                               make_synth.py, test_replay.js, shoot.mjs, mock_live.py, live_test.mjs
```

Run locally: `cd world4/play4site && python3 -m http.server 8765`, open `http://127.0.0.1:8765/#bar/bar_cat_01`
(hash = `#<world>/<package name>`).

## Adding a session package

1. Put the recorder's output at `sessions/<name>/session.json` with its images under `sessions/<name>/` (any relative
   path works, e.g. `assets/bar_street_below.png`, `assets/props/cat_sleeping_0.png`, or `../_shared/x.png`).
2. Add `{"name": "<name>", "world": "bar", "title": "Figgs & Potts · have you seen my cat?", "line": "have you seen my cat?",
   "file": "<name>/session.json"}` to `sessions/index.json` (`file` is relative to `sessions/`; a value starting with
   `sessions/` is taken relative to the site root). The world select lists the worlds that have packages, in index order;
   the world's display name is `world_title` or the part of `title` before ` · `.
3. Done. A preset chip is enabled when a package of the selected world has that `line` (normalised: case, punctuation and
   apostrophes ignored). Lines of the world's packages that are not presets get extra (dashed) chips.

Several packages may share a line (e.g. two recordings): the one selected in the session select wins, else the first.

## Replay semantics (what the client does)

- Loading a package (world select, session select, restart) resets to its `t=0`: `maps`, `graph`, the player at
  `start`; the events before the package's first `line` event are applied at once (the state the user starts from).
- Submitting a line (chip or free text) finds the package; the beat clock jumps to that package's `line` event and the
  following events apply at their recorded `t` (speed 1x/4x/instant in the menu). A later `line` event in the same
  package pauses the clock until the user says that line. Free text that matches nothing shows "not recorded in this demo".
- Beats accumulate: saying the line of another package of the same world merges it (maps/graph nodes not present are
  added; existing maps keep their current state) and plays its events on top. Saying an already played line replays its
  package from `t=0`. Restart (menu) = the selected package at `t=0`.
- `say` → status line toast + speech bubble over the actor when on screen + `overlay.lines[who]`; approaching an actor
  shows its line. `plan.summary` → status line. `overlay` replaces the map's overlay (glyph actors, sprite props at
  `w x h` cells, tall props one cell up, `solid` props block). `map_update` replaces the record, keeps the overlay if the
  update has none, and nudges the player to the nearest walkable cell if theirs became solid.
- `candidate`: logged always; installed only if `valid`, the node is not frozen, its rank (hand 5 > opus 4 > sonnet 3 >
  qwen 2 > pcg 1, or the event's `rank`) beats the installed one, and every portal of another map that leads into the node
  lands on a walkable cell of the candidate (else "would strand ..."). Entering a node freezes it at the installed
  version; later candidates are logged "late, not applied". The recorded `enter`/`freeze` events are the recorder's walk:
  logged only in replay (the user walks freely); `freeze` is applied in live mode.
- Also handled (the world4 runtime emits them): `add_actor`, `add_prop`, `rename_prop` (incremental overlay edits),
  `error`, `note` (log only); `say` by `narration` shows as an italic status line without a bubble. A `map_update` whose
  portal would land on a blocked cell of the version installed here keeps its old landing (or snaps to walkable).
- Movement is playable3's: leave by an edge → the opposite edge in the same lane; doors/stairs → the doorstep; no portal
  markers unless the debug toggle is on; a portal into a node that is not built yet says so and does nothing.

## Live mode

Menu → live server → `https://host:port` → connect. `POST /api/session {world}` → `{sid, package}`; lines go to
`POST /api/session/<sid>/line {text}`; events come from `GET /api/session/<sid>/events?since=n` (long-poll) and apply at
once; entering a map posts `POST /api/session/<sid>/enter {node}`. Asset paths: absolute URLs as is, `/x` against the
server, `assets/...` against `<server>/sessions/<sid>/`, anything else against the server root. If the server is
unreachable the client stays in replay mode. Clearing the field and pressing connect returns to replay.
`python3 dev/mock_live.py <port>` is a mock server that replays the packages in real time (CORS on) for testing.

## Debug (menu, all off by default; remembered in localStorage)

Portal cells, grid (blocked cells tinted), node badge on the map title (status · model · seconds · frozen), candidate
timeline with the beat clock (log time axis; filled dot = installed, ring = late/invalid/refused), replay speed. The
graph toggle (header) shows the world graph; tap a node for its card (title, status, model, seconds, purpose,
candidates). The log (status line or `log`) is a slide-up sheet with a people tab. Keys: arrows/WASD, Enter = type,
Esc = close panels, backtick = portal cells. `window.play4` exposes state and the UI's entry points for QA.

## Dev

- `python3 dev/make_synth.py` rebuilds the synthetic packages from playable3/site/best.json (bar_cat_01: say, overlay with
  a grey cat + a beggar, the cellar planned, a 4-model race with copies of existing maps, a hatch added to the street;
  bar_beggar_01; morrows_taichi_01 with a node that never finishes). The orchestrator replaces them with recordings.
- `node dev/test_replay.js`: 40 logic checks of replay.js (resolution, overlay, install order, freeze/late, stranding
  refusal, invalid, accumulation, nudge, live freeze, add_actor/add_prop/rename_prop, two-line packages, landings).
- `node dev/shoot.mjs <outdir> <port>`: headless Chrome screenshots (430x932@3, 430x760@3, 932x430@3, 1440x900) with real
  touch input; `node dev/live_test.mjs <outdir> <port> <mockport>`: live mode against the mock.
