// Split comparison: jumping at a goal fails, building steps toward it works.
const SCENE = {
  duration: 11.5,
  meta: {
    title: 'Goals vs Systems',
    cover: 9.6,
    caption: `A goal is the ledge.
A system is the stairs.

Winners and losers often have the same goals.
What's different is what they do every day.

Stop jumping. Start building.

What's one step you're adding this week?`,
    hashtags: ['systems', 'goals', 'atomichabits', 'discipline', 'mindset', 'productivity', 'selfimprovement', 'habits'],
  },
  draw(ctx, t) {
    const LX = 700, LH = 200, FX = 560;

    // Row 1: goals
    const g1 = 820;
    const fail = seg(t, 5.0, 5.8);
    label(ctx, 'Goals', W / 2, 470, { color: mix(C.white, C.red, fail) });
    line(ctx, 110, g1, 970, g1, { color: C.faint, width: 4 });
    box(ctx, LX, g1 - LH, 260, LH, { color: C.dim });
    flag(ctx, 880, g1 - LH, { color: C.dim, h: 100 });

    const jumps = [[1.2, 85], [2.6, 68], [4.0, 50]];
    let pose = POSE.stand(), lift = 0;
    for (const [s, h] of jumps) {
      const crouch = seg(t, s - 0.35, s), air = seg(t, s, s + 0.7), land = seg(t, s + 0.7, s + 0.95);
      if (t >= s - 0.35 && t < s + 0.95) {
        pose = blendPose(POSE.stand(), POSE.crouch(), Math.sin(Math.PI * crouch));
        if (air > 0 && air < 1) { pose = POSE.reach(); lift = Math.sin(Math.PI * air) * h; }
        if (land > 0) pose = blendPose(POSE.crouch(), POSE.stand(), land);
      }
    }
    pose = blendPose(pose, POSE.tired(), ease.inOut(seg(t, 5.0, 5.6)));
    pose = blendPose(pose, POSE.sit(), ease.inOut(seg(t, 6.0, 6.7)));
    figure(ctx, FX, g1, pose, { scale: 1.2, lift, color: mix(C.white, C.red, fail), glow: fail * 16, alpha: 1 - 0.45 * seg(t, 7, 8.5) });

    // Row 2: systems
    const g2 = 1260;
    const win = seg(t, 8.2, 8.7);
    label(ctx, 'Systems', W / 2, 930, { color: mix(C.white, C.green, win), glow: win * 20 });
    line(ctx, 110, g2, 970, g2, { color: C.faint, width: 4 });

    const SW = 52, SH = 40;
    let built = 0;
    for (let i = 0; i < 5; i++) {
      const p = seg(t, 1.0 + i * 0.75, 1.45 + i * 0.75);
      if (p <= 0) continue;
      built = i + 1;
      const h = (i + 1) * SH;
      const drop = (1 - ease.outBack(p)) * 120;
      const x = LX + i * SW, w = i === 4 ? 260 - 4 * SW : SW;
      const flash = 1 - seg(t, 1.45 + i * 0.75, 2.2 + i * 0.75);
      box(ctx, x, g2 - h - drop, w, h, { color: mix(C.soft, C.green, Math.max(flash, win)), glow: 18 * Math.max(flash, win), alpha: clamp(p * 2) });
    }
    // Outline of the target height, so it reads as the same ledge
    box(ctx, LX, g2 - LH, 260, LH, { color: C.faint, dash: [8, 12], alpha: 1 - seg(t, 3.5, 4.5) });

    // Builder: small "place" gesture per block, then climbs
    const climb = ease.inOut(seg(t, 5.0, 8.0));
    const cx = lerp(FX, 885, climb);
    const stepH = (x) => {
      if (x < LX) return 0;
      const i = Math.min(4, Math.floor((x - LX) / SW));
      const into = (x - LX - i * SW) / 18;
      return i * SH + SH * clamp(into);
    };
    let bpose = POSE.stand();
    if (t < 5.0 && built) {
      const ph = ((t - 1.0) % 0.75) / 0.75;
      bpose = blendPose(POSE.stand(), POSE.push(0, 0.3), Math.sin(Math.PI * clamp(ph * 1.6)));
    }
    if (t >= 5.0) bpose = POSE.walk(cx / 26, 0.9);
    bpose = blendPose(bpose, POSE.stand(), ease.out(seg(t, 8.0, 8.3)));
    bpose = blendPose(bpose, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.3, 8.75)));
    bloom(ctx, 900, g2 - LH - 80, 260, C.green, 0.35 * win);
    flag(ctx, 925, g2 - LH, { color: mix(C.dim, C.green, win), glow: win * 26, h: 100, wave: Math.sin(t * 5) * win });
    figure(ctx, cx, g2 - stepH(cx), bpose, { scale: 1.2, glow: win * 14 });
    burst(ctx, 960, g2 - LH - 90, seg(t, 8.3, 9.5), C.green, 16, 150);

    typeText(ctx, 'Stop jumping. Start building.', W / 2, 1400, seg(t, 8.8, 10.0), { size: 38, weight: 500, color: C.soft });
  },
};
