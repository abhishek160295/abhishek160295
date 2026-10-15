"""3D-look thumbnail: Leo + DISCIPLINE, volumetric shading, extruded type, depth of field."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt, gaussian_filter
from engine import *
from props import sticky, NOTE
import scenes as S

WW, HH = 2560, 1440              # working resolution
OUT = 'out/thumbnail.png'


def to_work(im):
    return im.resize((WW, HH), Image.LANCZOS)


# ------------------------------------------------------------------ background: the wall of DAY 1s
def background():
    f = Frame(0.0, 0)
    f.letterbox = False
    f.grain = 0.0
    f.boil = 0.0
    f.cam(1.0, 960, 540)
    f.rect(-50, -50, 1970, 1130, (38, 30, 24), None, amp=0)
    r = np.random.default_rng(4)
    for j in range(9):
        for i in range(17):
            x = -20 + i * 118 + r.normal(0, 10) + (j % 2) * 50
            y = 20 + j * 112 + r.normal(0, 8)
            col = tuple(int(c * r.uniform(0.62, 0.85)) for c in (214, 166, 82))
            sticky(f, x, y, 'DAY 1', 1.55, col=col, ang=r.normal(0, 0.12))
    f.light(1480, 300, 560, (255, 150, 70), 0.55)      # warm lamp behind Leo
    f.light(300, 900, 600, (50, 80, 150), 0.18)       # cool fill, bottom left
    im = f.finish()
    im = im.filter(ImageFilter.GaussianBlur(7))       # depth of field
    a = np.asarray(to_work(im), np.float32)
    yy, xx = np.mgrid[0:HH, 0:WW].astype(np.float32)
    # darken the text side so the type pops
    a *= (0.34 + 0.56 * np.clip((xx / WW - 0.25) / 0.5, 0, 1))[..., None]
    return a


# ------------------------------------------------------------------ hero layer via difference matting
def leo_layer():
    p = dict(band=True, face=-0.25, eyes='open', brow=0.9, browy=1, mouth='tense', sweat=3, look=(-2, 0),
             light=(-0.6, -0.6), lhw=(1250, 820), rhw=(1590, 560), rbend=1, blink=False, breath=0)
    outs = []
    for bg in ((0, 0, 0), (255, 255, 255)):
        f = Frame(0.0, 0)
        f.boil = 0.0
        f.img = Image.new('RGB', (W * SS, H * SS), bg)
        f.d = ImageDraw.Draw(f.img)
        f.cam(1.0, 960, 540)
        S.LEO.draw(f, 1400, 1170, 3.45, dict(p, shadow=False), 1.2)
        sticky(f, 1630, 500, 'DAY 1', 2.9, col=(236, 206, 92), ang=0.12)
        outs.append(np.asarray(to_work(f.img), np.float32))
    k, w = outs
    alpha = np.clip(1 - (w - k).mean(-1) / 255, 0, 1)
    rgb = np.where(alpha[..., None] > 0.01, k / np.maximum(alpha[..., None], 0.01), 0)
    return np.clip(rgb, 0, 255), alpha


def clay_shade(rgb, alpha):
    """Give the flat cut-out volume: height from distance-to-edge, then key + rim + spec lighting."""
    m = (alpha > 0.5).astype(np.float32)
    d = distance_transform_edt(m)
    # pillow-inflated height field: smooth dome, no ridge along the middle
    h = (gaussian_filter(m, 46) * 0.7 + gaussian_filter(m, 16) * 0.3) * 260
    gy, gx = np.gradient(h)
    n = np.stack([-gx, -gy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    key = np.array([-0.55, -0.6, 0.58])
    key /= np.linalg.norm(key)
    rim = np.array([0.8, -0.35, -0.2])
    rim /= np.linalg.norm(rim)
    diff = np.clip((n * key).sum(-1), 0, 1)
    half = key + np.array([0, 0, 1.0])
    half /= np.linalg.norm(half)
    spec = np.clip((n * half).sum(-1), 0, 1) ** 24
    fres = (1 - n[..., 2]) ** 2.2
    rimv = np.clip((n * rim).sum(-1) + 0.3, 0, 1) * fres
    lit = rgb * (0.66 + 0.48 * diff)[..., None]
    lit += spec[..., None] * np.array([255, 248, 235]) * 0.22
    lit += rimv[..., None] * np.array([255, 150, 70]) * 0.9
    occl = np.clip(d / 26, 0, 1) ** 0.6           # soft occlusion at the edges
    lit *= (0.78 + 0.22 * occl)[..., None]
    return np.clip(lit, 0, 255)


# ------------------------------------------------------------------ extruded 3D type
def text3d(canvas, text, x, y, size, top, bottom, side, depth=26, d=(1.0, 1.3), anchor='lm', path=GAEGU, glow=None):
    fnt = font(path, size)
    m = Image.new('L', (WW, HH), 0)
    ImageDraw.Draw(m).text((x, y), text, fill=255, font=fnt, anchor=anchor, stroke_width=int(size * 0.02),
                           stroke_fill=255)
    M = np.asarray(m, np.float32) / 255
    out = canvas
    # drop shadow + optional glow
    sh = gaussian_filter(np.roll(np.roll(M, int(depth * 1.6), 1), int(depth * 2.0), 0), 18)
    out *= (1 - 0.75 * sh)[..., None]
    if glow is not None:
        g = gaussian_filter(M, 40)
        out += g[..., None] * np.array(glow, np.float32) * 1.2
    # extrusion, back to front
    for i in range(depth, 0, -1):
        Mi = np.roll(np.roll(M, int(round(i * d[0])), 1), int(round(i * d[1])), 0)
        k = 0.55 + 0.45 * (1 - i / depth)
        col = np.array(side, np.float32) * k
        out = out * (1 - Mi[..., None]) + col * Mi[..., None]
    # front face: vertical gradient + bevel
    ys = np.nonzero(M.max(1) > 0.5)[0]
    y0, y1 = (ys.min(), ys.max()) if len(ys) else (0, 1)
    v = np.clip((np.arange(HH) - y0) / max(1, y1 - y0), 0, 1)[:, None, None]
    face = np.array(top, np.float32) * (1 - v) + np.array(bottom, np.float32) * v
    face = np.broadcast_to(face, (HH, WW, 3)).copy()
    inner = gaussian_filter(M, 3)
    hl = np.clip(inner - np.roll(np.roll(inner, 5, 1), 6, 0), 0, 1)       # top-left edge highlight
    dk = np.clip(inner - np.roll(np.roll(inner, -5, 1), -6, 0), 0, 1)     # bottom-right edge shade
    face += hl[..., None] * 120
    face -= dk[..., None] * 70
    gloss = np.clip(1 - v * 2.2, 0, 1) * 0.18 * 255                         # glossy top band
    face += gloss
    out = out * (1 - M[..., None]) + np.clip(face, 0, 255) * M[..., None]
    return out


def swoosh3d(canvas, x0, x1, y, th, col, side):
    m = Image.new('L', (WW, HH), 0)
    pts_t, pts_b = [], []
    for k in range(41):
        v = k / 40
        xx = lerp(x0, x1, v)
        yy = y + math.sin(v * math.pi) * 14 - v * 26
        t = th * math.sin(v * math.pi) ** 0.55 + 4
        pts_t.append((xx, yy - t / 2))
        pts_b.append((xx + 8, yy + t / 2))
    ImageDraw.Draw(m).polygon(pts_t + pts_b[::-1], fill=255)
    M = gaussian_filter(np.asarray(m, np.float32) / 255, 1.0)
    out = canvas
    for i in range(12, 0, -1):
        Mi = np.roll(np.roll(M, i, 1), int(i * 1.3), 0)
        out = out * (1 - Mi[..., None]) + np.array(side, np.float32) * Mi[..., None]
    out += gaussian_filter(M, 30)[..., None] * np.array(col, np.float32) * 0.6
    hl = np.clip(M - np.roll(M, 5, 0), 0, 1)
    face = np.array(col, np.float32) + hl[..., None] * 90
    return out * (1 - M[..., None]) + np.clip(face, 0, 255) * M[..., None]


def main():
    bg = background()
    rgb, alpha = leo_layer()
    lit = clay_shade(rgb, alpha)
    # cast shadow of Leo on the wall (behind, down-left), soft
    shadow = gaussian_filter(np.roll(np.roll(alpha, -70, 1), 40, 0), 30)
    bg *= (1 - 0.55 * shadow)[..., None]
    # warm rim halo around Leo to separate him from the wall
    halo = np.clip(gaussian_filter(alpha, 24) - alpha, 0, 1)
    bg += halo[..., None] * np.array([255, 160, 80], np.float32) * 0.55
    img = bg * (1 - alpha[..., None]) + lit * alpha[..., None]
    # type
    img = text3d(img, 'DISCIPLINE', 90, 470, 300, (255, 255, 255), (214, 210, 202), (90, 84, 78), depth=30)
    img = swoosh3d(img, 110, 1500, 660, 46, (232, 32, 30), (110, 10, 10))
    img = text3d(img, '47 RESTARTS', 110, 880, 215, (255, 92, 78), (205, 22, 22), (95, 8, 8), depth=22,
                 glow=(255, 40, 30))
    # grade: contrast curve, vignette, slight sharpening
    a = np.clip(img, 0, 255) / 255
    a = a * a * (3 - 2 * a) * 0.35 + a * 0.65
    yy, xx = np.mgrid[0:HH, 0:WW].astype(np.float32)
    dd = np.sqrt(((xx - WW / 2) / (WW / 2)) ** 2 + ((yy - HH / 2) / (HH / 2)) ** 2) / 1.414
    a *= np.clip(1 - 0.5 * dd ** 2.4, 0, 1)[..., None]
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    im = im.resize((1280, 720), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    im.save(OUT)
    print('saved', OUT, im.size)


if __name__ == '__main__':
    main()
