// Reel 2026-10-29 B · HESITATOR / TAKER · "IT OPENED FOR BOTH. / ONLY ONE WALKED IN."
// A lit doorway appears between them. One walks straight in. The other thinks until it snaps shut.
(() => {
const E = ENGINE, { P, track, eseg, seg, lerp, clamp, C, wctx: w } = E;
const G = 1200, DUR = 13.6, DX = 540, DW = 150, DH = 330;
E.groundY = G;
const OPEN = [0.2, 0.85], CLOSE = [7.5, 8.0], BAR = [1.0, 7.5];

function doorWidth(t) {
  if (t < OPEN[0]) return 0;
  if (t < OPEN[1]) return DW * E.easeOut(seg(t, ...OPEN));
  if (t < CLOSE[0]) return DW;
  return DW * (1 - E.easeIn(seg(t, ...CLOSE)));
}
function drawDoor(t) {
  const ww = doorWidth(t), flash = t > CLOSE[1] ? Math.max(0, 1 - (t - CLOSE[1]) / 0.35) : 0;
  if (ww <= 0.5 && !flash) return;
  const x0 = DX - ww / 2, y0 = G - DH;
  const pulse = 1 + 0.06 * Math.sin(t * 5) + (t > 3.3 && t < 3.8 ? 0.5 * Math.sin(seg(t, 3.3, 3.8) * Math.PI) : 0);
  w.save();
  const halo = w.createRadialGradient(DX, G - DH / 2, 10, DX, G - DH / 2, 330);
  halo.addColorStop(0, `rgba(255,255,255,${0.20 * pulse * (ww / DW)})`); halo.addColorStop(1, "rgba(255,255,255,0)");
  w.fillStyle = halo; w.fillRect(0, G - 700, E.W, 700);
  w.shadowColor = "rgba(255,255,255,0.9)"; w.shadowBlur = 60 * pulse;
  w.fillStyle = "#FFFFFF"; w.fillRect(x0, y0, ww, DH);
  w.shadowBlur = 0;
  if (ww > 6) { w.strokeStyle = C.red; w.lineWidth = 5; w.strokeRect(x0 - 6, y0 - 6, ww + 12, DH + 6); }
  // countdown bar
  if (t > BAR[0] && t < CLOSE[0]) {
    const k = 1 - seg(t, ...BAR);
    w.fillStyle = "rgba(229,50,45,0.25)"; w.fillRect(DX - DW / 2 - 6, y0 - 34, DW + 12, 8);
    w.fillStyle = C.red; w.shadowColor = "rgba(229,50,45,0.9)"; w.shadowBlur = 12;
    w.fillRect(DX - DW / 2 - 6, y0 - 34, (DW + 12) * k, 8);
  }
  if (flash) { w.shadowBlur = 0; w.fillStyle = `rgba(255,255,255,${flash})`; w.fillRect(DX - 2, y0, 4, DH); }
  w.restore();
}

// ---- taker ----
function taker(t) {
  const x = lerp(930, 565, seg(t, 0.9, 3.3));
  if (t < 0.9) return P({ x: 930, f: -1 });
  if (t < 3.3) return P(Object.assign({ x, f: -1 }, E.walk((t - 0.9) * 1.0)));
  return P({ x: 565 - (t - 3.3) * 60, f: -1, torso: 4 });
}
// ---- hesitator ----
const hs = o => P(Object.assign({ f: 1 }, o));
const think = x => hs({ x, aR: 150, aR2: 250, head: 12, torso: -3, aL: 10, aL2: 30 });
const kneel = x => P({ x, f: -1, torso: 22, head: 34, lL: 4, lL2: -92, lR: -2, lR2: -90, aL: 8, aL2: 4, aR: -6, aR2: -2 });
function hes(t) {
  if (t < 1.2) return hs({ x: 150 });
  if (t < 2.2) return hs(Object.assign({ x: lerp(150, 280, seg(t, 1.2, 2.2)) }, E.walk((t - 1.2) * 0.9, 0.8)));
  if (t < 3.4) return track(t, [[2.2, hs({ x: 280 })], [2.6, hs({ x: 280, torso: 8, head: -6 })], [3.4, hs({ x: 280, torso: 2 })]]);
  if (t < 4.2) return hs(Object.assign({ x: lerp(280, 220, seg(t, 3.4, 4.2)) }, E.walk(-(t - 3.4) * 1.1, 0.6)));
  if (t < 6.6) return track(t, [[4.2, hs({ x: 220 })], [4.5, think(220)], [5.6, think(220)], [5.9, hs({ x: 220, torso: 10 })], [6.2, hs({ x: 220, torso: -6 })], [6.45, hs({ x: 220, torso: 12 })], [6.6, hs({ x: 220, torso: 14 })]]);
  if (t < 8.0) { const k = seg(t, 6.6, 8.0); return hs(Object.assign({ x: lerp(220, 520, k) }, E.run((t - 6.6) * 1.6, clamp((t - 6.6) * 4)))); }
  if (t < 8.5) { const k = E.easeOut(seg(t, 8.0, 8.5)); return E.mixPose(hs(Object.assign({ x: lerp(520, 610, k) }, E.run((t - 6.6) * 1.6, 1 - k))), hs({ x: 610 }), k); }
  if (t < 8.6) return hs({ x: 610 });
  return track(t, [[8.6, P({ x: 610, f: -1, head: -8 })], [9.0, P({ x: 610, f: -1, torso: 6, head: 14 })], [9.6, kneel(610)]]);
}

function draw(ctx, t) {
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, E.W, E.H);
  w.clearRect(0, 0, E.W, E.H);
  E.floor(w, G);
  drawDoor(t);
  const dim = lerp(1, 0.5, eseg(t, 10.0, 10.8));
  E.drawFig(w, hes(t), G, { color: C.grey, alpha: dim });
  const ta = 1 - eseg(t, 3.3, 3.7);
  if (ta > 0) {
    const flash = Math.sin(seg(t, 3.3, 3.7) * Math.PI);
    E.drawFig(w, taker(t), G, { glow: true, alpha: ta, color: flash > 0 ? `rgb(255,255,255)` : C.hero });
  }
  E.composite(ctx, G, 0.22);
  E.label(ctx, "HESITATOR", 230, 640, dim);
  E.label(ctx, "TAKER", 850, 600, 1 - eseg(t, 3.4, 4.0) * 0.6);
  E.typeText(ctx, "IT OPENED FOR BOTH.", 540, 450, t, 10.2);
  E.typeText(ctx, "ONLY ONE WALKED IN.", 540, 510, t, 11.35);
  E.finish(ctx, t);
}

const L = -0.5, R = 0.5;
const steps = (t0, t1, freq, opts) => { const ev = []; for (let k = 0; ; k++) { const tt = t0 + (0.25 + 0.5 * k) / freq; if (tt > t1) break; ev.push(Object.assign({ t: tt, s: "morning_footsteps_walk", d: 0.22, p: (k % 3) - 1, g: -14 + (k % 2) * -1.5 }, opts)); } return ev; };
const sfx = [
  { t: 0, s: "weather_dry_wind", g: -32, d: DUR, fi: 0.4, fo: 0.8 },
  { t: 0.04, s: "ui_label_tick", g: -14, pan: L }, { t: 0.18, s: "ui_label_tick", g: -14, p: 2, pan: R },
  { t: 0.12, s: "tr_whoosh_soft", g: -15 }, { t: 0.55, s: "ui_reveal_chime", g: -13 },
  { t: 0.5, s: "weather_heat_drone", g: -27, d: 7.5, fi: 0.4, fo: 0.02 },
  ...steps(0.9, 3.3, 1.0, { pan: R }),
  { t: 3.28, s: "tr_whoosh_soft", g: -17, p: 4, pan: 0.1 }, { t: 3.6, s: "ui_text_pop", g: -15, p: 7 },
  ...steps(1.2, 2.2, 0.9, { pan: L, g: -18, p: -2 }),
  { t: 2.4, s: "beat_heartbeat", g: -10, d: 4.2, fo: 0.2 },
  ...steps(3.4, 4.2, 1.1, { pan: L, g: -19, p: -3 }),
  { t: 4.3, s: "beat_tension_tick", g: -20, d: 3.2, fo: 0.1 },
  ...(() => { const ev = []; for (let k = 0; ; k++) { const tt = 6.6 + (0.25 + 0.5 * k) / 1.6; if (tt > 8.3) break; ev.push({ t: tt, s: "morning_footsteps_rush", d: 0.2, g: -13, p: (k % 3) - 1, pan: lerp(L, 0.2, k / 6) }); } return ev; })(),
  { t: 7.3, s: "tr_riser_2s", o: 1.5, g: -12, fo: 0.02 },
  { duck: [7.86, 8.0] },
  { t: 8.0, s: "tr_impact_hit", g: -6, noduck: 1 }, { t: 8.0, s: "tr_sub_drop", g: 0, noduck: 1 },
  { t: 8.6, s: "tr_whoosh_soft", g: -26, pan: 0.2 },
  { t: 9.45, s: "morning_snooze_tap", g: -14, p: -10, pan: 0.2 }, { t: 9.58, s: "morning_snooze_tap", g: -15, p: -11, pan: 0.2 },
  ...E.typeSfx("IT OPENED FOR BOTH.", 10.2), ...E.typeSfx("ONLY ONE WALKED IN.", 11.35),
];
window.SCENE = { title: "Hesitator / Taker", duration: DUR, draw, sfx };
})();
