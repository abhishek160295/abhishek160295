// Reel 023 — "Finish what you start" (story format: 4 scenes that build, small caps labels, mono + gold)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const cliff = (c, x1, x2, gy) => {
  const g = c.createLinearGradient(0, gy, 0, gy + 260); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, 260); c.restore();
  E.line(c, x1, gy, x2, gy, '#7a7a7a', 3); E.line(c, x1, gy, x1, gy + 200, '#444', 3); E.line(c, x2, gy, x2, gy + 200, '#444', 3);
};
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const work = ph => E.mix(E.pose('crouch'), E.pose('push'), (Math.sin(ph) + 1) / 2);

const REEL = { title: 'Finish what you start', bpm: 120, scenes: [
// 1 — Starting vs finishing: two bridges over the same canyon
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85;
  const bridge = (gy, frac, gold) => {
    const n = Math.floor(frac * 12 + 1e-6);
    for (let i = 0; i < n; i++) E.shaded(c, 301 + i * 40, gy - 6, 38, 18, 3, gold ? '#f7d36a' : '#b08a5a', gold ? '#a07a1a' : '#6b4f30');
    if (n) { E.line(c, 300, gy - 70, 300 + n * 40, gy - 70, gold ? GOLD : '#8a6a44', 4); for (let i = 0; i <= n; i += 3) E.line(c, 300 + i * 40, gy - 6, 300 + i * 40, gy - 70, gold ? GOLD : '#8a6a44', 4); }
  };
  const done = t > 6.2;
  LB(c, 'STARTING', 540, 540); LB(c, 'FINISHING', 540, 1110, { color: done ? GOLD : '#e8e8e8' });
  // top: fast start, quits at 40%
  cliff(c, -100, 300, gT); cliff(c, 780, 1180, gT);
  const ft = .4 * E.p(t, .2, 2.0, 'lin'); bridge(gT, ft, false);
  E.tag(c, `${Math.round(ft * 100)}%`, 540, gT + 55, t, -1, { size: 26, color: '#aaa' });
  let x = 270 + 480 * ft, pose = work(t * 9), f = 1, y = hipOn(gT, s) + 20;
  if (t > 2.0) { y = hipOn(gT, s); pose = { ...E.pose('stand'), hd: .2 }; }
  if (t > 3.0) { const k = E.p(t, 3.0, 4.4, 'lin'); x = E.lerp(462, 160, k); f = -1; pose = k < 1 ? E.walk(t * 9) : { ...E.pose('sad'), hd: .6 }; }
  fig(c, { x, y, s, f, color: '#bdbdbd', pose });
  E.tag(c, 'BORED', 462, 690, t, 2.3, { size: 24, color: '#bbb', alpha: 1 - E.p(t, 3.6, 4.0) });
  E.tag(c, 'STARTING SOMETHING NEW', 220, 690, t, 4.6, { size: 22, color: '#bbb' });
  // bottom: slow and steady, all the way across
  cliff(c, -100, 300, gB); cliff(c, 780, 1180, gB);
  const fb = E.p(t, .2, 6.2, 'lin'); bridge(gB, fb, done);
  E.tag(c, `${Math.round(fb * 100)}%`, 540, gB + 55, t, -1, { size: 26, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  let bx = 270 + 480 * fb, by = hipOn(gB, s) + 20, bp = work(t * 9);
  if (done) { const k = E.p(t, 6.2, 6.8, 'lin'); bx = E.lerp(750, 850, k); by = hipOn(gB, s); bp = k < 1 ? E.walk(t * 9) : win(t, 6.8); }
  if (t > 6.8) { E.glowDot(c, 850, by - 60, 340, 'rgba(245,197,66,.3)', E.p(t, 6.8, 7.3)); E.flag(c, 920, gB, E.p(t, 6.9, 7.2), 0); }
  if (!done) { const ho = { x: bx, y: by, s, pose: bp }, [hx, hy] = E.hand(ho); E.line(c, hx, hy, hx + 26, hy + 22, '#ccc', 7); }
  fig(c, { x: bx, y: by, s, color: t > 6.8 ? GOLD : '#fff', pose: bp });
  E.particles(c, 850, by - 80, t - 6.8, { n: 45, speed: 480, grav: 300 });
} },
// 2 — Shortcut vs the stairs
{ dur: 8.5, draw(c, t) {
  const gy = 1450, top = 650, s = .72;
  const P = [[620, 1450], [920, 1250], [620, 1050], [920, 850], [640, 650], [820, 650]];
  const up = E.p(t, .3, 7.0, 'lin'), done = up >= 1;
  LB(c, 'SHORTCUT', 300, 420); LB(c, 'THE STAIRS', 760, 420, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gy);
  // left: elevator up, cable snaps, back to zero
  E.line(c, 190, top, 190, gy, '#4a4a4a', 4); E.line(c, 410, top, 410, gy, '#4a4a4a', 4); E.line(c, 150, top, 450, top, '#7a7a7a', 4);
  E.rrect(c, 255, top - 170, 90, 170, 4, null, '#5a5a5a', 4);
  let cy = E.lerp(gy - 230, 880, E.p(t, .7, 1.9, 'out'));
  if (t > 2.5) cy = E.lerp(880, gy - 230, E.p(t, 2.5, 2.85, 'in'));
  const jit = t > 1.9 && t < 2.5 ? Math.sin(t * 70) * 4 : 0;
  if (t < 2.5) E.line(c, 300, top, 300, cy, '#9a9a9a', 3); else { const w = Math.sin(t * 12) * 30 * (1 - E.p(t, 2.5, 3.6)); c.save(); c.strokeStyle = '#9a9a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(300, top); c.quadraticCurveTo(300 + w, top + 90, 300 + w * .6, top + 170); c.stroke(); c.restore(); }
  c.save(); c.translate(jit, 0);
  E.rrect(c, 200, cy, 200, 230, 8, '#161616', '#9a9a9a', 4);
  const crashed = t > 2.85;
  const lx = t < .7 ? E.lerp(110, 300, E.p(t, 0, .7, 'lin')) : 300;
  fig(c, { x: lx, y: crashed ? cy + 230 - 52 : hipOn(cy + 230, s), s, color: '#bdbdbd', pose: t < .7 ? E.walk(t * 9) : crashed ? { ...E.pose('sit'), hd: .6, tor: .15 } : E.pose('stand') });
  E.tag(c, 'OVERNIGHT', 300, cy + 34, t, -1, { size: 20, color: '#ddd' });
  c.restore();
  E.particles(c, 300, gy, t - 2.85, { n: 40, speed: 420, color: '#9a9a9a', grav: 700, life: .8 });
  E.flash(c, t, 2.85, .25, '255,255,255', .25);
  E.tag(c, 'BACK TO ZERO', 300, gy - 290, t, 3.3, { size: 22, color: '#bbb' });
  // right: step by step to the door
  c.save(); c.strokeStyle = '#8a8a8a'; c.lineWidth = 4; c.lineJoin = 'round'; c.beginPath(); c.moveTo(P[0][0], P[0][1]);
  for (let i = 0; i < 4; i++) { const [x0, y0] = P[i], [x1, y1] = P[i + 1], n = 7; for (let k = 1; k <= n; k++) { const xa = E.lerp(x0, x1, (k - 1) / n), xb = E.lerp(x0, x1, k / n), yb = E.lerp(y0, y1, k / n); c.lineTo(xb, E.lerp(y0, y1, (k - 1) / n)); c.lineTo(xb, yb); } }
  c.lineTo(P[5][0] + 140, P[5][1]); c.stroke(); c.restore();
  const door = [870, top - 170, 80, 170];
  if (done) { E.glowDot(c, 910, top - 90, 360, 'rgba(245,197,66,.45)', E.p(t, 7.0, 7.5)); E.rays(c, 910, top - 90, 420, .25 * E.p(t, 7.0, 7.5), GOLD, 14, t * .2); }
  E.rrect(c, ...door, 4, done ? GOLD : '#141414', done ? GOLD : '#8a8a8a', 4);
  const segs = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1])), L = segs.reduce((a, b) => a + b, 0);
  let d = up * L, i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
  const k = Math.min(1, d / segs[i]), px = E.lerp(P[i][0], P[i + 1][0], k), py = E.lerp(P[i][1], P[i + 1][1], k), fd = P[i + 1][0] >= P[i][0] ? 1 : -1;
  fig(c, { x: px, y: hipOn(py, s), s, f: done ? 1 : fd, color: done ? GOLD : '#fff', pose: done ? win(t, 7.0) : { ...E.walk(t * 9, .5), tor: .2 } });
  E.tag(c, `STEP ${Math.max(1, Math.round(up * 120))}`, 780, gy + 70, t, -1, { size: 24, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.particles(c, px, py - 180, t - 7.0, { n: 45, speed: 480, grav: 300 });
} },
// 3 — Quitting vs adjusting: same wall, different answer
{ dur: 9, draw(c, t) {
  const gT = 950, gB = 1480, s = .85;
  const wall = gy => { E.shaded(c, 545, gy - 240, 90, 240, 6, '#9a9a9a', '#3e3e3e'); c.save(); c.translate(590, gy - 120); c.rotate(-Math.PI / 2); E.tag(c, 'PROBLEM', 0, 0, 1, -1, { size: 20, color: '#ddd', fill: '#141414' }); c.restore(); };
  const done = t > 7.3;
  LB(c, 'QUITTING', 540, 560); LB(c, 'ADJUSTING', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); wall(gT); wall(gB);
  // top: hits the wall, walks away
  let x = E.lerp(150, 500, E.p(t, 0, 1.4, 'lin')), f = 1, pose = E.walk(t * 9), a = 1;
  if (t > 1.4) { x = 500 - 14 * E.p(t, 1.4, 1.6, 'out'); pose = { ...E.pose('sad'), hd: .5 }; }
  if (t > 2.6) { const k = E.p(t, 2.6, 4.6, 'lin'); x = E.lerp(486, 40, k); f = -1; pose = E.walk(t * 9); a = 1 - E.p(t, 4.2, 4.6); }
  if (a > 0) fig(c, { x, y: hipOn(gT, s), s, f, color: '#bdbdbd', pose, alpha: a });
  E.tag(c, "IT'S OVER", 470, 680, t, 1.8, { size: 24, color: '#bbb', alpha: 1 - E.p(t, 4.2, 4.6) * .6 });
  // bottom: plan A, plan B, plan C
  const by0 = hipOn(gB, s); let bx = E.lerp(150, 500, E.p(t, 0, 1.4, 'lin')), by = by0, bf = 1, bp = E.walk(t * 9), pole = null;
  if (t > 1.4) { bx = 500; bp = E.pose('stand'); }
  if (t > 1.9 && t < 2.6) { const k = E.p(t, 1.9, 2.6, 'lin'); by = by0 - Math.sin(k * Math.PI) * 150; bp = E.pose('jump'); }
  if (t > 3.0 && t < 4.3) { bx = 488; bp = { ...E.pose('push'), dy: Math.sin(t * 30) * 2 }; }
  if (t > 4.3) bp = E.pose('stand');
  if (t > 4.6) { const k = E.p(t, 4.6, 5.4, 'lin'); bx = E.lerp(500, 250, k); bf = k < 1 ? -1 : 1; bp = k < 1 ? E.walk(t * 9) : E.pose('stand'); }
  if (t > 5.4) pole = 1;
  if (t > 5.6) { const k = E.p(t, 5.6, 6.3, 'lin'); bx = E.lerp(250, 470, k); bp = E.run(t * 16); }
  if (t > 6.3) { const k = E.p(t, 6.3, 7.0, 'inOut'); [bx, by] = hop(k, 470, by0, 760, by0, 320); bp = E.pose('jump'); }
  if (t > 7.0) { const k = E.p(t, 7.0, 7.3, 'out'); bx = E.lerp(760, 820, k); by = by0; bp = done ? win(t, 7.3) : E.pose('stand'); pole = null; }
  if (pole) { const ho = { x: bx, y: by, s, f: bf, pose: bp }, [hx, hy] = E.hand(ho); const plant = t > 6.0 ? [535, gB] : [hx + 150, hy + 60]; E.line(c, hx - 40, hy + 10, plant[0], plant[1], '#c8a46a', 7); }
  if (t > 7.3) { E.glowDot(c, 820, by - 60, 340, 'rgba(245,197,66,.3)', E.p(t, 7.3, 7.8)); E.flag(c, 900, gB, E.p(t, 7.4, 7.7), 0); }
  fig(c, { x: bx, y: by, s, f: bf, color: done ? GOLD : '#fff', pose: bp });
  E.particles(c, 820, by - 80, t - 7.3, { n: 45, speed: 480, grav: 300 });
  const PL = [['PLAN A: JUMP', 1.6, '#ddd'], ['PLAN A: FAILED', 2.6, '#999'], ['PLAN B: PUSH', 3.0, '#ddd'], ['PLAN B: FAILED', 4.3, '#999'], ['PLAN C', 4.7, GOLD]];
  PL.forEach(([str, t0, col], i) => { const t1 = i < PL.length - 1 ? PL[i + 1][1] : 1e9; if (t > t0 && t < t1) E.tag(c, str, 400, gB - 305, t, t0, { size: 24, color: col, fill: col === GOLD ? '#2a2208' : '#0c0c0c' }); });
} },
// 4 — Keep digging: he quit one swing from gold
{ dur: 9.5, draw(c, t) {
  const sy = 700, gold = 1450, s = .68, broke = t > 6.4;
  LB(c, 'KEEP DIGGING', 540, 430, { size: 34, ls: 5, color: broke ? GOLD : '#e8e8e8' });
  // earth cutaway
  c.save(); const g = c.createLinearGradient(0, sy, 0, 1700); g.addColorStop(0, '#2e2b28'); g.addColorStop(1, '#100f0e'); c.fillStyle = g; c.fillRect(-100, sy, 1280, 1000);
  for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,255,${.04 + .05 * E.rnd(i + 3)})`; c.beginPath(); c.arc(E.rnd(i) * 1080, sy + 20 + E.rnd(i + 9) * 900, 2 + 4 * E.rnd(i + 5), 0, 7); c.fill(); }
  c.restore();
  // the gold seam
  const glow = E.p(t, 6.4, 7.0);
  c.save(); c.fillStyle = '#2a2414'; c.fillRect(-100, gold, 1280, 110);
  for (let i = 0; i < 16; i++) { const x = i * 72 + 10 * E.rnd(i), y = gold + 18 + 60 * E.rnd(i + 2), r = 16 + 14 * E.rnd(i + 4); c.fillStyle = glow > 0 ? GOLD : '#5a4a1e'; c.globalAlpha = glow > 0 ? .35 + .65 * glow : 1; c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r * .8); c.lineTo(x - r, y); c.fill(); }
  c.restore();
  if (broke) { E.glowDot(c, 750, gold + 20, 520, 'rgba(245,197,66,.45)', glow); E.rays(c, 750, gold, 560, .3 * glow, GOLD, 16, t * .15); }
  E.line(c, -100, sy, 1180, sy, '#7a7a7a', 3);
  // shafts
  const dl = E.lerp(sy, 1415, E.p(t, .2, 4.6, 'out')), dr = E.lerp(sy, gold, E.p(t, .2, 6.4, 'lin'));
  [[330, dl], [750, dr]].forEach(([x, d]) => { E.rrect(c, x - 60, sy - 2, 120, d - sy + 2, 4, '#050505', '#454545', 3); c.save(); c.fillStyle = '#4a4540'; c.beginPath(); c.moveTo(x + 70, sy); c.quadraticCurveTo(x + 120, sy - (d - sy) * .09, x + 170, sy); c.fill(); c.restore(); });
  if (broke) E.rrect(c, 690, gold - 4, 120, 30, 4, '#050505');
  // left digger: fast, then quits and climbs out
  let lx = 330, ly = hipOn(dl, s) + 16, lp = work(t * 9), lf = 1;
  if (t > 4.6) { ly = hipOn(dl, s); lp = { ...E.pose('stand'), hd: .3 }; }
  if (t > 5.2) { const k = E.p(t, 5.2, 6.2, 'inOut'); ly = E.lerp(hipOn(dl, s), hipOn(sy, s), k); lx = E.lerp(330, 240, E.p(t, 6.0, 6.2)); lp = k < 1 ? { ...E.pose('climb'), aF: 2.8 + Math.sin(t * 10) * .2 } : E.pose('stand'); }
  if (t > 6.4) { const k = E.p(t, 6.4, 8.0, 'lin'); lx = E.lerp(240, 80, k); lf = -1; lp = k < 1 ? E.walk(t * 8) : { ...E.pose('sad'), hd: .6 }; }
  if (t < 4.6) { const ho = { x: lx, y: ly, s, pose: lp }, [hx, hy] = E.hand(ho); E.line(c, hx, hy, hx + 30, hy + 30, '#bbb', 6); }
  fig(c, { x: lx, y: ly, s, f: lf, color: '#bdbdbd', pose: lp });
  E.tag(c, `METER ${Math.round((dl - sy) / 7.5)}`, 330, 620, t, -1, { size: 22, color: '#bbb' });
  E.tag(c, 'NOTHING HERE', 330, dl - 250, t, 4.8, { size: 20, color: '#bbb', alpha: 1 - E.p(t, 5.2, 5.5) });
  // right digger: slower, never stops
  const ry = broke ? hipOn(gold + 20, s) : hipOn(dr, s) + 16, rp = broke ? win(t, 6.6) : work(t * 9);
  if (!broke) { const ho = { x: 750, y: ry, s, pose: rp }, [hx, hy] = E.hand(ho); E.line(c, hx, hy, hx + 30, hy + 30, '#ddd', 6); }
  fig(c, { x: 750, y: ry, s, color: broke ? GOLD : '#fff', pose: rp });
  E.tag(c, `METER ${Math.round((dr - sy) / 7.5)}`, 750, 620, t, -1, { size: 22, color: broke ? GOLD : '#ddd', fill: broke ? '#2a2208' : '#0c0c0c' });
  E.particles(c, 750, gold, t - 6.4, { n: 80, speed: 640, grav: 300, life: 1.8 });
  E.flash(c, t, 6.4, .3, '245,197,66', .3);
  // the gap he never saw
  if (t > 7.2) { const a = E.p(t, 7.2, 7.6); c.save(); c.globalAlpha = a; c.setLineDash([10, 8]); c.strokeStyle = GOLD; c.lineWidth = 4; c.strokeRect(272, 1415, 116, 35); c.restore(); E.tag(c, 'ONE MORE SWING', 330, 1610, t, 7.3, { size: 24, color: GOLD, fill: '#2a2208' }); }
} },
] };
