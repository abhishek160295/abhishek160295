"""Anime-style thumbnail: Leo with cel shading, anime face, focus lines, poster title."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import gaussian_filter, maximum_filter
from engine import *
import scenes as S

WW, HH = 2560, 1440
OUT = 'out/thumbnail_anime.png'  # work in progress; does not replace the main thumbnail
INKC = (14, 10, 12)
FOCUS = (1820, 560)               # focal point (Leo's face) in working pixels


def work(im):
    return im.resize((WW, HH), Image.LANCZOS)


# ------------------------------------------------------------------ background: burst + focus lines + flying notes
def background():
    yy, xx = np.mgrid[0:HH, 0:WW].astype(np.float32)
    d = np.sqrt((xx - FOCUS[0]) ** 2 + (yy - FOCUS[1]) ** 2) / 1500
    stops = [(0.0, (255, 246, 196)), (0.18, (255, 196, 84)), (0.42, (246, 104, 40)), (0.75, (178, 26, 30)),
             (1.2, (52, 6, 14))]
    img = np.zeros((HH, WW, 3), np.float32)
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        u = np.clip((d - a) / (b - a), 0, 1)[..., None]
        m = ((d >= a) & (d < b))[..., None] | ((d >= b) & (b == stops[-1][0]))[..., None]
        img = np.where(m, np.array(ca) * (1 - u) + np.array(cb) * u, img)
    img = np.where((d >= stops[-1][0])[..., None], np.array(stops[-1][1], np.float32), img)
    # focus lines (shuchusen): thin dark wedges converging on Leo, clear core
    lines = Image.new('L', (WW, HH), 0)
    ld = ImageDraw.Draw(lines)
    r = np.random.default_rng(3)
    for k in range(260):
        ang = r.uniform(0, 2 * math.pi)
        w = r.uniform(0.002, 0.012)
        r0 = r.uniform(430, 700)
        R = 3200
        p0 = (FOCUS[0] + math.cos(ang) * r0, FOCUS[1] + math.sin(ang) * r0)
        p1 = (FOCUS[0] + math.cos(ang - w) * R, FOCUS[1] + math.sin(ang - w) * R)
        p2 = (FOCUS[0] + math.cos(ang + w) * R, FOCUS[1] + math.sin(ang + w) * R)
        ld.polygon([p0, p1, p2], fill=int(r.uniform(120, 255)))
    L = np.asarray(lines, np.float32) / 255 * 0.55
    img = img * (1 - L[..., None]) + np.array([40, 4, 8], np.float32) * L[..., None]
    # flying DAY 1 notes with motion streaks
    note_layer = Image.new('RGBA', (WW, HH), (0, 0, 0, 0))
    fnt = font(GAEGU, 54)
    spots = [(980, 170, -18, 1.0), (1240, 1200, 14, 1.1), (2420, 230, 22, 0.9), (2380, 1150, -12, 1.15),
             (760, 1250, 8, 0.85), (1520, 90, 30, 0.7), (2500, 700, -25, 0.8)]
    for (x, y, ang, sc) in spots:
        s = int(170 * sc)
        n = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        nd = ImageDraw.Draw(n)
        nd.rectangle((4, 4, s - 4, s - 4), fill=(250, 214, 92, 255), outline=INKC + (255,), width=6)
        nd.text((s / 2, s / 2), 'DAY 1', fill=INKC + (255,), font=font(GAEGU, int(46 * sc)), anchor='mm')
        if (x + y) % 3 == 0:
            nd.line((24, 24, s - 24, s - 24), fill=(220, 20, 20, 255), width=int(10 * sc))
            nd.line((s - 24, 24, 24, s - 24), fill=(220, 20, 20, 255), width=int(10 * sc))
        n = n.rotate(ang, expand=True, resample=Image.BICUBIC)
        # motion streak away from the focal point
        vx, vy = x - FOCUS[0], y - FOCUS[1]
        dl = math.hypot(vx, vy) + 1e-6
        for k in range(6, 0, -1):
            g = n.copy()
            g.putalpha(g.getchannel('A').point(lambda v, k=k: int(v * 0.10)))
            note_layer.alpha_composite(g, (int(x - n.width / 2 - vx / dl * k * 14), int(y - n.height / 2 - vy / dl * k * 14)))
        note_layer.alpha_composite(n, (int(x - n.width / 2), int(y - n.height / 2)))
    nl = np.asarray(note_layer, np.float32)
    a = nl[..., 3:] / 255
    img = img * (1 - a) + nl[..., :3] * a
    return img


# ------------------------------------------------------------------ Leo, anime face, drawn as vectors
def anime_face(f, tw, s):
    a, L, h = 47, 58, 206
    ey = -L - h * 0.74
    fc = -4.0

    def P(pts):
        return [tw(x, y) for x, y in pts]

    # headband
    y0, y1 = ey - 36, ey - 22
    hw0, hw1 = S.LEO.hw(y0), S.LEO.hw(y1)
    f.poly(P([(-hw0 + 1, y0), (hw0 - 1, y0), (hw1 - 1, y1), (-hw1 + 1, y1)]), (222, 30, 34), INKC, 2.6 * s, amp=0)
    f.poly(P([(hw0 - 4, y0 + 2), (hw0 + 16, y0 - 6), (hw0 + 22, y0 + 10), (hw1 - 2, y1)]), (200, 24, 28), INKC, 2.2 * s,
           amp=0)
    for sgn in (-1, 1):
        ex = fc + sgn * 17
        # sclera
        eye = []
        for k in range(24):
            t = 2 * math.pi * k / 24
            eye.append((ex + 11 * math.cos(t), ey + 2 + 12.5 * math.sin(t) * (0.9 if math.sin(t) < 0 else 1)))
        f.poly(P(eye), (252, 250, 246), None, amp=0)
        # iris + pupil + fire glint
        ix, iy = ex - sgn * 2.0, ey + 4
        f.poly(P([(ix + 8.2 * math.cos(t), iy + 9.5 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 24)]),
               (122, 46, 26), None, amp=0)
        f.poly(P([(ix + 8.2 * math.cos(t), iy + 9.5 * math.sin(t)) for t in np.linspace(0.15 * math.pi, 0.85 * math.pi, 12)]
                 + [(ix, iy + 2)]), (236, 120, 40), None, amp=0)
        f.poly(P([(ix + 4.4 * math.cos(t), iy + 5.2 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 18)]), INKC, None,
               amp=0)
        X, Y = tw(ix - 3.2, iy - 4.2)
        f.dot(X, Y, 2.9 * s, (255, 255, 255))
        X, Y = tw(ix + 3.0, iy + 4.0)
        f.dot(X, Y, 1.4 * s, (255, 255, 255))
        # heavy upper lid, slanting down toward the nose (determined)
        lid = [(ex + sgn * 13, ey - 9.5), (ex + sgn * 4, ey - 11.5), (ex - sgn * 6, ey - 9.5), (ex - sgn * 12.5, ey - 4.5),
               (ex - sgn * 12.5, ey - 1.5), (ex - sgn * 5, ey - 6.8), (ex + sgn * 4, ey - 8.0), (ex + sgn * 12, ey - 5.5)]
        f.poly(P(lid), INKC, None, amp=0)
        f.line(P([(ex - sgn * 9, ey + 13), (ex + sgn * 8, ey + 13.8)]), INKC, 1.4 * s, amp=0)
        # brows: thick wedges angled down to the centre
        brow = [(ex + sgn * 14, ey - 22), (ex - sgn * 11, ey - 15.5), (ex - sgn * 12, ey - 12.5), (ex + sgn * 13, ey - 18)]
        f.poly(P(brow), INKC, None, amp=0)
    # gritted-teeth grin
    my = ey + 25
    mouth = [(fc - 14, my - 3), (fc + 14, my - 5), (fc + 12, my + 6), (fc - 12, my + 7)]
    f.poly(P(mouth), (252, 252, 250), INKC, 2.4 * s, amp=0)
    f.line(P([(fc - 13, my + 1.5), (fc + 13, my + 0.5)]), INKC, 1.5 * s, amp=0)
    for k in range(-2, 3):
        f.line(P([(fc + k * 5, my - 4), (fc + k * 5, my + 6.5)]), INKC, 1.3 * s, amp=0)
    # big anime sweat drop
    sx, sy = a * 0.98, ey - 30
    drop = [(sx, sy - 16)] + [(sx + 7.5 * math.cos(t), sy + 4 + 8 * math.sin(t)) for t in np.linspace(-0.3, math.pi + 0.3, 14)]
    f.poly(P(drop), (172, 220, 250), INKC, 2.2 * s, amp=0)
    X, Y = tw(sx - 2.5, sy + 2)
    f.dot(X, Y, 1.8 * s, (255, 255, 255))


def leo_layer():
    p = dict(face=0.0, light=(0.0, 0.0), lhw=(1270, 930), rhw=(1690, 470), rbend=1, lbend=1, blink=False, breath=0,
             shadow=False)
    S.LEO.face = lambda *a, **k: None          # anime face is drawn separately
    outs = []
    for bg in ((0, 0, 0), (255, 255, 255)):
        f = Frame(0.0, 0)
        f.boil = 0.0
        f.img = Image.new('RGB', (W * SS, H * SS), bg)
        f.d = ImageDraw.Draw(f.img)
        f.cam(1.0, 960, 540)
        tw = S.LEO.draw(f, 1370, 1240, 3.7, p, 1.2)
        anime_face(f, tw, 3.7)
        # clenched fist with knuckle lines
        fx, fy = 1690, 470
        f.ell(fx, fy, 40, 36, CREAM, INKC, 6, amp=0)
        for k in range(3):
            f.line([(fx - 20 + k * 17, fy - 32), (fx - 18 + k * 17, fy - 12)], INKC, 4.5, amp=0)
        f.line([(fx - 34, fy + 4), (fx + 10, fy + 14)], INKC, 4.5, amp=0)
        for k in range(3):
            ang = -2.2 + k * 0.45
            f.line([(fx + math.cos(ang) * 56, fy + math.sin(ang) * 56), (fx + math.cos(ang) * 88, fy + math.sin(ang) * 88)],
                   (255, 240, 200), 6, amp=0)
        # DAY 1 note in the low hand
        nx, ny = 1250, 935
        pts = [(nx - 78, ny - 66), (nx + 70, ny - 82), (nx + 82, ny + 66), (nx - 66, ny + 80)]
        f.poly(pts, (250, 214, 92), INKC, 6, amp=0)
        f.text(nx + 4, ny, 'DAY 1', 48, INKC, GAEGU)
        outs.append(np.asarray(work(f.img), np.float32))
    k, w = outs
    alpha = np.clip(1 - (w - k).mean(-1) / 255, 0, 1)
    rgb = np.where(alpha[..., None] > 0.01, k / np.maximum(alpha[..., None], 0.01), 0)
    return np.clip(rgb, 0, 255), alpha


def shift(m, dx, dy):
    return np.roll(np.roll(m, dy, 0), dx, 1)


def cel(rgb, alpha):
    """Two-tone anime shading: hard cool shadow lower-right, crisp highlight upper-left, warm rim, ink outline."""
    m = (alpha > 0.5).astype(np.float32)
    skin = ((np.abs(rgb - np.array(CREAM)).sum(-1) < 120) & (m > 0)).astype(np.float32)
    # normals from an inflated mask (works for the body and the thin limbs alike)
    h = (gaussian_filter(m, 30) * 0.6 + gaussian_filter(m, 10) * 0.4) * 220
    gy, gx = np.gradient(h)
    n = np.stack([-gx, -gy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    Ld = np.array([-0.6, -0.55, 0.58])
    Ld /= np.linalg.norm(Ld)
    dif = (n * Ld).sum(-1)
    sh = np.clip((0.62 - dif) / 0.04, 0, 1) * skin          # hard terminator
    hl = np.clip((dif - 0.93) / 0.02, 0, 1) * skin
    rim = np.clip(m - shift(m, -16, 0), 0, 1) * skin
    out = rgb.copy()
    out = out * (1 - sh[..., None]) + out * np.array([0.70, 0.66, 0.84]) * sh[..., None]
    out = out + hl[..., None] * np.array([28, 26, 20])
    out = out * (1 - rim[..., None] * 0.8) + np.array([255, 170, 80]) * rim[..., None] * 0.8
    # thick ink outline around the silhouette
    dil = maximum_filter(alpha, size=17)
    ring = np.clip(gaussian_filter(dil, 1.2) - alpha, 0, 1)
    return np.clip(out, 0, 255), alpha, ring


# ------------------------------------------------------------------ anime poster title
def poster_text(canvas, text, x, y, size, fill, inner, outer, shear=-0.18, grad=None):
    fnt = font(GAEGU, size)
    pad = 120
    w = int(fnt.getlength(text)) + pad * 2
    h = int(size * 1.4) + pad * 2
    lay = Image.new('L', (w, h), 0)
    ImageDraw.Draw(lay).text((pad, h / 2), text, fill=255, font=fnt, anchor='lm')
    lay = lay.transform(lay.size, Image.AFFINE, (1, shear, -shear * h / 2, 0, 1, 0), resample=Image.BICUBIC)
    M = np.asarray(lay, np.float32) / 255
    big = np.zeros((HH, WW), np.float32)
    X0, Y0 = int(x - pad), int(y - h / 2)
    xs0, ys0 = max(0, X0), max(0, Y0)
    xs1, ys1 = min(WW, X0 + w), min(HH, Y0 + h)
    big[ys0:ys1, xs0:xs1] = M[ys0 - Y0:ys1 - Y0, xs0 - X0:xs1 - X0]
    M = big
    o2 = np.clip(maximum_filter(M, size=int(size * 0.17)), 0, 1)
    o1 = np.clip(maximum_filter(M, size=int(size * 0.09)), 0, 1)
    shadow = gaussian_filter(shift(o2, 18, 22), 6)
    out = canvas * (1 - 0.7 * shadow[..., None])
    out = out * (1 - o2[..., None]) + np.array(outer, np.float32) * o2[..., None]
    out = out * (1 - o1[..., None]) + np.array(inner, np.float32) * o1[..., None]
    ys = np.nonzero(M.max(1) > 0.5)[0]
    y_0, y_1 = ys.min(), ys.max()
    v = np.clip((np.arange(HH) - y_0) / max(1, y_1 - y_0), 0, 1)[:, None, None]
    top, bot = grad if grad else (fill, fill)
    face = np.array(top, np.float32) * (1 - v) + np.array(bot, np.float32) * v
    shine = (np.abs(v - 0.38) < 0.05).astype(np.float32) * 0
    face = np.broadcast_to(face, (HH, WW, 3))
    hl = np.clip(M - shift(M, 4, 5), 0, 1)
    face = face + hl[..., None] * 60
    out = out * (1 - M[..., None]) + np.clip(face, 0, 255) * M[..., None]
    return out


def banner(canvas, x0, y0, x1, y1, col, skew=40):
    m = Image.new('L', (WW, HH), 0)
    ImageDraw.Draw(m).polygon([(x0 + skew, y0), (x1 + skew, y0), (x1 - skew, y1), (x0 - skew, y1)], fill=255)
    M = np.asarray(m, np.float32) / 255
    o = maximum_filter(M, size=15)
    sh = gaussian_filter(shift(o, 14, 16), 5)
    out = canvas * (1 - 0.6 * sh[..., None])
    out = out * (1 - o[..., None]) + np.array(INKC, np.float32) * o[..., None]
    return out * (1 - M[..., None]) + np.array(col, np.float32) * M[..., None]


def main():
    bg = background()
    rgb, alpha = leo_layer()
    rgb, alpha, ring = cel(rgb, alpha)
    glow = gaussian_filter(maximum_filter(alpha, 9), 30)
    bg = bg + glow[..., None] * np.array([255, 230, 170], np.float32) * 0.35
    img = bg * (1 - alpha[..., None]) + rgb * alpha[..., None]
    img = img * (1 - ring[..., None]) + np.array(INKC, np.float32) * ring[..., None]
    img = poster_text(img, 'DISCIPLINE', 60, 320, 330, (255, 255, 255), INKC, (226, 28, 30),
                      grad=((255, 255, 255), (255, 228, 170)))
    img = banner(img, 110, 600, 1030, 810, (226, 28, 30))
    img = poster_text(img, '47 RESTARTS', 145, 700, 160, (255, 255, 255), INKC, INKC, shear=-0.15)
    # finishing: punchy contrast, light vignette
    a = np.clip(img, 0, 255) / 255
    a = a * a * (3 - 2 * a) * 0.3 + a * 0.7
    yy, xx = np.mgrid[0:HH, 0:WW].astype(np.float32)
    dd = np.sqrt(((xx - WW / 2) / (WW / 2)) ** 2 + ((yy - HH / 2) / (HH / 2)) ** 2) / 1.414
    a *= np.clip(1 - 0.35 * dd ** 2.6, 0, 1)[..., None]
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    im = im.resize((1280, 720), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.0, 70, 2))
    im.save(OUT)
    print('saved', OUT)


if __name__ == '__main__':
    main()
