// Reel 052 — "Light their candle" (relatable: slow progress, burnout, jealousy, invisible growth; reference bible style, ≤30s)
// reference-bible kit: big glowing figures, spotlight, grey floor, one title, mono + gold
const fig = (c, o) => E.figure(c, { lw: 17, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const TITLE = (c, str, y = 470, col = '#f2f2f2', a = 1) => E.text(c, str, 540, y, { size: 34, weight: 600, ls: 2, color: col, alpha: a });
const LBL = (c, str, x, y, col = '#e8e8e8', a = 1) => E.text(c, str, x, y, { size: 28, weight: 700, ls: 5, color: col, alpha: a });
const TAG = (c, str, x, y, t, t0, col = '#e8e8e8', a = 1) => E.tag(c, str, x, y, t, t0, { size: 20, color: col, fill: '#0c0c0c', alpha: a });
const floor = (c, gy) => { const g = c.createLinearGradient(0, gy, 0, gy + 360); g.addColorStop(0, '#36363a'); g.addColorStop(1, 'rgba(10,10,12,0)'); c.save(); c.fillStyle = g; c.fillRect(-200, gy, 1500, 360); c.restore(); E.line(c, -200, gy, 1300, gy, '#55555a', 2); };
const spot = (c, x, gy, a = 1, w = 260) => { c.save(); c.globalAlpha = .16 * a; const g = c.createLinearGradient(0, 520, 0, gy); g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'rgba(255,255,255,.2)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 70, 520); c.lineTo(x + 70, 520); c.lineTo(x + w, gy); c.lineTo(x - w, gy); c.fill(); c.restore(); c.save(); c.globalAlpha = .25 * a; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, gy + 6, w * .9, 26, 0, 0, 7); c.fill(); c.restore(); };
const halo = (c, x, y, a = 1, gold = false) => E.glowDot(c, x, y, 190, gold ? 'rgba(245,197,66,.45)' : 'rgba(255,255,255,.18)', a);
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const flame = (c, x, y, k, t) => { if (k <= .02) return; E.glowDot(c, x, y - 40 * k, 260 * k, 'rgba(255,170,60,.5)'); [['#f08a24', 26, 80], [GOLD, 17, 58], ['#fff3c4', 8, 30]].forEach(([col, w, h], i) => { const ww = w * k * (1 + .08 * Math.sin(t * 13 + i)), hh = h * k * (1 + .1 * Math.sin(t * 9 + i)); c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(x, y - hh); c.quadraticCurveTo(x + ww, y - hh * .3, x, y); c.quadraticCurveTo(x - ww, y - hh * .3, x, y - hh); c.fill(); c.restore(); }); };
const candle = (c, x, gy, k, t) => { E.shaded(c, x - 20, gy - 130, 40, 130, 6, '#eeeeee', '#9a9a9a'); E.line(c, x, gy - 130, x, gy - 146, '#555', 4); flame(c, x, gy - 144, k, t); };
const battery = (c, x, y, pct, col) => { E.rrect(c, x - 70, y - 34, 140, 68, 10, '#0c0c0c', col, 5); E.rrect(c, x + 72, y - 14, 12, 28, 3, col); const w = Math.max(4, 124 * pct / 100); E.rrect(c, x - 62, y - 26, w, 52, 6, col); E.text(c, `${Math.round(pct)}%`, x, y + 66, { size: 24, weight: 800, family: MONO, ls: 2, color: col }); };
const REEL = { title: 'Light their candle', bpm: 120, scenes: [
// 1 — Slow progress is still progress
{ dur: 7, draw(c, t) {
  const GY = 1380, WX = 560, top = 660, done = t > 5.2;
  TITLE(c, 'SLOW PROGRESS', 450);
  TITLE(c, 'IS STILL PROGRESS.', 505, done ? GOLD : '#f2f2f2');
  if (done) { E.glowDot(c, 540, top, 520, 'rgba(245,197,66,.45)', E.p(t, 5.2, 5.8)); E.rays(c, 540, top, 600, .2 * E.p(t, 5.2, 5.8), GOLD, 16, t * .15); }
  floor(c, GY); E.shaded(c, WX - 120, top, 240, GY - top, 8, '#3a3a3e', '#1c1c20', '#55555a');
  // rain
  if (!done) { c.save(); c.strokeStyle = 'rgba(200,210,230,.45)'; c.lineWidth = 3; for (let i = 0; i < 70; i++) { const x = (E.rnd(i) * 1200 + t * 120) % 1200 - 60, y = (E.rnd(i * 3) * 1400 + t * 1500) % 1300 + 560; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 40); c.stroke(); } c.restore(); }
  // the snail: climbs, gets washed back at 2.4, keeps climbing
  const k = t < 2.3 ? E.p(t, 0, 2.3, 'lin') * .45 : t < 2.8 ? .45 - .18 * E.p(t, 2.3, 2.8) : .27 + .73 * E.p(t, 2.8, 5.2, 'lin');
  const sy = E.lerp(GY - 40, top + 30, k), col = done ? GOLD : '#e8e8e8';
  c.save(); c.translate(WX + 120, sy); c.rotate(-Math.PI / 2);
  c.fillStyle = col; c.beginPath(); c.ellipse(0, 18, 70, 16, 0, 0, 7); c.fill();
  E.line(c, 58, 10, 80, -30, col, 5); E.line(c, 64, 12, 96, -18, col, 5);
  c.fillStyle = '#111'; c.strokeStyle = col; c.lineWidth = 7; c.beginPath(); c.arc(-6, -22, 44, 0, 7); c.fill(); c.stroke();
  c.beginPath(); for (let a = 0; a < 12; a += .2) { const r = 36 - a * 2.8; if (r <= 0) break; c.lineTo(-6 + Math.cos(a + t) * r, -22 + Math.sin(a + t) * r); } c.lineWidth = 5; c.stroke(); c.restore();
  // trail
  c.save(); c.strokeStyle = done ? 'rgba(245,197,66,.6)' : 'rgba(220,220,220,.35)'; c.lineWidth = 8; c.beginPath(); c.moveTo(WX + 126, GY); c.lineTo(WX + 126, sy + 70); c.stroke(); c.restore();
  // the hare-types who quit at the base
  fig(c, { x: 200, y: GY - 60, s: .9, color: '#8a8a8a', pose: { ...E.pose('sit'), hd: .6 } });
  TAG(c, 'TOO SLOW', 200, 1060, t, .6, '#9a9a9a');
  TAG(c, `${Math.round(k * 300)} CM`, 880, sy - 20, 1, -1, done ? GOLD : '#e8e8e8');
  E.shake(c, t, 2.3, .4, 6);
  E.particles(c, WX + 120, top, t - 5.2, { n: 60, speed: 500, grav: 260 });
} },
// 2 — A phone at 1% can't run everything
{ dur: 7, draw(c, t) {
  const gT = 950, gB = 1420, s = .9, done = t > 5.0;
  TITLE(c, "A PHONE AT 1% CAN'T RUN EVERYTHING.", 470, done ? GOLD : '#f2f2f2');
  floor(c, gT); floor(c, gB);
  LBL(c, 'NO REST', 540, 590); LBL(c, 'RECHARGE', 540, 1060, done ? GOLD : '#e8e8e8');
  // top: running on empty, tasks pile on until he drops
  const drop = t > 4.0, b1 = Math.max(1, 12 - t * 3);
  battery(c, 820, 700, b1, RED);
  ['WORK', 'EXAMS', 'GYM', 'FAMILY'].forEach((w, i) => { const t0 = .3 + i * .8; if (t < t0 || drop) return; const y = 660 - i * 38 - (1 - E.p(t, t0, t0 + .35, 'back')) * 0, fall = (1 - E.p(t, t0, t0 + .35)) * 140; E.shaded(c, 250 - 80 + Math.sin(t * 6 + i) * 4, y - 34 - fall, 160, 34, 6, '#5a5a5e', '#2a2a2e'); E.text(c, w, 250 + Math.sin(t * 6 + i) * 4, y - 17 - fall, { size: 18, weight: 800, family: MONO, ls: 2, color: '#e8e8e8' }); });
  fig(c, { x: 250, y: drop ? gT - 30 : hipOn(gT, s) + Math.sin(t * 25) * 2, s, rot: drop ? -1.45 * E.p(t, 4.0, 4.3, 'back') : 0, color: drop ? '#7a7a7a' : '#d8d8d8', pose: drop ? E.pose('stand') : { ...E.pose('carryUp'), tor: .1 + .05 * Math.sin(t * 6) } });
  if (drop) TAG(c, 'BURNOUT', 300, 800, t, 4.1, RED);
  E.shake(c, t, 4.0, .4, 8);
  // bottom: sleeps, fills to 100, wakes up and carries it all easily
  const b2 = t < 4.4 ? E.lerp(1, 100, E.p(t, .4, 4.4)) : 100;
  battery(c, 820, 1170, b2, b2 >= 100 ? GOLD : '#e8e8e8');
  if (t < 4.4) { fig(c, { x: 400, y: gB - 24, s, rot: -1.57, color: '#d8d8d8', pose: { ...E.pose('stand'), hd: 0 } }); ['z', 'Z', 'z'].forEach((z, i) => { const q = (t * .6 + i / 3) % 1; E.text(c, z, 470 + q * 60, gB - 120 - q * 120, { size: 30 + i * 6, weight: 800, color: '#9a9a9a', alpha: 1 - q }); }); c.save(); c.fillStyle = '#e8e8e8'; c.beginPath(); c.arc(200, 1200, 40, 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(220, 1188, 36, 0, 7); c.fill(); c.restore(); }
  else { halo(c, 400, hipOn(gB, s) - 80, 1, true); fig(c, { x: 400, y: hipOn(gB, s), s, color: GOLD, pose: done ? win(t, 5.0) : E.pose('carryUp') }); }
  E.particles(c, 400, gB - 300, t - 5.0, { n: 50, speed: 460, grav: 260 });
} },
// 3 — Blowing out their candle won't make yours brighter
{ dur: 7.5, draw(c, t) {
  const gT = 950, gB = 1420, s = .9, blow = 2.0, lightT = 2.6, done = t > 4.4;
  TITLE(c, "BLOWING OUT THEIR CANDLE", 450);
  TITLE(c, "WON'T MAKE YOURS BRIGHTER.", 505, done ? GOLD : '#f2f2f2');
  // top room gets darker
  const dark = E.p(t, blow + .3, blow + .8);
  c.save(); c.fillStyle = `rgba(30,30,34,${.6 - .5 * dark})`; c.fillRect(70, 560, 940, gT - 560); c.restore();
  floor(c, gT); floor(c, gB);
  LBL(c, 'JEALOUS', 540, 590); LBL(c, 'GENEROUS', 540, 1060, done ? GOLD : '#e8e8e8');
  candle(c, 380, gT, .9, t); candle(c, 700, gT, t < blow + .4 ? 1 - .7 * E.p(t, blow, blow + .4) : 0, t);
  if (t > blow && t < blow + .6) for (let i = 0; i < 5; i++) { const q = ((t - blow) * 2 + i / 5) % 1; E.line(c, 470 + q * 160, gT - 230 + i * 12, 520 + q * 160, gT - 230 + i * 12, `rgba(220,220,220,${.6 * (1 - q)})`, 3); }
  if (t > blow + .4 && t < 4) for (let i = 0; i < 4; i++) { const q = ((t - blow - .4) * .7 + i / 4) % 1; c.save(); c.globalAlpha = .3 * (1 - q); c.fillStyle = '#8a8a8a'; c.beginPath(); c.arc(700 + Math.sin(q * 6) * 10, gT - 160 - q * 140, 8 + q * 14, 0, 7); c.fill(); c.restore(); }
  fig(c, { x: 260, y: hipOn(gT, s), s, color: '#bdbdbd', pose: t < blow ? { ...E.pose('stand'), hd: .25 } : { ...E.pose('push'), tor: .35, aF: .6, aB: .4 } });
  fig(c, { x: 840, y: hipOn(gT, s), s, f: -1, color: t > blow + .4 ? '#6a6a6a' : '#d8d8d8', pose: t > blow + .4 ? { ...E.pose('sad'), hd: .6 } : E.pose('stand') });
  TAG(c, 'STILL DIM', 540, 650, t, 3.4, '#8a8a8a');
  // bottom: shares the flame, the whole room lights up
  const glow = E.p(t, lightT, lightT + .8);
  if (glow > 0) { E.glowDot(c, 540, gB - 200, 520, 'rgba(245,197,66,.4)', glow); }
  candle(c, 380, gB, 1, t); candle(c, 700, gB, E.p(t, lightT, lightT + .5), t);
  const reach = E.p(t, 1.2, lightT);
  fig(c, { x: 260 + reach * 120, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 4.4) : { ...E.pose('point'), aF: 1.2 + .3 * reach } });
  fig(c, { x: 840, y: hipOn(gB, s), s, f: -1, color: done ? GOLD : '#d8d8d8', pose: done ? win(t, 4.5) : E.pose('stand') });
  E.particles(c, 700, gB - 160, t - lightT, { n: 40, speed: 380, grav: 220 });
  TAG(c, '2× THE LIGHT', 540, 1160, t, 4.4, GOLD);
} },
// 4 — The bamboo grows roots for years, then shoots up
{ dur: 7.5, draw(c, t) {
  const GY = 1180, X = 640, s = .95, upT = 4.4, done = t > upT;
  TITLE(c, 'YEAR 1: NOTHING. YEAR 4: NOTHING.', 450);
  TITLE(c, 'YEAR 5: 90 FEET.', 505, GOLD, E.p(t, upT, upT + .3));
  floor(c, GY);
  // roots underground grow every year
  const yr = Math.min(4, 1 + Math.floor(t / 1.1)), rk = E.p(t, .1, upT, 'lin');
  c.save(); c.strokeStyle = done ? 'rgba(245,197,66,.85)' : 'rgba(200,200,200,.6)'; c.lineWidth = 4;
  for (let i = 0; i < 9; i++) { const ang = -1.2 + i * .3, L = 70 + 180 * rk * (.6 + .4 * E.rnd(i)); c.beginPath(); c.moveTo(X, GY); let px = X, py = GY; for (let j = 1; j <= 6; j++) { const q = j / 6; px = X + Math.sin(ang) * L * q + Math.sin(j + i) * 14; py = GY + Math.cos(ang) * L * q * .9; c.lineTo(px, py); } c.stroke(); } c.restore();
  // above ground: a sprout, then it shoots up
  const h = done ? 40 + 560 * E.p(t, upT, upT + 1.2, 'out') : 40;
  for (let y = 0; y < h; y += 70) { const sh = Math.min(66, h - y); E.rrect(c, X - 16, GY - y - sh, 32, sh, 6, done ? GOLD : '#7aa86a'); }
  if (done) { E.glowDot(c, X, GY - h, 300, 'rgba(245,197,66,.45)'); for (let i = 0; i < 6; i++) { const ly = GY - 140 - i * 110; if (ly > GY - h) { c.save(); c.translate(X, ly); c.rotate(i % 2 ? .6 : -.6); c.fillStyle = GOLD; c.beginPath(); c.ellipse(i % 2 ? 50 : -50, 0, 50, 12, 0, 0, 7); c.fill(); c.restore(); } } }
  // he waters every day, people laugh
  const pour = !done && (t * 1.4) % 1 < .6;
  fig(c, { x: 450, y: hipOn(GY, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, upT + .3) : pour ? { ...E.pose('point'), tor: .2, aF: 1.3 } : E.pose('stand') });
  if (!done) { c.save(); c.translate(540, GY - 210); c.rotate(pour ? .5 : 0); E.rrect(c, -30, -20, 60, 44, 6, '#1c1c20', '#bdbdbd', 4); E.line(c, 30, -10, 60, -36, '#bdbdbd', 5); c.restore(); if (pour) for (let i = 0; i < 4; i++) { const q = ((t * 3) + i / 4) % 1; c.save(); c.fillStyle = '#9ac8ff'; c.beginPath(); c.arc(600 + q * 20, GY - 220 + q * 190, 5, 0, 7); c.fill(); c.restore(); } }
  [180, 900].forEach((x, i) => fig(c, { x, y: hipOn(GY, .85), s: .85, f: i ? -1 : 1, color: done ? '#5a5a5a' : '#8a8a8a', pose: done ? { ...E.pose('stand'), hd: -.4 } : { ...E.pose('point'), aF: 1.4, hd: Math.sin(t * 8 + i) * .1 } }));
  if (!done) { TAG(c, 'WASTE OF TIME', 180, 840, t, .6, '#9a9a9a'); TAG(c, 'STILL NOTHING?', 880, 840, t, 1.8, '#9a9a9a'); }
  TAG(c, `YEAR ${done ? 5 : yr}`, 900, 650, 1, -1, done ? GOLD : '#e8e8e8');
  E.shake(c, t, upT, .5, 10);
  E.particles(c, X, GY - h, t - upT - .6, { n: 60, speed: 480, grav: 260 });
  E.text(c, 'ROOTS FIRST.', 540, 1470, { size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 5.8, 6.2) });
} },
] };
