// Reel 057 — "Be the Thursday guy" (audience-first: Monday restarts, sore after leg day, all-or-nothing dominoes, day 1 vs day 90; reference bible, ~25s)
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
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const cal = (c, x0, y0, rows, cellFn) => { const cw = 76, ch = 50; E.rrect(c, x0 - 16, y0 - 70, cw * 7 + 32, ch * rows + 90, 12, '#121216', '#4a4a50', 4); DAYS.forEach((d, i) => E.text(c, d, x0 + i * cw + cw / 2, y0 - 36, { size: 20, weight: 800, family: MONO, color: i === 3 ? GOLD : '#8a8a8a' })); for (let r = 0; r < rows; r++) for (let k = 0; k < 7; k++) { const v = cellFn(r, k); const x = x0 + k * cw, y = y0 + r * ch; c.save(); c.fillStyle = '#1c1c22'; c.fillRect(x + 4, y + 4, cw - 8, ch - 8); c.restore(); if (v === 'G') E.text(c, '✓', x + cw / 2, y + ch / 2, { size: 30, weight: 800, color: GOLD }); else if (v === 'W') E.text(c, '✓', x + cw / 2, y + ch / 2, { size: 30, weight: 800, color: '#e8e8e8' }); else if (v === 'X') E.text(c, '✕', x + cw / 2, y + ch / 2, { size: 28, weight: 800, color: RED }); } };
const domino = (c, x, gy, ang, label, col) => { c.save(); c.translate(x + 40, gy); c.rotate(ang); E.rrect(c, -40, -150, 40, 150, 6, '#e8e8e8', col, 3); c.save(); c.translate(-20, -75); c.rotate(-Math.PI / 2); E.text(c, label, 0, 0, { size: 15, weight: 800, family: MONO, color: '#111' }); c.restore(); c.restore(); };
const REEL = { title: 'Be the Thursday guy', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — Every Monday a new you. By Thursday, the old one is back.
{ dur: 6.6, zoom: t => 1.1 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, per = .5, r = Math.min(10, Math.floor(t / per)), ph = (t % per) / per;
  TITLE(c, 'EVERY MONDAY, A NEW YOU.', 450);
  TITLE(c, 'BY THURSDAY, THE OLD ONE IS BACK.', 505, RED, E.p(t, 2.2, 2.6));
  floor(c, GY);
  const shown = Math.min(6, r + 1), first = Math.max(0, r + 1 - 6);
  cal(c, 340, 750, 6, (row, k) => { const R = first + row; if (row >= shown) return ''; const fill = R < r ? 7 : Math.floor(ph * 7) + 1; if (k >= fill) return ''; return k === 0 ? 'G' : k < 2 + (R % 2) ? 'W' : 'X'; });
  E.glowDot(c, 378, 750 + Math.min(5, r) * 50 + 25, 120, 'rgba(245,197,66,.6)', 1 - ph);
  const hype = ph < .3;
  halo(c, 200, hipOn(GY, 1.05) - 80, hype ? 1 : .3, hype);
  fig(c, { x: 200, y: hipOn(GY, 1.05) + (hype ? 0 : 6), s: 1.05, color: hype ? GOLD : '#9a9a9a', pose: hype ? { ...E.pose('cheer'), aF: 2.6 + Math.sin(t * 20) * .2 } : { ...E.pose('sad'), hd: .6 } });
  if (hype) SAY(c, 'FROM TODAY!', 230, 880, 1, 1);
  TAG(c, `MONDAYS: ${r + 1}`, 820, 1140, 1, -1, GOLD);
  TAG(c, 'THURSDAYS: 0', 820, 1200, 1, -1, RED);
} },
// 2 — Day 3 after leg day. Sore means it's working.
{ dur: 6.2, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, sx = 520, sy = 820, st = 8, sw = 60, shh = 60;
  TITLE(c, 'DAY 3 AFTER LEG DAY.', 450);
  TITLE(c, "SORE MEANS IT'S WORKING.", 505, GOLD, E.p(t, 4.4, 4.8));
  floor(c, GY);
  // stairs going down to the right
  c.save(); c.fillStyle = '#2a2a30'; c.strokeStyle = '#6a6a70'; c.lineWidth = 3; c.beginPath(); c.moveTo(sx - 300, sy); for (let i = 0; i < st; i++) { c.lineTo(sx + i * sw, sy + i * shh); c.lineTo(sx + i * sw, sy + (i + 1) * shh); } c.lineTo(sx + st * sw + 200, GY); c.lineTo(sx - 300, GY); c.closePath(); c.fill(); c.stroke(); c.restore();
  const k = E.p(t, .3, 4.4, 'lin'), step = Math.min(st, Math.floor(k * st)), sub = (k * st) % 1, onTop = step === 0 && sub < .2;
  const x = t < .3 ? sx - 160 : sx - 20 + step * sw + (sub > .6 ? sw * E.p(sub, .6, 1) : 0), gy = t < .3 ? sy : sy + step * shh + (sub > .6 ? shh * E.p(sub, .6, 1) : 0);
  const done = t > 4.4, wob = Math.sin(t * 30) * 2;
  fig(c, { x: done ? sx + st * sw + 60 : x, y: hipOn(done ? GY : gy, 1.05) + wob, s: 1.05, f: 1, color: done ? GOLD : '#fff', pose: done ? win(t, 4.4) : { tor: -.05, hd: .1, aB: -.6, eB: .1, aF: .6, eF: .1, lB: -.08 - .1 * Math.sin(t * 6), kB: 0, lF: .08 + .1 * Math.sin(t * 6), kF: 0 } });
  if (!done) ['AAH', 'OUCH', 'WHY', 'MY LEGS', 'AAH', 'NO', 'OUCH', 'HELP'].forEach((w, i) => { if (i === step) SAY(c, w, x + 40, gy - 330, E.p(sub, 0, .2) * (1 - E.p(sub, .8, 1)), -1); });
  if (sub > .6 && sub < .7 && !done) E.shake(c, sub, .6, .1, 8);
  TAG(c, `SORENESS: ${done ? 100 : Math.round(60 + 40 * k)}%`, 260, 650, 1, -1, done ? GOLD : RED);
  E.particles(c, sx + st * sw + 60, GY - 300, t - 4.4, { n: 50, speed: 460, grav: 260 });
  if (done) E.rays(c, sx + st * sw + 60, GY - 250, 700, .2, GOLD, 16, t * .8);
} },
// 3 — One bad day isn't a bad week. Catch the first domino.
{ dur: 6.6, zoom: t => 1.06 + .015 * t, focus: [540, 1060], draw(c, t) {
  const gT = 960, gB = 1400, push = .6, catchT = 1.0;
  TITLE(c, "ONE BAD DAY ISN'T A BAD WEEK.", 450);
  TITLE(c, 'CATCH THE FIRST DOMINO.', 505, GOLD, E.p(t, 4.4, 4.8));
  floor(c, gT); floor(c, gB);
  LBL(c, 'ALL OR NOTHING', 540, 590, RED); LBL(c, 'SOMETHING', 540, 1050, t > 4.4 ? GOLD : '#e8e8e8');
  const lab = ['MISSED GYM', 'JUNK FOOD', 'SKIP STUDY', '3 AM SCROLL', 'WEEK RUINED'];
  lab.forEach((w, i) => { const t0 = push + i * .45, ang = Math.min(1.15, E.p(t, t0, t0 + .45, 'in') * 1.15); domino(c, 160 + i * 150, gT, ang, w, i === 4 ? RED : '#5a5a5e'); if (t > t0 + .45 && t < t0 + .6) E.shake(c, t, t0 + .45, .12, 6); });
  fig(c, { x: 100, y: hipOn(gT, .85), s: .85, color: '#9a9a9a', pose: t > 2.8 ? { ...E.pose('sad'), hd: .7 } : { ...E.pose('stand'), hd: .3 } });
  TAG(c, 'MONDAY AGAIN?', 820, 680, t, 3.0, RED);
  // bottom: he catches the first one and does 10 pushups at home
  const tip = t < catchT ? E.p(t, push, catchT) * .35 : Math.max(0, .35 - (t - catchT) * 1.2);
  lab.forEach((w, i) => domino(c, 420 + i * 115, gB, i === 0 ? tip : 0, i === 0 ? 'MISSED GYM' : ['DIET', 'STUDY', 'SLEEP', 'WEEK'][i - 1], i === 0 ? GOLD : '#5a5a5e'));
  if (t < 2.0) fig(c, { x: 340, y: hipOn(gB, .95), s: .95, color: '#fff', pose: t > .8 ? { ...E.pose('push'), tor: .3 } : E.pose('stand') });
  else { const up = Math.abs(Math.sin((t - 2) * 4)); fig(c, { x: 260, y: gB - 50 - 30 * up, s: .9, rot: -1.45, color: t > 4.4 ? GOLD : '#fff', pose: { tor: 0, hd: .2, aB: -1.57, eB: .9 * (1 - up), aF: -1.57, eF: .9 * (1 - up), lB: 0, kB: 0, lF: 0, kF: 0 } }); }
  TAG(c, `10 PUSHUPS AT HOME: ${Math.min(10, Math.max(0, Math.floor((t - 2) * 4 / Math.PI) + 1))}`, 820, 1130, t, 2.0, t > 4.4 ? GOLD : '#e8e8e8');
  E.particles(c, 460, gB - 160, t - 4.4, { n: 40, speed: 400, grav: 260 });
} },
// 4 — Anyone can start on a Monday. Be the one still here on Thursday.
{ dur: 7.6, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, mir = 3.6, n = Math.min(90, Math.floor(E.p(t, .1, mir, 'lin') * 90));
  TITLE(c, 'ANYONE CAN START ON A MONDAY.', 450);
  TITLE(c, 'BE THE ONE STILL HERE ON THURSDAY.', 505, GOLD, E.p(t, 1.6, 2.0));
  floor(c, GY);
  if (t < mir) {
    const shown = Math.min(6, Math.ceil(n / 7) || 1), first = Math.max(0, Math.ceil(n / 7) - 6);
    cal(c, 270, 690, 6, (row, k) => { const idx = (first + row) * 7 + k; return idx < n ? 'G' : ''; });
    E.glowDot(c, 540, 840, 500, 'rgba(245,197,66,.3)', .5 + .5 * Math.sin(t * 10));
    TAG(c, `STREAK: DAY ${Math.max(1, n)}`, 540, 1030, 1, -1, GOLD);
    fig(c, { x: 540, y: hipOn(GY, .85), s: .85, color: GOLD, pose: E.run(t * 14) });
  } else {
    const q = E.p(t, mir, mir + .5);
    E.rays(c, 760, 960, 900, .25 * q, GOLD, 18, t * .8); E.glowDot(c, 760, 1000, 460, 'rgba(245,197,66,.45)', q);
    [[300, 'DAY 1', '#8a8a8a', 13, .95], [760, 'DAY 90', GOLD, 26, 1.15]].forEach(([x, w, col, lw, s], i) => { E.rrect(c, x - 150, GY - 470, 300, 450, 20, '#101016', i ? GOLD : '#5a5a5e', 6); fig(c, { x, y: hipOn(GY - 30, s), s, lw, color: col, pose: i ? { ...E.pose('cheer'), aF: 2.2 + Math.sin(t * 5) * .1, aB: -2.2, eF: 1.2, eB: -1.2 } : { ...E.pose('stand'), hd: .2 } }); TAG(c, w, x, GY - 520, t, mir + .2 + i * .4, col); });
    E.particles(c, 760, 900, t - mir - .6, { n: 70, speed: 560, grav: 280, life: 1.6 });
    for (let i = 0; i < 30; i++) { const qq = ((t - mir) * (.4 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .8 * (1 - qq) * q; c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); }
    E.flash(c, t, mir, .3, '245,197,66', .3);
  }
} },
] };
