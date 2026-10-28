// Reel 031 — "You fell 240 times once" (story format + ref #15 devices)
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
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8') => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: col === GOLD ? GOLD : '#8a8a8a', align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const RIDE = { ...E.pose('stand'), tor: .1, hd: 0, aF: 1.25, eF: .3, aB: -1.2, eB: .3, lF: .35, kF: .6, lB: -.35, kB: .6 };
const board = (c, x, y, rot = 0, col = '#c8a46a') => { c.save(); c.translate(x, y); c.rotate(rot); E.line(c, -52, 0, 52, 0, col, 8); c.fillStyle = '#ddd'; [-34, 34].forEach(dx => { c.beginPath(); c.arc(dx, 10, 7, 0, 7); c.fill(); }); c.restore(); };

const REEL = { title: 'You fell 240 times once', bpm: 120, scenes: [
// 1 — Skateboard: quits after one fall vs falls 99 times
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .8, land = 6.0, done = t > land + .6;
  const box = gy => E.shaded(c, 540, gy - 60, 150, 60, 6, '#7a7a7a', '#3a3a3a');
  const rider = (gy, x, lift, col, pose = RIDE, rot = 0) => { const by = gy - 14 - lift; board(c, x, by); fig(c, { x, y: by - 8 - 125 * s, s, color: col, pose, rot }); };
  const fall = (gy, x0, k, col, i) => { // k 0..1: board shoots off, rider hits the ground
    const bx = x0 + 230 * k, by = gy - 14 - Math.abs(Math.sin(k * 6)) * 40 * (1 - k); board(c, bx, by, k * 7 * (i % 2 ? -1 : 1));
    fig(c, { x: x0 + 50 * k, y: hipOn(gy, s) + 70 * k, s, rot: 1.35 * k, color: col, pose: E.mix(E.pose('jump'), { ...E.pose('crouch'), tor: 1.0 }, k) });
  };
  LB(c, 'QUITS AFTER 1 FALL', 540, 540); LB(c, 'FALLS 99 TIMES', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); box(gT); box(gB);
  // top: one try
  if (t < 1.0) rider(gT, E.lerp(120, 480, t), 0, '#bdbdbd');
  else if (t < 1.35) { const k = (t - 1.0) / .35; rider(gT, E.lerp(480, 530, k), Math.sin(k * Math.PI) * 110, '#bdbdbd', E.pose('jump')); }
  else if (t < 2.6) fall(gT, 530, E.p(t, 1.35, 1.8, 'in'), '#bdbdbd', 0);
  else { const k = E.p(t, 3.2, 4.4, 'lin'); board(c, 760, gT - 14, 0, '#8a7a5a'); fig(c, { x: t < 3.2 ? 560 : E.lerp(560, 140, k), y: hipOn(gT, s), s, f: t < 3.2 ? 1 : -1, color: '#bdbdbd', pose: t < 3.2 ? { ...E.pose('sad'), hd: .4 } : k < 1 ? E.walk(t * 9) : { ...E.pose('sad'), hd: .5 } }); }
  SAY(c, 'NOT FOR ME.', 640, 700, E.p(t, 2.8, 3.1, 'back'));
  CNT(c, 50, 590, 'FALLS', t > 1.6 ? 1 : 0, 'THEN QUIT');
  // bottom: falls, gets back on, falls, gets back on... lands it
  const T = 1.25, FALLS = [1, 37, 68, 99], n = Math.min(3, Math.floor(t / T)), ph = (t % T) / T;
  let falls = 0;
  if (t < 5.0) {
    falls = ph > .6 ? FALLS[n] : n > 0 ? FALLS[n - 1] : 0;
    if (ph < .45) rider(gB, E.lerp(120, 480, ph / .45), 0, '#fff');
    else if (ph < .6) { const k = (ph - .45) / .15; rider(gB, E.lerp(480, 530, k), Math.sin(k * Math.PI) * 110, '#fff', E.pose('jump')); }
    else fall(gB, 530, E.p(ph, .6, .85, 'in'), '#fff', n);
  } else {
    falls = 99;
    if (t < 5.6) rider(gB, E.lerp(120, 470, (t - 5) / .6), 0, '#fff');
    else if (t < land) { const k = (t - 5.6) / (land - 5.6); rider(gB, E.lerp(470, 700, k), Math.sin(k * Math.PI) * 170, '#fff', E.pose('jump')); }
    else { const k = E.p(t, land, land + .6, 'out'); if (done) E.glowDot(c, 860, gB - 150, 360, 'rgba(245,197,66,.4)', E.p(t, land + .6, land + 1)); rider(gB, E.lerp(700, 860, k), 0, done ? GOLD : '#fff', done ? win(t, land + .6) : RIDE); }
  }
  CNT(c, 50, 1110, 'FALLS', falls, done ? 'LANDED: 1' : 'STILL GOING', done ? GOLD : '#e8e8e8');
  E.particles(c, 860, gB - 170, t - land - .6, { n: 45, speed: 480, grav: 300 });
} },
// 2 — Light bulb: tries once vs tries 1,000 times
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .82, lit = 6.0, done = t > lit;
  const bench = gy => { E.shaded(c, 520, gy - 130, 260, 22, 6, '#6a6a6a', '#3a3a3a'); E.line(c, 540, gy - 108, 540, gy, '#555', 6); E.line(c, 760, gy - 108, 760, gy, '#555', 6); E.rrect(c, 630, gy - 180, 20, 50, 4, '#8a8a8a'); };
  const bulb = (gy, state, k) => { const x = 640, y = gy - 214;
    if (state === 'on') { E.glowDot(c, x, y, 560 * k, 'rgba(255,214,120,.55)'); E.rays(c, x, y, 520, .3 * k, GOLD, 18, t * .15); }
    if (state === 'flash') E.glowDot(c, x, y, 160, 'rgba(255,255,255,.85)', k);
    if (state === 'gone') return;
    c.save(); c.fillStyle = state === 'on' ? '#fff3c4' : state === 'flash' ? '#ffffff' : 'rgba(220,230,240,.12)'; c.strokeStyle = state === 'on' ? GOLD : '#cfcfcf'; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, 30, 36, 0, 0, 7); c.fill(); c.stroke();
    E.rrect(c, x - 14, y + 30, 28, 18, 3, '#9a9a9a'); c.restore(); };
  LB(c, 'TRIES ONCE', 540, 540); LB(c, 'TRIES 1,000 TIMES', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); bench(gT); bench(gB);
  // top: one bulb pops, he's done
  const st = t < 1.2 ? 'off' : t < 1.35 ? 'flash' : 'gone';
  bulb(gT, st, 1); E.particles(c, 640, gT - 214, t - 1.35, { n: 22, speed: 320, color: '#dfe8f0', grav: 700, life: .7 });
  let tx = 470, tf = 1, tp = t < 1.3 ? { ...E.pose('stand'), aF: 1.7, eF: .2 } : { ...E.pose('stand'), aF: -.4, aB: .4, hd: .2 }, ty = hipOn(gT, s);
  if (t > 2.8) { const k = E.p(t, 2.8, 4.0, 'lin'); tx = E.lerp(470, 140, k); tf = -1; tp = k < 1 ? E.walk(t * 9) : { ...E.pose('sit'), hd: .4 }; if (k >= 1) ty = gT - 54; }
  fig(c, { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp });
  SAY(c, "IT DOESN'T WORK.", 330, 700, E.p(t, 1.8, 2.1, 'back'));
  CNT(c, 50, 590, 'BULB', 1, 'THEN QUIT');
  // bottom: pop after pop after pop, then light
  const C = .5, n = done ? 1000 : Math.max(1, Math.round(999 * E.p(t, 0, lit - .2, 'in')));
  if (!done) { const ph = (t % C) / C; bulb(gB, ph < .55 ? 'off' : ph < .7 ? 'flash' : 'gone', 1); E.particles(c, 640, gB - 214, (ph - .7) * C, { n: 14, speed: 300, color: '#dfe8f0', grav: 700, life: .4, seed: Math.floor(t / C) }); }
  else { bulb(gB, 'on', E.p(t, lit, lit + .5, 'out')); E.flash(c, t, lit, .3, '255,230,160', .35); }
  for (let i = 0; i < Math.min(26, Math.floor(n / 38)); i++) { c.save(); c.fillStyle = '#9fb0bd'; c.globalAlpha = .7; c.translate(800 + E.rnd(i) * 110, gB - 4 - E.rnd(i + 5) * 14); c.rotate(E.rnd(i + 9) * 3); c.beginPath(); c.moveTo(-7, 4); c.lineTo(0, -6); c.lineTo(7, 4); c.fill(); c.restore(); }
  const bo = { x: 470, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, lit + .3) : { ...E.pose('stand'), aF: 1.6 + .2 * Math.sin(t * 12), eF: .2 } };
  fig(c, bo);
  CNT(c, 50, 1110, 'BULB', n.toLocaleString('en-US'), done ? 'IT WORKS' : 'NOT THIS ONE', done ? GOLD : '#e8e8e8');
} },
// 3 — Surf: back to shore vs paddles back out
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .7, ride = 5.5, done = t > 7.0;
  const crest = (a, b) => (t >= a && t <= b ? E.lerp(1160, 180, (t - a) / (b - a)) : null);
  const sea = (gy, waves) => {
    const surf = x => gy + 6 * Math.sin(x * .02 + t * 3) - waves.reduce((acc, [xw, H]) => acc + (xw === null ? 0 : H * Math.exp(-Math.pow((x - xw) / 85, 2))), 0);
    c.save(); const g = c.createLinearGradient(0, gy - 200, 0, gy + 220); g.addColorStop(0, '#3a4c5c'); g.addColorStop(1, 'rgba(14,20,26,0)'); c.fillStyle = g;
    c.beginPath(); c.moveTo(150, gy + 220); for (let x = 150; x <= 1180; x += 10) c.lineTo(x, surf(x)); c.lineTo(1180, gy + 220); c.fill();
    c.strokeStyle = '#c8d8e6'; c.lineWidth = 3; c.beginPath(); for (let x = 150; x <= 1180; x += 10) x === 150 ? c.moveTo(x, surf(x)) : c.lineTo(x, surf(x)); c.stroke(); c.restore();
    waves.forEach(([xw, H]) => { if (xw !== null) E.particles(c, xw - 20, surf(xw) - 10, (t * 3) % 1 * .4, { n: 10, speed: 160, color: '#e8f0f5', grav: 300, life: .4, seed: Math.floor(t * 3) }); });
    E.shaded(c, -100, gy - 8, 250, 30, 4, '#8a7a66', '#4a4236');
    return surf;
  };
  const paddler = (x, y, col) => { c.save(); c.fillStyle = '#c8a46a'; c.beginPath(); c.ellipse(x + 10, y + 8, 70, 9, 0, 0, 7); c.fill(); c.restore(); const ph = t * 6; fig(c, { x, y: y - 6, s, rot: Math.PI / 2, f: 1, color: col, pose: { ...E.pose('stand'), aF: ph % (Math.PI * 2), eF: .2, aB: (ph + Math.PI) % (Math.PI * 2), eB: .2 } }); };
  const tumble = (x, y, k, col) => fig(c, { x, y: y + 30, s, rot: k * 9, color: col, alpha: .8, pose: E.pose('jump') });
  LB(c, 'BACK TO SHORE', 540, 540); LB(c, 'PADDLES BACK OUT', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  // top: one wave, done
  const wT = crest(1.0, 2.6), surfT = sea(gT, [[wT, 140]]);
  if (t < 1.6) { const x = E.lerp(220, 520, E.p(t, 0, 1.4)); paddler(x, surfT(x), '#bdbdbd'); }
  else if (t < 2.8) { const k = E.p(t, 1.6, 2.8), x = E.lerp(520, 200, k); tumble(x, surfT(x), k, '#bdbdbd'); }
  else { const k = E.p(t, 3.4, 4.4, 'lin'); fig(c, { x: E.lerp(110, 30, k), y: hipOn(gT - 8, s), s, f: -1, color: '#bdbdbd', pose: t < 3.4 ? { ...E.pose('sad'), hd: .4 } : E.walk(t * 9) }); }
  SAY(c, 'THE OCEAN WON.', 300, 700, E.p(t, 3.0, 3.3, 'back'));
  CNT(c, 50, 590, 'WIPEOUTS', t > 1.7 ? 1 : 0, 'THEN QUIT');
  // bottom: wiped out, paddles back, wiped out, paddles back, rides the big one
  const w1 = crest(1.0, 2.6), w2 = crest(2.9, 4.5), w3 = crest(ride - .8, 7.2);
  const surfB = sea(gB, [[w1, 140], [w2, 140], [w3, 230]]);
  let wipes = 0, col = done ? GOLD : '#fff';
  const pad = [[0, 1.4, 220, 520], [2.4, 3.0, 330, 520], [4.3, 4.9, 330, 560]];
  const tum = [[1.6, 2.4, 520, 330], [3.5, 4.3, 520, 330]];
  let drawn = false;
  tum.forEach(([a, b, x0, x1], i) => { if (t > a) wipes = i + 1; if (t >= a && t < b) { const k = (t - a) / (b - a), x = E.lerp(x0, x1, k); tumble(x, surfB(x), k, '#fff'); drawn = true; } });
  pad.forEach(([a, b, x0, x1]) => { if (!drawn && t >= a && t < b + (b === 4.9 ? .6 : 0)) { const x = E.lerp(x0, x1, E.p(t, a, b)); if (t < ride - .1) { paddler(x, surfB(x), '#fff'); drawn = true; } } });
  if (!drawn && t >= 1.4 && t < 1.6) { paddler(520, surfB(520), '#fff'); drawn = true; }
  if (!drawn && t >= 3.0 && t < 3.5) { paddler(520, surfB(520), '#fff'); drawn = true; }
  if (!drawn && t >= ride - .1) {
    const x = w3 !== null ? Math.max(260, w3 + 40) : 260, y = surfB(x);
    if (done) E.glowDot(c, x, y - 120, 360, 'rgba(245,197,66,.4)', E.p(t, 7.0, 7.4));
    board(c, x, y - 6, -.15); fig(c, { x, y: y - 14 - 125 * s, s, f: -1, color: col, pose: done ? win(t, 7.0) : { ...RIDE, tor: .2 } });
  }
  CNT(c, 50, 1110, done ? 'RIDES' : 'WIPEOUTS', done ? 1 : wipes, done ? 'AFTER 2 WIPEOUTS' : 'PADDLING BACK', done ? GOLD : '#e8e8e8');
} },
// 4 — You fell 240 times once. And never quit.
{ dur: 10.5, draw(c, t) {
  const gT = 950, gB = 1480, walk = 4.6, hug = 6.4;
  if (t > 8.0) { E.title(c, 'YOU FELL 240 TIMES ONCE.', 540, 410, t, 8.0, 1e9, { size: 34, weight: 700, ls: 3, family: 'Inter', color: '#e8e8e8' }); E.title(c, 'AND NEVER QUIT.', 540, 465, t, 8.6, 1e9, { size: 38, weight: 800, ls: 4, family: 'Inter', color: GOLD }); }
  LB(c, 'AT 1 YEAR OLD', 540, 560, { color: t > hug ? GOLD : '#e8e8e8' }); LB(c, 'AT 25', 540, 1070);
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // the baby: up, wobble, down. Up again.
  const bs = .5; let bx = 300, by = hipOn(gT, bs), bp = E.pose('stand'), br = 0;
  if (t < walk) { const ph = (t % .7) / .7; if (ph < .3) { by = E.lerp(gT - 28, hipOn(gT, bs), ph / .3); bp = E.mix(E.pose('sit'), E.pose('stand'), ph / .3); } else if (ph < .65) { br = Math.sin((ph - .3) * 40) * .15; bp = { ...E.pose('stand'), aF: 1.3, aB: -1.3 }; } else { const k = (ph - .65) / .35; by = E.lerp(hipOn(gT, bs), gT - 28, k); bp = E.mix(E.pose('stand'), E.pose('sit'), k); } }
  else if (t < hug) { const k = E.p(t, walk, hug, 'lin'); bx = E.lerp(300, 680, k); br = Math.sin(t * 9) * .08; bp = { ...E.walk(t * 10, .5), aF: 1.3, aB: -1.3 }; }
  else { bx = 690; bp = { ...E.pose('stand'), aF: 1.6, aB: 1.4 }; }
  // the parent waiting with open arms
  if (t > hug) { E.glowDot(c, 730, gT - 120, 420, 'rgba(245,197,66,.45)', E.p(t, hug, hug + .6)); E.rays(c, 730, gT - 120, 460, .25 * E.p(t, hug, hug + .6), GOLD, 14, t * .15); }
  fig(c, { x: 790, y: hipOn(gT, .85) + 50, s: .85, f: -1, color: t > hug ? GOLD : '#9a9a9a', pose: { ...E.pose('crouch'), tor: .3, aF: t > hug ? 1.9 : 1.3, eF: t > hug ? 1.4 : .2, aB: t > hug ? 1.7 : 1.1, eB: t > hug ? 1.4 : .2 } });
  fig(c, { x: bx, y: by, s: bs, lw: 12, rot: br, color: t > hug ? GOLD : '#fff', pose: bp });
  const [hx, hy] = E.headPos({ x: bx, y: by, s: bs, pose: bp }); c.save(); c.fillStyle = t > hug ? GOLD : '#fff'; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill(); c.restore();
  const falls = t < walk ? Math.max(1, Math.round(240 * E.p(t, 0, walk, 'in'))) : 240;
  CNT(c, 50, 590, 'FALLS', falls, t > walk ? 'FIRST STEPS' : 'GOT BACK UP', t > hug ? GOLD : '#e8e8e8');
  E.particles(c, 730, gT - 160, t - hug, { n: 50, speed: 460, grav: 260, life: 1.6 });
  // the adult: one try at something new, one fall, done
  E.shaded(c, 520, gB - 90, 160, 90, 6, '#7a7a7a', '#3a3a3a'); E.tag(c, 'NEW SKILL', 600, gB - 45, 1, -1, { size: 18, color: '#ddd', fill: '#141414' });
  const s = .85; let ax = 380, ay = hipOn(gB, s), ap = E.pose('arms'), ar = 0;
  if (t > 6.6 && t < 7.0) { [ax, ay] = hop(E.p(t, 6.6, 7.0), 380, hipOn(gB, s), 470, hipOn(gB, s), 70); ap = E.pose('jump'); }
  if (t >= 7.0) { const k = E.p(t, 7.0, 7.3, 'in'); ax = 470 - 30 * k; ar = -1.2 * k; ay = hipOn(gB, s) + 60 * k; ap = { ...E.pose('crouch'), tor: .8 }; if (t > 7.6) { ar = 0; ay = gB - 56; ax = 400; ap = { ...E.pose('sit'), hd: .5 }; } }
  fig(c, { x: ax, y: ay, s, rot: ar, color: '#bdbdbd', pose: ap });
  SAY(c, "I'M NOT GOOD AT THIS.", 300, 1230, E.p(t, 7.7, 8.0, 'back'));
  CNT(c, 50, 1110, 'FALLS', t > 7.1 ? 1 : 0, t > 7.6 ? 'THEN QUIT' : 'TRYING SOMETHING NEW');
} },
] };
