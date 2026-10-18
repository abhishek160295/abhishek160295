// Transformation with a fake-out: coal under pressure cracks (looks like failure), then turns into a diamond.
const SCENE = {
  duration: 11.5,
  meta: {
    title: 'Pressure',
    cover: 9.6,
    caption: `The cracks aren't the end.
They're the part right before the change.

Every diamond spent time looking broken.

If life is squeezing you right now, stay in the press.

Send this to someone carrying a lot lately.`,
    hashtags: ['pressure', 'resilience', 'mindset', 'discipline', 'growthmindset', 'nevergiveup', 'selfimprovement', 'motivation'],
  },
  draw(ctx, t) {
    const CX = W / 2, CY = 980, R = 140, FLASH = 6.0;
    if (!this.coal) {
      const r = rng(13);
      this.coal = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2, rr = R * (0.85 + r() * 0.25);
        return [Math.cos(a) * rr, Math.sin(a) * rr];
      });
      this.cracks = [0.3, 1.9, 3.3, 4.6, 5.6].map((a, i) => branches(31 + i, Math.cos(a) * 18, Math.sin(a) * 18, a, 58, 2, { spread: 0.9, shrink: 0.75, kids: 2 }));
      this.facets = [[0, 6], [2, 8], [4, 10], [1, 5], [7, 11]];
      this.sparks = Array.from({ length: 7 }, () => [r() * Math.PI * 2, 190 + r() * 120, r() * 6]);
    }

    ambient(ctx, t, 6);

    captionSeq(ctx, t, [
      [0, 'Put coal under\nenough pressure...'],
      [2.7, 'it cracks.', { color: C.red, glow: 18 }],
      [4.0, 'Most people stop here.', { color: C.red, glow: 14 }],
      [5.0, 'Stay a little longer...'],
      [FLASH, 'and it becomes this.', { color: '#BFE6FF', glow: 24, halo: true }],
      [8.4, "Pressure isn't breaking you.\nIt's making you.", { halo: true, glow: 16 }],
    ], CX, 420);

    // Pressure plates
    const squeeze = ease.inOut(seg(t, 0.2, 2.6)) * 0.85 + 0.15 * seg(t, 2.6, FLASH);
    const release = ease.out(seg(t, FLASH, FLASH + 0.8));
    const gap = lerp(R + 115, R - 4, squeeze) + release * 260;
    const plateA = 1 - seg(t, FLASH + 0.2, FLASH + 0.9);
    const heat = seg(t, 2.6, FLASH);
    const plateColor = mix(C.white, C.red, heat * 0.8);
    for (const dir of [-1, 1]) {
      const y = CY + dir * (gap + 14);
      neon(ctx, (c) => { c.moveTo(CX - 250, y); c.lineTo(CX + 250, y); }, { color: plateColor, width: 22, glow: 26, alpha: plateA, core: 0.25 });
      for (const dx of [-150, 0, 150]) {
        const ay = y + dir * 60, tip = y + dir * 26;
        const k = 0.6 + 0.4 * Math.sin(t * 8 + dx);
        stroke(ctx, (c) => { c.moveTo(CX + dx, ay + dir * 40); c.lineTo(CX + dx, tip); c.moveTo(CX + dx - 14, tip + dir * 16); c.lineTo(CX + dx, tip); c.lineTo(CX + dx + 14, tip + dir * 16); },
          { color: plateColor, width: 5, glow: 12, alpha: plateA * k * (1 - seg(t, FLASH - 0.4, FLASH)) });
      }
    }

    // Coal: compresses, shakes, cracks, heats up
    if (t < FLASH) {
      const shake = (seg(t, 2.6, FLASH) ** 2) * 9;
      const jx = Math.sin(t * 71) * shake, jy = Math.cos(t * 53) * shake;
      const sy = 1 - 0.1 * squeeze, sx = 1 + 0.05 * squeeze;
      ctx.save();
      ctx.translate(CX + jx, CY + jy);
      ctx.scale(sx, sy);
      const body = (c) => { this.coal.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
      fill(ctx, body, { color: '#1b1b1d' });
      neon(ctx, body, { color: mix('rgba(255,255,255,0.55)', C.red, heat), width: 5, glow: 10 + heat * 24, core: 0.3 });
      for (const [a, b] of this.facets) {
        const pa = this.coal[a], pb = this.coal[b];
        stroke(ctx, (c) => { c.moveTo(pa[0], pa[1]); c.quadraticCurveTo(0, 0, pb[0], pb[1]); }, { color: 'rgba(255,255,255,0.10)', width: 2 });
      }
      ctx.save();
      ctx.beginPath(); body(ctx); ctx.clip();
      const crackP = ease.out(seg(t, 2.6, 5.4));
      const hot = seg(t, 5.0, FLASH);
      const crackColor = mix(C.red, '#FFFFFF', hot);
      for (const cr of this.cracks) drawBranches(ctx, cr, crackP, { color: crackColor, width: 4 + hot * 3, glow: 16 + hot * 30 });
      ctx.restore();
      ctx.restore();
      bloom(ctx, CX, CY, 260 + hot * 200, mix(C.red, '#FFFFFF', hot), 0.15 * heat + 0.5 * hot);
    }

    // Flash and shell shatter
    const fl = seg(t, FLASH - 0.05, FLASH + 0.6);
    if (fl > 0 && fl < 1) {
      ctx.save(); ctx.globalAlpha = 0.9 * (1 - ease.out(fl)); ctx.fillStyle = '#EAF6FF'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    shatter(ctx, CX, CY, seg(t, FLASH, FLASH + 1.4), { color: '#3a3a3e', n: 26, r: 520, seed: 4 });

    // Diamond
    const dk = ease.outBack(seg(t, FLASH, FLASH + 0.7));
    if (dk > 0) {
      const float = Math.sin((t - FLASH) * 1.6) * 8;
      bloom(ctx, CX, CY, 420, '#7CC8FF', 0.32);
      diamond(ctx, CX, CY - 40 + float, 330 * dk, { t, glow: 40 });
      this.sparks.forEach(([a, d, ph], i) => {
        const tw = Math.max(0, Math.sin(t * 3 + ph)) * seg(t, FLASH + 0.5, FLASH + 1.2);
        twinkle(ctx, CX + Math.cos(a) * d, CY - 40 + Math.sin(a) * d * 0.8, 18 * tw, { color: '#DFF3FF' });
      });
      burst(ctx, CX, CY, seg(t, FLASH, FLASH + 1.2), '#9FD8FF', 22, 320);
    }

    // Pressure readout
    const atm = Math.round(55000 * ease.in(seg(t, 0.2, FLASH)));
    const done = t >= FLASH;
    label(ctx, done ? 'Formed' : 'Pressure', CX, 1385, { size: 24, color: done ? '#9FD8FF' : C.soft });
    text(ctx, done ? 'DIAMOND' : `${atm.toLocaleString('en-US')} atm`, CX, 1430, { size: 40, weight: 700, color: done ? '#BFE6FF' : mix(C.white, C.red, heat), glow: done ? 20 : heat * 14, spacing: 2 });
  },
};
