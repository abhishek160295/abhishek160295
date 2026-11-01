// Reel 045 — "Find your water" (≤25s, Shorts-first: fun, satisfying payoffs, likeable)
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const PRIN = (c, str, y = 470, col = '#e8e8e8', a = 1) => E.text(c, str, 540, y, { size: 30, weight: 600, ls: 3, color: col, alpha: a });
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8', subCol) => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 44, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 72, { size: 16, weight: 800, family: MONO, ls: 2, color: subCol || (col === GOLD ? GOLD : '#8a8a8a'), align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const PANEL = (c, y0, y1, tab, gold = false) => {
  c.save(); c.fillStyle = 'rgba(255,255,255,.035)'; c.strokeStyle = gold ? 'rgba(245,197,66,.8)' : '#34343a'; c.lineWidth = 3; c.beginPath(); c.roundRect(70, y0, 920, y1 - y0, 22); c.fill(); c.stroke(); c.restore();
  c.save(); c.font = `800 18px ${MONO}`; const w = c.measureText(tab).width + 28; c.restore();
  E.rrect(c, 92, y0 + 18, w, 34, 8, gold ? '#2a2208' : '#1c1c20', gold ? GOLD : '#4a4a50', 2);
  E.text(c, tab, 92 + w / 2, y0 + 36, { size: 18, weight: 800, family: MONO, ls: 2, color: gold ? GOLD : '#e8e8e8' });
};
const P1 = [560, 980], P2 = [1010, 1430], gT = 940, gB = 1400;
const clip = (c, P, fn) => { c.save(); c.beginPath(); c.roundRect(70, P[0], 920, P[1] - P[0], 22); c.clip(); fn(); c.restore(); };
const fish = (c, x, y, rot, col, sc = 1, flip = 1) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc * flip, sc); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 46, 24, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-40, 0); c.lineTo(-70, -22); c.lineTo(-70, 22); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(24, -6, 5, 0, 7); c.fill(); c.restore(); };

const REEL = { title: 'Find your water', bpm: 120, scenes: [
// 1 — Don't judge a fish by how it climbs. Find your water.
{ dur: 6, draw(c, t) {
  const done = t > 4.4;
  PRIN(c, "DON'T JUDGE A FISH BY HOW IT CLIMBS.", 450);
  PRIN(c, 'FIND YOUR WATER.', 505, GOLD, E.p(t, 4.0, 4.4));
  PANEL(c, ...P1, 'CLIMBING THEIR TREE'); PANEL(c, ...P2, 'FOUND ITS WATER', done);
  const judges = (gy, good) => [0, 1, 2].forEach(i => { const x = 760 + i * 70; fig(c, { x, y: hipOn(gy, .55), s: .55, f: -1, color: '#7a7a7a', pose: good ? { ...E.pose('cheer'), aF: 2.4 + Math.sin(t * 8 + i) * .3, aB: -2.4 } : { ...E.pose('stand'), aF: .9, eF: 1.6, hd: .3 * Math.sin(t * 6 + i) } }); });
  // top: flops at the tree, slides down, the judges shake their heads
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    E.shaded(c, 420, P1[0] + 60, 50, gT - P1[0] - 60, 6, '#6a5a4a', '#3a2a1a'); c.save(); c.fillStyle = '#3a4a2e'; c.beginPath(); c.arc(445, P1[0] + 70, 110, 0, 7); c.fill(); c.restore();
    const ph = (t % 1.2) / 1.2, up = ph < .5 ? Math.sin(ph * Math.PI) * 140 : 140 * (1 - (ph - .5) * 2);
    fish(c, 380, gT - 30 - Math.max(0, up), -1.2 + Math.sin(t * 16) * .3, '#9a9a9a');
    judges(gT, false); [0, 1, 2].forEach(i => E.tag(c, 'FAIL', 760 + i * 70, gT - 150, t, 1.2 + i * .3, { size: 14, color: RED, fill: '#1e0a0a' })); });
  SAY(c, "I'M STUPID.", 300, 700, E.p(t, 2.6, 2.9, 'back'));
  // bottom: in the water it flies
  clip(c, P2, () => { const wl = gB - 200; c.save(); const g = c.createLinearGradient(0, wl, 0, gB); g.addColorStop(0, '#2c4458'); g.addColorStop(1, '#0c141a'); c.fillStyle = g; c.fillRect(70, wl, 700, gB - wl); c.strokeStyle = '#c8dceb'; c.lineWidth = 3; c.beginPath(); for (let x = 70; x <= 770; x += 10) { const y = wl + 5 * Math.sin(x * .03 + t * 3); x === 70 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore();
    E.line(c, 770, gB, 970, gB, '#4a4a50', 3); judges(gB, done);
    const jumpT = (t % 2.0) / 2.0, jmp = t > 1.5 && jumpT > .6; let x, y, rot;
    if (jmp) { const k = (jumpT - .6) / .4; x = E.lerp(300, 560, k); y = wl - Math.sin(k * Math.PI) * 220; rot = -.8 + 1.6 * k; } else { x = 160 + ((t * 260) % 540); y = wl + 80 + Math.sin(t * 6) * 30; rot = Math.cos(t * 6) * .2; }
    if (done) E.glowDot(c, x, y, 220, 'rgba(245,197,66,.45)', E.p(t, 4.4, 4.8));
    fish(c, x, y, rot, done ? GOLD : '#e8e8e8', 1.1);
    if (jmp && jumpT > .95) E.particles(c, 560, wl, (jumpT - .95) * 2, { n: 20, speed: 260, color: '#d8ecf8', grav: 700, life: .4 }); });
} },
// 2 — The picture isn't done without you
{ dur: 5.5, draw(c, t) {
  const S = 140, C = 4, R = 3, X0 = 260, Y0 = 720, fin = 3.8, done = t > fin;
  PRIN(c, "THE PICTURE ISN'T COMPLETE WITHOUT YOU.", 470, done ? GOLD : '#e8e8e8');
  const pic = (q, r) => { c.save(); c.beginPath(); c.rect(X0 + q * S, Y0 + r * S, S, S); c.clip(); const g = c.createLinearGradient(0, Y0, 0, Y0 + R * S); g.addColorStop(0, done ? '#3a2a10' : '#2a2a30'); g.addColorStop(1, done ? '#f7d36a' : '#8a8a90'); c.fillStyle = g; c.fillRect(X0, Y0, C * S, R * S);
    c.fillStyle = done ? '#fff3c4' : '#d8d8d8'; c.beginPath(); c.arc(X0 + 2.6 * S, Y0 + 1.6 * S, 50, 0, 7); c.fill(); c.fillStyle = done ? '#a07a1a' : '#4a4a50'; c.beginPath(); c.moveTo(X0, Y0 + R * S); c.lineTo(X0 + 1.4 * S, Y0 + 1.2 * S); c.lineTo(X0 + 2.4 * S, Y0 + R * S); c.fill(); c.beginPath(); c.moveTo(X0 + 1.8 * S, Y0 + R * S); c.lineTo(X0 + 3.2 * S, Y0 + .9 * S); c.lineTo(X0 + C * S, Y0 + R * S); c.fill(); c.restore(); };
  const piece = (x, y, q, r, a = 1) => { c.save(); c.globalAlpha = a; c.translate(x - (X0 + q * S), y - (Y0 + r * S)); pic(q, r); c.restore(); c.save(); c.globalAlpha = a; c.strokeStyle = done ? GOLD : '#0a0a0a'; c.lineWidth = 4; c.strokeRect(x, y, S, S); c.restore(); };
  E.rrect(c, X0 - 14, Y0 - 14, C * S + 28, R * S + 28, 10, '#0c0c0c', done ? GOLD : '#3a3a3a', 4);
  const MISS = [2, 1]; let placed = 0;
  for (let r = 0; r < R; r++) for (let q = 0; q < C; q++) { if (q === MISS[0] && r === MISS[1]) continue; const i = r * C + q, t0 = .1 + placed * .27, k = E.p(t, t0, t0 + .35, 'out'); placed++; if (k <= 0) continue;
    const sx = E.rnd(i) < .5 ? -200 : 1200, sy = 500 + E.rnd(i + 3) * 1000; piece(E.lerp(sx, X0 + q * S, k), E.lerp(sy, Y0 + r * S, k), q, r); if (k < 1 && k > .9) E.particles(c, X0 + q * S + 60, Y0 + r * S + 60, (k - .9) * 3, { n: 6, speed: 120, color: '#ddd', grav: 0, life: .3 }); }
  if (!done) { E.rrect(c, X0 + MISS[0] * S + 6, Y0 + MISS[1] * S + 6, S - 12, S - 12, 8, null, GOLD, 3); }
  const yk = E.p(t, fin - .5, fin, 'inOut'), yx = E.lerp(200, X0 + MISS[0] * S, yk), yy = E.lerp(1250, Y0 + MISS[1] * S, yk) + (t < fin - .5 ? Math.sin(t * 20) * 3 : 0);
  piece(yx, yy, ...MISS); if (!done) E.tag(c, 'YOU', yx + 60, yy + 60, 1, -1, { size: 18, color: GOLD, fill: '#2a2208' });
  SAY(c, 'DO I EVEN FIT?', 330, 1190, E.p(t, 1.6, 1.9, 'back') * (1 - E.p(t, fin - .6, fin - .4)));
  if (done) { E.flash(c, t, fin, .25, '255,230,170', .35); E.glowDot(c, X0 + 2 * S, Y0 + 1.5 * S, 560, 'rgba(245,197,66,.35)', E.p(t, fin, fin + .5)); E.particles(c, X0 + 2.5 * S, Y0 + 1.5 * S, t - fin, { n: 70, speed: 520, grav: 220, life: 1.5 }); }
  CNT(c, 70, 560, 'PIECES', `${Math.min(11, Math.floor(Math.max(0, t - .1) / .27) + (t > .1 ? 1 : 0)) + (done ? 1 : 0)}/12`, done ? 'COMPLETE' : 'ONE MISSING', done ? GOLD : '#e8e8e8');
} },
// 3 — Let it settle. Then you'll see clearly.
{ dur: 5.5, draw(c, t) {
  const settle = 3.6, done = t > settle;
  PRIN(c, "LET IT SETTLE. THEN YOU'LL SEE CLEARLY.", 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'KEEPS SHAKING'); PANEL(c, ...P2, 'LETS IT SETTLE', done);
  const globe = (cx, cy, shake, calm, gold) => { const jx = shake ? Math.sin(t * 40) * 10 : 0, jy = shake ? Math.cos(t * 33) * 6 : 0; c.save(); c.translate(jx, jy);
    E.shaded(c, cx - 110, cy + 120, 220, 40, 10, '#5a4a3a', '#2a1a10');
    c.save(); c.beginPath(); c.arc(cx, cy, 150, 0, 7); c.clip(); c.fillStyle = 'rgba(200,220,240,.06)'; c.fillRect(cx - 150, cy - 150, 300, 300);
    c.strokeStyle = gold ? GOLD : '#5a5a5a'; c.lineWidth = 6; c.setLineDash([12, 10]); c.beginPath(); c.moveTo(cx - 120, cy + 110); c.quadraticCurveTo(cx, cy + 20, cx + 70, cy + 40); c.stroke(); c.setLineDash([]);
    E.flag(c, cx + 80, cy + 50, 1, 0); fig(c, { x: cx - 90, y: hipOn(cy + 110, .32), s: .32, lw: 10, color: gold ? GOLD : '#ddd', pose: gold ? win(t, settle) : E.pose('stand') });
    for (let i = 0; i < 90; i++) { const a = E.rnd(i) * 7, r = 30 + E.rnd(i + 3) * 115, sx = cx + Math.cos(a + t * (shake ? 2.5 : 0)) * r + (shake ? Math.sin(t * 9 + i) * 20 : 0), sy = cy + Math.sin(a + t * (shake ? 2.5 : 0)) * r;
      const yy = E.lerp(sy, cy + 112 - E.rnd(i + 7) * 14, calm), xx = E.lerp(sx, cx - 130 + E.rnd(i + 9) * 260, calm * .5); c.fillStyle = '#ffffff'; c.globalAlpha = .9; c.beginPath(); c.arc(xx, yy, 4 + 2 * E.rnd(i), 0, 7); c.fill(); }
    c.restore(); c.save(); c.strokeStyle = gold ? GOLD : '#9aa6b0'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, 150, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(cx - 60, cy - 80, 30, 50, -.6, 0, 7); c.fill(); c.restore(); c.restore(); };
  globe(560, gT - 210, true, 0, false);
  CNT(c, 120, 640, 'SHAKES', Math.round(t * 9), 'CAN\'T SEE A THING', '#e8e8e8', RED);
  SAY(c, 'WHERE AM I GOING?', 820, 700, E.p(t, 2.0, 2.3, 'back'));
  if (done) E.glowDot(c, 560, gB - 210, 360, 'rgba(245,197,66,.4)', E.p(t, settle, settle + .5));
  globe(560, gB - 210, t < .6, E.p(t, .7, settle, 'inOut'), done);
  CNT(c, 120, 1090, 'SHAKES', t < .6 ? Math.round(t * 9) : 5, done ? 'PATH: CLEAR' : 'BREATHING', done ? GOLD : '#e8e8e8');
} },
// 4 — To keep your balance, keep moving
{ dur: 7, draw(c, t) {
  const fin = 5.0, done = t > fin;
  PRIN(c, 'TO KEEP YOUR BALANCE, KEEP MOVING.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'STOPS PEDALING'); PANEL(c, ...P2, 'KEEPS PEDALING', done);
  const bike = (x, gy, tilt, spin, col, pedal, s = .62) => { c.save(); c.translate(x, gy - 44); c.rotate(tilt);
    [-60, 60].forEach(wx => { c.save(); c.translate(wx, 0); c.strokeStyle = '#bbb'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 42, 0, 7); c.stroke(); c.rotate(spin); c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 4); c.beginPath(); c.moveTo(-40, 0); c.lineTo(40, 0); c.stroke(); } c.restore(); });
    c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.moveTo(-60, 0); c.lineTo(-10, -60); c.lineTo(50, -60); c.lineTo(60, 0); c.moveTo(-10, -60); c.lineTo(0, 0); c.lineTo(-60, 0); c.moveTo(50, -60); c.lineTo(46, -80); c.stroke();
    fig(c, { x: -14, y: -70, s, color: col, pose: { ...E.pose('sit'), tor: .4, aF: 1.5, eF: .4, lF: 1.2 + .6 * Math.sin(pedal), kF: 1.6 + .5 * Math.cos(pedal), lB: 1.2 - .6 * Math.sin(pedal), kB: 1.6 - .5 * Math.cos(pedal) } });
    c.restore(); };
  // top: coasts, slows, wobbles, falls over
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    const v = t < 1.8 ? 1 : Math.max(0, 1 - (t - 1.8) / 1.0), x = 200 + 230 * Math.min(t, 1.8) + 115 * Math.min(1, Math.max(0, t - 1.8)), fall = E.p(t, 2.8, 3.3, 'in'), tilt = fall * 1.4 + (t > 2.2 ? Math.sin(t * 14) * .08 * (1 - fall) : 0);
    bike(x, gT, tilt, t * 10 * v, '#bdbdbd', t < 1.8 ? t * 10 : 18);
    E.particles(c, x + 60, gT, t - 3.3, { n: 24, speed: 260, color: '#8a8a8a', grav: 600, life: .6 }); });
  SAY(c, 'JUST A QUICK BREAK...', 640, 700, E.p(t, 1.9, 2.2, 'back') * (1 - E.p(t, 3.2, 3.4)));
  E.flash(c, t, 3.3, .15, '229,72,77', .15);
  // bottom: over the ramp, through the air, keeps going
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); c.save(); c.fillStyle = '#4a4a50'; c.beginPath(); c.moveTo(480, gB); c.lineTo(600, gB - 70); c.lineTo(600, gB); c.fill(); c.restore();
    let x = 160 + 150 * t, y = gB, tilt = 0; if (x > 480 && x < 600) { y = gB - (x - 480) * 70 / 120; tilt = -.5; } if (x >= 600 && x < 780) { const k = (x - 600) / 180; y = gB - 70 - Math.sin(k * Math.PI) * 120 + k * 70; tilt = -.5 + k * .6; }
    if (done) { x = 910; y = gB; tilt = -.35 + Math.sin(t * 4) * .05; E.glowDot(c, 910, gB - 120, 340, 'rgba(245,197,66,.4)', E.p(t, fin, fin + .5)); }
    bike(Math.min(x, 910), y, tilt, t * 14, done ? GOLD : '#fff', t * 12);
    for (let i = 0; i < 3 && !done; i++) E.line(c, x - 120 - i * 26, y - 60 + i * 14, x - 160 - i * 26, y - 60 + i * 14, 'rgba(255,255,255,.3)', 3); });
  CNT(c, 120, 640, 'SPEED', t < 1.8 ? 14 : Math.max(0, Math.round(14 * (1 - (t - 1.8)))), t > 3.3 ? 'FELL OVER' : 'COASTING', '#e8e8e8', t > 3.3 ? RED : null);
  CNT(c, 120, 1090, 'SPEED', 14, done ? 'BALANCED. ARRIVED.' : 'PEDALING', done ? GOLD : '#e8e8e8');
} },
] };
