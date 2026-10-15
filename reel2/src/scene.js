/* ------------------------------------------------------------------
 *  DISCIPLINE COMPOUNDS — deterministic frame renderer
 *  Motivation spikes, crashes, flatlines.
 *  Discipline bounces the same small arc every day... and 1.01^365 = 37.8x.
 *
 *  renderFrame(f) is a pure function of the frame number.
 * ------------------------------------------------------------------ */
(() => {
  'use strict';

  const W = 1080, H = 1920, FPS = 30, FRAMES = 450;
  const AMBER = [255, 194, 58];
  const BLUE = [38, 150, 255];
  const WHITE = [245, 245, 242];
  const GREY = [120, 120, 126];

  // ================================================================ helpers
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const mixc = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (u) => ((ax * u + bx) * u + cx) * u;
    const sy = (u) => ((ay * u + by) * u + cy) * u;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let lo = 0, hi = 1, u = x;
      for (let i = 0; i < 30; i++) { if (sx(u) < x) lo = u; else hi = u; u = (lo + hi) / 2; }
      return sy(u);
    };
  }
  const E = {
    out: bezier(0.16, 1, 0.3, 1),
    inOut: bezier(0.65, 0, 0.35, 1),
    soft: bezier(0.45, 0, 0.25, 1),
    in: bezier(0.55, 0, 1, 0.45),
    outBack: (x, s = 1.70158) => { x = clamp(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; },
  };

  // ================================================================ time
  // Real time t (seconds of film) -> simulation time s.
  // 1x until 9 s, then a time-lapse that sweeps through a whole year,
  // decelerating to land exactly on day 365.
  const BOUNCE_HZ = 1.5;                       // one bounce = one day
  const S_END = 365 / BOUNCE_HZ;
  const T_RAMP = [9.0, 10.5], T_BRAKE = [12.1, 13.45];
  const DT = 1 / 600;
  const STEPS = Math.ceil(15 / DT) + 2;
  function rateShape(t, R) {
    let r = lerp(1, R, smooth(prog(t, T_RAMP[0], T_RAMP[1])));
    const b = prog(t, T_BRAKE[0], T_BRAKE[1]);
    r *= 1 - (b * b * (3 - 2 * b));
    return Math.max(0, r);
  }
  function integrate(R) {
    const tab = new Float64Array(STEPS);
    let s = 0;
    for (let i = 1; i < STEPS; i++) {
      const t = (i - 0.5) * DT;
      s += rateShape(t, R) * DT;
      tab[i] = s;
    }
    return tab;
  }
  let lo = 1, hi = 400, TAB;
  for (let k = 0; k < 50; k++) {
    const mid = (lo + hi) / 2;
    TAB = integrate(mid);
    if (TAB[STEPS - 1] < S_END) lo = mid; else hi = mid;
  }
  TAB = integrate((lo + hi) / 2);
  const simTime = (t) => {
    const x = clamp(t, 0, 15) / DT, i = Math.floor(x), f = x - i;
    return Math.min(S_END, lerp(TAB[i], TAB[Math.min(i + 1, STEPS - 1)], f));
  };
  const rateAt = (t) => (simTime(t + 0.01) - simTime(t - 0.01)) / 0.02;

  // ================================================================ curves (world px, +y = up)
  const A = 200;        // compounding scale
  const ARC = 70;       // the daily bounce — never changes
  const day = (s) => s * BOUNCE_HZ;
  const floorD = (s) => (s > 0 ? A * (Math.pow(1.01, day(s)) - 1) : 0);
  const D = (s) => floorD(s) + ARC * Math.abs(Math.sin(Math.PI * day(s)));
  const mult = (s) => Math.pow(1.01, Math.max(0, day(s)));

  function M(s) {
    const n = 92 * Math.sin(2 * Math.PI * 0.83 * s + 0.4) + 66 * Math.sin(2 * Math.PI * 1.87 * s + 1.3)
            + 38 * Math.sin(2 * Math.PI * 3.3 * s + 2.2) + 22 * Math.sin(2 * Math.PI * 5.1 * s + 0.7);
    const env = s < 4.25 ? 1 : Math.max(0.035, Math.exp(-(s - 4.25) / 0.45));
    const hype = 285 * Math.exp(-Math.pow((s - 3.25) / 0.3, 2));
    const crash = -185 * Math.exp(-Math.pow((s - 4.5) / 0.26, 2));
    // later "new year, new me" flickers — each one smaller, each one gone
    let flick = 0;
    for (const [c, a] of [[42, 150], [96, 105], [150, 70], [205, 45]]) {
      const x = (s - c) / 0.9;
      flick += a * Math.exp(-x * x) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 1.2 * (s - c)));
    }
    return env * n + hype + crash + flick;
  }
  const PEAK_M = (() => { let m = 0; for (let s = -4; s < 8; s += 0.002) m = Math.max(m, M(s)); return m; })();
  const S_OVER = Math.log(1 + PEAK_M / A) / Math.log(1.01) / BOUNCE_HZ;
  const T_OVER = (() => { for (let t = 0; t < 15; t += 1 / 1200) if (simTime(t) >= S_OVER) return t; return 15; })();
  const T_STOP = T_BRAKE[1];

  // ================================================================ camera / panels
  const V = 300;                       // px per sim-second at 1x
  const MERGE = [9.0, 10.9];
  const FIT = { left: 110, head: 950, base: 1510, top: 640 };
  function panels(t, s) {
    const k = E.inOut(prog(t, MERGE[0], MERGE[1]));
    const zxF = (FIT.head - FIT.left) / (V * Math.max(s, 1));
    const zyF = Math.min(1, (FIT.base - FIT.top) / (D(s) + 40));
    const lx = (a, b) => Math.exp(lerp(Math.log(a), Math.log(b), k));
    const mk = (head, base) => ({
      head: lerp(head, FIT.head, k), base: lerp(base, FIT.base, k),
      zx: lx(1, zxF), zy: lx(1, zyF), k,
    });
    return { m: mk(720, 900), d: mk(720, 1470), k };
  }
  const sx = (p, s, sh) => p.head - (sh - s) * V * p.zx;
  const sy = (p, y) => p.base - y * p.zy;

  // ================================================================ text
  const CAP = [
    { t0: 0.12, t1: 2.38, lines: [[['WHICH ONE', WHITE]], [['GETS YOU THERE?', WHITE]]] },
    { t0: 2.72, t1: 4.05, lines: [[['MOTIVATION', AMBER]], [['SPIKES.', WHITE]]] },
    { t0: 4.38, t1: 6.1, lines: [[['THEN IT', WHITE]], [['CRASHES.', WHITE]]] },
    { t0: 6.45, t1: 8.66, lines: [[['DISCIPLINE', BLUE]], [['JUST SHOWS UP.', WHITE]]] },
    { t0: 9.0, t1: T_OVER - 0.42, lines: [[['SAME SMALL ARC.', WHITE]], [['EVERY. SINGLE. DAY.', WHITE]]] },
    { t0: T_OVER - 0.08, t1: 12.28, lines: [[['UNTIL IT PASSES', WHITE]], [['EVERY PEAK.', WHITE]]] },
    { t0: 12.62, t1: 99, size: 76, lines: [[['MOTIVATION ', AMBER], ['STARTS IT.', WHITE]], [['DISCIPLINE ', BLUE], ['FINISHES IT.', WHITE]]] },
  ];
  const TEXT_Y = 300;

  function tracked(ctx, str, track) {
    const ws = [...str].map((c) => ctx.measureText(c).width);
    return { ws, w: ws.reduce((a, b) => a + b, 0) + track * (ws.length - 1) };
  }
  function drawRuns(ctx, runs, cx, y, track) {
    const ms = runs.map(([s]) => tracked(ctx, s, track));
    const total = ms.reduce((a, m) => a + m.w, 0) + track * (runs.length - 1);
    let x = cx - total / 2;
    runs.forEach(([s, col], i) => {
      ctx.fillStyle = rgba(col, 1);
      [...s].forEach((ch, j) => { ctx.fillText(ch, x, y); x += ms[i].ws[j] + track; });
      x += 0;
    });
  }
  function drawCaptions(ctx, t) {
    for (const c of CAP) {
      if (t < c.t0 || t > c.t1 + 0.4) continue;
      const size = c.size || 92, lh = size * 1.1;
      ctx.save();
      ctx.font = `700 ${size}px "InterDisplay"`;
      ctx.textBaseline = 'alphabetic';
      const top = TEXT_Y - (c.lines.length * lh) / 2;
      c.lines.forEach((runs, i) => {
        const tin = c.t0 + i * 0.11;
        if (t < tin) return;
        const pin = E.out(prog(t, tin, tin + 0.6));
        const pout = E.in(prog(t, c.t1, c.t1 + 0.3));
        const base = top + lh * (i + 1) - size * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, base - size * 0.95, W, size * 1.22);
        ctx.clip();
        ctx.globalAlpha = clamp(pin * 1.5) * (1 - pout);
        if (pout > 0) ctx.filter = `blur(${(pout * 10).toFixed(2)}px)`;
        drawRuns(ctx, runs, W / 2, base + (1 - pin) * lh - pout * 24, 2);
        ctx.restore();
      });
      ctx.restore();
    }
  }
  function label(ctx, str, x, y, col, a, size = 30, align = 'center', weight = 600, track = 5) {
    ctx.save();
    ctx.font = `${weight} ${size}px "InterDisplay"`;
    ctx.globalAlpha = a;
    ctx.fillStyle = rgba(col, 1);
    const m = tracked(ctx, str, track);
    let x0 = align === 'center' ? x - m.w / 2 : align === 'right' ? x - m.w : x;
    [...str].forEach((ch, j) => { ctx.fillText(ch, x0, y); x0 += m.ws[j] + track; });
    ctx.restore();
  }
  // fixed-width digits so counters never jitter
  function numberText(ctx, str, x, y, col, a, size, align = 'left', weight = 700) {
    ctx.save();
    ctx.font = `${weight} ${size}px "InterDisplay"`;
    ctx.globalAlpha = a;
    ctx.fillStyle = rgba(col, 1);
    const cw = ctx.measureText('0').width;
    const wOf = (ch) => (/[0-9]/.test(ch) ? cw : ctx.measureText(ch).width);
    const total = [...str].reduce((s, ch) => s + wOf(ch), 0);
    let x0 = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
    for (const ch of str) {
      const w = wOf(ch);
      ctx.fillText(ch, x0 + (w - ctx.measureText(ch).width) / 2, y);
      x0 += w;
    }
    ctx.restore();
    return total;
  }

  // ================================================================ drawing
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = W; canvas.height = H;

  let GRAIN = null;
  function buildGrain() {
    GRAIN = [];
    for (let g = 0; g < 6; g++) {
      const c = document.createElement('canvas');
      c.width = 540; c.height = 960;
      const x = c.getContext('2d');
      const img = x.createImageData(540, 960);
      let seed = 4321 + g * 7919;
      for (let i = 0; i < img.data.length; i += 4) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const v = seed / 0x7fffffff;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v > 0.5 ? 255 : 0;
        img.data[i + 3] = Math.floor(Math.abs(v - 0.5) * 2 * 12);
      }
      x.putImageData(img, 0, 0);
      GRAIN.push(c);
    }
  }

  function tracePath(p, fn, sA, sB, sh) {
    const step = Math.min(0.04, Math.max(0.0035, 1.2 / (V * p.zx)));
    const pts = [];
    for (let s = sA; s < sB; s += step) pts.push([sx(p, s, sh), sy(p, fn(s))]);
    pts.push([sx(p, sB, sh), sy(p, fn(sB))]);
    return pts;
  }
  function strokePts(pts, col, a, width, glow) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (glow) {
      ctx.save();
      ctx.shadowColor = rgba(col, 0.85 * a);
      ctx.shadowBlur = glow;
      ctx.strokeStyle = rgba(col, 0.55 * a);
      ctx.lineWidth = width * 1.6;
      ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = rgba(col, a);
    ctx.lineWidth = width;
    ctx.stroke();
  }
  function dot(x, y, r, col, glowCol, glow, a = 1) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = rgba(glowCol, 0.95);
    ctx.shadowBlur = glow;
    ctx.fillStyle = rgba(col, 1);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function renderFrame(f) {
    if (!GRAIN) buildGrain();
    const t = f / FPS;
    const s = simTime(t);
    const rate = rateAt(t);
    const P = panels(t, s);
    const k = P.k;
    const over = E.out(prog(t, T_OVER, T_OVER + 0.5));
    const overFlash = Math.exp(-Math.max(0, t - T_OVER) / 0.35) * (t >= T_OVER ? 1 : 0);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.fillStyle = '#030304';
    ctx.fillRect(0, 0, W, H);

    // ambient light: amber while hype lives, blue once discipline takes over
    const hypeGlow = Math.exp(-Math.pow((s - 3.25) / 0.6, 2)) * (t < 9 ? 1 : 0);
    const blueGlow = 0.35 * k + 0.65 * over;
    const g1 = ctx.createRadialGradient(W / 2, 760, 0, W / 2, 760, 900);
    g1.addColorStop(0, rgba(AMBER, 0.11 * hypeGlow));
    g1.addColorStop(1, rgba(AMBER, 0));
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(FIT.head, 900, 0, FIT.head, 900, 1200);
    g2.addColorStop(0, rgba(BLUE, 0.10 * blueGlow + 0.08 * overFlash));
    g2.addColorStop(1, rgba(BLUE, 0));
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // dot grid — graph paper, barely there
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    for (let y = 560; y < 1700; y += 60) for (let x = 30; x < W; x += 60) ctx.fillRect(x, y, 2, 2);

    const pm = P.m, pd = P.d;
    const leftS = (p) => Math.max(-6 * (1 - p.k), s - (p.head + 20) / (V * p.zx));
    const sStartM = leftS(pm), sStartD = leftS(pd);

    // ---- axes
    const axisA = 0.55;
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(WHITE, axisA * (1 - k) + 0.35 * k);
    ctx.beginPath(); ctx.moveTo(0, pm.base); ctx.lineTo(W, pm.base); ctx.stroke();
    if (k < 0.999) {
      ctx.strokeStyle = rgba(WHITE, axisA * (1 - k));
      ctx.beginPath(); ctx.moveTo(0, pd.base); ctx.lineTo(W, pd.base); ctx.stroke();
    }

    // ---- fit-mode furniture: day ticks, multiplier gridlines, best-day line
    if (k > 0.01) {
      const a = E.out(prog(t, MERGE[0] + 0.6, MERGE[1] + 0.3));
      for (const dd of [100, 200, 300, 365]) {
        const ss = dd / BOUNCE_HZ;
        if (ss > s + 0.01) continue;
        const x = sx(pd, ss, s);
        ctx.strokeStyle = rgba(WHITE, 0.10 * a);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, pd.base + 10); ctx.lineTo(x, FIT.top - 40); ctx.stroke();
        label(ctx, `DAY ${dd}`, x, pd.base + 52, GREY, a * 0.9, 22, 'center', 600, 3);
      }
      // motivation's all-time high
      const yb = sy(pm, PEAK_M);
      ctx.save();
      ctx.setLineDash([10, 12]);
      ctx.lineDashOffset = -t * 30;
      ctx.strokeStyle = rgba(AMBER, (0.55 + 0.45 * overFlash) * a);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(FIT.left - 40, yb); ctx.lineTo(W, yb); ctx.stroke();
      ctx.restore();
      label(ctx, "MOTIVATION'S BEST DAY", W - 70, yb - 18, AMBER, 0.85 * a, 22, 'right', 600, 3);
    }

    // ---- MOTIVATION trace
    {
      const crashS = 5.0;
      const amberEnd = Math.min(s, crashS);
      if (sStartM < amberEnd) strokePts(tracePath(pm, M, sStartM, amberEnd, s), AMBER, 1, 4, 16);
      if (s > crashS) {
        const pts = tracePath(pm, M, Math.max(sStartM, crashS), s, s);
        strokePts(pts, mixc(AMBER, GREY, 0.75), 0.85, 3.2, 0);
      }
    }
    // ---- DISCIPLINE trace
    {
      const arcW = (V * pd.zx) / BOUNCE_HZ;              // on-screen width of one day
      const arcVis = smooth((arcW - 5) / 40);
      const Dv = (x) => floorD(x) + ARC * arcVis * Math.abs(Math.sin(Math.PI * day(x)));
      const pts = tracePath(pd, Dv, sStartD, s, s);
      strokePts(pts, BLUE, 1, 4, 18 + 14 * over);
    }

    // left-edge fade (only while scrolling)
    if (k < 1) {
      const fg = ctx.createLinearGradient(0, 0, 260, 0);
      fg.addColorStop(0, `rgba(3,3,4,${0.95 * (1 - k)})`);
      fg.addColorStop(1, 'rgba(3,3,4,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(0, 520, 260, 1200);
    }

    // ---- heads
    const mx = sx(pm, s, s), my = sy(pm, M(s));
    const arcVisH = smooth(((V * pd.zx) / BOUNCE_HZ - 5) / 40);
    const dx = sx(pd, s, s), dy = sy(pd, floorD(s) + ARC * arcVisH * Math.abs(Math.sin(Math.PI * day(s))));
    const mDead = prog(s, 4.6, 5.6);
    dot(mx, my, lerp(11, 8, mDead), mixc(WHITE, GREY, mDead * 0.6), mixc(AMBER, GREY, mDead), lerp(26, 6, mDead), lerp(1, 0.75, mDead));

    // daily landing pulses (readable only at 1x)
    if (rate < 1.6) {
      const dNow = day(s);
      for (let n = Math.floor(dNow); n >= Math.floor(dNow) - 1; n--) {
        if (n < 0) continue;
        const age = (dNow - n) / BOUNCE_HZ;
        if (age > 0.5) continue;
        const r = 10 + E.out(age / 0.5) * 34;
        ctx.strokeStyle = rgba(BLUE, 0.7 * (1 - age / 0.5));
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(sx(pd, n / BOUNCE_HZ, s), sy(pd, floorD(n / BOUNCE_HZ)), r, r * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // overtake burst
    if (t >= T_OVER && t < T_OVER + 1.2) {
      const q = prog(t, T_OVER, T_OVER + 1.1);
      for (let i = 0; i < 2; i++) {
        const qi = clamp(q * 1.2 - i * 0.18);
        if (qi <= 0 || qi >= 1) continue;
        ctx.strokeStyle = rgba(BLUE, 0.8 * (1 - qi));
        ctx.lineWidth = 3 * (1 - qi) + 1;
        ctx.beginPath(); ctx.arc(dx, dy, 14 + E.out(qi) * 150, 0, Math.PI * 2); ctx.stroke();
      }
    }
    const land = Math.abs(Math.sin(Math.PI * day(s)));
    const arrive = E.outBack(prog(t, T_STOP - 0.05, T_STOP + 0.5), 3) * (1 - prog(t, T_STOP + 0.5, T_STOP + 1.4));
    dot(dx, dy, 12 + 6 * over + 6 * arrive + (rate < 1.6 ? 1.5 * (1 - land) : 0), WHITE, BLUE, 28 + 30 * over + 40 * arrive);

    // ---- panel labels + live readouts (1x mode)
    const la = 1 - E.out(prog(t, MERGE[0], MERGE[0] + 0.7));
    if (la > 0.01) {
      const rowM = pm.base + 360, rowD = pd.base + 76;
      label(ctx, 'MOTIVATION', W / 2, rowM, WHITE, la, 30);
      label(ctx, 'DISCIPLINE', W / 2, rowD, WHITE, la, 30);
      const life = s < 4.25 ? 1 : Math.max(0.03, Math.exp(-(s - 4.25) / 0.5));
      const energy = Math.round(clamp((52 + M(s) / 5.2) * life, 1, 99));
      label(ctx, 'ENERGY', 70, rowM - 34, GREY, la * 0.9, 20, 'left', 600, 3);
      numberText(ctx, `${String(energy).padStart(2, '0')}%`, 70, rowM, mixc(AMBER, GREY, mDead), la, 30, 'left');
      label(ctx, 'STREAK', 70, rowD - 34, GREY, la * 0.9, 20, 'left', 600, 3);
      numberText(ctx, `DAY ${String(Math.max(1, Math.floor(day(s)) + 1)).padStart(3, '0')}`, 70, rowD, BLUE, la, 30, 'left');
    }

    // ---- legend (merged)
    if (k > 0.3) {
      const a = E.out(prog(t, MERGE[0] + 0.9, MERGE[1] + 0.4));
      const y = FIT.base + 112;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(AMBER, 1); ctx.beginPath(); ctx.arc(W / 2 - 250, y - 9, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(BLUE, 1); ctx.beginPath(); ctx.arc(W / 2 + 40, y - 9, 7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      label(ctx, 'MOTIVATION', W / 2 - 228, y, WHITE, a * 0.85, 24, 'left', 600, 4);
      label(ctx, 'DISCIPLINE', W / 2 + 62, y, WHITE, a * 0.85, 24, 'left', 600, 4);
    }

    // ---- the counter: the math nobody sees day to day
    if (t > MERGE[0] + 0.6) {
      const a = E.out(prog(t, MERGE[0] + 0.6, MERGE[0] + 1.4));
      const yTop = FIT.top + 20;
      const dd = Math.min(365, Math.max(1, Math.round(day(s))));
      const m = mult(s);
      label(ctx, `DAY ${String(dd).padStart(3, '0')}  ·  1% BETTER`, FIT.left, yTop, GREY, a * 0.95, 24, 'left', 600, 3);
      const pop = E.outBack(prog(t, T_STOP - 0.05, T_STOP + 0.45), 2.6) * (1 - prog(t, T_STOP + 0.45, T_STOP + 1.2));
      ctx.save();
      ctx.translate(FIT.left, yTop + 150);
      const sc = 1 + 0.06 * pop;
      ctx.scale(sc, sc);
      ctx.shadowColor = rgba(BLUE, 0.6 * (over * 0.6 + pop));
      ctx.shadowBlur = 30;
      const w = numberText(ctx, m.toFixed(1), 0, 0, mixc(WHITE, BLUE, 0.15 + 0.85 * over), a, 150, 'left');
      numberText(ctx, '×', w + 6, 0, BLUE, a, 110, 'left', 600);
      ctx.restore();
      label(ctx, '1.01^DAYS', FIT.left, yTop + 205, GREY, a * 0.7, 22, 'left', 600, 3);
    }

    // ---- text band
    const tg = ctx.createLinearGradient(0, 0, 0, 560);
    tg.addColorStop(0, 'rgba(3,3,4,0.97)');
    tg.addColorStop(0.75, 'rgba(3,3,4,0.85)');
    tg.addColorStop(1, 'rgba(3,3,4,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, 560);

    // ---- grade
    const vg = ctx.createRadialGradient(W / 2, H * 0.55, 520, W / 2, H * 0.55, 1300);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(GRAIN[f % GRAIN.length], 0, 0, W, H);
    ctx.imageSmoothingEnabled = true;

    drawCaptions(ctx, t);
  }

  // ================================================================ events for the score
  const perFrame = Array.from({ length: FRAMES }, (_, f) => {
    const t = f / FPS, s = simTime(t);
    return { m: +M(s).toFixed(2), d: +day(s).toFixed(4), x: +mult(s).toFixed(4) };
  });
  const landings = [];
  for (let n = 1; n <= 365; n++) {
    const target = n / BOUNCE_HZ;
    for (let t = 0; t < 15; t += 1 / 1200) if (simTime(t) >= target) { landings.push(+t.toFixed(4)); break; }
  }
  const EVENTS = {
    fps: FPS, perFrame, landings,
    hype: (() => { for (let t = 0; t < 15; t += 1 / 1200) if (simTime(t) >= 3.25) return t; })(),
    crash: (() => { for (let t = 0; t < 15; t += 1 / 1200) if (simTime(t) >= 4.5) return t; })(),
    flatline: (() => { for (let t = 0; t < 15; t += 1 / 1200) if (simTime(t) >= 5.6) return t; })(),
    merge: MERGE[0], over: T_OVER, stop: T_STOP,
    captions: CAP.map((c) => c.t0),
  };

  window.REEL = { W, H, FPS, FRAMES, renderFrame, EVENTS };
})();
