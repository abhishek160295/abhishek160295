// Reel 012 — "Pay yourself first"
const cookie = (c, x, y, r = 40, a = 1) => { c.save(); c.globalAlpha *= a; c.fillStyle = '#c58b4a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = '#4a2a14'; [[-.4, -.3], [.3, -.4], [.1, .2], [-.3, .35], [.45, .25]].forEach(([dx, dy]) => { c.beginPath(); c.arc(x + dx * r, y + dy * r, r * .11, 0, 7); c.fill(); }); c.restore(); };
const REEL = { title: 'Pay yourself first', bpm: 150, scenes: [
// 1 — Payday vs day 5
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Payday:', W / 2, 420, t, -1, 1.2, { size: 64, weight: 900 });
  E.title(c, 'Day 5:', W / 2, 420, t, 1.4, 3.6, { size: 64, weight: 900, color: RED });
  E.title(c, 'Pay yourself first.', W / 2, 420, t, 3.8, 1e9, { size: 60, weight: 900, color: GOLD });
  const wx = 540, wy = 960;
  // wallet
  E.rrect(c, wx - 220, wy - 140, 440, 280, 28, '#3a2a1a', '#a07a50', 6);
  E.rrect(c, wx + 120, wy - 40, 120, 80, 18, '#4a3624', '#a07a50', 4);
  c.save(); c.fillStyle = '#c9a070'; c.beginPath(); c.arc(wx + 190, wy, 12, 0, 7); c.fill(); c.restore();
  const drains = [['Food delivery', 1.5], ['Sale 70% OFF', 1.9], ['Subscriptions', 2.3], ['Night out', 2.7]];
  const reset = t >= 3.7;
  let coins = 12; if (!reset) drains.forEach(([, t0]) => { if (t > t0 + .35) coins -= 3; });
  for (let i = 0; i < 12; i++) {
    const q = i % 6, r = Math.floor(i / 6), cx = wx - 165 + q * 56, cy = wy - 60 + r * 60;
    let out = 0, tx = 0, ty = 0;
    if (!reset) { const d = drains[Math.floor((11 - i) / 3)]; if (d) { out = E.p(t, d[1], d[1] + .35, 'in'); tx = d === drains[0] || d === drains[2] ? 180 : 880; ty = 680 + drains.indexOf(d) * 80; } }
    else if (i >= 8) { out = E.p(t, 3.9 + (i - 8) * .15, 4.25 + (i - 8) * .15, 'inOut'); tx = 800; ty = 1300; }
    if (out < 1) E.coin(c, E.lerp(cx, tx, out), E.lerp(cy, ty, out) - Math.sin(out * Math.PI) * 120, 24);
  }
  if (!reset) drains.forEach(([str, t0], i) => E.bubble(c, str, i % 2 ? 860 : 220, 680 + i * 80, E.p(t, t0 - .2, t0, 'back') * (1 - E.p(t, 3.4, 3.6)), { size: 30, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f' }));
  E.text(c, `${Math.round(coins / 12 * 100)}%`, wx, wy + 190, { size: 40, weight: 900, color: coins < 4 ? RED : '#fff', alpha: reset ? 0 : 1 });
  // piggy bank labelled YOU
  if (reset) { const k = E.p(t, 3.7, 4.0, 'back'); c.save(); c.translate(800, 1300); c.scale(k, k);
    c.fillStyle = '#f0a6b8'; c.beginPath(); c.ellipse(0, -70, 120, 90, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(110, -80, 34, 30, 0, 0, 7); c.fill();
    c.fillRect(-80, -10, 30, 40); c.fillRect(50, -10, 30, 40); c.beginPath(); c.moveTo(-40, -150); c.lineTo(-10, -190); c.lineTo(10, -150); c.fill();
    c.fillStyle = '#7a3a4a'; c.fillRect(-30, -158, 60, 8); c.restore();
    E.text(c, 'YOU', 780, 1230, { size: 40, weight: 900, color: '#7a3a4a', alpha: k }); }
  E.particles(c, 800, 1250, t - 4.7, { n: 30, speed: 380 });
} },
// 2 — Looking rich vs being rich
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Looking rich vs being rich', W / 2, 420, t, -1, 4.1, { size: 50, weight: 800 });
  E.title(c, 'Quiet money wins.', W / 2, 420, t, 4.3, 1e9, { size: 60, weight: 900, color: GOLD });
  const g1 = 900, g2 = 1420, s = .7, fade = E.p(t, 3.6, 4.2);
  E.text(c, 'LOOKING RICH', 100, 570, { size: 28, weight: 900, ls: 3, color: GREY, align: 'left' });
  E.text(c, 'BEING RICH', 100, 1090, { size: 28, weight: 900, ls: 3, align: 'left' });
  E.ground(c, g1, 90, 990); E.ground(c, g2, 90, 990);
  // flashy car on EMI
  c.save(); c.globalAlpha = 1 - fade * .7; c.translate(620, g1);
  c.fillStyle = '#d93a3f'; c.beginPath(); c.roundRect(-200, -110, 400, 80, 24); c.fill();
  c.beginPath(); c.moveTo(-110, -110); c.lineTo(-60, -170); c.lineTo(80, -170); c.lineTo(130, -110); c.fill();
  c.fillStyle = '#9fd3ff'; c.beginPath(); c.moveTo(-90, -112); c.lineTo(-52, -158); c.lineTo(10, -158); c.lineTo(10, -112); c.fill(); c.beginPath(); c.moveTo(24, -112); c.lineTo(24, -158); c.lineTo(72, -158); c.lineTo(110, -112); c.fill();
  c.fillStyle = '#222'; [-120, 120].forEach(dx => { c.beginPath(); c.arc(dx, -30, 34, 0, 7); c.fill(); }); c.restore();
  E.rrect(c, 560, g1 - 250, 230, 50, 10, '#2a0d0f', RED, 3); E.text(c, 'EMI: 60 months', 675, g1 - 225, { size: 28, weight: 900, color: '#ffb3b5', alpha: E.p(t, .8, 1.1) });
  E.figure(c, { x: 300, y: g1 - E.FIG_H * s - 2, s, pose: { ...E.pose('arms'), hd: -.3 }, alpha: 1 - fade * .6 });
  E.text(c, 'Savings: 0', 300, g1 - 260, { size: 28, weight: 800, color: RED, alpha: E.p(t, 1.2, 1.5) });
  // quiet compounding
  const k = E.p(t, .4, 4.2, 'in');
  const pts = 40; c.save(); c.strokeStyle = GOLD; c.lineWidth = 7; c.lineJoin = 'round'; c.beginPath();
  for (let i = 0; i <= pts * k; i++) { const u = i / pts, x = 440 + 480 * u, y = g2 - 30 - 330 * Math.pow(u, 2.6); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
  for (let i = 0; i < Math.floor(k * 9); i++) E.coin(c, 470 + i * 52, g2 - 22 - (i % 2) * 6, 18);
  E.figure(c, { x: 300, y: g2 - E.FIG_H * s - 2, s, pose: t > 4.2 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.2, 4.5, 'back')) : E.pose('stand') });
  E.text(c, `Savings: growing`, 300, g2 - 260, { size: 28, weight: 800, color: GREEN, alpha: E.p(t, 1.2, 1.5) });
  E.particles(c, 920, g2 - 360, t - 4.2, { n: 30, speed: 380 });
} },
// 3 — Invest in yourself
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Invest in yourself.', W / 2, 420, t, -1, 3.0, { size: 58, weight: 900 });
  E.title(c, 'It pays the best interest.', W / 2, 420, t, 3.2, 1e9, { size: 54, weight: 900, color: GOLD });
  const gy = 1340, bx = 640, by = 860, lit = E.p(t, 2.4, 2.9);
  E.ground(c, gy, 90, 990);
  // light bulb
  E.glowDot(c, bx, by, 330, 'rgba(245,197,66,.5)', lit);
  c.save(); c.fillStyle = lit > 0 ? `rgba(245,197,66,${.25 + .7 * lit})` : '#111'; c.strokeStyle = lit > 0 ? GOLD : '#ddd'; c.lineWidth = 7;
  c.beginPath(); c.arc(bx, by, 130, Math.PI * .8, Math.PI * 2.2); c.lineTo(bx + 55, by + 190); c.lineTo(bx - 55, by + 190); c.closePath(); c.fill(); c.stroke(); c.restore();
  [0, 1, 2].forEach(i => E.rrect(c, bx - 60, by + 196 + i * 26, 120, 18, 6, '#888'));
  E.text(c, 'SKILLS', bx, by, { size: 40, weight: 900, ls: 4, color: lit > .5 ? '#3a2a05' : '#ddd' });
  const fig = { x: 250, y: gy - E.FIG_H * .9 - 2, s: .9, pose: t < 2.4 ? { ...E.pose('stand'), aF: 1.2 + Math.max(0, Math.sin(t * 5)) * 1.3, eF: .2 } : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.8, 5.1, 'back')) };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  for (let i = 0; i < 3; i++) { const t0 = .4 + i * .65, k = E.p(t, t0, t0 + .5, 'inOut'); if (k > 0 && k < 1) E.coin(c, E.lerp(hx, bx, k), E.lerp(hy, by - 130, k) - Math.sin(k * Math.PI) * 220, 22); }
  // payout rains back many times over
  for (let i = 0; i < 16; i++) { const t0 = 3.0 + i * .12, k = E.p(t, t0, t0 + .6, 'in'); if (k <= 0) continue; const tx = 120 + (i % 8) * 34, ty = gy - 22 - Math.floor(i / 8) * 40; E.coin(c, E.lerp(bx + (E.rnd(i) - .5) * 160, tx, k), E.lerp(by + 40, ty, k) - Math.sin(k * Math.PI) * 160, 20); }
  E.text(c, '×10', bx + 210, by - 140, { size: 64, weight: 900, color: GOLD, alpha: E.p(t, 3.4, 3.7) });
} },
// 4 — Discipline weighs ounces, regret weighs tons
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Discipline weighs ounces.', W / 2, 420, t, -1, 2.4, { size: 52, weight: 800 });
  E.title(c, 'Regret weighs tons.', W / 2, 420, t, 2.6, 1e9, { size: 58, weight: 900, color: RED });
  const g1 = 900, g2 = 1420;
  E.ground(c, g1, 90, 990);
  const lift = (Math.sin(t * 4) + 1) / 2;
  const f1 = { x: 540, y: g1 - E.FIG_H * .75 - 2, s: .75, pose: { ...E.pose('stand'), aB: E.lerp(-2.4, -2.9, lift), eB: -.3, aF: E.lerp(2.4, 2.9, lift), eF: .3 } };
  E.figure(c, f1); const [hx, hy] = E.hand(f1);
  E.rrect(c, hx - 100, hy - 56, 190, 52, 8, '#ddd'); E.text(c, 'DISCIPLINE', hx - 5, hy - 30, { size: 26, weight: 900, color: '#111' });
  c.save(); E.shake(c, t, 2.6, .5, 26);
  E.ground(c, g2, 90, 990);
  const drop = E.p(t, 2.2, 2.6, 'in');
  const crushed = t > 2.6;
  E.figure(c, { x: 270, y: g2 - E.FIG_H * .75 - 2 + (crushed ? 60 : 0), s: .75, pose: crushed ? E.pose('crouch') : E.pose('stand'), color: crushed ? '#999' : '#fff' });
  if (drop > 0) { const by = E.lerp(560, g2 - 280, drop); E.rrect(c, 420, by, 480, 280, 12, '#2b2b2b', '#777', 5); E.text(c, 'REGRET', 660, by + 110, { size: 60, weight: 900, ls: 4, color: '#bbb' }); E.text(c, '10 TONS', 660, by + 190, { size: 30, weight: 800, color: RED }); }
  E.particles(c, 660, g2, t - 2.6, { n: 40, speed: 600, color: '#888', grav: 500 });
  c.restore();
} },
// 5 — One cookie now or two later
{ dur: 6.4, draw(c, t) {
  E.title(c, 'One cookie now, or a plate later?', W / 2, 420, t, -1, 4.4, { size: 48, weight: 800 });
  E.title(c, 'Patience pays.', W / 2, 420, t, 4.6, 1e9, { size: 64, weight: 900, color: GOLD });
  const gy = 1340, tx = 640, ty = gy - 220;
  E.ground(c, gy, 90, 990);
  E.rrect(c, tx - 200, ty, 400, 18, 4, '#9a6b4a'); E.line(c, tx - 170, ty + 18, tx - 170, gy, '#9a6b4a', 8); E.line(c, tx + 170, ty + 18, tx + 170, gy, '#9a6b4a', 8);
  c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.ellipse(tx, ty - 6, 150, 18, 0, 0, 7); c.fill(); c.restore();
  const more = E.p(t, 4.0, 4.5, 'back');
  cookie(c, tx, ty - 40, 40);
  [[-80, -40], [80, -40], [-40, -100], [40, -100], [0, -160]].forEach(([dx, dy], i) => { const a = E.p(t, 4.0 + i * .1, 4.3 + i * .1, 'back'); if (a > 0) cookie(c, tx + dx, ty + dy, 40 * a); });
  if (more > 0) E.glowDot(c, tx, ty - 80, 260, 'rgba(245,197,66,.35)', more);
  const tempt = t < 2.4 ? Math.max(0, Math.sin(t * 3)) : 0;
  const pose = t < 2.4 ? { ...E.pose('stand'), tor: .1 + tempt * .25, aF: 1.0 + tempt * .5, eF: .2 } : t < 4.0 ? E.pose('arms') : E.mix(E.pose('arms'), E.pose('cheer'), E.p(t, 4.5, 4.8, 'back'));
  E.figure(c, { x: 300, y: gy - E.FIG_H * .95 - 2, s: .95, pose });
  if (t > 2.6 && t < 4.0) E.clock(c, 300, 700, `${Math.floor((t - 2.6) / 1.4 * 15)} min`, '#fff', false, t, 1);
  E.particles(c, tx, ty - 100, t - 4.5, { n: 40, speed: 450 });
} },
] };
