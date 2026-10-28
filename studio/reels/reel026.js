// Reel 026 — "Keep the lights on" (story format + ref #15 devices: words as objects, two-line counters, light as reward, excuse bubbles, diagram finale)
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
// two-line counter (ref #15): small label, big number, small caption
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8') => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: col === GOLD ? GOLD : '#8a8a8a', align: 'left' });
};
// one-word excuse bubble (ref #15)
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const plank = (c, x, y, word, rot = 0, a = 1) => {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  E.shaded(c, -90, -24, 180, 48, 6, '#b8916a', '#6b4f30');
  E.text(c, word, 0, 1, { size: 26, weight: 800, family: MONO, ls: 2, color: '#1a1206' });
  c.restore();
};
const flame = (c, x, y, k, t) => {
  if (k <= 0) return;
  E.glowDot(c, x, y - 60 * k, 260 * k, 'rgba(255,170,60,.55)');
  [['#f08a24', 70, 190], [GOLD, 48, 140], ['#fff3c4', 24, 80]].forEach(([col, w, h], i) => {
    const fl = 1 + .08 * Math.sin(t * 13 + i * 2), ww = w * k * fl, hh = h * k * (1 + .1 * Math.sin(t * 9 + i));
    c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(x + Math.sin(t * 7 + i) * 6 * k, y - hh); c.quadraticCurveTo(x + ww, y - hh * .3, x, y); c.quadraticCurveTo(x - ww, y - hh * .3, x + Math.sin(t * 7 + i) * 6 * k, y - hh); c.fill(); c.restore();
  });
};

const REEL = { title: 'Keep the lights on', bpm: 120, scenes: [
// 1 — The same excuses: one sits on them, one burns them
{ dur: 8, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, WD = [['TIRED', .2], ['BUSY', 1.4], ['LATER', 2.6]];
  const lvl = WD.reduce((a, [, t0]) => a + E.p(t, t0 + 1.15, t0 + 1.5, 'out'), 0), done = t > 4.1;
  LB(c, 'SITS ON EXCUSES', 540, 540); LB(c, 'BURNS THEM', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: the excuses stack into a comfortable seat
  WD.forEach(([w, t0], i) => { if (t < t0) return; const y1 = gT - 24 - 48 * i, y = E.lerp(650, y1, E.p(t, t0, t0 + .45, 'in')); plank(c, 620, y, w); E.particles(c, 620, y1 + 24, t - t0 - .45, { n: 14, speed: 240, color: '#9a8060', grav: 600, life: .5, seed: i }); });
  let tx = 380, ty = hipOn(gT, s), tp = E.pose('arms'), tf = 1;
  if (t > 3.6) { const k = E.p(t, 3.6, 4.3, 'lin'); tx = E.lerp(380, 600, k); tp = k < 1 ? E.walk(t * 9) : { ...E.pose('sit'), hd: .3 }; if (k >= 1) { ty = gT - 144 - 8; tf = -1; } }
  fig(c, { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp });
  SAY(c, 'LATER.', 470, 650, E.p(t, 4.6, 4.9, 'back') * (1 - E.p(t, 6.0, 6.2)), 1);
  SAY(c, 'TOMORROW.', 470, 650, E.p(t, 6.2, 6.5, 'back'), 1);
  // bottom: the same excuses become fuel
  E.shaded(c, 600, gB - 22, 110, 22, 6, '#6b4f30', '#3a2a18');
  flame(c, 655, gB - 20, .45 + .55 * lvl / 3 * 1.6, t);
  if (done) { E.glowDot(c, 540, gB - 160, 620, 'rgba(255,190,80,.22)', E.p(t, 4.1, 4.8)); }
  let bp = E.pose('stand');
  WD.forEach(([w, t0], i) => {
    if (t < t0 || t > t0 + 1.25) return;
    if (t < t0 + .75) { const y = E.lerp(1170, gB - 24, E.p(t, t0, t0 + .45, 'in')); plank(c, 400, y, w); if (t > t0 + .45) bp = E.pose('crouch'); }
    else { const k = E.p(t, t0 + .75, t0 + 1.2, 'lin'); const [x, y] = hop(k, 400, gB - 140, 655, gB - 60, 160); plank(c, x, y, w, k * 3, 1 - E.p(t, t0 + 1.1, t0 + 1.25)); bp = { ...E.pose('point'), aF: 2.4, eF: 0 }; }
  });
  if (done) bp = win(t, 4.1);
  fig(c, { x: 320, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: bp });
  E.particles(c, 655, gB - 120, t - 3.85, { n: 50, speed: 420, grav: -120, color: '#ffb340', life: 1.4 });
} },
// 2 — Some days vs every day: the lamps only stay on if you keep walking
{ dur: 9, draw(c, t) {
  const gT = 950, gB = 1480, s = .78, LX = [180, 320, 460, 600, 740, 880];
  const lamp = (x, gy, on) => {
    E.line(c, x, gy, x, gy - 240, '#5a5a5a', 6); E.line(c, x, gy - 240, x + 34, gy - 240, '#5a5a5a', 6);
    E.rrect(c, x + 20, gy - 246, 44, 16, 5, on > .05 ? '#fff1c8' : '#2a2a2a', '#777', 2);
    if (on > .05) { E.glowDot(c, x + 42, gy - 236, 150, 'rgba(255,214,120,.65)', on);
      c.save(); c.globalAlpha = .28 * on; const g = c.createLinearGradient(0, gy - 236, 0, gy); g.addColorStop(0, '#ffd678'); g.addColorStop(1, 'rgba(255,214,120,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x + 30, gy - 232); c.lineTo(x - 30, gy); c.lineTo(x + 114, gy); c.lineTo(x + 54, gy - 232); c.fill(); c.restore(); }
  };
  const done = t > 6.7;
  LB(c, 'SOME DAYS', 540, 540); LB(c, 'EVERY DAY', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: lights two, skips, the light fades
  const tx = E.lerp(110, 340, E.p(t, .2, 1.9, 'lin'));
  const fade = t < 3.4 ? 1 : (1 - E.p(t, 3.4, 4.6)) * (Math.sin(t * 37) > -.4 ? 1 : .35);
  let litT = 0;
  LX.forEach((x, i) => { const reached = tx >= x - 6, on = reached ? fade : 0; if (on > .05) litT++; lamp(x, gT, on); });
  fig(c, { x: tx, y: t > 2.3 ? gT - 52 : hipOn(gT, s), s, color: '#bdbdbd', pose: t > 2.3 ? { ...E.pose('sit'), hd: .4 } : t > 1.9 ? E.pose('stand') : E.walk(t * 9) });
  SAY(c, 'SKIP TODAY.', 440, 640, E.p(t, 2.5, 2.8, 'back') * (1 - E.p(t, 4.6, 4.8)));
  SAY(c, 'TOMORROW.', 440, 640, E.p(t, 4.8, 5.1, 'back'));
  const day = 1 + Math.round(29 * E.p(t, .2, 6.6, 'lin'));
  CNT(c, 50, 600, 'DAY', day, `${litT} LAMPS ON`);
  // bottom: walks every day, every lamp stays lit
  const bx = E.lerp(110, 900, E.p(t, .2, 6.6, 'lin'));
  let litB = 0;
  LX.forEach((x, i) => { const tl = .2 + (x - 6 - 110) / 790 * 6.4, on = E.p(t, tl, tl + .3); if (on > .05) litB++; lamp(x, gB, on); });
  if (done) E.glowDot(c, 540, gB - 160, 640, 'rgba(255,200,90,.2)', E.p(t, 6.7, 7.3));
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 6.8) : E.walk(t * 9) });
  CNT(c, 50, 1130, 'DAY', day, `${litB} LAMPS ON`, done ? GOLD : '#e8e8e8');
  E.particles(c, bx, hipOn(gB, s) - 80, t - 6.8, { n: 45, speed: 480, grav: 300 });
} },
// 3 — The stone called YOU: one leaves it, one shapes it
{ dur: 9, draw(c, t) {
  const gy = 1400, reveal = 6.6, done = t > reveal;
  LB(c, 'LEAVES IT', 250, 540); LB(c, 'SHAPES IT', 780, 540, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gy);
  const day = 1 + Math.round(364 * E.p(t, .2, reveal, 'lin'));
  // left: an untouched block gathering dust
  E.shaded(c, 100, gy - 400, 220, 400, 8, '#8f8f8f', '#3a3a3a');
  c.save(); c.globalAlpha = .45 * E.p(t, 0, 8); c.fillStyle = '#000'; c.fillRect(100, gy - 400, 220, 400); c.restore();
  if (t > 5.2) { const a = E.p(t, 5.2, 5.8); c.save(); c.globalAlpha = a; c.strokeStyle = '#bbb'; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(100, gy - 400 + i * 14); c.quadraticCurveTo(116, gy - 386, 100 + i * 14, gy - 400); c.stroke(); } c.restore(); }
  if (t > 6.8) { const k = E.p(t, 6.8, 7.3); E.line(c, 210, gy - 400, 210 - 20 * k, gy - 400 + 120 * k, '#1a1a1a', 4); E.line(c, 190, gy - 300, 230, gy - 300 + 80 * k, '#1a1a1a', 4); }
  E.tag(c, 'YOU', 210, gy - 440, t, -1, { size: 22, color: '#bbb' });
  fig(c, { x: 400, y: gy - 52, s: .78, color: '#bdbdbd', pose: { ...E.pose('sit'), hd: .3 } });
  SAY(c, 'SOON.', 430, gy - 250, E.p(t, 1.0, 1.3, 'back') * (1 - E.p(t, 4.2, 4.4)));
  SAY(c, 'NEXT YEAR.', 430, gy - 250, E.p(t, 4.4, 4.7, 'back'));
  CNT(c, 90, 600, 'DAY', day, '0 STRIKES');
  // right: strike by strike, the statue inside appears
  E.shaded(c, 680, gy - 40, 220, 40, 6, '#7a7a7a', '#3a3a3a');
  if (done) { E.glowDot(c, 790, gy - 260, 480, 'rgba(245,197,66,.45)', E.p(t, reveal, reveal + .5)); E.rays(c, 790, gy - 260, 520, .28 * E.p(t, reveal, reveal + .5), GOLD, 16, t * .15); }
  fig(c, { x: 790, y: gy - 40 - E.FIG_H * 1.2, s: 1.2, lw: 26, color: done ? GOLD : '#d8d8d8', pose: { ...E.pose('cheer'), aF: 2.7, aB: -2.7 } });
  const C0 = 680, R0 = gy - 460, CS = 20, NC = 11, NR = 21;
  let left = 0;
  for (let r = 0; r < NR; r++) for (let q = 0; q < NC; q++) {
    const tr = .3 + E.rnd(r * 31 + q * 7 + 3) * (reveal - .5) * (.4 + .6 * (1 - r / NR));
    if (t < tr) { left++; const v = 120 + Math.round(30 * E.rnd(r * 13 + q)); c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(C0 + q * CS, R0 + r * CS, CS, CS); }
  }
  const strikes = Math.round(2000 * E.p(t, .2, reveal, 'lin'));
  const hit = !done && Math.sin(t * 14) > .6, so = { x: 610, y: hipOn(gy, .8), s: .8, pose: { ...E.pose('stand'), aF: hit ? 1.7 : 2.3, eF: hit ? .2 : .8, aB: 1.4, eB: .3 } };
  if (!done) { const [hx, hy] = E.hand(so); E.line(c, hx, hy, hx + 34, hy + 8, '#ccc', 6); if (hit) E.particles(c, 680, hy, (t * 14 % (Math.PI * 2)) / 14, { n: 6, speed: 220, color: '#aaa', grav: 600, life: .3, seed: Math.floor(t * 2.2) }); }
  fig(c, { ...so, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('stand'), hd: -.4 } : so.pose });
  CNT(c, 620, 600, 'DAY', day, `${strikes.toLocaleString('en-US')} STRIKES`, done ? GOLD : '#e8e8e8');
  E.particles(c, 790, gy - 300, t - reveal, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
// 4 — The plateau: most quit where nothing seems to happen
{ dur: 10, draw(c, t) {
  const X0 = 140, Y0 = 1400, KNEE = 700, TOP = 900, s = .55;
  const cy = x => x < KNEE ? 1380 - 18 * (x - X0) / (KNEE - X0) : 1362 - 720 * Math.pow((x - KNEE) / (TOP - KNEE), 2.2);
  const xp = t < 5.6 ? E.lerp(170, KNEE, E.p(t, .3, 5.6, 'lin')) : E.lerp(KNEE, TOP, E.p(t, 5.6, 7.6, 'in'));
  const done = t > 7.6;
  LB(c, 'THE PLATEAU', 540, 470, { size: 34, ls: 5, color: done ? GOLD : '#e8e8e8' });
  E.line(c, X0, Y0, 960, Y0, '#6a6a6a', 3); E.line(c, X0, Y0, X0, 620, '#6a6a6a', 3);
  E.text(c, 'TIME', 920, Y0 + 34, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a' });
  c.save(); c.translate(X0 - 30, 700); c.rotate(-Math.PI / 2); E.text(c, 'RESULTS', 0, 0, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a' }); c.restore();
  // the road behind him is solid; the road ahead is a guess
  c.save(); c.lineCap = 'round';
  c.strokeStyle = done ? GOLD : '#e8e8e8'; c.lineWidth = 6; c.beginPath(); for (let x = X0; x <= xp; x += 4) { const y = cy(x); x === X0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
  if (xp < KNEE) { c.setLineDash([10, 12]); c.strokeStyle = '#5a5a5a'; c.lineWidth = 4; c.beginPath(); c.moveTo(xp, cy(xp)); c.lineTo(940, cy(KNEE)); c.stroke(); }
  c.restore();
  E.tag(c, 'WHERE MOST QUIT', 430, Y0 + 60, t, -1, { size: 20, color: '#aaa' });
  // the others: walk, stall, quit, drop off the line
  const says = [];
  [[230, 340, 'NOTHING.'], [300, 480, 'POINTLESS.'], [370, 610, 'I QUIT.']].forEach(([x0, qx, w], i) => {
    const sp = (KNEE - 170) / 5.3, x = Math.min(x0 + sp * Math.max(0, t - .3), qx), tq = .3 + (qx - x0) / sp;
    const fall = E.p(t, tq + 1.0, tq + 1.8, 'in'); if (fall >= 1) return;
    fig(c, { x, y: hipOn(cy(x), s) + fall * 260, s, rot: fall * 1.4, color: '#9a9a9a', alpha: 1 - fall, pose: t < tq ? E.walk(t * 9 + i) : { ...E.pose('sad'), hd: .5 } });
    says.push([w, x, cy(x) - 160, E.p(t, tq + .1, tq + .4, 'back') * (1 - E.p(t, tq + 1.0, tq + 1.3))]);
  });
  says.forEach(([w, x, y, a]) => SAY(c, w, x, y, a));
  // him: keeps walking the flat part until it bends
  const steep = xp > KNEE + 10;
  if (done) { E.glowDot(c, TOP, 620, 420, 'rgba(245,197,66,.45)', E.p(t, 7.6, 8.1)); E.rays(c, TOP, 620, 480, .28 * E.p(t, 7.6, 8.1), GOLD, 16, t * .15); }
  fig(c, { x: xp - (steep && !done ? 14 : 0), y: hipOn(cy(xp), s * 1.15), s: s * 1.15, color: done ? GOLD : '#fff', pose: done ? win(t, 7.6) : steep ? { ...E.pose('climb'), aF: 2.7 + Math.sin(t * 10) * .25, aB: 2.4 - Math.sin(t * 10) * .25 } : E.walk(t * 9) });
  if (done) E.text(c, 'BREAKTHROUGH', 700, 560, { size: 30, weight: 700, ls: 5, color: GOLD, alpha: E.p(t, 7.8, 8.2) });
  const day = done ? 730 : Math.round(E.lerp(1, 730, E.p(t, .3, 7.6, 'lin')));
  CNT(c, 180, 640, 'DAY', day, done ? 'RESULTS: EVERYTHING' : 'RESULTS: NONE YET', done ? GOLD : '#e8e8e8');
  E.particles(c, TOP, 640, t - 7.6, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
