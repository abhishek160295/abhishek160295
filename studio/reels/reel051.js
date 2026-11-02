// Reel 051 — "You'll never feel ready" (relatable: procrastination, overplanning, perfectionism, fear; reference bible style, ≤30s)
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
const car = (c, x, y, ph, col = '#d8d8d8', f = 1) => { c.save(); c.translate(x, y); c.scale(f, 1); E.rrect(c, -130, -86, 260, 56, 14, '#1c1c20', col, 5); c.save(); c.strokeStyle = col; c.lineWidth = 5; c.fillStyle = '#0e0e10'; c.beginPath(); c.moveTo(-70, -86); c.lineTo(-40, -132); c.lineTo(50, -132); c.lineTo(84, -86); c.closePath(); c.fill(); c.stroke(); c.restore(); E.line(c, 4, -86, 4, -130, col, 4);
  [-78, 80].forEach(wx => { c.save(); c.translate(wx, -26); c.fillStyle = '#111'; c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill(); c.stroke(); c.rotate(ph); for (let i = 0; i < 3; i++) { c.rotate(2.09); E.line(c, 0, 0, 0, 20, col, 4); } c.restore(); }); c.restore(); };
const REEL = { title: "You'll never feel ready", bpm: 120, speed: 1.1, push: .07, drift: 9, scenes: [
// 1 — The train doesn't wait until you feel ready
{ dur: 6.2, draw(c, t) {
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
  E.particles(c, 620, 900, t - goT - .4, { n: 30, speed: 380, grav: 200 });
} },
// 2 — You can't steer a parked car
{ dur: 7, draw(c, t) {
  const gT = 950, gB = 1420, done = t > 5.2;
  TITLE(c, "YOU CAN'T STEER A PARKED CAR.", 470, done ? GOLD : '#f2f2f2');
  floor(c, gT); floor(c, gB);
  LBL(c, 'PLANNING', 540, 590); LBL(c, 'MOVING', 540, 1060, done ? GOLD : '#e8e8e8');
  // top: parked forever, plans pile up
  car(c, 640, gT, 0, '#8a8a8a');
  fig(c, { x: 280, y: hipOn(gT, .85), s: .85, color: '#bdbdbd', pose: { ...E.pose('arms'), hd: .3 + .1 * Math.sin(t * 3) } });
  ['PLAN A', 'PLAN B', 'PLAN C', 'PLAN D', 'PLAN E'].forEach((w, i) => TAG(c, w, 190 + (i % 3) * 190, 650 + Math.floor(i / 3) * 52, t, .3 + i * .9, '#9a9a9a'));
  E.text(c, `DAY ${String(Math.round(E.p(t, 0, 6.5, 'lin') * 400)).padStart(3, '0')} · 0 KM`, 640, 1000, { size: 22, weight: 800, family: MONO, ls: 2, color: '#8a8a8a' });
  // bottom: drives, hits cones, adjusts, reaches the flag
  const k = E.p(t, .2, 5.2, 'lin'), cx = E.lerp(150, 790, k), wob = Math.sin(k * Math.PI * 4) * 6;
  [[400, 'WRONG TURN'], [620, 'MISTAKE']].forEach(([ox, w], i) => { const hit = cx > ox - 120; c.save(); c.translate(ox, gB); if (hit) c.rotate(.8 * E.p(cx, ox - 120, ox)); c.fillStyle = hit ? '#5a5a5a' : '#e8e8e8'; c.beginPath(); c.moveTo(-22, 0); c.lineTo(0, -60); c.lineTo(22, 0); c.fill(); c.restore(); TAG(c, w, ox, gB - 130 - i * 0, t, .6 + i * 1.2, '#bbb', hit ? .4 : 1); });
  E.flag(c, 900, gB, 1, done ? 30 : 0);
  if (done) { E.glowDot(c, 930, gB - 160, 300, 'rgba(245,197,66,.45)'); E.rays(c, 930, gB - 160, 380, .3, GOLD, 14, t * .2); }
  car(c, cx, gB + wob * 0, t * (done ? 2 : 14), done ? GOLD : '#ffffff');
  E.particles(c, 940, gB - 200, t - 5.2, { n: 50, speed: 460, grav: 260 });
  E.text(c, `${Math.round(k * 42)} KM`, 160, 1300, { size: 22, weight: 800, family: MONO, ls: 2, color: done ? GOLD : '#e8e8e8' });
} },
// 3 — Done is better than perfect
{ dur: 7, draw(c, t) {
  const GY = 1330, s = .95, done = t > 5.3;
  TITLE(c, 'DONE IS BETTER THAN PERFECT.', 470, done ? GOLD : '#f2f2f2');
  floor(c, GY); LBL(c, 'PERFECT', 270, 620); LBL(c, 'DONE', 790, 620, done ? GOLD : '#e8e8e8');
  // left: polishing one brick forever
  E.rrect(c, 230, GY - 160, 120, 160, 6, '#1e1e22', '#5a5a5e', 3);
  E.shaded(c, 240, GY - 210, 100, 50, 6, '#d8d8d8', '#8a8a8a');
  for (let i = 0; i < 4; i++) { const q = (t * 1.3 + i / 4) % 1; c.save(); c.globalAlpha = 1 - q; c.fillStyle = '#fff'; c.translate(260 + i * 22, GY - 220 - q * 50); c.rotate(.785); c.fillRect(-5, -5, 10, 10); c.restore(); }
  const rub = Math.sin(t * 14) * .25;
  fig(c, { x: 150, y: hipOn(GY, s), s, color: done ? '#7a7a7a' : '#d8d8d8', pose: { ...E.pose('point'), tor: .15, aF: 1.6 + rub, eF: .4, aB: 1.2 + rub, eB: .6 } });
  E.text(c, 'BRICKS: 1', 270, 1420, { size: 22, weight: 800, family: MONO, ls: 2, color: '#8a8a8a' });
  // right: rough bricks, a whole house
  const n = Math.floor(E.p(t, .2, 4.8, 'lin') * 30);
  for (let i = 0; i < n; i++) { const row = Math.floor(i / 5), col = i % 5, off = row % 2 ? 26 : 0; E.shaded(c, 640 + col * 56 + off - (row % 2 ? 26 : 0), GY - 40 - row * 42, 52, 38, 4, done ? '#e6c46a' : '#bdbdbd', done ? '#8a6a24' : '#5a5a5a'); }
  if (t > 4.8) { const a = E.p(t, 4.8, 5.2); c.save(); c.globalAlpha = a; c.fillStyle = done ? GOLD : '#bdbdbd'; c.beginPath(); c.moveTo(610, GY - 252); c.lineTo(782, GY - 360); c.lineTo(954, GY - 252); c.fill(); c.restore(); E.rrect(c, 740, GY - 200, 70, 80, 6, '#ffe7a8', GOLD, 3); E.glowDot(c, 775, GY - 160, 200, 'rgba(245,197,66,.5)', a); }
  const lay = (t * 2.2) % 1 < .5 && t < 4.8;
  fig(c, { x: 560, y: hipOn(GY, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 5.3) : lay ? { ...E.pose('point'), aF: 1.2 } : { ...E.pose('crouch') } });
  E.text(c, `BRICKS: ${n * 10}`, 790, 1420, { size: 22, weight: 800, family: MONO, ls: 2, color: done ? GOLD : '#e8e8e8' });
  E.particles(c, 780, GY - 300, t - 5.3, { n: 46, speed: 440, grav: 260 });
} },
// 4 — You'll never feel ready. Jump anyway.
{ dur: 7.5, draw(c, t) {
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
  E.text(c, `WAITING ${String(Math.floor(E.p(t, 0, jT, 'lin') * 59)).padStart(2, '0')} MIN`, 540, 1520, { size: 24, weight: 800, family: MONO, ls: 2, color: t < jT ? '#8a8a8a' : 'rgba(0,0,0,0)' });
  // the jump
  let x = 480, y = hipOn(BY, s) + Math.sin(t * 40) * (t < jT ? 2 : 0), rot = 0, pose = t < jT ? { ...E.pose('stand'), aF: .9, eF: 1.9, aB: .9, eB: 1.9, hd: .4 } : E.pose('jump');
  if (t >= jT && t < inT) { const q = E.p(t, jT, inT, 'lin'); x = E.lerp(480, 720, q); y = E.lerp(hipOn(BY, s), WY + 60, q) - Math.sin(q * Math.PI) * 220; rot = q * 2.6; pose = { ...E.pose('jump'), aB: -3, aF: 3 }; }
  if (t >= inT) { x = 720; y = WY - 40 - 30 * E.p(t, 5.0, 5.4, 'back'); pose = win(t, 5.0); }
  if (t >= inT && t < 5.0) { c.save(); c.globalAlpha = 1 - E.p(t, inT, 5.0); E.glowDot(c, 720, WY, 200, 'rgba(255,255,255,.5)'); c.restore(); }
  else { halo(c, x, y - 60, 1, done); c.save(); if (t >= inT) { c.beginPath(); c.rect(-200, 0, 1500, WY + 6); c.clip(); } fig(c, { x, y, s, rot, color: done ? GOLD : '#fff', pose }); c.restore(); }
  E.particles(c, 720, WY, t - inT, { n: 60, speed: 520, grav: 900, color: '#bfe8ff', life: 1 });
  E.particles(c, 720, WY - 150, t - 5.2, { n: 50, speed: 460, grav: 260 });
  for (let i = 0; i < 3; i++) { const q = E.p(t, inT + i * .3, inT + 1.6 + i * .3, 'lin'); if (q > 0 && q < 1) { c.save(); c.globalAlpha = 1 - q; c.strokeStyle = GOLD; c.lineWidth = 4; c.beginPath(); c.ellipse(720, WY + 8, 60 + 340 * q, 14 + 40 * q, 0, 0, 7); c.stroke(); c.restore(); } }
  E.text(c, 'THE WATER WAS FINE.', 540, 1460, { size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 5.6, 6.0) });
} },
] };
