// Day 001 — "Start before you're ready"
const chair = (c, x, gy, s = 1) => {
  c.save(); c.strokeStyle = '#9a6b4a'; c.lineWidth = 9 * s; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - 30 * s, gy - 58 * s); c.lineTo(x + 40 * s, gy - 58 * s);
  c.moveTo(x - 30 * s, gy - 58 * s); c.lineTo(x - 30 * s, gy); c.moveTo(x + 40 * s, gy - 58 * s); c.lineTo(x + 40 * s, gy);
  c.moveTo(x - 30 * s, gy - 58 * s); c.lineTo(x - 38 * s, gy - 150 * s); c.stroke(); c.restore();
};

const REEL = { title: "Start before you're ready", bpm: 150, scenes: [
// 1 — Waiting vs Starting
{ dur: 6.4, cues: [[0, 'tick'], [5.15, 'pop']], draw(c, t) {
  const s = .85, g1 = 900, g2 = 1440;
  E.text(c, 'Waiting for the right time', W / 2, 470, { size: 44, weight: 600 });
  E.ground(c, g1, 90, 990);
  chair(c, 255, g1, s);
  const slump = E.p(t, 4, 5.2);
  E.figure(c, { x: 262, y: g1 - 66 * s - 4, s, pose: E.mix(E.pose('sit'), { ...E.pose('sit'), tor: .3, hd: .6 }, slump) });
  // clock spinning faster and faster
  const cx = 640, cy = 720, r = 74, spin = t * t * 1.3;
  c.save(); c.strokeStyle = '#ddd'; c.lineWidth = 6; c.shadowColor = '#fff'; c.shadowBlur = 10;
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.beginPath(); c.moveTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14)); c.lineTo(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6)); c.lineWidth = 3; c.stroke(); }
  c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.sin(spin / 12) * 38, cy - Math.cos(spin / 12) * 38); c.stroke();
  c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.sin(spin) * 58, cy - Math.cos(spin) * 58); c.stroke();
  c.restore();
  E.title(c, 'Starting now', W / 2, 1040, t, -1, 1e9, { size: 44, weight: 600 });
  const k = E.p(t, .5, 4.9, 'inOut'), x = E.lerp(140, 780, k);
  for (let i = 0; i < 16; i++) {
    const bx = 100 + i * 60; if (bx > x + 70) break;
    const a = E.p(x + 70 - bx, 0, 40, 'back');
    E.rrect(c, bx, g2 - 14 * a + 0, 54, 16 * a, 4, i > 13 ? GOLD : '#d9d9d9');
  }
  const done = t > 5.0;
  E.figure(c, { x, y: g2 - E.FIG_H * s - 2, s, pose: done ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.1, 5.5, 'back')) : E.walk(x / 26) });
  if (t > 4.95) E.trophy(c, 880, g2 - 6, E.p(t, 4.95, 5.35, 'back') * .8, 1, 40);
  E.particles(c, 880, g2 - 50, t - 5.15, { n: 26, speed: 380, grav: 300 });
} },
// 2 — Overthinking → One step
{ dur: 6.4, cues: [[3.3, 'whoosh'], [4.55, 'pop']], draw(c, t) {
  const gy = 1260, fx = 250;
  E.title(c, 'Overthinking', W / 2, 470, t, .1, 3.0, { size: 56, weight: 700 });
  E.title(c, 'Taking one step', W / 2, 470, t, 3.35, 1e9, { size: 56, weight: 700, color: GOLD, glow: 22 });
  E.ground(c, gy, 90, 990, '#3d3d3d');
  const N = 220, grow = E.p(t, .2, 2.7, 'out'), morph = E.p(t, 3.3, 4.5, 'inOut');
  const walkK = E.p(t, 4.6, 6.3, 'inOut'), x = E.lerp(fx, 640, walkK);
  c.save(); c.lineWidth = 7; c.lineJoin = 'round'; c.lineCap = 'round';
  const col = morph < .5 ? RED : GOLD; c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = 18;
  c.beginPath();
  const upto = Math.floor(N * grow);
  for (let i = 0; i <= upto; i++) {
    const u = i / N, sc = .35 + .65 * grow, jit = Math.sin(t * 9 + i) * 3 * (1 - morph);
    const sx = 620 + sc * 250 * Math.sin(2 * Math.PI * 3.1 * u + 1.3) * Math.cos(2 * Math.PI * 1.7 * u) + jit;
    const sy = 790 + sc * 190 * Math.sin(2 * Math.PI * 4.3 * u) * Math.cos(2 * Math.PI * .9 * u + .4) + jit;
    const tx = 320 + 660 * u, ty = gy;
    const px = E.lerp(sx, tx, morph), py = E.lerp(sy, ty, morph);
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.stroke(); c.restore();
  // thought bubbles
  const bub = 1 - morph;
  [[330, 1010, 9], [380, 960, 13], [440, 905, 17]].forEach(([bx, by, r], i) => {
    const a = E.p(t, .1 + i * .15, .4 + i * .15) * bub; c.save(); c.globalAlpha = a; c.fillStyle = RED; c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill(); c.restore();
  });
  const pose = t < 4.6 ? E.mix(E.pose('sad'), E.pose('stand'), E.p(t, 3.2, 3.8)) : E.walk(x / 26);
  E.figure(c, { x, y: gy - E.FIG_H - 2, pose });
  if (t > 4.5 && t < 6.4) E.glowDot(c, x, gy, 120, 'rgba(245,197,66,.35)', E.p(t, 4.5, 5));
} },
// 3 — Comfort zone pop
{ dur: 6.4, cues: [[1.2, 'rise'], [3.6, 'impact']], draw(c, t) {
  E.shake(c, t, 3.6, .45, 22);
  const cx = 540, cy = 1000, R = 190, popped = t >= 3.6;
  E.title(c, 'It feels safe in here…', W / 2, 470, t, .1, 3.4, { size: 50, weight: 600 });
  E.title(c, 'Growth begins', W / 2, 440, t, 4.0, 1e9, { size: 58, weight: 800, color: GOLD, glow: 24 });
  E.title(c, 'where comfort ends.', W / 2, 515, t, 4.25, 1e9, { size: 58, weight: 800, color: GOLD, glow: 24 });
  const feet = cy + 128;
  const bulge = popped ? 0 : 150 * E.p(t, 1.3, 3.5, 'in') + Math.sin(t * 22) * 6 * E.p(t, 1.3, 2);
  if (!popped) {
    E.text(c, 'COMFORT ZONE', cx, cy - R - 50, { size: 28, weight: 700, ls: 5, color: GREY });
    c.save(); c.strokeStyle = '#fff'; c.lineWidth = 6; c.shadowColor = '#fff'; c.shadowBlur = 14; c.beginPath();
    for (let i = 0; i <= 200; i++) {
      const a = i / 200 * Math.PI * 2; let d = Math.atan2(Math.sin(a), Math.cos(a));
      const r = R + bulge * Math.exp(-(d * d) / .12) * (1 + .15 * Math.cos(a * 2)) * (Math.sin(a + Math.PI / 2) > -2 ? 1 : 1);
      const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * .98;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath(); c.stroke(); c.restore();
    E.line(c, cx - 150, feet, cx + 150 + bulge * .6, feet, '#5a5a5a', 5);
  } else {
    const k = E.p(t, 3.6, 4.3, 'out');
    c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#fff'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R + 900 * k, 0, 7); c.stroke(); c.restore();
    E.line(c, E.lerp(cx - 150, 90, k), feet, E.lerp(cx + 230, 990, k), feet, '#6b6b6b', 5);
    E.particles(c, cx + R + 60, cy, t - 3.6, { n: 60, speed: 900, grav: 200, color: '#fff', size: 6 });
  }
  let x, pose;
  if (t < 1.1) { x = cx - 30; pose = E.mix(E.pose('stand'), E.pose('push'), E.p(t, .6, 1.1)); }
  else if (!popped) { x = cx + 40 + bulge * .62; pose = E.mix(E.pose('push'), { ...E.pose('push'), lB: -.8, kB: .1 }, (Math.sin(t * 6) + 1) / 2 * .5); }
  else { x = E.lerp(cx + 135, cx + 160, E.p(t, 3.6, 4)); pose = E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.4, 4.9, 'back')); }
  E.figure(c, { x, y: feet - E.FIG_H * .8 - 2, s: .8, pose, glow: popped ? 20 : 0 });
  E.flash(c, t, 3.6, .4);
} },
// 4 — 1% better
{ dur: 6.4, cues: [[.5, 'rise'], [4.5, 'impact']], draw(c, t) {
  E.title(c, '1% better every day', W / 2, 470, t, .1, 4.6, { size: 54, weight: 700 });
  E.title(c, 'Small wins. Massive life.', W / 2, 470, t, 4.9, 1e9, { size: 54, weight: 800, color: GOLD, glow: 22 });
  const ox = 170, oy = 1180, gw = 760, gh = 560;
  E.line(c, ox, oy, ox + gw, oy, '#555', 4); E.line(c, ox, oy, ox, oy - gh, '#555', 4);
  E.text(c, 'Day 1', ox, oy + 36, { size: 26, color: GREY }); E.text(c, 'Day 365', ox + gw, oy + 36, { size: 26, color: GREY });
  const n = 365 * E.p(t, .6, 4.4, 'inOut');
  const curve = (base, col) => {
    c.save(); c.strokeStyle = col; c.lineWidth = 7; c.shadowColor = col; c.shadowBlur = 16; c.lineJoin = 'round'; c.beginPath();
    let px, py;
    for (let k = 0; k <= n; k += 1) { px = ox + gw * k / 365; py = oy - Math.pow(base, k) * gh / 38; k ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke(); c.restore(); return [px ?? ox, py ?? oy - gh / 38];
  };
  const [rx, ry] = curve(.99, RED);
  const [gx, gy] = curve(1.01, GREEN);
  E.figure(c, { x: gx, y: gy - E.FIG_H * .32 - 8, s: .32, lw: 15, pose: t < 4.5 ? E.run(t * 14) : E.pose('cheer'), glow: 14, color: '#fff' });
  const g = Math.pow(1.01, n), r = Math.pow(.99, n);
  E.text(c, '1% better daily', 200, 1290, { size: 36, weight: 600, color: '#bbb', align: 'left' });
  E.text(c, '×' + g.toFixed(2), 880, 1290, { size: 48, weight: 800, color: GREEN, align: 'right', glow: t > 4.4 ? 20 : 0 });
  E.text(c, '1% worse daily', 200, 1375, { size: 36, weight: 600, color: '#bbb', align: 'left' });
  E.text(c, '×' + r.toFixed(2), 880, 1375, { size: 48, weight: 800, color: RED, align: 'right' });
  E.flash(c, t, 4.5, .3, '61,220,132', .25);
} },
// 5 — IMPOSSIBLE → I'M POSSIBLE
{ dur: 6.4, cues: [[2.6, 'whoosh'], [3.35, 'impact']], draw(c, t) {
  const size = 116, base = 1010, font = `900 ${size}px Inter`;
  c.save(); c.font = font; c.letterSpacing = '4px';
  const A = 'IMPOSSIBLE', B = "I'M POSSIBLE";
  const wA = c.measureText(A).width, wB = c.measureText(B).width;
  const PA = [...A].map((_, k) => W / 2 - wA / 2 + c.measureText(A.slice(0, k)).width);
  const PB = [...B].map((_, k) => W / 2 - wB / 2 + c.measureText(B.slice(0, k)).width);
  c.restore();
  const xA = k => PA[k], xB = k => PB[k];
  E.title(c, 'They called it', W / 2, 690, t, .1, 3.0, { size: 46, weight: 600, color: '#ccc' });
  E.title(c, 'The word itself says it.', W / 2, 690, t, 3.9, 1e9, { size: 48, weight: 700 });
  E.shake(c, t, 3.35, .4, 16);
  const m = E.p(t, 2.6, 3.3, 'back'), lit = E.p(t, 3.3, 3.7);
  c.save(); c.font = font; c.letterSpacing = '4px'; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  for (let j = 0; j < A.length; j++) {
    const to = j === 0 ? 0 : j === 1 ? 2 : j + 2;
    const x = E.lerp(xA(j), xB(to), m);
    c.fillStyle = lit > 0 ? `rgb(${E.lerp(150, 245, lit)},${E.lerp(150, 197, lit)},${E.lerp(150, 66, lit)})` : '#969696';
    c.shadowColor = GOLD; c.shadowBlur = 30 * lit;
    c.fillText(A[j], x, base);
  }
  c.restore();
  // figure carrying the apostrophe across the top of the word
  const top = base - size * .73, s = .5;
  const target = (xA(1) + xA(0)) / 2 + 18;
  const wk = E.p(t, .2, 2.4, 'inOut');
  let fx = E.lerp(1010, target + 40, wk), fy = top - E.FIG_H * s - 1, pose;
  if (t < 2.4) { const w = E.walk(fx / 18); pose = { ...w, aB: -2.75, eB: -.5, aF: 2.75, eF: .5 }; }
  else if (t < 3.35) { const k = E.p(t, 2.6, 3.35, 'inOut'); const land = xB(4) + 40; fx = E.lerp(target + 40, land, k); fy -= Math.sin(k * Math.PI) * 170; pose = E.mix(E.pose('carryUp'), E.pose('jump'), Math.sin(k * Math.PI)); }
  else { fx = xB(4) + 40; pose = E.mix(E.pose('crouch'), E.pose('cheer'), E.p(t, 3.4, 3.9, 'back')); }
  const fig = { x: fx, y: fy, s, pose, f: t < 2.4 ? -1 : 1, glow: lit * 20 };
  E.figure(c, fig);
  // apostrophe
  const [hx, hy] = E.hand({ ...fig, pose: t < 2.4 ? pose : E.pose('carryUp') });
  const drop = E.p(t, 2.5, 3.3, 'in');
  const ax = E.lerp(t < 2.4 ? hx : (target + 40), xB(1), drop), ay = E.lerp(t < 2.4 ? hy - 30 : top - 140, base, drop);
  c.save(); c.font = font; c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 30;
  c.fillText("'", ax - (drop < 1 ? 14 : 0) * (1 - drop), ay); c.restore();
  E.rays(c, W / 2, base - 45, 700, lit * (1 - E.p(t, 4.2, 6.4)) * .35, GOLD, 16, t * .2);
  E.flash(c, t, 3.35, .45, '245,197,66', .35);
} },
] };
