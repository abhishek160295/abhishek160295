// Reel 019 — "It's okay to start over"
const REEL = { title: "It's okay to start over", bpm: 150, pace: 'fast', scenes: [
// 1 — Gold in the cracks
{ dur: 5, cam: [300, 820, 780, 1320], draw(c, t) {
  E.title(c, 'Everything fell apart?', W / 2, 420, t, -1, 2.5, { size: 54, weight: 800 });
  E.title(c, 'Rebuild with gold in the cracks.', W / 2, 420, t, 2.7, 1e9, { size: 46, weight: 900, color: GOLD });
  const gy = 1300, cx = 540, cy = 1130;
  E.shaded(c, 330, gy - 30, 420, 30, 6, '#b88456', '#6e4a2e'); E.line(c, 540, gy, 540, gy + 0, '#000', 1);
  const fall = E.p(t, .2, .5, 'in'), apart = E.p(t, .5, 1.0, 'out') * (1 - E.p(t, 1.4, 2.3, 'inOut')), gold = E.p(t, 2.3, 2.9);
  E.shake(c, t, .5, .3, 14);
  const base = cy - 90 + fall * 140;
  // bowl as 5 shards that scatter and come back
  const shards = [[-1, -.2], [-.5, .5], [0, -.6], [.5, .4], [1, -.1]];
  for (let i = 0; i < 5; i++) {
    const [dx, dy] = shards[i], a0 = Math.PI * (i / 5), a1 = Math.PI * ((i + 1) / 5);
    c.save(); c.translate(cx + dx * 260 * apart, base + dy * 140 * apart - Math.abs(dx) * 60 * apart); c.rotate(dx * 1.4 * apart);
    c.beginPath(); c.moveTo(0, -40); c.arc(0, -40, 130, a0, a1); c.closePath();
    const g = c.createLinearGradient(-130, -40, 130, 90); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b8c4d0'); c.fillStyle = g; c.fill();
    if (gold > 0) { c.strokeStyle = GOLD; c.lineWidth = 9 * gold; c.shadowColor = GOLD; c.shadowBlur = 20 * gold; c.stroke(); }
    c.restore();
  }
  E.glowDot(c, cx, base - 10, 300, 'rgba(245,197,66,.45)', gold);
  E.particles(c, cx, base - 20, t - .5, { n: 30, speed: 600, color: '#dfe6ee', grav: 900, life: .7 });
  E.particles(c, cx, base - 40, t - 2.6, { n: 60, speed: 600 });
  if (t > 2.6) for (let i = 0; i < 8; i++) { const a = t * 1.6 + i * .785, r = 190 + Math.sin(t * 3 + i) * 20; E.glowDot(c, cx + Math.cos(a) * r, base - 20 + Math.sin(a) * r * .45, 16, 'rgba(245,197,66,.95)'); }
  E.rays(c, cx, base - 20, 420, .3 * gold, GOLD, 16, t * .3);
} },
// 2 — Sand castle
{ dur: 5, cam: [140, 860, 940, 1340], draw(c, t) {
  E.title(c, 'The wave took it all?', W / 2, 420, t, -1, 2.5, { size: 54, weight: 800 });
  E.title(c, 'Build again. Higher this time.', W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const gy = 1300;
  c.save(); c.fillStyle = '#c9a66b'; c.beginPath(); c.moveTo(140, gy + 40); c.lineTo(940, gy - 120); c.lineTo(940, gy + 60); c.lineTo(140, gy + 60); c.fill(); c.restore();
  const slope = x => gy + 40 - (x - 140) * 160 / 800;
  const castle = (x, h, a, col) => { if (a <= 0) return; const y = slope(x); c.save(); c.globalAlpha = a; E.shaded(c, x - 90, y - h * .55, 180, h * .55, 4, col, '#9a7a48'); [-70, 0, 70].forEach((dx, i) => E.shaded(c, x + dx - 26, y - h * (i === 1 ? 1 : .8), 52, h * (i === 1 ? .45 : .25), 4, col, '#9a7a48')); c.restore(); };
  const wash = E.p(t, .9, 1.5, 'in');
  castle(330, 220, 1 - wash, '#e6c88a');
  // the wave
  const wx = E.lerp(-200, 700, E.p(t, .6, 1.4, 'inOut')) - E.p(t, 1.4, 2.2) * 900;
  c.save(); c.fillStyle = 'rgba(90,150,210,.85)'; c.beginPath(); c.moveTo(-300, gy + 60); for (let x = -300; x <= wx; x += 20) c.lineTo(x, slope(Math.max(140, x)) - 60 - Math.sin(x / 40 + t * 8) * 22); c.lineTo(wx + 60, slope(Math.max(140, wx)) - 10); c.lineTo(wx + 60, gy + 60); c.fill(); c.restore();
  // rebuild further up the beach, bigger and gold
  const nb = E.p(t, 2.2, 3.6, 'out');
  castle(700, 340 * nb, nb > 0 ? 1 : 0, '#f5c542');
  const fx = t < 2.0 ? 470 : E.lerp(470, 560, E.p(t, 2.0, 2.4));
  E.figure(c, { x: fx, y: slope(fx) - E.FIG_H - 2, color: t > 2.6 ? GOLD : '#fff', pose: t < 1.0 ? { ...E.pose('crouch'), aF: 1.2 + Math.sin(t * 14) * .3 } : t < 2.0 ? E.pose('sad') : t < 3.6 ? { ...E.pose('stand'), tor: .3, aF: 1.4 + Math.sin(t * 12) * .5, aB: 1.2 + Math.sin(t * 12) * .5 } : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.6, 3.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 } });
  E.particles(c, 700, slope(700) - 360, t - 3.6, { n: 50, speed: 500 });
} },
// 3 — Game over → continue
{ dur: 5, cam: [140, 760, 940, 1330], draw(c, t) {
  E.title(c, 'Lost a level?', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Hit continue.', W / 2, 420, t, 2.7, 1e9, { size: 64, weight: 900, color: GOLD });
  const gy = 1300;
  E.shaded(c, 140, gy - 20, 280, 340, 6, '#4a8a4a', '#24452a'); E.shaded(c, 640, gy - 20, 300, 340, 6, '#4a8a4a', '#24452a');
  for (let i = 0; i < 10; i++) E.rrect(c, 140 + i * 28, gy - 20, 24, 12, 3, '#6ac06a'); for (let i = 0; i < 10; i++) E.rrect(c, 640 + i * 30, gy - 20, 26, 12, 3, '#6ac06a');
  E.flag(c, 820, gy - 20, 1, 24);
  // first attempt: jump short, fall in the pit
  let x, y, pose, col = '#fff';
  if (t < 1.2) { const k = E.p(t, .3, 1.2, 'in'); x = E.lerp(300, 520, k); y = gy - 20 - E.FIG_H * .8 - 2 - Math.sin(Math.min(1, k * 1.6) * Math.PI) * 140 + Math.max(0, k - .6) * 900; pose = k > 0 ? E.pose('jump') : E.run(t * 14); }
  else if (t < 2.4) { x = 520; y = 2000; pose = E.pose('stand'); }
  else { const k = E.p(t, 2.7, 3.6, 'inOut'); x = E.lerp(300, 760, k); y = gy - 20 - E.FIG_H * .8 - 2 - Math.sin(k * Math.PI) * 260; pose = k > 0 && k < 1 ? E.pose('jump') : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.6, 3.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 }; col = GOLD; }
  if (y < 1900) E.figure(c, { x, y, s: .8, pose, color: col });
  const go = E.p(t, 1.2, 1.4, 'back') * (1 - E.p(t, 1.9, 2.0));
  if (t > 1.0 && t < 2.6) E.particles(c, 530, gy - 20, (t - 1.0) % .5, { n: 14, speed: 300, color: '#6ac06a', grav: 600, life: .5, seed: Math.floor(t * 2) });
  if (go > 0) { c.save(); c.translate(540, 980); c.scale(go * (1 + .06 * Math.sin(t * 20)), go * (1 + .06 * Math.sin(t * 20))); E.rrect(c, -230, -60, 460, 120, 16, '#1a0a0c', RED, 6); c.restore(); E.text(c, 'GAME OVER', 540, 982, { size: 60, weight: 900, color: RED, alpha: go }); }
  const cont = E.p(t, 2.0, 2.2, 'back') * (1 - E.p(t, 2.55, 2.7));
  if (cont > 0) { c.save(); c.translate(540, 980); c.scale(cont, cont); E.rrect(c, -230, -60, 460, 120, 16, '#2a2208', GOLD, 6); c.restore(); E.text(c, 'CONTINUE?  YES', 540, 982, { size: 48, weight: 900, color: GOLD, alpha: cont }); }
  if (t > 2.4 && t < 2.8) E.particles(c, 300, gy - 160, t - 2.4, { n: 40, speed: 420, color: GOLD, grav: 0, life: .5 });
  if (t > 3.6) E.text(c, '+1 LIFE', 760, gy - 380, { size: 40, weight: 900, color: GREEN, alpha: E.p(t, 3.6, 3.8) });
  E.particles(c, 760, gy - 200, t - 3.6, { n: 40, speed: 460 });
} },
// 4 — Cut back to grow back
{ dur: 5, cam: [260, 760, 820, 1320], draw(c, t) {
  E.title(c, 'Had to cut things off?', W / 2, 420, t, -1, 2.5, { size: 54, weight: 800 });
  E.title(c, "That's how you grow back fuller.", W / 2, 420, t, 2.7, 1e9, { size: 46, weight: 900, color: GOLD });
  const gy = 1300, px = 600;
  E.shaded(c, px - 80, gy - 110, 160, 110, 12, '#a0683e', '#6a4024', '#c48a5c');
  const cut = E.p(t, .6, 1.2, 'in'), grow = E.p(t, 1.8, 3.6, 'out');
  // the old straggly plant gets pruned
  if (cut < 1) { c.save(); c.globalAlpha = 1 - cut; c.strokeStyle = '#7a8a5a'; c.lineWidth = 8; c.beginPath(); c.moveTo(px, gy - 110); c.lineTo(px + 10, gy - 420); c.moveTo(px + 6, gy - 260); c.lineTo(px - 90, gy - 360); c.moveTo(px + 8, gy - 330); c.lineTo(px + 100, gy - 400); c.stroke(); c.restore(); }
  E.particles(c, px, gy - 300, t - .9, { n: 40, speed: 460, color: '#7a8a5a', grav: 700, life: 1.4, size: 9 });
  if (t > 3.0) for (let i = 0; i < 10; i++) { const q = ((t - 3) * .7 + i / 10) % 1; E.glowDot(c, px - 160 + E.rnd(i) * 320 + Math.sin(q * 6 + i) * 30, gy - 520 + q * 400, 12, 'rgba(245,197,66,.9)', Math.sin(q * Math.PI)); }
  // full regrowth
  if (grow > 0) { c.save(); c.strokeStyle = GREEN; c.fillStyle = GREEN; c.lineWidth = 10; c.lineCap = 'round';
    const h = 420 * grow; c.beginPath(); c.moveTo(px, gy - 110); c.lineTo(px, gy - 110 - h); c.stroke();
    for (let i = 0; i < Math.floor(grow * 9); i++) { const yy = gy - 150 - i * 44, d = i % 2 ? 1 : -1, sw = Math.sin(t * 4 + i) * .25; c.save(); c.translate(px + d * 40, yy); c.rotate(d * .5 + sw); c.beginPath(); c.ellipse(0, 0, 44, 16, 0, 0, 7); c.fill(); c.restore(); }
    c.restore();
    [[px - 70, gy - 400], [px + 70, gy - 460], [px, gy - 110 - h]].forEach(([fx, fy], i) => { const k = E.p(grow, .6 + i * .1, 1, 'back'); if (k <= 0) return; c.save(); c.translate(fx, fy); c.rotate(t * .5 + i); c.fillStyle = GOLD; for (let p = 0; p < 6; p++) { c.rotate(Math.PI / 3); c.beginPath(); c.ellipse(0, -24 * k, 13 * k, 24 * k, 0, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 11 * k, 0, 7); c.fill(); c.restore(); }); }
  const fig = { x: 380, y: gy - E.FIG_H - 2, pose: t < 1.3 ? { ...E.pose('stand'), aF: 1.5 + Math.sin(t * 16) * .3, eF: .2 } : t < 2.4 ? E.pose('sad') : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.4, 3.7, 'back')), aF: 2.5 + Math.sin(t * 6) * .2 }, color: t > 2.6 ? GOLD : '#fff' };
  E.figure(c, fig);
  if (t < 1.3) { const [hx, hy] = E.hand(fig); c.save(); c.strokeStyle = '#ccc'; c.lineWidth = 6; const o = Math.sin(t * 16) * .4; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + 70, hy - 20 - o * 20); c.moveTo(hx, hy); c.lineTo(hx + 70, hy + 10 + o * 20); c.stroke(); c.restore(); }
  E.particles(c, px, gy - 460, t - 3.6, { n: 40, speed: 460 });
} },
// 5 — Every morning is a restart
{ dur: 5, cam: [180, 760, 900, 1320], draw(c, t) {
  E.title(c, 'Every sunrise is a restart.', W / 2, 420, t, -1, 2.5, { size: 52, weight: 800 });
  E.title(c, 'Begin again.', W / 2, 420, t, 2.7, 1e9, { size: 72, weight: 900, color: GOLD });
  const gy = 1300, rise = E.p(t, 0, 2.6, 'inOut');
  for (let i = 0; i < 30; i++) { const tw = .5 + .5 * Math.sin(t * 5 + i * 1.7); E.glowDot(c, 180 + E.rnd(i) * 720, 780 + E.rnd(i + 9) * 320, 7, 'rgba(255,255,255,.9)', tw * (1 - rise)); }
  c.save(); const sky = c.createLinearGradient(0, 760, 0, gy); sky.addColorStop(0, `rgba(30,40,80,${.6 * (1 - rise)})`); sky.addColorStop(1, `rgba(245,150,60,${.45 * rise})`); c.fillStyle = sky; c.fillRect(-200, 700, 1500, gy - 700); c.restore();
  const sy = E.lerp(gy + 60, 960, rise);
  E.glowDot(c, 760, sy, 520, 'rgba(245,197,66,.5)', rise);
  c.save(); c.beginPath(); c.rect(-200, 0, 1500, gy - 40); c.clip(); c.fillStyle = GOLD; c.beginPath(); c.arc(760, sy, 110, 0, 7); c.fill(); c.restore();
  E.rays(c, 760, sy, 700, .2 + .3 * rise, GOLD, 18, t * .6);
  c.save(); c.fillStyle = '#121212'; c.beginPath(); c.moveTo(-200, gy); c.quadraticCurveTo(540, gy - 120, 1300, gy); c.lineTo(1300, gy + 200); c.lineTo(-200, gy + 200); c.fill(); c.restore();
  const up = E.p(t, 2.4, 3.0, 'back');
  E.figure(c, { x: 400, y: E.lerp(gy - 60 - 66 * 1.05 + 4, gy - 60 - E.FIG_H * 1.05 - 2, up), s: 1.05, color: `rgb(${Math.round(E.lerp(200, 245, rise))},${Math.round(E.lerp(200, 197, rise))},${Math.round(E.lerp(200, 66, rise))})`, pose: up <= 0 ? { ...E.pose('sit'), lF: 1.4, kF: 1.2, lB: 1.4, kB: 1.2, hd: -.2 } : { ...E.mix(E.pose('stand'), E.pose('cheer'), up), aF: 2.6 + Math.sin(t * 5) * .2, aB: -2.6 + Math.sin(t * 5) * .2 } });
  for (let i = 0; i < 4; i++) { const q = ((t + 1) * .5 + i / 4) % 1, bx = 200 + q * 700, by = 860 + Math.sin(q * 8 + i) * 30 + i * 30; c.save(); c.strokeStyle = '#222'; c.lineWidth = 5; const w = Math.sin(t * 14 + i) * 12; c.beginPath(); c.moveTo(bx - 22, by - w); c.lineTo(bx, by); c.lineTo(bx + 22, by - w); c.stroke(); c.restore(); }
  E.particles(c, 400, gy - 300, t - 3.0, { n: 60, speed: 600, grav: 200 });
} },
] };
