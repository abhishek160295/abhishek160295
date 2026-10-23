// Reel 011 — "Your brain at 2 AM"
const REEL = { title: 'Your brain at 2 AM', bpm: 150, scenes: [
// 1 — 2 AM thoughts
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Your brain at 2 AM:', W / 2, 420, t, -1, 3.1, { size: 58, weight: 900 });
  E.title(c, "Thoughts aren't facts.", W / 2, 420, t, 3.3, 1e9, { size: 56, weight: 900, color: GOLD });
  E.title(c, 'Let them go.', W / 2, 495, t, 4.6, 1e9, { size: 46, weight: 700 });
  const gy = 1320, bx = 380;
  E.clock(c, 540, 630, '2:00 AM', '#fff', false, t, 1.1);
  const thoughts = [['That thing you said in 2014', 330, 760, .3], ['What if it all goes wrong?', 720, 850, .8], ['Are they mad at me?', 330, 940, 1.3], ['Am I behind in life?', 740, 1030, 1.8]];
  thoughts.forEach(([str, x, y, t0], i) => {
    const pop = 3.4 + i * .3, a = E.p(t, t0, t0 + .25, 'back') * (1 - E.p(t, pop, pop + .12));
    E.bubble(c, str, x + Math.sin(t * 5 + i) * 4, y, a, { size: 28, stroke: '#888' });
    E.particles(c, x, y, t - pop, { n: 18, speed: 300, color: '#bbb', life: .7, seed: i * 7 });
  });
  E.ground(c, gy, 90, 990); E.bed(c, bx, gy);
  const sit = E.p(t, 3.0, 3.3) * (1 - E.p(t, 4.6, 5.0));
  const pose = sit > .5 ? { tor: 0, hd: -.3, aB: .2, eB: .3, aF: 2.1, eF: 0, lB: 1.57, kB: 0, lF: 1.57, kF: 0 } : E.pose('stand');
  E.figure(c, { x: bx + (sit > .5 ? 70 : 180), y: sit > .5 ? gy - 76 : gy - 92, s: .8, rot: sit > .5 ? 0 : -Math.PI / 2, pose });
  if (t > 4.8) for (let i = 0; i < 3; i++) { const k = ((t - 4.8 + i * .5) % 1.5) / 1.5; E.text(c, 'z', bx + 60 + k * 70 + i * 10, gy - 150 - k * 120, { size: 30 + i * 8, weight: 800, color: '#888', alpha: Math.sin(k * Math.PI) }); }
} },
// 2 — The "what if" backpack
{ dur: 6.4, draw(c, t) {
  E.title(c, "Carrying every 'what if'?", W / 2, 420, t, -1, 3.1, { size: 52, weight: 800 });
  E.title(c, 'Most of what you fear', W / 2, 420, t, 3.3, 1e9, { size: 52, weight: 800 });
  E.title(c, 'never happens.', W / 2, 495, t, 3.6, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1320, s = .9, burst = 3.0;
  E.ground(c, gy, 90, 990);
  const grow = E.p(t, 0, 2.8, 'in'), r = E.lerp(60, 230, grow);
  const slow = E.p(t, 0, 2.6, 'out');
  let x = E.lerp(160, 470, slow), pose = E.mix(E.walk(x / 24, .3), E.pose('crouch'), grow * .85);
  if (t >= burst) { const k = E.p(t, 3.4, 5.6, 'inOut'); x = E.lerp(470, 880, k); pose = k > 0 && k < 1 ? E.walk(x / 22) : E.mix(E.pose('crouch'), E.pose('stand'), E.p(t, burst, 3.3)); }
  const fig = { x, y: gy - E.FIG_H * s - 2 + (t < burst ? grow * 30 : 0), s, pose, glow: t > 3.4 ? 10 : 0 };
  if (t < burst) {
    const bxp = x - 40 - r * .7, byp = fig.y - 60 - r * .4 + 40;
    c.save(); c.fillStyle = '#2b2b2b'; c.strokeStyle = '#888'; c.lineWidth = 5; c.beginPath(); c.arc(bxp, byp, r, 0, 7); c.fill(); c.stroke(); c.restore();
    E.line(c, x - 10, fig.y - 70, bxp + r * .6, byp - r * .4, '#888', 5);
    E.text(c, 'WHAT IF', bxp, byp, { size: 24 + r * .14, weight: 900, ls: 2, color: '#ccc' });
  }
  E.figure(c, fig);
  E.particles(c, 270, 900, t - burst, { n: 40, speed: 700, color: '#999', grav: 200 });
  E.text(c, '(it was empty)', 300, 860, { size: 34, weight: 700, color: GREY, alpha: E.p(t, 3.2, 3.5) * (1 - E.p(t, 5.2, 5.6)) });
} },
// 3 — Recharge yourself
{ dur: 6.4, draw(c, t) {
  E.title(c, 'You charge your phone every night.', W / 2, 420, t, -1, 2.5, { size: 44, weight: 800 });
  E.title(c, 'When did you recharge yourself?', W / 2, 420, t, 2.7, 4.4, { size: 46, weight: 800 });
  E.title(c, 'Rest is productive.', W / 2, 420, t, 4.6, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1320;
  E.ground(c, gy, 90, 990);
  // table + phone charging
  E.rrect(c, 160, gy - 160, 240, 16, 4, '#9a6b4a'); E.line(c, 180, gy - 144, 180, gy, '#9a6b4a', 7); E.line(c, 380, gy - 144, 380, gy, '#9a6b4a', 7);
  E.rrect(c, 230, gy - 330, 100, 170, 14, '#111', '#ddd', 5);
  const pc = E.p(t, .2, 2.4, 'out'), pcol = pc < .3 ? RED : pc < .8 ? '#e5c547' : GREEN;
  E.rrect(c, 250, gy - 190 - 120 * pc, 60, 120 * Math.max(.03, pc), 6, pcol);
  E.text(c, Math.max(1, Math.round(pc * 100)) + '%', 280, gy - 370, { size: 32, weight: 900, color: pcol });
  c.save(); c.strokeStyle = '#777'; c.lineWidth = 4; c.beginPath(); c.moveTo(280, gy - 160); c.bezierCurveTo(280, gy - 80, 120, gy - 120, 100, gy); c.stroke(); c.restore();
  // the person
  const rest = E.p(t, 3.2, 3.6), me = E.p(t, 3.6, 5.0, 'out'), done = t > 5.0;
  const s = .9, fx = 700;
  if (rest > 0 && !done) { E.rrect(c, fx - 60, gy - 70, 150, 16, 4, '#555'); }
  const pose = done ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.0, 5.3, 'back')) : rest > 0 ? E.pose('sit') : E.pose('sad');
  const fy = done || rest <= 0 ? gy - E.FIG_H * s - 2 : gy - 70 - 66 * s + 2;
  E.figure(c, { x: fx, y: fy, s, pose, glow: done ? 10 : 0 });
  const by = fy - 210, mc = rest > 0 ? E.lerp(.03, 1, me) : .03 + Math.abs(Math.sin(t * 3)) * .01, mcol = mc < .3 ? RED : mc < .8 ? '#e5c547' : GREEN;
  E.rrect(c, fx - 60, by - 28, 120, 56, 10, '#111', '#ddd', 4); E.rrect(c, fx + 60, by - 12, 10, 24, 3, '#ddd');
  E.rrect(c, fx - 52, by - 20, 104 * mc, 40, 6, mcol);
  if (mc < .1 && Math.floor(t * 3) % 2 === 0) E.text(c, 'LOW', fx, by - 60, { size: 26, weight: 900, color: RED, ls: 3 });
  E.particles(c, fx, by, t - 5.0, { n: 30, speed: 380, color: GREEN });
} },
// 4 — Small wins
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Bad day?', W / 2, 420, t, -1, 3.6, { size: 64, weight: 900 });
  E.title(c, 'Small wins still count.', W / 2, 420, t, 3.8, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1360, cx = 640, cy = 960, items = ['Got out of bed', 'Drank water', 'Went outside', 'Did one small thing'];
  E.rrect(c, cx - 300, cy - 260, 600, 520, 26, '#121212', '#555', 4);
  E.text(c, 'TODAY', cx, cy - 205, { size: 28, weight: 900, ls: 5, color: GREY });
  let done = 0;
  items.forEach((it, i) => {
    const t0 = .8 + i * .75, k = E.p(t, t0, t0 + .25, 'back'), y = cy - 120 + i * 100;
    E.rrect(c, cx - 250, y - 24, 48, 48, 10, k > 0 ? GREEN : '#1a1a1a', k > 0 ? GREEN : '#777', 4);
    if (k > 0) { done++; c.save(); c.strokeStyle = '#0a0a0a'; c.lineWidth = 8; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(cx - 238, y); c.lineTo(cx - 230 + 4 * k, y + 10 * k); c.lineTo(cx - 230 + 22 * k, y - 12 * k); c.stroke(); c.restore(); }
    E.text(c, it, cx - 180, y, { size: 34, weight: 700, color: k > 0 ? '#fff' : '#999', align: 'left' });
    E.particles(c, cx - 226, y, t - t0, { n: 14, speed: 260, color: GREEN, life: .8, seed: i * 5 });
  });
  const lift = done / 4;
  E.figure(c, { x: 230, y: gy - E.FIG_H * .85 - 2, s: .85, glow: done === 4 ? 10 : 0, pose: done === 4 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.3, 3.7, 'back')) : E.mix(E.pose('sad'), E.pose('stand'), lift) });
  E.ground(c, gy, 90, 380);
} },
// 5 — Talk to yourself like a child
{ dur: 6.4, draw(c, t) {
  E.title(c, "You'd never say this to a child…", W / 2, 420, t, -1, 2.2, { size: 46, weight: 800 });
  E.title(c, 'So why say it to yourself?', W / 2, 420, t, 2.4, 4.4, { size: 50, weight: 800 });
  E.title(c, 'Be kind to you.', W / 2, 420, t, 4.6, 1e9, { size: 64, weight: 900, color: GOLD });
  const gy = 1320; E.ground(c, gy, 90, 990);
  const hurt = E.p(t, .6, 1.4), heal = E.p(t, 3.8, 4.6);
  const ks = E.lerp(E.lerp(.5, .42, hurt), .52, heal);
  E.figure(c, { x: 340, y: gy - E.FIG_H * ks - 2, s: ks, f: 1, pose: heal > 0 ? E.mix(E.pose('sad'), E.pose('cheer'), heal) : E.mix(E.pose('stand'), E.pose('sad'), hurt), glow: heal * 12 });
  E.bubble(c, "You're so useless.", 700, gy - 400, E.p(t, .2, .45, 'back') * (1 - E.p(t, 2.8, 3.1)), { size: 34, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f', tail: 1 });
  const walk = E.p(t, 3.0, 3.8, 'inOut');
  const ax = E.lerp(720, 470, walk);
  E.figure(c, { x: ax, y: gy - E.FIG_H * .95 - 2 + (t > 3.8 ? 50 * E.p(t, 3.8, 4.1) : 0), s: .95, f: -1, pose: t < 3.0 ? E.pose('point') : walk < 1 ? E.walk(ax / 24) : E.mix(E.pose('stand'), { ...E.pose('crouch'), aF: 1.3, eF: .3, aB: 1.1, eB: .3 }, E.p(t, 3.8, 4.1)) });
  if (heal > 0) { c.save(); c.translate(405, gy - 330 - 20 * heal); c.scale(heal, heal); c.fillStyle = RED; c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-60, -10, -30, -60, 0, -28); c.bezierCurveTo(30, -60, 60, -10, 0, 30); c.fill(); c.restore(); }
  E.particles(c, 405, gy - 330, t - 4.1, { n: 30, speed: 380, color: '#ff8a8d' });
} },
] };
