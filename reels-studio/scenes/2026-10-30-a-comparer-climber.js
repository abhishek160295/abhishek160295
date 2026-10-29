// Reel 2026-10-30 A · COMPARER / CLIMBER · "STOP WATCHING THEIR LADDER. / CLIMB YOURS."
// Two identical ladders, a red flag on each. One climbs steadily. The other keeps looking across and slipping.
(() => {
const E = ENGINE, { P, track, eseg, seg, lerp, clamp, C, wctx: w } = E;
const G = 1340, DUR = 13.8, LH = 470, TOP = G - LH, RUNG = 58;
E.groundY = G;
const LX = 300, RX = 780;

function ladder(x) {
  w.save(); w.strokeStyle = "#4A4A4A"; w.lineWidth = 9; w.lineCap = "round";
  w.beginPath(); w.moveTo(x - 44, G); w.lineTo(x - 44, TOP); w.moveTo(x + 44, G); w.lineTo(x + 44, TOP); w.stroke();
  w.lineWidth = 6;
  for (let y = G - 40; y > TOP + 10; y -= RUNG) { w.beginPath(); w.moveTo(x - 44, y); w.lineTo(x + 44, y); w.stroke(); }
  w.fillStyle = "#3A3A3A"; w.fillRect(x - 78, TOP - 12, 156, 14);
  w.restore();
}
function flag(px, py, wave, glow = 0) {
  w.save(); w.strokeStyle = "#9A9A9A"; w.lineWidth = 5; w.lineCap = "round";
  w.beginPath(); w.moveTo(px, py); w.lineTo(px, py - 112); w.stroke();
  w.fillStyle = C.red; if (glow) { w.shadowColor = "rgba(229,50,45,0.9)"; w.shadowBlur = glow; }
  w.beginPath(); w.moveTo(px, py - 112);
  w.quadraticCurveTo(px + 28, py - 112 + wave * 6, px + 52, py - 98 + wave * 3);
  w.quadraticCurveTo(px + 28, py - 86 - wave * 4, px, py - 80); w.closePath(); w.fill();
  w.restore();
}

// front-view climbing pose; phase advances half a cycle per rung
function climbP(x, h, phase, o = {}) {
  const s = Math.sin(phase * Math.PI * 2);
  return P(Object.assign({ x, front: true, ground: false, y: G - 120 - h,
    aL: 160 + 12 * s, aL2: 172 + 6 * s, aR: 160 - 12 * s, aR2: 172 - 6 * s,
    lL: 26 + 28 * Math.max(0, s), lL2: 6, lR: 26 + 28 * Math.max(0, -s), lR2: 6 }, o));
}
const rungStep = c => Math.floor(c) + E.ease(c - Math.floor(c));

// ---- climber ----
const C0 = 0.2, PULL = [7.8, 8.4];
const RATE = ((G - 120) - (TOP - 30)) / RUNG / (PULL[0] - C0);
const hClimb = t => RUNG * rungStep(Math.max(0, t - C0) * RATE);
function climber(t) {
  if (t < PULL[0]) { const c = Math.max(0, t - C0) * RATE; return climbP(RX, hClimb(t), c * 0.5); }
  const standY = TOP - 12 - 116;
  if (t < PULL[1]) {
    const k = eseg(t, ...PULL), h0 = hClimb(PULL[0]);
    return P({ x: RX, front: true, ground: false, y: lerp(G - 120 - h0, standY, k), aL: lerp(165, 20, k), aL2: lerp(172, 14, k),
      aR: lerp(160, 20, k), aR2: lerp(172, 14, k), lL: lerp(50, 6, k), lL2: lerp(6, 4, k), lR: lerp(26, 6, k), lR2: lerp(6, 4, k) });
  }
  const st = { x: RX, front: true, ground: false, y: standY, lL: 6, lL2: 4, lR: 6, lR2: 4, aL: 20, aL2: 14 };
  return track(t, [[8.4, P(Object.assign({}, st, { aR: 20, aR2: 14 }))], [8.65, P(Object.assign({}, st, { aR: 60, aR2: 40 }))],
    [8.95, P(Object.assign({}, st, { aR: 168, aR2: 176, aL: 30, aL2: 24 }))]]);
}

// ---- comparer: [t0, t1, type, h0, h1] ----
const PLAN = [[0.2, 2.0, "climb", 0, 104], [2.0, 2.4, "look", 104, 104], [2.4, 2.7, "slip", 104, 46], [2.7, 3.0, "hold", 46, 46],
  [3.0, 4.4, "climb", 46, 127], [4.4, 5.0, "look", 127, 127], [5.0, 5.35, "slip", 127, 10], [5.35, 5.6, "hold", 10, 10],
  [5.6, 7.0, "climb", 10, 91], [7.0, 8.0, "look", 91, 91], [8.0, 8.35, "fall", 91, -1]];
function comparer(t) {
  if (t < 0.2) return climbP(LX, 0, 0);
  for (const [a, b, type, h0, h1] of PLAN) {
    if (t > b) continue;
    const k = seg(t, a, b);
    if (type === "climb") { const c = (t - a) * ((h1 - h0) / RUNG) / (b - a); return climbP(LX, h0 + RUNG * rungStep(c), c * 0.5); }
    if (type === "look") { const L = eseg(t, a, Math.min(b, a + 0.3)); return climbP(LX, h0, 0, { torso: 12 * L, head: 18 * L, aR: lerp(160, 118, L), aR2: lerp(172, 150, L) }); }
    if (type === "slip") return climbP(LX, lerp(h0, h1, E.easeIn(k)), 0.25, { aL: 175, aL2: 178, aR: 120 + 40 * Math.sin(k * 20), aR2: 150, lL: 40, lR: 16, torso: -4 });
    if (type === "hold") return climbP(LX, h0, 0, {});
    if (type === "fall") {
      const y = lerp(G - 120 - h0, G - 36, E.easeIn(k));
      return P({ x: LX, front: true, ground: false, y, aL: 150, aL2: 170, aR: 140, aR2: 165, lL: 40, lL2: 20, lR: 30, lR2: 10 });
    }
  }
  const sit = { x: LX, front: true, ground: false, y: G - 36, lL: 75, lL2: 70, lR: 75, lR2: 70, aL: 25, aL2: 20, aR: 25, aR2: 20 };
  return track(t, [[8.35, P(Object.assign({}, sit, { aL: 60, aR: 60 }))], [8.6, P(sit)], [9.3, P(sit)], [9.8, P(Object.assign({}, sit, { torso: 8, head: 14 }))]]);
}

function draw(ctx, t) {
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, E.W, E.H);
  w.clearRect(0, 0, E.W, E.H);
  E.floor(w, G);
  ladder(LX); ladder(RX);
  const wave = Math.sin(t * 7);
  flag(LX + 45, TOP - 12, wave);
  const dim = lerp(1, 0.5, eseg(t, 9.6, 10.4));
  E.drawFig(w, comparer(t), G, { color: C.grey, alpha: dim });
  const cp = climber(t);
  const J = E.drawFig(w, cp, G, { glow: true });
  if (t < 8.75) flag(RX + 45, TOP - 12, wave);
  else { const k = eseg(t, 8.75, 8.95); flag(lerp(RX + 45, J.hR[0], k), lerp(TOP - 12, J.hR[1] + 40, k), Math.sin(t * 11) * 1.6, 16 * k); }
  E.composite(ctx, G, 0.2);
  E.label(ctx, "COMPARER", LX, 420, dim);
  E.label(ctx, "CLIMBER", RX, 390);
  E.typeText(ctx, "STOP WATCHING THEIR LADDER.", 540, 300, t, 9.7, 32);
  E.typeText(ctx, "CLIMB YOURS.", 540, 356, t, 11.7, 32);
  E.finish(ctx, t);
}

const L = -0.45, R = 0.45;
const grips = [];
for (let i = 1; C0 + i / RATE < PULL[0]; i++) grips.push({ t: C0 + (i - 0.5) / RATE, s: "climb_grip", g: -14 + (i % 2) * -1.5, p: (i % 3) - 1, pan: R });
for (const [a, b, type, h0, h1] of PLAN) if (type === "climb") { const n = Math.round((h1 - h0) / RUNG * 2) / 2, dt = (b - a) / Math.max(1, (h1 - h0) / RUNG); for (let i = 0; a + (i + 0.5) * dt < b; i++) grips.push({ t: a + (i + 0.5) * dt, s: "climb_grip", g: -17, p: -2 + (i % 2), pan: L }); }
const sfx = [
  { t: 0, s: "weather_dry_wind", g: -31, d: DUR, fi: 0.4, fo: 0.8 },
  { t: 0.04, s: "ui_label_tick", g: -14, pan: L }, { t: 0.18, s: "ui_label_tick", g: -14, p: 2, pan: R },
  { t: 0.05, s: "climb_flag_flutter", g: -30, d: 2.0, fi: 0.3, fo: 0.8 },
  ...grips,
  { t: 2.0, s: "beat_heartbeat", d: 0.45, g: -14, pan: L }, { t: 4.4, s: "beat_heartbeat", d: 0.8, g: -13, pan: L }, { t: 7.0, s: "beat_heartbeat", d: 1.0, g: -12, pan: L },
  { t: 2.36, s: "tr_whoosh_fast", g: -16, p: -3, pan: L }, { t: 2.42, s: "climb_pebbles_fall", g: -20, d: 1.0, pan: L },
  { t: 4.96, s: "tr_whoosh_fast", g: -15, p: -5, pan: L }, { t: 5.02, s: "climb_pebbles_fall", g: -19, d: 1.2, pan: L },
  { t: 7.98, s: "crowd_fall_whistle", g: -20, d: 0.4, fo: 0.05, pan: L }, { t: 8.35, s: "morning_door_close", g: -11, p: -6, pan: L },
  { t: 7.8, s: "climb_grip", g: -14, p: 2, pan: R }, { t: 7.95, s: "tr_whoosh_soft", g: -22, pan: R }, { t: 8.42, s: "morning_snooze_tap", g: -16, p: -6, pan: R },
  { t: 6.45, s: "tr_riser_2s", g: -15, fo: 0.02 },
  { duck: [8.66, 8.95] },
  { t: 8.95, s: "tr_sub_drop", g: 0, noduck: 1 }, { t: 8.95, s: "tr_impact_hit", g: -10, noduck: 1 }, { t: 8.95, s: "ui_reveal_chime", g: -12, noduck: 1 },
  { t: 8.95, s: "climb_flag_flutter", g: -20, d: 4.5, fi: 0.1, fo: 1.2, pan: R },
  ...E.typeSfx("STOP WATCHING THEIR LADDER.", 9.7), ...E.typeSfx("CLIMB YOURS.", 11.7),
];
window.SCENE = { title: "Comparer / Climber", duration: DUR, draw, sfx };
})();
