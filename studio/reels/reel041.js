// Reel 041 — "Every habit is a vote" (≤25s, Shorts-first: hook at frame 0, payoff every scene, loopable)
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
const card = (c, x, y, w, rot, gold) => { c.save(); c.translate(x, y); c.rotate(rot); E.rrect(c, -58, -18, 116, 36, 6, gold ? '#2a2208' : '#1c1c20', gold ? GOLD : '#8a8a8a', 2); E.text(c, w, 0, 1, { size: 16, weight: 800, family: MONO, color: gold ? GOLD : '#ccc' }); c.restore(); };

const REEL = { title: 'Every habit is a vote', bpm: 120, scenes: [
// 1 — Every habit is a vote for who you become
{ dur: 5.5, draw(c, t) {
  const s = .8, CAD = .42, done = t > 4.6;
  const OLD = ['SNOOZE', 'SKIP', 'SCROLL', 'JUNK', 'LATER', 'SKIP', 'SCROLL', 'SNOOZE', 'EXCUSE', 'LATER'], NEW = ['GYM', 'READ', 'WATER', 'SLEEP', 'WORK', 'WALK', 'LEARN', 'GYM', 'READ', 'FOCUS'];
  PRIN(c, 'EVERY HABIT IS A VOTE FOR WHO YOU BECOME.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'VOTES FOR THE OLD YOU'); PANEL(c, ...P2, 'VOTES FOR THE NEW YOU', done);
  const row = (P, gy, words, gold) => clip(c, P, () => {
    E.line(c, 90, gy, 970, gy, '#4a4a50', 3);
    const n = Math.min(words.length, Math.floor(t / CAD) + 1), fill = n / words.length;
    if (gold && done) E.glowDot(c, 760, gy - 120, 300, 'rgba(245,197,66,.45)', E.p(t, 4.6, 5.0));
    E.shaded(c, 680, gy - 220, 160, 220, 10, gold ? '#3a3220' : '#2e2e32', gold ? '#1a160a' : '#141416', gold ? GOLD : '#5a5a5a');
    c.save(); c.fillStyle = gold ? 'rgba(245,197,66,.55)' : 'rgba(150,150,150,.35)'; c.fillRect(686, gy - 6 - 200 * fill, 148, 200 * fill); c.restore();
    E.rrect(c, 720, gy - 226, 80, 10, 3, '#0a0a0a');
    E.text(c, gold ? 'NEW YOU' : 'OLD YOU', 760, gy - 250, { size: 18, weight: 800, family: MONO, ls: 2, color: gold ? GOLD : '#9a9a9a' });
    words.forEach((w, i) => { const t0 = i * CAD; if (t < t0) return; const k = E.p(t, t0, t0 + .5, 'inOut'); if (k >= 1) return; const x = E.lerp(330, 760, k), y = E.lerp(gy - 170, gy - 230, k) - Math.sin(k * Math.PI) * 130; card(c, x, y, w, k * 3, gold); });
    const thr = (t % CAD) / CAD < .4, o = { x: 280, y: hipOn(gy, s * (gold ? 1 + .12 * E.p(t, 0, 4.6) : 1 - .08 * E.p(t, 0, 4.6))), s: gold ? s * (1 + .12 * E.p(t, 0, 4.6)) : s * (1 - .08 * E.p(t, 0, 4.6)), color: gold ? (done ? GOLD : '#fff') : '#9a9a9a',
      pose: gold && done ? win(t, 4.6) : thr ? { ...E.pose('stand'), aF: 2.3, eF: .2, tor: gold ? 0 : .3 } : { ...E.pose('stand'), aF: .8, eF: .6, tor: gold ? 0 : .35, hd: gold ? 0 : .4 } };
    fig(c, o);
    CNT(c, 120, P[0] + 80, 'VOTES', Math.min(words.length, Math.floor(t / CAD) + 1), gold ? (done ? 'NEW YOU: ELECTED' : 'BECOMING') : 'OLD YOU: WINNING', gold && done ? GOLD : '#e8e8e8', gold ? null : RED);
  });
  row(P1, gT, OLD, false); row(P2, gB, NEW, true);
} },
// 2 — Every shortcut pulls a block from your base
{ dur: 5.5, draw(c, t) {
  const BW = 50, BH = 30, X0 = 600, crash = 3.9, done = t > 4.4;
  PRIN(c, 'EVERY SHORTCUT PULLS A BLOCK FROM YOUR BASE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'TAKES SHORTCUTS'); PANEL(c, ...P2, 'BUILDS ON TOP', done);
  const block = (x, y, w, gold, label, rot = 0, a = 1) => { c.save(); c.globalAlpha = a; c.translate(x + w / 2, y + BH / 2); c.rotate(rot); E.shaded(c, -w / 2 + 1, -BH / 2 + 1, w - 2, BH - 2, 3, gold ? '#f7d36a' : '#c9a06a', gold ? '#a07a1a' : '#7a5a34'); if (label) E.text(c, label, 0, 1, { size: 14, weight: 800, family: MONO, color: '#1a1206' }); c.restore(); };
  // top: pull, pull, pull... collapse
  clip(c, P1, () => { E.line(c, 90, gT, 970, gT, '#4a4a50', 3);
    const PULLS = [[.6, 1, 'SKIP'], [1.6, 3, 'CHEAT'], [2.6, 0, 'LIE']]; const wob = Math.sin(t * 14) * .025 * E.p(t, .6, crash);
    for (let L = 0; L < 9; L++) for (let q = 0; q < 3; q++) {
      const pulled = PULLS.find(([pt, l, w]) => l === L && q === 1); const y = gT - (L + 1) * BH, x = X0 + q * BW;
      if (pulled && t > pulled[0]) { const k = E.p(t, pulled[0], pulled[0] + .5, 'out'); if (k < 1) block(x - 260 * k, y, BW, false, pulled[2]); else block(x - 260, y + (L ? 0 : 0), BW, false, pulled[2], 0, 1 - E.p(t, crash, crash + .3)); continue; }
      if (t < crash) { c.save(); c.translate(X0 + 75, gT); c.rotate(wob * (L + 1) * .2); c.translate(-(X0 + 75), -gT); block(x, y, BW, false); c.restore(); }
      else { const dt = t - crash, i = L * 3 + q, vx = (E.rnd(i) - .3) * 400, vy = -150 - 200 * E.rnd(i + 3); let yy = y + vy * dt + 1300 * dt * dt; if (yy > gT - BH) yy = gT - BH - E.rnd(i + 5) * 6; block(x + vx * dt, yy, BW, false, null, dt * (E.rnd(i + 9) - .5) * 6); }
    }
    fig(c, { x: 360, y: hipOn(gT, .8), s: .8, color: '#bdbdbd', pose: t > crash ? { ...E.pose('sad'), hd: .5 } : t % 1 < .5 ? { ...E.pose('stand'), aF: 1.5, eF: .2 } : E.pose('stand') });
    E.flash(c, t, crash, .25, '229,72,77', .2); E.shake(c, t, crash, .3, 10);
  });
  CNT(c, 120, 640, 'SHORTCUTS', Math.min(3, Math.floor((t - .6) / 1) + 1 > 0 ? Math.floor((t - .6) / 1) + 1 : 0), t > crash ? 'TOWER: GONE' : 'FEELS FINE', '#e8e8e8', t > crash ? RED : null);
  // bottom: one block on top, every day
  clip(c, P2, () => { E.line(c, 90, gB, 970, gB, '#4a4a50', 3);
    const n = 9 + Math.floor(E.p(t, .3, 4.2, 'lin') * 3) * 1, extra = Math.floor(E.p(t, .3, 4.2, 'lin') * 9);
    if (done) E.glowDot(c, X0 + 75, gB - 300, 360, 'rgba(245,197,66,.4)', E.p(t, 4.4, 4.9));
    for (let L = 0; L < 9; L++) for (let q = 0; q < 3; q++) block(X0 + q * BW, gB - (L + 1) * BH, BW, done);
    for (let k = 0; k < extra; k++) { const L = 9 + Math.floor(k / 3), q = k % 3; if (L > 11) continue; const t0 = .3 + k * (3.9 / 9), d = E.p(t, t0, t0 + .2, 'in'); block(X0 + q * BW, E.lerp(gB - (L + 1) * BH - 80, gB - (L + 1) * BH, d), BW, done, null); }
    fig(c, { x: 360, y: hipOn(gB, .8), s: .8, color: done ? GOLD : '#fff', pose: done ? win(t, 4.4) : { ...E.pose('stand'), aF: 2.0 + .3 * Math.sin(t * 6), eF: .4 } });
  });
  CNT(c, 120, 1090, 'LAYERS', 9 + Math.floor(Math.floor(E.p(t, .3, 4.2, 'lin') * 9) / 3), done ? 'TOWER: TALLER' : 'ADDING', done ? GOLD : '#e8e8e8');
} },
// 3 — Effort without a system is just noise (the cube)
{ dur: 5.5, draw(c, t) {
  const S = 74, CX = 640, done = t > 4.3, COLS = ['#5a5a5a', '#e8e8e8', GOLD];
  PRIN(c, 'EFFORT WITHOUT A SYSTEM IS JUST NOISE.', 470, done ? GOLD : '#e8e8e8');
  PANEL(c, ...P1, 'RANDOM TWISTS'); PANEL(c, ...P2, 'A SYSTEM', done);
  const face = (cy, colOf, glow) => { if (glow) { E.glowDot(c, CX, cy, 340, 'rgba(245,197,66,.5)', glow); E.rays(c, CX, cy, 380, .25 * glow, GOLD, 14, t * .2); }
    E.rrect(c, CX - 1.5 * S - 10, cy - 1.5 * S - 10, 3 * S + 20, 3 * S + 20, 14, '#0c0c0c', '#3a3a3a', 3);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) E.rrect(c, CX - 1.5 * S + q * S + 4, cy - 1.5 * S + r * S + 4, S - 8, S - 8, 8, colOf(r, q)); };
  const tw = (y, f) => fig(c, { x: 330, y, s: .8, f, color: f ? '#bdbdbd' : '#fff', pose: { ...E.pose('stand'), aF: 1.5 + .25 * Math.sin(t * 16), eF: .5, aB: 1.3 - .25 * Math.sin(t * 16), eB: .5 } });
  // top: twisting fast, never closer
  const step = Math.floor(t / .18);
  face(770, (r, q) => COLS[Math.floor(E.rnd(step * 9 + r * 3 + q + 11) * 3)], 0);
  tw(hipOn(gT, .8), 1);
  CNT(c, 110, 830, 'MOVES', step * 3, 'SOLVED: 0%', '#e8e8e8', RED);
  SAY(c, 'TRYING HARDER!', 300, 700, E.p(t, 2.2, 2.5, 'back'));
  // bottom: one square at a time, in order
  const solved = Math.min(9, Math.floor(E.p(t, .2, 4.2, 'lin') * 9.2));
  face(1225, (r, q) => (r * 3 + q < solved ? GOLD : COLS[Math.floor(E.rnd(r * 3 + q + 3) * 2)]), done ? E.p(t, 4.3, 4.7) : 0);
  if (done) fig(c, { x: 330, y: hipOn(gB, .8), s: .8, color: GOLD, pose: win(t, 4.3) }); else tw(hipOn(gB, .8), 1);
  E.particles(c, CX, 1225, t - 4.3, { n: 60, speed: 480, grav: 260 });
  CNT(c, 110, 1290, 'MOVES', solved * 3, done ? 'SOLVED: 100%' : `SOLVED: ${Math.round(solved / 9 * 100)}%`, done ? GOLD : '#e8e8e8');
} },
// 4 — The climb is quiet. The blast is loud.
{ dur: 7.5, draw(c, t) {
  const GY = 1400, boom = 4.6, done = t > boom;
  PRIN(c, 'THE CLIMB IS QUIET.', 450);
  PRIN(c, 'THE BLAST IS LOUD.', 505, GOLD, E.p(t, boom + .3, boom + .7));
  E.shaded(c, -100, GY, 1300, 120, 0, '#2a2a2e', '#101012'); E.line(c, -100, GY, 1180, GY, '#5a5a5a', 3);
  // the rocket: a tiny spark climbing for a long time, nobody watching
  const k = E.p(t, .1, boom, 'in'), rx = 760 + Math.sin(t * 3) * 6 * (1 - k), ry = E.lerp(GY - 20, 700, k);
  if (!done) { for (let i = 0; i < 14; i++) { const q = i / 14; c.save(); c.globalAlpha = .6 * (1 - q); c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(rx + Math.sin(t * 20 + i) * 3, ry + q * 140, 4 * (1 - q) + 1, 0, 7); c.fill(); c.restore(); } E.glowDot(c, rx, ry, 30, 'rgba(255,220,140,.9)'); }
  // the burst
  if (done) { const dt = t - boom; E.flash(c, t, boom, .3, '255,230,170', .45);
    [[760, 700, 0, 64, 460], [520, 780, .7, 40, 300], [900, 820, 1.2, 36, 260]].forEach(([bx, by, d, n, R], b) => { const tt = dt - d; if (tt < 0) return; const kk = E.ease.out(Math.min(1, tt / .9)), fade = Math.max(0, 1 - Math.max(0, tt - .8) / 1.8);
      if (b === 0) E.glowDot(c, bx, by, 520, 'rgba(245,197,66,.4)', fade);
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = R * kk, x = bx + Math.cos(a) * r, y = by + Math.sin(a) * r + 60 * tt * tt; c.save(); c.globalAlpha = fade; c.strokeStyle = b === 1 ? '#ffffff' : GOLD; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(bx + Math.cos(a) * r * .8, by + Math.sin(a) * r * .8 + 60 * tt * tt); c.stroke(); c.restore(); } });
    E.particles(c, 760, 700, dt, { n: 90, speed: 520, grav: 160, life: 2.4 }); }
  // the crowd: busy, chatting, not looking up... then all looking up
  for (let i = 0; i < 30; i++) {
    const row = i % 3, sc = [.42, .5, .58][row], x = 80 + (i * 61) % 900 + row * 12, y0 = GY - (2 - row) * 24, look = done ? E.p(t, boom + .1 + E.rnd(i) * .3, boom + .5 + E.rnd(i) * .3) : 0;
    const pose = look > .5 ? { ...E.pose('cheer'), hd: -.6, aF: 2.4 + Math.sin(t * 6 + i) * .3, aB: -2.4 } : { ...E.pose('stand'), hd: .4 + .1 * Math.sin(t * 2 + i), aF: .7, eF: 1.9, tor: .1 };
    fig(c, { x, y: hipOn(y0, sc) - (look > .5 ? Math.abs(Math.sin(t * 8 + i)) * 8 : 0), s: sc, f: i % 2 ? 1 : -1, color: done ? (row === 2 ? '#ffe7a8' : '#d8c8a0') : ['#5a5a5a', '#6e6e6e', '#828282'][row], pose });
  }
  ['HE QUIT?', 'WHERE IS HE?', 'NOTHING HAPPENING'].forEach((w, i) => SAY(c, w, 220 + i * 260, 1180 - (i % 2) * 40, E.p(t, .8 + i * .9, 1.1 + i * .9, 'back') * (1 - E.p(t, 1.9 + i * .9, 2.1 + i * .9))));
  if (done) ['WOW', 'WHO IS THAT?!'].forEach((w, i) => SAY(c, w, 260 + i * 380, 1180, E.p(t, boom + .5 + i * .3, boom + .8 + i * .3, 'back')));
  CNT(c, 70, 560, 'DAYS IN SILENCE', done ? 365 : Math.round(365 * k), done ? 'ONE NIGHT TO BE SEEN' : 'NOBODY WATCHING', done ? GOLD : '#e8e8e8');
} },
] };
