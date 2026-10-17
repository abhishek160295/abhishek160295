// Percentage drop-off: a crowd of dots rides the learning curve, most quit in the dip.
const SCENE = {
  duration: 12,
  meta: {
    title: 'The Dip',
    cover: 9.8,
    caption: `Every skill looks like this.

The start is exciting. The dip is where it gets quiet, slow and hard.
That's where most people stop.

The dip isn't a sign to quit. It's the filter.

Tag someone who's in their dip right now.`,
    hashtags: ['thedip', 'nevergiveup', 'consistency', 'mindset', 'discipline', 'growthmindset', 'selfimprovement', 'motivation'],
  },
  draw(ctx, t) {
    // Learning curve: quick rise, deep dip, long climb.
    if (!this.pts) {
      const P = [[110, 1180], [250, 1080], [340, 850], [420, 900], [520, 1230], [600, 1260], [700, 1170], [820, 860], [960, 600]];
      const pts = [];
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
        for (let s = 0; s < 20; s++) {
          const u = s / 20, u2 = u * u, u3 = u2 * u;
          pts.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3)));
        }
      }
      pts.push(P[P.length - 1]);
      this.pts = pts;
      let lo = 0;
      for (let i = 0; i < 101; i++) if (pointAt(pts, i / 100)[1] > pointAt(pts, lo / 100)[1] && i > 20) lo = i;
      this.dipU = lo / 100;
    }
    const pts = this.pts, dipU = this.dipU;

    label(ctx, 'Every skill looks like this', W / 2, 430, { size: 30, color: C.soft });
    partialPath(ctx, pts, 1, { color: C.dim, width: 5 });

    label(ctx, 'Start', 120, 1250, { align: 'left', size: 26, color: C.soft });
    label(ctx, 'Hype', 340, 790, { size: 26, color: C.soft });
    const quitShown = seg(t, 5.2, 5.8);
    label(ctx, 'The dip', 560, 1330, { size: 28, color: mix(C.soft, C.red, quitShown), glow: quitShown * 14 });
    const win = seg(t, 8.0, 8.5);
    label(ctx, 'Mastery', 820, 590, { size: 28, color: mix(C.soft, C.green, win), glow: win * 18 });

    // The crowd
    const N = 11, HERO = 5, speed = dipU / 3.2;
    for (let i = 0; i < N; i++) {
      const start = 0.4 + i * 0.13;
      if (i === HERO) continue;
      const stopU = dipU - 0.07 + ((i * 37) % 11) / 11 * 0.11;
      const u = Math.min(stopU, Math.max(0, (t - start) * speed));
      const reached = start + stopU / speed;
      const quit = seg(t, reached + 0.3, reached + 0.7), gone = seg(t, reached + 1.2, reached + 2.4);
      const [x, y] = pointAt(pts, u);
      const color = mix(C.white, C.red, quit);
      circle(ctx, x, y - 16 + gone * 40, 11, { fill: true, color, glow: 10 + quit * 10, alpha: (t < start ? 0.6 : 1) * (1 - gone) });
    }

    // The one who stays: slows down in the dip, then climbs.
    const hs = 0.4 + HERO * 0.13;
    let hu;
    if (t < hs + dipU / speed) hu = Math.max(0, (t - hs) * speed);
    else if (t < 5.6) hu = lerp(dipU, dipU + 0.07, ease.inOut(seg(t, hs + dipU / speed, 5.6)));
    else hu = lerp(dipU + 0.07, 1, ease.inOut(seg(t, 5.6, 8.0)));
    const [hx, hy] = pointAt(pts, hu);
    const glowK = Math.max(seg(t, 5.6, 6.2), win);
    if (glowK) partialPath(ctx, pts, hu, { color: C.green, width: 6, glow: 18, alpha: glowK * 0.9 });
    bloom(ctx, hx, hy - 16, 120, C.green, 0.4 * glowK);
    circle(ctx, hx, hy - 16, 13, { fill: true, color: mix(C.white, C.green, glowK), glow: 14 + glowK * 20 });

    const starK = ease.outBack(seg(t, 8.0, 8.6));
    if (starK > 0) star(ctx, 960, 600 - 70, 30 * starK, { color: C.green, glow: 26 });
    burst(ctx, 960, 560, seg(t, 8.0, 9.2), C.green, 18, 170);

    text(ctx, '90% quit here', 560, 1390, { size: 34, weight: 700, color: C.red, glow: 14, alpha: quitShown });
    typeText(ctx, "The dip is the filter. Stay.", W / 2, 1450, seg(t, 8.7, 9.9), { size: 38, weight: 500, color: C.soft });
  },
};
