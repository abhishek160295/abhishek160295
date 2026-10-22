"""Original soundtrack + SFX for an Inspired Daily reel (no samples, no copyrighted audio).
Usage: python3 audio.py info.json out.wav seed
Dark phonk-style beat at the reel's BPM: hook energy from 0s, full drop at scene 3, SFX on every cue."""
import json, sys, wave
import numpy as np

SR = 44100
info = json.load(open(sys.argv[1])); out = sys.argv[2]; seed = int(sys.argv[3])
rng = np.random.default_rng(seed)
T = info['total'] + 0.6
N = int(T * SR)
L = np.zeros(N); R = np.zeros(N)
beat = 60 / info['bpm']; s16 = beat / 4
drop = info['starts'][2] if len(info['starts']) > 2 else 0

def fband(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))

def env(n, dec, att=0.002):
    t = np.arange(n) / SR
    return np.minimum(1, t / att) * np.exp(-t / dec)

def put(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)) * 1.41; R[i:j] += s * np.sqrt(0.5 * (1 + pan)) * 1.41

def kick():
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 48 + 120 * np.exp(-t / .03)
    return np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .2)) + rng.normal(0, 1, n) * env(n, .003) * .3

def bass808(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = freq * (1 + 1.0 * np.exp(-t / .04))
    return np.tanh(3.0 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * env(n, .55) * .9

def clap():
    n = int(.3 * SR); x = np.zeros(n); nz = rng.normal(0, 1, n)
    for d in (0, .011, .022): k = int(d * SR); x[k:] += nz[:n - k] * env(n - k, .012 if d < .02 else .12)
    return fband(x, 900, 6000) * .9

def hat(open_=False):
    n = int((.25 if open_ else .06) * SR)
    return fband(rng.normal(0, 1, n), 7000, 16000) * env(n, .08 if open_ else .018) * .35

def cowbell(freq, dur=.32):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.tanh(4 * np.sin(2 * np.pi * freq * t)) + np.tanh(4 * np.sin(2 * np.pi * freq * 1.48 * t))
    return fband(x * env(n, .11), 400, 5000) * .32

def noise_swell(dur, rev=True):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    e = t ** 2.5 if rev else (1 - t) ** 2
    return fband(rng.normal(0, 1, n), 800, 9000) * e * .5

def impact():
    n = int(1.4 * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t / .06)) / SR) * env(n, .45)
    crack = fband(rng.normal(0, 1, n), 200, 8000) * env(n, .07)
    return np.tanh(1.8 * sub) * 1.1 + crack * .6

def pop():
    n = int(.6 * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) * env(n, .18) / (k + 1) for k, f in enumerate((1318, 1975, 2637))) * .35

def tick():
    n = int(.03 * SR); return fband(rng.normal(0, 1, n), 2500, 9000) * env(n, .004) * .8

def riser(dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 200 * (6 ** (t / dur))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .25 + fband(rng.normal(0, 1, n), 1500, 10000) * .3) * (t / dur) ** 2

# key + melody (seeded so every reel sounds different)
roots = [41.2, 43.65, 46.25, 49.0, 51.9, 55.0]
root = roots[seed % len(roots)]
scale = np.array([0, 3, 5, 7, 10, 12, 15])
cb_base = root * 16
mel = rng.choice(len(scale), 16)
rhythm = (rng.random(16) < .55) | (np.arange(16) % 4 == 0)
bass_steps = [0, 6, 10] if seed % 2 else [0, 3, 8, 11]
bass_notes = [0, 0, 7, 5][seed % 4], [0, -2, 3, 0][seed % 4]

bars = int(np.ceil(info['total'] / (beat * 4)))
for b in range(bars):
    t0 = b * beat * 4; full = t0 >= drop - 1e-6
    for st in range(16):
        tt = t0 + st * s16
        if tt >= info['total']: break
        # cowbell lead
        if rhythm[st]:
            put(cowbell(cb_base * 2 ** (scale[mel[st]] / 12)), tt, 1.0 if full else .8, .25 * np.sin(st))
        # hats
        if st % 2 == 0 or (full and rng.random() < .35): put(hat(), tt, .6 if st % 4 == 2 else .4, -.3)
        if full and st == 14 and b % 2: put(hat(True), tt, .8, .3)
        # kick + 808
        if st in ((0, 10) if not full else (0, 7, 10)): put(kick(), tt, .9 if full else .55)
        if st in bass_steps: put(bass808(root * 2 ** (bass_notes[b % 2] / 12), s16 * 5), tt, .85 if full else .45)
        if full and st in (4, 12): put(clap(), tt, .8)

# transitions: whoosh into every scene change
for s in info['starts'][1:]: put(noise_swell(.45), s - .45, .9)
if drop: put(riser(1.6), drop - 1.6, .9)
SFX = {'impact': (impact, 1.0), 'pop': (pop, 1.0), 'whoosh': (lambda: noise_swell(.35, False), 1.0), 'rise': (lambda: riser(1.0), .7)}
for t0, kind in info['cues']:
    if kind == 'tick':
        for k in range(6): put(tick(), t0 + k * beat / 2, .7)
    else:
        fn, g = SFX[kind]; put(fn(), t0, g)

mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix /= np.abs(mix).max() / .97
fade = int(.5 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
