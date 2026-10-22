// Reel 007 — "Most people quit at 99%"
const REEL = { title: 'Most people quit at 99%', bpm: 150, scenes: [
// 3 — 99% loading
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Most people quit at 99%.', W / 2, 440, t, .05, 4.5, { size: 54, weight: 900 });
  E.title(c, "Don't be most people.", W / 2, 440, t, 4.7, 1e9, { size: 58, weight: 900, color: GOLD, glow: 26 });
  const bx = 160, by = 960, bw = 760, bh = 80;
  let p = .99 * E.p(t, .3, 2.4, 'out');
  if (t > 3.9) p = E.lerp(.99, 1, E.p(t, 3.9, 4.5));
  const done = p >= 1;
  E.rrect(c, bx, by, bw, bh, 40, '#0e0e0e', '#ddd', 5);
  c.save(); c.shadowColor = done ? GREEN : '#fff'; c.shadowBlur = 20; E.rrect(c, bx + 10, by + 10, (bw - 20) * p, bh - 20, 30, done ? GREEN : '#e8e8e8'); c.restore();
  E.text(c, done ? 'COMPLETE' : `${Math.floor(p * 100)}%`, W / 2, by + 160, { size: 64, weight: 900, color: done ? GREEN : '#fff', glow: done ? 24 : 0 });
  const end = bx + 10 + (bw - 20) * p, gy = by + bh;
  // the one who quits
  const quit = E.p(t, 2.7, 3.5, 'inOut');
  if (t < 3.6) E.figure(c, { x: t < 2.6 ? end + 70 : E.lerp(end + 70, -100, quit), y: by - 20 - E.FIG_H * .7, s: .7, f: t < 2.6 ? -1 : -1, pose: t < 2.4 ? { ...E.pose('push') } : t < 2.7 ? E.pose('sad') : E.walk(t * 9), alpha: 1 - quit * .7 });
  // the one who finishes
  if (t > 3.3) { const k = E.p(t, 3.3, 3.9, 'out'); E.figure(c, { x: E.lerp(1150, end + 70, k), y: by - 20 - E.FIG_H * .7, s: .7, f: -1, glow: 22, pose: t < 3.9 ? E.run(t * 14) : t < 4.6 ? E.pose('push') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.6, 4.9, 'back')) }); }
  E.particles(c, bx + bw, by + 40, t - 4.5, { n: 40, speed: 500, color: GREEN });
  E.flash(c, t, 4.5, .3, '61,220,132', .3);
} },
// 2 — The stonecutter
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Hit after hit… nothing.', W / 2, 440, t, .05, 3.8, { size: 52, weight: 800 });
  E.title(c, "It wasn't the last hit.", W / 2, 420, t, 4.3, 1e9, { size: 52, weight: 900 });
  E.title(c, 'It was all of them.', W / 2, 495, t, 4.6, 1e9, { size: 56, weight: 900, color: GOLD, glow: 26 });
  const gy = 1330, rx = 700, split = E.p(t, 4.0, 4.6, 'out');
  E.shake(c, t, 4.0, .4, 20);
  E.ground(c, gy, 90, 990);
  const per = t < 1.4 ? .55 : .2, hits = t < 4.0 ? (t < 1.4 ? Math.floor(t / .55) : 2 + Math.floor((t - 1.4) / .2)) : 0;
  const n = t < 4.0 ? Math.min(100, t < 1.4 ? hits : Math.round(2 + 98 * E.p(t, 1.4, 3.9, 'in'))) : 101;
  E.text(c, `HIT ${n}`, 540, 600, { size: 40, weight: 900, ls: 4, color: n > 100 ? GOLD : GREY, glow: n > 100 ? 20 : 0 });
  // rock
  const rock = d => { c.save(); c.translate(rx + d * split * (d < 0 ? 50 : 160), gy); c.rotate(d * split * .25); c.fillStyle = '#4a4a4a'; c.strokeStyle = '#8a8a8a'; c.lineWidth = 4;
    c.beginPath(); if (d < 0) { c.moveTo(0, 0); c.lineTo(-170, 0); c.lineTo(-190, -120); c.lineTo(-120, -260); c.lineTo(-20, -300); c.lineTo(10, -150); } else { c.moveTo(0, 0); c.lineTo(170, 0); c.lineTo(200, -140); c.lineTo(110, -270); c.lineTo(-20, -300); c.lineTo(10, -150); } c.closePath(); c.fill(); c.stroke(); c.restore(); };
  rock(-1); rock(1);
  if (split > 0) { E.glowDot(c, rx, gy - 150, 380 * split, 'rgba(245,197,66,.6)'); E.rays(c, rx, gy - 150, 600, .4 * split, GOLD, 14, t * .2); }
  // swing
  const ph = t < 4.0 ? ((t - (t < 1.4 ? 0 : 1.4)) % per) / per : Math.min(1, (t - 4.0) / .15);
  const sw = Math.sin(Math.min(1, ph) * Math.PI);
  const fig = { x: 340, y: gy - E.FIG_H - 2, pose: { ...E.pose('stand'), tor: .15 + sw * .2, aF: E.lerp(2.9, .9, ph < .6 ? ph / .6 : 1), eF: .1, aB: E.lerp(2.7, .8, ph < .6 ? ph / .6 : 1), eB: .1, lF: .35, lB: -.3 } };
  E.figure(c, { ...fig, glow: split * 20 });
  const [hx, hy] = E.hand(fig), ang = Math.atan2(hy - (fig.y - 40), hx - fig.x);
  c.save(); c.translate(hx, hy); c.rotate(ang); E.line(c, 0, 0, 90, 0, '#b08060', 9); c.fillStyle = '#ccc'; c.fillRect(80, -30, 26, 60); c.restore();
  if (t < 4.0 && ph > .55 && ph < .75) for (let i = 0; i < 6; i++) E.glowDot(c, rx - 170 + E.rnd(i + n) * 30, gy - 160 + (E.rnd(i * 3 + n) - .5) * 80, 10, 'rgba(255,255,255,.8)');
  E.particles(c, rx, gy - 150, t - 4.0, { n: 60, speed: 800, grav: 300 });
  E.flash(c, t, 4.0, .4, '245,197,66', .4);
} },
// 1 — Rocket
{ dur: 6.4, draw(c, t) {
  E.text(c, 'The start takes the most energy.', W / 2, 440, { size: 46, weight: 800, alpha: 1 - E.p(t, 3.1, 3.4) });
  E.title(c, 'Then momentum takes over.', W / 2, 440, t, 3.5, 1e9, { size: 52, weight: 900, color: GOLD, glow: 24 });
  const gy = 1360, lift = E.p(t, 1.0, 3.2, 'in'), zoom = E.p(t, 3.2, 3.6, 'in');
  const fuel = 1 - .85 * E.p(t, .8, 3.2, 'out');
  // stars streaming once we're moving
  for (let i = 0; i < 40; i++) { const x = E.rnd(i) * W, sp = 400 + 900 * lift, y = (E.rnd(i + 3) * 1600 + t * sp) % 1600 + 300; E.line(c, x, y, x, y + 4 + 40 * lift + 120 * zoom, `rgba(255,255,255,${.15 + .4 * lift})`, 3); }
  E.ground(c, gy + lift * 800, 90, 990);
  const ry = gy - 40 - lift * 400 + Math.sin(t * 3) * 10 * zoom, rx = 600 + Math.sin(t * 40) * 3 * (t > .6 && t < 3.3 ? 1 : 0);
  // flame
  if (t > .6) { const f = 1 + Math.sin(t * 50) * .15; c.save(); c.fillStyle = GOLD; c.shadowColor = '#ff8a3d'; c.shadowBlur = 50; c.beginPath(); c.moveTo(rx - 34, ry); c.quadraticCurveTo(rx, ry + 220 * f * (1.2 - lift * .5), rx + 34, ry); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(rx - 16, ry); c.quadraticCurveTo(rx, ry + 100 * f, rx + 16, ry); c.fill(); c.restore();
    if (t < 1.8) for (let i = 0; i < 16; i++) { const k = ((t * 2 + E.rnd(i)) % 1); E.glowDot(c, rx + (E.rnd(i + 5) - .5) * 300 * k, gy - 10 - k * 40, 40 * (1 - k), 'rgba(200,200,200,.5)'); } }
  c.save(); c.translate(rx, ry); c.fillStyle = '#eee'; c.strokeStyle = '#fff'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(-44, 0); c.lineTo(-44, -220); c.quadraticCurveTo(0, -330, 44, -220); c.lineTo(44, 0); c.closePath(); c.fill();
  c.fillStyle = RED; c.beginPath(); c.moveTo(-44, -10); c.lineTo(-90, 30); c.lineTo(-44, -80); c.fill(); c.beginPath(); c.moveTo(44, -10); c.lineTo(90, 30); c.lineTo(44, -80); c.fill();
  c.fillStyle = '#0b2a44'; c.beginPath(); c.arc(0, -180, 22, 0, 7); c.fill(); c.strokeStyle = '#999'; c.stroke(); c.restore();
  // effort gauge
  const gx = 150, gt = 760, gh = 520;
  E.text(c, 'EFFORT', gx + 30, gt - 40, { size: 26, weight: 900, ls: 3, color: GREY });
  E.rrect(c, gx, gt, 60, gh, 14, '#111', '#aaa', 4);
  const fcol = fuel < .3 ? RED : GOLD; c.save(); c.shadowColor = fcol; c.shadowBlur = 20; E.rrect(c, gx + 8, gt + 8 + (gh - 16) * (1 - fuel), 44, (gh - 16) * fuel, 10, fcol); c.restore();
  E.text(c, Math.round(fuel * 100) + '%', gx + 30, gt + gh + 40, { size: 32, weight: 800, color: fcol });
} },
// 4 — The kite
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Feeling the resistance?', W / 2, 440, t, .05, 2.6, { size: 54, weight: 800 });
  E.title(c, 'Kites rise against the wind,', W / 2, 420, t, 2.8, 1e9, { size: 50, weight: 900 });
  E.title(c, 'not with it.', W / 2, 495, t, 3.2, 1e9, { size: 58, weight: 900, color: GOLD, glow: 26 });
  const gy = 1360, fx = 280, wind = E.p(t, .3, 4.6, 'inOut');
  E.ground(c, gy, 90, 990);
  const kx = E.lerp(560, 720, wind) + Math.sin(t * 2.4) * 25, ky = E.lerp(1050, 640, wind) + Math.cos(t * 2) * 18;
  const fig = { x: fx, y: gy - E.FIG_H - 2, pose: { ...E.pose('stand'), aF: 2.2, eF: .1, tor: -.1 + wind * -.1, lF: .3, lB: -.25 } };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  c.save(); c.strokeStyle = '#aaa'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo((hx + kx) / 2, (hy + ky) / 2 + 120, kx, ky + 90); c.stroke(); c.restore();
  // wind arrows labelled
  const labs = ['PROBLEMS', 'PRESSURE', 'DOUBT'];
  for (let i = 0; i < 6; i++) { const y = 720 + i * 95, k = ((t * .9 + E.rnd(i)) % 1), x = W + 60 - k * 1300; c.save(); c.globalAlpha = .55; E.line(c, x, y, x + 160, y, '#9ab', 4); c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 18, y - 12); c.lineTo(x + 18, y + 12); c.fillStyle = '#9ab'; c.fill(); c.restore(); if (i % 2 === 0) E.text(c, labs[i / 2], x + 90, y - 26, { size: 22, weight: 800, ls: 2, color: '#9ab', alpha: .8 }); }
  c.save(); c.translate(kx, ky); c.rotate(-.25 + Math.sin(t * 3) * .08); c.shadowColor = GOLD; c.shadowBlur = 20 + 30 * wind;
  c.fillStyle = GOLD; c.beginPath(); c.moveTo(0, -110); c.lineTo(75, 0); c.lineTo(0, 90); c.lineTo(-75, 0); c.closePath(); c.fill();
  c.strokeStyle = '#8a6a1a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -110); c.lineTo(0, 90); c.moveTo(-75, 0); c.lineTo(75, 0); c.stroke();
  c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 90); for (let i = 1; i <= 8; i++) c.lineTo(Math.sin(t * 6 + i) * 22, 90 + i * 26); c.stroke(); c.restore();
} },
// 5 — Look how far you've come
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Still so far to go…', W / 2, 440, t, .05, 2.6, { size: 54, weight: 800, color: '#ccc' });
  E.title(c, "Look how far you've come.", W / 2, 440, t, 3.0, 1e9, { size: 52, weight: 900, color: GOLD, glow: 26 });
  const out = E.p(t, 2.4, 4.4, 'inOut');
  const path = [[60, 1700], [260, 1560], [380, 1600], [560, 1380], [650, 1420], [820, 1180], [900, 1210], [1060, 960], [1150, 990], [1320, 700]];
  const fig = [985, 1080];
  c.save();
  E.camera(c, E.lerp(2.0, .8, out), E.lerp(fig[0] + 40, 690, out), E.lerp(fig[1] - 150, 1260, out), W / 2, 1050);
  c.save(); c.fillStyle = '#151515'; c.beginPath(); c.moveTo(path[0][0], 2200); path.forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(1400, 640); c.lineTo(1500, 2200); c.fill(); c.restore();
  c.save(); c.strokeStyle = '#888'; c.lineWidth = 6; c.beginPath(); path.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
  // glowing trail behind
  const trail = E.p(t, 2.8, 4.4, 'inOut');
  c.save(); c.strokeStyle = GOLD; c.lineWidth = 10; c.shadowColor = GOLD; c.shadowBlur = 24; c.globalAlpha = trail; c.beginPath(); path.slice(0, 8).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.lineTo(fig[0], fig[1]); c.stroke(); c.restore();
  E.text(c, 'WHERE YOU STARTED', 120, 1760, { size: 34, weight: 900, ls: 3, color: GOLD, alpha: E.p(t, 4.0, 4.4), align: 'left' });
  E.flag(c, 1300, 704, 1, 20);
  E.figure(c, { x: fig[0], y: fig[1] - E.FIG_H * .8 - 2, s: .8, f: t < 2.4 ? 1 : -1, glow: trail * 20, pose: t < 2.4 ? { ...E.pose('stand'), hd: -.5, tor: .1 } : E.mix(E.pose('stand'), E.pose('point'), E.p(t, 2.6, 3.0)) });
  c.restore();
} },
] };
