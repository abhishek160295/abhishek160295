// Reel 061 — "You're the ladder now" (audience-first: first-gen student leaves home on a bus, learns the words at 2 AM, builds own ladder rung by rung, pulls siblings up; reference bible, ~25s)
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
const mom = (c, o) => { const s = o.s ?? 1, f = o.f ?? 1, col = o.color; fig(c, o); const [hx, hy] = E.headPos(o); c.save(); c.globalAlpha *= o.alpha ?? 1; c.fillStyle = col; c.beginPath(); c.arc(hx - f * 24 * s, hy - 6 * s, 15 * s, 0, 7); c.fill(); c.globalAlpha *= .9; c.beginPath(); c.moveTo(o.x - 34 * s, o.y + 70 * s); c.lineTo(o.x + 34 * s, o.y + 70 * s); c.lineTo(o.x + 8 * s, o.y - 6 * s); c.lineTo(o.x - 8 * s, o.y - 6 * s); c.closePath(); c.fill(); c.restore(); };
const ladder = (c, x, top, bot, rungs, col = '#bdbdbd', labels = []) => { E.line(c, x - 40, bot, x - 40, top, col, 7); E.line(c, x + 40, bot, x + 40, top, col, 7); for (let i = 0; i < rungs; i++) { const y = bot - 30 - i * 60; if (y < top) break; E.line(c, x - 40, y, x + 40, y, col, 6); if (labels[i]) E.text(c, labels[i], x + 120, y, { size: 16, weight: 800, family: MONO, ls: 1, color: col }); } };
const REEL = { title: "You're the ladder now", bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — First in your family to go to college
{ dur: 6.2, zoom: t => 1.1 + .015 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, board = 1.9, go = 2.4, bx = t < go ? 640 : 640 + 520 * Math.pow(t - go, 1.6);
  TITLE(c, 'FIRST IN YOUR FAMILY TO GO TO COLLEGE.', 450);
  TITLE(c, "ONE BAG. A WHOLE FAMILY'S HOPE.", 505, GOLD, E.p(t, 2.8, 3.2));
  { const sr = E.p(t, 0, 4, 'lin'); E.glowDot(c, 900, 1150 - 260 * sr, 520, 'rgba(255,180,100,.45)', .5 + .5 * sr + .1 * Math.sin(t * 7)); E.rays(c, 900, 1150 - 260 * sr, 800, .14, '#ffcf80', 12, t * .7); }
  floor(c, GY);
  // small house
  E.shaded(c, 60, GY - 230, 220, 230, 6, '#3a3a40', '#222226', '#6a6a70'); c.save(); c.fillStyle = '#6a6a70'; c.beginPath(); c.moveTo(40, GY - 230); c.lineTo(170, GY - 330); c.lineTo(300, GY - 230); c.fill(); c.restore(); E.rrect(c, 140, GY - 130, 60, 130, 4, '#ffe7a8'); E.glowDot(c, 170, GY - 80, 160, 'rgba(255,214,120,.4)', 1);
  mom(c, { x: 260, y: hipOn(GY, .95), s: .95, color: '#d8d8d8', pose: t > go ? { ...E.pose('stand'), aF: 2.6 + Math.sin(t * 10) * .4, eF: .3 } : { ...E.pose('stand'), aF: .8, eF: 1.4 } });
  fig(c, { x: 340, y: hipOn(GY, 1.0), s: 1.0, color: '#bdbdbd', pose: t > go ? { ...E.pose('stand'), aF: 2.2 + Math.sin(t * 8 + 1) * .3 } : { ...E.pose('point'), aF: 1.2 } });
  // bus
  for (let i = 0; i < 6; i++) { const q = (t * 1.8 + i / 6) % 1; c.save(); c.globalAlpha = .45 * (1 - q); c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(bx + 540 + q * 120, GY - 40 - q * 60, 10 + q * 26, 0, 7); c.fill(); c.restore(); }
  c.save(); c.translate(bx, t < go ? Math.sin(t * 60) * 3 : 0); E.rrect(c, 0, GY - 260, 520, 220, 26, '#1c1c22', '#bdbdbd', 5); for (let i = 0; i < 4; i++) E.rrect(c, 30 + i * 120, GY - 230, 90, 80, 8, i === 0 && t > board ? '#2a2a20' : '#0c0c10', '#5a5a5e', 3); [90, 430].forEach(w => { c.save(); c.fillStyle = '#333'; c.beginPath(); c.arc(w, GY - 30, 30, 0, 7); c.fill(); c.restore(); });
  if (t > board) { E.glowDot(c, 75, GY - 190, 90, 'rgba(245,197,66,.5)'); fig(c, { x: 75, y: GY - 150, s: .6, color: GOLD, pose: { ...E.pose('stand'), aB: -2.4 - Math.sin(t * 10) * .3, eB: -.3 } }); }
  c.restore();
  if (t < board) { E.shaded(c, 470, GY - 90, 60, 70, 8, '#8a6a44', '#4a3018'); fig(c, { x: 440, y: hipOn(GY, 1.05), s: 1.05, color: '#fff', pose: t < 1.2 ? { ...E.pose('stand'), hd: .2 } : E.walk(t * 9) }); }
  if (t > go) for (let i = 0; i < 8; i++) { const q = ((t - go) * 1.5 + i / 8) % 1; c.save(); c.globalAlpha = .4 * (1 - q); c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(bx - 20 - q * 160, GY - 40 - E.rnd(i) * 30, 12 + q * 24, 0, 7); c.fill(); c.restore(); }
  TAG(c, `HOME → ${Math.round(Math.max(0, Math.min(1400, (bx - 640) * 2.2)))} KM`, 820, 650, 1, -1, '#e8e8e8');
  TAG(c, 'FIRST GEN', 240, 650, 1, -1, GOLD);
} },
// 2 — Nobody at home knew these words. So you learned them at 2 AM.
{ dur: 6.4, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, n = Math.min(41, 1 + Math.floor(E.p(t, .1, 5.6, 'lin') * 41));
  TITLE(c, 'NOBODY AT HOME KNEW THESE WORDS.', 450);
  TITLE(c, 'SO YOU LEARNED THEM AT 2 AM.', 505, GOLD, E.p(t, 3.2, 3.6));
  floor(c, GY);
  E.glowDot(c, 470, 1030, 380, 'rgba(120,170,255,.35)', .6 + .4 * Math.sin(t * 9));
  E.rrect(c, 300, GY - 150, 340, 18, 4, '#5a5a5e'); E.line(c, 320, GY - 132, 320, GY, '#5a5a5e', 8); E.line(c, 620, GY - 132, 620, GY, '#5a5a5e', 8);
  c.save(); c.translate(500, GY - 150); c.rotate(-.25); E.rrect(c, -80, -96, 160, 96, 8, '#0c0c10', '#ddd', 3); E.rrect(c, -64, -34, 128, 8, 4, '#3a3a40'); E.rrect(c, -64, -34, 128 * ((t * .6) % 1), 8, 4, RED); E.text(c, 'HOW TO WRITE A RESUME', 0, -66, { size: 11, weight: 800, family: MONO, color: '#e8e8e8' }); c.restore();
  E.line(c, 220, GY - 66, 300, GY - 66, '#5a5a5e', 8); E.line(c, 230, GY - 66, 230, GY, '#5a5a5e', 6);
  fig(c, { x: 260, y: GY - 80, s: 1.05, color: t > 3.2 ? GOLD : '#fff', pose: { ...E.pose('sit'), tor: .25, hd: .2 + .1 * Math.sin(t * 3), aF: 1.3 + .15 * Math.sin(t * 13), eF: .5 } });
  // the words orbit his head
  ['SOP?', 'CGPA', 'INTERNSHIP', 'LINKEDIN', 'REFERRAL', 'CTC?', 'NETWORKING'].forEach((w, i) => { const t0 = .2 + i * .35; if (t < t0) return; const a = t * (.8 + i * .07) + i * .9, rx = 170 + 25 * (i % 3), x = 400 + Math.cos(a) * rx, y = 860 + Math.sin(a) * 110, learned = t > 3.2 + i * .25; TAG(c, w, x, y, t, t0, learned ? GOLD : '#9a9a9a'); });
  // classmates with parents on the phone
  fig(c, { x: 860, y: hipOn(GY, .9), s: .9, f: -1, color: '#7a7a7a', pose: { ...E.pose('stand'), aF: 2.6, eF: 2.4, hd: .1 } });
  SAY(c, 'PAPA KNOWS SOMEONE.', 780, 900, E.p(t, 1.2, 1.4) * (t < 3 ? 1 : 0), -1);
  TAG(c, `TUTORIALS: ${n}`, 820, 650, 1, -1, t > 3.2 ? GOLD : '#e8e8e8');
  TAG(c, '2:13 AM', 240, 650, 1, -1, '#e8e8e8');
} },
// 3 — They had ladders handed down. You built yours, rung by rung.
{ dur: 6.6, zoom: t => 1.06 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, top = 850, drop = .3;
  TITLE(c, 'THEY HAD LADDERS HANDED DOWN.', 450);
  TITLE(c, 'YOU BUILT YOURS, RUNG BY RUNG.', 505, GOLD, E.p(t, 2.8, 3.2));
  floor(c, GY);
  E.shaded(c, 120, top - 20, 260, 20, 4, '#5a5a5e', '#3a3a40'); E.shaded(c, 620, top - 20, 280, 20, 4, t > 5.3 ? GOLD : '#5a5a5e', t > 5.3 ? '#8a6a24' : '#3a3a40');
  LBL(c, 'HANDED DOWN', 250, 1420, '#8a8a8a'); LBL(c, 'BUILT', 760, 1420, t > 5.3 ? GOLD : '#e8e8e8');
  // left: a full ladder lowered, quick climb
  const ly = E.lerp(top - 480, top, E.p(t, drop, drop + .5, 'out')); ladder(c, 250, ly, ly + 480, 8, '#8a8a8a');
  const lc = E.p(t, 1.0, 2.2, 'lin'); fig(c, { x: 250, y: E.lerp(hipOn(GY, .9), hipOn(top - 20, .9), lc), s: .9, color: '#8a8a8a', pose: lc > 0 && lc < 1 ? { ...E.pose('climb'), aF: 2.6 + Math.sin(t * 12) * .3 } : E.pose('stand') });
  E.glowDot(c, 700, 1100, 420, 'rgba(245,197,66,.35)', .4 + .4 * Math.abs(Math.sin(t * 5.97)));
  // right: rungs added one at a time
  const LAB = ['ENGLISH', 'EXCEL', 'CODING', 'INTERVIEWS', '23 REJECTIONS', 'NIGHT SHIFTS', 'PROJECTS', 'CONFIDENCE'];
  const r = Math.min(8, Math.floor(E.p(t, .2, 5.0, 'lin') * 8) + 1); ladder(c, 700, GY - 30 - r * 60, GY, r, '#e8e8e8', LAB);
  const climbY = t < 5.0 ? hipOn(GY - Math.max(0, r - 3) * 60, 1.0) : E.lerp(hipOn(GY - 5 * 60, 1.0), hipOn(top - 20, 1.0), E.p(t, 5.0, 5.3));
  fig(c, { x: 700, y: Math.min(hipOn(GY, 1.0), climbY), s: 1.0, color: t > 5.3 ? GOLD : '#fff', pose: t > 5.3 ? win(t, 5.3) : { ...E.pose('climb'), aF: 2.6 + Math.sin(t * 10) * .3, aB: 2.2 - Math.sin(t * 10) * .3 } });
  if ((t * 1.9) % 1 < .2 && t < 5) E.particles(c, 700, GY - 30 - r * 60, ((t * 1.9) % 1) * 2, { n: 14, speed: 240, color: '#f2f2f2', grav: 300, life: .4, seed: r });
  E.particles(c, 760, top - 40, t - 5.3, { n: 60, speed: 480, grav: 260 });
} },
// 4 — You're not just climbing. You're the ladder now.
{ dur: 7.6, zoom: t => 1.08 + .012 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, top = 950, pull = 2.4;
  TITLE(c, "YOU'RE NOT JUST CLIMBING.", 450);
  TITLE(c, "YOU'RE THE LADDER NOW.", 505, GOLD, E.p(t, pull + .6, pull + 1.0));
  floor(c, GY);
  E.rays(c, 560, top - 80, 900, .22, GOLD, 18, t * .6); E.glowDot(c, 560, top, 460, 'rgba(245,197,66,.4)', .7 + .3 * Math.sin(t * 5));
  E.shaded(c, 420, top - 20, 300, 20, 4, GOLD, '#8a6a24'); ladder(c, 560, top, GY, 6, GOLD);
  fig(c, { x: 620, y: hipOn(top - 20, .95), s: .95, f: -1, color: GOLD, pose: t < pull ? { ...E.pose('push'), tor: .6, aF: 2.0, eF: .2 } : { ...E.pose('cheer'), aF: 2.4 } });
  // little sister and cousins coming up behind him
  [[.0, 'SISTER'], [.8, 'COUSIN'], [1.6, 'COUSIN']].forEach(([d, w], i) => { const k = E.p(t, .2 + d, pull + d, 'lin'), y = E.lerp(hipOn(GY, .7), hipOn(top - 20, .7), k), x = k >= 1 ? 470 + i * 50 : 560; fig(c, { x, y, s: .7, color: k >= 1 ? GOLD : '#d8d8d8', pose: k > 0 && k < 1 ? { ...E.pose('climb'), aF: 2.6 + Math.sin(t * 12 + i) * .3 } : k >= 1 ? { ...E.pose('cheer'), aF: 2.4 + Math.sin(t * 10 + i) * .2 } : E.pose('stand') }); if (k <= 0) fig(c, { x: 400 + i * 60, y: hipOn(GY, .7), s: .7, color: '#9a9a9a', pose: E.pose('stand') }); });
  TAG(c, 'FIRST GEN. NOT LAST GEN.', 540, 1440, t, pull + 1.2, GOLD);
  E.particles(c, 560, top - 100, t - pull, { n: 70, speed: 520, grav: 280, life: 1.6 });
  for (let i = 0; i < 28; i++) { const qq = (t * (.35 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .7 * (1 - qq); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); }
} },
] };
