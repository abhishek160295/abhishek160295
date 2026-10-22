// Split: same lesson pours into two cups. The full cup spills it all; the empty cup fills with gold.
const SCENE = {
  duration: 12,
  bg: 'charcoal',
  meta: {
    title: 'Empty Cup',
    cover: 10.2,
    caption: `The person who thinks they know it all
learns the least in the room.

Stay a beginner. Keep your cup empty.

Send this to the smartest person you know.`,
    hashtags: ['learning', 'humility', 'growthmindset', 'mindset', 'selfimprovement', 'wisdom', 'discipline', 'stoicism'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 41, 9);
    captionSeq(ctx, t, [
      [0, 'Same lesson. Same teacher.', { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8 }],
      [2.8, ''],
      [8.8, "A full cup can't\nhold anything new.", { size: 42, glow: 12 }],
    ], W / 2, 330);

    const GOLD = '#FFC93C';
    const holdPose = { lean: 0.04, tL: 0.08, sL: 0.06, tR: -0.08, sR: -0.06, aL: 1.05, fL: 2.0, aR: 0.95, fR: 1.9 };
    const pourOn = (t > 0.6 && t < 8.0) ? 1 : 0;
    const flowK = seg(t, 0.6, 1.0) * (1 - seg(t, 7.8, 8.2));

    const row = (g, full, labelTxt, good) => {
      floorLine(ctx, g);
      const X = 420;
      let fig;
      const level = full ? 1 : ease.inOut(seg(t, 1.0, 7.6));
      const win = good ? seg(t, 7.6, 8.1) : 0;
      const sad = full ? seg(t, 5, 7) : 0;
      const dim = full ? 1 - 0.35 * seg(t, 8.4, 9.6) : 1;
      const pose = good ? blendPose(holdPose, { ...holdPose, lean: -0.08, aL: 1.6, aR: 1.5 }, win) : { ...holdPose, lean: 0.04 + 0.25 * sad };
      const drawFig = () => { fig = figure(ctx, X, g, pose, { scale: 1.25, alpha: dim, glow: win * 16, color: good ? mix(C.white, '#FFF1C9', win) : mix(C.white, C.red, sad * 0.5) }); };
      reflect(ctx, g, drawFig, { alpha: 0.2, depth: 150 });
      drawFig();
      const cx = (fig.hands[0][0] + fig.hands[1][0]) / 2 + 40, cb = (fig.hands[0][1] + fig.hands[1][1]) / 2 + 10;
      const CT = cb - 110, TW = 130, BWd = 96;
      const cup = (c) => { c.moveTo(cx - TW / 2, CT); c.lineTo(cx - BWd / 2, cb); c.lineTo(cx + BWd / 2, cb); c.lineTo(cx + TW / 2, CT); };
      // Liquid
      const ly = lerp(cb, CT + 6, level);
      if (level > 0.01) {
        ctx.save(); ctx.beginPath(); cup(ctx); ctx.closePath(); ctx.clip();
        fill(ctx, (c) => c.rect(cx - TW, ly, TW * 2, cb - ly + 4), { color: full ? 'rgba(200,200,210,0.55)' : GOLD, glow: full ? 0 : 20 + win * 20, alpha: full ? dim : 0.9 });
        ctx.restore();
      }
      neon(ctx, cup, { color: full ? mix(C.white, C.red, sad) : mix(C.white, GOLD, level), width: 6, glow: 14 + win * 20, alpha: dim, core: 0.35 });
      if (full) text(ctx, 'I KNOW', cx, (CT + cb) / 2 + 4, { size: 20, weight: 700, spacing: 2, color: '#2a2a2e', alpha: dim });
      // Source: glowing open book above the cup
      const sy = CT - 135;
      neon(ctx, (c) => { c.moveTo(cx - 70, sy + 6); c.quadraticCurveTo(cx - 35, sy - 12, cx, sy + 4); c.quadraticCurveTo(cx + 35, sy - 12, cx + 70, sy + 6); c.moveTo(cx, sy + 4); c.lineTo(cx, sy + 26); c.moveTo(cx - 70, sy + 6); c.lineTo(cx - 70, sy + 28); c.quadraticCurveTo(cx - 35, sy + 12, cx, sy + 26); c.quadraticCurveTo(cx + 35, sy + 12, cx + 70, sy + 28); c.lineTo(cx + 70, sy + 6); }, { color: GOLD, width: 5, glow: 18, core: 0.35 });
      bloom(ctx, cx, sy + 10, 120, GOLD, 0.25);
      // Falling drops
      const surf = full ? CT : ly;
      for (let i = 0; i < 60; i++) {
        const born = 0.6 + i * 0.12;
        const age = t - born;
        if (age < 0 || born > 8.0) continue;
        const y = sy + 30 + age * 620;
        const jx = Math.sin(i * 1.7) * 6;
        if (y < surf) { circle(ctx, cx + jx, y, 5, { fill: true, color: GOLD, glow: 12, alpha: flowK || 1 }); continue; }
        if (!full) continue;
        // Bounces off the full cup and spills over the side
        const after = (y - surf) / 620;
        const side = i % 2 ? 1 : -1;
        const sx = cx + side * (TW / 2 + after * 260), syy = surf + after * after * 2200 - after * 120;
        if (syy < g) circle(ctx, sx, syy, 4.5, { fill: true, color: mix(GOLD, C.red, clamp(after * 4)), glow: 10, alpha: 1 - clamp(after * 1.6) });
      }
      if (good) {
        bloom(ctx, cx, CT, 240, GOLD, 0.35 * win);
        burst(ctx, cx, CT - 10, seg(t, 7.6, 8.8), GOLD, 18, 150);
      }
      label(ctx, labelTxt, W / 2, g + 60, { size: 26, color: good ? mix(C.soft, GOLD, win) : mix(C.soft, C.red, sad), glow: win * 12 });
    };
    row(820, true, 'Thinks he knows it all', false);
    row(1380, false, 'Stays a beginner', true);
  },
};
