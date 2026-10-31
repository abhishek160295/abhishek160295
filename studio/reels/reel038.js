// Reel 038 — "They laughed. Then it rained." (≤30s, ref #16/#17 lane: principle per scene, panel cards, crowds)
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
// ref #17 panel card with a tab label
const PANEL = (c, y0, y1, tab, gold = false) => {
  c.save(); c.fillStyle = 'rgba(255,255,255,.035)'; c.strokeStyle = gold ? 'rgba(245,197,66,.8)' : '#34343a'; c.lineWidth = 3; c.beginPath(); c.roundRect(70, y0, 920, y1 - y0, 22); c.fill(); c.stroke(); c.restore();
  c.save(); c.font = `800 18px ${MONO}`; const w = c.measureText(tab).width + 28; c.restore();
  E.rrect(c, 92, y0 + 18, w, 34, 8, gold ? '#2a2208' : '#1c1c20', gold ? GOLD : '#4a4a50', 2);
  E.text(c, tab, 92 + w / 2, y0 + 36, { size: 18, weight: 800, family: MONO, ls: 2, color: gold ? GOLD : '#e8e8e8' });
};
const P1 = [560, 980], P2 = [1010, 1430];
const boat = (c, x, wy, rot, col, figCol, pose, sc = 1) => {
  c.save(); c.translate(x, wy); c.rotate(rot); c.scale(sc, sc);
  E.shaded(c, -80, -14, 160, 32, 12, '#8a7a66', '#3a3026'); E.line(c, 6, -14, 6, -190, '#bbb', 5);
  c.fillStyle = col; c.beginPath(); c.moveTo(12, -184); c.lineTo(84, -44); c.lineTo(12, -44); c.closePath(); c.fill();
  if (pose) fig(c, { x: -38, y: -14 - E.FIG_H * .5, s: .5, color: figCol, pose });
  c.restore();
};

const REEL = { title: 'They laughed. Then it rained.', bpm: 120, scenes: [
// 1 — A smooth sea never made a skilled sailor
{ dur: 7, draw(c, t) {
  const big = 3.6, done = t > 5.4;
  PRIN(c, 'A SMOOTH SEA NEVER MADE A SKILLED SAILOR.', 470, done ? GOLD : '#e8e8e8');
  const sea = (y0, y1, amp, k) => { const crest = t > big ? E.lerp(1150, -100, E.p(t, big, big + 1.8, 'lin')) : 2000;
    const surf = x => y0 + amp * Math.sin(x * .025 + t * 3.2) + amp * .5 * Math.sin(x * .05 - t * 4.1) - (t > big ? 150 * Math.exp(-Math.pow((x - crest) / 110, 2)) : 0);
    c.save(); c.beginPath(); c.roundRect(70, y0 - 300, 920, y1 - y0 + 300, 22); c.clip();
    const g = c.createLinearGradient(0, y0 - 100, 0, y1); g.addColorStop(0, '#2c4458'); g.addColorStop(1, '#0c141a'); c.fillStyle = g;
    c.beginPath(); c.moveTo(70, y1); for (let x = 70; x <= 990; x += 10) c.lineTo(x, surf(x)); c.lineTo(990, y1); c.fill();
    c.strokeStyle = '#c8dceb'; c.lineWidth = 3; c.beginPath(); for (let x = 70; x <= 990; x += 10) x === 70 ? c.moveTo(x, surf(x)) : c.lineTo(x, surf(x)); c.stroke();
    if (t > big) E.particles(c, crest - 30, surf(crest) - 10, (t * 3) % 1 * .35, { n: 12, speed: 200, color: '#e8f0f5', grav: 300, life: .35, seed: Math.floor(t * 3) });
    c.restore(); return surf; };
  // top: calm water, lounging... until the big one
  PANEL(c, ...P1, 'CALM SEAS');
  const sT = sea(880, 975, t < big ? 2 : 10, 0);
  const bxT = 480, slopeT = (sT(bxT + 10) - sT(bxT - 10)) / 20, cap = E.p(t, big + .9, big + 1.5, 'in');
  boat(c, bxT, sT(bxT), Math.atan(slopeT) + cap * 2.4, '#9a9a9a', '#bdbdbd', cap > .3 ? null : { ...E.pose('sit'), aF: 2.8, eF: 2.2, aB: 2.8, eB: 2.2, hd: .2 });
  if (cap > .3) fig(c, { x: bxT + 60, y: sT(bxT) + 20 + 30 * Math.sin(t * 3), s: .5, rot: 1.4, color: '#bdbdbd', pose: E.pose('jump') });
  if (t > big + 1.4) E.tag(c, 'CAPSIZED', bxT, 760, t, big + 1.4, { size: 20, color: RED, fill: '#1e0a0a' });
  CNT(c, 120, 640, 'STORMS', 0, 'NEVER PRACTICED', '#e8e8e8', t > big + 1.4 ? RED : null);
  // bottom: rough water every day, rides the big one
  PANEL(c, ...P2, 'ROUGH SEAS', done);
  const sB = sea(1330, 1425, t < big ? 22 : 18, 1);
  const bxB = 520, slopeB = (sB(bxB + 10) - sB(bxB - 10)) / 20;
  if (done) E.glowDot(c, bxB, sB(bxB) - 120, 360, 'rgba(245,197,66,.4)', E.p(t, 5.4, 5.9));
  boat(c, bxB, sB(bxB), Math.atan(slopeB), done ? GOLD : '#e8e8e8', done ? GOLD : '#fff', done ? win(t, 5.4) : { ...E.pose('stand'), aF: 1.3, eF: .3, aB: -1.1, tor: -Math.atan(slopeB) });
  CNT(c, 120, 1090, 'STORMS', Math.round(40 * E.p(t, 0, big, 'lin')), done ? 'RODE THE BIG ONE' : 'SURVIVED', done ? GOLD : '#e8e8e8');
} },
// 2 — Lions don't turn around for barking dogs
{ dur: 6.5, draw(c, t) {
  const s = .8, done = t > 5.0;
  const dog = (x, gy, f, ph, bark) => { if (x < 110) return; c.save(); c.translate(x, gy); c.scale(f, 1); c.fillStyle = '#8a8a8a'; c.strokeStyle = '#8a8a8a'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.ellipse(0, -34, 30, 14, 0, 0, 7); c.fill(); c.beginPath(); c.arc(30, -50 - (bark ? 4 : 0), 13, 0, 7); c.fill(); c.beginPath(); c.moveTo(24, -60); c.lineTo(20, -74); c.lineTo(32, -62); c.fill();
    [[-18, 1], [-8, -1], [12, 1], [22, -1]].forEach(([lx, d]) => { c.beginPath(); c.moveTo(lx, -24); c.lineTo(lx + d * Math.sin(ph) * 8, -2); c.stroke(); });
    c.beginPath(); c.moveTo(-28, -38); c.lineTo(-44, -54 + Math.sin(ph * 2) * 6); c.stroke(); c.restore();
    if (bark) E.text(c, 'WOOF!', x + f * 46, gy - 88, { size: 18, weight: 900, color: '#bbb' }); };
  PRIN(c, "LIONS DON'T TURN FOR BARKING DOGS.", 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'TURNS AROUND'); PANEL(c, ...P2, 'KEEPS WALKING', done);
  const gT = 940, gB = 1400; E.line(c, 90, gT, 970, gT, '#4a4a50', 3); E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
  E.flag(c, 900, gT, 1, 0); E.flag(c, 900, gB, 1, 0);
  // top: answers every bark and goes nowhere
  const turns = [.9, 2.0, 3.1, 4.2], nd = 1 + turns.filter(x => t > x).length;
  let tx = Math.min(360, 160 + 200 * t), tf = 1, tp = E.walk(t * 9);
  turns.forEach(x => { if (t > x && t < x + .9) { tf = -1; tp = { ...E.pose('point'), aF: 1.6 }; } });
  if (t > 5.1) { tp = { ...E.pose('sit'), hd: .5 }; }
  for (let i = 0; i < nd; i++) dog(tx - 130 - i * 60, gT, 1, t * 12 + i, Math.sin(t * 9 + i) > .3);
  fig(c, { x: tx, y: t > 5.1 ? gT - 52 : hipOn(gT, s), s, f: tf, color: '#bdbdbd', pose: tp });
  turns.forEach((x, i) => SAY(c, ['STOP BARKING!', "I'M NOT A JOKE!", 'LISTEN TO ME!', 'ENOUGH!'][i], tx + 30, 680, E.p(t, x, x + .2, 'back') * (1 - E.p(t, x + .7, x + .9)), 1));
  SAY(c, 'EXHAUSTING.', tx + 40, 690, E.p(t, 5.3, 5.6, 'back'));
  CNT(c, 640, 600, 'METERS', Math.round((tx - 160) / 10), `${nd} DOGS`, '#e8e8e8', RED);
  // bottom: hears it, doesn't turn, the dogs fall behind
  const bx = done ? 880 : E.lerp(160, 880, E.p(t, 0, 5.0, 'lin'));
  for (let i = 0; i < 3; i++) { const dx = Math.min(bx - 140 - i * 70, 300 + i * 30 - i * 70 + 140 * E.p(t, 0, 2)); dog(Math.max(110, dx), gB, 1, t * 12 + i, Math.sin(t * 9 + i) > .3 && t < 4); }
  if (done) E.glowDot(c, 880, hipOn(gB, s) - 60, 340, 'rgba(245,197,66,.4)', E.p(t, 5.0, 5.4));
  fig(c, { x: bx, y: hipOn(gB, s), s, color: done ? GOLD : '#fff', pose: done ? win(t, 5.0) : { ...E.walk(t * 9), hd: -.05 } });
  CNT(c, 640, 1060, 'METERS', Math.round((bx - 160) / 7.2), done ? 'DOGS: STILL BARKING' : 'EYES FORWARD', done ? GOLD : '#e8e8e8');
} },
// 3 — You don't drown by falling in. You drown by staying there.
{ dur: 6.5, draw(c, t) {
  const s = .75, fall = .5, outT = 4.3, done = t > outT;
  PRIN(c, "YOU DON'T DROWN BY FALLING IN.", 450);
  PRIN(c, 'YOU DROWN BY STAYING THERE.', 500, GOLD, E.p(t, 3.4, 3.8));
  const pool = (y0, y1, lit) => { c.save(); c.beginPath(); c.roundRect(70, y0, 920, y1 - y0, 22); c.clip(); const wl = y0 + 230;
    const g = c.createLinearGradient(0, wl, 0, y1); g.addColorStop(0, '#2c4458'); g.addColorStop(1, '#081016'); c.fillStyle = g; c.fillRect(70, wl, 920, y1 - wl);
    c.strokeStyle = '#c8dceb'; c.lineWidth = 3; c.beginPath(); for (let x = 70; x <= 990; x += 10) { const y = wl + 5 * Math.sin(x * .03 + t * 3); x === 70 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore();
    E.shaded(c, 70, wl - 50, 230, 50, 4, '#8a7a66', '#4a4236'); E.shaded(c, 820, wl - 50, 170, 50, 4, '#8a7a66', '#4a4236');
    E.line(c, 830, wl - 50, 830, wl + 90, '#bbb', 5); E.line(c, 860, wl - 50, 860, wl + 90, '#bbb', 5); for (let i = 0; i < 4; i++) E.line(c, 830, wl - 30 + i * 30, 860, wl - 30 + i * 30, '#bbb', 4);
    return wl; };
  // top: falls in, stays there
  PANEL(c, ...P1, 'STAYS THERE'); const wT = pool(...P1);
  let tx = 260, ty = hipOn(wT - 50, s), tp = E.pose('stand'), tr = 0, ta = 1;
  if (t > fall) { const k = E.p(t, fall, fall + .5, 'in'); tx = 260 + 80 * k; ty = E.lerp(hipOn(wT - 50, s), wT - 20, k); tr = 1.2 * k; tp = E.pose('jump'); }
  if (t > fall + .5) { const sink = E.p(t, 2.2, 5.5, 'in'); tx = 340; ty = wT + 10 + sink * 150 + 6 * Math.sin(t * 3); tr = .2; tp = { ...E.pose('sad'), aF: .3, aB: -.3 }; ta = 1 - .7 * sink; }
  c.save(); c.beginPath(); c.roundRect(70, P1[0], 920, P1[1] - P1[0], 22); c.clip(); fig(c, { x: tx, y: ty, s, rot: tr, alpha: ta, color: '#bdbdbd', pose: tp });
  if (t > 2.2) for (let i = 0; i < 6; i++) { const q = ((t * .9 + i / 6) % 1); c.save(); c.globalAlpha = .6 * (1 - q); c.strokeStyle = '#c8dceb'; c.lineWidth = 2; c.beginPath(); c.arc(tx + Math.sin(i * 3 + t) * 14, ty - 60 - q * 120, 5 + i % 3 * 2, 0, 7); c.stroke(); c.restore(); }
  c.restore();
  E.particles(c, 340, wT, t - fall - .45, { n: 30, speed: 420, color: '#d8ecf8', grav: 900, life: .7 });
  SAY(c, "IT'S TOO DEEP.", 520, 700, E.p(t, 1.6, 1.9, 'back'));
  CNT(c, 640, 600, 'SECONDS', `${Math.round(Math.max(0, t - fall) * 10)}`, 'STILL IN THE WATER', '#e8e8e8', RED);
  // bottom: falls in, swims for the ladder, climbs out
  PANEL(c, ...P2, 'SWIMS OUT', done); const wB = pool(...P2);
  let bx = 260, by = hipOn(wB - 50, s), bp = E.pose('stand'), br = 0;
  if (t > fall) { const k = E.p(t, fall, fall + .5, 'in'); bx = 260 + 80 * k; by = E.lerp(hipOn(wB - 50, s), wB - 20, k); br = 1.2 * k; bp = E.pose('jump'); }
  if (t > fall + .5 && t < 3.4) { const k = E.p(t, fall + .5, 3.4, 'inOut'); bx = E.lerp(340, 800, k); by = wB + 6 + 4 * Math.sin(t * 8); br = Math.PI / 2; bp = { ...E.pose('stand'), aF: (t * 8) % (Math.PI * 2), aB: (t * 8 + Math.PI) % (Math.PI * 2), eF: .2, eB: .2 }; }
  if (t >= 3.4 && t < outT) { const k = E.p(t, 3.4, outT); bx = 845; by = E.lerp(wB + 40, hipOn(wB - 50, s), k); br = 0; bp = { ...E.pose('climb'), aF: 2.8 + Math.sin(t * 10) * .2 }; }
  if (done) { bx = 900; by = hipOn(wB - 50, s); br = 0; bp = win(t, outT); E.glowDot(c, 900, by - 60, 320, 'rgba(245,197,66,.4)', E.p(t, outT, outT + .4)); E.particles(c, 900, by + 40, (t * 3) % 1 * .3, { n: 6, speed: 80, color: '#c8dceb', grav: 600, life: .3, seed: Math.floor(t * 3) }); }
  fig(c, { x: bx, y: by, s, rot: br, color: done ? GOLD : '#fff', pose: bp });
  E.particles(c, 340, wB, t - fall - .45, { n: 30, speed: 420, color: '#d8ecf8', grav: 900, life: .7 });
  CNT(c, 640, 1060, 'SECONDS', `${Math.round(Math.min(t, outT) * 10 - 5)}`, done ? 'OUT. DRIPPING. FINE.' : 'SWIMMING', done ? GOLD : '#e8e8e8');
} },
// 4 — They laughed. Then it rained.
{ dur: 8.5, draw(c, t) {
  const GY = 1350, storm = 3.6, flood = E.p(t, 4.0, 6.4, 'inOut'), wl = E.lerp(GY + 40, 1150, flood), done = t > 6.6;
  if (t < 6.6) PRIN(c, 'BUILD BEFORE THE STORM.', 470);
  else { E.title(c, 'THEY LAUGHED.', 540, 430, t, 6.6, 1e9, { size: 34, weight: 700, ls: 4, family: 'Inter', color: '#e8e8e8' }); E.title(c, 'THEN IT RAINED.', 540, 490, t, 7.0, 1e9, { size: 40, weight: 800, ls: 5, family: 'Inter', color: GOLD }); }
  const dark = E.p(t, storm, storm + 1);
  c.save(); c.fillStyle = `rgba(20,24,30,${.5 * dark})`; c.fillRect(-100, 540, 1300, 900); c.restore();
  E.flash(c, t, storm + .3, .15, '220,230,255', .5); E.flash(c, t, 5.2, .12, '220,230,255', .4);
  // ground
  E.shaded(c, -100, GY, 1300, 120, 0, '#3a3a3e', '#121214'); E.line(c, -100, GY, 1180, GY, '#6a6a6a', 3);
  // the crowd: laughing, pointing, then running
  const N = 36;
  for (let i = 0; i < N; i++) {
    const row = i % 3, sc = [.42, .5, .6][row], x0 = 110 + (i * 53) % 540 + row * 18, y0 = GY - 10 - (2 - row) * 26;
    const run = E.p(t, storm + .4 + E.rnd(i) * .6, storm + 2.2 + E.rnd(i) * .6, 'in'), x = x0 - run * 700, laugh = Math.abs(Math.sin(t * 9 + i)) * 10 * (1 - run);
    if (x < -80) continue;
    const pose = run > 0 ? E.run(t * 14 + i) : i % 4 === 0 ? { ...E.pose('point'), aF: 1.6 } : { ...E.pose('cheer'), aF: 1.6 + Math.sin(t * 9 + i) * .6, aB: -1.6 - Math.sin(t * 9 + i) * .6, hd: -.3 };
    fig(c, { x, y: hipOn(y0, sc) - laugh, s: sc, f: run > 0 ? -1 : 1, color: ['#8a8a8a', '#a6a6a6', '#c4c4c4'][row], pose });
  }
  ['HAHA', 'LOL', 'HAHAHA', 'WHY?'].forEach((w, i) => { const a = E.p(t, .4 + i * .5, .7 + i * .5, 'back') * (1 - E.p(t, storm, storm + .3)); if (a > 0) SAY(c, w, 160 + i * 130, 1060 - (i % 2) * 50, a); });
  // the builder and his boat
  const built = E.p(t, .2, 3.2, 'lin'), by = Math.min(GY - 20, wl - 6), bob = t > 4.5 ? Math.sin(t * 2) * 6 : 0;
  if (done) { E.glowDot(c, 800, by - 140, 420, 'rgba(245,197,66,.45)', E.p(t, 6.6, 7.1)); E.rays(c, 800, by - 140, 460, .25 * E.p(t, 6.6, 7.1), GOLD, 14, t * .15); }
  c.save(); c.translate(800, by + bob);
  const planks = Math.floor(built * 8); for (let i = 0; i < planks; i++) E.shaded(c, -150 + i * 38, -40, 36, 40, 4, done ? '#f7d36a' : '#a8835a', done ? '#a07a1a' : '#5e4428');
  if (t > 3.2) { E.line(c, 0, -40, 0, -260, '#bbb', 6); c.fillStyle = done ? GOLD : '#e8e8e8'; c.globalAlpha = E.p(t, 3.2, 3.5); c.beginPath(); c.moveTo(8, -250); c.lineTo(110, -70); c.lineTo(8, -70); c.closePath(); c.fill(); c.globalAlpha = 1; }
  c.restore();
  const hammer = t < 3.2;
  const bo = { x: t < 4.2 ? 650 + 20 * Math.sin(t * 2) : 740, y: t < 4.2 ? hipOn(GY, .75) : hipOn(by + bob - 40, .75), s: .75, color: done ? GOLD : '#fff', pose: done ? win(t, 6.6) : hammer ? { ...E.pose('stand'), aF: 1.8 + .9 * Math.sin(t * 12), eF: .4 } : E.pose('stand') };
  fig(c, bo);
  if (hammer) { const [hx, hy] = E.hand(bo); E.line(c, hx, hy, hx + 26, hy - 20, '#bbb', 6); E.particles(c, 690, GY - 30, (t * 3) % 1 * .25, { n: 6, speed: 160, color: '#c8a46a', grav: 500, life: .25, seed: Math.floor(t * 3) }); }
  // rain and rising water
  if (dark > 0) { c.save(); c.strokeStyle = `rgba(190,205,220,${.5 * dark})`; c.lineWidth = 3; for (let i = 0; i < 120; i++) { const x = E.rnd(i) * 1250 - 80, q = (t * 2.6 + E.rnd(i + 5)) % 1, y = E.lerp(560, wl, q); c.beginPath(); c.moveTo(x + q * 40, y); c.lineTo(x + q * 40 - 14, y + 38); c.stroke(); } c.restore(); }
  if (flood > 0) { c.save(); const g = c.createLinearGradient(0, wl, 0, wl + 300); g.addColorStop(0, 'rgba(44,68,88,.9)'); g.addColorStop(1, 'rgba(8,16,22,.95)'); c.fillStyle = g; c.fillRect(-100, wl, 1300, 600); c.strokeStyle = '#c8dceb'; c.lineWidth = 3; c.beginPath(); for (let x = -100; x <= 1180; x += 12) { const y = wl + 6 * Math.sin(x * .03 + t * 3); x === -100 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); c.restore(); }
  CNT(c, 70, 560, 'DAYS BUILDING', Math.round(100 * built), done ? 'AFLOAT' : t > storm ? 'STORM' : 'THEY\'RE LAUGHING', done ? GOLD : '#e8e8e8');
} },
] };
