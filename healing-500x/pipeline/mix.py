import json, wave, numpy as np, subprocess, sys
D = sys.argv[1]; SR = 48000

def load(p, ch=2):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, ch).copy()

def movavg(x, k):
    c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1, np.float64), x, np.zeros(k // 2, np.float64)]))
    return ((c[k:] - c[:-k]) / k)[:len(x)].astype(np.float32)

def rms(x): return float(np.sqrt((x ** 2).mean()) + 1e-9)

tl = json.load(open(f'{D}/timeline.json'))
T = tl[-1]['T1']; n = int((T + 1) * SR)
vo = np.zeros((n, 2), np.float32)

N = np.concatenate([load(f'{D}/vo/N1.wav'), load(f'{D}/vo/N2.wav')])
src = {'N': N, 'J': load(f'{D}/vo/J.wav'), 'L': load(f'{D}/vo/L.wav'), 'W': load(f'{D}/vo/W.wav')}
tgt = rms(N[N.any(1)]) * 1.0
gain = {k: (1.0 if k == 'N' else tgt / rms(v[np.abs(v).max(1) > 0.01])) for k, v in src.items()}
gain['L'] *= 0.85

def place(buf, clip, t, g=1.0, fade=0.012):
    i = int(t * SR); clip = clip * g
    f = int(fade * SR)
    if f > 0 and len(clip) > 2 * f:
        r = np.linspace(0, 1, f)[:, None]; clip[:f] *= r; clip[-f:] *= r[::-1]
    j = min(i + len(clip), len(buf)); buf[i:j] += clip[:j - i]

for s in tl:
    a, b = s['a'] - 0.04, s['b'] + 0.12
    clip = src[s['src']][int(max(a, 0) * SR):int(b * SR)].copy()
    place(vo, clip, s['aT'] - 0.04, gain[s['src']])

def at(i, key='aT'): return next(s for s in tl if s['i'] == i)[key]

# ---- music: cue A then cue B ending exactly at the end card ----
A = load(f'{D}/vo/music_abgUEgnwDlJVIyH9muET.wav'); Bm = load(f'{D}/vo/music_jdx8QDaVdXGVOUuxjv8o.wav')
mus = np.zeros_like(vo)
bstart = max(T - len(Bm) / SR + 1.0, at(69, 'T0') - 1.0)
xf = 3.0
a_end = bstart + xf
Aseg = A[:int(a_end * SR)].copy(); fo = int(xf * SR)
Aseg[-fo:] *= np.linspace(1, 0, fo)[:, None]
Aseg[:int(0.5 * SR)] *= np.linspace(0, 1, int(0.5 * SR))[:, None]
mus[:len(Aseg)] += Aseg
Bseg = Bm[:int((T - bstart) * SR)].copy(); fi = int(xf * SR)
Bseg[:fi] *= np.linspace(0, 1, fi)[:, None]
fe = int(2.5 * SR); Bseg[-fe:] *= np.linspace(1, 0, fe)[:, None]
place(mus, Bseg, bstart, 1.0, fade=0)
mus *= 0.30 * rms(vo[vo.any(1)]) / rms(mus)

# duck music under voice (smooth envelope)
env = np.abs(vo).max(1)
win = int(0.05 * SR); env = movavg(env, win)
duck = np.where(env > 0.01, 0.45, 1.0).astype(np.float32)
k = int(0.35 * SR); duck = movavg(duck, k)
mus *= duck[:, None]

# ---- SFX ----
sfx = np.zeros_like(vo)
fx = {k: load(f'{D}/sfx/{k}.wav') for k in ['crack', 'click', 'whoosh', 'ratchet', 'shimmer']}
def hit(name, t, g): place(sfx, fx[name].copy(), t, g)
pk = rms(vo[vo.any(1)])
g = lambda name, x: x * pk / rms(fx[name][np.abs(fx[name]).max(1) > 0.005])
hit('click', at(11) + 0.05, g('click', 0.9)); hit('click', at(60), g('click', 1.0)); hit('click', at(122), g('click', 1.0))
for d in (0, 0.45, 0.9): hit('click', at(131) + d, g('click', 0.9))
hit('crack', at(101), g('crack', 1.3)); hit('crack', at(100) + 1.2, g('crack', 0.8)); hit('crack', at(58), g('crack', 0.8))
hit('ratchet', at(129) + 0.3, g('ratchet', 0.8))
for i in (4, 31, 41, 103, 133, 135): hit('shimmer', at(i), g('shimmer', 0.55))
for i in (16, 27, 44, 55, 69, 74, 144, 159): hit('whoosh', at(i, 'T0') - 0.1, g('whoosh', 0.45))

# synthesized rain bed for the storm sequence
r0, r1 = at(95, 'T0'), at(143, 'T1')
L = int((r1 - r0) * SR); rng = np.random.default_rng(1)
w = rng.standard_normal((L, 2)).astype(np.float32)
b = np.exp(-np.arange(64) / 6.0); b /= b.sum()
rain = np.stack([np.convolve(w[:, c], b, 'same') for c in range(2)], 1)
rain = rain - np.stack([movavg(rain[:, c], 400) for c in range(2)], 1)
fade = np.minimum(np.minimum(np.arange(L) / (2 * SR), (L - np.arange(L)) / (2 * SR)), 1)[:, None]
rain = rain / rms(rain) * pk * 0.10 * fade
place(sfx, rain.astype(np.float32), r0, 1.0, fade=0)

mix = vo + mus + sfx
mix = mix[:int(T * SR)]
mix.astype(np.float32).tofile(f'{D}/mix.f32')
print('mix seconds', len(mix) / SR, 'peak', np.abs(mix).max())
