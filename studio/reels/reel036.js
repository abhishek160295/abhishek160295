// Reel 036 — "Change the route, not the destination" (≤31s, high motion, comedy + reaction beats)
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
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8', subCol) => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 48, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 76, { size: 17, weight: 800, family: MONO, ls: 2, color: subCol || (col === GOLD ? GOLD : '#8a8a8a'), align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const TEAL = '#5ee0c0';
const THROW = k => ({ ...E.pose('stand'), tor: .15, aF: E.lerp(-1.4, 1.9, k), eF: .1, aB: -.4 });

const REEL = { title: 'Change the route, not the destination', bpm: 120, scenes: [
// 1 — The door says PULL
{ dur: 5.2, draw(c, t) {
  const gT = 950, gB = 1480, s = .9, DX = 560, DW = 100, DH = 230, open = 2.0, done = t > 3.7;
  const door = (gy, k, shake) => {
    E.shaded(c, DX - 40, gy - DH - 40, DW + 80, DH + 40, 4, '#3a3a3e', '#1a1a1c');
    if (k > 0) { E.glowDot(c, DX + DW / 2, gy - DH / 2, 260, 'rgba(255,214,120,.6)', k); c.save(); c.globalAlpha = k; c.fillStyle = '#ffe7a8'; c.fillRect(DX, gy - DH, DW, DH); c.restore(); }
    else { c.fillStyle = '#0c0c0c'; c.fillRect(DX, gy - DH, DW, DH); }
    const w = DW * Math.cos(k * 1.35), sx = shake, lift = 22 * Math.sin(k * 1.35);
    c.save(); const lg = c.createLinearGradient(DX, 0, DX + w, 0); lg.addColorStop(0, '#5a4028'); lg.addColorStop(1, '#8a6a4a'); c.fillStyle = lg;
    c.beginPath(); c.moveTo(DX + sx, gy - DH); c.lineTo(DX + sx + w, gy - DH - lift); c.lineTo(DX + sx + w, gy + lift * .3); c.lineTo(DX + sx, gy); c.closePath(); c.fill();
    c.fillStyle = '#d8d8d8'; c.beginPath(); c.arc(DX + sx + w - 14 * Math.cos(k * 1.35), gy - DH / 2, 6, 0, 7); c.fill(); c.restore();
    if (k < .5) E.tag(c, 'PULL', DX + sx + w / 2, gy - DH + 90, 1, -1, { size: 20, color: '#111', fill: '#e8e8e8' });
  };
  LB(c, 'SAME WAY. HARDER.', 300, 540); LB(c, 'NEW WAY.', 300, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: push, push, PUSH
  const ph = (t % .42) / .42, bump = ph < .3, sh = bump ? Math.sin(ph * 30) * 4 : 0;
  door(gT, 0, sh);
  fig(c, { x: 470 + (bump ? 18 : 0), y: hipOn(gT, s), s, color: '#bdbdbd', pose: { ...E.pose('push'), tor: .6 + (bump ? .15 : 0) } });
  SAY(c, "IT'S BROKEN.", 380, 680, E.p(t, 2.6, 2.9, 'back'));
  CNT(c, 640, 560, 'PUSHES', Math.round(1 + 98 * E.p(t, 0, 5, 'in')), 'DOOR SAYS PULL', '#e8e8e8', RED);
  // bottom: push twice, read the sign, pull
  const k = E.p(t, open, open + .6, 'out');
  const shB = t < .9 && (t % .42) / .42 < .3 ? Math.sin(t * 60) * 4 : 0;
  door(gB, k, shB);
  if (t > 1.1 && t < 2.0) E.glowDot(c, DX + DW / 2, gB - DH + 90, 80, 'rgba(255,255,255,.45)', E.p(t, 1.1, 1.3) * (1 - E.p(t, 1.8, 2.0)));
  let bx = t < .9 ? 470 + ((t % .42) / .42 < .3 ? 18 : 0) : 470, bp = t < .9 ? E.pose('push') : t < open ? { ...E.pose('stand'), hd: -.1, aF: .9, eF: 1.9 } : t < open + .6 ? { ...E.pose('stand'), tor: -.25, aF: 1.4, eF: .3 } : E.walk(t * 9);
  if (t > open + .6) bx = E.lerp(470, 760, E.p(t, open + .6, 3.6, 'lin'));
  if (done) { bp = win(t, 3.7); E.glowDot(c, 760, hipOn(gB, s) - 60, 320, 'rgba(245,197,66,.35)', E.p(t, 3.7, 4.1)); }
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: bp });
  SAY(c, '...OH.', 420, 1220, E.p(t, 1.2, 1.4, 'back') * (1 - E.p(t, 2.2, 2.4)));
  CNT(c, 640, 1090, 'PUSHES', 2, done ? 'THEN PULLED' : 'READ THE SIGN', done ? GOLD : '#e8e8e8');
} },
// 2 — Paper plane: same fold every time vs a new fold every time
{ dur: 6.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, T = [.2, 1.9, 3.6], HX = 860;
  const FL = { dive: [420, 120, 900], stall: [300, 420, 700], glide: [450, 60, 40] };
  const flight = (gy, t0, kind) => { const dt = t - t0; if (dt < .25) return null; const u = dt - .25, [vx, vy, g] = FL[kind], x0 = 220, y0 = gy - 150;
    let x = x0 + vx * u, y = y0 - vy * u + .5 * g * u * u; const dx = vx, dy = -vy + g * u; let crashed = false;
    if (y >= gy - 6) { const tl = (vy + Math.sqrt(vy * vy + 2 * g * (gy - 6 - y0))) / g; x = x0 + vx * tl; y = gy - 6; crashed = true; }
    return { x, y, a: Math.atan2(dy, dx), crashed, u }; };
  const plane = (p, col) => { if (!p) return; if (p.crashed) { c.save(); c.fillStyle = '#cfcfcf'; c.beginPath(); c.arc(p.x, p.y - 8, 12, 0, 7); c.fill(); c.restore(); return; }
    c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(1.6, 1.6); c.fillStyle = col; c.beginPath(); c.moveTo(34, 0); c.lineTo(-26, -16); c.lineTo(-14, 0); c.lineTo(-26, 14); c.closePath(); c.fill(); c.restore(); };
  const hoop = (gy, lit) => { c.save(); c.strokeStyle = lit ? GOLD : '#7a7a7a'; c.lineWidth = 8; c.beginPath(); c.ellipse(HX, gy - 175, 20, 62, 0, 0, 7); c.stroke(); c.restore(); E.line(c, HX, gy - 113, HX, gy, '#5a5a5a', 5); };
  const lit = t > T[2] + .25 + (HX - 220) / 450;
  LB(c, 'SAME FOLD', 540, 540); LB(c, 'NEW FOLD EVERY TIME', 540, 1070, { color: lit ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  hoop(gT, false); hoop(gB, lit);
  if (lit) { E.glowDot(c, HX, gB - 175, 300, 'rgba(245,197,66,.45)', E.p(t, T[2] + 1.7, T[2] + 2.1)); E.rays(c, HX, gB - 175, 360, .25 * E.p(t, T[2] + 1.7, T[2] + 2.1), GOLD, 14, t * .2); }
  const thrower = (gy, col, last) => { let pose = E.pose('stand'); T.forEach(t0 => { if (t > t0 - .2 && t < t0 + .35) pose = THROW(E.p(t, t0 - .2, t0 + .25)); }); if (last) pose = win(t, T[2] + 1.7); fig(c, { x: 170, y: hipOn(gy, s), s, color: col, pose }); };
  // top: the same throw, three times
  T.forEach(t0 => plane(flight(gT, t0, 'dive'), '#cfcfcf'));
  thrower(gT, '#bdbdbd', false);
  E.tag(c, 'FOLD v1', 300, 700, 1, -1, { size: 18, color: '#bbb' });
  SAY(c, 'PLANES ARE STUPID.', 560, 690, E.p(t, 5.0, 5.3, 'back'));
  CNT(c, 50, 590, 'TRIES', T.filter(t0 => t > t0).length, 'SAME RESULT', '#e8e8e8', RED);
  // bottom: adjust after every crash
  plane(flight(gB, T[0], 'dive'), '#e8e8e8'); plane(flight(gB, T[1], 'stall'), '#e8e8e8'); const g = flight(gB, T[2], 'glide'); if (g && g.x < 1150) plane(g, lit ? GOLD : '#e8e8e8');
  thrower(gB, lit ? GOLD : '#fff', lit && t > T[2] + 1.7);
  const v = t < T[1] - .3 ? 'v1' : t < T[2] - .3 ? 'v2' : 'v3';
  E.tag(c, `FOLD ${v}`, 300, 1230, 1, -1, { size: 18, color: v === 'v3' ? GOLD : '#ddd', fill: v === 'v3' ? '#2a2208' : '#0c0c0c' });
  CNT(c, 50, 1110, 'TRIES', T.filter(t0 => t > t0).length, lit ? 'THROUGH THE HOOP' : 'NEW FOLD', lit ? GOLD : '#e8e8e8');
  E.particles(c, HX, gB - 175, t - (T[2] + .25 + (HX - 220) / 450), { n: 50, speed: 460, grav: 260 });
} },
// 3 — Bowling: more power vs better aim
{ dur: 6, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, PX = [770, 800, 830, 860];
  const lane = gy => { E.shaded(c, 90, gy - 10, 860, 18, 3, '#6b4f30', '#3a2a18'); E.line(c, 90, gy + 14, 950, gy + 14, '#2a2a2a', 6); };
  const pin = (x, y, rot = 0, a = 1, col = '#f0f0f0') => { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(1.3, 1.3); c.fillStyle = col; c.beginPath(); c.ellipse(0, -22, 13, 22, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, -54, 8, 11, 0, 0, 7); c.fill(); c.fillStyle = RED; c.fillRect(-8, -44, 16, 4); c.restore(); };
  const ball = (x, y) => { c.save(); const g = c.createRadialGradient(x - 8, y - 10, 3, x, y, 26); g.addColorStop(0, '#6a6a6a'); g.addColorStop(1, '#141414'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); c.restore(); };
  LB(c, 'MORE POWER', 540, 540); LB(c, 'BETTER AIM', 540, 1070, { color: t > 1.7 ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220); lane(gT); lane(gB);
  // top: throws harder each time, gutter each time
  const TT = [.3, 2.6];
  PX.forEach(x => pin(x, gT - 10));
  TT.forEach((t0, i) => { const dt = t - t0; if (dt < .2 || dt > 1.1) return; const u = dt - .2, x = 220 + 1300 * u; const y = x < 420 ? gT - 36 - Math.abs(Math.sin(u * 30)) * 30 : gT + 4; if (x < 1000) ball(x, y); if (x > 420 && x < 470) E.particles(c, 430, gT, u - .15, { n: 10, speed: 200, color: '#8a6a44', grav: 600, life: .4, seed: i }); });
  TT.forEach((t0, i) => { if (t > t0 + .6) E.tag(c, 'GUTTER', 600, gT + 50, t, t0 + .6, { size: 18, color: RED, fill: '#1e0a0a', alpha: 1 - E.p(t, t0 + 1.3, t0 + 1.6) }); });
  let tp = E.pose('stand'); TT.forEach(t0 => { if (t > t0 - .25 && t < t0 + .4) tp = { ...THROW(E.p(t, t0 - .25, t0 + .2)), tor: .5 }; });
  fig(c, { x: 170, y: hipOn(gT, s), s, color: '#bdbdbd', pose: tp });
  SAY(c, 'THROW HARDER.', 420, 690, E.p(t, 4.3, 4.6, 'back'));
  CNT(c, 50, 590, 'PINS', 0, 'MAX POWER', '#e8e8e8', RED);
  // bottom: slower, straight, strike after strike
  const TB = [.4, 3.0], hitT = TB.map(t0 => t0 + .25 + (775 - 220) / 520);
  TB.forEach((t0, i) => { const dt = t - t0; if (dt < .25) return; const x = 220 + 520 * (dt - .25); if (x < 1000 && dt < 2.2) ball(x, gB - 36); });
  const cur = t < hitT[0] ? -1 : t < TB[1] + 1.2 ? 0 : t < hitT[1] ? -1 : 1;
  PX.forEach((x, i) => { if (cur === -1) pin(x, gB - 10); else { const dt = t - hitT[cur]; const vx = 200 + 160 * E.rnd(i + cur * 9), vy = -500 - 300 * E.rnd(i + 5 + cur); pin(x + vx * dt, gB - 10 + vy * dt + 1300 * dt * dt, dt * (6 + i), Math.max(0, 1 - dt / 1.1)); } });
  hitT.forEach((h, i) => { if (t > h && t < h + 1.1) { const k = E.p(t, h, h + .25, 'back'); E.text(c, 'STRIKE', 600, gB - 230, { size: 74 * (.6 + .4 * k), weight: 900, color: GOLD, alpha: Math.min(1, k) * (1 - E.p(t, h + .8, h + 1.1)) }); E.rays(c, 830, gB - 60, 360, .3 * (1 - E.p(t, h, h + 1.1)), GOLD, 14, t * .3); E.shake(c, t, h, .2, 8); } });
  let bp = E.pose('stand'); TB.forEach(t0 => { if (t > t0 - .25 && t < t0 + .4) bp = THROW(E.p(t, t0 - .25, t0 + .2)); }); if (t > hitT[0] && t < TB[1] - .3 || t > hitT[1]) bp = win(t, hitT[0]);
  fig(c, { x: 170, y: hipOn(gB, s), s, color: t > hitT[0] ? GOLD : '#fff', pose: bp });
  CNT(c, 50, 1110, 'PINS', (t > hitT[0] ? 10 : 0) + (t > hitT[1] ? 10 : 0), t > hitT[0] ? 'STRIKE' : 'AIMING', t > hitT[0] ? GOLD : '#e8e8e8');
} },
// 4 — The route: roadblock, recalculate, roadblock, recalculate... arrive
{ dur: 8, draw(c, t) {
  const G = [840, 760], arrive = 6.6, done = t > arrive;
  const STG = [
    { pts: [[200, 1400], [200, 1100], [330, 1100]], a: .2, b: 1.6, X: [390, 1100], word: 'NO MONEY', xt: 1.2 },
    { pts: [[330, 1100], [330, 960], [590, 960]], a: 2.2, b: 3.6, X: [650, 960], word: 'REJECTED', xt: 3.2 },
    { pts: [[590, 960], [590, 860], [760, 860]], a: 4.2, b: 5.4, X: [820, 860], word: 'FAILED', xt: 5.0 },
    { pts: [[760, 860], [760, 760], [840, 760]], a: 5.9, b: arrive },
  ];
  const along = (pts, k) => { const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; } let r = k * L; for (let i = 0; i < seg.length; i++) { if (r <= seg[i]) { const q = r / seg[i]; return [E.lerp(pts[i][0], pts[i + 1][0], q), E.lerp(pts[i][1], pts[i + 1][1], q)]; } r -= seg[i]; } return pts[pts.length - 1]; };
  const poly = (pts, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); };
  if (!done) LB(c, 'THE ROUTE', 540, 470, { size: 34, ls: 5 });
  else { E.title(c, 'CHANGE THE ROUTE.', 540, 430, t, arrive + .2, 1e9, { size: 32, weight: 700, ls: 4, family: 'Inter', color: '#e8e8e8' }); E.title(c, 'NEVER THE DESTINATION.', 540, 485, t, arrive + .6, 1e9, { size: 34, weight: 800, ls: 4, family: 'Inter', color: GOLD }); }
  c.save(); c.strokeStyle = '#1e1e22'; c.lineWidth = 2; for (let x = 120; x <= 960; x += 80) { c.beginPath(); c.moveTo(x, 680); c.lineTo(x, 1460); c.stroke(); } for (let y = 680; y <= 1460; y += 80) { c.beginPath(); c.moveTo(120, y); c.lineTo(960, y); c.stroke(); } c.restore();
  // destination
  if (done) { E.glowDot(c, G[0], G[1], 360, 'rgba(245,197,66,.5)', E.p(t, arrive, arrive + .5)); E.rays(c, G[0], G[1], 420, .3 * E.p(t, arrive, arrive + .5), GOLD, 16, t * .2); }
  c.save(); c.translate(G[0], G[1]); c.rotate(t * .5); c.fillStyle = GOLD; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 14 : 32, a = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore();
  E.tag(c, 'GOAL', G[0], G[1] - 60, 1, -1, { size: 18, color: GOLD, fill: '#2a2208' });
  // the one who turns back at the first roadblock
  const gk = E.p(t, .2, 1.6, 'lin'), gb = E.p(t, 1.8, 2.8, 'lin'), ga = 1 - E.p(t, 2.6, 3.0);
  if (ga > 0) { const [gx, gy] = t < 1.8 ? along(STG[0].pts, gk) : along([...STG[0].pts].reverse(), gb); c.save(); c.globalAlpha = ga; c.fillStyle = '#7a7a7a'; c.beginPath(); c.arc(gx - 14, gy + 14, 13, 0, 7); c.fill(); c.restore(); }
  E.tag(c, 'U-TURN', 230, 1050, t, 2.0, { size: 16, color: '#999', alpha: 1 - E.p(t, 2.8, 3.1) });
  // driven path so far, and the plan ahead
  let pos = STG[0].pts[0], recalc = false, blocks = 0;
  STG.forEach((sg, i) => {
    if (t < sg.a) return;
    const k = E.p(t, sg.a, sg.b, 'inOut'), part = []; const n = 40; for (let j = 0; j <= n; j++) { if (j / n > k) break; part.push(along(sg.pts, j / n)); } part.push(along(sg.pts, k));
    poly(part, done ? GOLD : '#e8e8e8', 7);
    if (t < sg.b) { const end = sg.pts[sg.pts.length - 1]; poly([along(sg.pts, k), end, [G[0], end[1]], G], '#4a4a4a', 4, [10, 10]); }
    pos = along(sg.pts, k);
    if (sg.X && t > sg.xt) { blocks++; const pk = E.p(t, sg.xt, sg.xt + .25, 'back'); c.save(); c.translate(...sg.X); c.scale(pk, pk); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, -20); c.lineTo(20, 20); c.moveTo(20, -20); c.lineTo(-20, 20); c.stroke(); c.restore(); E.tag(c, sg.word, sg.X[0], sg.X[1] - 46, t, sg.xt, { size: 16, color: RED, fill: '#1e0a0a' }); E.shake(c, t, sg.xt, .2, 6); }
    if (sg.X && t > sg.b && STG[i + 1] && t < STG[i + 1].a) recalc = true;
  });
  E.glowDot(c, pos[0], pos[1], 60, done ? 'rgba(245,197,66,.8)' : 'rgba(94,224,192,.7)');
  c.save(); c.fillStyle = done ? GOLD : TEAL; c.beginPath(); c.arc(pos[0], pos[1], 15, 0, 7); c.fill(); c.restore();
  if (recalc && Math.floor(t * 6) % 2 === 0) E.text(c, 'RECALCULATING...', pos[0], pos[1] + 50, { size: 18, weight: 800, family: MONO, color: TEAL });
  CNT(c, 60, 560, 'ROADBLOCKS', blocks, done ? 'ARRIVED ANYWAY' : recalc ? 'NEW ROUTE' : 'DRIVING', done ? GOLD : '#e8e8e8');
  E.particles(c, G[0], G[1], t - arrive, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
] };
