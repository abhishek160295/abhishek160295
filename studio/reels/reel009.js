// Reel 009 — "11 PM you vs 5 AM you"
const inBed = { tor: 0, hd: 0, aB: .2, eB: .3, aF: 2.6, eF: .3, lB: 1.57, kB: 0, lF: 1.57, kF: 0 };
const REEL = { title: '11 PM you vs 5 AM you', bpm: 150, scenes: [
// 1 — The promise vs the snooze
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Me at 11 PM vs me at 5 AM:', W / 2, 420, t, -1, 4.3, { size: 50, weight: 800 });
  E.title(c, 'Be who you promised to be.', W / 2, 420, t, 4.5, 1e9, { size: 52, weight: 900, color: GOLD });
  const g1 = 900, g2 = 1440, s = .8;
  E.text(c, '11 PM ME', 120, 560, { size: 30, weight: 900, ls: 3, color: GREY, align: 'left' });
  E.text(c, '5 AM ME', 120, 1080, { size: 30, weight: 900, ls: 3, color: GREY, align: 'left' });
  E.moon(c, 900, 600, 40);
  E.ground(c, g1, 90, 990); E.bed(c, 120, g1);
  const pump = Math.sin(t * 9) * .3;
  E.figure(c, { x: 190, y: g1 - 76, s, pose: { ...inBed, aF: 2.5 + pump, eF: .2 } });
  E.bubble(c, "Tomorrow I'm waking up at 5!", 600, g1 - 230, E.p(t, .2, .5, 'back'), { size: 30, tail: -1 });
  // 5 AM
  E.ground(c, g2, 90, 990); E.bed(c, 120, g2);
  const ring = t > .6 && t < 1.45;
  E.clock(c, 520, g2 - 60, '5:00', '#fff', ring, t);
  const reach = E.p(t, 1.1, 1.35) * (1 - E.p(t, 1.5, 1.8));
  E.figure(c, { x: 300, y: g2 - 92, s, rot: -Math.PI / 2, pose: { ...E.pose('stand'), aF: E.lerp(.1, -1.6, reach), eF: .1 } });
  // blanket pulled over
  const bl = E.p(t, 1.8, 2.3);
  if (bl > 0) E.rrect(c, 150 + (1 - bl) * 120, g2 - 112, 240 - (1 - bl) * 120, 30, 14, '#5a6a8a');
  E.bubble(c, '5 more minutes…', 600, g2 - 200, E.p(t, 2.0, 2.3, 'back'), { size: 30 });
  for (let i = 0; i < 3; i++) { const k = ((t - 2.4 + i * .6) % 1.8) / 1.8; if (t > 2.4) E.text(c, 'z', 200 + k * 80 + i * 10, g2 - 150 - k * 140, { size: 30 + i * 8, weight: 800, color: '#888', alpha: Math.sin(k * Math.PI) }); }
} },
// 3 — Just one more video
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Just one more video…', W / 2, 420, t, -1, 4.2, { size: 54, weight: 800 });
  E.title(c, 'There goes your morning.', W / 2, 420, t, 4.4, 1e9, { size: 54, weight: 900, color: RED });
  const gy = 1300, bx = 300;
  const k = E.p(t, .3, 4.2, 'in'), mins = 23 * 60 + k * (3 * 60 + 47 + 6 * 60 - 0); // 11:00 PM → 6:47 AM
  const m = Math.floor(mins) % (24 * 60), h24 = Math.floor(m / 60), hh = ((h24 + 11) % 12) + 1, mm = String(m % 60).padStart(2, '0');
  E.clock(c, 540, 650, `${hh}:${mm} ${h24 >= 12 ? 'PM' : 'AM'}`, h24 >= 1 && h24 < 12 ? RED : '#fff', false, t, 1.3);
  // window: night → sunrise
  const sun = E.p(t, 3.8, 4.6);
  c.save(); const g = c.createLinearGradient(0, 860, 0, 1080); g.addColorStop(0, sun > 0 ? `rgba(255,${Math.round(150 + 40 * sun)},80,${.85 * sun})` : '#0b1020'); g.addColorStop(1, sun > 0 ? `rgba(255,210,120,${.9 * sun})` : '#141a30');
  c.fillStyle = '#0b1020'; c.fillRect(780, 860, 200, 220); c.fillStyle = g; c.fillRect(780, 860, 200, 220); c.restore();
  E.rrect(c, 780, 860, 200, 220, 6, null, '#888', 5); E.line(c, 880, 860, 880, 1080, '#888', 4); E.line(c, 780, 970, 980, 970, '#888', 4);
  E.ground(c, gy, 90, 990); E.bed(c, bx, gy);
  E.figure(c, { x: bx + 180, y: gy - 92, s: .8, rot: -Math.PI / 2, pose: { ...E.pose('stand'), aF: -2.0, eF: -.6, aB: -1.6, eB: -.4 } });
  const px = bx + 80, py = gy - 200;
  E.glowDot(c, px, py + 30, 120, 'rgba(120,190,255,.35)');
  c.save(); c.translate(px, py); c.rotate(.3); E.rrect(c, -24, -44, 48, 88, 8, '#222', '#ddd', 3); c.beginPath(); c.rect(-19, -38, 38, 76); c.clip();
  c.fillStyle = '#9fd3ff'; c.fillRect(-19, -38, 38, 76); for (let i = 0; i < 5; i++) { const yy = ((i * 22 - t * 220) % 110 + 110) % 110 - 40; c.fillStyle = '#4a7fb0'; c.fillRect(-15, yy, 30, 14); }
  c.restore();
} },
// 2 — Hype vs habit across the week
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Hype fades by Wednesday.', W / 2, 420, t, -1, 3.6, { size: 52, weight: 800 });
  E.title(c, 'Habits show up on Friday.', W / 2, 420, t, 3.8, 1e9, { size: 52, weight: 900, color: GOLD });
  const g1 = 900, g2 = 1400, s = .6, days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  E.text(c, 'HYPE', 100, 590, { size: 30, weight: 900, ls: 4, color: GREY, align: 'left' });
  E.text(c, 'HABIT', 100, 1090, { size: 30, weight: 900, ls: 4, align: 'left' });
  E.ground(c, g1, 90, 990); E.ground(c, g2, 90, 990);
  days.forEach((d, i) => {
    const x = 160 + i * 190, a = E.p(t, .3 + i * .55, .55 + i * .55, 'back');
    E.text(c, d, x, g1 + 38, { size: 30, weight: 800, ls: 2, color: '#666' });
    E.text(c, d, x, g2 + 38, { size: 30, weight: 800, ls: 2, color: i === 4 && t > 3.6 ? GOLD : '#666' });
    if (a <= 0) return;
    const hype = [E.run(t * 16), E.run(t * 11), E.walk(t * 6), E.pose('sad'), E.pose('stand')][i];
    const col = ['#fff', '#ddd', '#aaa', '#888', '#666'][i];
    if (i < 4) E.figure(c, { x, y: g1 - E.FIG_H * s - 2 + (1 - a) * 40, s, pose: hype, color: col, alpha: a });
    else E.figure(c, { x, y: g1 - 18, s, rot: -Math.PI / 2, pose: hype, color: col, alpha: a });
    E.figure(c, { x, y: g2 - E.FIG_H * s - 2 + (1 - a) * 40, s, alpha: a, pose: i === 4 && t > 3.8 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.8, 4.2, 'back')) : E.walk(t * 7 + i), color: i === 4 && t > 3.6 ? GOLD : '#fff', glow: i === 4 && t > 3.6 ? 10 : 0 });
  });
  if (t > 3.6) E.particles(c, 920, g2 - 140, t - 3.8, { n: 30, speed: 380 });
} },
// 4 — Waiting for motivation
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Waiting to feel motivated?', W / 2, 420, t, -1, 4.0, { size: 52, weight: 800 });
  E.title(c, 'Motivation follows action.', W / 2, 420, t, 4.2, 1e9, { size: 52, weight: 900, color: GOLD });
  const gy = 1300, mx = 250;
  E.ground(c, gy, 90, 990);
  // vending machine
  E.rrect(c, mx - 120, gy - 440, 240, 440, 18, '#161616', '#888', 5);
  E.rrect(c, mx - 100, gy - 420, 200, 70, 8, '#0d0d0d', '#555', 3);
  E.text(c, 'MOTIVATION', mx, gy - 385, { size: 28, weight: 900, ls: 2, color: GOLD });
  E.rrect(c, mx - 100, gy - 330, 140, 220, 8, '#0b0b0b', '#444', 3);
  for (let i = 0; i < 6; i++) E.rrect(c, mx + 55, gy - 320 + i * 34, 30, 22, 4, '#2a2a2a', '#666', 2);
  E.rrect(c, mx - 80, gy - 80, 160, 40, 6, '#0b0b0b', '#555', 3);
  const blink = t > 1.2 && t < 3.0 && Math.floor(t * 4) % 2 === 0;
  if (t > 1.2 && t < 3.0) E.text(c, 'SOLD OUT', mx - 30, gy - 220, { size: 30, weight: 900, color: RED, alpha: blink ? 1 : .35 });
  // figure presses, gives up waiting, starts walking
  let x = 470, pose = E.pose('stand'), f = -1;
  if (t < 2.9) { const tap = Math.max(0, Math.sin(t * 9)); pose = { ...E.pose('point'), aF: 1.45 + tap * .25 }; }
  else { const k = E.p(t, 3.0, 5.8, 'inOut'); x = E.lerp(470, 880, k); f = 1; pose = k < 1 ? E.walk(x / 24) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.8, 6.1, 'back')); }
  E.figure(c, { x, y: gy - E.FIG_H * .85 - 2, s: .85, f, pose, glow: t > 4.5 ? 10 : 0 });
  // motivation orbs chase the moving figure
  if (t > 3.2) for (let i = 0; i < 7; i++) {
    const lag = i * .22, k = E.p(t - lag, 3.2, 5.8, 'inOut'), ox = E.lerp(mx, 880, k) - 40 - i * 18, oy = gy - 260 + Math.sin(t * 4 + i) * 30 - i * 10;
    const a = E.p(t, 3.2 + i * .15, 3.5 + i * .15);
    E.glowDot(c, ox, oy, 34, 'rgba(245,197,66,.9)', a); E.coin(c, ox, oy, 7, a);
  }
} },
// 5 — Your bed vs your dreams
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Your bed is comfortable.', W / 2, 420, t, -1, 3.5, { size: 54, weight: 800 });
  E.title(c, "Your dreams aren't in it.", W / 2, 420, t, 3.7, 1e9, { size: 54, weight: 900, color: GOLD });
  E.shake(c, t, 3.5, .35, 14);
  const gy = 1300, dx = 870, snap = t >= 3.5;
  E.ground(c, gy, 90, 990); E.bed(c, 90, gy, 'COMFORT');
  // the door to your dreams
  E.glowDot(c, dx, gy - 160, 260 + 80 * E.p(t, 3.6, 4.6), 'rgba(245,197,66,.45)');
  c.save(); c.fillStyle = GOLD; c.fillRect(dx - 70, gy - 320, 140, 320); c.restore();
  E.rrect(c, dx - 82, gy - 332, 164, 332, 6, null, '#ddd', 6);
  E.text(c, 'YOUR DREAMS', dx - 20, gy - 370, { size: 32, weight: 900, ls: 3, color: GOLD });
  let x, pose;
  if (!snap) { x = E.lerp(400, 600, E.p(t, .3, 3.4, 'out')); pose = { ...E.pose('push'), tor: .55, aF: .3, aB: -.2, lB: -.7 + Math.sin(t * 7) * .15, lF: .5 - Math.sin(t * 7) * .15 }; }
  else { const k = E.p(t, 3.55, 4.5, 'inOut'); x = E.lerp(600, dx, k); pose = k < 1 ? E.run(x / 20) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.5, 4.9, 'back')); }
  // elastic pulling back toward the bed
  if (!snap) { const ten = E.p(t, .3, 3.4); c.save(); c.setLineDash([16, 10]); E.line(c, 330, gy - 105, x - 20, gy - 150, `rgba(229,72,77,${.5 + .5 * ten})`, 4 + 4 * ten); c.restore(); }
  else if (t < 3.9) { const k = E.p(t, 3.5, 3.9); E.line(c, 330, gy - 105, E.lerp(600, 330, k), gy - 150, RED, 4); }
  E.figure(c, { x, y: gy - E.FIG_H * .85 - 2, s: .85, pose, color: '#fff' });
  E.particles(c, dx, gy - 200, t - 4.5, { n: 40, speed: 500 });
} },
] };
