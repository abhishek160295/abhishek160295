// Reel 050 — "Too light to feel" (relatable: habits, focus, discipline, overthinking; reference bible: one metaphor per scene, spotlight, mono + gold, ≤30s)
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
const rabbit = (c, x, y, f, ph, col = '#e8e8e8') => { const hopY = -Math.abs(Math.sin(ph)) * 40; c.save(); c.translate(x, y + hopY); c.scale(f, 1); c.fillStyle = col; c.beginPath(); c.ellipse(0, -30, 38, 26, -.2, 0, 7); c.fill(); c.beginPath(); c.arc(34, -52, 18, 0, 7); c.fill(); c.beginPath(); c.ellipse(30, -86, 6, 22, -.2, 0, 7); c.fill(); c.beginPath(); c.ellipse(42, -84, 6, 20, .2, 0, 7); c.fill(); c.beginPath(); c.arc(-38, -34, 10, 0, 7); c.fill(); c.restore(); };

const REEL = { title: 'Too light to feel', bpm: 120, scenes: [
// 1 — Habits are too light to feel until they're too heavy to break
{ dur: 7, draw(c, t) {
  const GY = 1330, X = 470, s = 1.25, k = E.p(t, .2, 4.4, 'lin'), pull = t > 4.6, done = t > 4.4;
  TITLE(c, 'HABITS ARE TOO LIGHT TO FEEL', 450);
  TITLE(c, "UNTIL THEY'RE TOO HEAVY TO BREAK.", 505, GOLD, E.p(t, 4.6, 5.0));
  floor(c, GY); spot(c, X, GY);
  E.glowDot(c, 960, GY - 200, 320, 'rgba(245,197,66,.35)', .6 + .2 * Math.sin(t * 2)); E.rrect(c, 920, GY - 300, 80, 300, 6, '#ffe7a8', GOLD, 4);
  E.shaded(c, 60, GY - 120, 130, 120, 16, '#5a5a5e', '#1e1e22'); TAG(c, 'SCROLL', 125, GY - 60, 1, -1, '#bbb');
  const strain = pull ? Math.sin(t * 30) * 4 : 0, lean = pull ? .5 : 0, hy = hipOn(GY, s);
  halo(c, X, hy - 80, 1);
  fig(c, { x: X + strain, y: hy, s, color: '#d8d8d8', pose: pull ? { ...E.pose('push'), tor: .55, aF: 1.6, aB: 1.4 } : { ...E.pose('stand'), hd: .45, aF: .7, eF: 1.9 } });
  if (!pull) { E.glowDot(c, X + 40, hy - 120, 60, 'rgba(120,190,255,.5)'); E.rrect(c, X + 30, hy - 140, 22, 36, 4, '#1a2a3a', '#9ac8ff', 2); }
  // the wraps: thin thread at first, chain by the end, tied back to SCROLL
  const n = Math.floor(2 + 16 * k), thick = 1.5 + 9 * k;
  c.save(); c.strokeStyle = k < .6 ? `rgba(220,220,220,${.4 + .6 * k})` : '#9a9a9a'; c.lineWidth = thick;
  for (let i = 0; i < n; i++) { const y = hy + 40 - i * 14; c.beginPath(); c.ellipse(X + strain + Math.sin(i) * 4, y, 48 + (i % 3) * 4, 9, 0, 0, 7); c.stroke(); }
  c.beginPath(); c.moveTo(X - 40, hy - 40); c.quadraticCurveTo(300, pull ? hy - 40 : hy + 40, 190, GY - 60); c.stroke(); c.restore();
  if (k > .6) for (let i = 0; i < 8; i++) { const q = i / 8, x = E.lerp(X - 40, 190, q), y = E.lerp(hy - 40, GY - 60, q) + (pull ? 0 : Math.sin(q * Math.PI) * 60); c.save(); c.strokeStyle = '#7a7a7a'; c.lineWidth = 7; c.beginPath(); c.ellipse(x, y, 16, 9, .3 + i, 0, 7); c.stroke(); c.restore(); }
  ['SNOOZE', 'SKIP', 'LATER'].forEach((w, i) => TAG(c, w, 300 + i * 40, hy - 80 + i * 60, t, 1.2 + i * 1.0, '#9a9a9a'));
  TAG(c, `DAY ${Math.max(1, Math.round(365 * k))}`, 820, 640, 1, -1, k > .9 ? RED : '#e8e8e8');
  E.shake(c, t, 4.7, .5, 6);
} },
// 2 — Chase two rabbits, catch none
{ dur: 7, draw(c, t) {
  const gT = 950, gB = 1420, s = .9, catchT = 3.8, done = t > catchT;
  TITLE(c, 'CHASE TWO RABBITS, CATCH NONE.', 470, done ? GOLD : '#f2f2f2');
  floor(c, gT); floor(c, gB);
  LBL(c, 'TWO RABBITS', 540, 590); LBL(c, 'ONE RABBIT', 540, 1060, done ? GOLD : '#e8e8e8');
  // top: left, right, left... both gone
  const r1 = 540 - 120 - 260 * t, r2 = 540 + 120 + 260 * t;
  if (r1 > -60) rabbit(c, r1, gT, -1, t * 9); if (r2 < 1140) rabbit(c, r2, gT, 1, t * 9 + 1);
  const dir = Math.sin(t * 3.2) > 0 ? 1 : -1, hx = 540 + Math.sin(t * 3.2) * 110;
  if (t < 4.6) fig(c, { x: hx, y: hipOn(gT, s), s, f: dir, color: '#bdbdbd', pose: E.run(t * 16) }); else fig(c, { x: hx, y: gT - 60, s, color: '#9a9a9a', pose: { ...E.pose('sit'), hd: .6 } });
  // bottom: one rabbit, all the way, caught
  const rb = Math.min(820, 640 + 200 * t), hb = Math.min(780, 300 + 140 * t);
  if (!done) rabbit(c, rb, gB, 1, t * 9);
  if (done) { halo(c, 760, gB - 200, E.p(t, catchT, catchT + .4), true); E.rays(c, 760, gB - 200, 420, .25 * E.p(t, catchT, catchT + .4), GOLD, 14, t * .2); }
  fig(c, { x: done ? 760 : hb, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('cheer'), aF: 2.8, eF: .2 } : E.run(t * 16) });
  if (done) rabbit(c, 790, gB - 250 - 8 * Math.sin(t * 4), 1, 0, GOLD);
  E.particles(c, 780, gB - 220, t - catchT, { n: 50, speed: 460, grav: 260 });
} },
// 3 — Motivation is a match. Discipline is a fire you feed.
{ dur: 7, draw(c, t) {
  const GY = 1330, s = 1.0, done = t > 5.0;
  TITLE(c, 'MOTIVATION IS A MATCH.', 450);
  TITLE(c, 'DISCIPLINE IS A FIRE YOU FEED.', 505, GOLD, E.p(t, 2.8, 3.2));
  floor(c, GY); LBL(c, 'MOTIVATION', 270, 620); LBL(c, 'DISCIPLINE', 800, 620, done ? GOLD : '#e8e8e8');
  const flame = (x, y, k) => { if (k <= .02) return; E.glowDot(c, x, y - 60 * k, 300 * k, 'rgba(255,170,60,.55)'); [['#f08a24', 64, 180], [GOLD, 42, 130], ['#fff3c4', 20, 70]].forEach(([col, w, h], i) => { const ww = w * k * (1 + .08 * Math.sin(t * 13 + i)), hh = h * k * (1 + .1 * Math.sin(t * 9 + i)); c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(x, y - hh); c.quadraticCurveTo(x + ww, y - hh * .3, x, y); c.quadraticCurveTo(x - ww, y - hh * .3, x, y - hh); c.fill(); c.restore(); }); };
  // left: one big bright match, then darkness
  const m = t < .5 ? E.p(t, .2, .5) * 1.4 : Math.max(0, 1.4 - (t - .5) * .9);
  E.line(c, 330, GY - 40, 330, GY - 260, '#c8a46a', 8); c.save(); c.fillStyle = m > .05 ? '#c94a2a' : '#2a2a2a'; c.beginPath(); c.arc(330, GY - 268, 12, 0, 7); c.fill(); c.restore(); flame(330, GY - 270, m);
  if (m <= 0 && t > 1) for (let i = 0; i < 5; i++) { const q = ((t - 2) * .5 + i / 5) % 1; c.save(); c.globalAlpha = .3 * (1 - q); c.fillStyle = '#8a8a8a'; c.beginPath(); c.arc(330 + Math.sin(q * 6) * 14, GY - 280 - q * 160, 10 + q * 16, 0, 7); c.fill(); c.restore(); }
  fig(c, { x: 200, y: m > .3 ? hipOn(GY, s) : GY - 60, s, color: m > .3 ? '#ffffff' : '#8a8a8a', pose: m > .3 ? { ...E.pose('cheer'), aF: 2.4 } : { ...E.pose('sit'), hd: .6, aF: .9, eF: 1.9 } });
  // right: a small fire and a log every night
  const logs = Math.min(8, Math.floor(t / .6)), fire = .25 + .1 * logs;
  for (let i = 0; i < logs; i++) E.shaded(c, 720 + (i % 3) * 30 - 20, GY - 18 - Math.floor(i / 3) * 14, 90, 14, 6, '#8a6a44', '#4a3018');
  flame(800, GY - 30, fire);
  const thr = (t % .6) / .6 < .4 && t < 4.8;
  fig(c, { x: 640, y: hipOn(GY, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 5.0) : thr ? { ...E.pose('crouch'), aF: 1.8, eF: .2 } : E.pose('stand') });
  TAG(c, `DAY ${Math.max(1, logs * 45)}`, 800, 720, 1, -1, done ? GOLD : '#e8e8e8');
} },
// 4 — You suffer more in imagination than in reality
{ dur: 7.5, draw(c, t) {
  const GY = 1330, s = 1.15, go = 3.6, done = t > 6.0;
  TITLE(c, 'YOU SUFFER MORE IN IMAGINATION', 450);
  TITLE(c, 'THAN IN REALITY.', 505, done ? GOLD : '#f2f2f2');
  floor(c, GY);
  E.glowDot(c, 960, GY - 200, 340, 'rgba(245,197,66,.4)', .5 + .5 * E.p(t, go, 6)); E.rrect(c, 920, GY - 300, 80, 300, 6, '#ffe7a8', GOLD, 4);
  // the imagined obstacles: dashed outlines, then dust
  const IM = [[520, 'WHAT IF I FAIL?', 'wall', .5], [680, 'WHAT IF THEY LAUGH?', 'pit', 1.2], [820, 'WHAT IF IT\'S TOO LATE?', 'monster', 1.9]];
  const x = t < go ? 200 + 40 * Math.sin(t * 2) * 0 : E.lerp(200, 900, E.p(t, go, 6.0, 'lin'));
  IM.forEach(([ox, w, kind, t0], i) => { const a = E.p(t, t0, t0 + .4) * (x < ox - 40 ? 1 : 1 - E.p(x, ox - 40, ox + 10)); if (a <= 0) { if (x >= ox - 40) E.particles(c, ox, GY - 140, t - (go + (ox - 40 - 200) / 700 * 2.4), { n: 30, speed: 300, color: '#9a9a9a', grav: 200, life: .7, seed: i }); return; }
    c.save(); c.globalAlpha = a; c.setLineDash([12, 10]); c.strokeStyle = '#bdbdbd'; c.lineWidth = 4;
    if (kind === 'wall') c.strokeRect(ox - 40, GY - 320, 80, 320);
    else if (kind === 'pit') { c.beginPath(); c.moveTo(ox - 70, GY); c.lineTo(ox - 50, GY + 160); c.lineTo(ox + 50, GY + 160); c.lineTo(ox + 70, GY); c.stroke(); }
    else { c.beginPath(); c.ellipse(ox, GY - 260, 110, 150, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(ox - 60, GY - 390); c.lineTo(ox - 90, GY - 470); c.moveTo(ox + 60, GY - 390); c.lineTo(ox + 90, GY - 470); c.stroke(); }
    c.restore(); TAG(c, w, ox, kind === 'monster' ? GY - 470 : (kind === 'pit' ? GY + 210 : GY - 360), t, t0, '#bbb', a); });
  // the thought bubble above his head
  const hy = hipOn(GY, s); if (t > .3 && t < go) { c.save(); c.globalAlpha = E.p(t, .3, .6); c.strokeStyle = '#9a9a9a'; c.lineWidth = 3; [[x + 30, hy - 230, 10], [x + 50, hy - 270, 16]].forEach(([bx, by, r]) => { c.beginPath(); c.arc(bx, by, r, 0, 7); c.stroke(); }); c.restore(); }
  halo(c, x, hy - 80, 1, done);
  fig(c, { x, y: hy + (t < go ? Math.sin(t * 30) * 2 : 0), s, color: done ? GOLD : '#fff', pose: done ? win(t, 6.0) : t < go ? { ...E.pose('stand'), aF: .9, eF: 1.9, aB: .9, eB: 1.9, hd: .2 } : E.walk(t * 8) });
  E.text(c, 'MOST OF IT NEVER HAPPENS.', 540, 1460, { size: 28, weight: 700, ls: 3, color: GOLD, alpha: E.p(t, 6.0, 6.4) });
} },
] };
