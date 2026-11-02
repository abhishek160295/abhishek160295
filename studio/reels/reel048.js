// Reel 048 — "You're not late" (audience-first: young professionals; reference bible style, ≤30s)
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
const env = (c, x, y, rot, col, stamp, gold) => { c.save(); c.translate(x, y); c.rotate(rot); E.rrect(c, -40, -26, 80, 52, 4, gold ? '#f7d36a' : '#e8e8e8'); c.strokeStyle = gold ? '#a07a1a' : '#9a9a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-40, -26); c.lineTo(0, 6); c.lineTo(40, -26); c.stroke(); if (stamp) { c.rotate(-.25); c.strokeStyle = gold ? '#5a4210' : RED; c.lineWidth = 3; c.strokeRect(-46, -14, 92, 28); E.text(c, stamp, 0, 1, { size: 15, weight: 900, family: MONO, color: gold ? '#5a4210' : RED }); } c.restore(); };
const laptop = (c, x, gy, glow) => { E.shaded(c, x, gy - 112, 200, 16, 4, '#6a5a4a', '#3a2a1a'); E.line(c, x + 14, gy - 96, x + 14, gy, '#555', 6); E.line(c, x + 186, gy - 96, x + 186, gy, '#555', 6); c.save(); c.fillStyle = '#2a2a2e'; c.beginPath(); c.moveTo(x + 60, gy - 112); c.lineTo(x + 70, gy - 190); c.lineTo(x + 160, gy - 190); c.lineTo(x + 150, gy - 112); c.fill(); c.restore(); if (glow) E.glowDot(c, x + 115, gy - 150, 120, 'rgba(120,190,255,.4)'); };

const REEL = { title: "You're not late", bpm: 120, scenes: [
// 1 — January fills the gym. Discipline keeps you in it.
{ dur: 6.5, draw(c, t) {
  const GY = 1330, N = 30, MON = ['JAN', 'FEB', 'MAR'], m = Math.min(2, Math.floor(t / 1.8)), done = t > 5.0;
  PRIN(c, 'JANUARY FILLS THE GYM.', 450);
  PRIN(c, 'DISCIPLINE KEEPS YOU IN IT.', 505, GOLD, E.p(t, 4.6, 5.0));
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  for (let r = 0; r < 3; r++) { E.line(c, 820, GY - 120 - r * 70, 1000, GY - 120 - r * 70, '#4a4a4a', 6); for (let k = 0; k < 4; k++) E.rrect(c, 830 + k * 44, GY - 140 - r * 70, 20, 20, 5, '#6a6a6a'); }
  E.rrect(c, 840, 560, 140, 70, 10, '#0c0c0c', '#5a5a5a', 3); E.text(c, MON[m], 910, 597, { size: 36, weight: 900, family: MONO, color: done ? GOLD : '#e8e8e8' });
  let inGym = 0; const QUIT = ['NEXT MONDAY.', 'TOO SORE.', 'NO TIME.', 'NEW YEAR, NEW ME.'];
  for (let i = 0; i < N; i++) {
    const me = i === 17, row = i % 3, sc = [.48, .55, .62][row], x0 = 120 + (i * 97) % 640 + row * 10, y0 = GY - (2 - row) * 26, tl = me ? 99 : .5 + E.rnd(i + 4) * 4.2, leave = E.p(t, tl, tl + 1.0, 'lin');
    if (leave >= 1) continue; inGym++;
    const ph = t * 6 + i, pose = leave > 0 ? E.walk(t * 9 + i) : i % 2 ? { ...E.mix(E.pose('stand'), E.pose('crouch'), (Math.sin(ph) + 1) / 2 * .6), aF: 1.4, eF: 1.5 } : { ...E.pose('stand'), aF: .3, eF: .8 + 1.2 * (Math.sin(ph) + 1) / 2, aB: .2 };
    fig(c, { x: x0 - leave * 600, y: hipOn(y0, sc) + (i % 2 && !leave ? 20 * (Math.sin(ph) + 1) / 2 : 0), s: me ? .7 : sc, f: leave > 0 ? -1 : 1, alpha: 1 - leave, color: me ? (done ? GOLD : '#ffffff') : ['#6a6a6a', '#808080', '#969696'][row], pose: me && done ? win(t, 5.0) : pose });
    if (leave > 0 && leave < .6 && i % 7 === 0) SAY(c, QUIT[(i / 7) % 4 | 0], x0 - leave * 600, y0 - 200, 1 - leave);
  }
  if (done) E.glowDot(c, 120 + (17 * 97) % 640 + 20, GY - 130, 360, 'rgba(245,197,66,.4)', E.p(t, 5.0, 5.5));
  CNT(c, 70, 560, 'IN THE GYM', inGym, done ? 'STILL HERE IN MARCH' : 'GETTING EMPTIER', done ? GOLD : '#e8e8e8');
} },
// 2 — The 9 to 5 pays. The 5 to 9 builds.
{ dur: 6, draw(c, t) {
  const done = t > 4.8, day = Math.max(1, Math.round(180 * E.p(t, .2, 4.8, 'lin'))), hr = 17 + Math.floor((t * 8) % 4);
  PRIN(c, 'THE 9 TO 5 PAYS. THE 5 TO 9 BUILDS.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'AFTER WORK: COUCH'); PANEL(c, ...P2, 'AFTER WORK: BUILDS', done);
  [P1, P2].forEach(P => { E.rrect(c, 800, P[0] + 20, 170, 56, 10, '#0c0c0c', '#4a4a50', 3); E.text(c, `${hr - 12}:00 PM`, 885, P[0] + 49, { size: 26, weight: 800, family: MONO, color: '#e8e8e8' }); });
  // top: couch and a glowing TV, every single night
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.shaded(c, 160, gT - 70, 260, 50, 10, '#4a4a5a', '#2a2a34'); E.shaded(c, 150, gT - 130, 30, 110, 8, '#4a4a5a', '#2a2a34');
    E.rrect(c, 560, gT - 220, 180, 110, 6, '#141414', '#5a5a5a', 4); E.glowDot(c, 650, gT - 165, 200, 'rgba(120,190,255,.35)', .7 + .3 * Math.sin(t * 13)); E.line(c, 650, gT - 110, 650, gT, '#5a5a5a', 5);
    fig(c, { x: 280, y: gT - 76, s: .8, color: '#9a9a9a', pose: { ...E.pose('sit'), tor: -.2, hd: .3, aF: .6, eF: 1.6 } }); });
  CNT(c, 120, 650, 'DAY', day, 'PROJECT: 0%', '#e8e8e8', RED);
  // bottom: laptop every night, and a building rising next to him
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); laptop(c, 220, gB, true);
    fig(c, { x: 200, y: gB - 62 - 8, s: .82, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('sit'), aF: 2.6, aB: 2.4, eF: .2, eB: .2 } : { ...E.pose('sit'), tor: .2, aF: 1.4 + .2 * Math.sin(t * 14), eF: .7, aB: 1.3 - .2 * Math.sin(t * 14), eB: .7 } });
    const fl = Math.floor(8 * E.p(t, .2, 4.8, 'lin'));
    if (done) E.glowDot(c, 640, gB - 160, 340, 'rgba(245,197,66,.4)', E.p(t, 4.8, 5.3));
    for (let i = 0; i < fl; i++) { E.shaded(c, 560, gB - (i + 1) * 36, 160, 34, 3, done ? '#f7d36a' : '#8a8a8e', done ? '#a07a1a' : '#3a3a3e'); for (let w = 0; w < 3; w++) E.rrect(c, 576 + w * 46, gB - (i + 1) * 36 + 8, 26, 18, 2, (i + w + Math.floor(t * 3)) % 3 ? '#ffe7a8' : '#2a2a2a'); }
    if (done) E.tag(c, 'YOURS', 640, gB - 8 * 36 - 30, t, 4.8, { size: 18, color: GOLD, fill: '#2a2208' }); });
  CNT(c, 120, 1100, 'DAY', day, `PROJECT: ${Math.round(100 * E.p(t, .2, 4.8, 'lin'))}%`, done ? GOLD : '#e8e8e8');
} },
// 3 — You only need one yes
{ dur: 6, draw(c, t) {
  const done = t > 4.8;
  PRIN(c, 'YOU ONLY NEED ONE YES.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'STOPPED AT 10'); PANEL(c, ...P2, 'SENT 47', done);
  const row = (P, gy, max, gold) => clip(c, P, () => { E.line(c, 90, gy, 970, gy, '#4a4a50', 3); laptop(c, 200, gy, true);
    const rate = max === 10 ? 3.6 : 10, sent = Math.min(max, Math.floor(t * rate / 1.0) + 1);
    for (let i = 0; i < sent; i++) { const t0 = i / rate, dt = t - t0; if (dt < 0) continue; const k = Math.min(1, dt / .5), x = E.lerp(400, 860, k), y = E.lerp(gy - 160, gy - 200 - (i % 4) * 20, k) - Math.sin(k * Math.PI) * 60;
      const isOffer = gold && i === max - 1; if (dt < 1.2) env(c, x, y, k * 2, '#e8e8e8', dt > .55 ? (isOffer ? 'OFFER' : 'REJECTED') : null, isOffer && dt > .55); }
    const pile = Math.min(sent, Math.floor(Math.max(0, t - .6) * rate)); for (let i = 0; i < Math.min(14, pile); i++) env(c, 700 + (i % 7) * 30, gy - 30 - Math.floor(i / 7) * 30, (E.rnd(i) - .5) * .6, '#e8e8e8', 'NO', false);
    if (gold && done) { E.glowDot(c, 800, gy - 220, 360, 'rgba(245,197,66,.5)', E.p(t, 4.8, 5.3)); E.rays(c, 800, gy - 220, 400, .3 * E.p(t, 4.8, 5.3), GOLD, 14, t * .2); env(c, 800, gy - 220, 0, '#e8e8e8', 'OFFER', true); E.particles(c, 800, gy - 220, t - 4.8, { n: 60, speed: 480, grav: 240 }); }
    const quit = !gold && t > 3.0;
    fig(c, { x: 180, y: quit ? gy - 62 - 8 : gy - 62 - 8, s: .82, color: gold ? (done ? GOLD : '#fff') : '#9a9a9a', pose: gold && done ? { ...E.pose('sit'), aF: 2.6, aB: 2.4, eF: .2, eB: .2 } : quit ? { ...E.pose('sit'), tor: .5, hd: .7 } : { ...E.pose('sit'), tor: .2, aF: 1.4 + .2 * Math.sin(t * 14), eF: .7 } });
    return sent; });
  row(P1, gT, 10, false); row(P2, gB, 47, true);
  SAY(c, "IT'S NOT HAPPENING FOR ME.", 420, 690, E.p(t, 3.2, 3.5, 'back'));
  CNT(c, 640, 600, 'APPLIED', Math.min(10, Math.floor(t * 3.6) + 1), 'OFFERS: 0', '#e8e8e8', RED);
  CNT(c, 640, 1060, 'APPLIED', Math.min(47, Math.floor(t * 10) + 1), done ? 'OFFERS: 1' : 'REJECTED: ' + Math.min(46, Math.floor(t * 10)), done ? GOLD : '#e8e8e8');
} },
// 4 — Their timeline isn't yours
{ dur: 8, draw(c, t) {
  const X0 = 200, X1 = 900, age = a => E.lerp(X0, X1, (a - 20) / 10), LANES = [[780, 'YOUR COUSIN'], [960, 'YOUR FRIEND'], [1200, 'YOU']], big = 6.0, done = t > big;
  if (t < 6.4) PRIN(c, "THEIR TIMELINE ISN'T YOURS.", 470); else E.title(c, "YOU'RE NOT LATE. YOU'RE ON YOUR TIME.", 540, 470, t, 6.4, 1e9, { size: 32, weight: 800, ls: 3, family: 'Inter', color: GOLD });
  for (let a = 20; a <= 30; a += 2) { E.line(c, age(a), 1300, age(a), 1320, '#4a4a4a', 3); E.text(c, `${a}`, age(a), 1345, { size: 18, weight: 800, family: MONO, color: '#7a7a7a' }); }
  E.text(c, 'AGE', 150, 1345, { size: 16, weight: 800, family: MONO, color: '#5a5a5a' });
  LANES.forEach(([y, name], li) => { E.line(c, X0, y, X1 + 40, y, li === 2 ? (done ? GOLD : '#6a6a6a') : '#3a3a3a', 4); E.text(c, name, X0 - 20, y - 30, { size: 16, weight: 800, family: MONO, align: 'left', color: li === 2 ? (done ? GOLD : '#e8e8e8') : '#8a8a8a' }); });
  // the others: fast, milestones pop
  const MS = [[0, 22, 'JOB', .6], [0, 24, 'CAR', 1.4], [0, 25, 'MARRIED', 2.0], [1, 23, 'JOB', 1.0], [1, 24.5, 'HOUSE', 1.8], [1, 26, 'PROMOTION', 2.6]];
  [0, 1].forEach(li => { const a = Math.min(30, 20 + 10 * E.p(t, 0, 3.4 + li * .4, 'out')), x = age(a), y = LANES[li][0]; fig(c, { x, y: hipOn(y, .45), s: .45, lw: 12, color: '#9a9a9a', pose: a < 30 ? E.run(t * 14 + li) : E.pose('stand') }); });
  MS.forEach(([li, a, w, t0]) => { if (t < t0) return; const k = E.p(t, t0, t0 + .25, 'back'), x = age(a), y = LANES[li][0]; E.line(c, x, y, x, y - 70 * k, '#8a8a8a', 3); E.tag(c, w, x, y - 90 * k, 1, -1, { size: 14, color: '#bbb', alpha: k }); });
  // you: slow... the relatives talk... then your thing
  const ya = 20 + 8 * E.p(t, 0, big, 'in'), yx = age(ya), yy = LANES[2][0];
  ['WHAT ARE YOU DOING NOW?', 'YOUR COUSIN GOT A JOB.', 'WHEN WILL YOU SETTLE?'].forEach((w, i) => SAY(c, w, 420 + i * 120, 1080 - (i % 2) * 40, E.p(t, 1.6 + i * 1.0, 1.9 + i * 1.0, 'back') * (1 - E.p(t, 2.6 + i * 1.0, 2.8 + i * 1.0))));
  if (done) { const k = E.p(t, big, big + .4, 'back'), gx = age(28); E.glowDot(c, gx, yy - 120, 420, 'rgba(245,197,66,.5)', E.p(t, big, big + .5)); E.rays(c, gx, yy - 120, 460, .3 * E.p(t, big, big + .5), GOLD, 16, t * .2); E.line(c, gx, yy, gx, yy - 160 * k, GOLD, 5); E.tag(c, 'YOUR THING', gx, yy - 190 * k, 1, -1, { size: 22, color: GOLD, fill: '#2a2208', alpha: k }); E.flash(c, t, big, .25, '255,230,170', .3); E.particles(c, gx, yy - 160, t - big, { n: 70, speed: 520, grav: 220, life: 1.6 }); }
  fig(c, { x: yx, y: hipOn(yy, .55), s: .55, color: done ? GOLD : '#fff', pose: done ? win(t, big) : E.walk(t * 6) });
  CNT(c, 70, 560, 'YOUR AGE', Math.floor(ya), done ? 'RIGHT ON TIME' : 'BEHIND? NO.', done ? GOLD : '#e8e8e8');
} },
] };
