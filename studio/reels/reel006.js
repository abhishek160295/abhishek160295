// Reel 006 — "Someday is not a day of the week"
const REEL = { title: 'Someday is not a day of the week', bpm: 150, scenes: [
// 1 — Life in years
{ dur: 6.4, draw(c, t) {
  E.text(c, 'Your life in years.', W / 2, 470, { size: 54, weight: 800, alpha: 1 - E.p(t, 2.5, 2.8) });
  E.title(c, 'How many are you wasting?', W / 2, 470, t, 2.9, 4.6, { size: 50, weight: 800, color: '#ddd' });
  E.title(c, 'Make the rest count.', W / 2, 470, t, 4.8, 1e9, { size: 60, weight: 900, color: GOLD, glow: 26 });
  const used = 25, gone = Math.floor(used * E.p(t, .5, 2.4, 'inOut'));
  for (let i = 0; i < 90; i++) {
    const col = i % 9, row = Math.floor(i / 9), x = 180 + col * 90, y = 600 + row * 84;
    const pulse = i >= used ? E.p(t, 3.4 + (i - used) * .015, 3.7 + (i - used) * .015) : 0;
    c.save();
    if (i < gone) { c.fillStyle = '#5a5a5a'; c.beginPath(); c.arc(x, y, 24, 0, 7); c.fill(); }
    else { c.strokeStyle = pulse > 0 ? GOLD : '#bbb'; c.lineWidth = 4; c.shadowColor = GOLD; c.shadowBlur = 16 * pulse; c.beginPath(); c.arc(x, y, 24, 0, 7); c.stroke(); if (pulse > 0) { c.globalAlpha = .25 * pulse; c.fillStyle = GOLD; c.fill(); } }
    c.restore();
  }
  E.text(c, `${gone} gone`, W / 2, 1440, { size: 36, weight: 700, color: GREY, alpha: E.p(t, .5, .8) * (1 - E.p(t, 3.3, 3.6)) });
  E.text(c, `${90 - used} left`, W / 2, 1440, { size: 36, weight: 800, color: GOLD, glow: 12, alpha: E.p(t, 3.5, 3.8) });
} },
// 2 — The calendar
{ dur: 6.4, draw(c, t) {
  E.title(c, "I'll start…", W / 2, 440, t, .05, 3.4, { size: 56, weight: 800 });
  E.title(c, 'Someday is not', W / 2, 420, t, 4.2, 1e9, { size: 54, weight: 900, color: GOLD, glow: 24 });
  E.title(c, 'a day of the week.', W / 2, 495, t, 4.4, 1e9, { size: 54, weight: 900, color: GOLD, glow: 24 });
  const words = ['Monday', 'Next month', 'New Year', 'Someday'];
  const idx = Math.min(3, Math.floor(Math.max(0, t - .3) / .75)), flip = ((Math.max(0, t - .3)) % .75) / .75;
  const cx = 540, cy = 1000, w = 560, h = 520, tear = E.p(t, 3.5, 4.1, 'in');
  E.shake(c, t, 3.1, .4, 8);
  const page = (word, col, glow) => {
    E.rrect(c, cx - w / 2, cy - h / 2, w, h, 22, '#f2f2f2');
    c.save(); c.beginPath(); c.roundRect(cx - w / 2, cy - h / 2, w, 110, [22, 22, 0, 0]); c.fillStyle = RED; c.fill(); c.restore();
    [-160, 160].forEach(dx => E.rrect(c, cx + dx - 10, cy - h / 2 - 30, 20, 60, 10, '#888'));
    E.text(c, word, cx, cy + 50, { size: word.length > 8 ? 76 : 96, weight: 900, color: col, glow });
  };
  // TODAY page underneath
  if (t > 3.4) page('TODAY', '#111', 0);
  if (tear < 1) {
    c.save();
    if (t > 3.4) { c.beginPath(); c.rect(0, 0, W, cy + tear * 900 - 200); c.clip(); c.translate(-tear * 200, tear * 900); c.rotate(-tear * .4); }
    else if (idx < 3) { const sq = Math.cos(flip * Math.PI); if (flip > .75) { c.translate(0, cy - h / 2); c.scale(1, Math.abs(Math.cos((flip - .75) * 4 * Math.PI / 2))); c.translate(0, -(cy - h / 2)); } }
    page(words[idx], '#111', 0);
    c.restore();
  }
  if (t > 4.0) { c.save(); c.shadowColor = GOLD; c.shadowBlur = 40; E.text(c, 'TODAY', cx, cy + 50, { size: 96, weight: 900, color: '#111' }); c.restore(); E.glowDot(c, cx, cy, 420, 'rgba(245,197,66,.25)', E.p(t, 4.0, 4.4)); }
  E.flash(c, t, 4.0, .35, '245,197,66', .3);
} },
// 3 — The train
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Opportunity arrives.', W / 2, 440, t, .05, 1.8, { size: 54, weight: 800 });
  E.title(c, 'You hesitate…', W / 2, 440, t, 2.0, 3.5, { size: 54, weight: 800, color: '#bbb' });
  E.title(c, 'Someone else gets on.', W / 2, 440, t, 3.7, 4.7, { size: 54, weight: 800, color: RED, glow: 14 });
  E.title(c, "Don't wait.", W / 2, 440, t, 4.9, 1e9, { size: 76, weight: 900, color: GOLD, glow: 30 });
  const gy = 1250, s = .7;
  E.line(c, 0, gy + 30, W, gy + 30, '#555', 6); for (let x = 0; x < W; x += 60) E.line(c, x, gy + 30, x + 20, gy + 50, '#333', 5);
  E.rrect(c, 60, gy - 10, 380, 20, 4, '#333');
  const arrive = E.p(t, .2, 1.6, 'out'), leave = E.p(t, 3.3, 4.6, 'in');
  const tx = E.lerp(1150, 460, arrive) - leave * 1700;
  for (let k = 0; k < 3; k++) { const x = tx + k * 330;
    E.rrect(c, x, gy - 230, 310, 220, 18, k === 0 ? '#e9e9e9' : '#cfcfcf');
    for (let wi = 0; wi < 3; wi++) E.rrect(c, x + 28 + wi * 92, gy - 200, 70, 70, 8, '#111');
    [x + 60, x + 250].forEach(wx => { c.save(); c.fillStyle = '#333'; c.beginPath(); c.arc(wx, gy + 4, 26, 0, 7); c.fill(); c.restore(); });
  }
  E.text(c, 'OPPORTUNITY', tx + 155, gy - 70, { size: 34, weight: 900, color: GOLD, glow: 10 });
  // hesitating figure
  E.figure(c, { x: 200, y: gy - 10 - E.FIG_H * s, s, pose: t < 3.3 ? E.mix(E.pose('stand'), { ...E.pose('arms'), hd: .3 }, E.p(t, 1.8, 2.2)) : E.pose('sad') });
  [0, 1, 2].forEach(i => { const a = E.p(t, 2.0 + i * .2, 2.2 + i * .2) * (1 - E.p(t, 3.3, 3.5)); c.save(); c.globalAlpha = a; c.fillStyle = '#bbb'; c.beginPath(); c.arc(170 + i * 30, gy - 260 - E.FIG_H * s + 60, 8, 0, 7); c.fill(); c.restore(); });
  // the one who moves
  const run = E.p(t, 2.1, 3.0, 'inOut');
  if (t > 2.0 && t < 3.3) E.figure(c, { x: E.lerp(-60, 520, run), y: gy - 10 - E.FIG_H * s, s, pose: E.run(t * 14), glow: 18 });
  if (t >= 3.0 && leave < 1) E.glowDot(c, tx + 150, gy - 160, 90, 'rgba(255,255,255,.6)', 1);
} },
// 4 — Years on your phone
{ dur: 6.4, draw(c, t) {
  E.title(c, '4 hours a day on your phone', W / 2, 400, t, .05, 1e9, { size: 46, weight: 800 });
  const yrs = 11 * E.p(t, .5, 3.0, 'inOut');
  E.text(c, `= ${yrs.toFixed(1)} years of your life`, W / 2, 475, { size: 46, weight: 900, color: RED, glow: 14, alpha: E.p(t, .4, .7) * (1 - E.p(t, 3.9, 4.1)) });
  E.title(c, 'Take your life back.', W / 2, 475, t, 4.2, 1e9, { size: 56, weight: 900, color: GOLD, glow: 26 });
  const cx = 540, cy = 1000, pw = 360, ph = 640, out = E.p(t, 3.2, 4.2, 'inOut');
  c.save(); c.globalAlpha = 1 - out * .6;
  E.rrect(c, cx - pw / 2, cy - ph / 2, pw, ph, 44, '#0c1018', '#ddd', 8);
  E.rrect(c, cx - 50, cy - ph / 2 + 18, 100, 22, 11, '#000');
  const g = c.createLinearGradient(0, cy - ph / 2, 0, cy + ph / 2); g.addColorStop(0, 'rgba(110,170,255,.25)'); g.addColorStop(1, 'rgba(110,170,255,0)'); c.fillStyle = g; c.fillRect(cx - pw / 2 + 10, cy - ph / 2 + 10, pw - 20, ph - 20);
  c.restore();
  // trapped figure walking in place, then steps out
  const s = .7, fy = cy + 220 - E.FIG_H * s;
  if (t < 3.2) { E.line(c, cx - 140, cy + 222, cx + 140, cy + 222, '#556', 4); E.figure(c, { x: cx, y: fy, s, pose: E.walk(t * 9, .35), color: '#9fb6d6' }); }
  else { const x = E.lerp(cx, 900, out), y = E.lerp(fy, 1330 - E.FIG_H * s - 2, out) - Math.sin(out * Math.PI) * 120; E.ground(c, 1330, 640, 1000, '#555'); E.figure(c, { x, y, s, pose: out < 1 ? E.pose('jump') : E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 4.2, 4.6, 'back')), glow: 22 }); E.particles(c, 900, 1200, t - 4.2, { n: 30, speed: 400 }); }
} },
// 5 — The candle
{ dur: 6.4, draw(c, t) {
  E.title(c, 'Time burns either way.', W / 2, 440, t, .05, 2.8, { size: 54, weight: 800 });
  E.title(c, 'Use the light', W / 2, 440, t, 3.0, 1e9, { size: 58, weight: 900, color: GOLD, glow: 24 });
  E.title(c, 'while it lasts.', W / 2, 515, t, 3.25, 1e9, { size: 58, weight: 900, color: GOLD, glow: 24 });
  const gy = 1320, cx = 300, h = E.lerp(420, 150, E.p(t, 0, 6.4, 'lin'));
  E.ground(c, gy, 90, 990);
  E.glowDot(c, cx, gy - h - 40, 520, 'rgba(245,197,66,.22)');
  E.rrect(c, cx - 60, gy - h, 120, h, 10, '#efe6d0');
  E.text(c, 'YOUR', cx, gy - h / 2 - 16, { size: 24, weight: 900, ls: 2, color: '#8a7a5a' }); E.text(c, 'TIME', cx, gy - h / 2 + 16, { size: 24, weight: 900, ls: 2, color: '#8a7a5a' });
  const fy = gy - h - 40, fl = Math.sin(t * 16) * 4;
  c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 36; c.beginPath(); c.moveTo(cx, fy - 50 + fl); c.quadraticCurveTo(cx + 26, fy, cx, fy + 24); c.quadraticCurveTo(cx - 26, fy, cx, fy - 50 + fl); c.fill(); c.restore();
  // wax drips
  for (let i = 0; i < 3; i++) { const k = E.p(t, 1 + i * 1.5, 2 + i * 1.5); if (k > 0) E.line(c, cx - 30 + i * 30, gy - h + 4, cx - 30 + i * 30, gy - h + 10 + 60 * k, '#efe6d0', 10); }
  const s = .75;
  if (t < 2.8) { E.rrect(c, 560, gy - 66 * s - 2, 150, 50, 10, '#2b2b2b', '#666', 3); E.figure(c, { x: 630, y: gy - 66 * s - 6, s, pose: E.pose('phone'), color: '#888' }); const ph = E.hand({ x: 630, y: gy - 66 * s - 6, s, pose: E.pose('phone') }); E.rrect(c, ph[0] - 6, ph[1] - 30, 22, 36, 5, '#9fd3ff'); }
  else {
    const blocks = Math.floor(E.p(t, 3.0, 5.4, 'lin') * 6);
    for (let i = 0; i < blocks; i++) E.rrect(c, 700 + (i % 2) * 6, gy - 70 * (i + 1), 140, 66, 6, i === 5 ? GOLD : '#d9d9d9');
    E.figure(c, { x: 580, y: gy - E.FIG_H * s - 2, s, glow: 16, pose: t > 5.4 ? E.mix(E.pose('stand'), E.pose('cheer'), E.p(t, 5.4, 5.7, 'back')) : { ...E.pose('push'), tor: .2, aF: 1.4 + Math.sin(t * 10) * .4, aB: 1.2 + Math.sin(t * 10) * .4 } });
  }
} },
] };
