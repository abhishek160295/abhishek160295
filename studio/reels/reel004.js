// Reel 004 — "Nobody is coming to save you"
const REEL = { title: 'Nobody is coming to save you', bpm: 150, scenes: [
// 1 — The pit
{ dur: 6.4, draw(c, t) {
  E.text(c, 'Waiting for someone to save you?', W / 2, 470, { size: 46, weight: 700, alpha: 1 - E.p(t, 2.2, 2.5) });
  E.title(c, 'Nobody is coming.', W / 2, 470, t, 2.6, 4.6, { size: 56, weight: 800, color: RED, glow: 18 });
  E.title(c, 'So climb.', W / 2, 470, t, 4.9, 1e9, { size: 70, weight: 900, color: GOLD, glow: 28 });
  const gy = 900, bot = 1400, L = 340, R = 740, s = .8;
  c.save(); c.fillStyle = '#0d0d0d'; c.fillRect(L, gy, R - L, bot - gy); c.restore();
  E.ground(c, gy, 90, L); E.ground(c, gy, R, 990);
  E.line(c, L, gy, L, bot, '#6b6b6b', 5); E.line(c, R, gy, R, bot, '#6b6b6b', 5); E.line(c, L, bot, R, bot, '#6b6b6b', 5);
  // a rope that never arrives
  const rope = E.p(t, .2, 1.0, 'out') * (1 - E.p(t, 1.4, 2.1, 'in'));
  if (rope > 0) { c.save(); c.setLineDash([14, 10]); E.line(c, 560, 640, 560, 640 + 300 * rope, '#aaa', 5); c.restore(); }
  const holds = [1320, 1230, 1140, 1050, 960];
  holds.forEach((hy, i) => { const a = E.p(t, 2.7 + i * .35, 2.9 + i * .35, 'back'); if (a > 0) E.rrect(c, L, hy, 46 * a, 16, 4, i === 4 ? GOLD : '#cfcfcf'); });
  let x = 540, y = bot - E.FIG_H * s - 2, pose = E.mix(E.pose('stand'), { ...E.pose('stand'), hd: -.5 }, E.p(t, .2, .6));
  if (t > 1.6 && t < 2.6) pose = E.mix(pose, E.pose('sad'), E.p(t, 1.8, 2.3));
  if (t >= 2.6 && t < 4.6) { const k = E.p(t, 2.8, 4.5, 'inOut'); x = E.lerp(540, 420, Math.min(1, k * 3)); y = E.lerp(bot, 960, k) - E.FIG_H * s - 2; pose = { ...E.pose('climb'), aF: 2.6 + Math.sin(t * 10) * .4, aB: 2.2 - Math.sin(t * 10) * .4, lF: Math.sin(t * 10) * .5, lB: -Math.sin(t * 10) * .5 }; }
  if (t >= 4.6) { const k = E.p(t, 4.6, 5.0, 'out'); x = E.lerp(420, 230, k); y = E.lerp(960, gy, k) - Math.sin(k * Math.PI) * 80 - E.FIG_H * s - 2; pose = k < 1 ? E.pose('jump') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.0, 5.3, 'back')); }
  E.figure(c, { x, y, s, pose, glow: t > 5 ? 20 : 0 });
  E.particles(c, 230, gy - 150, t - 5.0, { n: 30, speed: 450 });
} },
// 2 — Distractions are loud
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Distractions are loud.', W / 2, 440, t, .05, 2.6, { size: 54, weight: 800, color: RED, glow: 14 });
  E.title(c, 'Your goals are quiet.', W / 2, 440, t, 2.8, 4.6, { size: 54, weight: 800 });
  E.title(c, 'Choose wisely.', W / 2, 440, t, 4.9, 1e9, { size: 64, weight: 900, color: GOLD, glow: 26 });
  const gy = 1300, s = .8;
  E.ground(c, gy, 90, 990); E.flag(c, 900, gy, 1, 30 + 20 * E.p(t, 4.8, 5.2));
  const slow = E.p(t, .3, 2.6, 'out') * 160, run = E.p(t, 3.3, 4.9, 'inOut');
  const x = 150 + slow + run * (840 - 150 - 160);
  const ns = [['New message', -150, -330, .5], ['Breaking news', 170, -260, .9], ['70% OFF', -200, -150, 1.3], ['Who viewed you', 150, -420, 1.7], ['+99', 230, -110, 2.0]];
  const sweep = E.p(t, 2.9, 3.4, 'in');
  ns.forEach(([str, dx, dy, t0], i) => {
    const a = E.p(t, t0, t0 + .25, 'back') * (1 - sweep);
    E.bubble(c, str, x + dx - sweep * (dx > 0 ? -1 : 1) * 0 + (dx > 0 ? 1 : -1) * sweep * 500, gy + dy + Math.sin(t * 6 + i) * 6, a, { fill: '#2a0d0f', stroke: RED, color: '#ffb3b5', size: 28 });
  });
  const pose = t < 2.8 ? E.walk(t * 4, .25) : t < 3.3 ? E.mix(E.pose('stand'), { ...E.pose('point'), aF: 2.4 }, E.p(t, 2.8, 3.1)) : run < 1 ? E.run(x / 22) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.9, 5.2, 'back'));
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, pose, glow: t > 3.3 ? 16 : 0 });
  E.particles(c, 900, gy - 190, t - 4.9, { n: 30, speed: 420 });
} },
// 3 — The storm
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Going through a storm?', W / 2, 440, t, .05, 3.2, { size: 54, weight: 800 });
  E.title(c, "Storms don't last forever.", W / 2, 440, t, 3.4, 1e9, { size: 52, weight: 800 });
  E.title(c, "They water your growth.", W / 2, 515, t, 4.6, 1e9, { size: 52, weight: 800, color: GOLD, glow: 24 });
  const gy = 1300, s = .9, clear = E.p(t, 3.2, 4.0);
  // sun
  if (clear > 0) { E.glowDot(c, 800, 720, 380 * clear, 'rgba(245,197,66,.45)'); E.rays(c, 800, 720, 420, clear * .35, GOLD, 16, t * .2); c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 40; c.beginPath(); c.arc(800, 720, 70 * clear, 0, 7); c.fill(); c.restore(); }
  E.flash(c, t, 1.5, .25, '255,255,255', .5); E.flash(c, t, 2.3, .2, '255,255,255', .35);
  E.cloud(c, 540 - clear * 700, 700, 1.4, 1 - clear, '#4a4a4a');
  if (t < 3.4) for (let i = 0; i < 40; i++) { const x = 400 + E.rnd(i) * 300, k = ((t * 1.6 + E.rnd(i + 9)) % 1); E.line(c, x, 760 + k * 520, x - 6, 790 + k * 520, `rgba(170,200,230,${.7 * (1 - clear)})`, 3); }
  if (t > 1.5 && t < 1.75) { c.save(); c.strokeStyle = '#fff'; c.lineWidth = 6; c.shadowColor = '#fff'; c.shadowBlur = 20; c.beginPath(); c.moveTo(560, 760); c.lineTo(520, 860); c.lineTo(570, 880); c.lineTo(510, 1000); c.stroke(); c.restore(); }
  E.ground(c, gy, 90, 990);
  for (let i = 0; i < 7; i++) { const px = 180 + i * 120 + (i > 2 ? 120 : 0), g = E.p(t, 3.8 + i * .12, 4.6 + i * .12, 'back'); if (g <= 0 || Math.abs(px - 540) < 80) continue;
    c.save(); c.strokeStyle = GREEN; c.fillStyle = GREEN; c.lineWidth = 5; c.shadowColor = GREEN; c.shadowBlur = 10;
    c.beginPath(); c.moveTo(px, gy); c.lineTo(px, gy - 70 * g); c.stroke();
    c.beginPath(); c.ellipse(px - 16 * g, gy - 60 * g, 16 * g, 7 * g, -.5, 0, 7); c.ellipse(px + 16 * g, gy - 70 * g, 16 * g, 7 * g, .5, 0, 7); c.fill(); c.restore(); }
  const pose = t < 3.2 ? E.pose('sad') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.6, 5.0, 'back'));
  E.figure(c, { x: 540, y: gy - E.FIG_H * s - 2, s, pose, glow: clear * 18 });
} },
// 4 — Energy battery
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Your energy is limited.', W / 2, 440, t, .05, 2.7, { size: 54, weight: 800 });
  E.title(c, 'Spend it on what charges you.', W / 2, 440, t, 2.9, 1e9, { size: 48, weight: 800, color: t > 4.9 ? GOLD : WHITE, glow: t > 4.9 ? 22 : 0 });
  const bx = 540, by = 1000, bw = 300, bh = 520;
  const drains = [['Scrolling', -.2, .6], ['Gossip', -.15, 1.3], ['Overthinking', -.25, 2.0]], charges = [['Sleep', .3, 3.2], ['Workout', .3, 3.8], ['Reading', .2, 4.4]];
  let lvl = .8; [...drains, ...charges].forEach(([, d, t0]) => { lvl += d * E.p(t, t0, t0 + .4, 'out'); });
  const col = lvl < .35 ? RED : lvl > .95 ? GREEN : lvl > .6 ? '#8fdc6a' : '#e5c547';
  E.rrect(c, bx - 50, by - bh / 2 - 34, 100, 30, 8, '#ddd');
  E.rrect(c, bx - bw / 2, by - bh / 2, bw, bh, 26, '#0d0d0d', '#ddd', 8);
  c.save(); c.shadowColor = col; c.shadowBlur = 30; const fh = (bh - 32) * Math.max(.02, lvl); E.rrect(c, bx - bw / 2 + 16, by + bh / 2 - 16 - fh, bw - 32, fh, 14, col); c.restore();
  E.text(c, Math.round(lvl * 100) + '%', bx, by, { size: 72, weight: 900, color: '#fff', glow: 10 });
  [...drains, ...charges].forEach(([str, d, t0], i) => {
    const a = E.p(t, t0, t0 + .2, 'out') * (1 - E.p(t, t0 + .5, t0 + .62)) , up = d > 0;
    if (i === 5) { E.text(c, `${str} +${Math.round(d * 100)}%`, bx, by + bh / 2 + 110, { size: 54, weight: 900, color: GREEN, glow: 18, alpha: E.p(t, t0, t0 + .2) * (1 - E.p(t, 4.85, 5.0)) }); return; }
    E.text(c, `${str} ${up ? '+' : ''}${Math.round(d * 100)}%`, bx, by + bh / 2 + 110 - 30 * (1 - a), { size: 54, weight: 900, color: up ? GREEN : RED, glow: 18, alpha: a });
  });
  if (lvl > .99) { c.save(); c.fillStyle = '#fff'; c.shadowColor = GREEN; c.shadowBlur = 30; c.beginPath(); c.moveTo(bx + 20, by - 190); c.lineTo(bx - 50, by - 90); c.lineTo(bx - 5, by - 90); c.lineTo(bx - 25, by - 20 + 0); c.lineTo(bx + 50, by - 120); c.lineTo(bx + 5, by - 120); c.closePath(); c.globalAlpha = E.p(t, 4.85, 5.1); c.fill(); c.restore(); }
  E.flash(c, t, 4.85, .35, '61,220,132', .3);
} },
// 5 — Footprints
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Walk alone if you have to.', W / 2, 440, t, .05, 3.3, { size: 52, weight: 800 });
  E.title(c, 'Your footprints', W / 2, 440, t, 3.6, 1e9, { size: 56, weight: 800, color: GOLD, glow: 24 });
  E.title(c, 'will lead others.', W / 2, 515, t, 3.8, 1e9, { size: 56, weight: 800, color: GOLD, glow: 24 });
  const gy = 1300, s = .8;
  E.ground(c, gy, 0, W, '#333');
  const lx = E.lerp(80, 900, E.p(t, .2, 3.4, 'inOut'));
  for (let i = 0; i * 50 + 90 < lx - 30; i++) { const px = 90 + i * 50; c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 12; c.globalAlpha = .85; c.beginPath(); c.ellipse(px, gy + 14 + (i % 2) * 14, 16, 6, 0, 0, 7); c.fill(); c.restore(); }
  for (let j = 0; j < 4; j++) {
    const fx = E.lerp(-120, 700 - j * 140, E.p(t, 3.4 + j * .2, 5.6 + j * .1, 'inOut'));
    if (t > 3.4) E.figure(c, { x: fx, y: gy - E.FIG_H * s - 2, s, pose: E.walk(fx / 26), color: '#6d6d6d' });
  }
  const done = t > 3.4;
  E.figure(c, { x: lx, y: gy - E.FIG_H * s - 2, s, pose: done ? E.mix(E.pose('stand'), { ...E.pose('stand'), hd: 0 }, 1) : E.walk(lx / 26), f: done && t > 4 ? -1 : 1, glow: 22 });
  E.glowDot(c, lx, gy - 120, 240, 'rgba(245,197,66,.3)', E.p(t, 3.4, 4));
} },
] };
