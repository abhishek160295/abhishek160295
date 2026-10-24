// Reel 014 — "Signs you're growing"
const sign = (c, t, n, str, pay, size = 50) => {
  E.text(c, `SIGN ${n} OF 5`, W / 2, 360, { size: 28, weight: 900, ls: 6, color: GOLD });
  const k = E.p(t, pay, pay + .25); // the line turns gold the moment the picture proves it
  E.text(c, str, W / 2, 440, { size, weight: 900, family: '"Inter Display", Inter', color: '#fff', alpha: 1 - k });
  E.text(c, str, W / 2, 440, { size, weight: 900, family: '"Inter Display", Inter', color: GOLD, alpha: k });
};
const cup = (c, x, y, t, a = 1) => { c.save(); c.globalAlpha *= a; E.rrect(c, x - 22, y - 50, 44, 50, 6, '#e8e8e8'); c.strokeStyle = '#e8e8e8'; c.lineWidth = 6; c.beginPath(); c.arc(x + 24, y - 26, 12, -1.2, 1.2); c.stroke();
  for (let i = 0; i < 3; i++) { c.strokeStyle = `rgba(255,255,255,${.35 - i * .08})`; c.lineWidth = 4; c.beginPath(); for (let k = 0; k <= 10; k++) { const yy = y - 60 - k * 7 - i * 4, xx = x - 10 + i * 10 + Math.sin(t * 5 + k * .7 + i) * 6; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } c.restore(); };
const REEL = { title: "Signs you're growing", bpm: 150, pace: 'fast', scenes: [
// 1 — You enjoy your own company
{ dur: 5, draw(c, t) {
  E.title(c, "Signs you're growing:", W / 2, 290, t, -1, 1e9, { size: 36, weight: 700, color: '#bbb' });
  sign(c, t, 1, 'You enjoy your own company.', 2.4, 48);
  const gy = 1300, s = .85, down = E.p(t, 1.3, 1.7);
  E.ground(c, gy);
  E.rrect(c, 520, gy - 190, 300, 16, 4, '#9a6b4a'); E.line(c, 670, gy - 174, 670, gy, '#9a6b4a', 8); E.line(c, 600, gy, 740, gy, '#9a6b4a', 8);
  E.rrect(c, 260, gy - 70 - 66 * s + 40, 150, 14, 4, '#555');
  const relax = E.p(t, 1.7, 2.4);
  const sip = t > 2.6 ? Math.max(0, Math.sin((t - 2.6) * 3.2)) : 0;
  const pose = t < 1.3 ? { ...E.pose('phone'), hd: .5 + Math.sin(t * 6) * .05 } : { ...E.mix(E.pose('phone'), { ...E.pose('sit'), tor: -.12, hd: -.15 }, relax), aF: E.lerp(.9, 1.6 + sip * .5, relax), eF: E.lerp(1.9, 1.9 + sip * .2, relax) };
  const fig = { x: 340, y: gy - 66 * s - 6, s, pose };
  E.figure(c, fig);
  if (t < 1.3) { const [px, py] = E.hand(fig); E.phone(c, px + 4, py - 14, 1.3, 1, '#9fd3ff'); E.glowDot(c, px, py - 20, 90, 'rgba(120,190,255,.45)'); for (let i = 0; i < 3; i++) E.glowDot(c, px + 60 + i * 22, py - 70, 9, '#ddd', (Math.sin(t * 8 - i) + 1) / 2); }
  else { const px = E.lerp(400, 600, down), py = E.lerp(gy - 260, gy - 196, down); c.save(); c.translate(px, py); c.rotate(Math.PI / 2 * down); E.rrect(c, -14, -26, 28, 50, 6, '#222', '#ddd', 3); c.restore(); }
  cup(c, 740, gy - 190, t);
  const sun = E.p(t, 2.2, 3.0);
  E.glowDot(c, 880, 700, 360, 'rgba(245,197,66,.35)', sun); c.save(); c.globalAlpha = sun; c.fillStyle = GOLD; c.beginPath(); c.arc(880, 700, 54, 0, 7); c.fill(); c.restore();
  if (t > 2.6) { const k = ((t - 2.6) / 2.4), bx = E.lerp(200, 980, k), by = 760 - Math.sin(k * 6) * 30; c.save(); c.strokeStyle = '#ddd'; c.lineWidth = 4; const w = Math.sin(t * 14) * 10; c.beginPath(); c.moveTo(bx - 22, by - w); c.lineTo(bx, by); c.lineTo(bx + 22, by - w); c.stroke(); c.restore(); }
} },
// 2 — Small things don't ruin your day
{ dur: 5, draw(c, t) {
  sign(c, t, 2, "Small things don't ruin your day.", 2.4, 44);
  const gy = 1300, s = .85; E.ground(c, gy);
  const trip = 0.7, x = t < trip ? E.lerp(160, 360, t / trip) : t < 2.2 ? 360 : E.lerp(360, 900, E.p(t, 2.4, 5, 'lin'));
  let pose = t < trip ? { ...E.walk(x / 22), aF: 1.2, eF: 1.3 } : t < 1.0 ? E.pose('jump') : t < 1.5 ? E.pose('sad') : t < 2.2 ? { ...E.pose('stand'), aF: 1.2, eF: -.6, aB: -1.2, eB: .6 } : E.walk(x / 22);
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, pose });
  // the coffee flies and splashes
  const fl = E.p(t, trip, 1.05, 'out');
  if (t >= trip) { const cx = E.lerp(400, 560, fl), cy = E.lerp(gy - 190, gy - 30, fl) - Math.sin(fl * Math.PI) * 140; c.save(); c.translate(cx, cy); c.rotate(fl * 2.6); E.rrect(c, -22, -25, 44, 50, 6, '#e8e8e8'); c.restore();
    E.particles(c, 560, gy - 20, t - 1.05, { n: 26, speed: 380, color: '#8a5a32', grav: 900, life: .8 });
    c.save(); c.fillStyle = '#5a3a20'; c.beginPath(); c.ellipse(560, gy + 4, 90 * E.p(t, 1.05, 1.3), 12, 0, 0, 7); c.fill(); c.restore(); }
  // the old storm-cloud reaction appears, then gets shrugged off
  const cl = E.p(t, 1.1, 1.35, 'back') * (1 - E.p(t, 1.9, 2.1));
  if (cl > 0) { E.cloud(c, 360, gy - 380, .7 * cl, cl, '#555'); for (let i = 0; i < 6; i++) { const k = (t * 2 + i / 6) % 1; E.line(c, 320 + i * 16, gy - 350 + k * 90, 316 + i * 16, gy - 336 + k * 90, `rgba(170,200,230,${.7 * cl})`, 3); } }
  E.particles(c, 360, gy - 380, t - 2.0, { n: 22, speed: 300, color: '#999', life: .6 });
  if (t > 2.4) for (let i = 0; i < 4; i++) { const k = ((t - 2.4) * .9 + i * .25) % 1; E.text(c, i % 2 ? '♪' : '♫', x + 30 + k * 60, gy - 280 - k * 160, { size: 40, weight: 700, color: GOLD, alpha: Math.sin(k * Math.PI) }); }
} },
// 3 — You stopped chasing people
{ dur: 5, draw(c, t) {
  sign(c, t, 3, 'You stopped chasing people.', 2.4, 48);
  const gy = 1300, s = .8; E.ground(c, gy, 0, W);
  const gx = E.lerp(560, 1250, E.p(t, 0, 2.0, 'in'));
  E.figure(c, { x: gx, y: gy - E.FIG_H * s - 2, s, color: '#666', pose: E.walk(t * 12) });
  let x, f = 1, pose;
  if (t < 1.4) { x = E.lerp(180, 520, t / 1.4); pose = { ...E.run(t * 15), aF: 1.6 }; }
  else if (t < 2.0) { x = 520; pose = E.mix(E.run(t * 15), E.pose('stand'), E.p(t, 1.4, 1.7)); f = t < 1.8 ? 1 : -1; }
  else { x = E.lerp(520, 400, E.p(t, 2.0, 3.0, 'inOut')); f = -1; pose = t < 3.0 ? E.walk(x / 22) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.9, 4.2, 'back')); }
  E.glowDot(c, 120, gy - 200, 300, 'rgba(245,197,66,.35)', E.p(t, 2.0, 2.6));
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, f, pose });
  // the right people walk in to meet you
  [0, 1, 2].forEach(i => { const k = E.p(t, 2.6 + i * .2, 3.9 + i * .2, 'out'); if (k > 0) { const fx = E.lerp(-120 - i * 60, 140 + i * 80, k); E.figure(c, { x: fx, y: gy - E.FIG_H * .75 - 2, s: .75, color: GOLD, pose: k < 1 ? E.walk(fx / 20) : E.pose('cheer') }); } });
} },
// 4 — You rest without guilt
{ dur: 5, draw(c, t) {
  sign(c, t, 4, 'You rest without guilt.', 2.4, 52);
  const gy = 1300, L = 230, R = 850, sway = Math.sin(t * 2.2) * 14;
  E.ground(c, gy);
  [L, R].forEach(px => { E.line(c, px, gy, px, gy - 360, '#9a6b4a', 12); });
  c.save(); c.strokeStyle = '#d9c7a0'; c.lineWidth = 8; c.beginPath(); c.moveTo(L, gy - 300); c.quadraticCurveTo((L + R) / 2 + sway, gy - 120, R, gy - 300); c.stroke(); c.restore();
  E.figure(c, { x: (L + R) / 2 + sway * .8 - 20, y: gy - 212, s: .85, rot: -Math.PI / 2 + .12, pose: { ...E.pose('stand'), aF: -2.4, eF: -.8, aB: -2.2, eB: -.9, lF: .2, lB: -.1 } });
  // guilt pops up, gets swatted
  const g = ['You should be working.', 'Everyone else is grinding.'];
  g.forEach((str, i) => { const t0 = .2 + i * .6, pop = 1.6 + i * .15; E.bubble(c, str, i ? 720 : 400, gy - 520 - i * 110, E.p(t, t0, t0 + .2, 'back') * (1 - E.p(t, pop, pop + .1)), { size: 32, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f' }); E.particles(c, i ? 720 : 400, gy - 520 - i * 110, t - pop, { n: 20, speed: 320, color: RED, life: .6, seed: i * 3 }); });
  if (t > 2.2) for (let i = 0; i < 3; i++) { const k = ((t - 2.2) * .8 + i * .33) % 1; E.text(c, 'z', 560 + k * 80 + i * 10, gy - 300 - k * 160, { size: 34 + i * 8, weight: 800, color: '#aaa', alpha: Math.sin(k * Math.PI) }); }
  if (t > 2.4) { const k = E.p(t, 2.4, 3.4); const bx = 860, by = 600; E.rrect(c, bx - 60, by - 28, 120, 56, 10, '#111', '#ddd', 4); E.rrect(c, bx + 60, by - 12, 10, 24, 3, '#ddd'); E.rrect(c, bx - 52, by - 20, 104 * Math.max(.1, k), 40, 6, k > .8 ? GREEN : '#e5c547'); }
} },
// 5 — You're proud of who you're becoming
{ dur: 5, draw(c, t) {
  sign(c, t, 5, "You're proud of who you're becoming.", 2.4, 42);
  const gy = 1300; E.ground(c, gy);
  const lift = E.p(t, 1.6, 2.4);
  E.figure(c, { x: 520, y: gy - E.FIG_H * .8 - 2, s: .8, color: lift > .5 ? '#ddd' : '#777', pose: E.mix(E.pose('sad'), E.pose('stand'), lift) });
  E.text(c, 'PAST YOU', 520, gy + 44, { size: 28, weight: 900, ls: 3, color: GREY, alpha: 1 - E.p(t, 2.6, 3.0) });
  const k = E.p(t, 0, 1.2, 'out'), x = E.lerp(1100, 660, k);
  const five = E.p(t, 2.8, 3.1);
  let pose = k < 1 ? E.walk(x / 22) : t < 2.8 ? { ...E.pose('stand'), aF: 1.3, eF: .2 } : { ...E.pose('stand'), aF: E.lerp(1.3, 2.7, five), eF: .1 };
  E.figure(c, { x, y: gy - E.FIG_H - 2, f: -1, pose, color: t > 2.8 ? GOLD : '#fff' });
  if (t > 2.8) E.figure(c, { x: 520, y: gy - E.FIG_H * .8 - 2, s: .8, color: GOLD, alpha: five, pose: { ...E.pose('stand'), aF: E.lerp(.2, 2.7, five), eF: .1 } });
  E.rays(c, 590, gy - 330, 600, .3 * E.p(t, 3.0, 3.4), GOLD, 16, t * .3);
  E.particles(c, 590, gy - 330, t - 3.1, { n: 60, speed: 700, grav: 200 });
  E.flash(c, t, 3.1, .3, '245,197,66', .3);
} },
] };
