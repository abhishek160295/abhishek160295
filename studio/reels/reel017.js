// Reel 017 — "5 minutes that change your day"
const habit = (c, t, n, str, pay, size = 52) => {
  E.text(c, `5-MINUTE HABIT ${n}/5`, W / 2, 360, { size: 28, weight: 900, ls: 6, color: GOLD, hud: true });
  const k = E.p(t, pay, pay + .25);
  E.text(c, str, W / 2, 440, { size, weight: 900, family: '"Inter Display", Inter', color: '#fff', alpha: 1 - k, hud: true });
  E.text(c, str, W / 2, 440, { size, weight: 900, family: '"Inter Display", Inter', color: GOLD, alpha: k, hud: true });
};
const sparkle = (c, x, y, t, t0, n = 6, r = 160) => { if (t < t0) return; for (let i = 0; i < n; i++) { const q = ((t - t0) * .9 + i / n) % 1, a = i / n * 6.28 + t; const sx = x + Math.cos(a) * r * q, sy = y + Math.sin(a) * r * .6 * q - q * 60; c.save(); c.globalAlpha = Math.sin(q * Math.PI); c.translate(sx, sy); c.rotate(t * 3 + i); c.fillStyle = GOLD; c.beginPath(); for (let p = 0; p < 4; p++) { c.rotate(Math.PI / 2); c.moveTo(0, 0); c.lineTo(4, 4); c.lineTo(0, 16); } c.fill(); c.restore(); } };
const REEL = { title: '5 minutes that change your day', bpm: 150, pace: 'fast', scenes: [
// 1 — Make your bed
{ dur: 5, cam: [200, 940, 860, 1320], draw(c, t) {
  E.title(c, '5 minutes that change your day:', W / 2, 290, t, -1, 1e9, { size: 36, weight: 700, color: '#bbb' });
  habit(c, t, 1, 'Make your bed.', 2.4, 60);
  const gy = 1300, bx = 300, bw = 460, tidy = E.p(t, .6, 2.4, 'inOut');
  E.ground(c, gy, 160, 900);
  E.shaded(c, bx, gy - 110, bw, 60, 12, '#6a6a76', '#33333c'); E.line(c, bx + 14, gy - 50, bx + 14, gy, '#777', 9); E.line(c, bx + bw - 14, gy - 50, bx + bw - 14, gy, '#777', 9);
  E.shaded(c, bx - 10, gy - 230, 26, 180, 8, '#888', '#4a4a4a');
  // pillow: thrown on the floor, then placed
  const px = E.lerp(820, bx + 50, tidy), py = E.lerp(gy - 30, gy - 140, tidy) - Math.sin(tidy * Math.PI) * 120;
  c.save(); c.translate(px, py); c.rotate((1 - tidy) * .7); E.shaded(c, -60, -24, 120, 48, 20, '#ffffff', '#c8c8c8'); c.restore();
  // blanket: crumpled zig-zag → smooth sheet
  c.save(); const g = c.createLinearGradient(0, gy - 170, 0, gy - 100); g.addColorStop(0, '#6a8fc0'); g.addColorStop(1, '#3a5a88'); c.fillStyle = g; c.beginPath(); c.moveTo(bx + 120, gy - 108);
  for (let i = 0; i <= 12; i++) { const x = bx + 120 + (bw - 130) * i / 12, y = gy - 130 - (1 - tidy) * (i % 2 ? 50 : 10) - tidy * 6; c.lineTo(x, y); }
  c.lineTo(bx + bw - 10, gy - 108); c.closePath(); c.fill(); c.restore();
  const pull = Math.sin(t * 10) * .25 * (1 - tidy);
  E.figure(c, { x: bx + bw + 40, y: gy - E.FIG_H - 2, f: -1, pose: t < 2.4 ? { ...E.pose('push'), tor: -.2 + pull, aF: 1.4, aB: 1.3, lB: -.2, lF: .3 } : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.6, 3.0, 'back')) });
  sparkle(c, bx + bw / 2, gy - 170, t, 2.4, 8, 240);
  E.particles(c, bx + bw / 2, gy - 150, t - 2.4, { n: 50, speed: 520, grav: 300 });
} },
// 2 — Drink a glass of water
{ dur: 5, cam: [300, 880, 800, 1320], draw(c, t) {
  habit(c, t, 2, 'Drink a glass of water.', 2.4, 52);
  const gy = 1300, sip = E.p(t, .5, 2.2, 'inOut'), up = Math.sin(Math.min(1, sip) * Math.PI);
  E.ground(c, gy, 200, 900);
  const lvl = 1 - E.p(t, .7, 2.2);
  const col = `rgb(${Math.round(E.lerp(150, 245, E.p(t, 1.6, 2.6)))},${Math.round(E.lerp(150, 197, E.p(t, 1.6, 2.6)))},${Math.round(E.lerp(150, 66, E.p(t, 1.6, 2.6)))})`;
  const fig = { x: 520, y: gy - E.FIG_H * 1.15 - 2, s: 1.15, color: col, pose: t < 2.4 ? E.mix({ ...E.pose('sad'), aF: .4, eF: .9 }, { ...E.pose('stand'), tor: -.1, hd: -.4, aF: 2.0, eF: 2.2 }, up) : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.5, 2.8, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 } };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  if (t < 2.5) { c.save(); c.translate(hx - 4, hy - 26); c.rotate(-up * 1.1); c.strokeStyle = '#e8f4ff'; c.lineWidth = 5; c.strokeRect(-14, -28, 28, 56); c.fillStyle = 'rgba(120,190,255,.85)'; c.fillRect(-11, 25 - 50 * lvl, 22, 50 * lvl); c.restore(); }
  // energy rings once hydrated
  for (let i = 0; i < 3; i++) { const q = ((t - 2.4) * .9 + i / 3) % 1; if (t > 2.4) { c.save(); c.strokeStyle = GOLD; c.globalAlpha = 1 - q; c.lineWidth = 8; c.beginPath(); c.ellipse(520, gy - 160, 90 + q * 220, 30 + q * 70, 0, 0, 7); c.stroke(); c.restore(); } }
  E.particles(c, 520, gy - 300, t - 2.5, { n: 50, speed: 520, color: ICE });
  for (let i = 0; i < 14; i++) { const q = ((t * .6 + E.rnd(i)) % 1); E.glowDot(c, 340 + E.rnd(i + 4) * 360 + Math.sin(t * 3 + i) * 14, gy - 40 - q * 460, 14 + 8 * E.rnd(i + 2), 'rgba(160,210,255,.8)', Math.sin(q * Math.PI)); }
} },
// 3 — Step outside
{ dur: 5, cam: [140, 760, 940, 1320], draw(c, t) {
  habit(c, t, 3, 'Step outside.', 2.4, 60);
  const gy = 1300, open = E.p(t, .5, 1.1, 'out'), out = E.p(t, 1.1, 2.5, 'inOut');
  // outside: sun, grass, light
  const sun = E.p(t, 1.0, 2.4);
  E.glowDot(c, 820, 840, 520 * sun + 60, 'rgba(245,197,66,.4)');
  E.rays(c, 820, 840, 420, .35 * sun, GOLD, 16, t * .3);
  c.save(); c.fillStyle = GOLD; c.beginPath(); c.arc(820, 840, 64, 0, 7); c.fill(); c.restore();
  c.save(); c.fillStyle = '#2f6b3a'; c.fillRect(540, gy, 420, 30); c.restore();
  for (let i = 0; i < 14; i++) { const x = 560 + i * 28, h = 24 + (i % 3) * 10; E.line(c, x, gy, x + Math.sin(t * 3 + i) * 6, gy - h, GREEN, 5); }
  // the dark room you leave behind
  c.save(); c.fillStyle = '#121216'; c.fillRect(140, gy - 520, 400, 520); c.restore();
  E.rrect(c, 140, gy - 520, 400, 520, 6, null, '#555', 6);
  const dw = 160 * (1 - open * .85);
  E.shaded(c, 380, gy - 320, dw, 320, 4, '#8a5a3c', '#4a2e1e', '#c49a6c');
  E.glowDot(c, 470, gy - 160, 220, 'rgba(245,197,66,.35)', open);
  const x = E.lerp(260, 660, out), stretch = E.p(t, 2.6, 3.0, 'back');
  E.figure(c, { x, y: gy - E.FIG_H * 1.05 - 2, s: 1.05, color: out > .6 ? GOLD : '#bbb', pose: t < 1.1 ? { ...E.pose('point'), aF: 1.4 } : out < 1 ? E.walk(x / 24) : { ...E.mix(E.pose('stand'), E.pose('cheer'), stretch), aF: 2.7 + Math.sin(t * 4) * .2, aB: -2.7 + Math.sin(t * 4) * .2, tor: -.15 } });
  for (let i = 0; i < 3; i++) { if (t < 2.6) break; const q = ((t - 2.6) * .7 + i / 3) % 1, bx = 600 + q * 360, by = 840 + Math.sin(q * 9 + i) * 30; c.save(); c.strokeStyle = '#ddd'; c.lineWidth = 5; const w = Math.sin(t * 14 + i) * 12; c.beginPath(); c.moveTo(bx - 24, by - w); c.lineTo(bx, by); c.lineTo(bx + 24, by - w); c.stroke(); c.restore(); }
} },
// 4 — Text someone you love
{ dur: 5, cam: [160, 820, 920, 1320], draw(c, t) {
  habit(c, t, 4, 'Text someone you love.', 2.4, 52);
  const gy = 1300; E.ground(c, gy, 160, 920);
  const fig = { x: 280, y: gy - E.FIG_H - 2, pose: { ...E.pose('stand'), aF: 1.1 + Math.sin(t * 16) * .06 * (t < 1.2 ? 1 : 0), eF: 1.9, hd: t < 1.3 ? .35 : -.1 } };
  E.figure(c, fig); const [hx, hy] = E.hand(fig); E.phone(c, hx + 4, hy - 18, 1.6, 1, '#9fd3ff'); E.glowDot(c, hx, hy - 20, 90, 'rgba(120,190,255,.4)');
  const fly = E.p(t, 1.2, 2.2, 'inOut'), px = E.lerp(hx + 30, 780, fly), py = E.lerp(hy - 40, gy - 300, fly) - Math.sin(fly * Math.PI) * 260;
  if (t > 1.2 && t < 2.3) { c.save(); c.translate(px, py); c.rotate(-.3 + fly * .6); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-40, -10); c.lineTo(46, -26); c.lineTo(-10, 26); c.closePath(); c.fill(); c.fillStyle = '#ccc'; c.beginPath(); c.moveTo(-10, 26); c.lineTo(0, 4); c.lineTo(46, -26); c.fill(); c.restore();
    for (let i = 1; i < 10; i++) { const kk = Math.max(0, fly - i * .03); E.glowDot(c, E.lerp(hx + 30, 780, kk), E.lerp(hy - 40, gy - 300, kk) - Math.sin(kk * Math.PI) * 260, 10, 'rgba(255,255,255,.6)', 1 - i / 10); } }
  const got = E.p(t, 2.2, 2.6, 'back');
  E.figure(c, { x: 800, y: gy - E.FIG_H - 2, f: -1, color: got > .5 ? GOLD : '#aaa', pose: got > 0 ? { ...E.mix(E.pose('sad'), E.pose('cheer'), got), aF: 2.6 + Math.sin(t * 6) * .2 } : E.pose('sad') });
  if (t > 2.2) E.bubble(c, 'Needed this today.', 760, gy - 400, got, { size: 32, stroke: GOLD, color: GOLD, tail: 1 });
  for (let i = 0; i < 6; i++) { if (t < 2.6) break; const q = ((t - 2.6) * .8 + i / 6) % 1; E.heart(c, E.lerp(780, 300, q), gy - 300 - Math.sin(q * Math.PI) * 200, .7, Math.sin(q * Math.PI)); }
} },
// 5 — Write tomorrow's top 3
{ dur: 5, cam: [200, 760, 880, 1320], draw(c, t) {
  habit(c, t, 5, "Write tomorrow's top 3.", 2.6, 52);
  const gy = 1300; E.ground(c, gy, 200, 880);
  E.shaded(c, 470, 800, 380, 440, 16, '#fffaf0', '#e8dcc4', '#bba');
  E.text(c, 'TOMORROW', 660, 850, { size: 32, weight: 900, ls: 4, color: '#8a6a3a' });
  for (let i = 0; i < 3; i++) {
    const y = 940 + i * 100, w = E.p(t, .3 + i * .6, .8 + i * .6), tick = E.p(t, 2.6 + i * .3, 2.8 + i * .3, 'back');
    E.rrect(c, 500, y - 24, 48, 48, 10, tick > 0 ? GOLD : '#fff', '#8a6a3a', 4);
    if (tick > 0) { c.save(); c.strokeStyle = '#111'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(512, y); c.lineTo(520 + 4 * tick, y + 10 * tick); c.lineTo(540, y - 12 * tick); c.stroke(); c.restore(); E.particles(c, 524, y, t - 2.6 - i * .3, { n: 18, speed: 300, life: .7, seed: i * 4 }); }
    c.save(); c.strokeStyle = '#333'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(570, y); for (let k = 0; k <= 30 * w; k++) c.lineTo(570 + k * 8, y + Math.sin(k * 1.3) * 7); c.stroke(); c.restore();
  }
  const writing = t < 2.2, wi = Math.min(2, Math.floor(Math.max(0, t - .3) / .6));
  const fig = { x: 330, y: gy - E.FIG_H * 1.05 - 2, s: 1.05, pose: writing ? { ...E.pose('stand'), tor: .2, aF: 1.9 + Math.sin(t * 20) * .1, eF: .3 } : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 2.6, 2.9, 'back')), aF: 2.6 + Math.sin(t * 6) * .2 }, color: t > 2.6 ? GOLD : '#fff' };
  E.figure(c, fig);
  E.glowDot(c, 660, 1020, 360, 'rgba(245,197,66,.3)', E.p(t, 2.6, 3.2));
  sparkle(c, 660, 1000, t, 0, 10, 300);
  for (let i = 0; i < 3; i++) { const q = ((t * 1.3 + i / 3) % 1); E.text(c, ['✎', '✓', '★'][i], 560 + q * 220, 800 - q * 70, { size: 38, weight: 900, color: GOLD, alpha: Math.sin(q * Math.PI) }); }
} },
] };
