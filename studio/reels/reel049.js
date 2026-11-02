// Reel 049 — "Make their sacrifice worth it" (audience-first: family + first job; reference bible style, ≤30s)
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
// a shoe in profile: torn = cracked upper + a sole that flaps at the toe; shine = new
const shoe = (c, x, y, sc, torn, shine, flap = 0) => { c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = shine ? (shine === 'gold' ? '#f7d36a' : '#e8e8e8') : '#6a5a4a'; c.beginPath(); c.moveTo(-90, 0); c.lineTo(-90, -60); c.quadraticCurveTo(-60, -80, -20, -70); c.quadraticCurveTo(40, -50, 90, -20); c.quadraticCurveTo(100, 0, 90, 0); c.closePath(); c.fill();
  c.strokeStyle = shine ? '#5a4210' : '#3a2a1a'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-40 + i * 18, -62 + i * 4); c.lineTo(-30 + i * 18, -48 + i * 4); c.stroke(); }
  if (torn) { c.fillStyle = '#1a1a1a'; c.beginPath(); c.ellipse(20, -36, 14, 9, .3, 0, 7); c.fill(); c.strokeStyle = '#2a1a0a'; c.beginPath(); c.moveTo(-70, -50); c.lineTo(-50, -30); c.lineTo(-60, -14); c.stroke(); }
  c.save(); if (torn) { c.translate(-10, 0); c.rotate(flap); c.translate(10, 0); } c.fillStyle = shine ? '#ffffff' : '#3a3a3a'; c.fillRect(-94, 0, 190, 12); c.restore();
  if (shine) { c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-30, -56, 22, 6, -.3, 0, 7); c.fill(); }
  c.restore(); };

const REEL = { title: 'Make their sacrifice worth it', bpm: 120, scenes: [
// 1 — Every big story has a lonely chapter
{ dur: 6.5, draw(c, t) {
  const GY = 1330, mo = Math.max(1, Math.round(12 * E.p(t, 2.4, 5.6, 'lin'))), done = t > 5.6;
  PRIN(c, 'EVERY BIG STORY HAS A LONELY CHAPTER.', 470, done ? GOLD : '#e8e8e8');
  E.shaded(c, 120, 600, 840, GY - 600, 10, '#2a2a2e', '#18181b'); E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // the window: a big city that isn't his yet
  E.rrect(c, 600, 660, 300, 240, 8, '#0a0e14', '#5a5a5a', 6); for (let i = 0; i < 26; i++) { const bx = 610 + (i * 37) % 280, bh = 60 + 120 * E.rnd(i); c.fillStyle = '#16181c'; c.fillRect(bx, 900 - bh, 30, bh); for (let w = 0; w < 4; w++) if (E.rnd(i * 7 + w + Math.floor(t * 2)) > .55) { c.fillStyle = done ? GOLD : '#ffe7a8'; c.fillRect(bx + 6 + (w % 2) * 12, 900 - bh + 10 + Math.floor(w / 2) * 20, 6, 8); } }
  E.line(c, 750, 660, 750, 900, '#5a5a5a', 5); E.line(c, 600, 780, 900, 780, '#5a5a5a', 5);
  // the room fills up month by month
  E.shaded(c, 160, GY - 40, 260, 40, 8, '#5a5a6a', '#2a2a34');
  if (t < 1.2) E.shaded(c, 440, GY - 100, 90, 100, 8, '#6a5a4a', '#3a2a1a');
  if (mo > 3) { E.shaded(c, 600, GY - 110, 220, 16, 4, '#6a5a4a', '#3a2a1a'); E.line(c, 614, GY - 94, 614, GY, '#555', 6); E.line(c, 806, GY - 94, 806, GY, '#555', 6); c.save(); c.fillStyle = '#2a2a2e'; c.beginPath(); c.moveTo(660, GY - 110); c.lineTo(670, GY - 180); c.lineTo(760, GY - 180); c.lineTo(750, GY - 110); c.fill(); c.restore(); E.glowDot(c, 710, GY - 150, 120, 'rgba(120,190,255,.35)'); }
  if (mo > 6) { const g = E.p(t, 4.0, 5.6); E.rrect(c, 860, GY - 60, 40, 60, 6, '#6a5a4a'); E.line(c, 880, GY - 60, 880, GY - 60 - 90 * g, '#8a8a8a', 4); c.save(); c.fillStyle = done ? GOLD : '#9a9a9a'; c.beginPath(); c.arc(880, GY - 60 - 90 * g, 26 * g, 0, 7); c.fill(); c.restore(); }
  if (mo > 8) for (let i = 0; i < 3; i++) E.rrect(c, 200 + i * 80, 680 + (i % 2) * 30, 60, 80, 4, '#3a3a40', done ? GOLD : '#6a6a6a', 2);
  // him: arrives, the call from home, then nights at the laptop
  let x, y, pose;
  if (t < 1.2) { x = E.lerp(80, 300, E.p(t, 0, 1.2)); y = hipOn(GY, .85); pose = { ...E.walk(t * 7), aF: .3 }; }
  else if (t < 2.6) { x = 290; y = GY - 40 - 64; pose = { ...E.pose('sit'), aF: 2.6, eF: 2.5, hd: -.1 }; }
  else if (!done) { x = 640; y = GY - 62 - 8; pose = { ...E.pose('sit'), tor: .2, aF: 1.4 + .2 * Math.sin(t * 14), eF: .7 }; }
  else { x = 500; y = hipOn(GY, .85); pose = win(t, 5.6); }
  if (done) E.glowDot(c, x, y - 60, 360, 'rgba(245,197,66,.35)', E.p(t, 5.6, 6.0));
  fig(c, { x, y, s: .85, color: done ? GOLD : '#d8d8d8', pose });
  if (t > 1.3 && t < 2.6) { E.glowDot(c, 330, GY - 190, 60, 'rgba(120,190,255,.6)'); E.tag(c, 'MOM CALLING', 330, GY - 250, t, 1.3, { size: 16, color: '#9ac8ff', fill: '#0a1420' }); }
  SAY(c, 'HAVE YOU EATEN?', 470, 990, E.p(t, 1.5, 1.8, 'back') * (1 - E.p(t, 2.5, 2.7)));
  SAY(c, 'YES MOM. DON\'T WORRY.', 320, 1080, E.p(t, 1.9, 2.2, 'back') * (1 - E.p(t, 2.5, 2.7)), 1);
  CNT(c, 160, 1150, 'MONTH', mo, done ? 'THIS CITY IS HOME NOW' : t > 2.4 ? 'ALONE. BUILDING.' : 'DAY 1', done ? GOLD : '#e8e8e8');
} },
// 2 — He wore torn shoes so you could wear new ones
{ dur: 6, draw(c, t) {
  PRIN(c, 'HE WORE TORN SHOES', 450);
  PRIN(c, 'SO YOU COULD WEAR NEW ONES.', 505, GOLD, E.p(t, 2.6, 3.0));
  PANEL(c, ...P1, "DAD'S SHOES"); PANEL(c, ...P2, 'YOUR SHOES', t > 3.2);
  // top: the same torn shoe, step after step, through the rain
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    c.save(); c.strokeStyle = 'rgba(190,205,220,.4)'; c.lineWidth = 3; for (let i = 0; i < 50; i++) { const x = 90 + E.rnd(i) * 900, q = (t * 2.4 + E.rnd(i + 5)) % 1, y = E.lerp(P1[0], gT, q); c.beginPath(); c.moveTo(x + q * 30, y); c.lineTo(x + q * 30 - 10, y + 28); c.stroke(); } c.restore();
    const step = (t * 1.6) % 1, lift = Math.sin(step * Math.PI) * 50, x = 500 + Math.sin(t * 1.6 * Math.PI) * 30;
    shoe(c, x, gT - 6 - lift, 1.5, true, false, step < .5 ? Math.sin(step * Math.PI * 2) * .35 : 0);
    if (step > .9) E.particles(c, x, gT, (step - .9) * 2, { n: 12, speed: 180, color: '#8fb8d8', grav: 600, life: .3, seed: Math.floor(t * 1.6) });
    E.tag(c, 'SAME PAIR. 6 YEARS.', 780, gT - 180, 1, -1, { size: 18, color: '#bbb' }); });
  SAY(c, "I DON'T NEED NEW ONES.", 330, 700, E.p(t, 3.4, 3.7, 'back'));
  // bottom: the box, the lid, the brand-new pair
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
    const open = E.p(t, 1.6, 2.4, 'back');
    E.shaded(c, 420, gB - 120, 240, 120, 6, '#d8d8d8', '#8a8a8a'); c.save(); c.translate(420, gB - 120); c.rotate(-1.2 * open); E.shaded(c, -6, -30, 252, 30, 6, '#e8e8e8', '#9a9a9a'); c.restore();
    if (open > .5) { shoe(c, 540, gB - 110 - 60 * E.p(t, 2.2, 2.8, 'out'), 1.1, false, t > 3.2 ? 'gold' : 'white'); E.glowDot(c, 540, gB - 160, 260, 'rgba(255,255,255,.3)', E.p(t, 2.2, 2.6)); }
    fig(c, { x: 260, y: hipOn(gB, .55), s: .55, lw: 12, color: t > 3.2 ? GOLD : '#fff', pose: t > 2.4 ? { ...E.pose('cheer'), aF: 2.4 + Math.sin(t * 8) * .3 } : E.pose('stand') });
    fig(c, { x: 800, y: hipOn(gB, .85), s: .85, f: -1, color: '#9a9a9a', pose: { ...E.pose('stand'), tor: .25, aF: .8, eF: .4, hd: -.1 } });
    E.particles(c, 540, gB - 170, t - 2.4, { n: 40, speed: 380, grav: 220, life: 1.2 }); });
} },
// 3 — They were never proud of the marks. They were proud of you.
{ dur: 6, draw(c, t) {
  const GY = 1330, hug = 3.4, done = t > hug;
  PRIN(c, 'THEY WERE NEVER PROUD OF THE MARKS.', 450);
  PRIN(c, 'THEY WERE PROUD OF YOU.', 505, GOLD, E.p(t, hug, hug + .4));
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  E.shaded(c, 700, 860, 200, GY - 860, 6, '#3a3a40', '#1e1e22'); E.rrect(c, 760, 960, 80, GY - 960, 4, done ? '#ffe7a8' : '#ffd98a'); E.glowDot(c, 800, 1150, 260, 'rgba(255,214,120,.35)');
  // the report card
  const cardX = t < hug ? E.lerp(120, 560, E.p(t, 0, 2.6, 'lin')) + 50 : 520, cardY = t < hug ? GY - 230 : E.lerp(GY - 230, GY - 10, E.p(t, hug, hug + .5, 'in'));
  c.save(); c.translate(cardX, cardY); c.rotate(t < hug ? -.1 : E.p(t, hug, hug + .5) * 1.2); E.rrect(c, -60, -76, 120, 152, 6, '#f2f2f2', '#9a9a9a', 2); E.text(c, 'REPORT', 0, -50, { size: 14, weight: 800, family: MONO, color: '#555' }); E.text(c, '54%', 0, 0, { size: 38, weight: 900, color: RED }); E.text(c, 'FAILED 2', 0, 40, { size: 14, weight: 800, family: MONO, color: RED }); c.restore();
  // the kid walking home slowly, head down
  const kx = t < 2.6 ? E.lerp(120, 560, E.p(t, 0, 2.6, 'lin')) : 560, kk = { x: kx, y: hipOn(GY, .6), s: .6, lw: 12, color: done ? GOLD : '#d8d8d8', pose: done ? { ...E.pose('stand'), aF: 1.6, eF: .4, aB: 1.5, eB: .4 } : t < 2.6 ? { ...E.walk(t * 5, .3), hd: .6, tor: .2, aF: 1.4, eF: 1.0 } : { ...E.pose('sad'), hd: .7, aF: 1.4, eF: 1.0 } };
  fig(c, kk);
  SAY(c, "I'M SORRY...", 520, GY - 260, E.p(t, 2.6, 2.9, 'back') * (1 - E.p(t, hug, hug + .2)));
  // the parents come out, and hug instead of shouting
  [[760, 'DAD'], [840, 'MOM']].forEach(([x0, nm], i) => { const k = E.p(t, 2.8, hug, 'out'), x = E.lerp(x0, 620 + i * 50, k); fig(c, { x, y: hipOn(GY, .85), s: .85, f: -1, color: done ? '#ffe7a8' : '#9a9a9a', alpha: E.p(t, 2.6, 2.9), pose: done ? { ...E.pose('stand'), tor: .3, aF: 1.7, eF: 1.1, aB: 1.5, eB: 1.1 } : E.walk(t * 6) }); });
  if (done) { E.glowDot(c, 600, GY - 140, 420, 'rgba(245,197,66,.4)', E.p(t, hug, hug + .5)); for (let i = 0; i < 10; i++) { const q = ((t - hug) * .55 + i / 10) % 1; E.heart(c, 440 + i * 30, GY - 220 - q * 280, .34, (1 - q) * E.p(t, hug, hug + .4), i % 2 ? RED : GOLD); } }
  CNT(c, 70, 560, 'MARKS', '54%', done ? 'LOVE: 100%' : 'SCARED TO GO HOME', done ? GOLD : '#e8e8e8', done ? null : RED);
} },
// 4 — Your first salary. Make their sacrifice worth it.
{ dur: 7.5, draw(c, t) {
  const GY = 1330, give = 3.4, done = t > give;
  if (t < 4.6) PRIN(c, 'YOUR FIRST SALARY.', 470); else E.title(c, 'MAKE THEIR SACRIFICE WORTH IT.', 540, 470, t, 4.6, 1e9, { size: 36, weight: 800, ls: 3, family: 'Inter', color: GOLD });
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // the notification
  const nk = E.p(t, .2, .6, 'back') * (1 - E.p(t, 2.0, 2.4));
  if (nk > 0) { c.save(); c.globalAlpha = Math.min(1, nk); c.translate(540, E.lerp(520, 640, Math.min(1, nk))); E.rrect(c, -300, -50, 600, 100, 20, '#141418', GOLD, 3); E.text(c, 'SALARY CREDITED', -40, -14, { size: 26, weight: 800, color: '#e8e8e8' }); E.text(c, 'YOUR FIRST ONE', -40, 22, { size: 18, weight: 700, family: MONO, color: GOLD }); c.save(); c.fillStyle = GOLD; c.beginPath(); c.arc(-240, 0, 28, 0, 7); c.fill(); c.restore(); c.restore(); }
  // dad on his chair, the old torn shoes beside him
  E.shaded(c, 640, GY - 70, 140, 16, 4, '#6a5a4a', '#3a2a1a'); E.line(c, 652, GY - 54, 652, GY, '#555', 5); E.line(c, 768, GY - 54, 768, GY, '#555', 5); E.line(c, 770, GY - 70, 770, GY - 170, '#6a5a4a', 6);
  const stand = E.p(t, 4.4, 5.0);
  fig(c, { x: E.lerp(700, 660, stand), y: E.lerp(GY - 70 - 8, hipOn(GY, .85), stand), s: .85, f: -1, color: t > 4.4 ? '#ffe7a8' : '#9a9a9a', pose: t < 3.8 ? { ...E.pose('sit'), tor: .3, hd: .1 } : t < 4.4 ? { ...E.pose('sit'), tor: .3, aF: 2.6, eF: 2.4, hd: .3 } : { ...E.pose('stand'), tor: .2, aF: 1.7, eF: 1.1, aB: 1.5, eB: 1.1 } });
  shoe(c, 840, GY - 4, .55, true, false, Math.sin(t * 4) * .1);
  // him: walks in with a box, kneels, opens it
  let x = E.lerp(80, 520, E.p(t, .6, 2.6, 'lin')), y = hipOn(GY, .85), pose = { ...E.walk(t * 7), aF: 1.5, eF: .5 };
  if (t > 2.6) { x = 540; pose = t < give ? { ...E.pose('crouch'), aF: 1.6, eF: .2 } : t < 4.4 ? E.pose('crouch') : { ...E.pose('stand'), tor: .2, aF: 1.7, eF: 1.1, aB: 1.5, eB: 1.1 }; if (t < 4.4) y += 30; }
  fig(c, { x, y, s: .85, color: done ? GOLD : '#fff', pose });
  const boxX = t < 2.6 ? x + 60 : 600, boxY = t < 2.6 ? y - 20 : GY - 60, open = E.p(t, give - .3, give + .3, 'back');
  if (t < 4.4) { E.shaded(c, boxX - 50, boxY, 100, 60, 4, '#d8d8d8', '#8a8a8a'); if (open > 0) { c.save(); c.translate(boxX - 50, boxY); c.rotate(-1.3 * open); E.shaded(c, -4, -16, 108, 16, 4, '#e8e8e8', '#9a9a9a'); c.restore(); shoe(c, boxX, boxY + 4 - 50 * open, .55, false, 'gold'); } }
  if (done) { E.glowDot(c, 620, GY - 160, 460, 'rgba(245,197,66,.45)', E.p(t, give, give + .5)); E.rays(c, 620, GY - 160, 480, .25 * E.p(t, give, give + .5), GOLD, 16, t * .15); }
  if (t > 4.4) for (let i = 0; i < 10; i++) { const q = ((t - 4.4) * .5 + i / 10) % 1; E.heart(c, 480 + i * 26, GY - 260 - q * 260, .32, (1 - q) * E.p(t, 4.4, 4.8), i % 2 ? RED : GOLD); }
  if (t > 3.8 && t < 4.6) E.tag(c, 'TEARS', 700, GY - 300, t, 3.8, { size: 16, color: '#9ac8ff', fill: '#0a1420' });
  CNT(c, 70, 560, 'YEARS HE GAVE', 22, done ? 'NEW SHOES FOR DAD' : 'FIRST SALARY', done ? GOLD : '#e8e8e8');
} },
] };
