// Columns: same 2 hours a day for a year. Scrolling feels better early; building wins the year.
const SCENE = {
  duration: 12.5,
  meta: {
    title: 'Scroll vs Build',
    cover: 10.5,
    caption: `2 hours a day is 730 hours a year.

You can scroll through them or stack them.

Both feel the same on day 1. They look very different on day 365.

Which one are you doing with yours?`,
    hashtags: ['screentime', 'discipline', 'buildinpublic', 'mindset', 'selfimprovement', 'productivity', 'habits', 'growthmindset'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 21, 10);
    const G = 1250, LX = 240, RX = 600, TX = 830;
    const yr = seg(t, 0.8, 8.0);
    const day = Math.max(1, Math.round(1 + 364 * yr));

    // Top text: hook, live day counter, payoff
    caption(ctx, 'Same 2 hours. Every day.', W / 2, 360, { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8, alpha: 1 - seg(t, 8.4, 8.8) });
    text(ctx, `DAY ${day}`, W / 2, 440, { size: 46, weight: 700, spacing: 4, color: day === 365 ? C.green : C.white, glow: day === 365 ? 20 : 6, alpha: seg(t, 0.4, 0.8) * (1 - seg(t, 8.4, 8.8)) });
    caption(ctx, 'Same hours.\nDifferent life.', W / 2, 400, { size: 44, glow: 14, alpha: seg(t, 8.8, 9.3) });

    floorLine(ctx, G);

    // ---- Left: scrolling ----
    const slump = ease.inOut(seg(t, 3, 8));
    const phonePose = { lean: 0.18 + 0.4 * slump, tL: 0.05, sL: 0.05, tR: -0.05, sR: -0.05, aL: 0.95, fL: 2.35, aR: 0.85, fR: 2.25 };
    const dimL = 1 - 0.35 * seg(t, 8.2, 9.5);
    let jL;
    const drawL = () => { jL = figure(ctx, LX, G, phonePose, { scale: 1.25, alpha: dimL, color: mix(C.white, '#C9B8FF', 0.3) }); return jL; };
    reflect(ctx, G, drawL, { alpha: 0.2, depth: 150 });
    drawL();
    const hx = (jL.hands[0][0] + jL.hands[1][0]) / 2 + 6, hy = (jL.hands[0][1] + jL.hands[1][1]) / 2 - 18;
    rotAt(ctx, hx, hy, -0.35 - 0.2 * slump, () => {
      fill(ctx, (c) => c.roundRect(hx - 22, hy - 38, 44, 76, 8), { color: '#1a1530', alpha: dimL });
      stroke(ctx, (c) => c.roundRect(hx - 22, hy - 38, 44, 76, 8), { color: C.violet, width: 4, glow: 16, alpha: dimL });
      ctx.save(); ctx.beginPath(); ctx.rect(hx - 18, hy - 34, 36, 68); ctx.clip();
      for (let i = 0; i < 8; i++) {
        const y = hy + 40 - (((t * 220) + i * 22) % 176);
        line(ctx, hx - 12, y, hx + (i % 2 ? 6 : 12), y, { color: C.violet, width: 3, alpha: 0.8 * dimL });
      }
      ctx.restore();
    });
    bloom(ctx, jL.head[0], jL.head[1] + 20, 120, C.violet, 0.3 * dimL);
    // Dopamine hearts: plenty early, fewer and fewer
    for (let i = 0; i < 14; i++) {
      const born = i * 0.55, life = (t - born);
      if (life < 0 || life > 1.6) continue;
      const fade = 1 - seg(t, 1.5, 6.5);
      const px = hx + Math.sin(i * 2.3) * 40, py = hy - 40 - life * 120;
      circle(ctx, px, py, 7, { fill: true, color: '#FF5FA2', glow: 12, alpha: (1 - life / 1.6) * fade });
    }
    label(ctx, '2 hrs scrolling', LX + 10, G + 70, { size: 24, color: mix(C.soft, C.red, seg(t, 7.5, 8.5)) });
    text(ctx, 'Nothing to show', LX + 10, G + 118, { size: 30, weight: 600, color: C.red, glow: 10, alpha: seg(t, 8.2, 8.8) });

    // ---- Right: building ----
    const N = 51, rows = 17, BW = 56, BH = 34;
    const n = Math.floor(N * ease.in(yr));
    const win = seg(t, 8.0, 8.5);
    const drawTower = (withFlash) => {
      for (let i = 0; i < n; i++) {
        const r = Math.floor(i / 3), c = i % 3;
        const off = r % 2 ? BW / 2 : 0;
        const x = TX - 1.5 * BW + c * BW + off - BW / 4, y = G - (r + 1) * BH;
        const fresh = withFlash && i >= n - 2 && t < 8 ? 1 : 0;
        const col = mix(C.soft, C.gold, Math.max(fresh, 0)) ;
        stroke(ctx, (cc) => cc.rect(x + 2, y + 2, BW - 4, BH - 4), { color: win ? mix(col, C.green, win) : col, width: 3, glow: fresh * 14 + win * 16 });
      }
    };
    const placing = t > 0.8 && t < 8 ? Math.abs(Math.sin(t * 5)) : 0;
    let bPose = blendPose(POSE.stand(), POSE.push(0, 0.2), placing * 0.8);
    bPose = blendPose(bPose, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.3, 8.8)));
    const drawR = () => { drawTower(false); figure(ctx, RX, G, bPose, { scale: 1.25, glow: win * 14 }); };
    reflect(ctx, G, drawR, { alpha: 0.2, depth: 150 });
    drawTower(true);
    figure(ctx, RX, G, bPose, { scale: 1.25, glow: win * 14, color: mix(C.white, '#E8FFF2', win) });
    const top = G - Math.ceil(n / 3) * BH;
    bloom(ctx, TX, top + 120, 300, C.green, 0.3 * win);
    burst(ctx, TX, top - 20, seg(t, 8.0, 9.2), C.green, 18, 160);
    label(ctx, '2 hrs building', TX - 60, G + 70, { size: 24, color: mix(C.soft, C.green, win), glow: win * 12 });
    text(ctx, 'A whole new life', TX - 60, G + 118, { size: 30, weight: 600, color: C.green, glow: 12, alpha: seg(t, 8.2, 8.8) });
  },
};
