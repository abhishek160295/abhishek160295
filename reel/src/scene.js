/* ------------------------------------------------------------------
 *  GEOMETRIC AHA REEL — deterministic frame renderer
 *  "You are not stuck. You are repeating the same pattern."
 *
 *  Every pixel is a pure function of the frame number:
 *  renderFrame(f) can be called in any order and always draws the same image.
 * ------------------------------------------------------------------ */
(() => {
  'use strict';

  // ---------- format ----------
  const W = 1080, H = 1920, FPS = 30, FRAMES = 450;
  const ANCHOR = { x: 540, y: 1090 };       // where the action lives (below the type band)
  const TEXT_Y = 360;                        // centre of the typography band

  // ---------- palette ----------
  const BG = '#050506';
  const WHITE = [244, 244, 240];
  const BLUE = [46, 124, 255];               // the one accent — breakthrough only

  // ---------- story beats (seconds) ----------
  const T = {
    freeze: 6.0,
    anticipate: 6.6,
    zoomEnd: 7.9,
    breakStart: 7.85,
    escStart: 8.55,
    escDur: 1.4,
    camArrive: 10.2,
    ringsStart: 10.05,
    alignStart: 13.0,
    align: 13.6,
  };

  // ---------- maze geometry (world units) ----------
  const TILE = 400;
  const H_OUT = 170;            // outer square half-size  (solid)
  const H_MID = 95;             // middle square half-size (doors at midpoints)
  const DOOR = 34;              // half door width
  const R_CIRCLE = 14;
  const R_HIT = H_OUT - R_CIRCLE - 2;
  const DIRS = [[1, 0], [0, -1], [-1, 0], [0, 1]];   // E N W S

  // ================================================================
  //  math helpers
  // ================================================================
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const mix3 = (c1, c2, k) => c1.map((v, i) => Math.round(lerp(v, c2[i], k)));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  // cubic-bezier(x1,y1,x2,y2) — same curve model as CSS / After Effects
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (u) => ((ax * u + bx) * u + cx) * u;
    const sy = (u) => ((ay * u + by) * u + cy) * u;
    const dsx = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let u = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(u) - x, d = dsx(u);
        if (Math.abs(e) < 1e-6) break;
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      let lo = 0, hi = 1;
      for (let i = 0; i < 20 && Math.abs(sx(u) - x) > 1e-6; i++) {
        if (sx(u) < x) lo = u; else hi = u;
        u = (lo + hi) / 2;
      }
      return sy(u);
    };
  }
  const E = {
    out: bezier(0.16, 1, 0.3, 1),          // expo-out: confident arrivals
    inOut: bezier(0.65, 0, 0.35, 1),       // cinematic camera moves
    inOutSoft: bezier(0.45, 0, 0.25, 1),
    in: bezier(0.55, 0, 1, 0.45),
    outBack: (x, s = 1.70158) => { x = clamp(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; },
    inBack: (x, s = 1.70158) => { x = clamp(x); return (s + 1) * x * x * x - s * x * x; },
  };

  // deterministic PRNG
  function hash(n) {
    n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4);
    n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15);
    return (n >>> 0) / 4294967296;
  }

  // ================================================================
  //  1. the habit loop — attempt schedule
  // ================================================================
  // Every attempt: leave the centre, hit a wall, come back. Same start, same end.
  const ATTEMPTS = [];
  (function build() {
    let t = -0.25;
    const slow = [0.85, 0.8, 0.78, 0.72];
    slow.forEach((d) => { ATTEMPTS.push({ t, d }); t += d; });
    // the spiral tightens: each loop faster than the last, timed so the
    // freeze lands a breath before the 13th impact
    const n = 9, r = 0.86;
    let raw = [];
    for (let k = 0; k < n; k++) raw.push(0.62 * Math.pow(r, k));
    const need = T.freeze - t;
    const have = raw.slice(0, n - 1).reduce((a, b) => a + b, 0) + 0.42 * raw[n - 1];
    const k = need / have;
    raw.forEach((d) => { ATTEMPTS.push({ t, d: d * k }); t += d * k; });
    ATTEMPTS.forEach((a, i) => { a.dir = DIRS[i % 4]; a.hit = a.t + a.d * 0.5; });
  })();

  function loopPos(te) {
    let a = ATTEMPTS[0];
    for (const x of ATTEMPTS) if (te >= x.t) a = x;
    const u = clamp((te - a.t) / a.d);
    let r, squash = 0;
    if (u < 0.5) r = R_HIT * E.inBack(u / 0.5, 1.1);              // anticipation, then rush
    else r = R_HIT * (1 - E.outBack((u - 0.5) / 0.5, 1.4));     // bounce home, overshoot
    squash = Math.exp(-Math.pow((u - 0.5) / 0.07, 2));
    return { x: a.dir[0] * r, y: a.dir[1] * r, dir: a.dir, squash, u };
  }

  const P_F = (() => { const p = loopPos(T.freeze); return { x: p.x, y: p.y }; })();

  // ================================================================
  //  2. camera
  // ================================================================
  const ROT_END = Math.PI / 2;
  const rotAt = (t) => ROT_END * E.inOut(prog(t, 3.0, 6.0));

  // breakthrough direction: up-right on screen, expressed in world space
  const SCREEN_DIR = { x: Math.cos(-Math.PI / 3), y: Math.sin(-Math.PI / 3) };
  const U = (() => {
    const c = Math.cos(-ROT_END), s = Math.sin(-ROT_END);
    return { x: SCREEN_DIR.x * c - SCREEN_DIR.y * s, y: SCREEN_DIR.x * s + SCREEN_DIR.y * c };
  })();
  const N = { x: -U.y, y: U.x };
  const ESC_LEN = 1500;
  const D = { x: P_F.x + U.x * ESC_LEN, y: P_F.y + U.y * ESC_LEN };

  function smoothLoop(t) {
    // camera follows a lagged average of the circle — never jerky
    let x = 0, y = 0, n = 10;
    for (let i = 0; i < n; i++) {
      const p = loopPos(Math.min(t, T.freeze) - i * 0.035);
      x += p.x; y += p.y;
    }
    return { x: x / n, y: y / n };
  }

  function scaleAt(t) {
    if (t < 3.0) return lerp(2.35, 2.0, E.out(prog(t, 0, 1.4)));
    if (t < 6.0) return lerp(2.0, 1.35, E.inOutSoft(prog(t, 3.0, 6.0)));
    if (t < 6.6) return lerp(1.35, 1.43, E.out(prog(t, 6.0, 6.6)));        // breath in
    if (t < 8.55) {
      const z = lerp(1.43, 0.40, E.inOut(prog(t, 6.6, 7.9)));
      return z * lerp(1, 0.96, E.inOutSoft(prog(t, 7.9, 8.55)));
    }
    return lerp(0.384, 1.0, E.inOut(prog(t, 8.6, T.camArrive)));
  }

  function cameraAt(t) {
    const s = scaleAt(t);
    let c;
    const c6 = (() => { const p = smoothLoop(T.freeze); return { x: p.x * 0.55, y: p.y * 0.55 }; })();
    if (t < T.freeze) {
      const p = smoothLoop(t);
      c = { x: p.x * 0.55, y: p.y * 0.55 };
    } else if (t < 8.6) {
      const k = E.inOut(prog(t, 6.6, 7.9));
      c = { x: lerp(c6.x, P_F.x, k), y: lerp(c6.y, P_F.y, k) };
    } else {
      const k = E.inOut(prog(t, 8.6, T.camArrive));
      c = { x: lerp(P_F.x, D.x, k), y: lerp(P_F.y, D.y, k) };
    }
    // organic handheld drift while trapped, gone once frozen
    const live = 1 - prog(t, 5.4, 6.0);
    const tt = Math.min(t, T.freeze);
    c.x += live * (6 * Math.sin(tt * 1.3) + 3 * Math.sin(tt * 2.9 + 1));
    c.y += live * (5 * Math.sin(tt * 1.1 + 2) + 3 * Math.sin(tt * 3.3));
    const sway = live * 0.022 * Math.sin(tt * 0.9 + 0.5) * (1 - prog(t, 2.6, 3.4));
    return { cx: c.x, cy: c.y, s, rot: rotAt(t) + sway };
  }

  function toScreen(p, cam) {
    const dx = p.x - cam.cx, dy = p.y - cam.cy;
    const c = Math.cos(cam.rot), s = Math.sin(cam.rot);
    return { x: ANCHOR.x + cam.s * (dx * c - dy * s), y: ANCHOR.y + cam.s * (dx * s + dy * c) };
  }
  function toWorld(q, cam) {
    const x = (q.x - ANCHOR.x) / cam.s, y = (q.y - ANCHOR.y) / cam.s;
    const c = Math.cos(-cam.rot), s = Math.sin(-cam.rot);
    return { x: cam.cx + x * c - y * s, y: cam.cy + x * s + y * c };
  }

  // ================================================================
  //  3. hero circle position over the whole film
  // ================================================================
  function escapeEase(u) {
    // small wind-up, decisive travel, soft overshoot and settle
    if (u <= 0) return 0;
    if (u < 0.14) return -0.018 * Math.sin((u / 0.14) * Math.PI);
    const v = (u - 0.14) / 0.86;
    return E.outBack(E.inOutSoft(v) * 0.985 + 0.015 * v, 0.9) ;
  }
  function heroAt(t) {
    if (t < T.escStart) {
      const p = loopPos(Math.min(t, T.freeze));
      return { x: p.x, y: p.y, squash: t < T.freeze ? p.squash : p.squash, dir: p.dir };
    }
    const k = escapeEase(prog(t, T.escStart, T.escStart + T.escDur));
    return { x: P_F.x + U.x * ESC_LEN * k, y: P_F.y + U.y * ESC_LEN * k, squash: 0, dir: [U.x, U.y] };
  }

  // ================================================================
  //  4. breakthrough line & wall cracking
  // ================================================================
  const lineFront = (t) => 3600 * E.out(prog(t, T.breakStart, T.breakStart + 0.9));
  function gapAt(t, along) {
    const past = lineFront(t) - Math.abs(along);
    return 30 * E.outBack(clamp(past / 420), 2.2);
  }

  // returns pieces of segment AB that survive the crack, with displacement
  function crackSegment(A, B, t) {
    if (t < T.breakStart) return [[A, B, 0]];
    const dA = (A.x - P_F.x) * N.x + (A.y - P_F.y) * N.y;
    const dB = (B.x - P_F.x) * N.x + (B.y - P_F.y) * N.y;
    if ((dA > 0 && dB > 0 && Math.min(dA, dB) > 40) || (dA < 0 && dB < 0 && Math.max(dA, dB) < -40)) return [[A, B, 0]];
    // crossing point (or nearest approach)
    const den = dA - dB;
    const tc = Math.abs(den) < 1e-9 ? 0.5 : clamp(dA / den);
    const X = { x: lerp(A.x, B.x, tc), y: lerp(A.y, B.y, tc) };
    const along = (X.x - P_F.x) * U.x + (X.y - P_F.y) * U.y;
    const g = gapAt(t, along);
    if (g <= 0.01) return [[A, B, 0]];
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    const slope = Math.abs(dB - dA) / len;                    // d changes per unit length
    const half = slope > 1e-6 ? (g / slope) / len : 2;
    const t1 = tc - half, t2 = tc + half;
    const out = [];
    const push = g * 0.45;
    const P = (u) => ({ x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u) });
    if (t1 > 0) {
      const sgn = Math.sign(dA) || -1;
      out.push([A, P(t1), push * sgn, along]);
    }
    if (t2 < 1) {
      const sgn = Math.sign(dB) || 1;
      out.push([P(t2), B, push * sgn, along]);
    }
    out.crack = { X, along, g };
    return out;
  }

  // ================================================================
  //  5. tile geometry
  // ================================================================
  const TILE_SEGS = (() => {
    const s = [];
    const h = H_OUT;
    s.push({ a: [-h, -h], b: [h, -h], side: 1 });   // top    (N)
    s.push({ a: [h, -h], b: [h, h], side: 0 });     // right  (E)
    s.push({ a: [h, h], b: [-h, h], side: 3 });     // bottom (S)
    s.push({ a: [-h, h], b: [-h, -h], side: 2 });   // left   (W)
    const m = H_MID, g = DOOR;
    // middle square with a door in the centre of each side
    s.push({ a: [-m, -m], b: [-g, -m] }); s.push({ a: [g, -m], b: [m, -m] });
    s.push({ a: [m, -m], b: [m, -g] });   s.push({ a: [m, g], b: [m, m] });
    s.push({ a: [m, m], b: [g, m] });     s.push({ a: [-g, m], b: [-m, m] });
    s.push({ a: [-m, m], b: [-m, g] });   s.push({ a: [-m, -g], b: [-m, -m] });
    return s;
  })();

  function wallFlash(t, side) {
    // impact flash on the wall the circle just hit
    if (t >= T.freeze + 0.0001 && t > 0) t = T.freeze;
    let f = 0;
    for (const a of ATTEMPTS) {
      if (a.hit > t || a.hit > T.freeze) continue;
      const s = DIRS.indexOf(a.dir);
      if (s !== side) continue;
      f = Math.max(f, Math.exp(-(t - a.hit) / 0.18));
    }
    return f;
  }

  // ================================================================
  //  6. typography
  // ================================================================
  const CAPTIONS = [
    { lines: ['WHY ARE YOU', 'STILL STUCK?'], tin: 0.22, tout: 2.85, stagger: 0.09 },
    { lines: ['SAME HABITS.', 'SAME RESULTS.'], tin: 3.1, lineIn: [3.1, 4.5], tout: 6.0, cut: true },
    { lines: ['CHANGE THE', 'PATTERN.'], tin: 8.0, tout: 9.85, stagger: 0.12 },
    { lines: ['CHANGE YOUR', 'LIFE.'], tin: 10.35, tout: 12.85, stagger: 0.12 },
    { lines: ['ONE DIFFERENT', 'CHOICE.'], tin: 13.55, tout: 99, stagger: 0.14 },
  ];
  const FONT_SIZE = 104, LINE_H = 112, TRACK = 3;

  function drawTrackedText(ctx, str, cx, y) {
    // manual letter-spacing for consistent tracking across browsers
    let w = 0;
    const widths = [...str].map((ch) => ctx.measureText(ch).width);
    w = widths.reduce((a, b) => a + b, 0) + TRACK * (widths.length - 1);
    let x = cx - w / 2;
    [...str].forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + TRACK; });
    return w;
  }

  function drawCaptions(ctx, t) {
    ctx.save();
    ctx.font = `700 ${FONT_SIZE}px "InterDisplay"`;
    ctx.textBaseline = 'alphabetic';
    for (const c of CAPTIONS) {
      if (t < c.tin - 0.01 || t > c.tout + 0.4) continue;
      if (c.cut && t >= c.tout) continue;                    // hard cut on the freeze
      const n = c.lines.length;
      const top = TEXT_Y - (n * LINE_H) / 2;
      c.lines.forEach((line, i) => {
        const tin = c.lineIn ? c.lineIn[i] : c.tin + i * (c.stagger || 0);
        if (t < tin) return;
        const pin = E.out(prog(t, tin, tin + 0.62));
        const pout = c.cut ? 0 : E.in(prog(t, c.tout, c.tout + 0.32));
        const baseline = top + LINE_H * (i + 1) - 22;
        // masked rise: each line slides up out of its own slot
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, baseline - FONT_SIZE * 0.92, W, FONT_SIZE * 1.18);
        ctx.clip();
        const y = baseline + (1 - pin) * LINE_H * 0.95 - pout * 26;
        ctx.globalAlpha = clamp(pin * 1.4) * (1 - pout);
        if (pout > 0) ctx.filter = `blur(${(pout * 10).toFixed(2)}px)`;
        ctx.fillStyle = rgba(WHITE, 1);
        drawTrackedText(ctx, line, W / 2, y);
        ctx.restore();
      });
    }
    ctx.restore();
  }

  // ================================================================
  //  7. composition (rings → final mark)
  // ================================================================
  const RINGS = 7;
  const ringR = (i) => 64 + i * 56;
  const OMEGA = (i) => 2 * Math.PI * (0.16 + 0.05 * (RINGS - 1 - i));
  function settle(t) {
    // time-to-alignment with a smooth landing (zero velocity at T.align)
    const d = Math.max(0, T.align - t);
    return d > 1 ? d - 0.5 : 0.5 * d * d;
  }

  function strokePartialPoly(ctx, pts, p) {
    // draw-on of a closed polygon
    const segs = pts.map((a, i) => [a, pts[(i + 1) % pts.length]]);
    const lens = segs.map(([a, b]) => Math.hypot(b.x - a.x, b.y - a.y));
    let remain = lens.reduce((a, b) => a + b, 0) * clamp(p);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < segs.length && remain > 0; i++) {
      const [a, b] = segs[i];
      const k = Math.min(1, remain / lens[i]);
      ctx.lineTo(lerp(a.x, b.x, k), lerp(a.y, b.y, k));
      remain -= lens[i];
    }
    ctx.stroke();
  }

  function drawComposition(ctx, t, C) {
    if (t < T.ringsStart - 0.05) return;
    const q = E.inOut(prog(t, T.alignStart, T.align + 0.1));     // alignment
    const z = 1 + 0.03 * E.inOutSoft(prog(t, T.alignStart, 15));   // slow final push
    ctx.save();
    ctx.translate(C.x, C.y);
    ctx.scale(z, z);
    ctx.lineCap = 'round';

    // --- fine tick ring (precision instrument feel)
    const tickP = E.out(prog(t, 10.6, 11.8));
    if (tickP > 0) {
      const rot = 0.06 * (Math.min(t, T.align) - 10.6) + 0.0;
      const n = 120;
      ctx.strokeStyle = rgba(WHITE, 0.22 * (1 - 0.55 * q));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let k = 0; k < n * tickP; k++) {
        const a = rot + (k / n) * Math.PI * 2 - Math.PI / 2;
        const len = k % 10 === 0 ? 14 : 7;
        ctx.moveTo(Math.cos(a) * 452, Math.sin(a) * 452);
        ctx.lineTo(Math.cos(a) * (452 + len), Math.sin(a) * (452 + len));
      }
      ctx.stroke();
    }

    // --- concentric rings
    const keep = { 3: 200, 6: 400 };
    const dots = [];
    for (let i = 0; i < RINGS; i++) {
      const born = T.ringsStart + i * 0.09;
      const p = prog(t, born, born + 1.05);
      if (p <= 0) continue;
      let r = ringR(i) * E.outBack(p, 1.5) * (1 + 0.006 * Math.sin(2 * Math.PI * 0.5 * t + i));
      let a = (0.9 - 0.075 * i) * clamp(p * 3);
      if (i in keep) { r = lerp(r, keep[i], q); a = lerp(a, 0.92, q); }
      else {
        r = lerp(r, i < 3 ? 200 : 400, q);
        a *= 1 - E.out(q);
      }
      if (a < 0.003) continue;
      ctx.strokeStyle = rgba(WHITE, a);
      ctx.lineWidth = 2.2;
      ctx.shadowColor = rgba(WHITE, 0.35 * a);
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.1, r), 0, Math.PI * 2);
      ctx.stroke();
      // orbiting dot — pendulum wave that resolves into a single line
      const ang = -Math.PI / 2 - OMEGA(i) * settle(t);
      dots.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r, a: (i in keep) ? Math.min(1, a + 0.1) : a, p });
    }
    ctx.shadowBlur = 0;

    // --- final geometry: triangle, square, axis
    const triP = E.inOut(prog(t, 13.2, 14.0));
    if (triP > 0) {
      const R = 400;
      const pts = [0, 1, 2].map((k) => {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3;
        return { x: Math.cos(a) * R, y: Math.sin(a) * R };
      });
      ctx.strokeStyle = rgba(WHITE, 0.85);
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      strokePartialPoly(ctx, pts, triP);
    }
    const sqP = E.inOut(prog(t, 13.38, 14.15));
    if (sqP > 0) {
      const h = 200 / Math.SQRT2;
      const pts = [{ x: 0, y: -200 }, { x: 200, y: 0 }, { x: 0, y: 200 }, { x: -200, y: 0 }];
      // square inscribed in the incircle, standing on a vertex — pointing up
      ctx.strokeStyle = rgba(WHITE, 0.7);
      ctx.lineWidth = 2;
      strokePartialPoly(ctx, pts, sqP);
      void h;
    }
    const axP = E.out(prog(t, 13.7, 14.35));
    if (axP > 0) {
      ctx.strokeStyle = rgba(WHITE, 0.9);
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -400 * axP);
      ctx.stroke();
    }

    // dots on top of rings
    for (const d of dots) {
      ctx.fillStyle = rgba(WHITE, d.a);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 6.5 * E.outBack(clamp(d.p * 1.5), 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ================================================================
  //  8. film grain (pre-baked, deterministic)
  // ================================================================
  let GRAIN = null;
  function buildGrain() {
    GRAIN = [];
    for (let g = 0; g < 6; g++) {
      const c = document.createElement('canvas');
      c.width = 540; c.height = 960;
      const x = c.getContext('2d');
      const img = x.createImageData(540, 960);
      let seed = 1234 + g * 7919;
      for (let i = 0; i < img.data.length; i += 4) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const v = seed / 0x7fffffff;
        const on = v > 0.5;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = on ? 255 : 0;
        img.data[i + 3] = Math.floor(Math.abs(v - 0.5) * 2 * 14);
      }
      x.putImageData(img, 0, 0);
      GRAIN.push(c);
    }
  }

  // ================================================================
  //  9. frame
  // ================================================================
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = W; canvas.height = H;

  function blueAmt(t) {
    return E.out(prog(t, T.breakStart, T.breakStart + 0.25)) * (1 - E.inOutSoft(prog(t, 9.8, 10.7)));
  }

  function renderFrame(f) {
    if (!GRAIN) buildGrain();
    const t = f / FPS;
    const cam = cameraAt(t);
    const s = cam.s;
    const blue = blueAmt(t);

    // ---- background
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    const bgG = ctx.createRadialGradient(ANCHOR.x, ANCHOR.y, 0, ANCHOR.x, ANCHOR.y, 1100);
    bgG.addColorStop(0, `rgba(24,26,32,${0.9 + 0.1 * blue})`);
    bgG.addColorStop(1, 'rgba(5,5,6,0)');
    ctx.fillStyle = bgG;
    ctx.fillRect(0, 0, W, H);
    if (blue > 0) {
      const bg2 = ctx.createRadialGradient(ANCHOR.x, ANCHOR.y, 0, ANCHOR.x, ANCHOR.y, 900);
      bg2.addColorStop(0, rgba(BLUE, 0.10 * blue));
      bg2.addColorStop(1, rgba(BLUE, 0));
      ctx.fillStyle = bg2;
      ctx.fillRect(0, 0, W, H);
    }

    // ---- world space
    const hero = heroAt(t);
    const px = (p) => p / s;                     // screen px -> world units
    const wallW = px(1.1 + 1.5 * s);

    ctx.save();
    ctx.translate(ANCHOR.x, ANCHOR.y);
    ctx.scale(s, s);
    ctx.rotate(cam.rot);
    ctx.translate(-cam.cx, -cam.cy);
    ctx.lineCap = 'square';

    // visible tile range
    const corners = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: 0, y: H }, { x: W, y: H }].map((q) => toWorld(q, cam));
    const xs = corners.map((p) => p.x), ys = corners.map((p) => p.y);
    const i0 = Math.floor((Math.min(...xs) - TILE / 2) / TILE), i1 = Math.ceil((Math.max(...xs) + TILE / 2) / TILE);
    const j0 = Math.floor((Math.min(...ys) - TILE / 2) / TILE), j1 = Math.ceil((Math.max(...ys) + TILE / 2) / TILE);

    const flashes = [0, 1, 2, 3].map((k) => wallFlash(t, k));
    const loop = loopPos(Math.min(t, T.freeze));
    const cracks = [];

    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const cxT = i * TILE, cyT = j * TILE;
        const d = Math.max(Math.abs(i), Math.abs(j));
        // tiles multiply outward, ring by ring
        let alpha;
        if (d === 0) alpha = 1;
        else {
          const base = d === 1 ? 0.34 : 0.0;
          const p = E.out(prog(t, 3.15 + 0.38 * (d - 1), 3.85 + 0.38 * (d - 1)));
          const reveal = E.out(prog(t, 6.6 + 0.12 * d, 7.6 + 0.12 * d));     // zoom-out reveal
          alpha = Math.max(lerp(base, 0.62, p), 0.62 * reveal);
        }
        // spatial falloff on screen
        const sc = toScreen({ x: cxT, y: cyT }, cam);
        const ds = Math.hypot((sc.x - ANCHOR.x) / 1.05, (sc.y - ANCHOR.y) / 1.3);
        alpha *= 1 - 0.75 * clamp((ds - 450) / 900);
        // dissolve into the new order
        const distD = Math.hypot(cxT - D.x, cyT - D.y);
        const dis = E.inOutSoft(prog(t, 9.35 + (distD / 3000) * 0.7, 10.25 + (distD / 3000) * 0.7));
        alpha *= 1 - dis;
        if (alpha < 0.004) continue;

        // walls
        TILE_SEGS.forEach((seg, si) => {
          const A = { x: cxT + seg.a[0], y: cyT + seg.a[1] };
          const B = { x: cxT + seg.b[0], y: cyT + seg.b[1] };
          const pieces = crackSegment(A, B, t);
          if (pieces.crack) cracks.push({ ...pieces.crack, id: (i * 73856093) ^ (j * 19349663) ^ (si * 83492791) });
          const fl = seg.side !== undefined ? flashes[seg.side] * (d === 0 ? 1 : 0.6) : 0;
          const isOuter = seg.side !== undefined;
          const a = alpha * (isOuter ? 0.95 : 0.6) + fl * 0.5 * alpha;
          for (const [P, Q, push] of pieces) {
            let p1 = { x: P.x + N.x * push, y: P.y + N.y * push };
            let p2 = { x: Q.x + N.x * push, y: Q.y + N.y * push };
            if (dis > 0) {
              // segments contract to their centres and drift away from the new centre
              const m = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
              const k = 1 - dis;
              const away = { x: m.x - D.x, y: m.y - D.y };
              const al = Math.hypot(away.x, away.y) || 1;
              const drift = dis * 90;
              const ox = (away.x / al) * drift, oy = (away.y / al) * drift;
              p1 = { x: m.x + (p1.x - m.x) * k + ox, y: m.y + (p1.y - m.y) * k + oy };
              p2 = { x: m.x + (p2.x - m.x) * k + ox, y: m.y + (p2.y - m.y) * k + oy };
            }
            ctx.strokeStyle = rgba(WHITE, Math.min(1, a));
            ctx.lineWidth = wallW * (isOuter ? 1 : 0.8) * (1 + fl * 0.6);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // grid nodes + inner marks
        ctx.fillStyle = rgba(WHITE, alpha * 0.55);
        const nodeR = px(2.2);
        for (const [ox, oy] of [[-200, -200]]) {
          ctx.beginPath(); ctx.arc(cxT + ox, cyT + oy, nodeR, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = rgba(WHITE, alpha * 0.35);
        for (const [ox, oy] of [[-132, -132], [132, -132], [132, 132], [-132, 132]]) {
          ctx.beginPath(); ctx.arc(cxT + ox, cyT + oy, px(1.6), 0, Math.PI * 2); ctx.fill();
        }

        // echo circles — the same loop, everywhere
        if (d > 0 && t < T.escStart + 1.2) {
          const ea = alpha * 0.75 * E.out(prog(t, 3.3 + 0.38 * (d - 1), 4.0 + 0.38 * (d - 1)));
          const ea2 = Math.max(ea, alpha * 0.7 * E.out(prog(t, 6.7, 7.4)));
          if (ea2 > 0.01) {
            ctx.fillStyle = rgba(WHITE, ea2);
            ctx.beginPath();
            ctx.arc(cxT + loop.x, cyT + loop.y, R_CIRCLE * 0.85, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // ---- breakthrough line
    if (t >= T.breakStart && t < 10.8) {
      const Lf = lineFront(t);
      const fade = 1 - E.inOutSoft(prog(t, 9.7, 10.6));
      const A = { x: P_F.x - U.x * Lf * 0.55, y: P_F.y - U.y * Lf * 0.55 };
      const B = { x: P_F.x + U.x * Lf, y: P_F.y + U.y * Lf };
      ctx.save();
      ctx.lineCap = 'round';
      ctx.shadowColor = rgba(BLUE, 0.9 * fade);
      ctx.shadowBlur = 26;
      ctx.strokeStyle = rgba(BLUE, 0.95 * fade);
      ctx.lineWidth = px(4.5);
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = rgba([210, 228, 255], 0.9 * fade);
      ctx.lineWidth = px(1.4);
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      // leading spark
      const lead = prog(t, T.breakStart, T.breakStart + 0.9);
      if (lead < 1) {
        ctx.fillStyle = rgba([220, 235, 255], 1 - lead);
        ctx.shadowColor = rgba(BLUE, 1);
        ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(B.x, B.y, px(7), 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // shards flung out where walls break
      ctx.save();
      for (const c of cracks) {
        const past = lineFront(t) - Math.abs(c.along);
        const k = clamp(past / 900);
        if (k <= 0 || k >= 1) continue;
        for (let m = 0; m < 4; m++) {
          const h1 = hash(c.id + m * 31), h2 = hash(c.id * 7 + m), h3 = hash(c.id + m * 101);
          const sgn = h1 > 0.5 ? 1 : -1;
          const dist = E.out(k) * (40 + 90 * h2);
          const sx = c.X.x + N.x * sgn * dist + U.x * (h3 - 0.5) * 60 * k;
          const sy = c.X.y + N.y * sgn * dist + U.y * (h3 - 0.5) * 60 * k;
          const sz = px(3 + 4 * h3) * (1 - k);
          ctx.fillStyle = m % 2 ? rgba(BLUE, (1 - k) * fade) : rgba(WHITE, 0.85 * (1 - k) * fade);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(h2 * 6 + k * 4 * sgn);
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // ---- motion trails
    const trailStrength = t < T.escStart
      ? lerp(0.35, 1, E.inOut(prog(t, 2.8, 4.0))) * (1 - E.inOutSoft(prog(t, 6.7, 7.6)))
      : (1 - E.inOutSoft(prog(t, T.escStart + 1.1, T.escStart + 1.6)));
    if (trailStrength > 0.01) {
      const n = 26;
      const step = t < T.escStart ? 0.011 : 0.016;
      const tEff = t < T.escStart ? Math.min(t, T.freeze) : t;
      const pts = [];
      for (let k = 0; k <= n; k++) {
        const tk = tEff - k * step;
        if (t >= T.escStart && tk < T.escStart) break;
        pts.push(heroAt(t < T.escStart ? Math.min(tk, T.freeze) : tk));
      }
      ctx.save();
      ctx.lineCap = 'round';
      const col = mix3(WHITE, BLUE, blue);
      for (let k = 1; k < pts.length; k++) {
        const f1 = 1 - k / n;
        ctx.strokeStyle = rgba(col, 0.55 * f1 * f1 * trailStrength);
        ctx.lineWidth = R_CIRCLE * 2 * (0.15 + 0.85 * f1);
        ctx.beginPath();
        ctx.moveTo(pts[k - 1].x, pts[k - 1].y);
        ctx.lineTo(pts[k].x, pts[k].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ---- hero circle (world space until the composition takes over)
    const heroScreen = toScreen(hero, cam);
    ctx.restore();

    // ---- composition
    const C = toScreen(D, cam);
    drawComposition(ctx, t, C);

    // hero in screen space (constant visual weight, easier glow control)
    {
      const grow = E.outBack(prog(t, 10.0, 10.9), 1.8);
      const rWorld = Math.max(R_CIRCLE * s, 10);
      const r = lerp(rWorld, 22, grow) * (1 + 0.15 * E.outBack(prog(t, T.align, T.align + 0.5), 3) * (1 - prog(t, T.align + 0.5, T.align + 1.2)));
      const pos = t < 10.0 ? heroScreen : { x: lerp(heroScreen.x, C.x, grow), y: lerp(heroScreen.y, C.y, grow) };
      const zf = 1 + 0.03 * E.inOutSoft(prog(t, T.alignStart, 15));
      const P = t >= T.alignStart ? { x: C.x + (pos.x - C.x) * zf, y: C.y + (pos.y - C.y) * zf } : pos;
      const col = mix3(WHITE, [140, 185, 255], blue * 0.85);
      ctx.save();
      ctx.translate(P.x, P.y);
      // squash on impact, oriented to motion
      if (hero.squash > 0.01 && t < T.escStart) {
        const ang = Math.atan2(hero.dir[1], hero.dir[0]) + cam.rot;
        ctx.rotate(ang);
        ctx.scale(1 - 0.32 * hero.squash, 1 + 0.2 * hero.squash);
        ctx.rotate(-ang);
      }
      ctx.shadowColor = blue > 0.02 ? rgba(BLUE, 0.95 * blue) : rgba(WHITE, 0.6);
      ctx.shadowBlur = 18 + 40 * blue + 16 * grow;
      ctx.fillStyle = rgba(col, 1);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ---- type band: keep the words on clean black
    const tg = ctx.createLinearGradient(0, 0, 0, 720);
    tg.addColorStop(0, 'rgba(5,5,6,0.96)');
    tg.addColorStop(0.68, 'rgba(5,5,6,0.9)');
    tg.addColorStop(1, 'rgba(5,5,6,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, 720);

    // ---- vignette
    const vg = ctx.createRadialGradient(W / 2, H * 0.55, 500, W / 2, H * 0.55, 1250);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // ---- grain (held during the freeze — time literally stops)
    const gf = t >= T.freeze && t < T.anticipate ? Math.floor(T.freeze * FPS) : f;
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(GRAIN[gf % GRAIN.length], 0, 0, W, H);
    ctx.imageSmoothingEnabled = true;

    // ---- typography sits above grade & grain: pure, crisp white
    drawCaptions(ctx, t);
  }

  // ================================================================
  //  10. events (consumed by the audio score so sound and picture lock)
  // ================================================================
  const EVENTS = {
    hits: ATTEMPTS.filter((a) => a.hit > 0 && a.hit < T.freeze).map((a) => +a.hit.toFixed(4)),
    launches: ATTEMPTS.filter((a) => a.t > 0 && a.t < T.freeze).map((a) => +a.t.toFixed(4)),
    freeze: T.freeze,
    zoom: T.anticipate,
    breakthrough: T.breakStart,
    escape: T.escStart,
    rings: Array.from({ length: RINGS }, (_, i) => +(T.ringsStart + i * 0.09).toFixed(3)),
    align: T.align,
    captions: CAPTIONS.map((c) => c.lineIn ? c.lineIn : [c.tin]).flat(),
  };

  window.REEL = { W, H, FPS, FRAMES, renderFrame, EVENTS };
})();
