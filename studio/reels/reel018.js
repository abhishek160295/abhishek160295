// Reel 018 — "Old me vs new me"
const { gA, gB } = E.VS;
const REEL = { title: 'Old me vs new me', bpm: 150, pace: 'fast', scenes: [
// 1 — First thing in the morning
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'Old me vs new me: mornings', W / 2, 420, t, -1, 2.5, { size: 48, weight: 800 });
  E.title(c, 'Win the morning, win the day.', W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'OLD ME', 'NEW ME', 2.6);
  // old: in bed, scrolling, phone glow
  E.shaded(c, 380, gA - 76, 420, 40, 10, '#4a4a52', '#26262c'); E.rrect(c, 392, gA - 104, 90, 30, 12, '#cfcfcf'); E.line(c, 390, gA - 36, 390, gA, '#777', 7); E.line(c, 790, gA - 36, 790, gA, '#777', 7);
  E.figure(c, { x: 560, y: gA - 98, s: .9, rot: -Math.PI / 2, color: '#9a9a9a', pose: { ...E.pose('stand'), aF: -2.1, eF: -.6 } });
  E.glowDot(c, 470, gA - 210, 120, 'rgba(120,190,255,.5)'); E.phone(c, 470, gA - 200, 1.7, 1, '#9fd3ff');
  E.text(c, `${7 + Math.floor(t * 9)} min scrolled`, 860, gA - 260, { size: 30, weight: 800, color: RED });
  // new: window light, stretch, water
  const sun = .6 + .4 * Math.sin(t * 2);
  E.glowDot(c, 860, gB - 260, 300, 'rgba(245,197,66,.45)', sun);
  E.shaded(c, 760, gB - 380, 200, 230, 8, '#f8d27a', '#e09a3a', '#ddd'); E.line(c, 860, gB - 380, 860, gB - 150, '#ddd', 5); E.line(c, 760, gB - 265, 960, gB - 265, '#ddd', 5);
  const st = Math.sin(t * 3.4);
  E.figure(c, { x: 400, y: gB - E.FIG_H - 2, color: k > .5 ? GOLD : '#fff', pose: t < 2.6 ? { ...E.pose('cheer'), aF: 2.8 + st * .2, aB: -2.8 + st * .2, tor: st * .12 } : { ...E.pose('stand'), aF: 2.1 + st * .1, eF: 1.9 } });
  if (t > 2.6) { const fig = { x: 400, y: gB - E.FIG_H - 2, pose: { ...E.pose('stand'), aF: 2.1 + st * .1, eF: 1.9 } }; const [hx, hy] = E.hand(fig); E.shaded(c, hx - 16, hy - 50, 32, 56, 6, '#cfe8ff', '#7ab0e0'); }
  E.particles(c, 400, gB - 200, t - 2.6, { n: 40, speed: 460 });
} },
// 2 — When plans fail
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When plans fall apart:', W / 2, 420, t, -1, 2.5, { size: 52, weight: 800 });
  E.title(c, 'Panic vs plan B.', W / 2, 420, t, 2.7, 1e9, { size: 58, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'OLD ME', 'NEW ME', 2.6);
  // old me: pacing under a red scribble storm
  const px = 520 + Math.sin(t * 5) * 120;
  E.figure(c, { x: px, y: gA - E.FIG_H - 2, f: Math.cos(t * 5) > 0 ? 1 : -1, color: '#9a9a9a', pose: { ...E.walk(t * 10, .4), tor: .25, aF: 2.6, eF: .9, aB: -2.6, eB: -.9 } });
  c.save(); c.strokeStyle = RED; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath();
  for (let i = 0; i <= 120; i++) { const u = i / 120, x = px + 120 * Math.sin(2 * Math.PI * 3.1 * u + t * 3) * Math.cos(2 * Math.PI * 1.7 * u), y = gA - 360 + 50 * Math.sin(2 * Math.PI * 4.3 * u + t * 2); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
  // new me: breathe ring, then draw the new route
  const br = .5 + .5 * Math.sin(t * 2.8);
  c.save(); c.strokeStyle = 'rgba(191,232,255,.8)'; c.lineWidth = 6; c.beginPath(); c.arc(420, gB - 170, 120 + br * 50, 0, 7); c.stroke(); c.restore();
  E.text(c, br > .5 ? 'breathe in' : 'breathe out', 240, gB - 340, { size: 28, weight: 800, color: ICE, alpha: 1 - k });
  E.figure(c, { x: 420, y: gB - E.FIG_H - 2, color: k > .5 ? GOLD : '#fff', pose: t < 2.4 ? { ...E.pose('stand'), aF: .6 + br * .3, aB: -.6 - br * .3 } : { ...E.pose('point'), aF: 1.6 } });
  // blocked road vs detour arrow
  E.shaded(c, 640, gB - 120, 90, 120, 6, '#d94a4f', '#7a2226'); E.text(c, '✕', 685, gB - 60, { size: 60, weight: 900, color: '#fff' });
  const ar = E.p(t, 2.4, 3.6, 'out');
  if (ar > 0) { c.save(); c.strokeStyle = GOLD; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); const n = 40; for (let i = 0; i <= n * ar; i++) { const u = i / n, x = 520 + 440 * u, y = gB - 60 - Math.sin(u * Math.PI) * 220; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
    if (ar > .98) { c.save(); c.fillStyle = GOLD; c.beginPath(); c.moveTo(985, gB - 50); c.lineTo(935, gB - 80); c.lineTo(950, gB - 30); c.fill(); c.restore(); }
    E.text(c, 'PLAN B', 740, gB - 320, { size: 34, weight: 900, ls: 3, color: GOLD, alpha: ar }); }
} },
// 3 — Getting rejected
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'Hearing "no":', W / 2, 420, t, -1, 2.5, { size: 58, weight: 900 });
  E.title(c, 'One "no" is not the end.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'OLD ME', 'NEW ME', 2.6);
  // old: curled up while days pass
  E.figure(c, { x: 380, y: gA - E.FIG_H * .9 + 70, s: .9, color: '#8a8a8a', pose: { ...E.pose('crouch'), hd: .7, aF: .3, aB: .2 } });
  E.shaded(c, 700, gA - 300, 200, 220, 14, '#efefef', '#bdbdbd'); c.save(); c.beginPath(); c.roundRect(700, gA - 300, 200, 56, [14, 14, 0, 0]); c.fillStyle = RED; c.fill(); c.restore();
  E.text(c, `DAY ${1 + Math.floor(t * 6)}`, 800, gA - 170, { size: 46, weight: 900, color: '#111' });
  // new: reads NO, crumples it, tosses it, knocks the next door
  const fig = { x: 380, y: gB - E.FIG_H - 2, color: k > .5 ? GOLD : '#fff', pose: t < 1.6 ? { ...E.pose('stand'), aF: 1.4, eF: .6 } : t < 2.3 ? { ...E.pose('stand'), aF: 2.4 - (t - 1.6) * 3, eF: .2 } : E.walk(t * 8) };
  if (t > 2.3) fig.x = E.lerp(380, 700, E.p(t, 2.3, 3.6, 'inOut'));
  if (t > 3.6) fig.pose = { ...E.pose('point'), aF: 1.5 + Math.abs(Math.sin(t * 12)) * .3 };
  E.figure(c, fig);
  const [hx, hy] = E.hand({ x: 380, y: gB - E.FIG_H - 2, pose: { ...E.pose('stand'), aF: 1.4, eF: .6 } });
  if (t < 1.6) { E.shaded(c, hx - 10, hy - 90, 130, 100, 6, '#ffffff', '#d8d8d8'); E.text(c, 'NO', hx + 55, hy - 40, { size: 44, weight: 900, color: RED }); }
  else { const q = E.p(t, 1.6, 2.4, 'in'), bx = E.lerp(hx + 20, 210, q), by = E.lerp(hy - 30, gB - 60, q) - Math.sin(q * Math.PI) * 200; c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.arc(bx, by, E.lerp(40, 22, Math.min(1, (t - 1.6) * 4)), 0, 7); c.fill(); c.restore(); }
  E.shaded(c, 170, gB - 90, 80, 90, 8, '#666', '#333');
  E.shaded(c, 800, gB - 300, 150, 300, 8, '#8a5a3c', '#4a2e1e', '#c49a6c'); c.save(); c.fillStyle = GOLD; c.beginPath(); c.arc(920, gB - 150, 9, 0, 7); c.fill(); c.restore();
  if (t > 3.9) { E.glowDot(c, 875, gB - 150, 260, 'rgba(245,197,66,.5)', E.p(t, 3.9, 4.4)); E.text(c, 'NEXT', 875, gB - 340, { size: 34, weight: 900, ls: 4, color: GOLD }); }
} },
// 4 — Free time
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'Free time:', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Killing time vs using it.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'OLD ME', 'NEW ME', 2.6);
  // old: couch + flickering TV, episode counter
  E.shaded(c, 260, gA - 110, 300, 70, 20, '#5a4a6a', '#2e2438'); E.line(c, 280, gA - 40, 280, gA, '#555', 6); E.line(c, 540, gA - 40, 540, gA, '#555', 6);
  E.figure(c, { x: 400, y: gA - 110 - 66 * .9 + 18, s: .9, color: '#9a9a9a', pose: { ...E.pose('sit'), tor: -.25, hd: .1 } });
  const fl = Math.floor(t * 8) % 3; E.shaded(c, 700, gA - 330, 240, 160, 10, ['#5a7ab0', '#b05a7a', '#5ab08a'][fl], '#1a1a2a', '#ddd'); E.line(c, 820, gA - 170, 820, gA, '#555', 6);
  E.text(c, `Episode ${1 + Math.floor(t * 2.2)}`, 820, gA - 370, { size: 30, weight: 800, color: RED });
  // new: jump rope, rep counter
  const ph = t * 9, up = Math.abs(Math.sin(ph / 2));
  const fig = { x: 380, y: gB - E.FIG_H - 2 - up * 50, color: k > .5 ? GOLD : '#fff', pose: { ...E.pose('stand'), aF: .9, eF: 1.0, aB: -.9, eB: -1.0, kF: up * .5, kB: up * .5, lF: up * .3, lB: -up * .3 } };
  E.figure(c, fig);
  const [ax, ay] = E.hand(fig), [bx2, by2] = E.hand(fig, 'B'), ry = Math.cos(ph) * 1;
  c.save(); c.strokeStyle = '#cfa'; c.lineWidth = 5; c.beginPath(); c.moveTo(bx2, by2); c.quadraticCurveTo(380, ry > 0 ? gB + 20 : fig.y - 260, ax, ay); c.stroke(); c.restore();
  E.text(c, `${Math.floor(t * 9 / Math.PI * 2)} reps`, 820, gB - 280, { size: 40, weight: 900, color: GOLD });
  E.particles(c, 380, gB - 300, t - 2.6, { n: 40, speed: 460 });
} },
// 5 — The glow-up path
{ dur: 5, cam: [100, 860, 960, 1330], draw(c, t) {
  E.title(c, 'Nobody saw the switch.', W / 2, 420, t, -1, 2.5, { size: 54, weight: 900 });
  E.title(c, 'Glow up in silence.', W / 2, 420, t, 2.7, 1e9, { size: 60, weight: 900, color: GOLD });
  const gy = 1300, k = E.p(t, 0, 3.6, 'inOut'), x = E.lerp(170, 880, k);
  E.shaded(c, 120, gy, 820, 26, 6, '#3a3a3a', '#1e1e1e');
  c.save(); const g = c.createLinearGradient(120, 0, 940, 0); g.addColorStop(0, '#555'); g.addColorStop(1, GOLD); c.fillStyle = g; c.fillRect(120, gy, (x - 120), 26); c.restore();
  const icons = [['WATER', 290], ['SLEEP', 450], ['BOOKS', 610], ['GYM', 770]];
  icons.forEach(([lab, ix], i) => { const on = x > ix, a = E.p(x, ix - 20, ix + 30, 'back');
    E.shaded(c, ix - 66, gy - 560, 132, 110, 24, on ? '#ffe08a' : '#3a3a3a', on ? '#c8962a' : '#222'); E.text(c, lab, ix, gy - 505, { size: 28, weight: 900, color: on ? '#111' : '#888' });
    if (on) { E.particles(c, ix, gy - 505, (x - ix) / 300, { n: 18, speed: 300, life: .6, seed: i * 9 }); E.line(c, ix, gy - 450, ix, gy - 390, GOLD, 6); } });
  const col = `rgb(${Math.round(E.lerp(150, 245, k))},${Math.round(E.lerp(150, 197, k))},${Math.round(E.lerp(150, 66, k))})`;
  E.figure(c, { x, y: gy - E.FIG_H * 1.05 - 2, s: 1.05, color: col, pose: k < 1 ? E.walk(x / 24) : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.6, 3.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .25 } });
  E.rays(c, 880, gy - 200, 500, .35 * E.p(t, 3.5, 3.9), GOLD, 16, t * .3);
  E.particles(c, 880, gy - 220, t - 3.6, { n: 60, speed: 620, grav: 250 });
} },
] };
