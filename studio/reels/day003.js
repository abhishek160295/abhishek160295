// Day 003 — "Pressure makes diamonds"
const facet = (c, pts, fill, stroke) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.stroke(); } };

const REEL = { title: 'Pressure makes diamonds', bpm: 150, scenes: [
// 1 — Coal under pressure → diamond
{ dur: 6.4, cues: [[.7, 'impact'], [1.5, 'impact'], [2.3, 'impact'], [3.7, 'pop']], draw(c, t) {
  E.text(c, 'Feeling the pressure?', W / 2, 470, { size: 54, weight: 800, alpha: 1 - E.p(t, 3.3, 3.6) });
  E.title(c, 'Pressure is how', W / 2, 440, t, 3.9, 1e9, { size: 56, weight: 800, color: ICE, glow: 24 });
  E.title(c, 'diamonds are made.', W / 2, 515, t, 4.1, 1e9, { size: 56, weight: 800, color: ICE, glow: 24 });
  const gy = 1300, cx = 540;
  E.ground(c, gy, 140, 940);
  const hits = [.7, 1.5, 2.3], labels = ['Rejection', 'Failure', 'Doubt'];
  let squash = 0; hits.forEach(h => { if (t > h) squash += .1; });
  E.shake(c, t, .7, .3, 12); E.shake(c, t, 1.5, .3, 16); E.shake(c, t, 2.3, .3, 20);
  const lift = E.p(t, 3.1, 3.6, 'in'), dia = E.p(t, 3.6, 4.1, 'back');
  const coalH = 150 * (1 - squash), coalW = 200 * (1 + squash * .4);
  // weights
  let stackY = gy - coalH;
  hits.forEach((h, i) => {
    const fall = E.p(t, h - .35, h, 'in'); if (fall <= 0) return;
    const ww = 360 - i * 50, wh = 90, y = E.lerp(-200, stackY - wh, fall) - lift * 1400;
    E.rrect(c, cx - ww / 2, y, ww, wh, 10, '#262626', '#8a8a8a', 4);
    E.text(c, labels[i], cx, y + wh / 2, { size: 34, weight: 800, ls: 2, color: '#d0d0d0' });
    stackY = y;
  });
  if (dia <= 0) {
    // coal lump
    c.save(); c.translate(cx, gy - coalH / 2); c.scale(coalW / 200, coalH / 150);
    const P = [[-100, 20], [-70, -60], [-10, -75], [60, -55], [100, 0], [80, 70], [0, 75], [-80, 65]];
    c.lineWidth = 4; facet(c, P, '#333', '#9a9a9a');
    facet(c, [[-70, -60], [-10, -75], [0, 0]], '#4a4a4a'); facet(c, [[60, -55], [100, 0], [0, 0]], '#404040'); facet(c, [[-100, 20], [0, 0], [-80, 65]], '#2a2a2a');
    if (t > 2.9) { const glow = E.p(t, 2.9, 3.6); E.glowDot(c, 0, 0, 160, `rgba(191,232,255,${.6 * glow})`); }
    c.restore();
  } else {
    // diamond
    const s = dia * 1.25, rot = Math.sin(t * 2) * .06;
    c.save(); c.translate(cx, gy - 120); c.rotate(rot); c.scale(s, s);
    c.shadowColor = ICE; c.shadowBlur = 50; c.lineWidth = 3;
    facet(c, [[-110, -30], [-60, -80], [60, -80], [110, -30], [0, 100]], 'rgba(191,232,255,.9)', '#fff');
    c.shadowBlur = 0;
    facet(c, [[-110, -30], [110, -30], [0, 100]], 'rgba(120,190,240,.85)', '#fff');
    facet(c, [[-60, -80], [-25, -30], [-110, -30]], 'rgba(230,248,255,.95)', '#fff');
    facet(c, [[60, -80], [25, -30], [110, -30]], 'rgba(200,235,255,.95)', '#fff');
    facet(c, [[-60, -80], [60, -80], [25, -30], [-25, -30]], 'rgba(255,255,255,.95)', '#fff');
    facet(c, [[-25, -30], [25, -30], [0, 100]], 'rgba(170,215,250,.9)', '#fff');
    c.restore();
    const sp = (t * 1.3) % 1; E.rays(c, cx - 60, gy - 200, 90 * Math.sin(sp * Math.PI), 1, '#fff', 4, .4);
    E.rays(c, cx, gy - 120, 650, .25 * dia, ICE, 18, t * .2);
  }
  E.particles(c, cx, gy - 120, t - 3.65, { n: 50, speed: 700, color: ICE, grav: 100 });
  E.flash(c, t, 3.65, .45, '191,232,255', .5);
} },
// 2 — Bow and arrow
{ dur: 6.4, cues: [[.5, 'rise'], [3.0, 'whoosh'], [3.3, 'impact']], draw(c, t) {
  E.title(c, 'Life pulling you back?', W / 2, 470, t, .05, 3.0, { size: 54, weight: 800 });
  E.title(c, "It's launching you forward.", W / 2, 470, t, 3.5, 1e9, { size: 54, weight: 800, color: GOLD, glow: 24 });
  const gy = 1250, by = 960, bx = 330, pull = E.p(t, .4, 2.8, 'out') * (1 - E.p(t, 2.95, 3.0)), pd = 150 * pull;
  E.ground(c, gy, 90, 990, '#333');
  // archer
  E.shake(c, t, 3.3, .35, 14);
  const fig = { x: bx - 150 - pd * .3, y: gy - E.FIG_H - 2, pose: { ...E.pose('draw'), aF: E.lerp(1.4, 1.1, pull), eF: E.lerp(1.9, 2.3, pull) } };
  E.figure(c, fig);
  // bow
  c.save(); c.strokeStyle = '#d9d9d9'; c.lineWidth = 9; c.lineCap = 'round';
  c.beginPath(); c.moveTo(bx - 20, by - 190); c.quadraticCurveTo(bx + 90, by, bx - 20, by + 190); c.stroke();
  c.lineWidth = 3; c.strokeStyle = '#aaa'; c.beginPath(); c.moveTo(bx - 20, by - 190); c.lineTo(bx - 20 - pd, by); c.lineTo(bx - 20, by + 190); c.stroke(); c.restore();
  if (pull > .1 && t < 3) E.text(c, 'SETBACKS', bx - 20 - pd * .5, by + 240, { size: 30, weight: 800, ls: 4, color: RED, alpha: pull, glow: 12 });
  // target
  const tx = 930, ty = by;
  [[90, '#3a3a3a'], [68, '#ddd'], [46, '#3a3a3a'], [24, GOLD]].forEach(([r, col]) => { c.save(); c.fillStyle = col; c.beginPath(); c.ellipse(tx, ty, r * .45, r, 0, 0, 7); c.fill(); c.restore(); });
  E.line(c, tx, ty + 90, tx, gy, '#555', 6);
  // arrow
  const fly = E.p(t, 3.0, 3.3, 'in'), ax = t < 3 ? bx - 20 - pd + 170 : E.lerp(bx - 20 + 170, tx + 10, fly);
  if (t > 3 && t < 3.3) { const g = c.createLinearGradient(ax - 400, 0, ax, 0); g.addColorStop(0, 'rgba(245,197,66,0)'); g.addColorStop(1, 'rgba(245,197,66,.7)'); c.fillStyle = g; c.fillRect(ax - 400, ty - 5, 400, 10); }
  c.save(); c.strokeStyle = t > 3.3 ? GOLD : '#fff'; c.fillStyle = c.strokeStyle; c.lineWidth = 6; c.shadowColor = GOLD; c.shadowBlur = t > 2.9 ? 20 : 0;
  c.beginPath(); c.moveTo(ax - 180, ty); c.lineTo(ax, ty); c.stroke();
  c.beginPath(); c.moveTo(ax + 16, ty); c.lineTo(ax - 8, ty - 13); c.lineTo(ax - 8, ty + 13); c.fill();
  c.beginPath(); c.moveTo(ax - 180, ty); c.lineTo(ax - 200, ty - 16); c.moveTo(ax - 180, ty); c.lineTo(ax - 200, ty + 16); c.stroke(); c.restore();
  E.glowDot(c, tx, ty, 220, 'rgba(245,197,66,.5)', E.p(t, 3.3, 3.5) * (1 - E.p(t, 4, 6.4) * .5));
  E.particles(c, tx, ty, t - 3.3, { n: 45, speed: 600 });
  E.flash(c, t, 3.3, .3, '245,197,66', .3);
} },
// 3 — Drop the excuses
{ dur: 6.4, cues: [[.7, 'whoosh'], [1.8, 'whoosh'], [2.9, 'impact'], [4.0, 'rise'], [4.75, 'impact']], draw(c, t) {
  E.title(c, 'Carrying excuses?', W / 2, 470, t, .05, 2.7, { size: 54, weight: 800 });
  E.title(c, 'Drop them.', W / 2, 470, t, 2.9, 4.6, { size: 60, weight: 900, color: RED, glow: 20 });
  E.title(c, 'Watch how high you go.', W / 2, 470, t, 4.8, 1e9, { size: 54, weight: 800, color: GOLD, glow: 24 });
  const gy = 1350, ly = 860, lx = 640, s = .8;
  E.ground(c, gy, 90, 640); E.line(c, 640, gy, 640, ly, '#6b6b6b', 5); E.ground(c, ly, 640, 990);
  E.flash(c, t, 4.75, .3, '245,197,66', .25);
  const hop = (a, b, hgt) => { const k = E.p(t, a, b, 'lin'); return k > 0 && k < 1 ? Math.sin(k * Math.PI) * hgt : 0; };
  let x = 380, y = gy - E.FIG_H * s - 2, pose = E.pose('stand');
  const jh = hop(.6, 1.2, 140) + hop(1.7, 2.3, 120);
  if (jh > 0) { y -= jh; pose = E.pose('jump'); }
  else if ((t > .45 && t < .6) || (t > 1.55 && t < 1.7)) pose = E.pose('crouch');
  if (t > 3.9) {
    const k = E.p(t, 4.0, 4.75, 'inOut');
    x = E.lerp(380, 800, k); y = E.lerp(gy, ly, k) - Math.sin(k * Math.PI) * 380 - E.FIG_H * s - 2;
    pose = k < 1 ? E.pose('jump') : E.mix(E.pose('crouch'), E.pose('cheer'), E.p(t, 4.75, 5.1, 'back'));
    if (t < 4.0) pose = E.pose('crouch');
  }
  // bags hanging from the figure
  const bags = [['NO TIME', 2.9], ['TIRED', 3.2], ['TOMORROW', 3.5]];
  bags.forEach(([lab, td], i) => {
    const dropK = E.p(t, td, td + .35, 'in');
    const bx = x - 70 - i * 18 + (i === 1 ? 35 : 0), by0 = y + 10 + i * 46;
    const by = dropK > 0 ? E.lerp(by0, gy - 34, dropK) : by0, fx = dropK > 0 ? 260 - i * 90 + E.lerp(bx - (260 - i * 90), 0, 1 - dropK) : bx;
    c.save(); c.globalAlpha = dropK >= 1 ? .55 : 1;
    if (dropK <= 0) E.line(c, x, y - 50, fx + 30, by - 30, '#777', 3);
    E.rrect(c, fx - 70, by - 32, 140, 64, 18, '#3a2f22', '#a08060', 4);
    E.text(c, lab, fx, by, { size: 20, weight: 900, ls: 1, color: '#e5d4b5' });
    c.restore();
  });
  E.figure(c, { x, y, s, pose, glow: t > 4.75 ? 22 : 0 });
  E.particles(c, 800, ly - 40, t - 4.75, { n: 40, speed: 500 });
} },
// 4 — The crowd vs your path
{ dur: 6.4, cues: [[2.2, 'rise'], [4.7, 'pop']], draw(c, t) {
  E.title(c, 'Everyone is going that way.', W / 2, 440, t, .05, 2.3, { size: 50, weight: 800 });
  E.title(c, 'Your path will feel lonely.', W / 2, 440, t, 2.5, 4.4, { size: 50, weight: 800, color: '#ccc' });
  E.title(c, "That's how you know", W / 2, 420, t, 4.6, 1e9, { size: 54, weight: 800, color: GOLD, glow: 24 });
  E.title(c, "it's yours.", W / 2, 495, t, 4.8, 1e9, { size: 54, weight: 800, color: GOLD, glow: 24 });
  const gy = 1360, s = .6;
  E.ground(c, gy, 0, W, '#444');
  for (let i = 0; i < 11; i++) {
    const x = ((i * 115 + t * 110) % (W + 230)) - 115;
    E.figure(c, { x, y: gy - E.FIG_H * s - 2, s, pose: E.walk(t * 8 + i * 1.3), color: '#5c5c5c' });
  }
  // stairs rising out of the crowd
  const n = 8, sx = 470, sw = 62, sh = 58;
  for (let i = 0; i < n; i++) { const a = E.p(t, 2.2 + i * .07, 2.5 + i * .07, 'back'); if (a > 0) E.rrect(c, sx + i * sw, gy - 150 - i * sh, sw - 6, 14 * a, 4, i === n - 1 ? GOLD : '#d8d8d8'); }
  let x, y, pose;
  if (t < 2.0) { x = 440; y = gy - E.FIG_H * s - 2; pose = E.walk(t * 8); }
  else if (t < 2.4) { x = 440; y = gy - E.FIG_H * s - 2; pose = E.pose('stand'); }
  else {
    const k = E.p(t, 2.5, 4.6, 'inOut'), step = Math.min(n - 1, k * n);
    x = E.lerp(440, sx + (n - .5) * sw, k); const i = Math.floor(step);
    y = gy - 150 - i * sh - E.FIG_H * s - 2 - (k > 0 ? 0 : 0);
    if (k <= 0) y = gy - E.FIG_H * s - 2;
    else if (k < .08) y = E.lerp(gy - E.FIG_H * s - 2, gy - 150 - E.FIG_H * s - 2, k / .08);
    pose = k < 1 ? E.walk(k * 40) : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.7, 5.0, 'back'));
  }
  E.glowDot(c, x, y - 40, 260, 'rgba(245,197,66,.35)', E.p(t, 4.6, 5));
  E.figure(c, { x, y, s, pose, glow: t > 2.2 ? 20 : 6 });
} },
// 5 — Cocoon → butterfly
{ dur: 6.4, cues: [[.4, 'rise'], [3.3, 'impact']], draw(c, t) {
  E.title(c, 'Struggling right now?', W / 2, 440, t, .05, 2.6, { size: 54, weight: 800 });
  E.title(c, 'The struggle is', W / 2, 440, t, 2.8, 4.7, { size: 54, weight: 800 });
  E.title(c, 'building your wings.', W / 2, 515, t, 2.95, 4.7, { size: 54, weight: 800 });
  E.title(c, 'Keep going.', W / 2, 470, t, 4.9, 1e9, { size: 72, weight: 900, color: GOLD, glow: 30 });
  const bx = 540, by = 800;
  // branch
  c.save(); c.strokeStyle = '#7a5a40'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, by - 40); c.quadraticCurveTo(300, by - 10, 760, by - 30); c.stroke();
  c.lineWidth = 8; c.beginPath(); c.moveTo(620, by - 26); c.quadraticCurveTo(680, by - 80, 720, by - 110); c.stroke(); c.restore();
  E.line(c, bx, by - 22, bx, by + 20, '#aaa', 3);
  const emerge = t >= 3.3, shakeA = E.p(t, .4, 3.2, 'in') * 0.25;
  if (!emerge) {
    c.save(); c.translate(bx, by + 20); c.rotate(Math.sin(t * (8 + t * 6)) * shakeA);
    c.fillStyle = '#5b4a3a'; c.strokeStyle = '#8c745b'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, 110, 58, 115, 0, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = '#4a3b2e'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(0, 40 + i * 32, 52 - Math.abs(i - 2) * 5, 8, 0, 0, Math.PI); c.stroke(); }
    const cr = E.p(t, 1.6, 3.2); c.strokeStyle = '#fff'; c.lineWidth = 3; c.shadowColor = GOLD; c.shadowBlur = 16 * cr;
    c.beginPath(); const pts = [[0, 20], [-14, 60], [10, 95], [-8, 140], [12, 180]]; const m = Math.floor(cr * (pts.length - 1));
    for (let i = 0; i <= m; i++) i ? c.lineTo(...pts[i]) : c.moveTo(...pts[i]); c.stroke();
    E.glowDot(c, 0, 110, 120, 'rgba(245,197,66,.6)', cr);
    c.restore();
  } else {
    // shell halves fall away
    const f = E.p(t, 3.3, 4.2, 'in');
    for (const d of [-1, 1]) { c.save(); c.translate(bx + d * (20 + f * 160), by + 130 + f * 700); c.rotate(d * f * 2); c.globalAlpha = 1 - f; c.fillStyle = '#5b4a3a'; c.beginPath(); c.ellipse(0, 0, 30, 110, 0, d > 0 ? -Math.PI / 2 : Math.PI / 2, d > 0 ? Math.PI / 2 : Math.PI * 1.5); c.fill(); c.restore(); }
    // butterfly
    const k = E.p(t, 3.3, 6.4, 'out');
    const px = bx + Math.sin(k * 5) * 160 * k, py = by + 130 - k * 230, flap = Math.abs(Math.sin(t * 12)) * .75 + .25, sc = E.lerp(.5, 1.2, E.p(t, 3.3, 3.8, 'back'));
    for (let i = 1; i < 18; i++) { const kk = Math.max(0, k - i * .015); const tx = bx + Math.sin(kk * 5) * 160 * kk, ty = by + 130 - kk * 230; E.glowDot(c, tx, ty, 14, 'rgba(245,197,66,.8)', 1 - i / 18); }
    c.save(); c.translate(px, py); c.scale(sc, sc); c.shadowColor = GOLD; c.shadowBlur = 40;
    for (const d of [-1, 1]) {
      c.save(); c.scale(d * flap, 1);
      const g = c.createLinearGradient(0, -100, 120, 60); g.addColorStop(0, '#fff3c4'); g.addColorStop(1, GOLD);
      c.fillStyle = g; c.beginPath(); c.moveTo(0, -5); c.bezierCurveTo(40, -130, 150, -110, 120, -20); c.bezierCurveTo(110, 10, 40, 10, 0, 0); c.fill();
      c.fillStyle = '#e8a92a'; c.beginPath(); c.moveTo(0, 5); c.bezierCurveTo(50, 20, 110, 60, 70, 100); c.bezierCurveTo(40, 120, 10, 60, 0, 10); c.fill();
      c.restore();
    }
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, 10, 9, 50, 0, 0, 7); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(-3, -38); c.quadraticCurveTo(-15, -70, -26, -78); c.moveTo(3, -38); c.quadraticCurveTo(15, -70, 26, -78); c.stroke();
    c.restore();
  }
  E.particles(c, bx, by + 120, t - 3.3, { n: 60, speed: 700, grav: 120 });
  E.flash(c, t, 3.3, .4, '245,197,66', .45);
} },
] };
