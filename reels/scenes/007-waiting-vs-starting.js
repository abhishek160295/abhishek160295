// Split with a twist: the one waiting to feel ready never charges; the one who starts at 5% charges by moving.
const SCENE = {
  duration: 12.5,
  bg: 'charcoal',
  meta: {
    title: 'Waiting vs Starting',
    cover: 10.5,
    caption: `You're not waiting for motivation.
You're waiting for something that only shows up after you start.

Start at 5%. The energy comes from moving.

Who needs to see this today?`,
    hashtags: ['motivation', 'discipline', 'justStart', 'mindset', 'selfimprovement', 'productivity', 'consistency', 'growthmindset'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 8, 10);

    captionSeq(ctx, t, [
      [0, 'Both start with 5% energy.', { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8 }],
      [3.0, ''],
      [9.0, 'Motivation doesn’t come first.\nIt comes from starting.', { size: 42, color: C.white, glow: 12 }],
    ], W / 2, 400);

    // ---- Row 1: waits to feel ready ----
    const g1 = 860, X1 = 330;
    const drain = 0.05 - 0.03 * seg(t, 4, 9);
    const blink = t > 6 ? 0.55 + 0.45 * Math.abs(Math.cos(t * 4)) : 1;
    const slump = ease.inOut(seg(t, 4.5, 6.5));
    const dim1 = 1 - 0.4 * seg(t, 8, 9.5);
    const sitPose = { ...POSE.sit(), lean: 0.5 + 0.35 * slump };
    const drawRow1 = () => figure(ctx, X1, g1, sitPose, { scale: 1.25, color: mix(C.white, C.red, slump * 0.7), alpha: dim1 });
    fadeLine(ctx, 90, W - 90, g1, { alpha: 0.35, width: 3 });
    reflect(ctx, g1, drawRow1, { alpha: 0.22, depth: 160 });
    drawRow1();
    battery(ctx, X1, g1 - 260, drain, { alpha: blink * dim1, color: C.red });
    // Little clock showing time passing while nothing happens
    const ck = [X1 + 210, g1 - 150];
    circle(ctx, ck[0], ck[1], 38, { color: C.dim, width: 4, alpha: dim1 });
    const ha = t * 2.2, ma = t * 9;
    line(ctx, ck[0], ck[1], ck[0] + Math.sin(ha) * 20, ck[1] - Math.cos(ha) * 20, { color: C.soft, width: 4, alpha: dim1 });
    line(ctx, ck[0], ck[1], ck[0] + Math.sin(ma) * 30, ck[1] - Math.cos(ma) * 30, { color: C.soft, width: 3, alpha: dim1 });
    label(ctx, 'Waits to feel ready', W / 2, g1 + 70, { size: 26, color: mix(C.soft, C.red, seg(t, 5, 6.5)) });

    // ---- Row 2: starts anyway ----
    const g2 = 1350;
    const go = seg(t, 0.8, 8.0);
    const charge = lerp(0.05, 1, ease.in(seg(t, 1.0, 7.8)));
    const x2 = 200 + 650 * ease.in(go);
    const speed = clamp((charge - 0.05) / 0.7);
    let pose = t < 0.8 ? POSE.stand() : blendPose(POSE.walk(x2 / 24, 0.55 + 0.45 * speed), POSE.run(x2 / 30, 1), seg(charge, 0.6, 0.85));
    const arrived = seg(t, 8.0, 8.4);
    pose = blendPose(pose, POSE.stand(), ease.out(arrived));
    pose = blendPose(pose, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.4, 8.9)));
    const glow2 = charge > 0.6 ? (charge - 0.6) * 40 : 0;
    const drawRow2 = () => figure(ctx, x2, g2, pose, { scale: 1.25, glow: glow2 + arrived * 12, color: mix(C.white, '#E8FFF2', arrived) });
    fadeLine(ctx, 90, W - 90, g2, { alpha: 0.35, width: 3 });
    flag(ctx, 920, g2, { color: mix(C.dim, C.green, arrived), glow: arrived * 24, wave: Math.sin(t * 5) * arrived, h: 120 });
    reflect(ctx, g2, () => { drawRow2(); flag(ctx, 920, g2, { color: mix(C.dim, C.green, arrived), h: 120 }); }, { alpha: 0.22, depth: 160 });
    drawRow2();
    // Energy trail behind the mover
    if (t > 1) stroke(ctx, (c) => { c.moveTo(200, g2); c.lineTo(x2, g2); }, { color: mix(C.gold, C.green, speed), width: 4, glow: 14, alpha: 0.8 });
    battery(ctx, x2, g2 - 290 - 60 * arrived, charge, { glow: 14 + charge * 16 });
    bloom(ctx, 900, g2 - 120, 260, C.green, 0.3 * arrived);
    burst(ctx, x2, g2 - 340, seg(t, 7.7, 8.8), C.green, 16, 140);
    label(ctx, 'Starts anyway', W / 2, g2 + 70, { size: 26, color: mix(C.soft, C.green, seg(t, 6, 7.5)), glow: arrived * 14 });
  },
};
