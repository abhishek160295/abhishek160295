// Reel 035 — "Break your limits" (≤31s, high motion, retention + reaction beats)
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
const car = (c, x, gy, sc, col, spin = 0) => {
  c.save(); c.translate(x, gy); c.scale(sc, sc);
  E.shaded(c, -120, -96, 240, 62, 14, col === GOLD ? '#f7d36a' : '#9a9a9a', col === GOLD ? '#a07a1a' : '#4a4a4a');
  c.fillStyle = col === GOLD ? '#e0b040' : '#7a7a7a'; c.beginPath(); c.moveTo(-70, -96); c.lineTo(-42, -146); c.lineTo(50, -146); c.lineTo(80, -96); c.fill();
  c.fillStyle = '#1a1a1a'; c.beginPath(); c.moveTo(-54, -100); c.lineTo(-34, -138); c.lineTo(0, -138); c.lineTo(0, -100); c.fill(); c.beginPath(); c.moveTo(8, -100); c.lineTo(8, -138); c.lineTo(44, -138); c.lineTo(66, -100); c.fill();
  [-66, 66].forEach(wx => { c.save(); c.translate(wx, -30); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.fill(); c.rotate(spin); c.strokeStyle = '#8a8a8a'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke(); } c.restore(); });
  c.restore();
};

// traffic: light i is green when ((t + phase) mod 1.7) < .85; the bottom car stops only at a red light right in front of it
const LX = [380, 540, 700, 860], PH = [0, .55, 1.1, .3];
const green = (i, t) => ((t + PH[i]) % 1.7) < .85;
const DRIVE = (() => { const out = []; let x = 150; for (let k = 0; k <= 600; k++) { const t = k / 100; out.push(x); const next = LX.findIndex(l => l > x + 40); const blocked = next >= 0 && LX[next] - (x + 70) < 26 && !green(next, t); if (!blocked && x < 1000) x += 3.2; } return out; })();
const driveX = t => DRIVE[Math.max(0, Math.min(600, Math.round(t * 100)))];

const REEL = { title: 'Break your limits', bpm: 120, scenes: [
// 1 — The wall called MY LIMITS: stares at it vs swings at it every day
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .9, WX = 640, BW = 40, BH = 24, COLS = 4, PX = 520, L = 300, R = 46, CRASH = 4.7, done = t > CRASH + .4;
  const wall = (gy, rows, cracks, col) => { for (let r = 0; r < rows; r++) for (let q = 0; q < COLS; q++) { const off = r % 2 ? BW / 2 : 0, x = WX + q * BW - off * (q === 0 ? 0 : 1); E.shaded(c, Math.max(WX, x) + 1, gy - (r + 1) * BH + 1, BW - 2 - (q === 0 && off ? off : 0), BH - 2, 2, col, '#4a2a20'); }
    c.save(); c.strokeStyle = '#111'; c.lineWidth = 3; for (let i = 0; i < cracks; i++) { c.beginPath(); let x = WX + 6, y = gy - 60 - i * 45; c.moveTo(x, y); for (let j = 0; j < 4; j++) { x += 22 + 6 * E.rnd(i * 4 + j); y += (E.rnd(i + j * 3) - .5) * 40; c.lineTo(x, y); } c.stroke(); } c.restore();
    E.tag(c, 'MY LIMITS', WX + COLS * BW / 2, gy - rows * BH - 26, 1, -1, { size: 16, color: '#ddd', fill: '#141414' }); };
  LB(c, 'STARES AT THEM', 300, 540); LB(c, 'SWINGS AT THEM', 300, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: the wall keeps getting taller while he watches it
  const rowsT = 11 + Math.floor(3 * E.p(t, .5, 5.5, 'lin'));
  wall(gT, rowsT, 0, '#8a5a48');
  fig(c, { x: 340, y: t > 3.6 ? gT - 54 : hipOn(gT, s), s, color: '#bdbdbd', pose: t > 3.6 ? { ...E.pose('sit'), hd: -.3 } : { ...E.pose('arms'), hd: -.3 } });
  SAY(c, "THAT'S JUST HOW I AM.", 330, 680, E.p(t, 1.4, 1.7, 'back'));
  CNT(c, 50, 590, 'LIMITS', `${rowsT * 10}%`, 'GROWING', '#e8e8e8', RED);
  // bottom: a wrecking ball, swing after swing, until it all comes down
  const om = 2 * Math.PI / 1.1, A = E.lerp(.34, .46, E.p(t, 0, CRASH)), raw = A * Math.sin(om * t - Math.PI / 2 + .3);
  const contact = (WX - R - PX) / L, th = t < CRASH ? Math.min(raw, Math.asin(contact)) : raw * (1 - E.p(t, CRASH, CRASH + 1.2)) + .2 * E.p(t, CRASH, CRASH + .3) * (1 - E.p(t, CRASH + .3, CRASH + 1.2));
  const hits = t < CRASH ? Math.floor((t - .3 + .55) / 1.1 + .001) : 5;
  const bx = PX + L * Math.sin(th), by = gB - 400 + L * Math.cos(th);
  E.line(c, PX, gB, PX, gB - 410, '#5a5a5a', 10); E.line(c, PX - 40, gB - 410, PX + 40, gB - 410, '#5a5a5a', 10);
  if (t < CRASH + .05) wall(gB, 11, Math.min(5, hits), '#8a5a48');
  else { const dt = t - CRASH; E.glowDot(c, WX + 80, gB - 160, 480, 'rgba(245,197,66,.5)', E.p(t, CRASH, CRASH + .6)); E.rays(c, WX + 80, gB - 160, 520, .3 * E.p(t, CRASH, CRASH + .6), GOLD, 16, t * .2);
    for (let r = 0; r < 11; r++) for (let q = 0; q < COLS; q++) { const i = r * COLS + q, vx = 120 + 260 * E.rnd(i), vy = -160 - 260 * E.rnd(i + 7); let x = WX + q * BW + vx * dt, y = gB - (r + 1) * BH + vy * dt + 1400 * dt * dt; if (y > gB - BH) y = gB - BH - E.rnd(i + 3) * 10; c.save(); c.translate(x + BW / 2, y + BH / 2); c.rotate(Math.min(dt, .7) * (E.rnd(i + 9) - .5) * 8); E.shaded(c, -BW / 2, -BH / 2, BW - 2, BH - 2, 2, '#8a5a48', '#4a2a20'); c.restore(); } }
  E.line(c, PX, gB - 400, bx, by, '#9a9a9a', 4);
  c.save(); const g = c.createRadialGradient(bx - 14, by - 16, 6, bx, by, R); g.addColorStop(0, '#9a9a9a'); g.addColorStop(1, '#262626'); c.fillStyle = g; c.beginPath(); c.arc(bx, by, R, 0, 7); c.fill(); c.restore();
  for (let k = 0; k < 5; k++) { const th0 = .3 + .55 + k * 1.1 - 1.1 + .275; E.particles(c, WX, by, t - (.575 + k * 1.1), { n: 18, speed: 380, color: '#a06a50', grav: 900, life: .6, seed: k * 5 }); }
  for (let k = 0; k < 5; k++) E.shake(c, t, .575 + k * 1.1, .2, 6);
  const pushing = Math.sin(om * t - Math.PI / 2 + .3) < -.6 && t < CRASH;
  fig(c, { x: done ? 760 : 330, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, CRASH + .4) : pushing ? { ...E.pose('push'), tor: .5 } : E.pose('stand') });
  CNT(c, 50, 1110, 'DAY', Math.min(60, hits * 12), done ? 'LIMITS: 0' : `${hits} SWINGS`, done ? GOLD : '#e8e8e8');
} },
// 2 — Don't wait for every light to turn green
{ dur: 6, draw(c, t) {
  const gT = 950, gB = 1480, done = driveX(t) > 990;
  const lights = (gy) => LX.forEach((x, i) => { E.line(c, x, gy, x, gy - 210, '#5a5a5a', 6); E.rrect(c, x - 18, gy - 290, 36, 84, 8, '#141414', '#5a5a5a', 3);
    const gr = green(i, t); [[RED, !gr, gy - 266], [TEAL, gr, gy - 230]].forEach(([col, on, y]) => { if (on) E.glowDot(c, x, y, 40, col === RED ? 'rgba(229,72,77,.6)' : 'rgba(94,224,192,.6)'); c.save(); c.fillStyle = on ? col : '#2a2a2a'; c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill(); c.restore(); }); });
  const allGreen = LX.every((_, i) => green(i, t));
  LB(c, 'WAITS FOR ALL GREEN', 540, 520); LB(c, 'GOES ONE AT A TIME', 540, 1050, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  for (let x = 0; x < 1100; x += 90) { E.line(c, x, gT + 30, x + 50, gT + 30, '#4a4a4a', 4); E.line(c, x, gB + 30, x + 50, gB + 30, '#4a4a4a', 4); }
  // top: engine running, never leaves
  lights(gT); car(c, 150, gT, .55, '#9a9a9a', 0);
  E.particles(c, 70, gT - 20, (t * 2) % 1 * .5, { n: 6, speed: 80, color: '#6a6a6a', grav: -100, life: .5, seed: Math.floor(t * 2) });
  SAY(c, "I'LL GO WHEN IT'S ALL GREEN.", 230, 800, E.p(t, .8, 1.1, 'back'));
  CNT(c, 50, 580, 'WAITING', `${Math.round(365 * E.p(t, 0, 5.5, 'lin'))} DAYS`, allGreen ? 'ALL GREEN!' : 'STILL RED SOMEWHERE', '#e8e8e8', RED);
  // bottom: drives, stops at one red, goes again
  lights(gB);
  const x = driveX(t), moving = driveX(t + .03) > x;
  if (moving) for (let i = 0; i < 3; i++) E.line(c, x - 80 - i * 30, gB - 40 - i * 14, x - 120 - i * 30, gB - 40 - i * 14, 'rgba(255,255,255,.3)', 3);
  if (done) E.glowDot(c, 990, gB - 100, 360, 'rgba(245,197,66,.4)', 1);
  car(c, Math.min(x, 990), gB, .55, done ? GOLD : '#e8e8e8', t * (moving ? 12 : 0));
  const passed = LX.filter(l => x > l).length;
  CNT(c, 50, 1090, 'LIGHTS', `${passed}/4`, done ? 'ARRIVED' : moving ? 'MOVING' : 'WAITING ONE RED', done ? GOLD : '#e8e8e8');
  E.text(c, "THEY'LL NEVER ALL BE GREEN.", 540, 440, { size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 4.6, 5.0) });
} },
// 3 — Hurdles: stops at every one vs runs through in rhythm
{ dur: 6, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, HX = [330, 490, 650, 810], HN = ['BILLS', 'DOUBT', 'NO', 'FEAR'], done = t > 3.9;
  const hurdle = (x, gy, down) => { c.save(); c.translate(x, gy); if (down) c.rotate(1.2); E.line(c, -30, 0, -30, -90, '#8a8a8a', 5); E.line(c, 30, 0, 30, -90, '#8a8a8a', 5); E.line(c, -38, -90, 38, -90, '#e8e8e8', 8); c.restore(); };
  LB(c, 'STOPS AT EVERY ONE', 540, 540); LB(c, 'KEEPS THE RHYTHM', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  HX.forEach((x, i) => { E.tag(c, HN[i], x, gT + 40, 1, -1, { size: 15, color: '#bbb' }); E.tag(c, HN[i], x, gB + 40, 1, -1, { size: 15, color: done ? GOLD : '#bbb', fill: done ? '#2a2208' : '#0c0c0c' }); });
  // top: stop, climb over, stop, climb over... trips on the third
  const KT = [[0, 150, 'run'], [.7, 280, 'stop'], [1.0, 280, 'climb'], [1.5, 380, 'run'], [1.9, 440, 'stop'], [2.2, 440, 'climb'], [2.7, 545, 'run'], [3.1, 600, 'trip']];
  let tx = 150, ty = hipOn(gT, s), tp = E.run(t * 14), tr = 0;
  for (let i = KT.length - 1; i >= 0; i--) { if (t >= KT[i][0]) { const [t0, x0, mode] = KT[i], nx = KT[i + 1] ? KT[i + 1] : [t0 + 1, x0]; const k = Math.min(1, (t - t0) / (nx[0] - t0));
    if (mode === 'run') { tx = E.lerp(x0, nx[1], k); tp = E.run(t * 12); } else if (mode === 'stop') { tx = x0; tp = { ...E.pose('stand'), hd: .2 }; } else if (mode === 'climb') { [tx, ty] = hop(k, x0, hipOn(gT, s), nx[1] + (mode === 'climb' ? 0 : 0), hipOn(gT, s), 110); tx = E.lerp(x0, x0 + 100, k); tp = E.pose('climb'); }
    else { const kk = E.p(t, t0, t0 + .4, 'in'); tx = 600 + 40 * kk; tr = 1.3 * kk; ty = hipOn(gT, s) + 70 * kk; tp = { ...E.pose('crouch'), tor: 1 }; } break; } }
  HX.forEach((x, i) => hurdle(x, gT, i === 2 && t > 3.1));
  fig(c, { x: tx, y: ty, s, rot: tr, color: '#bdbdbd', pose: tp });
  E.flash(c, t, 3.4, .2, '229,72,77', .2);
  SAY(c, 'TOO MANY.', 700, 690, E.p(t, 3.7, 4.0, 'back'));
  CNT(c, 50, 590, 'CLEARED', t < 1.4 ? 0 : t < 2.6 ? 1 : 2, t > 3.2 ? 'TRIPPED' : 'STOP. CLIMB. STOP.', '#e8e8e8', t > 3.2 ? RED : null);
  // bottom: one stride, one jump, one stride, one jump
  HX.forEach(x => hurdle(x, gB, false));
  const bx = E.lerp(120, 940, E.p(t, 0, 3.9, 'lin'));
  let by = hipOn(gB, s), bp = E.run(t * 16);
  HX.forEach(x => { const d = (bx - x) / 90; if (Math.abs(d) < 1) { by -= Math.cos(d * Math.PI / 2) * 120; bp = E.pose('jump'); } });
  if (done) { by = hipOn(gB, s); bp = win(t, 3.9); E.glowDot(c, 940, by - 60, 340, 'rgba(245,197,66,.4)', E.p(t, 3.9, 4.3)); }
  if (!done) for (let i = 0; i < 4; i++) E.line(c, bx - 60 - i * 26, hipOn(gB, s) - 30 + i * 16, bx - 100 - i * 26, hipOn(gB, s) - 30 + i * 16, 'rgba(255,255,255,.3)', 3);
  fig(c, { x: done ? 940 : bx, y: by, s, color: done ? GOLD : '#fff', pose: bp });
  CNT(c, 50, 1110, 'CLEARED', HX.filter(x => bx > x + 40).length, done ? 'NEVER BROKE STRIDE' : 'IN RHYTHM', done ? GOLD : '#e8e8e8');
  E.particles(c, 940, by - 80, t - 3.9, { n: 50, speed: 500, grav: 300 });
} },
// 4 — The flywheel: motivation comes after action
{ dur: 8, draw(c, t) {
  const CX = 560, CY = 1040, R = 290, GY = 1420, s = 1.0, free = 4.6, done = t > free;
  const k = E.clamp((t - 1) / 4.5), th = .15 * t + (t > 1 ? 3.6 * 4.5 * Math.pow(k, 4) / 4 + (t > 5.5 ? 3.6 * (t - 5.5) : 0) : 0), om = .15 + (t > 5.5 ? 3.6 : 3.6 * k * k * k);
  if (t < 5.6) LB(c, 'THE FLYWHEEL', 540, 470, { size: 34, ls: 5 });
  else E.title(c, 'MOTIVATION COMES AFTER ACTION.', 540, 470, t, 5.6, 1e9, { size: 32, weight: 700, ls: 3, family: 'Inter', color: GOLD });
  slab(c, -100, 1180, GY, 200);
  E.line(c, CX, CY, CX - 120, GY, '#5a5a5a', 12); E.line(c, CX, CY, CX + 120, GY, '#5a5a5a', 12);
  const glow = E.p(t, 3, 6);
  if (glow > 0) E.glowDot(c, CX, CY, R + 220, 'rgba(245,197,66,.35)', glow);
  c.save(); c.translate(CX, CY); c.rotate(th);
  c.strokeStyle = glow > .5 ? GOLD : '#9a9a9a'; c.lineWidth = 22; c.beginPath(); c.arc(0, 0, R, 0, 7); c.stroke();
  c.lineWidth = 8; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); c.lineTo(Math.cos(a) * (R - 10), Math.sin(a) * (R - 10)); c.stroke(); }
  ['ACTION', 'RESULTS', 'CONFIDENCE', 'MOTIVATION'].forEach((w, i) => { const a = i * Math.PI / 2 + Math.PI / 4; c.save(); c.rotate(a); c.translate(R * .62, 0); c.rotate(Math.PI / 2); E.tag(c, w, 0, 0, 1, -1, { size: 18, color: glow > .5 ? GOLD : '#ddd', fill: glow > .5 ? '#2a2208' : '#141414' }); c.restore(); });
  c.fillStyle = '#d8d8d8'; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill(); c.restore();
  // motion blur arcs once it's fast
  if (om > 1.5) { c.save(); c.globalAlpha = Math.min(.5, (om - 1.5) / 4); c.strokeStyle = '#fff'; c.lineWidth = 6; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(CX, CY, R + 30, th + i * Math.PI / 2, th + i * Math.PI / 2 + .5); c.stroke(); } c.restore(); E.particles(c, CX + R * Math.cos(th * 3), CY + R * Math.sin(th * 3), (t * 4) % 1 * .25, { n: 8, speed: 320, grav: 300, life: .25, seed: Math.floor(t * 4) }); }
  // him: pushes hard at the start, then steps back while it spins on its own
  const heavy = t < free;
  const px = heavy ? CX - R - 40 + Math.sin(t * 5) * 6 : E.lerp(CX - R - 40, 150, E.p(t, free, free + .6));
  fig(c, { x: px, y: hipOn(GY, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, free + .6) : { ...E.pose('push'), tor: .75 - .25 * k, dy: Math.sin(t * 10) * 2 } });
  CNT(c, 60, 560, 'RPM', Math.round(om * 60 / (2 * Math.PI) * 20), heavy ? `EFFORT: ${Math.round(100 - 70 * k)}%` : 'EFFORT: 0%. IT SPINS.', done ? GOLD : '#e8e8e8');
  E.particles(c, CX, CY - R, t - free, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
] };
