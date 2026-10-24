// Reel 016 — "Call your parents today"
const REEL = { title: 'Call your parents today', bpm: 150, pace: 'fast', scenes: [
// 1 — They taught you to walk
{ dur: 5, draw(c, t) {
  E.title(c, 'They taught you how to walk.', W / 2, 420, t, -1, 2.4, { size: 50, weight: 800 });
  E.title(c, 'Now walk with them.', W / 2, 420, t, 2.6, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1300; E.ground(c, gy, 0, W);
  for (let i = 0; i < 14; i++) { const x = ((i * 90 - t * 110) % 1260 + 1260) % 1260 - 90; E.line(c, x, gy + 22, x + 40, gy + 22, '#2a2a2a', 4); }
  const age = E.p(t, .6, 2.4, 'inOut');
  const ps = E.lerp(1, .9, age), ks = E.lerp(.45, 1, age);
  const px = E.lerp(520, 420, age), kx = E.lerp(400, 560, age);
  E.text(c, `${Math.round(E.lerp(1990, 2026, age))}`, W / 2, 560, { size: 34, weight: 900, ls: 4, color: GREY });
  const pPose = { ...E.walk(t * 6, .25), tor: E.lerp(.04, .3, age), aF: age > .5 ? .9 : -.3 - .2, eF: .2, aB: age > .5 ? 1.0 : .2 };
  E.figure(c, { x: px, y: gy - E.FIG_H * ps - 2, s: ps, pose: pPose, color: `rgb(${Math.round(E.lerp(255, 175, age))},${Math.round(E.lerp(255, 175, age))},${Math.round(E.lerp(255, 175, age))})` });
  if (age > .6) { const [hx, hy] = E.hand({ x: px, y: gy - E.FIG_H * ps - 2, s: ps, pose: pPose }, 'B'); E.line(c, hx, hy, hx + 30, gy, '#b08060', 7); }
  E.figure(c, { x: kx, y: gy - E.FIG_H * ks - 2, s: ks, f: 1, pose: { ...E.walk(t * 6 + 1, .3), aB: age > .5 ? -1.0 : 1.1, eB: .2 }, color: t > 2.6 ? GOLD : '#fff' });
  const a1 = E.hand({ x: px, y: gy - E.FIG_H * ps - 2, s: ps, pose: pPose }), a2 = E.hand({ x: kx, y: gy - E.FIG_H * ks - 2, s: ks, pose: { ...E.walk(t * 6 + 1, .3), aB: age > .5 ? -1.0 : 1.1, eB: .2 } }, 'B');
  E.line(c, a1[0], a1[1], a2[0], a2[1], t > 2.6 ? GOLD : '#fff', 9);
  E.glowDot(c, (a1[0] + a2[0]) / 2, a1[1], 120, 'rgba(245,197,66,.45)', E.p(t, 2.6, 3.0));
} },
// 2 — Too busy to pick up
{ dur: 5, draw(c, t) {
  E.title(c, 'Too busy to pick up?', W / 2, 420, t, -1, 2.4, { size: 56, weight: 800 });
  E.title(c, 'Call back today.', W / 2, 420, t, 2.6, 1e9, { size: 62, weight: 900, color: GOLD });
  const gy = 1300; E.ground(c, gy);
  E.rrect(c, 160, gy - 190, 360, 16, 4, '#9a6b4a'); E.line(c, 190, gy - 174, 190, gy, '#9a6b4a', 8); E.line(c, 490, gy - 174, 490, gy, '#9a6b4a', 8);
  E.rrect(c, 230, gy - 290, 170, 100, 10, '#222', '#bbb', 4); E.rrect(c, 210, gy - 196, 210, 10, 3, '#bbb');
  const typing = t < 2.4;
  const fig = { x: 560, y: gy - 70 - 66 * .85 + 2, s: .85, f: -1, pose: typing ? { ...E.pose('sit'), aF: 1.4 + Math.sin(t * 22) * .15, eF: .5, aB: 1.3 + Math.cos(t * 22) * .15, eB: .5 } : { ...E.pose('sit'), aF: 2.5, eF: 1.8, hd: -.1 } };
  E.rrect(c, 520, gy - 72, 120, 14, 4, '#555'); E.line(c, 530, gy - 58, 530, gy, '#555', 6); E.line(c, 630, gy - 58, 630, gy, '#555', 6);
  E.figure(c, fig);
  // incoming calls get declined
  const calls = [.2, .9, 1.6];
  calls.forEach((t0, i) => { const a = E.p(t, t0, t0 + .15, 'back') * (1 - E.p(t, t0 + .45, t0 + .55)); if (a > 0) { c.save(); c.translate(720 + Math.sin(t * 60) * 5 * a, gy - 420); c.scale(a, a); E.rrect(c, -150, -46, 300, 92, 46, '#1d1d1d', '#888', 3); c.fillStyle = GREEN; c.beginPath(); c.arc(-105, 0, 26, 0, 7); c.fill(); c.restore(); E.text(c, 'Mom calling…', 740, gy - 420, { size: 32, weight: 800, alpha: a }); }
    const x = E.p(t, t0 + .4, t0 + .5); if (x > 0 && x < 1) E.text(c, 'DECLINED', 720, gy - 420, { size: 40, weight: 900, color: RED, alpha: 1 - Math.abs(x - .5) * 2 }); });
  const missed = calls.filter(t0 => t > t0 + .5).length;
  if (missed && t < 2.6) E.text(c, `${missed} missed call${missed > 1 ? 's' : ''}`, 720, gy - 300, { size: 34, weight: 800, color: RED });
  // calling back: both phones light up, parent smiles
  if (t > 2.4) { const k = E.p(t, 2.4, 2.8, 'back'); const [hx, hy] = E.hand(fig); E.phone(c, hx - 6, hy - 24, 1.3 * k, 1, GREEN);
    E.figure(c, { x: 880, y: gy - E.FIG_H * .8 - 2, s: .8, f: -1, color: '#cfcfcf', alpha: k, pose: E.mix({ ...E.pose('stand'), aF: 2.6, eF: 1.9 }, { ...E.pose('cheer'), aF: 2.6, eF: 1.9 }, E.p(t, 3.0, 3.4)) });
    E.text(c, 'MOM', 880, gy + 40, { size: 28, weight: 900, ls: 3, color: GREY, alpha: k });
    for (let i = 0; i < 4; i++) { const q = ((t - 2.6) * .9 + i * .25) % 1; c.save(); c.globalAlpha = Math.sin(q * Math.PI); c.translate(E.lerp(640, 840, q), gy - 300 - Math.sin(q * Math.PI) * 120); c.scale(.5, .5); c.fillStyle = RED; c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-60, -10, -30, -60, 0, -28); c.bezierCurveTo(30, -60, 60, -10, 0, 30); c.fill(); c.restore(); } }
} },
// 3 — They need your time
{ dur: 5, draw(c, t) {
  E.title(c, "They don't need your money.", W / 2, 420, t, -1, 2.4, { size: 50, weight: 800 });
  E.title(c, 'They need your time.', W / 2, 420, t, 2.6, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1300, tx = 540; E.ground(c, gy);
  const warm = E.p(t, 2.4, 3.0);
  E.glowDot(c, tx, gy - 520, 420, 'rgba(245,197,66,.35)', .25 + .75 * warm);
  E.line(c, tx, 700, tx, gy - 520, '#666', 3); c.save(); c.fillStyle = warm > 0 ? GOLD : '#777'; c.beginPath(); c.moveTo(tx - 60, gy - 500); c.lineTo(tx + 60, gy - 500); c.lineTo(tx + 30, gy - 540); c.lineTo(tx - 30, gy - 540); c.fill(); c.restore();
  E.rrect(c, tx - 230, gy - 200, 460, 18, 4, '#9a6b4a'); E.line(c, tx - 200, gy - 182, tx - 200, gy, '#9a6b4a', 8); E.line(c, tx + 200, gy - 182, tx + 200, gy, '#9a6b4a', 8);
  [tx - 110, tx + 110].forEach(x => { c.save(); c.fillStyle = '#ddd'; c.beginPath(); c.ellipse(x, gy - 206, 70, 12, 0, 0, 7); c.fill(); c.restore(); });
  // parent waits on the left
  E.rrect(c, 160, gy - 74, 130, 14, 4, '#555');
  E.figure(c, { x: 230, y: gy - 74 - 66 * .85 + 2, s: .85, color: '#cfcfcf', pose: t < 2.6 ? { ...E.pose('sit'), hd: .2 + Math.sin(t * 2) * .05 } : E.mix(E.pose('sit'), { ...E.pose('sit'), aF: 2.4, eF: .2, hd: -.2 }, E.p(t, 2.8, 3.2)) });
  // wall clock racing while they wait
  const cx = 300, cy = 720, spin = t < 2.4 ? t * 9 : 2.4 * 9 + (t - 2.4) * .5; c.save(); c.strokeStyle = '#bbb'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, 56, 0, 7); c.stroke(); E.line(c, cx, cy, cx + Math.sin(spin) * 42, cy - Math.cos(spin) * 42, '#ddd', 4); E.line(c, cx, cy, cx + Math.sin(spin / 12) * 28, cy - Math.cos(spin / 12) * 28, '#ddd', 6); c.restore();
  // you: scrolling in the doorway, then you sit down
  const sit = E.p(t, 2.4, 3.0, 'inOut');
  if (t < 2.4) { const fig = { x: 860, y: gy - E.FIG_H * .85 - 2, s: .85, f: -1, pose: E.pose('phone') }; E.figure(c, { ...fig, pose: { ...E.pose('stand'), aF: 1.0, eF: 1.9, hd: .45 } }); const [hx, hy] = E.hand({ ...fig, pose: { ...E.pose('stand'), aF: 1.0, eF: 1.9, hd: .45 } }); E.phone(c, hx, hy - 16, 1.3); E.glowDot(c, hx, hy - 20, 80, 'rgba(120,190,255,.4)'); }
  else { E.rrect(c, 780, gy - 74, 130, 14, 4, '#555'); const x = E.lerp(860, 850, sit); E.figure(c, { x, y: E.lerp(gy - E.FIG_H * .85 - 2, gy - 74 - 66 * .85 + 2, sit), s: .85, f: -1, color: GOLD, pose: E.mix(E.pose('stand'), { ...E.pose('sit'), aF: 1.4, eF: .4 }, sit) }); }
} },
// 4 — Make a new photo together
{ dur: 5, draw(c, t) {
  E.title(c, 'They kept every photo of you.', W / 2, 420, t, -1, 2.4, { size: 48, weight: 800 });
  E.title(c, 'Take a new one together.', W / 2, 420, t, 2.6, 1e9, { size: 54, weight: 900, color: GOLD });
  const gy = 1320; E.ground(c, gy);
  const frames = [[230, 640], [430, 600], [630, 640], [330, 840], [530, 840], [760, 800]];
  frames.forEach(([x, y], i) => {
    const a = E.p(t, .15 + i * .3, .35 + i * .3, 'back'); if (a <= 0) return;
    c.save(); c.translate(x, y); c.rotate((i % 2 ? 1 : -1) * .05); c.scale(a, a);
    E.rrect(c, -80, -95, 160, 190, 6, '#2a2018', '#c9a070', 6);
    if (i < 5) { const ks = [.28, .34, .4, .46, .52][i]; E.figure(c, { x: 0, y: 70 - E.FIG_H * ks, s: ks, lw: 16, pose: E.pose('cheer'), color: '#ddd' }); }
    else if (t > 3.3) { c.fillStyle = 'rgba(245,197,66,.25)'; c.fillRect(-72, -87, 144, 174); E.figure(c, { x: -26, y: 70 - E.FIG_H * .42, s: .42, lw: 16, pose: E.pose('stand'), color: GOLD }); E.figure(c, { x: 28, y: 70 - E.FIG_H * .4, s: .4, lw: 16, pose: E.pose('stand'), color: '#ddd' }); }
    else E.text(c, '?', 0, 0, { size: 90, weight: 900, color: '#6a5a4a' });
    c.restore();
  });
  // the two of you, then a camera flash
  const k = E.p(t, 2.2, 3.0, 'out');
  E.figure(c, { x: 440, y: gy - E.FIG_H * .9 - 2, s: .9, color: '#cfcfcf', pose: { ...E.pose('stand'), tor: .2, aF: k > .9 ? 1.6 : .1, eF: .4 } });
  E.figure(c, { x: E.lerp(1000, 580, k), y: gy - E.FIG_H - 2, f: -1, pose: k < 1 ? E.walk(t * 8) : { ...E.pose('stand'), aB: -1.7, eB: -.4 }, color: t > 3.2 ? GOLD : '#fff' });
  E.flash(c, t, 3.2, .35, '255,255,255', .7);
} },
// 5 — Hug them while you can
{ dur: 5, draw(c, t) {
  E.title(c, "One day you'll miss these moments.", W / 2, 420, t, -1, 2.4, { size: 44, weight: 800 });
  E.title(c, 'Hug them while you can.', W / 2, 420, t, 2.6, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1300; E.ground(c, gy);
  const k = E.p(t, 0, 1.6, 'out'), hug = E.p(t, 1.6, 2.1);
  E.figure(c, { x: 600, y: gy - E.FIG_H * .9 - 2, s: .9, f: -1, color: '#cfcfcf', pose: E.mix({ ...E.pose('stand'), tor: .2 }, { ...E.pose('stand'), tor: .15, aF: 1.3, eF: 1.7, aB: 1.2, eB: 1.8 }, hug) });
  const x = E.lerp(150, 500, k);
  E.figure(c, { x, y: gy - E.FIG_H - 2, color: hug > .5 ? GOLD : '#fff', pose: k < 1 ? E.walk(x / 22) : E.mix(E.pose('stand'), { ...E.pose('stand'), tor: .15, aF: 1.4, eF: 1.7, aB: 1.3, eB: 1.8 }, hug) });
  E.glowDot(c, 550, gy - 220, 360, 'rgba(245,197,66,.4)', hug);
  if (t > 2.1) for (let i = 0; i < 6; i++) { const q = ((t - 2.1) * .6 + i / 6) % 1; c.save(); c.globalAlpha = Math.sin(q * Math.PI); c.translate(550 + Math.sin(i * 2 + t) * 120, gy - 300 - q * 380); c.scale(.55, .55); c.fillStyle = i % 2 ? RED : '#ff8a8d'; c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-60, -10, -30, -60, 0, -28); c.bezierCurveTo(30, -60, 60, -10, 0, 30); c.fill(); c.restore(); }
  E.particles(c, 550, gy - 260, t - 2.1, { n: 40, speed: 420 });
} },
] };
