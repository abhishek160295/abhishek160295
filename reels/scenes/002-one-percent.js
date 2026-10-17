// Compounding curve: 1.01^365 vs 0.99^365 drawn live with a day counter.
const SCENE = {
  duration: 11.5,
  meta: {
    title: '1% Better vs 1% Worse',
    cover: 9.5,
    caption: `1.01^365 = 37.78
0.99^365 = 0.03

Same person. Same 365 days. The only difference is 1% each day.

You won't see it in a week. You'll see it in a year.

Save this for the days it feels like nothing is changing.`,
    hashtags: ['compounding', 'onepercentbetter', 'atomichabits', 'discipline', 'mindset', 'selfimprovement', 'habits', 'growthmindset'],
  },
  draw(ctx, t) {
    const x0 = 150, x1 = 900, mid = 1000;
    const k = ease.sine(seg(t, 0.8, 7.6));
    const day = Math.round(365 * k);
    const done = seg(t, 7.6, 8.1);

    label(ctx, 'Day', W / 2, 420, { color: C.soft, size: 28 });
    text(ctx, String(day), W / 2, 492, { size: 84, weight: 700, color: C.white, glow: done * 18 });

    // Axes
    line(ctx, x0, 560, x0, 1290, { color: C.faint, width: 3 });
    line(ctx, x0, mid, x1 + 40, mid, { color: C.faint, width: 3, dash: [10, 14] });

    const up = (d) => mid - (Math.pow(1.01, d) - 1) * (430 / 36.78);
    const down = (d) => mid + (1 - Math.pow(0.99, d)) * (270 / 0.974);
    const N = 120;
    const ptsUp = [], ptsDown = [];
    for (let i = 0; i <= N; i++) {
      const d = (365 * i) / N;
      const x = lerp(x0, x1, i / N);
      ptsUp.push([x, up(d)]);
      ptsDown.push([x, down(d)]);
    }

    const g = partialPath(ctx, ptsUp, k, { color: C.green, width: 7, glow: 22 });
    const r = partialPath(ctx, ptsDown, k, { color: C.red, width: 7, glow: 22 });

    const vUp = Math.pow(1.01, 365 * k), vDown = Math.pow(0.99, 365 * k);
    const head = (p, v, color, dy) => {
      if (!p) return;
      bloom(ctx, p[0], p[1], 90, color, 0.4);
      circle(ctx, p[0], p[1], 11, { fill: true, color, glow: 24 });
      text(ctx, v.toFixed(2), p[0] - 26, p[1] + dy, { size: 40, weight: 700, color, align: 'right', glow: 10 + done * 16 });
    };
    head(g || [x0, mid], vUp, C.green, -42);
    head(r || [x0, mid], vDown, C.red, 46);

    label(ctx, '1% better every day', x0 + 20, 640, { align: 'left', size: 28, color: C.green, alpha: 0.9 });
    label(ctx, '1% worse every day', x0 + 20, 1360, { align: 'left', size: 28, color: C.red, alpha: 0.9 });

    burst(ctx, x1, up(365), seg(t, 7.7, 9), C.green, 18, 160);
    typeText(ctx, 'Small choices. Massive gap.', W / 2, 1450, seg(t, 8.4, 9.6), { size: 40, weight: 500, color: C.soft });
  },
};
