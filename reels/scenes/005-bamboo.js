// Invisible progress: 4 years of roots underground, then the bamboo explodes past the frame.
const SCENE = {
  duration: 12,
  meta: {
    title: 'Chinese Bamboo',
    cover: 9.6,
    caption: `Year 1: nothing.
Year 2: nothing.
Year 3: nothing.
Year 4: nothing.
Year 5: 27 metres in 6 weeks.

It didn't grow in 6 weeks. It grew for 5 years.

If it feels like nothing is happening, look underground.

Send this to someone who's about to quit.`,
    hashtags: ['patience', 'consistency', 'growthmindset', 'nevergiveup', 'discipline', 'mindset', 'selfimprovement', 'motivation'],
  },
  draw(ctx, t) {
    const PX = 300, G = 860;
    if (!this.roots) {
      this.roots = [
        branches(7, PX, G + 4, Math.PI / 2, 125, 5, { spread: 0.6, shrink: 0.8 }),
        branches(21, PX, G + 4, Math.PI / 2 + 0.6, 90, 4, { spread: 0.55 }),
        branches(42, PX, G + 4, Math.PI / 2 - 0.6, 90, 4, { spread: 0.55 }),
      ];
    }

    const years = [0.3, 1.8, 3.3, 4.8];
    const yr = t < 6.4 ? Math.max(1, years.filter((s) => t >= s).length) : 5;
    const boom = seg(t, 6.4, 8.2);
    const win = seg(t, 6.4, 6.8);

    // Year counter with a small pop on every change
    const yStart = yr === 5 ? 6.4 : years[yr - 1];
    const pop = 1 + 0.18 * (1 - ease.out(seg(t, yStart, yStart + 0.35)));
    label(ctx, 'Chinese bamboo', 930, 345, { align: 'right', size: 26, color: C.soft });
    ctx.save();
    ctx.translate(930, 425);
    ctx.scale(pop, pop);
    text(ctx, `YEAR ${yr}`, 0, 0, { size: 86, weight: 800, align: 'right', color: yr === 5 ? C.green : C.white, glow: yr === 5 ? 26 : 0 });
    ctx.restore();

    const height = boom > 0 ? `${(27 * ease.out(boom)).toFixed(1)} m` : '0.1 cm';
    text(ctx, height, 930, 505, { size: 44, weight: 600, align: 'right', color: yr === 5 ? C.green : C.soft, glow: win * 14 });
    const note = yr < 5 ? 'Nothing.' : '6 weeks.';
    text(ctx, note, 930, 562, { size: 34, weight: 500, align: 'right', color: yr < 5 ? C.dim : C.green, alpha: t > 0.6 ? 1 : seg(t, 0.3, 0.6) });

    // Ground and underground shading
    line(ctx, 90, G, 990, G, { color: C.soft, width: 4 });
    label(ctx, 'What people see', 980, G - 28, { align: 'right', size: 22, color: C.dim });
    label(ctx, 'What actually happens', 980, G + 34, { align: 'right', size: 22, color: mix(C.dim, C.gold, seg(t, 1, 2.5)) });

    // Roots: grow through years 1 to 4, flare when the bamboo launches
    const rootP = Math.pow(seg(t, 0.4, 6.3), 0.8);
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);
    const rootColor = mix(C.gold, C.green, win);
    for (const r of this.roots) drawBranches(ctx, r, rootP, { color: rootColor, width: 3.5, glow: 10 + 8 * pulse + win * 16, alpha: 0.9 });

    // Above ground: a tiny sprout that never changes until year 5
    const sway = Math.sin(t * 2.2) * 0.03;
    if (boom <= 0) {
      line(ctx, PX, G, PX, G - 26, { color: C.white, width: 5 });
      leaf(ctx, PX, G - 20, -Math.PI / 2 - 0.9, 26, 1, { color: C.white });
      leaf(ctx, PX, G - 24, -Math.PI / 2 + 0.9, 22, 1, { color: C.white });
    } else {
      const h = 26 + ease.out(boom) * 1100;
      const top = G - h;
      const segH = 92;
      ctx.save();
      ctx.translate(PX, G);
      ctx.rotate(sway);
      ctx.translate(-PX, -G);
      // Stalk: twin lines plus nodes
      stroke(ctx, (c) => { c.moveTo(PX - 13, G); c.lineTo(PX - 11, top); c.moveTo(PX + 13, G); c.lineTo(PX + 11, top); }, { color: C.green, width: 5, glow: 24 });
      for (let y = G - segH, i = 0; y > top; y -= segH, i++) {
        line(ctx, PX - 16, y, PX + 16, y, { color: C.green, width: 5, glow: 16 });
        const side = i % 2 ? 1 : -1;
        const k = ease.outBack(clamp((G - y - (h - 260)) / -200 + 1));
        if (i % 2 === 0 || i > 2) leaf(ctx, PX + side * 14, y - 6, -Math.PI / 2 + side * 0.85, 70, clamp(k), { color: C.green, glow: 14 });
      }
      ctx.restore();
      bloom(ctx, PX, G - 200, 420, C.green, 0.22 * win);
    }
    burst(ctx, PX, G - 10, seg(t, 6.4, 7.4), C.green, 18, 180);

    typeText(ctx, "You weren't stuck. You were rooting.", W / 2, 1440, seg(t, 8.6, 9.9), { size: 40, weight: 600, color: C.white, glow: 10 });
  },
};
