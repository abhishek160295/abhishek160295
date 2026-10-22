import json, numpy as np, subprocess, sys
D = sys.argv[1]; SR = 48000

def load(p, ch=2, af=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-f', 'f32le', '-ar', str(SR), '-ac', '2'] if p.endswith('.f32') else []) + ['-i', p] + (['-af', af] if af else []) + ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, ch).copy()

def movavg(x, k):
    c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1), x, np.zeros(k // 2)]))
    return ((c[k:] - c[:-k]) / k)[:len(x)].astype(np.float32)

def rms(x): return float(np.sqrt((x ** 2).mean()) + 1e-12)

def place(buf, clip, t, g=1.0, fade=0.012):
    i = int(t * SR); clip = clip * g; f = int(fade * SR)
    if f > 0 and len(clip) > 2 * f:
        r = np.linspace(0, 1, f)[:, None]; clip[:f] *= r; clip[-f:] *= r[::-1]
    j = min(i + len(clip), len(buf)); buf[i:j] += clip[:j - i]

tl = json.load(open(f'{D}/timeline2.json'))
T = tl[-1]['T1']; n = int((T + 2) * SR)
src = {k: load(f'{D}/vo/{k}.mp3') for k in ['N1', 'N2', 'J', 'W', 'NX', 'WX']}
speech = lambda v: v[np.abs(v).max(1) > 0.2 * np.abs(v).max()]
ref = rms(speech(src['N1']))
gain = {k: ref / rms(speech(v)) for k, v in src.items()}

vo = np.zeros((n, 2), np.float32)
for s in tl:
    clip = src[s['src']][int(max(s['a'] - 0.03, 0) * SR):int((s['b'] + 0.1) * SR)].copy()
    place(vo, clip, s['aT'] - 0.03, gain[s['src']])
vo *= 0.25 / rms(speech(vo))

# score: starts on the title line, stretched to land its final hit on the last frame
TT = next(x for x in tl if x.get('title'))['T0']
t_mus = TT - 0.3
L = T - t_mus
raw = load(f'{D}/vo/music.mp3')
xf = int(2.0 * SR); a_, b_ = int(130 * SR), int(90 * SR)      # repeat the quiet 1:30-2:10 section once
r = np.linspace(0, 1, xf)[:, None]
ext = np.concatenate([raw[:a_ - xf], raw[a_ - xf:a_] * (1 - r) + raw[b_:b_ + xf] * r, raw[b_ + xf:]])
ext.astype(np.float32).tofile(f'{D}/vo/music_ext.f32')
mus_clip = load(f'{D}/vo/music_ext.f32', af=f'atempo={len(ext) / SR / L:.4f}')[:int(L * SR)]
fi = int(1.5 * SR); mus_clip[:fi] *= np.linspace(0, 1, fi)[:, None]
mus = np.zeros_like(vo); place(mus, mus_clip, t_mus, fade=0)
mus *= 0.30 * rms(speech(vo)) / rms(mus[int(t_mus * SR):int(T * SR)])
env = movavg(np.abs(vo).max(1), int(0.05 * SR))
duck = movavg(np.where(env > 0.02, 0.42, 1.0).astype(np.float32), int(0.4 * SR))
mus *= duck[:, None]

# synthesized SFX (no extra credits)
sfx = np.zeros_like(vo); rng = np.random.default_rng(7)
def tick(t, g):
    k = int(0.03 * SR); e = np.exp(-np.arange(k) / (0.004 * SR))
    x = (np.sin(2 * np.pi * 3200 * np.arange(k) / SR) * 0.6 + rng.standard_normal(k) * 0.4) * e
    place(sfx, np.stack([x, x], 1).astype(np.float32), t, g, fade=0)
def freeze(t, g):
    k = int(1.4 * SR); tt = np.arange(k) / SR
    swell = rng.standard_normal(k) * np.clip(tt / 1.1, 0, 1) ** 3
    swell = swell - movavg(swell, 60)
    thump = np.sin(2 * np.pi * (60 - 25 * np.clip(tt - 1.1, 0, 1)) * tt) * np.exp(-np.clip(tt - 1.1, 0, 9) * 9) * (tt > 1.1)
    x = swell * 0.35 * (tt < 1.12) + thump
    place(sfx, np.stack([x, x], 1).astype(np.float32), t - 1.1, g, fade=0.005)
sr = rms(speech(vo))
for k in range(int(TT / 1.0)):            # clock under the cold open
    tick(k * 1.0 + 0.2, sr * (0.9 if k % 2 == 0 else 0.6) * 2.2)
for x in tl:                                   # every "time stops" beat
    if 'freeze' not in x: continue
    off = x['freeze']; t = x['aT'] + (off if off >= 0 else x['b'] - x['a'] + off)
    freeze(t, sr * 2.5)

mix = (vo + mus + sfx)[:int(T * SR)]
mix.astype(np.float32).tofile(f'{D}/mix.f32')
print('seconds', len(mix) / SR, 'peak', float(np.abs(mix).max()))
