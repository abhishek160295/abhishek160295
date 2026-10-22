// Inspired Daily — 2D motion engine. Renders 1080x1920 frames on a canvas.
const W = 1080, H = 1920, FPS = 30;
const GOLD = '#f5c542', RED = '#e5484d', GREEN = '#3ddc84', ICE = '#bfe8ff', GREY = '#8a8a8a', DIM = '#4a4a4a', WHITE = '#ffffff';

const E = {
  clamp: (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  ease: {
    lin: t => t,
    inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    elastic: t => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1),
  },
  // eased progress of t through [a,b]
  p(t, a, b, e = 'inOut') { const k = E.clamp((t - a) / (b - a)); return k <= 0 ? 0 : k >= 1 ? 1 : E.ease[e](k); },
  rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); },
};

// ---------- stick figure rig ----------
// Angles in radians. Limb angle 0 = straight down, positive = toward facing direction.
// tor: torso lean from vertical (+ = forward). e*/k*: elbow / knee bend.
const POSE = {
  stand: { tor: 0, hd: 0, aB: -.12, eB: .15, aF: .12, eF: .15, lB: -.07, kB: 0, lF: .07, kF: 0 },
  sit: { tor: -.05, hd: 0, aB: .35, eB: .9, aF: .45, eF: .9, lB: 1.5, kB: 1.5, lF: 1.6, kF: 1.55 },
  sad: { tor: .35, hd: .5, aB: .05, eB: .05, aF: .15, eF: .05, lB: -.05, kB: .05, lF: .1, kF: .05 },
  push: { tor: .7, hd: -.2, aB: 1.35, eB: .25, aF: 1.45, eF: .2, lB: -.55, kB: .2, lF: .35, kF: .75 },
  cheer: { tor: 0, hd: -.15, aB: -2.6, eB: -.2, aF: 2.6, eF: .2, lB: -.18, kB: 0, lF: .18, kF: 0 },
  carryUp: { tor: 0, hd: -.1, aB: -2.75, eB: -.6, aF: 2.75, eF: .6, lB: -.07, kB: 0, lF: .07, kF: 0 },
  crouch: { tor: .5, hd: -.2, aB: -.5, eB: .4, aF: -.3, eF: .4, lB: .9, kB: 1.9, lF: 1.2, kF: 2.0 },
  jump: { tor: .15, hd: -.2, aB: -2.4, eB: -.2, aF: 2.5, eF: .2, lB: .4, kB: 1.2, lF: 1.0, kF: 1.4 },
  point: { tor: .05, hd: 0, aB: -.1, eB: .2, aF: 1.5, eF: 0, lB: -.07, kB: 0, lF: .07, kF: 0 },
  arms: { tor: -.03, hd: -.1, aB: .9, eB: 1.9, aF: .9, eF: 1.9, lB: -.12, kB: 0, lF: .12, kF: 0 },
  draw: { tor: -.05, hd: 0, aB: 1.57, eB: 0, aF: 1.4, eF: 1.9, lB: -.25, kB: 0, lF: .25, kF: 0 },
  phone: { tor: .2, hd: .45, aB: .4, eB: 1.9, aF: .5, eF: 1.9, lB: 1.5, kB: 1.5, lF: 1.6, kF: 1.55 },
  climb: { tor: .25, hd: -.1, aB: 2.2, eB: .4, aF: 2.6, eF: .2, lB: .6, kB: 1.0, lF: -.1, kF: .2 },
};
E.pose = n => POSE[n];
E.mix = (a, b, t) => { const o = {}; for (const k in a) o[k] = E.lerp(a[k], b[k], t); return o; };
E.walk = (ph, amp = .45) => {
  const s = Math.sin(ph);
  return { tor: .06, hd: 0, aB: s * amp * .9, eB: .35, aF: -s * amp * .9, eF: .35,
    lB: -s * amp, kB: Math.max(0, Math.cos(ph)) * .7, lF: s * amp, kF: Math.max(0, -Math.cos(ph)) * .7, dy: -Math.abs(s) * 7 };
};
E.run = ph => {
  const s = Math.sin(ph);
  return { tor: .32, hd: -.1, aB: s * 1.1, eB: 1.5, aF: -s * 1.1, eF: 1.5,
    lB: -s * .85, kB: .3 + Math.max(0, Math.cos(ph)) * 1.4, lF: s * .85, kF: .3 + Math.max(0, -Math.cos(ph)) * 1.4, dy: -Math.abs(s) * 14 };
};
const LEN = { torso: 92, head: 25, ua: 58, la: 54, ul: 68, ll: 66 };
E.FIG_H = LEN.ul + LEN.ll; // hip height above feet when standing (scale 1)

// o: {x, y(hip), pose, s, f(1 right/-1 left), color, alpha, glow, rot, lw}
E.figure = (c, o) => {
  const pose = o.pose, s = o.s ?? 1, f = o.f ?? 1, col = o.color ?? WHITE;
  c.save();
  c.translate(o.x, o.y + (pose.dy || 0) * s);
  if (o.rot) c.rotate(o.rot);
  c.scale(s, s);
  c.globalAlpha *= o.alpha ?? 1;
  c.strokeStyle = col; c.fillStyle = col;
  c.lineWidth = o.lw ?? 13; c.lineCap = 'round'; c.lineJoin = 'round';
  if (o.glow) { c.shadowColor = o.glowColor ?? col; c.shadowBlur = o.glow; }
  const dir = a => [Math.sin(a) * f, Math.cos(a)];
  const limb = (x, y, a1, bend, l1, l2) => {
    const d1 = dir(a1), kx = x + d1[0] * l1, ky = y + d1[1] * l1, d2 = dir(a1 + bend);
    c.beginPath(); c.moveTo(x, y); c.lineTo(kx, ky); c.lineTo(kx + d2[0] * l2, ky + d2[1] * l2); c.stroke();
  };
  const tx = Math.sin(pose.tor) * f, ty = -Math.cos(pose.tor);
  const sx = tx * (LEN.torso - 8), sy = ty * (LEN.torso - 8);
  limb(0, 0, pose.lB, -pose.kB, LEN.ul, LEN.ll);
  limb(sx, sy, pose.aB, pose.eB, LEN.ua, LEN.la);
  c.beginPath(); c.moveTo(0, 0); c.lineTo(tx * LEN.torso, ty * LEN.torso); c.stroke();
  limb(0, 0, pose.lF, -pose.kF, LEN.ul, LEN.ll);
  limb(sx, sy, pose.aF, pose.eF, LEN.ua, LEN.la);
  const ha = pose.tor + pose.hd, hr = LEN.torso + 6 + LEN.head;
  c.beginPath(); c.arc(tx * LEN.torso + Math.sin(ha) * f * (6 + LEN.head) , ty * LEN.torso - Math.cos(ha) * (6 + LEN.head), LEN.head, 0, Math.PI * 2); c.fill();
  c.restore();
};
// hand position helper (front hand) for props
E.hand = (o, which = 'F') => {
  const p = o.pose, s = o.s ?? 1, f = o.f ?? 1;
  const tx = Math.sin(p.tor) * f, ty = -Math.cos(p.tor);
  let x = tx * (LEN.torso - 8), y = ty * (LEN.torso - 8);
  const a = p['a' + which], e = p['e' + which];
  x += Math.sin(a) * f * LEN.ua; y += Math.cos(a) * LEN.ua;
  x += Math.sin(a + e) * f * LEN.la; y += Math.cos(a + e) * LEN.la;
  return [o.x + x * s, o.y + (p.dy || 0) * s + y * s];
};
E.headPos = o => {
  const p = o.pose, s = o.s ?? 1, f = o.f ?? 1, ha = p.tor + p.hd;
  return [o.x + (Math.sin(p.tor) * f * LEN.torso + Math.sin(ha) * f * (6 + LEN.head)) * s,
          o.y + (p.dy || 0) * s + (-Math.cos(p.tor) * LEN.torso - Math.cos(ha) * (6 + LEN.head)) * s];
};

// ---------- type ----------
E.text = (c, str, x, y, o = {}) => {
  const a = o.alpha ?? 1; if (a <= 0.001) return;
  c.save();
  c.globalAlpha *= a;
  c.font = `${o.weight ?? 600} ${o.size ?? 46}px ${o.family ?? 'Inter'}`;
  c.textAlign = o.align ?? 'center'; c.textBaseline = 'middle';
  c.letterSpacing = (o.ls ?? 0) + 'px';
  c.fillStyle = o.color ?? WHITE;
  if (o.glow) { c.shadowColor = o.glowColor ?? o.color ?? WHITE; c.shadowBlur = o.glow; c.fillText(str, x, y); }
  c.fillText(str, x, y + (o.dy ?? 0));
  c.restore();
};
// fade + rise in at t0, optional fade out at t1
E.title = (c, str, x, y, t, t0, t1 = 1e9, o = {}) => {
  const a = E.p(t, t0, t0 + .35, 'out') * (1 - E.p(t, t1, t1 + .3, 'in'));
  E.text(c, str, x, y, { ...o, alpha: a * (o.alpha ?? 1), dy: (1 - E.p(t, t0, t0 + .35, 'out')) * 18 });
};

// ---------- shapes ----------
E.line = (c, x1, y1, x2, y2, col = GREY, w = 5, glow = 0) => {
  c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
  if (glow) { c.shadowColor = col; c.shadowBlur = glow; }
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
};
E.ground = (c, y, x1 = 0, x2 = W, col = '#6b6b6b') => E.line(c, x1, y, x2, y, col, 5);
E.rrect = (c, x, y, w, h, r, fill, stroke, lw = 4) => {
  c.beginPath(); c.roundRect(x, y, w, h, r);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
};
E.glowDot = (c, x, y, r, col, a = 1) => {
  c.save(); c.globalAlpha *= a;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.restore();
};
E.trophy = (c, x, y, s = 1, a = 1, glow = 30) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a;
  c.fillStyle = GOLD; c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = glow;
  c.beginPath(); c.moveTo(-34, -70); c.lineTo(34, -70); c.quadraticCurveTo(34, -20, 0, -14); c.quadraticCurveTo(-34, -20, -34, -70); c.fill();
  c.lineWidth = 7; c.beginPath(); c.arc(-34, -52, 14, Math.PI * .5, Math.PI * 1.5); c.stroke();
  c.beginPath(); c.arc(34, -52, 14, -Math.PI * .5, Math.PI * .5); c.stroke();
  c.fillRect(-6, -16, 12, 22); c.fillRect(-24, 4, 48, 10);
  c.restore();
};
E.rays = (c, x, y, r, a, col = GOLD, n = 14, rot = 0) => {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < n; i++) {
    c.rotate(Math.PI * 2 / n);
    const g = c.createLinearGradient(0, 0, r, 0); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.lineTo(r, -r * .06); c.lineTo(r, r * .06); c.fill();
  }
  c.restore();
};
E.particles = (c, x, y, t, o = {}) => { // burst at t=0, t in seconds since burst
  if (t < 0 || t > (o.life ?? 1.4)) return;
  const n = o.n ?? 40, life = o.life ?? 1.4;
  c.save();
  for (let i = 0; i < n; i++) {
    const ang = E.rnd(i + (o.seed ?? 0)) * Math.PI * 2, sp = (o.speed ?? 600) * (.3 + E.rnd(i * 3.1 + 7) * .7);
    const px = x + Math.cos(ang) * sp * t, py = y + Math.sin(ang) * sp * t + (o.grav ?? 400) * t * t;
    c.globalAlpha = (1 - t / life) * (o.alpha ?? 1);
    c.fillStyle = o.color ?? GOLD; c.shadowColor = o.color ?? GOLD; c.shadowBlur = 12;
    const r = (o.size ?? 5) * (.5 + E.rnd(i * 5.7) * .8);
    c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fill();
  }
  c.restore();
};
E.shake = (c, t, t0, dur = .35, amp = 18) => {
  const k = t - t0; if (k < 0 || k > dur) return;
  const m = amp * (1 - k / dur);
  c.translate(Math.sin(k * 90) * m, Math.cos(k * 77) * m * .7);
};
E.flash = (c, t, t0, dur = .35, col = '255,255,255', peak = .55) => {
  const k = t - t0; if (k < 0 || k > dur) return;
  c.save(); c.fillStyle = `rgba(${col},${peak * (1 - k / dur)})`; c.fillRect(-200, -200, W + 400, H + 400); c.restore();
};
// camera: zoom s around focus (fx,fy) placed at screen centre
E.camera = (c, s, fx, fy, cx = W / 2, cy = H / 2) => { c.translate(cx, cy); c.scale(s, s); c.translate(-fx, -fy); };

// ---------- reel runtime ----------
window.E = E; Object.assign(window, { W, H, FPS, GOLD, RED, GREEN, ICE, GREY, DIM, WHITE });
window.setupReel = reel => {
  const cv = document.getElementById('cv'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  let starts = [], acc = 0; for (const s of reel.scenes) { starts.push(acc); acc += s.dur; }
  reel.total = acc;
  window.REEL_INFO = { total: acc, frames: Math.round(acc * FPS), starts, cues: reel.scenes.flatMap((s, i) => (s.cues || []).map(q => [q[0] + starts[i], q[1]])), bpm: reel.bpm, title: reel.title };
  window.renderAt = T => {
    let i = starts.length - 1; while (i > 0 && T < starts[i]) i--;
    const sc = reel.scenes[i], t = T - starts[i];
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    c.save(); sc.draw(c, t, sc.dur); c.restore();
    // fade to black between scenes (first frame of reel is already live — no fade-in)
    const fin = i === 0 ? 1 : E.p(t, 0, .28, 'out'), fout = i === reel.scenes.length - 1 ? 1 : 1 - E.p(t, sc.dur - .28, sc.dur, 'in');
    const a = 1 - fin * fout; if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); }
    // vignette + watermark
    const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    E.text(c, 'INSPIRED DAILY', W / 2, H * .8, { size: 22, weight: 700, ls: 7, color: '#ffffff', alpha: .26 });
  };
};
