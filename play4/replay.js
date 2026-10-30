// play4 replay engine: pure state machine over PROTOCOL.md session packages and events. No DOM.
// Browser: window.Replay. Node: require('./replay.js') (dev/test_replay.js).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.Replay = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RANK = { hand: 5, opus: 4, sonnet: 3, qwen: 2, pcg: 1 };
  const clone = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
  // normalised text for matching typed lines to recorded ones: lower case, no apostrophes/punctuation, single spaces
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[‘’'`]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function rankOf(model, fallback) { return RANK[model] != null ? RANK[model] : (fallback != null ? fallback : 0); }
  // A resolver turns a package-relative path (assets/x.png) into a URL. base must end with '/'.
  function makeResolver(base) {
    return p => {
      if (!p || typeof p !== 'string') return p;
      if (/^([a-z][a-z0-9+.-]*:|\/)/i.test(p)) return p;
      try { return new URL(p, base).href; } catch (e) { return base + p; }
    };
  }
  function resolveOverlay(ov, R) {
    const o = clone(ov) || {};
    o.actors = o.actors || []; o.props = o.props || []; o.lines = o.lines || {};
    if (R) for (const p of o.props) if (p.sprite) p.sprite = R(p.sprite);
    if (R) for (const a of o.actors) if (a.sprites) for (const k in a.sprites) a.sprites[k] = R(a.sprites[k]);
    return o;
  }
  function resolveMap(m, R) {
    const o = clone(m);
    for (const k of ['below', 'above', 'light', 'image']) if (o[k] && R) o[k] = R(o[k]);
    o.actors = o.actors || []; o.portals = o.portals || []; o.names = o.names || {};
    for (const a of o.actors) if (a.sprites && R) for (const k in a.sprites) a.sprites[k] = R(a.sprites[k]);
    o.overlay = resolveOverlay(o.overlay, R);
    return o;
  }
  // movement helpers shared with game.js
  function inside(m, x, y) { return x >= 0 && y >= 0 && x < m.width && y < m.height; }
  function propAt(m, x, y) {
    for (const p of (m.overlay && m.overlay.props) || []) {
      const w = p.w || 1, h = p.h || 1;
      if (x >= p.at[0] && x < p.at[0] + w && y >= p.at[1] && y < p.at[1] + h) return p;
    }
    return null;
  }
  function blocked(m, x, y) {
    if (!inside(m, x, y)) return true;
    if (m.solid[y][x]) return true;
    const p = propAt(m, x, y);
    return !!(p && p.solid);
  }
  // nearest walkable cell (BFS on the grid, ignoring walls, so the nudge is the shortest distance)
  function nearestWalkable(m, pos) {
    if (!blocked(m, pos[0], pos[1])) return [pos[0], pos[1]];
    let best = null, bd = 1e9;
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      if (blocked(m, x, y)) continue;
      const d = Math.abs(x - pos[0]) + Math.abs(y - pos[1]) + 0.001 * Math.hypot(x - pos[0], y - pos[1]);
      if (d < bd) { bd = d; best = [x, y]; }
    }
    return best || [pos[0], pos[1]];
  }

  class Session {
    constructor(opts = {}) {
      this.mode = opts.mode || 'replay';      // 'replay' | 'live'
      this.hooks = opts.hooks || {};
      this.reset();
    }
    reset() {
      this.maps = {}; this.graph = { nodes: [], links: [], player: null };
      this.frozen = new Set(); this.seen = new Set(); this.installed = {}; this.cands = {};
      this.pendingOverlay = {}; this.log = []; this.pkgs = {}; this.world = null; this.start = null;
      this.active = null; this.waiting = null; this.clock = 0; this.player = null; this.played = [];
    }
    _emit(name, ...a) { const f = this.hooks[name]; if (f) try { f(...a); } catch (e) { if (typeof console !== 'undefined') console.error(e); } }
    note(text, cls = 'info', t = null, type = 'client') {
      const e = { t: t != null ? t : (this.active || this.mode === 'live' ? this.clock : null), type, text, cls };
      this.log.push(e); this._emit('onLog', e); return e;
    }
    // ------------------------------------------------------------ packages
    load(pkg, resolve) {                    // reset to t=0 of this package
      this.reset(); this.world = pkg.world; this.start = pkg.start;
      this._add(pkg, resolve, true);
      this._prelude(pkg.id);
      return this;
    }
    merge(pkg, resolve) {                   // a later beat in the same session: the state accumulates
      if (this.pkgs[pkg.id]) return this;
      this._add(pkg, resolve, false);
      return this;
    }
    _add(pkg, resolve, fresh) {
      const R = resolve || (p => p);
      this.pkgs[pkg.id] = { pkg, R, cursor: 0, status: [] };
      for (const [id, m] of Object.entries(pkg.maps || {})) {
        if (this.maps[id]) continue;
        this.maps[id] = resolveMap(m, R);
        const nd = m.node || {};
        this.installed[id] = { model: nd.model || 'hand', rank: rankOf(nd.model || 'hand'), seconds: nd.seconds != null ? nd.seconds : null };
      }
      if (fresh || !this.graph.nodes.length) {
        this.graph = clone(pkg.graph) || { nodes: [], links: [], player: null };
        this.graph.nodes = this.graph.nodes || []; this.graph.links = this.graph.links || [];
      } else if (pkg.graph) {
        const have = new Set(this.graph.nodes.map(n => n.id));
        for (const n of pkg.graph.nodes || []) if (!have.has(n.id)) this.graph.nodes.push(clone(n));
        const lk = new Set(this.graph.links.map(l => [l.a, l.b].sort().join('|')));
        for (const l of pkg.graph.links || []) if (!lk.has([l.a, l.b].sort().join('|'))) this.graph.links.push(clone(l));
      }
      this._syncGraph();
    }
    // events before the package's first `line` are the state the user starts from: apply them at once
    _prelude(id) {
      const P = this.pkgs[id], ev = P.pkg.events || [];
      while (P.cursor < ev.length && ev[P.cursor].type !== 'line') { this._apply(ev[P.cursor], P, P.cursor, true); P.cursor++; }
    }
    // the recorded lines still ahead in a package
    linesAhead(id) {
      const P = this.pkgs[id]; if (!P) return [];
      return (P.pkg.events || []).slice(P.cursor).filter(e => e.type === 'line').map(e => e.text);
    }
    // Start a beat: the clock jumps to the matching `line` event's t; later events play as the clock advances.
    startBeat(id, text) {
      const P = this.pkgs[id]; if (!P) throw new Error('package not loaded: ' + id);
      const ev = P.pkg.events || [];
      let i = -1;
      for (let k = P.cursor; k < ev.length; k++) if (ev[k].type === 'line' && norm(ev[k].text) === norm(text)) { i = k; break; }
      if (i < 0) for (let k = P.cursor; k < ev.length; k++) if (ev[k].type === 'line') { i = k; break; }
      if (i < 0) { this.note('nothing more recorded in ' + id, 'warn'); return false; }
      if (this.active && this.active.id !== id) this._finishActive();
      for (; P.cursor < i; P.cursor++) this._apply(ev[P.cursor], P, P.cursor, true);
      const line = ev[i];
      this.active = { id, t0: line.t, start: i, end: this._segmentEnd(ev, i) };
      this.clock = line.t; this.waiting = null; this.played.push({ id, text, t0: line.t });
      this._apply({ ...line, text: text || line.text }, P, i, false);
      P.cursor = i + 1;
      this._emit('onBeat', this.active);
      return true;
    }
    _segmentEnd(ev, i) { let k = i + 1; while (k < ev.length && ev[k].type !== 'line') k++; return k; }
    _finishActive() {             // a new beat from another package: the rest of the old beat lands at once
      const A = this.active; if (!A) return;
      const P = this.pkgs[A.id], ev = P.pkg.events;
      while (P.cursor < A.end) { this._apply(ev[P.cursor], P, P.cursor, false); P.cursor++; }
      this.active = null;
    }
    get playing() { const A = this.active; return !!(A && this.pkgs[A.id].cursor < A.end); }
    get beatTime() { return this.active ? this.clock - this.active.t0 : 0; }
    // advance the beat clock by dt package-seconds (Infinity = instant); returns the events applied
    advance(dt) {
      const A = this.active; if (!A) return [];
      const P = this.pkgs[A.id], ev = P.pkg.events, out = [];
      const target = this.clock + dt;
      while (P.cursor < A.end && ev[P.cursor].t <= target) {
        const e = ev[P.cursor]; this.clock = Math.max(this.clock, e.t);
        this._apply(e, P, P.cursor, false); out.push(e); P.cursor++;
      }
      if (P.cursor < A.end) this.clock = target;
      else {
        this.clock = Math.min(target, Math.max(this.clock, (ev[A.end - 1] || {}).t || this.clock));
        if (A.end < ev.length && !this.waiting) { this.waiting = { id: A.id, text: ev[A.end].text }; this._emit('onWaiting', this.waiting); }
      }
      return out;
    }
    // live mode: events arrive from the server and apply at once
    applyLive(e, resolve) {
      if (!this.pkgs.live) this.pkgs.live = { pkg: { id: 'live', events: [] }, R: resolve || (p => p), cursor: 0, status: [] };
      const P = this.pkgs.live; P.pkg.events.push(e);
      if (e.t != null) this.clock = e.t;
      this._apply(e, P, P.pkg.events.length - 1, false);
    }
    // ------------------------------------------------------------ the player
    enter(node) {
      this.player = node; this.graph.player = node;
      const first = !this.seen.has(node);
      this.seen.add(node);
      const out = { node, froze: false, model: (this.installed[node] || {}).model };
      if (!this.frozen.has(node)) {
        this.frozen.add(node); out.froze = true;
        if ((this.cands[node] || []).length) this.note(`you entered ${this.title(node)}: frozen at the ${out.model} version`, 'freeze', null, 'enter');
      }
      if (first) out.first = true;
      this._syncGraph(); this._emit('onGraph');
      return out;
    }
    title(id) { return (this.maps[id] && this.maps[id].title) || (this.gnode(id) || {}).title || id; }
    gnode(id) { return this.graph.nodes.find(n => n.id === id); }
    // ------------------------------------------------------------ event application
    _status(P, i, s) { P.status[i] = s; }
    eventStatus(id, i) { const P = this.pkgs[id]; return P && P.status[i]; }
    _apply(e, P, i, quiet) {
      const R = P.R, L = (text, cls = 'ev') => { const x = { t: e.t, type: e.type, text, cls, quiet }; this.log.push(x); this._emit('onLog', x); };
      switch (e.type) {
        case 'line': L(`you: "${e.text}"`, 'line'); break;
        case 'judge': L(`judge (${e.model || 'jev'}, ${e.ms != null ? e.ms + ' ms' : '?'}): ${e.kind || '?'}, size ${e.size != null ? e.size : '?'}, ${e.where || '?'}${e.play_along ? ', play along' : ''}${e.urgency ? ', urgent' : ''}${e.layer ? ' -> ' + e.layer : ''}`, 'judge'); break;
        case 'plan':
          L(`plan (${e.model}, ${e.seconds != null ? e.seconds + ' s' : '?'}): ${e.summary || (e.ops || []).map(o => o.op).join(', ')}`, 'plan');
          if (e.summary && !quiet) this._emit('onToast', e.summary, 'plan');
          break;
        case 'say': {
          const m = this.maps[e.node];
          if (m) { m.overlay.lines[e.who] = e.text; }
          else { (this.pendingOverlay[e.node] = this.pendingOverlay[e.node] || resolveOverlay({}, R)).lines[e.who] = e.text; }
          L(`${e.who}: "${e.text}"`, 'say');
          if (!quiet) this._emit('onSay', e);
          break;
        }
        case 'overlay': {
          const ov = resolveOverlay(e.overlay, R), m = this.maps[e.node];
          if (m) m.overlay = ov; else this.pendingOverlay[e.node] = ov;
          L(`overlay on ${this.title(e.node)}: ${ov.actors.length} people, ${ov.props.length} things${Object.keys(ov.lines).length ? ', ' + Object.keys(ov.lines).length + ' lines' : ''}`, 'overlay');
          this._emit('onMap', e.node, 'overlay');
          break;
        }
        case 'map_update': {
          const old = this.maps[e.node], nm = resolveMap(e.map, R);
          if (!e.map.overlay && old) nm.overlay = old.overlay;
          else if (!e.map.overlay && this.pendingOverlay[e.node]) { nm.overlay = this.pendingOverlay[e.node]; delete this.pendingOverlay[e.node]; }
          this._keepLanding(nm, old);
          this.maps[e.node] = nm;
          if (!this.installed[e.node]) { const nd = e.map.node || {}; this.installed[e.node] = { model: nd.model || 'hand', rank: rankOf(nd.model || 'hand'), seconds: nd.seconds }; }
          const added = (nm.portals || []).filter(p => !old || !old.portals.some(q => q.id === p.id)).map(p => p.feature || p.to_map);
          L(`map update: ${this.title(e.node)}${added.length ? ' (+ ' + added.join(', ') + ')' : ''}`, 'update');
          this._syncGraph(); this._emit('onMap', e.node, 'update'); this._emit('onGraph');
          break;
        }
        case 'node_planned': {
          const n = clone(e.node) || {}; const id = n.id;
          const g = this.gnode(id);
          if (g && g.status === 'built' && this.maps[id]) { L(`planned ${n.title || id} (already built)`, 'graph'); break; }
          const nn = { ...n, status: 'planned' };
          if (g) Object.assign(g, nn); else this.graph.nodes.push(nn);
          L(`planned: ${n.title || id}${n.purpose ? ' (' + n.purpose + ')' : ''}`, 'graph');
          this._syncGraph(); this._emit('onGraph');
          break;
        }
        case 'build_start': {
          let g = this.gnode(e.node);
          if (!g) { g = { id: e.node, title: e.node, status: 'building', place: { level: 0, rect: null } }; this.graph.nodes.push(g); }
          if (!this.maps[e.node] || g.status !== 'built') g.status = 'building';
          g.building = true; g.models = e.models || [];
          L(`build: ${g.title || e.node} racing ${(e.models || []).join(', ')}`, 'graph');
          this._emit('onGraph');
          break;
        }
        case 'candidate': this._candidate(e, P, i, L); break;
        case 'freeze':
          if (this.mode === 'live') {
            this.frozen.add(e.node); L(`frozen: ${this.title(e.node)} at ${e.model}${e.seconds_after_arrival != null ? ' (' + e.seconds_after_arrival + ' s after arrival)' : ''}`, 'freeze');
            this._syncGraph(); this._emit('onGraph');
          } else L(`(recorded walk froze ${this.title(e.node)} at ${e.model}; you walk freely)`, 'ref');
          break;
        case 'enter': L(`(recorded walk entered ${this.title(e.node)})`, 'ref'); break;
        // incremental overlay edits (the runtime emits these, then usually a full `overlay` for the same node)
        case 'add_actor': case 'add_prop': case 'rename_prop': {
          const m = this.maps[e.node];
          const ov = m ? m.overlay : (this.pendingOverlay[e.node] = this.pendingOverlay[e.node] || resolveOverlay({}, R));
          if (e.type === 'add_actor' && e.actor) {
            if (!ov.actors.some(a => a.name === e.actor.name)) ov.actors.push(resolveOverlay({ actors: [e.actor] }, R).actors[0]);
            if (e.actor.says && !ov.lines[e.actor.name]) ov.lines[e.actor.name] = e.actor.says;
            L(`${e.actor.name} appears in ${this.title(e.node)}${e.by ? ' (' + e.by + ')' : ''}`, 'overlay');
          } else if (e.type === 'add_prop' && e.prop) {
            ov.props.push(resolveOverlay({ props: [e.prop] }, R).props[0]);
            L(`${e.prop.name || e.prop.kind} appears in ${this.title(e.node)}${e.by ? ' (' + e.by + ')' : ''}`, 'overlay');
          } else if (e.type === 'rename_prop') {
            const p = ov.props.find(q => e.at && q.at[0] === e.at[0] && q.at[1] === e.at[1]);
            if (p) p.name = e.name;
            L(`renamed: ${e.name}`, 'overlay');
          }
          this._emit('onMap', e.node, 'overlay');
          break;
        }
        case 'error': L(`error (${e.where || '?'}): ${e.error || ''}`, 'invalid'); break;
        case 'note': L(e.text || 'note', 'ref'); break;
        case 'graph': {
          const s = clone(e.snapshot) || {};
          this.graph = { nodes: s.nodes || [], links: s.links || [], player: this.player || s.player };
          this._syncGraph();
          L(`graph: ${this.graph.nodes.length} nodes, ${this.graph.links.length} links`, 'ref');
          this._emit('onGraph');
          break;
        }
        default: L(`${e.type}`, 'ev');
      }
    }
    _candidate(e, P, i, L) {
      const list = this.cands[e.node] = this.cands[e.node] || [];
      const rank = e.rank != null ? e.rank : rankOf(e.model);
      const inst = this.installed[e.node];
      const rec = { model: e.model, seconds: e.seconds, valid: !!e.valid, fails: e.fails || [], rank, t: e.t, status: '' };
      list.push(rec);
      const done = (status, text, cls) => { rec.status = status; this._status(P, i, status); L(text, cls); };
      const tag = `${e.model} ${e.seconds != null ? e.seconds + ' s' : ''}`.trim();
      if (!e.valid || !e.map) done('invalid', `candidate ${tag} for ${this.title(e.node)}: invalid${rec.fails.length ? ' (' + rec.fails.join('; ') + ')' : ''}`, 'invalid');
      else if (this.frozen.has(e.node)) done('late', `candidate ${tag} for ${this.title(e.node)}: late, not applied (frozen at ${inst ? inst.model : '?'})`, 'late');
      else if (inst && this.maps[e.node] && rank <= inst.rank) done('outranked', `candidate ${tag} for ${this.title(e.node)}: kept ${inst.model} (rank ${inst.rank} >= ${rank})`, 'kept');
      else {
        const broken = this.brokenPortals(e.node, e.map);
        if (broken.length) done('rejected', `candidate ${tag} for ${this.title(e.node)}: not applied, would strand ${broken.join(', ')}`, 'invalid');
        else {
          const old = this.maps[e.node];
          const nm = resolveMap(e.map, P.R);
          if (!e.map.overlay || (!e.map.overlay.actors && !e.map.overlay.props)) nm.overlay = (old && old.overlay) || this.pendingOverlay[e.node] || nm.overlay;
          delete this.pendingOverlay[e.node];
          this.maps[e.node] = nm;
          this.installed[e.node] = { model: e.model, rank, seconds: e.seconds };
          done('installed', `candidate ${tag} for ${this.title(e.node)}: installed${old ? ' (replaces ' + (inst ? inst.model : '?') + ')' : ''}`, 'install');
          this._emit('onMap', e.node, 'install');
        }
      }
      this._syncGraph(); this._emit('onGraph');
    }
    // a map_update recorded against another version of a neighbour (the user froze a different one) must not strand the
    // player: a portal whose landing is blocked in the version installed here keeps its old landing, else snaps to walkable
    _keepLanding(nm, old) {
      for (const p of nm.portals || []) {
        const T = this.maps[p.to_map]; if (!T || p.to_map === nm.id) continue;
        const bad = (p.to_cells || []).some(([x, y]) => blocked(T, x, y));
        if (!bad) continue;
        const was = old && (old.portals || []).find(q => q.id === p.id || (q.to_map === p.to_map && q.kind === p.kind));
        if (was && (was.to_cells || []).every(([x, y]) => !blocked(T, x, y))) p.to_cells = clone(was.to_cells);
        else p.to_cells = (p.to_cells || []).map(c => nearestWalkable(T, c));
      }
    }
    // the portals of other maps that lead into `node` must land on walkable cells of the candidate
    brokenPortals(node, cand) {
      const out = [];
      for (const [id, m] of Object.entries(this.maps)) {
        if (id === node) continue;
        for (const p of m.portals || []) {
          if (p.to_map !== node) continue;
          const ok = (p.to_cells || []).every(([x, y]) => x >= 0 && y >= 0 && x < cand.width && y < cand.height && !cand.solid[y][x]);
          if (!ok) out.push(`${m.title || id} (${p.feature || p.kind})`);
        }
      }
      return out;
    }
    // the client's truth over whatever the snapshot says: installed model/seconds, frozen, seen, candidates, player
    _syncGraph() {
      for (const n of this.graph.nodes) {
        const inst = this.installed[n.id];
        if (inst && this.maps[n.id]) { n.status = 'built'; n.model = inst.model; n.seconds = inst.seconds; n.building = this._stillRacing(n); }
        n.frozen = this.frozen.has(n.id); n.seen = this.seen.has(n.id);
        if (this.cands[n.id]) n.candidates = this.cands[n.id].map(c => ({ model: c.model, seconds: c.seconds, valid: c.valid, status: c.status }));
      }
      if (this.player) this.graph.player = this.player;
    }
    _stillRacing(n) {
      if (!n.models || !n.models.length) return false;
      const got = new Set((this.cands[n.id] || []).map(c => c.model));
      return n.models.some(m => !got.has(m)) && !this.frozen.has(n.id);
    }
    // debug: the candidate timeline of the active beat
    timeline() {
      const A = this.active; if (!A) return null;
      const P = this.pkgs[A.id], ev = P.pkg.events, marks = [];
      for (let k = A.start; k < A.end; k++) {
        const e = ev[k];
        if (e.type === 'candidate' || e.type === 'map_update' || e.type === 'say' || e.type === 'overlay' || e.type === 'build_start')
          marks.push({ t: e.t - A.t0, type: e.type, model: e.model, node: e.node, status: P.status[k] || (k < P.cursor ? 'done' : 'pending') });
      }
      const end = ((ev[A.end - 1] || {}).t || A.t0) - A.t0;
      return { now: this.clock - A.t0, end: Math.max(end, 1), marks };
    }
  }
  return { Session, norm, makeResolver, resolveMap, resolveOverlay, nearestWalkable, blocked, propAt, inside, RANK, rankOf };
});
