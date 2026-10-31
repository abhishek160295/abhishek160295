// Reel 042 — "Everyone pops at their own time" (≤25s, Shorts-first: hook at frame 0, fun + payoff every scene)
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
const bag = (c, x, y, w, rot = 0, gold = false) => { c.save(); c.translate(x, y); c.rotate(rot); E.shaded(c, -34, -26, 68, 52, 6, gold ? '#f7d36a' : '#b8a888', gold ? '#a07a1a' : '#6a5a40'); E.line(c, -14, -26, -10, -38, '#6a5a40', 4); E.line(c, 14, -26, 10, -38, '#6a5a40', 4); E.text(c, w, 0, 2, { size: 12, weight: 800, family: MONO, color: '#1a1206' }); c.restore(); };

const REEL = { title: 'Everyone pops at their own time', bpm: 120, scenes: [
// 1 — One trip or die vs one thing at a time
{ dur: 5.5, draw(c, t) {
  const s = .85, trip = 2.5, done = t > 4.5, LOAD = ['WORK', 'GYM', 'STUDY', 'HUSTLE', 'DIET', 'FAMILY'];
  PRIN(c, 'STOP CARRYING EVERYTHING AT ONCE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'ONE TRIP OR NOTHING'); PANEL(c, ...P2, 'ONE THING AT A TIME', done);
  const door = gy => { E.rrect(c, 860, gy - 200, 90, 200, 4, '#1a1a1a', '#6a6a6a', 4); E.text(c, 'GOAL', 905, gy - 220, { size: 16, weight: 800, family: MONO, color: '#9a9a9a' }); };
  // top: the whole life in one arm-load, then it all hits the floor
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); door(gT);
    const x = Math.min(160 + 200 * t, 160 + 200 * trip), wob = Math.sin(t * 9) * .08 * E.p(t, 0, trip);
    if (t < trip) { fig(c, { x, y: hipOn(gT, s), s, rot: wob * .5, color: '#bdbdbd', pose: { ...E.walk(t * 7, .25), aF: 1.3, eF: 1.4, aB: 1.2, eB: 1.4, tor: -.15 } });
      LOAD.forEach((w, i) => bag(c, x + 48 + Math.sin(t * 9 + i) * 6 * i * E.p(t, 0, trip), gT - 150 - i * 50, w, wob * (i + 1))); }
    else { const dt = t - trip; fig(c, { x: x + 40 * Math.min(1, dt * 3), y: Math.min(hipOn(gT, s) + 70, hipOn(gT, s) + 300 * dt), s, rot: Math.min(1.4, dt * 5), color: '#bdbdbd', pose: { ...E.pose('crouch'), tor: 1 } });
      LOAD.forEach((w, i) => { const vx = 120 + 260 * E.rnd(i), vy = -300 - 200 * E.rnd(i + 3); let y = gT - 150 - i * 50 + vy * dt + 1400 * dt * dt; if (y > gT - 26) y = gT - 26; bag(c, x + 48 + vx * dt, y, w, dt * (E.rnd(i + 7) - .5) * 9); });
      E.particles(c, x + 120, gT - 10, dt - .3, { n: 30, speed: 300, color: '#f5e3a0', grav: 700, life: .7 }); }
    E.shake(c, t, trip + .3, .3, 10); });
  SAY(c, 'I GOT THIS.', 300, 690, E.p(t, .4, .7, 'back') * (1 - E.p(t, 2.0, 2.2)));
  SAY(c, '...', 640, 760, E.p(t, 3.4, 3.7, 'back'));
  CNT(c, 640, 600, 'BAGS AT DOOR', 0, t > trip ? 'ALL ON THE FLOOR' : 'ALL AT ONCE', '#e8e8e8', t > trip ? RED : null);
  // bottom: quick little trips, one bag at a time
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); door(gB);
    const TR = 1.5, n = Math.min(3, Math.floor(t / TR)), ph = (t % TR) / TR, out = ph < .5;
    for (let i = 0; i < Math.min(6, (n + (ph > .5 && t < 4.5 ? 1 : 0)) * 2); i++) bag(c, 820 - (i % 2) * 70, gB - 26 - Math.floor(i / 2) * 52, LOAD[i], 0, done);
    const x = done ? 760 : out ? E.lerp(160, 760, ph * 2) : E.lerp(760, 160, (ph - .5) * 2);
    if (done) E.glowDot(c, 820, gB - 120, 340, 'rgba(245,197,66,.4)', E.p(t, 4.5, 4.9));
    const o = { x, y: hipOn(gB, s), s, f: out || done ? 1 : -1, color: done ? GOLD : '#fff', pose: done ? win(t, 4.5) : { ...E.walk(t * 10), aF: out ? .4 : .2 } };
    fig(c, o); if (out && !done) { const [hx, hy] = E.hand(o); bag(c, hx + 10, hy + 10, LOAD[n * 2] || 'DONE'); bag(c, hx + 4, hy - 40, LOAD[n * 2 + 1] || ''); } });
  CNT(c, 640, 1060, 'BAGS AT DOOR', done ? 6 : Math.min(6, Math.floor(t / 1.5) * 2), done ? 'NOTHING DROPPED' : 'TWO AT A TIME', done ? GOLD : '#e8e8e8');
} },
// 2 — Everyone pops at their own time
{ dur: 5.5, draw(c, t) {
  const CX = 540, PY = 1250, mine = 4.0, done = t > mine;
  PRIN(c, 'EVERYONE POPS AT THEIR OWN TIME.', 470, done ? GOLD : '#e8e8e8');
  // stove + pot
  E.shaded(c, 300, PY + 40, 480, 60, 8, '#3a3a3e', '#1a1a1c');
  for (let i = 0; i < 5; i++) { const f = 1 + .15 * Math.sin(t * 20 + i); c.save(); c.fillStyle = i % 2 ? '#f08a24' : GOLD; c.globalAlpha = .9; c.beginPath(); c.moveTo(400 + i * 70, PY + 40); c.quadraticCurveTo(410 + i * 70, PY + 10 * f, 420 + i * 70 + Math.sin(t * 9 + i) * 4, PY - 4 * f); c.quadraticCurveTo(430 + i * 70, PY + 10 * f, 440 + i * 70, PY + 40); c.fill(); c.restore(); }
  E.shaded(c, 360, PY - 150, 360, 150, 18, '#6a6a6e', '#2a2a2e');
  for (let i = 0; i < 6; i++) { const q = (t * .9 + i / 6) % 1; c.save(); c.globalAlpha = .25 * (1 - q); c.strokeStyle = '#ddd'; c.lineWidth = 3; c.beginPath(); c.moveTo(400 + i * 55, PY - 160 - q * 140); c.quadraticCurveTo(410 + i * 55 + Math.sin(q * 8) * 14, PY - 200 - q * 140, 400 + i * 55, PY - 240 - q * 140); c.stroke(); c.restore(); }
  const pop = (x, y, sc, gold) => { c.save(); c.translate(x, y); c.scale(sc, sc); c.fillStyle = gold ? GOLD : '#f4f0e6'; [[-12, 0, 16], [10, -6, 15], [0, -18, 14], [-4, 10, 13], [14, 10, 12]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); }); c.restore(); };
  // the others: pop, fly, land around the pot
  const N = 12; let popped = 0;
  for (let i = 0; i < N; i++) { const tp = .3 + i * .28 + E.rnd(i) * .1; const lx = 160 + (i * 73) % 760, ly = PY + 30 - (i % 3) * 8;
    if (t < tp) { c.save(); c.fillStyle = '#e8c860'; c.beginPath(); c.ellipse(390 + (i * 29) % 300, PY - 160 + 8, 7, 9, 0, 0, 7); c.fill(); c.restore(); continue; }
    popped++; const k = E.p(t, tp, tp + .7, 'out'); const sx = 390 + (i * 29) % 300, x = E.lerp(sx, lx, k), y = E.lerp(PY - 170, ly - 20, k) - Math.sin(k * Math.PI) * (280 + 80 * E.rnd(i + 2)); pop(x, y, 1, false); if (t - tp < .15) E.flash(c, t, tp, .08, '255,255,255', .06); }
  // YOU: the last kernel, still waiting
  const yx = 540, yy = PY - 158;
  if (!done) { c.save(); c.translate(yx + Math.sin(t * 30) * (t > 3 ? 3 : 1), yy); c.fillStyle = '#e8c860'; c.strokeStyle = GOLD; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 0, 11, 14, 0, 0, 7); c.fill(); c.stroke(); c.restore(); E.tag(c, 'YOU', yx, yy - 44, 1, -1, { size: 16, color: GOLD, fill: '#2a2208' }); }
  SAY(c, 'WHY NOT ME?', yx + 120, yy - 110, E.p(t, 2.2, 2.5, 'back') * (1 - E.p(t, mine - .2, mine)));
  if (done) { const k = E.p(t, mine, mine + .6, 'out'), x = yx, y = E.lerp(yy, 760, k); E.flash(c, t, mine, .25, '255,230,170', .35); E.glowDot(c, x, y, 380, 'rgba(245,197,66,.5)', E.p(t, mine, mine + .4)); E.rays(c, x, y, 420, .3 * E.p(t, mine, mine + .4), GOLD, 16, t * .2); pop(x, y, E.lerp(1, 3.2, k), true); E.particles(c, x, y, t - mine, { n: 70, speed: 520, grav: 220, life: 1.5 }); }
  CNT(c, 70, 560, 'POPPED', `${popped + (done ? 1 : 0)}/${N + 1}`, done ? 'YOURS WAS THE BIGGEST' : 'NOT YOU. YET.', done ? GOLD : '#e8e8e8');
} },
// 3 — Small things lift big things
{ dur: 5.5, draw(c, t) {
  const GY = 1380, lift = 4.0, done = t > lift, rise = E.p(t, lift, 5.5, 'inOut') * 300;
  const HABITS = ['READ', 'WALK', 'WATER', 'SLEEP', 'SAVE', 'LEARN', 'SMILE', 'CALL MOM', 'STRETCH', 'JOURNAL', 'NO SUGAR', 'GYM'];
  PRIN(c, 'SMALL THINGS LIFT BIG THINGS.', 470, done ? GOLD : '#e8e8e8');
  E.shaded(c, -100, GY, 1300, 120, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  const HX = 540, HY = GY - rise;
  // balloons: one by one, then a cloud of them
  const n = Math.min(100, Math.floor(100 * E.p(t, .1, lift, 'in')));
  for (let i = 0; i < Math.min(n, 60); i++) { const a = E.rnd(i) * Math.PI - Math.PI, r = 60 + 190 * Math.sqrt(E.rnd(i + 5)), bx = HX + Math.cos(a) * r * 1.3 + Math.sin(t * 2 + i) * 6, by = HY - 420 + Math.sin(a) * r * .7 + Math.cos(t * 1.6 + i) * 5;
    E.line(c, HX + 10, HY - 230, bx, by + 30, 'rgba(200,200,200,.35)', 1.5);
    c.save(); c.fillStyle = i % 3 === 0 ? GOLD : i % 3 === 1 ? '#e8e8e8' : '#9a9a9a'; c.beginPath(); c.ellipse(bx, by, 26, 32, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(bx - 8, by - 10, 6, 9, -.4, 0, 7); c.fill(); c.restore();
    if (i < HABITS.length) E.text(c, HABITS[i], bx, by + 2, { size: 11, weight: 800, family: MONO, color: '#111' }); }
  // the house
  E.shaded(c, HX - 130, HY - 180, 260, 180, 6, '#8a8a8e', '#3a3a3e'); c.save(); c.fillStyle = '#6a6a6e'; c.beginPath(); c.moveTo(HX - 160, HY - 178); c.lineTo(HX, HY - 290); c.lineTo(HX + 160, HY - 178); c.fill(); c.restore();
  E.rrect(c, HX + 4, HY - 236, 20, 30, 3, '#5a5a5e'); E.rrect(c, HX - 30, HY - 100, 60, 100, 4, '#1a1a1a'); E.rrect(c, HX - 100, HY - 140, 46, 40, 4, done ? '#ffe7a8' : '#2a2a2a'); E.rrect(c, HX + 54, HY - 140, 46, 40, 4, done ? '#ffe7a8' : '#2a2a2a');
  if (!done) { const sh = n > 70 ? Math.sin(t * 40) * 2 : 0; E.line(c, HX - 130 + sh, HY, HX + 130 + sh, HY, '#5a5a5a', 4); }
  if (done) { E.glowDot(c, HX, HY - 200, 460, 'rgba(245,197,66,.3)', E.p(t, lift, lift + .5)); E.particles(c, HX, GY, t - lift, { n: 40, speed: 300, color: '#8a8a8a', grav: 500, life: .8 }); }
  // him: tying balloons, then waving from the porch
  const tying = !done;
  fig(c, { x: done ? HX + 100 : 320, y: done ? hipOn(HY, .55) : hipOn(GY, .8), s: done ? .55 : .8, color: done ? GOLD : '#fff', pose: done ? win(t, lift) : { ...E.pose('stand'), aF: 2.4 + .3 * Math.sin(t * 10), eF: .2, hd: -.4 } });
  if (tying) { const q = (t * 2) % 1; c.save(); c.fillStyle = GOLD; c.globalAlpha = 1 - q; c.beginPath(); c.ellipse(330, GY - 250 - q * 200, 20, 26, 0, 0, 7); c.fill(); c.restore(); }
  CNT(c, 70, 560, 'TINY HABITS', n, done ? 'THE WHOLE HOUSE LIFTED' : 'ONE AT A TIME', done ? GOLD : '#e8e8e8');
} },
// 4 — The wind will break it. Build it again.
{ dur: 7, draw(c, t) {
  const CX = 540, CY = 960, R = 300, BREAKS = 6, cyc = .62, hold = BREAKS * cyc + .2, done = t > hold + 1.2;
  if (t < hold + 1.0) PRIN(c, 'THE WIND WILL BREAK IT.', 470); else E.title(c, 'BUILD IT AGAIN.', 540, 470, t, hold + 1.0, 1e9, { size: 40, weight: 800, ls: 5, family: 'Inter', color: GOLD });
  // branches
  E.line(c, 100, CY - R - 60, CX + 40, CY - R - 20, '#6a5a4a', 14); E.line(c, CX - 40, CY + R + 40, 980, CY + R - 10, '#6a5a4a', 14); E.line(c, 140, CY - R - 40, 120, CY + R + 80, '#6a5a4a', 12);
  const web = (k, broken, gold) => { c.save(); c.strokeStyle = gold ? GOLD : '#d8d8d8'; c.lineWidth = gold ? 3 : 2.5;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, kk = Math.min(1, k * 2.2 - i * .05); if (kk <= 0) continue; const off = broken ? (E.rnd(i) - .2) * broken * 260 : 0; c.globalAlpha = 1 - broken; c.beginPath(); c.moveTo(CX + off * .3, CY + off * .2); c.lineTo(CX + Math.cos(a) * R * kk + off, CY + Math.sin(a) * R * kk + off * .4 + broken * 120); c.stroke(); }
    const sp = Math.max(0, k * 1.6 - .6); if (sp > 0) { c.beginPath(); for (let u = 0; u < sp * 9 * Math.PI * 2; u += .12) { const r = 30 + u * (R - 40) / (9 * Math.PI * 2), a = u; c.lineTo(CX + Math.cos(a) * r + (broken ? 200 * broken : 0), CY + Math.sin(a) * r + broken * 160); } c.stroke(); }
    c.restore(); };
  let tries = 1;
  if (t < hold) { const i = Math.floor(t / cyc), ph = (t % cyc) / cyc; tries = i + 1; web(Math.min(1, ph / .65), ph > .65 ? E.p(ph, .65, 1) : 0, false);
    if (ph > .62) { c.save(); c.strokeStyle = 'rgba(220,230,240,.5)'; c.lineWidth = 3; for (let k = 0; k < 12; k++) { const y = 640 + E.rnd(k + i * 13) * 640, x = (ph - .62) * 3000 + E.rnd(k) * 400 - 300; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 60, y - 10, x + 140, y); c.stroke(); } c.restore(); } }
  else { tries = 7; const k = E.p(t, hold, hold + .9); web(k, 0, done); if (t > hold + .9) { c.save(); c.strokeStyle = 'rgba(220,230,240,.4)'; c.lineWidth = 3; for (let q = 0; q < 10; q++) { const y = 640 + E.rnd(q + 77) * 640, x = ((t - hold - .9) * 1400 + E.rnd(q) * 1200) % 1300 - 200; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 60, y - 10, x + 140, y); c.stroke(); } c.restore(); } }
  if (done) { E.glowDot(c, CX, CY, R + 160, 'rgba(245,197,66,.35)', E.p(t, hold + 1.2, hold + 1.7)); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 80 + (i % 4) * 60; c.save(); c.fillStyle = '#fff'; c.globalAlpha = .6 + .4 * Math.sin(t * 5 + i); c.beginPath(); c.arc(CX + Math.cos(a) * r, CY + Math.sin(a) * r, 4, 0, 7); c.fill(); c.restore(); } }
  // the spider
  const sx = CX + (t < hold ? Math.cos(t * 9) * 80 * ((t % cyc) / cyc) : 0), sy = CY + (t < hold ? Math.sin(t * 9) * 80 * ((t % cyc) / cyc) : 0);
  c.save(); c.translate(sx, sy); c.fillStyle = done ? GOLD : '#e8e8e8'; c.beginPath(); c.ellipse(0, 8, 16, 20, 0, 0, 7); c.fill(); c.beginPath(); c.arc(0, -16, 10, 0, 7); c.fill(); c.strokeStyle = done ? GOLD : '#e8e8e8'; c.lineWidth = 4; for (let i = 0; i < 4; i++) [-1, 1].forEach(d => { c.beginPath(); c.moveTo(0, -4 + i * 8); c.lineTo(d * 26, -14 + i * 10 + Math.sin(t * 20 + i) * 3); c.lineTo(d * 36, 4 + i * 12); c.stroke(); }); c.restore();
  CNT(c, 70, 560, 'WEB', `#${tries}`, done ? 'THIS ONE HELD' : t < hold ? 'BROKEN. AGAIN.' : 'BUILDING', done ? GOLD : '#e8e8e8', t < hold ? RED : null);
} },
] };
