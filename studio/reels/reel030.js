// Reel 030 — "Stop and you slide" (story format + ref #15 devices)
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

const REEL = { title: 'Stop and you slide', bpm: 120, scenes: [
// 1 — Life is a down escalator
{ dur: 8.5, draw(c, t) {
  const P0 = [130, 1460], P1 = [880, 780], V = .09, s = .85;
  const pt = u => [E.lerp(P0[0], P1[0], u), E.lerp(P0[1], P1[1], u)];
  const uc = Math.min(1, .15 + .13 * t), arrive = (1 - .15) / .13, done = t > arrive + .3;
  const us = Math.max(0, .6 - V * t), off = t > .6 / V;
  LB(c, 'LIFE IS A DOWN ESCALATOR', 540, 500, { color: done ? GOLD : '#e8e8e8' });
  // body, rail, moving steps (they all run down)
  c.save(); const g = c.createLinearGradient(0, 780, 0, 1600); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, 'rgba(10,10,12,0)'); c.fillStyle = g;
  c.beginPath(); c.moveTo(P0[0], P0[1]); c.lineTo(P1[0], P1[1]); c.lineTo(P1[0], P1[1] + 120); c.lineTo(P0[0] + 60, 1600); c.lineTo(P0[0], 1600); c.fill(); c.restore();
  E.line(c, -100, P0[1], P0[0], P0[1], '#6a6a6a', 4); E.line(c, P1[0], P1[1], 1180, P1[1], '#6a6a6a', 4);
  E.line(c, P0[0] - 20, P0[1] - 110, P1[0] - 20, P1[1] - 110, '#5a5a5a', 8);
  const N = 22; for (let k = 0; k < N; k++) { const u = ((k / N - t * V) % 1 + 1) % 1, [x, y] = pt(u), [x2, y2] = pt(u + 1 / N); c.save(); c.strokeStyle = '#8a8a8a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y); c.lineTo(x2, y2); c.stroke(); c.restore(); }
  for (let k = 0; k < 4; k++) { const u = ((k / 4 - t * V * 1.5) % 1 + 1) % 1, [x, y] = pt(u); E.text(c, '↓', x + 30, y + 60, { size: 26, weight: 800, color: '#5a5a5a' }); }
  // the one who stops: carried back down to where he started
  let [sx, sy] = pt(us); let sp = E.pose('stand'), syH = hipOn(sy - 4, s);
  if (off) { const k = E.p(t, .6 / V, .6 / V + .5, 'out'); sx = E.lerp(P0[0], 60, k); sp = { ...E.pose('sit'), hd: .5 }; syH = P0[1] - 56; }
  fig(c, { x: sx, y: syH, s, color: '#bdbdbd', pose: sp });
  SAY(c, 'JUST RESTING.', sx - 40, syH - 150, E.p(t, .8, 1.1, 'back') * (1 - E.p(t, 3.4, 3.6)));
  SAY(c, 'WHY AM I BACK HERE?', Math.max(220, sx + 60), syH - 150, E.p(t, 6.4, 6.7, 'back'));
  // the one who keeps climbing
  let [cx, cy] = pt(uc); let cp = { ...E.walk(t * 9), tor: .28 };
  if (t > arrive) { const k = E.p(t, arrive, arrive + .3); cx = E.lerp(P1[0], 940, k); cy = P1[1]; cp = done ? win(t, arrive + .3) : E.walk(t * 9); }
  if (done) { E.glowDot(c, 940, cy - 120, 380, 'rgba(245,197,66,.45)', E.p(t, arrive + .3, arrive + .8)); E.rays(c, 940, cy - 120, 440, .28 * E.p(t, arrive + .3, arrive + .8), GOLD, 14, t * .15); }
  fig(c, { x: cx, y: hipOn(cy - 4, s), s, color: done ? GOLD : '#fff', pose: cp });
  E.tag(c, 'KEEPS CLIMBING', cx, cy - 250, t, -1, { size: 18, color: '#ddd', alpha: 1 - E.p(t, arrive, arrive + .3) });
  if (!off) E.tag(c, 'STOPS', sx, syH - 250 + 60, t, -1, { size: 18, color: '#999' });
  CNT(c, 60, 580, 'STEPS', Math.round(120 * Math.min(1, t / arrive)), done ? 'AT THE TOP' : 'AGAINST THE FLOW', done ? GOLD : '#e8e8e8');
  E.particles(c, 940, cy - 160, t - arrive - .3, { n: 50, speed: 480, grav: 300 });
} },
// 2 — Ignores the weeds vs pulls one a day
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .82, WX = [250, 390, 690, 830], WORDS = ['SCROLL', 'SNOOZE', 'SKIP', 'JUNK'];
  const weed = (x, gy, h, w, lift = 0, rot = 0, a = 1) => {
    c.save(); c.globalAlpha *= a; c.translate(x, gy - lift); c.rotate(rot);
    c.strokeStyle = '#7c8a66'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(Math.sin(t * 2 + x) * 14, -h / 2, Math.sin(t * 1.6 + x) * 8, -h); c.stroke();
    c.fillStyle = '#6f7d5c'; [[.4, -1], [.65, 1]].forEach(([q, d]) => { c.beginPath(); c.ellipse(d * 22, -h * q, 24, 9, d * .5, 0, 7); c.fill(); });
    if (lift > 0) { c.strokeStyle = '#8a7a66'; c.lineWidth = 3; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(i * 9, 30); c.stroke(); } }
    c.restore();
    E.tag(c, w, x + Math.sin(t * 1.6 + x) * 8, gy - lift - h - 22, 1, -1, { size: 16, color: '#cfd8c0', fill: '#141810', alpha: a });
  };
  const flower = (x, gy, h, wilt, gold, bloom) => {
    const hx = x + Math.sin(wilt * 1.4) * 40, hy = gy - h + wilt * h * .35;
    c.save(); c.strokeStyle = gold ? '#c9962a' : '#7c8a66'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, gy); c.quadraticCurveTo(x, gy - h * .6, hx, hy); c.stroke(); c.restore();
    if (gold) E.glowDot(c, hx, hy, 160 * bloom, 'rgba(245,197,66,.5)');
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + wilt, r = (gold ? 26 * (1 + bloom * .5) : 20) ; c.save(); c.fillStyle = gold ? GOLD : wilt > .5 ? '#5a5a5a' : '#cfcfcf'; c.beginPath(); c.ellipse(hx + Math.cos(a) * r * .9, hy + Math.sin(a) * r * .9 + wilt * 20 * (i % 2), r * .7, r * .45, a, 0, 7); c.fill(); c.restore(); }
    c.save(); c.fillStyle = gold ? '#fff3c4' : '#9a9a9a'; c.beginPath(); c.arc(hx, hy, 12, 0, 7); c.fill(); c.restore();
  };
  const PULL = WX.map((_, i) => 1.0 + i * 1.25), bloom = 6.0, done = t > bloom;
  LB(c, 'IGNORES THEM', 540, 540); LB(c, 'PULLS ONE A DAY', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: the weeds grow, the flower dies
  const gw = 80 + 170 * E.p(t, 0, 7, 'lin');
  WX.forEach((x, i) => weed(x, gT, gw * (.85 + .15 * E.rnd(i)), WORDS[i]));
  flower(540, gT, 150, E.p(t, 2, 6), false, 0);
  fig(c, { x: 120, y: gT - 54, s, color: '#bdbdbd', pose: { ...E.pose('sit'), hd: .2 } });
  SAY(c, "IT'S FINE.", 170, 720, E.p(t, 1.0, 1.3, 'back') * (1 - E.p(t, 3.4, 3.6)));
  SAY(c, "IT'S JUST ONE.", 190, 720, E.p(t, 3.6, 3.9, 'back'));
  CNT(c, 50, 590, 'WEEDS', 4, 'GROWING');
  // bottom: one weed a day, until only the flower is left
  const keys = [[0, 120]]; PULL.forEach((tp, i) => { keys.push([tp - .2, WX[i] - 55]); keys.push([tp + .35, WX[i] - 55]); }); keys.push([5.7, 640]);
  let bx = 120, moving = false; for (let k = 0; k < keys.length - 1; k++) { const [a, xa] = keys[k], [b, xb] = keys[k + 1]; if (t >= a && t < b) { bx = E.lerp(xa, xb, (t - a) / (b - a)); moving = Math.abs(xb - xa) > 1; } else if (t >= b) bx = xb; }
  const pulling = PULL.findIndex(tp => t > tp - .2 && t < tp + .35);
  let left = 0;
  WX.forEach((x, i) => { const tp = PULL[i], k = E.p(t, tp, tp + .6, 'out'); if (k < 1) left++; if (k >= 1) return; weed(x, gB, 90, WORDS[i], k * 140, k * 1.2, 1 - E.p(t, tp + .4, tp + .6)); E.particles(c, x, gB, t - tp, { n: 14, speed: 200, color: '#8a7a66', grav: 600, life: .5, seed: i }); });
  flower(540, gB, 90 + 130 * E.p(t, 1, bloom, 'lin'), 0, done, E.p(t, bloom, bloom + .6, 'back'));
  if (done) E.glowDot(c, 540, gB - 160, 520, 'rgba(245,197,66,.2)', E.p(t, bloom, bloom + .6));
  fig(c, { x: bx, y: hipOn(gB, s) + (pulling >= 0 ? 24 : 0), s, f: t > 5.0 && t < 5.7 ? -1 : 1, color: done ? GOLD : '#fff', pose: done ? win(t, bloom + .2) : pulling >= 0 ? { ...E.pose('crouch'), aF: 1.2 + E.p(t, PULL[pulling], PULL[pulling] + .3) * 1.2 } : moving ? E.walk(t * 9) : E.pose('stand') });
  CNT(c, 50, 1110, 'WEEDS', left, left ? `${4 - left} PULLED` : 'GARDEN CLEAR', done ? GOLD : '#e8e8e8');
} },
// 3 — Waits for a path vs makes one
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, VX0 = 380, VX1 = 980, STEP = 14, out = 6.2, done = t > out + .3;
  const TAGS = { 6: 'FEAR', 18: 'DOUBT', 31: 'NO MAP' };
  const vines = (gy, cutX) => {
    for (let i = 0, x = VX0; x < VX1; i++, x += STEP) {
      const h = 250 + 40 * E.rnd(i), sw = Math.sin(t * 1.4 + i) * 6;
      c.save(); c.strokeStyle = i % 3 ? '#4f5a44' : '#6f7d5c'; c.lineWidth = 6; c.lineCap = 'round';
      if (x > cutX) { c.beginPath(); c.moveTo(x, gy); c.bezierCurveTo(x + 12 + sw, gy - h * .3, x - 12 + sw, gy - h * .7, x + sw, gy - h); c.stroke(); }
      else { c.beginPath(); c.moveTo(x, gy); c.lineTo(x + 2, gy - 18); c.stroke(); const k = E.clamp((cutX - x) / 40); if (k < 1) { c.globalAlpha = 1 - k; c.translate(x, gy - 18); c.rotate(k * 1.4); c.beginPath(); c.moveTo(0, 0); c.lineTo(sw, -h + 18 + k * 140); c.stroke(); } }
      c.restore();
      if (TAGS[i] && x > cutX) E.tag(c, TAGS[i], x + sw, gy - h * .55, 1, -1, { size: 16, color: '#cfd8c0', fill: '#141810' });
    }
  };
  LB(c, 'WAITS FOR A PATH', 540, 540); LB(c, 'MAKES ONE', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: stands at the edge of the jungle, waiting
  vines(gT, -1);
  fig(c, { x: 300, y: t > 3.0 ? gT - 54 : hipOn(gT, s), s, color: '#bdbdbd', pose: t > 3.0 ? { ...E.pose('sit'), hd: .3 } : { ...E.pose('stand'), hd: -.3 } });
  SAY(c, "THERE'S NO PATH.", 250, 700, E.p(t, 1.0, 1.3, 'back') * (1 - E.p(t, 3.8, 4.0)));
  SAY(c, "I'LL WAIT.", 250, 700, E.p(t, 4.0, 4.3, 'back'));
  CNT(c, 50, 560, 'METERS', 0, 'STILL WAITING');
  // bottom: swing by swing, a path appears behind him
  const cutX = E.lerp(VX0, VX1, E.p(t, .4, out, 'lin'));
  if (cutX > VX0) { c.save(); const pg = c.createLinearGradient(VX0, 0, cutX, 0); pg.addColorStop(0, 'rgba(245,197,66,.05)'); pg.addColorStop(1, 'rgba(245,197,66,.35)'); c.fillStyle = pg; c.fillRect(VX0, gB - 6, cutX - VX0, 10); c.restore(); }
  if (t > out) E.glowDot(c, 980, gB - 150, 420, 'rgba(255,214,120,.5)', E.p(t, out, out + .6));
  vines(gB, cutX);
  const bx = t < out ? cutX - 50 : E.lerp(VX1 - 50, 960, E.p(t, out, out + .3));
  const bo = { x: bx, y: hipOn(gB, s), s, pose: done ? win(t, out + .3) : { ...E.walk(t * 6, .3), aF: 2.3 + .9 * Math.sin(t * 12), eF: .3 } };
  if (!done) { const [hx, hy] = E.hand(bo); const a = .9 * Math.sin(t * 12); E.line(c, hx, hy, hx + Math.cos(a - .4) * 70, hy + Math.sin(a - .4) * 70, '#d8d8d8', 6); E.particles(c, cutX, gB - 120, (t * 2) % 1 * .5, { n: 8, speed: 220, color: '#6f7d5c', grav: 500, life: .5, seed: Math.floor(t * 2) }); }
  fig(c, { ...bo, color: done ? GOLD : '#fff' });
  CNT(c, 50, 1110, 'METERS', Math.round(100 * E.p(t, .4, out, 'lin')), done ? 'NEW PATH' : 'CUT BY HAND', done ? GOLD : '#e8e8e8');
  E.particles(c, 960, hipOn(gB, s) - 80, t - out - .3, { n: 45, speed: 480, grav: 300 });
} },
// 4 — One degree: the same start, a different life
{ dur: 10, draw(c, t) {
  const O = [540, 1440], TOPY = 720, u = E.p(t, .3, 7.3, 'lin'), done = t > 7.3;
  const pt = (d, q) => [O[0] + d * 300 * Math.pow(q, 3), E.lerp(O[1], TOPY, q)];
  LB(c, 'ONE DEGREE', 540, 470, { size: 34, ls: 5, color: done ? GOLD : '#e8e8e8' });
  // destinations
  const L = pt(-1, 1), R = pt(1, 1);
  if (done) { E.glowDot(c, R[0], R[1], 360, 'rgba(245,197,66,.45)', E.p(t, 7.3, 7.8)); E.rays(c, R[0], R[1], 420, .28 * E.p(t, 7.3, 7.8), GOLD, 16, t * .15); }
  E.text(c, 'SAME LIFE', L[0], TOPY - 190, { size: 24, weight: 700, ls: 3, color: '#7a7a7a', alpha: E.p(t, 5, 6) });
  E.text(c, 'DREAM LIFE', R[0], TOPY - 190, { size: 24, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 5, 6) });
  // two lines that start as one
  [[-1, '#7a7a7a'], [1, done ? GOLD : '#e8e8e8']].forEach(([d, col]) => { c.save(); c.strokeStyle = col; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); for (let q = 0; q <= u; q += .01) { const [x, y] = pt(d, q); q === 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    c.setLineDash([8, 12]); c.strokeStyle = '#3a3a3a'; c.lineWidth = 3; c.beginPath(); for (let q = u; q <= 1; q += .01) { const [x, y] = pt(d, q); q === u ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore(); });
  E.text(c, 'SKIPPED ONCE', 400, 1490, { size: 18, weight: 800, family: MONO, ls: 2, color: '#7a7a7a' });
  E.text(c, 'SHOWED UP', 680, 1490, { size: 18, weight: 800, family: MONO, ls: 2, color: done ? GOLD : '#bbb' });
  c.save(); c.fillStyle = '#e8e8e8'; c.beginPath(); c.arc(O[0], O[1], 10, 0, 7); c.fill(); c.restore();
  // the walkers
  const [lx, ly] = pt(-1, u), [rx, ry] = pt(1, u);
  fig(c, { x: lx, y: hipOn(ly, .5), s: .5, f: -1, color: '#9a9a9a', pose: done ? { ...E.pose('sad'), hd: .5 } : E.walk(t * 9) });
  fig(c, { x: rx, y: hipOn(ry, .5), s: .5, color: done ? GOLD : '#fff', pose: done ? win(t, 7.3) : E.walk(t * 9) });
  if (u > .45 && u < .7) E.tag(c, 'BARELY DIFFERENT', 540, E.lerp(O[1], TOPY, .55), t, 3.4, { size: 18, color: '#999' });
  const day = Math.max(1, Math.round(1000 * u)), gap = Math.round(600 * Math.pow(u, 3));
  CNT(c, 60, 1250, 'DAY', day.toLocaleString('en-US'), `${gap} STEPS APART`, done ? GOLD : '#e8e8e8');
  E.text(c, 'SAME START. DIFFERENT LIFE.', 540, 1550, { size: 28, weight: 700, ls: 4, color: GOLD, alpha: E.p(t, 7.7, 8.2) });
  E.particles(c, R[0], R[1] - 40, t - 7.3, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
