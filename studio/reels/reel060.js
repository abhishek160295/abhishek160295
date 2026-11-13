// Reel 060 — "This time she eats first" (audience-first: mom up at 5 AM for 20 years, eats last and cold, 'not now mom' x1000, he cooks and serves her first; reference bible, ~25s)
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
const steam = (c, x, y, t, col = '#f2f2f2', n = 3) => { for (let i = 0; i < n; i++) { const q = (t * .9 + i / n) % 1; c.save(); c.globalAlpha = .7 * (1 - q); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 14 + i * 14, y - q * 60); c.quadraticCurveTo(x - 4 + i * 14, y - 14 - q * 60, x - 14 + i * 14, y - 28 - q * 60); c.stroke(); c.restore(); } };
const counter = (c, gy) => { E.rrect(c, 420, gy - 150, 520, 20, 4, '#5a5a5e'); E.shaded(c, 430, gy - 130, 500, 130, 4, '#2a2a30', '#18181c'); };
const plate = (c, x, y, full, col = '#e8e8e8') => { c.save(); c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 40, 10, 0, 0, 7); c.fill(); if (full) { c.fillStyle = full; c.beginPath(); c.ellipse(x, y - 8, 26, 12, 0, Math.PI, 0); c.fill(); } c.restore(); };
const REEL = { title: 'This time she eats first', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — She woke up at 5 AM for 20 years
{ dur: 6.4, zoom: t => 1.1 + .015 * t, focus: [560, 1060], draw(c, t) {
  const GY = 1330, yrs = Math.min(20, 1 + Math.floor(E.p(t, .2, 5.4, 'lin') * 20));
  TITLE(c, 'SHE WOKE UP AT 5 AM.', 450);
  TITLE(c, 'FOR 20 YEARS.', 505, GOLD, E.p(t, 2.6, 3.0));
  // window: sky still dark, moon
  { const yq = (t / .27) % 1, day = .5 - .5 * Math.cos(yq * Math.PI * 2); E.glowDot(c, 240, 770, 520, 'rgba(255,240,200,.45)', day); c.save(); c.fillStyle = `rgba(${Math.round(12 + 200 * day)},${Math.round(14 + 180 * day)},${Math.round(22 + 120 * day)},1)`; c.fillRect(120, 640, 240, 260); c.restore(); }
  c.save(); c.strokeStyle = '#5a5a5e'; c.lineWidth = 5; c.strokeRect(120, 640, 240, 260); c.restore(); E.line(c, 240, 640, 240, 900, '#5a5a5e', 4); E.line(c, 120, 770, 360, 770, '#5a5a5e', 4); c.save(); c.fillStyle = '#e8e8f0'; c.beginPath(); c.arc(300, 700, 18, 0, 7); c.fill(); c.restore();
  floor(c, GY); counter(c, GY);
  // stove flame + pot
  const fl = .8 + .2 * Math.sin(t * 20); E.glowDot(c, 560, GY - 170, 200, 'rgba(255,150,60,.45)', fl); c.save(); c.fillStyle = '#f08a24'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(520 + i * 20, GY - 156, 6, 12 * fl, 0, 0, 7); c.fill(); } c.restore();
  E.rrect(c, 500, GY - 230, 120, 64, 10, '#8a8a8a', '#bdbdbd', 3); steam(c, 560, GY - 240, t);
  // tiffins stack up, one per morning
  const n = Math.floor(E.p(t, .2, 5.4, 'lin') * 14);
  for (let i = 0; i < n; i++) E.shaded(c, 760 + (i % 2) * 70, GY - 172 - Math.floor(i / 2) * 34, 64, 30, 6, i % 3 ? '#d8d8d8' : GOLD, i % 3 ? '#8a8a8a' : '#8a6a24');
  const stir = Math.sin(t * 9) * .3;
  mom(c, { x: 420, y: hipOn(GY, 1.0), s: 1.0, color: '#f2f2f2', pose: { ...E.pose('point'), tor: .12, hd: .25, aF: 1.3 + stir, eF: .6 + stir, aB: .5, eB: 1.2 } });
  TAG(c, '5:00 AM', 240, 960, 1, -1, '#e8e8e8');
  TAG(c, `YEAR ${yrs}`, 820, 650, 1, -1, yrs === 20 ? GOLD : '#e8e8e8');
  TAG(c, `TIFFINS: ${(yrs * 365).toLocaleString('en-US')}`, 820, 710, 1, -1, '#e8e8e8');
} },
// 2 — She ate last. Always. Cold.
{ dur: 6.4, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, serve = 2.8, alone = 3.6;
  TITLE(c, 'SHE ATE LAST. ALWAYS.', 450);
  TITLE(c, 'WHATEVER WAS LEFT. COLD.', 505, RED, E.p(t, alone + .4, alone + .8));
  floor(c, GY);
  { const fl = t < alone ? .9 + .1 * Math.sin(t * 6) : (E.rnd(Math.floor(t * 14)) > .35 ? .9 : .15); E.glowDot(c, 540, 820, 520, 'rgba(255,214,120,.32)', fl); E.line(c, 380, 640, 700, 640, fl > .5 ? '#fff8e0' : '#4a4a4a', 10); }
  E.rrect(c, 220, GY - 150, 640, 20, 4, '#5a5a5e'); E.line(c, 250, GY - 130, 250, GY, '#5a5a5e', 8); E.line(c, 830, GY - 130, 830, GY, '#5a5a5e', 8);
  const fam = [[330, 1.0, 1], [480, .8, 1], [620, 1.0, -1]];
  if (t < alone) { fam.forEach(([x, s, f], i) => { const eat = Math.sin(t * 10 + i * 2); fig(c, { x, y: GY - 80, s, f, color: '#bdbdbd', pose: { ...E.pose('sit'), tor: .25, hd: .2, aF: 1.1 + .4 * eat, eF: 1.2 - .5 * eat } }); plate(c, x + f * 60, GY - 156, '#e0a050'); steam(c, x + f * 60, GY - 172, t, '#f2f2f2', 2); }); }
  else fam.forEach(([x, s, f]) => plate(c, x + f * 60, GY - 156, null, '#8a8a8a'));
  // mom serving, then sitting alone with the leftovers
  if (t < alone) { const mx = t < serve ? 780 + Math.sin(t * 3) * 60 : 800; mom(c, { x: mx, y: hipOn(GY, 1.0), s: 1.0, f: -1, color: '#f2f2f2', pose: { ...E.walk(t * 7), aF: 1.4, eF: .4 } }); E.rrect(c, mx - 100, GY - 250, 70, 30, 8, '#8a8a8a'); steam(c, mx - 65, GY - 262, t); }
  else { mom(c, { x: 540, y: GY - 80, s: 1.0, color: '#bdbdbd', pose: { ...E.pose('sit'), tor: .3, hd: .4, aF: 1.1 + .1 * Math.sin(t * 4), eF: 1.2 } }); plate(c, 600, GY - 156, '#6a6a6a', '#8a8a8a'); }
  [['MORE ROTI!', 330, 820, .5], ['WHERE\'S MY PHONE?', 620, 760, 1.2], ['MOM, WATER!', 480, 880, 1.9]].forEach(([w, x, y, t0]) => SAY(c, w, x, y, E.p(t, t0, t0 + .2) * (t < alone ? 1 : 0), -1));
  TAG(c, 'HOT MEALS: 0', 820, 650, t, alone + .3, RED);
  TAG(c, '10:40 PM', 250, 650, t, alone, '#e8e8e8');
} },
// 3 — "Not now, Mom." 1,000 times.
{ dur: 6.2, zoom: t => 1.08 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, per = 1.15, k = Math.floor(t / per), ph = (t % per) / per, n = Math.min(1000, Math.round(Math.pow(E.p(t, .1, 5.4, 'lin'), 2) * 1000));
  TITLE(c, 'AND YOU SAID "NOT NOW, MOM."', 450);
  TITLE(c, 'A THOUSAND TIMES.', 505, RED, E.p(t, 2.6, 3.0));
  floor(c, GY);
  E.glowDot(c, 640, 980, 360, 'rgba(120,170,255,.35)', .6 + .4 * Math.sin(t * 11));
  // him on the laptop, headphones
  E.rrect(c, 520, GY - 150, 300, 18, 4, '#5a5a5e'); E.line(c, 540, GY - 132, 540, GY, '#5a5a5e', 8); E.line(c, 800, GY - 132, 800, GY, '#5a5a5e', 8);
  c.save(); c.translate(680, GY - 150); c.rotate(-.3); E.rrect(c, -60, -70, 120, 70, 6, '#bfe0ff', '#ddd', 3); c.restore();
  E.line(c, 440, GY - 66, 520, GY - 66, '#5a5a5e', 8); E.line(c, 450, GY - 66, 450, GY, '#5a5a5e', 6);
  fig(c, { x: 480, y: GY - 80, s: 1.05, color: '#fff', pose: { ...E.pose('sit'), tor: .25, hd: .2, aF: 1.3 + .15 * Math.sin(t * 14), eF: .5 } });
  // mom at the door, a different question every time
  E.rrect(c, 90, GY - 380, 150, 380, 8, '#fff0cc', '#8a8a8a', 4); E.glowDot(c, 165, GY - 200, 280, 'rgba(255,230,180,.4)', 1);
  const Q = ['HAVE YOU EATEN?', 'TEA, BETA?', 'SIT WITH ME?', 'HOW WAS YOUR DAY?', 'SHALL I MAKE PARATHA?'];
  mom(c, { x: 200, y: hipOn(GY, .95), s: .95, color: '#d8d8d8', alpha: ph < .75 ? 1 : 1 - E.p(ph, .75, 1), pose: { ...E.pose('stand'), hd: .1, aF: .9, eF: 1.2 } });
  SAY(c, Q[k % Q.length], 240, 820, E.p(ph, .02, .12) * (ph < .55 ? 1 : 0), 1);
  SAY(c, 'NOT NOW, MOM.', 560, 860, E.p(ph, .45, .55) * (ph < .85 ? 1 : 0), -1);
  TAG(c, `"NOT NOW": ${n}`, 820, 650, 1, -1, RED);
} },
// 4 — This time, she eats first.
{ dur: 7.8, zoom: t => 1.08 + .012 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330, alarm = .2, cook = 1.2, serve = 3.6, eat = 4.4;
  TITLE(c, t < serve ? 'ONE MORNING, YOU WAKE UP AT 5.' : 'THIS TIME, SHE EATS FIRST.', 450, t < serve ? '#f2f2f2' : GOLD, t < serve - .2 ? 1 : E.p(t, serve, serve + .3));
  TITLE(c, 'HOT.', 505, GOLD, E.p(t, eat + .4, eat + .8));
  floor(c, GY);
  if (t > serve) { E.rays(c, 540, 960, 900, .22 * E.p(t, serve, serve + .5), GOLD, 18, t * .6); E.glowDot(c, 540, 1050, 500, 'rgba(245,197,66,.4)', E.p(t, serve, serve + .5)); }
  TAG(c, '5:00 AM', 250, 650, 1, -1, t < serve ? '#e8e8e8' : GOLD);
  if (t < serve) {
    { const sr = E.p(t, 0, serve, 'lin'); E.glowDot(c, 740, 720, 600, 'rgba(255,190,110,.5)', sr * (.8 + .2 * Math.sin(t * 5))); c.save(); c.fillStyle = `rgb(${Math.round(12 + 230 * sr)},${Math.round(14 + 150 * sr)},${Math.round(22 + 60 * sr)})`; c.fillRect(640, 640, 200, 200); c.restore(); c.save(); c.strokeStyle = '#5a5a5e'; c.lineWidth = 5; c.strokeRect(640, 640, 200, 200); c.restore(); E.rays(c, 740, 740, 700, .18 * sr, '#ffcf80', 12, t * .5); }
    counter(c, GY); const fl = .8 + .2 * Math.sin(t * 20); E.glowDot(c, 560, GY - 170, 340, 'rgba(255,150,60,.45)', fl * E.p(t, cook, cook + .3)); E.rrect(c, 500, GY - 230, 120, 64, 10, '#8a8a8a', '#bdbdbd', 3); if (t > cook) steam(c, 560, GY - 240, t);
    const stir = Math.sin(t * 9) * .3, x = t < cook ? E.lerp(150, 420, E.p(t, alarm, cook, 'lin')) : 420;
    fig(c, { x, y: hipOn(GY, 1.05), s: 1.05, color: '#fff', pose: t < cook ? E.walk(t * 9) : { ...E.pose('point'), tor: .12, hd: .25, aF: 1.3 + stir, eF: .6 + stir } });
    if (t > 2.2) mom(c, { x: 900, y: hipOn(GY, .95), s: .95, f: -1, color: '#d8d8d8', alpha: E.p(t, 2.2, 2.6), pose: { ...E.pose('stand'), hd: .2, aF: 1.6, eF: 1.8 } });
    if (t > 2.6) SAY(c, 'BETA...? YOU COOKED?', 820, 800, E.p(t, 2.6, 2.8), -1);
  } else {
    E.rrect(c, 260, GY - 150, 560, 20, 4, '#5a5a5e'); E.line(c, 290, GY - 130, 290, GY, '#5a5a5e', 8); E.line(c, 790, GY - 130, 790, GY, '#5a5a5e', 8);
    mom(c, { x: 400, y: GY - 80, s: 1.0, color: GOLD, pose: t > eat ? { ...E.pose('sit'), tor: .15, hd: -.1, aF: 1.1 + .3 * Math.sin(t * 6), eF: 1.0 } : { ...E.pose('sit'), hd: -.2, aF: 1.6, eF: 1.8 } });
    plate(c, 470, GY - 156, '#e0a050'); steam(c, 470, GY - 172, t);
    fig(c, { x: 660, y: t > eat ? GY - 80 : hipOn(GY, 1.05), s: 1.05, f: -1, color: GOLD, pose: t > eat ? { ...E.pose('sit'), hd: -.1, aF: .5, eF: 1.2 } : { ...E.pose('point'), aF: 1.4, eF: .2 } });
    if (t > eat + .6) SAY(c, 'YOU FIRST, MOM.', 700, 860, E.p(t, eat + .6, eat + .8), -1);
    TAG(c, 'HOT MEALS: 1', 820, 650, t, eat, GOLD);
    E.particles(c, 470, 1000, t - serve, { n: 50, speed: 420, grav: 220, life: 1.4 });
    for (let i = 0; i < 28; i++) { const qq = ((t - serve) * (.35 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .7 * (1 - qq); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); }
  }
  E.flash(c, t, serve, .3, '245,197,66', .3);
} },
] };
