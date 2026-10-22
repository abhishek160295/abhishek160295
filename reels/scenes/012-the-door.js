// Split with a reveal: the same scary shadow behind the same door. One backs away; one opens it and finds something tiny.
const SCENE = {
  duration: 12.5,
  meta: {
    title: 'The Door',
    cover: 10.6,
    caption: `The thing you're scared of is almost never as big as its shadow.

Your mind makes the monster. Opening the door shrinks it.

What door have you been standing in front of?`,
    hashtags: ['fear', 'courage', 'mindset', 'overthinking', 'selfimprovement', 'growthmindset', 'motivation', 'discipline'],
  },
  draw(ctx, t) {
    ambient(ctx, t, 51, 10);
    captionSeq(ctx, t, [
      [0, 'Same door. Same shadow.', { size: 40, color: 'rgba(255,255,255,0.85)', glow: 8 }],
      [2.8, ''],
      [9.0, 'Fear is the shadow.\nNot the thing.', { size: 42, glow: 12 }],
    ], W / 2, 380);

    const DX = 600, DW = 140, DH = 250;
    // Monster shadow on the wall, spiky blob with two eyes
    const monster = (x, g, s, o = {}) => {
      if (s <= 0.02) return;
      const { alpha = 1 } = o;
      const cy = g - 130 * s, r = 100 * s;
      const body = (c) => {
        for (let i = 0; i <= 40; i++) {
          const a = (i / 40) * Math.PI * 2;
          const spike = i % 2 ? 1 : 1.28 + 0.08 * Math.sin(t * 6 + i);
          const rr = r * spike * (a > 0.2 && a < Math.PI - 0.2 ? 0.75 : 1);
          const px = x + Math.cos(a) * rr * 1.1, py = cy + Math.sin(a) * rr;
          i ? c.lineTo(px, Math.min(py, g)) : c.moveTo(px, Math.min(py, g));
        }
        c.closePath();
      };
      fill(ctx, body, { color: 'rgba(255,45,85,0.14)', alpha });
      stroke(ctx, body, { color: C.red, width: 3, glow: 14, alpha: 0.7 * alpha });
      for (const ex of [-0.35, 0.35]) circle(ctx, x + ex * r, cy - 0.15 * r, 9 * s + 3, { fill: true, color: C.red, glow: 20, alpha });
    };
    const door = (g, open, o = {}) => {
      const { alpha = 1 } = o;
      const L = DX - DW / 2, T = g - DH;
      if (open > 0) {
        fill(ctx, (c) => c.rect(L, T, DW, DH), { color: 'rgba(255,236,190,0.9)', glow: 40, alpha: open * alpha });
        bloom(ctx, DX, g - DH / 2, 360, C.gold, 0.4 * open);
      }
      const pw = DW * (1 - 0.85 * ease.inOut(open));
      fill(ctx, (c) => c.rect(L, T, pw, DH), { color: '#101012', alpha });
      neon(ctx, (c) => c.rect(L, T, DW, DH), { color: C.soft, width: 5, glow: 10, alpha, core: 0.3 });
      stroke(ctx, (c) => c.rect(L, T, pw, DH), { color: C.soft, width: 3, alpha });
      circle(ctx, L + pw - 18, g - DH / 2, 6, { fill: true, color: C.soft, alpha });
      if (open < 0.3) line(ctx, L + 8, g - 2, L + DW - 8, g - 2, { color: C.red, width: 4, glow: 18, alpha: alpha * (1 - open * 3) });
    };

    // ---- Top: imagines it ----
    const g1 = 860;
    const grow1 = 1 + 0.3 * ease.inOut(seg(t, 1, 8));
    const fear = seg(t, 2.5, 5);
    const x1 = lerp(400, 230, ease.inOut(seg(t, 2.5, 5.5)));
    let p1 = POSE.stand();
    if (t > 2.5 && t < 5.5) p1 = { ...POSE.walk(-x1 / 22, 0.5), lean: -0.15 };
    p1 = blendPose(p1, POSE.crouch(), ease.inOut(seg(t, 5.5, 6.3)));
    const dim1 = 1 - 0.3 * seg(t, 8.6, 9.8);
    floorLine(ctx, g1);
    const drawT = () => { door(g1, 0, { alpha: dim1 }); figure(ctx, x1, g1, p1, { scale: 1.2, color: mix(C.white, C.red, fear * 0.7), glow: fear * 8, alpha: dim1 }); };
    monster(DX + 210, g1, grow1, { alpha: dim1 });
    reflect(ctx, g1, drawT, { alpha: 0.22, depth: 140 });
    drawT();
    label(ctx, "Imagines what's behind it", W / 2, g1 + 70, { size: 26, color: mix(C.soft, C.red, fear) });

    // ---- Bottom: opens it ----
    const g2 = 1350;
    const open = seg(t, 4.7, 5.6);
    const shrink = 1 - ease.inOut(seg(t, 4.9, 5.8));
    const grow2 = (1 + 0.25 * ease.inOut(seg(t, 1, 4.5))) * shrink;
    const step = ease.inOut(seg(t, 3.0, 4.6));
    const x2 = lerp(400, DX - DW / 2 - 40, step) + 140 * ease.inOut(seg(t, 6.2, 8.0));
    let p2 = t > 3.0 && t < 4.6 ? POSE.walk(x2 / 24, 0.6) : POSE.stand();
    p2 = blendPose(p2, POSE.push(0, 0.2), Math.sin(Math.PI * seg(t, 4.5, 5.3)));
    if (t > 6.2 && t < 8.0) p2 = POSE.walk(x2 / 24, 0.6);
    const win = seg(t, 8.0, 8.4);
    p2 = blendPose(p2, POSE.celebrate(t * 6), ease.outBack(seg(t, 8.2, 8.7)));
    const reveal = seg(t, 5.4, 6.0);
    floorLine(ctx, g2);
    monster(DX + 210, g2, grow2);
    const tiny = (alpha) => {
      // The "monster": a tiny fuzzball next to a candle
      const hop = ease.out(seg(t, 5.8, 6.5)), bx = DX + 20 + 110 * hop, by = g2 - 18 - Math.sin(Math.PI * hop) * 40;
      stroke(ctx, (c) => { for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; c.moveTo(bx + Math.cos(a) * 14, by + Math.sin(a) * 14); c.lineTo(bx + Math.cos(a) * 23, by + Math.sin(a) * 23); } }, { color: '#9a9aa2', width: 3, alpha });
      circle(ctx, bx, by, 15, { fill: true, color: '#55555c', alpha });
      circle(ctx, bx - 5, by - 3, 3.5, { fill: true, color: '#fff', alpha });
      circle(ctx, bx + 5, by - 3, 3.5, { fill: true, color: '#fff', alpha });
      line(ctx, DX - 30, g2, DX - 30, g2 - 34, { color: '#e8d9b0', width: 9, alpha });
      fill(ctx, (c) => c.ellipse(DX - 30, g2 - 44, 5, 9, 0, 0, Math.PI * 2), { color: C.gold, glow: 16, alpha });
    };
    const drawB = () => { door(g2, open); tiny(reveal); figure(ctx, x2, g2, p2, { scale: 1.2, glow: win * 14 + reveal * 4, color: mix(C.white, '#FFF4D6', win) }); };
    reflect(ctx, g2, drawB, { alpha: 0.22, depth: 140 });
    drawB();
    if (reveal > 0) text(ctx, 'that was it?', DX + 140, g2 - 80, { size: 30, weight: 600, color: C.soft, alpha: seg(t, 6.3, 6.7) * (1 - seg(t, 8.6, 9.0)) });
    burst(ctx, x2, g2 - 230, seg(t, 8.2, 9.3), C.gold, 16, 150);
    label(ctx, 'Opens the door', W / 2, g2 + 70, { size: 26, color: mix(C.soft, C.gold, seg(t, 5.5, 6.5)), glow: win * 12 });
  },
};
