import os, math
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'Nunito.ttf')
_fc = {}
def font(size, w='Black'):
    k = (size, w)
    if k not in _fc:
        f = ImageFont.truetype(FONT, size); f.set_variation_by_name(w); _fc[k] = f
    return _fc[k]

def interp(t, pts):
    xs, ys = zip(*pts); return float(np.interp(t, xs, ys))

def ease(x):
    x = min(max(x, 0), 1); return 1 - (1 - x) ** 3

def B(x0, y0, x1, y1, m=0):
    return (x0 * 3 - m, y0 * 3 - m, x1 * 3 + m, y1 * 3 + m)

def inpaint(fr, box, r=9):
    x0, y0, x1, y1 = box; p = 24
    X0, Y0, X1, Y1 = max(x0 - p, 0), max(y0 - p, 0), min(x1 + p, 1920), min(y1 + p, 1080)
    crop = np.ascontiguousarray(fr[Y0:Y1, X0:X1])
    m = np.zeros(crop.shape[:2], np.uint8); m[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = 255
    out = cv2.inpaint(crop, m, r, cv2.INPAINT_TELEA)
    # soften the filled area so it reads as smooth background, not smear
    blur = cv2.GaussianBlur(out, (0, 0), 6)
    mm = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 4)[..., None]
    fr[Y0:Y1, X0:X1] = (blur * mm + crop * (1 - mm)).astype(np.uint8)

def overlay(fr, layer):
    a = layer[..., 3:4].astype(np.float32) / 255
    fr[:] = (layer[..., :3] * a + fr * (1 - a)).astype(np.uint8)

def canvas():
    return Image.new('RGBA', (1920, 1080), (0, 0, 0, 0))

def text(fr, s, cx, cy, size, color, w='Black', glow=None, glow_r=14, shadow=True, anchor='mm', alpha=1.0, scale=1.0):
    size = max(int(size * scale), 4)
    im = canvas(); d = ImageDraw.Draw(im); f = font(size, w)
    if glow:
        g = canvas(); ImageDraw.Draw(g).text((cx, cy), s, font=f, fill=glow + (200,), anchor=anchor)
        g = g.filter(ImageFilter.GaussianBlur(glow_r)); im = Image.alpha_composite(im, g); im = Image.alpha_composite(im, g)
        d = ImageDraw.Draw(im)
    if shadow:
        sh = canvas(); ImageDraw.Draw(sh).text((cx, cy + size * 0.06), s, font=f, fill=(0, 0, 0, 120), anchor=anchor)
        im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3))); d = ImageDraw.Draw(im)
    d.text((cx, cy), s, font=f, fill=tuple(color) + (255,), anchor=anchor)
    a = np.array(im); a[..., 3] = (a[..., 3] * alpha).astype(np.uint8); overlay(fr, a)

def pill(fr, box, fill=(10, 14, 28), a=0.82, r=None, border=None, alpha=1.0):
    im = canvas(); d = ImageDraw.Draw(im); x0, y0, x1, y1 = box; r = r or (y1 - y0) // 2
    sh = canvas(); ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 8, x1, y1 + 8), r, fill=(0, 0, 0, int(110 * alpha)))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(10))); d = ImageDraw.Draw(im)
    d.rounded_rectangle(box, r, fill=fill + (int(255 * a * alpha),), outline=(border + (int(255 * alpha),)) if border else None, width=4 if border else 0)
    overlay(fr, np.array(im))

def badge(fr, cx, cy, R, label, ring=(255, 196, 61), prog=1.0, alpha=1.0):
    im = canvas(); d = ImageDraw.Draw(im)
    g = canvas(); ImageDraw.Draw(g).ellipse((cx - R - 6, cy - R - 6, cx + R + 6, cy + R + 6), outline=ring + (int(150 * alpha),), width=10)
    im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(8))); d = ImageDraw.Draw(im)
    d.ellipse((cx - R, cy - R, cx + R, cy + R), fill=(12, 16, 30, int(240 * alpha)))
    d.ellipse((cx - R, cy - R, cx + R, cy + R), outline=(255, 255, 255, int(40 * alpha)), width=6)
    d.arc((cx - R, cy - R, cx + R, cy + R), -90, -90 + 360 * prog, fill=ring + (int(255 * alpha),), width=7)
    overlay(fr, np.array(im))
    text(fr, label, cx, cy + 2, int(R * 0.62), (255, 255, 255), alpha=alpha, shadow=False)

def mmss(s):
    s = max(int(math.ceil(s)), 0); return f'{s // 60}:{s % 60:02d}'

def pop(t, t0, d=0.22):
    x = (t - t0) / d
    if x >= 1: return 1.0, 1.0
    x = max(x, 0); return 0.85 + 0.15 * ease(x), ease(x)

GREEN = (64, 214, 140); WHITE = (246, 247, 250); NAVY = (29, 29, 40)

# ---------- patch definitions (t in ORIGINAL timeline seconds) ----------
def pA(fr, t):
    inpaint(fr, B(418, 202, 507, 231))
    v = min(2.0, max(0, 0.8 * (t - 5.0))) / 5
    text(fr, f'{v:.2f} SEC', 462 * 3, 216 * 3, 54, NAVY, shadow=False)

def pB(fr, t):
    inpaint(fr, B(372, 90, 492, 129))
    text(fr, '+0.5 SEC', 432 * 3, 109 * 3, 88, (249, 213, 69), glow=(249, 213, 69), glow_r=18)

def pC(fr, t):
    s, a = pop(t, 39.62)
    pill(fr, (410, 750, 1510, 940), fill=(8, 40, 34), a=0.97, border=(64, 214, 140), alpha=a)
    text(fr, '500× FASTER', 960, 845, 120, GREEN, glow=GREEN, glow_r=22, alpha=a, scale=s)

def pD(fr, t):
    inpaint(fr, B(402, 209, 498, 240))
    v = min(90, max(0, 45 * (t - 42.65))) / 5
    text(fr, f'{round(v)} SEC', 449 * 3, 224 * 3, 56, NAVY, shadow=False)

def pE(fr, t):
    inpaint(fr, B(410, 208, 492, 242))
    v = min(60, max(0, (t - 45.2) / 2.25 * 60))
    text(fr, f'{round(v)} SEC', 450 * 3, 224 * 3, 52, NAVY, shadow=False)

def pF(fr, t):
    inpaint(fr, B(150, 16, 490, 60))
    text(fr, 'EXACTLY 60 SECONDS', 320 * 3, 38 * 3, 84, WHITE)
    inpaint(fr, B(150, 160, 262, 215))
    old = 300 - 8 * (t - 57.62)
    text(fr, mmss(old / 5), 208 * 3, 188 * 3, 132, WHITE)

def pG(fr, t):
    s, a = pop(t, 65.55, 0.3)
    im = np.zeros((1080, 1920, 4), np.uint8)
    y = np.arange(1080)[:, None].astype(np.float32)
    band = np.clip(np.minimum((y - 150) / 70, (620 - y) / 70), 0, 1)
    im[..., :3] = (6, 12, 24); im[..., 3] = np.broadcast_to(245 * a * band, (1080, 1920)).astype(np.uint8)
    overlay(fr, im)
    text(fr, 'WHAT IF YOUR BODY', 960, 300, 92, WHITE, alpha=a, scale=s)
    text(fr, 'HEALED 500× FASTER?', 960, 430, 150, GREEN, glow=GREEN, glow_r=26, alpha=a, scale=s)

def pH(fr, t):
    inpaint(fr, B(503, 27, 602, 69))
    old = interp(t, [(100.6, 0), (101, 92), (102, 312), (102.5, 456), (102.8, 500)])
    text(fr, f'{int(old * 2):,}', 1659, 144, 96, WHITE)

def pI(fr, t):
    inpaint(fr, B(160, 308, 480, 342))
    text(fr, 'FUSES CROOKED IN 60 SEC', 320 * 3, 325 * 3, 66, (246, 143, 105), glow=(246, 143, 105), glow_r=12)

def pJ(fr, t):
    old = 292 - (t - 159)
    badge(fr, 573 * 3, 55 * 3, 96, mmss(old / 5), ring=(242, 72, 58), prog=(old / 5) / 60)
    a = ease((t - 157.6) / 0.3)
    pill(fr, (40, 895, 1080, 1015), fill=(8, 30, 22), a=0.9, border=GREEN, alpha=a)
    text(fr, 'BEFORE THE 60-SECOND MARK', 560, 955, 58, GREEN, alpha=a)

def pK(fr, t):
    inpaint(fr, B(292, 135, 524, 208))
    old = interp(t, [(174.9, 37.0), (177.0, 41.0)])
    v = 37 + (old - 37) * 1.25; p = (v - 37) / 5
    col = tuple(int(255 * (1 - p) + c * p) for c in (254, 102, 71))
    text(fr, f'{v:.1f}°C', 408 * 3, 172 * 3, 190, col, glow=(254, 102, 71) if p > 0.5 else None, glow_r=24)

def pL(fr, t):
    a = ease((t - 178.75) / 0.25)
    pill(fr, (54, 40, 620, 236), fill=(12, 14, 40), a=0.9, r=30, alpha=a)
    text(fr, '42°C', 90, 100, 72, (246, 143, 105), anchor='lm', alpha=a)
    text(fr, 'SOAKED IN 40 SEC', 90, 186, 56, (156, 202, 230), anchor='lm', alpha=a)

def pM(fr, t):
    inpaint(fr, B(296, 230, 480, 279))
    old = interp(t, [(181.6, 72), (183, 177), (185, 180)])
    text(fr, f'{round(old * 220 / 180)} BPM', 388 * 3, 254 * 3, 104, (251, 108, 113), glow=(251, 108, 113), glow_r=16)

def pN(fr, t):
    inpaint(fr, B(196, 316, 444, 350))
    text(fr, 'SPAT OUT IN 4 SEC', 320 * 3, 333 * 3, 66, (120, 220, 160))

def ring_txt(fr, box, cx, cy, size, old):
    inpaint(fr, box)
    text(fr, mmss(old / 5), cx, cy, size, WHITE)

def pO(fr, t): ring_txt(fr, B(408, 152, 502, 202), 455 * 3, 178 * 3, 92, 281 - 18 * (t - 223))
def pP(fr, t): ring_txt(fr, B(453, 158, 542, 212), 497 * 3, 184 * 3, 112, 271 - 3 * (t - 310))

def pQ(fr, t):
    pill(fr, (54, 30, 900, 150), fill=(8, 14, 30), a=0.92, r=30)
    text(fr, '48 SECONDS OF AGONY', 96, 92, 66, WHITE, anchor='lm')
    old = 234 - 6 * (t - 346)
    badge(fr, 573 * 3, 55 * 3, 96, mmss(old / 5), ring=(255, 196, 61), prog=(old / 5) / 60)

def pR(fr, t):
    inpaint(fr, B(110, 22, 530, 62))
    text(fr, 'WHAT IF YOU HEALED 500× FASTER?', 320 * 3, 43 * 3, 66, WHITE)

PATCHES = [
    (5.21, 8.08, pA), (10.25, 13.70, pB), (39.62, 42.45, pC), (42.46, 45.17, pD), (45.17, 47.91, pE),
    (57.54, 61.61, pF), (65.52, 68.61, pG), (100.0, 102.95, pH), (138.9, 145.11, pI), (157.54, 160.03, pJ),
    (174.92, 178.70, pK), (178.71, 181.52, pL), (181.55, 186.37, pM), (199.38, 203.15, pN),
    (221.96, 226.49, pO), (308.42, 314.70, pP), (344.96, 348.53, pQ), (425.0, 429.5, pR),
]

def apply(fr, t):
    for t0, t1, fn in PATCHES:
        if t0 <= t < t1: fn(fr, t)
    return fr
