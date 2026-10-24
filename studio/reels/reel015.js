// Reel 015 — "Everyone posts their highlights"
const card = (c, x, y, kind) => {
  E.rrect(c, x - 150, y - 110, 300, 220, 16, '#1b1b22', '#444', 3);
  c.save(); c.beginPath(); c.roundRect(x - 140, y - 100, 280, 150, 10); c.clip();
  if (kind === 0) { c.fillStyle = '#2b6ea3'; c.fillRect(x - 140, y - 100, 280, 150); c.fillStyle = '#f3d88a'; c.fillRect(x - 140, y + 10, 280, 40); c.fillStyle = GOLD; c.beginPath(); c.arc(x + 70, y - 50, 26, 0, 7); c.fill(); }
  if (kind === 1) { c.fillStyle = '#26262e'; c.fillRect(x - 140, y - 100, 280, 150); c.fillStyle = RED; c.beginPath(); c.roundRect(x - 90, y - 10, 180, 40, 12); c.fill(); c.fillRect(x - 50, y - 40, 90, 34); c.fillStyle = '#111'; [x - 55, x + 55].forEach(w => { c.beginPath(); c.arc(w, y + 32, 16, 0, 7); c.fill(); }); }
  if (kind === 2) { c.fillStyle = '#2a2414'; c.fillRect(x - 140, y - 100, 280, 150); E.trophy(c, x, y + 30, .9, 1, 0); }
  if (kind === 3) { c.fillStyle = '#3a2430'; c.fillRect(x - 140, y - 100, 280, 150); c.strokeStyle = GOLD; c.lineWidth = 8; c.beginPath(); c.arc(x, y - 10, 34, 0, 7); c.stroke(); c.fillStyle = ICE; c.beginPath(); c.moveTo(x - 16, y - 52); c.lineTo(x + 16, y - 52); c.lineTo(x, y - 30); c.fill(); }
  c.restore();
  c.fillStyle = RED; c.beginPath(); c.moveTo(x - 120, y + 78); c.bezierCurveTo(x - 140, y + 62, x - 128, y + 52, x - 120, y + 62); c.bezierCurveTo(x - 112, y + 52, x - 100, y + 62, x - 120, y + 78); c.fill();
  E.text(c, ['2.4k', '9.1k', '5.6k', '12k'][kind], x - 92, y + 68, { size: 22, weight: 800, color: '#ddd', align: 'left' });
};
const REEL = { title: 'Everyone posts their highlights', bpm: 150, pace: 'fast', scenes: [
// 1 — Highlights vs behind the scenes
{ dur: 5, draw(c, t) {
  E.title(c, 'Everyone posts their highlights.', W / 2, 420, t, -1, 2.4, { size: 48, weight: 800 });
  E.title(c, 'Nobody posts the struggle.', W / 2, 420, t, 2.6, 1e9, { size: 52, weight: 900, color: GOLD });
  const gy = 1360, px = 620, py = 920, flip = E.p(t, 2.3, 2.8, 'inOut');
  const sc = Math.abs(Math.cos(flip * Math.PI)), back = flip > .5;
  c.save(); c.translate(px, py); c.scale(Math.max(.02, sc), 1); c.translate(-px, -py);
  E.rrect(c, px - 180, py - 330, 360, 660, 40, '#0c0c12', '#ddd', 8);
  c.beginPath(); c.roundRect(px - 166, py - 316, 332, 632, 30); c.clip();
  if (!back) { const off = (t * 300) % 260; for (let i = -1; i < 4; i++) card(c, px, py - 200 + i * 260 - off, (i + 4 + Math.floor(t * 300 / 260)) % 4); }
  else { c.fillStyle = '#121218'; c.fillRect(px - 170, py - 320, 340, 640); E.figure(c, { x: px, y: py + 120, s: .75, pose: { ...E.pose('sad'), aF: 2.3, eF: 1.6, tor: .5 }, color: '#aaa' }); E.text(c, 'BEHIND THE POST', px, py - 230, { size: 26, weight: 900, ls: 3, color: GREY });
    for (let i = 0; i < 3; i++) { const k = ((t - 2.8) * 1.2 + i / 3) % 1; if (t > 2.8) E.glowDot(c, px - 20 + i * 14, py - 40 + k * 120, 8, 'rgba(160,200,255,.9)', 1 - k); } }
  c.restore();
  const shrink = E.p(t, 0, 2.2);
  E.ground(c, gy, 90, 990);
  E.figure(c, { x: 230, y: gy - E.FIG_H * E.lerp(.85, .62, shrink * (1 - flip)) - 2, s: E.lerp(.85, .62, shrink * (1 - flip)), pose: t < 2.8 ? { ...E.pose('sad'), hd: -.3 } : E.mix(E.pose('sad'), E.pose('stand'), E.p(t, 2.8, 3.3)), color: t < 2.8 ? '#aaa' : '#fff' });
} },
// 2 — You're on your own track
{ dur: 5, draw(c, t) {
  E.title(c, "You're not behind.", W / 2, 420, t, -1, 2.4, { size: 58, weight: 900 });
  E.title(c, "You're on your own track.", W / 2, 420, t, 2.6, 1e9, { size: 54, weight: 900, color: GOLD });
  const lanes = [760, 990, 1220], ends = [560, 880, 760], sp = [1.0, .8, 0];
  lanes.forEach((y, i) => {
    E.line(c, 90, y, 990, y, '#444', 4);
    const fx = ends[i]; E.flag(c, fx, y, i === 2 ? 1 : .55, i === 2 ? 26 : 0);
    let x;
    if (i < 2) x = Math.min(fx - 20, 140 + t * 260 * sp[i]);
    else x = t < 2.2 ? 140 + t * 40 : E.lerp(228, fx - 30, E.p(t, 2.2, 3.4, 'in'));
    const done = i === 2 && t > 3.4;
    E.figure(c, { x, y: y - E.FIG_H * .62 - 2, s: .62, color: i < 2 ? '#777' : '#fff', pose: done ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.4, 3.7, 'back')) : i === 2 && t < 2.2 ? { ...E.walk(t * 6, .2), hd: -.5 } : E.run(t * (i === 2 ? 18 : 14) + i) });
    if (i === 2) E.text(c, 'YOU', 60, y - 60, { size: 28, weight: 900, ls: 3, align: 'left', color: GOLD });
  });
  E.particles(c, 760, 1100, t - 3.4, { n: 40, speed: 500 });
} },
// 3 — Stop digging up your seeds
{ dur: 5, draw(c, t) {
  E.title(c, 'Checking every day if it worked?', W / 2, 420, t, -1, 2.4, { size: 46, weight: 800 });
  E.title(c, 'Stop digging up your seeds.', W / 2, 420, t, 2.6, 1e9, { size: 52, weight: 900, color: GOLD });
  const gy = 1260, sx = 620; E.ground(c, gy);
  c.save(); c.fillStyle = '#4a3020'; c.fillRect(90, gy, 900, 200); c.restore();
  const dig = t < 2.3 ? Math.max(0, Math.sin(t * 7)) : 0;
  if (dig > .6) { c.save(); c.fillStyle = '#5c3c26'; c.beginPath(); c.ellipse(sx, gy + 30, 60, 30, 0, 0, 7); c.fill(); c.restore(); E.particles(c, sx, gy, (t * 7 % Math.PI) / 7, { n: 12, speed: 260, color: '#7a5030', grav: 900, life: .5, seed: Math.floor(t * 7 / Math.PI) }); }
  c.save(); c.fillStyle = '#c8a46a'; c.beginPath(); c.ellipse(sx, gy + 34 - dig * 40, 12, 8, 0, 0, 7); c.fill(); c.restore();
  const fig = { x: 430, y: gy - E.FIG_H * .85 - 2, s: .85, pose: t < 2.3 ? { ...E.pose('crouch'), aF: .9 + dig * .8, eF: .3 } : E.mix(E.pose('arms'), E.pose('cheer'), E.p(t, 4.0, 4.3, 'back')) };
  E.figure(c, fig);
  if (t < 2.3) { const [hx, hy] = E.hand(fig); c.save(); c.translate(hx, hy); c.rotate(.9 - dig * .6); E.line(c, 0, 0, 120, 0, '#b08060', 8); c.fillStyle = '#bbb'; c.beginPath(); c.moveTo(120, -18); c.lineTo(160, 0); c.lineTo(120, 18); c.fill(); c.restore(); }
  // time-lapse once you stop checking
  const g = E.p(t, 2.6, 4.2, 'out');
  if (g > 0) { E.text(c, `${Math.round(g * 60)} DAYS LATER`, W / 2, 560, { size: 30, weight: 900, ls: 4, color: GREY });
    const h = 360 * g; c.save(); c.strokeStyle = GREEN; c.fillStyle = GREEN; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx, gy); c.lineTo(sx, gy - h); c.stroke();
    for (let i = 0; i < Math.floor(g * 6); i++) { const yy = gy - 40 - i * 55, d = i % 2 ? 1 : -1; c.beginPath(); c.ellipse(sx + d * 34, yy, 34, 12, d * .5, 0, 7); c.fill(); } c.restore();
    if (g > .8) { const k = E.p(g, .8, 1, 'back'); c.save(); c.translate(sx, gy - h); c.fillStyle = GOLD; for (let i = 0; i < 8; i++) { c.rotate(Math.PI / 4); c.beginPath(); c.ellipse(0, -30 * k, 14 * k, 30 * k, 0, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 14 * k, 0, 7); c.fill(); c.restore(); } }
  E.particles(c, sx, gy - 360, t - 4.2, { n: 36, speed: 420 });
} },
// 4 — Comparison steals your win
{ dur: 5, draw(c, t) {
  E.title(c, 'Happy with your win…', W / 2, 420, t, -1, 1.8, { size: 54, weight: 800 });
  E.title(c, 'until you compared it.', W / 2, 420, t, 2.0, 3.0, { size: 54, weight: 800, color: RED });
  E.title(c, 'Comparison is the thief of joy.', W / 2, 420, t, 3.2, 1e9, { size: 46, weight: 900, color: GOLD });
  const gy = 1300; E.ground(c, gy);
  const look = t > .7 && t < 2.8, back = t >= 2.8;
  const fig = { x: 380, y: gy - E.FIG_H - 2, pose: look ? { ...E.pose('stand'), aF: 2.5, eF: .1, aB: .7, eB: 1.9, hd: .45 } : back ? { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.3, 3.6, 'back')), aF: E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.3, 3.6, 'back')).aF + Math.sin(t * 7) * .2, tor: Math.sin(t * 3.5) * .08 } : { ...E.pose('stand'), aF: 2.5, eF: .1 } };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  if (look) { const [bx, by] = E.hand(fig, 'B'); E.phone(c, bx, by - 20, 1.6); E.bubble(c, 'Their win', bx - 10, by - 150, E.p(t, .8, 1.0, 'back'), { size: 30 }); }
  // the thief
  const tin = E.p(t, .9, 1.7, 'out'), grab = t > 1.8, flee = E.p(t, 1.9, 2.6, 'in'), poof = 2.8;
  const tx = grab ? E.lerp(hx + 70, 1100, flee) : E.lerp(1150, hx + 80, tin);
  if (t > .9 && t < poof) { E.figure(c, { x: tx, y: gy - E.FIG_H * .9 - 2, s: .9, f: grab ? 1 : -1, color: '#666', pose: grab ? E.run(t * 16) : { ...E.walk(t * 5, .25), tor: .35 } }); c.save(); c.fillStyle = '#111'; c.fillRect(tx - 28, gy - E.FIG_H * .9 - 125, 56, 14); c.restore(); E.text(c, 'COMPARISON', tx, gy - E.FIG_H * .9 - 170, { size: 26, weight: 900, ls: 2, color: RED }); }
  E.particles(c, 960, gy - 200, t - poof, { n: 30, speed: 380, color: '#888', life: .6 });
  // trophy: in hand → stolen → flies back
  let ox = hx, oy = hy - 6;
  if (grab && t < poof) { ox = tx + 30; oy = gy - 260; }
  if (t >= poof) { const k = E.p(t, poof, 3.3, 'out'); ox = E.lerp(980, hx, k); oy = E.lerp(gy - 260, hy - 6, k) - Math.sin(k * Math.PI) * 160; }
  E.trophy(c, ox, oy + (t > 3.3 ? Math.sin(t * 7) * 6 : 0), .9, 1, t > poof ? 40 : 0);
  if (t > 3.3) for (let i = 0; i < 5; i++) { const q = ((t - 3.3) * 1.4 + i / 5) % 1; E.glowDot(c, hx + Math.cos(i * 1.3) * 90 * q, hy - 60 - q * 140, 12, 'rgba(245,197,66,.9)', 1 - q); }
  E.particles(c, hx, hy - 50, t - 3.3, { n: 40, speed: 480 });
} },
// 5 — Late bloomers still bloom
{ dur: 5, draw(c, t) {
  E.title(c, 'Still waiting for your moment?', W / 2, 420, t, -1, 2.6, { size: 48, weight: 800 });
  E.title(c, 'Late bloomers still bloom.', W / 2, 420, t, 2.8, 1e9, { size: 54, weight: 900, color: GOLD });
  const gy = 1280; E.ground(c, gy);
  const xs = [190, 360, 530, 700, 880], times = [.2, .7, 1.2, 1.7, 2.8];
  xs.forEach((x, i) => {
    const last = i === 4, k = E.p(t, times[i], times[i] + (last ? .9 : .6), last ? 'back' : 'out');
    const h = (last ? 340 : 220) * (.25 + .75 * k);
    c.save(); c.strokeStyle = GREEN; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, gy); c.lineTo(x + Math.sin(t * 2 + i) * 6, gy - h); c.stroke(); c.restore();
    const fx = x + Math.sin(t * 2 + i) * 6, fy = gy - h, r = (last ? 46 : 30) * k;
    if (k <= 0) { c.save(); c.fillStyle = '#3d7a4f'; c.beginPath(); c.ellipse(fx, fy, 12, 20, 0, 0, 7); c.fill(); c.restore(); return; }
    c.save(); c.translate(fx, fy); c.rotate(t * .4 + i); c.fillStyle = last ? GOLD : ['#e86a8a', '#b48af0', '#6ac0f0', '#f09a5a'][i];
    for (let p = 0; p < 6; p++) { c.rotate(Math.PI / 3); c.beginPath(); c.ellipse(0, -r * .8, r * .45, r * .8, 0, 0, 7); c.fill(); } c.fillStyle = '#fff4d0'; c.beginPath(); c.arc(0, 0, r * .4, 0, 7); c.fill(); c.restore();
  });
  E.text(c, 'YOU', 880, gy + 44, { size: 28, weight: 900, ls: 3, color: GOLD });
  E.particles(c, 880, gy - 340, t - 3.5, { n: 50, speed: 520 });
  E.rays(c, 880, gy - 340, 420, .3 * E.p(t, 3.4, 3.8), GOLD, 14, t * .3);
} },
] };
