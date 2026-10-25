// Reel 025 — "The last rep" (story format: 4 scenes that build, small caps labels, mono + gold)
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
const KICK = { ...E.pose('stand'), tor: -.32, aB: -.9, eB: 1.2, aF: .6, eF: 1.6, lF: 1.55, kF: 0, lB: -.15 };
const CHAMBER = { ...E.pose('stand'), tor: -.15, aB: -.5, eB: 1.4, aF: .5, eF: 1.7, lF: 1.25, kF: 1.9, lB: -.1 };
const kickPose = k => (k < .5 ? E.mix(E.pose('stand'), CHAMBER, k * 2) : E.mix(CHAMBER, KICK, Math.min(1, (k - .5) * 4)));

const REEL = { title: 'The last rep', bpm: 120, scenes: [
// 1 — 10,000 kicks once vs one kick 10,000 times, then the test
{ dur: 9, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, test = 5.4, hit = 6.3, done = t > hit;
  LB(c, '10,000 KICKS', 540, 540); LB(c, 'ONE KICK 10,000 TIMES', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  const bag = (gy, sw, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(640, gy - 350); c.rotate(sw); E.line(c, 0, 0, 0, 30, '#777', 4); E.shaded(c, -38, 30, 76, 220, 30, '#9a9a9a', '#3e3e3e'); c.restore(); };
  const boards = (gy, broken, gold) => {
    const a = E.p(t, test, test + .4); if (a <= 0) return; c.save(); c.globalAlpha = a;
    E.shaded(c, 600, gy - 70, 26, 70, 4, '#7a7a7a', '#3a3a3a'); E.shaded(c, 700, gy - 70, 26, 70, 4, '#7a7a7a', '#3a3a3a');
    for (let i = 0; i < 3; i++) { const y = gy - 230 + i * 26;
      if (!broken) E.shaded(c, 640, y, 22, 160, 4, '#c9a06a', '#7a5a34');
      else { const k = E.p(t, hit, hit + .6, 'out'); c.save(); c.translate(651, y + 40 - 140 * k); c.rotate(-1.4 * k); E.shaded(c, -11, -40, 22, 80, 4, gold, '#a07a1a'); c.restore(); c.save(); c.translate(651, y + 120 + 120 * k); c.rotate(1.2 * k); E.shaded(c, -11, -40, 22, 80, 4, gold, '#a07a1a'); c.restore(); } }
    c.restore();
  };
  // top: a different flashy kick every time, never the same twice
  const NAMES = ['SPIN KICK', 'JUMP KICK', 'AXE KICK', 'FLIP KICK', 'TORNADO', 'BACK KICK', 'HOOK KICK'];
  let tx = 470, ty = hipOn(gT, s), tf = 1, tp = E.pose('stand'), trot = 0;
  if (t < test) {
    const ph = (t % .75) / .75, n = Math.floor(t / .75);
    tp = kickPose(ph); if (n % 3 === 1) ty -= Math.sin(ph * Math.PI) * 90; if (n % 3 === 2) tf = ph < .45 ? -1 : 1; if (n % 4 === 3) trot = -ph * .6;
    E.tag(c, NAMES[n % NAMES.length], 330, 680, t, n * .75, { size: 22, color: '#bbb' });
  }
  bag(gT, t < test ? Math.max(0, Math.sin((t % .75) / .75 * Math.PI * 2 - 2.4)) * .12 : 0, 1 - E.p(t, test - .4, test));
  boards(gT, false);
  if (t > test) {
    const k = E.p(t, hit - .5, hit, 'lin');
    tp = t < hit ? kickPose(k) : t < hit + .4 ? KICK : { ...E.pose('crouch'), hd: .5 };
    if (t > hit + .4) ty = hipOn(gT, s) + 40, tx = 470 - 20 * E.p(t, hit + .4, hit + .7);
    E.tag(c, 'NOT READY', 330, 680, t, hit + .5, { size: 24, color: '#bbb' });
  }
  fig(c, { x: tx, y: ty, s, f: tf, rot: trot, color: '#bdbdbd', pose: tp });
  // bottom: the same kick, every day, until it's automatic
  let bp = E.pose('stand'), bxx = 470, byy = hipOn(gB, s);
  if (t < test) bp = kickPose((t % .55) / .55);
  bag(gB, t < test ? Math.max(0, Math.sin((t % .55) / .55 * Math.PI * 2 - 2.4)) * .14 : 0, 1 - E.p(t, test - .4, test));
  boards(gB, done, GOLD);
  if (t > test) bp = t < hit ? kickPose(E.p(t, hit - .5, hit, 'lin')) : t < hit + .5 ? KICK : win(t, hit + .5);
  if (done) { E.glowDot(c, 640, gB - 180, 360, 'rgba(245,197,66,.4)', E.p(t, hit, hit + .4)); E.rays(c, 640, gB - 180, 420, .25 * E.p(t, hit, hit + .4), GOLD, 14, t * .2); }
  fig(c, { x: bxx, y: byy, s, color: done ? GOLD : '#fff', pose: bp });
  E.tag(c, `REP ${Math.min(10000, Math.round(10000 * E.p(t, 0, test - .3, 'in'))).toLocaleString('en-US')}`, 330, 1200, t, -1, { size: 24, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.particles(c, 650, gB - 180, t - hit, { n: 60, speed: 560, grav: 400 });
  E.shake(c, t, hit, .25, 10);
} },
// 2 — Both missed a day. One gave up, one got back up.
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, X0 = 140, P = 80, fallT = 2.5;
  const lit = (x, k) => Math.floor((x - X0 + 20) / P) >= k;
  const road = (gy, xNow, dim, gold) => { for (let k = 0; k < 10; k++) { const x = X0 + k * P, miss = k === 4, on = !miss && lit(xNow, k);
    E.rrect(c, x, gy - 6, 70, 18, 4, miss ? '#1a1010' : on ? (gold && k > 4 ? GOLD : dim ? '#4a4a4a' : '#e8e8e8') : '#2a2a2a', miss ? '#5a2a2a' : '#444', 2);
    if (miss) { E.line(c, x + 20, gy - 4, x + 34, gy + 8, '#7a3a3a', 3); E.line(c, x + 34, gy + 8, x + 50, gy - 2, '#7a3a3a', 3); } } };
  const fallPose = k => ({ ...E.mix(E.pose('stand'), { ...E.pose('crouch'), tor: 1.2 }, k) });
  const done = t > 7.2;
  LB(c, 'GAVE UP', 540, 560); LB(c, 'GOT BACK UP', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  E.tag(c, 'MISSED A DAY', X0 + 4 * P + 35, gT + 60, t, -1, { size: 18, color: '#c88', fill: '#1a0c0c' }); E.tag(c, 'MISSED A DAY', X0 + 4 * P + 35, gB + 60, t, -1, { size: 18, color: '#c88', fill: '#1a0c0c' });
  // top: falls on the missed day and stays down; the streak goes dark
  let tx = E.lerp(100, 470, E.p(t, 0, fallT, 'lin')), ty = hipOn(gT - 6, s), tp = E.walk(t * 8), rot = 0;
  if (t > fallT) { const k = E.p(t, fallT, fallT + .35, 'in'); tx = 470 + 30 * k; rot = 1.3 * k; ty = hipOn(gT - 6, s) + 70 * k; tp = fallPose(k); }
  road(gT, Math.min(tx, 470), t > 3.4, false);
  fig(c, { x: tx, y: ty, s, rot, color: '#bdbdbd', pose: tp });
  E.tag(c, 'ALREADY RUINED IT', 520, 690, t, 3.4, { size: 22, color: '#bbb' });
  // bottom: same fall, back up the next day
  let bx = E.lerp(100, 470, E.p(t, 0, fallT, 'lin')), by = hipOn(gB - 6, s), bp = E.walk(t * 8), br = 0;
  if (t > fallT && t < 3.6) { const k = E.p(t, fallT, fallT + .35, 'in') * (1 - E.p(t, 3.0, 3.6, 'out')); bx = 470 + 30 * E.p(t, fallT, fallT + .35); br = 1.3 * k; by = hipOn(gB - 6, s) + 70 * k; bp = fallPose(k); }
  if (t >= 3.6) { const k = E.p(t, 3.6, 7.0, 'lin'); bx = E.lerp(500, 880, k); bp = k < 1 ? E.walk(t * 8) : win(t, 7.2); }
  road(gB, bx, false, true);
  if (done) E.glowDot(c, 880, by - 60, 320, 'rgba(245,197,66,.3)', E.p(t, 7.2, 7.6));
  fig(c, { x: bx, y: by, s, rot: br, color: done ? GOLD : '#fff', pose: bp });
  E.tag(c, 'NEVER MISS TWICE', 600, 1210, t, 3.3, { size: 22, color: GOLD, fill: '#2a2208' });
  E.tag(c, `DAY ${Math.max(1, Math.min(10, Math.floor((bx - X0 + 20) / P) + 1))}`, 200, 1210, t, -1, { size: 22, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.particles(c, 880, by - 80, t - 7.2, { n: 45, speed: 480, grav: 300 });
} },
// 3 — Waits for perfect days vs shows up anyway
{ dur: 8, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, sun = E.p(t, 5.2, 6.4), done = t > 5.6;
  LB(c, 'WAITS FOR PERFECT DAYS', 540, 540); LB(c, 'SHOWS UP ANYWAY', 540, 1080, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  const house = (gy, lit) => { E.shaded(c, 40, gy - 260, 220, 260, 4, '#4a4a4f', '#2a2a2e'); c.save(); c.fillStyle = '#4a4a4f'; c.beginPath(); c.moveTo(20, gy - 258); c.lineTo(150, gy - 340); c.lineTo(280, gy - 258); c.fill(); c.restore();
    E.rrect(c, 170, gy - 160, 60, 160, 4, '#0c0c0c', '#777', 3); E.rrect(c, 70, gy - 200, 70, 60, 4, lit ? '#d8c27a' : '#141414', '#777', 3); };
  // rain over both rows, stops for the one who kept going
  const rain = (y0, y1, a) => { if (a <= 0) return; c.save(); c.strokeStyle = `rgba(190,205,220,${.45 * a})`; c.lineWidth = 3; for (let i = 0; i < 70; i++) { const x = E.rnd(i) * 1200 - 60, q = (t * 2.2 + E.rnd(i + 5)) % 1, y = E.lerp(y0, y1, q); c.beginPath(); c.moveTo(x + q * 40, y); c.lineTo(x + q * 40 - 12, y + 34); c.stroke(); } c.restore(); };
  house(gT, t > 2.4); house(gB, false);
  // top: opens the door, sees the rain, goes back in
  const out = E.p(t, .3, .9) * (1 - E.p(t, 1.9, 2.4));
  if (out > 0) fig(c, { x: 200 + 60 * out, y: hipOn(gT, s), s, f: t < 1.9 ? 1 : -1, color: '#bdbdbd', alpha: out, pose: { ...E.pose('stand'), hd: -.3, aF: .9, eF: 1.9 } });
  E.tag(c, 'TOO COLD', 330, 660, t, 1.0, { size: 22, color: '#bbb', alpha: 1 - E.p(t, 2.6, 3.0) });
  E.tag(c, 'MAYBE TOMORROW', 360, 660, t, 3.0, { size: 22, color: '#bbb' });
  rain(560, gT, 1);
  // bottom: runs through it, the sun breaks for him
  const rk = E.p(t, .3, 5.4, 'lin'), bx = E.lerp(200, 860, rk), by = hipOn(gB, s);
  rain(1100, gB, 1 - sun);
  if (sun > 0) { E.glowDot(c, 900, 1150, 420, 'rgba(245,197,66,.4)', sun); E.rays(c, 900, 1150, 560, .3 * sun, GOLD, 16, t * .15); c.save(); c.globalAlpha = sun; c.fillStyle = GOLD; c.beginPath(); c.arc(900, 1150, 60, 0, 7); c.fill(); c.restore(); }
  fig(c, { x: bx, y: by, s, color: done ? GOLD : '#fff', pose: rk < 1 ? E.run(t * 15) : win(t, 5.6) });
  if (rk < 1) E.particles(c, bx, gB, (t * 3) % 1 * .33, { n: 8, speed: 180, color: '#9fb6c8', grav: 600, life: .33, seed: Math.floor(t * 3) });
  E.tag(c, `KM ${(rk * 10).toFixed(1)}`, 200, 1200, t, -1, { size: 22, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.particles(c, bx, by - 80, t - 5.6, { n: 45, speed: 480, grav: 300 });
} },
// 4 — The last rep: everyone racks the bar, one pushes through
{ dur: 9.5, draw(c, t) {
  const gy = 1360, s = 1;
  const REPS = [[0, 1.1], [1.1, 2.2], [2.2, 3.4], [3.4, 5.0], [5.0, 7.4]]; // reps 8..12 for the one who stays
  const ri = REPS.findIndex(([a, b]) => t >= a && t < b), done = t >= 7.4;
  const rep = done ? 12 : 8 + Math.max(0, ri);
  LB(c, 'THE LAST REP', 540, 640, { size: 34, ls: 5, color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gy);
  // press arm angle: 0 = bar on chest, 1 = arms locked out
  const press = (t0, t1, struggle) => { const k = (t - t0) / (t1 - t0); if (k < 0) return 1; if (k > 1) return 1;
    const down = Math.min(1, k / .35), up = Math.max(0, (k - .35) / .65); let v = k < .35 ? 1 - E.ease.inOut(down) : E.ease.inOut(up);
    if (struggle) v = k < .35 ? v : Math.min(1, E.ease.inOut(up) * (1 - .25 * Math.sin(up * Math.PI))); return v; };
  // barbell squat, side view. v: 1 = standing tall, 0 = bottom of the squat
  const squatter = (cx, v, col, gold, dropped, sc, tq = 0) => {
    const l = E.lerp(1.35, 0, v), k = E.lerp(2.35, 0, v), tor = E.lerp(.55, .08, v);
    const legH = (Math.cos(l) * 68 + Math.cos(l - k) * 66) * sc, hy = gy - legH;
    const pose = { ...E.pose('stand'), tor, hd: -.1, lF: l, kF: k, lB: l, kB: k, aF: 3.0, eF: 2.5, aB: 3.0, eB: 2.5 };
    if (dropped) Object.assign(pose, { ...E.pose('sad'), hd: .6, aF: .5, eF: .3, aB: .4, eB: .3 });
    const r = 44 * sc;
    let bx = cx + Math.sin(tor) * 70 * sc, by = hy - Math.cos(tor) * 70 * sc;
    if (dropped) { const q = E.p(t, tq, tq + .35, 'in'); bx = E.lerp(bx, cx + 80 * sc + 20 * E.p(t, tq + .35, tq + 1, 'out'), q); by = E.lerp(by, gy - r, q); }
    const plate = () => { E.line(c, bx - 20 * sc, by, bx + 20 * sc, by, '#ccc', 8); c.save(); const g = c.createRadialGradient(bx - 12, by - 14, 4, bx, by, r); g.addColorStop(0, gold ? '#ffe08a' : '#a0a0a0'); g.addColorStop(1, gold ? '#a07a1a' : '#2e2e2e'); c.fillStyle = g; c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill(); c.strokeStyle = gold ? GOLD : '#777'; c.lineWidth = 3; c.stroke(); c.fillStyle = '#111'; c.beginPath(); c.arc(bx, by, 8 * sc, 0, 7); c.fill(); c.restore(); };
    if (!dropped) plate();
    fig(c, { x: cx, y: dropped ? hipOn(gy, sc) : hy, s: sc, color: col, pose });
    if (dropped) plate();
    if (dropped) E.particles(c, bx, gy, t - tq - .35, { n: 20, speed: 260, color: '#999', grav: 700, life: .6 });
    return [bx, by];
  };
  // the two who drop the bar
  const side = [[230, 1, 'ENOUGH'], [810, 2, 'TOO HEAVY']];
  side.forEach(([cx, n, tag]) => { const tq = REPS[n - 1][1], quit = t >= tq; const v = quit ? 1 : press(...REPS[Math.max(0, ri)], false);
    squatter(cx, v, '#8a8a8a', false, quit, .82, tq); if (quit) E.tag(c, tag, cx, gy - 330, t, tq, { size: 20, color: '#aaa' }); });
  // the one who stays
  const struggle = ri >= 3, v = done ? 1 : press(...REPS[Math.max(0, ri)], struggle);
  const shake = struggle && !done ? Math.sin(t * 40) * 3 * (ri === 4 ? 1.6 : 1) : 0;
  c.save(); c.translate(shake, 0);
  if (done) { E.glowDot(c, 540, gy - 180, 420, 'rgba(245,197,66,.45)', E.p(t, 7.4, 7.9)); E.rays(c, 540, gy - 180, 520, .28 * E.p(t, 7.4, 7.9), GOLD, 16, t * .15); }
  const [px, py] = squatter(540, v, done ? GOLD : '#fff', done, false, 1);
  c.restore();
  E.tag(c, `REP ${rep}`, 540, gy - 400, t, -1, { size: 26, color: done ? GOLD : ri >= 3 ? '#fff' : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  E.tag(c, 'THIS IS WHERE YOU GROW', 540, gy + 120, t, 7.8, { size: 24, color: GOLD, fill: '#2a2208' });
  E.particles(c, px, py, t - 7.4, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
