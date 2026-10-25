// Reel 020 — "Consistency beats talent"
const lab = (c, str, x, y, col = '#bbb') => E.text(c, str, x, y, { size: 30, weight: 900, ls: 5, color: col });
const REEL = { title: 'Consistency beats talent', bpm: 150, pace: 'fast', scenes: [
// 1 — The race
{ dur: 5, floor: 1300, cam: [80, 880, 1000, 1320], draw(c, t) {
  E.title(c, 'Talent starts fast.', W / 2, 420, t, -1, 2.5, { size: 58, weight: 900 });
  E.title(c, 'Consistency finishes first.', W / 2, 420, t, 2.7, 1e9, { size: 52, weight: 900, color: GOLD });
  const g1 = 1080, g2 = 1300;
  E.line(c, 80, g1, 1000, g1, '#555', 5); E.line(c, 80, g2, 1000, g2, '#555', 5);
  E.flag(c, 860, g1, .7, 0); E.flag(c, 860, g2, 1, 30);
  // talent: sprints, then stops to scroll
  const tx = Math.min(560, 120 + t * 420), stop = t > 1.05;
  E.figure(c, { x: tx, y: g1 - E.FIG_H * .75 - 2, s: .75, color: '#9a9a9a', pose: stop ? (t < 1.5 ? E.pose('stand') : { ...E.pose('sit'), aF: 1.0, eF: 1.9, hd: .45 }) : E.run(t * 18) });
  if (t > 1.5) { E.rrect(c, tx - 50, g1 - 52, 100, 14, 4, '#555'); const [px, py] = [tx + 30, g1 - 150]; E.phone(c, px, py, 1.3); E.glowDot(c, px, py, 70, 'rgba(120,190,255,.45)'); E.tag(c, 'GOT THIS', tx, g1 - 280, t, 1.6, { size: 24, color: '#aaa' }); }
  lab(c, 'TALENT', 560, g1 + 32, '#888');
  // consistency: same pace the whole way, wins
  const cx = E.lerp(120, 850, E.p(t, 0, 3.8, 'lin'));
  E.figure(c, { x: cx, y: g2 - E.FIG_H * .9 - 2, s: .9, color: t > 2.6 ? GOLD : '#fff', pose: cx < 845 ? E.walk(t * 9) : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.8, 4.1, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 } });
  lab(c, 'CONSISTENCY', 560, g2 + 36, GOLD);
  E.particles(c, 850, g2 - 220, t - 3.8, { n: 60, speed: 600, grav: 250 });
} },
// 2 — Water carves stone
{ dur: 5, floor: 1300, cam: [260, 720, 820, 1320], draw(c, t) {
  E.title(c, "One drop can't break a rock.", W / 2, 420, t, -1, 2.5, { size: 50, weight: 900 });
  E.title(c, 'Ten thousand can.', W / 2, 420, t, 2.7, 1e9, { size: 62, weight: 900, color: GOLD });
  const gy = 1300, rx = 540, top = 1060, depth = E.p(t, 0, 2.5, 'in'), through = t > 2.5;
  E.shaded(c, 300, 740, 480, 26, 6, '#8a8a8a', '#4a4a4a'); E.shaded(c, 520, 740, 40, 70, 4, '#9a9a9a', '#5a5a5a');
  // the rock with a groove that deepens until it breaks through
  c.save(); c.beginPath(); c.moveTo(330, gy); c.lineTo(360, top + 30); c.lineTo(440, top); c.lineTo(640, top - 10); c.lineTo(730, top + 40); c.lineTo(760, gy); c.closePath();
  const g = c.createLinearGradient(330, top, 760, gy); g.addColorStop(0, '#9a9a9a'); g.addColorStop(1, '#3e3e3e'); c.fillStyle = g; c.fill(); c.restore();
  const gh = through ? gy - top + 20 : (gy - top) * depth;
  c.save(); c.fillStyle = through ? GOLD : '#141414'; c.beginPath(); c.ellipse(rx, top + gh / 2, 18 + 14 * depth, gh / 2 + 2, 0, 0, 7); c.fill(); c.restore();
  if (through) { E.glowDot(c, rx, top + 120, 360, 'rgba(245,197,66,.5)', E.p(t, 2.5, 2.9)); E.rays(c, rx, gy - 40, 420, .35 * E.p(t, 2.5, 2.9), GOLD, 14, t * .3); }
  // falling drops
  for (let i = 0; i < 4; i++) { const q = ((t * 3 + i / 4) % 1), y = E.lerp(810, top + 10, q); if (t < 2.5) { c.save(); c.fillStyle = ICE; c.beginPath(); c.ellipse(rx, y, 9, 14, 0, 0, 7); c.fill(); c.restore(); } }
  E.particles(c, rx, top, (t * 3) % 1 * .33, { n: 10, speed: 220, color: ICE, grav: 600, life: .33, seed: Math.floor(t * 3) });
  const day = Math.max(1, Math.round(3650 * E.p(t, 0, 2.5, 'in')));
  E.tag(c, `DAY ${day}`, 820, 900, t, -1, { size: 32, color: through ? GOLD : '#ddd', fill: through ? '#2a2208' : '#0c0c0c' });
  E.particles(c, rx, top + 40, t - 2.5, { n: 60, speed: 600 });
} },
// 3 — The rope
{ dur: 5, floor: 1300, cam: [200, 720, 880, 1320], draw(c, t) {
  E.title(c, 'One big push?', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Small pulls reach the top.', W / 2, 420, t, 2.7, 1e9, { size: 54, weight: 900, color: GOLD });
  const gy = 1300, L = 380, R = 700, bar = 760;
  E.shaded(c, 240, bar - 24, 600, 24, 6, '#9a9a9a', '#4a4a4a');
  [L, R].forEach(x => { c.save(); c.strokeStyle = '#c8a46a'; c.lineWidth = 10; c.beginPath(); c.moveTo(x, bar); c.lineTo(x + Math.sin(t * 2 + x) * 4, gy - 20); c.stroke(); c.restore(); });
  // bell at the top of the right rope
  const ring = t > 3.2 ? Math.sin(t * 30) * .3 * (1 - E.p(t, 3.2, 4.6)) : 0;
  c.save(); c.translate(R + 70, bar); c.rotate(ring); c.fillStyle = GOLD; c.beginPath(); c.moveTo(-34, 70); c.quadraticCurveTo(-34, 10, 0, 6); c.quadraticCurveTo(34, 10, 34, 70); c.closePath(); c.fill(); c.beginPath(); c.arc(0, 76, 9, 0, 7); c.fill(); c.restore();
  if (t > 3.2) for (let i = 0; i < 3; i++) { const q = ((t - 3.2) * 1.4 + i / 3) % 1; c.save(); c.strokeStyle = GOLD; c.globalAlpha = 1 - q; c.lineWidth = 6; c.beginPath(); c.arc(R + 70, bar + 40, 50 + q * 120, -1, 1); c.stroke(); c.beginPath(); c.arc(R + 70, bar + 40, 50 + q * 120, Math.PI - 1, Math.PI + 1); c.stroke(); c.restore(); }
  // one big jump, then slide down and give up
  const jp = E.p(t, .2, .7, 'out'), sl = E.p(t, .9, 1.8, 'in');
  const ly = gy - E.FIG_H * .7 - 2 - jp * 170 + sl * 170;
  E.figure(c, { x: L - 20, y: ly, s: .7, color: '#9a9a9a', pose: t < 1.8 ? { ...E.pose('climb'), aF: 2.9, aB: 2.7 } : E.pose('sad') });
  E.text(c, 'ONE BIG PUSH', L - 20, gy + 40, { size: 26, weight: 900, ls: 3, color: '#888' });
  // steady climber
  const cl = E.p(t, .2, 3.2, 'lin'), ry = gy - E.FIG_H * .7 - 2 - cl * 200, ph = t * 9;
  E.figure(c, { x: R - 20, y: ry, s: .7, color: t > 2.6 ? GOLD : '#fff', pose: cl < 1 ? { ...E.pose('climb'), aF: 2.7 + Math.sin(ph) * .25, aB: 2.5 - Math.sin(ph) * .25, lF: .5 + Math.sin(ph) * .4, lB: -.3 - Math.sin(ph) * .4 } : { ...E.pose('climb'), aF: 2.9 + Math.sin(t * 8) * .1 } });
  E.text(c, 'EVERY DAY', R, gy + 40, { size: 26, weight: 900, ls: 3, color: GOLD });
  E.particles(c, R + 70, bar + 60, t - 3.2, { n: 50, speed: 500 });
} },
// 4 — One stroke a day
{ dur: 5, floor: 1300, cam: [200, 700, 900, 1320], draw(c, t) {
  E.title(c, 'Not much progress today?', W / 2, 420, t, -1, 2.5, { size: 52, weight: 900 });
  E.title(c, 'One stroke a day. A masterpiece.', W / 2, 420, t, 2.7, 1e9, { size: 46, weight: 900, color: GOLD });
  const gy = 1300, x0 = 400, y0 = 760, w = 460, h = 420;
  E.line(c, x0 + 60, y0 + h, x0 + 20, gy, '#8a5a3c', 10); E.line(c, x0 + w - 60, y0 + h, x0 + w - 20, gy, '#8a5a3c', 10);
  E.shaded(c, x0 - 14, y0 - 14, w + 28, h + 28, 8, '#9a6b4a', '#5a3a26');
  c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip(); c.fillStyle = '#f2ede2'; c.fillRect(x0, y0, w, h);
  const k = E.p(t, .1, 2.6, 'lin'), n = Math.floor(k * 9);
  const strokes = [
    () => { const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#2a3a6a'); g.addColorStop(1, '#e8925a'); c.fillStyle = g; c.fillRect(x0, y0, w, h * .7); },
    () => { c.fillStyle = GOLD; c.beginPath(); c.arc(x0 + w * .62, y0 + h * .58, 70, 0, 7); c.fill(); },
    () => { c.fillStyle = '#3a3a5a'; c.beginPath(); c.moveTo(x0, y0 + h * .72); c.lineTo(x0 + w * .28, y0 + h * .38); c.lineTo(x0 + w * .55, y0 + h * .72); c.fill(); },
    () => { c.fillStyle = '#2a2a44'; c.beginPath(); c.moveTo(x0 + w * .35, y0 + h * .72); c.lineTo(x0 + w * .72, y0 + h * .3); c.lineTo(x0 + w, y0 + h * .72); c.fill(); },
    () => { c.fillStyle = '#2f6b3a'; c.fillRect(x0, y0 + h * .7, w, h * .3); },
    () => { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x0 + w * .28, y0 + h * .38); c.lineTo(x0 + w * .22, y0 + h * .46); c.lineTo(x0 + w * .34, y0 + h * .46); c.fill(); },
    () => { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x0 + w * .72, y0 + h * .3); c.lineTo(x0 + w * .65, y0 + h * .4); c.lineTo(x0 + w * .79, y0 + h * .4); c.fill(); },
    () => { c.fillStyle = '#4a8a4a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x0 + 40 + i * 70, y0 + h); c.lineTo(x0 + 60 + i * 70, y0 + h * .78); c.lineTo(x0 + 80 + i * 70, y0 + h); c.fill(); } },
    () => { c.strokeStyle = '#fff'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { const bx = x0 + 80 + i * 60, by = y0 + 80 + i * 20; c.beginPath(); c.moveTo(bx - 14, by - 6); c.lineTo(bx, by); c.lineTo(bx + 14, by - 6); c.stroke(); } },
  ];
  strokes.slice(0, n).forEach(f => f());
  c.restore();
  const fig = { x: 300, y: gy - E.FIG_H - 2, color: t > 2.6 ? GOLD : '#fff', pose: t < 2.6 ? { ...E.pose('stand'), tor: .15, aF: 1.6 + Math.sin(t * 14) * .3, eF: .2 } : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.7, 3.0, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 } };
  E.figure(c, fig);
  if (t < 2.6) { const [hx, hy] = E.hand(fig); E.line(c, hx, hy, hx + 70, hy - 30, '#b08060', 7); E.glowDot(c, hx + 74, hy - 32, 14, ['#e8925a', GOLD, '#2f6b3a'][Math.floor(t * 3) % 3]); }
  E.tag(c, `DAY ${Math.max(1, Math.round(k * 365))}`, 630, 690, t, -1, { size: 30, color: k >= 1 ? GOLD : '#ddd', fill: k >= 1 ? '#2a2208' : '#0c0c0c' });
  E.glowDot(c, x0 + w / 2, y0 + h / 2, 420, 'rgba(245,197,66,.25)', E.p(t, 2.6, 3.2));
  E.particles(c, x0 + w / 2, y0 + 40, t - 2.6, { n: 50, speed: 520 });
} },
// 5 — Small things snowball
{ dur: 5, floor: 1300, cam: [140, 680, 960, 1320], draw(c, t) {
  E.title(c, 'Start small.', W / 2, 420, t, -1, 2.5, { size: 64, weight: 900 });
  E.title(c, 'Small things snowball.', W / 2, 420, t, 2.7, 1e9, { size: 58, weight: 900, color: GOLD });
  const gy = 1300, slope = x => 760 + (x - 140) * .62;
  c.save(); const g = c.createLinearGradient(0, 760, 0, gy); g.addColorStop(0, '#e8eef4'); g.addColorStop(1, '#8a98a8'); c.fillStyle = g; c.beginPath(); c.moveTo(140, 760); c.lineTo(960, slope(960)); c.lineTo(960, gy + 40); c.lineTo(140, gy + 40); c.fill(); c.restore();
  const k = E.p(t, .1, 2.6, 'in'), x = E.lerp(170, 740, k), r = E.lerp(10, 150, Math.pow(k, 1.6));
  // the wall it smashes
  const hit = t > 2.6, wx = 780;
  if (!hit) { for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) E.rrect(c, wx + j * 40 - 60 + (i % 2) * 20, gy - 40 - i * 52 + 0, 38, 48, 4, '#7a3a2a', '#a05a3a', 2); E.tag(c, 'IMPOSSIBLE', wx, gy - 360, t, -1, { size: 26, color: RED, fill: '#2a0d0f' }); }
  else for (let i = 0; i < 18; i++) { const q = E.p(t, 2.6, 3.6, 'out'), a = -.4 - E.rnd(i) * 2.2, sp = 300 + E.rnd(i + 3) * 500; c.save(); c.translate(wx + Math.cos(a) * sp * q, gy - 150 + Math.sin(a) * sp * q + 500 * q * q); c.rotate(q * 6 + i); E.rrect(c, -19, -24, 38, 48, 4, '#7a3a2a'); c.restore(); }
  E.shake(c, t, 2.6, .5, 26);
  const bx = hit ? E.lerp(740, 800, E.p(t, 2.6, 3.4)) : x, by = slope(Math.min(bx, 800)) - r;
  c.save(); const sg = c.createRadialGradient(bx - r * .4, by - r * .4, r * .1, bx, by, r); sg.addColorStop(0, '#ffffff'); sg.addColorStop(1, '#a8b8c8'); c.fillStyle = sg; c.beginPath(); c.arc(bx, Math.min(by, gy - r), r, 0, 7); c.fill(); c.restore();
  E.tag(c, `DAY ${Math.max(1, Math.round(365 * k))}`, 300, 900, t, -1, { size: 32, color: hit ? GOLD : '#ddd', fill: hit ? '#2a2208' : '#0c0c0c' });
  E.flash(c, t, 2.6, .35, '245,197,66', .4);
  E.particles(c, wx, gy - 200, t - 2.6, { n: 80, speed: 800, grav: 300, color: '#e8eef4' });
  E.rays(c, wx, gy - 200, 520, .3 * E.p(t, 2.7, 3.1), GOLD, 16, t * .3);
} },
] };
