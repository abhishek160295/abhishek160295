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
  c.lineWidth = o.lw ?? (E.bold ? 16 : 13); c.lineCap = 'round'; c.lineJoin = 'round';
  // figures stay crisp: no halo blur (o.glow kept for API compatibility)
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
  if (o.hud && E._hud && !o._now) { E._hud.push(() => E.text(c, str, x, y, { ...o, _now: true })); return; }
  const a = o.alpha ?? 1; if (a <= 0.001) return;
  c.save();
  c.globalAlpha *= a;
  c.font = `${o.weight ?? 600} ${o.size ?? 46}px ${o.family ?? 'Inter'}`;
  c.textAlign = o.align ?? 'center'; c.textBaseline = 'middle';
  c.letterSpacing = (o.ls ?? 0) + 'px';
  c.fillStyle = o.color ?? WHITE;
  // type is always razor-sharp: no glow or shadow on text (o.glow is ignored)
  c.fillText(str, x, y + (o.dy ?? 0));
  c.restore();
};
// kinetic title: words land one after another (fade + rise), optional exit at t1
E.title = (c, str, x, y, t, t0, t1 = 1e9, o = {}) => {
  if (E._hud && !o._now) { E._hud.push(() => E.title(c, str, x, y, t, t0, t1, { ...o, _now: true })); return; }
  if (t0 <= .1) t0 = -1; // lines that open a scene are on screen from its first frame
  const out = 1 - E.p(t, t1, t1 + .3, 'in');
  if (out <= 0 || t < t0) return;
  o = { family: '"Inter Display", Inter', ...o };
  c.save(); c.font = `${o.weight ?? 600} ${o.size ?? 46}px ${o.family}`; c.letterSpacing = (o.ls ?? 0) + 'px';
  const words = str.split(' '), sp = c.measureText(' ').width, ws = words.map(w => c.measureText(w).width);
  c.restore();
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2;
  words.forEach((w, i) => {
    const k = E.p(t, t0 + i * .04, t0 + i * .04 + .22, 'out');
    E.text(c, w, cx + ws[i] / 2, y, { ...o, align: 'center', alpha: k * out * (o.alpha ?? 1), dy: (1 - k) * 24 });
    cx += ws[i] + sp;
  });
};

// ---------- shapes ----------
E.line = (c, x1, y1, x2, y2, col = GREY, w = 5, glow = 0) => {
  c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
  if (glow) { c.shadowColor = col; c.shadowBlur = glow; }
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
};
E.ground = (c, y, x1 = 0, x2 = W, col = '#8f8f8f') => E.line(c, x1, y, x2, y, col, 5);
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
    c.fillStyle = o.color ?? GOLD;
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
  const S = window.RENDER_SCALE || 1; // supersample: draw at S× and downscale in ffmpeg
  const cv = document.getElementById('cv'); cv.width = W * S; cv.height = H * S;
  const c = cv.getContext('2d');
  let starts = [], acc = 0; for (const s of reel.scenes) { starts.push(acc); acc += s.dur; }
  reel.total = acc; const fast = reel.pace === 'fast'; E.bold = fast;
  const SP = reel.speed || 1; // playback speed: >1 tightens a reel without re-timing its scenes
  window.REEL_INFO = { total: acc / SP, frames: Math.round(acc / SP * FPS), starts, cues: reel.scenes.flatMap((s, i) => (s.cues || []).map(q => [q[0] + starts[i], q[1]])), bpm: reel.bpm, title: reel.title };
  window.renderAt = T => {
    T *= SP;
    let i = starts.length - 1; while (i > 0 && T < starts[i]) i--;
    const sc = reel.scenes[i], t = T - starts[i];
    c.setTransform(S, 0, 0, S, 0, 0); c.globalAlpha = 1; c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    if (fast) for (let k = 0; k < 34; k++) { // ambient dust: constant, subtle background motion
      const x = ((E.rnd(k) * W + T * (14 + 26 * E.rnd(k + 7))) % (W + 40)) - 20, y = E.rnd(k + 3) * H + Math.sin(T * .6 + k) * 24;
      c.fillStyle = `rgba(255,255,255,${.06 + .1 * E.rnd(k + 11)})`; c.beginPath(); c.arc(x, y, 1.5 + 2.5 * E.rnd(k + 5), 0, 7); c.fill();
    }
    // safe frame: keep every scene clear of the Reels/TikTok/Shorts UI
    // (right action rail x>950, top bar, caption block) — scale 0.88 about (573, 960)
    c.save(); c.translate(573, 960); c.scale(.88, .88); c.translate(-573, -960);
    if (fast) {
      // fast pacing: hard cut + punch-in on every new scene, stronger push and a slow drift so no frame sits still
      const punch = i === 0 ? 1 : 1 + .07 * (1 - E.ease.out(E.clamp(t / .3)));
      E._hud = [];
      c.save();
      let px = 540, py = 960;
      if (sc.cam) {
        // scene camera: frame the action box [x1,y1,x2,y2] into the safe action area (centre 510,1010 on screen),
        // compensating for the 0.88 safe frame already applied, so props fill the frame like the reference
        const [x1, y1, x2, y2] = typeof sc.cam === 'function' ? sc.cam(t) : sc.cam;
        const k = Math.min(860 / (x2 - x1), 840 / (y2 - y1), 1.9);
        c.translate(573 + (510 - 573) / .88, 960 + (1010 - 960) / .88); c.scale(k / .88, k / .88);
        px = (x1 + x2) / 2; py = (y1 + y2) / 2; c.translate(-px, -py);
      }
      const z = punch * (1 + .06 * (t / sc.dur));
      c.translate(px + Math.sin(T * .9) * 6, py + Math.cos(T * .7) * 5); c.scale(z, z); c.translate(-px, -py);
      if (sc.floor) E.stage(c, sc.floor);
      sc.draw(c, t, sc.dur); c.restore();
      c.restore(); c.save(); c.translate(573, 960); c.scale(.88, .88); c.translate(-573, -960);
      const hud = E._hud; E._hud = null; hud.forEach(f => f()); c.restore();
    } else {
      // slow cinematic push-in across each scene
      const z = 1 + .025 * (t / sc.dur); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
      sc.draw(c, t, sc.dur); c.restore();
      // fade to black between scenes (first frame of reel is already live — no fade-in)
      const fin = i === 0 ? 1 : E.p(t, 0, .28, 'out'), fout = i === reel.scenes.length - 1 ? 1 : 1 - E.p(t, sc.dur - .28, sc.dur, 'in');
      const a = 1 - fin * fout; if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); }
    }
    // vignette + watermark
    const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    E.text(c, 'INSPIRED DAILY', W / 2, H * .8, { size: 22, weight: 700, ls: 7, color: '#ffffff', alpha: .26 });
  };
};

// ---------- shared props ----------
E.bubble = (c, str, x, y, a = 1, o = {}) => {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.font = `700 ${o.size ?? 30}px Inter`;
  const w = c.measureText(str).width + 44, h = (o.size ?? 30) + 34;
  c.translate(x, y); c.scale(.6 + .4 * Math.min(1, a * 1.2), .6 + .4 * Math.min(1, a * 1.2));
  E.rrect(c, -w / 2, -h / 2, w, h, h / 2, o.fill ?? '#1d1d1d', o.stroke ?? '#777', 3);
  c.fillStyle = o.fill ?? '#1d1d1d'; c.beginPath(); c.moveTo((o.tail ?? -1) * w * .2, h / 2 - 2); c.lineTo((o.tail ?? -1) * w * .3, h / 2 + 18); c.lineTo((o.tail ?? -1) * w * .05, h / 2 - 2); c.fill();
  c.restore();
  E.text(c, str, x, y, { size: (o.size ?? 30) * (.6 + .4 * Math.min(1, a * 1.2)), weight: 700, color: o.color ?? '#ddd', alpha: a });
};
E.flag = (c, x, gy, a = 1, glow = 30) => {
  c.save(); c.globalAlpha *= a; E.line(c, x, gy, x, gy - 220, '#ddd', 6);
  c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = glow; c.beginPath(); c.moveTo(x + 3, gy - 220); c.lineTo(x + 110, gy - 185); c.lineTo(x + 3, gy - 150); c.fill(); c.restore();
};
E.crown = (c, x, y, s = 1, a = 1, rot = 0, glow = 24) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha *= a;
  c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = glow;
  c.beginPath(); c.moveTo(-50, 25); c.lineTo(-50, -20); c.lineTo(-25, 5); c.lineTo(0, -35); c.lineTo(25, 5); c.lineTo(50, -20); c.lineTo(50, 25); c.closePath(); c.fill();
  c.restore();
};
E.stairs = (c, x, gy, n, sw, sh, a = 1, o = {}) => {
  for (let i = 0; i < n; i++) {
    const k = typeof a === 'function' ? a(i) : a; if (k <= 0) continue;
    E.rrect(c, x + i * sw, gy - (i + 1) * sh * k, sw - 4, (i + 1) * sh * k, 4, o.fill ?? '#262626', (o.top === i ? GOLD : o.stroke) ?? '#999', 3);
  }
};
E.cloud = (c, x, y, s = 1, a = 1, col = '#5a5a5a') => {
  c.save(); c.globalAlpha *= a; c.fillStyle = col; c.translate(x, y); c.scale(s, s);
  [[-70, 10, 55], [-20, -25, 70], [45, -5, 60], [90, 20, 45], [0, 25, 60]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); });
  c.restore();
};
E.bed = (c, x, gy, label) => {
  E.rrect(c, x, gy - 70, 300, 34, 8, '#2b2b2b', '#777', 4);
  E.rrect(c, x + 8, gy - 98, 70, 26, 12, '#cfcfcf');
  E.line(c, x + 10, gy - 36, x + 10, gy, '#777', 6); E.line(c, x + 290, gy - 36, x + 290, gy, '#777', 6);
  E.line(c, x, gy - 70, x, gy - 140, '#777', 7);
  if (label) E.text(c, label, x + 150, gy - 18, { size: 22, weight: 900, ls: 3, color: '#888' });
};
E.clock = (c, x, y, label, col = '#fff', ring = false, t = 0, s = 1) => {
  c.save(); c.translate(x + (ring ? Math.sin(t * 90) * 6 : 0), y); c.scale(s, s);
  const w = Math.max(124, label.length * 26 + 40);
  E.rrect(c, -w / 2, -36, w, 72, 14, '#111', '#ddd', 4);
  E.text(c, label, 0, 2, { size: 36, weight: 800, color: col });
  if (ring) { c.strokeStyle = '#fff'; c.lineWidth = 4; for (const d of [-1, 1]) { c.beginPath(); c.arc(0, 0, w / 2 + 26, -Math.PI / 2 + d * .5 - .25, -Math.PI / 2 + d * .5 + .25); c.stroke(); } }
  c.restore();
};
E.coin = (c, x, y, r = 24, a = 1) => {
  c.save(); c.globalAlpha *= a; c.fillStyle = GOLD; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.strokeStyle = '#a7801f'; c.lineWidth = r * .14; c.beginPath(); c.arc(x, y, r * .68, 0, 7); c.stroke(); c.restore();
};
E.moon = (c, x, y, r = 46, a = 1) => {
  c.save(); c.globalAlpha *= a; c.fillStyle = '#e8e4d0'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.fillStyle = '#000'; c.beginPath(); c.arc(x + r * .45, y - r * .25, r * .9, 0, 7); c.fill(); c.restore();
};
E.umbrella = (c, x, y, s = 1, a = 1) => {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  c.fillStyle = GOLD; c.beginPath(); c.arc(0, 0, 110, Math.PI, 0);
  for (let i = 4; i >= 0; i--) c.arc(-88 + 44 * i, 0, 22, 0, Math.PI, false);
  c.closePath(); c.fill();
  E.line(c, 0, 0, 0, 150, '#ddd', 6); c.strokeStyle = '#ddd'; c.lineWidth = 6; c.beginPath(); c.arc(-14, 150, 14, 0, Math.PI); c.stroke(); c.restore();
};
E.phone = (c, x, y, s = 1, a = 1, screen = '#9fd3ff') => {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  E.rrect(c, -14, -26, 28, 50, 6, '#222', '#ddd', 3); E.rrect(c, -10, -21, 20, 38, 3, screen); c.restore();
};

// shaded block: vertical light→dark gradient with a top highlight, for props with depth
E.shaded = (c, x, y, w, h, r, light, dark, stroke) => {
  const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, light); g.addColorStop(1, dark);
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = g; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 3; c.stroke(); }
  c.globalAlpha = .35; c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x + 4, y + 3, w - 8, Math.min(6, h / 4), 3); c.fill(); c.restore();
};
E.heart = (c, x, y, s = 1, a = 1, col = RED) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-60, -10, -30, -60, 0, -28); c.bezierCurveTo(30, -60, 60, -10, 0, 30); c.fill(); c.restore(); };

// depth stage (reference #14): soft back-light and a graded floor instead of flat black
E.stage = (c, gy) => {
  c.save();
  const back = c.createRadialGradient(540, gy - 260, 40, 540, gy - 260, 900); back.addColorStop(0, 'rgba(255,255,255,.07)'); back.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = back; c.fillRect(-600, gy - 1300, 2300, 1300);
  const fl = c.createLinearGradient(0, gy, 0, gy + 420); fl.addColorStop(0, '#2a2a2e'); fl.addColorStop(1, 'rgba(10,10,12,0)');
  c.fillStyle = fl; c.fillRect(-600, gy, 2300, 420);
  c.restore();
};
// typewriter tag (reference #14): mono label in a box, typed out character by character
E.tag = (c, str, x, y, t, t0, o = {}) => {
  if (t < t0) return;
  const n = Math.min(str.length, Math.floor((t - t0) / .045) + 1), shown = str.slice(0, n), cursor = n < str.length || Math.floor(t * 3) % 2 === 0;
  c.save(); c.globalAlpha *= o.alpha ?? 1; c.font = `800 ${o.size ?? 28}px "JetBrains Mono", "DejaVu Sans Mono", monospace`; c.letterSpacing = '1px';
  const w = c.measureText(str).width + 28, h = (o.size ?? 28) + 22;
  c.fillStyle = o.fill ?? '#0c0c0c'; c.strokeStyle = o.color ?? '#ddd'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 6); c.fill(); c.stroke();
  c.fillStyle = o.color ?? '#ddd'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(shown + (cursor ? '▌' : ''), x - w / 2 + 14, y + 1);
  c.restore();
};
