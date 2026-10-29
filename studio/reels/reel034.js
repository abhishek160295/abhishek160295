// Reel 034 — "Make 8-year-old you proud" (≤31s, high motion, retention + reaction beats)
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
const kid = (c, x, y, s, col, pose, rot = 0) => { fig(c, { x, y, s, lw: 12, color: col, pose, rot }); const [hx, hy] = E.headPos({ x, y, s, pose }); c.save(); c.fillStyle = col; c.beginPath(); c.arc(hx, hy, 19 * s / .5, 0, 7); c.fill(); c.restore(); };

const REEL = { title: 'Make 8-year-old you proud', bpm: 120, scenes: [
// 1 — Mile 20: no why vs a why
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, spark = 2.4, fin = 5.0, done = t > fin;
  const course = gy => { E.line(c, 300, gy, 300, gy - 180, '#6a6a6a', 5); E.shaded(c, 250, gy - 220, 100, 44, 6, '#4a4a4f', '#2a2a2e'); E.text(c, 'MILE 20', 300, gy - 198, { size: 18, weight: 800, family: MONO, color: '#ddd' }); };
  LB(c, 'NO WHY', 540, 540); LB(c, 'A WHY', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); course(gT); course(gB);
  // top: runs out of reasons
  const tx = 150 + 300 * E.p(t, 0, 1.8, 'out');
  fig(c, { x: tx, y: t > 2.3 ? gT - 54 : hipOn(gT, s), s, color: '#bdbdbd', pose: t < 1.8 ? { ...E.run(t * 12), tor: .5 } : t < 2.3 ? { ...E.pose('crouch'), hd: .4 } : { ...E.pose('sit'), hd: .5 } });
  SAY(c, "I'M DONE.", 560, 690, E.p(t, 2.5, 2.8, 'back'));
  CNT(c, 50, 590, 'MILE', '20.1', t > 2.3 ? 'GAVE UP' : 'RUNNING', '#e8e8e8', t > 2.3 ? RED : null);
  // bottom: about to stop, remembers who he's running for
  E.line(c, 800, gB, 800, gB - 170, '#8a8a8a', 5); E.line(c, 900, gB, 900, gB - 170, '#8a8a8a', 5);
  if (t < fin) E.line(c, 800, gB - 110, 900, gB - 110, '#e8e8e8', 4);
  else { const k = E.p(t, fin, fin + .4); E.line(c, 800, gB - 110, 800 + 40 * (1 - k), gB - 110 + 60 * k, '#e8e8e8', 4); E.line(c, 900, gB - 110, 900 - 40 * (1 - k), gB - 110 + 60 * k, '#e8e8e8', 4); }
  let bx = 150 + 300 * E.p(t, 0, 1.8, 'out'), bp = t < 1.8 ? { ...E.run(t * 12), tor: .5 } : { ...E.pose('crouch'), hd: .4 };
  if (t > spark + .5) { const k = E.p(t, spark + .5, fin, 'in'); bx = E.lerp(450, 850, k); bp = E.run(t * 18); }
  if (done) bp = win(t, fin + .1);
  if (t > spark && t < spark + 1.6) { const a = E.p(t, spark, spark + .3, 'back') * (1 - E.p(t, spark + 1.3, spark + 1.6)); const cx = 560, cy = gB - 250;
    c.save(); c.globalAlpha = a; E.glowDot(c, cx, cy, 160, 'rgba(255,214,120,.5)'); c.fillStyle = '#141414'; c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.arc(cx, cy, 72, 0, 7); c.fill(); c.stroke();
    [[cx - 40, cy + 50, 10], [cx - 22, cy + 76, 6]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); }); c.restore();
    if (a > .05) { c.save(); c.globalAlpha = a; kid(c, cx - 16, cy + 18, .32, '#ffe08a', { ...E.pose('cheer'), aF: 2.6 + Math.sin(t * 10) * .3 }); E.heart(c, cx + 34, cy - 10, .45 + .08 * Math.sin(t * 10), 1, RED); c.restore(); } }
  if (done) E.glowDot(c, 850, hipOn(gB, s) - 60, 360, 'rgba(245,197,66,.4)', E.p(t, fin, fin + .5));
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : t > spark + .5 ? '#fff' : '#d8d8d8', pose: bp });
  if (t > spark + .5 && !done) for (let i = 0; i < 4; i++) E.line(c, bx - 60 - i * 24, hipOn(gB, s) - 30 + i * 16, bx - 100 - i * 24, hipOn(gB, s) - 30 + i * 16, 'rgba(255,255,255,.3)', 3);
  E.particles(c, 850, gB - 110, t - fin, { n: 60, speed: 520, grav: 300 });
  CNT(c, 50, 1110, 'MILE', t < spark + .5 ? '20.1' : (20.1 + 6.1 * E.p(t, spark + .5, fin, 'in')).toFixed(1), done ? 'FINISHED. FOR THEM.' : t > spark ? 'FOR THEM' : 'RUNNING', done ? GOLD : '#e8e8e8');
} },
// 2 — The dark forest: no direction vs a purpose
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, out = 5.2, done = t > out;
  const forest = (gy, off) => { for (let i = 0; i < 11; i++) { const x = ((70 + i * 105 - off) % 1155 + 1155) % 1155 - 40, h = 300 + 60 * E.rnd(i); c.save(); c.fillStyle = '#3a3a3a'; c.fillRect(x - 12, gy - h, 24, h); c.strokeStyle = '#3a3a3a'; c.lineWidth = 8; c.beginPath(); c.moveTo(x, gy - h * .6); c.lineTo(x + 50 * (i % 2 ? 1 : -1), gy - h * .8); c.moveTo(x, gy - h * .4); c.lineTo(x - 40 * (i % 2 ? 1 : -1), gy - h * .55); c.stroke(); c.restore(); } };
  const dark = (y0, y1, lx, ly, r) => { c.save(); const g = c.createRadialGradient(lx, ly, r * .35, lx, ly, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.9)'); c.fillStyle = g; c.fillRect(-100, y0, 1300, y1 - y0); c.restore(); };
  // top: wanders in the dark
  slab(c, -100, 1180, gT, 200); forest(gT, 0);
  const tx = 400 + 120 * Math.sin(t * 1.3), tf = Math.cos(t * 1.3) > 0 ? 1 : -1, lost = t > 4.4;
  fig(c, { x: tx, y: lost ? gT - 54 : hipOn(gT, s), s, f: tf, color: '#9a9a9a', pose: lost ? { ...E.pose('sit'), hd: .5 } : E.walk(t * 8) });
  dark(600, gT + 40, tx, gT - 120, 200);
  LB(c, 'NO DIRECTION', 540, 540);
  SAY(c, 'WHICH WAY?', tx + 60, 700, E.p(t, 1.2, 1.5, 'back') * (1 - E.p(t, 3.8, 4.0)));
  SAY(c, 'LOST.', 420, 700, E.p(t, 4.6, 4.9, 'back'));
  // bottom: one small light, and the path appears as he walks
  slab(c, -100, 1180, gB, 220);
  const k = E.p(t, .2, out, 'lin'), bx = E.lerp(150, 880, k), r = E.lerp(170, 520, k);
  forest(gB, 0);
  if (done) E.glowDot(c, 1000, gB - 160, 520, 'rgba(255,214,120,.55)', E.p(t, out, out + .6));
  const bo = { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, out + .2) : { ...E.walk(t * 8), aF: 1.3, eF: .6 } };
  fig(c, bo);
  const [hx, hy] = E.hand(bo);
  if (!done) { E.glowDot(c, hx + 6, hy + 30, 90, 'rgba(255,214,120,.8)'); E.rrect(c, hx - 8, hy + 14, 28, 34, 6, '#ffe7a8', '#c9962a', 3); }
  dark(1130, gB + 60, bx + 20, gB - 120, done ? 1400 : r);
  LB(c, 'A PURPOSE', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  if (!done) E.tag(c, 'PURPOSE', hx + 6, hy + 80, t, -1, { size: 16, color: GOLD, fill: '#2a2208' });
  CNT(c, 50, 590, 'STEPS', Math.round(30 * Math.abs(Math.sin(t))), 'IN CIRCLES', '#e8e8e8', RED);
  CNT(c, 50, 1120, 'STEPS', Math.round(900 * k), done ? 'OUT OF THE DARK' : 'ONE LIGHT AHEAD', done ? GOLD : '#e8e8e8');
} },
// 3 — At the top of the wall: steps on others vs lifts others
{ dur: 7, draw(c, t) {
  const gT = 950, gB = 1480, s = .78, H = 250, WX = 600, grab = 1.8, done = t > 3.3;
  const wall = gy => { E.shaded(c, WX, gy - H, 600, H, 4, '#4a4a4f', '#1e1e20'); E.line(c, WX, gy - H, 1180, gy - H, '#8a8a8a', 3); for (let i = 0; i < 5; i++) E.line(c, WX + 4, gy - 40 - i * 46, WX + 18, gy - 40 - i * 46, '#6a6a6a', 4); };
  LB(c, 'STEPS ON OTHERS', 300, 540); LB(c, 'LIFTS OTHERS', 300, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); wall(gT); wall(gB);
  const climber = (gy, k, col) => fig(c, { x: WX - 26, y: E.lerp(gy - 60, gy - H + 30, k), s, f: 1, color: col, pose: { ...E.pose('climb'), aF: 2.8 + Math.sin(t * 10) * .2 * (k < 1 ? 1 : 0), aB: 2.5 - Math.sin(t * 10) * .2 } });
  // top: the one at the top stomps the hand reaching up, then stands alone
  const cl = E.p(t, 0, grab, 'lin');
  if (t < 2.0) climber(gT, cl, '#bdbdbd');
  else { const dt = t - 2.0; if (dt < 1.2) fig(c, { x: WX - 40 - 30 * dt, y: Math.min(hipOn(gT, s), E.lerp(gT - H + 30, hipOn(gT, s), Math.min(1, dt * 1.6)) + 300 * dt * dt), s, rot: Math.min(1.2, dt * 2), color: '#bdbdbd', pose: E.pose('jump') }); else fig(c, { x: WX - 80, y: gT - 54, s, color: '#bdbdbd', pose: { ...E.pose('sit'), hd: .5 } }); }
  const stomp = t > 1.6 && t < 2.1;
  fig(c, { x: t < 2.4 ? WX + 40 : E.lerp(WX + 40, 900, E.p(t, 2.4, 4.0)), y: hipOn(gT - H, s), s, f: t < 2.4 ? -1 : 1, color: '#8a8a8a', pose: stomp ? { ...E.pose('stand'), lF: .9, kF: .3 } : t < 2.4 ? E.pose('stand') : t < 4.0 ? E.walk(t * 8) : { ...E.pose('sad'), hd: .5 } });
  E.flash(c, t, 1.95, .2, '229,72,77', .2);
  E.tag(c, 'ALONE AT THE TOP', 880, gT - H - 260, t, 4.3, { size: 18, color: '#999' });
  CNT(c, 50, 590, 'AT THE TOP', 1, 'NOBODY WITH HIM', '#e8e8e8', RED);
  // bottom: kneels, grabs the hand, pulls him up, they make it together
  const pull = E.p(t, 2.0, 3.0, 'inOut');
  if (t < 2.0) climber(gB, cl, '#fff');
  else fig(c, { x: E.lerp(WX - 26, WX + 70, pull), y: E.lerp(gB - H + 30, hipOn(gB - H, s), pull), s, color: done ? GOLD : '#fff', pose: done ? win(t, 3.3) : E.pose('climb') });
  fig(c, { x: WX + 40 + (done ? 110 : 0), y: t > 1.4 && t < 3.0 ? hipOn(gB - H, s) + 40 : hipOn(gB - H, s), s, f: done ? 1 : -1, color: done ? GOLD : '#fff', pose: done ? win(t, 3.4) : t > 1.4 && t < 3.0 ? { ...E.pose('crouch'), aF: 2.0, eF: 0 } : E.pose('stand') });
  if (done) { E.glowDot(c, WX + 130, gB - H - 100, 380, 'rgba(245,197,66,.4)', E.p(t, 3.3, 3.8)); for (let i = 0; i < 6; i++) { const q = ((t - 3.3) * .6 + i / 6) % 1; E.heart(c, WX + 60 + i * 30 + Math.sin(q * 6 + i) * 20, gB - H - 160 - q * 220, .35, (1 - q) * E.p(t, 3.3, 3.6), i % 2 ? RED : GOLD); } }
  E.tag(c, 'WE MADE IT', WX + 140, gB - H - 250, t, 3.6, { size: 20, color: GOLD, fill: '#2a2208' });
  CNT(c, 50, 1110, 'AT THE TOP', done ? 2 : 1, done ? 'TOGETHER' : 'REACHING DOWN', done ? GOLD : '#e8e8e8');
} },
// 4 — The stairs of your life, and who's watching from the bottom
{ dur: 9, draw(c, t) {
  const N = 6, X0 = 180, Y0 = 1450, SW = 113, SR = 116, YRS = ['18', '21', '24', '27', '30', '33'], s = .7;
  const stepTop = i => [X0 + i * SW + SW / 2, Y0 - (i + 1) * SR];
  const top = 6.0, meet = 7.2, done = t > top;
  if (t < 7.3) LB(c, "HE'S WATCHING.", 540, 470, { size: 34, ls: 5 });
  else E.title(c, 'MAKE 8-YEAR-OLD YOU PROUD.', 540, 470, t, 7.3, 1e9, { size: 34, weight: 700, ls: 4, family: 'Inter', color: GOLD });
  // stairs
  for (let i = 0; i < N; i++) { const [cx, ty] = stepTop(i); E.shaded(c, cx - SW / 2, ty, SW, Y0 - ty, 4, i === N - 1 && done ? '#f7d36a' : '#4a4a4f', i === N - 1 && done ? '#a07a1a' : '#1e1e20'); E.line(c, cx - SW / 2, ty, cx + SW / 2, ty, '#8a8a8a', 3); E.text(c, YRS[i], cx, ty + 30, { size: 20, weight: 800, family: MONO, color: '#8a8a8a' }); }
  E.line(c, -100, Y0, 1180, Y0, '#6a6a6a', 3);
  // the climb: a step at a time, one bad fall at 24, back up
  const T = [.4, 1.2, 2.0, 3.6, 4.4, 5.2], fallT = 2.7;
  let ax = X0 - 40, ay = hipOn(Y0, s), ap = E.pose('stand'), ar = 0, idx = -1;
  T.forEach((t0, i) => { if (t >= t0) { const k = E.p(t, t0, t0 + .45); const from = i === 0 ? [X0 - 40, Y0] : stepTop(i - 1); const to = stepTop(i); if (k < 1) { [ax, ay] = hop(k, from[0], hipOn(from[1], s), to[0], hipOn(to[1], s), 70); ap = E.pose('jump'); } else { [ax, ay] = [to[0], hipOn(to[1], s)]; ap = E.walk(t * 4, .15); } idx = i; } });
  if (t >= fallT && t < T[3]) { const k = E.p(t, fallT, fallT + .4, 'in'); const a = stepTop(2), b = stepTop(1); ax = E.lerp(a[0], b[0], k); ay = E.lerp(hipOn(a[1], s), b[1] - 52, k); ar = -1.2 * k * (1 - E.p(t, 3.1, 3.5)); ap = t < 3.1 ? E.pose('crouch') : E.pose('stand'); }
  E.tag(c, 'FAILED', stepTop(2)[0], stepTop(2)[1] - 230, t, fallT + .1, { size: 20, color: RED, fill: '#1e0a0a', alpha: 1 - E.p(t, 3.6, 3.9) });
  E.flash(c, t, fallT + .4, .2, '229,72,77', .18);
  if (done) { const [gx, gy] = stepTop(N - 1); E.glowDot(c, gx, gy - 140, 460, 'rgba(245,197,66,.45)', E.p(t, top, top + .6)); E.rays(c, gx, gy - 140, 520, .28 * E.p(t, top, top + .6), GOLD, 16, t * .15); }
  fig(c, { x: ax, y: ay, s, rot: ar, color: done ? GOLD : '#fff', pose: done ? (t > meet ? { ...E.pose('stand'), aF: 2.2, eF: .1 } : win(t, top)) : ap });
  // 8-year-old you: watching from the bottom, then runs up to meet you
  let kx = 90, ky = hipOn(Y0, .48), kp = { ...E.pose('stand'), hd: -.4, aF: 1.6, eF: .4 };
  if (t > top + .1) { const q = E.p(t, top + .1, meet, 'lin'), f = q * N, i = Math.min(N - 1, Math.floor(f)), fr = f - i; const from = i === 0 ? [90, Y0] : stepTop(i - 1), to = stepTop(i); [kx, ky] = hop(fr, from[0], hipOn(from[1], .48), to[0] - (i === N - 1 ? 50 : 0), hipOn(to[1], .48), 50); kp = E.run(t * 18); }
  if (t > meet) { const [gx, gy] = stepTop(N - 1); kx = gx - 50; ky = hipOn(gy, .48); kp = { ...E.pose('cheer'), aF: 2.4 }; E.particles(c, gx - 22, gy - 150, t - meet, { n: 50, speed: 420, grav: 200, life: 1.4 }); }
  kid(c, kx, ky, .48, t > meet ? GOLD : '#ffe08a', kp);
  E.tag(c, 'YOU AT 8', 90, Y0 - 180, t, -1, { size: 18, color: '#ffe08a', fill: '#2a2208', alpha: 1 - E.p(t, top, top + .3) });
  CNT(c, 60, 560, 'AGE', YRS[Math.max(0, idx)], done ? 'MADE IT' : t > fallT && t < T[3] ? 'GOT BACK UP' : 'CLIMBING', done ? GOLD : '#e8e8e8');
} },
] };
