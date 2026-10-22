import json, numpy as np, subprocess, sys
D = sys.argv[1]; SR = 48000
HEAL = f'{D}/../vo'

def load(p, ch=2, af=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-f', 'f32le', '-ar', str(SR), '-ac', '2'] if p.endswith('.f32') else []) + ['-i', p] + (['-af', af] if af else []) + ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, ch).copy()

def movavg(x, k):
    c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1), x, np.zeros(k // 2)]))
    return ((c[k:] - c[:-k]) / k)[:len(x)].astype(np.float32)

def rms(x): return float(np.sqrt((x ** 2).mean()) + 1e-12)

def place(buf, clip, t, g=1.0, fade=0.012):
    i = int(t * SR); clip = clip * g; f = int(fade * SR)
    if i < 0: clip = clip[-i:]; i = 0
    if f > 0 and len(clip) > 2 * f:
        r = np.linspace(0, 1, f)[:, None]; clip[:f] *= r; clip[-f:] *= r[::-1]
    j = min(i + len(clip), len(buf)); buf[i:j] += clip[:j - i]

tl = json.load(open(f'{D}/timeline3.json'))
T = tl[-1]['T1']; n = int((T + 2) * SR)
src = {k: load(f'{D}/vo/{k}.mp3') for k in ['N1', 'N2', 'J', 'W', 'NX', 'WX', 'NB']}
speech = lambda v: v[np.abs(v).max(1) > 0.2 * np.abs(v).max()]
ref = rms(speech(src['N1'])); gain = {k: ref / rms(speech(v)) for k, v in src.items()}

vo = np.zeros((n, 2), np.float32)
for s in tl:
    if 'src' not in s: continue
    clip = src[s['src']][int(max(s['a'] - 0.03, 0) * SR):int((s['b'] + 0.1) * SR)].copy()
    place(vo, clip, s['aT'] - 0.03, gain[s['src']])
vo *= 0.25 / rms(speech(vo))

# ---- score: three recycled cues, re-cut per act ----
SCORE = load(f'{D}/vo/music.mp3')                        # stop-time score (270 s)
EXPL = load(f'{HEAL}/music_abgUEgnwDlJVIyH9muET.mp3')     # curious explainer cue (180 s)
DARK = load(f'{HEAL}/music_jdx8QDaVdXGVOUuxjv8o.mp3')     # storm / mystery cue (240 s)
def fit(raw, s0, s1, dur):
    seg = raw[int(s0 * SR):int(s1 * SR)]; L = len(seg) / SR; f = L / dur
    if 0.86 <= f <= 1.16:
        tmp = f'{D}/vo/_seg.f32'; seg.astype(np.float32).tofile(tmp)
        out = load(tmp, af=f'atempo={f:.4f}')
    elif f > 1.16: out = seg
    else:
        reps = int(np.ceil(dur / L)) + 1; out = np.concatenate([seg] * reps)
    out = out[:int(dur * SR)].copy()
    fi = int(1.2 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]; out[-fi:] *= np.linspace(1, 0, fi)[:, None]
    return out
def first(kind=None, chap=None):
    for s in tl:
        if kind and s.get('kind') == kind: return s
        if chap and s.get('kind') == 'chapter' and s['val'][0] == chap: return s
mus = np.zeros_like(vo)
title = first('title'); ch = {k: first(chap=k)['T0'] for k in range(1, 9)}
acts = [  # (start, end, cue, from, to, level)
    (0.0, title['T0'] + 0.4, SCORE, 192, 236, 1.0),
    (ch[2] - 0.3, ch[4], EXPL, 0, 150, 0.9),
    (ch[4] - 0.3, ch[6], SCORE, 0, 132, 1.0),
    (ch[6] - 0.3, ch[8], SCORE, 132, 232, 1.0),
    (ch[8] - 0.3, T, DARK, 150, 240, 1.0),
]
for a, b, cue, s0, s1, lv in acts:
    place(mus, fit(cue, s0, s1, b - a) * lv, a, fade=0)
mus *= 0.30 * rms(speech(vo)) / rms(mus[mus.any(1)])
env = movavg(np.abs(vo).max(1), int(0.05 * SR))
mus *= movavg(np.where(env > 0.02, 0.42, 1.0).astype(np.float32), int(0.4 * SR))[:, None]

# ---- synthesized SFX ----
sfx = np.zeros_like(vo); rng = np.random.default_rng(7); sr = rms(speech(vo))
def stereo(x): return np.stack([x, x], 1).astype(np.float32)
def tick(t, g):
    k = int(0.03 * SR); e = np.exp(-np.arange(k) / (0.004 * SR))
    place(sfx, stereo((np.sin(2 * np.pi * 3200 * np.arange(k) / SR) * 0.6 + rng.standard_normal(k) * 0.4) * e), t, g, fade=0)
def freeze(t, g):
    k = int(1.4 * SR); tt = np.arange(k) / SR
    sw = rng.standard_normal(k) * np.clip(tt / 1.1, 0, 1) ** 3; sw = sw - movavg(sw, 60)
    th = np.sin(2 * np.pi * (60 - 25 * np.clip(tt - 1.1, 0, 1)) * tt) * np.exp(-np.clip(tt - 1.1, 0, 9) * 9) * (tt > 1.1)
    place(sfx, stereo(sw * 0.35 * (tt < 1.12) + th), t - 1.1, g, fade=0.005)
def whoosh(t, g, rev=False):
    k = int(0.9 * SR); tt = np.arange(k) / SR
    x = rng.standard_normal(k); x = x - movavg(x, 30); env_ = np.sin(np.pi * tt / 0.9) ** 2
    if rev: env_ = np.clip(tt / 0.9, 0, 1) ** 4
    place(sfx, stereo(x * env_), t, g, fade=0.01)
freeze(title['aT'], sr * 3.0)
for k in range(int(title['T1']), int(ch[2])): tick(k + 0.2, sr * (0.9 if k % 2 == 0 else 0.6) * 2.0)
rew = first('card'); whoosh(rew['T0'] - 0.2, sr * 0.9, rev=True)
for k in range(1, 9): whoosh(ch[k] - 0.15, sr * 0.55)
for s in tl:
    if s.get('kind') == 'lines' and s['i'] in (1, 15, 52, 67):
        off = {1: 0.0, 15: 1.5, 52: s['b'] - s['a'] - 0.3, 67: 1.4}[s['i']]; freeze(s['aT'] + off, sr * 2.2)

mix = (vo + mus + sfx)[:int(T * SR)]
mix.astype(np.float32).tofile(f'{D}/mix3.f32')
print('seconds', len(mix) / SR)
