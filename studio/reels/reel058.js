// Reel 058 — "Not for them" (audience-first: left on seen at 2 AM, story on loop, archive and walk out, pain into reps and pages, 1 year later 'hey stranger'; reference bible, ~25s)
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
const desk = (c, x, gy, lampA, t) => { E.glowDot(c, x + 150, gy - 230, 330, 'rgba(255,214,120,.42)', lampA * (.75 + .25 * Math.sin(t * 7))); E.rrect(c, x, gy - 150, 230, 18, 4, '#5a5a5e'); E.line(c, x + 20, gy - 132, x + 20, gy, '#5a5a5e', 8); E.line(c, x + 210, gy - 132, x + 210, gy, '#5a5a5e', 8); E.line(c, x + 170, gy - 150, x + 170, gy - 260, '#8a8a8a', 6); E.line(c, x + 170, gy - 260, x + 130, gy - 290, '#8a8a8a', 6); c.save(); c.fillStyle = lampA > .5 ? '#ffe7a8' : '#6a6a6a'; c.beginPath(); c.moveTo(x + 110, gy - 300); c.lineTo(x + 150, gy - 300); c.lineTo(x + 160, gy - 270); c.lineTo(x + 100, gy - 270); c.fill(); c.restore(); };
const bigPhone = (c, x, y, col = '#9a9a9a') => { E.rrect(c, x - 170, y - 300, 340, 600, 36, '#0c0c10', col, 7); E.rrect(c, x - 40, y - 284, 80, 12, 6, '#2a2a2e'); };
const msg = (c, x, y, str, mine, a = 1, col) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.font = `700 22px ${MONO}`; const w = Math.max(60, c.measureText(str).width + 34); const bx = mine ? x + 140 - w : x - 140; E.rrect(c, bx, y - 26, w, 52, 18, mine ? (col || '#2a3a52') : '#2a2a30'); E.text(c, str, bx + w / 2, y, { size: 22, weight: 700, family: MONO, color: '#f2f2f2' }); c.restore(); };
const typed = (str, t, t0, dur) => { const k = (t - t0) / dur; if (k < 0 || k > 1) return ''; const n = str.length, p = k < .55 ? Math.floor(k / .55 * n) : k < .7 ? n : Math.floor((1 - (k - .7) / .3) * n); return str.slice(0, Math.max(0, p)); };
const REEL = { title: 'Not for them', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — They left you on seen. And you stayed up till 4 AM.
{ dur: 6.4, zoom: t => 1.1 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330;
  TITLE(c, 'THEY LEFT YOU ON SEEN.', 450);
  TITLE(c, 'AND YOU STAYED UP TILL 4 AM.', 505, RED, E.p(t, 3.0, 3.4));
  floor(c, GY);
  c.save(); c.strokeStyle = 'rgba(190,200,225,.5)'; c.lineWidth = 3; for (let i = 0; i < 90; i++) { const x = (E.rnd(i) * 1300 + t * 160) % 1300 - 100, y = (E.rnd(i * 3) * 1500 + t * 1700) % 1400 + 420; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 12, y + 46); c.stroke(); } c.restore();
  if ((t % 2.6) > 2.3) { c.save(); c.fillStyle = `rgba(220,225,255,${.18 * Math.sin(((t % 2.6) - 2.3) / .3 * Math.PI)})`; c.fillRect(-200, -200, 1500, 2400); c.restore(); }
  E.glowDot(c, 640, 950, 460, 'rgba(120,170,255,.35)', .5 + .5 * Math.sin(t * 9));
  E.rrect(c, 60, GY - 110, 300, 60, 10, '#2a2a30', '#6a6a70', 4); E.line(c, 80, GY - 50, 80, GY, '#5a5a5e', 8); E.line(c, 340, GY - 50, 340, GY, '#5a5a5e', 8);
  fig(c, { x: 230, y: GY - 150, s: 1.05, color: '#fff', pose: { ...E.pose('sit'), tor: .35, hd: .55, aF: 1.0, eF: 1.4, aB: .9, eB: 1.4, kF: 1.55 + .25 * Math.sin(t * 22), lF: 1.6 + .15 * Math.sin(t * 22) } });
  bigPhone(c, 680, 970);
  msg(c, 680, 770, 'we need to talk.', false);
  E.text(c, 'SEEN 2:14 AM', 680, 820, { size: 16, weight: 800, family: MONO, ls: 2, color: '#8a8a8a' });
  const drafts = ["i'm sorry", 'can we fix this?', 'please reply', 'are you awake?'];
  let n = 0; drafts.forEach((d, i) => { const t0 = .3 + i * 1.4; if (t > t0 + .9) n++; const s2 = typed(d, t, t0, 1.35); if (s2) msg(c, 680, 1140, s2 + '|', true); });
  TAG(c, `TYPED: ${Math.max(1, n * 3 + Math.floor(t * 2) % 3)}`, 240, 680, 1, -1, '#e8e8e8');
  TAG(c, 'SENT: 0', 240, 740, 1, -1, RED);
  const mins = Math.floor(E.p(t, 0, 6.2, 'lin') * 108), hh = 2 + Math.floor((14 + mins) / 60), mm = (14 + mins) % 60;
  TAG(c, `${hh}:${String(mm).padStart(2, '0')} AM`, 680, 1305, 1, -1, hh >= 4 ? RED : '#e8e8e8');
} },
// 2 — You can't heal in the same place that broke you.
{ dur: 6.4, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, arch = 3.4, walk = 4.4;
  TITLE(c, "YOU CAN'T HEAL IN THE SAME PLACE", 450);
  TITLE(c, 'THAT BROKE YOU.', 505, GOLD, E.p(t, arch, arch + .4));
  floor(c, GY);
  // door of light on the right
  const da = E.p(t, arch, arch + .6); E.glowDot(c, 820, GY - 200, 380, 'rgba(255,240,200,.5)', da); E.rrect(c, 750, GY - 380, 150, 380, 8, da > .1 ? '#fff4d8' : '#1a1a1e', '#8a8a8a', 4);
  if (t < arch + .3) {
    const q = t < arch ? 1 : 1 - E.p(t, arch, arch + .3);
    c.save(); c.globalAlpha = q; c.translate(540, 900); c.scale(.85 + .15 * q, .85 + .15 * q); c.translate(-540, -900);
    bigPhone(c, 540, 900); { const fr = Math.floor(t * 1.4 * 4); const bg = ['#5a3a1a', '#1a3a5a', '#4a1a3a', '#3a4a1a'][fr % 4]; c.save(); c.fillStyle = bg; c.beginPath(); c.roundRect(378, 610, 324, 580, 30); c.fill(); c.restore(); E.glowDot(c, 540 + (fr % 2 ? 80 : -80), 800, 220, 'rgba(255,220,150,.6)', 1); }
    // their story, viewed again and again
    const loop = (t * 1.4) % 1, views = Math.floor(t * 1.4) + 1;
    for (let i = 0; i < 4; i++) { const k = i < Math.floor(loop * 4) ? 1 : i === Math.floor(loop * 4) ? (loop * 4) % 1 : 0; E.rrect(c, 390 + i * 76, 640, 68, 8, 4, '#3a3a40'); E.rrect(c, 390 + i * 76, 640, 68 * k, 8, 4, '#f2f2f2'); }
    c.save(); c.fillStyle = '#5a5a5e'; c.beginPath(); c.arc(420, 700, 26, 0, 7); c.fill(); c.restore(); E.text(c, 'THEM · 2h', 520, 700, { size: 18, weight: 800, family: MONO, color: '#bdbdbd' });
    fig(c, { x: 540, y: hipOn(1150, .85), s: .85, color: '#bdbdbd', pose: { ...E.pose('cheer'), hd: Math.sin(t * 6) * .1 } }); fig(c, { x: 630, y: hipOn(1150, .8), s: .8, f: -1, color: '#8a8a8a', pose: E.pose('stand') });
    c.restore();
    TAG(c, `VIEWED: ${Math.floor(t * 1.4) * 9 + 1} TIMES`, 250, 650, 1, -1, RED);
    if (t > arch - .9) TAG(c, 'ARCHIVE CHAT', 540, 1260, t, arch - .9, GOLD);
  }
  E.particles(c, 540, 900, t - arch, { n: 40, speed: 420, color: '#9a9a9a', grav: 200, life: .8 });
  if (t > arch) { const x = t < walk ? 300 : E.lerp(300, 820, E.p(t, walk, 6.3, 'lin')); fig(c, { x, y: hipOn(GY, 1.05), s: 1.05, color: t > walk + .8 ? GOLD : '#fff', alpha: x > 780 ? 1 - E.p(x, 780, 820) : 1, pose: t < walk ? { ...E.pose('stand'), hd: -.1 } : E.walk(t * 9) }); c.save(); c.translate(260, GY - 6); E.rrect(c, -40, -10, 80, 12, 4, '#1a1a1e', '#8a8a8a', 2); c.restore(); }
  E.shake(c, t, arch, .3, 8);
} },
// 3 — Turn the pain into reps. And the nights into pages.
{ dur: 6.4, zoom: t => 1.06 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, m = Math.min(12, 1 + Math.floor(E.p(t, .1, 5.2, 'lin') * 12)), k = m / 12;
  TITLE(c, 'TURN THE PAIN INTO REPS.', 450);
  TITLE(c, 'AND THE NIGHTS INTO PAGES.', 505, GOLD, E.p(t, 2.4, 2.8));
  floor(c, GY);
  // punching bag
  const hit = (t * 3) % 1 < .15, sw = Math.sin(t * 6) * .12 + (hit ? .1 : 0);
  E.line(c, 330, 600, 330, 640, '#8a8a8a', 5); c.save(); c.translate(330, 640); c.rotate(sw); E.rrect(c, -60, 0, 120, 320, 40, '#7a3a3a', '#bdbdbd', 4); c.restore();
  if (hit) E.particles(c, 300, 820, ((t * 3) % 1) * 2, { n: 12, speed: 260, color: '#f2f2f2', grav: 300, life: .3, seed: Math.floor(t * 3) });
  const punch = Math.floor(t * 6) % 2;
  fig(c, { x: 170, y: hipOn(GY, .95 + .15 * k), s: .95 + .15 * k, lw: 15 + 6 * k, color: m === 12 ? GOLD : '#fff', pose: { tor: .2, hd: -.1, aF: punch ? 1.6 : .9, eF: punch ? .1 : 1.6, aB: punch ? .9 : 1.6, eB: punch ? 1.6 : .1, lB: -.3, kB: .2, lF: .35, kF: .2 } });
  // books pile up on the right
  for (let i = 0; i < m * 2; i++) E.shaded(c, 640 + (i % 2) * 10 + Math.sin(i * 1.7) * 8, GY - 20 - i * 20, 220, 18, 4, i % 3 ? '#d8d8d8' : GOLD, i % 3 ? '#8a8a8a' : '#8a6a24');
  E.glowDot(c, 750, GY - m * 40, 260, 'rgba(245,197,66,.35)', .5 + .5 * Math.sin(t * 8));
  TAG(c, `MONTH ${m}`, 820, 650, 1, -1, m === 12 ? GOLD : '#e8e8e8');
  TAG(c, `BOOKS: ${m * 2}`, 820, 710, 1, -1, '#e8e8e8');
  E.particles(c, 750, GY - 600, t - 5.2, { n: 60, speed: 500, grav: 260 });
} },
// 4 — 1 year later: "hey stranger :)". The glow up wasn't for them.
{ dur: 7.8, zoom: t => 1.08 + .015 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, buzz = 1.0, look = 1.6, down = 3.4;
  TITLE(c, t < down ? '1 YEAR LATER.' : "THE GLOW UP WASN'T FOR THEM.", 450, '#f2f2f2', t < down - .2 ? 1 : E.p(t, down, down + .3));
  TITLE(c, 'IT WAS FOR YOU.', 505, GOLD, E.p(t, down + .9, down + 1.3));
  floor(c, GY);
  E.rays(c, 600, 1000, 900, .2, GOLD, 18, t * .6); E.glowDot(c, 600, 1050, 480, 'rgba(245,197,66,.35)', .7 + .3 * Math.sin(t * 5));
  desk(c, 460, GY, 1, t);
  E.line(c, 360, GY - 66, 440, GY - 66, '#5a5a5e', 8); E.line(c, 370, GY - 66, 370, GY, '#5a5a5e', 6); E.line(c, 430, GY - 66, 430, GY, '#5a5a5e', 6);
  const looking = t > look && t < down;
  fig(c, { x: 400, y: GY - 80, s: 1.12, lw: 21, color: GOLD, pose: looking ? { ...E.pose('sit'), tor: .1, hd: .2, aF: .9, eF: 1.3 } : { ...E.pose('sit'), tor: .3, hd: .35, aF: 1.3 + .15 * Math.sin(t * 12), eF: .5 } });
  // phone on the desk buzzes
  const bz = t > buzz && t < down ? Math.sin(t * 70) * 6 : 0, flip = E.p(t, down, down + .3);
  c.save(); c.translate(600 + bz, GY - 175); c.scale(1, 1 - flip * .7); E.rrect(c, -44, -14, 88, 28, 6, flip > .5 ? '#1a1a1e' : '#bfe0ff', '#ddd', 3); c.restore();
  if (t > buzz && t < down + .2) { const a = E.p(t, buzz, buzz + .2) * (1 - E.p(t, down, down + .2)); c.save(); c.globalAlpha = a; E.rrect(c, 520, 700, 420, 120, 20, '#1c1c22', '#bdbdbd', 3); E.text(c, 'THEM', 730, 735, { size: 18, weight: 800, family: MONO, ls: 2, color: '#8a8a8a' }); E.text(c, 'hey stranger :)', 730, 780, { size: 30, weight: 700, color: '#f2f2f2' }); c.restore(); }
  if (looking) SAY(c, ':)', 340, 860, E.p(t, look + .6, look + .8), 1);
  if (t > down + .3) TAG(c, 'BACK TO WORK', 820, 1100, t, down + .3, GOLD);
  E.particles(c, 600, 900, t - down, { n: 60, speed: 520, grav: 280, life: 1.6 });
  if (t > down) for (let i = 0; i < 34; i++) { const qq = ((t - down) * (.4 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .8 * (1 - qq); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); }
  E.shake(c, t, down, .3, 8);
} },
] };
