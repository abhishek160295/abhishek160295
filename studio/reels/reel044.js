// Reel 044 — "Your worth never changed" (≤25s, Shorts-first: hook at frame 0, payoff every scene, likeable)
const fig = (c, o) => E.figure(c, { lw: 15, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const PRIN = (c, str, y = 470, col = '#e8e8e8', a = 1) => E.text(c, str, 540, y, { size: 30, weight: 600, ls: 3, color: col, alpha: a });
const CNT = (c, x, y, label, num, sub, col = '#e8e8e8', subCol) => {
  E.text(c, label, x, y, { size: 18, weight: 800, family: MONO, ls: 3, color: '#8a8a8a', align: 'left' });
  E.text(c, String(num), x, y + 38, { size: 44, weight: 800, family: MONO, color: col, align: 'left' });
  E.text(c, sub, x, y + 72, { size: 16, weight: 800, family: MONO, ls: 2, color: subCol || (col === GOLD ? GOLD : '#8a8a8a'), align: 'left' });
};
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const PANEL = (c, y0, y1, tab, gold = false) => {
  c.save(); c.fillStyle = 'rgba(255,255,255,.035)'; c.strokeStyle = gold ? 'rgba(245,197,66,.8)' : '#34343a'; c.lineWidth = 3; c.beginPath(); c.roundRect(70, y0, 920, y1 - y0, 22); c.fill(); c.stroke(); c.restore();
  c.save(); c.font = `800 18px ${MONO}`; const w = c.measureText(tab).width + 28; c.restore();
  E.rrect(c, 92, y0 + 18, w, 34, 8, gold ? '#2a2208' : '#1c1c20', gold ? GOLD : '#4a4a50', 2);
  E.text(c, tab, 92 + w / 2, y0 + 36, { size: 18, weight: 800, family: MONO, ls: 2, color: gold ? GOLD : '#e8e8e8' });
};
const P1 = [560, 980], P2 = [1010, 1430], gT = 940, gB = 1400;
const clip = (c, P, fn) => { c.save(); c.beginPath(); c.roundRect(70, P[0], 920, P[1] - P[0], 22); c.clip(); fn(); c.restore(); };
const egg = (c, x, y, sc = 1, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); const g = c.createRadialGradient(-20, -30, 10, 0, 0, 110); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#bdb6a6'); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 78, 102, 0, 0, 7); c.fill(); c.restore(); };

const REEL = { title: 'Your worth never changed', bpm: 120, scenes: [
// 1 — Broken from outside, life ends. Broken from within, life begins.
{ dur: 5.5, draw(c, t) {
  const hit = 1.5, hatch = 3.4, done = t > hatch;
  PRIN(c, 'BROKEN FROM OUTSIDE, LIFE ENDS.', 450);
  PRIN(c, 'BROKEN FROM WITHIN, LIFE BEGINS.', 500, GOLD, E.p(t, 3.0, 3.4));
  PANEL(c, ...P1, 'PRESSURE FROM OUTSIDE'); PANEL(c, ...P2, 'BREAKS FROM WITHIN', done);
  // top: a hammer called PRESSURE
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    const ex = 540, ey = gT - 104;
    if (t < hit) egg(c, ex, ey, 1, Math.sin(t * 3) * .02);
    else { const dt = t - hit; c.save(); c.fillStyle = '#f5c542'; c.beginPath(); c.ellipse(ex, gT - 8, 110 + 40 * Math.min(1, dt * 4), 18, 0, 0, 7); c.fill(); c.fillStyle = '#f2f0e8'; c.beginPath(); c.ellipse(ex, gT - 12, 70, 10, 0, 0, 7); c.fill(); c.restore();
      for (let i = 0; i < 10; i++) { const a = -Math.PI * E.rnd(i), sp = 260 + 200 * E.rnd(i + 3), x = ex + Math.cos(a) * sp * Math.min(dt, .6), y = gT - 30 + Math.sin(a) * sp * Math.min(dt, .6) + 900 * Math.min(dt, .6) ** 2; c.save(); c.translate(x, Math.min(y, gT - 6)); c.rotate(dt * 6 + i); c.fillStyle = '#e8e4d8'; c.beginPath(); c.moveTo(-12, 0); c.lineTo(0, -16); c.lineTo(12, 4); c.fill(); c.restore(); } }
    const ha = t < hit ? E.lerp(-1.4, .2, E.p(t, .6, hit, 'in')) : .2 - .4 * E.p(t, hit, hit + .5); c.save(); c.translate(760, gT - 330); c.rotate(ha); E.line(c, 0, 0, -10, 230, '#8a6a44', 14); E.shaded(c, -90, 210, 120, 60, 8, '#9a9a9a', '#3a3a3a'); E.text(c, 'PRESSURE', -30, 240, { size: 14, weight: 800, family: MONO, color: '#111' }); c.restore();
    E.shake(c, t, hit, .25, 10); });
  E.flash(c, t, hit, .15, '255,255,255', .25);
  // bottom: cracks from the inside, out comes life
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
    const ex = 540, ey = gB - 104, wob = t > 1.2 && t < hatch ? Math.sin(t * 18) * .06 * E.p(t, 1.2, hatch) : 0;
    if (done) { E.glowDot(c, ex, ey - 40, 380, 'rgba(245,197,66,.45)', E.p(t, hatch, hatch + .5)); E.rays(c, ex, ey - 40, 420, .28 * E.p(t, hatch, hatch + .5), GOLD, 16, t * .2); }
    if (!done) egg(c, ex, ey, 1, wob);
    else { c.save(); c.translate(ex, ey); const g = c.createRadialGradient(-20, -30, 10, 0, 0, 110); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#bdb6a6'); c.fillStyle = g; c.beginPath(); c.moveTo(-78, 0); for (let i = 0; i <= 8; i++) c.lineTo(-78 + i * 19.5, (i % 2 ? -20 : 0)); c.lineTo(78, 0); c.ellipse(0, 0, 78, 102, 0, 0, Math.PI); c.fill(); c.restore();
      const k = E.p(t, hatch, hatch + .4, 'back'), cy = ey - 40 - 70 * k, fl = Math.sin(t * 20) * .5;
      c.save(); c.fillStyle = GOLD; c.beginPath(); c.arc(ex, cy, 46 * k, 0, 7); c.fill(); c.beginPath(); c.arc(ex, cy - 56 * k, 32 * k, 0, 7); c.fill();
      c.beginPath(); c.ellipse(ex - 46 * k, cy, 26 * k, 12 * k, -.6 + fl, 0, 7); c.fill(); c.beginPath(); c.ellipse(ex + 46 * k, cy, 26 * k, 12 * k, .6 - fl, 0, 7); c.fill();
      c.fillStyle = '#f08a24'; c.beginPath(); c.moveTo(ex + 28 * k, cy - 58 * k); c.lineTo(ex + 50 * k, cy - 52 * k); c.lineTo(ex + 28 * k, cy - 46 * k); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(ex + 12 * k, cy - 62 * k, 5 * k, 0, 7); c.fill(); c.restore();
      c.save(); c.translate(ex, ey - 150 - 90 * k); c.rotate(-.3 + .2 * Math.sin(t * 3)); const g2 = c.createRadialGradient(-10, -10, 4, 0, 0, 60); g2.addColorStop(0, '#fff'); g2.addColorStop(1, '#bdb6a6'); c.fillStyle = g2; c.beginPath(); c.ellipse(0, 0, 70, 46, 0, Math.PI, 0); c.fill(); c.restore(); }
    if (t > 2.0 && !done) { const k = E.p(t, 2.0, hatch); c.save(); c.strokeStyle = '#4a4436'; c.lineWidth = 4; c.beginPath(); c.moveTo(ex - 40, ey - 60); c.lineTo(ex - 20, ey - 40 * k - 30); c.lineTo(ex, ey - 60); c.lineTo(ex + 22 * k, ey - 40); c.lineTo(ex + 50 * k, ey - 70); c.stroke(); c.restore(); }
    E.particles(c, ex, ey - 100, t - hatch, { n: 50, speed: 460, grav: 260 }); });
} },
// 2 — What you tell yourself comes back
{ dur: 5.5, draw(c, t) {
  const SH = [.3, 2.4], done = t > 4.4;
  PRIN(c, 'WHAT YOU TELL YOURSELF COMES BACK.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, "SAYS I CAN'T"); PANEL(c, ...P2, 'SAYS I CAN', done);
  const row = (P, gy, word, good) => clip(c, P, () => {
    c.save(); c.fillStyle = '#3a3a3e'; c.beginPath(); c.moveTo(560, gy); c.lineTo(820, P[0] + 70); c.lineTo(1000, gy); c.fill(); c.restore();
    E.shaded(c, 90, gy - 50, 280, 50, 4, '#4a4a4f', '#2a2a2e');
    let rocks = 0, glow = 0;
    SH.forEach((t0, i) => { const dt = t - t0; if (dt < 0) return; const out = Math.min(1, dt / .9);
      if (dt < .9) E.text(c, word, E.lerp(330, 760, out), gy - 180 - 40 * Math.sin(out * Math.PI), { size: 30 + 30 * out, weight: 900, color: good ? GOLD : '#9a9a9a', alpha: 1 - out * .3 });
      const back = dt - .9; if (back > 0) { if (good) { glow = Math.max(glow, E.p(back, 0, .4)); for (let k = 0; k < 14; k++) { const q = Math.min(1, back / 1.0), x = E.lerp(760, 240 + (k % 5) * 20, q), y = E.lerp(gy - 260, gy - 220 + (k * 7) % 60, q) - Math.sin(q * Math.PI) * 100; c.save(); c.globalAlpha = 1 - E.p(back, 1.0, 1.4); c.fillStyle = GOLD; c.beginPath(); c.arc(x + Math.sin(k) * 30, y, 7, 0, 7); c.fill(); c.restore(); } }
        else { for (let k = 0; k < 3; k++) { const q = Math.min(1, back / .9), x = E.lerp(780, 200 + k * 50 + i * 30, q), y = Math.min(gy - 74 - (i * 3 + k) * 6, E.lerp(gy - 260, gy - 74, q * q) - Math.sin(q * Math.PI) * 60); c.save(); c.translate(x, y); c.rotate(q * 6); E.shaded(c, -22, -22, 44, 44, 12, '#8a8a8a', '#3a3a3a'); c.restore(); rocks++; } } } });
    const s = good ? .8 * (1 + .15 * E.p(t, 3.3, 4.4)) : .8 * (1 - .12 * E.p(t, 3.3, 4.4)), shouting = SH.some(t0 => t > t0 && t < t0 + .9);
    if (good && glow) E.glowDot(c, 240, gy - 150, 300, 'rgba(245,197,66,.4)', glow);
    fig(c, { x: 240, y: hipOn(gy - 50, s), s, color: good ? (done ? GOLD : '#fff') : '#9a9a9a', pose: good && done ? win(t, 4.4) : shouting ? { ...E.pose('stand'), aF: 2.6, eF: 2.2, aB: 2.4, eB: 2.0, tor: -.1 } : good ? E.pose('stand') : { ...E.pose('crouch'), hd: .5 } });
  });
  row(P1, gT, "I CAN'T", false); row(P2, gB, 'I CAN', true);
} },
// 3 — Some balls are glass
{ dur: 6, draw(c, t) {
  const s = .8, BALLS = [['WORK', 0], ['FAMILY', 1], ['EMAIL', 0], ['HEALTH', 1], ['SOCIAL', 0]], done = t > 4.6;
  PRIN(c, "SOME BALLS ARE GLASS. DON'T DROP THOSE.", 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'DROPS THE GLASS ONES'); PANEL(c, ...P2, 'KNOWS WHICH TO DROP', done);
  const ball = (x, y, name, glass, gold) => { c.save(); if (glass) { c.fillStyle = gold ? 'rgba(245,197,66,.35)' : 'rgba(180,220,255,.18)'; c.strokeStyle = gold ? GOLD : '#bfe8ff'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(x - 10, y - 12, 7, 10, -.5, 0, 7); c.fill(); }
    else { const g = c.createRadialGradient(x - 8, y - 10, 3, x, y, 30); g.addColorStop(0, '#bbb'); g.addColorStop(1, '#4a4a4a'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); } c.restore(); E.text(c, name, x, y + 46, { size: 12, weight: 800, family: MONO, color: glass ? (gold ? GOLD : '#bfe8ff') : '#9a9a9a' }); };
  const juggle = (gy, cx, speed, drops, gold) => { const lost = [];
    BALLS.forEach(([name, glass], i) => { const ph = (t * speed + i / 5) % 1, d = drops[name];
      if (d !== undefined && t > d) { const dt = t - d; if (glass) { if (dt < .35) ball(cx + 60, E.lerp(gy - 300, gy - 30, (dt / .35) ** 2), name, true, false); else { lost.push(name); for (let k = 0; k < 10; k++) { const a = -Math.PI * E.rnd(k + i * 9), q = Math.min(dt - .35, .6); c.save(); c.translate(cx + 60 + Math.cos(a) * 300 * q, Math.min(gy - 6, gy - 20 + Math.sin(a) * 300 * q + 900 * q * q)); c.rotate(q * 8 + k); c.fillStyle = '#bfe8ff'; c.beginPath(); c.moveTo(-8, 0); c.lineTo(0, -10); c.lineTo(8, 3); c.fill(); c.restore(); } } }
        else { const y = gy - 30 - Math.abs(Math.sin(dt * 7)) * 260 * Math.exp(-dt * 1.2); ball(cx + 120, y, name, false, false); } return; }
      const x = cx + 110 * Math.cos(ph * Math.PI * 2), y = gy - 220 - 120 * Math.abs(Math.sin(ph * Math.PI * 2)); ball(x, y, name, glass, gold && glass); });
    return lost; };
  // top: speeds up, drops FAMILY, then HEALTH
  let lost = [];
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); lost = juggle(gT, 540, .9 + .6 * E.p(t, 1.0, 2.6), { FAMILY: 2.4, HEALTH: 3.5 }, false);
    fig(c, { x: 540, y: hipOn(gT, s), s, color: '#bdbdbd', pose: { ...E.pose('stand'), aF: 1.4 + .4 * Math.sin(t * 12), eF: .8, aB: 1.3 - .4 * Math.sin(t * 12), eB: .8 } }); });
  E.flash(c, t, 2.75, .15, '229,72,77', .18); E.flash(c, t, 3.85, .15, '229,72,77', .18);
  SAY(c, "I'LL FIX IT LATER.", 780, 700, E.p(t, 4.2, 4.5, 'back'));
  CNT(c, 120, 640, 'BROKEN', lost.length, lost.length ? lost.join(' + ') : 'JUGGLING IT ALL', '#e8e8e8', lost.length ? RED : null);
  // bottom: lets WORK bounce, protects the glass
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); if (done) E.glowDot(c, 540, gB - 260, 340, 'rgba(245,197,66,.35)', E.p(t, 4.6, 5.0));
    juggle(gB, 540, .9, { WORK: 2.4 }, done);
    fig(c, { x: 540, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: { ...E.pose('stand'), aF: 1.4 + .3 * Math.sin(t * 10), eF: .8, aB: 1.3 - .3 * Math.sin(t * 10), eB: .8 } }); });
  CNT(c, 120, 1090, 'BROKEN', 0, t > 2.4 ? 'WORK BOUNCED BACK' : 'JUGGLING', done ? GOLD : '#e8e8e8');
} },
// 4 — They crumpled it. Stepped on it. Still worth 100.
{ dur: 7, draw(c, t) {
  const CX = 540, CY = 1000, GY = 1330, crumple = E.p(t, .8, 1.6, 'in'), stomp = t > 1.8 && t < 3.9, open = E.p(t, 4.2, 5.0, 'out'), done = t > 5.0;
  if (t < 5.2) { PRIN(c, 'THEY CRUMPLED IT.', 450); PRIN(c, 'THEY STEPPED ON IT.', 505, '#e8e8e8', E.p(t, 1.8, 2.1)); }
  else E.title(c, "YOUR WORTH NEVER CHANGED.", 540, 470, t, 5.2, 1e9, { size: 36, weight: 800, ls: 3, family: 'Inter', color: GOLD });
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // the note
  const sq = crumple * (1 - open), y = E.lerp(CY, GY - 70, Math.min(1, crumple * 1.2) * (1 - open)) , dirt = stomp || t > 3.9 ? .5 * (1 - E.p(t, 5.0, 5.6)) : 0;
  if (done) { E.glowDot(c, CX, CY, 520, 'rgba(245,197,66,.5)', E.p(t, 5.0, 5.5)); E.rays(c, CX, CY, 560, .3 * E.p(t, 5.0, 5.5), GOLD, 18, t * .15); }
  c.save(); c.translate(CX, E.lerp(GY - 70, CY, open) * (t > 1.6 ? 1 : 0) + (t > 1.6 ? 0 : y)); const w = E.lerp(440, 120, sq), h = E.lerp(210, 110, sq);
  c.beginPath(); const pts = 18; for (let i = 0; i < pts; i++) { const a = i / pts * Math.PI * 2, r = 1 + sq * .25 * (E.rnd(i + 3) - .5) * 2; c.lineTo(Math.cos(a) * w / 2 * r * (Math.abs(Math.cos(a)) > .7 ? 1 : 1.1), Math.sin(a) * h / 2 * r); }
  c.closePath(); const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, '#c9962a'); c.fillStyle = g; c.fill();
  c.fillStyle = `rgba(40,30,20,${dirt})`; c.fill();
  if (sq < .6) { c.strokeStyle = '#8a6a1a'; c.lineWidth = 4; c.strokeRect(-w / 2 + 16, -h / 2 + 14, w - 32, h - 28); E.text(c, '100', 0, 6, { size: 96 * (1 - sq), weight: 900, color: '#5a4210' }); E.text(c, 'YOUR WORTH', 0, h / 2 - 30, { size: 16 * (1 - sq), weight: 800, family: MONO, color: '#5a4210' }); }
  if (sq > .3) { c.strokeStyle = 'rgba(90,66,16,.6)'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo((E.rnd(i) - .5) * w, (E.rnd(i + 1) - .5) * h); c.lineTo((E.rnd(i + 2) - .5) * w, (E.rnd(i + 4) - .5) * h); c.stroke(); } }
  c.restore();
  // hands crumple, then the stompers
  if (t > .6 && t < 1.7) [-1, 1].forEach(d => { const x = CX + d * E.lerp(260, 80, crumple); fig(c, { x: x + d * 120, y: hipOn(GY, .9), s: .9, f: -d, color: '#7a7a7a', pose: { ...E.pose('stand'), aF: 1.5, eF: .2 } }); });
  const ST = [['REJECTION', 1.9], ['FAILURE', 2.5], ['THEIR WORDS', 3.1]];
  ST.forEach(([name, t0], i) => { const dt = t - t0; if (dt < 0 || dt > 1.4) return; const x = E.lerp(-80, 1160, dt / 1.4), near = Math.abs(x - CX) < 70, sc = .85;
    fig(c, { x, y: hipOn(GY, sc) - (near ? Math.abs(Math.sin(dt * 30)) * 30 : 0), s: sc, color: '#6a6a6a', pose: near ? { ...E.pose('stand'), lF: 1.0, kF: .4 } : E.walk(dt * 10) });
    E.tag(c, name, x, GY - 260, 1, -1, { size: 16, color: '#bbb' }); if (near) { E.particles(c, CX, GY - 20, (dt * 4) % 1 * .3, { n: 10, speed: 200, color: '#6a5a4a', grav: 500, life: .3, seed: Math.floor(dt * 4) + i }); E.shake(c, t, t0 + .6, .15, 6); } });
  if (done) fig(c, { x: 820, y: hipOn(GY, .85), s: .85, color: GOLD, pose: win(t, 5.2) });
  CNT(c, 70, 560, 'VALUE', 100, done ? 'IT NEVER DROPPED' : stomp ? 'STILL 100' : crumple > 0 ? 'STILL 100' : 'FULL VALUE', done ? GOLD : '#e8e8e8');
} },
] };
