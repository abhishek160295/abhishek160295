// Reel 027 — "Go on" (story format + ref #15 devices: words as objects, two-line counters, light as reward, excuse bubbles, diagram finale)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8') => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: col === GOLD ? GOLD : '#8a8a8a', align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const mixCol = (a, b, k) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(E.lerp(v, B[i], k))).join(',')})`; };

const REEL = { title: 'Go on', bpm: 120, scenes: [
// 1 — Stops at NO vs goes ON: the same word, read the other way
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .82, DX = [380, 600, 820];
  const door = (x, gy, open) => {
    if (open > 0) { E.glowDot(c, x, gy - 100, 200, 'rgba(255,214,120,.55)', open); }
    E.rrect(c, x - 46, gy - 210, 92, 210, 4, open > 0 ? mixCol('#0e0e0e', '#ffe7a8', open) : '#0e0e0e', '#8a8a8a', 4);
    if (open < 1) { c.save(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(x - 46, gy - 210); c.lineTo(x - 46 + 92 * (1 - open), gy - 210 + 14 * open); c.lineTo(x - 46 + 92 * (1 - open), gy - 14 * open); c.lineTo(x - 46, gy); c.fill(); c.restore(); }
  };
  const sign = (x, gy, k, bad) => { // k: 0 = "NO", 1 = "ON" (the letters trade places)
    const col = bad ? '#c46a6a' : mixCol('#cfcfcf', '#f5c542', k);
    const nx = E.lerp(x - 24, x + 24, k), ox = E.lerp(x + 24, x - 24, k), arc = Math.sin(k * Math.PI) * 34;
    const sh = bad ? Math.sin(t * 50) * 3 * (t > 1.1 && t < 1.5 ? 1 : 0) : 0;
    E.text(c, 'N', nx + sh, gy - 262 - arc, { size: 58, weight: 900, color: col });
    E.text(c, 'O', ox + sh, gy - 262 + arc, { size: 58, weight: 900, color: col });
  };
  const done = t > 6.1;
  LB(c, 'STOPS AT NO', 540, 520); LB(c, 'GOES ON', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: hears NO at the first door and goes home
  DX.forEach(x => { door(x, gT, 0); sign(x, gT, 0, true); });
  let tx = E.lerp(120, 300, E.p(t, 0, 1.0, 'lin')), tf = 1, tp = t < 1.0 ? E.walk(t * 9) : E.pose('stand'), ty = hipOn(gT, s);
  if (t > 2.6) { const k = E.p(t, 2.6, 3.8, 'lin'); tx = E.lerp(300, 130, k); tf = -1; tp = k < 1 ? E.walk(t * 9) : { ...E.pose('sit'), hd: .4 }; if (k >= 1) ty = gT - 54; }
  fig(c, { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp });
  SAY(c, 'THEY SAID NO.', 200, 610, E.p(t, 1.6, 1.9, 'back'));
  // bottom: every NO flips to ON, every door opens
  const plan = [[0, 1.0, 120, 300], [1.9, 2.8, 300, 520], [3.7, 4.6, 520, 740], [5.5, 6.1, 740, 900]];
  const flips = [[1.1, 1.6], [2.9, 3.4], [4.7, 5.2]];
  DX.forEach((x, i) => { const [a, b] = flips[i]; door(x, gB, E.p(t, b, b + .3)); sign(x, gB, E.p(t, a, b, 'inOut'), false); });
  let bx = 300, bp = E.pose('stand');
  plan.forEach(([a, b, x0, x1]) => { if (t >= a && t < b) { bx = E.lerp(x0, x1, (t - a) / (b - a)); bp = E.walk(t * 9); } else if (t >= b) bx = x1; });
  if (done) { bp = win(t, 6.2); E.glowDot(c, 900, hipOn(gB, s) - 60, 320, 'rgba(245,197,66,.3)', E.p(t, 6.2, 6.6)); }
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: bp });
  CNT(c, 50, 1110, 'DOORS', `${flips.filter(([, b]) => t > b).length}`, 'OPENED', done ? GOLD : '#e8e8e8');
  E.particles(c, 900, hipOn(gB, s) - 80, t - 6.2, { n: 45, speed: 480, grav: 300 });
} },
// 2 — Floating vs swimming: the current takes everyone who stops
{ dur: 8.5, draw(c, t) {
  const rT = 1020, rB = 1300, arrive = 6.6, done = t > arrive + .5;
  LB(c, 'FLOATING', 300, 820); LB(c, 'SWIMMING', 780, 820, { color: done ? GOLD : '#e8e8e8' });
  // banks, river, waterfall
  c.save(); const g = c.createLinearGradient(0, rT, 0, rB); g.addColorStop(0, '#2a3a48'); g.addColorStop(1, '#141c24'); c.fillStyle = g; c.fillRect(150, rT, 1100, rB - rT);
  c.strokeStyle = 'rgba(200,220,235,.35)'; c.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const x = 1180 - ((E.rnd(i) * 1100 + t * 150 * (1 + E.rnd(i + 3) * .6)) % 1030), y = rT + 20 + E.rnd(i + 7) * (rB - rT - 40); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 46, y); c.stroke(); }
  const wf = c.createLinearGradient(0, rT, 0, 1620); wf.addColorStop(0, '#3a4c5c'); wf.addColorStop(1, 'rgba(20,28,36,0)'); c.fillStyle = wf; c.fillRect(60, rT, 92, 600);
  c.strokeStyle = 'rgba(220,235,245,.45)'; for (let i = 0; i < 14; i++) { const x = 66 + E.rnd(i + 2) * 80, q = (t * 1.8 + E.rnd(i)) % 1; c.beginPath(); c.moveTo(x, rT + q * 560); c.lineTo(x, rT + q * 560 + 60); c.stroke(); }
  c.restore();
  E.line(c, -100, rT, 150, rT, '#7a7a7a', 3); E.line(c, 150, rT, 1180, rT, '#6f8293', 3);
  E.shaded(c, 900, rT - 40, 300, 40, 4, '#4a4a4f', '#2a2a2e');
  if (done) { E.glowDot(c, 960, rT - 160, 380, 'rgba(245,197,66,.45)', E.p(t, arrive + .5, arrive + 1)); E.rays(c, 960, rT - 160, 440, .28 * E.p(t, arrive + .5, arrive + 1), GOLD, 14, t * .15); }
  E.text(c, '← CURRENT', 540, rB + 40, { size: 20, weight: 800, family: MONO, ls: 3, color: '#7a8a98' });
  // floaters: relaxed on their rings, carried to the edge one by one
  [520, 710, 900].forEach((x0, i) => {
    const x = x0 - 92 * t, edge = (x0 - 160) / 92, fall = E.p(t, edge, edge + .7, 'in'); if (fall >= 1) return;
    const y = rT + 18 + Math.sin(t * 2 + i) * 4 + fall * 420;
    c.save(); c.globalAlpha = 1 - fall; c.strokeStyle = '#8a8a8a'; c.lineWidth = 10; c.beginPath(); c.ellipse(Math.max(x, 150), y + 6, 54, 14, fall * 2, 0, 7); c.stroke(); c.restore();
    fig(c, { x: Math.max(x, 150) - 10, y: y - 6, s: .6, rot: -Math.PI / 2 + fall * 2.5, color: '#9a9a9a', alpha: 1 - fall, pose: { ...E.pose('stand'), aF: 2.9, eF: 2.2, aB: 2.9, eB: 2.2, lF: .3, kF: .4 } });
  });
  SAY(c, 'SO EASY.', 470, rT - 130, E.p(t, .4, .7, 'back') * (1 - E.p(t, 3.0, 3.2)));
  // the swimmer: slow, against it, every stroke
  const k = E.p(t, 0, arrive, 'inOut'), sx = E.lerp(420, 860, k) + Math.sin(t * 3) * 8 * (1 - k);
  if (t < arrive) { const ph = t * 6; fig(c, { x: sx, y: rT + 22, s: .62, rot: Math.PI / 2, f: 1, color: '#fff', pose: { ...E.pose('stand'), tor: 0, aF: ph % (Math.PI * 2), eF: .2, aB: (ph + Math.PI) % (Math.PI * 2), eB: .2, lF: .25 * Math.sin(t * 12), lB: -.25 * Math.sin(t * 12) } }); E.particles(c, sx + 40, rT + 10, (t * 2.5) % 1 * .4, { n: 8, speed: 160, color: '#c8d8e6', grav: 500, life: .4, seed: Math.floor(t * 2.5) }); }
  else { const kk = E.p(t, arrive, arrive + .5); fig(c, { x: E.lerp(860, 950, kk), y: hipOn(rT - 40, .62), s: .62, color: done ? GOLD : '#fff', pose: done ? win(t, arrive + .5) : E.pose('climb') }); }
  CNT(c, 620, rB + 90, 'METERS', Math.round(1000 * k).toLocaleString('en-US'), 'UPSTREAM', done ? GOLD : '#e8e8e8');
  E.particles(c, 950, rT - 160, t - arrive - .5, { n: 45, speed: 480, grav: 300 });
} },
// 3 — Waiting for talent vs practicing
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .78, gold = 5.2, done = t > 6.2;
  const piano = (x, gy) => {
    E.line(c, x + 20, gy - 70, x + 20, gy, '#555', 6); E.line(c, x + 200, gy - 70, x + 200, gy, '#555', 6);
    E.shaded(c, x, gy - 190, 220, 120, 8, '#3a3a3e', '#18181a');
    E.rrect(c, x - 6, gy - 200, 150, 14, 3, '#e8e8e8'); for (let k = 0; k < 9; k++) E.line(c, x + 8 + k * 15, gy - 200, x + 8 + k * 15, gy - 192, '#111', 4);
    E.line(c, x - 70, gy - 70, x - 10, gy - 70, '#666', 8); E.line(c, x - 64, gy - 70, x - 64, gy, '#555', 5); E.line(c, x - 16, gy - 70, x - 16, gy, '#555', 5);
  };
  const note = (x, y, col, rot, a) => { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(1.6, 1.6); c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 13, 9, -.4, 0, 7); c.fill(); c.beginPath(); c.moveTo(11, -3); c.lineTo(11, -44); c.quadraticCurveTo(26, -36, 24, -22); c.stroke(); c.restore(); };
  LB(c, 'WAITING FOR TALENT', 540, 540); LB(c, 'PRACTICING', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  const day = 1 + Math.round(999 * E.p(t, .2, 6.2, 'lin'));
  // top: sits at the piano, never plays
  piano(560, gT);
  fig(c, { x: 520, y: gT - 70 - 8, s, color: '#bdbdbd', pose: { ...E.pose('sit'), aF: .9, eF: 1.9, aB: .9, eB: 1.9, hd: .1 } });
  SAY(c, 'ONE DAY.', 420, 680, E.p(t, 1.0, 1.3, 'back') * (1 - E.p(t, 3.8, 4.0)));
  SAY(c, 'NOT A NATURAL.', 420, 680, E.p(t, 4.0, 4.3, 'back'));
  CNT(c, 50, 590, 'DAY', day, '0 HOURS');
  // bottom: plays every day; the notes go from wrong to gold
  if (done) E.glowDot(c, 600, gB - 220, 520, 'rgba(245,197,66,.3)', E.p(t, 6.2, 6.8));
  piano(560, gB);
  const play = Math.sin(t * 14);
  fig(c, { x: 520, y: gB - 70 - 8, s, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('sit'), aF: 2.6, eF: .2, aB: 2.4, eB: .2, hd: -.3 } : { ...E.pose('sit'), aF: 1.35 + play * .12, eF: .5, aB: 1.25 - play * .12, eB: .5 } });
  for (let i = 0; i < 40; i++) {
    const born = i * .2; if (t < born || born > 6.4) continue;
    const q = (t - born) / 2.2; if (q > 1) continue;
    const ph = born < 2.6 ? 0 : born < gold ? 1 : 2;
    const col = ph === 0 ? RED : ph === 1 ? '#bbbbbb' : GOLD, wob = ph === 0 ? Math.sin(i * 3) * .7 : 0;
    const x = 640 + q * 300 + (ph === 2 ? Math.sin(q * 6 + i) * 30 : E.rnd(i) * 60), y = gB - 230 - q * (ph === 2 ? 300 : 200) + (ph === 0 ? Math.sin(q * 20) * 10 : 0);
    note(c, x, y, col, wob, 1 - q);
  }
  CNT(c, 50, 1120, 'DAY', day, `${Math.round(3000 * E.p(t, .2, 6.2, 'lin')).toLocaleString('en-US')} HOURS`, done ? GOLD : '#e8e8e8');
  E.particles(c, 620, gB - 260, t - 6.2, { n: 45, speed: 460, grav: 260 });
} },
// 4 — One square at a time: the pawn that kept moving
{ dur: 9.5, draw(c, t) {
  const SQ = 84, BX = 204, BY = 640, step = k => .5 + k * .8, promo = 5.4, done = t > promo;
  const sq = (col, row) => [BX + col * SQ + SQ / 2, BY + row * SQ + SQ / 2];
  const pawn = (x, y, col, a = 1, sc = 1) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(sc * 1.2, sc * 1.2); c.fillStyle = col; c.strokeStyle = '#111'; c.lineWidth = 2;
    c.beginPath(); c.roundRect(-24, 18, 48, 11, 3); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-16, 18); c.lineTo(-8, -6); c.lineTo(8, -6); c.lineTo(16, 18); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(0, -7, 12, 4, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -19, 12, 0, 7); c.fill(); c.stroke(); c.restore(); };
  const queen = (x, y, sc) => { c.save(); c.translate(x, y); c.scale(sc, sc); const g = c.createLinearGradient(0, -50, 0, 30); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, '#c9962a'); c.fillStyle = g; c.strokeStyle = '#5a4210'; c.lineWidth = 2;
    c.beginPath(); c.roundRect(-26, 18, 52, 11, 3); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 18); c.lineTo(-10, -18); c.lineTo(10, -18); c.lineTo(18, 18); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-20, -18); [-20, -10, 0, 10, 20].forEach((px, i) => { c.lineTo(px, -46); c.lineTo(px + 5, -24); }); c.lineTo(20, -18); c.closePath(); c.fill(); c.stroke();
    [-20, -10, 0, 10, 20].forEach(px => { c.beginPath(); c.arc(px, -48, 4, 0, 7); c.fill(); }); c.restore(); };
  LB(c, 'ONE SQUARE AT A TIME', 540, 470, { size: 34, ls: 5, color: done ? GOLD : '#e8e8e8' });
  // board
  for (let r = 0; r < 8; r++) for (let q = 0; q < 8; q++) { c.fillStyle = (r + q) % 2 ? '#1a1a1d' : '#2c2c30'; c.fillRect(BX + q * SQ, BY + r * SQ, SQ, SQ); }
  c.save(); c.strokeStyle = '#6a6a6a'; c.lineWidth = 3; c.strokeRect(BX, BY, SQ * 8, SQ * 8); c.restore();
  const [gx, gy] = sq(4, 0);
  if (t > step(5)) { E.glowDot(c, gx, gy, 140, 'rgba(245,197,66,.4)', E.p(t, step(5), step(5) + .3)); }
  // the others: a few squares, then they stop
  const says = [];
  [[0, 1, 'BORED.'], [1, 2, ''], [2, 0, ''], [3, 3, "WHAT'S THE POINT?"], [5, 1, ''], [6, 2, 'TOO SLOW.'], [7, 0, '']].forEach(([col, moves, w]) => {
    let row = 6; for (let k = 0; k < moves; k++) row -= E.p(t, step(k), step(k) + .35, 'inOut');
    const stopT = step(moves) - .2, dim = t > stopT ? E.p(t, stopT, stopT + .5) : 0;
    const [x, y] = sq(col, 0); pawn(x, BY + row * SQ + SQ / 2, '#e8e8e8', 1 - .6 * dim);
    if (w) says.push([w, x, BY + row * SQ - 20, E.p(t, stopT + .1, stopT + .4, 'back') * (1 - E.p(t, stopT + 1.6, stopT + 1.9))]);
  });
  // the one who keeps moving
  let row = 6; for (let k = 0; k < 6; k++) row -= E.p(t, step(k), step(k) + .35, 'inOut');
  const hy = BY + row * SQ + SQ / 2;
  if (done) { const k = E.p(t, promo, promo + .5, 'back'); E.rays(c, gx, gy, 480, .3 * E.p(t, promo, promo + .5), GOLD, 16, t * .15); E.glowDot(c, gx, gy, 380, 'rgba(245,197,66,.5)', E.p(t, promo, promo + .5) * (.85 + .15 * Math.sin(t * 4))); queen(gx, gy, .6 + .6 * k); }
  else pawn(gx, hy, '#ffffff', 1, 1 + .15 * Math.sin(Math.PI * ((t - .5) % .8) / .8) * (t < step(5) + .4 ? 1 : 0));
  E.flash(c, t, promo, .3, '245,197,66', .35);
  says.forEach(([w, x, y, a]) => SAY(c, w, x, y, a));
  const moves = Math.round(6 - row);
  CNT(c, 60, 1370, 'MOVES', done ? 6 : moves, done ? 'PAWN → QUEEN' : 'ONE SQUARE A DAY', done ? GOLD : '#e8e8e8');
  E.text(c, 'EVERY QUEEN WAS A PAWN THAT KEPT MOVING', 640, 1395, { size: 22, weight: 600, ls: 2, color: GOLD, alpha: E.p(t, 6.2, 6.7) });
  E.particles(c, gx, gy, t - promo, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
