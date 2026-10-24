// Reel 017 — "2 types of people"
const { gA, gB } = E.VS;
const car = (c, x, gy, col, t, shake = 0) => {
  c.save(); c.translate(x + Math.sin(t * 50) * shake, gy);
  E.shaded(c, -170, -120, 340, 90, 26, col, '#5a1418');
  c.fillStyle = col; c.beginPath(); c.moveTo(-90, -118); c.lineTo(-50, -180); c.lineTo(70, -180); c.lineTo(110, -118); c.fill();
  c.fillStyle = '#9fd3ff'; c.beginPath(); c.moveTo(-72, -120); c.lineTo(-42, -166); c.lineTo(8, -166); c.lineTo(8, -120); c.fill(); c.beginPath(); c.moveTo(22, -120); c.lineTo(22, -166); c.lineTo(62, -166); c.lineTo(92, -120); c.fill();
  c.fillStyle = '#1a1a1a'; [-100, 100].forEach(dx => { c.beginPath(); c.arc(dx, -28, 30, 0, 7); c.fill(); }); c.fillStyle = '#777'; [-100, 100].forEach(dx => { c.beginPath(); c.arc(dx, -28, 12, 0, 7); c.fill(); });
  c.restore();
};
const REEL = { title: '2 types of people', bpm: 150, pace: 'fast', scenes: [
// 1 — When it rains
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, '2 types of people when it rains:', W / 2, 420, t, -1, 2.5, { size: 46, weight: 800 });
  E.title(c, 'Same rain. Different mindset.', W / 2, 420, t, 2.7, 1e9, { size: 50, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'TYPE 1', 'TYPE 2', 2.6);
  [[gA, 640], [gB, 640]].forEach(([g, x], r) => {
    E.cloud(c, x, g - 300, .85, 1, r ? '#4f4f4f' : '#3d3d3d');
    for (let i = 0; i < 26; i++) { const rx = x - 140 + E.rnd(i + r * 50) * 280, q = ((t * 1.8 + E.rnd(i + 9 + r)) % 1); E.line(c, rx, g - 260 + q * 240, rx - 6, g - 232 + q * 240, 'rgba(170,200,230,.75)', 4); }
  });
  E.figure(c, { x: 640, y: gA - E.FIG_H - 2, color: '#9a9a9a', pose: { ...E.pose('sad'), aF: .2 + Math.abs(Math.sin(t * 3)) * .4 } });
  E.bubble(c, 'Ugh. Ruined.', 380, gA - 210, E.p(t, .3, .55, 'back'), { size: 32 });
  const d = Math.sin(t * 7);
  E.figure(c, { x: 640 + Math.sin(t * 3.5) * 60, y: gB - E.FIG_H - 2 - Math.abs(d) * 30, color: k > .5 ? GOLD : '#fff', pose: { ...E.pose('cheer'), aF: 2.6 + d * .4, aB: -2.6 + d * .4, lF: .3 + d * .3, lB: -.3 + d * .3, kF: .4, kB: .4 } });
  E.particles(c, 640, gB - 6, (t * 2) % 1, { n: 16, speed: 260, color: ICE, grav: 900, life: .5, seed: Math.floor(t * 2) });
  E.particles(c, 640, gB - 200, t - 2.6, { n: 50, speed: 560 });
} },
// 2 — When someone else wins
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When someone else wins:', W / 2, 420, t, -1, 2.5, { size: 50, weight: 800 });
  E.title(c, 'One gets bitter. One gets better.', W / 2, 420, t, 2.7, 1e9, { size: 46, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'TYPE 1', 'TYPE 2', 2.6);
  [gA, gB].forEach(g => { E.shaded(c, 760, g - 110, 160, 110, 8, '#d9d9d9', '#8a8a8a'); E.figure(c, { x: 840, y: g - 110 - E.FIG_H * .85 - 2, s: .85, color: '#cfcfcf', pose: { ...E.pose('cheer'), aF: 2.6 + Math.sin(t * 6) * .2 } }); E.trophy(c, 900, g - 330, .8, 1, 0); });
  // bitter
  E.figure(c, { x: 450, y: gA - E.FIG_H - 2, color: '#8a8a8a', pose: { ...E.pose('arms'), hd: .25 + Math.sin(t * 2) * .05, tor: -.08 } });
  E.bubble(c, 'Just lucky.', 300, gA - 260, E.p(t, .4, .65, 'back'), { size: 32, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f' });
  // better: claps, then gets an idea and starts training
  const clap = Math.sin(t * 14) > 0;
  const fig = { x: 450, y: gB - E.FIG_H - 2, color: k > .5 ? GOLD : '#fff', pose: t < 2.6 ? { ...E.pose('stand'), aF: clap ? 1.5 : 1.1, eF: clap ? .7 : .2, aB: clap ? 1.5 : 1.1, eB: clap ? .7 : .2 } : E.run(t * 14) };
  E.figure(c, fig);
  if (t > 2.6) { const [hx, hy] = E.headPos(fig); E.glowDot(c, hx + 90, hy - 40, 110, 'rgba(245,197,66,.8)', k); c.save(); c.globalAlpha = k; c.fillStyle = GOLD; c.beginPath(); c.arc(hx + 90, hy - 40, 28, 0, 7); c.fill(); c.fillRect(hx + 77, hy - 14, 26, 16); c.restore(); }
  E.particles(c, 840, gB - 300, t - 2.6, { n: 40, speed: 480 });
} },
// 3 — Stuck in traffic
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'Stuck in traffic:', W / 2, 420, t, -1, 2.5, { size: 54, weight: 800 });
  E.title(c, 'Same wait. Different use.', W / 2, 420, t, 2.7, 1e9, { size: 52, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'TYPE 1', 'TYPE 2', 2.6);
  car(c, 580, gA, '#c8363c', t, Math.sin(t * 9) > .3 ? 4 : 0);
  car(c, 580, gB, '#3a6ea8', t, 0);
  [gA, gB].forEach(g => { E.shaded(c, 820, g - 120, 150, 90, 20, '#555', '#2a2a2a'); E.shaded(c, 230, g - 120, 150, 90, 20, '#555', '#2a2a2a'); });
  // angry honking driver
  const bob = Math.abs(Math.sin(t * 12)) * 8; c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.arc(548, gA - 146 - bob, 18, 0, 7); c.fill(); c.restore(); E.line(c, 556, gA - 128, 600, gA - 128 + Math.sin(t * 24) * 6, '#ddd', 6);
  for (let i = 0; i < 3; i++) { const q = ((t * 1.6 + i / 3) % 1); E.text(c, i % 2 ? '!!' : 'HONK', 720 + q * 160, gA - 230 - q * 70, { size: 36 + i * 4, weight: 900, color: RED, alpha: 1 - q }); }
  // learning driver: headphones + sound waves + a progress bar filling
  c.save(); c.fillStyle = k > .5 ? GOLD : '#fff'; c.beginPath(); c.arc(548 + Math.sin(t * 4) * 3, gB - 146, 18, 0, 7); c.fill(); c.strokeStyle = '#111'; c.lineWidth = 5; c.beginPath(); c.arc(548 + Math.sin(t * 4) * 3, gB - 148, 22, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.restore();
  c.save(); c.strokeStyle = GOLD; c.lineWidth = 5; for (let i = 0; i < 3; i++) { const q = ((t * 1.2 + i / 3) % 1); c.globalAlpha = 1 - q; c.beginPath(); c.arc(570, gB - 150, 30 + q * 70, -0.8, .8); c.stroke(); } c.restore();
  const lp = E.p(t, .2, 4.4, 'lin');
  E.rrect(c, 720, gB - 300, 260, 26, 13, '#222', '#777', 3); E.rrect(c, 724, gB - 296, 252 * lp, 18, 9, GOLD);
  E.text(c, `Lesson ${1 + Math.floor(lp * 11)}`, 850, gB - 340, { size: 30, weight: 800, color: GOLD });
} },
// 4 — When they fail
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When their plan falls apart:', W / 2, 420, t, -1, 2.5, { size: 48, weight: 800 });
  E.title(c, 'One quits. One builds higher.', W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'TYPE 1', 'TYPE 2', 2.6);
  E.shake(c, t, .5, .35, 10);
  // both towers collapse at 0.5s
  [gA, gB].forEach((g, r) => {
    for (let i = 0; i < 5; i++) { const fall = E.p(t, .5 + i * .05, 1.1 + i * .05, 'in'); const bx = 640 + (i % 2 ? 1 : -1) * fall * (60 + i * 40), by = g - 70 - i * 70 + fall * (i * 70); c.save(); c.translate(bx, by); c.rotate(fall * (i % 2 ? 1.2 : -1.2)); E.shaded(c, -60, -34, 120, 68, 8, '#9a9a9a', '#5a5a5a'); c.restore(); }
  });
  E.figure(c, { x: 360, y: gA - E.FIG_H - 2, color: '#888', f: t > 2.2 ? -1 : 1, pose: t < 1.3 ? E.pose('stand') : t < 2.2 ? E.pose('sad') : E.walk(t * 6) , x: t > 2.2 ? E.lerp(360, 250, E.p(t, 2.2, 5)) : 360 });
  if (t > 2.2) E.text(c, 'I QUIT', E.lerp(380, 270, E.p(t, 2.2, 5)), gA - 300, { size: 30, weight: 900, ls: 3, color: RED });
  // rebuilder: new gold tower, taller than before
  const n = Math.floor(E.p(t, 1.4, 4.2, 'lin') * 7);
  for (let i = 0; i < n; i++) { const pop = E.p(t, 1.4 + i * .4, 1.6 + i * .4, 'back'); c.save(); c.translate(820, gB - 32 - i * 50); c.scale(pop, pop); E.shaded(c, -55, -24, 110, 48, 8, i === 6 ? '#ffe08a' : '#f5c542', '#b58a1f'); c.restore(); }
  E.figure(c, { x: 680, y: gB - E.FIG_H - 2, color: k > .5 ? GOLD : '#fff', pose: t < 1.3 ? E.pose('stand') : { ...E.pose('stand'), aF: 1.4 + Math.sin(t * 9) * .6, eF: .4, aB: 1.2 + Math.sin(t * 9) * .6, eB: .4 } });
  E.particles(c, 820, gB - 360, t - 4.2, { n: 40, speed: 480 });
} },
// 5 — One step to switch
{ dur: 5, cam: [160, 820, 920, 1330], draw(c, t) {
  E.title(c, 'Which one are you?', W / 2, 420, t, -1, 2.5, { size: 58, weight: 900 });
  E.title(c, 'Switching takes one step.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const gy = 1300, step = E.p(t, 1.6, 2.6, 'inOut');
  E.shaded(c, 160, gy, 380, 34, 4, '#3a3a3a', '#1e1e1e'); E.shaded(c, 540, gy, 380, 34, 4, '#f5c542', '#a8801c');
  E.glowDot(c, 730, gy - 200, 400, 'rgba(245,197,66,.3)', .3 + .7 * step);
  E.line(c, 540, gy - 380, 540, gy, '#666', 4);
  E.text(c, 'TYPE 1', 350, gy + 70, { size: 30, weight: 900, ls: 4, color: GREY }); E.text(c, 'TYPE 2', 730, gy + 70, { size: 30, weight: 900, ls: 4, color: GOLD });
  const x = t < 1.6 ? E.lerp(260, 430, E.p(t, 0, 1.4, 'out')) : t < 2.6 ? E.lerp(430, 660, step) : 660;
  const y = gy - E.FIG_H * 1.1 - 2 - (t >= 1.6 && t < 2.6 ? Math.sin(step * Math.PI) * 120 : 0);
  E.figure(c, { x, y, s: 1.1, color: t < 2.1 ? '#9a9a9a' : GOLD, pose: t < 1.6 ? E.walk(x / 24) : t < 2.6 ? E.pose('jump') : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.6, 2.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .25 } });
  E.rays(c, 660, gy - 200, 520, .35 * E.p(t, 2.5, 2.9), GOLD, 16, t * .3);
  E.particles(c, 660, gy - 180, t - 2.6, { n: 70, speed: 700, grav: 250 });
  E.flash(c, t, 2.6, .3, '245,197,66', .35);
} },
] };
