// Reel 2026-10-30 B · SPENDER / SAVER · "SAME SALARY. / DIFFERENT FUTURE."
// The same coin lands in both hands every week. One turns it into a red bag that vanishes; the other stacks it into stairs and climbs them.
(() => {
const E = ENGINE, { P, track, eseg, seg, lerp, clamp, C, wctx: w } = E;
const G = 1250, DUR = 13.8;
E.groundY = G;
const SPX = 180, SVX = 470, SX0 = 560, CW = 56, BH = 62;
const N = 11, catchT = i => 0.45 + i * 0.72;
const blocks = [];
for (let c = 0; c < 6; c++) for (let r = 0; r <= c; r++) blocks.push({ c, r });
blocks.forEach((b, i) => { const d = Math.min(N - 1, Math.floor(i / 2)); b.t = catchT(d) + 0.32 + (i % 2) * 0.1; b.x = SX0 + b.c * CW; b.y = G - (b.r + 1) * BH; });

function block(b, k) {
  const s = k < 1 ? 0.6 + 0.4 * E.easeOut(k) : 1;
  const cx = b.x + CW / 2 - 2, wdt = (CW - 6) * s, hgt = BH * s, x = cx - wdt / 2, y = b.y + BH - hgt;
  w.save(); w.fillStyle = "#BDBDBD"; w.fillRect(x, y, wdt, hgt);
  w.strokeStyle = "#7A7A7A"; w.lineWidth = 2;
  for (let yy = y + hgt / 5; yy < y + hgt - 1; yy += hgt / 5) { w.beginPath(); w.moveTo(x, yy); w.lineTo(x + wdt, yy); w.stroke(); }
  w.fillStyle = "#E2E2E2"; w.beginPath(); w.ellipse(cx, y, wdt / 2, 5, 0, 0, Math.PI * 2); w.fill();
  w.restore();
}
function coin(x, y, glow = 1) {
  w.save(); w.fillStyle = "#EDEDED"; w.shadowColor = "rgba(255,255,255,0.8)"; w.shadowBlur = 14 * glow;
  w.beginPath(); w.ellipse(x, y, 13, 13, 0, 0, Math.PI * 2); w.fill();
  w.strokeStyle = "#9A9A9A"; w.lineWidth = 2; w.beginPath(); w.arc(x, y, 8, 0, Math.PI * 2); w.stroke(); w.restore();
}
function bag(x, y, a = 1, s = 1) {
  w.save(); w.globalAlpha *= a; w.translate(x, y); w.scale(s, s);
  w.fillStyle = C.red; w.shadowColor = "rgba(229,50,45,0.8)"; w.shadowBlur = 14;
  w.beginPath(); w.moveTo(-20, 0); w.lineTo(20, 0); w.lineTo(24, 40); w.lineTo(-24, 40); w.closePath(); w.fill();
  w.shadowBlur = 0; w.strokeStyle = C.red; w.lineWidth = 4; w.beginPath(); w.arc(0, 0, 11, Math.PI, 0); w.stroke();
  w.restore();
}
function poof(x, y, k, seed) {
  const r = E.rng(seed); w.save(); w.fillStyle = C.red;
  for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, d = (20 + r() * 50) * E.easeOut(k); w.globalAlpha = (1 - k) * 0.9;
    w.beginPath(); w.arc(x + Math.cos(a) * d, y + 20 + Math.sin(a) * d - k * 30, 4 * (1 - k) + 1, 0, Math.PI * 2); w.fill(); }
  w.restore();
}

// ---- saver ----
const sv = o => P(Object.assign({ x: SVX, f: 1 }, o));
const svCatch = sv({ aR: 42, aR2: 68 }), svToss = sv({ aR: 100, aR2: 120, torso: 4 });
const groundAt = x => G - BH * clamp((x - (SX0 - 18)) / CW, 0, 6);
const WALK = [8.25, 9.85], TOPX = SX0 + 5 * CW + 26;
function saver(t) {
  if (t < 8.2) {
    let p = svCatch;
    for (let i = 0; i < N; i++) { const c = catchT(i); if (t >= c && t < c + 0.62) p = track(t, [[c, svCatch], [c + 0.22, svToss], [c + 0.45, svCatch]]); }
    return [p, G];
  }
  if (t < WALK[1]) { const k = seg(t, ...WALK), x = lerp(SVX, TOPX, k); return [P(Object.assign({ x, f: 1 }, E.walk((t - WALK[0]) * 1.25, 0.9), { torso: 10 })), groundAt(x)]; }
  return [track(t, [[WALK[1], sv({ x: TOPX })], [10.3, P({ x: TOPX, f: -1, head: 16, torso: 4 })]]), groundAt(TOPX)];
}
// ---- spender ----
const sp = o => P(Object.assign({ x: SPX, f: 1 }, o));
const spCatch = sp({ aR: 42, aR2: 68 }), spShow = sp({ aR: 128, aR2: 156, torso: -4, head: -10 });
function spender(t) {
  for (let i = 0; i < N; i++) { const c = catchT(i); if (t >= c && t < c + 0.62) return track(t, [[c, spCatch], [c + 0.18, spShow], [c + 0.48, spShow], [c + 0.62, spCatch]]); }
  if (t < 9.8) return spCatch;
  return track(t, [[9.8, spCatch], [10.2, sp({ aR: 4, aR2: 8, head: -22, torso: -3 })]]);
}

function draw(ctx, t) {
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, E.W, E.H);
  w.clearRect(0, 0, E.W, E.H);
  E.floor(w, G);
  for (const b of blocks) if (t >= b.t) block(b, seg(t, b.t, b.t + 0.15));
  const dim = lerp(1, 0.5, eseg(t, 10.2, 11.0));
  const SJ = E.drawFig(w, spender(t), G, { color: C.grey, alpha: dim });
  const [vp, vg] = saver(t);
  const VJ = E.drawFig(w, vp, vg, { glow: true });
  for (let i = 0; i < N; i++) {
    const c = catchT(i);
    // falling coins, one per person, same moment
    if (t >= c - 0.38 && t < c) { const k = E.easeIn(seg(t, c - 0.38, c)); coin(SJ.hR[0], lerp(330, SJ.hR[1] - 8, k)); coin(VJ.hR[0], lerp(330, VJ.hR[1] - 8, k)); }
    // spender: coin becomes a bag, bag vanishes
    if (t >= c && t < c + 0.14) coin(SJ.hR[0], SJ.hR[1] - 8);
    if (t >= c + 0.14 && t < c + 0.5) { const k = seg(t, c + 0.14, c + 0.24); bag(SJ.hR[0], SJ.hR[1] - 6, 1, 0.5 + 0.5 * E.easeOut(k) + 0.15 * Math.sin(k * Math.PI)); }
    if (t >= c + 0.5 && t < c + 0.9) poof(SJ.hR[0], SJ.hR[1] - 6, seg(t, c + 0.5, c + 0.9), 40 + i);
    // saver: coin tossed onto the stairs
    const mine = blocks.filter(b => Math.abs(b.t - (c + 0.32)) < 0.15);
    if (t >= c && t < c + 0.22) coin(VJ.hR[0], VJ.hR[1] - 8);
    for (const b of mine) { const t0 = b.t - 0.12; if (t >= c + 0.22 && t < b.t) { const k = seg(t, c + 0.22, b.t); const tx = b.x + CW / 2, ty = b.y; coin(lerp(VJ.hR[0], tx, k), lerp(VJ.hR[1] - 8, ty, k) - Math.sin(k * Math.PI) * 60, 0.6); } }
  }
  E.composite(ctx, G, 0.2);
  E.label(ctx, "SPENDER", 200, 600, dim);
  E.label(ctx, "SAVER", 500, 570);
  if (t > 0.45) {
    const wk = Math.round(lerp(1, 52, seg(t, 0.45, catchT(N - 1))));
    E.dayCounter(ctx, "WEEK " + String(wk).padStart(2, "0"), 540, 1440, 1 - eseg(t, 9.8, 10.3));
  }
  E.typeText(ctx, "SAME SALARY.", 540, 450, t, 10.5);
  E.typeText(ctx, "DIFFERENT FUTURE.", 540, 510, t, 11.5);
  E.finish(ctx, t);
}

const L = -0.45, R = 0.45;
const ev = [];
for (let i = 0; i < N; i++) {
  const c = catchT(i), v = (i % 3) - 1;
  ev.push({ t: c - 0.38, s: "tr_whoosh_fast", g: -30, p: 6 });
  ev.push({ t: c, s: "money_coin_clink", g: -15, p: v, pan: L }, { t: c + 0.01, s: "money_coin_clink", g: -15, p: v + 0.5, pan: R });
  ev.push({ t: c + 0.14, s: "money_bag_rustle", g: -16, p: v, pan: L }, { t: c + 0.5, s: "money_poof", g: -15, p: v * 2, pan: L });
}
for (const b of blocks) ev.push({ t: b.t, s: "money_coin_stack", g: -13, p: b.r * 0.8 + b.c * 0.4 - 2, pan: R });
const steps = []; for (let k = 0; ; k++) { const tt = WALK[0] + (0.25 + 0.5 * k) / 1.25; if (tt > WALK[1]) break; steps.push({ t: tt, s: "morning_footsteps_walk", d: 0.22, g: -13, p: k * 0.7, pan: lerp(0.1, 0.6, k / 6) }); }
const sfx = [
  { t: 0, s: "weather_dry_wind", g: -32, d: DUR, fi: 0.3, fo: 0.8 },
  { t: 0.04, s: "ui_label_tick", g: -14, pan: L }, { t: 0.18, s: "ui_label_tick", g: -14, p: 2, pan: R },
  ...ev, ...steps,
  { t: 7.6, s: "tr_riser_2s", g: -15, fo: 0.02 },
  { duck: [9.6, 9.88] },
  { t: 9.88, s: "tr_sub_drop", g: 0, noduck: 1 }, { t: 9.88, s: "tr_impact_hit", g: -10, noduck: 1 }, { t: 9.88, s: "ui_reveal_chime", g: -12, noduck: 1 },
  ...E.typeSfx("SAME SALARY.", 10.5), ...E.typeSfx("DIFFERENT FUTURE.", 11.5),
];
window.SCENE = { title: "Spender / Saver", duration: DUR, draw, sfx };
})();
