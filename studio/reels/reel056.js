// Reel 056 — "I froze too" (audience-first: first interview freeze, 23 rejections + mirror practice, resume gap, 5 years later twist; reference bible, ~25s)
const fig = (c, o) => E.figure(c, { lw: 17, ...o });
const hipOn = (sy, s) => sy - E.FIG_H * s;
const win = (t, t0) => ({ ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, t0, t0 + .3, 'back')), aF: 2.6 + Math.sin(t * 5) * .15 });
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const TITLE = (c, str, y = 470, col = '#f2f2f2', a = 1) => E.text(c, str, 540, y, { hud: true, size: 34, weight: 600, ls: 2, color: col, alpha: a });
const LBL = (c, str, x, y, col = '#e8e8e8', a = 1) => E.text(c, str, x, y, { hud: true, size: 28, weight: 700, ls: 5, color: col, alpha: a });
const TAG = (c, str, x, y, t, t0, col = '#e8e8e8', a = 1) => E.tag(c, str, x, y, t, t0, { size: 20, color: col, fill: '#0c0c0c', alpha: a });
const floor = (c, gy) => { const g = c.createLinearGradient(0, gy, 0, gy + 360); g.addColorStop(0, '#45454b'); g.addColorStop(1, 'rgba(10,10,12,0)'); c.save(); c.fillStyle = g; c.fillRect(-200, gy, 1500, 360); c.restore(); E.line(c, -200, gy, 1300, gy, '#55555a', 2); };
const spot = (c, x, gy, a = 1, w = 260) => { c.save(); c.globalAlpha = .16 * a; const g = c.createLinearGradient(0, 520, 0, gy); g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'rgba(255,255,255,.2)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 70, 520); c.lineTo(x + 70, 520); c.lineTo(x + w, gy); c.lineTo(x - w, gy); c.fill(); c.restore(); c.save(); c.globalAlpha = .25 * a; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, gy + 6, w * .9, 26, 0, 0, 7); c.fill(); c.restore(); };
const halo = (c, x, y, a = 1, gold = false) => E.glowDot(c, x, y, 190, gold ? 'rgba(245,197,66,.45)' : 'rgba(255,255,255,.18)', a);
const SAY = (c, str, x, y, a, tail = -1) => E.bubble(c, str, x, y, a, { size: 24, fill: '#eeeeee', stroke: '#eeeeee', color: '#111', tail });
const chair = (c, x, gy) => { E.line(c, x - 40, gy - 66, x + 40, gy - 66, '#5a5a5e', 8); E.line(c, x - 30, gy - 66, x - 30, gy, '#5a5a5e', 6); E.line(c, x + 30, gy - 66, x + 30, gy, '#5a5a5e', 6); E.line(c, x - 40, gy - 66, x - 40, gy - 170, '#5a5a5e', 6); };
const table = (c, gy) => { E.rrect(c, 560, gy - 150, 400, 20, 4, '#5a5a5e'); E.line(c, 590, gy - 130, 590, gy, '#5a5a5e', 8); E.line(c, 930, gy - 130, 930, gy, '#5a5a5e', 8); E.shaded(c, 600, gy - 170, 70, 20, 3, '#e8e8e8', '#9a9a9a'); };
const panel = (c, gy, t, col = '#9a9a9a', nod = 0) => [650, 760, 870].forEach((x, i) => fig(c, { x, y: hipOn(gy, .9), s: .9, f: -1, color: col, pose: { ...E.pose('arms'), hd: .1 + nod * Math.abs(Math.sin(t * 6 + i)) * .3 } }));
const seated = (c, x, gy, col, pose = {}) => fig(c, { x, y: gy - 80, s: 1.05, color: col, pose: { ...E.pose('sit'), ...pose } });
const stamp = (c, str, x, y, col, t, t0) => { if (t < t0) return; const q = E.p(t, t0, t0 + .2, 'out'), sc = 2.2 - 1.2 * q; c.save(); c.translate(x, y); c.rotate(-.2); c.scale(sc, sc); c.globalAlpha = q; c.strokeStyle = col; c.lineWidth = 6; c.font = `800 46px ${MONO}`; const w = c.measureText(str).width + 40; c.strokeRect(-w / 2, -40, w, 80); c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(str, 0, 2); c.restore(); };
const REEL = { title: 'I froze too', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — Your first interview, you freeze
{ dur: 6.4, zoom: t => 1.1 + .015 * t, focus: [560, 1080], draw(c, t) {
  const GY = 1330, rej = 4.4;
  TITLE(c, 'YOUR FIRST INTERVIEW,', 450);
  TITLE(c, 'YOU FREEZE.', 505, RED, E.p(t, 2.0, 2.4));
  floor(c, GY); spot(c, 330, GY, 1, 220);
  E.glowDot(c, 330, 900, 300, 'rgba(255,255,255,.2)', .5 + .5 * Math.sin(t * 9));
  table(c, GY); panel(c, GY, t);
  chair(c, 330, GY); seated(c, 300, GY, '#fff', { tor: .1, hd: .25, aF: .6 + Math.sin(t * 30) * .05, eF: 1.6 });
  SAY(c, 'TELL ME ABOUT YOURSELF.', 760, 760, E.p(t, .2, .4) * (t < rej ? 1 : 0), -1);
  // his head: static and scribbles
  if (t > .9 && t < rej + .4) { c.save(); c.globalAlpha = E.p(t, .9, 1.2); c.strokeStyle = '#bdbdbd'; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 26; i++) { const a = E.rnd(i + Math.floor(t * 12) * 31) * 7, r = 30 + E.rnd(i * 3 + Math.floor(t * 12)) * 60; c.lineTo(300 + Math.cos(a) * r, 760 + Math.sin(a) * r * .6); } c.stroke(); c.restore(); E.text(c, '. . .', 300, 870, { size: 34, weight: 800, color: '#8a8a8a' }); }
  for (let i = 0; i < 3; i++) { const q = ((t * 1.3) + i / 3) % 1; if (t > 1.5) { c.save(); c.globalAlpha = 1 - q; c.fillStyle = '#9ac8ff'; c.beginPath(); c.arc(340 + i * 14, 950 + q * 120, 6, 0, 7); c.fill(); c.restore(); } }
  TAG(c, `SILENCE: 0:${String(Math.min(59, Math.floor(E.p(t, .4, rej, 'lin') * 23))).padStart(2, '0')}`, 260, 650, 1, -1, t > 2.5 ? RED : '#e8e8e8');
  stamp(c, 'REJECTED', 560, 1000, RED, t, rej); E.shake(c, t, rej, .35, 12);
} },
// 2 — 23 emails said no. Every no was a rehearsal.
{ dur: 6.4, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, n = Math.min(23, Math.floor(E.p(t, .1, 4.6, 'lin') * 23) + 1), k = n / 23;
  TITLE(c, '23 EMAILS SAID NO.', 450);
  TITLE(c, 'EVERY NO WAS A REHEARSAL.', 505, GOLD, E.p(t, 4.4, 4.8));
  floor(c, GY);
  // inbox stack on the left
  for (let i = 0; i < Math.min(n, 9); i++) { const idx = n - 1 - i, y = 640 + i * 58, q = i === 0 ? E.p((t - .1) * 23 / 4.5 % 1, 0, .4, 'out') : 1; c.save(); c.globalAlpha = 1 - i * .09; E.rrect(c, 80 - (1 - q) * 300, y, 330, 50, 8, '#16161a', i === 0 ? RED : '#4a4a50', 3); E.text(c, `WE REGRET TO INFORM YOU #${idx + 1}`, 245 - (1 - q) * 300, y + 25, { size: 15, weight: 800, family: MONO, ls: 1, color: i === 0 ? '#f2f2f2' : '#8a8a8a' }); c.restore(); }
  // mirror on the right: he practises, the reflection gets taller
  const MX = 790; E.rrect(c, MX - 120, GY - 420, 240, 400, 20, '#101016', '#bdbdbd', 6); E.glowDot(c, MX, GY - 220, 220, k > .9 ? 'rgba(245,197,66,.4)' : 'rgba(200,220,255,.18)', .7 + .3 * Math.sin(t * 6));
  const tor = .45 - .5 * k, gest = Math.sin(t * 7) * (.3 + .7 * k), col = k > .9 ? GOLD : '#fff';
  c.save(); c.beginPath(); c.rect(MX - 112, GY - 412, 224, 384); c.clip(); fig(c, { x: MX + 40, y: hipOn(GY - 20, .85), s: .85, f: -1, color: k > .9 ? GOLD : '#9a9a9a', pose: { ...E.pose('point'), tor, hd: tor * .5, aF: .9 + gest, eF: .6 } }); c.restore();
  fig(c, { x: MX - 230, y: hipOn(GY, 1.05), s: 1.05, color: col, pose: { ...E.pose('point'), tor, hd: tor * .5, aF: .9 + gest, eF: .6 } });
  TAG(c, `REJECTIONS: ${n}`, 820, 650, 1, -1, k > .9 ? GOLD : RED);
  TAG(c, `PRACTICE: ${n * 4} TIMES`, 820, 710, t, .8, '#e8e8e8');
} },
// 3 — The gap on your resume wasn't empty
{ dur: 6.4, zoom: t => 1.06 + .02 * t, focus: [540, 1040], draw(c, t) {
  const GY = 1330, open = 2.0;
  TITLE(c, "THE GAP ON YOUR RESUME WASN'T EMPTY.", 450);
  TITLE(c, 'IT WAS FULL OF NIGHTS NOBODY SAW.', 505, GOLD, E.p(t, 4.2, 4.6));
  floor(c, GY);
  const RX = 360, RY = 640; E.rrect(c, RX, RY, 380, 520, 14, '#eeeeee', '#bdbdbd', 4);
  E.text(c, 'RESUME', RX + 190, RY + 44, { size: 26, weight: 800, family: MONO, ls: 4, color: '#111' });
  [['2023', 'DEGREE'], ['2024', ''], ['2025', '']].forEach(([y, w], i) => { E.text(c, y, RX + 70, RY + 130 + i * 150, { size: 22, weight: 800, family: MONO, color: '#111' }); if (i === 0) E.text(c, w, RX + 230, RY + 130, { size: 22, weight: 800, family: MONO, color: '#333' }); });
  const gq = E.p(t, open, open + .5, 'out');
  E.rrect(c, RX + 140, RY + 230, 210, 220, 10, gq > 0 ? '#16161a' : '#dcdcdc', t > open ? GOLD : RED, 4);
  if (gq < 1) E.text(c, 'GAP', RX + 245, RY + 340, { size: 40, weight: 800, family: MONO, color: RED, alpha: 1 - gq });
  if (t > open) E.glowDot(c, RX + 245, RY + 340, 320, 'rgba(245,197,66,.5)', gq * (.75 + .25 * Math.sin(t * 8)));
  const cards = ['3 COURSES', '2 PROJECTS', '400 NIGHTS', '1 MIRROR', '23 NOS'];
  cards.forEach((w, i) => { const t0 = open + .3 + i * .35, q = E.p(t, t0, t0 + .5, 'out'); if (q <= 0) return; const tx = 875, ty = 680 + i * 100, x = E.lerp(RX + 245, tx, q), y = E.lerp(RY + 340, ty, q) - Math.sin(q * Math.PI) * 120; E.rrect(c, x - 95, y - 26, 190, 52, 10, '#1c1708', GOLD, 3); E.text(c, w, x, y, { size: 20, weight: 800, family: MONO, ls: 1, color: GOLD }); });
  E.particles(c, RX + 245, RY + 340, t - open, { n: 60, speed: 480, grav: 200, life: 1.4 });
  fig(c, { x: 200, y: hipOn(GY, 1.05) + 0, s: 1.05, f: 1, color: t > open ? GOLD : '#d8d8d8', pose: t > open ? win(t, open + .2) : { ...E.pose('stand'), hd: .4, aF: .4 } });
  E.shake(c, t, open, .3, 8);
} },
// 4 — Interview 24, then five years later: "take your time. I froze too."
{ dur: 8.6, zoom: t => 1.1 + .012 * t, focus: [560, 1080], draw(c, t) {
  const GY = 1330, hired = 2.6, later = 3.6;
  floor(c, GY); table(c, GY);
  if (t < later) {
    TITLE(c, 'INTERVIEW #24. SAME QUESTION.', 450);
    TITLE(c, 'A DIFFERENT YOU.', 505, GOLD, E.p(t, .8, 1.2));
    panel(c, GY, t, '#bdbdbd', t > 1.2 ? 1 : 0);
    chair(c, 330, GY); halo(c, 300, GY - 220, 1, t > hired);
    seated(c, 300, GY, t > hired ? GOLD : '#fff', { tor: -.1, hd: -.1, aF: 1.2 + .5 * Math.sin(t * 8), eF: .4 + .3 * Math.sin(t * 5) });
    SAY(c, 'TELL ME ABOUT YOURSELF.', 760, 760, E.p(t, .1, .3) * (t < .9 ? 1 : 0), -1);
    SAY(c, "I'M THE GUY WHO HEARD NO 23 TIMES.", 420, 800, E.p(t, .9, 1.1) * (t < hired ? 1 : 0), 1);
    stamp(c, 'HIRED', 600, 1000, GOLD, t, hired); E.shake(c, t, hired, .3, 10);
    if (t > hired) { E.rays(c, 600, 1000, 900, .25, GOLD, 18, t * .8); E.particles(c, 600, 900, t - hired, { n: 60, speed: 520, grav: 280 }); }
    E.flash(c, t, hired, .25, '245,197,66', .3);
  } else {
    const q = E.p(t, later, later + .4);
    TITLE(c, '5 YEARS LATER.', 450, '#f2f2f2', q);
    TITLE(c, '"TAKE YOUR TIME. I FROZE TOO."', 505, GOLD, E.p(t, later + 2.0, later + 2.4));
    [650, 870].forEach((x, i) => fig(c, { x, y: hipOn(GY, .9), s: .9, f: -1, color: '#7a7a7a', pose: { ...E.pose('arms'), hd: .1 } }));
    halo(c, 760, hipOn(GY, .95) - 80, 1, true);
    fig(c, { x: 760, y: hipOn(GY, .95), s: .95, f: -1, color: GOLD, pose: t > later + 1.6 ? { ...E.pose('point'), aF: 1.1, hd: -.1 } : { ...E.pose('arms'), hd: .1 } });
    chair(c, 330, GY); seated(c, 300, GY, '#d8d8d8', { tor: .15, hd: .3, aF: .6 + Math.sin(t * 30) * .05, eF: 1.6 });
    for (let i = 0; i < 3; i++) { const qq = ((t * 1.3) + i / 3) % 1; c.save(); c.globalAlpha = 1 - qq; c.fillStyle = '#9ac8ff'; c.beginPath(); c.arc(340 + i * 14, 950 + qq * 120, 6, 0, 7); c.fill(); c.restore(); }
    SAY(c, 'TELL ME ABOUT YOURSELF.', 760, 760, E.p(t, later + .3, later + .5) * (t < later + 1.5 ? 1 : 0), -1);
    SAY(c, '. . .', 330, 820, E.p(t, later + .8, later + 1.0) * (t < later + 1.6 ? 1 : 0), 1);
    SAY(c, 'TAKE YOUR TIME. I FROZE TOO.', 680, 780, E.p(t, later + 1.6, later + 1.8), -1);
    if (t > later + 2.6) { E.glowDot(c, 300, 1100, 300, 'rgba(245,197,66,.35)', E.p(t, later + 2.6, later + 3)); for (let i = 0; i < 30; i++) { const qq = ((t - later - 2.6) * (.4 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .8 * (1 - qq); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); } }
    E.flash(c, t, later, .35, '255,255,255', .5);
  }
} },
] };
