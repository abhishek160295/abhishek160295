// Reel 024 — "You were a seed" (story format: 4 scenes that build, small caps labels, mono + gold)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const hop = (k, x0, y0, x1, y1, h = 90) => [E.lerp(x0, x1, k), E.lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
const slab = (c, x1, x2, gy, depth = 300) => {
  const g = c.createLinearGradient(0, gy, 0, gy + depth); g.addColorStop(0, '#2e2e31'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, depth); c.restore();
  E.line(c, x1, gy, x2, gy, '#6a6a6a', 3);
};
const cliff = (c, x1, x2, gy) => {
  const g = c.createLinearGradient(0, gy, 0, gy + 260); g.addColorStop(0, '#3a3a3e'); g.addColorStop(1, 'rgba(8,8,9,0)');
  c.save(); c.fillStyle = g; c.fillRect(x1, gy, x2 - x1, 260); c.restore();
  E.line(c, x1, gy, x2, gy, '#7a7a7a', 3);
};
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const water = (c, wy, t) => {
  const g = c.createLinearGradient(0, wy, 0, wy + 220); g.addColorStop(0, '#24323e'); g.addColorStop(1, 'rgba(8,10,12,0)');
  c.save(); c.fillStyle = g; c.fillRect(-100, wy, 1280, 220);
  c.strokeStyle = 'rgba(200,220,235,.35)'; c.lineWidth = 3;
  for (let i = 0; i < 14; i++) { const x = ((E.rnd(i) * 1180 + t * 40 * (1 + E.rnd(i + 4))) % 1180) - 50, y = wy + 14 + E.rnd(i + 2) * 120; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 40, y); c.stroke(); }
  c.restore(); E.line(c, -100, wy, 1180, wy, '#6f8293', 3);
};
const boat = (c, x, wy, rot, col, t, figCol, s = 1) => {
  c.save(); c.translate(x, wy + Math.sin(t * 2 + x * .01) * 4); c.rotate(rot + Math.sin(t * 1.6 + x) * .03); c.scale(s, s);
  E.shaded(c, -70, -14, 140, 30, 10, '#8a8a8a', '#3a3a3a');
  E.line(c, 4, -14, 4, -170, '#bbb', 5);
  c.fillStyle = col; c.beginPath(); c.moveTo(10, -165); c.lineTo(72, -40); c.lineTo(10, -40); c.closePath(); c.fill();
  fig(c, { x: -36, y: -14 - E.FIG_H * .45, s: .45, color: figCol, pose: E.pose('stand') });
  c.restore();
};

const REEL = { title: 'You were a seed', bpm: 120, scenes: [
// 1 — The crowd vs your compass
{ dur: 8.5, draw(c, t) {
  const gT = 930, gB = 1470, arrive = 5.6, done = t > arrive;
  LB(c, 'THE CROWD', 540, 540); LB(c, 'YOUR COMPASS', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  // top: everyone follows the boat ahead, into the rocks
  water(c, gT, t);
  const fogA = 1 - E.p(t, 2.6, 3.6);
  c.save(); c.fillStyle = '#5a5a5a'; [[820, 90], [900, 130], [970, 80]].forEach(([x, h]) => { c.beginPath(); c.moveTo(x - 60, gT + 10); c.lineTo(x - 10, gT - h); c.lineTo(x + 40, gT - h * .7); c.lineTo(x + 70, gT + 10); c.fill(); }); c.restore();
  const crash = [3.4, 3.8, 4.2, 4.6];
  for (let i = 0; i < 4; i++) {
    const stopX = 720 - i * 130, x = Math.min(E.lerp(160 - i * 150, 1100 - i * 150, E.p(t, 0, 6, 'lin')), stopX), hit = t > crash[i];
    boat(c, x, gT + (hit ? 26 * E.p(t, crash[i], crash[i] + .6) : 0), hit ? .35 * E.p(t, crash[i], crash[i] + .4, 'back') * (i % 2 ? -1 : 1) : 0, '#9a9a9a', t, '#cfcfcf', .95);
    E.particles(c, x + 60, gT, t - crash[i], { n: 16, speed: 260, color: '#c8d8e6', grav: 600, life: .6, seed: i * 7 });
  }
  if (fogA > 0) for (let k = 0; k < 6; k++) E.glowDot(c, 620 + k * 80 + Math.sin(t * .6 + k) * 30, gT - 70 + (k % 2) * 40, 170, 'rgba(170,170,175,.55)', fogA);
  E.tag(c, 'EVERYONE WENT THIS WAY', 440, 680, t, 4.8, { size: 22, color: '#bbb' });
  // bottom: one boat, its own compass, the lighthouse
  water(c, gB, t);
  c.save(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(800, gB + 4); c.quadraticCurveTo(900, gB - 90, 1010, gB + 4); c.fill(); c.restore();
  E.shaded(c, 885, gB - 250, 34, 180, 4, '#d8d8d8', '#7a7a7a');
  if (done) { const a = E.p(t, arrive, arrive + .4); E.glowDot(c, 902, gB - 262, 300, 'rgba(245,197,66,.5)', a); E.rays(c, 902, gB - 262, 380, .3 * a, GOLD, 12, t * .4); }
  E.rrect(c, 878, gB - 280, 48, 34, 6, done ? GOLD : '#4a4a4a', '#9a9a9a', 3);
  const bx = E.lerp(130, 740, E.p(t, .4, arrive, 'inOut'));
  boat(c, bx, gB, 0, done ? GOLD : '#e8e8e8', t, done ? GOLD : '#fff', 1);
  // compass: spins, locks on, leads him in
  const cx = Math.min(bx, 700), cy = gB - 250, ang = t < 1.2 ? t * 9 : E.lerp(1.2 * 9 % (Math.PI * 2), Math.PI / 2 + Math.PI * 2, E.p(t, 1.2, 1.6, 'back'));
  c.save(); c.translate(cx, cy); c.fillStyle = '#101010'; c.strokeStyle = done ? GOLD : '#ddd'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 34, 0, 7); c.fill(); c.stroke();
  c.rotate(ang); c.fillStyle = GOLD; c.beginPath(); c.moveTo(0, -26); c.lineTo(7, 0); c.lineTo(-7, 0); c.fill(); c.fillStyle = '#777'; c.beginPath(); c.moveTo(0, 26); c.lineTo(7, 0); c.lineTo(-7, 0); c.fill(); c.restore();
  E.particles(c, 902, gB - 262, t - arrive, { n: 45, speed: 460, grav: 260 });
} },
// 2 — Comparing vs improving: whose bar are you jumping?
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, BX0 = 470, BX1 = 610;
  const bar = (gy, h, a = 1, rot = 0, gold = false) => {
    E.line(c, BX0, gy, BX0, gy - 290, '#6a6a6a', 5); E.line(c, BX1, gy, BX1, gy - 290, '#6a6a6a', 5);
    c.save(); c.globalAlpha = a; c.translate(BX0, gy - h); c.rotate(rot); E.line(c, 0, 0, BX1 - BX0, 0, gold ? GOLD : '#e8e8e8', 7); c.restore();
  };
  const H = [70, 110, 150, 190, 230, 265], DAYS = [1, 60, 120, 200, 300, 365], CY = 1.15, T0 = .3;
  const cyc = Math.min(5, Math.floor(Math.max(0, t - T0) / CY)), done = t > T0 + 6 * CY - .25;
  LB(c, 'COMPARING', 200, 560); LB(c, 'IMPROVING', 200, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: jumps at their level, crashes twice, gives up
  const tries = [[.2, 1.4], [3.2, 4.4]], y0 = hipOn(gT, s);
  let x = 150, y = y0, f = 1, pose = E.pose('stand'), rot = 0, ba = 1;
  tries.forEach(([a, b]) => {
    if (t > a && t < b) { const k = (t - a) / (b - a); if (k < .6) { x = E.lerp(150, 430, k / .6); pose = E.run(t * 16); } else { const j = (k - .6) / .4; [x, y] = hop(j, 430, y0, 500, y0 + 10, 150); pose = j < .5 ? E.pose('jump') : E.pose('crouch'); } }
    if (t >= b && t < b + .6) { x = 500; y = y0 + 30; pose = E.pose('crouch'); }
    if (t > a + .95 && t < b + 1) rot = .9 * E.p(t, a + .95, a + 1.2, 'in'), ba = 1 - E.p(t, b + .6, b + 1);
  });
  if (t > 2.0 && t < 3.2) { const k = E.p(t, 2.0, 3.0, 'lin'); x = E.lerp(500, 150, k); f = -1; pose = E.walk(t * 9); y = y0; }
  if (t > 5.0) { x = 500; y = y0 + 40; pose = { ...E.pose('sit'), hd: .6, tor: .2 }; y = gT - 56; }
  bar(gT, 260, t > 1.15 && t < 2.6 || t > 4.15 ? (t > 5 ? 1 : ba) : 1, (t > 1.15 && t < 2.6) || (t > 4.15 && t < 5) ? rot : (t > 5 ? .9 : 0));
  E.tag(c, 'THEIR LEVEL', 700, gT - 260, t, -1, { size: 20, color: '#999' });
  fig(c, { x, y, s, f, color: '#bdbdbd', pose });
  E.tag(c, "I'M NOT ENOUGH", 330, 640, t, 5.3, { size: 22, color: '#bbb' });
  // bottom: his own bar, one notch higher each time
  const yb = hipOn(gB, s); let bx = 250, by = yb, bf = 1, bp = E.pose('stand');
  if (t > T0 && !done) {
    const k = ((t - T0) % CY) / CY, dir = cyc % 2 ? -1 : 1, xa = dir > 0 ? 250 : 830, xb = dir > 0 ? 830 : 250, ja = dir > 0 ? 400 : 680, jb = dir > 0 ? 680 : 400;
    bf = dir;
    if (k < .35) { bx = E.lerp(xa, ja, k / .35); bp = E.run(t * 16); }
    else if (k < .75) { [bx, by] = hop((k - .35) / .4, ja, yb, jb, yb, H[cyc] + 40); bp = E.pose('jump'); }
    else { bx = E.lerp(jb, xb, (k - .75) / .25); bp = E.run(t * 16); }
  }
  if (done) { bx = 830; bf = -1; bp = win(t, T0 + 6 * CY - .25); }
  const hb = cyc < 5 ? E.lerp(H[cyc], H[Math.min(5, cyc + 1)], 0) : H[5];
  bar(gB, hb, 1, 0, done);
  if (done) { E.glowDot(c, 540, gB - 265, 260, 'rgba(245,197,66,.35)', E.p(t, 7.0, 7.4)); E.tag(c, 'THEIR LEVEL', 700, gB - 300, t, 7.1, { size: 20, color: GOLD, fill: '#2a2208' }); }
  fig(c, { x: bx, y: by, s, f: bf, color: done ? GOLD : '#fff', pose: bp });
  E.tag(c, `DAY ${DAYS[cyc]}`, 200, 1140, t, -1, { size: 24, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.particles(c, 830, by - 80, t - (T0 + 6 * CY - .25), { n: 45, speed: 480, grav: 300 });
} },
// 3 — Listening vs ignoring: the tightrope
{ dur: 7.5, draw(c, t) {
  const rT = 930, rB = 1460, s = .78;
  const DB = [["YOU'LL FALL", 1.0, 330, -260], ['WHO DO YOU THINK YOU ARE?', 1.9, 560, -330], ['GIVE UP', 2.8, 760, -250]];
  const cross = E.p(t, .3, 6.0, 'lin'), done = cross >= 1;
  LB(c, 'LISTENING', 540, 480); LB(c, 'IGNORING', 540, 1020, { color: done ? GOLD : '#e8e8e8' });
  const rope = (ry, fx) => { c.save(); c.strokeStyle = '#bbb'; c.lineWidth = 4; c.beginPath(); c.moveTo(180, ry); c.quadraticCurveTo(fx, ry + 26, 900, ry); c.stroke(); c.restore(); };
  // top: he turns to every voice, wobbles, falls
  cliff(c, -100, 180, rT); cliff(c, 900, 1180, rT);
  const fall = E.p(t, 3.9, 4.8, 'in');
  let tx = E.lerp(200, 880, Math.min(cross, E.p(3.9, .3, 6.0, 'lin'))); if (t < 3.9) tx = E.lerp(200, 880, cross);
  rope(rT, t < 3.9 ? tx : 540);
  const wob = Math.sin(t * 7) * .04 * (1 + t * 1.2);
  if (fall < 1) { const ho = { x: tx, y: hipOn(rT + 13, s) + fall * 420, s, f: 1, rot: wob + fall * 1.6, pose: { ...E.pose('stand'), aB: -1.57, eB: 0, aF: 1.57, eF: 0, hd: -.35 }, color: '#bdbdbd', alpha: 1 - fall };
    fig(c, ho); c.save(); c.globalAlpha = 1 - fall; c.translate(tx, ho.y - 60 * s); c.rotate(wob + fall * 1.6); E.line(c, -150, 0, 150, 0, '#9a9a9a', 5); c.restore(); }
  DB.forEach(([str, t0, x, dy]) => E.bubble(c, str, x, rT + dy, E.p(t, t0, t0 + .3, 'back'), { size: 24, color: '#ccc' }));
  // bottom: eyes on the other side, the voices pop as he passes
  cliff(c, -100, 180, rB); cliff(c, 900, 1180, rB);
  const bx = done ? E.lerp(880, 930, E.p(t, 6.0, 6.3)) : E.lerp(200, 880, cross);
  rope(rB, done ? 540 : bx);
  DB.forEach(([str, t0, x, dy], i) => { const tp = .3 + (x - 200) / 680 * 5.7 + .2, a = E.p(t, t0, t0 + .3, 'back') * (1 - E.p(t, tp, tp + .15)); E.bubble(c, str, x, rB + dy, a, { size: 24, color: '#ccc' }); E.particles(c, x, rB + dy, t - tp, { n: 14, speed: 240, color: '#bbb', grav: 0, life: .5, seed: i * 3 }); });
  const by = done ? hipOn(rB, s) : hipOn(rB + 13, s), bw = done ? 0 : Math.sin(t * 5) * .03;
  if (done) { E.glowDot(c, 930, by - 60, 320, 'rgba(245,197,66,.3)', E.p(t, 6.2, 6.7)); }
  fig(c, { x: bx, y: by, s, rot: bw, color: done ? GOLD : '#fff', pose: done ? win(t, 6.2) : { ...E.pose('stand'), aB: -1.57, eB: 0, aF: 1.57, eF: 0, hd: -.05 } });
  if (!done) { c.save(); c.translate(bx, by - 60 * s); c.rotate(bw); E.line(c, -150, 0, 150, 0, '#c8a46a', 5); c.restore(); }
  E.particles(c, 930, by - 80, t - 6.2, { n: 45, speed: 480, grav: 300 });
} },
// 4 — They tried to bury you
{ dur: 10, draw(c, t) {
  const sy = 900, pitB = 1260, seedY = 1210, grow = E.p(t, 5.6, 8.2, 'out'), turned = t > 6.4;
  // headline
  if (!turned) E.title(c, 'THEY TRIED TO BURY YOU', 540, 350, t, -1, 6.1, { size: 36, weight: 600, ls: 4, family: 'Inter', color: '#e8e8e8' });
  else { E.title(c, "THEY DIDN'T KNOW", 540, 320, t, 6.4, 1e9, { size: 34, weight: 600, ls: 4, family: 'Inter', color: '#e8e8e8' }); E.title(c, 'YOU WERE A SEED', 540, 378, t, 6.9, 1e9, { size: 40, weight: 700, ls: 5, family: 'Inter', color: GOLD }); }
  // earth
  c.save(); const g = c.createLinearGradient(0, sy, 0, 1700); g.addColorStop(0, '#2e2b28'); g.addColorStop(1, '#100f0e'); c.fillStyle = g; c.fillRect(-100, sy, 1280, 900);
  for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(255,255,255,${.04 + .05 * E.rnd(i + 3)})`; c.beginPath(); c.arc(E.rnd(i) * 1080, sy + 20 + E.rnd(i + 9) * 760, 2 + 4 * E.rnd(i + 5), 0, 7); c.fill(); }
  c.restore();
  // the pit and the figure at the bottom
  const CL = [['REJECTED', .3], ['IGNORED', 1.0], ['LAUGHED AT', 1.7], ['ALONE', 2.4]], lw = 90;
  E.rrect(c, 430, sy, 220, pitB - sy, 4, '#060606');
  const dim = 1 - E.p(t, 2.9, 3.9);
  fig(c, { x: 540, y: pitB - 60, s: .75, color: '#bdbdbd', alpha: Math.max(.0, dim), pose: { ...E.pose('sit'), hd: .7, tor: .35 } });
  // dirt thrown in, layer by layer
  CL.forEach(([str, t0], i) => {
    if (t < t0) return;
    const land = t0 + .45, top = pitB - lw * (i + 1);
    if (t < land) { const y = E.lerp(560, top, E.p(t, t0, land, 'in')); E.shaded(c, 470, y, 140, 80, 30, '#7a6a58', '#3b3027'); E.tag(c, str, 540, y + 40, t, t0, { size: 20, color: '#e8e8e8', fill: '#141414' }); }
    else { c.save(); const lg = c.createLinearGradient(0, top, 0, top + lw); lg.addColorStop(0, '#4a4036'); lg.addColorStop(1, '#2c2620'); c.fillStyle = lg; c.fillRect(430, top, 220, lw); c.restore();
      E.tag(c, str, 540, top + lw / 2, t, -1, { size: 20, color: '#bbb', fill: '#141414', alpha: 1 - E.p(t, 3.5, 4.1) });
      E.particles(c, 540, top, t - land, { n: 22, speed: 300, color: '#7a6a58', grav: 700, life: .6, seed: i * 5 }); }
  });
  if (t > 2.85) { c.save(); c.fillStyle = '#2e2b28'; c.fillRect(430, sy - 2, 220, 24 * E.p(t, 2.85, 3.2)); c.restore(); }
  // soil keeps trickling in while they bury him
  if (t < 3.0) for (let i = 0; i < 26; i++) { const q = (t * 1.6 + E.rnd(i)) % 1; c.save(); c.fillStyle = '#8a7a66'; c.beginPath(); c.arc(450 + E.rnd(i + 3) * 180, E.lerp(560, 900, q), 3 + 3 * E.rnd(i + 8), 0, 7); c.fill(); c.restore(); }
  E.line(c, -100, sy, 1180, sy, '#7a7a7a', 3);
  // a heartbeat under the soil
  if (t > 3.5) { const beat = Math.max(0, Math.sin((t - 3.5) * 5)) * (1 - E.p(t, 5.4, 5.8)) + E.p(t, 5.4, 5.8); E.glowDot(c, 540, seedY, 110 + 60 * beat, 'rgba(245,197,66,.6)', beat * E.p(t, 3.5, 3.8)); c.save(); c.globalAlpha = E.p(t, 3.5, 3.8); c.fillStyle = GOLD; c.beginPath(); c.ellipse(540, seedY, 16, 22, 0, 0, 7); c.fill(); c.restore(); }
  // roots, sprout, tree
  if (t > 5.0) {
    const r = E.p(t, 5.0, 6.4, 'out');
    c.save(); c.strokeStyle = GOLD; c.lineCap = 'round';
    [[-1, .9], [1, .9], [-1, .4], [1, .4], [0, 1]].forEach(([d, l], i) => { c.lineWidth = 5; c.globalAlpha = .85; c.beginPath(); c.moveTo(540, seedY); c.quadraticCurveTo(540 + d * 60 * l, seedY + 70 * l, 540 + d * 220 * l * r, seedY + 150 * l * r + (d ? 0 : 60 * r)); c.stroke(); });
    c.lineWidth = 8; c.globalAlpha = 1; c.beginPath(); c.moveTo(540, seedY); c.lineTo(540, E.lerp(seedY, sy, E.p(t, 5.0, 5.6, 'out'))); c.stroke(); c.restore();
  }
  if (t > 5.6) {
    const th = 210 * grow, base = sy, w0 = 46 * grow + 8, w1 = 18 * grow + 4;
    E.glowDot(c, 540, base - 260 * grow, 520 * grow, 'rgba(245,197,66,.4)', grow);
    E.rays(c, 540, base - 280 * grow, 600 * grow, .2 * E.p(t, 7.2, 8.0), GOLD, 16, t * .1);
    c.save(); const tg = c.createLinearGradient(520, 0, 560, 0); tg.addColorStop(0, '#c9962a'); tg.addColorStop(1, '#f5c542'); c.fillStyle = tg;
    c.beginPath(); c.moveTo(540 - w0 / 2, base); c.lineTo(540 - w1 / 2, base - th); c.lineTo(540 + w1 / 2, base - th); c.lineTo(540 + w0 / 2, base); c.fill();
    c.strokeStyle = '#e0b040'; c.lineCap = 'round'; c.lineWidth = 10 * grow + 2;
    [[-1, .55, 130], [1, .5, 150], [-1, .85, 100], [1, .8, 110]].forEach(([d, h, l]) => { c.beginPath(); c.moveTo(540, base - th * h); c.lineTo(540 + d * l * grow, base - th * h - 70 * grow); c.stroke(); });
    const leaf = [[0, -300, 120], [-130, -250, 95], [130, -255, 100], [-70, -340, 90], [75, -345, 95], [-180, -180, 70], [185, -185, 75], [0, -400, 80], [-20, -220, 90]];
    leaf.forEach(([dx, dy, r], i) => { const k = E.p(t, 6.0 + i * .12, 7.0 + i * .12, 'back'); if (k <= 0) return; c.globalAlpha = .9; c.fillStyle = i % 2 ? '#f5c542' : '#ffd970'; c.beginPath(); c.arc(540 + dx * grow + Math.sin(t * 1.4 + i) * 7 * grow, base + dy * grow + Math.cos(t * 1.1 + i) * 4 * grow, r * k * grow * (1 + .03 * Math.sin(t * 2 + i)), 0, 7); c.fill(); });
    c.restore();
    for (let i = 0; i < 34; i++) { const q = ((t * .35 + E.rnd(i)) % 1); if (t < 6.8) break; c.save(); c.globalAlpha = .85 * (1 - q) * E.p(t, 6.8, 7.3); c.fillStyle = GOLD; c.translate(300 + E.rnd(i + 2) * 480 + Math.sin(t * 1.5 + i) * 30, 480 + q * 420); c.rotate(t * 2 + i); c.beginPath(); c.ellipse(0, 0, 9, 5, 0, 0, 7); c.fill(); c.restore(); }
  }
  E.particles(c, 540, sy, t - 5.6, { n: 40, speed: 380, color: '#7a6a58', grav: 600, life: .7 });
} },
] };
