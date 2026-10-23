// Reel 013 — "Rainy days show who's real"
const REEL = { title: "Rainy days show who's real", bpm: 150, scenes: [
// 1 — Stop explaining yourself
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Stop explaining yourself', W / 2, 420, t, -1, 1e9, { size: 52, weight: 900 });
  E.title(c, 'to people who chose not to understand.', W / 2, 495, t, .5, 3.3, { size: 42, weight: 700, color: '#ccc' });
  E.title(c, 'to people who chose not to understand.', W / 2, 495, t, 3.5, 1e9, { size: 42, weight: 800, color: GOLD });
  const gy = 1320, s = .85;
  E.ground(c, gy, 90, 990);
  const unroll = E.p(t, .3, 2.6, 'out') * (1 - E.p(t, 3.0, 3.5, 'in'));
  // the explanation scroll
  const sx = 330, len = 560 * unroll;
  if (len > 4) { E.rrect(c, sx, gy - 150, len, 120, 6, '#efe6d0'); for (let i = 0; i < 4; i++) E.line(c, sx + 20, gy - 125 + i * 24, sx + Math.max(20, len - 30 - (i % 2) * 60), gy - 125 + i * 24, '#a59a80', 5); c.save(); c.fillStyle = '#d8ccb0'; c.beginPath(); c.arc(sx + len, gy - 90, 26, 0, 7); c.fill(); c.restore(); }
  // listeners walk away
  [0, 1].forEach(i => { const k = E.p(t, 1.0 + i * .2, 3.0 + i * .2, 'inOut'); const x = E.lerp(680 + i * 120, 1200 + i * 120, k); E.figure(c, { x, y: gy - E.FIG_H * .75 - 2, s: .75, color: '#666', f: k > 0 ? 1 : -1, pose: k > 0 && k < 1 ? E.walk(x / 24) : E.pose('arms') }); });
  let x = 240, f = 1, pose = { ...E.pose('point'), aF: 1.3 + Math.sin(t * 8) * .25, aB: -.6 + Math.sin(t * 8 + 1) * .3, eB: .6 };
  if (t > 3.5) { const k = E.p(t, 3.6, 5.6, 'inOut'); x = E.lerp(240, 760, k); pose = k < 1 ? E.walk(x / 24) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.6, 5.9, 'back')); }
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, f, pose, glow: t > 3.5 ? 10 : 0 });
} },
// 2 — Sunny days vs rainy days
{ dur: 6.4, draw(c, t) {
  E.title(c, "Sunny days: everyone's here.", W / 2, 420, t, -1, 3.6, { size: 50, weight: 800 });
  E.title(c, "Rainy days show who's real.", W / 2, 420, t, 3.8, 1e9, { size: 50, weight: 900, color: GOLD });
  const gy = 1320, rain = E.p(t, 2.2, 2.7);
  // sun → cloud
  c.save(); c.globalAlpha = 1 - rain; c.fillStyle = GOLD; c.beginPath(); c.arc(820, 660, 64, 0, 7); c.fill(); c.restore(); E.rays(c, 820, 660, 260, (1 - rain) * .3, GOLD, 14, t * .2);
  E.cloud(c, 540, 660, 1.6, rain, '#4a4a4a');
  if (rain > 0) for (let i = 0; i < 60; i++) { const x = 150 + E.rnd(i) * 780, k = ((t * 1.7 + E.rnd(i + 3)) % 1); E.line(c, x, 720 + k * 600, x - 6, 750 + k * 600, `rgba(170,200,230,${.6 * rain})`, 3); }
  E.ground(c, gy, 90, 990);
  const s = .7, fr = [[260, 1], [380, 1], [700, -1], [820, -1]];
  fr.forEach(([fx, side], i) => {
    const leave = E.p(t, 2.5 + i * .1, 3.6 + i * .1, 'in'), ex = fx + (fx < 540 ? -1 : 1) * leave * 700;
    if (i === 2 && t > 3.6) return; // the real one comes back below
    E.figure(c, { x: ex, y: gy - E.FIG_H * s - 2, s, color: '#9a9a9a', f: leave > 0 ? (fx < 540 ? -1 : 1) : (fx < 540 ? 1 : -1), pose: leave > 0 ? E.run(t * 14 + i) : (Math.sin(t * 8 + i) > 0 ? E.pose('cheer') : E.pose('stand')) });
  });
  // the one who returns with an umbrella
  if (t > 3.6) { const k = E.p(t, 3.6, 4.4, 'inOut'), ux = E.lerp(1150, 650, k); E.figure(c, { x: ux, y: gy - E.FIG_H * s - 2, s, f: -1, color: GOLD, pose: k < 1 ? E.run(ux / 20) : { ...E.pose('stand'), aF: 2.7, eF: .1 } }); E.umbrella(c, ux - 70, gy - 330, .9); }
  E.figure(c, { x: 540, y: gy - E.FIG_H * .8 - 2, s: .8, pose: t < 2.3 ? E.pose('cheer') : t < 4.4 ? E.pose('sad') : E.mix(E.pose('sad'), E.pose('stand'), E.p(t, 4.4, 4.8)) });
} },
// 3 — Saying yes to everyone
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Saying yes to everyone…', W / 2, 420, t, -1, 2.8, { size: 52, weight: 800 });
  E.title(c, '…means saying no to yourself.', W / 2, 420, t, 3.0, 1e9, { size: 46, weight: 900, color: GOLD });
  const gy = 1320, x = 480, s = .9;
  E.ground(c, gy, 90, 990);
  const asks = ['Can you…?', 'Just this once', 'Quick favor', 'Cover for me?', 'One more thing'];
  const n = asks.filter((_, i) => t > .2 + i * .45).length, no = t > 2.7;
  const strain = Math.min(1, n / 5);
  const fig = { x, y: gy - E.FIG_H * s - 2 + (no ? 0 : strain * 40), s, pose: no ? (t > 3.8 ? { ...E.pose('stand'), aF: 1.2, eF: 1.2 } : E.pose('stand')) : E.mix({ ...E.pose('stand'), aF: 1.3, eF: 1.4, aB: 1.2, eB: 1.5 }, { ...E.pose('crouch'), aF: 1.3, eF: 1.4, aB: 1.2, eB: 1.5 }, strain * .7) };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  asks.forEach((str, i) => {
    const t0 = .2 + i * .45; if (t < t0) return;
    const fallK = E.p(t, 2.8 + i * .07, 3.4 + i * .07, 'in');
    const wob = Math.sin(t * 7) * strain * (i + 1) * 4;
    let bx = hx + 40 + wob, by = hy - 70 - i * 72 - (1 - E.p(t, t0, t0 + .25, 'out')) * 80;
    if (no) { bx += fallK * (i % 2 ? 1 : -1) * (180 + i * 60); by = E.lerp(by, gy - 36, fallK); }
    c.save(); c.translate(bx, by); c.rotate(no ? fallK * (i % 2 ? .8 : -.8) : wob * .004);
    E.rrect(c, -125, -34, 250, 68, 8, '#8a6a46', '#b8925f', 3); E.text(c, str, 0, 0, { size: 28, weight: 800, color: '#fff3dc' });
    c.restore();
  });
  E.bubble(c, 'No.', x + 300, gy - 330, E.p(t, 2.6, 2.85, 'back') * (1 - E.p(t, 3.8, 4.0)), { size: 64, stroke: '#fff', color: '#fff' });
  if (t > 3.8) { const k = E.p(t, 3.8, 4.2, 'back'); const [ax, ay] = E.hand(fig); E.rrect(c, ax - 10, ay - 60, 200 * k, 70, 10, GOLD); if (k > .6) E.text(c, 'YOUR GOALS', ax + 90, ay - 25, { size: 26, weight: 900, color: '#111' }); }
} },
// 4 — Stop watering dead plants
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Stop watering dead plants.', W / 2, 420, t, -1, 2.8, { size: 52, weight: 800 });
  E.title(c, 'Grow what grows you.', W / 2, 420, t, 3.0, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1320, L = 280, R = 820;
  E.ground(c, gy, 90, 990);
  const pot = x => E.rrect(c, x - 60, gy - 90, 120, 90, 10, '#8a5a3c', '#b07a55', 3);
  // dead plant
  c.save(); c.strokeStyle = '#6b5b4b'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(L, gy - 90); c.lineTo(L + 10, gy - 230); c.moveTo(L + 6, gy - 170); c.lineTo(L - 40, gy - 210); c.moveTo(L + 8, gy - 200); c.lineTo(L + 50, gy - 240); c.stroke(); c.restore(); pot(L);
  // the one that wants to grow
  const g = E.p(t, 3.3, 5.0, 'out'), h = E.lerp(40, 300, g);
  c.save(); c.strokeStyle = GREEN; c.fillStyle = GREEN; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(R, gy - 90); c.lineTo(R, gy - 90 - h); c.stroke();
  for (let i = 0; i < 1 + Math.floor(g * 4); i++) { const yy = gy - 110 - i * 60, d = i % 2 ? 1 : -1; c.beginPath(); c.ellipse(R + d * 26, yy, 26, 10, d * .5, 0, 7); c.fill(); } c.restore();
  if (g > .6) { const k = E.p(g, .6, 1, 'back'); c.save(); c.translate(R, gy - 90 - h); c.fillStyle = GOLD; for (let i = 0; i < 6; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.ellipse(0, -24 * k, 13 * k, 24 * k, 0, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 11 * k, 0, 7); c.fill(); c.restore(); }
  pot(R);
  // gardener
  const turn = t > 2.9, fx = turn ? E.lerp(470, 640, E.p(t, 2.9, 3.3)) : 470, f = turn ? 1 : -1;
  const fig = { x: fx, y: gy - E.FIG_H * .9 - 2, s: .9, f, pose: { ...E.pose('stand'), aF: 1.35, eF: .3, tor: .12 } };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  c.save(); c.translate(hx, hy); c.scale(f, 1); E.rrect(c, 0, -20, 80, 60, 10, '#8aa0b5', '#cfe0ee', 3); E.line(c, 80, -6, 140, -40, '#cfe0ee', 7); c.restore();
  const pour = (t > .4 && t < 2.8) || (t > 3.3 && t < 4.8);
  if (pour) for (let i = 0; i < 8; i++) { const k = ((t * 2 + i / 8) % 1), sx = hx + f * 140, sy = hy - 40; E.glowDot(c, sx + f * 10, E.lerp(sy, gy - 120, k), 10, 'rgba(170,215,255,.9)'); }
  E.particles(c, R, gy - 90 - h, t - 5.0, { n: 30, speed: 380 });
} },
// 5 — Everyone is carrying something
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Everyone you meet', W / 2, 420, t, -1, 3.7, { size: 52, weight: 800 });
  E.title(c, 'is carrying something.', W / 2, 495, t, .4, 3.7, { size: 52, weight: 800 });
  E.title(c, 'Be kind.', W / 2, 460, t, 3.9, 1e9, { size: 96, weight: 900, color: GOLD });
  const gy = 1320, s = .75;
  E.ground(c, gy, 0, W, '#444');
  for (let i = 0; i < 14; i++) { const x = ((i * 90 - t * 120) % 1260 + 1260) % 1260 - 90; E.line(c, x, gy + 20, x + 40, gy + 20, '#2a2a2a', 4); }
  const loads = ['GRIEF', 'BILLS', 'ANXIETY', 'LONELY'];
  loads.forEach((lab, i) => {
    const x = 190 + i * 230, rev = E.p(t, 1.4 + i * .35, 1.8 + i * .35);
    const fig = { x, y: gy - E.FIG_H * s - 2, s, pose: { ...E.walk(t * 7 + i * 1.7, .3), tor: .18 + rev * .1 } };
    if (rev > 0) { c.save(); c.globalAlpha = rev; c.setLineDash([10, 8]); c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.roundRect(x - 120, fig.y - 70, 90, 120, 18); c.stroke(); c.restore(); E.text(c, lab, x - 75, fig.y - 100, { size: 28, weight: 900, ls: 2, color: GOLD, alpha: rev }); }
    E.figure(c, { ...fig, color: t > 3.9 ? '#fff' : '#cfcfcf' });
  });
  if (t > 3.9) E.glowDot(c, 540, 1100, 520, 'rgba(245,197,66,.18)', E.p(t, 3.9, 4.6));
} },
] };
