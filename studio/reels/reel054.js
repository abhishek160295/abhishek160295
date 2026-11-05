// Reel 054 — "They'll call it luck" (audience-first story: friends leave, relatives ask, late nights, offer letter twist; reference bible, ~25s)
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
const desk = (c, x, gy, lampA, t) => { E.glowDot(c, x + 150, gy - 230, 330, 'rgba(255,214,120,.42)', lampA * (.75 + .25 * Math.sin(t * 7))); E.rrect(c, x, gy - 150, 230, 18, 4, '#5a5a5e'); E.line(c, x + 20, gy - 132, x + 20, gy, '#5a5a5e', 8); E.line(c, x + 210, gy - 132, x + 210, gy, '#5a5a5e', 8); E.shaded(c, x + 30, gy - 186, 90, 36, 4, '#d8d8d8', '#8a8a8a'); E.line(c, x + 170, gy - 150, x + 170, gy - 260, '#8a8a8a', 6); E.line(c, x + 170, gy - 260, x + 130, gy - 290, '#8a8a8a', 6); c.save(); c.fillStyle = '#ffe7a8'; c.beginPath(); c.moveTo(x + 110, gy - 300); c.lineTo(x + 150, gy - 300); c.lineTo(x + 160, gy - 270); c.lineTo(x + 100, gy - 270); c.fill(); c.restore(); };
const REEL = { title: "They'll call it luck", bpm: 120, speed: 1.05, push: .05, drift: 10, dust: true, scenes: [
// 1 — When you start growing, some people start leaving
{ dur: 6.6, zoom: t => 1.1 + .015 * t, focus: [520, 1080], draw(c, t) {
  const GY = 1330, s = 1.05, leave = 3.2, sitT = 3.6;
  TITLE(c, 'WHEN YOU START GROWING,', 450);
  TITLE(c, 'SOME PEOPLE START LEAVING.', 505, RED, E.p(t, leave, leave + .3));
  floor(c, GY); spot(c, 300, GY, 1, 230);
  desk(c, 400, GY, E.p(t, sitT, sitT + .4), t); if (t > sitT) { E.line(c, 290, GY - 66, 370, GY - 66, '#5a5a5e', 8); E.line(c, 300, GY - 66, 300, GY, '#5a5a5e', 6); E.line(c, 360, GY - 66, 360, GY, '#5a5a5e', 6); }
  // the friends
  const left = Math.min(5, Math.max(0, Math.floor((t - leave) / .35) + 1));
  for (let i = 0; i < 5; i++) { const x0 = 640 + i * 80, go = t > leave + i * .35, x = go ? x0 + (t - leave - i * .35) * 420 : x0, laugh = t > 1.9 && t < leave ? Math.sin(t * 18 + i) * .15 : 0; if (x > 1250) continue; fig(c, { x, y: hipOn(GY, .95), s: .95, f: go ? 1 : -1, color: go ? '#6a6a6a' : '#bdbdbd', pose: go ? E.walk(t * 9 + i) : { ...E.pose('stand'), tor: laugh, hd: -.2 + laugh, aF: i % 2 ? .6 : .2, eF: i % 2 ? 1.7 : .2 } }); }
  SAY(c, 'PARTY TONIGHT?', 760, 820, E.p(t, .2, .4) * (t < 1.4 ? 1 : 0), -1);
  SAY(c, "CAN'T. STUDYING.", 330, 780, E.p(t, 1.0, 1.2) * (t < 2.4 ? 1 : 0), 1);
  SAY(c, 'BORING.', 860, 780, E.p(t, 1.9, 2.1) * (t < leave ? 1 : 0), -1);
  SAY(c, "YOU'VE CHANGED.", 700, 880, E.p(t, 2.5, 2.7) * (t < leave + .3 ? 1 : 0), -1);
  // him: stands, then sits at the desk alone
  const sat = t > sitT;
  fig(c, { x: sat ? 330 : 300, y: sat ? GY - 80 : hipOn(GY, s), s, color: '#fff', pose: sat ? { ...E.pose('sit'), tor: .25, hd: .35, aF: 1.3 + .1 * Math.sin(t * 9), eF: .5 } : t > 2.6 ? { ...E.pose('stand'), hd: .3 } : E.pose('stand') });
  TAG(c, `FRIENDS: ${5 - left}`, 820, 650, 1, -1, left ? RED : '#e8e8e8');
  E.shake(c, t, leave, .3, 5);
} },
// 2 — Relatives ask. Let your results answer.
{ dur: 6.2, zoom: t => 1.08 + .015 * t, focus: [540, 1080], draw(c, t) {
  const GY = 1330, s = 1.05, X = 360;
  TITLE(c, 'RELATIVES WILL ASK.', 450);
  TITLE(c, 'LET YOUR RESULTS ANSWER.', 505, GOLD, E.p(t, 4.6, 5.0));
  floor(c, GY);
  E.glowDot(c, 540, 760, 460, 'rgba(255,255,255,.12)', .8 + .2 * Math.sin(t * 5));
  // dinner table and relatives
  E.rrect(c, 520, GY - 170, 430, 20, 4, '#5a5a5e'); E.line(c, 550, GY - 150, 550, GY, '#5a5a5e', 8); E.line(c, 920, GY - 150, 920, GY, '#5a5a5e', 8);
  for (let i = 0; i < 4; i++) { const x = 590 + i * 100, talk = Math.sin(t * 10 + i * 2); fig(c, { x, y: hipOn(GY, .9), s: .9, f: -1, color: '#9a9a9a', pose: { ...E.pose('point'), aF: 1.1 + .4 * talk, hd: .1 * talk } }); }
  // questions fall on his shoulders and pile up
  const Q = ['STILL NO JOB?', 'WHAT PACKAGE?', 'LOOK AT YOUR COUSIN', 'WHAT WILL PEOPLE SAY?', 'WHEN WILL YOU SETTLE?'];
  let land = 0;
  Q.forEach((w, i) => { const t0 = .3 + i * .75, k = E.p(t, t0, t0 + .45, 'in'); if (t < t0) return; if (k >= 1) land++; const y = E.lerp(560, GY - 330 - land * 0 - i * 44, k); c.save(); c.font = `800 20px ${MONO}`; const w2 = c.measureText(w).width + 30; c.restore(); E.shaded(c, X - w2 / 2, y - 40, w2, 40, 6, k >= 1 ? '#7a3a3a' : '#5a5a5e', k >= 1 ? '#3a1a1a' : '#2a2a2e'); E.text(c, w, X, y - 20, { size: 20, weight: 800, family: MONO, ls: 1, color: '#f2f2f2' }); });
  const load = Math.min(5, land);
  fig(c, { x: X, y: hipOn(GY, s) + load * 4, s, color: t > 4.6 ? GOLD : '#fff', pose: t > 4.6 ? { ...E.pose('stand'), tor: -.05, hd: -.15, aB: -.1, aF: .1 } : { ...E.pose('carryUp'), tor: .08 * load, hd: .1 } });
  if (t > 4.6) { halo(c, X, hipOn(GY, s) - 80, E.p(t, 4.6, 5), true); }
  Q.forEach((w, i) => { if (t > .3 + i * .75 + .45 && t < .3 + i * .75 + .6) E.shake(c, t, .3 + i * .75 + .45, .15, 6); });
  TAG(c, `QUESTIONS: ${land * 9 + Math.min(8, Math.floor(t * 3) % 9)}`, 860, 650, 1, -1, '#e8e8e8');
  E.text(c, 'HE SAID NOTHING. HE WENT BACK TO WORK.', 540, 1440, { hud: true, size: 22, weight: 700, ls: 2, color: GOLD, alpha: E.p(t, 4.8, 5.2) });
} },
// 3 — The city sleeps. Your dream doesn't.
{ dur: 6.6, zoom: t => 1.06 + .02 * t, focus: [540, 1000], draw(c, t) {
  const GY = 1330, night = (t % 1.65) / 1.65, day = Math.floor(t / 1.65);
  TITLE(c, 'THE CITY SLEEPS.', 450);
  TITLE(c, "YOUR DREAM DOESN'T.", 505, GOLD, E.p(t, 1.2, 1.6));
  // moon arcs once per night
  const mx = E.lerp(-60, 1140, night); E.glowDot(c, mx, 780 - Math.sin(night * Math.PI) * 60, 160, 'rgba(220,230,255,.35)'); c.save(); c.fillStyle = '#e8e8f0'; c.beginPath(); c.arc(mx, 780 - Math.sin(night * Math.PI) * 60, 26, 0, 7); c.fill(); c.restore();
  floor(c, GY);
  // skyline: windows go dark one by one through each night; one window never does
  const B = [[60, 300], [210, 460], [380, 360], [520, 520], [700, 400], [860, 480], [1000, 330]];
  B.forEach(([x, h], bi) => { E.rrect(c, x, GY - h, 130, h, 4, '#121216', '#3a3a40', 3); for (let r = 0; r < Math.floor((h - 40) / 52); r++) for (let k = 0; k < 3; k++) { const id = bi * 40 + r * 3 + k, mine = bi === 3 && r === 4 && k === 1, off = E.rnd(id) < night * 1.15, on = mine || !off; const wx = x + 14 + k * 38, wy = GY - h + 24 + r * 52; c.save(); c.fillStyle = mine ? GOLD : on ? 'rgba(255,224,150,.75)' : '#1a1a1e'; c.fillRect(wx, wy, 26, 32); c.restore(); if (mine) { E.glowDot(c, wx + 13, wy + 16, 150, 'rgba(245,197,66,.55)', .8 + .2 * Math.sin(t * 9)); } } });
  // him, big in the foreground at his desk
  desk(c, 640, GY, 1, t); E.line(c, 540, GY - 66, 620, GY - 66, '#5a5a5e', 8); E.line(c, 550, GY - 66, 550, GY, '#5a5a5e', 6); E.line(c, 610, GY - 66, 610, GY, '#5a5a5e', 6);
  fig(c, { x: 580, y: GY - 80, s: 1.05, color: '#fff', pose: { ...E.pose('sit'), tor: .3, hd: .35, aF: 1.3 + .15 * Math.sin(t * 12), eF: .5 } });
  const hr = [11, 12, 1, 2, 3][Math.min(4, Math.floor(night * 5))];
  TAG(c, `${hr}:${String(Math.floor((night * 300) % 60)).padStart(2, '0')} ${hr >= 11 ? 'PM' : 'AM'}`, 240, 650, 1, -1, '#e8e8e8');
  TAG(c, `NIGHT ${[1, 87, 214, 365][Math.min(3, day)]}`, 820, 650, 1, -1, day >= 3 ? GOLD : '#e8e8e8');
} },
// 4 — The phone buzzes. They'll call it luck.
{ dur: 7.2, zoom: t => 1.08 + .015 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, s = 1.1, buzz = .5, yes = 1.3, twist = 3.0, done = t > yes;
  TITLE(c, t < twist + .6 ? 'ONE DAY, THE PHONE BUZZES.' : "THEY'LL CALL IT LUCK.", 450, '#f2f2f2', t < twist ? 1 : t < twist + .3 ? 1 - E.p(t, twist, twist + .3) : E.p(t, twist + .6, twist + .9));
  TITLE(c, 'YOU KNOW IT WAS 3 AM.', 505, GOLD, E.p(t, 4.2, 4.6));
  floor(c, GY);
  if (done) { E.rays(c, 700, 900, 900, .25 * E.p(t, yes, yes + .4), GOLD, 18, t * .7); E.glowDot(c, 700, 900, 520, 'rgba(245,197,66,.4)', E.p(t, yes, yes + .4)); }
  // the phone
  const bz = t > buzz && t < yes ? Math.sin(t * 70) * 8 : 0;
  c.save(); c.translate(700 + bz, 900); c.rotate(.06 * Math.sin(t * 2)); E.rrect(c, -150, -270, 300, 540, 36, '#0c0c10', done ? GOLD : '#9a9a9a', 8); E.rrect(c, -40, -252, 80, 12, 6, '#2a2a2e');
  const card = (y0, a, head, body, col) => { if (a <= 0) return; c.save(); c.globalAlpha = a; E.rrect(c, -130, y0, 260, 100, 16, '#1c1c22', col, 3); E.text(c, head, 0, y0 + 30, { size: 16, weight: 800, family: MONO, ls: 2, color: '#8a8a8a' }); E.text(c, body, 0, y0 + 66, { size: 22, weight: 800, ls: 1, color: col }); c.restore(); };
  card(-220 + 40 * (1 - E.p(t, buzz, buzz + .3, 'back')), E.p(t, buzz, buzz + .2), 'OFFER LETTER', "YOU'RE SELECTED.", done ? GOLD : '#f2f2f2');
  card(-100 + 30 * (1 - E.p(t, twist - .6, twist - .3, 'back')), E.p(t, twist - .6, twist - .4), 'FRIENDS (5)', 'PARTY TONIGHT? :)', '#e8e8e8');
  card(20 + 30 * (1 - E.p(t, twist - .2, twist + .1, 'back')), E.p(t, twist - .2, twist), 'FAMILY GROUP', 'WE ALWAYS KNEW!', '#e8e8e8');
  card(140 + 30 * (1 - E.p(t, twist + .2, twist + .5, 'back')), E.p(t, twist + .2, twist + .4), 'RELATIVES', 'SO LUCKY BETA!', '#e8e8e8');
  c.restore();
  // him
  const hy = hipOn(GY, s);
  halo(c, 300, hy - 80, 1, done);
  const laughT = t > twist + .4 && t < 4.2;
  fig(c, { x: 300, y: hy - (done && t < twist ? 30 * Math.abs(Math.sin((t - yes) * 6)) : 0), s, color: done ? GOLD : '#fff', pose: !done ? { ...E.pose('point'), aF: 1.2, hd: .1 } : t < twist ? win(t, yes) : laughT ? { ...E.pose('stand'), tor: -.2 + .08 * Math.sin(t * 20), hd: -.4, aF: .9, eF: 1.9, aB: .3 } : { ...E.pose('stand'), hd: -.1, aF: .6, eF: 1.6 } });
  E.particles(c, 700, 700, t - yes, { n: 70, speed: 560, grav: 300, life: 1.6 });
  if (t > 4.2) for (let i = 0; i < 36; i++) { const q = ((t - 4.2) * (.4 + .3 * E.rnd(i)) + E.rnd(i + 3)) % 1; c.save(); c.globalAlpha = .9 * (1 - q); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1150 - 40 + Math.sin(t * 3 + i) * 30, 380 + q * 1050); c.rotate(t * 4 + i); c.fillRect(-7, -3, 14, 6); c.restore(); }
  E.flash(c, t, yes, .3, '245,197,66', .35);
} },
] };
