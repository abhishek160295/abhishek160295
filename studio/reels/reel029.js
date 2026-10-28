// Reel 029 — "Busy is not progress" (story format + ref #15 devices)
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
const flame = (c, x, y, k, t) => {
  if (k <= 0) return;
  E.glowDot(c, x, y - 60 * k, 260 * k, 'rgba(255,170,60,.55)');
  [['#f08a24', 70, 190], [GOLD, 48, 140], ['#fff3c4', 24, 80]].forEach(([col, w, h], i) => {
    const ww = w * k * (1 + .08 * Math.sin(t * 13 + i * 2)), hh = h * k * (1 + .1 * Math.sin(t * 9 + i)), sw = Math.sin(t * 7 + i) * 6 * k;
    c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(x + sw, y - hh); c.quadraticCurveTo(x + ww, y - hh * .3, x, y); c.quadraticCurveTo(x - ww, y - hh * .3, x + sw, y - hh); c.fill(); c.restore();
  });
};

const REEL = { title: 'Busy is not progress', bpm: 120, scenes: [
// 1 — Busy vs productive: the wheel vs the road
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, arrive = 6.6, done = t > arrive;
  LB(c, 'BUSY', 540, 540); LB(c, 'PRODUCTIVE', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  // top: running flat out inside a wheel
  const WX = 560, WY = gT - 175, WR = 165;
  E.line(c, WX, WY, WX - 120, gT, '#5a5a5a', 8); E.line(c, WX, WY, WX + 120, gT, '#5a5a5a', 8);
  c.save(); c.strokeStyle = '#8a8a8a'; c.lineWidth = 7; c.beginPath(); c.arc(WX, WY, WR, 0, 7); c.stroke();
  c.lineWidth = 3; c.strokeStyle = '#5a5a5a'; for (let i = 0; i < 10; i++) { const a = -t * 7 + i * Math.PI / 5; c.beginPath(); c.moveTo(WX, WY); c.lineTo(WX + Math.cos(a) * WR, WY + Math.sin(a) * WR); c.stroke(); }
  c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(WX, WY, 10, 0, 7); c.fill(); c.restore();
  fig(c, { x: WX, y: hipOn(WY + WR - 8, .8), s: .8, color: '#bdbdbd', pose: E.run(t * 22) });
  E.particles(c, WX - 30, WY + 30, (t * 2) % 1 * .5, { n: 6, speed: 180, color: '#9fc0dd', grav: 500, life: .5, seed: Math.floor(t * 2) });
  SAY(c, 'SO BUSY.', 250, 860, E.p(t, 4.6, 4.9, 'back'));
  CNT(c, 50, 590, 'HOURS', 1 + Math.round(11 * E.p(t, 0, 7, 'lin')), '0 KM FORWARD');
  // bottom: walks at an easy pace, in one direction
  const scroll = 1020 * E.p(t, 0, 6.0, 'lin');
  for (let i = -1; i < 8; i++) { const px = 150 + i * 170 - (scroll % 170), n = i + Math.floor(scroll / 170); if (n < 0) continue;
    E.line(c, px, gB, px, gB - 60, '#5a5a5a', 5); E.text(c, `${n * 7}`, px, gB - 78, { size: 18, weight: 800, family: MONO, color: '#7a7a7a' }); }
  const gx = E.lerp(1140, 720, E.p(t, 5.2, 6.0, 'out'));
  if (t > 5.2) { if (done) E.glowDot(c, gx, gB - 140, 380, 'rgba(245,197,66,.4)', E.p(t, arrive, arrive + .5)); E.flag(c, gx, gB, 1, 0); }
  const bx = t < 6.0 ? 400 : E.lerp(400, 640, E.p(t, 6.0, arrive, 'lin'));
  fig(c, { x: bx, y: hipOn(gB, .85), s: .85, color: done ? GOLD : '#fff', pose: done ? win(t, arrive) : E.walk(t * 9) });
  CNT(c, 50, 1110, 'HOURS', 1 + Math.round(3 * E.p(t, 0, 6.6, 'lin')), `${Math.round(42 * E.p(t, 0, 6.0, 'lin'))} KM FORWARD`, done ? GOLD : '#e8e8e8');
  E.particles(c, bx, hipOn(gB, .85) - 80, t - arrive, { n: 45, speed: 480, grav: 300 });
} },
// 2 — Scattered vs focused: the same sunlight
{ dur: 8.5, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, smoke = 3.6, fire = 4.8, done = t > fire;
  LB(c, 'SCATTERED', 540, 540); LB(c, 'FOCUSED', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  const row = (gy, wander, focus) => {
    const sun = [880, gy - 330];
    E.glowDot(c, sun[0], sun[1], 90, 'rgba(255,236,170,.55)'); c.save(); c.fillStyle = '#fff1c8'; c.beginPath(); c.arc(sun[0], sun[1], 30, 0, 7); c.fill(); c.restore();
    const o = { x: 420, y: hipOn(gy, s), s, pose: { ...E.pose('stand'), tor: .1 + wander * .15 * Math.sin(t * 2.1), aF: 1.45 + wander * .45 * Math.sin(t * 2.6), eF: .15, hd: .3 } };
    const [hx, hy] = E.hand(o), lx = hx + 38, ly = hy - 6;
    const spotX = lx + 50 + wander * 150 * Math.sin(t * 1.7), r = E.lerp(40, 5, focus);
    c.save(); c.fillStyle = 'rgba(255,240,180,.12)'; c.beginPath(); c.moveTo(sun[0], sun[1]); c.lineTo(lx, ly - 34); c.lineTo(lx, ly + 34); c.fill();
    c.fillStyle = `rgba(255,228,140,${.25 + .35 * focus})`; c.beginPath(); c.moveTo(lx, ly - 34); c.lineTo(spotX + r, gy - 10); c.lineTo(spotX - r, gy - 10); c.lineTo(lx, ly + 34); c.fill(); c.restore();
    E.shaded(c, 520, gy - 12, 180, 12, 2, '#f2ede2', '#bdb6a6');
    E.glowDot(c, spotX, gy - 10, r * 2.4 + 10, `rgba(255,230,150,${.5 + .5 * focus})`);
    E.line(c, hx, hy, lx - 30, ly + 4, '#777', 6);
    c.save(); c.strokeStyle = '#ddd'; c.lineWidth = 5; c.fillStyle = 'rgba(200,225,255,.18)'; c.beginPath(); c.ellipse(lx, ly, 12, 34, 0, 0, 7); c.fill(); c.stroke(); c.restore();
    return o;
  };
  E.tag(c, 'GOAL', 610, gT + 40, t, -1, { size: 18, color: '#bbb' }); E.tag(c, 'GOAL', 610, gB + 40, t, -1, { size: 18, color: done ? GOLD : '#bbb', fill: done ? '#2a2208' : '#0c0c0c' });
  // top: waves the lens at everything, nothing catches
  const to = row(gT, 1, 0); fig(c, { ...to, color: '#bdbdbd' });
  SAY(c, 'TRYING EVERYTHING.', 700, 720, E.p(t, 4.4, 4.7, 'back'));
  CNT(c, 50, 590, 'TARGETS', Math.min(9, 1 + Math.floor(t * 1.2)), '0 FIRES');
  // bottom: holds still until it burns
  const bo = row(gB, 0, E.p(t, .3, smoke, 'inOut'));
  if (t > smoke) for (let i = 0; i < 10; i++) { const q = ((t - smoke) * .8 + i / 10) % 1; c.save(); c.globalAlpha = .4 * (1 - q) * E.p(t, smoke, smoke + .4); c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(610 + Math.sin(q * 6 + i) * 18, gB - 20 - q * 200, 10 + q * 20, 0, 7); c.fill(); c.restore(); }
  flame(c, 610, gB - 10, E.p(t, fire, fire + .6, 'back') * .75, t);
  if (done) E.glowDot(c, 540, gB - 160, 600, 'rgba(255,190,80,.2)', E.p(t, fire, fire + .6));
  fig(c, { ...bo, color: done ? GOLD : '#fff', pose: t > fire + .6 ? win(t, fire + .6) : bo.pose });
  CNT(c, 50, 1110, 'TARGETS', 1, done ? '1 FIRE' : '0 FIRES', done ? GOLD : '#e8e8e8');
} },
// 3 — Tug of war with your excuses
{ dur: 7.4, draw(c, t) {
  const gT = 950, gB = 1480, s = .85, WORDS = ['LAZY', 'TIRED', 'LATER'], won = 6.2, done = t > won;
  const PULL = { ...E.pose('stand'), tor: -.45, hd: .1, aF: 1.45, eF: .2, aB: 1.35, eB: .35, lF: .55, kF: .1, lB: -.25, kB: .35 };
  LB(c, 'GIVES IN', 540, 540); LB(c, 'PULLS HARDER', 540, 1070, { color: done ? GOLD : '#e8e8e8' });
  slab(c, -100, 1180, gT, 200); slab(c, -100, 1180, gB, 220);
  const mid = gy => { E.line(c, 540, gy - 6, 540, gy + 26, '#c46a6a', 6); };
  mid(gT); mid(gB);
  const row = (gy, off, fx, fpose, frot, col, blockRot) => {
    const o = { x: fx, y: hipOn(gy, s) + (frot ? 40 * Math.min(1, frot) : 0), s, rot: frot * 1.2, pose: fpose, color: col };
    const [hx, hy] = E.hand(o);
    const bx = WORDS.map((_, i) => 640 + i * 125 + off);
    c.save(); c.strokeStyle = '#c8a46a'; c.lineWidth = 7; c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo((hx + bx[0]) / 2, hy + 22, bx[0], gy - 44); c.lineTo(bx[2], gy - 44); c.stroke(); c.restore();
    WORDS.forEach((w, i) => { const r = blockRot(bx[i], i); c.save(); c.translate(bx[i], gy - 40); c.rotate(r); E.shaded(c, -52, -40, 104, 80, 8, '#8a8a8a', '#3a3a3a'); E.text(c, w, 0, 0, { size: 22, weight: 800, family: MONO, color: '#111' }); c.restore(); });
    fig(c, o);
    return bx;
  };
  // top: dragged over the line by his own excuses
  const offT = 300 * E.p(t, .3, 4.0, 'in');
  const fallT = E.p(t, 3.3, 3.8, 'in');
  row(gT, offT, 300 + offT, fallT > 0 ? { ...E.pose('crouch'), tor: 1.0 } : { ...PULL, dy: Math.sin(t * 20) * 2 }, fallT, '#bdbdbd', () => .12);
  SAY(c, 'TOO STRONG.', 640, 690, E.p(t, 4.4, 4.7, 'back'));
  CNT(c, 50, 590, 'EXCUSES', 3, 'THEY WIN');
  // bottom: slips, digs in, drags every excuse across
  const jerk = t > 1.6 && t < won ? Math.max(0, Math.sin(t * 7)) * 14 : 0;
  const offB = 50 * E.p(t, .3, 1.3) - 440 * E.p(t, 1.6, won, 'inOut') - jerk;
  const fxB = 300 + Math.min(0, offB) * .3;
  const bx = row(gB, offB, fxB, done ? win(t, won) : { ...PULL, tor: -.45 - .1 * Math.sin(t * 7) }, 0, done ? GOLD : '#fff', (x, i) => x < 560 ? -Math.PI / 2 * E.clamp((560 - x) / 120) : -.1);
  const left = bx.filter(x => x > 540).length;
  if (done) E.glowDot(c, fxB, hipOn(gB, s) - 60, 320, 'rgba(245,197,66,.3)', E.p(t, won, won + .4));
  CNT(c, 50, 1110, 'EXCUSES', left, left ? 'STILL PULLING' : 'ALL ACROSS', done ? GOLD : '#e8e8e8');
  E.particles(c, fxB, hipOn(gB, s) - 80, t - won, { n: 45, speed: 480, grav: 300 });
} },
// 4 — Big days sometimes vs small days always (the bars stack up)
{ dur: 8.6, draw(c, t) {
  const N = 30, BW = 20, GAP = 6, X0 = 150, BT = 880, BB = 1400, stackX = 900, SC = .58, grow = 3.0, merge = 3.4, end = 5.4, done = t > end;
  const big = i => { const r = E.rnd(i * 7 + 2); return r > .82 ? 110 + 70 * E.rnd(i + 11) : 0; };
  LB(c, 'BIG DAYS SOMETIMES', 130, 560, { align: 'left' }); LB(c, 'SMALL DAYS ALWAYS', 130, 1010, { align: 'left', color: done ? GOLD : '#e8e8e8' });
  E.line(c, X0 - 10, BT, 960, BT, '#5a5a5a', 3); E.line(c, X0 - 10, BB, 960, BB, '#5a5a5a', 3);
  const chart = (base, hOf, col, gold) => {
    let acc = 0, vis = 0; const total = Array.from({ length: N }, (_, i) => hOf(i)).reduce((a, b) => a + b, 0);
    for (let i = 0; i < N; i++) {
      const h = hOf(i), born = .2 + i * (grow / N), k = E.p(t, born, born + .2, 'back'); if (k <= 0) continue; vis += h;
      const m = E.p(t, merge + i * .04, merge + i * .04 + .5, 'inOut');
      const x = E.lerp(X0 + i * (BW + GAP), X0 + acc * SC, m), y = E.lerp(base - h * k, base - 28, m), w = E.lerp(BW, h * SC, m), hh = E.lerp(h * k, 28, m);
      if (h === 0) { if (m < 1) E.rrect(c, x, base - 6, BW, 6, 2, '#5a2a2a'); }
      else E.rrect(c, x, y, Math.max(2, w - (m > .9 ? 1 : 0)), hh, 3, gold ? GOLD : col);
      acc += h;
    }
    return [total, vis];
  };
  const [tTop, vTop] = chart(BT, big, '#9a9a9a', false), [tBot, vBot] = chart(BB, () => 45, '#e8e8e8', done);
  // the one who shows up every day stands on what he built
  const days = Math.min(N, Math.floor(Math.max(0, t - .2) / (grow / N)) + 1);
  const ex = X0 + tBot * SC - 20;
  if (t > end) { E.glowDot(c, ex, BB - 120, 360, 'rgba(245,197,66,.4)', E.p(t, end, end + .5)); E.rays(c, ex, BB - 120, 420, .25 * E.p(t, end, end + .5), GOLD, 14, t * .15);
    fig(c, { x: ex, y: hipOn(BB - 28, .6), s: .6, color: GOLD, pose: win(t, end + .2) }); }
  CNT(c, 540, 600, 'TOTAL', Math.round(vTop), `${Array.from({ length: N }, (_, i) => big(i)).filter(Boolean).length} BIG DAYS`);
  CNT(c, 540, 1050, 'TOTAL', Math.round(vBot), `${days} SMALL DAYS`, done ? GOLD : '#e8e8e8');
  E.text(c, 'SMALL DAYS ALWAYS WIN.', 540, 1480, { size: 30, weight: 700, ls: 4, color: GOLD, alpha: E.p(t, end + .3, end + .8) });
  E.particles(c, ex, BB - 140, t - end, { n: 60, speed: 520, grav: 260, life: 1.6 });
} },
] };
