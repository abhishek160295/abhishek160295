// Reel 037 — "Rest if you must. Just don't quit." (≤31s, high motion, emotional + seasonal beat)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
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
const rain = (c, t, y0, y1, a, n = 80) => { if (a <= 0) return; c.save(); c.strokeStyle = `rgba(190,205,220,${.45 * a})`; c.lineWidth = 3; for (let i = 0; i < n; i++) { const x = E.rnd(i) * 1200 - 60, q = (t * 2.3 + E.rnd(i + 5)) % 1, y = E.lerp(y0, y1, q); c.beginPath(); c.moveTo(x + q * 40, y); c.lineTo(x + q * 40 - 12, y + 34); c.stroke(); } c.restore(); };

const REEL = { title: "Rest if you must. Just don't quit.", bpm: 120, scenes: [
// 1 — Never stops vs takes a pit stop
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, burn = 3.6, fin = 5.2, done = t > fin;
  LB(c, 'NEVER STOPS', 540, 540); LB(c, 'TAKES A PIT STOP', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  for (let x = 0; x < 1100; x += 90) { E.line(c, x, gT + 30, x + 50, gT + 30, '#4a4a4a', 4); E.line(c, x, gB + 30, x + 50, gB + 30, '#4a4a4a', 4); }
  // top: flat out until the engine gives up
  const dT = t < burn ? 560 * t : 560 * burn, xT = ((150 + dT + 130) % 1310) - 130, heat = E.p(t, .5, burn);
  for (let i = 0; i < 14; i++) { const q = ((t * 1.2 + i / 14) % 1); c.save(); c.globalAlpha = (t < burn ? heat * .5 : .7) * (1 - q); c.fillStyle = '#7a7a7a'; c.beginPath(); c.arc(xT - 60 - (t < burn ? q * 160 : -q * 20), gT - 90 - q * (t < burn ? 60 : 200), 10 + q * (t < burn ? 26 : 50), 0, 7); c.fill(); c.restore(); }
  car(c, xT, gT, .72, '#9a9a9a', t < burn ? t * 20 : burn * 20);
  if (t < burn && heat > .4) E.particles(c, xT - 40, gT - 10, (t * 5) % 1 * .2, { n: 8, speed: 260, color: '#ffb340', grav: 300, life: .2, seed: Math.floor(t * 5) });
  E.flash(c, t, burn, .3, '255,140,60', .3); E.particles(c, xT, gT - 60, t - burn, { n: 40, speed: 380, color: '#9a9a9a', grav: -60, life: 1.2 });
  if (t > burn) E.tag(c, 'BURNOUT', xT, gT - 170, t, burn + .1, { size: 22, color: RED, fill: '#1e0a0a' });
  CNT(c, 50, 590, 'LAPS', Math.floor((150 + dT) / 1310), t > burn ? 'ENGINE: DEAD' : `ENGINE: ${Math.round(100 - 90 * heat)}%`, '#e8e8e8', t > burn ? RED : null);
  // bottom: pulls in, refuels, comes out faster
  let xB, spinB, fast = false;
  if (t < 1.6) { xB = E.lerp(150, 500, E.p(t, 0, 1.6, 'out')); spinB = t * 18; }
  else if (t < 2.6) { xB = 500; spinB = 1.6 * 18; }
  else if (t < 4.4) { xB = E.lerp(500, 1250, E.p(t, 2.6, 4.4, 'in')); spinB = t * 30; fast = true; }
  else { xB = E.lerp(-130, 860, E.p(t, 4.4, fin, 'out')); spinB = t * 30; fast = t < fin; }
  E.rrect(c, 420, gB - 4, 160, 10, 2, TEAL); E.text(c, 'PIT', 500, gB + 34, { size: 16, weight: 800, family: MONO, color: TEAL });
  if (t > 1.6 && t < 2.6) { E.particles(c, 470, gB - 40, (t * 6) % 1 * .15, { n: 8, speed: 220, color: '#ffe7a8', grav: 300, life: .15, seed: Math.floor(t * 6) }); E.tag(c, 'REST. REFUEL.', 500, gB - 190, t, 1.7, { size: 20, color: TEAL, fill: '#0a1e1a' }); }
  if (fast) for (let i = 0; i < 4; i++) E.line(c, xB - 90 - i * 30, gB - 50 - i * 14, xB - 150 - i * 30, gB - 50 - i * 14, 'rgba(255,255,255,.35)', 3);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) c.fillStyle = (i + j) % 2 ? '#e8e8e8' : '#141414', c.fillRect(860 + i * 12, gB - 190 + j * 12, 12, 12);
  E.line(c, 860, gB, 860, gB - 190, '#8a8a8a', 4);
  if (done) E.glowDot(c, 860, gB - 120, 380, 'rgba(245,197,66,.4)', E.p(t, fin, fin + .5));
  car(c, xB, gB, .72, done ? GOLD : '#e8e8e8', spinB);
  CNT(c, 50, 1110, 'LAPS', t > 4.4 ? 2 : 1, done ? 'FINISHED STRONG' : t > 1.6 && t < 2.6 ? 'RESTING' : 'RACING', done ? GOLD : '#e8e8e8');
  E.particles(c, 860, gB - 140, t - fin, { n: 50, speed: 480, grav: 300 });
} },
// 2 — Fast and fake vs slow and real: then the wind comes
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, wind = 3.4, lit = 4.6;
  LB(c, 'FAST AND FAKE', 540, 540); LB(c, 'SLOW AND REAL', 540, 1070, { color: t > lit ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // wind across both rows
  if (t > wind && t < 5.2) { const a = E.p(t, wind, wind + .3) * (1 - E.p(t, 4.8, 5.2)); c.save(); c.strokeStyle = `rgba(220,230,240,${.5 * a})`; c.lineWidth = 3; for (let i = 0; i < 40; i++) { const y = 620 + E.rnd(i) * 900, x = ((t - wind) * 1600 + E.rnd(i + 3) * 1400) % 1400 - 200; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 60, y - 10, x + 140, y); c.stroke(); } c.restore(); }
  // top: a house of cards, up in 1.5 seconds, gone in one gust
  const PAIRS = []; [[3, 0], [2, 1], [1, 2]].forEach(([n, lv]) => { for (let i = 0; i < n; i++) PAIRS.push([560 + lv * 40 + i * 80, gT - lv * 90]); });
  PAIRS.forEach(([x, y], i) => { const t0 = .2 + i * .22; if (t < t0) return; const dt = Math.max(0, t - wind - i * .04);
    c.save(); c.translate(x + 300 * dt + 80 * dt * dt * 9, y + 600 * dt * dt - 200 * dt); c.rotate(dt * (4 + i)); c.globalAlpha = Math.max(0, 1 - dt / 1.4); c.strokeStyle = '#e8e8e8'; c.lineWidth = 6; c.beginPath(); c.moveTo(-36, 0); c.lineTo(0, -88); c.lineTo(36, 0); c.stroke(); c.restore(); });
  fig(c, { x: 400, y: hipOn(gT, s), s, color: '#bdbdbd', pose: t < 1.6 ? { ...E.pose('stand'), aF: 1.3, eF: .4 } : t < wind + .4 ? E.pose('arms') : { ...E.pose('sad'), hd: .5 } });
  SAY(c, 'DONE ALREADY.', 360, 690, E.p(t, 1.8, 2.1, 'back') * (1 - E.p(t, wind, wind + .2)));
  if (t > wind + .5) E.tag(c, 'GONE', 650, gT - 120, t, wind + .5, { size: 22, color: RED, fill: '#1e0a0a' });
  CNT(c, 50, 590, 'BUILT IN', '1.5s', t > wind ? 'LASTED 1.9s' : 'LOOKS GREAT', '#e8e8e8', t > wind ? RED : null);
  // bottom: brick by brick, and when the wind hits, nothing moves
  const BW = 46, BH = 28, N = 25, X0 = 580; let laid = 0;
  for (let k = 0; k < N; k++) { const t0 = .2 + k * .1; if (t < t0) continue; laid++; const r = Math.floor(k / 5), q = k % 5, y = gB - (r + 1) * BH, drop = E.p(t, t0, t0 + .12, 'in'); E.shaded(c, X0 + q * BW + (r % 2 ? 10 : 0) + 1, E.lerp(y - 60, y, drop) + 1, BW - 2, BH - 2, 2, '#9a6a4a', '#5a3a26'); }
  if (t > 2.8) { const k = E.p(t, 2.8, 3.1, 'back'); c.save(); c.fillStyle = '#6a4a36'; c.beginPath(); c.moveTo(X0 - 20, gB - 5 * BH); c.lineTo(X0 + 125, gB - 5 * BH - 90 * k); c.lineTo(X0 + 270, gB - 5 * BH); c.fill(); c.restore(); }
  if (t > lit) { E.glowDot(c, X0 + 125, gB - 70, 420, 'rgba(255,214,120,.45)', E.p(t, lit, lit + .5)); E.rrect(c, X0 + 100, gB - 90, 50, 44, 4, '#ffe7a8', '#c9962a', 3); }
  const bshake = t > wind && t < 4.8 ? Math.sin(t * 50) * 2 : 0;
  fig(c, { x: 500 + bshake, y: t < 2.8 ? hipOn(gB, s) + 30 : hipOn(gB, s), s, color: t > lit ? GOLD : '#fff', pose: t < 2.8 ? { ...E.pose('crouch'), aF: 1.5 + .4 * Math.sin(t * 10) } : t > lit ? win(t, lit) : E.pose('stand') });
  CNT(c, 50, 1110, 'BRICKS', laid, t > lit ? 'STILL STANDING' : 'ONE AT A TIME', t > lit ? GOLD : '#e8e8e8');
} },
// 3 — The monster called WHAT IF (it's always smaller in the light)
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, on = 2.6, done = t > on;
  const room = (gy, light) => { E.shaded(c, -100, gy - 420, 1280, 420, 0, light ? '#4a4436' : '#26262a', light ? '#3a342a' : '#1a1a1d'); E.line(c, -100, gy, 1180, gy, '#6a6a6a', 3);
    E.shaded(c, 120, gy - 70, 300, 50, 8, '#5a5a6a', '#2a2a34'); E.line(c, 130, gy - 20, 130, gy, '#555', 6); E.line(c, 410, gy - 20, 410, gy, '#555', 6); E.shaded(c, 110, gy - 120, 24, 100, 4, '#5a5a6a', '#2a2a34');
    E.line(c, 640, gy, 640, gy - 90, '#6a6a6a', 5); E.line(c, 700, gy, 700, gy - 90, '#6a6a6a', 5); E.line(c, 640, gy - 90, 700, gy - 90, '#6a6a6a', 5); E.line(c, 700, gy - 90, 700, gy - 160, '#6a6a6a', 5);
    c.save(); c.fillStyle = '#5a4a3a'; c.beginPath(); c.moveTo(690, gy - 165); c.lineTo(730, gy - 150); c.lineTo(722, gy - 70); c.lineTo(684, gy - 76); c.fill(); c.restore();
    E.line(c, 860, gy, 860, gy - 200, '#7a7a7a', 5); c.save(); c.fillStyle = light ? '#ffe7a8' : '#4a4a4a'; c.beginPath(); c.moveTo(830, gy - 200); c.lineTo(890, gy - 200); c.lineTo(876, gy - 240); c.lineTo(844, gy - 240); c.fill(); c.restore(); };
  const monster = (gy, sc, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(560, gy - 120); c.scale(sc, sc); c.fillStyle = 'rgba(0,0,0,.75)';
    c.beginPath(); c.ellipse(0, -140, 150, 130, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(-90, -240); c.lineTo(-120, -330); c.lineTo(-50, -255); c.fill(); c.beginPath(); c.moveTo(90, -240); c.lineTo(120, -330); c.lineTo(50, -255); c.fill();
    const w = Math.sin(t * 4) * .15; [-1, 1].forEach(d => { c.save(); c.rotate(d * (.6 + w)); c.fillRect(d > 0 ? 100 : -220, -150, 120, 30); for (let f = 0; f < 3; f++) { c.beginPath(); c.moveTo(d > 0 ? 220 : -220, -150 + f * 10); c.lineTo(d > 0 ? 260 : -260, -170 + f * 18); c.lineTo(d > 0 ? 222 : -222, -138 + f * 10); c.fill(); } c.restore(); });
    c.fillStyle = 'rgba(229,72,77,.7)'; c.beginPath(); c.arc(-50, -160, 12, 0, 7); c.arc(50, -160, 12, 0, 7); c.fill(); c.restore();
    E.tag(c, 'WHAT IF', 560, gy - 120 - 300 * sc, 1, -1, { size: 20, color: RED, fill: '#1e0a0a', alpha: a }); };
  LB(c, 'HIDES FROM IT', 540, 470); LB(c, 'TURNS ON THE LIGHT', 540, 1000, { color: done ? GOLD : '#e8e8e8' });
  // top: under the covers while it grows
  room(gT, false); monster(gT, .75 + .2 * E.p(t, 0, 6), 1);
  c.save(); c.fillStyle = '#8a8a9a'; c.beginPath(); c.ellipse(270 + Math.sin(t * 40) * 3, gT - 80, 120, 34 + Math.sin(t * 40) * 3, 0, Math.PI, 0); c.fill(); c.restore();
  c.save(); c.fillStyle = '#bdbdbd'; c.beginPath(); c.arc(170, gT - 96, 18, 0, 7); c.fill(); c.restore();
  SAY(c, 'WHAT IF I FAIL?', 330, gT - 200, E.p(t, 1.6, 1.9, 'back'));
  // bottom: gets up, walks to the lamp, switches it on
  room(gB, done); monster(gB, .75, 1 - E.p(t, on, on + .2));
  if (done) { E.glowDot(c, 860, gB - 220, 620, 'rgba(255,214,120,.45)', E.p(t, on, on + .4)); E.tag(c, 'WHAT IF', 708, gB - 190, 1, -1, { size: 14, color: '#bbb' }); }
  E.flash(c, t, on, .25, '255,230,170', .4);
  let bx = 300, bp = E.pose('stand');
  if (t < .8) { bx = 300; bp = { ...E.pose('sit'), hd: -.3 }; }
  else if (t < on - .2) { bx = E.lerp(300, 800, E.p(t, .8, on - .3, 'lin')); bp = E.walk(t * 8); }
  else if (t < on + .2) { bx = 800; bp = { ...E.pose('stand'), aF: 2.2, eF: .2 }; }
  if (t > on + .6) bp = win(t, on + .6);
  fig(c, { x: bx, y: t < .8 ? gB - 110 : hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: bp });
  E.tag(c, 'IT WAS NEVER THAT BIG.', 420, gB - 330, t, on + .8, { size: 20, color: GOLD, fill: '#2a2208' });
} },
// 4 — To the one who's tired
{ dur: 9, draw(c, t) {
  const GY = 1320, s = 1.0, sit = 2.4, up = 5.6, run = 6.2, done = t > 7.0;
  const dawn = E.p(t, 3.4, 6.2);
  c.save(); const sky = c.createLinearGradient(0, 600, 0, GY); sky.addColorStop(0, 'rgba(0,0,0,0)'); sky.addColorStop(1, `rgba(245,160,80,${.35 * dawn})`); c.fillStyle = sky; c.fillRect(-100, 600, 1300, GY - 600); c.restore();
  const sy = E.lerp(1420, 1080, E.p(t, 3.8, 6.4, 'out'));
  if (dawn > 0) { E.glowDot(c, 800, sy, 520, 'rgba(255,200,110,.5)', dawn); E.rays(c, 800, sy, 600, .25 * dawn, '#ffd27a', 18, t * .1); c.save(); c.globalAlpha = dawn; c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(800, sy, 100, 0, 7); c.fill(); c.restore(); }
  slab(c, -100, 1180, GY, 260);
  rain(c, t, 560, GY, 1 - E.p(t, 3.4, 4.6), 110);
  if (t < 6.2) LB(c, "TO THE ONE WHO'S TIRED", 540, 470, { size: 34, ls: 5 });
  else { E.title(c, 'REST IF YOU MUST.', 540, 440, t, 6.3, 1e9, { size: 34, weight: 700, ls: 4, family: 'Inter', color: '#e8e8e8' }); E.title(c, "JUST DON'T QUIT.", 540, 500, t, 6.8, 1e9, { size: 40, weight: 800, ls: 5, family: 'Inter', color: GOLD }); }
  // bench + lamp
  E.shaded(c, 420, GY - 70, 220, 16, 4, '#7a6a5a', '#4a3a2a'); E.line(c, 440, GY - 54, 440, GY, '#555', 6); E.line(c, 620, GY - 54, 620, GY, '#555', 6); E.line(c, 420, GY - 70, 420, GY - 150, '#6a5a4a', 6);
  // him
  let x = E.lerp(-40, 470, E.p(t, 0, sit - .2, 'lin')), y = hipOn(GY, s), pose = { ...E.walk(t * 5, .3), tor: .5, hd: .4 };
  if (t > sit - .2 && t < up) { x = 500; y = GY - 70 - 10; pose = { ...E.pose('sit'), hd: E.lerp(.6, -.2, E.p(t, 4, 5.4)), tor: E.lerp(.4, 0, E.p(t, 4, 5.4)) }; }
  if (t >= up && t < run) { x = 520; pose = { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, up, up + .3)), aF: 2.8, aB: -2.8 }; }
  if (t >= run) { x = E.lerp(520, 640, E.p(t, run, 7.0, 'in')); pose = done ? win(t, 7.0) : E.run(t * 16); }
  if (done) E.glowDot(c, x, y - 60, 360, 'rgba(245,197,66,.45)', E.p(t, 7.0, 7.4));
  fig(c, { x, y, s, color: done ? GOLD : t > up ? '#ffffff' : '#bdbdbd', pose });
  const energy = t < 2.8 ? 12 : Math.round(E.lerp(12, 100, E.p(t, 2.8, up, 'inOut')));
  CNT(c, 60, 560, 'ENERGY', `${energy}%`, t < sit ? 'RUNNING ON EMPTY' : t < up ? 'RESTING. NOT QUITTING.' : 'READY', energy === 100 ? GOLD : '#e8e8e8', t < sit ? RED : null);
  E.particles(c, 640, y - 80, t - 7.0, { n: 60, speed: 500, grav: 260, life: 1.6 });
} },
] };
