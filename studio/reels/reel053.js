// Reel 053 — "Roots first" (ONE reel/day: best-of 050-052; habit chain hook, train wince, dive, bamboo payoff; reference bible: zoomed big figures, spotlight, mono + gold, ~25s)
// reference-bible kit: big glowing figures, spotlight, grey floor, one title, mono + gold
const fig = (c, o) => E.figure(c, { lw: 17, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const TITLE = (c, str, y = 470, col = '#f2f2f2', a = 1) => E.text(c, str, 540, y, { hud: true, size: 34, weight: 600, ls: 2, color: col, alpha: a });
const LBL = (c, str, x, y, col = '#e8e8e8', a = 1) => E.text(c, str, x, y, { hud: true, size: 28, weight: 700, ls: 5, color: col, alpha: a });
const TAG = (c, str, x, y, t, t0, col = '#e8e8e8', a = 1) => E.tag(c, str, x, y, t, t0, { size: 20, color: col, fill: '#0c0c0c', alpha: a });
const floor = (c, gy) => { const g = c.createLinearGradient(0, gy, 0, gy + 360); g.addColorStop(0, '#45454b'); g.addColorStop(1, 'rgba(10,10,12,0)'); c.save(); c.fillStyle = g; c.fillRect(-200, gy, 1500, 360); c.restore(); E.line(c, -200, gy, 1300, gy, '#55555a', 2); };
const spot = (c, x, gy, a = 1, w = 260) => { c.save(); c.globalAlpha = .16 * a; const g = c.createLinearGradient(0, 520, 0, gy); g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'rgba(255,255,255,.2)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 70, 520); c.lineTo(x + 70, 520); c.lineTo(x + w, gy); c.lineTo(x - w, gy); c.fill(); c.restore(); c.save(); c.globalAlpha = .25 * a; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, gy + 6, w * .9, 26, 0, 0, 7); c.fill(); c.restore(); };
const halo = (c, x, y, a = 1, gold = false) => E.glowDot(c, x, y, 190, gold ? 'rgba(245,197,66,.45)' : 'rgba(255,255,255,.18)', a);
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const flame = (c, x, y, k, t) => { if (k <= .02) return; E.glowDot(c, x, y - 40 * k, 260 * k, 'rgba(255,170,60,.5)'); [['#f08a24', 26, 80], [GOLD, 17, 58], ['#fff3c4', 8, 30]].forEach(([col, w, h], i) => { const ww = w * k * (1 + .08 * Math.sin(t * 13 + i)), hh = h * k * (1 + .1 * Math.sin(t * 9 + i)); c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(x, y - hh); c.quadraticCurveTo(x + ww, y - hh * .3, x, y); c.quadraticCurveTo(x - ww, y - hh * .3, x, y - hh); c.fill(); c.restore(); }); };
const candle = (c, x, gy, k, t) => { E.shaded(c, x - 20, gy - 130, 40, 130, 6, '#eeeeee', '#9a9a9a'); E.line(c, x, gy - 130, x, gy - 146, '#555', 4); flame(c, x, gy - 144, k, t); };
const REEL = { title: 'Roots first', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — Habits are too light to feel until they're too heavy to break
{ dur: 6.6, zoom: t => 1.12 + .012 * t, focus: [480, 1100], draw(c, t) {
  { const pl = .5 + .5 * Math.sin(t * 6); E.glowDot(c, 880, 1180, 520, 'rgba(245,197,66,.32)', .4 + .6 * pl); E.glowDot(c, 470, 900, 420, 'rgba(150,200,255,.28)', t < 4.6 ? .5 + .5 * Math.sin(t * 11) : 0); }
  const GY = 1330, X = 470, s = 1.25, k = E.p(t, .2, 4.4, 'lin'), pull = t > 4.6, done = t > 4.4;
  TITLE(c, 'HABITS ARE TOO LIGHT TO FEEL', 450);
  TITLE(c, "UNTIL THEY'RE TOO HEAVY TO BREAK.", 505, GOLD, E.p(t, 4.6, 5.0));
  floor(c, GY); spot(c, X, GY);
  E.glowDot(c, 880, GY - 200, 320, 'rgba(245,197,66,.35)', .6 + .2 * Math.sin(t * 2)); E.rrect(c, 840, GY - 300, 80, 300, 6, '#ffe7a8', GOLD, 4);
  E.shaded(c, 130, GY - 120, 130, 120, 16, '#5a5a5e', '#1e1e22'); TAG(c, 'SCROLL', 195, GY - 60, 1, -1, '#bbb');
  const strain = pull ? Math.sin(t * 30) * 4 : 0, lean = pull ? .5 : 0, hy = hipOn(GY, s);
  halo(c, X, hy - 80, 1);
  fig(c, { x: X + strain, y: hy, s, color: '#d8d8d8', pose: pull ? { ...E.pose('push'), tor: .55, aF: 1.6, aB: 1.4 } : { ...E.pose('stand'), hd: .45, aF: .7, eF: 1.9 } });
  if (!pull) { E.glowDot(c, X + 40, hy - 120, 60, 'rgba(120,190,255,.5)'); E.rrect(c, X + 30, hy - 140, 22, 36, 4, '#1a2a3a', '#9ac8ff', 2); }
  // the wraps: thin thread at first, chain by the end, tied back to SCROLL
  const n = Math.floor(2 + 16 * k), thick = 1.5 + 9 * k;
  c.save(); c.strokeStyle = k < .6 ? `rgba(220,220,220,${.4 + .6 * k})` : '#9a9a9a'; c.lineWidth = thick;
  for (let i = 0; i < n; i++) { const y = hy + 40 - i * 14; c.beginPath(); c.ellipse(X + strain + Math.sin(i) * 4, y, 48 + (i % 3) * 4, 9, 0, 0, 7); c.stroke(); }
  c.beginPath(); c.moveTo(X - 40, hy - 40); c.quadraticCurveTo(330, pull ? hy - 40 : hy + 40, 260, GY - 60); c.stroke(); c.restore();
  if (k > .6) for (let i = 0; i < 8; i++) { const q = i / 8, x = E.lerp(X - 40, 260, q), y = E.lerp(hy - 40, GY - 60, q) + (pull ? 0 : Math.sin(q * Math.PI) * 60); c.save(); c.strokeStyle = '#7a7a7a'; c.lineWidth = 7; c.beginPath(); c.ellipse(x, y, 16, 9, .3 + i, 0, 7); c.stroke(); c.restore(); }
  ['SNOOZE', 'SKIP', 'LATER'].forEach((w, i) => TAG(c, w, 300 + i * 40, hy - 80 + i * 60, t, 1.2 + i * 1.0, '#9a9a9a'));
  TAG(c, `DAY ${Math.max(1, Math.round(365 * k))}`, 700, 680, 1, -1, k > .9 ? RED : '#e8e8e8');
  E.shake(c, t, 4.7, .5, 6);
} },
// 1 — The train doesn't wait until you feel ready
{ dur: 6.4, zoom: t => 1.14 + .012 * t, focus: [500, 1100], draw(c, t) {
  const GY = 1330, s = 1.05, stopT = 1.1, goT = 3.5, done = t > 4.8;
  TITLE(c, "THE TRAIN DOESN'T WAIT", 450);
  TITLE(c, 'UNTIL YOU FEEL READY.', 505, done ? GOLD : '#f2f2f2');
  floor(c, GY); E.line(c, -200, GY - 6, 1300, GY - 6, '#77777c', 3);
  const tx = t < stopT ? 1500 * Math.pow(1 - E.p(t, 0, stopT, 'lin'), 2) : t < goT ? 0 : -900 * Math.pow(t - goT, 2);
  // train
  c.save(); c.translate(tx, 0);
  for (let k = -1; k < 3; k++) { const x0 = 40 + k * 720; E.rrect(c, x0, GY - 360, 700, 330, 26, '#16161a', '#9a9a9a', 5); for (let w = 0; w < 4; w++) { const wx = x0 + 40 + w * 170; if (k === 0 && w === 3) continue; E.rrect(c, wx, GY - 320, 120, 110, 10, '#0a0a0c', '#5a5a5e', 3); } [x0 + 120, x0 + 580].forEach(wx => { c.save(); c.fillStyle = '#333'; c.beginPath(); c.arc(wx, GY - 24, 20, 0, 7); c.fill(); c.restore(); }); }
  // the open door at x 560..680
  const open = t > stopT && t < goT - .2 ? E.p(t, stopT, stopT + .3) : 0, dw = 120 * (1 - open * .0);
  E.rrect(c, 560, GY - 330, 120, 290, 8, open ? '#3a3a20' : '#22222a', open ? GOLD : '#7a7a7a', 4);
  if (open) E.glowDot(c, 620, GY - 190, 160, 'rgba(245,197,66,.35)', open);
  if (t > 2.8) { E.glowDot(c, 620, GY - 220, 120, 'rgba(245,197,66,.4)'); fig(c, { x: 620, y: GY - 160, s: .85, color: GOLD, pose: t > goT ? { ...E.pose('cheer'), aF: 2.4 } : E.pose('stand') }); }
  c.restore();
  TAG(c, 'DOORS CLOSING', 620, 720, t, 2.6, RED, t < goT ? 1 : 0);
  // B runs in and boards
  if (t < 2.8) fig(c, { x: E.lerp(-120, 600, E.p(t, .8, 2.8, 'lin')), y: hipOn(GY, s), s, color: '#fff', pose: E.run(t * 16) });
  // A: one more minute
  const ax = t < goT ? 300 : 300 + Math.min(260, (t - goT) * 420), ay = hipOn(GY, s);
  let pose = t < 1.6 ? { ...E.pose('stand'), hd: .4, aF: .7, eF: 1.9 } : t < 3.2 ? E.pose('crouch') : t < goT + .1 ? { ...E.pose('point'), aF: 1.9 } : t < goT + .65 ? E.run(t * 16) : { ...E.pose('sad'), hd: .7 };
  halo(c, ax, ay - 80, .7);
  fig(c, { x: ax, y: ay + (pose === E.pose('crouch') ? 40 : 0), s, color: t > goT + .65 ? '#8a8a8a' : '#d8d8d8', pose });
  if (t < 1.6) { E.rrect(c, ax + 30, ay - 145, 22, 36, 4, '#1a2a3a', '#9ac8ff', 2); }
  TAG(c, 'ONE MORE MINUTE', 300, 760, t, .5, '#bbb', t < goT ? 1 : 0);
  TAG(c, 'NEXT TRAIN: ???', 300, 760, t, 4.6, '#8a8a8a');
  if (t > goT + .5) { const ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?', fr = Math.floor(t * 14); E.rrect(c, 560, 820, 380, 110, 10, '#0c0c0c', '#5a5a5e', 4); for (let i = 0; i < 6; i++) { const settle = t > goT + 1.6 + i * .15, L = settle ? '------'[i] : ch[Math.floor(E.rnd(fr * 7 + i) * ch.length)]; E.rrect(c, 576 + i * 60, 836, 50, 78, 6, '#1c1c20'); E.text(c, L, 601 + i * 60, 876, { size: 44, weight: 800, family: MONO, color: settle ? RED : '#e8e8e8' }); } for (let i = 0; i < 14; i++) { const q = ((t - goT) * (.8 + .5 * E.rnd(i)) + E.rnd(i + 4)) % 1; c.save(); c.globalAlpha = .5 * (1 - q); c.fillStyle = '#bdbdbd'; c.translate(-60 + q * 1200, GY - 30 - E.rnd(i * 5) * 260 + Math.sin(t * 5 + i) * 30); c.rotate(t * 6 + i); c.fillRect(-12, -8, 24, 16); c.restore(); } }
  E.particles(c, 620, 900, t - goT - .4, { n: 30, speed: 380, grav: 200 });
} },
// 4 — You'll never feel ready. Jump anyway.
{ dur: 7.2, zoom: t => 1.08 + .012 * t, focus: [480, 1020], draw(c, t) {
  if (t < 3.7) c.translate(Math.sin(t * 47) * 4 * E.p(t, .3, 1.5), Math.cos(t * 39) * 4 * E.p(t, .3, 1.5));
  { const hb = (t * 1.6) % 1, beat = Math.exp(-hb * 6); if (t < 3.7) E.glowDot(c, 480, 700, 300 + 120 * beat, 'rgba(255,255,255,.22)', .3 + .7 * beat); }
  const WY = 1310, BY = 820, s = 1.0, jT = 3.7, inT = 4.5, done = t > 5.2;
  TITLE(c, "YOU'LL NEVER FEEL READY.", 450);
  TITLE(c, 'JUMP ANYWAY.', 505, GOLD, E.p(t, jT, jT + .3));
  // pool
  c.save(); const g = c.createLinearGradient(0, WY, 0, 1480); g.addColorStop(0, done ? 'rgba(245,197,66,.35)' : 'rgba(120,170,220,.35)'); g.addColorStop(1, 'rgba(10,10,12,0)'); c.fillStyle = g; c.fillRect(-200, WY, 1500, 200); c.restore();
  for (let i = 0; i < 6; i++) { const x = (i * 220 + t * 60) % 1300 - 100; E.line(c, x, WY + Math.sin(t * 3 + i) * 4, x + 120, WY + Math.sin(t * 3 + i + 1) * 4, done ? GOLD : '#9ac8ff', 3); }
  // tower + board
  E.line(c, 140, BY, 140, WY, '#5a5a5e', 10); for (let y = BY + 40; y < WY; y += 50) E.line(c, 110, y, 170, y, '#5a5a5e', 5); E.line(c, 110, BY, 110, WY, '#5a5a5e', 6);
  const bend = t < jT ? 6 * Math.sin(t * 20) * E.p(t, .2, 1) : t < jT + .3 ? 26 * (1 - E.p(t, jT, jT + .3)) * Math.cos((t - jT) * 30) : 0;
  c.save(); c.strokeStyle = '#d8d8d8'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(120, BY); c.quadraticCurveTo(360, BY, 520, BY + bend); c.stroke(); c.restore();
  // fear voices around him, then they break
  [['TOO HIGH', 300, 640], ['WHAT IF', 720, 700], ['TOMORROW', 760, 860], ['NOT YET', 300, 980]].forEach(([w, x, y], i) => { TAG(c, w, x, y, t, .4 + i * .6, '#bbb', t < jT ? 1 : 0); E.particles(c, x, y, t - jT, { n: 18, speed: 300, color: '#9a9a9a', grav: 300, life: .7, seed: i * 9 }); });
  E.text(c, `WAITING ${String(Math.floor(E.p(t, 0, jT, 'lin') * 59)).padStart(2, '0')} MIN`, 540, 1470, { hud: true, size: 24, weight: 800, family: MONO, ls: 2, color: t < jT ? '#8a8a8a' : 'rgba(0,0,0,0)' });
  // the jump
  let x = 480, y = hipOn(BY, s) + Math.sin(t * 40) * (t < jT ? 2 : 0), rot = 0, pose = t < jT ? { ...E.pose('stand'), aF: .9, eF: 1.9, aB: .9, eB: 1.9, hd: .4 } : E.pose('jump');
  if (t >= jT && t < inT) { const q = E.p(t, jT, inT, 'lin'); x = E.lerp(480, 720, q); y = E.lerp(hipOn(BY, s), WY + 60, q) - Math.sin(q * Math.PI) * 220; rot = q * 2.6; pose = { ...E.pose('jump'), aB: -3, aF: 3 }; }
  if (t >= inT) { x = 720; y = WY - 40 - 30 * E.p(t, 5.0, 5.4, 'back'); pose = win(t, 5.0); }
  if (t >= inT && t < 5.0) { c.save(); c.globalAlpha = 1 - E.p(t, inT, 5.0); E.glowDot(c, 720, WY, 200, 'rgba(255,255,255,.5)'); c.restore(); }
  else { halo(c, x, y - 60, 1, done); c.save(); if (t >= inT) { c.beginPath(); c.rect(-200, 0, 1500, WY + 6); c.clip(); } fig(c, { x, y, s, rot, color: done ? GOLD : '#fff', pose }); c.restore(); }
  E.particles(c, 720, WY, t - inT, { n: 60, speed: 520, grav: 900, color: '#bfe8ff', life: 1 });
  E.particles(c, 720, WY - 150, t - 5.2, { n: 50, speed: 460, grav: 260 });
  for (let i = 0; i < 3; i++) { const q = E.p(t, inT + i * .3, inT + 1.6 + i * .3, 'lin'); if (q > 0 && q < 1) { c.save(); c.globalAlpha = 1 - q; c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.ellipse(720, WY + 8, 60 + 340 * q, 14 + 40 * q, 0, 0, 7); c.stroke(); c.restore(); } }
  E.text(c, 'THE WATER WAS FINE.', 540, 1460, { hud: true, size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 5.6, 6.0) });
} },
// 4 — The bamboo grows roots for years, then shoots up
{ dur: 7.4, zoom: t => 1.1 + .012 * t, focus: [560, 1060], draw(c, t) {
  if (t < 4.4) { const yrq = (t % 1.1) / 1.1, sky = .5 - .5 * Math.cos(yrq * Math.PI * 2); c.save(); const sg = c.createLinearGradient(0, 380, 0, 1180); sg.addColorStop(0, 'rgba(150,150,175,0)'); sg.addColorStop(1, `rgba(150,150,175,${.3 * sky})`); c.fillStyle = sg; c.fillRect(-300, 380, 1700, 800); c.restore(); const sx = E.lerp(-100, 1200, yrq); E.glowDot(c, sx, 720 - Math.sin(yrq * Math.PI) * 180, 240, 'rgba(255,240,200,.6)', sky); }
  else { E.rays(c, 640, 760, 900, .22, GOLD, 18, t * .9); for (let i = 0; i < 40; i++) { const q = ((t - 4.4) * (.35 + .3 * E.rnd(i)) + E.rnd(i + 9)) % 1; c.save(); c.globalAlpha = .9 * (1 - q); c.fillStyle = GOLD; c.translate(E.rnd(i * 3) * 1200 - 60 + Math.sin(t * 3 + i) * 30, 360 + q * 1100); c.rotate(t * 4 + i); c.fillRect(-7, -3, 14, 6); c.restore(); } }
  const GY = 1180, X = 640, s = .95, upT = 4.4, done = t > upT;
  TITLE(c, 'YEAR 1: NOTHING. YEAR 4: NOTHING.', 450);
  TITLE(c, 'YEAR 5: 90 FEET.', 505, GOLD, E.p(t, upT, upT + .3));
  floor(c, GY);
  // roots underground grow every year
  const yr = Math.min(4, 1 + Math.floor(t / 1.1)), rk = E.p(t, .1, upT, 'lin');
  c.save(); c.strokeStyle = done ? 'rgba(245,197,66,.85)' : 'rgba(200,200,200,.6)'; c.lineWidth = 4;
  for (let i = 0; i < 9; i++) { const ang = -1.2 + i * .3, L = 60 + 140 * rk * (.6 + .4 * E.rnd(i)); c.beginPath(); c.moveTo(X, GY); let px = X, py = GY; for (let j = 1; j <= 6; j++) { const q = j / 6; px = X + Math.sin(ang) * L * q + Math.sin(j + i) * 14; py = GY + Math.cos(ang) * L * q * .9; c.lineTo(px, py); } c.stroke(); } c.restore();
  // above ground: a sprout, then it shoots up
  const h = done ? 40 + 460 * E.p(t, upT, upT + 1.2, 'out') : 40;
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
  E.text(c, 'ROOTS FIRST.', 540, 1490, { hud: true, size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 5.8, 6.2) });
} },
] };
