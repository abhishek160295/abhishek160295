// Reel 010 — "Nobody claps at 5 AM"
const REEL = { title: 'Nobody claps at 5 AM', bpm: 150, scenes: [
// 1 — Day 1 vs Day 100
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Day 1 feels impossible.', W / 2, 420, t, -1, 2.0, { size: 52, weight: 800 });
  E.title(c, 'Nobody sees days 2 to 99.', W / 2, 420, t, 2.2, 4.2, { size: 52, weight: 800, color: '#ccc' });
  E.title(c, 'Show up for the boring days.', W / 2, 420, t, 4.4, 1e9, { size: 50, weight: 900, color: GOLD });
  const gy = 1320, x = 540, s = 1;
  const k = E.p(t, 1.2, 3.8, 'inOut'), day = Math.max(1, Math.round(1 + 99 * k));
  E.text(c, `DAY ${day}`, W / 2, 620, { size: 64, weight: 900, ls: 4, color: day === 100 ? GOLD : '#fff' });
  // progress rail
  E.rrect(c, 240, 690, 600, 12, 6, '#222'); E.rrect(c, 240, 690, 600 * k + 1, 12, 6, day === 100 ? GOLD : '#ddd');
  E.ground(c, gy, 140, 940);
  const plate = E.lerp(26, 78, k), shaky = (1 - k) * Math.sin(t * 60) * 5;
  const cyc = (t * (t < 1.2 ? .9 : 1.6)) % 1, up = t < 1.2 ? Math.min(.55, Math.sin(cyc * Math.PI)) : Math.sin(cyc * Math.PI);
  const lift = t > 4.2 ? 1 : up;
  const pose = { ...E.pose('stand'), aB: E.lerp(.9, -2.85, lift), eB: E.lerp(1.3, -.1, lift), aF: E.lerp(.9, 2.85, lift), eF: E.lerp(1.3, .1, lift), lB: -.25, lF: .25, kB: .15 * (1 - lift), kF: .15 * (1 - lift) };
  const fig = { x: x + shaky, y: gy - E.FIG_H * s - 2, s, pose, glow: t > 4.2 ? 10 : 0 };
  const [hx, hy] = E.hand(fig), bw = E.lerp(170, 420, k);
  E.figure(c, fig);
  c.save(); c.translate(0, 0);
  E.line(c, x - bw / 2 + shaky, hy, x + bw / 2 + shaky, hy, '#ddd', 9);
  [-1, 1].forEach(d => { E.rrect(c, x + d * (bw / 2 - 18) - 13 + shaky, hy - plate, 26, plate * 2, 6, day === 100 ? GOLD : '#888'); });
  c.restore();
  E.particles(c, x, hy, t - 4.2, { n: 40, speed: 520 });
} },
// 2 — Nobody claps at 5 AM
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Nobody claps at 5 AM.', W / 2, 420, t, -1, 3.6, { size: 56, weight: 800 });
  E.title(c, 'But everyone sees the result.', W / 2, 420, t, 3.8, 1e9, { size: 48, weight: 900, color: GOLD });
  const gy = 1300, dawn = E.p(t, 3.2, 4.2);
  // sky + skyline
  c.save(); const g = c.createLinearGradient(0, 560, 0, gy); g.addColorStop(0, `rgba(0,0,0,0)`); g.addColorStop(1, `rgba(245,150,60,${.35 * dawn})`); c.fillStyle = g; c.fillRect(0, 560, W, gy - 560); c.restore();
  const scroll = Math.min(t, 3.4) * 140;
  for (let i = 0; i < 9; i++) {
    const bw = 140 + E.rnd(i) * 60, bh = 200 + E.rnd(i + 4) * 280, bx = ((i * 190 - scroll) % 1710 + 1710) % 1710 - 300;
    E.rrect(c, bx, gy - bh, bw, bh, 4, '#141414', '#2c2c2c', 3);
    for (let r = 0; r < Math.floor(bh / 60); r++) for (let q = 0; q < 2; q++) { const lit = E.rnd(i * 13 + r * 3 + q) < dawn * .8; E.rrect(c, bx + 26 + q * (bw / 2), gy - bh + 30 + r * 60, 30, 30, 3, lit ? '#f2c76b' : '#1f1f1f'); }
  }
  E.moon(c, 860, 640, 36, 1 - dawn);
  E.ground(c, gy, 0, W, '#555');
  const k = E.p(t, 3.4, 4.0, 'out'), x = t < 3.4 ? 420 : E.lerp(420, 540, k);
  if (t >= 3.4) E.rrect(c, 460, gy - 90, 160, 90, 6, GOLD);
  const fy = t < 3.4 ? gy - E.FIG_H * .85 - 2 : E.lerp(gy - E.FIG_H * .85 - 2, gy - 90 - E.FIG_H * .85 - 2, k) - Math.sin(k * Math.PI) * 60;
  E.figure(c, { x, y: fy, s: .85, pose: t < 3.4 ? E.run(t * 14) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.0, 4.3, 'back')) });
  if (t > 3.8) [150, 260, 820, 930].forEach((cx, i) => { const a = E.p(t, 3.8 + i * .1, 4.1 + i * .1); const clap = Math.sin(t * 16 + i) > 0; E.figure(c, { x: cx, y: gy - E.FIG_H * .65 - 2, s: .65, color: '#888', alpha: a, f: cx < 540 ? 1 : -1, pose: { ...E.pose('stand'), aF: clap ? 1.5 : 1.1, eF: clap ? .6 : .2, aB: clap ? 1.5 : 1.1, eB: clap ? .6 : .2 } }); });
} },
// 3 — 100 excuses vs one reason
{ dur: 6.4, draw(c, t) {
  E.title(c, '100 excuses.', W / 2, 420, t, -1, 3.0, { size: 60, weight: 900 });
  E.title(c, 'One reason is enough.', W / 2, 420, t, 3.2, 1e9, { size: 56, weight: 900, color: GOLD });
  E.shake(c, t, 3.05, .4, 18);
  const px = 540, py = 820, L = 300, gy = 1380;
  const ex = [['Tired', .3], ['Busy', .7], ['Monday', 1.1], ['Raining', 1.5], ['Later', 1.9]];
  const nEx = ex.filter(([, t0]) => t >= t0 + .3).length;
  let a = -.05 * nEx;
  if (t > 3.05) a = E.lerp(-.25, .3, E.ease.elastic(E.clamp((t - 3.05) / 1.1)));
  E.line(c, px, gy, px, py, '#888', 8); E.rrect(c, px - 90, gy - 10, 180, 20, 6, '#555');
  const lx = px - Math.cos(a) * L, ly = py - Math.sin(a) * L, rx = px + Math.cos(a) * L, ry = py + Math.sin(a) * L;
  E.line(c, lx, ly, rx, ry, '#ddd', 10); c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.arc(px, py, 16, 0, 7); c.fill(); c.restore();
  const pan = (x, y) => { E.line(c, x, y, x - 110, y + 200, '#888', 3); E.line(c, x, y, x + 110, y + 200, '#888', 3); c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.moveTo(x - 130, y + 200); c.lineTo(x + 130, y + 200); c.quadraticCurveTo(x, y + 250, x - 130, y + 200); c.fill(); c.restore(); return y + 200; };
  const lt = pan(lx, ly), rt = pan(rx, ry);
  ex.forEach(([lab, t0], i) => {
    const k = E.p(t, t0, t0 + .3, 'in'); if (k <= 0) return;
    const by = E.lerp(620, lt - 46 - i * 46, k);
    c.save(); c.globalAlpha = E.p(t, t0, t0 + .12);
    E.rrect(c, lx - 90, by, 180, 42, 6, '#2a2a2a', '#777', 3);
    E.text(c, lab, lx, by + 21, { size: 24, weight: 800, color: '#ccc' }); c.restore();
  });
  const wk = E.p(t, 2.7, 3.05, 'in');
  if (wk > 0) { const by = E.lerp(560, rt - 130, wk); E.rrect(c, rx - 100, by, 200, 130, 10, GOLD); E.text(c, 'WHY', rx, by + 65, { size: 56, weight: 900, color: '#111' }); }
  E.particles(c, rx, rt - 60, t - 3.05, { n: 40, speed: 500 });
} },
// 4 — Rest, don't quit
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Tired?', W / 2, 420, t, -1, 1.6, { size: 64, weight: 900 });
  E.title(c, 'Learn to rest,', W / 2, 420, t, 1.8, 1e9, { size: 56, weight: 800 });
  E.title(c, 'not to quit.', W / 2, 495, t, 2.6, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1300, s = .75;
  E.ground(c, gy, 90, 990); E.flag(c, 870, gy, 1, 20);
  // bench
  E.rrect(c, 360, gy - 70, 180, 16, 4, '#9a6b4a'); E.line(c, 375, gy - 54, 375, gy, '#9a6b4a', 6); E.line(c, 525, gy - 54, 525, gy, '#9a6b4a', 6);
  E.text(c, 'REST', 450, gy + 36, { size: 24, weight: 900, ls: 3, color: GREY });
  // quitter turns back
  const qk = E.p(t, 1.6, 3.6, 'inOut');
  const qx = t < 1.4 ? E.lerp(150, 380, E.p(t, 0, 1.4, 'lin')) : E.lerp(380, -60, qk);
  E.figure(c, { x: qx, y: gy - E.FIG_H * s - 2, s, f: t < 1.4 ? 1 : -1, color: t < 1.4 ? '#fff' : '#777', pose: t < 1.4 ? E.walk(qx / 22) : E.walk(qx / 22, .2) });
  if (t > 1.6 && t < 3.6) E.text(c, 'QUIT', qx, gy - 250, { size: 26, weight: 900, ls: 3, color: RED, alpha: 1 - qk });
  // rester sits, recharges, finishes
  let x = t < 1.4 ? E.lerp(100, 450, E.p(t, 0, 1.4, 'lin')) : 450, y = gy - E.FIG_H * s - 2, pose = E.walk(x / 22);
  const charge = E.p(t, 1.6, 3.6, 'lin');
  if (t >= 1.4 && t < 3.7) { y = gy - 70 - 66 * s + 2; pose = E.pose('sit'); }
  if (t >= 3.7) { const k = E.p(t, 3.7, 5.0, 'inOut'); x = E.lerp(450, 840, k); pose = k < 1 ? E.run(x / 20) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.0, 5.3, 'back')); }
  E.figure(c, { x, y, s, pose, glow: t > 5 ? 10 : 0 });
  if (t > 1.5 && t < 3.9) { const bx = 450, by = gy - 330; E.rrect(c, bx - 40, by - 20, 80, 40, 8, '#111', '#ddd', 3); E.rrect(c, bx + 40, by - 8, 7, 16, 2, '#ddd'); const col = charge < .4 ? RED : charge < .8 ? '#e5c547' : GREEN; E.rrect(c, bx - 35, by - 15, 70 * Math.max(.06, charge), 30, 5, col); }
  E.particles(c, 840, gy - 150, t - 5.0, { n: 30, speed: 400 });
} },
// 5 — One brick a day
{ dur: 6.4, draw(c, t) {
  E.title(c, "Don't try to build a wall.", W / 2, 420, t, -1, 2.4, { size: 52, weight: 800 });
  E.title(c, 'Lay one brick. Every day.', W / 2, 420, t, 2.6, 4.4, { size: 52, weight: 800 });
  E.title(c, "That's how empires are built.", W / 2, 420, t, 4.6, 1e9, { size: 48, weight: 900, color: GOLD });
  const gy = 1320, cols = 9, rows = 8, bw = 60, bh = 30, x0 = 330;
  const total = cols * rows, n = Math.floor(total * E.p(t, .4, 4.3, 'in'));
  const day = Math.max(1, Math.round(365 * E.p(t, .4, 4.3, 'in')));
  E.text(c, `DAY ${day}`, W / 2, 560, { size: 34, weight: 800, ls: 3, color: GREY });
  E.ground(c, gy, 90, 990);
  for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), q = i % cols, off = r % 2 ? bw / 2 : 0; if (r % 2 && q === cols - 1) continue; E.rrect(c, x0 + q * bw + off, gy - (r + 1) * bh, bw - 4, bh - 4, 3, i === n - 1 && t < 4.3 ? GOLD : '#b5653f'); }
  const roof = E.p(t, 4.3, 4.9, 'out');
  if (roof > 0) {
    const top = gy - rows * bh, L = x0 - 30, R = x0 + cols * bw + 30;
    c.save(); c.fillStyle = '#3a3a3a'; c.globalAlpha = roof; c.beginPath(); c.moveTo(L, top); c.lineTo((L + R) / 2, top - 200 * roof); c.lineTo(R, top); c.fill(); c.restore();
    c.save(); c.globalAlpha = roof; c.fillStyle = GOLD; c.fillRect(x0 + 2 * bw, gy - 6 * bh, 110, 90); c.fillStyle = '#2a1a10'; c.fillRect(x0 + 5.5 * bw, gy - 4 * bh, 90, 4 * bh); c.restore();
    E.glowDot(c, x0 + 2 * bw + 55, gy - 6 * bh + 45, 200, 'rgba(245,197,66,.5)', roof);
  }
  const fig = { x: 230, y: gy - E.FIG_H * .8 - 2, s: .8, pose: t > 4.9 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.9, 5.2, 'back')) : { ...E.pose('stand'), aF: 1.2 + Math.sin(t * 12) * .5, eF: .4, aB: 1.0 + Math.sin(t * 12) * .5, eB: .4 } };
  E.figure(c, fig);
  if (t < 4.3) { const [hx, hy] = E.hand(fig); E.rrect(c, hx - 4, hy - 14, 40, 22, 3, '#b5653f'); }
} },
] };
