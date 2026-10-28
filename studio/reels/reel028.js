// Reel 028 — "Same year, different you" (story format + ref #15 devices: words as objects, two-line counters, light as reward, excuse bubbles, diagram finale)
const LB = (c, str, x, y, o = {}) => E.text(c, str, x, y, { size: 32, weight: 600, ls: 4, color: '#e8e8e8', ...o });
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
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
const GUARD = { ...E.pose('stand'), tor: .12, aF: 1.0, eF: 2.2, aB: .8, eB: 2.4, lF: .25, lB: -.25 };
const PUNCH = { ...GUARD, tor: .25, aF: 1.57, eF: .05 };

const REEL = { title: 'Same year, different you', bpm: 120, scenes: [
// 1 — The same weight: once in a while vs every day
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, done = t > 6.7;
  const load = (o) => { const sx = o.x + Math.sin(o.pose.tor) * 70 * o.s * (o.f ?? 1), sy = o.y - Math.cos(o.pose.tor) * 70 * o.s;
    c.save(); c.translate(sx - 58 * (o.f ?? 1), sy + 10); c.rotate((o.rot || 0) + o.pose.tor * .6 * (o.f ?? 1)); E.shaded(c, -55, -48, 110, 96, 8, '#9a8a70', '#4e4436'); E.tag(c, 'THE WORK', 0, 0, 1, -1, { size: 15, color: '#e8e8e8', fill: '#1a1612' }); c.restore(); };
  LB(c, 'ONCE IN A WHILE', 540, 540); LB(c, 'EVERY DAY', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: carries it once, collapses, tries again weeks later, collapses sooner
  const s = .8; let tx, tp, rot = 0, ty = hipOn(gT, s);
  const walkH = ph => ({ ...E.walk(ph, .3), tor: .55, hd: .2 });
  const fallen = k => ({ x: 0, rot: 1.1 * k, dy: 60 * k });
  if (t < 2.4) { tx = E.lerp(150, 420, t / 2.4); tp = walkH(t * 6); }
  else if (t < 4.6) { const k = E.p(t, 2.4, 2.8, 'in'); tx = 420; tp = { ...E.pose('crouch'), tor: .9 }; rot = fallen(k).rot; ty += fallen(k).dy; }
  else if (t < 5.0) { const k = 1 - E.p(t, 4.6, 5.0); tx = 420; tp = walkH(0); rot = 1.1 * k; ty += 60 * k; }
  else if (t < 6.0) { tx = E.lerp(420, 520, (t - 5) / 1); tp = walkH(t * 6); }
  else { const k = E.p(t, 6.0, 6.4, 'in'); tx = 520; tp = { ...E.pose('crouch'), tor: .9 }; rot = 1.1 * k; ty += 60 * k; }
  const to = { x: tx, y: ty, s, rot, color: '#bdbdbd', pose: tp }; load(to); fig(c, to);
  SAY(c, 'TOO HEAVY.', 560, 680, E.p(t, 2.9, 3.2, 'back') * (1 - E.p(t, 4.5, 4.7)));
  SAY(c, 'STILL HEAVY.', 640, 680, E.p(t, 6.6, 6.9, 'back'));
  // bottom: carries the same load every day and grows into it
  const g = E.p(t, .2, 6.6, 'lin'), bs = E.lerp(.7, .98, g);
  const bo = { x: done ? 860 : E.lerp(120, 860, g), y: hipOn(gB, bs), s: bs, lw: E.lerp(12, 20, g), color: done ? GOLD : '#fff', pose: done ? win(t, 6.8) : { ...E.walk(t * 7, .35 + .1 * g), tor: E.lerp(.55, .08, g), hd: E.lerp(.2, -.05, g) } };
  if (done) E.glowDot(c, 860, bo.y - 60, 340, 'rgba(245,197,66,.3)', E.p(t, 6.8, 7.2));
  load(bo); fig(c, bo);
  CNT(c, 50, 1110, 'DAY', 1 + Math.round(99 * g), 'SAME WEIGHT', done ? GOLD : '#e8e8e8');
  E.tag(c, "IT DIDN'T GET LIGHTER. YOU GOT STRONGER.", 470, 1200, t, 7.0, { size: 19, color: GOLD, fill: '#2a2208' });
  E.particles(c, 860, bo.y - 80, t - 6.8, { n: 45, speed: 480, grav: 300 });
} },
// 2 — Fighting everyone vs fighting yourself
{ dur: 7.6, draw(c, t) {
  const gT = 950, gB = 1480, s = .82, ko = 5.6, done = t > ko;
  const ropes = gy => { E.line(c, 110, gy, 110, gy - 190, '#6a6a6a', 8); E.line(c, 970, gy, 970, gy - 190, '#6a6a6a', 8); [70, 130, 180].forEach(h => E.line(c, 110, gy - h, 970, gy - h, '#4a4a4a', 3)); };
  LB(c, 'FIGHTING EVERYONE', 540, 540); LB(c, 'FIGHTING YOURSELF', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); ropes(gT); ropes(gB);
  // top: shadows keep coming from every side, he burns out
  const tired = E.p(t, 0, 5.4);
  for (let i = 0; i < 6; i++) {
    const t0 = .2 + i * .85, side = i % 2 ? 1 : -1, a = E.p(t, t0, t0 + .2) * (1 - E.p(t, t0 + .7, t0 + .85)); if (a <= 0) continue;
    fig(c, { x: 540 + side * 150, y: hipOn(gT, s), s, f: -side, color: '#4a4a4a', alpha: a, pose: GUARD });
    E.tag(c, 'THEM', 540 + side * 150, gT - 260, 1, -1, { size: 16, color: '#888', alpha: a });
  }
  const cyc = Math.floor((t - .2) / .85), facing = cyc % 2 ? 1 : -1, jab = Math.max(0, Math.sin(((t - .2) % .85) / .85 * Math.PI * 2));
  const tpose = t > 5.4 ? { ...E.pose('crouch'), tor: .9, hd: .5 } : { ...E.mix(GUARD, PUNCH, jab * (1 - .5 * tired)), tor: .12 + .4 * tired };
  fig(c, { x: 540, y: t > 5.4 ? hipOn(gT, s) + 40 : hipOn(gT, s), s, f: t > 5.4 ? 1 : facing, color: '#bdbdbd', pose: tpose });
  SAY(c, 'EXHAUSTED.', 380, 680, E.p(t, 5.6, 5.9, 'back'));
  // bottom: one opponent, yesterday's you, and he outgrows him
  const ex = Math.floor(t / .8), ph = (t % .8) / .8, mine = ex % 2 === 1 || t > 3.2, hit = Math.max(0, Math.sin(ph * Math.PI));
  const lead = E.p(t, 0, ko);
  let mx = 450 - (!mine && !done ? hit * 14 : 0), yx = 630 + (mine && !done ? hit * 14 * (.5 + lead) : 0);
  const kf = E.p(t, ko, ko + .5, 'in');
  if (kf < 1) { fig(c, { x: yx + kf * 60, y: hipOn(gB, s) + kf * 80, s, f: -1, rot: kf * 1.3, alpha: 1 - kf, color: '#6a6a6a', pose: !mine && !done ? E.mix(GUARD, PUNCH, hit) : GUARD });
    E.tag(c, "YESTERDAY'S YOU", 660, gB - 270, 1, -1, { size: 17, color: '#999', alpha: 1 - kf }); }
  if (done) { E.glowDot(c, 450, hipOn(gB, s) - 60, 340, 'rgba(245,197,66,.35)', E.p(t, ko, ko + .5)); E.particles(c, 690, gB - 60, t - ko - .3, { n: 30, speed: 260, color: '#777', grav: 500, life: .7 }); }
  fig(c, { x: mx, y: hipOn(gB, s), s: s * E.lerp(1, 1.1, lead), color: done ? GOLD : '#fff', pose: done ? win(t, ko + .3) : mine ? E.mix(GUARD, PUNCH, hit) : GUARD });
  CNT(c, 50, 1110, 'ROUND', Math.min(12, 1 + Math.floor(t / .5)), 'VS YESTERDAY', done ? GOLD : '#e8e8e8');
  E.particles(c, 450, hipOn(gB, s) - 80, t - ko - .3, { n: 45, speed: 480, grav: 300 });
} },
// 3 — Tries 3 keys vs tries 100
{ dur: 9, draw(c, t) {
  const gT = 950, gB = 1480, s = .82, open = 6.4, done = t > open;
  const vault = (gy, k) => {
    E.shaded(c, 600, gy - 300, 300, 300, 6, '#3a3a3e', '#1e1e20');
    const cx = 750, cy = gy - 150;
    if (k > 0) { E.glowDot(c, cx, cy, 360, 'rgba(255,214,120,.6)', k); c.save(); c.globalAlpha = k; c.fillStyle = '#ffe7a8'; c.beginPath(); c.arc(cx, cy, 112, 0, 7); c.fill(); c.restore(); E.rays(c, cx, cy, 460, .3 * k, GOLD, 16, t * .15); }
    c.save(); c.translate(cx + 112 * k * .9, cy); c.scale(1 - .85 * k, 1);
    const g = c.createRadialGradient(-30, -30, 10, 0, 0, 120); g.addColorStop(0, '#9a9a9a'); g.addColorStop(1, '#3a3a3a'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 112, 0, 7); c.fill(); c.strokeStyle = '#777'; c.lineWidth = 5; c.stroke();
    c.strokeStyle = '#bbb'; c.lineWidth = 6; for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + t * .2 * (1 - k); c.beginPath(); c.moveTo(Math.cos(a) * 46, Math.sin(a) * 46); c.lineTo(-Math.cos(a) * 46, -Math.sin(a) * 46); c.stroke(); }
    c.fillStyle = '#111'; c.beginPath(); c.arc(-70, 0, 9, 0, 7); c.fill(); c.restore();
  };
  const key = (o, fail) => { const [hx, hy] = E.hand(o); E.line(c, hx, hy, hx + 30, hy, fail ? '#c46a6a' : '#cfcfcf', 6); c.save(); c.strokeStyle = fail ? '#c46a6a' : '#cfcfcf'; c.lineWidth = 5; c.beginPath(); c.arc(hx - 8, hy, 9, 0, 7); c.stroke(); c.restore(); };
  LB(c, 'TRIES 3 KEYS', 540, 540); LB(c, 'TRIES 100', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  vault(gT, 0); vault(gB, E.p(t, open, open + .8, 'out'));
  // top: three tries, then gone
  const TT = [.6, 1.4, 2.2];
  let tx = 590, tf = 1, tp = E.pose('stand'), ty = hipOn(gT, s);
  TT.forEach(t0 => { if (t > t0 && t < t0 + .6) tp = { ...E.pose('stand'), aF: 1.5, eF: .1 }; });
  if (t > 3.2) { const k = E.p(t, 3.2, 4.4, 'lin'); tx = E.lerp(590, 220, k); tf = -1; tp = k < 1 ? E.walk(t * 9) : { ...E.pose('sit'), hd: .4 }; if (k >= 1) ty = gT - 54; }
  const to = { x: tx, y: ty, s, f: tf, color: '#bdbdbd', pose: tp }; fig(c, to);
  if (t < 3.2 && TT.some(t0 => t > t0 && t < t0 + .6)) key(to, TT.some(t0 => t > t0 + .3 && t < t0 + .6));
  SAY(c, "IT'S LOCKED.", 420, 680, E.p(t, 2.9, 3.2, 'back'));
  CNT(c, 50, 590, 'KEY', Math.min(3, TT.filter(t0 => t > t0).length), 'THEN QUIT');
  // bottom: key after key after key, until one turns
  const n = done ? 100 : Math.max(1, Math.round(100 * E.p(t, .3, open, 'in')));
  const tryOn = !done && Math.sin(t * 16) > -.2;
  const bo = { x: 590, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, open + .3) : tryOn ? { ...E.pose('stand'), aF: 1.5, eF: .1 } : E.pose('stand') };
  fig(c, bo); if (tryOn) key(bo, Math.sin(t * 16) > .7);
  CNT(c, 50, 1110, 'KEY', n, n < 100 ? 'NOT THIS ONE' : 'THIS ONE', done ? GOLD : '#e8e8e8');
  E.particles(c, 750, gB - 150, t - open, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
// 4 — One year around the ring: same year, different you
{ dur: 10, draw(c, t) {
  const CX = 540, CY = 1060, R = 290, yr = E.p(t, .3, 7.3, 'lin'), done = t > 7.3, th = -Math.PI / 2 + Math.PI * 2 * yr;
  LB(c, 'ONE YEAR FROM NOW', 540, 420, { size: 34, ls: 5, color: done ? GOLD : '#e8e8e8' });
  c.save(); c.lineCap = 'round'; c.strokeStyle = '#3a3a3e'; c.lineWidth = 6; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.stroke();
  c.strokeStyle = GOLD; c.lineWidth = 10; c.beginPath(); c.arc(CX, CY, R, -Math.PI / 2, th); c.stroke(); c.restore();
  if (done) E.glowDot(c, CX, CY, R + 160, 'rgba(245,197,66,.22)', E.p(t, 7.3, 7.9) * (.8 + .2 * Math.sin(t * 3)));
  'JFMAMJJASOND'.split('').forEach((m, i) => {
    const a = -Math.PI / 2 + Math.PI * 2 * (i + .5) / 12, on = yr * 12 > i + .5;
    E.line(c, CX + Math.cos(a) * (R - 14), CY + Math.sin(a) * (R - 14), CX + Math.cos(a) * (R - 30), CY + Math.sin(a) * (R - 30), on ? GOLD : '#4a4a4a', 4);
    E.text(c, m, CX + Math.cos(a) * (R - 58), CY + Math.sin(a) * (R - 58), { size: 20, weight: 800, family: MONO, color: on ? GOLD : '#5a5a5a' });
  });
  // the one who waits: center of the year, same spot, same chair
  E.line(c, CX - 40, CY + 70, CX + 30, CY + 70, '#555', 6); E.line(c, CX - 36, CY + 70, CX - 36, CY + 120, '#555', 5); E.line(c, CX + 26, CY + 70, CX + 26, CY + 120, '#555', 5);
  fig(c, { x: CX - 6, y: CY + 70 - 8, s: .55, color: '#8a8a8a', pose: { ...E.pose('sit'), hd: done ? -.5 : .3 } });
  SAY(c, 'NEXT YEAR.', CX + 20, CY - 70, E.p(t, 1.0, 1.3, 'back') * (1 - E.p(t, 5.0, 5.2)));
  SAY(c, 'NEXT YEAR.', CX + 20, CY - 70, E.p(t, 7.9, 8.2, 'back'));
  // the one who walks it, every month, getting stronger
  const s = E.lerp(.5, .78, yr), hx = CX + Math.cos(th) * (R + 4 + E.FIG_H * s), hy = CY + Math.sin(th) * (R + 4 + E.FIG_H * s);
  if (done) E.rays(c, CX, CY - R - 90, 420, .28 * E.p(t, 7.3, 7.8), GOLD, 16, t * .15);
  fig(c, { x: hx, y: hy, s, lw: E.lerp(13, 19, yr), rot: th + Math.PI / 2, color: done ? GOLD : '#fff', pose: done ? win(t, 7.3) : E.walk(t * 8) });
  CNT(c, 70, 520, 'MONTH', Math.min(12, Math.floor(yr * 12) + 1), done ? 'A NEW YOU' : 'OF 12', done ? GOLD : '#e8e8e8');
  E.text(c, 'SAME YEAR. DIFFERENT YOU.', 540, 1440, { size: 30, weight: 700, ls: 4, color: GOLD, alpha: E.p(t, 7.7, 8.2) });
  E.particles(c, CX, CY - R - 90, t - 7.3, { n: 70, speed: 560, grav: 260, life: 1.8 });
} },
] };
