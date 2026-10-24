// Reel 019 — "Fake friend vs real friend"
const { gA, gB } = E.VS;
const confetti = (c, x, y, t, t0, n = 40) => { if (t < t0) return; for (let i = 0; i < n; i++) { const q = ((t - t0) * (.6 + E.rnd(i) * .6)) % 1.4, px = x + (E.rnd(i + 3) - .5) * 440 * Math.min(1, q * 2), py = y + q * 220 + Math.sin(q * 8 + i) * 10 - 90 * Math.min(1, q * 3); if (q > 1.6) continue; c.save(); c.translate(px, py); c.rotate(q * 8 + i); c.fillStyle = [GOLD, '#ff8a8d', ICE, GREEN][i % 4]; c.fillRect(-7, -4, 14, 8); c.restore(); } };
const REEL = { title: 'Fake friend vs real friend', bpm: 150, pace: 'fast', scenes: [
// 1 — When you win
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When you win:', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Real ones celebrate you.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'FAKE', 'REAL', 2.6);
  [gA, gB].forEach((g, r) => { E.figure(c, { x: 320, y: g - E.FIG_H - 2, pose: { ...E.pose('cheer'), aF: 2.7 + Math.sin(t * 6) * .2 }, color: '#fff' }); E.trophy(c, 380, g - 300, .9, 1, r && k > .5 ? 30 : 0); });
  E.figure(c, { x: 760, y: gA - E.FIG_H - 2, f: -1, color: '#8a8a8a', pose: { ...E.pose('arms'), hd: -.35 + Math.sin(t * 2) * .05, tor: -.1 } });
  E.bubble(c, 'Just lucky.', 820, gA - 330, E.p(t, .5, .75, 'back'), { size: 32, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f', tail: -1 });
  const j = Math.abs(Math.sin(t * 8));
  E.figure(c, { x: 760, y: gB - E.FIG_H - 2 - j * 40, f: -1, color: k > .5 ? GOLD : '#fff', pose: { ...E.pose('cheer'), aF: 2.6 + j * .3, aB: -2.6 - j * .3, kF: j * .6, kB: j * .6 } });
  confetti(c, 560, gB - 300, t, .4, 50);
} },
// 2 — When you fall
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When you fall:', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Real ones pick you up.', W / 2, 420, t, 2.7, 1e9, { size: 56, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'FAKE', 'REAL', 2.6);
  const fall = E.p(t, .2, .55, 'in');
  // you trip in both rows
  E.figure(c, { x: E.lerp(280, 360, fall), y: E.lerp(gA - E.FIG_H - 2, gA - 34, fall), rot: fall * Math.PI / 2, pose: E.pose('stand') });
  const lift = E.p(t, 1.8, 2.6, 'inOut');
  E.figure(c, { x: E.lerp(280, 360, fall), y: E.lerp(E.lerp(gB - E.FIG_H - 2, gB - 34, fall), gB - E.FIG_H - 2, lift), rot: fall * Math.PI / 2 * (1 - lift), pose: lift > .9 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.7, 3.0, 'back')) : E.pose('stand'), color: lift > .9 ? GOLD : '#fff' });
  // fake laughs and films it
  const laugh = Math.abs(Math.sin(t * 14));
  const ff = { x: 760, y: gA - E.FIG_H - 2, f: -1, color: '#8a8a8a', pose: { ...E.pose('stand'), tor: -.15 - laugh * .12, aF: 1.6, eF: 1.4, aB: .4 + laugh * .3 } };
  E.figure(c, ff); const [fx, fy] = E.hand(ff); E.phone(c, fx - 6, fy - 20, 1.5, 1, '#9fd3ff');
  for (let i = 0; i < 3; i++) { const q = ((t * 1.4 + i / 3) % 1); E.text(c, 'HA', 820 + q * 90, gA - 300 - q * 80, { size: 34 + i * 4, weight: 900, color: RED, alpha: 1 - q }); }
  // real one runs in and offers a hand
  const run = E.p(t, .4, 1.6, 'out'), rx = E.lerp(1000, 560, run);
  E.figure(c, { x: rx, y: gB - E.FIG_H - 2, f: -1, color: k > .5 ? GOLD : '#fff', pose: run < 1 ? E.run(rx / 20) : { ...E.pose('stand'), tor: .35 - lift * .3, aF: 1.3 + lift * .4, eF: .2 } });
  E.particles(c, 460, gB - 200, t - 2.6, { n: 50, speed: 520 });
} },
// 3 — When you're not around
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, "When you're not around:", W / 2, 420, t, -1, 2.5, { size: 52, weight: 900 });
  E.title(c, 'Real ones defend you.', W / 2, 420, t, 2.7, 1e9, { size: 56, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'FAKE', 'REAL', 2.6);
  [gA, gB].forEach(g => [700, 840].forEach((x, i) => E.figure(c, { x, y: g - E.FIG_H * .9 - 2, s: .9, f: -1, color: '#6a6a6a', pose: { ...E.pose('stand'), hd: .1 + Math.sin(t * 3 + i) * .08 } })));
  // fake gossips, leaning in
  E.figure(c, { x: 450, y: gA - E.FIG_H - 2, color: '#9a9a9a', pose: { ...E.pose('stand'), tor: .35, aF: 1.6, eF: .9, hd: .2 } });
  E.bubble(c, 'Did you hear what they…', 560, gA - 330, E.p(t, .3, .55, 'back'), { size: 28, tail: -1 });
  for (let i = 0; i < 3; i++) { const q = ((t * 1.2 + i / 3) % 1); c.save(); c.globalAlpha = 1 - q; c.fillStyle = '#bbb'; c.beginPath(); c.arc(560 + q * 140, gA - 250 - q * 30, 7, 0, 7); c.fill(); c.restore(); }
  // real one stands up for you
  const stand = E.p(t, 1.6, 2.4, 'back');
  E.figure(c, { x: 450, y: gB - E.FIG_H * (1 + .08 * stand) - 2, s: 1 + .08 * stand, color: k > .5 ? GOLD : '#fff', pose: t < 1.6 ? E.pose('arms') : { ...E.pose('point'), aF: 1.5 + Math.sin(t * 6) * .1 } });
  E.bubble(c, 'Not cool. They\'re my friend.', 640, gB - 290, E.p(t, 1.6, 1.85, 'back'), { size: 30, stroke: GOLD, color: GOLD, tail: -1 });
  E.particles(c, 450, gB - 200, t - 2.6, { n: 40, speed: 460 });
} },
// 4 — When you talk
{ dur: 5, cam: E.vsCam(2.6), draw(c, t) {
  E.title(c, 'When you need to talk:', W / 2, 420, t, -1, 2.5, { size: 52, weight: 900 });
  E.title(c, 'Real ones actually listen.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const k = E.vs(c, t, 'FAKE', 'REAL', 2.6);
  [gA, gB].forEach(g => { E.shaded(c, 230, g - 74, 600, 30, 10, '#6a5a7a', '#3a3048'); E.line(c, 250, g - 44, 250, g, '#555', 6); E.line(c, 810, g - 44, 810, g, '#555', 6); });
  // you talk in both rows
  [gA, gB].forEach((g, r) => E.figure(c, { x: 340, y: g - 74 - 66 * .95 + 10, s: .95, f: 1, pose: { ...E.pose('sit'), aF: 1.0 + Math.sin(t * 9) * .4, eF: .6 }, color: r ? '#fff' : '#ddd' }));
  const bub = E.p(t, .2, .45, 'back');
  E.bubble(c, 'I had a really hard week…', 430, gA - 290, bub * (1 - .7 * E.p(t, 1.2, 2.2)), { size: 28, tail: -1 });
  E.bubble(c, 'I had a really hard week…', 430, gB - 290, bub, { size: 28, tail: -1 });
  // fake: scrolling, not even looking
  const ff = { x: 680, y: gA - 74 - 66 * .95 + 10, s: .95, f: 1, color: '#8a8a8a', pose: { ...E.pose('phone'), hd: .55 } };
  E.figure(c, ff); const [px, py] = E.hand(ff); E.phone(c, px + 4, py - 16, 1.4); E.glowDot(c, px, py - 20, 80, 'rgba(120,190,255,.45)');
  E.text(c, 'mm.', 760, gA - 260, { size: 34, weight: 800, color: GREY, alpha: E.p(t, 1.2, 1.5) });
  // real: turned toward you, nodding, hearts
  const nod = Math.sin(t * 5) * .15;
  E.figure(c, { x: 640, y: gB - 74 - 66 * .95 + 10, s: .95, f: -1, color: k > .5 ? GOLD : '#fff', pose: { ...E.pose('sit'), tor: .25, hd: .2 + nod, aF: 1.2, eF: .4 } });
  if (t > 2.6) for (let i = 0; i < 4; i++) { const q = ((t - 2.6) * .8 + i / 4) % 1; E.heart(c, 500 + Math.sin(i * 2 + t) * 60, gB - 250 - q * 120, .5, Math.sin(q * Math.PI)); }
} },
// 5 — Under pressure, the real ones stay
{ dur: 5, cam: [180, 700, 900, 1330], draw(c, t) {
  E.title(c, 'Pressure shows who stays.', W / 2, 420, t, -1, 2.5, { size: 52, weight: 900 });
  E.title(c, 'Fewer friends. Real ones.', W / 2, 420, t, 2.7, 1e9, { size: 56, weight: 900, color: GOLD });
  const cx = 540, cy = 1060, R = 260, shake = E.p(t, .6, 2.2) * (1 - E.p(t, 2.4, 2.8));
  E.shake(c, t, .6, 1.8, 10 * shake + 2);
  E.shaded(c, 200, 1340, 680, 22, 6, '#8a8a8a', '#4a4a4a');
  c.save(); c.strokeStyle = '#ddd'; c.lineWidth = 16; c.setLineDash([60, 26]); c.lineDashOffset = -t * 60; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.restore();
  E.text(c, 'YOUR CIRCLE', cx, cy - R - 40, { size: 30, weight: 900, ls: 5, color: GREY });
  E.figure(c, { x: cx, y: cy + 30 - E.FIG_H * 1.05, s: 1.05, pose: t < 2.6 ? E.pose('sad') : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.6, 2.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 }, color: t > 2.6 ? GOLD : '#fff' });
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2 + .3, real = i === 1 || i === 4;
    let x = cx + Math.cos(a) * R * .68, y = cy + Math.sin(a) * R * .55 + 40;
    const drop = real ? 0 : E.p(t, 1.0 + i * .15, 1.6 + i * .15, 'in');
    x += Math.cos(a) * drop * 420; y += drop * 700;
    if (drop >= 1) continue;
    E.figure(c, { x, y: y - E.FIG_H * .7, s: .7, rot: drop * (i % 2 ? 1.5 : -1.5), color: real ? (t > 2.6 ? GOLD : '#ddd') : '#6a6a6a', pose: real && t > 2.6 ? E.pose('cheer') : E.pose('stand') });
  }
  E.glowDot(c, cx, cy, 380, 'rgba(245,197,66,.35)', E.p(t, 2.6, 3.2));
  E.particles(c, cx, cy - 80, t - 2.6, { n: 60, speed: 600, grav: 200 });
} },
] };
