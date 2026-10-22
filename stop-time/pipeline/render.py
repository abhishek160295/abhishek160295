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
tl = json.load(open(f'{D}/timeline.json'))
T_end = tl[-1]['T1'] if lim is None else min(tl[-1]['T1'], start + lim)

torch.set_num_threads(4)
model = load(f'{P}/models/animev3.pth').to(memory_format=torch.channels_last)

def upscale(fr):
    x = torch.from_numpy(fr).permute(2, 0, 1)[None].float().div(255).contiguous(memory_format=torch.channels_last)
    with torch.inference_mode(), torch.autocast('cpu', dtype=torch.bfloat16):
        y = model(x)
    return y.float().clamp(0, 1).mul(255).round().byte()[0].permute(1, 2, 0).contiguous().numpy()

src_start = max(0.0, min(s['vs'] for s in tl if s['T1'] > start) - 1)
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{src_start:.3f}', '-i', f'{D}/src/src.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                       stdout=subprocess.PIPE, bufsize=640 * 360 * 3 * 4)
idx0 = round(src_start * FPS); cur_i, cur = idx0 - 1, None; up_i, up = None, None
def src_frame(i):
    global cur_i, cur, up_i, up
    while cur_i < i:
        b = dec.stdout.read(640 * 360 * 3)
        if len(b) < 640 * 360 * 3: break
        cur = np.frombuffer(b, np.uint8).reshape(360, 640, 3); cur_i += 1
    if up_i != cur_i: up, up_i = upscale(cur), cur_i
    return up

grade = 'eq=contrast=1.05:saturation=1.10:gamma=0.98,vignette=angle=PI/5:mode=forward'
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-ss', f'{start:.3f}', '-i', f'{D}/mix.m4a', '-map', '0:v', '-map', '1:a', '-vf', grade,
                        '-c:v', 'libx264', '-preset', 'faster', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
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

def map_frame(u, dur):
    im = Image.fromarray(base_map).convert('RGBA')
    d = ImageDraw.Draw(im)
    shown = int(np.clip(u / (dur * 0.6), 0, 1) * len(DOTS))
    for k, (x, y) in enumerate(DOTS[:shown]):
        age = (u - k * dur * 0.6 / len(DOTS)); r = 9 + 22 * math.exp(-age * 4)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 64, 64, 230))
        if age < 0.6: d.ellipse((x - r * 3, y - r * 3, x + r * 3, y + r * 3), outline=(255, 90, 90, int(200 * (1 - age / 0.6))), width=4)
    hx, hy = HOUSE
    if u > dur * 0.62:
        p = min((u - dur * 0.62) / 0.6, 1); pul = 1 + 0.08 * math.sin(u * 6)
        R = (260 - 120 * p) * pul
        d.ellipse((hx - R, hy - R, hx + R, hy + R), outline=(255, 214, 60, 255), width=10)
        d.polygon([(hx - 70, hy + 10), (hx, hy - 60), (hx + 70, hy + 10)], fill=(255, 214, 60, 255))
        d.rectangle((hx - 52, hy + 10, hx + 52, hy + 80), fill=(255, 214, 60, 255))
        glow_text(im, 'YOUR HOUSE', (hx, hy + 160), 64, (255, 214, 60), glow=(255, 180, 40), alpha=p)
    glow_text(im, 'EVERY CAMERA SKIPS THE SAME FRAME', (W // 2, 110), 58, (240, 244, 250), glow=(90, 140, 255))
    glow_text(im, f'{shown} SKIPPED FRAMES LOGGED', (W // 2, 190), 40, (255, 110, 110))
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

MAP = next(s for s in tl if s['i'] == 58); MAP_T0 = MAP['T0'] + 2.4; MAP_T1 = MAP['T1'] + 0.2
LAST = tl[-1]; END_T0 = LAST['aT'] + (LAST['b'] - LAST['a']) - 2.0

k = 0; t0 = time.time(); n0 = int(start * FPS); n1 = int(T_end * FPS)
for n in range(n0, n1):
    Tn = (n + 0.5) / FPS
    while k < len(tl) - 1 and Tn >= tl[k]['T1']: k += 1
    s = tl[k]
    if MAP_T0 <= Tn < MAP_T1:
        fr = map_frame(Tn - MAP_T0, MAP_T1 - MAP_T0)
    else:
        t = min(s['vs'] + (Tn - s['T0']) * s['speed'], s['ve'] - 1.0 / FPS)
        fr = src_frame(int(t * FPS))
        if 171.83 <= t < 178.92: fr = reframe(fr)
        if Tn >= END_T0: fr = end_card(fr, Tn - END_T0)
    enc.stdin.write(np.ascontiguousarray(fr).tobytes())
    if (n - n0) % 240 == 0: print(n - n0, n1 - n0, f'{time.time() - t0:.0f}s', flush=True)
enc.stdin.close(); enc.wait(); dec.kill(); print('done', flush=True)
