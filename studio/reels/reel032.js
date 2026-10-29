// Reel 032 — "Don't look back" (≤31s, high motion, retention + reaction beats)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8', subCol) => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: subCol || (col === GOLD ? GOLD : '#8a8a8a'), align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const TEAL = '#5ee0c0';

const REEL = { title: "Don't look back", bpm: 120, scenes: [
// 1 — The bridge falls behind you: one looks back, one runs
{ dur: 5.6, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, X0 = 110, X1 = 900, PW = 40, CS = 175; // collapse speed px/s
  const cx = X0 + CS * t;
  const bridge = (gy, solidFrom) => {
    E.shaded(c, X1, gy, 300, 240, 4, '#3a3a3e', '#141416'); E.shaded(c, -200, gy, X0 + 200, 240, 4, '#3a3a3e', '#141416');
    for (let x = X0; x < X1; x += PW) {
      const tf = (x - X0) / CS;
      if (t < tf) { E.shaded(c, x + 1, gy - 6, PW - 3, 16, 3, '#a8835a', '#5e4428'); continue; }
      const dt = t - tf; if (dt > .9) continue;
      c.save(); c.globalAlpha = 1 - dt / .9; c.translate(x + PW / 2, gy + 900 * dt * dt); c.rotate(dt * 3 * (x % 80 ? 1 : -1)); E.shaded(c, -PW / 2, -8, PW - 3, 16, 3, '#a8835a', '#5e4428'); c.restore();
    }
    const rx = Math.max(X0, cx); if (rx < X1) { E.line(c, rx, gy - 70, X1, gy - 70, '#8a6a44', 4); for (let x = Math.ceil((rx - X0) / 120) * 120 + X0; x < X1; x += 120) E.line(c, x, gy - 6, x, gy - 70, '#8a6a44', 4); }
  };
  LB(c, 'LOOKS BACK', 540, 540); LB(c, 'RUNS FORWARD', 540, 1070, { color: t > 4.4 ? GOLD : '#e8e8e8' });
  // top: turns to look, slows, the bridge catches him
  c.save(); c.beginPath(); c.rect(-300, 0, 1700, gT + 240); c.clip();
  bridge(gT);
  const tl = 1.4, xr = t < tl ? 300 + 150 * t : 300 + 150 * tl + 55 * (t - tl), caught = cx >= xr - 10;
  const tc = (300 + 150 * tl - 55 * tl - X0 + 10) / (CS - 55);
  if (!caught) fig(c, { x: xr, y: hipOn(gT - 6, s), s, f: t > tl ? -1 : 1, color: '#bdbdbd', pose: t < tl ? E.run(t * 16) : { ...E.walk(t * 6), hd: .2 } });
  else { const dt = t - tc; if (dt < 1.2) fig(c, { x: xr + 30 * dt, y: hipOn(gT - 6, s) + 900 * dt * dt, s, rot: dt * 4, alpha: 1 - dt / 1.2, color: '#bdbdbd', pose: E.pose('jump') }); }
  c.restore();
  SAY(c, 'WAIT...', 520, 700, E.p(t, tl, tl + .3, 'back') * (1 - E.p(t, tc, tc + .2)));
  CNT(c, 50, 590, 'METERS', Math.round(Math.min(xr, cx) / 10), caught && t > tc ? 'LOOKED BACK' : 'RUNNING', '#e8e8e8', caught ? RED : null);
  // bottom: never turns around
  bridge(gB);
  const xb = Math.min(300 + 150 * t, X1 + 40), safe = xb >= X1 + 20, done = t > 4.4;
  if (done) { E.glowDot(c, xb + 20, hipOn(gB, s) - 60, 340, 'rgba(245,197,66,.35)', E.p(t, 4.4, 4.9)); }
  fig(c, { x: xb, y: hipOn(gB - (safe ? 0 : 6), s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 4.4) : E.run(t * 16) });
  if (!safe) for (let i = 0; i < 4; i++) E.line(c, xb - 60 - i * 26, hipOn(gB, s) - 40 + i * 18, xb - 100 - i * 26, hipOn(gB, s) - 40 + i * 18, 'rgba(255,255,255,.35)', 3);
  CNT(c, 50, 1110, 'METERS', Math.round(xb / 10), done ? 'MADE IT ACROSS' : 'EYES FORWARD', done ? GOLD : '#e8e8e8');
  E.particles(c, xb + 20, hipOn(gB, s) - 80, t - 4.4, { n: 50, speed: 500, grav: 300 });
} },
// 2 — Momentum: slows at the edge vs keeps the speed
{ dur: 4.4, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, E0 = 560, E1 = 770, land = 2.9, done = t > land + .2;
  const cliffs = gy => { E.shaded(c, -200, gy, E0 + 200, 110, 4, '#3a3a3e', '#121214'); E.shaded(c, E1, gy, 600, 110, 4, '#3a3a3e', '#121214'); E.line(c, -100, gy, E0, gy, '#7a7a7a', 3); E.line(c, E1, gy, 1180, gy, '#7a7a7a', 3); };
  LB(c, 'SLOWS DOWN', 540, 540); LB(c, 'KEEPS MOMENTUM', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  cliffs(gT); cliffs(gB);
  // top: brakes at the edge, then tries from a standstill
  c.save(); c.beginPath(); c.rect(-300, 0, 1700, gT + 200); c.clip();
  let tx = 120 + 400 * E.p(t, 0, 1.5, 'out'), ty = hipOn(gT, s), tp = t < 1.5 ? E.run(t * 14) : E.pose('stand'), tr = 0, ta = 1;
  if (t > 2.9) { const k = E.p(t, 2.9, 3.4, 'lin'); [tx, ty] = hop(k, 520, hipOn(gT, s), 640, hipOn(gT, s), 60); tp = E.pose('jump'); }
  if (t > 3.4) { const dt = t - 3.4; tx = 640; ty = hipOn(gT, s) + 900 * dt * dt; tr = dt * 3; ta = Math.max(0, 1 - dt / 1.1); }
  if (ta > 0) fig(c, { x: tx, y: ty, s, rot: tr, alpha: ta, color: '#bdbdbd', pose: tp });
  c.restore();
  SAY(c, 'TOO FAR.', 470, 690, E.p(t, 1.6, 1.9, 'back') * (1 - E.p(t, 2.8, 3.0)));
  CNT(c, 50, 590, 'SPEED', Math.round(t < 1.5 ? 30 * (1 - E.p(t, 0, 1.5, 'out')) : 0), 'KM/H', '#e8e8e8', t > 3.4 ? RED : null);
  // bottom: builds speed and flies over
  let bx = -40 + 560 * E.p(t, 0, 2.2, 'in'), by = hipOn(gB, s), bp = E.run(t * (10 + 10 * t));
  if (t > 2.2) { const k = E.p(t, 2.2, land, 'lin'); [bx, by] = hop(k, 520, hipOn(gB, s), 880, hipOn(gB, s), 190); bp = E.pose('jump'); }
  if (t > land) { bx = 880 + 30 * E.p(t, land, land + .4, 'out'); by = hipOn(gB, s); bp = done ? win(t, land + .2) : E.pose('crouch'); }
  if (t < land) for (let i = 0; i < 5; i++) E.line(c, bx - 60 - i * 24, by - 30 + i * 16, bx - 60 - i * 24 - 40 * E.p(t, .4, 2.2), by - 30 + i * 16, 'rgba(255,255,255,.35)', 3);
  if (done) E.glowDot(c, 900, by - 60, 340, 'rgba(245,197,66,.35)', E.p(t, land, land + .5));
  fig(c, { x: bx, y: by, s, color: done ? GOLD : '#fff', pose: bp });
  E.particles(c, 890, gB, t - land, { n: 24, speed: 260, color: '#9a9a9a', grav: 600, life: .6 });
  CNT(c, 50, 1110, 'SPEED', Math.round(t < land ? 32 * E.p(t, 0, 2.2, 'in') : 32 * (1 - E.p(t, land, land + .5))), done ? 'CLEARED IT' : 'KM/H', done ? GOLD : '#e8e8e8');
  E.particles(c, 900, by - 80, t - land - .2, { n: 45, speed: 480, grav: 300 });
} },
// 3 — The distractions fly at both: one has no shield
{ dur: 7, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, W = ['NOTIFICATION', 'DRAMA', 'GOSSIP', 'NEW VIDEO', 'SALE!', 'WHAT\'S NEW?', 'DRAMA', 'GOSSIP', 'NOTIFICATION', 'SCROLL'], goal = 5.6, done = t > goal;
  const shot = i => .1 + i * .5, SPD = 900;
  LB(c, 'NO SHIELD', 540, 540); LB(c, 'SHIELD UP', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  E.flag(c, 900, gT, 1, 0); E.flag(c, 900, gB, 1, 0);
  // top: every word hits and sticks; he stops moving
  const hitsT = W.filter((_, i) => t > shot(i) + (1180 - 380) / SPD).length;
  const tx = Math.min(380, 150 + 120 * t), down = hitsT >= 4;
  fig(c, { x: tx, y: down ? hipOn(gT, s) + 40 : hipOn(gT, s), s, color: '#bdbdbd', pose: down ? { ...E.pose('crouch'), hd: .5 } : { ...E.walk(t * 8), tor: .1 + .05 * hitsT } });
  W.forEach((w, i) => { const t0 = shot(i), x = 1180 - SPD * (t - t0); if (t < t0) return; const hitX = tx + 30;
    if (x > hitX) E.tag(c, w, x, gT - 150 - (i % 3) * 40, 1, -1, { size: 18, color: '#ddd', fill: '#1a1a1a' });
    else { const k = Math.min(i, 8); E.tag(c, w, hitX - 10 + (k % 2) * 30, gT - 220 + k * 22, 1, -1, { size: 16, color: '#c88', fill: '#1a0c0c' }); }
  });
  if (hitsT) E.flash(c, t, shot(0) + (1180 - 380) / SPD, .15, '229,72,77', .12);
  SAY(c, 'JUST ONE MORE.', 640, 680, E.p(t, 3.6, 3.9, 'back'));
  CNT(c, 50, 590, 'GOAL', `${Math.round(100 * (tx - 150) / 750)}%`, `${hitsT} HITS`, '#e8e8e8', hitsT ? RED : null);
  // bottom: the same words bounce off FOCUS
  const bx = done ? 860 : 150 + (860 - 150) * E.p(t, 0, goal, 'lin');
  const bo = { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, goal) : { ...E.walk(t * 8), aF: 1.5, eF: .4 } };
  fig(c, bo);
  if (!done) { const [hx, hy] = E.hand(bo); E.shaded(c, hx, hy - 70, 26, 130, 8, '#f7d36a', '#a07a1a'); c.save(); c.translate(hx + 13, hy - 5); c.rotate(-Math.PI / 2); E.text(c, 'FOCUS', 0, 0, { size: 18, weight: 800, family: MONO, color: '#1a1206' }); c.restore(); }
  let blocked = 0;
  W.forEach((w, i) => { const t0 = shot(i); if (t < t0) return; const xs = bx + 70, tHit = t0 + (1180 - xs) / SPD; const x = 1180 - SPD * (t - t0);
    if (x > xs || done && t < tHit) E.tag(c, w, x, gB - 150 - (i % 3) * 40, 1, -1, { size: 18, color: '#ddd', fill: '#1a1a1a' });
    else { blocked++; const dt = t - tHit; if (dt < .7) { c.save(); c.globalAlpha = 1 - dt / .7; c.translate(xs + 260 * dt, gB - 150 - (i % 3) * 40 - 520 * dt + 600 * dt * dt); c.rotate(dt * 8); E.tag(c, w, 0, 0, 1, -1, { size: 18, color: '#888', fill: '#1a1a1a' }); c.restore(); } }
  });
  if (done) { E.glowDot(c, 880, hipOn(gB, s) - 60, 340, 'rgba(245,197,66,.35)', E.p(t, goal, goal + .5)); }
  CNT(c, 50, 1110, 'GOAL', `${Math.round(100 * (bx - 150) / 710)}%`, `${blocked} BLOCKED`, done ? GOLD : '#e8e8e8', TEAL);
  E.particles(c, 880, hipOn(gB, s) - 80, t - goal, { n: 45, speed: 480, grav: 300 });
} },
// 4 — The countdown: one keeps resetting it, one jumps on 1
{ dur: 7.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, BY = 270;
  const tower = gy => {
    E.shaded(c, 130, gy - BY, 60, BY, 4, '#5a5a5e', '#2a2a2e'); E.shaded(c, 160, gy - BY - 10, 230, 16, 4, '#d8d8d8', '#8a8a8a');
    for (let i = 0; i < 6; i++) E.line(c, 110, gy - i * 45, 130, gy - i * 45, '#6a6a6a', 4);
    c.save(); const g = c.createLinearGradient(0, gy, 0, gy + 220); g.addColorStop(0, '#2c4a62'); g.addColorStop(1, 'rgba(10,16,22,0)'); c.fillStyle = g; c.fillRect(400, gy - 10, 800, 230);
    c.strokeStyle = 'rgba(200,225,245,.45)'; c.lineWidth = 3; c.beginPath(); for (let x = 400; x <= 1180; x += 10) { const y = gy - 10 + 4 * Math.sin(x * .03 + t * 3); x === 400 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore();
  };
  const big = (str, x, y, t0, col) => { const k = E.p(t, t0, t0 + .18, 'back'); if (k <= 0) return; const pulse = 1 + .06 * Math.sin((t - t0) * 14) * Math.exp(-(t - t0) * 2); E.text(c, str, x, y, { size: 120 * (.6 + .4 * k) * pulse, weight: 900, color: col, alpha: Math.min(1, k) }); };
  const seq = (list, x, y) => { let cur = null; list.forEach(([str, t0, col]) => { if (t >= t0) cur = [str, t0, col]; }); if (cur) big(cur[0], x, y, cur[1], cur[2]); };
  LB(c, 'HESITATES', 760, 560); LB(c, 'JUMPS', 760, 1090, { color: t > 4.6 ? GOLD : '#e8e8e8' });
  tower(gT); tower(gB);
  // top: 5, 4, 3... WAIT. 5, 4, 3, 2... MAYBE TOMORROW. Climbs down.
  seq([['5', .3, '#bbb'], ['4', .9, '#bbb'], ['3', 1.5, '#bbb'], ['WAIT.', 2.1, RED], ['5', 2.9, '#bbb'], ['4', 3.5, '#bbb'], ['3', 4.1, '#bbb'], ['2', 4.7, '#bbb'], ['NOPE.', 5.3, RED]], 760, 800);
  let tx = 360 + Math.sin(t * 9) * 6, ty = hipOn(gT - BY - 10, s), tp = { ...E.pose('stand'), hd: .4 + .15 * Math.sin(t * 7), aF: .4 + .3 * Math.sin(t * 8), aB: -.3 - .3 * Math.sin(t * 8) };
  if (t > 2.1 && t < 2.9) tx = 360 - 60 * E.p(t, 2.1, 2.4) + 60 * E.p(t, 2.6, 2.9);
  if (t > 5.3) tx = 360 - 60 * E.p(t, 5.3, 5.6);
  if (t > 5.8) { const k = E.p(t, 5.8, 7.0, 'lin'); tx = E.lerp(300, 100, Math.min(1, k * 3)); ty = E.lerp(hipOn(gT - BY - 10, s), hipOn(gT, s), Math.max(0, (k - .3) / .7)); tp = E.pose('climb'); if (k >= 1) tp = { ...E.pose('sad'), hd: .5 }; }
  fig(c, { x: tx, y: ty, s, f: t > 5.3 ? -1 : 1, color: '#bdbdbd', pose: tp });
  // bottom: 5, 4, 3, 2, 1, GO.
  seq([['5', .3, '#fff'], ['4', .9, '#fff'], ['3', 1.5, '#fff'], ['2', 2.1, '#fff'], ['1', 2.7, '#fff'], ['GO.', 3.3, TEAL]], 760, 1330);
  const jump = 3.3, splash = 4.1, up = 4.6, done = t > up;
  let bx = 360, by = hipOn(gB - BY - 10, s) + Math.abs(Math.sin(t * 6)) * 14, bp = { ...E.mix(E.pose('stand'), E.pose('crouch'), .35 * Math.abs(Math.sin(t * 6))), aF: -.6, aB: .6 }, br = 0, ba = 1;
  if (t > jump && t < splash) { const k = E.p(t, jump, splash, 'lin'); bx = E.lerp(360, 640, k); by = E.lerp(hipOn(gB - BY - 10, s), gB + 40, k * k) - Math.sin(k * Math.PI) * 120; bp = E.pose('jump'); br = k * 2.6; }
  if (t >= splash && t < up) { bx = 640; by = gB + 60; ba = 0; }
  if (t >= up) { bx = 640; by = hipOn(gB - 10, s) + 40; bp = win(t, up); }
  if (t > splash) { for (let i = 0; i < 3; i++) { const q = ((t - splash) * .9 + i / 3) % 1; c.save(); c.globalAlpha = .6 * (1 - q); c.strokeStyle = '#c8e0f0'; c.lineWidth = 3; c.beginPath(); c.ellipse(640, gB - 8, 40 + q * 220, 8 + q * 30, 0, 0, 7); c.stroke(); c.restore(); } E.particles(c, 640, gB - 10, t - splash, { n: 60, speed: 620, color: '#d8ecf8', grav: 900, life: 1.0 }); }
  if (done) { E.glowDot(c, 640, gB - 120, 380, 'rgba(245,197,66,.4)', E.p(t, up, up + .5)); E.rays(c, 640, gB - 120, 440, .25 * E.p(t, up, up + .5), GOLD, 14, t * .2); }
  if (ba > 0) fig(c, { x: bx, y: by, s, rot: br, color: done ? GOLD : '#fff', pose: bp });
  E.text(c, "DON'T OVERTHINK IT. JUMP.", 540, 440, { size: 32, weight: 700, ls: 4, color: GOLD, alpha: E.p(t, 5.2, 5.7) });
} },
] };
