'use strict';
// play4 client: plays world4 session packages (replay) or a live world4 server. Movement, collision, portals and the
// camera are playable3's (playable3/site/game.js); the event semantics live in replay.js.
(async () => {
const $ = id => document.getElementById(id), R = window.Replay;
const canvas = $('game'), ctx = canvas.getContext('2d');
const PRESETS = ['have you seen my cat?', "let's talk to the beggar in the corner", 'check behind the cellar', 'I want to train tai chi', "I want to see the dragon everybody's been talking about"];
const WORLDS = [{ id: 'morrows', title: 'Field of Morrows' }, { id: 'bar', title: 'Figgs & Potts' }, { id: 'louis', title: '루이 뉘똥 샾' }, { id: 'gwangsu', title: '광수의 집' }];
const REPO = 'https://github.com/imaginalnika/fixion-benchmark-research';
const COL = { hand: '#9ba3a6', opus: '#b386f5', sonnet: '#5eaaf2', qwen: '#f2a24c', pcg: '#6fcb7c' };
const SESS = new URL('sessions/', location.href).href;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const store = { get(k, d) { try { const v = localStorage.getItem('play4-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem('play4-' + k, JSON.stringify(v)); } catch {} } };

// ------------------------------------------------------------------ state
let index = [], S = null, world = null, base = null, live = null;
let curId = null, pos = [0, 0], face = [0, 1], visual = [0, 0], queue = [], after = null, anim = null, walkTarget = null, keys = new Set();
let tile = 28, camX = 0, camY = 0, W = 1, H = 1, dpr = 1, hover = null, bubble = null;
let speed = store.get('speed', 1); const dbg = Object.assign({ portals: false, grid: false, badge: false, timeline: false }, store.get('dbg', {}));
let holdUntil = 0, lastIdle = '', graphOpen = false, sheetTab = null;
const pkgCache = {};

// ------------------------------------------------------------------ images (lazy, cached; the map draws a placeholder until its image arrives)
const imgs = {};
function img(url) {
  if (!url) return null;
  let im = imgs[url];
  if (!im) { im = imgs[url] = new Image(); im.decoding = 'async'; im.src = url; }
  return im.complete && im.naturalWidth ? im : null;
}
function preload(pkg, Rz) {
  for (const m of Object.values(pkg.maps || {})) { img(Rz(m.below)); img(Rz(m.above)); img(Rz(m.light)); for (const p of (m.overlay || {}).props || []) img(Rz(p.sprite)); }
  for (const e of pkg.events || []) {
    if (e.map && e.map.below) img(Rz(e.map.below));
    for (const p of ((e.overlay || (e.map || {}).overlay || {}).props || [])) img(Rz(p.sprite));
  }
}

// ------------------------------------------------------------------ status line (toasts) and the log sheet
function status(html, cls = '', hold = 0) {
  const el = $('statusText'); el.innerHTML = html; el.className = cls; void el.offsetWidth; if (hold) el.classList.add('flash');
  holdUntil = performance.now() + hold; lastIdle = '';
}
function idleText() {
  if (!S) return '';
  const racing = S.graph.nodes.filter(n => n.status === 'building' || n.building);
  if (racing.length) {
    const n = racing[0], got = new Set((S.cands[n.id] || []).map(c => c.model)), left = (n.models || []).filter(m => !got.has(m));
    const inst = S.installed[n.id] && S.maps[n.id] ? `${S.installed[n.id].model} version in` : 'nothing built yet';
    return `building <b>${esc(n.title || n.id)}</b> · ${inst}${left.length ? ' · ' + left.join(', ') + ' racing' : ''}`;
  }
  if (S.waiting) return `next: say “${esc(S.waiting.text)}”`;
  if (live) return `live · ${esc(live.sid)} · say anything`;
  if (!S.played.length) return 'Say something, or tap a line below.';
  return `<b>${esc(S.title(curId))}</b>`;
}
function fmtT(t) { return t == null ? '' : (t < 100 ? t.toFixed(1) : Math.round(t)) + ''; }
function logRow(e) { return `<div class="lg ${esc(e.cls)}${e.quiet ? ' quiet' : ''}"><span class="t">${e.t != null ? fmtT(e.t) : '·'}</span><span class="x">${esc(e.text)}</span></div>`; }
function renderSheet() {
  if (!sheetTab) return;
  const b = $('sBody');
  if (sheetTab === 'log') {
    b.innerHTML = S ? S.log.map(logRow).join('') || '<p class="m-note">Nothing yet.</p>' : '';
    b.scrollTop = b.scrollHeight;
  } else {
    const m = map(); if (!m) return;
    const ppl = [...m.actors, ...(m.overlay.actors || [])];
    b.innerHTML = ppl.length ? ppl.map(a => `<div class="pp"><b>${esc(a.name)}</b>${a.bio ? ' · ' + esc(a.bio) : ''}<p>${esc(m.overlay.lines[a.name] || a.says || '')}</p></div>`).join('')
      + (m.overlay.props.length ? '<div class="m-sec">things</div>' + m.overlay.props.map(p => `<div class="pp">${esc(p.name || p.kind)}</div>`).join('') : '')
      : '<p class="m-note">Nobody here.</p>';
  }
  for (const t of document.querySelectorAll('.tab')) t.classList.toggle('on', t.dataset.tab === sheetTab);
}
function openSheet(tab) { sheetTab = tab; $('sheet').hidden = !tab; $('logBtn').setAttribute('aria-expanded', tab ? 'true' : 'false'); renderSheet(); }

// ------------------------------------------------------------------ the session hooks
const hooks = {
  onLog(e) {
    if (sheetTab === 'log') { const b = $('sBody'), stick = b.scrollTop + b.clientHeight >= b.scrollHeight - 30; b.insertAdjacentHTML('beforeend', logRow(e)); if (stick) b.scrollTop = b.scrollHeight; }
  },
  onSay(e) {
    const narr = !e.who || /^narrat/i.test(e.who);
    bubble = narr ? null : { node: e.node, who: e.who, text: e.text, until: performance.now() + 7000 };
    status(narr ? `<i>${esc(e.text)}</i>` : `<b>${esc(e.who)}</b>: ${esc(e.text)}`, '', 3500);
  },
  onToast(text) { if (performance.now() > holdUntil) status(esc(text), '', 2500); },
  onMap(node, kind) {
    if (node === curId) mapChanged(kind);
    else if (kind === 'install' && performance.now() > holdUntil - 1500) { const i = S.installed[node]; status(`<b>${esc(S.title(node))}</b> is ready (${esc(i.model)}, ${i.seconds} s)`, '', 2200); }
    if (sheetTab === 'people') renderSheet();
  },
  onGraph() { if (graphOpen) drawGraph(); updateBadge(); },
  onWaiting(w) { status(`next: say “${esc(w.text)}”`); renderChips(); },
};

// ------------------------------------------------------------------ packages
function entryUrl(e) { return e.file.startsWith('sessions/') ? new URL(e.file, location.href).href : new URL(e.file, SESS).href; }
async function getPkg(e) {
  if (pkgCache[e.name]) return pkgCache[e.name];
  const url = entryUrl(e);
  const pkg = await fetch(url).then(r => { if (!r.ok) throw Error('package ' + e.name + ': ' + r.status); return r.json(); });
  pkg.id = pkg.id || e.name;
  const out = { pkg, Rz: R.makeResolver(new URL('./', url).href) };
  preload(pkg, out.Rz);
  return (pkgCache[e.name] = out);
}
async function loadBase(e, keepStatus = false) {
  const { pkg, Rz } = await getPkg(e);
  if (pkg.id !== e.name) pkg.id = e.name;
  S = new R.Session({ hooks }); S.load(pkg, Rz);
  world = e.world; base = e; bubble = null;
  $('world').value = world; $('beat').value = e.name;
  open(pkg.start && S.maps[pkg.start] ? pkg.start : Object.keys(S.maps)[0]);
  renderChips(); renderSheet(); if (graphOpen) drawGraph(); showPkgTitle();
  if (!keepStatus) status(idleText());
  history.replaceState(null, '', '#' + world + '/' + e.name);
}
// replay: the worlds that have packages (index order); live: the four worlds (+ any other world in the index)
function worldsOf() {
  const out = [];
  if (live) for (const w of WORLDS) out.push({ ...w });
  for (const e of index) if (!out.find(w => w.id === e.world)) out.push({ id: e.world, title: e.world_title || (e.title || '').split(' · ')[0] || e.world });
  for (const w of out) { const e = index.find(x => x.world === w.id && x.world_title); if (e) w.title = e.world_title; }
  return out;
}
function fillWorlds() {
  const sel = $('world'); sel.replaceChildren();
  for (const w of worldsOf()) { const o = document.createElement('option'); o.value = w.id; o.textContent = w.title; sel.append(o); }
  if (world) sel.value = world;
}
function beatLabel(e) { return (e.line ? '“' + e.line + '”' : e.title) + (e.planner ? ' · ' + e.planner + ' planner' : ''); }
function fillBeats() {
  const sel = $('beat'); sel.replaceChildren();
  if (live) { const o = document.createElement('option'); o.value = ''; o.textContent = 'live'; sel.append(o); sel.disabled = true; sel.title = 'live session: say anything'; return; }
  sel.disabled = false; sel.title = 'recorded session';
  for (const e of index.filter(e => e.world === world)) {
    const o = document.createElement('option'); o.value = e.name; o.textContent = beatLabel(e);
    o.title = [e.title, e.models && 'models: ' + e.models.join(', '), e.policy && 'policy ' + e.policy].filter(Boolean).join(' · '); sel.append(o);
  }
  if (base && base.world === world) sel.value = base.name;
}
function showPkgTitle() {
  const t = live ? `live session ${live.sid} · ${(worldsOf().find(w => w.id === world) || {}).title || world}${live.title ? ' · ' + live.title : ''}`
    : base ? `${base.title || base.name}${base.planner && !String(base.title || '').includes(base.planner + ' planner') ? ' · ' + base.planner + ' planner' : ''}${base.models ? ' · race: ' + base.models.join(', ') : ''}` : '';
  $('pkgTitle').textContent = t;
  const pt = $('plannerTag'), pl = !live && base && base.planner;        // which planner made this recording (compare two of one line)
  pt.hidden = !pl; if (pl) { pt.textContent = pl + ' planner'; pt.style.setProperty('--c', COL[pl] || '#ddd'); }
}
function renderChips() {
  const box = $('chips'); box.replaceChildren();
  const mine = index.filter(e => e.world === world);
  const lines = [...PRESETS];
  for (const e of mine) if (e.line && !lines.some(l => R.norm(l) === R.norm(e.line))) lines.push(e.line);
  const wait = S && S.waiting && S.waiting.text;
  if (wait && !lines.some(l => R.norm(l) === R.norm(wait))) lines.push(wait);
  lines.forEach((l, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (i >= PRESETS.length ? ' extra' : ''); b.textContent = l;
    const rec = mine.some(e => R.norm(e.line) === R.norm(l)) || (wait && R.norm(wait) === R.norm(l));
    b.disabled = !live && !rec; b.title = rec || live ? 'say this' : 'not recorded in this demo for this world';
    b.onclick = () => submit(l);
    box.append(b);
  });
  markChips();
}
function markChips() {
  const playing = S && S.active && S.playing ? R.norm((S.played.at(-1) || {}).text) : null;
  for (const b of document.querySelectorAll('.chip')) b.classList.toggle('on', playing != null && R.norm(b.textContent) === playing);
}

// ------------------------------------------------------------------ saying a line
async function submit(text) {
  text = String(text || '').trim(); if (!text || !S) return;
  $('sayInput').value = ''; $('sayInput').blur();
  if (live) {
    S.note(`you: "${text}"`, 'line', S.clock, 'line'); status(`you: “${esc(text)}” · sent`, '', 1500);
    post('/line', { text }).catch(() => status('the server did not take the line', 'warn', 3000));
    return;
  }
  const nt = R.norm(text);
  if (S.waiting && R.norm(S.waiting.text) === nt) { S.startBeat(S.waiting.id, text); afterStart(text); return; }
  const found = index.filter(e => e.world === world && R.norm(e.line) === nt);
  if (!found.length) {
    S.note(`you: "${text}" (not recorded in this demo)`, 'warn', null, 'line');
    status(`“${esc(text)}”: not recorded in this demo`, 'warn', 3500);
    return;
  }
  const e = found.find(f => f.name === $('beat').value) || found[0];
  const { pkg, Rz } = await getPkg(e);
  if (S.pkgs[e.name] && !S.linesAhead(e.name).some(l => R.norm(l) === nt)) {
    await loadBase(e, true);                          // already played here: replay it from its t=0
    S.note('restarted: the beat was already played', 'warn', 0);
  } else if (!S.pkgs[e.name]) S.merge(pkg, Rz);       // a further beat: the state accumulates
  S.startBeat(e.name, text);
  $('beat').value = e.name;
  afterStart(text);
}
function afterStart(text) { status(`you: “${esc(text)}”`, '', 900); markChips(); if (graphOpen) drawGraph(); }

// ------------------------------------------------------------------ live server (optional)
async function fetchJSON(url, opt = {}, ms = 8000) {
  const ac = new AbortController(), to = setTimeout(() => ac.abort(), ms);
  try { const r = await fetch(url, { ...opt, signal: ac.signal }); if (!r.ok) throw Error(r.status); return await r.json(); } finally { clearTimeout(to); }
}
function post(path, body) { return fetchJSON(`${live.url}/api/session/${live.sid}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); }
async function toReplay(note) {
  live = null; $('modeNote').textContent = note;
  if (!index.some(e => e.world === world)) world = (index[0] || {}).world || world;
  fillWorlds(); fillBeats(); showPkgTitle();
  const e = (base && base.world === world && base) || index.find(x => x.world === world);
  if (e) await loadBase(e, true);
}
// live: POST /api/session {world} -> {sid, package}; switching worlds = a new session; unreachable -> stay in replay
async function connect(w = null) {
  const url = $('server').value.trim().replace(/\/+$/, ''); store.set('server', url);
  if (!url) { if (live) await toReplay('replay'); else $('modeNote').textContent = 'replay'; return; }
  const want = (typeof w === 'string' && w) || world || 'bar', was = live;
  $('modeNote').textContent = 'connecting…';
  try {
    const r = await fetchJSON(url + '/api/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ world: want }) }, 10000);
    const sid = r.sid, pkg = r.package || {};
    const ab = new URL(pkg.assets_base || `/sessions/${sid}/`, url + '/').href;
    const Rz = p => !p || typeof p !== 'string' ? p : /^[a-z][a-z0-9+.-]*:/i.test(p) ? p : p[0] === '/' ? new URL(p, url + '/').href : new URL(p, ab).href;
    live = { url, sid, n: 0, Rz, title: pkg.title };
    world = pkg.world || want; bubble = null;
    S = new R.Session({ mode: 'live', hooks }); S.load(pkg, Rz); preload(pkg, Rz);
    fillWorlds(); fillBeats(); showPkgTitle();
    open(pkg.start && S.maps[pkg.start] ? pkg.start : Object.keys(S.maps)[0]);
    renderChips(); $('modeNote').textContent = 'live · ' + sid; status(idleText());
    if (graphOpen) drawGraph();
    history.replaceState(null, '', '#' + world + '/live');
    poll(live);
  } catch (err) {
    if (was) { live = was; $('modeNote').textContent = 'live · ' + was.sid + ' (new session failed)'; fillWorlds(); status('the server did not open a session for that world', 'warn', 3500); return; }
    await toReplay('replay (server unreachable)');
    status('server unreachable; staying in replay mode', 'warn', 3500);
  }
}
async function poll(me) {
  while (live === me) {
    try {
      const r = await fetchJSON(`${me.url}/api/session/${me.sid}/events?since=${me.n}`, {}, 25000);
      if (live !== me) return;
      for (const e of r.events || []) S.applyLive(e, me.Rz);
      me.n = r.n != null ? r.n : me.n + (r.events || []).length;
    } catch (err) { await new Promise(res => setTimeout(res, 2000)); }
  }
}

// ------------------------------------------------------------------ maps, movement (playable3 rules)
const map = () => S && S.maps[curId];
function open(id, at = null, facing = null) {
  const m = S.maps[id];
  if (!m) { status(`${esc(S.title(id))} is not built yet`, 'warn', 2500); return false; }
  curId = id; pos = [...(at || m.start || [m.width >> 1, m.height - 2])];
  if (R.blocked(m, pos[0], pos[1])) pos = R.nearestWalkable(m, pos);
  if (facing) face = [...facing];
  visual = [...pos]; queue = []; after = null; anim = null; walkTarget = null; hover = null;
  const r = S.enter(id);
  if (live) post('/enter', { node: id }).catch(() => {});
  updateBadge(); resize();
  if (r.froze && (S.cands[id] || []).length) status(`<b>${esc(m.title)}</b> · frozen at the ${esc(r.model)} version`, '', 3000);
  else status(`<b>${esc(m.title)}</b>${m.opening ? ' · ' + esc(m.opening) : ''}`, '', 2200);
  if (sheetTab === 'people') renderSheet();
  return true;
}
function mapChanged(kind) {
  const m = map(); updateBadge();
  if (R.blocked(m, pos[0], pos[1])) { pos = R.nearestWalkable(m, pos); visual = [...pos]; anim = null; queue = []; status('the place shifted under you; you step aside', 'warn', 2500); }
  else if (kind === 'update') status(`<b>${esc(m.title)}</b> changed`, '', 1800);
}
function pass(x, y) { return !R.blocked(map(), x, y); }
function stepPortalAt(x, y) { return map().portals.find(p => p.trigger === 'step' && p.cells.some(c => c[0] === x && c[1] === y)); }
function exitPortal(x, y, dx, dy) { return map().portals.find(p => p.trigger === 'exit' && p.dir && p.dir[0] === dx && p.dir[1] === dy && p.cells.some(c => c[0] === x && c[1] === y)); }
function path(from, to) {
  const q = [from], prev = new Map([[from.join(','), null]]);
  for (let i = 0; i < q.length; i++) {
    const u = q[i];
    if (u[0] === to[0] && u[1] === to[1]) { const out = []; for (let v = u; prev.get(v.join(',')); v = prev.get(v.join(','))) out.unshift(v); return out; }
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const v = [u[0] + dx, u[1] + dy], k = v.join(',');
      if (pass(...v) && !prev.has(k) && (!stepPortalAt(...v) || (v[0] === to[0] && v[1] === to[1]))) { prev.set(k, u); q.push(v); }
    }
  }
  return null;
}
function go(target, then = null) {
  const m = map(); if (!m) return;
  if (anim) { walkTarget = target; return; }
  let dest = target;
  if (!pass(...dest)) {
    const near = [];
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (pass(x, y)) near.push([x, y]);
    near.sort((a, b) => Math.hypot(a[0] - dest[0], a[1] - dest[1]) - Math.hypot(b[0] - dest[0], b[1] - dest[1]));
    dest = near.slice(0, 40).find(v => path(pos, v) !== null) || dest;
  }
  const p = path(pos, dest);
  if (p) { queue = p; after = then; if (!p.length && then) { after = null; then(); } }
  else status('There is no clear path from here.', 'warn', 1500);
}
function transit(p, i, facing) {
  if (!S.maps[p.to_map]) { status(`${esc(p.feature || 'that way')}: ${esc(S.title(p.to_map))} is not built yet`, 'warn', 2500); return false; }
  const to = p.to_cells[Math.min(i, p.to_cells.length - 1)];
  return open(p.to_map, to, facing);
}
function move(dx, dy, now) {
  face = [dx, dy]; const to = [pos[0] + dx, pos[1] + dy], m = map();
  if (!R.inside(m, to[0], to[1])) {
    const p = exitPortal(pos[0], pos[1], dx, dy);
    if (p) { const i = p.cells.findIndex(c => c[0] === pos[0] && c[1] === pos[1]); return transit(p, i, [dx, dy]); }
    return false;
  }
  if (!pass(...to)) return false;
  anim = { from: [...pos], to, start: now }; return true;
}
function arrived() { const p = stepPortalAt(...pos); if (p) { const i = p.cells.findIndex(c => c[0] === pos[0] && c[1] === pos[1]); return transit(p, i, p.face || face); } return false; }

// ------------------------------------------------------------------ input
const dirs = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
addEventListener('keydown', e => {
  if (/^(SELECT|INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (dirs[k]) { e.preventDefault(); keys.add(k); queue = []; after = null; walkTarget = null; }
  if (k === 'Escape') { queue = []; keys.clear(); openSheet(null); setGraph(false); setMenu(false); }
  if (k === '`') setDbg('portals', !dbg.portals);
  if (k === 'Enter') { $('sayInput').focus(); e.preventDefault(); }
});
addEventListener('keyup', e => keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key));
addEventListener('blur', () => { keys.clear(); queue = []; });
for (const b of document.querySelectorAll('[data-dir]')) {
  b.onpointerdown = e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch {} keys.add('pad'); dirs.pad = b.dataset.dir.split(',').map(Number); queue = []; if (!anim && map()) move(...dirs.pad, performance.now()); };
  b.onpointerup = b.onpointercancel = () => keys.delete('pad');
  b.oncontextmenu = e => e.preventDefault();
}
function cellOf(e) { const r = canvas.getBoundingClientRect(); return [Math.floor((e.clientX - r.left + camX) / tile), Math.floor((e.clientY - r.top + camY) / tile)]; }
canvas.addEventListener('pointerdown', e => { e.preventDefault(); if (!map()) return; setMenu(false); go(cellOf(e)); });
canvas.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || !map()) return; const [x, y] = cellOf(e); const m = map(); hover = [...m.actors, ...m.overlay.actors].find(a => a.at[0] === x && a.at[1] === y) || null; });
$('say').onsubmit = e => { e.preventDefault(); submit($('sayInput').value); };
$('status').onclick = e => { if (e.target.id !== 'logBtn') openSheet(sheetTab ? null : 'log'); };
$('logBtn').onclick = () => openSheet(sheetTab ? null : 'log');
$('sheetClose').onclick = () => openSheet(null);
for (const t of document.querySelectorAll('.tab')) t.onclick = () => openSheet(t.dataset.tab);
function setMenu(on) { $('menu').hidden = !on; $('menuBtn').setAttribute('aria-expanded', on ? 'true' : 'false'); }
$('menuBtn').onclick = () => setMenu($('menu').hidden);
function setGraph(on) { graphOpen = on; $('graph').hidden = !on; $('graphBtn').setAttribute('aria-pressed', on ? 'true' : 'false'); $('gcard').hidden = true; if (on) { setMenu(false); drawGraph(); } }
$('graphBtn').onclick = () => setGraph(!graphOpen);
$('graphClose').onclick = () => setGraph(false);
$('restart').onclick = async () => { setMenu(false); if (live) await connect(world); else if (base) await loadBase(base); };
function setDbg(k, on) { dbg[k] = on; store.set('dbg', dbg); for (const c of document.querySelectorAll('[data-dbg]')) c.checked = !!dbg[c.dataset.dbg]; document.body.classList.toggle('dbg-badge', dbg.badge); $('timeline').hidden = !dbg.timeline; }
for (const c of document.querySelectorAll('[data-dbg]')) c.onchange = () => setDbg(c.dataset.dbg, c.checked);
function setSpeed(v) { speed = v; store.set('speed', v); for (const b of document.querySelectorAll('[data-speed]')) b.classList.toggle('on', +b.dataset.speed === v); }
for (const b of document.querySelectorAll('[data-speed]')) b.onclick = () => setSpeed(+b.dataset.speed);
$('connect').onclick = () => connect(); $('server').value = store.get('server', '');
$('world').onchange = async () => {
  const w = $('world').value;
  if (live) { await connect(w); return; }
  world = w; fillBeats(); const e = index.find(x => x.world === world); if (e) await loadBase(e);
};
$('beat').onchange = async () => { const e = index.find(x => x.name === $('beat').value); if (e) await loadBase(e); };

// ------------------------------------------------------------------ drawing
function resize() {
  const st = $('stage'); W = Math.max(1, st.clientWidth); H = Math.max(1, st.clientHeight);
  dpr = Math.min(devicePixelRatio || 1, 3);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
}
addEventListener('resize', () => { resize(); if (graphOpen) drawGraph(); });
if (window.ResizeObserver) new ResizeObserver(() => { resize(); if (graphOpen) drawGraph(); }).observe($('stage'));
function tileFor(m) {
  const base15 = W / Math.max(15, m.width), fit = Math.min(W / m.width, H / m.height);
  let t = Math.min(72, Math.max(base15, fit));
  if (H < W) t = Math.min(t, Math.max(H / 10, 22));       // landscape: keep about ten rows in view
  return t;
}
function updateBadge() {
  const m = map(); if (!m || !S) return;
  $('mtTitle').textContent = m.title;
  const g = S.gnode(curId) || {}, i = S.installed[curId] || {};
  const model = i.model || g.model || 'hand';
  $('badge').innerHTML = `<span class="m" style="background:${COL[model] || '#ccc'}"></span>${esc(g.status || 'built')} · ${esc(model)}${i.seconds != null ? ' · ' + i.seconds + ' s' : ''}${S.frozen.has(curId) ? ' · frozen' : ''}`;
}
function label(text, x, y, color = '#f4ebd0') {
  ctx.font = `600 ${Math.max(10, tile * .34)}px system-ui,sans-serif`; const w = ctx.measureText(text).width;
  ctx.fillStyle = '#0d1517e0'; ctx.fillRect(x - w / 2 - 4, y - Math.max(10, tile * .34) - 1, w + 8, Math.max(10, tile * .34) + 5);
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, y);
}
function wrap(text, maxW) {
  const words = String(text).split(/\s+/), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function drawBubble(who, text, ax, ay) {
  const fs = 12.5, lh = 15.5, pad = 7, maxW = Math.min(W * .74, 270);
  ctx.font = `${fs}px system-ui,sans-serif`;
  const lines = wrap(text, maxW - pad * 2).slice(0, 5);
  ctx.font = `600 ${fs}px system-ui,sans-serif`; const nw = ctx.measureText(who).width;
  ctx.font = `${fs}px system-ui,sans-serif`;
  const bw = Math.min(maxW, Math.max(nw, ...lines.map(l => ctx.measureText(l).width)) + pad * 2), bh = (lines.length + 1) * lh + pad * 2 - 3;
  let bx = clamp(ax - bw / 2, camX + 4, camX + W - bw - 4), by = ay - tile * .62 - bh, below = false;
  if (by < camY + 4) { by = ay + tile * .55; below = true; }
  ctx.fillStyle = '#f6efdcf2'; ctx.strokeStyle = '#2a2a24'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 8) : ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
  const tx = clamp(ax, bx + 10, bx + bw - 10);
  ctx.beginPath(); if (below) { ctx.moveTo(tx - 6, by + 1); ctx.lineTo(tx, by - 7); ctx.lineTo(tx + 6, by + 1); } else { ctx.moveTo(tx - 6, by + bh - 1); ctx.lineTo(tx, by + bh + 7); ctx.lineTo(tx + 6, by + bh - 1); } ctx.fill();
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.font = `700 ${fs}px system-ui,sans-serif`; ctx.fillStyle = '#2f6b58'; ctx.fillText(who, bx + pad, by + pad);
  ctx.font = `${fs}px system-ui,sans-serif`; ctx.fillStyle = '#1d1b16';
  lines.forEach((l, i) => ctx.fillText(l, bx + pad, by + pad + (i + 1) * lh));
}
function drawActor(a, now) {
  const [x, y] = a.at, cx = (x + .5) * tile, cy = (y + .5) * tile, col = `rgb(${(a.color || [230, 200, 150]).join(',')})`;
  const fk = (a.facing || [0, 1])[1] > 0 ? 's' : (a.facing || [0, 1])[1] < 0 ? 'n' : (a.facing || [0, 1])[0] > 0 ? 'e' : 'w';
  const spr = a.sprites && img(a.sprites[fk]);
  if (spr) { ctx.drawImage(spr, x * tile, y * tile - tile * (spr.naturalHeight / spr.naturalWidth - 1), tile, tile * spr.naturalHeight / spr.naturalWidth); return; }
  ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(cx, cy + tile * .3, tile * .3, tile * .12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#0c1214c8'; ctx.beginPath(); ctx.arc(cx, cy, tile * .36, 0, 7); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.5, tile * .06); ctx.stroke();
  ctx.fillStyle = col; ctx.font = `bold ${tile * .52}px Georgia,serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.glyph || a.name[0], cx, cy + tile * .03);
}
function drawProp(p) {
  const im = img(p.sprite), w = (p.w || 1) * tile, hh = (p.h || 1);
  if (!im) { ctx.fillStyle = '#e8d9a8'; ctx.font = `bold ${tile * .5}px Georgia,serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', (p.at[0] + (p.w || 1) / 2) * tile, (p.at[1] + hh / 2) * tile); return; }
  let h = w * im.naturalHeight / im.naturalWidth;
  if (p.tall && h < (hh + p.tall) * tile * .9) h = (hh + p.tall) * tile;
  ctx.imageSmoothingEnabled = tile * dpr < im.naturalWidth / (p.w || 1);
  ctx.drawImage(im, p.at[0] * tile, (p.at[1] + hh) * tile - h, w, h);
  ctx.imageSmoothingEnabled = false;
}
function drawPlayer(now) {
  const [x, y] = visual, cx = (x + .5) * tile, cy = (y + .52) * tile, bob = anim ? Math.sin(now / 75) * tile * .025 : 0;
  ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(cx, cy + tile * .27, tile * .27, tile * .12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#194c44'; ctx.fillRect(cx - tile * .17, cy - tile * .12 + bob, tile * .34, tile * .39);
  ctx.fillStyle = '#85e1c3'; ctx.beginPath(); ctx.arc(cx, cy - tile * .22 + bob, tile * .14, 0, 7); ctx.fill();
  ctx.fillStyle = '#0b2b26'; ctx.fillRect(cx - tile * .05 + face[0] * tile * .07, cy - tile * .25 + face[1] * tile * .06, tile * .1, tile * .05);
  ctx.fillStyle = '#d9eee2'; ctx.fillRect(cx - tile * .12, cy + tile * .22, tile * .08, tile * .14); ctx.fillRect(cx + tile * .04, cy + tile * .22, tile * .08, tile * .14);
}
function draw(now) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#0a0f10'; ctx.fillRect(0, 0, W, H);
  const m = map(); if (!m) return;
  tile = tileFor(m);
  const mw = m.width * tile, mh = m.height * tile;
  camX = mw <= W ? -(W - mw) / 2 : clamp((visual[0] + .5) * tile - W / 2, 0, mw - W);
  camY = mh <= H ? -(H - mh) / 2 : clamp((visual[1] + .5) * tile - H * .52, 0, mh - H);
  camX = Math.round(camX * dpr) / dpr; camY = Math.round(camY * dpr) / dpr;
  ctx.save(); ctx.translate(-camX, -camY);
  const below = img(m.below || m.image);
  if (below) {
    ctx.imageSmoothingEnabled = tile * dpr < below.naturalWidth / m.width; ctx.imageSmoothingQuality = 'high';  // downscale smooth, upscale nearest
    ctx.drawImage(below, 0, 0, mw, mh); ctx.imageSmoothingEnabled = false;
  } else {
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) { ctx.fillStyle = m.solid[y][x] ? '#1b2324' : '#2c3634'; ctx.fillRect(x * tile + .5, y * tile + .5, tile - 1, tile - 1); }
  }
  if (dbg.grid) {
    ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= m.width; x++) { ctx.moveTo(x * tile, 0); ctx.lineTo(x * tile, mh); }
    for (let y = 0; y <= m.height; y++) { ctx.moveTo(0, y * tile); ctx.lineTo(mw, y * tile); }
    ctx.stroke();
    ctx.fillStyle = '#ff5a5a22'; for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (R.blocked(m, x, y)) ctx.fillRect(x * tile, y * tile, tile, tile);
  }
  if (dbg.portals) {
    for (const p of m.portals) {
      ctx.strokeStyle = p.trigger === 'exit' ? '#8de0c0' : '#efd28e'; ctx.lineWidth = 2;
      for (const [x, y] of p.cells) ctx.strokeRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
      const [x, y] = p.cells[0]; ctx.fillStyle = '#fff'; ctx.font = `${Math.max(9, tile * .3)}px system-ui`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(p.kind + '→' + p.to_map + (S.maps[p.to_map] ? '' : ' (unbuilt)'), x * tile + 3, y * tile + tile - 4);
    }
  }
  const items = [];
  for (const a of m.actors) items.push({ k: 'a', a, z: a.at[1] });
  for (const a of m.overlay.actors) items.push({ k: 'a', a, z: a.at[1] });
  for (const p of m.overlay.props) items.push({ k: 'p', p, z: p.at[1] + (p.h || 1) - 1.01 });
  items.push({ k: 'you', z: visual[1] + .001 });
  items.sort((a, b) => a.z - b.z);
  for (const it of items) it.k === 'p' ? drawProp(it.p) : it.k === 'a' ? drawActor(it.a, now) : drawPlayer(now);
  // labels and the one speech bubble
  const people = [...m.actors, ...m.overlay.actors];
  let talk = null;
  if (bubble && bubble.node === curId && now < bubble.until) { const a = people.find(p => p.name === bubble.who); if (a) talk = { a, text: bubble.text }; }
  if (!talk) {
    const near = people.filter(a => Math.hypot(a.at[0] - pos[0], a.at[1] - pos[1]) < 2.3 && m.overlay.lines[a.name]).sort((a, b) => Math.hypot(a.at[0] - pos[0], a.at[1] - pos[1]) - Math.hypot(b.at[0] - pos[0], b.at[1] - pos[1]))[0];
    if (near) talk = { a: near, text: m.overlay.lines[near.name] };
  }
  for (const a of people) {
    if (talk && talk.a === a) continue;
    if (Math.hypot(a.at[0] - pos[0], a.at[1] - pos[1]) < 2.3 || hover === a) label(a.name, (a.at[0] + .5) * tile, a.at[1] * tile - tile * .02);
  }
  const above = img(m.above);
  if (above) { ctx.imageSmoothingEnabled = tile * dpr < above.naturalWidth / m.width; ctx.drawImage(above, 0, 0, mw, mh); ctx.imageSmoothingEnabled = false; }
  if (m.tint) {
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgb(${m.tint.join(',')})`; ctx.fillRect(0, 0, mw, mh);
    const light = img(m.light); if (light) { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(light, 0, 0, mw, mh); }
    ctx.globalCompositeOperation = 'source-over';
  }
  label('YOU', (visual[0] + .5) * tile, visual[1] * tile + tile * .02, '#98e8cc');
  if (talk) drawBubble(talk.a.name, talk.text, (talk.a.at[0] + .5) * tile, (talk.a.at[1] + .5) * tile);
  ctx.restore();
}
// debug: the candidate timeline of the playing beat (log time axis) with the clock
let tlSig = '';
function drawTimeline() {
  if (!dbg.timeline || !S) return;
  const tl = S.timeline();
  if (!tl) { $('tlClock').textContent = 'no beat'; $('tlInfo').textContent = 'say a recorded line to start the clock'; $('tlTrack').querySelectorAll('.tl-mark').forEach(e => e.remove()); tlSig = ''; $('tlHead').style.left = '0'; return; }
  const X = t => (Math.log1p(Math.max(0, t)) / Math.log1p(tl.end) * 100).toFixed(2) + '%';
  $('tlClock').textContent = `t+${tl.now.toFixed(1)} s`;
  $('tlInfo').textContent = `${S.active.id} · ${speed === 0 ? 'instant' : speed + 'x'} · log time to ${tl.end.toFixed(0)} s`;
  const sig = tl.marks.map(m => m.status).join();
  if (sig !== tlSig) {
    tlSig = sig; $('tlTrack').querySelectorAll('.tl-mark').forEach(e => e.remove());
    let ci = 0;
    for (const mk of tl.marks) {
      const d = document.createElement('div');
      if (mk.type === 'candidate') { d.className = 'tl-mark ' + mk.status; d.style.cssText = `left:${X(mk.t)};--c:${COL[mk.model] || '#ccc'};top:${ci++ % 2 ? 15 : 2}px`; d.innerHTML = `<i></i>${esc(mk.model)}`; d.title = `${mk.model} ${mk.t.toFixed(1)} s: ${mk.status}`; }
      else { d.className = 'tl-mark ev ' + mk.status; d.style.cssText = `left:${X(mk.t)};top:2px`; d.innerHTML = '<i></i>'; d.title = mk.type; }
      $('tlTrack').append(d);
    }
  }
  $('tlHead').style.left = X(tl.now);
}

// ------------------------------------------------------------------ graph view (SVG)
const SVGNS = 'http://www.w3.org/2000/svg';
function layoutGraph(g) {
  const by = Object.fromEntries(g.nodes.map(n => [n.id, n])), boxes = {}, bands = [];
  const lvl = n => (n.place && n.place.level) || 0;
  const isInterior = n => n.kind === 'interior' || (n.place && n.place.anchor && n.place.anchor.in && !n.place.rect);
  const isStub = n => n.status === 'stub' && !(n.place && (n.place.rect || (n.place.anchor && n.place.anchor.in)));
  const rectBox = (r, n) => ({ x: r[0], y: r[1], w: r[2] - r[0] + 1, h: r[3] - r[1] + 1, n });
  const partner = (id, types) => { for (const l of g.links) if (types.includes(l.type) && (l.a === id || l.b === id)) { const o = l.a === id ? l.b : l.a; if (boxes[o]) return o; } return null; };
  for (const n of g.nodes) if (lvl(n) === 0 && !isInterior(n) && n.place && n.place.rect) boxes[n.id] = rectBox(n.place.rect, n);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const grow = b => { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); };
  Object.values(boxes).forEach(grow);
  if (x0 > x1) { x0 = 0; y0 = 0; x1 = 15; y1 = 16; }
  const top0 = y0, bottom0 = y1;
  // interiors over their anchor (at the door's side of the anchor)
  const inter = g.nodes.filter(n => lvl(n) === 0 && !boxes[n.id] && !isStub(n));
  const perAnchor = {};
  for (const n of inter) {
    const an = (n.place && n.place.anchor && n.place.anchor.in && boxes[n.place.anchor.in] ? n.place.anchor.in : null) || partner(n.id, ['door', 'edge', 'vert']);
    if (!an) continue;
    const A = boxes[an], k = (perAnchor[an] = (perAnchor[an] || 0) + 1) - 1, anc = (n.place && n.place.anchor) || {}, r = n.place && n.place.rect;
    const h = Math.min(4, A.h * .3);
    let x, w, y;
    if (anc.span) { x = A.x + anc.span[0]; w = Math.max(3, anc.span[1] - anc.span[0] + 1); }
    else if (r) { w = Math.min(5, r[2] - r[0] + 1); x = clamp((r[0] + r[2] + 1) / 2, A.x + w / 2, A.x + A.w - w / 2) - w / 2; }
    else { w = 5; x = A.x + (A.w - w) / 2 + k * 5.5; }
    if (anc.door) y = A.y + clamp(anc.door[1] < A.h / 2 ? anc.door[1] - 1 : anc.door[1] - h + 1, .5, A.h - h - .5);
    else if (r) y = (r[1] + r[3]) / 2 < A.y + A.h / 2 ? A.y + .5 : A.y + A.h - h - .5;
    else y = A.y + .5;
    const bx = { x, y, w, h, n, inner: true, anchor: an };
    for (let guard = 0; guard < 12; guard++) {
      const o = Object.values(boxes).find(p => p.inner && p.anchor === an && bx.x < p.x + p.w && p.x < bx.x + bx.w && bx.y < p.y + p.h && p.y < bx.y + bx.h);
      if (!o) break;
      bx.x = o.x + o.w + .4; if (bx.x + bx.w > A.x + A.w) { bx.x = A.x + .3; bx.y = o.y + (bx.y < A.y + A.h / 2 ? h + .4 : -h - .4); }
    }
    boxes[n.id] = bx;
  }
  // other levels in bands: underground below the plane, upper floors above it
  const levels = [...new Set(g.nodes.map(lvl))].filter(l => l !== 0).sort((a, b) => b - a);
  let cursorDown = bottom0 + 3, cursorUp = top0 - 3;
  for (const L of levels.filter(l => l < 0).sort((a, b) => b - a).concat(levels.filter(l => l > 0).sort((a, b) => a - b))) {
    const ns = g.nodes.filter(n => lvl(n) === L && !boxes[n.id] && !isStub(n)), raw = [];
    for (const n of ns) {
      let r = n.place && n.place.rect;
      if (!r) { const an = partner(n.id, ['vert', 'door', 'edge']); if (an) { const A = boxes[an]; r = [A.x + A.w * .2, A.y + A.h * .25, A.x + A.w * .8 - 1, A.y + A.h * .75 - 1]; } }
      if (!r) r = [x0, 0, x0 + 9, 7];
      raw.push(rectBox(r, n));
    }
    if (!raw.length) continue;
    const my0 = Math.min(...raw.map(b => b.y)), my1 = Math.max(...raw.map(b => b.y + b.h));
    const shift = L < 0 ? cursorDown - my0 : cursorUp - my1;
    const placed = [];
    for (const b of raw) {
      b.y += shift;
      for (let guard = 0; guard < 20; guard++) {
        const o = placed.find(p => b.x < p.x + p.w && p.x < b.x + b.w && b.y < p.y + p.h && p.y < b.y + b.h);
        if (!o) break; b.y = L < 0 ? o.y + o.h + 1 : o.y - b.h - 1;
      }
      placed.push(b); boxes[b.n.id] = b; b.band = L;
    }
    const by0 = Math.min(...placed.map(b => b.y)) - 1, by1 = Math.max(...placed.map(b => b.y + b.h)) + 1;
    bands.push({ L, x: Math.min(x0, ...placed.map(b => b.x)) - 1, y: by0, w: Math.max(x1, ...placed.map(b => b.x + b.w)) - Math.min(x0, ...placed.map(b => b.x)) + 2, h: by1 - by0, label: L < 0 ? (L === -1 ? 'underground' : `underground ${L}`) : `floor +${L}` });
    if (L < 0) cursorDown = by1 + 3; else cursorUp = by0 - 3;
  }
  // stubs (promised by a built map, nothing known yet): small boxes beside the node that promises them
  const OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };
  const promiser = n => {
    for (const l of g.links) { if (l.a === n.id && boxes[l.b]) return { id: l.b, side: OPP[l.side] }; if (l.b === n.id && boxes[l.a]) return { id: l.a, side: l.side }; }
    const pb = n.promised_by || n.promisedBy;
    if (pb && boxes[pb.node]) return { id: pb.node, side: (pb.opening || {}).side };
    let best = null; for (const id in boxes) if (n.id.startsWith(id + '_') && (!best || id.length > best.length)) best = id;
    return best ? { id: best } : null;
  };
  const hits = b => Object.values(boxes).some(o => o !== b && !o.inner && b.x < o.x + o.w + .3 && o.x < b.x + b.w + .3 && b.y < o.y + o.h + .3 && o.y < b.y + b.h + .3);
  for (const n of g.nodes) {
    if (boxes[n.id] || !isStub(n)) continue;
    const pr = promiser(n); if (!pr) continue;
    const P = boxes[pr.id], A = P.inner ? boxes[P.anchor] || P : P, w = 7, h = 4, gap = .8;
    const at = side => side === 'E' ? [A.x + A.w + gap, A.y + (A.h - h) / 2] : side === 'W' ? [A.x - w - gap, A.y + (A.h - h) / 2]
      : side === 'S' ? [A.x + (A.w - w) / 2, A.y + A.h + gap] : [A.x + (A.w - w) / 2, A.y - h - gap];
    const sides = [...new Set([pr.side, 'E', 'W', 'S', 'N'].filter(Boolean))];
    let b = null;
    for (let k = 0; k < 6 && !b; k++) for (const sd of sides) {
      const [x, y] = at(sd), off = k * (sd === 'E' || sd === 'W' ? h + .6 : w + .6) * (k % 2 ? 1 : -1) * Math.ceil(k / 2) / Math.max(1, k);
      const c = { x: x + (sd === 'N' || sd === 'S' ? off : 0), y: y + (sd === 'E' || sd === 'W' ? off : 0), w, h, n, stub: true, from: pr.id, band: P.band };
      if (!hits(c)) { b = c; break; }
    }
    if (!b) { const [x, y] = at(sides[0]); b = { x, y, w, h, n, stub: true, from: pr.id, band: P.band }; }
    boxes[n.id] = b;
  }
  for (const bd of bands) {                      // a band also holds the stubs promised from inside it
    const bs = Object.values(boxes).filter(b => b.band === bd.L);
    const bx0 = Math.min(bd.x, ...bs.map(b => b.x - 1)), by0 = Math.min(bd.y, ...bs.map(b => b.y - 1));
    bd.w = Math.max(bd.x + bd.w, ...bs.map(b => b.x + b.w + 1)) - bx0; bd.h = Math.max(bd.y + bd.h, ...bs.map(b => b.y + b.h + 1)) - by0; bd.x = bx0; bd.y = by0;
    if (bd.L < 0) cursorDown = Math.max(cursorDown, bd.y + bd.h + 3);
  }
  // anything still unplaced: a row under everything
  let ux = x0;
  for (const n of g.nodes) if (!boxes[n.id]) { boxes[n.id] = { x: ux, y: cursorDown, w: 8, h: 5, n }; ux += 9; }
  for (const b of Object.values(boxes)) grow(b);
  for (const b of bands) grow(b);
  return { boxes, bands, bounds: [x0 - 1.5, y0 - 1.5, x1 - x0 + 3, y1 - y0 + 3], by };
}
function drawGraph() {
  if (!S) return;
  const svg = $('gsvg'), g = S.graph, Lg = layoutGraph(g);
  const rect = svg.getBoundingClientRect(), [bx, by, bw, bh] = Lg.bounds;
  const sc = Math.max(.01, Math.min(rect.width / bw, rect.height / bh)), u = v => (v / sc).toFixed(3);
  svg.setAttribute('viewBox', `${bx} ${by} ${bw} ${bh}`);
  const out = [];
  for (const b of Lg.bands) out.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${u(8)}" fill="#ffffff06" stroke="#9fb3ad" stroke-opacity=".55" stroke-width="${u(1.2)}" stroke-dasharray="${u(6)} ${u(4)}"/><text x="${b.x + u(6)}" y="${b.y + +u(13)}" font-size="${u(10.5)}" fill-opacity=".7">${esc(b.label)}</text>`);
  const ctr = id => { const b = Lg.boxes[id]; return b ? [b.x + b.w / 2, b.y + b.h / 2] : null; };
  for (const l of g.links) {
    const a = ctr(l.a), c = ctr(l.b); if (!a || !c) continue;
    const dash = l.type === 'door' ? `${u(1.5)} ${u(3)}` : l.type === 'vert' ? `${u(6)} ${u(4)}` : '';
    out.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#efe6c8" stroke-opacity="${l.type === 'edge' ? .55 : .75}" stroke-width="${u(l.type === 'edge' ? 2.2 : 1.6)}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  }
  for (const b of Object.values(Lg.boxes)) if (b.stub && b.from) {
    const a = ctr(b.from), c = ctr(b.n.id);
    if (a && c && !g.links.some(l => (l.a === b.from && l.b === b.n.id) || (l.b === b.from && l.a === b.n.id)))
      out.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#efe6c8" stroke-opacity=".5" stroke-width="${u(1.3)}" stroke-dasharray="${u(3)} ${u(3)}"/>`);
  }
  const order = Object.values(Lg.boxes).sort((a, b) => (a.inner ? 1 : 0) - (b.inner ? 1 : 0));
  for (const b of order) {
    const n = b.n, planned = n.status !== 'built', building = n.status === 'building' || n.building;
    const col = planned && !n.model ? '#d6d2c4' : COL[n.model] || '#d6d2c4', you = g.player === n.id;
    const sw = n.frozen ? 3.4 : 1.4;
    const fs = Math.min(12, Math.max(8.5, b.w * sc / 9)), maxc = Math.max(4, Math.floor(Math.max(b.w * sc, b.inner ? 84 : b.stub ? 110 : 0) / (fs * .56)));
    const t = b.stub ? stubLabel(n) : (n.title || n.id), tt = t.length > maxc ? t.slice(0, maxc - 1) + '…' : t;
    out.push(`<g class="n${building ? ' pulse' : ''}" data-id="${esc(n.id)}">`
      + `<rect x="${b.x + .15}" y="${b.y + .15}" width="${b.w - .3}" height="${b.h - .3}" rx="${u(5)}" fill="${col}" fill-opacity="${planned ? .08 : b.inner ? .5 : .24}" stroke="${col}" stroke-width="${u(sw)}"${planned ? ` stroke-dasharray="${u(5)} ${u(3.5)}"` : ''}/>`
      + (you ? `<rect class="you" x="${b.x - u(3)}" y="${b.y - u(3)}" width="${b.w + 2 * u(3)}" height="${b.h + 2 * u(3)}" rx="${u(7)}" fill="none" stroke="#8de0c0" stroke-width="${u(2)}"/>` : '')
      + `<text x="${b.x + b.w / 2}" y="${b.inner ? b.y + b.h / 2 + +u(fs * .35) : b.stub ? b.y + b.h / 2 - +u(1) : b.y + +u(fs + 4)}" text-anchor="middle" font-size="${u(fs)}"${b.stub ? ' fill-opacity=".9"' : ''}>${esc(tt)}</text>`
      + (b.stub ? `<text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + +u(fs)}" text-anchor="middle" font-size="${u(9)}" fill-opacity=".6">promised</text>` : '')
      + (!b.inner && !b.stub ? `<text x="${b.x + b.w / 2}" y="${b.y + b.h - +u(5)}" text-anchor="middle" font-size="${u(9.5)}" fill-opacity=".75">${esc(planned ? n.status : (n.model || '') + (n.seconds != null ? ' ' + n.seconds + 's' : ''))}${n.frozen ? ' · frozen' : ''}</text>` : '')
      + (you ? `<circle class="you" cx="${b.x + b.w / 2}" cy="${b.y + b.h / 2 + (b.inner ? 0 : +u(4))}" r="${u(b.inner ? 3.5 : 5)}" fill="#8de0c0" stroke="#0b1213" stroke-width="${u(1.5)}"/>` : '')
      + `</g>`);
  }
  svg.innerHTML = out.join('');
  for (const t of svg.querySelectorAll('text')) t.setAttribute('stroke-width', u(2.6));
  if (!$('gcard').hidden && $('gcard').dataset.id) showCard($('gcard').dataset.id);
}
function stubLabel(n) {
  if (n.title && n.title !== n.id) return n.title;
  let id = String(n.id); const w = S.graph.world || world;
  if (w && id.startsWith(w + '_')) id = id.slice(w.length + 1);
  return id.replace(/_+/g, ' ').replace(/([a-z])(\d)/gi, '$1 $2').trim() || n.id;
}
function showCard(id) {
  const n0 = S.gnode(id); if (!n0) return;
  const stub = n0.status === 'stub', n = stub ? { ...n0, title: stubLabel(n0), status: 'promised' } : n0;
  const c = $('gcard'); c.dataset.id = id; c.hidden = false;
  const cands = n.candidates || [];
  c.innerHTML = `<h3>${esc(n.title || id)}</h3><p><span class="sw" style="background:${COL[n.model] || '#d6d2c4'}"></span>${esc(n.status)}${n.model ? ' · ' + esc(n.model) : ''}${n.seconds != null ? ' · ' + n.seconds + ' s' : ''}${n.frozen ? ' · frozen' : ''}${n.seen ? ' · seen' : ''}${S.player === id ? ' · you are here' : ''}</p>`
    + (stub ? `<p>promised by an opening of a built map; nothing planned yet (id ${esc(id)})</p>` : '')
    + (n.purpose ? `<p>${esc(n.purpose)}</p>` : '')
    + (n.place && !stub ? `<p style="color:#7d918b">${esc(n.kind || '')} · level ${(n.place.level || 0)}${n.place.zone ? ' · ' + esc(n.place.zone) : ''}</p>` : '')
    + (cands.length ? `<table>${cands.map(k => `<tr><td><span class="sw" style="background:${COL[k.model] || '#ccc'}"></span>${esc(k.model)}</td><td>${k.seconds != null ? k.seconds + ' s' : ''}</td><td>${k.valid ? 'valid' : 'invalid'}</td><td>${esc(k.status || '')}</td></tr>`).join('')}</table>` : (n.models ? `<p>racing: ${esc(n.models.join(', '))}</p>` : ''));
}
$('gsvg').addEventListener('click', e => { const t = e.target.closest('.n'); if (t) showCard(t.dataset.id); else $('gcard').hidden = true; });

// ------------------------------------------------------------------ the loop
let last = performance.now(), lastIdleCheck = 0, lastTlSig = '';
function frame(now) {
  const dt = Math.min(.25, (now - last) / 1000); last = now;
  if (S && !live && S.active) {
    const was = S.playing;
    if (was) S.advance(speed === 0 ? 1e9 : dt * speed);
    if (was && !S.playing) markChips();
  }
  if (map()) {
    if (anim) {
      const t = Math.min(1, (now - anim.start) / 135);
      visual = [anim.from[0] + (anim.to[0] - anim.from[0]) * t, anim.from[1] + (anim.to[1] - anim.from[1]) * t];
      if (t === 1) {
        pos = [...anim.to]; visual = [...pos]; anim = null;
        if (!arrived()) { if (walkTarget) { const tg = walkTarget; walkTarget = null; go(tg); } else if (!queue.length && after) { const f = after; after = null; f(); } }
      }
    }
    if (!anim) { const k = [...keys].at(-1); if (k && dirs[k]) move(...dirs[k], now); else if (queue.length) { const to = queue.shift(); move(to[0] - pos[0], to[1] - pos[1], now); } }
    draw(now);
  }
  if (now - lastIdleCheck > 400) {
    lastIdleCheck = now;
    if (now > holdUntil) { const t = idleText(); if (t !== lastIdle) { $('statusText').innerHTML = t; $('statusText').className = ''; lastIdle = t; } }
    if (sheetTab) $('sClock').textContent = S && S.active ? `beat t+${S.beatTime.toFixed(1)} s${S.playing ? '' : ' · done'}` : '';
  }
  drawTimeline();
  requestAnimationFrame(frame);
}

// ------------------------------------------------------------------ boot
setDbg('portals', dbg.portals); setSpeed(speed);
resize();
try { index = await fetch(SESS + 'index.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw Error(r.status); return r.json(); }); }
catch (e) { status('No session packages (sessions/index.json missing).', 'warn'); }
// live.json ({"server": "..."}) prefills the server field and shows a note; never auto-connects; absent/dead = quiet
try {
  const lj = await fetchJSON('live.json', { cache: 'no-cache' }, 4000);
  if (lj && typeof lj.server === 'string' && lj.server) {
    $('server').value = lj.server;
    $('liveNote').hidden = false; $('liveNote').textContent = 'live server available' + (lj.started ? ' (started ' + lj.started + ')' : '') + ': connect to try it';
  }
} catch {}
fillWorlds();
const [hw, hb] = decodeURIComponent(location.hash.slice(1)).split('/');
const first = index.find(e => e.name === hb) || index.find(e => e.world === hw) || index[0];
if (first) { world = first.world; fillWorlds(); fillBeats(); await loadBase(first); }
requestAnimationFrame(frame);
// QA surface (screenshots/tests): read-only state plus the same entry points the UI uses
window.play4 = {
  get state() { return { map: curId, pos: [...pos], world, base: base && base.name, live: !!live, playing: !!(S && S.playing), beatTime: S ? S.beatTime : 0, installed: S && S.installed, frozen: S ? [...S.frozen] : [] }; },
  get session() { return S; }, submit, walkTo: t => go(t), open: (id, at) => open(id, at), step: (dx, dy) => move(dx, dy, performance.now()),
  setDbg, setSpeed, setGraph, showCard, openSheet, setMenu,
};
})().catch(e => { document.getElementById('statusText').textContent = 'Unable to start: ' + e.message; console.error(e); });
