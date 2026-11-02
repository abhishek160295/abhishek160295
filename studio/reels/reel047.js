// Reel 047 — "One result is not your life" (audience-first: students; reference bible style, ≤30s)
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
const desk = (c, x, gy, lit) => { E.shaded(c, x, gy - 110, 260, 18, 4, '#6a5a4a', '#3a2a1a'); E.line(c, x + 14, gy - 92, x + 14, gy, '#555', 6); E.line(c, x + 246, gy - 92, x + 246, gy, '#555', 6);
  E.line(c, x + 220, gy - 110, x + 220, gy - 200, '#8a8a8a', 4); c.save(); c.fillStyle = lit ? '#ffe7a8' : '#4a4a4a'; c.beginPath(); c.moveTo(x + 190, gy - 200); c.lineTo(x + 250, gy - 200); c.lineTo(x + 236, gy - 228); c.lineTo(x + 204, gy - 228); c.fill(); c.restore(); if (lit) E.glowDot(c, x + 220, gy - 150, 180, 'rgba(255,214,120,.35)'); };
const book = (c, x, y, open, col = '#e8e8e8') => { c.save(); c.fillStyle = col; if (open) { c.beginPath(); c.moveTo(x - 50, y); c.lineTo(x, y + 8); c.lineTo(x + 50, y); c.lineTo(x + 50, y - 10); c.lineTo(x, y - 2); c.lineTo(x - 50, y - 10); c.fill(); } else E.rrect(c, x - 40, y - 14, 80, 14, 3, '#8a7a6a'); c.restore(); };
const phone = (c, x, y, sc = 1) => { E.glowDot(c, x, y, 70 * sc, 'rgba(120,190,255,.45)'); E.rrect(c, x - 14 * sc, y - 24 * sc, 28 * sc, 48 * sc, 5, '#1a2a3a', '#9ac8ff', 2); };
const clock = (c, x, y, mins, col = '#e8e8e8') => { c.save(); c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.arc(x, y, 58, 0, 7); c.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; E.line(c, x + Math.cos(a) * 46, y + Math.sin(a) * 46, x + Math.cos(a) * 52, y + Math.sin(a) * 52, col, 3); }
  const ha = (mins / 720) * Math.PI * 2 - Math.PI / 2, ma = (mins / 60) * Math.PI * 2 - Math.PI / 2; E.line(c, x, y, x + Math.cos(ha) * 28, y + Math.sin(ha) * 28, col, 6); E.line(c, x, y, x + Math.cos(ma) * 44, y + Math.sin(ma) * 44, col, 4); c.restore(); };
const hhmm = m => { const h = Math.floor(m / 60) % 12 || 12, mm = Math.floor(m % 60); return `${h}:${String(mm).padStart(2, '0')}`; };

const REEL = { title: 'One result is not your life', bpm: 120, scenes: [
// 1 — The night before vs every night before
{ dur: 6.5, draw(c, t) {
  const done = t > 5.0;
  PRIN(c, 'EXAMS ARE WON THE 90 NIGHTS BEFORE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'THE NIGHT BEFORE'); PANEL(c, ...P2, 'EVERY NIGHT BEFORE', done);
  // top: 3 AM panic, pages everywhere, coffee piling up
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); desk(c, 420, gT, true);
    for (let i = 0; i < Math.min(6, Math.floor(t * 1.2)); i++) E.rrect(c, 440 + i * 26, gT - 140, 20, 26, 4, '#d8d8d8', '#8a8a8a', 2);
    for (let i = 0; i < 12; i++) { const q = (t * .8 + i / 12) % 1, x = 560 + Math.cos(i * 2.1 + t * 2) * 260 * q, y = gT - 160 - Math.sin(q * Math.PI) * 220 + i * 6; c.save(); c.translate(x, y); c.rotate(t * 3 + i); c.fillStyle = '#e8e8e8'; c.globalAlpha = .85; c.fillRect(-16, -20, 32, 40); c.restore(); }
    fig(c, { x: 400, y: gT - 62 - 8 + Math.sin(t * 30) * 2, s: .82, color: '#bdbdbd', pose: { ...E.pose('sit'), tor: .5, hd: .4, aF: 2.6 + Math.sin(t * 14) * .3, eF: 1.8, aB: 2.4, eB: 2 } });
    E.tag(c, hhmm(180 + 60 * E.p(t, 0, 5)) + ' AM', 840, P1[0] + 50, 1, -1, { size: 22, color: RED, fill: '#1e0a0a' });
    if (done) E.tag(c, 'EXAM: BLANK', 820, gT - 60, t, 5.0, { size: 18, color: RED, fill: '#1e0a0a' }); });
  SAY(c, "WHY DIDN'T I START EARLIER?!", 640, 610, E.p(t, 2.6, 2.9, 'back'));
  CNT(c, 120, 640, 'CHAPTERS', `${Math.round(9 * E.p(t, 0, 5))}/30`, 'IN ONE NIGHT', '#e8e8e8', RED);
  // bottom: one chapter a night, lamp on, lamp off, 90 times
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); const day = Math.min(90, Math.floor(90 * E.p(t, .2, 4.8, 'lin'))), on = done || (t * 6) % 1 < .6;
    desk(c, 420, gB, on);
    for (let i = 0; i < Math.min(12, Math.floor(day / 7.5)); i++) book(c, 680, gB - 116 - i * 12, false);
    if (done) E.glowDot(c, 360, gB - 120, 340, 'rgba(245,197,66,.4)', E.p(t, 5.0, 5.4));
    fig(c, { x: done ? 300 : 400, y: done ? hipOn(gB, .82) : gB - 62 - 8, s: .82, color: done ? GOLD : '#fff', pose: done ? win(t, 5.0) : { ...E.pose('sit'), tor: .2, aF: 1.4, eF: .6, aB: 1.3, eB: .7, hd: .3 } });
    book(c, 520, gB - 112, true);
    if (done) E.tag(c, 'EXAM: READY', 820, gB - 60, t, 5.0, { size: 18, color: GOLD, fill: '#2a2208' }); });
  CNT(c, 120, 1090, 'NIGHT', Math.min(90, Math.floor(90 * E.p(t, .2, 4.8, 'lin'))), done ? '30/30 CHAPTERS' : 'ONE CHAPTER A NIGHT', done ? GOLD : '#e8e8e8');
} },
// 2 — "Just 5 minutes" is the biggest lie
{ dur: 6, draw(c, t) {
  const done = t > 4.6, mins = 21 * 60 + 207 * E.p(t, .4, 4.6, 'in');
  PRIN(c, '"JUST 5 MINUTES" IS THE BIGGEST LIE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'PICKS UP THE PHONE'); PANEL(c, ...P2, 'PUTS IT AWAY', done);
  // top: on the bed, the feed keeps scrolling, the clock keeps spinning
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.shaded(c, 160, gT - 70, 360, 50, 10, '#4a4a5a', '#2a2a34');
    fig(c, { x: 330, y: gT - 110, s: .8, rot: -Math.PI / 2 + .2, color: '#bdbdbd', pose: { ...E.pose('stand'), aF: 1.8, eF: 1.6, hd: -.3 } });
    phone(c, 420, gT - 210, 1.6);
    c.save(); c.beginPath(); c.rect(400, gT - 244, 44, 70); c.clip(); for (let i = 0; i < 6; i++) { const y = gT - 250 + ((i * 26 - t * 160) % 156 + 156) % 156; c.fillStyle = i % 2 ? '#3a5a7a' : '#5a7a9a'; c.fillRect(404, y, 36, 20); } c.restore();
    clock(c, 780, P1[0] + 170, mins, RED); });
  SAY(c, 'JUST 5 MINUTES.', 520, 650, E.p(t, .3, .6, 'back') * (1 - E.p(t, 2.0, 2.2)));
  CNT(c, 120, 640, 'SCREEN TIME', `${Math.floor((mins - 1260) / 60)}H ${Math.round((mins - 1260) % 60)}M`, 'PAGES READ: 0', '#e8e8e8', RED);
  // bottom: phone in the drawer, the pages turn
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); desk(c, 300, gB, true);
    E.shaded(c, 470, gB - 92, 70, 40, 4, '#5a4a3a', '#3a2a1a'); if (t < 1.0) phone(c, E.lerp(400, 505, E.p(t, .3, .9)), E.lerp(gB - 170, gB - 80, E.p(t, .3, .9)), 1);
    fig(c, { x: 280, y: gB - 62 - 8, s: .82, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('sit'), aF: 2.6, aB: 2.4, eF: .2, eB: .2 } : { ...E.pose('sit'), tor: .2, aF: 1.4 + .2 * Math.sin(t * 6), eF: .6, hd: .3 } });
    book(c, 400, gB - 112, true); for (let i = 0; i < 4; i++) { const q = (t * 1.6 + i / 4) % 1; if (t > 1) { c.save(); c.translate(400, gB - 118); c.scale(Math.cos(q * Math.PI), 1); c.fillStyle = '#f2f2f2'; c.fillRect(0, -4, 48, 8); c.restore(); } }
    clock(c, 780, P2[0] + 170, mins, done ? GOLD : '#e8e8e8'); if (done) E.glowDot(c, 300, gB - 120, 320, 'rgba(245,197,66,.4)', E.p(t, 4.6, 5.0)); });
  CNT(c, 120, 1090, 'PAGES READ', Math.round(42 * E.p(t, 1, 4.6, 'lin')), 'SAME 3 HOURS', done ? GOLD : '#e8e8e8');
} },
// 3 — Most group study is a group chat
{ dur: 6, draw(c, t) {
  const done = t > 4.6;
  PRIN(c, 'MOST GROUP STUDY IS A GROUP CHAT.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'STUDY GROUP'); PANEL(c, ...P2, 'STUDY ALONE', done);
  // top: four friends, closed books, one more reel
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.shaded(c, 340, gT - 100, 380, 18, 4, '#6a5a4a', '#3a2a1a'); E.line(c, 360, gT - 82, 360, gT, '#555', 6); E.line(c, 700, gT - 82, 700, gT, '#555', 6);
    [400, 480, 580, 660].forEach((x, i) => book(c, x, gT - 104, false));
    [[300, 1], [420, 1], [640, -1], [760, -1]].forEach(([x, f], i) => { const laugh = Math.abs(Math.sin(t * 8 + i)) * 8; fig(c, { x, y: hipOn(gT, .62) - laugh, s: .62, f, color: '#9a9a9a', pose: i === 1 ? { ...E.pose('stand'), aF: 2.0, eF: 1.0 } : { ...E.pose('cheer'), aF: 1.6 + Math.sin(t * 8 + i) * .5, aB: -1.4, hd: -.2 } }); if (i === 1) phone(c, 470, gT - 200, 1); });
    ['HAHA', 'BRO LOOK', 'ONE MORE REEL', 'SAME TIME TOMORROW?'].forEach((w, i) => SAY(c, w, 230 + i * 170, 690 + (i % 2) * 40, E.p(t, .3 + i * .9, .6 + i * .9, 'back') * (1 - E.p(t, 1.2 + i * .9, 1.4 + i * .9)))); });
  CNT(c, 790, 600, 'TOPICS DONE', 0, 'FOUR HOURS', '#e8e8e8', RED);
  // bottom: headphones on, syllabus bar filling
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3); desk(c, 300, gB, true);
    fig(c, { x: 280, y: gB - 62 - 8, s: .82, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('sit'), aF: 2.6, aB: 2.4, eF: .2, eB: .2 } : { ...E.pose('sit'), tor: .2, aF: 1.4 + .2 * Math.sin(t * 6), eF: .6, hd: .3 } });
    const [hx, hy] = E.headPos({ x: 280, y: gB - 70, s: .82, pose: E.pose('sit') }); c.save(); c.strokeStyle = done ? GOLD : '#bbb'; c.lineWidth = 5; c.beginPath(); c.arc(hx, hy, 26, Math.PI, 0); c.stroke(); c.restore();
    book(c, 400, gB - 112, true);
    const prog = E.p(t, .3, 4.6, 'lin'); E.rrect(c, 600, P2[0] + 120, 330, 30, 8, '#1c1c20', '#4a4a50', 2); E.rrect(c, 602, P2[0] + 122, 326 * prog, 26, 7, done ? GOLD : '#e8e8e8');
    E.text(c, 'SYLLABUS', 765, P2[0] + 100, { size: 16, weight: 800, family: MONO, ls: 2, color: '#9a9a9a' });
    for (let i = 0; i < 6; i++) { const on = prog > (i + 1) / 6.2; E.text(c, `${on ? '■' : '□'} TOPIC ${i + 1}`, 620 + (i % 2) * 160, P2[0] + 200 + Math.floor(i / 2) * 40, { size: 16, weight: 800, family: MONO, align: 'left', color: on ? (done ? GOLD : '#e8e8e8') : '#5a5a5a' }); } });
  CNT(c, 120, 1090, 'TOPICS DONE', Math.round(6 * E.p(t, .3, 4.6, 'lin')), done ? 'ONE AFTERNOON' : 'HEADPHONES ON', done ? GOLD : '#e8e8e8');
} },
// 4 — One result is not your life
{ dur: 8, draw(c, t) {
  const GY = 1330, fail = .4, cleared = 5.4, done = t > cleared;
  if (t < 6.0) PRIN(c, 'RESULT DAY.', 470); else E.title(c, 'ONE RESULT IS NOT YOUR LIFE.', 540, 470, t, 6.0, 1e9, { size: 36, weight: 800, ls: 3, family: 'Inter', color: GOLD });
  E.shaded(c, -100, GY, 1300, 140, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // the screen
  const scrX = 300, scrY = 640, scrW = 480, scrH = 280;
  E.rrect(c, scrX, scrY, scrW, scrH, 14, '#0c0c0e', done ? GOLD : '#5a5a5a', 6); E.line(c, scrX + scrW / 2, scrY + scrH, scrX + scrW / 2, scrY + scrH + 60, '#5a5a5a', 8);
  if (t > fail && t < 2.4) { E.text(c, 'RESULT:', scrX + scrW / 2, scrY + 100, { size: 30, weight: 800, family: MONO, color: '#9a9a9a' }); E.text(c, 'FAILED', scrX + scrW / 2, scrY + 170, { size: 70, weight: 900, color: RED, alpha: E.p(t, fail, fail + .2) }); }
  E.flash(c, t, fail + .1, .2, '229,72,77', .25);
  // the drop year: lamp on, lamp off, day after day
  const year = E.p(t, 2.6, cleared - .2, 'lin');
  if (t > 2.4 && !done) { E.text(c, 'DROP YEAR', scrX + scrW / 2, scrY + 90, { size: 26, weight: 800, family: MONO, ls: 3, color: '#9a9a9a' }); E.text(c, `DAY ${Math.max(1, Math.round(365 * year))}`, scrX + scrW / 2, scrY + 170, { size: 64, weight: 900, family: MONO, color: '#e8e8e8' }); }
  if (done) { E.glowDot(c, scrX + scrW / 2, scrY + scrH / 2, 500, 'rgba(245,197,66,.45)', E.p(t, cleared, cleared + .5)); E.text(c, 'RESULT:', scrX + scrW / 2, scrY + 100, { size: 30, weight: 800, family: MONO, color: GOLD }); E.text(c, 'CLEARED', scrX + scrW / 2, scrY + 170, { size: 70, weight: 900, color: GOLD, alpha: E.p(t, cleared, cleared + .2) }); }
  E.flash(c, t, cleared, .3, '255,230,170', .35);
  // him, and the people around him
  let pose, x = 540, y = hipOn(GY, .9);
  if (t < 2.4) { pose = t < fail + .4 ? E.pose('stand') : { ...E.pose('crouch'), hd: .7, tor: .8 }; if (t > fail + .4) y += 40; }
  else if (!done) { x = 540; y = GY - 70; pose = { ...E.pose('sit'), tor: .3, aF: 1.4 + .2 * Math.sin(t * 8), eF: .6, hd: .3 }; E.shaded(c, 600, GY - 110, 200, 16, 4, '#6a5a4a', '#3a2a1a'); E.glowDot(c, 700, GY - 160, 160, 'rgba(255,214,120,.35)', (t * 4) % 1 < .6 ? 1 : 0); }
  else pose = win(t, cleared);
  fig(c, { x, y, s: .9, color: done ? GOLD : '#d8d8d8', pose });
  if (t > .9 && t < 2.4) ['WHAT WILL PEOPLE SAY?', 'HE FAILED?', 'TSK TSK'].forEach((w, i) => { const rx = [150, 880, 230][i]; fig(c, { x: rx, y: hipOn(GY, .6), s: .6, f: rx > 540 ? -1 : 1, color: '#6a6a6a', pose: { ...E.pose('point'), aF: 1.5 } }); SAY(c, w, rx, GY - 260 - i * 40, E.p(t, .9 + i * .3, 1.2 + i * .3, 'back')); });
  if (done) [[300, 1], [780, -1]].forEach(([px, f]) => { const k = E.p(t, cleared + .3, cleared + 1.0); fig(c, { x: E.lerp(px, 540 - f * 90, k), y: hipOn(GY, .8), s: .8, f, color: '#ffe7a8', pose: k < 1 ? E.walk(t * 8) : { ...E.pose('stand'), aF: 1.7, eF: .8, aB: 1.5, eB: .8 } }); });
  if (done) for (let i = 0; i < 8; i++) { const q = ((t - cleared) * .5 + i / 8) % 1; E.heart(c, 400 + i * 40, GY - 260 - q * 260, .3, (1 - q) * E.p(t, cleared + 1, cleared + 1.4), i % 2 ? RED : GOLD); }
  CNT(c, 70, 560, t < 2.4 ? 'ATTEMPT' : done ? 'ATTEMPT' : 'DROP YEAR', t < 2.4 ? 1 : done ? 2 : `${Math.round(100 * year)}%`, done ? 'CLEARED' : t < 2.4 ? 'FAILED' : 'TRYING AGAIN', done ? GOLD : '#e8e8e8', t < 2.4 ? RED : null);
} },
] };
