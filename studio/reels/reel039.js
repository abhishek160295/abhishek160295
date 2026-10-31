// Reel 039 — "You miss 100% of the shots you don't take" (≤30s, ref #16/#17 lane: principle per scene, panel cards, slapstick)
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
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
const ground = gy => E.line(c => c, 0, 0, 0, 0);

const REEL = { title: "You miss 100% of the shots you don't take", bpm: 120, scenes: [
// 1 — Eyes on the screen walks into the pole and past the door
{ dur: 6, draw(c, t) {
  const s = .8, bonk = 1.9, done = t > 4.4;
  const post = gy => { E.line(c, 560, gy, 560, gy - 300, '#7a7a7a', 10); E.rrect(c, 540, gy - 316, 60, 18, 6, '#9a9a9a'); };
  const door = (gy, k) => { if (k > 0) E.glowDot(c, 830, gy - 110, 220, 'rgba(255,214,120,.6)', k); E.rrect(c, 790, gy - 220, 80, 220, 4, k > 0 ? '#ffe7a8' : '#ffe7a8', '#c9962a', 4); E.tag(c, 'GOAL', 830, gy - 250, 1, -1, { size: 16, color: GOLD, fill: '#2a2208' }); };
  const phoneIn = o => { const [hx, hy] = E.hand(o); E.glowDot(c, hx + 6, hy - 6, 50, 'rgba(120,190,255,.5)'); E.rrect(c, hx - 2, hy - 20, 16, 26, 3, '#2a3a4a', '#9ac8ff', 2); };
  PRIN(c, 'LOOK UP. THE GOAL IS RIGHT THERE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'EYES ON PHONE'); PANEL(c, ...P2, 'EYES ON GOAL', done);
  E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
  // top: BONK, stars, keeps scrolling, walks right past the door
  clip(c, P1, () => {
    post(gT); door(gT, .5);
    const PH = { ...E.pose('stand'), hd: .55, aF: .7, eF: 1.9, tor: .1 };
    let x = 180 + 190 * E.p(t, 0, bonk, 'lin'), y = hipOn(gT, s), pose = { ...E.walk(t * 7, .3), hd: .55, aF: .7, eF: 1.9 }, rot = 0;
    if (t > bonk && t < bonk + 1.4) { const k = E.p(t, bonk, bonk + .3, 'out'); x = 370 + 20 - 50 * k; rot = -.5 * k; pose = E.pose('jump'); if (t > bonk + .3) { y = gT - 52; rot = 0; pose = { ...E.pose('sit'), hd: .2 }; } }
    if (t >= bonk + 1.4) { const k = E.p(t, bonk + 1.4, 6, 'lin'); x = E.lerp(340, 1040, k); pose = { ...E.walk(t * 7, .3), hd: .55, aF: .7, eF: 1.9 }; }
    const o = { x, y, s, rot, color: '#bdbdbd', pose }; fig(c, o); if (!(t > bonk && t < bonk + 1.4)) phoneIn(o);
    if (t > bonk && t < bonk + 1.6) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1, [hx, hy] = E.headPos(o); c.save(); c.translate(hx + Math.cos(a) * 34, hy - 30 + Math.sin(a) * 10); c.rotate(a); c.fillStyle = GOLD; c.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 4 : 10, b = k * Math.PI / 5; c.lineTo(Math.cos(b) * r, Math.sin(b) * r); } c.fill(); c.restore(); }
    E.shake(c, t, bonk, .2, 10);
  });
  E.text(c, 'BONK!', 560, gT - 340, { size: 40, weight: 900, color: '#fff', alpha: E.p(t, bonk, bonk + .1) * (1 - E.p(t, bonk + .6, bonk + .8)) });
  SAY(c, 'WHO PUT THAT THERE?', 640, 690, E.p(t, bonk + .5, bonk + .8, 'back') * (1 - E.p(t, 3.6, 3.8)));
  if (t > 4.6) E.tag(c, 'WALKED PAST IT', 830, 650, t, 4.6, { size: 18, color: RED, fill: '#1e0a0a' });
  // bottom: sees the pole, sees the door, walks through it
  clip(c, P2, () => {
    post(gB); door(gB, E.p(t, 4.0, 4.4));
    const bx = E.lerp(180, 830, E.p(t, 0, 4.2, 'lin'));
    fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', alpha: done ? 1 - E.p(t, 4.8, 5.4) * .6 : 1, pose: done ? win(t, 4.4) : E.walk(t * 8) });
    if (done) E.glowDot(c, 830, gB - 120, 360, 'rgba(245,197,66,.4)', E.p(t, 4.4, 4.9));
  });
  CNT(c, 300, 1060, 'POLES HIT', 0, done ? 'THROUGH THE DOOR' : 'HEAD UP', done ? GOLD : '#e8e8e8');
  CNT(c, 300, 600, 'POLES HIT', t > bonk ? 1 : 0, 'STILL SCROLLING', '#e8e8e8', RED);
} },
// 2 — The grass is greener where you water it
{ dur: 6.5, draw(c, t) {
  const s = .78, done = t > 4.8, Y = [[90, 370], [370, 670], [670, 970]];
  const lawn = (gy, x0, x1, g, h) => { const col = `rgb(${Math.round(E.lerp(150, 70, g))},${Math.round(E.lerp(130, 190, g))},${Math.round(E.lerp(80, 90, g))})`; c.save(); c.strokeStyle = col; c.lineWidth = 4; c.lineCap = 'round'; for (let x = x0 + 8; x < x1 - 4; x += 9) { const hh = h * (.7 + .3 * E.rnd(x)), sw = Math.sin(t * 2 + x * .05) * 3; c.beginPath(); c.moveTo(x, gy); c.lineTo(x + sw, gy - hh); c.stroke(); } c.restore(); };
  const fence = (x, gy) => { for (let i = -2; i <= 2; i++) E.line(c, x + i * 12, gy, x + i * 12, gy - 90, '#9a8a76', 6); E.line(c, x - 30, gy - 60, x + 30, gy - 60, '#9a8a76', 5); E.line(c, x - 30, gy - 30, x + 30, gy - 30, '#9a8a76', 5); };
  PRIN(c, 'THE GRASS IS GREENER WHERE YOU WATER IT.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'JUMPS FENCES'); PANEL(c, ...P2, 'WATERS HIS OWN', done);
  // top: every yard turns brown the moment he lands in it
  const J = [[1.0, 0, 1], [2.6, 1, 2]];
  let yard = 0; J.forEach(([t0, a, b]) => { if (t > t0 + .5) yard = b; });
  Y.forEach(([x0, x1], i) => { const here = i === yard, green = here ? 0 : 1; const g0 = i === 0 ? (t < 1.5 ? 0 : E.p(t, 3.4, 4.2)) : i === 1 ? (t < 1.5 ? 1 : 1 - E.p(t, 1.5, 2.0)) : (t < 3.1 ? 1 : 1 - E.p(t, 3.1, 3.6)); lawn(gT, x0, x1, g0, 20 + 30 * g0); });
  fence(370, gT); fence(670, gT);
  let tx = 230, ty = hipOn(gT, s), tp = { ...E.pose('stand'), hd: -.1 }, tf = 1;
  J.forEach(([t0, a, b]) => { if (t > t0 && t < t0 + .5) { [tx, ty] = hop((t - t0) / .5, [230, 520, 820][a], hipOn(gT, s), [230, 520, 820][b], hipOn(gT, s), 130); tp = E.pose('jump'); } else if (t >= t0 + .5) tx = [230, 520, 820][b]; });
  if (t > 4.2) { tf = -1; tp = { ...E.pose('point'), aF: 1.5 }; }
  fig(c, { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp });
  SAY(c, 'IT WAS GREENER OVER THERE.', 560, 770, E.p(t, 4.4, 4.7, 'back'));
  CNT(c, 660, 600, 'FENCES JUMPED', J.filter(([t0]) => t > t0).length, 'LAWN: BROWN', '#e8e8e8', RED);
  // bottom: stays, waters, it grows
  const gg = E.p(t, .3, 4.8, 'lin');
  lawn(gB, Y[0][0], Y[0][1] + 140, gg, 20 + 50 * gg); lawn(gB, Y[1][0] + 140, Y[1][1], .55, 34); lawn(gB, Y[2][0], Y[2][1], .55, 34); fence(670, gB);
  if (gg > .6) for (let i = 0; i < 5; i++) { const k = E.p(t, 3 + i * .3, 3.4 + i * .3, 'back'); if (k > 0) { const fx = 130 + i * 70; E.line(c, fx, gB, fx, gB - 70 * k, '#5a8a4a', 4); c.save(); c.fillStyle = i % 2 ? GOLD : '#f2a2c0'; c.beginPath(); c.arc(fx, gB - 76 * k, 10 * k, 0, 7); c.fill(); c.restore(); } }
  const bo = { x: 420, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 4.8) : { ...E.pose('stand'), aF: 1.3, eF: .2 } };
  if (done) E.glowDot(c, 300, gB - 100, 420, 'rgba(245,197,66,.3)', E.p(t, 4.8, 5.3));
  fig(c, bo);
  if (!done) { const [hx, hy] = E.hand(bo); E.shaded(c, hx - 10, hy - 6, 50, 34, 6, '#7a8a9a', '#3a4a5a'); for (let i = 0; i < 8; i++) { const q = (t * 2.4 + i / 8) % 1; c.save(); c.globalAlpha = .8 * (1 - q); c.fillStyle = '#8fc8ff'; c.beginPath(); c.arc(hx + 46 - q * 120, hy + q * (gB - hy), 4, 0, 7); c.fill(); c.restore(); } }
  CNT(c, 660, 1060, 'DAYS WATERED', Math.round(60 * gg), done ? 'LAWN: GREENEST' : 'LAWN: GROWING', done ? GOLD : '#e8e8e8');
} },
// 3 — Speed means nothing without direction
{ dur: 6, draw(c, t) {
  const s = .8, done = t > 4.6;
  PRIN(c, 'SPEED MEANS NOTHING WITHOUT DIRECTION.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'FAST. NO DIRECTION.'); PANEL(c, ...P2, 'SLOW. ONE DIRECTION.', done);
  E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
  E.flag(c, 900, gT, 1, 0); E.flag(c, 900, gB, 1, 0);
  // top: sprints everywhere, gets nowhere
  const ph = (t * .9) % 1, tri = ph < .5 ? ph * 2 : 2 - ph * 2, tx = 200 + 420 * tri, tf = ph < .5 ? 1 : -1;
  fig(c, { x: tx, y: hipOn(gT, s), s, f: tf, color: '#bdbdbd', pose: E.run(t * 20) });
  for (let i = 0; i < 4; i++) E.line(c, tx - tf * (60 + i * 24), hipOn(gT, s) - 30 + i * 16, tx - tf * (100 + i * 24), hipOn(gT, s) - 30 + i * 16, 'rgba(255,255,255,.3)', 3);
  E.particles(c, tx, gT, (t * 4) % 1 * .25, { n: 6, speed: 150, color: '#8a8a8a', grav: 400, life: .25, seed: Math.floor(t * 4) });
  SAY(c, "I'M SO BUSY!", 300, 690, E.p(t, 2.2, 2.5, 'back'));
  CNT(c, 640, 600, 'KM RUN', (42 * E.p(t, 0, 6, 'lin')).toFixed(1), 'TO GOAL: STILL FAR', '#e8e8e8', RED);
  // bottom: walks. arrives.
  const bx = done ? 880 : E.lerp(200, 880, E.p(t, 0, 4.6, 'lin'));
  if (done) E.glowDot(c, 880, hipOn(gB, s) - 60, 340, 'rgba(245,197,66,.4)', E.p(t, 4.6, 5.0));
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 4.6) : E.walk(t * 8) });
  CNT(c, 640, 1060, 'KM RUN', (4 * E.p(t, 0, 4.6, 'lin')).toFixed(1), done ? 'TO GOAL: ARRIVED' : 'ONE DIRECTION', done ? GOLD : '#e8e8e8');
} },
// 4 — You miss 100% of the shots you don't take
{ dur: 8, draw(c, t) {
  const s = .8, buzz = 6.6, SH = [[1.2, 'rim'], [3.0, 'short'], [5.4, 'swish']], made = 5.4 + .9, done = t > made;
  const hoop = (gy, net) => { E.line(c, 900, gy, 900, gy - 300, '#6a6a6a', 8); E.rrect(c, 870, gy - 360, 14, 110, 3, '#d8d8d8'); E.line(c, 808, gy - 280, 870, gy - 280, RED, 6);
    c.save(); c.strokeStyle = '#d8d8d8'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = 812 + i * 13, sw = net * Math.sin(i + t * 20) * 6; c.beginPath(); c.moveTo(x, gy - 280); c.lineTo(x + 4 + sw, gy - 236); c.stroke(); } c.restore(); };
  const ball = (x, y) => { c.save(); c.fillStyle = '#e07a2a'; c.beginPath(); c.arc(x, y, 18, 0, 7); c.fill(); c.strokeStyle = '#5a2a0a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 18, y); c.lineTo(x + 18, y); c.moveTo(x, y - 18); c.lineTo(x, y + 18); c.stroke(); c.restore(); };
  const clock = Math.max(0, Math.ceil(6 - Math.max(0, t - .6)));
  PRIN(c, "YOU MISS 100% OF THE SHOTS YOU DON'T TAKE.", 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'WAITS FOR THE PERFECT SHOT'); PANEL(c, ...P2, 'SHOOTS', done);
  E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
  [[P1, gT], [P2, gB]].forEach(([P, gy]) => { const red = t > buzz; E.rrect(c, 560, P[0] + 20, 110, 70, 10, '#0c0c0c', red ? RED : '#4a4a50', 3); E.text(c, `0:0${clock}`, 615, P[0] + 56, { size: 34, weight: 800, family: MONO, color: red ? RED : clock <= 2 ? GOLD : '#e8e8e8' }); });
  E.flash(c, t, buzz, .3, '229,72,77', .3);
  // top: dribble, dribble, dribble... buzzer
  hoop(gT, 0);
  const tx = 320 + Math.sin(t * 1.4) * 30, bounce = Math.abs(Math.sin(t * 8));
  const to = { x: tx, y: hipOn(gT, s), s, color: '#bdbdbd', pose: t > buzz ? { ...E.pose('sad'), hd: .5 } : { ...E.pose('stand'), tor: .2, aF: 1.1 - bounce * .5, eF: .4 } };
  fig(c, to); if (t < buzz) { const [hx] = E.hand(to); ball(hx + 8, E.lerp(gT - 18, gT - 120, 1 - bounce)); } else ball(tx + 60, gT - 18);
  SAY(c, 'NOT YET.', 500, 730, E.p(t, 1.5, 1.8, 'back') * (1 - E.p(t, 3.2, 3.4)));
  SAY(c, 'ALMOST READY...', 520, 730, E.p(t, 3.4, 3.7, 'back') * (1 - E.p(t, buzz, buzz + .2)));
  if (t > buzz) E.tag(c, "TIME'S UP", 330, 700, t, buzz + .1, { size: 22, color: RED, fill: '#1e0a0a' });
  CNT(c, 120, 650, 'SHOTS', 0, t > buzz ? 'MISSED 100%' : 'WAITING', '#e8e8e8', t > buzz ? RED : null);
  // bottom: shoot, miss, shoot, miss, shoot... swish
  hoop(gB, done ? 1 - E.p(t, made, made + .8) : 0);
  let bp = E.pose('stand'), holding = true;
  SH.forEach(([t0, kind], i) => {
    if (t > t0 - .3 && t < t0 + .15) bp = { ...E.pose('stand'), tor: -.1, aF: 2.8, eF: .2, aB: 2.6 };
    const dt = t - t0; if (dt < 0) return; holding = t > t0 + 1.4 && i < 2 ? true : false;
    const k = Math.min(1, dt / .9), sx = 350, sy = gB - 240, ex = 838, ey = gB - 290;
    if (kind === 'swish') { if (dt < 1.4) { const x = E.lerp(sx, ex, k), y = E.lerp(sy, ey, k) - Math.sin(k * Math.PI) * 300 + (dt > .9 ? (dt - .9) * 360 : 0); ball(x, y); } }
    else if (kind === 'rim') { if (dt < .9) ball(E.lerp(sx, ex - 30, k), E.lerp(sy, ey, k) - Math.sin(k * Math.PI) * 300); else if (dt < 1.6) { const q = dt - .9; ball(ex - 30 + 200 * q, ey - 200 * q + 700 * q * q); } }
    else if (dt < 1.2) { const q = Math.min(1, dt / .8); ball(E.lerp(sx, 700, q), E.lerp(sy, gB - 18, q * q) - Math.sin(q * Math.PI) * 220); }
  });
  if (t < SH[0][0] || (t > SH[0][0] + 1.4 && t < SH[1][0]) || (t > SH[1][0] + 1.3 && t < SH[2][0])) { const bo = { x: 330, y: hipOn(gB, s), s, pose: { ...E.pose('stand'), tor: .2, aF: 1.1 - Math.abs(Math.sin(t * 8)) * .5, eF: .4 } }; const [hx] = E.hand(bo); ball(hx + 8, E.lerp(gB - 18, gB - 120, 1 - Math.abs(Math.sin(t * 8)))); bp = bo.pose; }
  if (done) { bp = win(t, made); E.glowDot(c, 838, gB - 280, 300, 'rgba(245,197,66,.45)', E.p(t, made, made + .4)); E.text(c, 'SWISH', 700, gB - 380, { size: 50, weight: 900, color: GOLD, alpha: E.p(t, made, made + .2) * (1 - E.p(t, made + 1.2, made + 1.5)) }); }
  fig(c, { x: 330, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: bp });
  [1.2 + .9, 3.0 + .8].forEach(tm => { if (t > tm && t < tm + .7) E.tag(c, 'MISS', 640, gB - 160, t, tm, { size: 18, color: '#bbb', alpha: 1 - E.p(t, tm + .4, tm + .7) }); });
  CNT(c, 120, 1100, 'SHOTS', SH.filter(([t0]) => t > t0).length, done ? 'MISSED 2. MADE 1.' : 'SHOOTING', done ? GOLD : '#e8e8e8');
  E.particles(c, 838, gB - 260, t - made, { n: 50, speed: 460, grav: 260 });
} },
] };
