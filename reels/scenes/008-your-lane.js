// Split: the runner who keeps watching the other lane leads early, trips, and loses.
const SCENE = {
  duration: 12,
  meta: {
    title: 'Your Lane',
    cover: 10.2,
    caption: `Every time you check their progress, you pay for it with your own.

Eyes on your lane.

Tag someone who needs to stop comparing.`,
    hashtags: ['comparison', 'focus', 'mindset', 'discipline', 'selfimprovement', 'growthmindset', 'motivation', 'consistency'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 12, 10);
    captionSeq(ctx, t, [
      [0, 'Same race. Same speed.', { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8 }],
      [2.8, ''],
      [8.8, "You lose your race\nwatching someone else's.", { size: 42, glow: 12 }],
    ], W / 2, 400);

    const g1 = 860, g2 = 1350, HX = 610, FIN = 905;
    const looks = [[3.2, 3.8], [4.3, 5.25], [6.9, 7.6], [8.1, 12]];
    const looking = looks.some(([a, b]) => t > a && t < b);

    // ---- Bottom: eyes on own lane ----
    const x2 = t < 0.4 ? 160 : Math.min(FIN + 10, lerp(160, FIN + 10, seg(t, 0.4, 8.0)));
    const d = x2 - HX, lift2 = Math.abs(d) < 70 ? Math.cos((d / 70) * Math.PI / 2) * 80 : 0;
    const done2 = seg(t, 8.0, 8.4);
    let p2 = t < 0.4 ? POSE.crouch() : POSE.run(x2 / 30, 0.85);
    if (lift2 > 0) p2 = blendPose(p2, POSE.crouch(), 0.5);
    p2 = blendPose(p2, POSE.stand(), ease.out(done2));
    p2 = blendPose(p2, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.4, 8.9)));
    const cleared = Math.sin(Math.PI * seg(t, 5.0, 5.7));
    const green = seg(t, 5.6, 7.5);
    floorLine(ctx, g2);
    if (t > 0.5) stroke(ctx, (c) => { c.moveTo(160, g2); c.lineTo(x2, g2); }, { color: C.green, width: 4, glow: 16, alpha: 0.3 + 0.6 * green });
    const tapeBroken = seg(t, 8.0, 8.6);
    const drawB = () => {
      hurdle(ctx, HX, g2, { color: mix(C.soft, C.green, cleared), glow: 8 + cleared * 20 });
      if (tapeBroken <= 0) line(ctx, FIN, g2, FIN, g2 - 220, { color: C.soft, width: 4 });
      else {
        const a = ease.out(tapeBroken) * 1.2;
        rotAt(ctx, FIN, g2 - 220, a, () => line(ctx, FIN, g2 - 220, FIN, g2 - 110, { color: C.green, width: 4, glow: 14, alpha: 1 - tapeBroken * 0.6 }));
        rotAt(ctx, FIN, g2, -a, () => line(ctx, FIN, g2, FIN, g2 - 110, { color: C.green, width: 4, glow: 14, alpha: 1 - tapeBroken * 0.6 }));
      }
      return figure(ctx, x2, g2, p2, { scale: 1.2, lift: lift2, glow: green * 10 + done2 * 14, color: mix(C.white, '#E8FFF2', done2) });
    };
    reflect(ctx, g2, drawB, { alpha: 0.22, depth: 150 });
    const j2 = drawB();
    bloom(ctx, FIN, g2 - 120, 260, C.green, 0.3 * done2);
    burst(ctx, FIN, g2 - 200, seg(t, 8.0, 9.2), C.green, 16, 150);
    label(ctx, 'Eyes on his own lane', W / 2, g2 + 70, { size: 26, color: mix(C.soft, C.green, green), glow: done2 * 14 });

    // ---- Top: watches the other lane ----
    let x1;
    if (t < 0.4) x1 = 160;
    else if (t < 3.0) x1 = lerp(160, 500, ease.out(seg(t, 0.4, 3.0)) * 0.6 + seg(t, 0.4, 3.0) * 0.4);
    else if (t < 5.25) x1 = lerp(500, 585, seg(t, 3.0, 5.25));
    else if (t < 6.8) x1 = lerp(585, 615, ease.out(seg(t, 5.25, 5.7)));
    else x1 = lerp(615, 700, ease.inOut(seg(t, 6.8, 8.6)));
    const fall = seg(t, 5.25, 5.55), down = seg(t, 5.55, 5.9), up = seg(t, 6.3, 6.8);
    const hurt = Math.max(fall, seg(t, 5.25, 6) * (1 - seg(t, 9, 10) * 0.3));
    let p1 = t < 0.4 ? POSE.crouch() : POSE.run(x1 / 30, t < 3 ? 0.95 : 0.6);
    if (looking) p1 = { ...p1, lean: -0.08 };
    p1 = blendPose(p1, POSE.sit(), ease.inOut(down) * (1 - ease.inOut(up)));
    if (t > 6.8) p1 = t < 8.6 ? POSE.walk(x1 / 24, 0.5) : POSE.stand();
    if (t > 8.6) p1 = { ...POSE.stand(), lean: -0.08 };
    const tilt = fall * (1 - down) * 0.9;
    const dim1 = 1 - 0.35 * seg(t, 8.6, 10);
    floorLine(ctx, g1);
    fadeLine(ctx, 80, W - 80, g1, { color: '255,45,85', alpha: looking ? 0.35 : 0, width: 3 });
    const drawT = () => {
      hurdle(ctx, HX, g1, { color: hurt > 0 ? C.red : C.soft, glow: hurt * 16, rot: ease.out(seg(t, 5.25, 5.6)) * 1.35 });
      line(ctx, FIN, g1, FIN, g1 - 220, { color: C.dim, width: 4 });
      let j;
      rotAt(ctx, x1, g1, tilt, () => { j = figure(ctx, x1, g1, p1, { scale: 1.2, color: mix(C.white, C.red, hurt * 0.75), glow: hurt * 12, alpha: dim1 }); });
      return j;
    };
    reflect(ctx, g1, drawT, { alpha: 0.22, depth: 150 });
    const j1 = drawT();
    if (looking && j1 && j2) gaze(ctx, j1.head, j2.head, { alpha: 0.85 * dim1 });
    label(ctx, 'Watches the other lane', W / 2, g1 + 70, { size: 26, color: mix(C.soft, C.red, seg(t, 5.2, 6)) });
  },
};
