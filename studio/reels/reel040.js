// Reel 040 — "Someone is proud of you" (≤30s, ref #16/#17 lane: principle per scene, panel cards, crowds)
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

const REEL = { title: 'Someone is proud of you', bpm: 120, scenes: [
// 1 — What you feed grows
{ dur: 6.5, draw(c, t) {
  const s = .8, g = E.p(t, .4, 4.6, 'inOut'), done = t > 4.8;
  PRIN(c, 'WHAT YOU FEED GROWS.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'FEEDS DOUBT'); PANEL(c, ...P2, 'FEEDS BELIEF', done);
  const can = o => { const [hx, hy] = E.hand(o); E.shaded(c, hx - 10, hy - 6, 50, 34, 6, '#7a8a9a', '#3a4a5a'); if (t < 4.6) for (let i = 0; i < 7; i++) { const q = (t * 2.4 + i / 7) % 1; c.save(); c.globalAlpha = .8 * (1 - q); c.fillStyle = '#8fc8ff'; c.beginPath(); c.arc(hx + 46 + q * 50, hy + q * 140, 4, 0, 7); c.fill(); c.restore(); } };
  // top: the doubt vine grows thorns and wraps around him
  clip(c, P1, () => {
    E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    const vx = 520, vh = 40 + 300 * g;
    c.save(); c.strokeStyle = '#4a4a50'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(vx, gT); for (let y = 0; y <= vh; y += 8) c.lineTo(vx + Math.sin(y * .05 + t) * 26, gT - y); c.stroke();
    c.lineWidth = 4; for (let y = 20; y < vh; y += 34) { const x = vx + Math.sin(y * .05 + t) * 26; c.beginPath(); c.moveTo(x, gT - y); c.lineTo(x + (y % 68 ? 22 : -22), gT - y - 10); c.stroke(); } c.restore();
    const wrap = E.p(t, 2.6, 4.6);
    const o = { x: 380, y: hipOn(gT, s), s, color: '#bdbdbd', pose: wrap > .5 ? { ...E.pose('stand'), aF: .2, aB: -.2, hd: .3 } : { ...E.pose('stand'), aF: 1.3, eF: .2 } };
    fig(c, o); if (wrap < .5) can(o);
    if (wrap > 0) { c.save(); c.strokeStyle = '#5a5a60'; c.lineWidth = 7; c.beginPath(); for (let k = 0; k <= wrap * 6 * Math.PI; k += .2) { const y = gT - 10 - k * 9, x = 380 + Math.cos(k) * 40; k === 0 ? c.moveTo(x + 140, gT) : c.lineTo(x, y); } c.stroke(); c.restore(); }
    E.tag(c, 'DOUBT', vx, gT - vh - 30, 1, -1, { size: 16, color: '#bbb' });
  });
  if (t > 4.6) E.tag(c, 'TRAPPED', 380, 650, t, 4.6, { size: 20, color: RED, fill: '#1e0a0a' });
  CNT(c, 660, 600, 'DAYS FED', Math.round(100 * g), 'DOUBT: HUGE', '#e8e8e8', RED);
  // bottom: belief grows into a stalk that lifts him up
  clip(c, P2, () => {
    E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
    const vx = 600, vh = 40 + 290 * g;
    if (done) E.glowDot(c, vx, gB - vh, 380, 'rgba(245,197,66,.45)', E.p(t, 4.8, 5.3));
    c.save(); c.strokeStyle = GOLD; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(vx, gB); for (let y = 0; y <= vh; y += 8) c.lineTo(vx + Math.sin(y * .03) * 14, gB - y); c.stroke();
    c.fillStyle = '#e0b040'; for (let y = 40; y < vh; y += 60) { const x = vx + Math.sin(y * .03) * 14, d = (y / 60) % 2 ? 1 : -1; c.beginPath(); c.ellipse(x + d * 30, gB - y, 30, 11, d * .4, 0, 7); c.fill(); } c.restore();
    const lift = Math.max(0, vh - 120), o = { x: g > .35 ? vx - 10 : 440, y: hipOn(gB - (g > .35 ? lift : 0), s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 4.8) : g > .35 ? E.pose('stand') : { ...E.pose('stand'), aF: 1.3, eF: .2 } };
    if (g > .35) E.shaded(c, vx - 70, gB - lift - 4, 120, 14, 6, '#f7d36a', '#a07a1a');
    fig(c, o); if (g <= .35) can(o);
    E.tag(c, 'BELIEF', vx + 90, gB - 40, 1, -1, { size: 16, color: GOLD, fill: '#2a2208' });
  });
  CNT(c, 660, 1060, 'DAYS FED', Math.round(100 * g), done ? 'BELIEF: LIFTED HIM' : 'BELIEF: GROWING', done ? GOLD : '#e8e8e8');
} },
// 2 — It's darkest right before the dawn
{ dur: 7, draw(c, t) {
  const s = .8, dawn = 5.0, sun = E.p(t, dawn, dawn + 1.2, 'out');
  const mins = Math.min(60, 55 + Math.floor(t)), clockStr = mins === 60 ? '6:00' : `5:${mins}`;
  PRIN(c, "IT'S DARKEST RIGHT BEFORE THE DAWN.", 470, t > dawn ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'TURNED BACK AT 5:59'); PANEL(c, ...P2, 'WALKED ONE MORE MINUTE', t > dawn + .6);
  const sky = (P, gy) => { if (sun <= 0) return; c.save(); const g = c.createLinearGradient(0, P[0], 0, gy); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(245,160,80,${.4 * sun})`); c.fillStyle = g; c.fillRect(70, P[0], 920, gy - P[0]); c.restore(); const sy = E.lerp(gy + 60, gy - 120, sun); E.glowDot(c, 860, sy, 360, 'rgba(255,200,110,.6)', sun); E.rays(c, 860, sy, 420, .25 * sun, '#ffd27a', 16, t * .1); c.save(); c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(860, sy, 70, 0, 7); c.fill(); c.restore(); };
  [[P1, gT], [P2, gB]].forEach(([P, gy]) => { E.rrect(c, 780, P[0] + 20, 150, 60, 10, '#0c0c0c', mins === 60 ? GOLD : '#4a4a50', 3); E.text(c, clockStr, 855, P[0] + 51, { size: 32, weight: 800, family: MONO, color: mins === 60 ? GOLD : '#e8e8e8' }); });
  // top: walks in the dark, gives up one minute early, walks away from the sunrise
  clip(c, P1, () => { sky(P1, gT); E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    let x = E.lerp(160, 560, E.p(t, 0, 3.9, 'lin')), f = 1, pose = E.walk(t * 7);
    if (t > 3.9 && t < 4.4) pose = { ...E.pose('stand'), hd: .3 };
    if (t >= 4.4) { x = E.lerp(560, 60, E.p(t, 4.4, 7, 'lin')); f = -1; pose = { ...E.walk(t * 7), hd: .4 }; }
    fig(c, { x, y: hipOn(gT, s), s, f, color: '#bdbdbd', pose });
    c.save(); c.fillStyle = 'rgba(0,0,0,.55)'; c.globalAlpha = 1 - sun; c.fillRect(70, P1[0] + 70, 920, 400); c.restore(); });
  SAY(c, "IT'S TOO DARK.", 600, 700, E.p(t, 4.0, 4.3, 'back') * (1 - E.p(t, 5.0, 5.2)));
  if (t > dawn + .6) E.tag(c, 'HE WAS 1 MINUTE AWAY', 420, 680, t, dawn + .6, { size: 20, color: RED, fill: '#1e0a0a' });
  // bottom: one more minute, and the sun comes up
  clip(c, P2, () => { sky(P2, gB); E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
    const done = t > dawn + .6, x = done ? 700 : E.lerp(160, 700, E.p(t, 0, dawn + .4, 'lin'));
    fig(c, { x, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, dawn + .6) : E.walk(t * 7) });
    c.save(); c.fillStyle = 'rgba(0,0,0,.55)'; c.globalAlpha = 1 - sun; c.fillRect(70, P2[0] + 70, 920, 400); c.restore(); });
} },
// 3 — Slow progress is still progress (they sprint, they stop, he walks past all of them)
{ dur: 6.5, draw(c, t) {
  const GY = 1330, N = 24, fin = 5.4, done = t > fin;
  PRIN(c, 'SLOW PROGRESS IS STILL PROGRESS.', 470, done ? GOLD : '#e8e8e8');
  E.shaded(c, -100, GY, 1300, 140, 0, '#3a3a3e', '#121214'); E.line(c, -100, GY, 1180, GY, '#6a6a6a', 3);
  E.line(c, 150, GY, 150, GY - 140, '#6a6a6a', 4); E.line(c, 900, GY, 900, GY - 170, '#8a8a8a', 5);
  if (!done) E.line(c, 900, GY - 110, 960, GY - 110, '#e8e8e8', 4); else E.particles(c, 900, GY - 110, t - fin, { n: 60, speed: 500, grav: 300 });
  let passed = 0;
  const wx = done ? 900 : E.lerp(150, 900, E.p(t, 0, fin, 'lin'));
  for (let i = 0; i < N; i++) {
    const row = i % 3, sc = [.45, .52, .6][row], yb = GY - (2 - row) * 26, sp = 280 + 200 * E.rnd(i), stop = 360 + 520 * E.rnd(i + 7), ts = (stop - 160) / sp;
    const x = Math.min(160 + sp * t, stop), stopped = t > ts;
    if (stopped && wx > x) passed++;
    fig(c, { x, y: stopped ? yb - 50 * sc / .6 : hipOn(yb, sc), s: sc, color: ['#7a7a7a', '#929292', '#aaaaaa'][row], pose: stopped ? { ...E.pose('sit'), hd: .5 } : E.run(t * 16 + i) });
  }
  ['TOO TIRED.', 'I QUIT.', 'NOT WORTH IT.'].forEach((w, i) => { const x = [470, 650, 800][i]; SAY(c, w, x, GY - 170 - i % 2 * 50, E.p(t, 1.6 + i * .8, 1.9 + i * .8, 'back') * (1 - E.p(t, 2.7 + i * .8, 2.9 + i * .8))); });
  if (done) { E.glowDot(c, 900, GY - 120, 380, 'rgba(245,197,66,.45)', E.p(t, fin, fin + .5)); E.rays(c, 900, GY - 120, 440, .25 * E.p(t, fin, fin + .5), GOLD, 14, t * .2); }
  fig(c, { x: wx, y: hipOn(GY + 10, .75), s: .75, color: done ? GOLD : '#fff', pose: done ? win(t, fin) : E.walk(t * 6) });
  E.tag(c, done ? 'STILL MOVING' : 'SLOW', wx, GY - 230, 1, -1, { size: 18, color: done ? GOLD : '#ddd', fill: done ? '#2a2208' : '#0c0c0c' });
  CNT(c, 70, 560, 'PASSED', `${passed}/${N}`, done ? 'FINISHED. AT HIS PACE.' : 'AT WALKING SPEED', done ? GOLD : '#e8e8e8');
} },
// 4 — You think nobody notices. Someone is proud of you.
{ dur: 9, draw(c, t) {
  const GY = 1330, look = 6.6, done = t > look;
  if (t < 6.8) PRIN(c, 'YOU THINK NOBODY NOTICES.', 470);
  else E.title(c, 'SOMEONE IS PROUD OF YOU.', 540, 470, t, 6.8, 1e9, { size: 36, weight: 800, ls: 4, family: 'Inter', color: GOLD });
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // desk, lamp, the one working late
  E.glowDot(c, 640, GY - 210, 260, 'rgba(255,214,120,.45)');
  E.shaded(c, 500, GY - 120, 260, 16, 4, '#7a6a5a', '#4a3a2a'); E.line(c, 520, GY - 104, 520, GY, '#555', 6); E.line(c, 740, GY - 104, 740, GY, '#555', 6);
  E.line(c, 700, GY - 120, 700, GY - 220, '#8a8a8a', 4); c.save(); c.fillStyle = '#ffe7a8'; c.beginPath(); c.moveTo(670, GY - 220); c.lineTo(730, GY - 220); c.lineTo(716, GY - 252); c.lineTo(684, GY - 252); c.fill(); c.restore();
  E.rrect(c, 560, GY - 150, 90, 30, 3, '#d8d8d8');
  E.line(c, 380, GY - 70, 470, GY - 70, '#6a6a6a', 8); E.line(c, 390, GY - 70, 390, GY, '#555', 5); E.line(c, 460, GY - 70, 460, GY, '#555', 5);
  const writing = !done;
  fig(c, { x: 450, y: GY - 70 - 8, s: .85, color: done ? GOLD : '#d8d8d8', pose: done ? { ...E.pose('sit'), hd: -.3, tor: -.05, aF: 2.2, eF: .3, aB: 2.0, eB: .3 } : { ...E.pose('sit'), hd: .5, tor: .35, aF: 1.4 + .15 * Math.sin(t * 9), eF: .5, aB: 1.3, eB: .6 } });
  SAY(c, 'DOES ANYONE EVEN CARE?', 420, GY - 300, E.p(t, 1.2, 1.5, 'back') * (1 - E.p(t, 3.2, 3.4)));
  // the people behind him he can't see
  const PEOPLE = [[140, 'MOM', 3.4, .78], [270, 'YOUR KID', 4.0, .5], [810, 'BEST FRIEND', 4.6, .78], [930, 'FUTURE YOU', 5.2, .82]];
  PEOPLE.forEach(([x, name, t0, sc], i) => {
    const a = E.p(t, t0, t0 + .6); if (a <= 0) return;
    const col = done ? GOLD : '#ffe7a8', y = hipOn(GY - 30, sc);
    E.glowDot(c, x, y - 40, 180, 'rgba(255,214,120,.35)', a);
    fig(c, { x, y, s: sc, f: x > 500 ? -1 : 1, color: col, alpha: a * .85, pose: i === 2 ? { ...E.pose('point'), aF: 2.4, eF: 1.4 } : { ...E.pose('cheer'), aF: 2.4 + Math.sin(t * 4 + i) * .25, aB: -2.4 - Math.sin(t * 4 + i) * .25 } });
    if (i === 0) E.heart(c, x + 40, y - 150, .5 + .06 * Math.sin(t * 6), a, RED);
    E.tag(c, name, x, GY + 40 + (i % 2) * 44, 1, -1, { size: 16, color: col, fill: '#141008', alpha: a });
  });
  if (done) for (let i = 0; i < 10; i++) { const q = ((t - look) * .5 + i / 10) % 1; E.heart(c, 200 + i * 70 + Math.sin(q * 6 + i) * 20, GY - 200 - q * 360, .3, (1 - q) * E.p(t, look, look + .5), i % 2 ? RED : GOLD); }
  CNT(c, 70, 560, 'DAYS NOBODY SAW', Math.round(900 * E.p(t, 0, look, 'lin')), done ? 'THEY SAW ALL OF THEM' : 'WORKING ALONE', done ? GOLD : '#e8e8e8');
} },
] };
