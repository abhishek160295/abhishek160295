// Reel 043 — "60 days left in 2026" (≤25s, Shorts-first: timely hook at frame 0, emotional payoff, likeable)
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
const rain = (c, t, y0, y1, a, n = 90) => { if (a <= 0) return; c.save(); c.strokeStyle = `rgba(190,205,220,${.45 * a})`; c.lineWidth = 3; for (let i = 0; i < n; i++) { const x = E.rnd(i) * 1200 - 60, q = (t * 2.4 + E.rnd(i + 5)) % 1, y = E.lerp(y0, y1, q); c.beginPath(); c.moveTo(x + q * 40, y); c.lineTo(x + q * 40 - 12, y + 34); c.stroke(); } c.restore(); };

const REEL = { title: '60 days left in 2026', bpm: 120, scenes: [
// 1 — 60 days left: wait for January vs start today
{ dur: 6, draw(c, t) {
  const s = .8, run = E.p(t, .2, 4.4, 'lin'), d = Math.floor(run * 60), done = t > 4.6;
  const MON = d < 29 ? `NOV ${2 + d}` : `DEC ${d - 28}`;
  E.text(c, '60 DAYS LEFT IN 2026.', 540, 470, { size: 40, weight: 800, ls: 4, color: done ? GOLD : '#ffffff' });
  PANEL(c, ...P1, 'WAITS FOR JANUARY'); PANEL(c, ...P2, 'STARTS TODAY', done);
  const grid = (y0, col) => { for (let i = 0; i < 60; i++) { const r = Math.floor(i / 12), q = i % 12, x = 520 + q * 36, y = y0 + r * 36, on = i < d; E.rrect(c, x, y, 30, 30, 5, on ? col : '#1c1c20', on ? col : '#3a3a40', 2); if (on && col !== GOLD) { E.line(c, x + 8, y + 8, x + 22, y + 22, '#111', 3); E.line(c, x + 22, y + 8, x + 8, y + 22, '#111', 3); } } };
  // top: couch, phone, "new year new me"
  grid(P1[0] + 90, '#5a5a5e');
  E.shaded(c, 160, gT - 70, 220, 50, 10, '#5a5a6a', '#2a2a34'); E.shaded(c, 150, gT - 120, 30, 100, 8, '#5a5a6a', '#2a2a34');
  fig(c, { x: 260, y: gT - 76, s, color: '#9a9a9a', pose: { ...E.pose('sit'), hd: .4, aF: .7, eF: 1.9 } });
  SAY(c, 'NEW YEAR, NEW ME.', 330, 690, E.p(t, .5, .8, 'back'));
  if (done) E.tag(c, 'JAN 1: SAME YOU', 850, 880, t, 4.6, { size: 18, color: RED, fill: '#1e0a0a' });
  CNT(c, 520, 836, 'DAYS LEFT', 60 - d, MON, '#e8e8e8', RED);
  // bottom: every day a gold square
  grid(P2[0] + 90, GOLD);
  const jj = Math.abs(Math.sin(t * 7));
  if (done) E.glowDot(c, 300, gB - 120, 320, 'rgba(245,197,66,.4)', E.p(t, 4.6, 5.0));
  fig(c, { x: 300, y: hipOn(gB, s * (1 + .1 * run)) - jj * 30 * (done ? 0 : 1), s: s * (1 + .1 * run), lw: 15 + 4 * run, color: done ? GOLD : '#fff', pose: done ? win(t, 4.6) : { ...E.pose('stand'), aF: E.lerp(.3, 2.8, jj), aB: -E.lerp(.3, 2.8, jj), lF: .35 * jj, lB: -.35 * jj } });
  if (done) E.tag(c, 'JAN 1: NEW YOU', 850, 1340, t, 4.6, { size: 18, color: GOLD, fill: '#2a2208' });
  CNT(c, 520, 1296, 'DAYS LEFT', 60 - d, done ? '60 DAYS USED' : MON, done ? GOLD : '#e8e8e8');
} },
// 2 — Bloom where they said you couldn't
{ dur: 5.5, draw(c, t) {
  const GY = 1300, crack = 1.8, bloom = 4.0, done = t > bloom;
  PRIN(c, "BLOOM WHERE THEY SAID YOU COULDN'T.", 470, done ? GOLD : '#e8e8e8');
  // concrete slab
  E.shaded(c, -100, GY, 1300, 160, 0, '#6a6a6e', '#2a2a2e'); for (let i = 0; i < 70; i++) { c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(E.rnd(i) * 1080, GY + 10 + E.rnd(i + 3) * 140, 4, 4); }
  E.line(c, -100, GY, 1180, GY, '#9a9a9a', 3);
  E.tag(c, 'THEIR DOUBT', 760, GY + 70, 1, -1, { size: 18, color: '#ddd', fill: '#1c1c20' });
  // people walking over it, not noticing... then stopping to look
  for (let i = 0; i < 10; i++) { const sp = 160 + 80 * E.rnd(i), x = ((i * 150 + sp * t) % 1300) - 120, stop = done && Math.abs(x - 540) < 320, sc = .5 + .1 * (i % 2);
    const xx = stop ? x - (t - bloom) * 0 : x; fig(c, { x: done ? Math.min(xx, 380 + i * 30) + (xx > 540 ? 260 : 0) : xx, y: hipOn(GY, sc), s: sc, f: done && xx > 540 ? -1 : 1, color: '#7a7a7a', pose: done ? { ...E.pose('point'), aF: 1.8, hd: .3 } : E.walk(t * 9 + i) }); }
  // crack, sprout, flower
  if (t > crack) { const k = E.p(t, crack, crack + .8); c.save(); c.strokeStyle = '#111'; c.lineWidth = 6; c.beginPath(); c.moveTo(540, GY); c.lineTo(520, GY + 40 * k); c.lineTo(556, GY + 80 * k); c.lineTo(530, GY + 140 * k); c.moveTo(540, GY); c.lineTo(580 * 1, GY + 30 * k); c.stroke(); c.restore(); E.particles(c, 540, GY, t - crack, { n: 20, speed: 200, color: '#8a8a8a', grav: 500, life: .6 }); E.shake(c, t, crack, .2, 6); }
  const g = E.p(t, crack + .6, bloom, 'out');
  if (g > 0) { c.save(); c.strokeStyle = '#6a9a5a'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(540, GY); c.quadraticCurveTo(530, GY - 120 * g, 545, GY - 240 * g); c.stroke(); c.fillStyle = '#6a9a5a'; c.beginPath(); c.ellipse(520, GY - 100 * g, 30 * g, 12 * g, -.5, 0, 7); c.fill(); c.beginPath(); c.ellipse(565, GY - 150 * g, 30 * g, 12 * g, .5, 0, 7); c.fill(); c.restore(); }
  if (done) { const k = E.p(t, bloom, bloom + .5, 'back'), fy = GY - 250; E.glowDot(c, 545, fy, 380, 'rgba(245,197,66,.45)', E.p(t, bloom, bloom + .5)); E.rays(c, 545, fy, 420, .28 * E.p(t, bloom, bloom + .5), GOLD, 16, t * .2);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * .3; c.save(); c.fillStyle = GOLD; c.beginPath(); c.ellipse(545 + Math.cos(a) * 34 * k, fy + Math.sin(a) * 34 * k, 26 * k, 14 * k, a, 0, 7); c.fill(); c.restore(); } c.save(); c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(545, fy, 16 * k, 0, 7); c.fill(); c.restore(); }
  CNT(c, 70, 560, 'PEOPLE WHO DOUBTED', 10, done ? 'NOW THEY STOP AND LOOK' : 'WALKING OVER IT', done ? GOLD : '#e8e8e8');
} },
// 3 — Be the light. The right ones will find you.
{ dur: 6, draw(c, t) {
  const WL = 1240, LX = 840;
  PRIN(c, 'BE THE LIGHT.', 450);
  PRIN(c, 'THE RIGHT ONES WILL FIND YOU.', 505, GOLD, E.p(t, 3.0, 3.4));
  // stormy sea
  const surf = x => WL + 14 * Math.sin(x * .02 + t * 3) + 8 * Math.sin(x * .05 - t * 4);
  c.save(); const g = c.createLinearGradient(0, WL - 60, 0, 1600); g.addColorStop(0, '#24384a'); g.addColorStop(1, '#060a0e'); c.fillStyle = g; c.beginPath(); c.moveTo(-100, 1700); for (let x = -100; x <= 1180; x += 12) c.lineTo(x, surf(x)); c.lineTo(1180, 1700); c.fill();
  c.strokeStyle = '#a8c0d0'; c.lineWidth = 3; c.beginPath(); for (let x = -100; x <= 1180; x += 12) x === -100 ? c.moveTo(x, surf(x)) : c.lineTo(x, surf(x)); c.stroke(); c.restore();
  rain(c, t, 560, WL, 1 - E.p(t, 4.2, 5.4));
  // lighthouse and its sweeping beam
  c.save(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(LX - 120, WL + 30); c.quadraticCurveTo(LX, WL - 80, LX + 140, WL + 30); c.fill(); c.restore();
  c.save(); c.fillStyle = '#d8d8d8'; c.beginPath(); c.moveTo(LX - 40, WL - 40); c.lineTo(LX - 24, WL - 340); c.lineTo(LX + 24, WL - 340); c.lineTo(LX + 40, WL - 40); c.fill(); c.fillStyle = RED; c.fillRect(LX - 34, WL - 200, 68, 30); c.fillRect(LX - 30, WL - 290, 60, 26); c.restore();
  const ang = Math.PI + Math.sin(t * 1.3) * .55, bl = 900;
  c.save(); c.globalAlpha = .45; const bg = c.createLinearGradient(LX, WL - 370, LX + Math.cos(ang) * bl, WL - 370 + Math.sin(ang) * bl); bg.addColorStop(0, 'rgba(255,230,160,.9)'); bg.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = bg;
  c.beginPath(); c.moveTo(LX, WL - 370); c.lineTo(LX + Math.cos(ang - .12) * bl, WL - 370 + Math.sin(ang - .12) * bl); c.lineTo(LX + Math.cos(ang + .12) * bl, WL - 370 + Math.sin(ang + .12) * bl); c.fill(); c.restore();
  E.glowDot(c, LX, WL - 370, 140, 'rgba(255,230,160,.9)'); E.rrect(c, LX - 26, WL - 390, 52, 40, 6, '#fff3c4', GOLD, 3);
  // lost boats find the light
  [[160, .3], [330, 1.2], [80, 2.0]].forEach(([x0, t0], i) => {
    const k = E.p(t, t0 + 1.0, t0 + 3.6, 'inOut'), x = E.lerp(x0, LX - 150 - i * 70, k), safe = k >= 1, y = surf(x), tilt = safe ? 0 : Math.sin(t * 3 + i) * .25 * (1 - k);
    c.save(); c.translate(x, y); c.rotate(tilt); E.shaded(c, -46, -10, 92, 22, 8, safe ? '#f7d36a' : '#8a7a66', safe ? '#a07a1a' : '#3a3026'); E.line(c, 4, -10, 4, -100, '#bbb', 4); c.fillStyle = safe ? GOLD : '#cfcfcf'; c.beginPath(); c.moveTo(8, -96); c.lineTo(48, -26); c.lineTo(8, -26); c.fill(); c.restore();
  });
  CNT(c, 70, 560, 'BOATS FOUND', [1.2 + 3.6, 2.1 + 3.6, 2.9 + 3.6].filter(x => t > x - 1.6).length, 'JUST BY SHINING', t > 4.5 ? GOLD : '#e8e8e8');
} },
// 4 — Plant trees whose shade you'll never sit in
{ dur: 7.5, draw(c, t) {
  const GY = 1330, TX = 560, grow = E.p(t, 1.8, 5.2, 'inOut'), gone = E.p(t, 4.0, 4.8), kids = t > 5.2, done = t > 5.6;
  if (t < 5.8) PRIN(c, "PLANT TREES WHOSE SHADE YOU'LL NEVER SIT IN.", 470);
  else E.title(c, 'SOMEONE WILL SIT IN YOUR SHADE.', 540, 470, t, 5.8, 1e9, { size: 32, weight: 800, ls: 3, family: 'Inter', color: GOLD });
  // time-lapse sky: days and nights flicker past while the tree grows
  if (t > 1.8 && t < 5.2) { const fl = .5 + .5 * Math.sin(t * 22); c.save(); c.fillStyle = `rgba(80,90,110,${.18 * fl})`; c.fillRect(-100, 540, 1300, GY - 540); c.restore(); }
  E.shaded(c, -100, GY, 1300, 140, 0, '#2e2a26', '#100e0c'); E.line(c, -100, GY, 1180, GY, '#6a5a4a', 3);
  // the tree
  const th = 30 + 330 * grow, tw = 14 + 50 * grow;
  if (done) E.glowDot(c, TX, GY - th - 60, 560, 'rgba(245,197,66,.35)', E.p(t, 5.6, 6.2));
  c.save(); const tg = c.createLinearGradient(TX - tw, 0, TX + tw, 0); tg.addColorStop(0, '#4a3a2a'); tg.addColorStop(1, '#8a6a4a'); c.fillStyle = tg; c.beginPath(); c.moveTo(TX - tw / 2, GY); c.lineTo(TX - tw / 4, GY - th); c.lineTo(TX + tw / 4, GY - th); c.lineTo(TX + tw / 2, GY); c.fill(); c.restore();
  const leaf = [[0, -40, 150], [-140, 10, 110], [140, 0, 115], [-80, -110, 100], [90, -110, 100], [0, -170, 90], [-200, 70, 80], [200, 60, 85]];
  leaf.forEach(([dx, dy, r], i) => { const k = E.clamp(grow * 1.4 - i * .06); if (k <= 0) return; c.save(); c.fillStyle = done ? (i % 2 ? '#e0b040' : '#c9a040') : (i % 2 ? '#4a6a3a' : '#3a5a2e'); c.globalAlpha = .95; c.beginPath(); c.arc(TX + dx * grow + Math.sin(t * 1.5 + i) * 4, GY - th + dy * grow, r * k, 0, 7); c.fill(); c.restore(); });
  // rope swing once it's big
  if (kids) { const sw = Math.sin(t * 3) * .5, px = TX + 150, py = GY - th + 60; E.line(c, px, py, px + Math.sin(sw) * 220, py + Math.cos(sw) * 220, '#c8a46a', 4); fig(c, { x: px + Math.sin(sw) * 220, y: py + Math.cos(sw) * 220 - 10, s: .42, lw: 12, color: GOLD, pose: E.pose('sit') }); }
  // the old man: plants it, sits beside it, then there's only the bench
  E.shaded(c, 260, GY - 60, 150, 14, 4, '#7a6a5a', '#4a3a2a'); E.line(c, 272, GY - 46, 272, GY, '#555', 5); E.line(c, 398, GY - 46, 398, GY, '#555', 5);
  const oldA = 1 - gone;
  if (oldA > 0) { if (t < 1.8) { fig(c, { x: E.lerp(220, 480, E.p(t, 0, 1.0)), y: hipOn(GY, .75) + 10, s: .75, color: '#bdbdbd', alpha: oldA, pose: t < 1.0 ? { ...E.walk(t * 5, .2), tor: .45, hd: .3 } : { ...E.pose('crouch'), aF: 1.6 + .3 * Math.sin(t * 8) } }); }
    else fig(c, { x: 330, y: GY - 60 - 8, s: .75, color: '#bdbdbd', alpha: oldA, pose: { ...E.pose('sit'), tor: .3, hd: -.3 + .1 * Math.sin(t) } }); }
  if (gone > .5) E.tag(c, 'HE PLANTED IT', 335, GY - 110, t, 4.5, { size: 16, color: '#bbb', alpha: Math.min(1, (gone - .5) * 2) });
  if (kids) [[700, 0], [800, 1], [450, 2]].forEach(([x, i]) => fig(c, { x: x + Math.sin(t * 4 + i) * 30, y: hipOn(GY, .42) - Math.abs(Math.sin(t * 7 + i)) * 20, s: .42, lw: 12, f: i % 2 ? -1 : 1, color: done ? GOLD : '#ffe7a8', alpha: E.p(t, 5.2, 5.6), pose: E.run(t * 14 + i) }));
  CNT(c, 70, 560, 'YEARS', Math.round(1 + 59 * E.p(t, 1.8, 5.2, 'lin')), done ? 'STILL GIVING SHADE' : t > 1.8 ? 'GROWING' : 'PLANTING', done ? GOLD : '#e8e8e8');
} },
] };
