"""Chalk line-art props and light rigs."""
import math
import numpy as np
from engine import *

SEG = {'0': 'abcfed', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc',
       '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': ''}
NOTE = (178, 160, 82)
NOTE_INK = (52, 44, 22)


def seven(f, x, y, ch, w, h, col, off=(42, 10, 10)):
    th = w * 0.18
    segs = {'a': (x, y, x + w, y), 'g': (x, y + h / 2, x + w, y + h / 2), 'd': (x, y + h, x + w, y + h),
            'f': (x, y, x, y + h / 2), 'b': (x + w, y, x + w, y + h / 2), 'e': (x, y + h / 2, x, y + h),
            'c': (x + w, y + h / 2, x + w, y + h)}
    on = SEG.get(ch, '')
    for k, (x0, y0, x1, y1) in segs.items():
        c = col if k in on else off
        if x0 == x1:
            pts = [(x0, y0 + th * 0.6), (x0 + th / 2, y0 + th), (x0 + th / 2, y1 - th), (x0, y1 - th * 0.6),
                   (x0 - th / 2, y1 - th), (x0 - th / 2, y0 + th)]
        else:
            pts = [(x0 + th * 0.6, y0), (x0 + th, y0 - th / 2), (x1 - th, y0 - th / 2), (x1 - th * 0.6, y0),
                   (x1 - th, y0 + th / 2), (x0 + th, y0 + th / 2)]
        f.poly(pts, c, None, amp=0)


def clock(f, x, y, txt, label=None, size=1.0, on=True, col=(255, 40, 34), stand=True):
    w, h = 170 * size, 78 * size
    if stand:
        f.rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 10 * size, (18, 18, 21), CHALK, 2.2)
    dw, dh = 22 * size, 40 * size
    gap = 34 * size
    chars = txt.replace(':', '')
    x0 = x - (gap * 4 + 12 * size) / 2 + 4 * size
    for i, ch in enumerate(chars):
        cx = x0 + i * gap + (12 * size if i >= 2 else 0)
        seven(f, cx, y - dh / 2, ch, dw, dh, col if on else (60, 14, 12))
    if ':' in txt and on:
        cx = x0 + 2 * gap - 4 * size
        f.dot(cx, y - dh * 0.2, 2.6 * size, col)
        f.dot(cx, y + dh * 0.2, 2.6 * size, col)
    if on:
        f.light(x, y, 70 * size, (255, 30, 20), 0.35)
    if label:
        f.text(x, y - h / 2 - 18 * size, label, 26 * size, (200, 50, 44), GAEGU)


def floor(f, y, x0=-400, x1=2320, col=DIM, w=2.2):
    f.line([(x0, y), (x1, y)], col, w)


def window(f, x0, y0, x1, y1, t, mode='night', rain=False, moon=False, skyline=True):
    sky = {'night': (14, 16, 26), 'dawn': (30, 40, 62), 'sunrise': (70, 52, 46), 'dusk': (34, 26, 36)}[mode]
    f.rect(x0, y0, x1, y1, sky, None, amp=0)
    if moon:
        f.dot(x1 - (x1 - x0) * 0.28, y0 + (y1 - y0) * 0.25, 16, (220, 222, 230))
        f.light(x1 - (x1 - x0) * 0.28, y0 + (y1 - y0) * 0.25, 70, (150, 170, 220), 0.4)
    if skyline:
        r = np.random.default_rng(int(x0))
        bx = x0
        while bx < x1:
            bw = r.uniform(30, 70)
            bh = r.uniform(0.25, 0.6) * (y1 - y0)
            xa, xb = bx, min(x1, bx + bw)
            f.rect(xa, y1 - bh, xb, y1, (9, 10, 14), None, amp=0)
            for wy in np.arange(y1 - bh + 10, y1 - 8, 16):
                for wx in np.arange(xa + 6, xb - 8, 13):
                    if r.random() < 0.18:
                        c = (150, 120, 70) if mode in ('night', 'dusk') else (60, 70, 90)
                        f.rect(wx, wy, wx + 5, wy + 7, c, None, amp=0)
            bx += bw + r.uniform(2, 10)
    if mode == 'sunrise':
        f.light((x0 + x1) / 2, y1, (x1 - x0) * 0.6, (255, 150, 70), 0.6)
    if rain:
        r = np.random.default_rng(5)
        n = int((x1 - x0) * (y1 - y0) / 1800)
        for i in range(n):
            sx = r.uniform(x0, x1)
            sp = r.uniform(700, 1000)
            ph = r.uniform(0, 1)
            yy = y0 + ((t * sp + ph * (y1 - y0)) % (y1 - y0))
            ln = r.uniform(14, 26)
            if yy - ln > y0:
                f.line([(sx, yy - ln), (sx - 3, yy)], (80, 90, 112), 1.4, amp=0)
    f.rect(x0, y0, x1, y1, None, CHALK, 3.2)
    f.line([((x0 + x1) / 2, y0), ((x0 + x1) / 2, y1)], CHALK, 2.4)
    f.line([(x0, (y0 + y1) / 2), (x1, (y0 + y1) / 2)], CHALK, 2.4)
    f.line([(x0 - 14, y1 + 6), (x1 + 14, y1 + 6)], CHALK, 2.4)


def window_beam(f, x0, y0, x1, y1, col, k, dx=260, floor_y=820):
    f.beam([(x0, y0), (x1, y0), (x1 + dx, floor_y), (x0 + dx, floor_y)], col, k, blur=10)


def bed(f, x0, x1, fy, blanket=None):
    top = fy - 105
    f.rect(x0, fy - 220, x0 + 26, fy, (16, 16, 19), CHALK, 2.4)
    f.rect(x1 - 18, fy - 140, x1, fy, (16, 16, 19), CHALK, 2.4)
    f.rect(x0 + 26, top + 30, x1 - 18, fy - 34, (17, 17, 20), CHALK, 2.4)
    f.rrect(x0 + 26, top, x1 - 18, top + 32, 12, (24, 24, 28), CHALK, 2.2)
    return top


def pillow(f, x, y):
    f.ell(x, y, 62, 22, (40, 40, 46), CHALK, 2.2)


def blanket(f, x0, x1, top, bump=0.0, col=(36, 40, 56)):
    pts = [(x0, top + 30)]
    n = 18
    for i in range(n + 1):
        u = i / n
        xx = x0 + (x1 - x0) * u
        h = 26 + bump * math.sin(u * math.pi) ** 1.5 * 40
        pts.append((xx, top - h + 10))
    pts.append((x1 + 6, top + 50))
    pts.append((x0, top + 52))
    f.poly(pts, col, CHALK, 2.2)
    f.line([(x0 + 40, top + 8), (x0 + 50, top + 40)], DIM, 1.6)


def nightstand(f, x, fy, w=130, h=120):
    f.rect(x - w / 2, fy - h, x + w / 2, fy, (16, 16, 19), CHALK, 2.2)
    f.line([(x - w / 2 + 12, fy - h / 2), (x + w / 2 - 12, fy - h / 2)], DIM, 1.8)
    f.dot(x, fy - h * 0.28, 3, CHALK)
    return fy - h


def door(f, x0, x1, top, fy, open_=0.0, light=WARM, k=0.6):
    if open_ > 0:
        f.rect(x0, top, x1, fy, (70, 56, 38), None, amp=0)
        f.light((x0 + x1) / 2, (top + fy) / 2, (x1 - x0) * 1.2, light, k * open_)
        f.beam([(x0, fy), (x1, fy), (x1 + 140, fy + 120), (x0 - 160, fy + 120)], light, 0.3 * open_, 8)
        xe = x1 - (x1 - x0) * open_ * 0.8
        f.rect(x0, top, xe, fy, (20, 20, 23), CHALK, 2.4)
    else:
        f.rect(x0, top, x1, fy, (20, 20, 23), CHALK, 2.4)
        f.dot(x1 - 22, (top + fy) / 2 + 20, 5, CHALK)
    f.rect(x0 - 10, top - 10, x1 + 10, fy, None, DIM, 2.0)


def desk(f, x0, x1, top, fy):
    f.rect(x0, top, x1, top + 18, (22, 22, 26), CHALK, 2.4)
    f.line([(x0 + 18, top + 18), (x0 + 18, fy)], CHALK, 2.4)
    f.line([(x1 - 18, top + 18), (x1 - 18, fy)], CHALK, 2.4)
    f.rect(x1 - 190, top + 18, x1 - 18, top + 90, (18, 18, 21), CHALK, 2.0)
    f.line([(x1 - 130, top + 54), (x1 - 80, top + 54)], DIM, 2)


def chair(f, x, fy, facing=-1, seat=560):
    sy = fy - 150
    f.line([(x - 50, sy), (x + 50, sy)], CHALK, 3)
    f.line([(x - 40, sy), (x - 44, fy)], CHALK, 2.4)
    f.line([(x + 40, sy), (x + 44, fy)], CHALK, 2.4)
    bx = x - facing * 50
    f.line([(bx, sy), (bx + facing * -8, sy - 150)], CHALK, 3)
    return sy


def desk_lamp(f, x, top, on=True, t=0, dirx=1, k=0.55):
    hx, hy = x + dirx * 70, top - 150
    f.line([(x - 30, top), (x + 30, top)], CHALK, 3)
    f.line([(x, top), (x - dirx * 20, top - 90), (hx, hy)], CHALK, 2.6)
    shade = [(hx - dirx * 10, hy - 26), (hx + dirx * 50, hy - 6), (hx + dirx * 56, hy + 26), (hx - dirx * 4, hy + 18)]
    f.poly(shade, (26, 26, 30), CHALK, 2.4)
    if on:
        bx, by = hx + dirx * 30, hy + 22
        f.light(bx, by, 40, (255, 200, 120), 0.9)
        f.beam([(bx - 20, by), (bx + 20, by), (bx + dirx * 160 + 140, top + 2), (bx + dirx * 160 - 160, top + 2)],
               WARM, 0.55 * k, 6, src=(bx, by), length=260)
        f.light(bx + dirx * 150, top, 220, WARM, 0.22 * k)


def laptop(f, cx, base, w=300, h=190, glow=(110, 150, 230), k=0.5):
    x0, x1 = cx - w / 2, cx + w / 2
    y0 = base - h
    f.rect(x0, y0, x1, base - 8, (14, 16, 22), CHALK, 2.6)
    f.poly([(x0 - 20, base - 8), (x1 + 20, base - 8), (x1 + 34, base + 6), (x0 - 34, base + 6)], (24, 24, 28), CHALK,
           2.4)
    f.light(cx, (y0 + base) / 2, w * 0.9, glow, 0.35 * k)
    return (x0 + 10, y0 + 10, x1 - 10, base - 18)


def book(f, x, y, w=120, h=26, col=(60, 52, 70), label=None):
    f.rect(x - w / 2, y - h, x + w / 2, y, col, CHALK, 2.0)
    if label:
        f.text(x, y - h / 2, label, h * 0.62, (190, 186, 176), GAEGU)


def sticky(f, x, y, txt='DAY 1', s=1.0, col=NOTE, ink=NOTE_INK, ang=0.0):
    w = 64 * s
    c, sn = math.cos(ang), math.sin(ang)
    pts = [(x + px * c - py * sn, y + px * sn + py * c) for px, py in
           ((-w / 2, -w / 2), (w / 2, -w / 2), (w / 2, w / 2), (-w / 2, w / 2))]
    f.poly(pts, col, mix(col, 0.6), 1.6, amp=0.3)
    f.text(x, y + 2 * s, txt, 21 * s, ink, GAEGU)


def bag(f, x, fy):
    f.rrect(x - 70, fy - 70, x + 70, fy, 22, (30, 30, 36), CHALK, 2.2)
    f.arc(x, fy - 70, 40, 34, math.pi, 2 * math.pi, CHALK, 2.4)
    f.line([(x - 50, fy - 40), (x + 50, fy - 40)], DIM, 1.8)


def fridge(f, x0, x1, top, fy, open_=1.0, t=0):
    f.rect(x0, top, x1, fy, (20, 20, 24), CHALK, 2.6)
    if open_ > 0:
        f.rect(x0 + 10, top + 10, x1 - 10, fy - 10, (60, 66, 72), None, amp=0)
        f.light((x0 + x1) / 2, (top + fy) / 2, (x1 - x0) * 1.3, (190, 220, 255), 0.5 * open_)
        f.beam([(x1, top + 20), (x1, fy), (x1 + 420, fy + 40), (x1 + 260, top + 60)], (180, 210, 255), 0.22 * open_, 10)
        for i, sh in enumerate((0.3, 0.55, 0.8)):
            yy = top + (fy - top) * sh
            f.line([(x0 + 12, yy), (x1 - 12, yy)], CHALK, 2)
        labs = ['MON', 'TUE', 'WED']
        for i, l in enumerate(labs):
            bx = x0 + 34 + i * ((x1 - x0 - 50) / 3)
            yy = top + (fy - top) * 0.55
            f.rect(bx - 4, yy - 44, bx + 56, yy, (210, 214, 206), INK, 2, amp=0.3)
            f.text(bx + 26, yy - 22, l, 20, (60, 60, 60), GAEGU)
        doorx = x1 + 90 * open_
        f.poly([(x1, top), (doorx, top + 30), (doorx, fy - 20), (x1, fy)], (28, 28, 32), CHALK, 2.4)
    else:
        f.line([(x0, top + (fy - top) * 0.35), (x1, top + (fy - top) * 0.35)], CHALK, 2)


def counter(f, x0, x1, top, fy):
    f.rect(x0, top, x1, top + 20, (26, 26, 30), CHALK, 2.4)
    f.rect(x0 + 10, top + 20, x1 - 10, fy, (16, 16, 19), CHALK, 2.2)
    n = int((x1 - x0) / 160)
    for i in range(1, n):
        xx = x0 + i * (x1 - x0) / n
        f.line([(xx, top + 30), (xx, fy - 10)], DIM, 1.6)


def pizza(f, x, y, w=160):
    f.poly([(x - w / 2, y - 26), (x + w / 2, y - 26), (x + w / 2, y), (x - w / 2, y)], (150, 112, 70), INK, 2.2)
    f.text(x, y - 13, 'PIZZA', 20, (90, 30, 20), GAEGU)


def lamp_post(f, x, fy, h=520, on=True, t=0, k=1.0, col=WARM, dust=True):
    top = fy - h
    f.line([(x, fy), (x, top), (x + 50, top - 10)], CHALK, 3.2)
    f.poly([(x + 30, top - 20), (x + 90, top - 14), (x + 84, top + 4), (x + 36, top)], (30, 30, 34), CHALK, 2.2)
    if on:
        lx, ly = x + 60, top + 2
        f.light(lx, ly, 30, (255, 220, 160), 1.2 * k)
        f.light(lx, ly, 120, col, 0.35 * k)
        poly = [(lx - 22, ly), (lx + 22, ly), (lx + 190, fy), (lx - 190, fy)]
        f.beam(poly, col, 0.42 * k, 8, src=(lx, ly), length=h + 60)
        f.light(lx, fy, 160, col, 0.18 * k)
        if dust:
            dusts(f, t, poly, 22, int(x), (255, 210, 150), 0.8 * k)


def dusts(f, t, poly, n, seed, col, k=1.0):
    r = np.random.default_rng(seed)
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    for i in range(n * 3):
        bx = r.uniform(min(xs), max(xs))
        by = r.uniform(min(ys), max(ys))
        sp = r.uniform(4, 14)
        ph = r.uniform(0, 6.28)
        x = bx + math.sin(t * 0.4 + ph) * 18
        y = by + ((t * sp) % 80) - 40
        if in_poly(x, y, poly):
            f.dot(x, y, r.uniform(1.0, 2.2), lerpc(BG, col, 0.55 * k))


def building(f, x0, x1, top, fy, seed=0, lit=0.25, col=(15, 15, 18), wc=(170, 130, 70), k=1.0):
    f.rect(x0, top, x1, fy, col, DIM, 2.2)
    r = np.random.default_rng(seed)
    cols = max(1, int((x1 - x0 - 30) / 70))
    rows = max(1, int((fy - top - 120) / 90))
    for j in range(rows):
        for i in range(cols):
            wx = x0 + 30 + i * (x1 - x0 - 30) / cols
            wy = top + 40 + j * 90
            on = r.random() < lit
            f.rect(wx, wy, wx + 36, wy + 50, mix(wc, 0.85) if on else (18, 18, 22), DIM, 1.6, amp=0.5)
            if on:
                f.light(wx + 18, wy + 25, 40, wc, 0.22 * k)


def rain(f, t, x0, x1, y0, y1, n=160, seed=9, col=(92, 102, 128), sp=(900, 1300), ln=(20, 40), slant=-0.15):
    r = np.random.default_rng(seed)
    hh = y1 - y0
    for i in range(n):
        sx = r.uniform(x0, x1)
        s = r.uniform(*sp)
        ph = r.uniform(0, 1)
        l = r.uniform(*ln)
        yy = y0 + ((t * s + ph * hh) % hh)
        f.line([(sx + slant * (yy - l - y0), yy - l), (sx + slant * (yy - y0), yy)], col, 1.5, amp=0)


def splashes(f, t, x0, x1, y, n=30, seed=4):
    r = np.random.default_rng(seed)
    for i in range(n):
        x = r.uniform(x0, x1)
        ph = (t * r.uniform(1.5, 3) + r.uniform(0, 1)) % 1
        if ph < 0.25:
            rr = 4 + ph * 40
            f.arc(x, y, rr, rr * 0.25, math.pi, 2 * math.pi, (80, 90, 110), 1.2, amp=0)


def stairs(f, x0, fy, n=8, sw=90, sh=50, fill=(16, 16, 19)):
    pts = [(x0, fy)]
    for i in range(n):
        pts += [(x0 + i * sw, fy - (i + 1) * sh), (x0 + (i + 1) * sw, fy - (i + 1) * sh)]
    pts += [(x0 + n * sw, fy)]
    f.poly(pts, fill, None, amp=0.3)
    f.line(pts, CHALK, 2.4)
    for i in range(n):
        f.line([(x0 + (i + 0.7) * sw + 20, fy - (i + 1) * sh - 70), (x0 + (i + 1.7) * sw + 20, fy - (i + 2) * sh - 70)],
               DIM, 1.6)


def step_y(x, x0, fy, n, sw, sh):
    i = int(clamp((x - x0) // sw, -1, n - 1))
    return fy if i < 0 else fy - (i + 1) * sh


def couch(f, x0, x1, fy):
    f.rrect(x0, fy - 210, x1, fy - 90, 24, (30, 30, 36), CHALK, 2.4)
    f.rrect(x0 - 30, fy - 140, x0 + 40, fy - 30, 18, (34, 34, 40), CHALK, 2.4)
    f.rrect(x1 - 40, fy - 140, x1 + 30, fy - 30, 18, (34, 34, 40), CHALK, 2.4)
    f.rect(x0 + 30, fy - 100, x1 - 30, fy - 30, (26, 26, 31), CHALK, 2.4)
    f.line([(x0, fy - 30), (x0, fy)], CHALK, 2.4)
    f.line([(x1, fy - 30), (x1, fy)], CHALK, 2.4)
    return fy - 100


def tv(f, x, fy, t, k=1.0):
    f.rect(x - 160, fy - 330, x + 160, fy - 150, (20, 26, 40), CHALK, 2.8)
    f.line([(x, fy - 150), (x, fy - 110)], CHALK, 2.4)
    f.rect(x - 120, fy - 110, x + 120, fy, (16, 16, 19), CHALK, 2.2)
    flick = 0.8 + 0.2 * math.sin(t * 13) * math.sin(t * 5.3)
    f.light(x, fy - 240, 300, (110, 140, 230), 0.32 * flick * k)


def calendar(f, x0, y0, cols=7, rows=4, cw=74, ch=66, marks=None, title=None, t=0):
    w, h = cols * cw, rows * ch
    f.rect(x0 - 10, y0 - 70, x0 + w + 10, y0 + h + 10, (226, 222, 210), INK, 2.4, amp=0.4)
    if title:
        f.text(x0 + w / 2, y0 - 36, title, 38, (40, 36, 34), GAEGU)
    for i in range(cols + 1):
        f.line([(x0 + i * cw, y0), (x0 + i * cw, y0 + h)], (120, 116, 108), 1.6, amp=0.3)
    for j in range(rows + 1):
        f.line([(x0, y0 + j * ch), (x0 + w, y0 + j * ch)], (120, 116, 108), 1.6, amp=0.3)
    for idx, (kind, a) in enumerate(marks or []):
        cx = x0 + (idx % cols + 0.5) * cw
        cy = y0 + (idx // cols + 0.5) * ch
        if a <= 0:
            continue
        if kind == 'x':
            u = clamp(a * 2)
            v = clamp(a * 2 - 1)
            f.line([(cx - 22, cy - 22), (cx - 22 + 44 * u, cy - 22 + 44 * u)], RED, 6, amp=0.3)
            if v > 0:
                f.line([(cx + 22, cy - 22), (cx + 22 - 44 * v, cy - 22 + 44 * v)], RED, 6, amp=0.3)
            f.light(cx, cy, 30, RED, 0.3)
        else:
            u = clamp(a)
            p1 = (cx - 20, cy)
            p2 = (cx - 6, cy + 16)
            p3 = (cx + 24, cy - 20)
            if u < 0.4:
                pts = [p1, (lerp(p1[0], p2[0], u / 0.4), lerp(p1[1], p2[1], u / 0.4))]
            else:
                v = (u - 0.4) / 0.6
                pts = [p1, p2, (lerp(p2[0], p3[0], v), lerp(p2[1], p3[1], v))]
            f.line(pts, (40, 150, 110), 6, amp=0.3)


def plan_board(f, x0, y0, x1, y1, fill=1.0, t=0, dusty=False):
    f.rect(x0, y0, x1, y1, (200, 198, 188), INK, 2.6, amp=0.4)
    f.text((x0 + x1) / 2, y0 + 34, 'THE PERFECT PLAN v7', 40, (40, 36, 34), GAEGU)
    days = 'MON TUE WED THU FRI SAT SUN'.split()
    cw = (x1 - x0 - 40) / 7
    for i, d in enumerate(days):
        f.text(x0 + 20 + (i + 0.5) * cw, y0 + 78, d, 22, (70, 66, 60), GAEGU)
    cols = [(110, 150, 200), (120, 190, 150), (230, 170, 100), (200, 120, 160), (150, 140, 210)]
    r = np.random.default_rng(3)
    blocks = []
    for i in range(7):
        yy = y0 + 100
        while yy < y1 - 40:
            hh = r.uniform(30, 70)
            blocks.append((i, yy, hh, cols[r.integers(0, 5)]))
            yy += hh + 6
    n = int(len(blocks) * fill)
    for (i, yy, hh, c) in blocks[:n]:
        bx = x0 + 20 + i * cw
        f.rect(bx + 4, yy, bx + cw - 4, min(yy + hh, y1 - 14), mix(c, 0.75), (60, 58, 54), 1.4, amp=0.3)
    if dusty:
        for i in range(40):
            f.dot(r.uniform(x0, x1), r.uniform(y0, y1), 1.5, (150, 148, 140))


def pullup_bar(f, x0, x1, bar_y, fy):
    f.line([(x0, fy), (x0, bar_y - 20)], CHALK, 5)
    f.line([(x1, fy), (x1, bar_y - 20)], CHALK, 5)
    f.line([(x0 - 10, bar_y), (x1 + 10, bar_y)], CHALK, 4)


def tree(f, x, fy, h=420, seed=0, col=(22, 22, 26)):
    f.line([(x, fy), (x - 6, fy - h * 0.55)], CHALK, 5)
    f.line([(x - 4, fy - h * 0.45), (x + 40, fy - h * 0.6)], CHALK, 3)
    r = np.random.default_rng(seed)
    for i in range(7):
        a = i / 7 * 2 * math.pi
        cx, cy = x + math.cos(a) * h * 0.18, fy - h * 0.72 + math.sin(a) * h * 0.13
        f.ell(cx, cy, h * 0.17, h * 0.15, col, None)
    for i in range(7):
        a = i / 7 * 2 * math.pi
        cx, cy = x + math.cos(a) * h * 0.18, fy - h * 0.72 + math.sin(a) * h * 0.13
        f.arc(cx, cy, h * 0.17, h * 0.15, a - 1.3, a + 1.3, DIM, 2.0)


def bench(f, x0, x1, fy):
    f.line([(x0, fy - 70), (x1, fy - 70)], CHALK, 3)
    f.line([(x0, fy - 130), (x1, fy - 130)], CHALK, 3)
    f.line([(x0 - 6, fy - 105), (x1 + 6, fy - 105)], CHALK, 3)
    for xx in (x0 + 20, x1 - 20):
        f.line([(xx, fy - 70), (xx, fy)], CHALK, 3)
        f.line([(xx, fy - 70), (xx, fy - 140)], CHALK, 2.4)


def barbell(f, x, y, w=300):
    f.line([(x - w / 2, y), (x + w / 2, y)], CHALK, 4)
    for sx in (-1, 1):
        f.rrect(x + sx * w * 0.38 - 10, y - 50, x + sx * w * 0.38 + 10, y + 50, 4, (40, 40, 46), CHALK, 2.2)
        f.rrect(x + sx * w * 0.43 - 8, y - 38, x + sx * w * 0.43 + 8, y + 38, 4, (40, 40, 46), CHALK, 2.2)


def phone_small(f, x, y, s=1.0, k=1.0, col=(150, 180, 240)):
    f.rrect(x - 16 * s, y - 28 * s, x + 16 * s, y + 28 * s, 5 * s, (40, 50, 70), INK, 2)
    f.light(x, y, 50 * s, col, 0.35 * k)


def sun(f, x, y, r, k=1.0):
    f.dot(x, y, r, (255, 214, 150))
    f.light(x, y, r * 2.2, (255, 190, 110), 1.0 * k)
    f.light(x, y, r * 7, (255, 130, 60), 0.45 * k)
    f.light(x, y + r, r * 16, (255, 100, 50), 0.22 * k)


def stove(f, x, top, t, steam=True):
    f.rect(x - 90, top - 10, x + 90, top, (40, 40, 46), CHALK, 2.2)
    f.ell(x, top - 28, 70, 18, (50, 50, 56), CHALK, 2.4)
    f.line([(x + 70, top - 30), (x + 170, top - 50)], CHALK, 4)
    f.light(x, top + 4, 70, (90, 140, 255), 0.25)
    if steam:
        for i in range(3):
            ph = (t * 0.8 + i * 0.33) % 1
            xx = x - 30 + i * 30 + math.sin(t * 3 + i) * 10
            f.line([(xx + math.sin(ph * 6 + i) * 8, top - 50 - ph * 120 + j * 10) for j in range(5)],
                   lerpc(BG, (150, 150, 160), 1 - ph), 2.2, amp=0.3)
