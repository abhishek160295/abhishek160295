import math, random, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1]
W, H, FPS, DUR = 720, 1280, 30, 8.2
BOX = 720  # square content box
BY = (H - BOX) // 2
F = '/usr/share/fonts/truetype/'
mono = lambda s: ImageFont.truetype(F + 'jetbrains-mono/JetBrainsMono-Regular.ttf', s)
monob = lambda s: ImageFont.truetype(F + 'jetbrains-mono/JetBrainsMono-Bold.ttf', s)
serif = lambda s: ImageFont.truetype(F + 'freefont/FreeSerif.ttf', s)
serifi = lambda s: ImageFont.truetype(F + 'freefont/FreeSerifItalic.ttf', s)
hand = lambda s: ImageFont.truetype(F + 'dejavu/DejaVuSerif.ttf', s)

BG = (6, 8, 11); TEAL = (45, 226, 196); PINK = (255, 61, 127); GREEN = (57, 255, 136)
BLUE = (60, 110, 255); AMB = (255, 184, 77); GREY = (120, 130, 140); WHITE = (225, 230, 235)
PURP = (170, 110, 255)
rng = np.random.default_rng(7)

def canvas(c=BG): return Image.new('RGB', (BOX, BOX), c)

def ease(t): return 1 - (1 - t) ** 3

# ---------- scenes ----------
CODE_PY = [
 ("import", PINK), (" pandas ", WHITE), ("as", PINK), (" pd", WHITE), None,
 ("import", PINK), (" numpy ", WHITE), ("as", PINK), (" np", WHITE), None, None,
 ("df", WHITE), (" = pd.", GREY), ("read_csv", TEAL), ("(", GREY), ("'sales_2026.csv'", AMB), (")", GREY), None,
 ("df", WHITE), (" = df.", GREY), ("dropna", TEAL), ("()", GREY), None,
 ("df", WHITE), ("[", GREY), ("'month'", AMB), ("] = df.date.dt.", GREY), ("month", TEAL), None, None,
 ("# rolling trend, 7-day window", (90, 100, 110)), None,
 ("trend", WHITE), (" = df.revenue.", GREY), ("rolling", TEAL), ("(", GREY), ("7", PURP), (").", GREY), ("mean", TEAL), ("()", GREY), None,
 ("corr", WHITE), ("  = df.", GREY), ("corr", TEAL), ("(numeric_only=", GREY), ("True", PINK), (")", GREY), None, None,
 ("print", TEAL), ("(df.", GREY), ("describe", TEAL), ("())", GREY), None,
]

def code_scene(tokens, t, fs=20, title='analysis.py'):
    im = canvas((10, 12, 16)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, BOX, 34], fill=(18, 21, 27))
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([14 + i * 20, 11, 26 + i * 20, 23], fill=c)
    d.text((90, 8), title, font=mono(15), fill=GREY)
    total = sum(len(x[0]) for x in tokens if x)
    shown = int(total * min(1, t * 1.25 + 0.25))
    x, y, ln, n = 70, 56, 1, 0
    f = mono(fs); lh = int(fs * 1.55)
    d.text((22, y), f'{ln:>2}', font=f, fill=(60, 66, 76))
    for tok in tokens:
        if tok is None:
            ln += 1; y += lh; x = 70
            d.text((22, y), f'{ln:>2}', font=f, fill=(60, 66, 76)); continue
        s, c = tok
        k = max(0, min(len(s), shown - n)); n += len(s)
        if k:
            d.text((x, y), s[:k], font=f, fill=c); x += d.textlength(s[:k], font=f)
        if 0 < k < len(s) or (k == len(s) and n == shown):
            cx, cy = x, y
    if int(t * 8) % 2 == 0:
        try: d.rectangle([cx + 2, cy + 2, cx + 12, cy + fs + 4], fill=TEAL)
        except NameError: pass
    return im

def terminal(t):
    im = canvas((4, 6, 8)); d = ImageDraw.Draw(im); f = mono(19)
    lines = [('$ python train.py --model xgb --cv 5', GREEN)]
    loss = 0.69
    for e in range(1, 26):
        loss = loss * 0.86 + 0.012
        acc = 1 - loss * 0.55
        lines.append((f'epoch {e:02d}/25  loss {loss:.4f}  val_acc {acc:.3f}', WHITE if e % 5 else TEAL))
    lines.append(('✓ best model saved → models/xgb_v7.pkl', GREEN))
    n = int(len(lines) * min(1, 0.15 + t * 1.1))
    vis = lines[max(0, n - 26):n]
    for i, (s, c) in enumerate(vis):
        d.text((24, 24 + i * 26), s, font=f, fill=c)
    return im

def series(n, seed, drift=0.15, vol=1.0):
    r = np.random.default_rng(seed); return np.cumsum(r.normal(drift, vol, n))

def line_chart(t):
    im = canvas(); d = ImageDraw.Draw(im)
    for gy in range(80, 700, 60): d.line([(0, gy), (BOX, gy)], fill=(20, 26, 30))
    for gx in range(40, 720, 80): d.line([(gx, 0), (gx, BOX)], fill=(16, 20, 24))
    N = 120; s = series(N, 3, 0.35, 2.2)
    lo, hi = s.min(), s.max()
    ys = 620 - (s - lo) / (hi - lo) * 480; xs = np.linspace(30, 690, N)
    m = int(N * ease(min(1, t * 1.2 + 0.1)))
    for i in range(1, m):  # candles
        up = s[i] >= s[i - 1]; c = GREEN if up else PINK
        w = r = 2
        d.line([(xs[i], ys[i] - 14), (xs[i], ys[i] + 14)], fill=c, width=1)
        d.rectangle([xs[i] - 2, min(ys[i], ys[i - 1]), xs[i] + 2, max(ys[i], ys[i - 1]) + 1], fill=c)
    for win, c in [(8, TEAL), (25, PINK)]:
        ma = np.convolve(s, np.ones(win) / win, 'valid'); off = win - 1
        pts = [(xs[i + off], 620 - (ma[i] - lo) / (hi - lo) * 480) for i in range(len(ma)) if i + off < m]
        if len(pts) > 1: d.line(pts, fill=c, width=3)
    d.text((24, 22), 'REVENUE · 7D / 25D MOVING AVG', font=mono(16), fill=GREY)
    return im

def equation(t, lines, bg=(14, 16, 18), col=(225, 225, 215), font=None, glow=False):
    im = canvas(bg); d = ImageDraw.Draw(im)
    # chalk smudge
    for _ in range(60):
        x, y = rng.integers(0, BOX, 2); r = rng.integers(20, 90)
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(min(255, b + 4) for b in bg))
    im = im.filter(ImageFilter.GaussianBlur(25)); d = ImageDraw.Draw(im)
    y = 90
    total = sum(len(s) for s, _ in lines); shown = int(total * min(1, t * 1.4 + 0.2)); n = 0
    for s, sz in lines:
        f = font(sz) if font else serifi(sz)
        k = max(0, min(len(s), shown - n)); n += len(s)
        d.text((48, y), s[:k], font=f, fill=col); y += int(sz * 1.55)
    return im

def heatmap(t):
    im = canvas(); d = ImageDraw.Draw(im)
    labs = ['rev', 'units', 'price', 'ads', 'churn', 'nps', 'aov']
    r = np.random.default_rng(11); A = r.normal(size=(7, 7)); C = np.corrcoef(A @ A.T + r.normal(size=(7, 7)))
    n = len(labs); cs = 82; ox, oy = 110, 90
    shown = int(n * n * min(1, t * 2.6 + 0.3))
    for i in range(n):
        d.text((24, oy + i * cs + 30), labs[i], font=mono(16), fill=GREY)
        d.text((ox + i * cs + 18, oy + n * cs + 10), labs[i], font=mono(16), fill=GREY)
        for j in range(n):
            if i * n + j >= shown: continue
            v = C[i, j]
            c = tuple(int(BG[k] + (TEAL if v > 0 else PINK)[k] * abs(v) * 0.9) for k in range(3))
            d.rectangle([ox + j * cs, oy + i * cs, ox + j * cs + cs - 3, oy + i * cs + cs - 3], fill=c)
            d.text((ox + j * cs + 20, oy + i * cs + 30), f'{v:+.2f}', font=mono(15), fill=(235, 240, 240))
    d.text((24, 30), 'df.corr()', font=mono(18), fill=TEAL)
    return im

def scatter(t):
    im = canvas(); d = ImageDraw.Draw(im)
    r = np.random.default_rng(5); x = r.uniform(0, 1, 160); y = 0.8 * x + r.normal(0, 0.12, 160)
    X = 60 + x * 600; Y = 640 - (y + 0.2) / 1.2 * 560
    d.line([(60, 660), (680, 660)], fill=(50, 56, 64)); d.line([(60, 60), (60, 660)], fill=(50, 56, 64))
    k = int(160 * min(1, t * 1.8 + 0.1))
    for i in range(k):
        d.ellipse([X[i] - 5, Y[i] - 5, X[i] + 5, Y[i] + 5], outline=TEAL, width=2)
    if t > 0.35:
        p = ease(min(1, (t - 0.35) / 0.5))
        xs = np.linspace(0, 1, 50); ys = 0.8 * xs
        band = [(60 + a * 600, 640 - (b + 0.2 + 0.08) / 1.2 * 560) for a, b in zip(xs, ys)] + \
               [(60 + a * 600, 640 - (b + 0.2 - 0.08) / 1.2 * 560) for a, b in zip(xs[::-1], ys[::-1])]
        ov = Image.new('RGBA', (BOX, BOX)); ImageDraw.Draw(ov).polygon(band, fill=PINK + (int(45 * p),))
        im.paste(ov, (0, 0), ov); d = ImageDraw.Draw(im)
        e = int(50 * p)
        d.line([(60 + a * 600, 640 - (b + 0.2) / 1.2 * 560) for a, b in zip(xs[:max(2, e)], ys[:max(2, e)])], fill=PINK, width=4)
        d.text((400, 80), 'R² = 0.84', font=mono(26), fill=PINK)
    return im

def histo(t):
    im = canvas(); d = ImageDraw.Draw(im)
    r = np.random.default_rng(2); v = np.concatenate([r.normal(0, 1, 4000), r.normal(2.6, 0.6, 1500)])
    h, e = np.histogram(v, 40); h = h / h.max()
    p = ease(min(1, t * 1.5 + 0.05)); bw = 620 / 40
    for i, hv in enumerate(h):
        x0 = 50 + i * bw; top = 650 - hv * 520 * p
        d.rectangle([x0 + 1, top, x0 + bw - 2, 650], fill=(30, 60, 120), outline=BLUE)
    xs = np.linspace(e[0], e[-1], 200)
    kde = sum(np.exp(-(xs - m) ** 2 / (2 * s * s)) * w for m, s, w in [(0, 1, 1), (2.6, 0.6, 0.6)])
    kde /= kde.max()
    pts = [(50 + (a - e[0]) / (e[-1] - e[0]) * 620, 650 - b * 520 * p) for a, b in zip(xs, kde)]
    d.line(pts, fill=AMB, width=3)
    d.text((24, 26), 'customer_ltv  ·  bimodal', font=mono(17), fill=GREY)
    return im

def surface(t):
    im = canvas((3, 4, 6)); d = ImageDraw.Draw(im)
    a = 0.6 + t * 0.6; n = 26
    def P(x, y):
        z = 0.9 * math.exp(-((x - 0.3) ** 2 + (y + 0.2) ** 2) * 2.5) - 0.7 * math.exp(-((x + 0.5) ** 2 + (y - 0.4) ** 2) * 3) + 0.15 * math.sin(3 * x) * math.cos(3 * y)
        X = x * math.cos(a) - y * math.sin(a); Y = x * math.sin(a) + y * math.cos(a)
        return (360 + X * 260, 400 + Y * 110 - z * 220)
    g = np.linspace(-1, 1, n)
    for i in g:
        d.line([P(i, j) for j in g], fill=(40, 120, 200), width=1)
        d.line([P(j, i) for j in g], fill=(40, 120, 200), width=1)
    # descending ball path
    path = [(0.9 - k * 0.055, -0.6 + k * 0.040) for k in range(26)]
    k = int(len(path) * min(1, t * 1.3 + 0.1))
    if k > 1: d.line([P(*p) for p in path[:k]], fill=PINK, width=4)
    px, py = P(*path[k - 1]); d.ellipse([px - 8, py - 8, px + 8, py + 8], fill=PINK)
    d.text((24, 26), 'loss landscape · gradient descent', font=mono(17), fill=GREY)
    return im

def confusion(t):
    im = canvas(); d = ImageDraw.Draw(im)
    M = [[912, 41], [27, 520]]; cs = 250; ox, oy = 150, 150
    for i in range(2):
        for j in range(2):
            v = M[i][j] / 912; c = tuple(int(BG[k] + PURP[k] * v * 0.75) for k in range(3))
            d.rectangle([ox + j * cs, oy + i * cs, ox + j * cs + cs - 6, oy + i * cs + cs - 6], fill=c)
            val = int(M[i][j] * ease(min(1, t * 1.6 + 0.1)))
            f = monob(46); s = str(val); w = d.textlength(s, font=f)
            d.text((ox + j * cs + (cs - w) / 2 - 3, oy + i * cs + 95), s, font=f, fill=WHITE)
    d.text((ox, 100), 'pred: 0              pred: 1', font=mono(16), fill=GREY)
    d.text((40, 260), 'true 0', font=mono(16), fill=GREY); d.text((40, 510), 'true 1', font=mono(16), fill=GREY)
    d.text((ox, 670), 'precision 0.927   recall 0.951', font=mono(18), fill=TEAL)
    return im

def table(t):
    im = canvas((9, 10, 13)); d = ImageDraw.Draw(im)
    d.text((24, 26), 'In [14]: ', font=mono(18), fill=BLUE); d.text((120, 26), 'df.groupby("region").agg(...)', font=mono(18), fill=WHITE)
    hdr = ['region', 'orders', 'revenue', 'aov', 'growth']
    rows = [['North', '18,204', '$4.21M', '2,312', '+14.2%'], ['South', '22,931', '$5.87M', '2,560', '+21.7%'],
            ['East', '9,118', '$1.64M', '1,799', '-3.1%'], ['West', '25,407', '$6.92M', '2,724', '+18.9%'],
            ['Central', '11,560', '$2.38M', '2,059', '+6.4%']]
    cx = [30, 170, 300, 450, 570]; y0 = 110
    d.text((24, 76), 'Out[14]:', font=mono(18), fill=PINK)
    for k, h in enumerate(hdr): d.text((cx[k], y0), h, font=monob(18), fill=WHITE)
    d.line([(24, y0 + 34), (696, y0 + 34)], fill=(60, 66, 76))
    n = int(len(rows) * min(1, t * 1.8 + 0.2))
    for i, r in enumerate(rows[:n]):
        y = y0 + 52 + i * 56
        if i % 2 == 0: d.rectangle([20, y - 12, 700, y + 36], fill=(15, 17, 22))
        for k, c in enumerate(r):
            col = (GREEN if c.startswith('+') else PINK) if k == 4 else (210, 214, 220)
            d.text((cx[k], y), c, font=mono(18), fill=col)
    # mini bar
    if t > 0.4:
        p = ease(min(1, (t - 0.4) / 0.5))
        for i, v in enumerate([4.21, 5.87, 1.64, 6.92, 2.38]):
            x = 60 + i * 130; h = v / 6.92 * 200 * p
            d.rectangle([x, 660 - h, x + 80, 660], fill=TEAL if i != 2 else PINK)
    return im

def network(t):
    im = canvas((3, 4, 7)); d = ImageDraw.Draw(im)
    layers = [5, 8, 8, 6, 3]; pos = []
    for li, n in enumerate(layers):
        x = 90 + li * 135; pos.append([(x, 360 + (k - (n - 1) / 2) * 72) for k in range(n)])
    r = np.random.default_rng(1)
    for li in range(len(layers) - 1):
        for a in pos[li]:
            for b in pos[li + 1]:
                w = r.uniform(); pulse = (math.sin(t * 12 - li * 1.3 + w * 6) + 1) / 2
                c = tuple(int(15 + (TEAL if w > .5 else PINK)[k] * 0.35 * pulse) for k in range(3))
                d.line([a, b], fill=c, width=1)
    for li, L in enumerate(pos):
        for (x, y) in L:
            a = (math.sin(t * 10 + x * 0.05 + y * 0.03) + 1) / 2
            d.ellipse([x - 13, y - 13, x + 13, y + 13], fill=(10, 12, 16), outline=(int(60 + 195 * a), int(200 * a + 40), 200), width=3)
    d.text((24, 26), 'MLP · 5→8→8→6→3 · ReLU', font=mono(17), fill=GREY)
    return im

def loss_curve(t):
    im = canvas(); d = ImageDraw.Draw(im)
    for gy in range(100, 700, 100): d.line([(60, gy), (690, gy)], fill=(22, 26, 30))
    x = np.linspace(0, 1, 200); tr = 0.08 + 0.9 * np.exp(-x * 6) + np.random.default_rng(3).normal(0, 0.012, 200)
    va = 0.14 + 0.85 * np.exp(-x * 5) + 0.06 * np.maximum(0, x - 0.7) + np.random.default_rng(4).normal(0, 0.018, 200)
    k = max(2, int(200 * ease(min(1, t * 1.3 + 0.05))))
    for arr, c in [(tr, TEAL), (va, AMB)]:
        d.line([(60 + x[i] * 630, 660 - arr[i] * 540) for i in range(k)], fill=c, width=3)
    d.text((440, 70), '— train', font=mono(18), fill=TEAL); d.text((440, 98), '— val', font=mono(18), fill=AMB)
    d.text((24, 26), 'loss vs epochs', font=mono(17), fill=GREY)
    return im

def kpi(t):
    im = canvas((5, 6, 9)); d = ImageDraw.Draw(im)
    cards = [('MRR', 4.8, '${:.1f}M', GREEN), ('CHURN', 2.3, '{:.1f}%', PINK), ('CAC', 812, '${:.0f}', AMB), ('LTV:CAC', 4.6, '{:.1f}x', TEAL)]
    p = ease(min(1, t * 1.6 + 0.1))
    for i, (lab, v, fmt, c) in enumerate(cards):
        x = 30 + (i % 2) * 340; y = 60 + (i // 2) * 320
        d.rounded_rectangle([x, y, x + 320, y + 290], 16, fill=(14, 16, 21), outline=(30, 34, 42))
        d.text((x + 24, y + 24), lab, font=mono(18), fill=GREY)
        d.text((x + 24, y + 70), fmt.format(v * p), font=monob(52), fill=WHITE)
        s = series(30, i + 20, 0.2, 1)
        pts = [(x + 24 + k * 9.5, y + 250 - (s[k] - s.min()) / (np.ptp(s) + 1e-6) * 90) for k in range(int(30 * p))]
        if len(pts) > 1: d.line(pts, fill=c, width=3)
    return im

def sql(t):
    toks = [("SELECT", PINK), (" region,", WHITE), None, ("       ", WHITE), ("SUM", TEAL), ("(revenue) ", WHITE), ("AS", PINK), (" rev,", WHITE), None,
            ("       ", WHITE), ("AVG", TEAL), ("(order_value) ", WHITE), ("AS", PINK), (" aov", WHITE), None,
            ("FROM", PINK), (" orders o", WHITE), None, ("JOIN", PINK), (" customers c ", WHITE), ("ON", PINK), (" o.cid = c.id", WHITE), None,
            ("WHERE", PINK), (" order_date >= ", WHITE), ("'2026-01-01'", AMB), None,
            ("GROUP BY", PINK), (" region", WHITE), None, ("ORDER BY", PINK), (" rev ", WHITE), ("DESC", PINK), (";", WHITE), None, None,
            ("-- 5 rows · 0.42s", (90, 100, 110))]
    return code_scene(toks, t, 22, 'query.sql')

def final(t):
    im = canvas((3, 4, 6)); d = ImageDraw.Draw(im)
    f = mono(22)
    d.text((40, 160), '>>> model.score(X_test, y_test)', font=f, fill=WHITE)
    if t > 0.25:
        v = 0.9 + 0.073 * ease(min(1, (t - 0.25) / 0.5))
        d.text((40, 420), f'{v:.3f}', font=monob(64), fill=GREEN)
    if t > 0.7: d.text((40, 540), '>>> _', font=f, fill=GREY if int(t * 10) % 2 else WHITE)
    return im

E = [
    lambda t: equation(t, [("Bayes' theorem", 30), ("P(A|B) = P(B|A)·P(A) / P(B)", 38), ("", 10), ("posterior ∝ likelihood × prior", 30), ("", 10), ("E[X] = Σ xᵢ·P(xᵢ)", 38), ("Var(X) = E[X²] − (E[X])²", 38)]),
    lambda t: equation(t, [("Ordinary least squares", 30), ("β̂ = (XᵀX)⁻¹ Xᵀy", 46), ("", 10), ("min  |y − Xβ|²", 40), ("", 10), ("R² = 1 − SSᵣₑₛ / SSₜₒₜ", 40), ("σ̂² = RSS / (n − p − 1)", 36)], bg=(232, 232, 226), col=(30, 34, 40)),
    lambda t: equation(t, [("∂L/∂w = −(1/n) Σ xᵢ(yᵢ − ŷᵢ)", 34), ("", 6), ("w ← w − η ∇L(w)", 46), ("", 6), ("σ(z) = 1 / (1 + e⁻ᶻ)", 40), ("ŷ = argmax P(y | x)", 40), ("H(p,q) = −Σ p log q", 40)], bg=(5, 8, 14), col=(70, 120, 255), font=hand),
]

SCENES = [terminal, lambda t: code_scene(CODE_PY, t), line_chart, E[0], heatmap, sql, scatter, surface,
          E[1], histo, table, network, loss_curve, E[2], confusion, kpi, final]

# beat grid ~0.43s (matches reference cut rhythm), final shot held longer
B = 0.4275
cuts = [round(i * B, 4) for i in range(len(SCENES))] + [DUR]
segs = list(zip(cuts[:-1], cuts[1:]))

# ---------- post ----------
yy, xx = np.mgrid[0:BOX, 0:BOX]
vig = 1 - 0.55 * (((xx - BOX / 2) ** 2 + (yy - BOX / 2) ** 2) / (BOX * 0.72) ** 2)
vig = np.clip(vig, 0.25, 1)[..., None]
CAP = 'queries. models. late nights.'
capf = serif(30)

def post(im, t_local, seed):
    z = 1.0 + 0.07 * t_local  # slow push-in
    s = int(BOX / z); o = (BOX - s) // 2
    im = im.crop((o, o, o + s, o + s)).resize((BOX, BOX), Image.BICUBIC)
    bloom = im.filter(ImageFilter.GaussianBlur(10))
    a = np.asarray(im, np.float32) + 0.55 * np.asarray(bloom, np.float32)
    a = a * vig * 0.92
    a += np.random.default_rng(seed).normal(0, 7, a.shape[:2])[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

os.makedirs(OUT, exist_ok=True)
SH = Image.new('L', (W, H), 0); _d = ImageDraw.Draw(SH); _w = _d.textlength(CAP, font=capf)
_d.text(((W - _w) / 2, H / 2 - 18), CAP, font=capf, fill=255, stroke_width=6, stroke_fill=255)
SH = SH.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.85))
SH = Image.merge('RGBA', [Image.new('L', (W, H), 0)] * 3 + [SH])
N = int(DUR * FPS)
for fi in range(N):
    tt = fi / FPS
    si = next(i for i, (a, b) in enumerate(segs) if a <= tt < b) if tt < segs[-1][1] else len(segs) - 1
    a, b = segs[si]; tl = (tt - a) / (b - a)
    frame = Image.new('RGB', (W, H), (0, 0, 0))
    frame.paste(post(SCENES[si](tl), tl, fi), (0, BY))
    d = ImageDraw.Draw(frame)
    w = d.textlength(CAP, font=capf)
    frame.paste(SH, (0, 0), SH); d = ImageDraw.Draw(frame)
    d.text(((W - w) / 2, H / 2 - 18), CAP, font=capf, fill=(245, 245, 245))
    frame.save(f'{OUT}/f{fi:04d}.png')
print('frames', N, 'shots', len(segs))
