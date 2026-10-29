// Reel 033 — "Big rocks first" (≤31s, high motion, retention + reaction beats)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8', subCol) => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: subCol || (col === GOLD ? GOLD : '#8a8a8a'), align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const TEAL = '#5ee0c0';
const fallTo = (t, t0, y1, d = .45) => E.lerp(560, y1, E.p(t, t0, t0 + d, 'in'));

// left Tetris board: pieces dropped three at a time, wherever they land (precomputed once)
const MESS = (() => {
  const h = Array(10).fill(0), out = []; let over = null;
  for (let g = 0; g < 30 && over === null; g++) for (let j = 0; j < 3; j++) {
    const r = E.rnd(g * 3 + j + 1), vert = r < .45, w = vert ? 1 : 2 + Math.floor(E.rnd(g * 5 + j) * 3), hh = vert ? 3 : 1;
    const col = Math.floor(E.rnd(g * 7 + j * 3 + 2) * (11 - w)), land = Math.max(...h.slice(col, col + w));
    const t0 = .2 + g * .42, tl = t0 + .3;
    const cells = []; for (let q = 0; q < w; q++) for (let k = 0; k < hh; k++) cells.push([col + q, land + k]);
    for (let q = 0; q < w; q++) h[col + q] = land + hh + (vert ? 0 : Math.round(E.rnd(g + j + q) * .6));
    out.push({ t0, tl, cells, land });
    if (Math.max(...h) >= 14 && over === null) over = tl;
  }
  return { pieces: out, over };
})();

const REEL = { title: 'Big rocks first', bpm: 120, scenes: [
// 1 — Your day is a jar: sand first vs big rocks first
{ dur: 7.5, draw(c, t) {
  const gy = 1400, top = 960, J = [140, 640], JW = 260, R = 46, NAMES = ['HEALTH', 'FAMILY', 'GOALS', 'GROWTH'], done = t > 4.6;
  LB(c, 'YOUR DAY IS A JAR', 540, 520, { color: done ? GOLD : '#e8e8e8' });
  E.text(c, 'SAND FIRST', J[0] + JW / 2, 900, { size: 24, weight: 700, ls: 3, color: '#bbb' }); E.text(c, 'BIG ROCKS FIRST', J[1] + JW / 2, 900, { size: 24, weight: 700, ls: 3, color: done ? GOLD : '#bbb' });
  slab(c, -100, 1180, gy, 200);
  const sand = (x0, lvl) => { if (lvl >= gy) return; c.save(); const g = c.createLinearGradient(0, lvl, 0, gy); g.addColorStop(0, '#d9be86'); g.addColorStop(1, '#9a8458'); c.fillStyle = g; c.fillRect(x0 + 4, lvl, JW - 8, gy - lvl); c.fillStyle = 'rgba(80,60,30,.35)'; for (let i = 0; i < 60; i++) { const y = lvl + E.rnd(i + x0) * (gy - lvl); c.fillRect(x0 + 6 + E.rnd(i * 3 + x0) * (JW - 12), y, 3, 3); } c.restore(); };
  const stream = (x, y0, y1, col, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.fillStyle = col; c.fillRect(x - 6, y0, 12, y1 - y0); for (let i = 0; i < 10; i++) { const q = (t * 3 + i / 10) % 1; c.beginPath(); c.arc(x + Math.sin(i * 7) * 8, E.lerp(y0, y1, q), 4, 0, 7); c.fill(); } c.restore(); };
  const pebble = (x, y, a = 1) => { c.save(); c.globalAlpha = a; c.fillStyle = '#8a8a8a'; c.beginPath(); c.ellipse(x, y, 17, 13, 0, 0, 7); c.fill(); c.restore(); };
  const rock = (x, y, name, gold) => { c.save(); const g = c.createRadialGradient(x - 14, y - 16, 6, x, y, R); g.addColorStop(0, gold ? '#ffe08a' : '#b0b0b0'); g.addColorStop(1, gold ? '#a07a1a' : '#4a4a4a'); c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 7); c.fill(); c.restore(); E.text(c, name, x, y, { size: 15, weight: 800, family: MONO, color: '#111' }); };
  const glass = (x0, gold) => { c.save(); c.fillStyle = 'rgba(200,220,235,.05)'; c.fillRect(x0, top, JW, gy - top); c.strokeStyle = gold ? GOLD : '#9aa6b0'; c.lineWidth = 6; c.beginPath(); c.moveTo(x0, top); c.lineTo(x0, gy); c.lineTo(x0 + JW, gy); c.lineTo(x0 + JW, top); c.stroke(); c.restore(); };
  // right jar: rocks, then pebbles into the gaps, then sand fills the rest
  const xr = J[1], RK = [[xr + 72, gy - R - 4], [xr + 188, gy - R - 4], [xr + 96, gy - 3 * R - 4], [xr + 180, gy - 3 * R - 2]];
  if (done) E.glowDot(c, xr + JW / 2, gy - 220, 380, 'rgba(245,197,66,.35)', E.p(t, 4.6, 5.1));
  sand(xr, E.lerp(gy, top + 30, E.p(t, 3.0, 4.4, 'lin')));
  for (let i = 0; i < 14; i++) { const t0 = 1.8 + i * .07, px = xr + 20 + E.rnd(i + 4) * (JW - 40), py = gy - 20 - E.rnd(i + 9) * 260; if (t > t0) pebble(px, fallTo(t, t0, py, .35)); }
  RK.forEach(([x, y], i) => { const t0 = .3 + i * .3; if (t > t0) { rock(x, fallTo(t, t0, y), NAMES[i], done); E.particles(c, x, y + R, t - t0 - .45, { n: 10, speed: 200, color: '#9a9a9a', grav: 600, life: .4, seed: i }); } });
  stream(xr + 130, 600, E.lerp(gy, top + 30, E.p(t, 3.0, 4.4, 'lin')), '#d9be86', E.p(t, 3.0, 3.1) * (1 - E.p(t, 4.3, 4.45)));
  glass(xr, done);
  // left jar: sand and errands fill it; the big rocks don't fit
  const xl = J[0], lvl = E.lerp(gy, 1120, E.p(t, .2, 1.6, 'lin'));
  sand(xl, lvl);
  stream(xl + 130, 600, lvl, '#d9be86', E.p(t, .2, .3) * (1 - E.p(t, 1.5, 1.65)));
  if (t > .2 && t < 1.7) E.tag(c, 'SCROLLING', xl + 130, 760, t, .2, { size: 18, color: '#ddd' });
  for (let i = 0; i < 14; i++) { const t0 = 1.8 + i * .06, px = xl + 20 + E.rnd(i + 14) * (JW - 40), py = 1110 - E.rnd(i + 19) * 60; if (t > t0) pebble(px, fallTo(t, t0, py, .35)); }
  if (t > 1.8 && t < 2.8) E.tag(c, 'ERRANDS', xl + 130, 760, t, 1.8, { size: 18, color: '#ddd' });
  const LR = [[xl + 80, 1010, 2.8], [xl + 185, 1004, 3.1]];
  LR.forEach(([x, y, t0], i) => { if (t > t0) rock(x, fallTo(t, t0, y), NAMES[i], false); });
  if (t > 3.4) { const k = E.p(t, 3.8, 4.5, 'in'); const x = E.lerp(xl + 130, xl - 70, k), y = t < 3.8 ? fallTo(t, 3.4, 914, .4) : E.lerp(914, gy - R, k) - Math.sin(k * Math.PI) * 40; rock(x, y, NAMES[2], false); }
  if (t > 3.7) { const k = E.p(t, 4.1, 4.8, 'in'); const x = E.lerp(xl + 160, xl + 420, k), y = t < 4.1 ? fallTo(t, 3.7, 904, .4) : E.lerp(904, gy - R, k) - Math.sin(k * Math.PI) * 50; rock(x, y, NAMES[3], false); }
  glass(xl, false);
  if (t > 4.8) E.tag(c, 'NO ROOM', xl + 130, 840, t, 4.8, { size: 22, color: RED, fill: '#1e0a0a' });
  SAY(c, 'WHERE DID MY DAY GO?', xl + 150, 640, E.p(t, 5.2, 5.5, 'back'));
  CNT(c, 140, 1440, 'ROCKS IN', `${t > 3.2 ? 2 : t > 2.9 ? 1 : 0}/4`, 'NO ROOM LEFT', '#e8e8e8', t > 4.8 ? RED : null);
  CNT(c, 640, 1440, 'ROCKS IN', `${RK.filter((_, i) => t > .75 + i * .3).length}/4`, done ? 'EVERYTHING FITS' : 'BIG ROCKS FIRST', done ? GOLD : '#e8e8e8');
} },
// 2 — Starting is the hardest part: the car
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, CW = 240, ride = 4.0, done = t > ride + .5;
  const car = (x, gy, spin, gold) => {
    c.save(); E.shaded(c, x, gy - 96, CW, 62, 14, gold ? '#f7d36a' : '#9a9a9a', gold ? '#a07a1a' : '#4a4a4a');
    c.fillStyle = gold ? '#e0b040' : '#7a7a7a'; c.beginPath(); c.moveTo(x + 50, gy - 96); c.lineTo(x + 78, gy - 146); c.lineTo(x + 170, gy - 146); c.lineTo(x + 200, gy - 96); c.fill();
    c.fillStyle = '#1a1a1a'; c.beginPath(); c.moveTo(x + 66, gy - 100); c.lineTo(x + 86, gy - 138); c.lineTo(x + 120, gy - 138); c.lineTo(x + 120, gy - 100); c.fill(); c.beginPath(); c.moveTo(x + 128, gy - 100); c.lineTo(x + 128, gy - 138); c.lineTo(x + 164, gy - 138); c.lineTo(x + 186, gy - 100); c.fill(); c.restore();
    [x + 54, x + 186].forEach(wx => { c.save(); c.translate(wx, gy - 30); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.fill(); c.rotate(spin); c.strokeStyle = '#8a8a8a'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke(); } c.restore(); });
  };
  LB(c, 'PUSHES FOR 2 SECONDS', 540, 540); LB(c, 'KEEPS PUSHING', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: pushes, nothing happens, walks away
  const jig = t < 2.0 ? Math.sin(t * 40) * 2 : 0;
  car(560 + jig, gT, 0, false);
  let tx = 520, tf = 1, tp = { ...E.pose('push'), dy: Math.sin(t * 30) * 2 }, ty = hipOn(gT, s);
  if (t > 2.0) tp = { ...E.pose('stand'), hd: .3 };
  if (t > 3.0) { const k = E.p(t, 3.0, 4.2, 'lin'); tx = E.lerp(520, 150, k); tf = -1; tp = k < 1 ? E.walk(t * 9) : { ...E.pose('sit'), hd: .4 }; if (k >= 1) ty = gT - 54; }
  fig(c, { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp });
  SAY(c, "IT WON'T MOVE.", 400, 690, E.p(t, 2.2, 2.5, 'back'));
  CNT(c, 50, 590, 'EFFORT', t < 2 ? '100%' : '0%', 'SPEED 0', '#e8e8e8', RED);
  // bottom: the first push is the hardest, then it rolls
  const k = E.p(t, .2, ride + .6, 'in'), cx = E.lerp(300, 640, k), vel = (E.p(t + .02, .2, ride + .6, 'in') - E.p(t - .02, .2, ride + .6, 'in')) / .04;
  if (vel > .2) for (let i = 0; i < 4; i++) E.line(c, cx - 30 - i * 34, gB - 60 - i * 18, cx - 30 - i * 34 - 50 * Math.min(1, vel), gB - 60 - i * 18, 'rgba(255,255,255,.3)', 3);
  if (done) E.glowDot(c, cx + CW / 2, gB - 140, 400, 'rgba(245,197,66,.35)', E.p(t, ride + .5, ride + 1));
  car(cx, gB, k * 22, done);
  let bx = cx - 40, by = hipOn(gB, s), bp = { ...E.pose('push'), tor: .7 - .3 * k };
  if (t > ride) { const kk = E.p(t, ride, ride + .5); [bx, by] = hop(kk, cx - 40, hipOn(gB, s), cx + 120, hipOn(gB - 146, s), 90); bp = kk < 1 ? E.pose('jump') : win(t, ride + .5); }
  fig(c, { x: bx, y: by, s, color: done ? GOLD : '#fff', pose: bp });
  CNT(c, 50, 1110, 'EFFORT', `${Math.round(100 - 85 * k)}%`, `SPEED ${Math.round(40 * k)}`, done ? GOLD : '#e8e8e8');
  E.text(c, 'STARTING IS THE HARDEST PART.', 540, 470, { size: 24, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, ride + .6, ride + 1.0) });
} },
// 3 — Tetris: all at once vs one at a time
{ dur: 7, draw(c, t) {
  const CS = 30, BX = [110, 620], BOT = 1300, ROWS = 14, over = MESS.over, done = t > 5.4;
  const cell = (bx, q, r, col, a = 1) => { c.save(); c.globalAlpha = a; c.fillStyle = col; c.fillRect(bx + q * CS + 1, BOT - (r + 1) * CS + 1, CS - 2, CS - 2); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(bx + q * CS + 1, BOT - (r + 1) * CS + 1, CS - 2, 5); c.restore(); };
  const board = (bx, gold) => { c.save(); c.fillStyle = '#0c0c0e'; c.fillRect(bx, BOT - ROWS * CS, 10 * CS, ROWS * CS); c.strokeStyle = gold ? GOLD : '#5a5a5a'; c.lineWidth = 4; c.strokeRect(bx, BOT - ROWS * CS, 10 * CS, ROWS * CS); c.restore(); };
  LB(c, 'ONE THING AT A TIME', 540, 520, { color: done ? GOLD : '#e8e8e8' });
  E.text(c, 'ALL AT ONCE', BX[0] + 150, 830, { size: 24, weight: 700, ls: 3, color: '#bbb' }); E.text(c, 'ONE AT A TIME', BX[1] + 150, 830, { size: 24, weight: 700, ls: 3, color: done ? GOLD : '#bbb' });
  // left: three pieces at a time, stacking anyhow until it's full
  board(BX[0], false);
  const dead = over !== null && t > over;
  MESS.pieces.forEach(p => { if (t < p.t0 || (over !== null && p.t0 > over)) return; const k = E.p(t, p.t0, p.tl, 'in');
    p.cells.forEach(([q, r]) => { if (r >= ROWS) return; const rr = k < 1 ? E.lerp(ROWS + 1, r, k) : r; if (rr < ROWS) cell(BX[0], q, rr, dead ? '#7a3a3a' : '#9a9a9a'); }); });
  if (dead) { E.flash(c, t, over, .3, '229,72,77', .25); E.tag(c, 'GAME OVER', BX[0] + 150, BOT - 7 * CS, t, over + .1, { size: 30, color: RED, fill: '#1e0a0a' }); }
  // right: one piece, one line, clear. Repeat.
  board(BX[1], done);
  const SEQ = [[0, 4], [4, 3], [7, 3]]; let lines = 0;
  for (let row = 0; row < 4; row++) {
    const base = .3 + row * 1.3, clear = base + 3 * .32 + .25;
    if (t > clear + .2) { lines++; continue; }
    SEQ.forEach(([col, w], j) => { const t0 = base + j * .32; if (t < t0) return; const k = E.p(t, t0, t0 + .28, 'in'), rr = E.lerp(ROWS + 1, 0, k);
      const flashOn = t > clear - .05; for (let q = 0; q < w; q++) if (rr < ROWS) cell(BX[1], col + q, rr, flashOn ? (Math.floor(t * 20) % 2 ? '#ffffff' : GOLD) : '#e8e8e8'); });
    if (t > clear - .05 && t < clear + .2) E.particles(c, BX[1] + 150, BOT - 15, t - clear + .05, { n: 30, speed: 360, grav: 300, life: .5, seed: row });
  }
  if (done) { E.glowDot(c, BX[1] + 150, BOT - 210, 340, 'rgba(245,197,66,.35)', E.p(t, 5.4, 5.9)); E.tag(c, 'CLEAR', BX[1] + 150, BOT - 7 * CS, t, 5.5, { size: 30, color: GOLD, fill: '#2a2208' }); }
  CNT(c, BX[0], 1340, 'LINES', 0, dead ? 'GAME OVER' : 'STACKING UP', '#e8e8e8', dead ? RED : null);
  CNT(c, BX[1], 1340, 'LINES', lines, done ? 'ALL CLEAR' : 'ONE AT A TIME', done ? GOLD : '#e8e8e8');
  SAY(c, 'I CAN HANDLE IT ALL.', BX[0] + 170, 750, E.p(t, .4, .7, 'back') * (1 - E.p(t, 2.6, 2.8)));
} },
// 4 — What success looks like: the line you expect vs the ride you get
{ dur: 8, draw(c, t) {
  const A = [170, 960], B = [880, 690], PA = [170, 1450], PB = [880, 1160], arrive = 6.4, done = t > arrive;
  const path = u => [E.lerp(PA[0], PB[0], u) + 70 * Math.sin(2 * Math.PI * 4 * u), E.lerp(PA[1], PB[1], u) - 80 * Math.sin(2 * Math.PI * 4 * u + Math.PI / 2) + 60];
  LB(c, 'WHAT YOU THINK', 540, 560); LB(c, 'WHAT IT REALLY LOOKS LIKE', 540, 1030, { color: done ? GOLD : '#e8e8e8' });
  // top: a perfect straight line
  E.line(c, A[0], A[1], B[0], B[1], '#7a7a7a', 6); E.flag(c, B[0], B[1], 1, 0);
  const ut = E.p(t, .3, 4.8, 'lin'), tx = E.lerp(A[0], B[0], ut), ty = E.lerp(A[1], B[1], ut);
  fig(c, { x: tx, y: hipOn(ty, .5), s: .5, color: '#bdbdbd', pose: ut < 1 ? E.walk(t * 9) : E.pose('stand') });
  // bottom: loops, drops and climbs, and you still arrive
  const ub = Math.min(1, E.p(t, .3, arrive, 'lin') + .012 * Math.sin(t * 9) * (t < arrive ? 1 : 0));
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.setLineDash([8, 10]); c.strokeStyle = '#3a3a3a'; c.lineWidth = 4; c.beginPath(); for (let u = 0; u <= 1; u += .004) { const [x, y] = path(u); u === 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  c.setLineDash([]); c.strokeStyle = done ? GOLD : '#e8e8e8'; c.lineWidth = 7; c.beginPath(); for (let u = 0; u <= ub; u += .004) { const [x, y] = path(u); u === 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore();
  const [px, py] = path(ub), [ex, ey] = path(1);
  if (done) { E.glowDot(c, ex, ey - 40, 380, 'rgba(245,197,66,.45)', E.p(t, arrive, arrive + .5)); E.rays(c, ex, ey - 40, 440, .28 * E.p(t, arrive, arrive + .5), GOLD, 14, t * .2); E.flag(c, ex + 20, ey, E.p(t, arrive, arrive + .3), 0); }
  E.rrect(c, px - 26, py - 20, 52, 20, 6, done ? GOLD : '#9a9a9a');
  fig(c, { x: px, y: py - 20 - (done ? E.FIG_H * .5 : 30), s: .5, color: done ? GOLD : '#fff', pose: done ? win(t, arrive) : { ...E.pose('sit'), aF: 2.6, eF: .3, aB: 2.4, eB: .3 } });
  const setbacks = Math.min(4, Math.floor(4 * ub + .25));
  CNT(c, 60, 600, 'SETBACKS', setbacks, done ? 'ARRIVED ANYWAY' : 'STILL GOING', done ? GOLD : '#e8e8e8');
  E.text(c, "IT'S SUPPOSED TO BE MESSY.", 540, 470, { size: 30, weight: 700, ls: 4, color: GOLD, alpha: E.p(t, arrive + .4, arrive + .9) });
  E.particles(c, ex, ey - 60, t - arrive, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
] };
