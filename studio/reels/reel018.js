// Reel 018 — "Nobody is watching you that closely"
const eye = (c, x, y, s, a, look) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, 0, 26, 16, 0, 0, 7); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(look * 10, 0, 9, 0, 7); c.fill(); c.restore(); };
const REEL = { title: 'Nobody is watching you that closely', bpm: 150, pace: 'fast', scenes: [
// 1 — You trip in public
{ dur: 5, floor: 1300, cam: [140, 820, 940, 1320], draw(c, t) {
  E.title(c, 'You trip in public.', W / 2, 420, t, -1, 2.5, { size: 56, weight: 800 });
  E.title(c, 'Nobody even noticed.', W / 2, 420, t, 2.7, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1300; E.shaded(c, 140, gy, 800, 26, 4, '#7a7a7a', '#3a3a3a');
  const crowd = [[220, 1], [330, 1], [760, -1], [870, -1]];
  const imagine = E.p(t, .9, 1.2, 'back') * (1 - E.p(t, 2.4, 2.6));
  if (imagine > 0) { c.save(); c.fillStyle = `rgba(229,72,77,${.12 * imagine})`; c.fillRect(-500, 0, 2100, 2400); c.restore(); }
  crowd.forEach(([x, f], i) => {
    const fig = { x, y: gy - E.FIG_H * .95 - 2, s: .95, f, color: '#8a8a8a', pose: E.pose('stand') };
    fig.pose = t > 2.6 ? { ...E.pose('stand'), aF: 1.0, eF: 1.9, hd: .45 + Math.sin(t * 4 + i) * .08 } : { ...E.pose('stand'), tor: .25 * imagine * Math.sin(t * 5 + i) + .2 * imagine, aF: .3 + imagine * (1.2 + Math.sin(t * 9 + i) * .3), eF: .2 };
    E.figure(c, fig);
    const [hx, hy] = E.headPos(fig);
    if (imagine > 0) { const lk = -f * (.6 + .4 * Math.sin(t * 7 + i)); eye(c, hx - 14, hy - 4, .8 * imagine, imagine, lk); eye(c, hx + 14, hy - 4, .8 * imagine, imagine, lk); }
    if (t > 2.6) { const [px, py] = E.hand(fig); E.phone(c, px, py - 16, 1.3); E.glowDot(c, px, py - 20, 70, 'rgba(120,190,255,.45)'); }
    if (imagine > .5 && i % 2 === 0) E.tag(c, i ? 'SO AWKWARD' : 'LOL', hx, hy - 90, t, 1.0 + i * .2, { size: 26, color: RED, fill: '#2a0d0f' });
    if (t > 2.8 && i % 2 === 1) E.tag(c, i === 1 ? 'dinner?' : 'scrolling…', hx, hy - 90, t, 2.8 + i * .1, { size: 24, color: '#aaa' });
  });
  E.text(c, 'EVERYONE SAW', 540 + Math.sin(t * 40) * 5 * imagine, 900, { size: 48 + Math.sin(t * 9) * 4, weight: 900, ls: 4, color: RED, alpha: imagine });
  if (imagine > 0) for (let i = 0; i < 8; i++) { const q = ((t * 1.5 + i / 8) % 1); E.text(c, '!', 200 + i * 95, 1000 - q * 120, { size: 40, weight: 900, color: RED, alpha: imagine * Math.sin(q * Math.PI) }); }
  const fall = E.p(t, .25, .65, 'in'), up = E.p(t, 2.7, 3.2, 'out');
  const x = 540, y = E.lerp(E.lerp(gy - E.FIG_H * 1.1 - 2, gy - 36, fall), gy - E.FIG_H * 1.1 - 2, up);
  E.figure(c, { x, y, s: 1.1, rot: fall * Math.PI / 2 * (1 - up), color: t > 2.7 ? GOLD : '#fff', pose: t < 2.7 ? (fall < 1 ? E.pose('jump') : E.pose('stand')) : { ...E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 3.1, 3.4, 'back')), aF: 2.6 + Math.sin(t * 7) * .25 } });
  E.particles(c, 540, gy - 10, t - .65, { n: 20, speed: 300, color: '#999', life: .6 });
  E.particles(c, 540, gy - 250, t - 3.1, { n: 50, speed: 520 });
} },
// 2 — The awkward thing you said
{ dur: 5, floor: 1300, cam: [120, 740, 960, 1320], draw(c, t) {
  E.title(c, 'Replaying that awkward moment?', W / 2, 420, t, -1, 2.5, { size: 48, weight: 800 });
  E.title(c, 'They forgot it in 5 minutes.', W / 2, 420, t, 2.7, 1e9, { size: 50, weight: 900, color: GOLD });
  const gy = 1300; E.shaded(c, 120, gy, 840, 26, 4, '#7a7a7a', '#3a3a3a');
  const bed = (x) => { E.shaded(c, x, gy - 90, 300, 44, 10, '#5a5a66', '#2c2c34'); E.rrect(c, x + 8, gy - 116, 70, 28, 12, '#cfcfcf'); E.line(c, x + 12, gy - 46, x + 12, gy, '#777', 7); E.line(c, x + 288, gy - 46, x + 288, gy, '#777', 7); };
  bed(140); bed(640);
  E.figure(c, { x: 300, y: gy - 110, s: .8, rot: -Math.PI / 2, pose: { ...E.pose('stand'), hd: Math.sin(t * 3) * .2 }, color: t > 2.6 ? '#aaa' : '#fff' });
  // your head: the moment on loop
  const a = 1 - E.p(t, 2.6, 2.9);
  if (a > 0) { c.save(); c.globalAlpha = a; c.fillStyle = '#4a4a56'; [[300, 900, 150], [210, 960, 70], [400, 950, 80]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }); c.restore();
    E.figure(c, { x: 260, y: 900 - 40, s: .38, lw: 16, pose: { ...E.pose('stand'), aF: 2.6 + Math.sin(t * 14) * .4, eF: .2 }, alpha: a });
    E.figure(c, { x: 360, y: 900 - 40, s: .38, lw: 16, f: -1, pose: E.pose('stand'), alpha: a, color: '#888' });
    E.text(c, `REPLAY ×${1 + Math.floor(t * 18)}`, 300, 790, { size: 34, weight: 900, color: RED, alpha: a }); }
  // them: thinking about pizza, already asleep
  const b = E.p(t, 2.5, 2.8, 'back');
  E.figure(c, { x: 800, y: gy - 110, s: .8, rot: -Math.PI / 2, pose: E.pose('stand'), color: '#ddd' });
  if (b > 0) { c.save(); c.globalAlpha = b; c.fillStyle = '#4a4a56'; [[790, 900, 140], [700, 960, 60], [880, 950, 70]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r * b, 0, 7); c.fill(); }); c.restore();
    c.save(); c.translate(790, 900); c.rotate(Math.sin(t * 3) * .1); c.scale(b, b); c.fillStyle = '#f2b25a'; c.beginPath(); c.moveTo(-70, -50); c.lineTo(70, -50); c.lineTo(0, 80); c.closePath(); c.fill(); c.fillStyle = '#c8783a'; c.fillRect(-74, -62, 148, 18); c.fillStyle = '#d23a3a'; [[-30, -20], [20, -10], [0, 30]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill(); }); c.restore();
    for (let i = 0; i < 3; i++) { const q = ((t - 2.6) * .8 + i / 3) % 1; E.text(c, 'z', 880 + q * 60, gy - 200 - q * 120, { size: 34 + i * 6, weight: 800, color: '#aaa', alpha: Math.sin(q * Math.PI) }); } }
} },
// 3 — Bad hair day
{ dur: 5, floor: 1300, cam: [140, 760, 940, 1320], draw(c, t) {
  E.title(c, 'Bad hair day?', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, "Everyone's busy with their own.", W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const gy = 1300; E.shaded(c, 140, gy, 800, 26, 4, '#7a7a7a', '#3a3a3a');
  const spot = 1 - E.p(t, 2.4, 2.7);
  const x = t < 2.6 ? E.lerp(260, 470, t / 2.6) : E.lerp(470, 640, E.p(t, 2.6, 5, 'lin'));
  if (spot > 0) { c.save(); const g = c.createLinearGradient(0, 700, 0, gy); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(1, `rgba(255,240,200,${.3 * spot})`); c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, 700); c.lineTo(x + 30, 700); c.lineTo(x + 170, gy); c.lineTo(x - 170, gy); c.fill(); c.restore(); }
  // passers-by, glued to their phones
  [0, 1].forEach(i => { const px = ((i * 420 + t * 150) % 1000) + 60; E.figure(c, { x: px, y: gy - E.FIG_H * .9 - 2, s: .9, color: '#777', pose: { ...E.walk(t * 8 + i, .3), aF: 1.0, eF: 1.9, hd: .45 } }); });
  const hid = t < 2.6;
  const fig = { x, y: gy - E.FIG_H * 1.1 - 2 + (hid ? 30 : 0), s: 1.1, color: t > 2.6 ? GOLD : '#fff', pose: hid ? { ...E.walk(x / 18, .25), tor: .4, aF: 2.9, eF: .6, aB: -2.9, eB: -.6 } : E.walk(x / 22) };
  E.figure(c, fig);
  const [hx, hy] = E.headPos(fig);
  c.save(); c.strokeStyle = fig.color; c.lineWidth = 8; c.lineCap = 'round'; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32 + Math.sin(t * 6 + i) * .08; c.beginPath(); c.moveTo(hx + Math.cos(a) * 26, hy + Math.sin(a) * 26); c.lineTo(hx + Math.cos(a) * 58, hy + Math.sin(a) * 58); c.stroke(); } c.restore();
  if (hid) { c.save(); c.translate(hx, hy - 34); c.fillStyle = '#4a4a4a'; c.beginPath(); c.ellipse(0, 0, 80, 18, 0, 0, 7); c.fill(); E.shaded(c, -46, -60, 92, 60, 14, '#6a6a6a', '#3a3a3a'); c.restore(); }
  else { const q = E.p(t, 2.6, 3.4, 'out'); c.save(); c.translate(E.lerp(hx, hx - 220, q), E.lerp(hy - 34, gy - 20, q)); c.rotate(q * 3); c.fillStyle = '#4a4a4a'; c.beginPath(); c.ellipse(0, 0, 80, 18, 0, 0, 7); c.fill(); c.restore(); }
} },
// 4 — Scared to post
{ dur: 5, floor: 1300, cam: [160, 700, 920, 1320], draw(c, t) {
  E.title(c, 'Scared to post?', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Your first fan: Mom.', W / 2, 420, t, 2.7, 1e9, { size: 56, weight: 900, color: GOLD });
  const gy = 1300, px = 640, py = 1000;
  E.shaded(c, px - 170, py - 300, 340, 600, 40, '#2a2a34', '#0c0c12', '#ddd');
  c.save(); c.beginPath(); c.roundRect(px - 156, py - 286, 312, 572, 30); c.clip(); c.fillStyle = '#16161c'; c.fillRect(px - 160, py - 290, 320, 580);
  E.shaded(c, px - 130, py - 250, 260, 330, 14, '#3a3a48', '#22222a'); E.figure(c, { x: px, y: py - 60 - E.FIG_H * .55, s: .55, lw: 18, pose: E.pose('cheer'), color: '#ddd' });
  const posted = t > 2.4, press = E.p(t, 2.2, 2.4) * (1 - E.p(t, 2.4, 2.6));
  E.rrect(c, px - 110, py + 130, 220, 70, 35, posted ? '#3a3a3a' : GOLD); E.text(c, posted ? 'POSTED' : 'POST', px, py + 166, { size: 34, weight: 900, color: posted ? '#ddd' : '#111' });
  if (posted) { E.text(c, `${Math.min(3, Math.floor((t - 2.4) * 3) + 1)} views`, px, py + 240, { size: 32, weight: 800, color: '#bbb' }); }
  c.restore();
  // your finger hovering, then tapping
  const fig = { x: 330, y: gy - E.FIG_H * 1.05 - 2, s: 1.05, pose: { ...E.pose('point'), aF: 1.35 + Math.sin(t * 9) * .05 * (t < 2.2 ? 1 : 0), tor: .1 + press * .15 } };
  E.figure(c, fig);
  // imagined critics
  const crit = [['cringe', 300, 760, .3], ['who asked?', 880, 820, .7], ['lol', 260, 940, 1.1], ['delete this', 880, 1180, 1.5]];
  crit.forEach(([str, x, y, t0], i) => E.bubble(c, str, x + Math.sin(t * 6 + i) * 4, y, E.p(t, t0, t0 + .2, 'back') * (1 - E.p(t, 2.3, 2.45)), { size: 30, stroke: RED, color: '#ffb3b5', fill: '#2a0d0f' }));
  // reality: one notification from Mom
  const n = E.p(t, 2.8, 3.1, 'back');
  if (n > 0) { c.save(); c.translate(px, py - 360); c.scale(n, n); E.rrect(c, -220, -46, 440, 92, 22, '#f2f2f2'); c.restore(); E.heart(c, px - 170, py - 362, .6 * n); E.text(c, 'Mom liked your video', px + 30, py - 360, { size: 32, weight: 800, color: '#111', alpha: n }); }
  E.particles(c, px - 170, py - 360, t - 3.0, { n: 40, speed: 440, color: '#ff8a8d' });
} },
// 5 — Do the thing
{ dur: 5, floor: 1300, cam: [200, 740, 880, 1320], draw(c, t) {
  E.title(c, 'So do the thing.', W / 2, 420, t, -1, 2.5, { size: 60, weight: 900 });
  E.title(c, 'Dance anyway. Others will join.', W / 2, 420, t, 2.7, 1e9, { size: 48, weight: 900, color: GOLD });
  const gy = 1300;
  E.shaded(c, 260, gy - 60, 560, 60, 8, '#6a5a4a', '#3a2e24');
  const g = c.createLinearGradient(0, 740, 0, gy - 60); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(1, 'rgba(255,240,200,.3)'); c.fillStyle = g; c.beginPath(); c.moveTo(510, 740); c.lineTo(570, 740); c.lineTo(720, gy - 60); c.lineTo(360, gy - 60); c.fill();
  const beat = t * 4.2, d = Math.sin(beat * Math.PI), free = E.p(t, .4, 1.4);
  const pose = { tor: d * .25 * free, hd: -d * .3, aF: 2.4 + d * .6 * free, eF: .3, aB: -1.2 + Math.cos(beat * Math.PI) * 1.4 * free, eB: .6, lF: .5 * d * free, kF: .6 * Math.max(0, d), lB: -.4 * d * free, kB: .6 * Math.max(0, -d) };
  E.figure(c, { x: 540 + Math.sin(t * 2.1) * 70, y: gy - 60 - E.FIG_H * 1.15 - 2 - Math.abs(d) * 26 * free, s: 1.15, pose, color: t > 2.6 ? GOLD : '#fff' });
  [[300, 1], [780, -1], [210, 1]].forEach(([jx, f], i) => { const j = E.p(t, 2.7 + i * .45, 3.1 + i * .45); if (j <= 0) return; const dd = Math.sin(beat * Math.PI + i); E.figure(c, { x: jx, y: gy - E.FIG_H * .8 - 2 - Math.abs(dd) * 18 * j, s: .8, f, alpha: j, color: '#cfcfcf', pose: E.mix(E.pose('stand'), { ...pose, aF: 2.4 + dd * .6, aB: -1.2 + dd * 1.2 }, j) }); });
  for (let i = 0; i < 50; i++) { if (t < 1.2) break; const q = ((t - 1.2) * .5 + E.rnd(i)) % 1, x = 220 + E.rnd(i + 5) * 640 + Math.sin(q * 9 + i) * 20, y = 740 + q * 560; c.save(); c.translate(x, y); c.rotate(q * 9 + i); c.fillStyle = [GOLD, '#ff8a8d', ICE, GREEN][i % 4]; c.fillRect(-8, -5, 16, 10); c.restore(); }
  E.rays(c, 540, 900, 520, .3 * E.p(t, 2.6, 3.0), GOLD, 16, t * .3);
} },
] };
