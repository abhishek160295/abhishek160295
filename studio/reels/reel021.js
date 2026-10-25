// Reel 021 — "Comfort will cost you"
const lab = (c, str, x, y, col = '#bbb') => E.text(c, str, x, y, { size: 30, weight: 900, ls: 5, color: col });
const bird = (c, x, y, s, t, flap = 1, col = GOLD) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 34, 20, 0, 0, 7); c.fill(); c.beginPath(); c.arc(30, -12, 14, 0, 7); c.fill(); c.fillStyle = '#e8a92a'; c.beginPath(); c.moveTo(42, -14); c.lineTo(58, -8); c.lineTo(42, -4); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(34, -15, 3, 0, 7); c.fill(); const w = Math.sin(t * 22) * flap; c.fillStyle = col; c.beginPath(); c.moveTo(-6, -6); c.lineTo(-30, -6 - 46 * (.4 + .6 * w)); c.lineTo(14, -8); c.fill(); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-56, -10); c.lineTo(-52, 10); c.fill(); c.restore(); };
const REEL = { title: 'Comfort will cost you', bpm: 150, pace: 'fast', scenes: [
// 1 — Comfort is quicksand
{ dur: 5, floor: 1300, cam: [120, 760, 960, 1330], draw(c, t) {
  E.title(c, 'Comfort feels safe.', W / 2, 420, t, -1, 2.5, { size: 58, weight: 900 });
  E.title(c, 'Comfort is quicksand.', W / 2, 420, t, 2.7, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1300, sink = E.p(t, .4, 4.4, 'in');
  lab(c, 'COMFORT', 310, gy + 60, '#888'); lab(c, 'GROWTH', 720, gy + 60, GOLD);
  // the couch sinks, taking you with it
  c.save(); c.beginPath(); c.rect(80, 600, 460, gy - 600); c.clip();
  c.translate(0, sink * 240);
  E.shaded(c, 160, gy - 150, 300, 90, 20, '#7a5a9a', '#3e2c52'); E.shaded(c, 140, gy - 230, 60, 170, 18, '#6a4a8a', '#3e2c52'); E.shaded(c, 420, gy - 230, 60, 170, 18, '#6a4a8a', '#3e2c52');
  const relax = Math.sin(t * 2) * .05;
  E.figure(c, { x: 300, y: gy - 150 - 66 * .9 + 18, s: .9, color: '#aaa', pose: { ...E.pose('sit'), tor: -.25 + relax, hd: .1, aF: sink > .7 ? 2.8 + Math.sin(t * 14) * .2 : .4, eF: .2 } });
  c.restore();
  for (let i = 0; i < 3; i++) { const q = ((t * .8 + i / 3) % 1); c.save(); c.strokeStyle = `rgba(160,140,110,${.6 * (1 - q)})`; c.lineWidth = 5; c.beginPath(); c.ellipse(310, gy + 6, 120 + q * 120, 14 + q * 10, 0, 0, 7); c.stroke(); c.restore(); }
  c.save(); c.fillStyle = '#5a4a36'; c.fillRect(100, gy, 420, 26); c.restore();
  E.particles(c, 310, gy, (t * 2) % 1 * .5, { n: 22, speed: 260, color: '#a08a60', grav: 700, life: .5, seed: Math.floor(t * 2) });
  // the climb
  [[600, 90], [700, 170], [800, 250]].forEach(([x, h], i) => E.shaded(c, x - 50, gy - h, 110, h, 10, '#8a8a8a', '#3e3e3e'));
  E.glowDot(c, 820, gy - 340, 300, 'rgba(245,197,66,.4)', E.p(t, 2.4, 3.0));
  const k = E.p(t, .4, 3.4, 'inOut'), step = Math.min(2, Math.floor(k * 3)), cx = 600 + step * 100, cy = gy - 90 - step * 80;
  E.figure(c, { x: cx, y: cy - E.FIG_H * .8 - 2 - (k < 1 ? Math.abs(Math.sin(k * 3 * Math.PI)) * 50 : 0), s: .8, color: t > 2.6 ? GOLD : '#fff', pose: k < 1 ? E.pose('climb') : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.4, 3.7, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 } });
  E.particles(c, 800, gy - 340, t - 3.4, { n: 50, speed: 520 });
} },
// 2 — Choose your hard
{ dur: 5, floor: 1300, cam: [100, 780, 980, 1320], draw(c, t) {
  E.title(c, 'Easy road or hard road?', W / 2, 420, t, -1, 2.5, { size: 54, weight: 900 });
  E.title(c, 'Choose your hard.', W / 2, 420, t, 2.7, 1e9, { size: 64, weight: 900, color: GOLD });
  const gy = 1300, fx = 540;
  // easy road: smooth, downhill into fog
  c.save(); c.fillStyle = '#6a6a74'; c.beginPath(); c.moveTo(fx - 40, gy); c.lineTo(fx - 120, gy); c.lineTo(120, gy - 90); c.lineTo(220, gy - 120); c.fill(); c.restore();
  const fog = c.createRadialGradient(150, gy - 110, 10, 150, gy - 110, 170); fog.addColorStop(0, 'rgba(0,0,0,.95)'); fog.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = fog; c.fillRect(-100, gy - 400, 560, 500);
  E.tag(c, 'EASY', 330, gy - 230, t, -1, { size: 28, color: '#aaa' });
  // hard road: rocky switchbacks up to the light
  const path = [[fx + 40, gy], [700, gy - 90], [620, gy - 170], [780, gy - 260], [700, gy - 340], [880, gy - 420]];
  c.save(); c.strokeStyle = '#8a7a6a'; c.lineWidth = 52; c.lineJoin = 'round'; c.beginPath(); path.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
  for (let i = 0; i < 12; i++) E.glowDot(c, path[1 + i % 5][0] + Math.sin(i) * 20, path[1 + i % 5][1] + 10, 10, 'rgba(160,150,140,.9)');
  E.glowDot(c, 900, gy - 470, 320, 'rgba(245,197,66,.5)', .5 + .5 * E.p(t, 2.2, 3));
  c.save(); c.fillStyle = GOLD; c.beginPath(); c.arc(920, gy - 500, 46, 0, 7); c.fill(); c.restore();
  E.tag(c, 'HARD', 800, gy - 200, t, -1, { size: 28, color: GOLD, fill: '#2a2208' });
  // someone takes the easy road and disappears
  const ek = E.p(t, .5, 2.6, 'in'), ex = E.lerp(fx - 80, 170, ek), ey = E.lerp(gy, gy - 110, ek);
  E.figure(c, { x: ex, y: ey - E.FIG_H * .8 - 2, s: .8, f: -1, color: '#888', alpha: 1 - E.p(t, 2.0, 2.6), pose: E.walk(t * 10) });
  // you take the hard one
  const hk = E.p(t, .9, 4.2, 'inOut'), seg = hk * 5, si = Math.min(4, Math.floor(seg)), sf = seg - si;
  const [ax, ay] = path[si], [bx, by] = path[si + 1], hx = t < .9 ? fx : E.lerp(ax, bx, sf), hy = t < .9 ? gy : E.lerp(ay, by, sf);
  E.figure(c, { x: hx, y: hy - E.FIG_H * .8 - 2, s: .8, f: bx >= ax ? 1 : -1, color: t > 2.6 ? GOLD : '#fff', pose: t < .9 ? { ...E.pose('stand'), hd: Math.sin(t * 6) * .3 } : hk < 1 ? { ...E.walk(t * 10, .4), tor: .3 } : { ...E.pose('cheer'), aF: 2.6 + Math.sin(t * 6) * .2 } });
  if (t > .9 && hk < 1) E.particles(c, hx, hy, (t * 3) % 1 * .33, { n: 12, speed: 200, color: '#a89a8a', grav: 500, life: .33, seed: Math.floor(t * 3) });
  E.particles(c, 880, gy - 470, t - 4.2, { n: 50, speed: 520 });
} },
// 3 — Sharpen before you need it
{ dur: 5, floor: 1300, cam: [120, 780, 960, 1320], draw(c, t) {
  E.title(c, 'The test always comes.', W / 2, 420, t, -1, 2.5, { size: 54, weight: 900 });
  E.title(c, 'Sharpen before you need it.', W / 2, 420, t, 2.7, 1e9, { size: 50, weight: 900, color: GOLD });
  const gy = 1300, rust = E.p(t, .2, 2.4), test = t > 2.6;
  E.tag(c, `DAY ${Math.max(1, Math.round(100 * E.p(t, .1, 2.4)))}`, 540, 840, t, -1, { size: 30 });
  // left: rests while the blade rusts
  const lf = { x: 250, y: gy - 70 - 66 * .85 + 4, s: .85, color: '#999', pose: test ? { ...E.pose('stand'), aF: 1.6, eF: .1 } : { ...E.pose('sit'), aF: .9, eF: .5 } };
  if (test) lf.y = gy - E.FIG_H * .85 - 2; else E.rrect(c, 190, gy - 70, 130, 14, 4, '#555');
  E.figure(c, lf);
  const [lx, ly] = E.hand(lf);
  const rcol = `rgb(${Math.round(E.lerp(220, 150, rust))},${Math.round(E.lerp(220, 90, rust))},${Math.round(E.lerp(230, 50, rust))})`;
  c.save(); c.translate(lx, ly); c.rotate(test ? -.2 + (t > 3.0 ? Math.sin(t * 30) * .2 : 0) : -.9); E.line(c, 0, 0, 170, 0, rcol, 12); E.line(c, -20, -16, -20, 16, '#8a6a3a', 8); c.restore();
  // right: grinds every day (sparks)
  const rf = { x: 660, y: gy - E.FIG_H * .9 - 2, s: .9, color: t > 2.6 ? GOLD : '#fff', pose: test ? { ...E.pose('stand'), aF: E.lerp(2.6, .9, E.p(t, 2.9, 3.1)), eF: .1 } : { ...E.pose('stand'), tor: .3, aF: 1.3 + Math.sin(t * 18) * .15, eF: .3 } };
  E.figure(c, rf);
  const [rx, ry] = E.hand(rf);
  if (!test) { c.save(); c.translate(800, gy - 120); c.rotate(t * 12); c.fillStyle = '#777'; c.beginPath(); c.arc(0, 0, 70, 0, 7); c.fill(); c.strokeStyle = '#555'; c.lineWidth = 6; c.beginPath(); c.moveTo(-70, 0); c.lineTo(70, 0); c.stroke(); c.restore(); E.particles(c, 770, gy - 170, (t * 4) % 1 * .25, { n: 30, speed: 560, color: GOLD, grav: 500, life: .25, seed: Math.floor(t * 4) }); }
  c.save(); c.translate(rx, ry); c.rotate(test ? E.lerp(-1.4, .6, E.p(t, 2.9, 3.1)) : -.1); E.line(c, 0, 0, 170, 0, '#f2f2f2', 12); E.line(c, -20, -16, -20, 16, '#8a6a3a', 8); c.restore();
  // the test: a log drops in front of both
  if (test) { const d = E.p(t, 2.6, 2.85, 'in'), cut = E.p(t, 3.05, 3.5, 'out');
    E.shaded(c, 330, E.lerp(700, gy - 70, d), 200, 70, 30, '#a0703e', '#5a3a1e');
    E.shaded(c, 740 - cut * 40, E.lerp(700, gy - 70, d) + cut * 30, 90, 70, 30, '#a0703e', '#5a3a1e'); E.shaded(c, 840 + cut * 40, E.lerp(700, gy - 70, d) + cut * 30, 90, 70, 30, '#a0703e', '#5a3a1e');
    if (t > 3.0 && t < 3.2) { c.save(); c.strokeStyle = '#fff'; c.lineWidth = 10; c.beginPath(); c.moveTo(740, gy - 220); c.lineTo(940, gy); c.stroke(); c.restore(); }
    if (t > 3.0) E.tag(c, 'CLANG', 430, gy - 200, t, 3.0, { size: 26, color: RED, fill: '#2a0d0f' }); }
  E.flash(c, t, 3.05, .3, '255,255,255', .5);
  E.particles(c, 830, gy - 60, t - 3.05, { n: 80, speed: 700 });
} },
// 4 — Ships aren't built for the harbor
{ dur: 5, floor: 1300, cam: [100, 760, 980, 1330], draw(c, t) {
  E.title(c, 'Ships are safe in the harbor.', W / 2, 420, t, -1, 2.5, { size: 50, weight: 900 });
  E.title(c, "That's not what ships are for.", W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const sea = 1180;
  c.save(); const g = c.createLinearGradient(0, sea, 0, 1340); g.addColorStop(0, '#2a5a88'); g.addColorStop(1, '#0c1e30'); c.fillStyle = g; c.beginPath(); c.moveTo(100, sea);
  for (let x = 100; x <= 980; x += 20) c.lineTo(x, sea + Math.sin(x / 50 + t * 5) * (x > 520 ? 26 : 5)); c.lineTo(980, 1340); c.lineTo(100, 1340); c.fill(); c.restore();
  const boat = (x, y, rot, col, sail, a = 1) => { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath(); c.moveTo(-90, -10); c.lineTo(90, -10); c.lineTo(60, 34); c.lineTo(-60, 34); c.fill(); E.line(c, 0, -10, 0, -170, '#ddd', 6); if (sail) { c.fillStyle = sail; c.beginPath(); c.moveTo(6, -165); c.quadraticCurveTo(90, -100, 6, -24); c.fill(); } c.restore(); };
  // harbor: tied up, gathering moss
  E.shaded(c, 100, sea - 30, 180, 40, 4, '#8a6a4a', '#4a3a2a'); E.line(c, 270, sea - 20, 330, sea - 4, '#c8a46a', 4);
  boat(360, sea, Math.sin(t * 2) * .02, `rgb(${Math.round(E.lerp(160, 90, E.p(t, 0, 2.5)))},${Math.round(E.lerp(160, 110, E.p(t, 0, 2.5)))},${Math.round(E.lerp(160, 80, E.p(t, 0, 2.5)))})`, null);
  E.tag(c, 'SAFE', 360, sea - 230, t, -1, { size: 26, color: '#aaa' });
  // open sea: waves, then the island
  const k = E.p(t, .2, 4.0, 'inOut'), bx = E.lerp(560, 740, k), roll = Math.sin(t * 5) * .14 * (1 - E.p(t, 3.4, 4));
  const island = E.p(t, 2.4, 3.2, 'out');
  if (island > 0) { c.save(); c.fillStyle = '#c9a66b'; c.beginPath(); c.ellipse(850, sea + 10, 100 * island, 36 * island, 0, Math.PI, 0); c.fill(); c.restore(); E.glowDot(c, 850, sea - 60, 300, 'rgba(245,197,66,.5)', island); E.line(c, 860, sea - 30, 880, sea - 170 * island, '#8a6a3a', 8); c.save(); c.fillStyle = GREEN; c.beginPath(); c.ellipse(880, sea - 170 * island, 60 * island, 20 * island, .3, 0, 7); c.fill(); c.restore(); }
  E.particles(c, bx + 80, sea, (t * 2.5) % 1 * .4, { n: 18, speed: 300, color: '#cfe8ff', grav: 700, life: .4, seed: Math.floor(t * 2.5) });
  boat(bx, sea + Math.sin(t * 5) * 22, roll * 1.4, '#d9d9d9', t > 2.6 ? GOLD : '#f2f2f2');
  for (let i = 0; i < 6; i++) { const q = ((t * 1.3 + i / 6) % 1); E.glowDot(c, bx - 100 - q * 160, sea - 10 + Math.sin(i) * 8, 14, 'rgba(255,255,255,.7)', 1 - q); }
  E.particles(c, 820, sea - 100, t - 4.0, { n: 50, speed: 500 });
} },
// 5 — The door was never locked
{ dur: 5, floor: 1300, cam: [180, 640, 900, 1320], draw(c, t) {
  E.title(c, 'Feeling stuck?', W / 2, 420, t, -1, 2.5, { size: 62, weight: 900 });
  E.title(c, 'The door was never locked.', W / 2, 420, t, 2.7, 1e9, { size: 52, weight: 900, color: GOLD });
  const cx = 420, top = 860, bot = 1240, w = 300;
  E.shaded(c, cx - w / 2 - 20, bot, w + 40, 26, 6, '#9a9a9a', '#4a4a4a');
  c.save(); c.strokeStyle = '#bbb'; c.lineWidth = 10; for (let i = 0; i <= 8; i++) { const x = cx - w / 2 + i * w / 8; c.beginPath(); c.moveTo(x, bot); c.lineTo(x, top + 40); c.stroke(); } c.beginPath(); c.arc(cx, top + 40, w / 2, Math.PI, 0); c.stroke(); c.restore();
  E.tag(c, 'COMFORT ZONE', cx, bot + 70, t, -1, { size: 26 });
  // the door: swings open, padlock hanging open
  const open = E.p(t, .4, 1.0, 'out');
  c.save(); c.translate(cx + w / 2, bot - 220); c.scale(Math.cos(open * 1.3), 1); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, 110, 200); c.strokeStyle = '#ddd'; c.lineWidth = 6; c.strokeRect(0, 0, 110, 200); for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(i * 27, 0); c.lineTo(i * 27, 200); c.stroke(); } c.restore();
  c.save(); c.translate(cx + w / 2 + 6, bot - 120); c.rotate(Math.sin(t * 4) * .3); E.shaded(c, -16, 10, 32, 30, 6, '#d9b04a', '#8a6a1e'); c.strokeStyle = '#d9b04a'; c.lineWidth = 6; c.beginPath(); c.arc(-4, 10, 12, Math.PI, Math.PI * 1.9); c.stroke(); c.restore();
  if (t > .9 && t < 1.8) E.tag(c, 'UNLOCKED', cx + w / 2 + 110, bot - 260, t, .9, { size: 24, color: GOLD, fill: '#2a2208' });
  // the bird hesitates, steps to the door, then flies
  let x, y, flap = .2;
  if (t < 1.4) { x = cx - 60 + Math.sin(t * 4) * 60; y = bot - 40 - Math.abs(Math.sin(t * 8)) * 30; }
  else if (t < 2.5) { const k = E.p(t, 1.4, 2.4, 'inOut'); x = E.lerp(cx - 60, cx + w / 2 + 40, k); y = bot - 40 - Math.abs(Math.sin(t * 8)) * 18; }
  else { const k = E.p(t, 2.5, 4.6, 'out'); x = E.lerp(cx + w / 2 + 40, 860, k); y = E.lerp(bot - 40, 700, k) + Math.sin(k * 10) * 30; flap = 1; }
  if (t > 2.5) for (let i = 1; i < 16; i++) { const kk = Math.max(0, E.p(t - i * .05, 2.5, 4.6, 'out')); E.glowDot(c, E.lerp(cx + w / 2 + 40, 860, kk), E.lerp(bot - 40, 700, kk) + Math.sin(kk * 10) * 30, 16, 'rgba(245,197,66,.85)', 1 - i / 16); }
  bird(c, x, y, t > 2.5 ? 1.5 : 1.1, t, flap, t > 2.5 ? GOLD : '#cfcfcf');
  E.rays(c, 860, 700, 520, .3 * E.p(t, 3.4, 4.0), GOLD, 16, t * .5);
  for (let i = 0; i < 6; i++) { const q = ((t * .5 + i / 6) % 1); c.save(); c.translate(260 + i * 90 + Math.sin(q * 8 + i) * 30, 700 + q * 560); c.rotate(Math.sin(q * 6 + i)); c.fillStyle = 'rgba(230,230,230,.8)'; c.beginPath(); c.ellipse(0, 0, 6, 16, 0, 0, 7); c.fill(); c.restore(); }
  E.particles(c, 860, 700, t - 4.4, { n: 50, speed: 520 });
} },
] };
