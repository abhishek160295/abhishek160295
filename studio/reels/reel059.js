// Reel 059 — "The one who stayed" (audience-first: failed and everyone talked, friend with chai at 1 AM, waits outside every exam, walks past the crowd to the friend; reference bible, ~25s)
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
const chai = (c, x, y, t, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); E.rrect(c, -14, -26, 28, 30, 5, '#d8b07a', '#f2f2f2', 2); for (let i = 0; i < 2; i++) { const q = (t * .9 + i * .5) % 1; c.save(); c.globalAlpha = .7 * (1 - q); c.strokeStyle = '#f2f2f2'; c.lineWidth = 3; c.beginPath(); c.moveTo(-5 + i * 10, -32 - q * 40); c.quadraticCurveTo(5 + i * 10, -44 - q * 40, -5 + i * 10, -56 - q * 40); c.stroke(); c.restore(); } c.restore(); };
const crowd = (c, gy, t, col, pose) => [560, 635, 710, 785, 860, 700].forEach((x, i) => fig(c, { x: i === 5 ? 750 : x, y: hipOn(gy, i === 5 ? .8 : .9), s: i === 5 ? .8 : .9, f: -1, color: col, pose: pose(i) }));
const REEL = { title: 'The one who stayed', bpm: 120, speed: 1.1, push: .05, drift: 10, dust: true, scenes: [
// 1 — When you failed, everyone talked
{ dur: 6.2, zoom: t => 1.1 + .015 * t, focus: [540, 1060], draw(c, t) {
  const GY = 1330;
  TITLE(c, 'WHEN YOU FAILED, EVERYONE TALKED.', 450);
  TITLE(c, "NOBODY ASKED IF YOU'RE OKAY.", 505, RED, E.p(t, 3.4, 3.8));
  floor(c, GY); spot(c, 250, GY, .8, 200); E.shaded(c, 120, GY - 60, 300, 60, 6, '#3a3a40', '#222226');
  fig(c, { x: 250, y: GY - 60, s: 1.05, color: '#bdbdbd', pose: { ...E.pose('sit'), tor: .55, hd: .7, aF: .3, eF: 1.2, aB: .2, eB: 1.2 } });
  crowd(c, GY, t, '#7a7a7a', i => ({ ...E.pose('point'), tor: Math.sin(t * 8 + i) * .1, hd: (i % 2 ? .3 : -.3) + Math.sin(t * 10 + i) * .1, aF: i % 2 ? .3 : 1.0, eF: 1.5 }));
  [['TOLD YOU.', 640, 820, .3], ['WASTED A YEAR.', 790, 760, 1.0], ['POOR PARENTS.', 690, 900, 1.7], ["HE'S DONE.", 840, 880, 2.4], ['WHAT WILL PEOPLE SAY?', 740, 700, 3.0]].forEach(([w, x, y, t0]) => SAY(c, w, x, y, E.p(t, t0, t0 + .2), -1));
  TAG(c, 'RESULT: FAILED', 250, 680, 1, -1, RED);
  TAG(c, `CALLS: 0  ·  OPINIONS: ${Math.min(47, Math.floor(t * 8))}`, 540, 1440, 1, -1, '#e8e8e8');
} },
// 2 — One friend showed up at 1 AM with two cups of chai
{ dur: 6.2, zoom: t => 1.1 + .015 * t, focus: [500, 1060], draw(c, t) {
  const GY = 1330, open = .5, sitT = 2.6, give = 3.4;
  TITLE(c, 'ONE FRIEND SHOWED UP AT 1 AM.', 450);
  TITLE(c, 'WITH TWO CUPS OF CHAI.', 505, GOLD, E.p(t, sitT, sitT + .4));
  floor(c, GY);
  E.shaded(c, 160, GY - 60, 420, 60, 6, '#3a3a40', '#222226');
  const da = E.p(t, open, open + .4); E.glowDot(c, 820, GY - 200, 400, 'rgba(255,230,180,.5)', da); E.rrect(c, 750, GY - 380, 150, 380, 8, da > .1 ? '#fff0cc' : '#1a1a1e', '#8a8a8a', 4);
  E.glowDot(c, 420, GY - 120, 260, 'rgba(245,197,66,.3)', E.p(t, give, give + .5) * (.8 + .2 * Math.sin(t * 6)));
  const up = t > give + .4;
  fig(c, { x: 300, y: GY - 60, s: 1.05, color: up ? '#fff' : '#bdbdbd', pose: up ? { ...E.pose('sit'), tor: .1, hd: -.1, aF: 1.3, eF: 1.0 } : { ...E.pose('sit'), tor: .55, hd: .7, aF: .3, eF: 1.2 } });
  // friend walks in from the door with two cups
  const fx = t < open + .3 ? 830 : t < sitT ? E.lerp(830, 470, E.p(t, open + .3, sitT, 'lin')) : 470;
  if (t < sitT) { fig(c, { x: fx, y: hipOn(GY, 1.0), s: 1.0, f: -1, color: GOLD, alpha: E.p(t, open, open + .3), pose: { ...E.walk(t * 9), aF: 1.3, eF: .4 } }); chai(c, fx - 80, GY - 190, t); }
  else { fig(c, { x: 450, y: GY - 60, s: 1.0, f: 1, color: GOLD, pose: { ...E.pose('sit'), aB: t > give ? 1.0 : .4, eB: .3, aF: 1.1, eF: 1.0 } }); chai(c, t > give ? E.lerp(470, 370, E.p(t, give, give + .4)) : 500, GY - 160, t); chai(c, 520, GY - 175, t, .9); }
  if (t > give + .6) SAY(c, "YOU'RE NOT DONE.", 520, 880, E.p(t, give + .6, give + .8), -1);
  TAG(c, '1:07 AM', 250, 680, 1, -1, '#e8e8e8');
  E.particles(c, 380, GY - 200, t - give, { n: 30, speed: 260, grav: 120, life: 1.2 });
} },
// 3 — They waited outside every exam
{ dur: 6.4, zoom: t => 1.08 + .015 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, cyc = 1.45, n = Math.min(8, Math.floor(t / cyc * 2) + 1), ph = (t % cyc) / cyc;
  TITLE(c, 'THEY WAITED OUTSIDE EVERY EXAM.', 450);
  TITLE(c, "EVEN WHEN YOU DIDN'T ASK.", 505, GOLD, E.p(t, 3.0, 3.4));
  // day/night sweep per exam
  const sky = .5 - .5 * Math.cos(ph * Math.PI * 2); c.save(); const sg = c.createLinearGradient(0, 420, 0, GY); sg.addColorStop(0, 'rgba(150,150,175,0)'); sg.addColorStop(1, `rgba(150,150,175,${.28 * sky})`); c.fillStyle = sg; c.fillRect(-300, 420, 1700, GY - 420); c.restore();
  floor(c, GY);
  E.rrect(c, 520, GY - 520, 420, 520, 10, '#16161a', '#5a5a5e', 4); E.text(c, 'EXAM HALL', 730, GY - 470, { size: 26, weight: 800, family: MONO, ls: 3, color: '#bdbdbd' });
  E.rrect(c, 670, GY - 300, 120, 300, 6, '#2a2a30', '#8a8a8a', 3);
  // him: goes in, comes out, high five
  const inside = ph > .18 && ph < .7;
  if (!inside) { const x = ph <= .18 ? E.lerp(520, 700, ph / .18) : E.lerp(700, 470, E.p(ph, .7, .85)); fig(c, { x, y: hipOn(GY, 1.0), s: 1.0, color: '#fff', pose: ph > .85 ? { ...E.pose('cheer'), aB: -.2, eB: .2 } : E.walk(t * 9) }); }
  // friend pacing outside, then the high five
  const fx = ph > .85 ? 390 : 300 + Math.sin(t * 3) * 90;
  fig(c, { x: fx, y: hipOn(GY, 1.0), s: 1.0, f: ph > .85 ? 1 : Math.cos(t * 3) > 0 ? 1 : -1, color: GOLD, pose: ph > .85 ? { ...E.pose('cheer'), aB: -.2, eB: .2 } : { ...E.walk(t * 8), aF: 1.3, eF: .4 } });
  if (ph < .85) chai(c, fx + 40, GY - 200, t, .9);
  if (ph > .85) { E.particles(c, 430, GY - 330, (ph - .85) * cyc, { n: 24, speed: 300, grav: 200, life: .5 }); E.glowDot(c, 430, GY - 330, 140, 'rgba(245,197,66,.6)', 1 - (ph - .85) / .15); }
  TAG(c, `EXAM ${n} OF 8`, 250, 680, 1, -1, '#e8e8e8');
  TAG(c, `WAITED: ${n * 3} HRS`, 250, 740, 1, -1, GOLD);
} },
// 4 — The crowd came for the result. One friend came for you.
{ dur: 7.6, zoom: t => 1.08 + .012 * t, focus: [520, 1060], draw(c, t) {
  const GY = 1330, res = .3, walkT = 2.4, hug = 4.0;
  TITLE(c, 'THE CROWD CAME FOR THE RESULT.', 450);
  TITLE(c, 'ONE FRIEND CAME FOR YOU.', 505, GOLD, E.p(t, hug, hug + .4));
  floor(c, GY);
  E.rays(c, 540, 760, 900, .22 * E.p(t, res, res + .5), GOLD, 18, t * .6);
  const sc = E.p(t, res, res + .3, 'back'); c.save(); c.translate(540, 760); c.scale(sc, sc); E.rrect(c, -230, -60, 460, 120, 16, '#1c1708', GOLD, 5); E.text(c, 'RESULT: CLEARED', 0, 0, { size: 40, weight: 800, family: MONO, ls: 2, color: GOLD }); c.restore();
  E.flash(c, t, res, .3, '245,197,66', .3);
  crowd(c, GY, t, '#bdbdbd', i => ({ ...E.pose('cheer'), aF: 2.4 + Math.sin(t * 12 + i) * .3, aB: -2.4 - Math.sin(t * 12 + i) * .3 }));
  [['PROUD OF YOU!', 660, 900, .8], ['ALWAYS KNEW!', 820, 860, 1.2], ['PARTY WHEN?', 740, 980, 1.6]].forEach(([w, x, y, t0]) => SAY(c, w, x, y, E.p(t, t0, t0 + .2) * (t < hug ? 1 : 0), -1));
  // he walks past the crowd... to the friend at the back
  const x = t < walkT ? 420 : t < hug ? E.lerp(420, 230, E.p(t, walkT, hug, 'lin')) : 230;
  const done = t > hug;
  if (done) { halo(c, 180, GY - 220, 1, true); E.glowDot(c, 180, 1150, 340, 'rgba(245,197,66,.45)', E.p(t, hug, hug + .5)); }
  fig(c, { x: done ? 205 : 120, y: hipOn(GY, .95), s: .95, color: GOLD, pose: done ? { ...E.pose('cheer'), aF: 2.0, aB: -2.0 } : { ...E.pose('stand'), hd: .1, aF: .5, eF: 1.6 } });
  if (!done) chai(c, 160, GY - 190, t, .9);
  fig(c, { x: done ? 165 : x, y: hipOn(GY, 1.05) - (done ? 18 * Math.abs(Math.sin((t - hug) * 7)) : 0), s: 1.05, f: -1, color: done ? GOLD : '#fff', pose: done ? { ...E.pose('cheer'), aF: 2.0, aB: -2.0 } : t < walkT ? { ...E.pose('stand'), hd: -.2 } : E.walk(t * 9) });
  E.particles(c, 185, GY - 330, t - hug, { n: 70, speed: 520, grav: 280, life: 1.6 });
  if (done) for (let i = 0; i < 30; i++) { const qq = ((t - hug) * (.4 + .3 * E.rnd(i)) + E.rnd(i + 2)) % 1; c.save(); c.globalAlpha = .8 * (1 - qq); c.fillStyle = GOLD; c.translate(E.rnd(i * 7) * 1100, 380 + qq * 1000); c.rotate(t * 4 + i); c.fillRect(-6, -3, 12, 6); c.restore(); }
} },
] };
