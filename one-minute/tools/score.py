"""Generates the original score + SFX for the film from src/timeline.json."""
import json, sys, wave
import numpy as np

SR = 32000
FPS = 30
root = sys.argv[1]
tl = json.load(open(f"{root}/src/timeline.json"))
starts, t = [], 0.0
for s in tl:
    starts.append(t)
    t += round(s["dur"] * FPS) / FPS
TOTAL = t
N = int(TOTAL * SR) + SR
music = np.zeros(N)
fx = np.zeros(N)
rng = np.random.default_rng(7)

def mood_at(sec):
    m = tl[0]["mood"]
    for st, s in zip(starts, tl):
        if st <= sec:
            m = s["mood"]
    return m

def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)

def add(buf, at, sig):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]

def piano(n, dur=2.5, v=0.2):
    tt = np.arange(int(dur * SR)) / SR
    f = hz(n)
    s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * tt * (1 + 0.0007 * k)) for k in range(5))
    env = np.exp(-tt * 2.6) * np.minimum(1, tt * 200)
    return v * s * env

def pad(notes, dur, v=0.05):
    tt = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(tt)
    for n in notes:
        f = hz(n)
        for d in (-0.15, 0.0, 0.15):
            s += np.sin(2 * np.pi * (f + d) * tt) + 0.3 * np.sin(2 * np.pi * 2 * (f + d) * tt)
    a = np.minimum(1, tt / 0.8) * np.minimum(1, (dur - tt) / 0.8)
    return v * s * a / len(notes)

def kick(v=0.35):
    tt = np.arange(int(0.35 * SR)) / SR
    f = 50 + 90 * np.exp(-tt * 30)
    return v * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)

# chords as midi roots (triads built on top)
C, Dm, Em, F, G, Am, E = [48, 52, 55], [50, 53, 57], [52, 55, 59], [53, 57, 60], [55, 59, 62], [57, 60, 64], [52, 56, 59]
PROG = {
    "warm": [C, G, Am, F],
    "tense": [Am, F, Am, E],
    "sad": [Am, Dm, F, E],
    "hope": [F, C, G, Am],
    "rise": [C, G, Am, F],
    "triumph": [F, G, Am, C],
    "quote": [Am, F, C, G],
}
BAR = 3.0  # 80 bpm, 4 beats
bars = int(TOTAL / BAR) + 1
for b in range(bars):
    t0 = b * BAR
    m = mood_at(t0 + 0.01)
    ch = PROG[m][b % 4]
    beat = BAR / 4
    pv = {"quote": 0.06, "tense": 0.05, "sad": 0.06, "warm": 0.045, "hope": 0.05, "rise": 0.055, "triumph": 0.07}[m]
    add(music, t0, pad([ch[0] - 12] + ch, BAR + 0.8, pv))
    if m == "quote":
        add(music, t0, piano(ch[0] + 12, 3.5, 0.08))
        continue
    if m in ("tense", "sad"):
        notes = [ch[0] + 12, ch[2] + 12] if m == "sad" else [ch[0] + 12]
        for i, n in enumerate(notes):
            add(music, t0 + i * beat * 2, piano(n, 3, 0.11))
        if m == "tense":
            add(music, t0, kick(0.12))
        continue
    step = beat / 2 if m in ("rise", "triumph") else beat
    seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
    k = 0
    tt = 0.0
    while tt < BAR - 1e-6:
        n = seq[k % 4] + (12 if (m == "triumph" and k % 8 >= 4) else 0)
        add(music, t0 + tt, piano(n, 2.2, 0.09 if m == "warm" else 0.1))
        k += 1
        tt += step
    if m in ("rise", "triumph"):
        for i in range(4):
            add(music, t0 + i * beat, kick(0.22 if m == "triumph" else 0.16))
        add(music, t0, piano(ch[0], 3, 0.12))

# Reverb via FFT convolution with a decaying noise tail
ir_len = int(2.4 * SR)
ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / SR * 2.6)
ir[0] = 6.0
L = 1
while L < N + ir_len:
    L *= 2
wet = np.fft.irfft(np.fft.rfft(music, L) * np.fft.rfft(ir, L), L)[:N]
music = 0.65 * music + 0.35 * wet / np.max(np.abs(wet) + 1e-9) * np.max(np.abs(music))

# SFX
def noise(d):
    return rng.standard_normal(int(d * SR))

def lp(x, a=0.05):
    y = np.zeros_like(x)
    acc = 0.0
    # vectorised one-pole via cumulative filtering in blocks
    out = np.empty_like(x)
    for i in range(0, len(x), 4096):
        blk = x[i : i + 4096]
        for j, v in enumerate(blk):
            acc += a * (v - acc)
            out[i + j] = acc
    return out

def beep(f=1800, d=0.09, v=0.12):
    tt = np.arange(int(d * SR)) / SR
    return v * np.sin(2 * np.pi * f * tt) * np.minimum(1, (d - tt) * 80) * np.minimum(1, tt * 400)

rain_bed = None
for st, s in zip(starts, tl):
    sfx = s.get("sfx")
    d = round(s["dur"] * FPS) / FPS
    if sfx == "alarm":
        for i in range(3):
            for j in range(2):
                add(fx, st + 0.15 + i * 0.45 + j * 0.13, beep(1567 + 200 * j, 0.09, 0.06))
    elif sfx == "beep":
        add(fx, st + 0.2, beep(2093, 0.12, 0.08))
    elif sfx == "marker":
        for i in range(int(d * 4)):
            n = noise(0.12) * np.hanning(int(0.12 * SR))
            add(fx, st + 0.3 + i * 0.25, 0.03 * np.diff(n, prepend=0))
    elif sfx == "crumple":
        for i in range(30):
            n = noise(0.04) * np.hanning(int(0.04 * SR))
            add(fx, st + 0.6 + rng.random() * 1.6, 0.05 * np.diff(n, prepend=0))
    elif sfx == "box":
        add(fx, st + 2.0, kick(0.3))
    elif sfx == "keys":
        for k in [0.9, 1.05, 1.2, 1.8, 1.95, 2.1, 2.25, 2.4, 4.6, 4.72, 4.84, 4.96, 5.08, 5.5, 5.65, 5.8, 5.95, 6.1, 6.5]:
            n = noise(0.02) * np.hanning(int(0.02 * SR))
            add(fx, st + k, 0.08 * np.diff(n, prepend=0))
    elif sfx == "rain":
        if rain_bed is None:
            rain_bed = lp(noise(12), 0.18)
            rain_bed /= np.max(np.abs(rain_bed))
        seg = np.resize(rain_bed, int(d * SR)) * 0.09
        fadelen = int(0.3 * SR)
        seg[:fadelen] *= np.linspace(0, 1, fadelen)
        seg[-fadelen:] *= np.linspace(1, 0, fadelen)
        add(fx, st, seg)

mix = music / (np.max(np.abs(music)) + 1e-9) * 0.7 + fx
fade = int(3 * SR)
end = int(TOTAL * SR)
mix = mix[:end]
mix[-fade:] *= np.linspace(1, 0, fade)
mix[: int(0.5 * SR)] *= np.linspace(0, 1, int(0.5 * SR))
mix = np.tanh(mix * 1.1) * 0.9
pcm = (mix * 32767).astype(np.int16)
with wave.open(f"{root}/public/score.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", round(TOTAL, 2), "s")
