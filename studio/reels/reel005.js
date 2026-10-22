// Reel 005 — "Your circle decides your future"
const REEL = { title: 'Your circle decides your future', bpm: 150, scenes: [
// 1 — Bucket of crabs
{ dur: 6.4, draw(c, t) {
  E.text(c, 'Some people will pull you down.', W / 2, 470, { size: 46, weight: 700, alpha: 1 - E.p(t, 3.0, 3.3) });
  E.title(c, 'Climb anyway.', W / 2, 470, t, 4.5, 1e9, { size: 70, weight: 900, color: GOLD, glow: 28 });
  const gy = 1360, top = 1190, s = .7;
  E.ground(c, gy, 90, 990);
  const grab = t > 1.6 && t < 3.2;
  [380, 470, 610, 690].forEach((x, i) => E.figure(c, { x, y: gy - 20 - E.FIG_H * s, s, color: '#666', pose: grab && i < 3 ? E.pose('cheer') : E.mix(E.pose('stand'), { ...E.pose('stand'), hd: -.4 }, 1) }));
  // hero tries, gets pulled, tries again
  let x = 540, y = gy - 20 - E.FIG_H * s, pose = E.pose('stand');
  const up1 = E.p(t, .4, 1.5, 'out'), down = E.p(t, 1.8, 2.4, 'in'), up2 = E.p(t, 3.3, 4.2, 'inOut');
  if (t < 3.3) { y -= 230 * up1 * (1 - down); pose = up1 > 0 && down < 1 ? E.pose('climb') : E.pose('sad'); }
  else { x = E.lerp(540, 860, up2); y = E.lerp(gy - 20 - E.FIG_H * s, gy - E.FIG_H * s - 2, up2) - Math.sin(up2 * Math.PI) * 420; pose = up2 < 1 ? E.pose('jump') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.2, 4.6, 'back')); }
  E.figure(c, { x, y, s, pose, glow: t > 4.2 ? 22 : 0 });
  // bucket front
  c.save(); c.fillStyle = 'rgba(30,30,34,.8)'; c.strokeStyle = '#999'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(270, top); c.lineTo(810, top); c.lineTo(760, gy); c.lineTo(320, gy); c.closePath(); c.fill(); c.stroke();
  [1250, 1310].forEach(yy => { c.beginPath(); c.moveTo(270 + (yy - top) * .3, yy); c.lineTo(810 - (yy - top) * .3, yy); c.strokeStyle = '#444'; c.stroke(); });
  c.restore();
  E.text(c, 'PULLED BACK', 540, top - 380, { size: 34, weight: 900, ls: 4, color: RED, glow: 14, alpha: E.p(t, 1.9, 2.1) * (1 - E.p(t, 3.0, 3.2)) });
  E.particles(c, 860, gy - 150, t - 4.2, { n: 30, speed: 420 });
} },
// 2 — Candles
{ dur: 6.4, draw(c, t) {
  E.title(c, "Lighting someone else's candle…", W / 2, 440, t, .05, 1e9, { size: 46, weight: 700 });
  E.title(c, 'never dims your own.', W / 2, 515, t, 4.3, 1e9, { size: 56, weight: 900, color: GOLD, glow: 26 });
  const base = 1300, xs = [180, 360, 540, 720, 900];
  const lit = i => i === 0 ? 0 : 1.0 + i * .75;
  const lights = xs.filter((_, i) => t >= lit(i)).length;
  E.glowDot(c, 540, 1050, 300 + lights * 90, `rgba(245,197,66,${.06 * lights})`);
  xs.forEach((x, i) => {
    const h = 260 - Math.abs(i - 2) * 30;
    E.rrect(c, x - 34, base - h, 68, h, 8, '#efe6d0');
    E.line(c, x, base - h, x, base - h - 18, '#333', 4);
    const on = t >= lit(i), k = on ? E.p(t, lit(i), lit(i) + .25, 'back') : 0;
    if (on) { const fy = base - h - 40, fl = Math.sin(t * 18 + i) * 3;
      E.glowDot(c, x, fy, 110 * k, 'rgba(245,197,66,.55)');
      c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 30; c.beginPath(); c.moveTo(x, fy - 40 * k + fl); c.quadraticCurveTo(x + 20 * k, fy, x, fy + 20 * k); c.quadraticCurveTo(x - 20 * k, fy, x, fy - 40 * k + fl); c.fill(); c.restore(); }
    // spark travelling to the next candle
    if (i > 0) { const k2 = E.p(t, lit(i) - .45, lit(i), 'inOut'); if (k2 > 0 && k2 < 1) { const h0 = 260 - Math.abs(i - 3) * 30; const sx = E.lerp(xs[i - 1], x, k2), sy = E.lerp(base - h0 - 40, base - h - 40, k2) - Math.sin(k2 * Math.PI) * 80; E.glowDot(c, sx, sy, 30, 'rgba(255,230,150,1)'); } }
  });
  E.ground(c, base, 90, 990, '#444');
} },
// 3 — Average of five
{ dur: 6.4, draw(c, t) {
  E.title(c, "You become who you're around.", W / 2, 440, t, .05, 1e9, { size: 48, weight: 800 });
  E.title(c, 'Choose your circle.', W / 2, 515, t, 4.5, 1e9, { size: 56, weight: 900, color: GOLD, glow: 26 });
  const cx = 540, cy = 1060, R = 300, s = .6;
  const dim = E.p(t, .4, 2.4), swap = E.p(t, 2.8, 3.6, 'inOut'), glow = E.p(t, 3.8, 4.5);
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5 + .3, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * .75;
    const out = Math.cos(a) > 0 ? 1 : -1;
    if (swap < 1) E.figure(c, { x: x + out * swap * 700, y: y - 60, s, color: '#555', pose: E.pose('sad'), alpha: 1 - swap * .5 });
    if (swap > 0) E.figure(c, { x: x - out * (1 - swap) * 700, y: y - 60, s, color: GOLD, glow: 22, pose: E.mix(E.pose('stand'), E.pose('cheer'), glow) });
  }
  const r = Math.round(E.lerp(E.lerp(255, 110, dim), 245, glow)), g = Math.round(E.lerp(E.lerp(255, 110, dim), 197, glow)), b = Math.round(E.lerp(E.lerp(255, 110, dim), 66, glow));
  E.glowDot(c, cx, cy - 60, 260, 'rgba(245,197,66,.35)', glow);
  E.figure(c, { x: cx, y: cy - 60, s: .8, color: `rgb(${r},${g},${b})`, glow: glow * 30, pose: t < 3.8 ? E.mix(E.pose('stand'), E.pose('sad'), dim) : E.mix(E.pose('sad'), E.pose('cheer'), glow) });
} },
// 4 — Wrong environment
{ dur: 6.4, draw(c, t) {
  E.title(c, "Sometimes you're not the problem.", W / 2, 440, t, .05, 1e9, { size: 44, weight: 800 });
  E.title(c, 'Your environment is.', W / 2, 515, t, 2.4, 1e9, { size: 52, weight: 900, color: t > 4.4 ? GOLD : '#ccc', glow: t > 4.4 ? 24 : 0 });
  const gy = 1300, move = E.p(t, 2.6, 3.8, 'inOut'), grow = E.p(t, 3.9, 5.0, 'out');
  // wall + shade
  c.save(); c.fillStyle = 'rgba(0,0,0,.0)'; c.restore();
  E.rrect(c, 120, 720, 70, gy - 720, 6, '#2a2a2a', '#555', 3);
  c.save(); c.fillStyle = 'rgba(255,255,255,.03)'; c.beginPath(); c.moveTo(190, 720); c.lineTo(520, gy); c.lineTo(190, gy); c.fill(); c.restore();
  E.glowDot(c, 880, 700, 320, 'rgba(245,197,66,.45)'); c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 40; c.beginPath(); c.arc(880, 700, 60, 0, 7); c.fill(); c.restore();
  E.ground(c, gy, 90, 990);
  const px = E.lerp(330, 780, move);
  // figure carrying the pot
  const carrying = t > 2.3 && t < 4.0;
  const fx = carrying ? px - 70 : (t <= 2.3 ? E.lerp(-80, 260, E.p(t, 1.4, 2.3)) : 710);
  E.figure(c, { x: fx, y: gy - E.FIG_H * .8 - 2, s: .8, pose: carrying ? { ...E.walk(fx / 22, .3), aF: 1.3, eF: .2, aB: 1.2, eB: .3 } : t <= 2.3 ? E.walk(fx / 22) : E.pose('stand') });
  const py = carrying ? gy - 40 - Math.abs(Math.sin(t * 8)) * 6 : gy;
  // plant
  const wilt = 1 - grow, h = E.lerp(140, 300, grow);
  c.save(); c.strokeStyle = grow > 0 ? GREEN : '#6b7d55'; c.lineWidth = 7; c.lineCap = 'round'; c.shadowColor = GREEN; c.shadowBlur = 14 * grow;
  const tipx = px + wilt * 70, tipy = py - 70 - h + wilt * 70;
  c.beginPath(); c.moveTo(px, py - 70); c.quadraticCurveTo(px, py - 70 - h * .7, tipx, tipy); c.stroke();
  c.fillStyle = c.strokeStyle; [[.45, -1], [.65, 1]].forEach(([k, d]) => { const lx = px + (tipx - px) * k * k, ly = py - 70 - h * .7 * k; c.beginPath(); c.ellipse(lx + d * 26, ly, 28, 10, d * .5 + wilt * .9 * d, 0, 7); c.fill(); });
  c.restore();
  if (grow > 0) { c.save(); c.translate(tipx, tipy); c.shadowColor = GOLD; c.shadowBlur = 30; c.fillStyle = GOLD; for (let i = 0; i < 6; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.ellipse(0, -26 * grow, 14 * grow, 26 * grow, 0, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 12 * grow, 0, 7); c.fill(); c.restore(); }
  E.rrect(c, px - 55, py - 75, 110, 75, 10, '#8a5a3c', '#b07a55', 3);
  E.particles(c, tipx, tipy, t - 4.9, { n: 30, speed: 380 });
} },
// 5 — Build the bridge
{ dur: 6.4, draw(c, t) {
  E.title(c, "They'll doubt you.", W / 2, 440, t, .05, 4.6, { size: 56, weight: 800 });
  E.title(c, "Then ask how you did it.", W / 2, 440, t, 4.8, 1e9, { size: 52, weight: 900, color: GOLD, glow: 26 });
  const gy = 1150, L = 360, R = 720, s = .7;
  c.save(); c.fillStyle = '#1a1a1a'; c.fillRect(0, gy, L, 500); c.fillRect(R, gy, W - R, 500); c.restore();
  E.line(c, 0, gy, L, gy, '#888', 5); E.line(c, R, gy, W, gy, '#888', 5); E.line(c, L, gy, L, gy + 500, '#555', 4); E.line(c, R, gy, R, gy + 500, '#555', 4);
  [70, 160].forEach((x, i) => E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, color: '#666', pose: t > 4.7 ? E.mix(E.pose('arms'), { ...E.pose('point'), aF: 2.4 }, E.p(t, 4.7, 5)) : E.pose('arms') }));
  E.bubble(c, 'Impossible.', 120, gy - 300, E.p(t, .3, .6, 'back') * (1 - E.p(t, 3.8, 4.2)), { size: 28 });
  E.bubble(c, 'Give up.', 230, gy - 420, E.p(t, .9, 1.2, 'back') * (1 - E.p(t, 3.8, 4.2)), { size: 28 });
  E.bubble(c, 'How?!', 140, gy - 320, E.p(t, 4.9, 5.2, 'back'), { size: 32, stroke: GOLD, color: GOLD });
  const n = 6, pw = (R - L) / n;
  for (let i = 0; i < n; i++) { const a = E.p(t, 1.4 + i * .35, 1.6 + i * .35, 'back'); if (a > 0) E.rrect(c, L + i * pw + 2, gy - 6, (pw - 4) * a, 18, 3, i === n - 1 ? GOLD : '#c49a6c'); }
  let x = 300, pose = E.pose('stand');
  if (t > 1.4 && t < 3.6) { x = Math.min(L + (Math.floor((t - 1.4) / .35)) * pw, R - 30); pose = E.pose('crouch'); }
  if (t >= 3.6) { const k = E.p(t, 3.6, 4.5, 'inOut'); x = E.lerp(L + 5 * pw, 900, k); pose = k < 1 ? E.run(x / 20) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.5, 4.9, 'back')); }
  E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, pose, glow: t > 4.5 ? 22 : 0 });
  if (t > 4.4) E.trophy(c, 990, gy - 4, E.p(t, 4.4, 4.8, 'back') * .6);
  E.particles(c, 960, gy - 100, t - 4.6, { n: 30, speed: 400 });
} },
] };
