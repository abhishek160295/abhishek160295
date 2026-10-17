// Drawing toolkit shared by every scene. Loaded as a classic script into the render page.
// Canvas is 1080x1920. Keep key content between y=300 and y=1450 (Instagram UI safe zone).

const W = 1080, H = 1920;

const C = {
  bg: '#000000',
  white: 'rgba(255,255,255,0.92)',
  soft: 'rgba(255,255,255,0.55)',
  dim: 'rgba(255,255,255,0.28)',
  faint: 'rgba(255,255,255,0.12)',
  green: '#2BFF88',
  gold: '#FFC93C',
  red: '#FF2D55',
  blue: '#3DA9FF',
  violet: '#B57CFF',
};

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Progress of t through the window [a, b], clamped to 0..1.
const seg = (t, a, b) => clamp((t - a) / (b - a));
const mix = (c1, c2, t) => {
  const p = (c) => {
    if (c.startsWith('#')) return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).concat(1);
    return c.match(/[\d.]+/g).map(Number).concat(1).slice(0, 4);
  };
  const a = p(c1), b = p(c2);
  const r = a.map((v, i) => lerp(v, b[i], t));
  return `rgba(${r[0] | 0},${r[1] | 0},${r[2] | 0},${r[3].toFixed(3)})`;
};

const ease = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
  sine: (t) => 0.5 - Math.cos(Math.PI * t) / 2,
};

// ---------- primitives ----------

function stroke(ctx, path, o = {}) {
  const { color = C.white, width = 6, glow = 0, alpha = 1, dash = null } = o;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (dash) ctx.setLineDash(dash);
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.beginPath(); path(ctx); ctx.stroke();
    ctx.shadowBlur = glow * 0.4;
  }
  ctx.beginPath(); path(ctx); ctx.stroke();
  ctx.restore();
}

function fill(ctx, path, o = {}) {
  const { color = C.white, glow = 0, alpha = 1 } = o;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.beginPath(); path(ctx); ctx.fill();
    ctx.shadowBlur = glow * 0.4;
  }
  ctx.beginPath(); path(ctx); ctx.fill();
  ctx.restore();
}

function line(ctx, x1, y1, x2, y2, o) {
  stroke(ctx, (c) => { c.moveTo(x1, y1); c.lineTo(x2, y2); }, o);
}

function circle(ctx, x, y, r, o = {}) {
  const p = (c) => c.arc(x, y, r, 0, Math.PI * 2);
  o.fill ? fill(ctx, p, o) : stroke(ctx, p, o);
}

// Soft radial light behind an accent element.
function bloom(ctx, x, y, r, color, alpha = 0.35) {
  if (alpha <= 0) return;
  ctx.save();
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, mix(color, 'rgba(0,0,0,0)', 1 - alpha));
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

// Polyline through points, revealed up to fraction p (0..1) of its length.
function partialPath(ctx, pts, p, o) {
  if (p <= 0 || pts.length < 2) return null;
  const lens = [0];
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const target = lens[lens.length - 1] * clamp(p);
  let end = pts[0];
  stroke(ctx, (c) => {
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      if (lens[i] <= target) { c.lineTo(pts[i][0], pts[i][1]); end = pts[i]; continue; }
      const k = (target - lens[i - 1]) / (lens[i] - lens[i - 1]);
      end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
      c.lineTo(end[0], end[1]);
      break;
    }
  }, o);
  return end;
}

// Point at fraction p along a polyline.
function pointAt(pts, p) {
  const lens = [0];
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const target = lens[lens.length - 1] * clamp(p);
  for (let i = 1; i < pts.length; i++) {
    if (lens[i] >= target) {
      const k = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
      return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
    }
  }
  return pts[pts.length - 1];
}

// ---------- text ----------

function text(ctx, str, x, y, o = {}) {
  const {
    size = 40, weight = 600, color = C.white, glow = 0, align = 'center',
    alpha = 1, spacing = 0, font = 'Inter', baseline = 'middle', upper = false,
  } = o;
  if (alpha <= 0 || !str) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.letterSpacing = `${spacing}px`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillStyle = color;
  const s = upper ? str.toUpperCase() : str;
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.fillText(s, x, y);
    ctx.shadowBlur = glow * 0.4;
  }
  ctx.fillText(s, x, y);
  ctx.restore();
}

// Label in the reference style: small, uppercase, tracked out.
function label(ctx, str, x, y, o = {}) {
  text(ctx, str, x, y, { size: 34, weight: 700, spacing: 4, upper: true, ...o });
}

// Typewriter reveal: shows the first p fraction of characters.
function typeText(ctx, str, x, y, p, o) {
  text(ctx, str.slice(0, Math.round(str.length * clamp(p))), x, y, o);
}

// ---------- stick figure ----------
// Angles are radians. Limbs: 0 = straight down, positive = toward facing direction.
// Torso `lean`: 0 = upright, positive = leaning forward.

const POSE = {
  stand: () => ({ lean: 0.04, tL: 0.1, sL: 0.08, tR: -0.1, sR: -0.08, aL: 0.18, fL: 0.3, aR: -0.18, fR: -0.1 }),
  walk: (ph, amt = 1) => {
    const s = Math.sin(ph), c = Math.cos(ph);
    const tL = 0.42 * s * amt, tR = -tL;
    return {
      lean: 0.08 * amt,
      tL, sL: tL - 0.55 * amt * Math.max(0, -c),
      tR, sR: tR - 0.55 * amt * Math.max(0, c),
      aL: -0.38 * s * amt, fL: -0.38 * s * amt + 0.35,
      aR: 0.38 * s * amt, fR: 0.38 * s * amt + 0.35,
      bob: Math.abs(c) * 4 * amt,
    };
  },
  run: (ph, amt = 1) => {
    const s = Math.sin(ph), c = Math.cos(ph);
    const tL = 0.75 * s * amt, tR = -tL;
    return {
      lean: 0.3 * amt,
      tL, sL: tL - 1.3 * amt * Math.max(0, -c),
      tR, sR: tR - 1.3 * amt * Math.max(0, c),
      aL: -0.85 * s * amt, fL: -0.85 * s * amt + 1.5,
      aR: 0.85 * s * amt, fR: 0.85 * s * amt + 1.5,
      bob: Math.abs(c) * 10 * amt,
    };
  },
  tired: () => ({ lean: 1.0, tL: 0.38, sL: -0.02, tR: 0.12, sR: -0.22, aL: 0.25, fL: 0.12, aR: 0.05, fR: -0.05 }),
  sit: () => ({ lean: 0.5, tL: 2.2, sL: 0.9, tR: 2.05, sR: 0.75, aL: 0.6, fL: 1.35, aR: 0.5, fR: 1.25, sit: true }),
  celebrate: (ph = 0) => ({ lean: -0.05, tL: 0.18, sL: 0.18, tR: -0.18, sR: -0.18, aL: 2.6 + 0.08 * Math.sin(ph), fL: 2.9, aR: -2.6 - 0.08 * Math.sin(ph), fR: -2.9 }),
  reach: () => ({ lean: -0.05, tL: 0.05, sL: 0.05, tR: -0.05, sR: -0.05, aL: 2.95, fL: 3.05, aR: 2.75, fR: 2.95 }),
  crouch: () => ({ lean: 0.35, tL: 1.1, sL: -0.5, tR: 0.95, sR: -0.6, aL: -0.5, fL: -0.3, aR: -0.6, fR: -0.4 }),
  carry: (ph, amt = 1) => ({ ...POSE.walk(ph, amt), aL: -1.9, fL: -2.9, aR: -1.7, fR: -2.7, lean: 0.1 }),
  push: (ph, amt = 1) => ({ ...POSE.walk(ph, amt * 0.8), lean: 0.55, aL: 1.35, fL: 1.5, aR: 1.25, fR: 1.45 }),
};

function blendPose(a, b, t) {
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === 'sit') { out.sit = t > 0.5 ? b.sit : a.sit; continue; }
    out[k] = lerp(a[k] || 0, b[k] || 0, t);
  }
  return out;
}

// Draws a figure standing on `groundY` at x. Returns key joint positions.
function figure(ctx, x, groundY, pose, o = {}) {
  const s = o.scale || 1, dir = o.dir || 1;
  const color = o.color || C.white, glow = o.glow || 0, alpha = o.alpha == null ? 1 : o.alpha;
  const T = 46 * s, S = 46 * s, TOR = 64 * s, U = 34 * s, F = 32 * s, HR = 17 * s;
  const down = (a, len) => [Math.sin(a) * dir * len, Math.cos(a) * len];
  const P = pose;

  const legs = ['L', 'R'].map((k) => {
    const knee = down(P['t' + k], T);
    const foot = down(P['s' + k], S);
    return { knee, foot: [knee[0] + foot[0], knee[1] + foot[1]] };
  });
  const lowest = P.sit ? 0 : Math.max(legs[0].foot[1], legs[1].foot[1]);
  const hip = [x, groundY - lowest - (P.sit ? 8 * s : 0) - (P.bob || 0) - (o.lift || 0)];
  const neck = [hip[0] + Math.sin(P.lean) * dir * TOR, hip[1] - Math.cos(P.lean) * TOR];
  const head = [neck[0] + Math.sin(P.lean) * dir * (HR + 6 * s), neck[1] - Math.cos(P.lean) * (HR + 6 * s)];
  const shoulder = [lerp(neck[0], hip[0], 0.08), lerp(neck[1], hip[1], 0.08)];
  const arms = ['L', 'R'].map((k) => {
    const e = down(P['a' + k], U);
    const h = down(P['f' + k], F);
    const elbow = [shoulder[0] + e[0], shoulder[1] + e[1]];
    return { elbow, hand: [elbow[0] + h[0], elbow[1] + h[1]] };
  });

  const style = { color, width: 8 * s, glow, alpha };
  stroke(ctx, (c) => {
    for (const l of legs) {
      c.moveTo(hip[0], hip[1]);
      c.lineTo(hip[0] + l.knee[0], hip[1] + l.knee[1]);
      c.lineTo(hip[0] + l.foot[0], hip[1] + l.foot[1]);
    }
    c.moveTo(hip[0], hip[1]);
    c.lineTo(neck[0], neck[1]);
    for (const a of arms) {
      c.moveTo(shoulder[0], shoulder[1]);
      c.lineTo(a.elbow[0], a.elbow[1]);
      c.lineTo(a.hand[0], a.hand[1]);
    }
  }, style);
  circle(ctx, head[0], head[1], HR, { ...style, fill: true });
  return { hip, neck, head, hands: arms.map((a) => a.hand), feet: legs.map((l) => [hip[0] + l.foot[0], hip[1] + l.foot[1]]) };
}

// ---------- props ----------

function flag(ctx, x, groundY, o = {}) {
  const h = (o.h || 110), color = o.color || C.white, wave = o.wave || 0;
  line(ctx, x, groundY, x, groundY - h, { color, width: 6, glow: o.glow, alpha: o.alpha });
  fill(ctx, (c) => {
    c.moveTo(x, groundY - h);
    c.quadraticCurveTo(x + 30, groundY - h + 6 + wave * 6, x + 62, groundY - h + 2);
    c.lineTo(x + 62, groundY - h + 40);
    c.quadraticCurveTo(x + 30, groundY - h + 46 - wave * 6, x, groundY - h + 40);
    c.closePath();
  }, { color, glow: o.glow, alpha: o.alpha });
}

function star(ctx, x, y, r, o = {}) {
  stroke(ctx, (c) => {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath();
  }, { width: 6, ...o });
}

function box(ctx, x, y, w, h, o = {}) {
  stroke(ctx, (c) => c.rect(x, y, w, h), { width: 5, ...o });
}

// Little particle burst used on payoff moments. p = 0..1 progress.
function burst(ctx, x, y, p, color, n = 14, r = 120) {
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + i * 0.37;
    const d = ease.out(p) * r * (0.7 + 0.3 * ((i * 7) % 5) / 5);
    circle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 4 * (1 - p) + 1.5, { fill: true, color, glow: 12, alpha: 1 - p });
  }
}

// ---------- organic growth ----------

// Deterministic random generator so renders are identical every time.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Branching structure (roots, trees, lightning, neurons). Returns segments sorted
// by growth order; each has an `at` value in 0..1 telling when it starts to appear.
function branches(seed, x, y, angle, len, depth, o = {}) {
  const r = rng(seed), segs = [];
  const spread = o.spread ?? 0.55, shrink = o.shrink ?? 0.74, kids = o.kids ?? 2;
  const grow = (x1, y1, a, l, d, t0) => {
    const x2 = x1 + Math.cos(a) * l, y2 = y1 + Math.sin(a) * l;
    segs.push({ x1, y1, x2, y2, d, t0, t1: t0 + l });
    if (d <= 0) return;
    const n = kids + (r() < 0.35 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const na = a + (i - (n - 1) / 2) * spread + (r() - 0.5) * 0.5;
      grow(x2, y2, na, l * (shrink + (r() - 0.5) * 0.15), d - 1, t0 + l);
    }
  };
  grow(x, y, angle, len, depth, 0);
  const max = Math.max(...segs.map((s) => s.t1));
  for (const s of segs) { s.at = s.t0 / max; s.until = s.t1 / max; }
  return segs;
}

// Draws branches revealed up to progress p (0..1).
function drawBranches(ctx, segs, p, o = {}) {
  stroke(ctx, (c) => {
    for (const s of segs) {
      if (p <= s.at) continue;
      const k = clamp((p - s.at) / (s.until - s.at));
      c.moveTo(s.x1, s.y1);
      c.lineTo(lerp(s.x1, s.x2, k), lerp(s.y1, s.y2, k));
    }
  }, o);
}

// Simple leaf: pointed oval from (x, y) in direction a, length l, scale k (0..1).
function leaf(ctx, x, y, a, l, k, o = {}) {
  if (k <= 0) return;
  const L = l * k, w = L * 0.32;
  const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
  const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
  const mx = (x + ex) / 2, my = (y + ey) / 2;
  stroke(ctx, (c) => {
    c.moveTo(x, y);
    c.quadraticCurveTo(mx + nx, my + ny, ex, ey);
    c.quadraticCurveTo(mx - nx, my - ny, x, y);
  }, { width: 4, ...o });
}
