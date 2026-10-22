import json, sys, subprocess, time, math
import numpy as np, torch, cv2
from PIL import Image, ImageDraw, ImageFilter

D, out = sys.argv[1], sys.argv[2]
lim = float(sys.argv[3]) if len(sys.argv) > 3 else None
start = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
P = D.rsplit('/', 1)[0]
sys.path.insert(0, f'{D}/tools'); sys.path.insert(0, P)
from srvgg import load
import patches as G

FPS, W, H = 24, 2560, 1440
tl = json.load(open(f'{D}/timeline3.json'))
T_end = tl[-1]['T1'] if lim is None else min(tl[-1]['T1'], start + lim)

torch.set_num_threads(4)

def upscale(fr):
    up = cv2.resize(np.ascontiguousarray(fr), (W, H), interpolation=cv2.INTER_LANCZOS4)
    blur = cv2.GaussianBlur(up, (0, 0), 2.2)
    return cv2.addWeighted(up, 1.6, blur, -0.6, 0)

class Src:
    def __init__(self): self.p = None; self.i = -10**9; self.fr = None; self.ui = None; self.up = None
    def open(self, i):
        if self.p: self.p.kill()
        t = max(i / FPS - 0.5, 0); self.i = round(t * FPS) - 1
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', f'{D}/src/src.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                                  stdout=subprocess.PIPE, bufsize=640 * 360 * 3 * 4)
    def get(self, i):
        if i < self.i or i > self.i + 72: self.open(i)
        while self.i < i:
            b = self.p.stdout.read(640 * 360 * 3)
            if len(b) < 640 * 360 * 3: break
            self.fr = np.frombuffer(b, np.uint8).reshape(360, 640, 3); self.i += 1
        if self.ui != self.i: self.up, self.ui = upscale(self.fr), self.i
        return self.up
SRC = Src()

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.32 * np.clip(np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) - 0.45, 0, 1) ** 1.6)[..., None].astype(np.float32)
x = np.arange(256) / 255.0
sc = np.clip((x - 0.5) * 1.10 + 0.5, 0, 1)
LUTR = np.clip(sc + 0.05 * np.clip((sc - 0.45) / 0.55, 0, 1) - 0.02 * (1 - sc), 0, 1) * 255
LUTG = np.clip(sc + 0.01, 0, 1) * 255
LUTB = np.clip(sc + 0.06 * (1 - sc) ** 2 - 0.05 * np.clip((sc - 0.5) / 0.5, 0, 1), 0, 1) * 255
LUT3 = np.stack([LUTR, LUTG, LUTB], 1).astype(np.uint8)[:, None, :]
BAR = 96
def grade(fr):
    fr = cv2.LUT(np.ascontiguousarray(fr), LUT3)
    hsv = cv2.cvtColor(fr, cv2.COLOR_RGB2HSV); hsv[..., 1] = cv2.multiply(hsv[..., 1], 1.12)
    fr = (cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB) * VIG).astype(np.uint8)
    fr[:BAR] = 0; fr[-BAR:] = 0
    return fr
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-ss', f'{start:.3f}', '-i', f'{D}/mix3.m4a', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                        '-c:a', 'copy', '-shortest', out], stdin=subprocess.PIPE)

# ---------- graphics ----------
S = W / 1920
def font(px): return G.font(int(px * S))

def reframe(fr):
    # the source shows a channel lower-third here; crop above it
    h = int(H * 0.64); w = int(W * 0.64); x0 = (W - w) // 2
    return cv2.resize(np.ascontiguousarray(fr[0:h, x0:x0 + w]), (W, H), interpolation=cv2.INTER_CUBIC)

rng = np.random.default_rng(11)
HOUSE = (1280, 760)
DOTS = [(HOUSE[0] + rng.normal(0, 1) * r, HOUSE[1] + rng.normal(0, 1) * r * 0.7) for r in np.linspace(620, 90, 46)]
base_map = Image.new('RGB', (W, H), (8, 13, 28)); md = ImageDraw.Draw(base_map)
for k in range(0, W, 96): md.line((k, 0, k, H), fill=(14, 24, 46), width=2)
for k in range(0, H, 96): md.line((0, k, W, k), fill=(14, 24, 46), width=2)
for k in range(9):
    y = 140 + k * 150 + int(rng.integers(-30, 30)); md.line((0, y, W, y + int(rng.integers(-80, 80))), fill=(36, 54, 92), width=int(rng.integers(6, 16)))
    x = 160 + k * 300 + int(rng.integers(-40, 40)); md.line((x, 0, x + int(rng.integers(-120, 120)), H), fill=(36, 54, 92), width=int(rng.integers(6, 16)))
md.line((0, 1150, W, 980), fill=(70, 86, 120), width=26)
base_map = np.array(base_map)

def glow_text(im, s, xy, px, fill, glow=None, anchor='mm', alpha=1.0):
    f = font(px); a = int(255 * alpha)
    if glow:
        g = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).text(xy, s, font=f, fill=glow + (a,), anchor=anchor)
        im.alpha_composite(g.filter(ImageFilter.GaussianBlur(18 * S)))
    ImageDraw.Draw(im).text(xy, s, font=f, fill=fill + (a,), anchor=anchor)

TWIN = [(x + rng.normal(0, 26), y + rng.normal(0, 22)) for x, y in DOTS]
def map_frame(u, dur):
    im = Image.fromarray(base_map).convert('RGBA')
    d = ImageDraw.Draw(im)
    step = dur * 0.55 / len(DOTS)
    shown = int(np.clip(u / (dur * 0.55), 0, 1) * len(DOTS))
    twins = int(np.clip((u - 0.8) / (dur * 0.55), 0, 1) * len(DOTS))
    for k, (x, y) in enumerate(DOTS[:shown]):
        age = u - k * step; r = 9 + 22 * math.exp(-age * 4)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 64, 64, 230))
    for k, (x, y) in enumerate(TWIN[:twins]):
        age = u - 0.8 - k * step; r = 9 + 22 * math.exp(-age * 4)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(80, 170, 255, 230))
        if age < 0.6: d.ellipse((x - r * 3, y - r * 3, x + r * 3, y + r * 3), outline=(110, 190, 255, int(200 * (1 - age / 0.6))), width=4)
    glow_text(im, 'EVERY SKIP HAS A TWIN', (W // 2, 110), 62, (240, 244, 250), glow=(90, 140, 255))
    glow_text(im, f'YOU: {shown}', (W // 2 - int(260 * S), 200), 44, (255, 110, 110))
    glow_text(im, f'SOMEONE ELSE: {twins}', (W // 2 + int(220 * S), 200), 44, (120, 190, 255))
    if u > dur * 0.68:
        p = min((u - dur * 0.68) / 0.5, 1)
        glow_text(im, 'ONE SECOND BEHIND YOU', (W // 2, H - int(140 * S)), 70, (120, 190, 255), glow=(60, 120, 255), alpha=p)
    fade = min(u / 0.35, 1, (dur - u) / 0.35)
    return (np.array(im.convert('RGB')).astype(np.float32) * max(fade, 0)).astype(np.uint8)

def end_card(fr, u):
    a = min(u / 0.6, 1)
    im = Image.fromarray(fr).convert('RGBA')
    sh = np.zeros((H, W, 4), np.uint8); sh[..., :3] = (6, 10, 22); sh[..., 3] = int(170 * a)
    im.alpha_composite(Image.fromarray(sh))
    glow_text(im, 'WHAT WOULD YOU DO?', (W // 2, int(H * 0.36)), 112, (255, 255, 255), glow=(90, 140, 255), alpha=a)
    for k, (label, col) in enumerate((('JOIN', (64, 214, 140)), ('FIGHT', (242, 72, 58)))):
        b = min(max((u - 0.4 - k * 0.25) / 0.4, 0), 1)
        if b <= 0: continue
        cx = W // 2 + (-1 if k == 0 else 1) * int(330 * S); cy = int(H * 0.58)
        w2, h2 = int(250 * S), int(78 * S)
        ImageDraw.Draw(im).rounded_rectangle((cx - w2, cy - h2, cx + w2, cy + h2), h2, fill=col + (int(235 * b),))
        glow_text(im, label, (cx, cy), 84, (255, 255, 255), alpha=b)
    glow_text(im, 'TELL US IN THE COMMENTS', (W // 2, int(H * 0.78)), 52, (210, 220, 235), alpha=a)
    return np.array(im.convert('RGB'))

MAP = next(e for e in tl if e.get('map')); MAP_T0 = MAP['T0'] - 0.2; MAP_T1 = MAP['T1'] + 0.2
OUT = next(e for e in tl if e.get('kind') == 'outro'); END_T0 = OUT['aT'] + (OUT['b'] - OUT['a']) - 2.0

def blur_bg(fr, dark=0.35):
    small = cv2.resize(fr, (W // 8, H // 8)); small = cv2.GaussianBlur(small, (0, 0), 6)
    return (cv2.resize(small, (W, H)) * dark).astype(np.uint8)

def chapter_card(bg, u, num, title, dur):
    im = Image.fromarray(blur_bg(bg)).convert('RGBA'); d = ImageDraw.Draw(im)
    a = min(u / 0.35, 1, (dur - u) / 0.3)
    wipe = min(u / 0.5, 1); L = int(900 * S * wipe)
    d.rectangle((W // 2 - L // 2, H // 2 - 8, W // 2 + L // 2, H // 2 - 2), fill=(255, 196, 61, int(255 * a)))
    glow_text(im, f'CHAPTER {num}', (W // 2, H // 2 - int(70 * S)), 46, (255, 196, 61), alpha=a)
    sc = 1 + 0.04 * (1 - min(u / 0.6, 1))
    glow_text(im, title, (W // 2, H // 2 + int(80 * S)), int(96 * sc), (255, 255, 255), glow=(90, 140, 255), alpha=a)
    return np.array(im.convert('RGB'))

def rewind_card(bg, u, text, dur):
    fr = blur_bg(bg, 0.45)
    # VHS-style rewind streaks
    k = int((u * 37) % 7)
    for j in range(6):
        y = int((j * 233 + u * 900) % H); fr[y:y + 6] = np.clip(fr[y:y + 6].astype(int) + 60, 0, 255)
    im = Image.fromarray(fr).convert('RGBA'); a = min(u / 0.3, 1, (dur - u) / 0.3)
    glow_text(im, '<<  ' + text, (W // 2, H // 2), 104, (255, 255, 255), glow=(255, 80, 80), alpha=a)
    return np.array(im.convert('RGB'))

def title_card(bg, u):
    im = Image.fromarray(blur_bg(bg, 0.25)).convert('RGBA'); d = ImageDraw.Draw(im)
    p = min(u / 0.45, 1); cx, cy = W // 2, H // 2
    for k in range(14):  # frozen-glass cracks
        ang = k * 2 * math.pi / 14 + 0.3; r1 = int(260 * S * p); r2 = int((520 + 140 * (k % 3)) * S * p)
        d.line((cx + r1 * math.cos(ang), cy + r1 * math.sin(ang), cx + r2 * math.cos(ang + 0.05), cy + r2 * math.sin(ang + 0.05)), fill=(170, 220, 255, int(120 * p)), width=3)
    glow_text(im, 'WHAT IF YOU COULD', (cx, cy - int(110 * S)), 70, (230, 236, 245), alpha=p)
    glow_text(im, 'PAUSE TIME?', (cx, cy + int(40 * S)), int(190 * (1.08 - 0.08 * p)), (255, 255, 255), glow=(100, 170, 255), alpha=p)
    return np.array(im.convert('RGB'))

def subtitles(fr, e, Tn):
    words = e.get('words');
    if not words: return fr
    t = Tn - e['aT']
    if t < -0.1 or t > (e['b'] - e['a']) + 0.4: return fr
    # chunks of up to 4 words, breaking after punctuation
    chunks, cur = [], []
    for w, wt in words:
        cur.append((w, wt))
        if len(cur) == 4 or w[-1] in '.?!,': chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    ci = 0
    for k, c in enumerate(chunks):
        if t >= c[0][1] - 0.05: ci = k
    c = chunks[ci]
    im = Image.fromarray(fr).convert('RGBA'); d = ImageDraw.Draw(im); f = font(76)
    toks = [w.upper().strip(',') for w, _ in c]
    widths = [d.textlength(x + ' ', font=f) for x in toks]; total = sum(widths)
    x = W / 2 - total / 2; y = H - BAR - int(130 * S)
    age = t - c[0][1]; pop = 1.0 if age > 0.12 else 0.92 + 0.08 * max(age, 0) / 0.12
    for (w, wt), tok, wd in zip(c, toks, widths):
        active = wt - 0.05 <= t
        col = (255, 214, 60) if (active and (c.index((w, wt)) == len(c) - 1 or t < c[c.index((w, wt)) + 1][1] - 0.05)) else (255, 255, 255)
        d.text((x + 4, y + 6), tok, font=f, fill=(0, 0, 0, 200), anchor='lm', stroke_width=int(10 * S), stroke_fill=(0, 0, 0, 200))
        d.text((x, y), tok, font=f, fill=col + (255,), anchor='lm', stroke_width=int(7 * S), stroke_fill=(10, 12, 20, 255))
        x += wd
    return np.array(im.convert('RGB'))

def next_line(k):
    for e in tl[k + 1:]:
        if 'vs' in e: return e

t0 = time.time(); n0 = int(start * FPS); n1 = int(T_end * FPS); k = 0
for n in range(n0, n1):
    Tn = (n + 0.5) / FPS
    while k < len(tl) - 1 and Tn >= tl[k]['T1']: k += 1
    e = tl[k]
    if e['kind'] in ('chapter', 'card'):
        nl = next_line(k); bg = SRC.get(int(nl['vs'] * FPS))
        u = Tn - e['T0']; dur = e['T1'] - e['T0']
        fr = chapter_card(bg, u, e['val'][0], e['val'][1], dur) if e['kind'] == 'chapter' else rewind_card(bg, u, e['val'][1], dur)
    elif MAP_T0 <= Tn < MAP_T1:
        fr = map_frame(Tn - MAP_T0, MAP_T1 - MAP_T0)
    else:
        t = min(e['vs'] + (Tn - e['T0']) * e['speed'], e['ve'] - 1.0 / FPS)
        fr = SRC.get(int(t * FPS))
        if 171.83 <= t < 178.92: fr = reframe(fr)
        if e['kind'] == 'title': fr = title_card(fr, Tn - e['T0'])
        elif Tn >= END_T0: fr = end_card(fr, Tn - END_T0)
        else: fr = subtitles(fr, e, Tn)
    enc.stdin.write(grade(fr).tobytes())
    if (n - n0) % 240 == 0: print(n - n0, n1 - n0, f'{time.time() - t0:.0f}s', flush=True)
enc.stdin.close(); enc.wait(); print('done', flush=True)
