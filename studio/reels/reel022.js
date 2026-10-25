// Reel 022 — "Just the next step" (story format: 4 scenes that build, small caps labels, mono + gold)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const LW = 15;
const fig = (c, o) => E.figure(c, { lw: LW, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
// ground slab: lit top edge, graded fill fading to black
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
const block = (c, x, y, s, label, t, t0) => {
  E.shaded(c, x, y, s, s, 10, '#a3a3a3', '#4b4b4b');
  E.tag(c, label, x + s / 2, y + s / 2, t, t0, { size: 21, color: '#e8e8e8', fill: '#141414' });
};
const fall = (t, t0, y1) => E.lerp(380, y1, E.p(t, t0, t0 + .45, 'in'));

const REEL = { title: 'Just the next step', bpm: 120, scenes: [
// 1 — Same problems. One complains, one builds.
{ dur: 6, draw(c, t) {
  const gy = 1340, S = 150, LBL = ['REJECTED', 'BROKE', 'FAILED'], T0 = [-.2, 1.2, 2.4];
  slab(c, -100, 1180, gy);
  LB(c, 'COMPLAINING', 290, 690); LB(c, 'BUILDING', 740, 690, { color: t > 3.8 ? GOLD : '#e8e8e8' });
  // left: the problems stack into a wall in front of him
  T0.forEach((t0, i) => { if (t > t0) { const y1 = gy - S * (i + 1), y = fall(t, t0, y1); block(c, 350, y, S, LBL[i], t, t0 + .45); E.particles(c, 425, y1 + S, t - t0 - .45, { n: 18, speed: 260, color: '#9a9a9a', grav: 500, life: .6, seed: i }); } });
  const flinch = T0.some(t0 => t > t0 + .45 && t < t0 + .7);
  fig(c, { x: 250, y: hipOn(gy, .9), s: .9, color: '#bdbdbd', pose: t < 2.9 ? (flinch ? E.pose('sad') : E.pose('arms')) : { ...E.pose('sad'), hd: .7 } });
  E.tag(c, 'WHY ME?', 230, 960, t, 3.2, { size: 24, color: '#bbb' });
  // right: the same problems become steps
  const pos = [[590, gy - S], [740, gy - S], [740, gy - 2 * S]];
  T0.forEach((t0, i) => { if (t > t0) { const [x, y1] = pos[i], y = fall(t, t0, y1); block(c, x, y, S, LBL[i], t, t0 + .45); E.particles(c, x + S / 2, y1 + S, t - t0 - .45, { n: 18, speed: 260, color: '#9a9a9a', grav: 500, life: .6, seed: i + 5 }); } });
  const s = .9; let x = 510, y = hipOn(gy, s), pose = E.pose('stand');
  const h1 = E.p(t, .7, 1.3, 'inOut'), h2 = E.p(t, 3.0, 3.6, 'inOut');
  if (h1 > 0) [x, y] = hop(h1, 510, hipOn(gy, s), 665, hipOn(gy - S, s));
  if (h2 > 0) [x, y] = hop(h2, 665, hipOn(gy - S, s), 815, hipOn(gy - 2 * S, s), 110);
  if ((h1 > 0 && h1 < 1) || (h2 > 0 && h2 < 1)) pose = E.pose('jump');
  else if (t > 3.8) pose = { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.8, 4.1, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 };
  if (t > 3.8) { E.glowDot(c, x, y - 60, 360, 'rgba(245,197,66,.35)', E.p(t, 3.8, 4.4)); E.rays(c, x, y - 60, 460, .22 * E.p(t, 3.8, 4.4), GOLD, 14, t * .2); }
  if (t > 4.0) E.flag(c, 850, gy - 2 * S, E.p(t, 4.0, 4.3), 0);
  fig(c, { x, y, s, color: t > 3.8 ? GOLD : '#fff', pose });
  E.particles(c, x, y - 80, t - 3.8, { n: 50, speed: 520, grav: 300 });
} },
// 2 — Wishing vs working
{ dur: 8, draw(c, t) {
  const gT = 940, gB = 1470;
  LB(c, 'WISHING', 540, 520); LB(c, 'WORKING', 540, 1060, { color: t > 5.6 ? GOLD : '#e8e8e8' });
  // top: dry ground, a cloud that never rains
  slab(c, -100, 1180, gT, 200);
  c.save(); c.strokeStyle = '#151515'; c.lineWidth = 4; [[200, 0], [430, 1], [700, 2], [880, 3]].forEach(([x, k]) => { c.beginPath(); c.moveTo(x, gT + 8); c.lineTo(x + 30, gT + 40); c.lineTo(x + 10, gT + 70); c.stroke(); }); c.restore();
  [260, 780, 870].forEach((x, i) => { c.save(); c.strokeStyle = '#6a6a6a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, gT); c.quadraticCurveTo(x + 6, gT - 40, x + 26 + i * 4, gT - 34); c.stroke(); c.restore(); });
  E.cloud(c, E.lerp(250, 880, t / 8), 650, .8, 1, '#4a4a4a');
  fig(c, { x: 540, y: hipOn(gT, .85), s: .85, color: '#bdbdbd', pose: { ...E.pose('stand'), hd: -.55, aB: .5, eB: 1.7, aF: .5, eF: 1.7, dy: Math.sin(t * 1.5) * 3 } });
  E.tag(c, 'STILL WAITING', 540, 690, t, 5.6, { size: 24, color: '#bbb' });
  // bottom: he digs a channel to the river, the field turns gold
  slab(c, -100, 1180, gB, 220);
  c.save(); const wg = c.createLinearGradient(40, 0, 200, 0); wg.addColorStop(0, '#5f88a8'); wg.addColorStop(1, '#8fb8d8'); c.fillStyle = wg; c.beginPath(); c.ellipse(110, gB + 10, 110, 34, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { const q = (t * .5 + i / 3) % 1; c.beginPath(); c.moveTo(40 + q * 120, gB + 2 + i * 8); c.lineTo(70 + q * 120, gB + 2 + i * 8); c.stroke(); } c.restore();
  const dig = E.p(t, .2, 4.4, 'lin'), xd = E.lerp(200, 870, dig);
  E.rrect(c, 190, gB + 2, xd - 190, 22, 6, '#050505', '#555', 2);
  const wf = E.lerp(190, 870, E.p(t, 4.6, 5.6, 'out'));
  if (t > 4.6) E.rrect(c, 190, gB + 6, wf - 190, 14, 5, '#8fb8d8');
  [380, 560, 740].forEach((x, i) => {
    const reach = 4.6 + (x - 190) / 680, g = E.p(t, reach + .1, reach + .9, 'back');
    if (g <= 0) return;
    c.save(); c.strokeStyle = GOLD; c.fillStyle = GOLD; c.lineWidth = 7; c.lineCap = 'round';
    for (let k = -1; k <= 1; k++) { const sx = x + k * 36, h = (110 + 30 * (k === 0)) * g, sw = Math.sin(t * 2 + k) * 4;
      c.beginPath(); c.moveTo(sx, gB - 2); c.quadraticCurveTo(sx + sw, gB - h / 2, sx + sw * 2, gB - h); c.stroke();
      c.beginPath(); c.ellipse(sx + sw * 2, gB - h - 16 * g, 9 * g, 22 * g, 0, 0, 7); c.fill(); }
    c.restore();
    E.glowDot(c, x, gB - 80, 160, 'rgba(245,197,66,.28)', g);
  });
  const ph = t * 7, digging = t < 4.4;
  const dp = digging ? E.mix(E.pose('crouch'), E.pose('push'), (Math.sin(ph) + 1) / 2) : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.6, 5.9, 'back')) };
  const bo = { x: digging ? xd + 40 : 900, y: hipOn(gB, .85) + (digging ? 22 : 0), s: .85, color: t > 5.6 ? GOLD : '#fff', pose: dp };
  if (digging) { const [hx, hy] = E.hand(bo); E.line(c, hx, hy, hx - 70, gB + 14, '#c8a46a', 7); E.rrect(c, hx - 92, gB + 4, 34, 24, 4, '#9a9a9a'); E.particles(c, xd, gB, (t * 1.4) % 1 * .5, { n: 8, speed: 200, color: '#777', grav: 700, life: .5, seed: Math.floor(t * 1.4) }); }
  else { E.line(c, 950, gB, 950, gB - 150, '#c8a46a', 7); }
  fig(c, bo);
  const day = Math.max(1, Math.round(90 * dig));
  E.tag(c, `DAY ${String(day).padStart(2, '0')}`, Math.min(bo.x, 820), gB - 330, t, -1, { size: 24, color: t > 5.6 ? GOLD : '#ddd', fill: t > 5.6 ? '#2a2208' : '#0c0c0c' });
} },
// 3 — Overthinking vs action: the longer you wait, the wider the gap
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480;
  const cliff = (x1, x2, gy) => { const g = c.createLinearGradient(0, gy, 0, gy + 260); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, 'rgba(8,8,9,0)'); c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, 260); c.restore(); E.line(c, x1, gy, x2, gy, '#7a7a7a', 3); E.line(c, x1, gy, x1, gy + 200, '#444', 3); E.line(c, x2, gy, x2, gy + 200, '#444', 3); };
  LB(c, 'OVERTHINKING', 540, 470); LB(c, 'ACTION', 540, 1080, { color: t > 2.6 ? GOLD : '#e8e8e8' });
  // top: every thought pushes the other side further away
  const gx = E.lerp(560, 930, E.p(t, .3, 5.0, 'inOut')) + Math.max(0, t - 5.0) * 14;
  cliff(-100, 420, gT); cliff(gx, 1180, gT);
  E.flag(c, gx + 40, gT, 1, 0);
  const late = t > 4.8;
  fig(c, { x: 370, y: hipOn(gT, .85), s: .85, color: '#bdbdbd', f: 1, pose: late ? { ...E.pose('sad'), hd: .8 } : { ...E.pose('stand'), aF: .9, eF: 1.9, hd: .15 + Math.sin(t * 2) * .05 } });
  const TH = [['WHAT IF I FAIL?', .3], ['NOT READY YET', 1.8], ['MAYBE TOMORROW', 3.3]];
  TH.forEach(([s, t0], i) => { const t1 = i < 2 ? TH[i + 1][1] : 4.8; if (t > t0 && t < t1) E.tag(c, s, 370, 600, t, t0, { size: 24, color: '#ccc' }); });
  if (late) E.tag(c, 'TOO LATE', 370, 600, t, 4.8, { size: 26, color: RED, fill: '#1e0a0a' });
  // bottom: he jumps while the gap is small
  cliff(-100, 420, gB); cliff(560, 1180, gB);
  const s = .85; let x, y = hipOn(gB, s), pose;
  if (t < 1.0) { x = E.lerp(170, 400, E.p(t, 0, 1, 'lin')); pose = E.run(t * 16); }
  else if (t < 1.6) { [x, y] = hop(E.p(t, 1, 1.6, 'lin'), 400, y, 610, y, 70); pose = E.pose('jump'); }
  else if (t < 2.6) { x = E.lerp(610, 820, E.p(t, 1.6, 2.6, 'out')); pose = E.run(t * 16); }
  else { x = 820; pose = { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.6, 2.9, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 }; }
  if (t > 2.6) { E.glowDot(c, 820, y - 60, 320, 'rgba(245,197,66,.3)', E.p(t, 2.6, 3.1)); E.flag(c, 880, gB, E.p(t, 2.7, 3), 0); }
  fig(c, { x, y, s, color: t > 2.6 ? GOLD : '#fff', pose });
  E.particles(c, 820, y - 80, t - 2.6, { n: 40, speed: 480, grav: 300 });
} },
// 4 — The mountain: everyone looks at the top, one looks at the next step
{ dur: 9, draw(c, t) {
  const sl = x => 1640 - .93 * (x + 100), top = 880;
  const done = -60 + 140 * t >= 860;
  E.text(c, 'ONE STEP AT A TIME', 540, 430, { size: 34, weight: 600, ls: 5, color: done ? GOLD : '#e8e8e8' });
  // sunrise behind the summit
  const sr = E.p(t, 6.0, 7.6, 'out');
  if (sr > 0) { const sy = E.lerp(1020, 760, sr); E.glowDot(c, top, sy, 520, 'rgba(255,240,200,.45)', sr); E.rays(c, top, sy, 560, .28 * sr, '#fff2c8', 18, t * .1); c.save(); c.globalAlpha = sr; const g = c.createRadialGradient(top, sy, 20, top, sy, 190); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#f7d98a'); c.fillStyle = g; c.beginPath(); c.arc(top, sy, 190, 0, 7); c.fill(); c.restore(); }
  // the mountain
  c.save(); c.beginPath(); c.moveTo(-100, sl(-100)); c.lineTo(top, sl(top)); c.lineTo(1180, sl(top) + 260); c.lineTo(1180, 2000); c.lineTo(-100, 2000); c.closePath();
  const g = c.createLinearGradient(0, sl(top), 0, 1700); g.addColorStop(0, '#4a4a4f'); g.addColorStop(1, '#0c0c0d'); c.fillStyle = g; c.fill();
  c.strokeStyle = '#8a8a8a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-100, sl(-100)); c.lineTo(top, sl(top)); c.lineTo(1180, sl(top) + 260); c.stroke(); c.restore();
  const s = .7, climb = ph => ({ ...E.walk(ph, .5), tor: .38, hd: -.15 });
  // the crowd: each one looks up at the summit and quits
  const crowd = [[6, 1.2, 'TOO FAR'], [54, 2.3, 'TOO STEEP'], [102, 3.4, 'NOT TODAY'], [150, 4.5, 'WHY BOTHER']];
  crowd.forEach(([off, tq, label], i) => {
    const x = Math.min(off + 120 * Math.min(t, tq), 820), quit = t > tq;
    const sy = sl(x);
    if (quit) fig(c, { x, y: sy - 52, s, color: '#8a8a8a', pose: { ...E.pose('sit'), hd: .5, tor: .1 } });
    else fig(c, { x, y: hipOn(sy, s), s, color: '#cfcfcf', pose: t > tq - .5 ? { ...E.pose('stand'), hd: -.6 } : climb(t * 8 + i) });
    if (t > tq) E.tag(c, label, x, sy - 220, t, tq, { size: 22, color: '#aaa', alpha: 1 - E.p(t, tq + 2.2, tq + 2.6) * .55 });
  });
  // the one who only looks at the next step
  const px = Math.min(-60 + 140 * t, top - 10), py = sl(px), arrived = px >= top - 10;
  if (!arrived) { // the lit step right in front of his feet
    const nx = px + 46 - ((t * 140) % 46), a = .55 + .45 * Math.sin(t * 9);
    E.glowDot(c, nx, sl(nx), 70, 'rgba(245,197,66,.55)', a); E.line(c, nx - 22, sl(nx - 22) - 2, nx + 22, sl(nx + 22) - 2, GOLD, 6);
  }
  fig(c, { x: px, y: hipOn(py, s * 1.1), s: s * 1.1, color: done ? GOLD : '#fff', pose: arrived ? { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 6.5, 6.8, 'back')), aF: 2.6 + Math.sin(t * 4) * .12 } : { ...climb(t * 8), hd: .35 } });
  E.particles(c, top - 10, py - 120, t - 6.5, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
