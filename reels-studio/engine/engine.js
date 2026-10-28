// Stickman reel engine. Draws one frame at time t (seconds) on a 1080x1920 canvas.
// Scenes call the helpers below and push SFX events to SFX, so picture and sound share one timeline.
const W = 1080, H = 1920, FPS = 30;
const C = { stage: "#000000", hero: "#F2F2F2", grey: "#8A8A8A", prop: "#3A3A3A", red: "#E5322D", floor: "#1A1A1A" };

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eseg = (t, a, b) => ease(seg(t, a, b));
const rad = d => (d * Math.PI) / 180;

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- poses ----------
// Angles in degrees. Limbs: 0 = hanging straight down, + rotates toward the facing direction.
// Torso: 0 = upright, + leans forward. f = facing (1 right, -1 left).
const BASE = { x: 540, y: 0, f: 1, ground: true, lift: 0, torso: 0, head: 0,
  aL: 8, aL2: 14, aR: -6, aR2: 2, lL: 4, lL2: 4, lR: -4, lR2: -4 };
const KEYS = ["x", "y", "lift", "torso", "head", "aL", "aL2", "aR", "aR2", "lL", "lL2", "lR", "lR2"];

function P(o) { return Object.assign({}, BASE, o); }
// Hip height of a pose standing on the ground line.
function hipY(p, groundY) {
  if (!p.ground) return p.y;
  return joints(p, groundY).hip[1];
}
function mixPose(a, b, k) {
  if (a.ground !== b.ground && ENGINE.groundY != null) {
    a = Object.assign({}, a, { ground: false, y: hipY(a, ENGINE.groundY), lift: 0 });
    b = Object.assign({}, b, { ground: false, y: hipY(b, ENGINE.groundY), lift: 0 });
  }
  const o = Object.assign({}, a);
  for (const key of KEYS) o[key] = lerp(a[key], b[key], k);
  o.ground = k < 0.5 ? a.ground : b.ground;
  return o;
}
// Blend through a list of [time, pose] keys with easing.
function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, p0] = keys[i], [t1, p1] = keys[i + 1];
    if (t <= t1) return mixPose(p0, p1, ease(seg(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
}
function walk(phase, amp = 1) {
  const s = Math.sin(phase * Math.PI * 2), c = Math.cos(phase * Math.PI * 2);
  return { lL: 24 * s * amp, lL2: 24 * s * amp - 30 * Math.max(0, -c) * amp,
    lR: -24 * s * amp, lR2: -24 * s * amp - 30 * Math.max(0, c) * amp,
    aL: -20 * s * amp, aL2: -20 * s * amp + 22, aR: 20 * s * amp, aR2: 20 * s * amp + 22,
    torso: 4 * amp, lift: 5 * Math.abs(c) * amp };
}
function run(phase, amp = 1) {
  const s = Math.sin(phase * Math.PI * 2), c = Math.cos(phase * Math.PI * 2);
  return { lL: 40 * s * amp, lL2: 40 * s * amp - 70 * Math.max(0, -c) * amp,
    lR: -40 * s * amp, lR2: -40 * s * amp - 70 * Math.max(0, c) * amp,
    aL: -45 * s * amp, aL2: -45 * s * amp + 80, aR: 45 * s * amp, aR2: 45 * s * amp + 80,
    torso: 16 * amp, lift: 12 * Math.abs(c) * amp };
}

const U = { r: 32, torso: 100, neck: 12, ua: 54, la: 50, th: 58, sh: 58, stroke: 15 };

function joints(p, groundY, scale = 1) {
  const f = p.f, k = scale;
  const dir = (a, len) => [Math.sin(rad(a)) * len * f * k, Math.cos(rad(a)) * len * k];
  const up = (a, len) => [Math.sin(rad(a)) * len * f * k, -Math.cos(rad(a)) * len * k];
  const hip0 = [0, 0];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sh = add(hip0, up(p.torso, U.torso));
  const head = add(sh, up(p.torso + p.head, U.neck + U.r));
  const eL = add(sh, dir(p.aL, U.ua)), hL = add(eL, dir(p.aL2, U.la));
  const eR = add(sh, dir(p.aR, U.ua)), hR = add(eR, dir(p.aR2, U.la));
  const kL = add(hip0, dir(p.lL, U.th)), fL = add(kL, dir(p.lL2, U.sh));
  const kR = add(hip0, dir(p.lR, U.th)), fR = add(kR, dir(p.lR2, U.sh));
  let oy = p.y;
  if (p.ground) oy = groundY - Math.max(fL[1], fR[1], kL[1], kR[1]) - p.lift;
  const o = [p.x, oy];
  const J = { hip: hip0, sh, head, eL, hL, eR, hR, kL, fL, kR, fR };
  for (const key in J) J[key] = add(J[key], o);
  return J;
}

function drawFig(ctx, p, groundY, opt = {}) {
  const k = opt.scale || 1;
  const J = joints(p, groundY, k);
  const col = opt.color || C.hero;
  ctx.save();
  ctx.globalAlpha *= opt.alpha == null ? 1 : opt.alpha;
  if (opt.glow) { ctx.shadowColor = "rgba(255,255,255,0.45)"; ctx.shadowBlur = 22; }
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.lineWidth = U.stroke * k;
  const line = (...pts) => { ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.stroke(); };
  line(J.fL, J.kL, J.hip, J.kR, J.fR);
  line(J.hip, J.sh);
  line(J.hL, J.eL, J.sh, J.eR, J.hR);
  ctx.beginPath(); ctx.arc(J.head[0], J.head[1], U.r * k, 0, Math.PI * 2); ctx.fill();
  if (opt.blindfold) {
    ctx.shadowBlur = 0; ctx.fillStyle = C.red;
    ctx.fillRect(J.head[0] - U.r * k, J.head[1] - 9 * k, U.r * 2 * k, 14 * k);
  }
  ctx.restore();
  return J;
}

// ---------- stage ----------
const world = document.createElement("canvas"); world.width = W; world.height = H;
const wctx = world.getContext("2d");
const grainTiles = [];
(function makeGrain() {
  const r = rng(99);
  for (let i = 0; i < 8; i++) {
    const c = document.createElement("canvas"); c.width = 360; c.height = 640;
    const g = c.getContext("2d"); const id = g.createImageData(360, 640);
    for (let j = 0; j < id.data.length; j += 4) { const v = r() * 255; id.data[j] = id.data[j + 1] = id.data[j + 2] = v; id.data[j + 3] = 255; }
    g.putImageData(id, 0, 0); grainTiles.push(c);
  }
})();

function floor(ctx, gy, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  const g = ctx.createLinearGradient(0, gy, 0, gy + 260);
  g.addColorStop(0, "#151515"); g.addColorStop(1, "#000");
  ctx.fillStyle = g; ctx.fillRect(0, gy, W, 260);
  const l = ctx.createLinearGradient(0, 0, W, 0);
  l.addColorStop(0, "rgba(255,255,255,0)"); l.addColorStop(0.15, "rgba(255,255,255,0.22)");
  l.addColorStop(0.85, "rgba(255,255,255,0.22)"); l.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = l; ctx.fillRect(0, gy, W, 2);
  ctx.restore();
}

// Composite the world layer with a glossy reflection under the floor line.
function composite(ctx, gy, reflect = 0.2) {
  ctx.drawImage(world, 0, 0);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, gy + 2, W, H - gy); ctx.clip();
  ctx.globalAlpha = reflect;
  ctx.translate(0, 2 * gy); ctx.scale(1, -1);
  ctx.drawImage(world, 0, 0, W, gy, 0, 0, W, gy);
  ctx.restore();
  const g = ctx.createLinearGradient(0, gy, 0, gy + 330);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = g; ctx.fillRect(0, gy + 2, W, 330);
}

function finish(ctx, t, opt = {}) {
  const v = ctx.createRadialGradient(W / 2, H * 0.52, H * 0.18, W / 2, H * 0.52, H * 0.62);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.035; ctx.globalCompositeOperation = "screen"; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(grainTiles[Math.floor(t * FPS / 2) % grainTiles.length], 0, 0, W, H); ctx.restore();
  if (opt.watermark) {
    ctx.save(); ctx.font = "18px Silkscreen"; ctx.letterSpacing = "3px"; ctx.fillStyle = "rgba(255,255,255,0.13)";
    ctx.textAlign = "center"; ctx.fillText(opt.watermark.toUpperCase(), W / 2, opt.watermarkY || 1420); ctx.restore();
  }
  if (opt.fadeOut) { ctx.fillStyle = `rgba(0,0,0,${opt.fadeOut})`; ctx.fillRect(0, 0, W, H); }
}

function label(ctx, text, x, y, alpha = 1, size = 30) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `${size}px Silkscreen`; ctx.letterSpacing = "4px";
  ctx.fillStyle = "rgba(242,242,242,0.92)"; ctx.textAlign = "center"; ctx.fillText(text, x, y); ctx.restore();
}

// Typewriter text; returns nothing, SFX ticks are scheduled by typeSfx().
const CPF = 2; // frames per character
function typeText(ctx, text, x, y, t, t0, size = 34) {
  if (t < t0) return;
  const n = Math.min(text.length, Math.floor((t - t0) * FPS / CPF) + 1);
  ctx.save(); ctx.font = `${size}px Silkscreen`; ctx.letterSpacing = "4px"; ctx.textAlign = "center";
  ctx.fillStyle = C.hero; ctx.shadowColor = "rgba(255,255,255,0.35)"; ctx.shadowBlur = 12;
  const full = ctx.measureText(text).width, left = x - full / 2;
  ctx.textAlign = "left"; ctx.fillText(text.slice(0, n), left, y); ctx.restore();
}
function typeSfx(text, t0, gain = -20) {
  const ev = [];
  for (let i = 0; i < text.length; i++) if (text[i] !== " ") ev.push({ t: t0 + (i * CPF) / FPS, s: "ui_label_tick", g: gain + (i % 3) * -1.5, p: (i % 4) - 1.5 });
  return ev;
}
function dayCounter(ctx, text, x, y, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = "26px Silkscreen"; ctx.letterSpacing = "4px";
  ctx.fillStyle = "rgba(242,242,242,0.75)"; ctx.textAlign = "center"; ctx.fillText(text, x, y); ctx.restore();
}

window.ENGINE = { W, H, FPS, C, clamp, lerp, ease, easeIn, easeOut, seg, eseg, rad, rng, P, mixPose, track, walk, run, joints, drawFig, U,
  world, wctx, floor, composite, finish, label, typeText, typeSfx, dayCounter };
