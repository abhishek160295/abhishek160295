// Split comparison: the sprinter burns out, the walker never stops and finishes.
const SCENE = {
  duration: 11,
  meta: {
    title: 'Intensity vs Consistency',
    cover: 9.2,
    caption: `Intensity gets you a great week.
Consistency gets you a different life.

You don't need to sprint. You need to not stop.

Which one have you been lately?`,
    hashtags: ['consistency', 'discipline', 'mindset', 'selfimprovement', 'motivation', 'growthmindset', 'habits', 'animation'],
  },
  draw(ctx, t) {
    const X0 = 150, FLAG = 905;

    // Row 1: intensity
    const g1 = 800;
    label(ctx, 'Intensity', W / 2, 520, { color: mix(C.white, C.red, seg(t, 2.8, 3.6)) });
    line(ctx, 110, g1, 970, g1, { color: C.faint, width: 4 });
    flag(ctx, FLAG, g1, { color: C.dim });

    const runK = seg(t, 0.3, 2.7), slowK = seg(t, 2.7, 3.5), sitK = seg(t, 4.3, 5.0);
    const rx = X0 + 370 * runK + 50 * ease.out(slowK);
    let pose = POSE.run(rx / 34, 1 - slowK * 0.6);
    if (t < 0.3) pose = POSE.stand();
    pose = blendPose(pose, POSE.tired(), ease.inOut(seg(t, 2.9, 3.6)));
    pose = blendPose(pose, POSE.sit(), ease.inOut(sitK));
    const burnt = seg(t, 3.0, 3.8);
    const rColor = mix(C.white, C.red, burnt);
    line(ctx, X0 - 40, g1, rx, g1, { color: C.red, width: 5, glow: 14, alpha: 0.85 * (1 - 0.6 * seg(t, 5, 6.5)) });
    figure(ctx, rx, g1, pose, { scale: 1.2, color: rColor, glow: burnt * 18, alpha: 1 - 0.45 * seg(t, 5.5, 7) });

    // Row 2: consistency
    const g2 = 1240;
    const win = seg(t, 8.0, 8.5);
    label(ctx, 'Consistency', W / 2, 960, { color: mix(C.white, C.green, win), glow: win * 20 });
    line(ctx, 110, g2, 970, g2, { color: C.faint, width: 4 });

    const walkK = seg(t, 0.3, 8.0);
    const wx = X0 + 695 * walkK;
    let wpose = t < 0.3 ? POSE.stand() : POSE.walk(wx / 27);
    wpose = blendPose(wpose, POSE.stand(), ease.out(seg(t, 8.0, 8.3)));
    wpose = blendPose(wpose, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.3, 8.75)));
    bloom(ctx, FLAG + 30, g2 - 80, 260, C.green, 0.35 * win);
    flag(ctx, FLAG, g2, { color: mix(C.dim, C.green, win), glow: win * 26, wave: Math.sin(t * 5) * win });
    line(ctx, X0 - 40, g2, wx, g2, { color: C.green, width: 5, glow: 16, alpha: 0.9 });
    figure(ctx, wx, g2, wpose, { scale: 1.2, glow: win * 14, color: mix(C.white, '#E9FFF3', win) });
    burst(ctx, FLAG + 30, g2 - 95, seg(t, 8.3, 9.5), C.green, 16, 150);

    // Payoff line
    typeText(ctx, 'Slow wins when it never stops.', W / 2, 1385, seg(t, 8.7, 9.9), { size: 38, weight: 500, color: C.soft });
  },
};
