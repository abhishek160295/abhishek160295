// Reel 046 — "It mattered to that one" (≤25s, Shorts-first: emotional, likeable, shareable)
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
const star = (c, x, y, r, col, rot = 0, a = 1) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, b = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(b) * rr, Math.sin(b) * rr); } c.closePath(); c.fill(); c.restore(); };

const REEL = { title: 'It mattered to that one', bpm: 120, scenes: [
// 1 — Rock bottom is solid ground
{ dur: 5.5, draw(c, t) {
  const L = 380, R = 700, TOP = 640, BOT = 1340, land = 1.5, out = 4.4, done = t > out;
  PRIN(c, 'ROCK BOTTOM', 450);
  PRIN(c, 'IS SOLID GROUND.', 505, GOLD, E.p(t, 2.6, 3.0));
  E.shaded(c, -100, TOP, L + 100, BOT - TOP + 200, 0, '#3a3a3e', '#121214'); E.shaded(c, R, TOP, 600, BOT - TOP + 200, 0, '#3a3a3e', '#121214');
  E.line(c, -100, TOP, L, TOP, '#7a7a7a', 3); E.line(c, R, TOP, 1180, TOP, '#7a7a7a', 3);
  E.shaded(c, L, BOT, R - L, 40, 0, done ? '#8a7a4a' : '#5a5a5e', '#2a2a2e'); E.text(c, done ? 'SOLID GROUND' : 'ROCK BOTTOM', (L + R) / 2, BOT + 70, { size: 18, weight: 800, family: MONO, ls: 2, color: done ? GOLD : '#9a9a9a' });
  ['LOST JOB', 'HEARTBREAK', 'BROKE'].forEach((w, i) => { const y = 780 + i * 170; E.tag(c, w, i % 2 ? R + 110 : L - 110, y, 1, -1, { size: 16, color: '#bbb', alpha: t < land ? E.p(t, i * .4, i * .4 + .2) : 1 - E.p(t, 3, 3.4) }); });
  let x = 540, y, rot = 0, pose;
  if (t < land) { const k = E.p(t, 0, land, 'in'); y = E.lerp(TOP - 120, BOT - 40, k); rot = k * 3; pose = E.pose('jump'); }
  else if (t < 2.6) { y = BOT - 30; rot = Math.PI / 2; pose = E.pose('stand'); }
  else if (t < 3.0) { y = hipOn(BOT, .8) + 30; pose = E.pose('crouch'); }
  else if (t < out) { const k = E.p(t, 3.0, out, 'lin'), zig = Math.abs(((k * 4) % 2) - 1); x = E.lerp(L + 30, R - 30, zig); y = E.lerp(hipOn(BOT, .8), hipOn(TOP, .8), k); pose = { ...E.pose('jump'), aF: 2.8 }; }
  else { x = R + 120; y = hipOn(TOP, .8); pose = win(t, out); }
  E.particles(c, 540, BOT, t - land, { n: 40, speed: 360, color: '#8a8a8a', grav: 700, life: .7 }); E.shake(c, t, land, .3, 14); E.flash(c, t, land, .15, '229,72,77', .2);
  if (done) { E.glowDot(c, R + 120, TOP - 100, 420, 'rgba(245,197,66,.45)', E.p(t, out, out + .5)); E.rays(c, R + 120, TOP - 100, 460, .28 * E.p(t, out, out + .5), GOLD, 14, t * .2); }
  fig(c, { x, y, s: .8, rot, color: done ? GOLD : t > 3 ? '#fff' : '#bdbdbd', pose });
  CNT(c, 70, 560, 'DEPTH', t < land ? Math.round(E.p(t, 0, land, 'in') * 100) + 'M' : done ? '0M' : t > 3 ? Math.round(100 * (1 - E.p(t, 3, out, 'lin'))) + 'M' : '100M', done ? 'BACK ON TOP' : t > 3 ? 'PUSHING OFF' : 'THE BOTTOM', done ? GOLD : '#e8e8e8');
} },
// 2 — Build bridges for the ones coming after you
{ dur: 6, draw(c, t) {
  const L = 340, R = 740, GY = 1100, PW = 40, N = 10, done = t > 4.4;
  PRIN(c, 'BUILD BRIDGES FOR THE ONES COMING AFTER YOU.', 470, done ? GOLD : '#e8e8e8');
  E.shaded(c, -100, GY, L + 100, 500, 0, '#3a3a3e', '#121214'); E.shaded(c, R, GY, 600, 500, 0, '#3a3a3e', '#121214'); E.line(c, -100, GY, L, GY, '#7a7a7a', 3); E.line(c, R, GY, 1180, GY, '#7a7a7a', 3);
  const laid = Math.min(N, Math.floor(E.p(t, .2, 3.8, 'lin') * N + .001));
  for (let i = 0; i < laid; i++) { const x = R - (i + 1) * PW, d = E.p(t, .2 + i * .36, .2 + i * .36 + .2, 'in'); E.shaded(c, x + 1, E.lerp(GY - 60, GY - 8, d), PW - 3, 16, 3, done ? '#f7d36a' : '#a8835a', done ? '#a07a1a' : '#5e4428'); }
  if (laid) { E.line(c, R, GY - 64, R - laid * PW, GY - 64, done ? GOLD : '#8a6a44', 4); }
  // the old one, bent over, laying planks back toward them
  const ox = done ? R + 70 : Math.max(R - laid * PW + 30, R - 360);
  fig(c, { x: ox, y: hipOn(GY, .78) + (done ? 0 : 20), s: .78, f: -1, color: done ? GOLD : '#bdbdbd', pose: done ? { ...E.pose('stand'), tor: .3, aF: 1.6, eF: .2, aB: 1.5, eB: .2 } : { ...E.pose('crouch'), tor: .9, aF: 1.6 + .3 * Math.sin(t * 9) } });
  E.line(c, ox + 50, GY, ox + 60, hipOn(GY, .78) - 40, '#8a6a44', 4);
  // the young ones waiting, then running across
  [0, 1, 2].forEach(i => { const k = E.p(t, 4.0 + i * .15, 4.9 + i * .15, 'lin'), x = done ? E.lerp(200 - i * 50, R + 150 + i * 40, k) : 200 - i * 50, jump = done ? 0 : Math.abs(Math.sin(t * 6 + i)) * 12;
    fig(c, { x, y: hipOn(GY, .5) - jump, s: .5, lw: 12, color: done ? '#ffe7a8' : '#e8e8e8', pose: done ? E.run(t * 14 + i) : { ...E.pose('cheer'), aF: 2.2 + Math.sin(t * 6 + i) * .3, aB: -2.2 } }); });
  if (done) { E.glowDot(c, R + 100, GY - 100, 380, 'rgba(245,197,66,.4)', E.p(t, 4.4, 4.9)); for (let i = 0; i < 6; i++) { const q = ((t - 4.4) * .6 + i / 6) % 1; E.heart(c, R + 40 + i * 30, GY - 220 - q * 200, .3, (1 - q) * E.p(t, 4.6, 5), i % 2 ? RED : GOLD); } }
  E.tag(c, 'HE ALREADY CROSSED', R + 90, GY - 250, t, .3, { size: 16, color: '#bbb', alpha: 1 - E.p(t, 3.8, 4.2) });
  CNT(c, 70, 560, 'PLANKS', laid, done ? 'FOR THEM, NOT HIM' : 'BUILDING BACKWARDS', done ? GOLD : '#e8e8e8');
} },
// 3 — On dark days, turn to each other
{ dur: 5.5, draw(c, t) {
  const GY = 1330, cloud = E.p(t, 1.2, 2.2), sunBack = E.p(t, 4.2, 5.0), done = t > 4.4;
  PRIN(c, 'ON DARK DAYS, TURN TO EACH OTHER.', 470, done ? GOLD : '#e8e8e8');
  const dark = cloud * (1 - sunBack);
  E.glowDot(c, 900, 680, 300, 'rgba(255,214,120,.6)', 1 - dark); c.save(); c.globalAlpha = 1 - dark * .8; c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(900, 680, 70, 0, 7); c.fill(); c.restore();
  for (let i = 0; i < 5; i++) { const cx = E.lerp(-300 + i * 120, 600 + i * 150, cloud) - sunBack * 900; c.save(); c.globalAlpha = .9; c.fillStyle = '#3a3a40'; [[0, 0, 70], [60, -20, 80], [120, 0, 65]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(cx + dx, 660 + (i % 2) * 60 + dy, r, 0, 7); c.fill(); }); c.restore(); }
  if (dark > .3) { c.save(); c.strokeStyle = `rgba(190,205,220,${.4 * dark})`; c.lineWidth = 3; for (let i = 0; i < 70; i++) { const x = E.rnd(i) * 1200 - 60, q = (t * 2.4 + E.rnd(i + 5)) % 1, y = E.lerp(700, GY, q); c.beginPath(); c.moveTo(x + q * 30, y); c.lineTo(x + q * 30 - 10, y + 30); c.stroke(); } c.restore(); }
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a20', '#10100a'); E.line(c, -100, GY, 1180, GY, '#5a5a4a', 3);
  const N = 8;
  for (let i = 0; i < N; i++) { const x = 140 + i * 110, h = 280 + 40 * E.rnd(i), hy = GY - h + Math.sin(t * 2 + i) * 6;
    const toSun = .45, toPeer = i % 2 ? -1.2 : 1.2, face = E.lerp(toSun, toPeer, E.clamp(dark * 1.3));
    E.line(c, x, GY, x + Math.sin(t + i) * 4, hy, '#5a7a3a', 7); c.save(); c.fillStyle = '#5a7a3a'; c.beginPath(); c.ellipse(x - 20, GY - h * .4, 22, 9, -.5, 0, 7); c.fill(); c.restore();
    const lit = done || dark > .5; if (dark > .5 && !done) E.glowDot(c, x + Math.sin(face) * 40, hy, 110, 'rgba(245,197,66,.25)', dark);
    c.save(); c.translate(x, hy); c.scale(Math.cos(face * .6) * .6 + .4, 1); for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; c.fillStyle = done ? GOLD : '#e0b030'; c.beginPath(); c.ellipse(Math.cos(a) * 38, Math.sin(a) * 38, 20, 9, a, 0, 7); c.fill(); } c.fillStyle = '#4a3010'; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill(); c.restore(); }
  if (done) E.glowDot(c, 540, GY - 300, 600, 'rgba(245,197,66,.22)', sunBack);
  CNT(c, 70, 560, 'SUN', dark > .5 ? 'GONE' : 'OUT', dark > .5 ? 'THEY FACE EACH OTHER' : done ? 'AND THEY MADE IT' : 'FACING THE LIGHT', done ? GOLD : '#e8e8e8');
} },
// 4 — You can't save them all. It mattered to that one.
{ dur: 7.5, draw(c, t) {
  const SH = 1080, done = t > 5.0;
  if (t < 5.2) PRIN(c, "YOU CAN'T SAVE THEM ALL.", 470); else E.title(c, 'IT MATTERED TO THAT ONE.', 540, 470, t, 5.2, 1e9, { size: 38, weight: 800, ls: 4, family: 'Inter', color: GOLD });
  // sea at the top, beach below
  c.save(); const g = c.createLinearGradient(0, 600, 0, SH); g.addColorStop(0, '#0c1822'); g.addColorStop(1, '#2c4458'); c.fillStyle = g; c.fillRect(-100, 600, 1300, SH - 600); c.restore();
  const shore = x => SH + 10 * Math.sin(x * .02 + t * 2);
  c.save(); c.fillStyle = '#4a4236'; c.beginPath(); c.moveTo(-100, 1700); for (let x = -100; x <= 1180; x += 12) c.lineTo(x, shore(x)); c.lineTo(1180, 1700); c.fill(); c.strokeStyle = '#d8ecf8'; c.lineWidth = 4; c.beginPath(); for (let x = -100; x <= 1180; x += 12) x === -100 ? c.moveTo(x, shore(x)) : c.lineTo(x, shore(x)); c.stroke(); c.restore();
  // the stranded ones
  for (let i = 0; i < 28; i++) { const x = 90 + (i * 131) % 900, y = SH + 50 + (i * 53) % 200; star(c, x, y, 16, '#c9a06a', i); }
  // the child throws one back, again and again
  const TH = [.5, 1.4, 2.3, 3.2, 4.2], CX = 420, CY = SH + 170; let thrown = 0;
  let pose = E.pose('stand');
  TH.forEach((t0, i) => { if (t > t0 - .3 && t < t0 + .1) pose = { ...E.pose('stand'), tor: .2, aF: E.lerp(-1, 2.6, E.p(t, t0 - .3, t0)), eF: .1 }; const dt = t - t0; if (dt < 0) return; thrown++; const k = Math.min(1, dt / .8), x = E.lerp(CX + 30, 300 + i * 130, k), y = E.lerp(CY - 120, 900 + (i % 2) * 60, k) - Math.sin(k * Math.PI) * 220; if (k < 1) star(c, x, y, 18, '#e0b060', dt * 9); else { const glow = i === 4 ? 1 : .4; star(c, x, y + 10 * Math.sin(t * 2 + i), 16, i === 4 && done ? GOLD : '#c9a06a', 0, .6); if (i === 4) E.glowDot(c, x, y, 120, 'rgba(245,197,66,.6)', E.p(t, 5.0, 5.4)); } if (dt > .8 && dt < 1.2) E.particles(c, x, y, dt - .8, { n: 14, speed: 200, color: '#d8ecf8', grav: 400, life: .4, seed: i }); });
  fig(c, { x: CX, y: hipOn(CY, .5), s: .5, lw: 12, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('stand'), hd: -.2 } : pose });
  // the adult who says it won't matter... then picks one up too
  const ax = 640, picks = t > 5.6;
  fig(c, { x: ax, y: hipOn(CY, .85), s: .85, f: -1, color: picks ? GOLD : '#9a9a9a', pose: picks ? { ...E.pose('stand'), aF: E.lerp(-1, 2.6, E.p(t, 5.6, 6.0)), eF: .1 } : { ...E.pose('arms'), hd: .2 } });
  if (picks) { const dt = t - 6.0; if (dt > 0) { const k = Math.min(1, dt / .8); star(c, E.lerp(ax - 40, 760, k), E.lerp(CY - 200, 880, k) - Math.sin(k * Math.PI) * 240, 18, GOLD, dt * 9); } }
  SAY(c, "THERE ARE THOUSANDS. IT WON'T MATTER.", 640, CY - 330, E.p(t, 1.8, 2.1, 'back') * (1 - E.p(t, 3.8, 4.0)));
  SAY(c, 'IT MATTERED TO THAT ONE.', 400, CY - 260, E.p(t, 4.4, 4.7, 'back') * (1 - E.p(t, 5.8, 6.0)));
  CNT(c, 70, 560, 'SAVED', thrown + (t > 6.8 ? 1 : 0), done ? 'EACH ONE MATTERED' : 'ONE AT A TIME', done ? GOLD : '#e8e8e8');
} },
] };
