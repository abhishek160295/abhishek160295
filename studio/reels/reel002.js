// Day 002 — "Small choices, big life"
const bed = (c, x, gy) => {
  E.rrect(c, x, gy - 70, 300, 34, 8, '#2b2b2b', '#777', 4);
  E.rrect(c, x + 8, gy - 98, 70, 26, 12, '#cfcfcf');
  E.line(c, x + 10, gy - 36, x + 10, gy, '#777', 6); E.line(c, x + 290, gy - 36, x + 290, gy, '#777', 6);
  E.line(c, x, gy - 70, x, gy - 140, '#777', 7);
};
const clock = (c, x, y, t, label, col) => {
  const ring = t > .5 && t < 1.25, sh = ring ? Math.sin(t * 90) * 6 : 0;
  c.save(); c.translate(x + sh, y);
  E.rrect(c, -62, -36, 124, 72, 14, '#111', '#ddd', 4);
  E.text(c, label, 0, 2, { size: 36, weight: 800, color: col, glow: 14, family: 'Inter' });
  if (ring) { c.strokeStyle = '#fff'; c.lineWidth = 4; for (const d of [-1, 1]) { c.beginPath(); c.arc(0, 0, 90, -Math.PI / 2 + d * .5 - .25, -Math.PI / 2 + d * .5 + .25); c.stroke(); } }
  c.restore();
};
const hm = m => { const h = Math.floor(m / 60), mm = Math.floor(m % 60); return `${h}:${String(mm).padStart(2, '0')}`; };

const REEL = { title: 'Small choices, big life', bpm: 150, scenes: [
// 1 — Snooze vs Rise
{ dur: 6.4, cues: [[.5, 'tick'], [5.0, 'pop']], draw(c, t) {
  const s = .8, g1 = 900, g2 = 1440;
  E.text(c, 'Snooze', W / 2, 470, { size: 48, weight: 700, color: '#bbb' });
  E.text(c, 'Rise', W / 2, 1030, { size: 48, weight: 700 });
  // top: stays in bed, time flies
  E.ground(c, g1, 90, 990); bed(c, 120, g1);
  const m1 = 300 + 290 * E.p(t, 1.6, 5.6, 'in');
  clock(c, 560, g1 - 60, t, hm(m1), m1 > 420 ? RED : '#fff');
  const reach = E.p(t, 1.0, 1.25) * (1 - E.p(t, 1.35, 1.6));
  E.figure(c, { x: 300, y: g1 - 92, s, rot: -Math.PI / 2, pose: { ...E.pose('stand'), aF: E.lerp(.1, -1.6, reach), eF: .1 } });
  for (let i = 0; i < 3; i++) { const k = ((t - 1.6 + i * .6) % 1.8) / 1.8; if (t > 1.6) E.text(c, 'z', 200 + k * 80 + i * 10, g1 - 150 - k * 140, { size: 30 + i * 8, weight: 800, color: '#888', alpha: Math.sin(k * Math.PI) }); }
  // bottom: gets up and climbs
  E.ground(c, g2, 90, 990); bed(c, 120, g2); clock(c, 560, g2 - 60, t, '5:00', '#fff');
  let x = 300, y = g2 - 92, rot = -Math.PI / 2, pose = E.pose('stand');
  if (t > 1.1) { const k = E.p(t, 1.1, 1.6, 'out'); rot = E.lerp(-Math.PI / 2, 0, k); x = E.lerp(300, 470, k); y = E.lerp(g2 - 92, g2 - 68 - E.FIG_H * s, k); }
  if (t > 1.6) {
    const steps = 5, sx = 640, sw = 66, sh = 52;
    for (let i = 0; i < steps; i++) { const a = E.p(t, 1.7 + i * .12, 1.95 + i * .12, 'back'); E.rrect(c, sx + i * sw, g2 - (i + 1) * sh * a, sw - 4, (i + 1) * sh * a, 4, i === steps - 1 ? '#3a3a3a' : '#2a2a2a', '#999', 3); }
    const k = E.p(t, 1.8, 4.9, 'inOut'), px = E.lerp(470, sx + steps * sw - 30, k);
    const lvl = Math.max(0, Math.min(steps, Math.floor((px - sx + 20) / sw) + 1));
    rot = 0; x = px; y = g2 - 68 * (px < 560 ? 1 : 0) - lvl * sh - E.FIG_H * s + (px < 560 ? 0 : 0);
    if (px < sx - 20) y = g2 - E.FIG_H * s - 2;
    pose = t > 4.95 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.95, 5.3, 'back')) : E.run(px / 22);
  }
  E.figure(c, { x, y, s, rot, pose, glow: t > 4.95 ? 18 : 0 });
  if (t > 4.9) E.trophy(c, 1000, g2 - 5 * 52 - 4, E.p(t, 4.9, 5.3, 'back') * .55);
  E.particles(c, 1000, g2 - 300, t - 5.0, { n: 30, speed: 420 });
} },
// 2 — Drops fill the glass
{ dur: 6.4, cues: [[5.05, 'impact']], draw(c, t) {
  E.title(c, 'Small efforts…', W / 2, 440, t, .1, 2.0, { size: 52, weight: 700 });
  E.title(c, 'Nothing is happening…', W / 2, 440, t, 2.3, 4.7, { size: 52, weight: 700, color: '#bbb' });
  E.title(c, 'Until it is.', W / 2, 440, t, 5.05, 1e9, { size: 64, weight: 800, color: GOLD, glow: 26 });
  const day = Math.max(1, Math.round(365 * Math.pow(E.p(t, .3, 5.0, 'lin'), 1.6)));
  E.text(c, `Day ${day}`, W / 2, 530, { size: 34, weight: 600, color: GREY, ls: 2 });
  const gx = 540, gb = 1330, gw = 300, gh = 440, top = gb - gh;
  const lvl = t < 5.0 ? Math.pow(E.p(t, .4, 5.0, 'lin'), 3.2) : 1;
  const full = t >= 5.0;
  // water
  c.save(); c.beginPath(); c.moveTo(gx - gw / 2, top); c.lineTo(gx - gw / 2 + 24, gb); c.lineTo(gx + gw / 2 - 24, gb); c.lineTo(gx + gw / 2, top); c.closePath(); c.clip();
  const wy = gb - gh * lvl; const g = c.createLinearGradient(0, wy, 0, gb);
  g.addColorStop(0, full ? 'rgba(245,197,66,.95)' : 'rgba(170,215,255,.9)'); g.addColorStop(1, full ? 'rgba(160,110,20,.9)' : 'rgba(60,110,170,.9)');
  c.fillStyle = g; c.beginPath(); c.moveTo(gx - gw, wy + Math.sin(t * 6) * 4);
  for (let x = -gw; x <= gw; x += 20) c.lineTo(gx + x, wy + Math.sin(t * 6 + x / 30) * 4);
  c.lineTo(gx + gw, gb); c.lineTo(gx - gw, gb); c.fill(); c.restore();
  // glass
  c.save(); c.strokeStyle = '#eee'; c.lineWidth = 6; c.shadowColor = full ? GOLD : '#fff'; c.shadowBlur = full ? 30 : 10;
  c.beginPath(); c.moveTo(gx - gw / 2, top); c.lineTo(gx - gw / 2 + 24, gb); c.lineTo(gx + gw / 2 - 24, gb); c.lineTo(gx + gw / 2, top); c.stroke(); c.restore();
  E.ground(c, gb + 3, 200, 880, '#444');
  // figure on a ledge dropping water
  const lx = 640, ly = 800; E.line(c, 520, ly, 920, ly, '#555', 5);
  const fig = { x: lx, y: ly - E.FIG_H * .7 - 2, s: .7, f: -1, pose: full ? E.pose('cheer') : E.pose('point') };
  E.figure(c, fig);
  const [hx, hy] = E.hand(fig);
  if (!full) for (let i = 0; i < 12; i++) {
    const per = .45, k = ((t + i * per) % (per * 3)) / (per * 3) ; if (t < .3) break;
    const y = hy + k * (wy - hy);
    c.save(); c.fillStyle = ICE; c.shadowColor = ICE; c.shadowBlur = 10; c.beginPath(); c.ellipse(hx + (gx - hx) * Math.min(1, k * 3) * .0 + 0, y, 7, 11, 0, 0, 7); c.fill(); c.restore();
  }
  if (full) {
    E.glowDot(c, gx, top, 380, 'rgba(245,197,66,.35)', E.p(t, 5.0, 5.4));
    for (const d of [-1, 1]) for (let i = 0; i < 8; i++) {
      const k = ((t - 5 + i * .1) % .8) / .8; const x = gx + d * (gw / 2 + 6 + k * 30), y = top + k * k * (gh);
      c.save(); c.fillStyle = GOLD; c.globalAlpha = 1 - k; c.shadowColor = GOLD; c.shadowBlur = 12; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); c.restore();
    }
  }
  E.particles(c, gx, top, t - 5.05, { n: 50, speed: 650 });
  E.flash(c, t, 5.05, .35, '245,197,66', .3);
} },
// 3 — Same 24 hours
{ dur: 6.4, cues: [[0, 'tick'], [4.8, 'impact']], draw(c, t) {
  const g1 = 920, g2 = 1440, s = .75;
  E.title(c, 'Same 24 hours', W / 2, 420, t, .05, 4.6, { size: 54, weight: 800 });
  E.title(c, 'Different life.', W / 2, 420, t, 4.85, 1e9, { size: 60, weight: 800, color: GOLD, glow: 24 });
  E.text(c, 'Scrolling', 180, 560, { size: 34, weight: 600, color: GREY, align: 'left' });
  E.text(c, 'Building', 180, 1080, { size: 34, weight: 600, color: '#fff', align: 'left' });
  const k = E.p(t, .3, 4.6, 'lin');
  const glass = (x, y, col) => {
    const hw = 46, hh = 70;
    c.save(); c.strokeStyle = '#ccc'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(x - hw, y - hh); c.lineTo(x + hw, y - hh); c.lineTo(x, y); c.lineTo(x + hw, y + hh); c.lineTo(x - hw, y + hh); c.lineTo(x, y); c.closePath(); c.stroke();
    c.fillStyle = col; const a = (1 - k) * hh;
    c.beginPath(); c.moveTo(x - hw * (a / hh), y - a); c.lineTo(x + hw * (a / hh), y - a); c.lineTo(x, y); c.fill();
    const b = k * hh; c.beginPath(); c.moveTo(x - hw, y + hh); c.lineTo(x + hw, y + hh); c.lineTo(x + hw * (1 - b / hh), y + hh - b); c.lineTo(x - hw * (1 - b / hh), y + hh - b); c.fill();
    if (k < 1) E.line(c, x, y, x, y + hh, col, 3);
    c.restore();
  };
  // row 1
  E.ground(c, g1, 90, 990); glass(860, g1 - 100, '#c9a96e');
  const sitY = g1 - 66 * s - 4;
  E.rrect(c, 230, sitY + 6, 150, 50, 10, '#2b2b2b', '#666', 3);
  E.figure(c, { x: 300, y: sitY, s, pose: E.pose('phone') });
  const ph = E.hand({ x: 300, y: sitY, s, pose: E.pose('phone') });
  E.rrect(c, ph[0] - 6, ph[1] - 30, 22, 36, 5, '#9fd3ff'); E.glowDot(c, ph[0] + 5, ph[1] - 12, 70, 'rgba(120,190,255,.5)');
  // wasted sand pile
  c.save(); c.fillStyle = '#5a4d36'; c.beginPath(); c.ellipse(640, g1, 140 * k, 26 * k, 0, Math.PI, 0); c.fill(); c.restore();
  // row 2 — every grain becomes a step
  E.ground(c, g2, 90, 990); glass(860, g2 - 100, GOLD);
  const n = 7, sw = 70, sh = 48, sx = 280;
  const built = Math.floor(k * n + .001);
  for (let i = 0; i < n; i++) { const a = E.p(k * n - i, 0, 1, 'back'); if (a <= 0) continue; E.rrect(c, sx + i * sw, g2 - (i + 1) * sh * Math.min(1, a), sw - 4, (i + 1) * sh * Math.min(1, a), 4, '#2a2a2a', i === n - 1 && built >= n ? GOLD : '#aaa', 3); }
  const pos = Math.min(built, n), fx = sx - 50 + pos * sw + (k * n - Math.floor(k * n)) * (built < n ? 0 : 0);
  const fy = g2 - pos * sh - E.FIG_H * s - 2;
  E.figure(c, { x: built ? sx + (pos - .5) * sw : sx - 60, y: built ? fy : g2 - E.FIG_H * s - 2, s, pose: t > 4.8 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.8, 5.1, 'back')) : E.walk(t * 9, .3), glow: t > 4.8 ? 20 : 0 });
  E.particles(c, sx + (n - .5) * sw, g2 - n * sh - 120, t - 4.8, { n: 36, speed: 450 });
} },
// 4 — Dominoes
{ dur: 6.4, cues: [[1.0, 'pop'], [5.15, 'impact']], draw(c, t) {
  const gy = 1300, n = 9, h0 = 30, r = 1.4;
  const D = []; let x = 150;
  for (let i = 0; i < n; i++) { const h = h0 * Math.pow(r, i), w = h * .2; D.push({ x, h, w }); x += w + h * .62; }
  // fall timing
  let tt = 1.05; for (let i = 0; i < n; i++) { D[i].t0 = tt; D[i].dur = .22 + i * .045; tt += D[i].dur * .8; }
  const last = D[n - 1];
  // camera follows the chain from tight to wide
  const prog = E.clamp((t - 1.0) / (last.t0 + last.dur - 1.0));
  const zoom = E.lerp(3.0, .6, E.ease.inOut(E.clamp(t < 1 ? 0 : prog)));
  const fx = E.lerp(D[0].x + 60, 780, E.ease.inOut(prog)), fy = E.lerp(gy - 60, gy - 260, E.ease.inOut(prog));
  E.title(c, 'Small habits…', W / 2, 440, t, .05, 4.9, { size: 54, weight: 800 });
  E.title(c, 'build an unstoppable life.', W / 2, 440, t, 5.3, 1e9, { size: 52, weight: 800, color: GOLD, glow: 24 });
  c.save(); E.shake(c, t, last.t0 + last.dur, .5, 26);
  E.camera(c, zoom, fx, fy, W / 2, 1050);
  E.ground(c, gy, 0, 1200, '#555');
  for (let i = 0; i < n; i++) {
    const d = D[i], nx = D[i + 1];
    const maxA = nx ? Math.asin(E.clamp((nx.x - d.x - d.w) / d.h * 1.0 + .0, 0, 1)) + .08 : Math.PI / 2 - .02;
    const a = E.p(t, d.t0, d.t0 + d.dur, 'in') * maxA;
    c.save(); c.translate(d.x + d.w, gy); c.rotate(a);
    const lastHit = i === n - 1 && t > d.t0;
    c.fillStyle = i === n - 1 ? (lastHit ? GOLD : '#ddd') : '#ddd'; c.shadowColor = GOLD; c.shadowBlur = lastHit ? 30 : 0;
    c.beginPath(); c.roundRect(-d.w, -d.h, d.w, d.h, 3); c.fill();
    c.fillStyle = '#000'; c.beginPath(); c.arc(-d.w / 2, -d.h * .72, d.w * .14, 0, 7); c.arc(-d.w / 2, -d.h * .28, d.w * .14, 0, 7); c.fill();
    c.restore();
  }
  // figure taps the first domino
  const tap = E.p(t, .5, 1.0) * (1 - E.p(t, 1.1, 1.5));
  E.figure(c, { x: D[0].x - 58, y: gy - E.FIG_H * .3 - 1, s: .3, lw: 14, pose: E.mix(E.pose('stand'), E.pose('point'), tap) });
  E.text(c, 'YOUR LIFE', last.x + last.h * .5, gy - last.w - 70, { size: 64, weight: 900, ls: 3, color: GOLD, glow: 20, alpha: E.p(t, last.t0 + last.dur, last.t0 + last.dur + .3) });
  E.text(c, '5 minutes', D[0].x + 6, gy + 18, { size: 9, weight: 700, color: GREY, alpha: 1 - prog });
  c.restore();
  E.flash(c, t, last.t0 + last.dur, .35, '245,197,66', .3);
} },
// 5 — Future self
{ dur: 6.4, cues: [[1.6, 'rise'], [4.85, 'impact']], draw(c, t) {
  const gy = 1250, s = .95;
  E.title(c, 'Your future self', W / 2, 440, t, .1, 4.5, { size: 54, weight: 800 });
  E.title(c, 'is watching you right now.', W / 2, 515, t, 1.0, 4.5, { size: 46, weight: 600, color: '#ccc' });
  E.title(c, 'Make them proud.', W / 2, 470, t, 5.0, 1e9, { size: 64, weight: 900, color: GOLD, glow: 28 });
  E.ground(c, gy, 90, 990);
  const meet = 4.85, k = E.p(t, 2.2, meet, 'inOut');
  const px = E.lerp(230, 700, k), fxF = 820;
  const merged = t >= meet;
  // future self
  if (!merged) E.figure(c, { x: fxF, y: gy - E.FIG_H * s - 2, s, f: -1, color: GOLD, alpha: .45 + .25 * Math.sin(t * 3), glow: 40, pose: E.mix(E.pose('arms'), E.pose('cheer'), E.p(t, 3.6, 4.4)) });
  E.glowDot(c, fxF, gy - 150, 260, 'rgba(245,197,66,.25)', merged ? 1 : .6);
  const col = `rgb(255,${Math.round(E.lerp(255, 215, k))},${Math.round(E.lerp(255, 120, k))})`;
  E.figure(c, { x: merged ? fxF : px, y: gy - E.FIG_H * s - 2, s, color: merged ? GOLD : col, glow: merged ? 40 : k * 20,
    pose: merged ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, meet, meet + .4, 'back')) : (t < 2.2 ? E.pose('stand') : E.walk(px / 26)) });
  E.rays(c, fxF, gy - 150, 800, merged ? .5 * (1 - E.p(t, 5.5, 6.4) * .5) : 0, GOLD, 18, t * .25);
  E.particles(c, fxF, gy - 150, t - meet, { n: 70, speed: 800, grav: 150 });
  E.flash(c, t, meet, .5, '245,197,66', .5);
} },
] };
