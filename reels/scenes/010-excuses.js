// Split: the same excuses drop in both paths. One stops and they pile into a wall; one walks through them.
const SCENE = {
  duration: 12,
  meta: {
    title: 'Excuses',
    cover: 10.2,
    caption: `The excuses show up for everyone.
Tired. Later. No time. Monday.

They're only a wall if you stop for them.

Which excuse are you walking through this week?`,
    hashtags: ['noexcuses', 'discipline', 'mindset', 'selfimprovement', 'motivation', 'consistency', 'growthmindset', 'habits'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 31, 10);
    captionSeq(ctx, t, [
      [0, 'Same goal. Same excuses.', { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8 }],
      [2.8, ''],
      [8.8, 'Excuses only stop you\nif you stop for them.', { size: 42, glow: 12 }],
    ], W / 2, 400);

    const g1 = 860, g2 = 1350, BW = 150, BH = 58, FX = 905;
    const words = ['TIRED', 'LATER', 'NO TIME', 'MONDAY'];
    const block = (x, y, word, o = {}) => {
      const { color = C.red, glow = 14, alpha = 1 } = o;
      fill(ctx, (c) => c.roundRect(x - BW / 2, y - BH, BW, BH, 6), { color: '#160a0d', alpha });
      neon(ctx, (c) => c.roundRect(x - BW / 2, y - BH, BW, BH, 6), { color, width: 5, glow, alpha, core: 0.3 });
      text(ctx, word, x, y - BH / 2, { size: 24, weight: 700, spacing: 2, color, alpha });
    };
    const dropY = (land, p) => land - (1 - ease.outBack(p)) * 380;

    // ---- Top: stops for them ----
    floorLine(ctx, g1);
    const WX = 470;
    const tDrops = [0.4, 1.68, 3.25, 4.83];
    const walk1 = seg(t, 0.4, 1.4);
    let x1 = lerp(150, 360, walk1) - 85 * ease.inOut(seg(t, 5.4, 6.0));
    let p1 = t < 0.4 ? POSE.stand() : POSE.walk(x1 / 26, 1 - walk1 * 0.8);
    if (t > 1.4) p1 = POSE.stand();
    p1 = blendPose(p1, POSE.walk(x1 / 26, 0.5), Math.sin(Math.PI * seg(t, 5.4, 6.0)));
    p1 = blendPose(p1, POSE.sit(), ease.inOut(seg(t, 6.2, 6.9)));
    const wall = seg(t, 5.0, 5.7);
    const dim1 = 1 - 0.35 * seg(t, 8.4, 9.6);
    const drawT = () => {
      flag(ctx, FX, g1, { color: C.dim, h: 120 });
      tDrops.forEach((d, i) => {
        const p = seg(t, d, d + 0.45);
        if (p > 0) block(WX, dropY(g1 - i * BH, p), words[i], { glow: 10 + wall * 16, alpha: dim1 });
      });
      figure(ctx, x1, g1, p1, { scale: 1.2, color: mix(C.white, C.red, wall * 0.7), glow: wall * 10, alpha: dim1 });
    };
    reflect(ctx, g1, drawT, { alpha: 0.22, depth: 150 });
    drawT();
    bloom(ctx, WX, g1 - 120, 220, C.red, 0.2 * wall);
    label(ctx, 'Stops for them', W / 2, g1 + 70, { size: 26, color: mix(C.soft, C.red, wall) });

    // ---- Bottom: walks through them ----
    floorLine(ctx, g2);
    const xs = [330, 480, 630, 780];
    const x2 = t < 0.4 ? 150 : Math.min(FX - 30, lerp(150, FX - 30, seg(t, 0.4, 8.0)));
    const hitT = xs.map((x) => 0.4 + 7.6 * (x - BW / 2 + 20 - 150) / (FX - 180));
    const win = seg(t, 8.0, 8.4);
    let p2 = t < 0.4 ? POSE.stand() : POSE.walk(x2 / 26, 0.9);
    const punch = hitT.reduce((m, h) => Math.max(m, Math.sin(Math.PI * seg(t, h - 0.15, h + 0.2))), 0);
    p2 = blendPose(p2, POSE.push(0, 0.3), punch * 0.7);
    p2 = blendPose(p2, POSE.stand(), ease.out(win));
    p2 = blendPose(p2, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.4, 8.9)));
    const drawB = () => {
      flag(ctx, FX, g2, { color: mix(C.dim, C.green, win), glow: win * 24, h: 120, wave: Math.sin(t * 5) * win });
      xs.forEach((x, i) => {
        const p = seg(t, Math.max(0.3, hitT[i] - 1.6), Math.max(0.75, hitT[i] - 1.15));
        if (p > 0 && t < hitT[i]) block(x, dropY(g2, p), words[i]);
      });
      figure(ctx, x2, g2, p2, { scale: 1.2, glow: win * 14 + punch * 6, color: mix(C.white, '#E8FFF2', win) });
    };
    reflect(ctx, g2, drawB, { alpha: 0.22, depth: 150 });
    drawB();
    xs.forEach((x, i) => shatter(ctx, x, g2 - BH / 2, seg(t, hitT[i], hitT[i] + 1.1), { color: C.red, n: 18, r: 260, seed: 11 + i }));
    if (t > 0.5) stroke(ctx, (c) => { c.moveTo(150, g2); c.lineTo(x2, g2); }, { color: C.green, width: 4, glow: 14, alpha: 0.35 + 0.5 * seg(t, 4, 8) });
    bloom(ctx, FX, g2 - 120, 260, C.green, 0.3 * win);
    burst(ctx, FX + 30, g2 - 110, seg(t, 8.0, 9.2), C.green, 16, 150);
    label(ctx, 'Walks through them', W / 2, g2 + 70, { size: 26, color: mix(C.soft, C.green, seg(t, 6, 8)), glow: win * 14 });
  },
};
