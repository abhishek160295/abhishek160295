// Reel 055 — "Saving it isn't doing it" (audience-first: saved reels, unused course, perfect timetable, close the app; reference bible, ~25s)
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
const bed = (c, x, gy) => { E.rrect(c, x, gy - 110, 460, 60, 10, '#2a2a30', '#6a6a70', 4); E.rrect(c, x - 10, gy - 200, 24, 200, 6, '#3a3a40'); E.line(c, x + 20, gy - 50, x + 20, gy, '#5a5a5e', 8); E.line(c, x + 440, gy - 50, x + 440, gy, '#5a5a5e', 8); E.rrect(c, x + 20, gy - 132, 90, 26, 10, '#8a8a8a'); };
const lying = (c, x, top, col = '#fff') => fig(c, { x, y: top - 22, s: 1.0, rot: -1.57, color: col, pose: { ...E.pose('stand'), aF: 2.2, eF: 1.2, aB: 2.0, eB: 1.3 } });
const phone = (c, x, y, a = 1, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); E.glowDot(c, 0, 0, 200, 'rgba(120,190,255,.5)', a * (.7 + .3 * Math.sin(Date.now ? 0 : 0))); E.rrect(c, -22, -38, 44, 76, 8, a > .2 ? '#bfe0ff' : '#1a1a1e', '#ddd', 3); c.restore(); };
const mark = (c, x, y, s, col, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.moveTo(-14, -20); c.lineTo(14, -20); c.lineTo(14, 20); c.lineTo(0, 9); c.lineTo(-14, 20); c.closePath(); c.fill(); c.restore(); };
const REEL = { title: "Saving it isn't doing it", bpm: 120, speed: 1.05, push: .05, drift: 10, dust: true, scenes: [
// 1 — You saved 500 motivation reels
{ dur: 6.4, zoom: t => 1.1 + .015 * t, focus: [520, 1080], draw(c, t) {
  const GY = 1330, BX = 230, top = GY - 110, hx = 330, k = E.p(t, .1, 5.6, 'lin');
  TITLE(c, 'YOU SAVED 500 MOTIVATION REELS.', 450);
  TITLE(c, "SAVING IT ISN'T DOING IT.", 505, RED, E.p(t, 3.6, 4.0));
  floor(c, GY); bed(c, BX, GY);
  lying(c, hx, top);
  const px = hx - 40, py = top - 150; phone(c, px, py, 1);
  E.glowDot(c, px, py, 260, 'rgba(120,190,255,.35)', .6 + .4 * Math.sin(t * 13));
  // every save flies out of the phone and lands on the pile over him
  const n = Math.floor(k * 70);
  for (let i = 0; i < n + 1; i++) { const born = .1 + (i / 70) * 5.5, q = E.p(t, born, born + .45, 'out'); if (q <= 0) continue; const col = Math.floor(i / 9), tx = BX + 40 + E.rnd(i) * 400, ty = top - 20 - Math.min(260, col * 22) - E.rnd(i + 5) * 40 + (Math.abs(tx - (BX + 240)) / 200) * 60, x = E.lerp(px, tx, q), y = E.lerp(py, ty, q) - Math.sin(q * Math.PI) * 160; mark(c, x, y, 1.3, i % 5 === 0 ? GOLD : '#d8d8d8', E.rnd(i * 3) - .5 + (1 - q) * 4); }
  ['5 AM ROUTINE', 'DISCIPLINE 101', 'STUDY HACKS', 'MINDSET'].forEach((w, i) => TAG(c, w, 700 + (i % 2) * 120, 720 + i * 70, t, .4 + i * .7, '#bbb', t < 4.2 ? 1 : 0));
  TAG(c, `SAVED: ${Math.round(k * 500)}`, 820, 650, 1, -1, k > .7 ? RED : '#e8e8e8');
  E.text(c, 'DONE: 0', 820, 1000, { size: 26, weight: 800, family: MONO, ls: 2, color: RED, alpha: E.p(t, 4.2, 4.5) });
} },
// 2 — You bought the course. You watched 4%.
{ dur: 6.2, zoom: t => 1.08 + .015 * t, focus: [540, 1080], draw(c, t) {
  const GY = 1330, s = 1.05, X = 230;
  TITLE(c, 'YOU BOUGHT THE COURSE. YOU WATCHED 4%.', 450);
  TITLE(c, "BUYING THE TOOLS ISN'T USING THEM.", 505, RED, E.p(t, 3.8, 4.2));
  floor(c, GY); E.glowDot(c, 640, 1000, 520, 'rgba(255,255,255,.2)', .5 + .5 * Math.sin(t * 8)); if (t < 3.8) { const fl = Math.floor(t * 5) % 2; E.rrect(c, 380, 700, 330, 90, 14, fl ? RED : '#f2f2f2', fl ? '#f2f2f2' : RED, 5); E.text(c, ['SALE 70% OFF', 'BUY NOW', 'LAST DAY!'][Math.floor(t * 1.2) % 3], 545, 745, { size: 34, weight: 800, family: MONO, ls: 2, color: fl ? '#f2f2f2' : RED }); }
  // things he bought land one by one
  const items = [
    [.3, 'ONLINE COURSE', 340, 220, 120],
    [1.3, 'GYM SHOES', 580, 180, 90],
    [2.2, 'NEW DIARY', 775, 150, 70],
    [3.0, '3 BOOKS', 585, 170, 90]];
  let landed = 0;
  items.forEach(([t0, w, x, bw, bh], i) => { const q = E.p(t, t0, t0 + .35, 'in'); if (q <= 0) return; if (q >= 1) landed++; const yb = i === 3 ? GY - 90 : GY, y = E.lerp(560, yb - bh, q); E.shaded(c, x, y, bw, bh, 8, '#5a5a5e', '#2a2a2e', '#8a8a8a'); E.text(c, w, x + bw / 2, y + 26, { size: 18, weight: 800, family: MONO, ls: 1, color: '#e8e8e8' });
    if (i === 0) { const pr = E.p(t, t0 + .5, t0 + 1.2) * 4; E.rrect(c, x + 16, y + 60, bw - 32, 18, 9, '#1a1a1e', '#8a8a8a', 2); E.rrect(c, x + 16, y + 60, Math.max(8, (bw - 32) * pr / 100 * 6), 18, 9, Math.floor(t * 3) % 2 ? RED : '#e8e8e8'); E.text(c, `${Math.round(pr)}%`, x + bw / 2, y + 100, { size: 18, weight: 800, family: MONO, color: RED }); }
    if (i === 1) E.text(c, 'STILL IN BOX', x + bw / 2, y + 60, { size: 15, weight: 800, family: MONO, color: '#8a8a8a' });
    if (i === 2) E.text(c, '3 / 200 PAGES', x + bw / 2, y + 52, { size: 14, weight: 800, family: MONO, color: '#8a8a8a' });
    if (i === 3) E.text(c, 'STILL WRAPPED', x + bw / 2, y + 66, { size: 15, weight: 800, family: MONO, color: '#8a8a8a' });
    E.particles(c, x + bw / 2, yb, t - t0 - .35, { n: 16, speed: 260, color: '#9a9a9a', grav: 500, life: .5, seed: i * 7 });
  });
  items.forEach(([t0], i) => E.shake(c, t, t0 + .35, .15, 7));
  const proud = t < 3.8;
  fig(c, { x: X, y: hipOn(GY, s), s, color: '#fff', pose: proud ? { ...E.pose('arms'), hd: -.2 + .05 * Math.sin(t * 6) } : { ...E.pose('stand'), aF: 1.2, eF: 1.2, aB: 1.2, eB: 1.2, hd: .2 } });
  TAG(c, `SPENT: ${(Math.min(4, landed) * 3100).toLocaleString('en-US')}`, 820, 650, 1, -1, '#e8e8e8');
  TAG(c, 'USED: 0', 820, 710, t, 4.0, RED);
} },
// 3 — You made the perfect timetable
{ dur: 6.4, zoom: t => 1.06 + .02 * t, focus: [540, 1040], draw(c, t) {
  const GY = 1330, ring = 3.4;
  TITLE(c, 'YOU MADE THE PERFECT TIMETABLE.', 450);
  TITLE(c, "PLANNING FEELS LIKE PROGRESS. IT ISN'T.", 505, RED, E.p(t, ring + .6, ring + 1));
  floor(c, GY);
  // the timetable fills up, colour-coded and perfect
  const TX = 380, TY = 640, cw = 80, ch = 44, cells = Math.floor(E.p(t, .1, ring, 'lin') * 35);
  E.rrect(c, TX - 20, TY - 20, cw * 7 + 40, ch * 5 + 40, 10, '#16161a', '#5a5a5e', 4);
  const pal = ['#e8e8e8', GOLD, '#9ac8ff', '#bdbdbd', '#f08a24'];
  for (let i = 0; i < 35; i++) { const r = Math.floor(i / 7), k = i % 7; c.save(); c.globalAlpha = i < cells ? .85 : .12; c.fillStyle = i < cells ? pal[Math.floor(E.rnd(i + (t < 3.4 ? Math.floor(t * 7) * 13 : 0)) * 5)] : '#5a5a5e'; c.fillRect(TX + k * cw + 4, TY + r * ch + 4, cw - 8, ch - 8); c.restore(); }
  if (t < ring) { fig(c, { x: 300, y: hipOn(GY, 1.05), s: 1.05, color: '#fff', pose: { ...E.pose('point'), aF: 2.0 + .4 * Math.sin(t * 14), eF: .3 } }); TAG(c, `MAKING IT: ${Math.round(E.p(t, 0, ring, 'lin') * 6)} HRS`, 820, 960, 1, -1, '#e8e8e8'); }
  else { bed(c, 230, GY); lying(c, 330, GY - 110); const sl = Math.sin((t - ring) * 4) > .6; E.rrect(c, 760, GY - 200, 150, 110, 20, '#1c1c20', RED, 5); E.text(c, '5:00', 835, GY - 145, { size: 38, weight: 800, family: MONO, color: RED }); E.shake(c, t, ring, 3, sl ? 3 : 6); for (let i = 0; i < 3; i++) { const q = ((t - ring) * 2 + i / 3) % 1; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = RED; c.lineWidth = 4; c.beginPath(); c.arc(835, GY - 145, 90 + q * 120, -1, 1); c.stroke(); c.beginPath(); c.arc(835, GY - 145, 90 + q * 120, Math.PI - 1, Math.PI + 1); c.stroke(); c.restore(); }
    TAG(c, `SNOOZE x${1 + Math.floor((t - ring) * 1.6)}`, 820, 960, 1, -1, RED); }
  TAG(c, 'FOLLOWED: 0 DAYS', 260, 960, t, ring + .3, RED);
} },
// 4 — This reel is ending. Close the app. Do one thing.
{ dur: 7.2, zoom: t => 1.08 + .02 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, down = 3.0, up = 3.5, walk = 4.0, sitT = 4.8, done = t > sitT;
  TITLE(c, t < down ? 'THIS REEL ENDS IN' : 'CLOSE THE APP.', 450, '#f2f2f2', t < down - .2 ? 1 : E.p(t, down, down + .3));
  TITLE(c, 'DO ONE THING. RIGHT NOW.', 505, GOLD, E.p(t, sitT, sitT + .4));
  if (t < down) { const n = 3 - Math.floor(t), f = t % 1; E.glowDot(c, 540, 800, 420, 'rgba(245,197,66,.35)', 1 - f); E.text(c, String(n), 540, 720, { hud: true, size: Math.round(300 - 120 * E.ease.out(Math.min(1, f * 2))), weight: 800, family: MONO, color: GOLD, alpha: 1 - f * .7 }); E.shake(c, f, 0, .2, 10); }
  floor(c, GY); bed(c, 160, GY); desk(c, 640, GY, E.p(t, sitT, sitT + .3), t);
  if (done) { E.rays(c, 760, 1000, 900, .22 * E.p(t, sitT, sitT + .5), GOLD, 18, t * .8); E.glowDot(c, 760, 1050, 500, 'rgba(245,197,66,.4)', E.p(t, sitT, sitT + .5)); }
  // phone goes face down on the bed
  if (t < down) { phone(c, 220, GY - 260, 1); lying(c, 260, GY - 110); }
  else { const q = E.p(t, down, down + .4, 'out'); c.save(); c.translate(E.lerp(220, 520, q), E.lerp(GY - 260, GY - 122, q)); c.rotate(q * 1.57); E.rrect(c, -22, -38, 44, 76, 8, '#1a1a1e', '#8a8a8a', 3); c.restore(); E.particles(c, 520, GY - 122, t - down - .4, { n: 14, speed: 200, color: '#bdbdbd', grav: 400, life: .5 });
    const x = t < walk ? 300 : t < sitT ? E.lerp(300, 600, E.p(t, walk, sitT, 'lin')) : 600, hy = hipOn(GY, 1.05);
    if (t < up) lying(c, 260, GY - 110); else if (t < walk) fig(c, { x: 300, y: GY - 150, s: 1.05, color: '#fff', pose: { ...E.pose('sit'), tor: -.1 } });
    else if (!done) fig(c, { x, y: hy, s: 1.05, color: '#fff', pose: E.walk(t * 9) });
    else { E.line(c, 540, GY - 66, 620, GY - 66, '#5a5a5e', 8); E.line(c, 550, GY - 66, 550, GY, '#5a5a5e', 6); E.line(c, 610, GY - 66, 610, GY, '#5a5a5e', 6); fig(c, { x: 580, y: GY - 80, s: 1.05, color: GOLD, pose: { ...E.pose('sit'), tor: .3, hd: .35, aF: 1.3 + .15 * Math.sin(t * 12), eF: .5 } });
      for (let i = 0; i < 3; i++) { const q = ((t - sitT) * 1.5 + i / 3) % 1; c.save(); c.translate(700, GY - 170); c.scale(Math.cos(q * Math.PI), 1); c.fillStyle = '#f2f2f2'; c.fillRect(0, -30, 60, 40); c.restore(); }
      E.shaded(c, 660, GY - 172, 80, 22, 4, '#f2f2f2', '#bdbdbd'); }
  }
  TAG(c, 'DAY 1', 820, 650, t, sitT + .2, GOLD);
  E.flash(c, t, sitT, .3, '245,197,66', .3);
  E.particles(c, 760, 900, t - sitT, { n: 60, speed: 500, grav: 280, life: 1.5 });
} },
] };
