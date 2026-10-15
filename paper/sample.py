"""10-second style sample: watercolour-on-paper explainer, '2 levels up' from flat AI stills.
Everything moves: breathing camera, boiling ink, pigment washes, kinetic stamps, dust in light."""
import math, os, sys, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'film'))
import engine as E
from engine import Frame, W, H, SS, FPS, font, GAEGU, HAND, clamp, seg, smooth, eout, ein, lerp, back

PAPER = (238, 230, 214)
INK = (58, 48, 44)
SAGE, PEACH, RUST, TEAL, OCHRE, SKY = (176, 190, 168), (240, 196, 160), (190, 92, 70), (70, 130, 132), (214, 168, 84), (172, 200, 214)
DUR = 10.0
NF = int(DUR * FPS)

# ------------------------------------------------------------------ paper texture (fibres + tooth), once
r = np.random.default_rng(3)
tooth = gaussian_filter(r.normal(0, 1, (H, W)), 1.2)
fib = gaussian_filter(r.normal(0, 1, (H, W)), (0.6, 9)) + gaussian_filter(r.normal(0, 1, (H, W)), (7, 0.7))
blot = gaussian_filter(r.normal(0, 1, (H, W)), 60)
PAPERTEX = (1 + 0.022 * tooth / tooth.std() + 0.016 * fib / fib.std() + 0.008 * blot / blot.std()).astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = np.clip(1 - 0.16 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.3, 0, 1)[..., None]


def wash(f, pts, col, a=0.9, edge=0.35, soft=2.5, seed=0):
    """Watercolour fill: soft-edged pigment with darker dried edges and granulation."""
    dev = [f.T(x, y) for x, y in pts]
    xs = [p[0] for p in dev]
    ys = [p[1] for p in dev]
    pad = 30
    X0, Y0 = int(max(0, min(xs) - pad)), int(max(0, min(ys) - pad))
    X1, Y1 = int(min(W * SS, max(xs) + pad)), int(min(H * SS, max(ys) + pad))
    if X1 - X0 < 3 or Y1 - Y0 < 3:
        return
    q = 0.5
    w, h = max(2, int((X1 - X0) * q)), max(2, int((Y1 - Y0) * q))
    m = Image.new('L', (w, h), 0)
    jr = np.random.default_rng(seed)
    ImageDraw.Draw(m).polygon([((x - X0) * q + jr.normal(0, 0.8), (y - Y0) * q + jr.normal(0, 0.8)) for x, y in dev], fill=255)
    M = np.asarray(m, np.float32) / 255
    Ms = gaussian_filter(M, soft)
    E = np.clip(Ms - gaussian_filter(M, soft * 4), 0, 1) * 2.2           # pigment pooled at the edge
    gran = 1 + 0.10 * gaussian_filter(jr.normal(0, 1, M.shape), 1.0)
    A = np.clip(Ms * a * gran, 0, 1)
    region = np.asarray(f.img.crop((X0, Y0, X1, Y1)).resize((w, h), Image.BILINEAR), np.float32)
    c = np.array(col, np.float32)
    dark = c * (1 - 0.35 * np.clip(E * edge * 3, 0, 1))[..., None]
    out = region * (1 - A[..., None]) + (region * dark / 255) * A[..., None] * 1.0 + 0 * c   # multiply-like glaze
    out = region * (1 - A[..., None]) + np.minimum(region, dark) * A[..., None]
    o = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).resize((X1 - X0, Y1 - Y0), Image.BILINEAR)
    am = Image.fromarray((np.clip(A * 1.2, 0, 1) * 255).astype(np.uint8)).resize((X1 - X0, Y1 - Y0), Image.BILINEAR)
    f.img.paste(o, (X0, Y0), am)


def ink(f, pts, w=3.0, amp=1.1, col=INK, closed=False):
    f.line(pts, col, w, amp=amp, closed=closed, segl=26)


def circ(cx, cy, r, n=28, a0=0, a1=2 * math.pi):
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / n), cy + r * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]


def blob(cx, cy, rx, ry, n=24, seed=0, wob=0.08):
    jr = np.random.default_rng(seed)
    ph = jr.uniform(0, 6.28, 3)
    return [(cx + rx * math.cos(t) * (1 + wob * math.sin(3 * t + ph[0])), cy + ry * math.sin(t) * (1 + wob * math.cos(2 * t + ph[1])))
            for t in np.linspace(0, 2 * math.pi, n, endpoint=False)]


# ------------------------------------------------------------------ the hero: Kai
def kai(f, x, y, s=1.0, t=0.0, p=None):
    """Round-headed stick figure in a teal hoodie with a red headband. y = feet."""
    p = p or {}
    lean = p.get('lean', 0.0)
    breathe = 1 + 0.015 * math.sin(t * 2.4)
    hr = 42 * s
    torso_h = 78 * s * breathe
    leg = 74 * s
    hip = (x + lean * 20 * s, y - leg)
    neck = (hip[0] + lean * 30 * s, hip[1] - torso_h)
    head = (neck[0] + lean * 12 * s + p.get('hx', 0) * s, neck[1] - hr - 2 * s + p.get('hy', 0) * s)
    # legs
    st = p.get('stride', 0.0)
    for sgn, ph in ((-1, 0), (1, math.pi)):
        sw = math.sin(st + ph)
        knee = (hip[0] + sgn * 9 * s + sw * 18 * s, hip[1] + leg * 0.5 - max(0, -sw) * 6 * s)
        foot = (hip[0] + sgn * 12 * s + sw * 30 * s, y - max(0, math.cos(st + ph)) * 10 * s * (1 if st else 0))
        ink(f, [hip, knee, foot], 4.2 * s, 0.6)
        ink(f, [foot, (foot[0] + 12 * s, foot[1])], 4.2 * s, 0.4)
    # hoodie torso (wash + ink)
    tw0, tw1 = 24 * s, 30 * s
    body = [(neck[0] - tw0 * 0.6, neck[1] + 2 * s), (neck[0] + tw0 * 0.6, neck[1] + 2 * s), (neck[0] + tw0, neck[1] + 12 * s),
            (hip[0] + tw1, hip[1] - 4 * s), (hip[0] + tw1 * 0.85, hip[1] + 8 * s), (hip[0] - tw1 * 0.85, hip[1] + 8 * s),
            (hip[0] - tw1, hip[1] - 4 * s), (neck[0] - tw0, neck[1] + 12 * s)]
    wash(f, body, TEAL, 0.95, seed=11)
    ink(f, body, 3.2 * s, 0.6, closed=True)
    ink(f, [(neck[0] - 12 * s, neck[1] + 4 * s), (neck[0], neck[1] + 22 * s), (neck[0] + 12 * s, neck[1] + 4 * s)], 2.2 * s, 0.4)
    ink(f, [(hip[0] - tw1 * 0.5, hip[1] - 22 * s), (hip[0] + tw1 * 0.5, hip[1] - 22 * s)], 2.0 * s, 0.4)
    # arms
    for sgn, key in ((-1, 'lh'), (1, 'rh')):
        sh = (neck[0] + sgn * tw0 * 0.9, neck[1] + 14 * s)
        hand = p.get(key) or (sh[0] + sgn * 14 * s - math.sin(st) * sgn * 0, sh[1] + 62 * s)
        el = ((sh[0] + hand[0]) / 2 + sgn * 10 * s, (sh[1] + hand[1]) / 2 + 4 * s)
        ink(f, [sh, el, hand], 4.2 * s, 0.6)
        f.dot(hand[0], hand[1], 5.5 * s, INK)
    # head
    wash(f, circ(*head, hr, 30), (246, 232, 214), 0.95, edge=0.2, seed=7)
    ink(f, circ(*head, hr, 30), 3.4 * s, 0.7)
    wash(f, circ(head[0] + 16 * s, head[1] + 10 * s, 7 * s, 12), (236, 150, 140), 0.5, seed=9)
    eyes = p.get('eyes', 'open')
    for sgn in (-1, 1):
        ex, ey = head[0] + sgn * 11 * s + p.get('look', 0) * s, head[1] - 2 * s
        blink = (t * 0.9 + 0.3) % 3.3 < 0.12
        if eyes == 'closed' or blink:
            ink(f, [(ex - 5 * s, ey), (ex, ey + 3 * s), (ex + 5 * s, ey)], 2.6 * s, 0.2)
        elif eyes == 'half':
            ink(f, [(ex - 6 * s, ey - 2 * s), (ex + 6 * s, ey - 2 * s)], 2.4 * s, 0.2)
            f.dot(ex, ey + 1 * s, 3.2 * s, INK)
        else:
            f.dot(ex, ey, 4.2 * s, INK)
        b = p.get('brow', 0)
        ink(f, [(ex - 7 * s, ey - 11 * s + sgn * b * 3 * s * -1), (ex + 7 * s, ey - 11 * s + sgn * b * 3 * s)], 2.6 * s, 0.2)
    m = p.get('mouth', 'flat')
    mx, my = head[0], head[1] + 14 * s
    if m == 'smile':
        ink(f, circ(mx, my - 4 * s, 8 * s, 8, 0.3, math.pi - 0.3), 2.6 * s, 0.2)
    elif m == 'tense':
        ink(f, [(mx - 8 * s, my), (mx - 3 * s, my - 2 * s), (mx + 3 * s, my + 1 * s), (mx + 8 * s, my - 1 * s)], 2.4 * s, 0.2)
    else:
        ink(f, [(mx - 6 * s, my), (mx + 6 * s, my)], 2.4 * s, 0.2)
    if p.get('band'):
        bb = [(head[0] - hr * 0.98, head[1] - hr * 0.42), (head[0] + hr * 0.98, head[1] - hr * 0.42),
              (head[0] + hr * 0.92, head[1] - hr * 0.62), (head[0] - hr * 0.92, head[1] - hr * 0.62)]
        wash(f, bb, (206, 52, 44), 1.0, seed=13)
        ink(f, bb, 2.4 * s, 0.4, closed=True)
        ink(f, [(head[0] + hr * 0.95, head[1] - hr * 0.5), (head[0] + hr * 1.45, head[1] - hr * 0.2)], 4 * s, 0.8, col=(206, 52, 44))
    return head


# ------------------------------------------------------------------ shots
def bedroom(f, t):
    u = smooth(seg(t, 0.9, 2.15))
    f.cam(lerp(1.42, 1.62, smooth(t / 2.15)), lerp(1080, 1330, u), lerp(600, 585, u))
    # wall + floor washes
    wash(f, [(-100, -60), (2020, -60), (2020, 780), (-100, 780)], SAGE, 0.55, seed=1)
    wash(f, [(-100, 760), (2020, 760), (2020, 1150), (-100, 1150)], (204, 176, 142), 0.75, seed=2)
    ink(f, [(-100, 770), (2020, 770)], 3, 1.0)
    # window with dawn
    wx0, wy0, wx1, wy1 = 260, 190, 620, 540
    wash(f, [(wx0, wy0), (wx1, wy0), (wx1, wy1), (wx0, wy1)], PEACH, 0.85, seed=3)
    wash(f, circ(520, 300, 46, 20), (250, 222, 150), 0.9, seed=4)
    ink(f, [(wx0, wy0), (wx1, wy0), (wx1, wy1), (wx0, wy1)], 4, 1.0, closed=True)
    ink(f, [((wx0 + wx1) / 2, wy0), ((wx0 + wx1) / 2, wy1)], 3, 0.8)
    ink(f, [(wx0, (wy0 + wy1) / 2), (wx1, (wy0 + wy1) / 2)], 3, 0.8)
    # light beam with dust
    f.beam([(wx0, wy0), (wx1, wy0), (1150, 780), (700, 780)], (255, 200, 140), 0.45, 14, src=(440, 360), length=1000)
    for i in range(40):
        jr = np.random.default_rng(i)
        dx, dy = jr.uniform(380, 1050), jr.uniform(300, 760)
        x = dx + math.sin(t * 0.5 + i) * 14
        y = dy + ((t * jr.uniform(5, 14)) % 60) - 30
        if (y - 300) / 480 * 600 + 300 > x - 100:
            f.dot(x, y, jr.uniform(1.2, 2.4), (255, 236, 200))
    # bed
    wash(f, [(760, 600), (1460, 600), (1460, 700), (760, 700)], (232, 222, 206), 0.9, seed=5)
    ink(f, [(740, 470), (740, 790)], 6, 0.8)
    ink(f, [(1480, 560), (1480, 790)], 6, 0.8)
    ink(f, [(740, 700), (1480, 700)], 5, 0.8)
    pil = blob(840, 590, 70, 26, seed=6)
    wash(f, pil, (248, 244, 236), 0.95, seed=6)
    ink(f, pil, 3, 0.6, closed=True)
    # Kai asleep: head on pillow, blanket
    reach = smooth(seg(t, 1.25, 2.0))
    hx, hy = 840, 556
    wash(f, circ(hx, hy, 34, 28), (246, 232, 214), 0.95, seed=7)
    ink(f, circ(hx, hy, 34, 28), 3.4, 0.7)
    wake = t > 1.0
    for sgn in (-1, 1):
        ex, ey = hx + sgn * 11, hy - 2
        if wake and t > 1.2:
            ink(f, [(ex - 6, ey - 1), (ex + 6, ey - 1)], 2.4, 0.2)
            f.dot(ex, ey + 2, 3.0, INK)
        else:
            ink(f, [(ex - 5, ey), (ex, ey + 3), (ex + 5, ey)], 2.6, 0.2)
    ink(f, [(hx - 6, hy + 15), (hx + 6, hy + 15)] if not wake else [(hx - 7, hy + 16), (hx - 2, hy + 13), (hx + 3, hy + 16), (hx + 8, hy + 13)], 2.4, 0.2)
    if not wake:
        for k in range(3):
            zz = (t * 0.9 + k * 0.33) % 1
            f.text(hx + 50 + zz * 60 + k * 10, hy - 40 - zz * 70, 'z', 30 + k * 6, (90, 80, 76), GAEGU)
    bl = [(870, 560), (1180, 548), (1460, 575), (1460, 690), (860, 690)]
    wash(f, bl, RUST, 0.95, seed=8)
    ink(f, bl, 3.2, 0.8, closed=True)
    ink(f, [(950, 600), (1010, 660)], 2, 0.6)
    ink(f, [(1120, 590), (1200, 670)], 2, 0.6)
    # nightstand + ringing alarm
    wash(f, [(1560, 600), (1760, 600), (1760, 780), (1560, 780)], (170, 132, 100), 0.9, seed=9)
    ink(f, [(1560, 600), (1760, 600), (1760, 780), (1560, 780)], 3.5, 0.8, closed=True)
    ring = 1.0 if 0.7 < t else 0.0
    sh = math.sin(t * 70) * 6 * ring
    cx, cy = 1660 + sh, 540
    wash(f, circ(cx, cy, 46, 26), (236, 226, 204), 0.95, seed=10)
    ink(f, circ(cx, cy, 46, 26), 4, 0.6)
    for bx in (-28, 28):
        ink(f, circ(cx + bx, cy - 50, 16, 10, math.pi, 2 * math.pi), 4, 0.4)
    ink(f, [(cx, cy), (cx, cy - 30)], 3.5, 0.2)
    ink(f, [(cx, cy), (cx + 22, cy + 6)], 3.5, 0.2)
    ink(f, [(cx - 26, cy + 42), (cx - 36, cy + 58)], 3.5, 0.3)
    ink(f, [(cx + 26, cy + 42), (cx + 36, cy + 58)], 3.5, 0.3)
    if ring:
        for k in range(3):
            a = -2.4 + k * 0.4
            for side in (-1, 1):
                aa = a if side < 0 else math.pi - a
                r0 = 68 + (t * 6 % 1) * 10
                ink(f, [(cx + math.cos(aa) * r0 * side * -1 * -1, cy + math.sin(aa) * r0), (cx + math.cos(aa) * (r0 + 22), cy + math.sin(aa) * (r0 + 22))], 3.5, 0.3, col=RUST)
    # Kai's arm reaching for the alarm
    sx, sy = 930, 600
    hand = (lerp(980, 1600, eout(reach)), lerp(640, 560, eout(reach)))
    if reach > 0.01:
        ink(f, [(sx, sy), ((sx + hand[0]) / 2, min(sy, hand[1]) - 30 * reach), hand], 4.5, 0.6)
        f.dot(hand[0], hand[1], 7, INK)
    f.light(440, 360, 380, (255, 190, 120), 0.10)


def stamp_card(f, t):
    """5:00 AM stamped onto paper with ink splatter."""
    f.cam(1.0 + 0.03 * t, 960, 540)
    u = eout(seg(t, 0.0, 0.16))
    k = lerp(1.6, 1.0, u)
    wash(f, blob(960, 520, 520 * k, 230 * k, seed=21, wob=0.12), (232, 214, 186), 0.6 * u, seed=21)
    if u > 0:
        jr = np.random.default_rng(5)
        for i in range(26):
            a = jr.uniform(0, 6.28)
            d = jr.uniform(330, 560) * k
            rr = jr.uniform(4, 16) * u
            f.dot(960 + math.cos(a) * d, 520 + math.sin(a) * d * 0.55, rr, (58, 48, 44))
        f.text(960, 500, '5:00', 330 * k, INK, GAEGU)
        f.text(1330, 630, 'AM', 110 * k, (196, 70, 52), GAEGU)
    v = eout(seg(t, 0.35, 0.8))
    if v > 0:
        pts_t, pts_b = [], []
        for i in range(31):
            q = i / 30 * v
            x = lerp(620, 1300, q)
            y = 690 + math.sin(q * math.pi) * 8 - q * 14
            th = 18 * math.sin(clamp(q / max(v, 1e-3)) * math.pi) ** 0.6 + 2
            pts_t.append((x, y - th / 2))
            pts_b.append((x + 6, y + th / 2))
        wash(f, pts_t + pts_b[::-1], (196, 70, 52), 1.0, soft=1.2, seed=22)


def hill(f, t):
    T = t
    pull = eout(seg(T, 0.0, 1.6))
    climb = smooth(seg(T, 5.0, 6.25))
    f.cam(lerp(2.1, 1.08, pull) + 0.08 * climb, lerp(lerp(330, 900, pull), 1080, climb), lerp(lerp(900, 640, pull), 520, climb))
    # sky gradient washes + sun
    wash(f, [(-200, -200), (2200, -200), (2200, 380), (-200, 380)], (150, 186, 210), 0.9, soft=6, seed=31)
    wash(f, [(-200, 395), (2200, 395), (2200, 760), (-200, 760)], (244, 186, 140), 0.85, soft=6, seed=32)
    f.layer(0.3)
    wash(f, circ(1500, 330, 90, 30), (252, 214, 140), 0.95, seed=33)
    f.light(1500, 330, 520, (255, 170, 100), 0.16)
    f.light(1500, 330, 130, (255, 230, 190), 0.22)
    f.layer(0.5)
    wash(f, [(-300, 700), (300, 560), (800, 640), (1300, 540), (2300, 650), (2300, 1200), (-300, 1200)], (168, 176, 170), 0.7, seed=34)
    f.layer(0.75)
    wash(f, [(-300, 820), (500, 700), (1100, 760), (1700, 680), (2300, 760), (2300, 1200), (-300, 1200)], (150, 168, 132), 0.8, seed=35)
    f.layer(1.0)
    # the big hill + winding path to a flag
    hp = [(-200, 1100), (200, 1000), (700, 860), (1100, 600), (1350, 420), (1450, 380), (1600, 430), (1900, 640), (2300, 900), (2300, 1300), (-200, 1300)]
    wash(f, hp, OCHRE, 0.9, seed=36)
    ink(f, hp[:-2], 3.5, 1.0)
    path = [(420, 1040), (640, 960), (760, 880), (960, 820), (1080, 700), (1240, 610), (1330, 500), (1440, 400)]
    stones = []
    for i in range(len(path) - 1):
        for j in range(3):
            q = j / 3
            x = lerp(path[i][0], path[i + 1][0], q)
            y = lerp(path[i][1], path[i + 1][1], q)
            stones.append((x, y))
    for i, (x, y) in enumerate(stones):
        sc = lerp(1.0, 0.35, i / len(stones))
        st = blob(x, y, 34 * sc, 12 * sc, seed=40 + i)
        lit = T > 4.2 and i == 1
        wash(f, st, (226, 206, 170) if not lit else (240, 214, 150), 0.95, seed=40 + i)
        ink(f, st, 2.2 * sc + 0.6, 0.4, closed=True)
    # flag on top, catching the sun
    ink(f, [(1450, 390), (1450, 250)], 4, 0.4)
    wv = math.sin(T * 5) * 8
    fl = [(1452, 252), (1540, 268 + wv), (1452, 300)]
    wash(f, fl, (206, 52, 44), 1.0, seed=50)
    ink(f, fl, 2.5, 0.4, closed=True)
    # Kai walks in, looks up, steps onto stone 1
    if T < 2.2:
        kx = lerp(250, 470, eout(T / 2.2))
        p = dict(stride=T * 9, band=True, mouth='flat', brow=0.3)
    elif T < 4.0:
        kx = 470
        p = dict(band=True, hy=-6 * smooth(seg(T, 2.3, 2.9)), look=4, brow=0.9, mouth='tense')
    else:
        kx = lerp(470, 640, eout(seg(T, 4.0, 4.7)))
        p = dict(band=True, stride=(T - 4.0) * 9 if T < 4.7 else 0, brow=0.9, mouth='smile' if T > 5 else 'tense', look=3)
    ky = 1040 if kx < 560 else lerp(1040, 960, seg(kx, 560, 640))
    kai(f, kx, ky, 1.25, T, p)
    # DAY 1 stamp on the first stone
    if T > 4.6:
        u = eout(seg(T, 4.6, 4.78))
        k = lerp(1.8, 1.0, u)
        f.text(830, 840, 'DAY 1', 120 * k, (196, 60, 46), GAEGU)
        for i in range(10):
            jr = np.random.default_rng(80 + i)
            a = jr.uniform(0, 6.28)
            f.dot(830 + math.cos(a) * jr.uniform(130, 200) * k, 840 + math.sin(a) * jr.uniform(50, 90) * k, jr.uniform(4, 10) * u, (196, 60, 46))


CAPS = [(0.55, 1.75, 'Every morning,'), (1.95, 3.45, 'at 5 A.M.,'), (3.75, 5.7, 'a war begins.')]


def render(fi):
    t = fi / FPS
    f = Frame(t, fi)
    E._assets()['vig'] = np.ones((H, W, 1), np.float32)
    f.letterbox = False
    f.grain = 0.12
    f.img = Image.new('RGB', (W * SS, H * SS), PAPER)
    f.d = ImageDraw.Draw(f.img)
    if t < 2.15:
        bedroom(f, t)
    elif t < 3.75:
        stamp_card(f, t - 2.15)
    else:
        hill(f, t - 3.75)
    for a, b, s in CAPS:
        if a <= t <= b:
            al = smooth(seg(t, a, a + 0.15)) * (1 - smooth(seg(t, b - 0.2, b)))
            f.otext(960, 1000, s, 64, (255, 255, 255), HAND, 'mm', al, stroke=5)
    im = f.finish()
    a = np.asarray(im, np.float32) * PAPERTEX[..., None] * VIG
    # keep captions crisp: redraw on top
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    if f.over:
        from PIL import ImageDraw as D
        ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        od = D.Draw(ov)
        for (x, y, s, size, col, path, anchor, alpha, stroke) in f.over:
            od.text((x, y), s, fill=tuple(col) + (int(255 * clamp(alpha)),), font=font(path, size), anchor=anchor,
                    stroke_width=stroke, stroke_fill=(40, 30, 26, int(255 * clamp(alpha))))
        out = Image.alpha_composite(out.convert('RGBA'), ov).convert('RGB')
    return out


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'stills':
        for t in (0.4, 1.6, 2.4, 3.2, 4.4, 5.6, 8.0, 9.6):
            render(int(t * FPS)).save(os.path.join(HERE, 'out', 's_%.1f.jpg' % t), quality=90)
        sys.exit()
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H),
                          '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
                          os.path.join(HERE, 'out', 'video.mp4')], stdin=subprocess.PIPE)
    for fi in range(NF):
        p.stdin.write(render(fi).tobytes())
    p.stdin.close()
    p.wait()
    print('video done')
