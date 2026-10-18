// Invisible progress: 4 years of roots underground, then the bamboo explodes past the frame.
const SCENE = {
  duration: 12,
  meta: {
    title: 'Chinese Bamboo',
    cover: 10.2,
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
    const CX = W / 2, G = 1110, LAUNCH = 5.9;
    if (!this.roots) {
      this.roots = [
        branches(11, CX, G + 6, Math.PI / 2, 100, 5, { spread: 0.62, shrink: 0.8 }),
        branches(5, CX, G + 6, Math.PI / 2 + 0.8, 92, 4, { spread: 0.55, shrink: 0.8 }),
        branches(9, CX, G + 6, Math.PI / 2 - 0.8, 92, 4, { spread: 0.55, shrink: 0.8 }),
      ];
      const r = rng(77);
      this.streaks = Array.from({ length: 26 }, () => ({ x: 160 + r() * 760, y: r() * H, len: 120 + r() * 260, v: 2600 + r() * 2200 }));
    }

    ambient(ctx, t, 4);

    // Top sentence: hook, year counter, launch, payoff
    captionSeq(ctx, t, [
      [0, 'This plant does nothing\nfor 4 years.'],
      [1.8, 'Year 1'],
      [2.75, 'Year 2'],
      [3.7, 'Year 3'],
      [4.65, 'Year 4'],
      [LAUNCH, 'Year 5', { color: C.green, glow: 26, halo: true }],
      [7.3, '27 metres in 6 weeks.', { color: C.green, glow: 22, halo: true }],
      [9.0, 'It was growing\nthe whole time.', { halo: true, glow: 16 }],
    ], CX, 400);
    const quiet = seg(t, 1.8, 2.0) * (1 - seg(t, LAUNCH - 0.2, LAUNCH));
    caption(ctx, 'nothing above ground', CX, 470, { size: 30, color: C.dim, glow: 0, alpha: quiet });

    // Ground
    fadeLine(ctx, 80, W - 80, G, { alpha: 0.75, width: 3 });

    // Roots: gold neon, growing all four years, white-hot flare at launch
    const rootP = Math.pow(seg(t, 0.4, LAUNCH - 0.2), 0.75);
    const flare = Math.sin(Math.PI * seg(t, LAUNCH - 0.35, LAUNCH + 0.5));
    const after = seg(t, LAUNCH, LAUNCH + 0.6);
    const rootColor = mix(C.gold, C.green, after);
    for (const r of this.roots) {
      drawBranches(ctx, r, rootP, { color: rootColor, width: 4, glow: 18 + flare * 30, alpha: 0.95 });
      drawBranches(ctx, r, rootP, { color: `rgba(255,255,255,${0.55 + 0.45 * flare})`, width: 1.6 });
    }
    bloom(ctx, CX, G + 150, 360, rootColor, 0.12 + 0.25 * flare);

    // Above ground
    const boom = ease.inOut(seg(t, LAUNCH, LAUNCH + 1.1));
    if (boom <= 0) {
      const sp = (c) => { c.moveTo(CX, G); c.lineTo(CX, G - 44); };
      neon(ctx, sp, { color: C.white, width: 6, glow: 18 });
      leaf(ctx, CX, G - 34, -Math.PI / 2 - 0.85, 34, 1, { color: C.white, glow: 12 });
      leaf(ctx, CX, G - 40, -Math.PI / 2 + 0.85, 30, 1, { color: C.white, glow: 12 });
    } else {
      const top = G - 44 - boom * 540;
      const sway = Math.sin((t - LAUNCH) * 1.8) * 0.012 * seg(t, LAUNCH + 1, LAUNCH + 2);
      ctx.save();
      ctx.translate(CX, G); ctx.rotate(sway); ctx.translate(-CX, -G);

      // Speed streaks while it shoots up
      const sk = 1 - seg(t, LAUNCH + 0.9, LAUNCH + 1.6);
      if (sk > 0 && t > LAUNCH) {
        for (const s of this.streaks) {
          const y = ((s.y + (t - LAUNCH) * s.v) % (H + 400)) - 200;
          if (Math.abs(s.x - CX) < 70 || y > G - s.len) continue;
          line(ctx, s.x, y, s.x, y + s.len, { color: C.green, width: 3, glow: 10, alpha: 0.45 * sk });
        }
      }

      const stalk = (c) => { c.moveTo(CX - 17, G); c.lineTo(CX - 15, top + 40); c.lineTo(CX, top); c.lineTo(CX + 15, top + 40); c.lineTo(CX + 17, G); };
      neon(ctx, stalk, { color: C.green, width: 9, glow: 38 });
      let i = 0;
      for (let y = G - 82; y > top + 50; y -= 82, i++) {
        neon(ctx, (c) => { c.moveTo(CX - 20, y); c.lineTo(CX + 20, y); }, { color: C.green, width: 7, glow: 22 });
        const side = i % 2 ? 1 : -1;
        const k = ease.outBack(seg(t, LAUNCH + 0.9 + i * 0.07, LAUNCH + 1.35 + i * 0.07));
        if (i > 0) leaf(ctx, CX + side * 17, y - 8, -Math.PI / 2 + side * (0.75 + 0.1 * (i % 3)), 105 + 12 * (i % 2), clamp(k, 0, 1.1), { color: C.green, width: 6, glow: 22 });
      }
      ctx.restore();

      // Shockwave at the base
      const sw = seg(t, LAUNCH, LAUNCH + 0.9);
      if (sw > 0 && sw < 1) {
        stroke(ctx, (c) => c.ellipse(CX, G, 40 + 480 * ease.out(sw), 8 + 50 * ease.out(sw), 0, 0, Math.PI * 2), { color: C.green, width: 4, glow: 20, alpha: 1 - sw });
      }
      bloom(ctx, CX, G - 300, 520, C.green, 0.18 * seg(t, LAUNCH, LAUNCH + 0.4));
    }
  },
};
