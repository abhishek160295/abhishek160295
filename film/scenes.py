"""DISCIPLINE: every scene, keyed to scene-relative time."""
import math
import numpy as np
from engine import *
from chars import Bean, Villain, red_text, shatter
from props import *

LEO = Bean(seed=1)
MON = Villain(seed=3)
MAYA = Bean(skin=(150, 106, 80), beanie=(96, 214, 168), seed=2)
MAYA_V = Villain(seed=7)
SAM = Bean(skin=(206, 160, 118), beanie=(236, 128, 44), seed=5, h=186, w=88, leg=52)
SAM_V = Villain(seed=8)
COURIER = Bean(skin=(120, 88, 66), beanie=(230, 196, 70), seed=9)
EXTRA = [Bean(skin=(90, 90, 96), beanie=c, seed=10 + i) for i, c in
         enumerate([(70, 70, 120), (110, 70, 70), (70, 100, 80), (100, 90, 60)])]
FY = 820
LA = 47.0  # Leo half-width


# ====================================================================== helpers
def walk(t, rate=1.7, stride=22, lift=12, arm=14, run=False, dirx=1):
    ph = t * rate * 2 * math.pi
    s, c = math.sin(ph), math.cos(ph)
    if run:
        stride, lift, arm = 30, 26, 22
    lf = (-LA * 0.45 + stride * s * dirx, -max(0, c) * lift)
    rf = (LA * 0.45 - stride * s * dirx, -max(0, -c) * lift)
    if run:
        lh = (-LA * 0.95 - arm * s * dirx * 0.6, -58 - 206 * 0.3 + abs(s) * 10)
        rh = (LA * 0.95 + arm * s * dirx * 0.6, -58 - 206 * 0.3 + abs(c) * 10)
    else:
        lh = (-LA * 1.08 - arm * s * dirx * 0.5, -58 - 16)
        rh = (LA * 1.08 + arm * s * dirx * 0.5, -58 - 16)
    bob = abs(c) * (7 if run else 4)
    p = dict(lf=lf, rf=rf, lh=lh, rh=rh, rot=(0.10 * dirx if run else 0.02 * dirx * s))
    return p, bob


def cam_push(f, t, dur, z0, z1, c0, c1, ease=smooth):
    u = ease(t / dur)
    f.cam(lerp(z0, z1, u), lerp(c0[0], c1[0], u), lerp(c0[1], c1[1], u))


def whip_in(f, t, d=0.35, dist=900, dirx=1):
    if t < d:
        u = 1 - eout(t / d)
        f.cx += dirx * dist * u
        f.whip = 140 * u


def whip_out(f, t, dur, d=0.3, dist=900, dirx=1):
    if t > dur - d:
        u = ein((t - (dur - d)) / d)
        f.cx += dirx * dist * u
        f.whip = 140 * u


def say(f, x, y, s, col=CREAM, t=0, t0=0, t1=99, size=46):
    if t < t0 or t > t1:
        return
    a = smooth((t - t0) / 0.2) * smooth((t1 - t) / 0.25)
    n = len(s) * clamp((t - t0) / max(0.25, len(s) * 0.035))
    f.text(x - f.text_w(s, size) / 2, y, s[:int(round(n))], size, lerpc(BG, col, a), HAND, 'lm')


def vline(f, x, y, s, t, t0, t1=99, size=56):
    if t < t0 or t > t1 + 0.3:
        return
    a = smooth((t1 + 0.3 - t) / 0.3) if t > t1 else 1.0
    red_text(f, x, y, s, size, alpha=a, appear=(t - t0) / max(0.3, len(s) * 0.045))


def label(f, s, alpha, y=196, size=62, sub=None, col=WHITE):
    if alpha <= 0:
        return
    f.otext(960, y, s, size, col, GAEGU, 'mm', alpha, stroke=4)
    if sub:
        f.otext(960, y + 58, sub, 40, (196, 194, 188), HAND, 'mm', alpha, stroke=3)


def burst(f, x, y, t, n=60, seed=1, spread=120, col=RED):
    if t < 0 or t > 1.6:
        return
    r = np.random.default_rng(seed)
    for i in range(n):
        ox, oy = r.normal(0, spread * 0.3), r.normal(0, spread * 0.6)
        vx, vy = r.normal(0, 70), -r.uniform(40, 160)
        px = x + ox + vx * t + math.sin(t * 3 + i) * 10
        py = y + oy + vy * t
        a = clamp(1 - t / 1.6) * r.uniform(0.5, 1)
        f.dot(px, py, r.uniform(1.4, 3.2), lerpc(BG, col, a))
        if i % 8 == 0:
            f.light(px, py, 14, col, 0.4 * a)


HIT = 0.95   # seconds into a montage cut when the thrown excuse hits Leo


def throw_line(f, t, s, vp, lp, size=64, seed=1):
    """Villain throws an excuse at Leo: it pops in big, holds long enough to read,
    flies at him and shatters into sparks on impact."""
    if not s or t < 0:
        return 0
    if t < HIT:
        pop = 1 - eout(seg(t, 0.0, 0.2))
        u = ein(seg(t, 0.72, HIT))
        x, y = lerp(vp[0], lp[0], u), lerp(vp[1], lp[1], u)
        if t < 0.72:
            x += math.sin(t * 40) * 2.5 * (1 - pop)
        red_text(f, x, y, s, size * (1 + 0.35 * pop), alpha=clamp(t / 0.08), col=(255, 52, 44), glow=0.6, wob=0.4,
                 stroke=5)
        return 0
    shatter(f, lp[0], lp[1], s, size, t - HIT, (lp[0] + (lp[0] - vp[0]) * 0.1, lp[1] + 60), seed=seed)
    return t - HIT


def fg_plant(f, x, fy, s=1.0):
    f.layer(1.3)
    for i, a in enumerate((-0.9, -0.4, 0.1, 0.6, 1.0)):
        L = 240 * s * (0.8 + 0.2 * math.cos(i))
        tip = (x + math.sin(a) * L, fy - math.cos(a) * L)
        mid = (x + math.sin(a) * L * 0.5 + 30 * s, fy - math.cos(a) * L * 0.55)
        f.poly([(x, fy), mid, tip, (mid[0] - 40 * s, mid[1] + 10)], (8, 8, 10), FAINT, 2)
    f.rect(x - 60 * s, fy - 10, x + 60 * s, fy + 140, (8, 8, 10), FAINT, 2)
    f.layer(1.0)


def leo_sit(x, seat_y, feet_dx=(-30, 20), fy=FY):
    y = seat_y + 58
    return y, dict(lfw=(x + feet_dx[0], fy), rfw=(x + feet_dx[1], fy))


def summon(t, t_in, t_out=999.0, d_in=0.7, d_out=0.6):
    """Villain presence 0..1: rises out of Leo's shadow at t_in, sinks back in at t_out."""
    return min(eout(seg(t, t_in, t_in + d_in)), 1 - ein(seg(t, t_out, t_out + d_out)))


def vdraw(f, t, k, x, y, s, p, src, t_in=-9.0, t_out=999.0, halo=1.0, V=None, seed=3):
    """Draw a villain at presence k, travelling between Leo's shadow (src) and its spot."""
    V = V or MON
    if t_in - 0.4 < t < t_in + 0.2 or t_out - 0.3 < t < t_out + 0.1:
        f.light(src[0], src[1], 90, RED, 0.35)
        f.ell(src[0], src[1] + 2, 70, 9, (40, 4, 4), None, amp=0)
    if k <= 0.003:
        return
    xx, yy = lerp(src[0], x, k), lerp(src[1], y, k)
    ss = s * lerp(0.12, 1.0, k)
    V.draw(f, xx, yy, ss, p, t, halo=halo * k, alpha=clamp(k * 1.5))
    burst(f, xx, yy - 150 * ss, t - t_in, 40, seed, 120 * ss)
    if t > t_out:
        burst(f, xx, yy - 150 * ss, t - t_out, 50, seed + 1, 140 * ss)


def kinetic(f, words, y, size, t, t0, stagger=0.12, path=GAEGU, cols=None, alpha=1.0, pop=0.35, x=960):
    """Words pop in one by one around a fixed layout. cols: per-word colour (None = white)."""
    sp = font(path, size).getlength(' ')
    ws = [font(path, size).getlength(w) for w in words]
    total = sum(ws) + sp * (len(words) - 1)
    cx = x - total / 2
    for i, w in enumerate(words):
        ta = t0 + i * stagger
        u = seg(t, ta, ta + 0.28)
        if u > 0:
            sc = 1 + pop * (1 - back(u)) * -1 if u < 1 else 1
            sc = lerp(1 + pop, 1.0, eout(u))
            col = (cols[i] if cols and cols[i] else WHITE)
            f.otext(cx + ws[i] / 2, y + 10 * (1 - eout(u)), w, size * sc, col, path, 'mm', alpha * clamp(u * 2.5),
                    stroke=3)
        cx += ws[i] + sp


def kicker(f, n, title, t, t0, t1, y=186):
    """Restart chapter tag: red number plate + white title, top-center."""
    a = smooth(seg(t, t0, t0 + 0.25)) * (1 - smooth(seg(t, t1 - 0.3, t1)))
    if a <= 0:
        return
    sl = 40 * (1 - eout(seg(t, t0, t0 + 0.35)))
    num = 'RESTART #%d' % n
    w1 = font(GAEGU, 48).getlength(num)
    w2 = font(GAEGU, 52).getlength(title)
    tot = w1 + w2 + 70
    x0 = 960 - tot / 2 + sl
    f.otext(x0 + w1 / 2 + 14, y, num, 48, (255, 62, 58), GAEGU, 'mm', a, stroke=5)
    f.otext(x0 + w1 + 44, y, '\u00b7', 46, (150, 150, 150), GAEGU, 'mm', a, stroke=3)
    f.otext(x0 + w1 + 70 + w2 / 2, y, title, 52, WHITE, GAEGU, 'mm', a, stroke=5)


def plate(f, num, s, sub, t, t0, t1, y=200):
    """Rule plate: big red numeral, white rule, grey example line. Slides in."""
    a = smooth(seg(t, t0, t0 + 0.25)) * (1 - smooth(seg(t, t1 - 0.3, t1)))
    if a <= 0:
        return
    u = eout(seg(t, t0, t0 + 0.4))
    w = font(GAEGU, 66).getlength(s)
    x = 960 + 40 + (1 - u) * 60
    f.otext(x - w / 2 - 60, y, num, 110 * lerp(1.4, 1, u), RED, GAEGU, 'mm', a, stroke=5)
    f.otext(x, y, s, 66, WHITE, GAEGU, 'mm', a, stroke=5)
    if sub:
        f.otext(x, y + 64, sub, 40, (200, 198, 190), HAND, 'mm', a * smooth(seg(t, t0 + 0.35, t0 + 0.6)), stroke=3)


# ====================================================================== 01 / 17  THE WALL
def _note_slots():
    r = np.random.default_rng(11)
    slots = []
    for j in range(6):
        for i in range(9):
            slots.append((345 + i * 92 + r.normal(0, 6), 250 + j * 74 + r.normal(0, 5), r.normal(0, 0.10)))
    r.shuffle(slots)
    return slots[:46]


SLOTS = _note_slots()
SLAP = (1180, 600)


def wall_scene(f, t, payoff=False):
    dur = 11.0 if payoff else 6.5
    cam_push(f, t, dur, 1.16, 1.3, (1000, 500), (1060, 490))
    gt = 5.6 if payoff else 2.3            # slap moment
    if gt - 0.1 < t < gt + 0.12:
        f.shx = math.sin(t * 90) * 5
    # back layer: window
    f.layer(0.7)
    if payoff:
        window(f, 1440, 230, 1720, 520, t, 'sunrise')
        window_beam(f, 1440, 230, 1720, 520, WARM, 0.22, dx=-380)
        f.ambient((255, 160, 90), 0.02)
    else:
        window(f, 1440, 230, 1720, 520, t, 'night', moon=True)
    f.layer(1.0)
    floor(f, FY)
    f.line([(-200, FY - 40), (1360, FY - 40)], FAINT, 1.6)
    # lamp on nightstand, lighting the wall
    top = nightstand(f, 1600, FY)
    clock_txt, lab = ('05:30', 'TUE') if payoff else (('23:59', 'SUN') if t < 1.0 else ('00:00', 'MON'))
    clock(f, 1600, top - 44, clock_txt, lab, 0.8)
    if not payoff:
        f.light(760, 430, 520, WARM, 0.10)
        f.light(1300, 560, 160, WARM, 0.12)
    # notes
    fall0 = 0.9
    for i, (x, y, a) in enumerate(SLOTS):
        if payoff and t > fall0:
            d = fall0 + (1 - (x - 300) / 950) * 1.4 + (i % 5) * 0.04
            if t > d:
                u = t - d
                yy = min(FY - 6, y + 0.5 * 1400 * u * u)
                xx = x + math.sin(u * 7 + i) * 26 * min(1, u * 2)
                ang = a + (math.sin(u * 5 + i) * 0.9 if yy < FY - 6 else (i % 3 - 1) * 1.3)
                sticky(f, xx, yy, 'DAY 1', 0.9, ang=ang)
                continue
        sticky(f, x, y, 'DAY 1', 0.9, ang=a)
    # Leo
    lx = 1300
    p = dict(face=-0.55, band=payoff, light=(-0.8, -0.4))
    hold = None
    if t < gt - 0.9:
        p.update(eyes='half', brow=-0.3 if not payoff else 0.5, mouth='flat' if not payoff else 'smile',
                 look=(-2, 3), lh=(-30, -120), rh=(10, -110))
        hold = (lx - 30, FY - 120)
        if t < gt - 1.6 and (payoff and t > 3.4 or not payoff):
            p['rh'] = (5 + 6 * math.sin(t * 22), -112 + 3 * math.cos(t * 17))
        if payoff and t < 3.2:          # sweep
            u = smooth(seg(t, 0.4, 1.4))
            p.update(lh=(lerp(-30, -150, u), lerp(-120, -260, u)), eyes='open', mouth='tense', brow=0.8)
            hold = None
    elif t < gt:
        u = eout(seg(t, gt - 0.9, gt - 0.35))
        v = ein(seg(t, gt - 0.2, gt))
        hx, hy = lerp(lx - 30, lx + 20, u), lerp(FY - 120, FY - 210, u)
        hx, hy = lerp(hx, SLAP[0] + 8, v), lerp(hy, SLAP[1] + 6, v)
        p.update(lhw=(hx, hy), eyes='open', brow=0.4 if payoff else -0.2, mouth='tense', sq=lerp(1, 1.04, u))
        hold = (hx, hy)
    else:
        u = smooth(seg(t, gt + 0.25, gt + 1.0))
        p.update(lhw=(lerp(SLAP[0] + 8, lx - 40, u), lerp(SLAP[1] + 6, FY - 80, u)),
                 sq=lerp(0.95, 1.0, seg(t, gt, gt + 0.3)))
        if payoff:
            p.update(eyes='happy' if t > gt + 0.9 else 'open', mouth='smile', brow=0.2, face=lerp(-0.55, 0, u))
        else:
            p.update(eyes='half', mouth='frown', brow=-0.6, face=lerp(-0.55, -0.1, u), look=(0, 2))
    txt = 'DAY 181' if payoff else 'DAY 1'
    if t >= gt:
        sticky(f, SLAP[0], SLAP[1], txt, 0.9, col=(206, 190, 92) if payoff else NOTE, ang=-0.05)
        if payoff:
            f.light(SLAP[0], SLAP[1], 60, WARM, 0.25 * smooth(seg(t, gt, gt + 0.5)))
    LEO.draw(f, lx, FY, 1.0, p, t)
    if hold:
        sticky(f, hold[0] - 8, hold[1] - 10, txt if t > (3.6 if payoff else 0) else '', 0.8, ang=0.1)
    fg_plant(f, 120, FY + 40)


def s01(f, t):
    wall_scene(f, t, False)


def s17(f, t):
    wall_scene(f, t, True)


# ====================================================================== 02 REVEAL
def s02(f, t):
    f.cam(1.0 + 0.04 * t, 960, 540)
    op = eout(seg(t, 1.3, 1.9)) if t < 3.2 else eout(seg(t, 1.3, 1.9))
    MON.draw(f, 960, 1323, 3.0, dict(eyes=op, grin=0.9 * seg(t, 2.2, 2.9), arms=True, breath=0.5), t,
             halo=0.22 * seg(t, 1.2, 2.6))
    out = 1 - smooth(seg(t, 3.05, 3.45))
    kinetic(f, "Here's what stopped him.".split(), 300, 72, t, 0.2, 0.14, alpha=out, pop=0.25)
    b = smooth(seg(t, 2.1, 2.4)) * out
    f.otext(960, 880, 'the voice that always says  "later."', 54, (255, 70, 66), HAND, 'mm', b, stroke=3)


# ====================================================================== 03 / 14 BEDROOM
def bedroom(f, t, again=False):
    dur = 10 if again else 9
    if not again:
        if t < 5.8:
            cam_push(f, t, 5.8, 1.0, 1.14, (960, 520), (1060, 540))
        else:
            cam_push(f, t - 5.8, 0.6, 1.14, 1.22, (1060, 540), (880, 560), eout)
    else:
        if t < 7.2:
            cam_push(f, t, 7.2, 1.0, 1.16, (960, 520), (1000, 520))
        else:
            cam_push(f, t - 7.2, 1.2, 1.16, 1.08, (1000, 520), (960, 520), eout)
    jolt = 6.1 if not again else 7.3
    if (not again) and jolt < t < jolt + 0.25:
        f.shx = math.sin(t * 80) * 6
    day = 0.0 if again else smooth(seg(t, 4.4, 6.0))
    f.layer(0.7)
    window(f, 220, 250, 460, 520, t, 'dawn' if day < 0.5 else 'sunrise', moon=day < 0.3)
    window_beam(f, 220, 250, 460, 520, COLD if day < 0.5 else WARM, 0.08 + 0.18 * day, dx=420)
    f.layer(1.0)
    f.ambient((120, 140, 200), 0.015 + 0.03 * day)
    floor(f, FY)
    door(f, 1650, 1820, 380, FY)
    bag(f, 440, FY)
    f.text(440, FY - 34, 'GYM', 22, (120, 120, 126), GAEGU)
    top = bed(f, 540, 1180, FY)
    pillow(f, 650, top - 14)
    ns = nightstand(f, 1290, FY)
    # clock
    beeping = (t < 2.6) if not again else (t < 1.6)
    if not again:
        if t < 2.6:
            ct = '05:30'
        elif t < 4.4:
            ct = '05:35'
        else:
            m = int(lerp(5 * 60 + 35, 7 * 60 + 48, smooth(seg(t, 4.4, 6.0))))
            ct = '%02d:%02d' % (m // 60, m % 60)
    else:
        ct = '05:30'
    on = (not beeping) or (t * 4 % 1 < 0.6)
    late = (not again) and t > 6.0
    clock(f, 1290, ns - 44, ct, None, 0.8, on=on or late)
    # Leo in bed
    up = back(seg(t, jolt, jolt + 0.3)) if t > jolt else 0
    rot = lerp(-math.pi / 2, -0.08, up)
    p = dict(rot=rot, hip=True, legs=False, arms=up > 0.3, light=(0.6, -0.6), eyes='closed', mouth='flat', blink=False)
    if again and t > 5.2:
        p.update(eyes='open', brow=0.6, mouth='tense', blink=True)
    if up > 0:
        p.update(eyes='wide', mouth='o' if not again else 'tense', brow=-0.6 if not again else 0.7,
                 sweat=2 if not again else 0, blink=False)
        if again:
            p.update(eyes='open', mouth='smile' if t > jolt + 0.8 else 'tense', brow=0.5)
    snore = 0.03 * math.sin(t * 2.0) if up == 0 else 0
    LEO.draw(f, 900, top + 2 - snore * 40, 1.0, p, t)
    blanket(f, lerp(760, 905, up), 1176, top, bump=lerp(1.0, 0.5, up))
    # villain
    if not again:
        vs = 1.55
        reach = smooth(seg(t, 1.8, 2.5)) * (1 - smooth(seg(t, 3.0, 3.6)))
        vp = dict(face=-0.5, grin=0.7, lhw=(lerp(1400, 1290, reach), lerp(FY - 130, ns - 70, reach)))
        if t > jolt:
            vp.update(grin=1.0, face=-0.3)
        k = summon(t, 1.3, 6.6)
        vdraw(f, t, k, 1490, FY, vs, vp, (900, FY), 1.3, 6.6)
        vline(f, 1470, 300, 'Five more minutes.', t, 2.5, 5.6)
        kicker(f, 1, 'THE ALARM', t, 2.6, 5.4)
    else:
        shrink = eout(seg(t, jolt, jolt + 0.5))
        vs = lerp(2.25, 1.3, shrink)
        reach = smooth(seg(t, 0.9, 1.5)) * (1 - smooth(seg(t, 1.8, 2.3)))
        talk = 0.0
        if 2.7 < t < 4.8:
            talk = 0.35 + 0.45 * abs(math.sin(t * 13)) * abs(math.sin(t * 5.1))
        vp = dict(face=-0.6, grin=0.9 if shrink < 0.5 else 0.0, talk=talk, eyes=lerp(1.0, 1.7, shrink),
                  lhw=(lerp(1400, 1290, reach), lerp(FY - 160, ns - 70, reach)), rot=-0.12 * (1 - shrink))
        k = summon(t, 0.3, 8.6)
        vdraw(f, t, k, 1530, FY, vs, vp, (900, FY), 0.3, 8.6)
        if 2.65 < t < 5.2:
            red_text(f, 1300, 230, 'Just start Monday.', 74, alpha=smooth(seg(t, 2.65, 2.85)) * smooth((1 - seg(t, 4.9, 5.2))),
                     glow=0.6, appear=(t - 2.65) / 0.9)
        if t > jolt:
            burst(f, 1530, 400, t - jolt, 70, 3, 200)
        # countdown caption handled via subs; label after
        plate(f, '1', 'DON\'T ASK. COUNT 5 TO 1.', 'The feeling never votes yes. So stop asking it.', t, jolt + 0.3, 10.2)
    fg_plant(f, 90, FY + 40, 0.9)


def s03(f, t):
    bedroom(f, t, False)


def s14(f, t):
    bedroom(f, t, True)


# ====================================================================== 04 RESEARCH
def screen_video(f, x0, y0, x1, y1, t, up_next):
    cx = (x0 + x1) / 2
    if not up_next:
        f.rect(x0 + 10, y0 + 10, x1 - 10, y1 - 36, (30, 40, 70), None, amp=0)
        f.text(cx, y0 + 44, 'HOW TO BE', 26, (230, 230, 240), GAEGU)
        f.text(cx, y0 + 74, 'DISCIPLINED', 34, (255, 210, 90), GAEGU)
        f.text(cx, y0 + 108, '(10 TIPS)', 22, (200, 200, 210), GAEGU)
        f.line([(x0 + 14, y1 - 22), (x1 - 14, y1 - 22)], (70, 70, 80), 4, amp=0)
        f.line([(x0 + 14, y1 - 22), (lerp(x0 + 14, x1 - 14, 0.4 + t * 0.06), y1 - 22)], (220, 50, 50), 4, amp=0)
    else:
        f.text(cx, y0 + 30, 'UP NEXT', 20, (180, 180, 190), GAEGU)
        f.rect(x0 + 30, y0 + 46, x1 - 30, y1 - 40, (60, 40, 30), None, amp=0)
        f.text(cx, y0 + 84, '5AM ROUTINE', 30, (255, 220, 120), GAEGU)
        f.text(cx, y0 + 114, 'OF A CEO', 26, (240, 240, 240), GAEGU)
        f.text(cx, y1 - 22, 'playing in 3...', 18, (170, 170, 180), HAND)


def s04(f, t):
    cam_push(f, t, 9, 1.12, 1.3, (1000, 520), (1080, 530))
    f.layer(0.7)
    window(f, 200, 250, 430, 520, t, 'night', moon=True)
    f.layer(1.0)
    floor(f, FY)
    m = int(lerp(19 * 60, 23 * 60 + 40, smooth(seg(t, 3.0, 7.0))))
    clock(f, 620, 300, '%02d:%02d' % (m // 60, m % 60), None, 0.85)
    desk(f, 580, 1300, 640, FY)
    book(f, 1190, 640, 140, 30, (70, 50, 50), 'CHEM')
    book(f, 700, 640, 120, 26, (50, 60, 80), 'NOTES')
    sticky(f, 700, 580, 'EXAM FRI', 0.95, ang=-0.12)
    desk_lamp(f, 1220, 640, on=False, dirx=-1)
    sx0, sy0, sx1, sy1 = laptop(f, 940, 640, 330, 200, k=1.0)
    screen_video(f, sx0, sy0, sx1, sy1, t, t > 5.2)
    f.light(1300, 560, 160, (120, 150, 230), 0.25)
    # villain behind Leo
    lean = 0.04 * math.sin(t * 1.3)
    k = summon(t, 0.8, 7.4)
    vdraw(f, t, k, 1600, FY, 1.6, dict(face=-0.6, grin=0.8, rot=-0.08 + lean, lhw=(1420, 560)), (1380, FY), 0.8, 7.4)
    vline(f, 1560, 330, 'Watch one more first.', t, 1.3, 6.0)
    kicker(f, 6, 'THE RESEARCH', t, 1.6, 4.6)
    chair(f, 1400, FY, facing=-1)
    y, p = leo_sit(1380, FY - 150, (-50, -10))
    p.update(face=-0.75, eyes='half', mouth='flat', brow=-0.2 if t < 6 else -0.7, look=(-2, 0), lhw=(1300, 636),
             rhw=(1320, 650), light=(-0.9, -0.2))
    if t < 1.5:
        p.update(eyes='open', brow=0.5, mouth='tense', lhw=(1200, 612), face=-0.5)
    if t > 6.5:
        p['mouth'] = 'frown'
    LEO.draw(f, 1380, y, 1.0, p, t)


# ====================================================================== 05 TUESDAY
def street(f, t, cx_shift=0, lit=0.3, fy=840, wet=True):
    f.layer(0.4)
    for i in range(9):
        x0 = -300 + i * 300
        building(f, x0, x0 + 260, 280 + (i * 53 % 120), fy, seed=i, lit=0.1, col=(12, 12, 15), k=0.5)
    f.layer(1.0)


def s05(f, t):
    lx = lerp(120, 800, seg(t, 0, 3.4)) if t < 6.2 else lerp(800, 160, seg(t, 6.4, 9.0))
    f.cam(1.16, 960 + (lx - 700) * 0.3, 540)
    fy = 840
    street(f, t, fy=fy)
    f.layer(0.75)
    building(f, -100, 500, 300, fy, seed=21, lit=0.3)
    f.layer(1.0)
    # gym
    f.rect(1150, 260, 1840, fy, (17, 17, 20), CHALK, 2.6)
    f.rect(1200, 500, 1780, 800, (60, 48, 34), CHALK, 2.4)
    f.light(1490, 650, 300, WARM, 0.45)
    for i, gx in enumerate((1290, 1460, 1640)):
        ph = math.sin(t * 3 + i * 2)
        EXTRA[i].draw(f, gx, 800, 0.55, dict(lh=(-60, -170 + ph * 30), rh=(60, -170 + ph * 30), face=0.2), t)
        f.line([(gx - 60, 800 - 0.55 * (170 - ph * 30) - 10), (gx + 60, 800 - 0.55 * (170 - ph * 30) - 10)], CHALK, 3)
    f.line([(1200, 650), (1780, 650)], DIM, 1.6)
    f.text(1495, 370, 'GYM', 120, (255, 236, 200), GAEGU)
    f.light(1495, 370, 170, (255, 220, 170), 0.5 + 0.05 * math.sin(t * 20))
    lamp_post(f, 220, fy, 520, True, t, 0.9, dust=False)
    floor(f, fy)
    f.line([(-400, fy + 60), (2300, fy + 60)], FAINT, 2)
    splashes(f, t, -200, 2200, fy + 30, 40)
    # villain
    va = smooth(seg(t, 3.8, 4.4))
    k = summon(t, 3.7, 8.3)
    vdraw(f, t, k, 500, fy, 1.8, dict(face=0.5, grin=0.9, rhw=(700, 560)), (lx, fy), 3.7, 8.3)
    vline(f, 600, 330, 'Week\'s ruined. Start Monday.', t, 4.4, 8.0)
    kicker(f, 14, 'THE MISSED MONDAY', t, 4.6, 7.6)
    # Leo
    if t < 3.4:
        p, bob = walk(t, 1.6)
        p.update(face=0.5, mouth='flat')
    elif t < 6.2:
        p, bob = {}, 0
        p.update(face=0.3, eyes='open', look=(0, 3), rhw=(lx + 40, fy - 210), mouth='flat' if t < 4.8 else 'frown',
                 brow=-0.6 if t > 4.8 else 0)
    else:
        p, bob = walk(t, 1.4, dirx=-1)
        p.update(face=-0.6, eyes='half', mouth='frown', brow=-0.6)
    LEO.draw(f, lx, fy - bob, 1.0, p, t)
    if 3.4 <= t < 6.2:
        phone_small(f, lx + 40, fy - 220, 1.0)
        a = smooth(seg(t, 3.6, 3.9)) * smooth((1 - seg(t, 5.9, 6.2)))
        if a > 0:
            px, py = lx + 210, fy - 420
            f.rrect(px - 150, py - 70, px + 150, py + 70, 14, lerpc(BG, (24, 28, 40), a), lerpc(BG, CHALK, a), 2.2)
            f.text(px, py - 30, 'TUESDAY', 40, lerpc(BG, WHITE, a), GAEGU)
            f.text(px, py + 22, 'gym streak: missed MON', 24, lerpc(BG, (230, 90, 80), a), HAND)
    f.layer(1.25)
    rain(f, t, -400, 2400, 0, 1080, 200, seed=3)
    f.layer(1.0)


# ====================================================================== 06 EARNED
def s06(f, t):
    pan = smooth(seg(t, 3.2, 4.6))
    f.cam(1.14 + 0.04 * pan, lerp(880, 1240, pan), 530)
    lx_ = 600 if t < 3.4 else (lerp(600, 1450, smooth(seg(t, 3.5, 5.3))) if t < 5.3 else 1450)
    floor(f, FY)
    clock(f, 1330, 280, '23:10', None, 0.85)
    fridge(f, 280, 500, 360, FY, open_=1.0 - smooth(seg(t, 3.4, 4.0)), t=t)
    k = summon(t, 0.8, 7.0)
    vdraw(f, t, k, 1000, FY, 1.45, dict(face=-0.5, grin=1.0, lh=(-70, -270), rot=-0.05), (lx_, FY), 0.8, 7.0)
    kicker(f, 23, 'THE REWARD', t, 1.4, 4.4)
    counter(f, 760, 1260, 600, FY)
    vline(f, 1000, 330, 'You earned this.', t, 1.2, 5.5)
    dopen = smooth(seg(t, 4.9, 5.5)) * (1 - smooth(seg(t, 8.0, 8.8)))
    door(f, 1560, 1740, 380, FY, dopen)
    if dopen > 0.05:
        ha = smooth(seg(t, 5.4, 6.0)) * (1 - smooth(seg(t, 6.6, 7.2)))
        COURIER.draw(f, 1700, FY, 1.0, dict(face=-0.6, mouth='smile', lhw=(lerp(1680, 1590, ha), 640)), t)
    # Leo
    if t < 3.4:
        lx, p, bob = 600, dict(face=-0.8, look=(-2, 1), mouth='frown', brow=-0.4, light=(-1, 0)), 0
    elif t < 5.3:
        u = seg(t, 3.5, 5.3)
        lx = lerp(600, 1450, smooth(u))
        p, bob = walk(t, 1.8)
        p.update(face=0.5, eyes='open', mouth='smile')
    else:
        lx = 1450
        bob = 0
        p = dict(face=0.5 if t < 6.4 else -0.2, mouth='smile' if t < 6.4 else 'grin', brow=-0.3,
                 eyes='open' if t < 6.6 else 'happy')
    hold = t > 6.2
    if hold:
        p.update(lhw=(lx - 40, FY - 140), rhw=(lx + 40, FY - 140))
    LEO.draw(f, lx, FY - bob, 1.0, p, t)
    if dopen > 0.05 and not hold:
        pizza(f, lerp(1680, 1600, smooth(seg(t, 5.4, 6.0))), 640)
    if hold:
        pizza(f, lx, FY - 128)
        f.light(lx, FY - 150, 80, WARM, 0.2)


# ====================================================================== 07 DRAFT
def cursor(f, x, y, click=0.0):
    pts = [(x, y), (x, y + 38), (x + 10, y + 29), (x + 18, y + 46), (x + 25, y + 43), (x + 17, y + 26), (x + 30, y + 26)]
    f.poly(pts, (245, 245, 245), (10, 10, 10), 2.0, amp=0)
    if click > 0:
        f.ell(x, y, 10 + 30 * click, None, None, lerpc((255, 255, 255), BG, click), 2)


def s07(f, t):
    if t < 4.6:
        cam_push(f, t, 4.6, 1.0, 1.22, (960, 540), (1150, 610))
    else:
        cam_push(f, t - 4.6, 1.0, 1.22, 1.04, (1150, 610), (960, 540))
    # peeking villain behind the laptop
    k = summon(t, 2.2, 6.6, 0.8)
    vdraw(f, t, k, 1760, 1010, 2.2, dict(face=-0.7, grin=1.0, eyes=1.0), (1760, 1500), 2.2, 6.6)
    f.rect(330, 160, 1590, 860, (14, 15, 20), CHALK, 3.2)
    f.poly([(260, 860), (1660, 860), (1760, 960), (160, 960)], (24, 24, 28), CHALK, 2.6)
    f.light(960, 500, 700, (120, 150, 220), 0.12)
    if t < 6.4:
        f.text(400, 214, 'Upload video', 46, (230, 230, 236), GAEGU, 'lm')
        f.rect(400, 270, 900, 560, (34, 30, 28), CHALK, 2)
        f.ell(650, 420, 60, None, (60, 52, 46), None)
        f.poly([(630, 390), (630, 450), (680, 420)], (230, 230, 230), None, amp=0)
        f.text(650, 520, 'cover_final_v3.mp4', 24, (170, 170, 176), HAND)
        f.text(950, 290, 'Title', 26, (150, 150, 160), HAND, 'lm')
        f.rect(950, 315, 1520, 375, (26, 28, 36), DIM, 2)
        f.text(970, 345, 'My first guitar cover :)', 34, (235, 235, 235), HAND, 'lm')
        f.text(950, 420, 'Visibility', 26, (150, 150, 160), HAND, 'lm')
        f.text(970, 465, 'Public', 34, (235, 235, 235), HAND, 'lm')
        f.text(470, 750, 'Delete draft', 32, (170, 170, 176), HAND, 'lm')
        hov = 2.0 < t < 4.6
        f.rrect(1240, 700, 1510, 790, 18, (70, 196, 150) if hov else (50, 150, 116), (20, 40, 30), 2.2)
        f.text(1375, 745, 'POST', 54, (14, 40, 30), GAEGU)
        if hov:
            f.light(1375, 745, 140, MINT, 0.18)
    if 5.5 <= t < 6.5:
        f.rrect(700, 400, 1220, 620, 20, (30, 32, 40), CHALK, 2.4)
        f.text(960, 460, 'Delete draft?', 48, WHITE, GAEGU)
        f.rrect(760, 520, 940, 590, 14, (150, 50, 48), None)
        f.text(850, 555, 'Yes', 38, WHITE, GAEGU)
        f.rrect(980, 520, 1160, 590, 14, (50, 52, 60), None)
        f.text(1070, 555, 'No', 38, WHITE, GAEGU)
    if t >= 6.5:
        f.text(960, 500, 'No drafts.', 54, (120, 120, 128), GAEGU)
    # cursor path
    if t < 2.0:
        u = smooth(t / 2.0)
        cx, cy = lerp(880, 1360, u), lerp(640, 735, u)
    elif t < 4.6:
        cx, cy = 1360 + math.sin(t * 9) * 4, 735 + math.cos(t * 7) * 3
        if 3.2 < t < 3.6:
            cx -= 30 * math.sin((t - 3.2) / 0.4 * math.pi)
    elif t < 5.4:
        u = smooth(seg(t, 4.6, 5.4))
        cx, cy = lerp(1360, 560, u), lerp(735, 752, u)
    elif t < 6.2:
        u = smooth(seg(t, 5.6, 6.2))
        cx, cy = lerp(560, 840, u), lerp(752, 560, u)
    else:
        cx, cy = 840, 560
    click = seg(t, 5.4, 5.7) if t < 5.7 else (seg(t, 6.25, 6.55) if 6.25 < t < 6.55 else 0)
    if t < 6.6:
        cursor(f, cx, cy, click)
    vline(f, 1180, 600, 'It\'s not good enough.', t, 2.6, 5.4, 58)
    kicker(f, 35, 'THE DRAFT', t, 2.9, 5.4, y=890)
    # thumb on trackpad
    f.layer(1.15)
    hx = 960 + (cx - 960) * 0.18
    f.ell(hx, 1000, 70, 60, CREAM, OUTL_C, 3)
    f.layer(1.0)


OUTL_C = (36, 32, 30)


# ====================================================================== 08 THE PLAN
def s08(f, t):
    if t < 5.0:
        cam_push(f, t, 5.0, 1.08, 1.18, (1000, 500), (1060, 510))
        floor(f, FY)
        f.light(880, 420, 500, WARM, 0.12)
        plan_board(f, 500, 210, 1240, 640, fill=smooth(seg(t, 0.0, 4.4)), t=t)
        book(f, 640, FY, 180, 34, (110, 60, 90), '2026 PLANNER')
        book(f, 640, FY - 34, 150, 26, (60, 80, 110), 'ATOMIC...')
        nod = math.sin(t * 6) * 0.06
        k = summon(t, 0.4, 99)
        vdraw(f, t, k, 1640, FY, 1.3, dict(face=-0.4, grin=1.0, rot=nod, rh=(70, -150), lh=(-70, -150)), (1330, FY), 0.4)
        vline(f, 1620, 290, 'Plan it perfectly first.', t, 0.8, 4.6)
        k = (t * 1.4) % 1
        tgt = (1100 + 60 * math.sin(t * 2.1), 420 + 120 * math.sin(t * 1.3))
        p = dict(face=-0.6, eyes='happy' if (t % 2 < 1) else 'open', mouth='smile', brow=0.2, lhw=tgt)
        LEO.draw(f, 1330, FY, 1.0, p, t)
        f.light(tgt[0], tgt[1], 40, WARM, 0.15)
    else:
        u = t - 5.0
        cam_push(f, u, 5.0, 1.04, 1.16, (940, 520), (900, 560))
        floor(f, FY)
        plan_board(f, 500, 210, 1240, 640, fill=1.0, dusty=True)
        f.ambient((80, 90, 120), 0.012)
        clock(f, 1440, 290, '07:00', 'MON', 0.85)
        seat = couch(f, 560, 1240, FY)
        k = summon(t, 5.5, 9.3)
        vdraw(f, t, k, 1200, FY, 1.95, dict(face=-0.4, grin=1.0, lhw=(1120, 520), rhw=(1290, 520), rot=-0.05),
              (880, FY), 5.5, 9.3)
        kicker(f, 47, 'THE PERFECT PLAN', t, 6.0, 9.4, y=890)
        couch(f, 560, 1240, FY)
        y = seat + 58
        p = dict(rot=0.28, face=-0.2, eyes='half', mouth='flat', brow=-0.2, look=(0, 3), lfw=(800, FY), rfw=(860, FY),
                 lhw=(900, seat - 110), rhw=(960, seat - 100), sq=0.94, light=(0.4, -0.8))
        LEO.draw(f, 880, y, 1.0, p, t)
        phone_small(f, 935, seat - 118, 1.0, 0.7)
        f.light(880, seat - 160, 90, (130, 160, 240), 0.12)


# ====================================================================== 09 LOW POINT
def s09(f, t):
    cam_push(f, t, 13, 1.08, 1.2, (1000, 520), (1060, 500))
    fy = 860
    f.layer(0.7)
    window(f, 230, 230, 500, 560, t, 'night', rain=True)
    window_beam(f, 230, 230, 500, 560, COLD, 0.09, dx=520, floor_y=fy)
    f.layer(1.0)
    floor(f, fy)
    top = bed(f, 560, 1200, fy)
    pillow(f, 670, top - 14)
    blanket(f, 780, 1196, top, 0.2)
    ns = nightstand(f, 1300, fy)
    clock(f, 1300, ns - 44, '02:47', None, 0.8)
    talk = 0.0
    if 2.9 < t < 5.7:
        talk = 0.3 + 0.55 * abs(math.sin(t * 12.5)) * abs(math.sin(t * 4.7 + 1))
    k = summon(t, 0.5, 99, 1.4)
    vdraw(f, t, k, 1520, fy, 2.7, dict(face=-0.5, talk=talk, grin=1.0, lhw=(1250, 380),
                                    rot=-0.06 + 0.015 * math.sin(t)), (1000, fy), 0.5, halo=1.2)
    if 2.8 < t < 6.4:
        red_text(f, 820, 300, 'You\'re just not built for this.', 70,
                 alpha=smooth(seg(t, 2.8, 3.0)) * smooth((1 - seg(t, 6.0, 6.4))), glow=0.6, appear=(t - 2.85) / 1.6)
    y, p = leo_sit(1000, top + 4, (-30, 25), fy)
    p.update(eyes='half', mouth='frown', brow=-0.8, look=(0, 4), sq=0.93, lhw=(975, top + 40), rhw=(1035, top + 40),
             light=(-0.8, -0.3), tear=1 if t > 10.2 else 0, face=0.1)
    LEO.draw(f, 1000, y, 1.0, p, t)
    fg_plant(f, 100, fy + 40, 1.0)


# ====================================================================== 10-12 THE TWIST
def dawn_street(f, t, fy=830):
    f.ambient((60, 80, 130), 0.035)
    f.layer(0.35)
    for i in range(10):
        x0 = -500 + i * 330
        f.rect(x0, 300 + (i * 61 % 140), x0 + 290, fy, (12, 13, 18), (40, 42, 52), 2)
    f.layer(0.75)
    for i, x0 in enumerate((-300, 180, 660, 1140, 1620, 2100)):
        f.rect(x0, 380, x0 + 440, fy, (15, 16, 21), DIM, 2.2)
        f.poly([(x0 - 20, 380), (x0 + 220, 290), (x0 + 460, 380)], (15, 16, 21), DIM, 2.2)
        f.rect(x0 + 60, 450, x0 + 140, 540, (30, 36, 52), DIM, 1.8)
        f.rect(x0 + 300, 450, x0 + 380, 540, (30, 36, 52) if i != 3 else (90, 70, 50), DIM, 1.8)
    f.layer(1.0)
    floor(f, fy)
    f.line([(-400, fy + 70), (2400, fy + 70)], FAINT, 2)
    lamp_post(f, 300, fy, 480, True, t, 0.35, col=(170, 190, 230), dust=False)
    lamp_post(f, 2000, fy, 480, True, t, 0.35, col=(170, 190, 230), dust=False)


def s10(f, t):
    pan = smooth(seg(t, 4.2, 8.0))
    f.cam(lerp(1.1, 1.2, pan), lerp(840, 1150, pan), 540)
    fy = 830
    dawn_street(f, t, fy)
    door(f, 1530, 1650, 560, fy)
    MAYA.draw(f, 1480, fy, 1.0, dict(face=-0.2, eyes='half', mouth='flat', brow=-0.3, sq=0.96, lh=(-55, -120)), t)
    lx = lerp(220, 760, seg(t, 0, 4.4))
    if t < 4.4:
        p, bob = walk(t, 1.3)
        p.update(face=0.4, eyes='half', mouth='flat', brow=-0.5)
    else:
        p, bob = dict(face=0.7, eyes='open' if t < 5.6 else 'wide', mouth='flat' if t < 5.6 else 'o', brow=-0.2), 0
    LEO.draw(f, lx, fy - bob, 1.0, p, t)
    g = 0.5 + 0.5 * math.sin(t * 2.3)
    for sx in (-9, 9):
        f.dot(lx + sx, fy + 3, 2.2, lerpc(BG, (255, 40, 30), 0.5 + 0.5 * g))
    f.light(lx, fy + 3, 26, RED, 0.25 * g)


def s11(f, t):
    fy = 830
    if t < 7.6:
        cam_push(f, t, 7.6, 1.45, 1.6, (1480, 600), (1520, 590))
    else:
        u = eout(seg(t, 7.6, 8.1))
        f.cam(lerp(1.6, 1.3, u), lerp(1520, 700, u), lerp(590, 560, u))
        f.whip = 160 * (1 - abs(u * 2 - 1)) if t < 8.1 else 0
    dawn_street(f, t, fy)
    door(f, 1530, 1650, 560, fy)
    ve = eout(seg(t, 1.5, 2.0))
    run = t > 6.6
    mx_ = 1480 + max(0, t - 6.6) ** 1.4 * 420
    k = summon(t, 1.2, 6.7, 0.9, 0.7)
    vdraw(f, t, k, 1650, fy, 1.05, dict(face=-0.5, eyes=ve, grin=0.7, lhw=(1560, 640)), (mx_, fy), 1.2, 6.7,
          V=MAYA_V, seed=7)
    vline(f, 1680, 420, 'Stay in bed.', t, 2.8, 5.0, 50)
    if not run:
        tie = smooth(seg(t, 5.0, 5.4)) * (1 - smooth(seg(t, 6.0, 6.4)))
        sigh = math.exp(-((t - 4.5) ** 2) * 8)
        p = dict(face=-0.1, eyes='half' if t < 4.4 else ('closed' if t < 4.9 else 'open'), mouth='flat',
                 brow=-0.3 if t < 5 else 0.5, sq=0.96 - 0.05 * sigh, rot=0.45 * tie,
                 lhw=(1470, fy - 10) if tie > 0.5 else None)
        if t > 6.2:
            p['mouth'] = 'tense'
        MAYA.draw(f, 1480, fy, 1.0, p, t)
    else:
        mx = 1480 + (t - 6.6) ** 1.4 * 420
        p, bob = walk(t, 2.6, run=True)
        p.update(face=0.6, mouth='tense', brow=0.6)
        MAYA.draw(f, mx, fy - bob, 1.0, p, t)
    # Leo + his frozen villain (seen after whip)
    k2 = summon(t, 7.3, 99, 0.6)
    vdraw(f, t, k2, 460, fy, 2.0, dict(face=0.4, eyes=1.6, grin=0.0, rh=(60, -260)), (760, fy), 7.3)
    LEO.draw(f, 760, fy, 1.0, dict(face=0.7, eyes='wide', mouth='o', brow=-0.4), t)
    if t > 8.1:
        k = 0.6 + 0.4 * math.sin(t * 9)
        f.glitch.append((120, 128, 900, 952, k, f.fi))


def s12(f, t):
    fy = 830
    cam_push(f, t, 12, 1.12, 1.2, (980, 560), (1000, 560))
    dawn_street(f, t, fy)
    gl = (t % 1.3) < 0.18
    k = summon(t, -5, 9.6, 0.5, 1.0)
    vdraw(f, t, k, 470, fy, lerp(2.0, 1.75, seg(t, 8.1, 9.6)), dict(face=0.4, eyes=1.6, grin=0.0, rh=(60, -260)),
          (820, fy), -5, 9.6)
    gl = gl and k > 0.4
    if gl:
        f.glitch.append((170, 128, 820, 952, 0.8, f.fi * 3))
    # Maya
    if t < 1.2:
        mx = lerp(2200, 1200, eout(t / 1.2))
        p, bob = walk(t, 2.6, run=True, dirx=-1)
        p.update(face=-0.5, mouth='flat')
    elif t < 10.8:
        mx = 1200
        bob = abs(math.sin(t * 7)) * 5
        p = dict(face=-0.5, mouth='smile' if t > 3.7 else 'flat', eyes='open', brow=0.1,
                 lh=(-40, -110 + 8 * math.sin(t * 7)), rh=(40, -110 - 8 * math.sin(t * 7)))
        if 8.1 < t < 10.8:
            p.update(eyes='happy', mouth='smile')
    else:
        mx = 1200 + (t - 10.8) ** 1.3 * 700
        p, bob = walk(t, 2.6, run=True)
        p.update(face=0.6, mouth='smile')
    MAYA.draw(f, mx, fy - bob, 1.0, p, t)
    lp = dict(face=0.5, eyes='open', mouth='flat', brow=-0.3)
    if 5.7 < t < 8.0:
        lp.update(brow=-0.6, mouth='open' if (t * 6 % 1) < 0.5 else 'flat')
    if t > 10.0:
        lp.update(mouth='smile', brow=0.3)
    LEO.draw(f, 820, fy, 1.0, lp, t)
    say(f, 820, 470, 'You hear it too?', CREAM, t, 1.3, 3.6)
    say(f, 1200, 470, 'Every morning.', MINT, t, 3.7, 5.6)
    say(f, 820, 470, 'Then how do you still go?', CREAM, t, 5.7, 8.0)
    say(f, 1200, 470, 'I stopped asking it.', MINT, t, 8.1, 10.9)


# ====================================================================== 13 CARDS
def s13(f, t):
    out = 1 - smooth(seg(t, 11.3, 11.9))
    kinetic(f, 'Disciplined people don\'t feel like it either.'.split(), 400, 78, t, 0.5, 0.17,
            cols=[None, None, None, (255, 236, 200), (255, 236, 200), None, None], alpha=out)
    kinetic(f, 'Not Maya. Not athletes. Not anyone.'.split(), 490, 52, t, 2.6, 0.22, path=HAND,
            cols=[(150, 150, 156)] * 6, alpha=out, pop=0.15)
    if t > 5.6:
        k = 1 - eout(seg(t, 5.6, 5.9))
        f.shx = math.sin(t * 70) * 10 * k
        f.flash = 0.10 * k
        f.light(960, 640, 420, RED, 0.16 * out)
    kinetic(f, 'They just stopped asking.'.split(), 640, 112, t, 5.6, 0.0, cols=[RED] * 4, alpha=out, pop=0.6)
    u = eout(seg(t, 6.1, 6.6))
    if u > 0:
        pts_t, pts_b = [], []
        for k in range(25):
            v = k / 24 * u
            x = lerp(930, 1520, v)
            y = 712 + math.sin(v * math.pi) * 6 - v * 10
            th = 13 * math.sin(clamp(v / max(u, 1e-3)) * math.pi) ** 0.6 + 2
            pts_t.append((x, y - th / 2))
            pts_b.append((x + 5, y + th / 2))
        f.poly(pts_t + pts_b[::-1], lerpc(BG, RED, out), None, amp=0.3)


# ====================================================================== 15 RULES
def pushup(f, t, x, rep=1.0, band=True, face_s='tense', s=1.0, fy=FY):
    """One push-up at progress rep (0..1) -> down and up."""
    d = math.sin(clamp(rep) * math.pi)
    rot = lerp(-1.18, -1.36, d)
    hip = (x, lerp(fy - 52, fy - 34, d))
    p = dict(rot=rot, hip=True, band=band, lfw=(x + 62, fy), rfw=(x + 72, fy), lhw=(x - 110, fy), rhw=(x - 80, fy),
             face=-0.3, eyes='shut' if d > 0.4 else 'open', mouth=face_s, sweat=1 if d > 0.4 else 0, light=(-0.5, -0.8),
             lbend=-1, rbend=-1, kbend=-1)
    LEO.draw(f, hip[0], hip[1], s, p, t)


def s15(f, t):
    if t < 3.5:
        cam_push(f, t, 3.5, 1.2, 1.32, (1060, 600), (1040, 620))
        f.layer(0.7)
        window(f, 220, 250, 460, 520, t, 'sunrise')
        window_beam(f, 220, 250, 460, 520, WARM, 0.18, dx=500)
        f.layer(1.0)
        floor(f, FY)
        rep = seg(t, 0.6, 2.2)
        if t < 2.4:
            pushup(f, t, 960, rep)
        else:
            LEO.draw(f, 960, FY, 1.0, dict(band=True, face=0.0, eyes='happy', mouth='grin',
                                           lh=(-70, -150 - 20 * math.sin(t * 8)), rh=(70, -150)), t)
        plate(f, '2', 'MAKE IT STUPID SMALL.', 'One push-up. One page. Too small to say no to.', t, 0.2, 3.5)
    else:
        u = t - 3.5
        cam_push(f, u, 3.5, 1.0, 1.08, (960, 560), (960, 560))
        f.light(960, 540, 600, WARM, 0.08)
        marks = []
        for i in range(28):
            ta = 0.3 + i * 0.1 + (0.25 if i > 8 else 0)
            if i == 8:
                marks.append(('x', seg(u, ta, ta + 0.25)))
            else:
                marks.append(('v', seg(u, ta, ta + 0.12)))
        calendar(f, 590, 400, 7, 4, 106, 88, marks, 'FEBRUARY', t)
        plate(f, '3', 'NEVER MISS TWICE.', 'Missing once is life. Missing twice is a new habit.', u, 0.1, 3.5, y=210)


# ====================================================================== 16 MONTAGE
DAYS = [1, 2, 3, 5, 7, 9, 10, 14, 21, 30, 45, 60, 75, 90, 100, 120, 150, 180]
LINES = ['Pointless.', 'You\'re tired.', 'It\'s raining.', 'Check your phone.', 'Everyone\'s staring.', None,
         'Missed one. Quit.', 'Too hard.', 'Order pizza.', 'Not good enough.', 'Skip today.', 'Tomorrow.', None,
         'Just today...', None, 'later?', None, None]
# attack cuts hold long enough to read the excuse; quiet cuts stay snappy
DURS = [(2.2 if k == 6 else 1.5) if LINES[k] else 0.8 for k in range(len(DAYS) - 1)] + [4.0]
STARTS = [sum(DURS[:i]) for i in range(len(DURS))]


def vscale(day):
    return lerp(1.55, 0.2, math.log(day) / math.log(180))


def mcut(t):
    for i in range(len(DURS) - 1, -1, -1):
        if t >= STARTS[i]:
            return i, t - STARTS[i]
    return 0, t


def s16(f, t):
    i, u = mcut(t)
    day = DAYS[i]
    vs = vscale(day)
    dur = DURS[i]
    z = 1.04 + 0.08 * (u / dur) + 0.07 * (1 - eout(seg(u, 0.0, 0.2)))
    f.flash = 0.10 * (1 - seg(u, 0.0, 0.09)) if i > 0 else 0.0
    f.cam(z, 960 + (20 if i % 2 else -20) * u, 540)
    line = LINES[i]
    attacking = bool(line) or i == 5
    vk = (eout(seg(u, 0.0, 0.15)) * (1 - ein(seg(u, HIT + 0.1, HIT + 0.4))) if i != 5 else 1.0) if attacking else 0.0

    def mdraw(f, x, y, s, p, t, **kw):
        if vk > 0.01:
            MON.draw(f, x, y, s * lerp(0.3, 1, vk), p, t, halo=vk, alpha=clamp(vk * 1.5))
            burst(f, x, y - 140 * s, u, 30, i + 40, 100 * s)
    lsize = 84 if vs > 0.6 else 76
    vx = 1450
    fy = FY
    lp = (960, fy - 300)
    vp_y = fy - (74 + 226) * vs - 30
    if i in (0, 6, 15):                       # push-ups
        floor(f, fy)
        f.layer(0.7)
        window(f, 200, 250, 440, 520, t, 'sunrise' if i != 6 else 'dawn')
        f.layer(1.0)
        mdraw(f, vx, fy, vs * (1.25 if i == 6 else 1), dict(face=-0.5, grin=0.8), t)
        reps = 1 if i != 15 else 3
        pushup(f, t, 960, (u / dur * reps * 1.1) % 1.0, band=i != 6, face_s='tense' if i != 15 else 'grin')
        lp = (900, fy - 120)
    elif i in (1, 13):                        # reading / studying
        desk(f, 560, 1260, 640, fy)
        desk_lamp(f, 640, 640, True, t, 1, 1.0)
        f.poly([(820, 640), (900, 610), (980, 640)], (220, 216, 200), INK, 2)
        f.poly([(980, 640), (1060, 610), (1140, 640)], (220, 216, 200), INK, 2)
        if i == 13:
            for k in range(7):
                book(f, 1180, 640 - k * 26, 120, 26, ((70, 60, 90), (60, 90, 80), (90, 70, 60))[k % 3])
        mdraw(f, 1660, fy, vs, dict(face=-0.5, grin=0.6), t)
        chair(f, 1380, fy, -1)
        y, p = leo_sit(1360, fy - 150, (-50, -10), fy)
        p.update(band=True, face=-0.7, eyes='open', look=(-2, 3), mouth='flat', brow=0.4, lhw=(1150, 630),
                 rhw=(1180 + 10 * math.sin(t * 14), 636))
        LEO.draw(f, 1360, y, 1.0, p, t)
        lp = (1360, fy - 330)
        vx = 1660
    elif i in (2, 11, 12):                    # running
        f.layer(0.5)
        off = -(t * 500) % 600
        for k in range(6):
            x0 = off - 300 + k * 600
            f.rect(x0, 360 + (k * 70 % 150), x0 + 420, fy, (13, 13, 17), FAINT, 2)
        f.layer(1.0)
        off2 = -(t * 900) % 900
        for k in range(4):
            lamp_post(f, off2 + k * 900 - 400, fy, 500, True, t, 0.7 if i != 2 else 0.5, dust=False)
        floor(f, fy)
        if i == 2:
            rain(f, t, -200, 2200, 0, 1080, 180, seed=8)
        mdraw(f, 560 - 200 * u * (i == 11), fy, vs, dict(face=0.5, grin=0.6), t)
        p, bob = walk(t, 2.6, run=True)
        p.update(band=True, face=0.5, mouth='tense' if i == 2 else 'smile', brow=0.5)
        LEO.draw(f, 1000, fy - bob, 1.0, p, t)
        if i == 12:
            p2, bob2 = walk(t + 0.2, 2.6, run=True)
            p2.update(face=0.5, mouth='smile')
            MAYA.draw(f, 1200, fy - bob2, 1.0, p2, t)
        lp = (1000, fy - 300)
        vx = 560
    elif i == 3:                              # phone in drawer
        desk(f, 560, 1260, 640, fy)
        drawer = smooth(seg(u, 0.1, 0.4)) * (1 - smooth(seg(u, 0.6, 0.85)))
        f.rect(1070, 658, 1242, 730 + 40 * drawer, (22, 22, 26), CHALK, 2)
        pu = smooth(seg(u, 0.05, 0.6))
        phx, phy = lerp(1300, 1156, pu), lerp(560, 700, pu)
        if u < 0.7:
            phone_small(f, phx, phy, 1.0, 1.0)
        mdraw(f, 1660, fy, vs, dict(face=-0.5, grin=0.6), t)
        y, p = leo_sit(1380, fy - 150, (-50, -10), fy)
        chair(f, 1400, fy, -1)
        p.update(band=True, face=-0.5, eyes='open', mouth='tense', brow=0.6, lhw=(phx + 10, phy))
        LEO.draw(f, 1380, y, 1.0, p, t)
        lp = (1380, fy - 330)
        vx = 1660
    elif i == 4:                              # squats
        f.layer(0.8)
        for k, e in enumerate(EXTRA):
            e.draw(f, 300 + k * 160, fy - 40, 0.7, dict(face=0.3, mouth='flat'), t)
        f.layer(1.0)
        floor(f, fy)
        sq = 1 - 0.18 * math.sin(clamp(u / dur) * math.pi)
        mdraw(f, vx, fy, vs, dict(face=-0.5, grin=0.6), t)
        LEO.draw(f, 960, fy, 1.0, dict(band=True, sq=sq, face=0, eyes='open', mouth='tense', brow=0.6,
                                       lh=(-75, -58 - 150 * sq), rh=(75, -58 - 150 * sq),
                                       lf=(-40, 0), rf=(40, 0)), t)
        barbell(f, 960, fy - 58 - 150 * sq - 10, 340)
        lp = (960, fy - 320)
    elif i == 5:                              # sick day
        top = bed(f, 560, 1180, fy)
        pillow(f, 650, top - 14)
        LEO.draw(f, 900, top + 2, 1.0, dict(rot=-math.pi / 2, hip=True, legs=False, arms=False, eyes='half',
                                            mouth='frown', light=(0.6, -0.6)), t)
        blanket(f, 760, 1176, top, 1.0)
        f.line([(690, top - 40), (740, top - 62)], (220, 220, 230), 3)
        mdraw(f, vx, fy, vs * 1.3, dict(face=-0.5, grin=1.0), t)
        xu = seg(u, 0.25, 0.6)
        if xu > 0:
            c = (1460, 330)
            f.line([(c[0] - 70, c[1] - 70), (c[0] - 70 + 140 * clamp(xu * 2), c[1] - 70 + 140 * clamp(xu * 2))], RED, 14)
            if xu > 0.5:
                v = clamp(xu * 2 - 1)
                f.line([(c[0] + 70, c[1] - 70), (c[0] + 70 - 140 * v, c[1] - 70 + 140 * v)], RED, 14)
            f.light(c[0], c[1], 120, RED, 0.4)
        line = None
    elif i in (7, 16):                        # stairs
        x0, n, sw, sh = 260, 9, 150, 58
        if i == 16:
            f.layer(0.4)
            for k in range(12):
                building(f, -300 + k * 220, -100 + k * 220, 700 + (k * 37 % 80), 1000, seed=k, lit=0.5, k=0.4)
            f.layer(1.0)
            f.light(1700, 300, 400, WARM, 0.2)
        stairs(f, x0, fy + 60, n, sw, sh)
        prog = clamp(u / dur)
        lx = lerp(x0 + 150, x0 + n * sw - 300, prog)
        ly = step_y(lx, x0, fy + 60, n, sw, sh)
        mdraw(f, x0 - 60, fy + 60, vs, dict(face=0.5, grin=0.6), t)
        p, bob = walk(t, 2.4, run=True)
        p.update(band=True, face=0.6, mouth='tense', brow=0.6, sweat=1)
        LEO.draw(f, lx, ly - bob, 1.0, p, t)
        lp = (lx, ly - 300)
        vx = x0 - 60
        vp_y = fy + 60 - (74 + 226) * vs - 30
    elif i == 8:                              # cooking
        floor(f, fy)
        counter(f, 600, 1300, 640, fy)
        stove(f, 900, 640, t)
        mdraw(f, 1660, fy, vs, dict(face=-0.5, grin=0.6), t)
        LEO.draw(f, 1120, fy, 1.0, dict(band=True, face=-0.6, eyes='happy', mouth='smile',
                                        lhw=(1010 + 20 * math.cos(t * 9), 580 + 10 * math.sin(t * 9))), t)
        lp = (1120, fy - 320)
        vx = 1660
    elif i in (9, 14):                        # posting / comments
        f.rect(360, 170, 1560, 840, (14, 15, 20), CHALK, 3)
        if i == 9:
            f.text(960, 760, 'My first guitar cover :)', 52, WHITE, HAND)
            posted = u > 0.3
            f.rrect(800, 560, 1120, 660, 18, (70, 196, 150), (20, 40, 30), 2.2)
            f.text(960, 610, 'POSTED' if posted else 'POST', 54, (14, 40, 30), GAEGU)
            if posted:
                f.light(960, 610, 220, MINT, 0.3 * (1 - seg(u, 0.3, 1.2)))
            cursor(f, 980, 620, seg(u, 0.25, 0.45) if u < 0.45 else 0)
            lp = (960, 400)
        else:
            f.text(420, 230, 'Comments (38)', 46, WHITE, GAEGU, 'lm')
            com = ['this helped me <3', 'day 100?? respect.', 'you got better every video', 'keep going!']
            for k, cmt in enumerate(com):
                a = smooth(seg(u, k * 0.15, k * 0.15 + 0.15))
                f.ell(450, 330 + k * 120, 30, None, lerpc(BG, (90, 90, 100), a), None)
                f.text(510, 330 + k * 120, cmt, 42, lerpc(BG, (230, 230, 236), a), HAND, 'lm')
            f.text(1380, 760, '♥ 1.2k', 50, MINT, GAEGU)
        mdraw(f, 1700, 980, vs * 1.4, dict(face=-0.6, grin=0.5), t)
        vx, vp_y = 1700, 980 - 300 * vs * 1.4 - 30
    elif i == 10:                             # pull-ups
        floor(f, fy)
        tree(f, 400, fy, 440, 3)
        pullup_bar(f, 820, 1100, 380, fy)
        up = math.sin(clamp(u / dur) * math.pi)
        y = lerp(620, 540, up)
        LEO.draw(f, 960, y, 1.0, dict(band=True, lhw=(920, 380), rhw=(1000, 380), lbend=1, rbend=-1, face=0,
                                      eyes='shut' if up > 0.5 else 'open', mouth='tense', sweat=1,
                                      lf=(-20, -10), rf=(20, -14)), t)
        mdraw(f, 1450, fy, vs, dict(face=-0.5, grin=0.6), t)
        lp = (960, y - 300)
    elif i == 17:                             # DAY 180 summit
        cam_push(f, u, dur, 1.0, 1.1, (960, 520), (1000, 500))
        sun(f, 1330, 700 - 70 * smooth(u / dur), 60, 0.6)
        f.poly([(-300, 1000), (-300, 800), (300, 790), (900, 700), (1400, 690), (2300, 760), (2300, 1000)],
               (12, 12, 14), CHALK, 2.4)
        LEO.draw(f, 1000, 692, 1.0, dict(band=True, face=0, eyes='happy', mouth='grin', light=(0.5, -0.7),
                                         lh=(-80, -270), rh=(80, -270)), t)
        mdraw(f, 180, 800, 0.2, dict(face=0.5, grin=0.0, eyes=1.0), t)
        line = None
    if line and i != 17:
        w = f.text_w(line, lsize) * 1.1
        # readable stage: upper part of frame, leaning toward the villain, never clipped
        sx = clamp(f.cx + (vx - f.cx) * 0.6, f.cx - 820 / f.zoom + w / 2, f.cx + 820 / f.zoom - w / 2)
        vp = (sx, f.cy - 250 / f.zoom)
        throw_line(f, u, line, vp, lp, lsize, seed=i + 1)


# ====================================================================== 18 PASS IT ON
def s18(f, t):
    cam_push(f, t, 14, 1.12, 1.24, (980, 540), (1060, 540))
    fy = 830
    f.ambient((120, 70, 90), 0.03)
    f.light(300, 760, 700, (255, 120, 80), 0.18)
    f.layer(0.4)
    for k in range(10):
        building(f, -400 + k * 300, -150 + k * 300, 450 + (k * 53 % 140), fy, seed=40 + k, lit=0.35, k=0.6)
    f.layer(0.8)
    EXTRA[0].draw(f, 300 + t * 30, fy - 30, 0.6, walk(t, 1.4)[0], t)
    EXTRA[2].draw(f, 1700 - t * 25, fy - 30, 0.6, walk(t + 0.3, 1.3, dirx=-1)[0], t)
    f.layer(1.0)
    tree(f, 280, fy, 470, 5)
    bench(f, 1460, 1680, fy)
    lamp_post(f, 1780, fy, 520, True, t, 0.9)
    floor(f, fy)
    pullup_bar(f, 1000, 1260, 470, fy)
    # Sam + his small villain
    k = summon(t, 0.5, 9.4, 0.7, 0.9)
    vdraw(f, t, k, 1330, fy, 0.72, dict(face=-0.5, grin=0.8, lhw=(1210, 640)), (1130, fy), 0.5, 9.4, V=SAM_V, seed=8)
    vline(f, 1350, 470, 'Everyone\'s watching.', t, 1.0, 5.4, 44)
    if t < 8.6:
        look = math.sin(t * 2.2) * 3
        SAM.draw(f, 1130, fy, 1.0, dict(face=-0.2 if t < 5.4 else -0.6, look=(look, 0), eyes='open', brow=-0.6,
                                        mouth='tense', sweat=1 if t < 7 else 0, lh=(-50, -110), rh=(50, -110)), t)
    elif t < 10.7:
        up = math.sin(clamp(seg(t, 8.9, 10.4)) * math.pi)
        y = lerp(700, 612, up) if t > 8.9 else lerp(fy, 700, eout(seg(t, 8.6, 8.9)))
        SAM.draw(f, 1130, y, 1.0, dict(lhw=(1090, 470), rhw=(1170, 470), face=0, eyes='shut' if up > 0.5 else 'open',
                                       mouth='tense', brow=0.6, lf=(-18, -8), rf=(18, -12)), t)
    else:
        land = eout(seg(t, 10.7, 11.0))
        SAM.draw(f, 1130, fy, 1.0, dict(face=-0.4, eyes='happy', mouth='grin', sq=lerp(0.86, 1, land),
                                        lh=(-70, -230), rh=(55, -120)), t)
    # Leo
    lx = lerp(-150, 860, smooth(seg(t, 2.0, 5.4)))
    if 2.0 < t < 5.4:
        p, bob = walk(t, 1.6)
        p.update(band=True, face=0.5, mouth='smile')
    else:
        p, bob = dict(band=True, face=0.55, mouth='smile', eyes='open' if t < 10.6 else 'happy', brow=0.2), 0
        if 5.8 < t < 8.4:
            p.update(rh=(70, -170))
    LEO.draw(f, lx, fy - bob, 1.0, p, t)
    say(f, 860, 470, 'Just do one. That\'s it.', CREAM, t, 5.8, 8.4)


# ====================================================================== 19 HILL
def s19(f, t):
    cam_push(f, t, 8, 1.14, 1.0, (1040, 560), (960, 540))
    sy = lerp(720, 590, smooth(t / 8))
    sun(f, 1560, sy + 40, 58, 0.55)
    f.ambient((255, 140, 80), 0.012)
    for k in range(2):
        bx = 500 + k * 70 + t * 20
        f.line([(bx - 14, 300 + k * 30), (bx, 310 + k * 30), (bx + 14, 300 + k * 30)], DIM, 2)
    f.layer(0.6)
    f.poly([(-400, 1000), (-400, 760), (400, 700), (1100, 740), (1800, 690), (2400, 720), (2400, 1000)],
           (14, 13, 16), FAINT, 2)
    f.layer(1.0)
    hill = [(-300, 1000), (-300, 900), (200, 880), (600, 800), (900, 680), (1150, 620), (1400, 640), (1800, 720),
            (2300, 760), (2300, 1000)]
    f.poly(hill, (10, 10, 12), CHALK, 2.4)
    for k in range(14):
        gx = 600 + k * 70
        gy = 800 - (k * 70) * 0.19 if gx < 1150 else 620 + (gx - 1150) * 0.08
        f.line([(gx, gy + 4), (gx + 4, gy - 10)], DIM, 1.6)
    seat = 628
    LEO.draw(f, 1090, seat + 58, 1.0, dict(band=True, face=0.3, eyes='open', mouth='smile', light=(0.9, -0.2),
                                           lfw=(1060, seat + 14), rfw=(1120, seat + 18), lh=(-60, -90), rh=(55, -95)), t)
    MAYA.draw(f, 1230, seat + 66, 1.0, dict(face=-0.1, eyes='happy', mouth='smile', light=(0.9, -0.2),
                                            lfw=(1200, seat + 22), rfw=(1260, seat + 26)), t)
    MON.draw(f, 230, 884, 0.14, dict(face=0.5, grin=0.0, eyes=1.0), t, halo=0.8)


# ====================================================================== 20 TITLE / 21 LOOP
def s20(f, t):
    out = 1 - smooth(seg(t, 6.5, 6.95))
    word = 'DISCIPLINE'
    fnt = font(GAEGU, 176)
    total = fnt.getlength(word)
    x = 960 - total / 2
    for i, ch in enumerate(word):
        w = fnt.getlength(ch)
        u = seg(t, 0.1 + i * 0.05, 0.42 + i * 0.05)
        if u > 0:
            yy = 380 - 60 * (1 - back(u))
            f.otext(x + w / 2, yy, ch, 176, WHITE, GAEGU, 'mm', out * clamp(u * 3))
        x += w
    u = eout(seg(t, 0.75, 1.35))
    if u > 0:
        pts_t, pts_b = [], []
        for k in range(31):
            v = k / 30 * u
            xx = lerp(560, 1370, v)
            y = 488 + math.sin(v * math.pi) * 10 - v * 18
            th = 16 * math.sin(clamp(v / max(u, 1e-3)) * math.pi) ** 0.6 + 2
            pts_t.append((xx, y - th / 2))
            pts_b.append((xx + 6, y + th / 2))
        f.boil = 0.5
        f.poly(pts_t + pts_b[::-1], lerpc(BG, RED, out), None, amp=0.4)
        f.light(960, 488, 300, RED, 0.18 * out)
    kinetic(f, 'Motivation asks how you feel.'.split(), 610, 60, t, 1.7, 0.13, path=HAND, alpha=out, pop=0.2)
    kinetic(f, 'Discipline doesn\'t ask.'.split(), 686, 66, t, 2.8, 0.0, path=HAND, cols=[RED] * 3, alpha=out, pop=0.5)
    d = smooth(seg(t, 3.7, 4.1)) * out
    f.otext(960, 830, 'What\'s the line your villain always says? Comment it.', 38, (150, 150, 156), HAND, 'mm', d)


def s21(f, t):
    pass


# ====================================================================== timeline
class Scene:
    def __init__(self, name, dur, fn, subs=(), hud=None, ticks=(), cues=(), day=None):
        self.name, self.dur, self.fn = name, dur, fn
        self.subs, self.hud, self.ticks, self.cues, self.day = list(subs), hud, list(ticks), list(cues), day
        self.start = 0.0


def started(v, col=RED):
    return ('TIMES HE STARTED OVER: %d' % v, col)


def tickval(sc, t, base):
    v = base
    for (t0, t1, v0, v1) in sc.ticks:
        if t >= t0:
            n = abs(v1 - v0)
            if n == 0:
                continue
            k = int(clamp((t - t0) / max(1e-6, (t1 - t0)) * n + 1, 0, n)) if t1 > t0 else n
            v = v0 + (k if v1 > v0 else -k)
    return v


def tick_times(sc):
    out = []
    for (t0, t1, v0, v1) in sc.ticks:
        n = abs(v1 - v0)
        for k in range(n):
            out.append(t0 + (t1 - t0) * k / max(1, n) if n > 1 else t0)
    return out


def H(base, col=RED, after=None):
    def fn(sc, t):
        v = tickval(sc, t, base)
        c = col(t) if callable(col) else col
        return started(v, c)
    return fn


def hud_s03(sc, t):
    if t < 1.0:
        return started(int(round(47 * (1 - smooth(seg(t, 0.15, 1.0))))), RED)
    return started(tickval(sc, t, 0), RED)


def hud_s12(sc, t):
    if t < 9.6:
        return started(47, RED)
    if t < 10.0:
        return ('glitch', None)
    return ('DAYS MAYA FELT LIKE RUNNING: 9 / 212', MINT)


def hud_s16(sc, t):
    i, u = mcut(t)
    if i == 6 and HIT + 0.1 < u < HIT + 0.7:
        return ('TIMES HE STARTED OVER: 48', RED) if (u * 12 % 1) < 0.7 or u < HIT + 0.3 else ('glitch', None)
    return started(47, WHITE)


def hud_s21(sc, t):
    if 1.2 < t < 1.75:
        return ('TIMES HE STARTED OVER: 48', RED) if (t * 14 % 1) < 0.5 else ('glitch', None)
    return started(47, WHITE)


def day_s16(t):
    return DAYS[mcut(t)[0]]


SCENES = [
    Scene('01_wall', 6.5, s01, [(0.3, 3.7, 'Every Sunday night, Leo makes the same promise.', 'cap'), (4.0, 6.3, 'Day 1. Again.', 'cap')], H(46), [(2.35, 2.35, 46, 47)]),
    Scene('02_reveal', 3.5, s02, [(0.2, 3.3, 'Here\'s what stopped him.', 'card'), (2.1, 3.4, 'the voice that always says "later."', 'card')], H(47)),
    Scene('03_snooze', 9.0, s03, [(0.2, 2.3, 'One year earlier.', 'cap'), (2.5, 5.6, 'Five more minutes.', 'vil'), (2.6, 5.4, 'RESTART #1 · THE ALARM', 'card'),
                                   (6.4, 8.8, 'The plan lasted exactly one alarm.', 'cap')],
          hud_s03, [(6.3, 6.3, 0, 1)]),
    Scene('04_research', 9.0, s04, [(0.2, 1.9, 'Exam on Friday. He just had to start.', 'cap'), (1.3, 6.0, 'Watch one more first.', 'vil'),
                                     (1.6, 4.6, 'RESTART #6 · THE RESEARCH', 'card'), (6.9, 8.8, 'Four hours of advice. Zero pages read.', 'cap')], H(1), [(3.4, 6.6, 1, 6)]),
    Scene('05_tuesday', 9.0, s05, [(0.4, 3.4, 'Tuesday. He\'d already missed Monday.', 'cap'), (4.4, 8.0, 'Week\'s ruined. Start Monday.', 'vil'),
                                    (4.6, 7.6, 'RESTART #14 · THE MISSED MONDAY', 'card'), (6.6, 8.8, 'One missed day became a missed week.', 'cap')], H(6), [(6.4, 8.2, 6, 14)]),
    Scene('06_earned', 9.0, s06, [(0.2, 2.6, 'The meals were prepped for the whole week.', 'cap'), (1.2, 5.5, 'You earned this.', 'vil'),
                                   (1.4, 4.4, 'RESTART #23 · THE REWARD', 'card'), (6.9, 8.8, 'One "reward" undid five days.', 'cap')], H(14), [(6.6, 8.4, 14, 23)]),
    Scene('07_draft', 9.0, s07, [(0.2, 2.5, 'His first cover. Three weeks of practice.', 'cap'), (2.6, 5.4, 'It\'s not good enough.', 'vil'),
                                  (2.9, 5.4, 'RESTART #35 · THE DRAFT', 'card'), (6.8, 8.8, 'Nobody ever heard it.', 'cap')], H(23), [(6.6, 8.6, 23, 35)]),
    Scene('08_plan', 10.0, s08, [(0.8, 4.6, 'Plan it perfectly first.', 'vil'), (1.2, 4.6, 'Planning felt like progress.', 'cap'),
                                  (6.0, 9.4, 'RESTART #47 · THE PERFECT PLAN', 'card'), (7.0, 9.6, 'The plan never left the wall.', 'cap')], H(35), [(6.0, 8.8, 35, 47)]),
    Scene('09_night', 13.0, s09, [(2.9, 6.3, 'You\'re just not built for this.', 'vil'),
                                  (6.8, 9.8, 'He\'d never talk to a friend like this.', 'cap'),
                                  (10.6, 12.8, 'Only to himself.', 'cap')], H(47)),
    Scene('10_dawn', 8.0, s10, [(0.4, 3.6, '6:02 AM. He couldn\'t sleep.', 'cap'), (4.6, 7.8, 'Then he saw Maya. She never misses a run.', 'cap')], H(47)),
    Scene('11_shadow', 10.0, s11, [(1.4, 2.9, 'She had one too.', 'cap'), (2.8, 5.0, 'Stay in bed.', 'vil'), (6.8, 9.6, 'And she went anyway.', 'cap')], H(47)),
    Scene('12_question', 12.0, s12, [(1.3, 3.6, 'You hear it too?', 'say'), (3.7, 5.6, 'Every morning.', 'say'),
                                     (5.7, 8.0, 'Then how do you still go?', 'say'),
                                     (8.1, 10.9, 'I stopped asking it.', 'say')], hud_s12),
    Scene('13_cards', 12.0, s13, [(0.5, 11.9, 'Disciplined people don\'t feel like it either.', 'card'), (2.6, 11.9, 'Not Maya. Not athletes. Not anyone.', 'card'),
                                  (5.6, 11.9, 'They just stopped asking.', 'card')]),
    Scene('14_again', 10.0, s14, [(2.7, 5.0, 'Just start Monday.', 'vil'), (5.2, 7.4, '5… 4… 3… 2… 1.', 'count'),
                                  (7.6, 10.0, '1. Don\'t ask. Count 5 to 1. The feeling never votes yes.', 'card'),
                                  (8.2, 10.0, 'This time, he didn\'t answer it.', 'cap')],
          H(47, lambda t: RED if t < 7.3 else WHITE)),
    Scene('15_rules', 7.0, s15, [(0.2, 3.5, '2. Make it stupid small. One push-up. One page.', 'card'),
                                 (3.6, 7.0, '3. Never miss twice. Missing once is life. Missing twice is a new habit.', 'card')], H(47, WHITE)),
    Scene('16_montage', sum(DURS), s16, [(STARTS[i] + 0.05, STARTS[i] + HIT, LINES[i], 'vil') for i in range(len(DAYS)) if LINES[i]] +
          [(STARTS[5] + 0.1, STARTS[7] - 0.1, 'Day 9: sick. Day 10: one push-up anyway.', 'cap'),
           (STARTS[17] + 0.1, sum(DURS) - 0.2, '180 days. Not one of them felt easy.', 'cap')],
          hud_s16, day=day_s16),
    Scene('17_wall', 11.0, s17, [(0.4, 3.6, 'Same wall. Same hand. Different man.', 'cap'), (6.5, 10.5, 'He never needed another Day 1.', 'cap')], H(47, WHITE),
          day=lambda t: 181 if t > 5.6 else 180),
    Scene('18_passon', 14.0, s18, [(0.3, 2.6, 'Months later. A new face at the bar.', 'cap'), (1.0, 5.4, 'Everyone\'s watching.', 'vil'), (5.8, 8.4, 'Just do one. That\'s it.', 'say'),
                                   (11.0, 13.8, 'Now it was his turn to say it.', 'cap')], H(47, WHITE)),
    Scene('19_hill', 8.0, s19, [(0.5, 3.8, 'The voice never fully goes away.', 'cap'),
                                (4.2, 7.8, 'He just stopped asking it for permission.', 'cap')]),
    Scene('20_title', 7.0, s20, [(0.15, 6.9, 'DISCIPLINE', 'card'), (1.8, 6.9, 'Motivation asks how you feel.', 'card'),
                                 (2.6, 6.9, 'Discipline doesn\'t ask.', 'card'),
                                 (3.6, 6.9, 'What\'s the line your villain always says? Comment it.', 'card')]),
    Scene('21_loop', 4.0, s21, [(0.3, 3.8, 'TIMES HE STARTED OVER: 47', 'card')], hud_s21),
]

_t = 0.0
for sc in SCENES:
    sc.start = _t
    _t += sc.dur
TOTAL = _t
NFRAMES = int(round(TOTAL * FPS))
BYNAME = {sc.name: sc for sc in SCENES}


def scene_at(t):
    for sc in SCENES:
        if sc.start <= t < sc.start + sc.dur:
            return sc
    return SCENES[-1]


# transition into each scene: (kind, duration). Played over the first `d` seconds of the
# incoming scene while the outgoing scene keeps animating past its end.
TRANS = {
    '03_snooze': ('rewind', 0.55), '04_research': ('whip', 0.4), '05_tuesday': ('whip', 0.4),
    '06_earned': ('dissolve', 0.5), '07_draft': ('zoom', 0.45), '08_plan': ('whip', 0.4), '09_night': ('dip', 1.0),
    '10_dawn': ('dip', 1.0), '11_shadow': ('zoom', 0.4), '13_cards': ('glitch', 0.35), '15_rules': ('whip', 0.4),
    '16_montage': ('flash', 0.35), '17_wall': ('dissolve', 0.7), '18_passon': ('whip', 0.4),
    '19_hill': ('dissolve', 0.9), '20_title': ('dip', 0.8),
}


def draw_scene(sc, lt, fi):
    t = sc.start + lt
    f = Frame(t, fi)
    sc.fn(f, lt)
    # captions in bottom bar
    for (t0, t1, s, kind) in sc.subs:
        if kind in ('cap', 'count') and t0 <= lt <= t1:
            a = smooth(seg(lt, t0, t0 + 0.25)) * smooth((1 - seg(lt, t1 - 0.25, t1)))
            if kind == 'count':
                n = int(clamp((lt - t0) / 0.42, 0, 4)) + 1
                s = '  '.join(['5', '4', '3', '2', '1'][:n]) + ('.' if n == 5 else '...')
            f.caption(s, a)
    # HUD
    if sc.hud:
        txt, col = sc.hud(sc, lt)
        if sc.name == '21_loop':
            a = smooth(seg(lt, 0.2, 0.6)) * smooth((1 - seg(lt, 3.5, 3.95)))
            if txt == 'glitch':
                f.glitch.append((300, 470, 1620, 610, 1.0, fi))
                txt, col = started(47, WHITE)
            f.otext(960, 540, txt, 84, col, GAEGU, 'mm', a)
        else:
            if txt == 'glitch':
                f.glitch.append((40, 20, 1100, 110, 1.0, fi))
                txt, col = started(47, RED)
            pop, since = 0.0, 9.0
            for tt in tick_times(sc):
                if 0 <= lt - tt < 0.2:
                    pop = 1 - (lt - tt) / 0.2
                if 0 <= lt - tt:
                    since = min(since, lt - tt)
            if sc.name == '03_snooze' and 0.15 < lt < 1.0:
                pop = 0.4
            size = 44 * (1 + 0.14 * pop)
            c = lerpc(col, (255, 255, 255), 0.5 * pop) if col == RED else col
            f.otext(64, 64, txt, size, c, GAEGU, 'lm', 1.0)
            if since < 0.7 and col == RED:
                x = 64 + font(GAEGU, 44).getlength(txt) + 34
                f.otext(x, 64 - 30 * eout(since / 0.7), '+1', 40, (255, 80, 70), GAEGU, 'mm', 1 - seg(since, 0.35, 0.7))
    if sc.day:
        d = sc.day(lt)
        f.otext(1856, 64, 'DAY %d' % d, 46, MINT, GAEGU, 'rm', 1.0)
    return f.finish()


FH = 1080


def _shift(a, dx):
    out = np.zeros_like(a)
    dx = int(dx)
    if dx >= 0:
        out[:, dx:] = a[:, :W - dx] if dx < W else 0
    else:
        out[:, :W + dx] = a[:, -dx:]
    return out


def _scale(img, k):
    if abs(k - 1) < 1e-3:
        return np.asarray(img, np.float32)
    w, h = int(W * k), int(FH * k)
    im = img.resize((w, h), Image.BILINEAR)
    x0, y0 = (w - W) // 2, (h - FH) // 2
    if k > 1:
        im = im.crop((x0, y0, x0 + W, y0 + FH))
        return np.asarray(im, np.float32)
    out = Image.new('RGB', (W, FH), (0, 0, 0))
    out.paste(im, (-x0, -y0))
    return np.asarray(out, np.float32)


def transition(kind, p, A, B, fi):
    """Composite outgoing A and incoming B (PIL) at progress p in [0,1]."""
    from scipy.ndimage import uniform_filter1d
    a = np.asarray(A, np.float32)
    b = np.asarray(B, np.float32)
    if kind == 'dissolve':
        o = a * (1 - smooth(p)) + b * smooth(p)
    elif kind == 'dip':
        o = a * (1 - smooth(p * 2)) if p < 0.5 else b * smooth(p * 2 - 1)
    elif kind == 'flash':
        o = b + 255 * (1 - p) ** 2
    elif kind == 'whip':
        u = smooth(p)
        o = _shift(a, -u * W) + _shift(b, (1 - u) * W)
        blur = int(220 * math.sin(p * math.pi)) | 1
        o = uniform_filter1d(o, blur, axis=1, mode='nearest')
    elif kind == 'zoom':
        u = ein(p) if p < 0.5 else eout(p)
        if p < 0.5:
            o = _scale(A, 1 + 0.9 * ein(p * 2))
            o = o * (1 - 0.3 * p)
        else:
            o = _scale(B, 1.3 - 0.3 * eout(p * 2 - 1))
        r = int(40 * math.sin(p * math.pi)) | 1
        o = uniform_filter1d(uniform_filter1d(o, r, axis=0), r, axis=1)
    elif kind in ('rewind', 'glitch'):
        base = a if p < 0.5 else b
        amt = math.sin(p * math.pi)
        r = np.random.default_rng(fi)
        o = base.copy()
        y = LB
        while y < FH - LB:
            h = int(r.integers(4, 30))
            if r.random() < 0.7:
                o[y:y + h] = np.roll(o[y:y + h], int(r.normal(0, 90 * amt)), axis=1)
            y += h
        o[..., 0] = np.roll(o[..., 0], int(14 * amt), axis=1)
        o[..., 2] = np.roll(o[..., 2], -int(14 * amt), axis=1)
        if kind == 'rewind':
            for k in range(3):
                yy = int((LB + ((p * 3 + k / 3) % 1) * (FH - 2 * LB)))
                o[yy:yy + 6] = 200
            o = o * 0.85 + r.normal(0, 18 * amt, (FH, W, 1))
    else:
        o = b
    o[:LB] = b[:LB]
    o[FH - LB:] = b[FH - LB:]
    return Image.fromarray(np.clip(o, 0, 255).astype(np.uint8))


def render(fi):
    t = fi / FPS
    sc = scene_at(t)
    lt = t - sc.start
    tr = TRANS.get(sc.name)
    idx = SCENES.index(sc)
    if tr and idx > 0 and lt < tr[1]:
        prev = SCENES[idx - 1]
        A = draw_scene(prev, prev.dur + lt, fi)
        B = draw_scene(sc, lt, fi)
        return transition(tr[0], lt / tr[1], A, B, fi)
    return draw_scene(sc, lt, fi)
