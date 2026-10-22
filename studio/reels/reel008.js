// Reel 008 — "Know your worth"
const REEL = { title: 'Know your worth', bpm: 150, scenes: [
// 1 — The price tag
{ dur: 6.4, draw(c, t) {
  E.text(c, 'People will try to set your price.', W / 2, 470, { size: 46, weight: 800, alpha: 1 - E.p(t, 3.4, 3.7) });
  E.title(c, 'Know your worth.', W / 2, 470, t, 3.9, 1e9, { size: 70, weight: 900, color: GOLD, glow: 28 });
  const gy = 1300, s = .95, fx = 620;
  E.ground(c, gy, 90, 990);
  const fade = E.p(t, 3.4, 4.0);
  [170, 290].forEach((x, i) => E.figure(c, { x, y: gy - E.FIG_H * .75 - 2, s: .75, color: '#666', alpha: 1 - fade * .8, pose: { ...E.pose('point'), aF: 1.7 } }));
  E.bubble(c, "You're not enough.", 230, gy - 330, E.p(t, .4, .7, 'back') * (1 - fade), { size: 28 });
  const fig = { x: fx, y: gy - E.FIG_H * s - 2, s, f: 1, pose: t < 2.3 ? E.pose('sad') : t < 3.3 ? { ...E.pose('stand'), aF: 1.0, eF: 1.2, hd: .3 } : E.mix(E.pose('stand'), E.pose('arms'), E.p(t, 3.4, 3.8)), glow: fade * 22 };
  E.figure(c, fig);
  // tag on a string from the neck
  const [nx, ny] = E.headPos(fig), flip = E.p(t, 2.6, 3.3, 'inOut');
  const tx = nx + 110, ty = ny + 140 + Math.sin(t * 2) * 6, sc = Math.abs(Math.cos(flip * Math.PI)), back = flip > .5;
  E.line(c, nx + 10, ny + 30, tx - 40, ty - 20, '#aaa', 3);
  c.save(); c.translate(tx, ty); c.rotate(-.12); c.scale(sc || .02, 1);
  c.shadowColor = back ? GOLD : 'transparent'; c.shadowBlur = back ? 30 : 0;
  c.fillStyle = back ? GOLD : '#d9d0bb'; c.beginPath(); c.moveTo(-70, -26); c.lineTo(100, -40); c.lineTo(130, 0); c.lineTo(100, 40); c.lineTo(-70, 26); c.closePath(); c.fill();
  c.fillStyle = '#000'; c.beginPath(); c.arc(-50, 0, 7, 0, 7); c.fill();
  c.restore();
  E.text(c, back ? 'PRICELESS' : '$1', tx + 30, ty, { size: back ? 30 : 46, weight: 900, color: '#111', alpha: sc > .2 ? 1 : 0 });
  E.particles(c, tx + 30, ty, t - 3.3, { n: 36, speed: 450 });
} },
// 2 — Stop shrinking
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Shrinking to fit in?', W / 2, 440, t, .05, 2.6, { size: 56, weight: 800 });
  E.title(c, 'You were born', W / 2, 420, t, 3.6, 1e9, { size: 58, weight: 900, color: GOLD, glow: 26 });
  E.title(c, 'to stand out.', W / 2, 495, t, 3.8, 1e9, { size: 58, weight: 900, color: GOLD, glow: 26 });
  const gy = 1300, spot = E.p(t, 2.6, 3.0);
  E.ground(c, gy, 90, 990);
  [150, 280, 410, 670, 800, 930].forEach((x, i) => E.figure(c, { x, y: gy - E.FIG_H * .7 - 2, s: .7, color: '#5a5a5a', alpha: 1 - spot * .5, pose: E.walk(i * .9, .05) }));
  if (spot > 0) { c.save(); const g = c.createLinearGradient(0, 300, 0, gy); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(1, `rgba(255,240,200,${.28 * spot})`); c.fillStyle = g; c.beginPath(); c.moveTo(500, 300); c.lineTo(580, 300); c.lineTo(700, gy); c.lineTo(380, gy); c.fill(); c.restore(); c.save(); c.fillStyle = `rgba(255,240,200,${.25 * spot})`; c.beginPath(); c.ellipse(540, gy, 160, 22, 0, 0, 7); c.fill(); c.restore(); }
  const sz = t < 2.6 ? E.lerp(.7, .32, E.p(t, .3, 2.3, 'inOut')) : E.lerp(.32, 1.05, E.p(t, 3.0, 3.8, 'back'));
  E.figure(c, { x: 540, y: gy - E.FIG_H * sz - 2, s: sz, lw: 13 * Math.max(1, .7 / sz) * (sz < .5 ? .9 : 1), glow: spot * 24, pose: t < 3.0 ? E.pose('sad') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.8, 4.2, 'back')) });
} },
// 3 — Chapter 1 vs chapter 20
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Comparing yourself?', W / 2, 440, t, .05, 2.0, { size: 56, weight: 800 });
  E.title(c, 'They started at step 1 too.', W / 2, 440, t, 2.3, 4.2, { size: 50, weight: 800, color: '#ccc' });
  E.title(c, 'Your chapter 1 ≠ their chapter 20.', W / 2, 440, t, 4.4, 1e9, { size: 44, weight: 900, color: GOLD, glow: 24 });
  const gy = 1360, s = .6, n = 10, sw = 40, sh = 60;
  E.ground(c, gy, 60, 1020);
  E.stairs(c, 90, gy, n, sw, sh, 1, { fill: '#1e1e1e', stroke: '#666' });
  E.stairs(c, 590, gy, n, sw, sh, 1, { fill: '#1e1e1e', stroke: '#666', top: n - 1 });
  E.text(c, 'YOU', 290, gy + 50, { size: 30, weight: 900, ls: 3 }); E.text(c, 'THEM', 790, gy + 50, { size: 30, weight: 900, ls: 3, color: GREY });
  // them: rewinds down to step 1, then back up
  const rew = E.p(t, 2.2, 3.0, 'inOut') * (1 - E.p(t, 3.4, 4.2, 'inOut'));
  const ts = E.lerp(n - 1, 0, rew);
  if (rew > 0 && rew < 1) E.text(c, '◀◀ YEARS AGO', 790, 640, { size: 34, weight: 900, color: GREY, ls: 3 });
  E.figure(c, { x: 590 + ts * sw + sw / 2, y: gy - (Math.round(ts) + 1) * sh - E.FIG_H * s - 2, s, color: '#999', pose: rew > 0 && rew < 1 ? E.walk(t * 12) : E.pose('stand') });
  // you: sad on step 1, then start climbing
  const climb = E.p(t, 4.3, 6.2, 'inOut'), ys = climb * 5;
  E.figure(c, { x: 90 + ys * sw + sw / 2, y: gy - (Math.floor(ys) + 1) * sh - E.FIG_H * s - 2, s, glow: climb > 0 ? 20 : 0, pose: t < 4.3 ? E.pose('sad') : E.walk(t * 9) });
} },
// 4 — Mute the noise
{ dur: 6.4, draw(c, t) {
  E.title(c, 'The noise gets loud…', W / 2, 440, t, .05, 2.6, { size: 56, weight: 800 });
  E.title(c, 'Mute it.', W / 2, 440, t, 2.8, 4.4, { size: 72, weight: 900, color: RED, glow: 20 });
  E.title(c, 'Keep moving.', W / 2, 440, t, 4.6, 1e9, { size: 72, weight: 900, color: GOLD, glow: 28 });
  const gy = 1300, s = .8, mute = E.p(t, 2.6, 3.0, 'back');
  E.ground(c, gy, 0, W, '#444');
  [['You can\'t.', 300, 700, .3], ['Who do you think you are?', 560, 820, .8], ['Stay in your lane.', 330, 940, 1.3], ['LOL', 760, 640, 1.7], ['Be realistic.', 720, 1020, 2.0]].forEach(([str, x, y, t0], i) =>
    E.bubble(c, str, x + Math.sin(t * 7 + i) * 5, y, E.p(t, t0, t0 + .25, 'back') * (1 - E.p(t, 2.9, 3.2)), { size: 30, stroke: '#888' }));
  const x = t < 3.2 ? 200 + t * 20 : E.lerp(264, 880, E.p(t, 3.2, 5.0, 'inOut'));
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, glow: t > 3.2 ? 22 : 0, pose: t < 2.8 ? E.walk(t * 6, .2) : t < 3.2 ? E.pose('stand') : t < 5 ? E.run(x / 20) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5, 5.3, 'back')) });
  if (mute > 0) { const a = 1 - E.p(t, 3.6, 4.0); c.save(); c.globalAlpha = a; c.translate(540, 840); c.scale(mute, mute); c.fillStyle = '#fff'; c.shadowColor = '#fff'; c.shadowBlur = 20;
    c.beginPath(); c.moveTo(-90, -40); c.lineTo(-40, -40); c.lineTo(20, -100); c.lineTo(20, 100); c.lineTo(-40, 40); c.lineTo(-90, 40); c.closePath(); c.fill();
    c.strokeStyle = RED; c.lineWidth = 16; c.lineCap = 'round'; c.shadowColor = RED; c.beginPath(); c.moveTo(-120, -120); c.lineTo(120, 120); c.stroke(); c.restore(); }
  if (t > 3.2) for (let i = 0; i < 6; i++) E.line(c, x - 80 - i * 30, gy - 100 - i * 18, x - 160 - i * 40, gy - 100 - i * 18, `rgba(245,197,66,${.5 - i * .07})`, 4);
} },
// 5 — Fix your crown
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Life will knock you down.', W / 2, 440, t, .05, 2.6, { size: 54, weight: 800 });
  E.title(c, 'Fix your crown.', W / 2, 420, t, 4.3, 1e9, { size: 64, weight: 900, color: GOLD, glow: 28 });
  E.title(c, 'Keep going.', W / 2, 500, t, 4.6, 1e9, { size: 50, weight: 800 });
  const gy = 1300, s = .95;
  E.ground(c, gy, 90, 990);
  // rock to trip on
  c.save(); c.fillStyle = '#444'; c.beginPath(); c.ellipse(420, gy, 46, 26, 0, Math.PI, 0); c.fill(); c.restore();
  let x = E.lerp(150, 400, E.p(t, 0, 1.1, 'lin')), y = gy - E.FIG_H * s - 2, rot = 0, pose = E.walk(x / 26);
  const fall = E.p(t, 1.1, 1.5, 'in'), rise = E.p(t, 2.6, 3.2, 'inOut');
  if (t >= 1.1 && t < 2.6) { x = E.lerp(400, 520, fall); rot = fall * Math.PI / 2; y = E.lerp(y, gy - 32, fall); pose = E.pose('stand'); }
  if (t >= 2.6) { x = 520; rot = (1 - rise) * Math.PI / 2; y = E.lerp(gy - 32, gy - E.FIG_H * s - 2, rise); pose = t < 3.3 ? E.pose('crouch') : t < 3.7 ? E.walk(t * 6) : E.mix(E.pose('stand'), E.pose('carryUp'), E.p(t, 3.7, 4.0)); if (t > 3.3) x = E.lerp(520, 700, E.p(t, 3.3, 3.7)); if (t > 4.3) pose = E.mix(E.pose('carryUp'), E.pose('stand'), E.p(t, 4.3, 4.6)); }
  const fig = { x, y, s, rot, pose, glow: t > 4.1 ? 26 : 0 };
  E.figure(c, fig);
  // crown path
  const [hx, hy] = E.headPos({ ...fig, rot: 0 });
  let cx, cy, cr = 0;
  if (t < 1.1) { cx = hx; cy = hy - 40; }
  else if (t < 3.7) { const k = E.p(t, 1.1, 2.0, 'out'); cx = E.lerp(430, 760, k); cy = gy - 26 - Math.sin(k * Math.PI) * 160; cr = k * 4; }
  else { const k = E.p(t, 3.7, 4.1, 'inOut'), [ux, uy] = E.headPos({ ...fig, rot: 0 }); cx = E.lerp(760, ux, k); cy = E.lerp(gy - 26, uy - 40, k) - Math.sin(k * Math.PI) * 120; cr = (1 - k) * 4 % (Math.PI * 2); }
  E.crown(c, cx, cy, .75 * s, 1, cr % (Math.PI * 2), t > 4.1 ? 40 : 24);
  E.rays(c, 700, gy - 260, 600, .3 * E.p(t, 4.1, 4.5) * (1 - E.p(t, 5.5, 6.4) * .4), GOLD, 16, t * .2);
  E.particles(c, 700, gy - 300, t - 4.1, { n: 50, speed: 600 });
  E.flash(c, t, 4.1, .35, '245,197,66', .35);
} },
] };
