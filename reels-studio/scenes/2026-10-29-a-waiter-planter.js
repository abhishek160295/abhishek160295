// Reel 2026-10-29 A · WAITER / PLANTER · "NOTHING GROWS / FROM WAITING."
// Same seed for both. One plants and tends it for a year, the other sits beside his and waits.
(() => {
const E = ENGINE, { P, track, eseg, seg, lerp, clamp, C, wctx: w } = E;
const G = 1200, DUR = 14.0;
E.groundY = G;
const SEED_W = [360, G - 7], TRUNK = 790;

// ---- tree geometry (fixed, grows with g) ----
const r = E.rng(2910);
const branches = [];
(function grow(x, y, ang, len, depth, start, width) {
  const dur = depth === 0 ? 0.22 : 0.15;
  const x1 = x + Math.sin(E.rad(ang)) * len, y1 = y - Math.cos(E.rad(ang)) * len;
  branches.push({ x, y, x1, y1, start, dur, width, depth });
  if (depth >= 5) return;
  const kids = depth === 0 ? 2 : (r() < 0.3 ? 3 : 2);
  for (let i = 0; i < kids; i++) {
    const spread = kids === 3 ? [-30, 4, 32][i] : [-26, 26][i];
    grow(x1, y1, ang + spread + (r() - 0.5) * 16, len * (0.70 + r() * 0.08), depth + 1, start + dur, width * 0.66);
  }
})(TRUNK, G, 0, 185, 0, 0, 19);
const tips = branches.filter(b => b.depth === 5);
const fruitIdx = [3, 9, 14, 20, 26, 31].map(i => i % tips.length);
const fruits = fruitIdx.map(i => [tips[i].x1, tips[i].y1 + 14]);
const catchFruit = fruits.reduce((a, b) => (b[0] < a[0] ? b : a));

function drawTree(g) {
  w.save(); w.lineCap = "round"; w.strokeStyle = "#E4E4E4"; w.shadowColor = "rgba(255,255,255,0.3)"; w.shadowBlur = 10;
  for (const b of branches) {
    const k = clamp((g - b.start) / b.dur);
    if (k <= 0) continue;
    w.lineWidth = Math.max(2.5, b.width);
    w.beginPath(); w.moveTo(b.x, b.y); w.lineTo(lerp(b.x, b.x1, k), lerp(b.y, b.y1, k)); w.stroke();
  }
  w.restore();
}
function dot(x, y, rr, col = C.red, glow = 0) {
  w.save(); w.fillStyle = col; if (glow) { w.shadowColor = "rgba(229,50,45,0.8)"; w.shadowBlur = glow; }
  w.beginPath(); w.arc(x, y, rr, 0, Math.PI * 2); w.fill(); w.restore();
}

// ---- poses ----
const pl = o => P(Object.assign({ x: 670, f: 1 }, o));
const holdP = pl({ aR: 42, aR2: 64 });
const crouch = (dig = 0) => pl({ torso: 48, lL: 78, lL2: -18, lR: 62, lR2: -34, aL: 72, aL2: 92, aR: 70 + dig * 38, aR2: 95 + dig * 30 });
const waterP = (tilt = 1) => pl({ aR: 62 + 12 * tilt, aR2: 78 + 12 * tilt, aL: 10, aL2: 18, torso: 6 });
const reachP = pl({ aR: 150, aR2: 168, head: -22, torso: -4 });
const holdFruitP = pl({ aR: 52, aR2: 108, aL: 6, aL2: 12, head: 12 });

const wa = o => P(Object.assign({ x: 210, f: 1 }, o));
const wStand = wa({});
const wHold = wa({ aR: 42, aR2: 64 });
const wToss = wa({ aR: 95, aR2: 110, torso: 4 });
const wSit = wa({ ground: false, y: G - 18, torso: -8, lL: 125, lL2: 30, lR: 118, lR2: 26, aL: 42, aL2: 72, aR: 36, aR2: 66 });
const wWrist = wa({ ground: false, y: G - 18, torso: -4, head: 26, lL: 125, lL2: 30, lR: 118, lR2: 26, aL: 104, aL2: 176, aR: 36, aR2: 66 });
const wLie = wa({ ground: false, y: G - 16, torso: -86, head: 0, lL: 92, lL2: 92, lR: 88, lR2: 88, aL: -150, aL2: -40, aR: -140, aR2: -30 });
const wCrouch = wa({ torso: 40, lL: 70, lL2: -20, lR: 55, lR2: -30, aL: 40, aL2: 50, aR: 30, aR2: 40 });
const wLook = wa({ x: 248, torso: 20, head: 28, aL: 4, aL2: 6, aR: -4, aR2: 0 });

function planter(t) {
  let p = track(t, [[0, holdP], [1.15, holdP], [1.45, crouch(0)], [2.45, crouch(0)], [2.75, P(Object.assign({}, holdP, { aR: 10, aR2: 14 }))],
    [2.85, waterP(0)], [3.0, waterP(1)], [3.6, waterP(1)], [3.8, pl({})], [4.0, crouch(0.3)], [4.6, crouch(0.6)], [4.85, pl({})], [5.0, waterP(1)], [5.7, waterP(1)], [5.9, pl({})],
    [6.05, crouch(0.3)], [6.65, crouch(0.6)], [6.85, pl({})], [7.0, waterP(1)], [7.7, waterP(1)], [7.9, pl({})], [9.55, pl({})], [9.85, reachP], [10.25, reachP], [10.7, holdFruitP]]);
  if (t > 1.45 && t < 2.35) { const d = 0.5 + 0.5 * Math.sin((t - 1.45) * Math.PI * 2 / 0.3); p = Object.assign({}, p, { aR: 70 + d * 38, aR2: 95 + d * 30 }); }
  return p;
}
function waiter(t) {
  return track(t, [[0, wHold], [1.2, wHold], [1.42, wToss], [1.6, wStand], [1.85, wCrouch], [2.35, wSit],
    [3.2, wSit], [3.45, wWrist], [3.9, wWrist], [4.15, wSit], [5.4, wSit], [5.65, wWrist], [6.0, wWrist], [6.2, wSit],
    [6.35, wSit], [6.8, wLie], [8.1, wLie], [8.6, wSit], [9.7, wSit], [10.05, wCrouch], [10.4, wStand], [10.85, wLook]]);
}

function can(J, tilt) {
  const [hx, hy] = J.hR, a = E.rad(tilt * 28);
  w.save(); w.translate(hx, hy); w.rotate(a);
  w.fillStyle = "#9A9A9A"; w.fillRect(-6, -10, 46, 32);
  w.strokeStyle = "#9A9A9A"; w.lineWidth = 6; w.lineCap = "round";
  w.beginPath(); w.moveTo(38, 0); w.lineTo(70, -18); w.stroke();
  w.restore();
  return [hx + Math.cos(a) * 70 + Math.sin(a) * 18, hy + Math.sin(a) * 70 - Math.cos(a) * 18];
}
function watering(t) { return [[2.95, 3.6], [5.0, 5.7], [7.0, 7.7]].some(([a, b]) => t >= a && t <= b); }
function wateringPose(t) { return [[2.8, 3.8], [4.85, 5.9], [6.85, 7.9]].some(([a, b]) => t >= a && t <= b); }

function draw(ctx, t) {
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, E.W, E.H);
  w.clearRect(0, 0, E.W, E.H);
  E.floor(w, G);

  // mound + tree
  const mk = eseg(t, 2.25, 2.55);
  if (mk > 0) { w.fillStyle = "#2B2B2B"; w.beginPath(); w.ellipse(TRUNK, G, 46 * mk, 13 * mk, 0, Math.PI, 0); w.fill(); }
  const g = lerp(0, 1, E.easeOut(seg(t, 3.5, 9.0)) * 0.12 + E.ease(seg(t, 3.9, 9.0)) * 0.88);
  if (t > 3.5) drawTree(g);
  fruits.forEach((f, i) => {
    const t0 = 9.0 + i * 0.12; if (t < t0) return;
    if (f === catchFruit && t > 9.95) return;
    const k = seg(t, t0, t0 + 0.18), s = k < 1 ? 1.35 * E.easeOut(k) : 1 + 0.35 * Math.max(0, 1 - (t - t0 - 0.18) * 6);
    dot(f[0], f[1], 13 * s, C.red, 14);
  });

  // waiter (grey)
  const dim = lerp(1, 0.5, eseg(t, 11.0, 11.8));
  const wp = waiter(t);
  const WJ = E.drawFig(w, wp, G, { color: C.grey, alpha: dim });
  // waiter seed
  if (t < 0.45) { const k = E.easeIn(seg(t, 0, 0.45)); dot(WJ.hR[0], lerp(380, WJ.hR[1] - 4, k), 9, C.red, 10); }
  else if (t < 1.42) dot(WJ.hR[0], WJ.hR[1] - 4, 9);
  else { const k = seg(t, 1.42, 1.75); const x = lerp(WJ.hR[0] || 300, SEED_W[0], k);
    const hx = t < 1.75 ? lerp(300, SEED_W[0], k) : SEED_W[0];
    const hy = t < 1.75 ? lerp(G - 170, SEED_W[1], k) - Math.sin(k * Math.PI) * 70 : SEED_W[1];
    dot(hx, hy, 9, C.red, t > 10.8 ? 10 * eseg(t, 10.8, 11.2) : 0); }

  // planter (hero)
  const pp = planter(t);
  const PJ = E.drawFig(w, pp, G, { glow: true });
  if (t < 0.45) { const k = E.easeIn(seg(t, 0, 0.45)); dot(PJ.hR[0], lerp(380, PJ.hR[1] - 4, k), 9, C.red, 10); }
  else if (t < 2.2) dot(PJ.hR[0], PJ.hR[1] - 4, 9);
  else if (t < 2.4) { const k = seg(t, 2.2, 2.4); dot(lerp(PJ.hR[0], TRUNK, k), lerp(PJ.hR[1], G - 4, k), 9); }
  if (wateringPose(t)) {
    const tilt = watering(t) ? 1 : 0.2;
    const sp = can(PJ, tilt);
    if (watering(t)) {
      w.save(); w.fillStyle = "rgba(200,220,255,0.75)";
      for (let i = 0; i < 9; i++) { const ph = ((t * 2.4 + i / 9) % 1); w.beginPath(); w.arc(sp[0] + 4 + ph * 22 + (i % 3) * 3, sp[1] + ph * (G - sp[1] - 6), 3, 0, Math.PI * 2); w.fill(); }
      w.restore();
    }
  }
  // dig dirt
  if (t > 1.5 && t < 2.6) {
    const rr = E.rng(7); w.fillStyle = "#6A6A6A";
    for (let i = 0; i < 26; i++) { const t0 = 1.5 + rr() * 0.8, life = 0.45; const k = (t - t0) / life; if (k < 0 || k > 1) continue;
      const vx = (rr() - 0.5) * 220, vy = -180 - rr() * 160; const x = TRUNK + vx * k * life, y = G - 4 + vy * k * life + 900 * (k * life) ** 2;
      if (y < G) { w.beginPath(); w.arc(x, y, 3.5, 0, Math.PI * 2); w.fill(); } else rr(); }
  }
  // falling fruit into hand
  if (t > 9.95 && t < 10.25) { const k = E.easeIn(seg(t, 9.95, 10.22)); dot(lerp(catchFruit[0], PJ.hR[0], k), lerp(catchFruit[1], PJ.hR[1] - 10, k), 13, C.red, 14); }
  if (t >= 10.25) dot(PJ.hR[0], PJ.hR[1] - 10, 13, C.red, 14);

  E.composite(ctx, G, 0.2);

  E.label(ctx, "WAITER", 300, 620, dim);
  E.label(ctx, "PLANTER", 720, 580);
  if (t > 2.6) {
    const day = Math.round(lerp(1, 365, E.ease(seg(t, 2.6, 9.4))));
    E.dayCounter(ctx, "DAY " + String(day).padStart(3, "0"), 540, 1420, 1 - eseg(t, 10.4, 10.9));
  }
  E.typeText(ctx, "NOTHING GROWS", 540, 450, t, 11.25);
  E.typeText(ctx, "FROM WAITING.", 540, 510, t, 12.2);
  E.finish(ctx, t);
}

const L = -0.45, R = 0.45;
const sfx = [
  { t: 0, s: "weather_dry_wind", g: -31, d: DUR, fi: 0.5, fo: 0.8 },
  { t: 0.05, s: "ui_label_tick", g: -14, pan: L }, { t: 0.2, s: "ui_label_tick", g: -14, p: 2, pan: R },
  { t: 0.45, s: "ui_text_pop", g: -12, pan: L }, { t: 0.46, s: "ui_text_pop", g: -12, p: 3, pan: R },
  { t: 0.0, s: "tr_whoosh_fast", g: -24, p: -4 },
  { t: 1.36, s: "tr_whoosh_fast", g: -22, pan: L }, { t: 1.75, s: "climb_grip", g: -18, p: 5, pan: L },
  { t: 1.2, s: "climb_grip", g: -21, p: -3, pan: R },
  { t: 1.55, s: "build_scrape_adjust", g: -15, d: 0.3, pan: R }, { t: 1.85, s: "build_scrape_adjust", g: -15, d: 0.3, p: 1.5, pan: R },
  { t: 2.15, s: "build_scrape_adjust", g: -15, d: 0.3, p: -1, pan: R },
  { t: 4.1, s: "build_scrape_adjust", g: -19, d: 0.3, p: 2, pan: R }, { t: 4.45, s: "build_scrape_adjust", g: -19, d: 0.3, pan: R },
  { t: 6.15, s: "build_scrape_adjust", g: -19, d: 0.3, p: -2, pan: R }, { t: 6.5, s: "build_scrape_adjust", g: -19, d: 0.3, p: 1, pan: R }, { t: 1.6, s: "climb_pebbles_fall", g: -24, d: 0.9, pan: R },
  { t: 2.35, s: "morning_snooze_tap", g: -16, p: -9, pan: L },
  { t: 2.36, s: "build_brick_place", g: -18, p: 6, pan: R },
  { t: 2.95, s: "climb_stream_pour", g: -17, d: 0.65, fi: 0.08, fo: 0.2, pan: R },
  { t: 5.0, s: "climb_stream_pour", g: -17, d: 0.7, fi: 0.08, fo: 0.2, p: 1, pan: R },
  { t: 7.0, s: "climb_stream_pour", g: -17, d: 0.7, fi: 0.08, fo: 0.2, p: -1, pan: R },
  { t: 3.55, s: "ui_text_pop", g: -18, p: -5, pan: R },
  { t: 2.6, s: "morning_tick_timer", g: -27, d: 6.8, fo: 0.3 },
  { t: 3.45, s: "ui_label_tick", g: -18, p: -7, pan: L }, { t: 5.65, s: "ui_label_tick", g: -18, p: -7, pan: L },
  { t: 6.35, s: "tr_whoosh_soft", g: -25, pan: L }, { t: 8.1, s: "tr_whoosh_soft", g: -27, pan: L },
  { t: 6.8, s: "tr_riser_2s", g: -17, fo: 0.05 },
  { t: 9.0, s: "ui_reveal_chime", g: -15, pan: R },
  ...fruits.map((f, i) => ({ t: 9.0 + i * 0.12, s: "ui_text_pop", g: -13, p: i * 2 - 2, pan: R })),
  { t: 10.22, s: "climb_grip", g: -15, p: 3, pan: R },
  { t: 9.75, s: "tr_whoosh_soft", g: -26, pan: L },
  { duck: [10.55, 10.85] },
  { t: 10.85, s: "tr_sub_drop", g: 0, noduck: 1 }, { t: 10.85, s: "tr_impact_hit", g: -9, noduck: 1 },
  ...E.typeSfx("NOTHING GROWS", 11.25), ...E.typeSfx("FROM WAITING.", 12.2),
];

window.SCENE = { title: "Waiter / Planter", duration: DUR, draw, sfx };
})();
