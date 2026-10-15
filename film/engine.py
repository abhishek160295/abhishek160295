"""Vector frame engine: camera, boiling chalk lines, glow buffer, post chain."""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.ndimage import gaussian_filter, uniform_filter1d

W, H, SS, FPS = 1920, 1080, 2, 24
LB = 128                      # letterbox bar height
BG = (11, 11, 13)
CHALK = (132, 132, 138)
DIM = (74, 74, 80)
FAINT = (44, 44, 50)
INK = (32, 29, 27)
RED = (215, 28, 30)
MINT = (110, 228, 180)
CREAM = (234, 228, 210)
WHITE = (242, 240, 234)
WARM = (255, 178, 92)
COLD = (120, 150, 210)

HERE = os.path.dirname(os.path.abspath(__file__))
GAEGU = os.path.join(HERE, 'fonts', 'Gaegu-Bold.ttf')
HAND = os.path.join(HERE, 'fonts', 'PatrickHand-Regular.ttf')

_fonts = {}


def font(path, size):
    key = (path, max(4, int(round(size))))
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, key[1])
    return _fonts[key]


# ---------------------------------------------------------------- easing
def clamp(v, a=0.0, b=1.0):
    return a if v < a else b if v > b else v


def seg(t, a, b):
    return clamp((t - a) / (b - a)) if b != a else float(t >= a)


def smooth(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def eout(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ein(x):
    x = clamp(x)
    return x ** 3


def lerp(a, b, x):
    return a + (b - a) * x


def lerpc(c0, c1, x):
    return tuple(int(lerp(a, b, x)) for a, b in zip(c0, c1))


def mix(c, k):
    return tuple(int(clamp(v * k, 0, 255)) for v in c)


def back(x):  # overshoot ease
    x = clamp(x)
    c = 1.7
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def hash01(*a):
    h = 2166136261
    for v in a:
        h = ((h ^ (int(v * 1000) & 0xffffffff)) * 16777619) & 0xffffffff
    return h / 0xffffffff


# ---------------------------------------------------------------- post assets
_post = {}


def _assets():
    if not _post:
        r = np.random.default_rng(7)
        _post['grain'] = [r.normal(0, 5.0, (H, W)).astype(np.float32) for _ in range(6)]
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 1.414
        _post['vig'] = np.clip(1 - 0.55 * d ** 2.3, 0, 1)[..., None].astype(np.float32)
    return _post


class Frame:
    def __init__(self, t, fi):
        self.t, self.fi = t, fi
        self.img = Image.new('RGB', (W * SS, H * SS), BG)
        self.d = ImageDraw.Draw(self.img)
        self.glow = np.zeros((H // 4, W // 4, 3), np.float32)
        self.zoom, self.cx, self.cy, self.par = 1.0, 960.0, 540.0, 1.0
        self.shx = self.shy = 0.0
        self.bt = int(t * 8)
        self.k = 0
        self.whip = 0.0
        self.fade = 1.0
        self.glitch = []
        self.flash = 0.0
        self.over = []          # 1x screen-space text drawn after post
        self.letterbox = True
        self.grain = 1.0
        self.boil = 1.0

    # ---------------- camera
    def cam(self, zoom=1.0, cx=960.0, cy=540.0):
        self.zoom, self.cx, self.cy = zoom, cx, cy

    def layer(self, d):
        self.par = d

    def _z(self):
        return max(0.05, 1 + (self.zoom - 1) * self.par) if self.par != 1 else self.zoom

    def T(self, x, y):
        p = self.par
        z = self._z()
        cx = 960 + (self.cx - 960) * p
        cy = 540 + (self.cy - 540) * p
        return (((x - cx) * z + 960 + self.shx) * SS, ((y - cy) * z + 540 + self.shy) * SS)

    def Ta(self, a):
        p = self.par
        z = self._z()
        cx = 960 + (self.cx - 960) * p
        cy = 540 + (self.cy - 540) * p
        o = np.empty_like(a, dtype=np.float64)
        o[:, 0] = ((a[:, 0] - cx) * z + 960 + self.shx) * SS
        o[:, 1] = ((a[:, 1] - cy) * z + 540 + self.shy) * SS
        return o

    def S(self, v):
        return v * self._z() * SS

    def rng(self, salt=0):
        self.k += 1
        return np.random.default_rng((self.bt * 7919 + self.k * 104729 + salt * 31) & 0xffffffff)

    # ---------------- primitives (world coords)
    def _sub(self, pts, closed, segl):
        if closed:
            pts = list(pts) + [pts[0]]
        out = []
        for i in range(len(pts) - 1):
            x0, y0 = pts[i]
            x1, y1 = pts[i + 1]
            n = max(1, int(math.hypot(x1 - x0, y1 - y0) / segl))
            for j in range(n):
                out.append((x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n))
        out.append(pts[-1])
        return np.array(out, float)

    def line(self, pts, col=CHALK, w=2.0, amp=1.0, closed=False, segl=40):
        if len(pts) < 2:
            return
        a = self._sub(pts, closed, segl)
        if amp > 0 and self.boil:
            a = a + self.rng().normal(0, amp * 0.5 * self.boil, a.shape)
            if closed:
                a[-1] = a[0]
        dev = self.Ta(a)
        self.d.line([tuple(p) for p in dev], fill=col, width=max(1, int(round(self.S(w)))), joint='curve')

    def poly(self, pts, fill=None, out=None, w=2.0, amp=0.6):
        a = np.array(pts, float)
        if amp > 0 and self.boil:
            a = a + self.rng().normal(0, amp * 0.5 * self.boil, a.shape)
        dev = [tuple(p) for p in self.Ta(a)]
        if fill is not None:
            self.d.polygon(dev, fill=fill)
        if out is not None:
            self.line(list(map(tuple, a)), out, w, amp=0, closed=True)

    def ell_pts(self, x, y, rx, ry, n=36, a0=0, a1=2 * math.pi):
        return [(x + rx * math.cos(a0 + (a1 - a0) * i / n), y + ry * math.sin(a0 + (a1 - a0) * i / n))
                for i in range(n + (0 if a1 - a0 >= 2 * math.pi - 1e-6 else 1))]

    def ell(self, x, y, rx, ry=None, fill=None, out=None, w=2.0, amp=0.5):
        ry = rx if ry is None else ry
        n = int(clamp(max(rx, ry) * self._z() / 2, 12, 64))
        self.poly(self.ell_pts(x, y, rx, ry, n), fill, out, w, amp)

    def dot(self, x, y, r, col):
        X, Y = self.T(x, y)
        R = self.S(r)
        self.d.ellipse((X - R, Y - R, X + R, Y + R), fill=col)

    def arc(self, x, y, rx, ry, a0, a1, col=CHALK, w=2.0, amp=0.4):
        self.line(self.ell_pts(x, y, rx, ry, 18, a0, a1), col, w, amp)

    def rect(self, x0, y0, x1, y1, fill=None, out=CHALK, w=2.0, amp=1.0):
        pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        if fill is not None:
            self.poly(pts, fill, None, amp=amp * 0.4)
        if out is not None:
            self.line(pts, out, w, amp, closed=True)

    def rrect(self, x0, y0, x1, y1, r, fill=None, out=CHALK, w=2.0, amp=0.8):
        pts = []
        for cx, cy, a in ((x1 - r, y0 + r, -math.pi / 2), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, math.pi / 2),
                          (x0 + r, y0 + r, math.pi)):
            for i in range(7):
                aa = a + math.pi / 2 * i / 6
                pts.append((cx + r * math.cos(aa), cy + r * math.sin(aa)))
        if fill is not None:
            self.poly(pts, fill, None, amp=amp * 0.3)
        if out is not None:
            self.line(pts, out, w, amp, closed=True)

    def text(self, x, y, s, size, col=WHITE, path=HAND, anchor='mm', wob=0.0, stroke=0.0):
        X, Y = self.T(x, y)
        if wob:
            r = self.rng()
            X += r.normal(0, wob * SS)
            Y += r.normal(0, wob * SS)
        if stroke:
            self.d.text((X, Y), s, fill=col, font=font(path, self.S(size)), anchor=anchor,
                        stroke_width=max(1, int(self.S(stroke))), stroke_fill=(8, 4, 4))
        else:
            self.d.text((X, Y), s, fill=col, font=font(path, self.S(size)), anchor=anchor)

    def text_w(self, s, size, path=HAND):
        return font(path, size * 4).getlength(s) / 4

    # ---------------- light (glow buffer, quarter res)
    def light(self, x, y, r, col, k=1.0):
        X, Y = self.T(x, y)
        X /= SS * 4
        Y /= SS * 4
        R = max(0.7, self.S(r) / (SS * 4))
        x0, x1 = int(max(0, X - 3 * R)), int(min(W // 4, X + 3 * R + 1))
        y0, y1 = int(max(0, Y - 3 * R)), int(min(H // 4, Y + 3 * R + 1))
        if x0 >= x1 or y0 >= y1 or k <= 0:
            return
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        g = np.exp(-((xx - X) ** 2 + (yy - Y) ** 2) / (R * R)) * k
        self.glow[y0:y1, x0:x1] += g[..., None] * (np.array(col, np.float32) / 255)

    def beam(self, pts, col, k=0.5, blur=5, src=None, length=None):
        m = Image.new('L', (W // 4, H // 4), 0)
        dev = [(p[0] / (SS * 4), p[1] / (SS * 4)) for p in (self.T(*q) for q in pts)]
        ImageDraw.Draw(m).polygon(dev, fill=255)
        a = np.asarray(m, np.float32) / 255
        a = gaussian_filter(a, self.S(blur) / (SS * 4) * 2 + 0.5)
        if src is not None:
            sx, sy = self.T(*src)
            sx /= SS * 4
            sy /= SS * 4
            L = self.S(length) / (SS * 4)
            yy, xx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
            a *= np.clip(1 - np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2) / L, 0, 1) ** 1.4
        self.glow += (a * k)[..., None] * (np.array(col, np.float32) / 255)

    def ambient(self, col, k):
        self.glow += np.array(col, np.float32) / 255 * k

    # ---------------- screen-space overlay text (drawn crisp after post)
    def otext(self, x, y, s, size, col=WHITE, path=HAND, anchor='mm', alpha=1.0, stroke=0):
        if alpha > 0.01:
            self.over.append((x, y, s, size, col, path, anchor, alpha, stroke))

    def caption(self, s, alpha=1.0, col=WHITE):
        self.otext(960, H - LB / 2 + 2, s, 52, col, HAND, 'mm', alpha)

    # ---------------- final
    def finish(self):
        A = _assets()
        im = self.img.resize((W, H), Image.LANCZOS)
        a = np.asarray(im, np.float32).copy()
        g = self.glow
        G = np.stack([np.asarray(Image.fromarray(np.ascontiguousarray(g[..., c])).resize((W, H), Image.BILINEAR))
                      for c in range(3)], -1)
        a += G * 255
        sm = a[::4, ::4]
        br = np.clip(sm - 170, 0, None)
        if br.max() > 0:
            br = gaussian_filter(br, (6, 6, 0))
            Bu = np.stack([np.asarray(Image.fromarray(np.ascontiguousarray(br[..., c])).resize((W, H), Image.BILINEAR))
                           for c in range(3)], -1)
            a += Bu * 0.55
        knee = 205.0
        hi = a > knee
        a[hi] = knee + 50 * np.tanh((a[hi] - knee) / 50)
        a *= A['vig']
        if self.grain:
            a += A['grain'][self.fi % 6][..., None] * self.grain
        if self.flash:
            a += 255 * self.flash
        if self.whip > 0.5:
            a = uniform_filter1d(a, int(self.whip) | 1, axis=1, mode='nearest')
        for (x0, y0, x1, y1, amt, seed) in self.glitch:
            self._glitch(a, x0, y0, x1, y1, amt, seed)
        a *= self.fade
        if self.letterbox:
            a[:LB] = 0
            a[H - LB:] = 0
        out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
        if self.over:
            ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            od = ImageDraw.Draw(ov)
            for (x, y, s, size, col, path, anchor, alpha, stroke) in self.over:
                od.text((x, y), s, fill=tuple(col) + (int(255 * clamp(alpha)),), font=font(path, size),
                        anchor=anchor, stroke_width=stroke, stroke_fill=(0, 0, 0, int(255 * clamp(alpha))))
            out = Image.alpha_composite(out.convert('RGBA'), ov).convert('RGB')
        return out

    def _glitch(self, a, x0, y0, x1, y1, amt, seed):
        r = np.random.default_rng(seed)
        x0, x1 = int(clamp(x0, 0, W)), int(clamp(x1, 0, W))
        y0, y1 = int(clamp(y0, 0, H)), int(clamp(y1, 0, H))
        if x1 - x0 < 4 or y1 - y0 < 4:
            return
        reg = a[y0:y1, x0:x1].copy()
        y = 0
        while y < reg.shape[0]:
            h = int(r.integers(6, 40))
            if r.random() < 0.55:
                reg[y:y + h] = np.roll(reg[y:y + h], int(r.normal(0, 30 * amt)), axis=1)
            y += h
        sh = int(8 * amt) + 1
        reg[..., 0] = np.roll(reg[..., 0], sh, axis=1)
        reg[..., 2] = np.roll(reg[..., 2], -sh, axis=1)
        a[y0:y1, x0:x1] = reg


def in_poly(x, y, poly):
    n = len(poly)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi:
            inside = not inside
        j = i
    return inside
