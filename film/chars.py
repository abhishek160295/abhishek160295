"""Bean characters: hero, cast, and the shadow villain."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from engine import *

OUTL = (36, 32, 30)
FACE = (40, 34, 32)


def ik(root, tgt, l1, l2, bend=1):
    rx, ry = root
    dx, dy = tgt[0] - rx, tgt[1] - ry
    d = math.hypot(dx, dy)
    d = clamp(d, abs(l1 - l2) + 0.01, l1 + l2 - 0.01)
    base = math.atan2(dy, dx)
    c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)
    a = base + bend * math.acos(c)
    e = (rx + l1 * math.cos(a), ry + l1 * math.sin(a))
    ea = math.atan2(tgt[1] - e[1], tgt[0] - e[0])
    h = (e[0] + l2 * math.cos(ea), e[1] + l2 * math.sin(ea))
    return e, h


DEF = dict(rot=0.0, sq=1.0, face=0.0, eyes='open', brow=0.0, browy=0.0, mouth='flat', look=(0, 0),
           lh=None, rh=None, lf=None, rf=None, lbend=1, rbend=-1, kbend=1, light=(-0.7, -0.5),
           sweat=0, anger=0, band=False, blink=True, legs=True, arms=True, talk=0.0, grin=0.6, breath=1.0,
           tear=0)


class Bean:
    def __init__(self, skin=CREAM, beanie=None, h=206, w=94, leg=58, limb=20, arm=40, seed=0, outline=OUTL):
        self.skin, self.beanie = skin, beanie
        self.h, self.w, self.L, self.lw, self.al = h, w, leg, limb, arm
        self.seed = seed
        self.out = outline
        self.shade = tuple(int(c * 0.74) for c in skin)
        n = 56
        a, b = w / 2, h / 2
        self.cy = -leg - b
        pts = []
        for i in range(n):
            th = 2 * math.pi * i / n
            c, s = math.cos(th), math.sin(th)
            x = a * math.copysign(abs(c) ** (2 / 2.8), c)
            y = b * math.copysign(abs(s) ** (2 / 2.8), s)
            x *= 1 + 0.07 * (-y / b)
            pts.append((x, self.cy + y))
        self.shape = pts

    def hw(self, ly):
        a, b = self.w / 2, self.h / 2
        yy = clamp((ly - self.cy) / b, -1, 1)
        return a * (1 - abs(yy) ** 2.8) ** (1 / 2.8) * (1 + 0.07 * (-yy))

    # ------------------------------------------------------------ geometry
    def geom(self, x, y, s, p, t):
        P = dict(DEF)
        P.update(p)
        sq = P['sq'] * (1 + 0.012 * P['breath'] * math.sin(t * 2.3 + self.seed))
        rot = P['rot']
        cr, sr = math.cos(rot), math.sin(rot)
        kx = 1 / math.sqrt(sq)

        hp = L_ = self.L if P.get('hip') else 0.0

        def tw(lx, ly):
            ly += hp
            lx *= kx
            ly *= sq
            return (x + (lx * cr - ly * sr) * s, y + (lx * sr + ly * cr) * s)

        def inv(wx, wy):
            dx, dy = (wx - x) / s, (wy - y) / s
            lx, ly = dx * cr + dy * sr, -dx * sr + dy * cr
            return (lx / kx, ly / sq - hp)

        for k in ('lh', 'rh', 'lf', 'rf'):
            if P.get(k + 'w'):
                P[k] = inv(*P[k + 'w'])
        a, L, h = self.w / 2, self.L, self.h
        shy = -L - h * 0.47
        sh = [(-self.hw(shy) * 0.86, shy), (self.hw(shy) * 0.86, shy)]
        hips = [(-a * 0.40, -L - 8), (a * 0.40, -L - 8)]
        lh = P['lh'] or (-a * 1.08, -L - h * 0.08)
        rh = P['rh'] or (a * 1.08, -L - h * 0.08)
        lf = P['lf'] or (-a * 0.45, 0)
        rf = P['rf'] or (a * 0.45, 0)
        arms = []
        for i, (root, tg, bd) in enumerate(((sh[0], lh, P['lbend']), (sh[1], rh, P['rbend']))):
            e, hnd = ik(root, tg, self.al, self.al, bd)
            arms.append([tw(*root), tw(*e), tw(*hnd)])
        legs = []
        ll = L * 0.56
        for root, tg in ((hips[0], lf), (hips[1], rf)):
            e, ft = ik(root, tg, ll, ll, P['kbend'])
            legs.append([tw(*root), tw(*e), tw(*ft)])
        body = [tw(px, py) for px, py in self.shape]
        return P, tw, body, arms, legs, s

    # ------------------------------------------------------------ draw
    def limb(self, f, pts, s, col, out=True, w=None):
        w = (w or self.lw) * s
        if out:
            f.line(pts, self.out, w + 3.6 * s, amp=0.3, segl=60)
            for q in (pts[0], pts[-1]):
                f.dot(q[0], q[1], (w + 3.6 * s) / 2, self.out)
        f.line(pts, col, w, amp=0.3, segl=60)
        for q in (pts[0], pts[-1]):
            f.dot(q[0], q[1], w / 2, col)

    def draw(self, f, x, y, s=1.0, p=None, t=0.0):
        P, tw, body, arms, legs, s = self.geom(x, y, s, p or {}, t)
        if P['legs']:
            for lg in legs:
                self.limb(f, lg, s, self.shade)
        f.poly(body, self.shade, self.out, 2.6 * s, amp=0.5)
        # lit base: inset & offset toward light
        lx, ly = P['light']
        cx, cy = tw(0, self.cy)
        k, off = 0.90, self.w * 0.065 * s
        base = [(cx + (bx - cx) * k + lx * off, cy + (by - cy) * k + ly * off) for bx, by in body]
        f.poly(base, self.skin, None, amp=0.4)
        self.face(f, P, tw, s, t)
        if P['arms']:
            for ar in arms:
                self.limb(f, ar, s, self.skin)
        return tw

    def face(self, f, P, tw, s, t):
        a, L, h = self.w / 2, self.L, self.h
        fc = P['face'] * a * 0.40
        ey = -L - h * 0.75
        dx = a * 0.34 * (1 - 0.25 * abs(P['face']))
        lk = P['look']
        er = 4.6
        eyes = P['eyes']
        if P['blink'] and eyes in ('open', 'wide') and ((t * 1.0 + self.seed * 0.37) % 3.9) < 0.12:
            eyes = 'blink'
        lw = 2.8 * s
        for sgn in (-1, 1):
            ex, eyy = fc + sgn * dx + lk[0], ey + lk[1]
            if eyes == 'open':
                X, Y = tw(ex, eyy)
                f.dot(X, Y, er * s, FACE)
            elif eyes == 'wide':
                X, Y = tw(ex, eyy)
                f.dot(X, Y, er * 1.35 * s, FACE)
                X2, Y2 = tw(ex + 1.6, eyy - 1.8)
                f.dot(X2, Y2, 1.5 * s, (250, 248, 240))
            elif eyes == 'half':
                pts = [tw(ex + er * math.cos(th), eyy + er * math.sin(th)) for th in np.linspace(0, math.pi, 9)]
                f.poly(pts, FACE, None, amp=0)
                f.line([tw(ex - er * 1.5, eyy - 0.5), tw(ex + er * 1.5, eyy - 0.5)], FACE, lw * 0.8, amp=0.2)
            elif eyes == 'blink':
                f.line([tw(ex - er * 1.2, eyy), tw(ex + er * 1.2, eyy)], FACE, lw, amp=0.2)
            elif eyes == 'closed':  # sleeping arc
                f.line([tw(ex + er * 1.4 * math.cos(th), eyy - 1 + er * 0.9 * math.sin(th))
                        for th in np.linspace(0.15, math.pi - 0.15, 7)], FACE, lw, amp=0.2)
            elif eyes == 'happy':
                f.line([tw(ex + er * 1.4 * math.cos(th), eyy + 2 - er * 1.1 * math.sin(th))
                        for th in np.linspace(0.15, math.pi - 0.15, 7)], FACE, lw, amp=0.2)
            elif eyes == 'shut':
                f.line([tw(ex - sgn * er * 1.3, eyy - er), tw(ex + sgn * er * 0.6, eyy), tw(ex - sgn * er * 1.3, eyy + er)],
                       FACE, lw, amp=0.2)
            # brows
            bw = a * 0.26
            by = ey - 13 - P['browy']
            inner = by + P['brow'] * 5.5
            outer = by - P['brow'] * 2.0
            bx = fc + sgn * dx
            f.line([tw(bx - sgn * bw * 0.15, inner), tw(bx + sgn * bw * 0.85, outer)], FACE, lw * 0.95, amp=0.2)
            if P['tear'] and sgn == 1:
                ty = eyy + 8 + (t * 20 % 30) * P['tear']
                X, Y = tw(ex + 2, ty)
                f.dot(X, Y, 2.6 * s, (170, 205, 235))
        # mouth
        my = ey + 22
        m = P['mouth']
        mw = 8.0
        if m == 'smile':
            f.line([tw(fc + mw * math.cos(th), my - 3 + 4.5 * math.sin(th)) for th in np.linspace(0.2, math.pi - 0.2, 7)],
                   FACE, lw, amp=0.2)
        elif m == 'frown':
            f.line([tw(fc + mw * math.cos(th), my + 4 - 4.5 * math.sin(th)) for th in np.linspace(0.2, math.pi - 0.2, 7)],
                   FACE, lw, amp=0.2)
        elif m == 'flat':
            f.line([tw(fc - mw * 0.7, my), tw(fc + mw * 0.7, my)], FACE, lw, amp=0.2)
        elif m == 'tense':
            f.line([tw(fc - mw, my), tw(fc - mw * 0.5, my - 2), tw(fc, my + 1), tw(fc + mw * 0.5, my - 2), tw(fc + mw, my)],
                   FACE, lw * 0.9, amp=0.2)
        elif m == 'open':
            f.poly([tw(fc + 6 * math.cos(th), my + 2 + 6.5 * math.sin(th)) for th in np.linspace(0, 2 * math.pi, 14)],
                   FACE, None, amp=0)
        elif m == 'o':
            f.poly([tw(fc + 3.2 * math.cos(th), my + 3.2 * math.sin(th)) for th in np.linspace(0, 2 * math.pi, 12)],
                   FACE, None, amp=0)
        elif m == 'grin':
            pts = [tw(fc + 11 * math.cos(th), my - 2 + 9 * math.sin(th)) for th in np.linspace(0, math.pi, 10)]
            f.poly(pts, FACE, None, amp=0)
        # extras
        if self.beanie or P['band']:
            pass
        if P['band']:
            y0, y1 = ey - 34, ey - 22
            pts = [tw(-self.hw(y0) + 1, y0), tw(self.hw(y0) - 1, y0), tw(self.hw(y1) - 1, y1), tw(-self.hw(y1) + 1, y1)]
            f.poly(pts, (200, 34, 36), OUTL, 2.0 * s, amp=0.3)
        if self.beanie:
            cut = -L - h * 0.86
            top = [(bx, by) for bx, by in self.shape if by < cut]
            top.sort(key=lambda q: math.atan2(q[1] - self.cy, q[0]))
            cap = [(-self.hw(cut) - 3, cut + 4)] + [(bx * 1.04, by - 2) for bx, by in top] + [(self.hw(cut) + 3, cut + 4)]
            f.poly([tw(*q) for q in cap], self.beanie, OUTL, 2.4 * s, amp=0.4)
            rim = [(-self.hw(cut) - 4, cut - 6), (self.hw(cut) + 4, cut - 6), (self.hw(cut) + 4, cut + 6),
                   (-self.hw(cut) - 4, cut + 6)]
            f.poly([tw(*q) for q in rim], mix(self.beanie, 0.78), OUTL, 2.4 * s, amp=0.3)
        if P['sweat']:
            for i in range(int(P['sweat'])):
                ph = (t * 0.9 + i * 0.47) % 1.0
                sx, sy = a * (0.95 + 0.1 * i) * (1 if i % 2 == 0 else -1), -L - h * (0.9 - 0.12 * i) + ph * 26
                X, Y = tw(sx, sy)
                r = 4.2 * s
                f.poly([(X, Y - r * 2.2), (X + r * 0.9, Y - r * 0.2), (X, Y + r), (X - r * 0.9, Y - r * 0.2)],
                       (196, 222, 244), None, amp=0)
        if P['anger']:
            X, Y = tw(a * 0.55, -L - h * 0.95)
            r = 9 * s * (1 + 0.15 * math.sin(t * 18))
            for k in range(4):
                ang = k * math.pi / 2 + math.pi / 4
                cx, cy = X + math.cos(ang) * r, Y + math.sin(ang) * r
                f.arc(cx, cy, r * 0.7, r * 0.7, ang + math.pi * 0.6, ang + math.pi * 1.4, RED, 2.6 * s, amp=0.2)


# ====================================================================== villain
class Villain(Bean):
    def __init__(self, seed=3, h=226, w=92):
        super().__init__(skin=(6, 6, 7), h=h, w=w, leg=74, limb=19, arm=50, seed=seed, outline=(6, 6, 7))

    def draw(self, f, x, y, s=1.0, p=None, t=0.0, halo=1.0, alpha=1.0):
        p = dict(p or {})
        P, tw, body, arms, legs, s = self.geom(x, y, s, p, t)
        if alpha <= 0.01:
            return tw
        lw = self.lw * s
        # ---- soft red halo through a blurred silhouette mask
        dev = [f.T(*q) for q in body]
        xs = [q[0] for q in dev]
        ys = [q[1] for q in dev]
        limbs = (arms + legs) if P['legs'] else arms
        for lb in limbs:
            for q in lb:
                X, Y = f.T(*q)
                xs.append(X)
                ys.append(Y)
        m = f.S(46 * s) + 6
        X0, Y0 = int(max(0, min(xs) - m)), int(max(0, min(ys) - m))
        X1, Y1 = int(min(W * SS, max(xs) + m)), int(min(H * SS, max(ys) + m))
        if X1 - X0 > 8 and Y1 - Y0 > 8 and halo > 0:
            q = 1 / 8
            mw, mh = max(2, int((X1 - X0) * q)), max(2, int((Y1 - Y0) * q))
            mk = Image.new('L', (mw, mh), 0)
            md = ImageDraw.Draw(mk)
            md.polygon([((X - X0) * q, (Y - Y0) * q) for X, Y in dev], fill=255)
            for lb in limbs:
                pts = [((f.T(*c)[0] - X0) * q, (f.T(*c)[1] - Y0) * q) for c in lb]
                md.line(pts, fill=255, width=max(1, int(f.S(lw / SS) * q * SS)))
            mk = mk.filter(ImageFilter.GaussianBlur(m * q / 2.4))
            gain = 1.25 * halo * alpha
            mk = mk.point(lambda v: int(min(255, v * gain)))
            mk = mk.resize((X1 - X0, Y1 - Y0), Image.BILINEAR)
            f.img.paste(RED, (X0, Y0, X1, Y1), mk)
        cx, cy = tw(0, self.cy)
        f.light(cx, cy, self.h * 1.3 * s, RED, 0.035 * halo * alpha)
        body_col = lerpc(BG, (5, 5, 6), alpha)
        rim = lerpc(BG, (235, 40, 38), alpha)
        # legs
        if P['legs']:
            for lg in legs:
                f.line(lg, rim, lw + 3.0 * s, amp=0.3, segl=60)
                for c in (lg[0], lg[-1]):
                    f.dot(c[0], c[1], (lw + 3.0 * s) / 2, rim)
        f.poly(body, None, rim, 2.6 * s, amp=0.5)
        if P['legs']:
            for lg in legs:
                f.line(lg, body_col, lw, amp=0.3, segl=60)
                for c in (lg[0], lg[-1]):
                    f.dot(c[0], c[1], lw / 2, body_col)
        f.poly(body, body_col, None, amp=0.5)
        for ar in arms:
            f.line(ar, rim, lw + 3.0 * s, amp=0.3, segl=60)
            for c in (ar[0], ar[-1]):
                f.dot(c[0], c[1], (lw + 3.0 * s) / 2, rim)
        for ar in arms:
            f.line(ar, body_col, lw, amp=0.3, segl=60)
            for c in (ar[0], ar[-1]):
                f.dot(c[0], c[1], lw / 2, body_col)
        self.vface(f, P, tw, s, t, alpha)
        return tw

    def vface(self, f, P, tw, s, t, alpha):
        a, L, h = self.w / 2, self.L, self.h
        fc = P['face'] * a * 0.40
        ey = -L - h * 0.74
        dx = a * 0.36
        eyes = P['eyes']
        ecol = lerpc(BG, (255, 50, 44), alpha)
        open_k = {'slit': 1.0, 'wide': 1.6, 'closed': 0.0}.get(eyes, 1.0)
        if isinstance(eyes, float):
            open_k = eyes
        if open_k > 0.02:
            for sgn in (-1, 1):
                ex = fc + sgn * dx
                ew = a * 0.30
                th = 4.6 * open_k
                pts_top, pts_bot = [], []
                for i in range(11):
                    u = i / 10
                    xx = ex + sgn * (-ew / 2 + ew * u)
                    tilt = (u - 0.5) * -7.0       # inner end lower
                    curve = -math.sin(u * math.pi) * 2.5
                    thick = th * math.sin(u * math.pi) ** 0.8
                    pts_top.append(tw(xx, ey + tilt + curve - thick * 0.6))
                    pts_bot.append(tw(xx, ey + tilt + curve + thick * 0.6))
                f.poly(pts_top + pts_bot[::-1], ecol, None, amp=0)
                X, Y = tw(ex, ey)
                f.light(X, Y, 14 * s, (255, 40, 30), 0.55 * open_k * alpha)
        # grin / mouth
        my = ey + 25
        talk = P['talk']
        if talk > 0.05:
            pts = [tw(fc + 13 * math.cos(th), my + 2 + 11 * talk * math.sin(th)) for th in np.linspace(0, 2 * math.pi, 16)]
            f.poly(pts, lerpc(BG, (255, 92, 60), alpha), None, amp=0)
            X, Y = tw(fc, my + 2)
            f.light(X, Y, 26 * s, (255, 60, 30), 0.9 * talk * alpha)
        elif P['grin'] > 0.05:
            gw = 16 * P['grin']
            top, bot = [], []
            for i in range(11):
                u = i / 10
                xx = fc - gw + 2 * gw * u
                yy = my + math.sin(u * math.pi) * 6 * P['grin']
                k = math.sin(u * math.pi) * 2.2
                top.append(tw(xx, yy - k * 0.4))
                bot.append(tw(xx, yy + k))
            f.poly(top + bot[::-1], ecol, None, amp=0)


# ====================================================================== red text / sparks
_mask_cache = {}


def text_points(s, size, path=HAND, n=260):
    key = (s, size, path)
    if key not in _mask_cache:
        fnt = font(path, size)
        w = int(fnt.getlength(s)) + 20
        hgt = int(size * 1.5)
        im = Image.new('L', (w, hgt), 0)
        ImageDraw.Draw(im).text((w / 2, hgt / 2), s, fill=255, font=fnt, anchor='mm')
        a = np.asarray(im)
        ys, xs = np.nonzero(a > 128)
        r = np.random.default_rng(len(s) * 31 + size)
        idx = r.choice(len(xs), min(n, len(xs)), replace=False) if len(xs) else []
        _mask_cache[key] = [(xs[i] - w / 2, ys[i] - hgt / 2) for i in idx]
    return _mask_cache[key]


def red_text(f, x, y, s, size=60, alpha=1.0, col=RED, glow=0.35, wob=0.8, path=HAND, appear=1.0):
    """Villain line: red handwriting with soft glow, typed on by `appear`."""
    if alpha <= 0.01:
        return
    n = int(round(len(s) * clamp(appear)))
    shown = s[:n]
    if not shown:
        return
    c = lerpc(BG, col, alpha)
    f.text(x - f.text_w(s, size, path) / 2, y, shown, size, c, path, anchor='lm', wob=wob)
    w = f.text_w(s, size, path)
    for k in range(4):
        f.light(x - w / 2 + w * (k + 0.5) / 4 * clamp(appear), y, size * 0.8, col, glow * alpha * 0.5)


def shatter(f, x, y, s, size, dt, impact, col=RED, seed=1):
    """Text exploded into red sparks dt seconds ago, away from `impact`."""
    pts = text_points(s, size)
    if dt < 0:
        red_text(f, x, y, s, size)
        return
    if dt > 1.4:
        return
    r = np.random.default_rng(seed)
    g = 900
    fade = 1 - dt / 1.4
    for i, (px, py) in enumerate(pts):
        ox, oy = x + px, y + py
        vx, vy = ox - impact[0], oy - impact[1]
        d = math.hypot(vx, vy) + 1e-6
        sp = r.uniform(220, 820)
        vx, vy = vx / d * sp + r.normal(0, 120), vy / d * sp - r.uniform(80, 300)
        px1 = ox + vx * dt
        py1 = oy + vy * dt + 0.5 * g * dt * dt
        tail = 0.025
        px0 = ox + vx * (dt - tail)
        py0 = oy + vy * (dt - tail) + 0.5 * g * (dt - tail) ** 2
        hot = lerpc((255, 190, 120), col, clamp(dt * 1.6))
        f.line([(px0, py0), (px1, py1)], lerpc(BG, hot, fade), 2.6, amp=0)
        if i % 9 == 0:
            f.light(px1, py1, 16, (255, 70, 40), 0.5 * fade)
