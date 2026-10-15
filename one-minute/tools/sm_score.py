"""Original score + full sound design for 'Starting Monday', driven by src/sm/timeline.json."""
import json, sys, wave
import numpy as np

SR, FPS, XF = 32000, 30, 8
root = sys.argv[1]
tl = json.load(open(f"{root}/src/sm/timeline.json"))
starts, f = [], 0
for i, s in enumerate(tl):
    starts.append(f / FPS)
    f += round(s["dur"] * FPS) - XF
TOTAL = (f + XF) / FPS
N = int(TOTAL * SR) + SR * 3
music, fx = np.zeros(N), np.zeros(N)
rng = np.random.default_rng(11)

def T(d):
    return np.arange(int(d * SR)) / SR

def add(buf, at, sig, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += g * sig[: j - i]

def band(x, lo=0, hi=None):
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(fr)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(fr, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (fr / hi) ** 4)
    return np.fft.irfft(X * m, len(x))

def noise(d):
    return rng.standard_normal(int(d * SR))

def norm(x, p=1.0):
    return x / (np.max(np.abs(x)) + 1e-9) * p

def env(d, a=0.005, r=None):
    t = T(d)
    e = np.minimum(1, t / max(a, 1e-4))
    if r:
        e *= np.exp(-t / r)
    return e

def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)

# ───────── SFX library ─────────
def pen(d=0.7):
    t = T(d)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 11 * t) ** 2
    return norm(band(noise(d), 1800, 6000) * am * np.minimum(1, (d - t) * 10)) * 0.22

def scratch():
    d = 0.32
    t = T(d)
    return norm(band(noise(d), 1200, 5000) * np.sin(np.pi * t / d) ** 0.5) * 0.4

def hit():
    t = T(2.0)
    f = 38 + 50 * np.exp(-t * 8)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    return norm(s + 0.2 * band(noise(2.0), 0, 300) * np.exp(-t * 4)) * 0.6

def firework():
    out = np.zeros(int(2.4 * SR))
    t = T(0.5)
    out[: len(t)] += 0.03 * np.sin(2 * np.pi * np.cumsum(900 + 1400 * t) / SR) * (t / 0.5)
    b = band(noise(1.4), 0, 260) * np.exp(-T(1.4) * 3.5)
    out[int(0.5 * SR) : int(0.5 * SR) + len(b)] += norm(b) * 0.35
    for _ in range(40):
        k = int((0.55 + rng.random() * 1.6) * SR)
        c = band(noise(0.012), 2000) * 0.08
        out[k : k + len(c)] += c[: len(out) - k]
    return out * 0.7

def cheer():
    d = 2.0
    t = T(d)
    s = band(noise(d), 400, 2600) * np.sin(np.pi * t / d) * (1 + 0.3 * np.sin(2 * np.pi * 3 * t))
    return norm(s) * 0.12

def click(f=4000, d=0.008, g=0.25):
    return band(noise(d), f) * np.hanning(int(d * SR)) * g * 6

def tap():
    return click(3000, 0.01, 0.12)

def bell(fs, d=0.9, g=0.15):
    t = T(d)
    s = sum(np.sin(2 * np.pi * fq * t) for fq in fs) * np.exp(-t * 5) * np.minimum(1, t * 300)
    return s * g / len(fs)

def ding():
    o = np.zeros(int(1.4 * SR))
    a = bell([1318.5, 2637], 0.9, 0.22)
    b = bell([1760, 3520], 1.0, 0.22)
    o[: len(a)] += a
    o[int(0.12 * SR) : int(0.12 * SR) + len(b)] += b
    return o

def ping():
    return bell([1568, 2349], 0.7, 0.2)

def step(g=0.35):
    d = 0.12
    t = T(d)
    s = band(noise(d), 60, 500) * np.exp(-t * 40) + 0.6 * np.sin(2 * np.pi * 90 * t) * np.exp(-t * 35)
    return norm(s) * g

def door():
    o = np.zeros(int(0.8 * SR))
    th = step(0.5)
    o[: len(th)] += th
    c = click(2500, 0.02, 0.3)
    o[int(0.25 * SR) : int(0.25 * SR) + len(c)] += c
    return o

def metal(fs, d, g):
    t = T(d)
    return sum(np.sin(2 * np.pi * fq * t) * np.exp(-t * (3 + i)) for i, fq in enumerate(fs)) * g / len(fs) * np.minimum(1, t * 800)

def clang():
    m = metal([523, 1187, 2011, 3017, 4210], 1.4, 0.35)
    m[: int(0.05 * SR)] += band(noise(0.05), 2000) * 0.1
    return m

def clank():
    return metal([700, 1630, 2890], 0.45, 0.28)

def voice(f0, d, formants, g=0.18):
    t = T(d)
    saw = 2 * ((f0 * t) % 1) - 1
    s = sum(band(saw, fm * 0.8, fm * 1.2) for fm in formants)
    return norm(s * np.sin(np.pi * t / d) ** 0.7) * g

def strain():
    return voice(110, 0.55, [550, 900], 0.14) + band(noise(0.55), 300, 1500) * 0.03

def laugh():
    o = np.zeros(int(1.2 * SR))
    for k in range(3):
        v = voice(190 - k * 8, 0.16, [750, 1150], 0.16)
        o[int(k * 0.22 * SR) : int(k * 0.22 * SR) + len(v)] += v
    return o

def breath():
    d = 0.8
    t = T(d)
    return norm(band(noise(d), 400, 1800) * np.sin(np.pi * t / d) ** 2) * 0.09

def sigh():
    d = 1.3
    t = T(d)
    return norm(band(noise(d), 200, 1100) * np.sin(np.pi * t / d) * np.exp(-t)) * 0.12

def rustle():
    d = 0.9
    return norm(band(noise(d), 1500, 7000) * (0.4 + rng.random(int(d * SR)) ** 6) * np.hanning(int(d * SR))) * 0.15

def crackle(d, dens, g):
    o = np.zeros(int(d * SR))
    for _ in range(int(d * dens)):
        k = int(rng.random() * (len(o) - 300))
        c = band(noise(0.006), 1500) * (0.4 + rng.random())
        o[k : k + len(c)] += c
    return norm(o) * g

def crunch():
    return crackle(0.35, 220, 0.3)

def crumple():
    return crackle(0.8, 120, 0.25)

def rip():
    d = 0.5
    t = T(d)
    return norm(band(noise(d), 900, 6000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 37 * t))) * np.sin(np.pi * t / d)) * 0.35

def swipe():
    d = 0.28
    t = T(d)
    return norm(band(noise(d), 800, 4000) * np.sin(np.pi * t / d) ** 2) * 0.12

def thunk():
    d = 0.15
    t = T(d)
    return norm(np.sin(2 * np.pi * 180 * t) * np.exp(-t * 40) + band(noise(d), 0, 900) * np.exp(-t * 50)) * 0.3

def heart():
    o = np.zeros(int(0.6 * SR))
    for k, g in ((0, 1), (0.18, 0.7)):
        t = T(0.25)
        s = np.sin(2 * np.pi * 52 * t) * np.exp(-t * 18) * g
        o[int(k * SR) : int(k * SR) + len(s)] += s
    return o * 0.55

def marker():
    d = 1.6
    t = T(d)
    am = (np.sin(2 * np.pi * 6 * t) > -0.2).astype(float)
    return norm(band(noise(d), 2500, 7000) * am * np.hanning(int(d * SR))) * 0.16

def stick():
    return step(0.3)

def slap():
    d = 0.08
    t = T(d)
    return norm(band(noise(d), 200, 3000) * np.exp(-t * 60)) * 0.35

def alarm():
    o = np.zeros(int(1.6 * SR))
    for i in range(3):
        for j in range(2):
            b = bell([1567 + 200 * j], 0.12, 0.25) * np.minimum(1, (0.12 - T(0.12)) * 60)
            k = int((i * 0.45 + j * 0.13) * SR)
            o[k : k + len(b)] += b
    return o

def tick():
    o = np.zeros(int(6 * SR))
    for i in range(12):
        c = click(3500, 0.006, 0.12)
        k = int(i * 0.5 * SR)
        o[k : k + len(c)] += c
    return o

def beep():
    o = np.zeros(int(1.0 * SR))
    for i in range(3):
        b = bell([2093], 0.12, 0.22) * np.minimum(1, (0.12 - T(0.12)) * 60)
        o[int(i * 0.18 * SR) : int(i * 0.18 * SR) + len(b)] += b
    return o

def bclick():
    o = np.zeros(int(1.0 * SR))
    c = click(2500, 0.015, 0.4)
    o[: len(c)] += c
    b = bell([2637, 3951], 0.8, 0.1)
    o[int(0.05 * SR) : int(0.05 * SR) + len(b)] += b
    return o

SFX = dict(pen=pen, scratch=scratch, hit=hit, firework=firework, cheer=cheer, tap=tap, ding=ding, ping=ping, step=step,
           door=door, clang=clang, clank=clank, strain=strain, laugh=laugh, breath=breath, sigh=sigh, rustle=rustle,
           crunch=crunch, crumple=crumple, rip=rip, swipe=swipe, thunk=thunk, heart=heart, marker=marker, stick=stick,
           slap=slap, alarm=alarm, tick=tick, beep=beep, click=bclick)

for st, s in zip(starts, tl):
    end = st + round(s["dur"] * FPS) / FPS
    for name, at in s.get("sfx", []):
        sig = SFX[name]()
        if name == "tick":
            sig = sig[: int((end - st - at) * SR)]
        add(fx, st + at, sig)

# ───────── Music ─────────
def piano(n, dur=2.4, v=0.1):
    t = T(dur)
    fq = hz(n)
    s = sum((0.55 ** k) * np.sin(2 * np.pi * fq * (k + 1) * t * (1 + 0.0006 * k)) for k in range(5))
    return v * s * np.exp(-t * 2.4) * np.minimum(1, t * 250)

def pad(notes, dur, v=0.05):
    t = T(dur)
    s = sum(np.sin(2 * np.pi * (hz(n) + d) * t) for n in notes for d in (-0.2, 0, 0.2))
    return v * s * np.minimum(1, t / 0.9) * np.minimum(1, (dur - t) / 0.9) / len(notes)

def kick(v):
    t = T(0.3)
    return v * np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-t * 32)) / SR) * np.exp(-t * 10)

C, F, G, Am, Dm, E, Em = [48, 52, 55], [53, 57, 60], [55, 59, 62], [57, 60, 64], [50, 53, 57], [52, 56, 59], [52, 55, 59]
PROG = {"warm": [C, G, Am, F], "tense": [Am, F, Am, E], "sad": [Am, Dm, F, E], "shock": [Dm, Dm, Am, Am],
        "hope": [F, C, G, Am], "rise": [C, G, Am, F], "triumph": [F, G, Am, C], "quote": [Am, F, C, G], "gym": [Am, Am, F, G]}

def mood_at(sec):
    m = tl[0]["mood"]
    for st, s in zip(starts, tl):
        if st <= sec:
            m = s["mood"]
    return m

BAR = 3.0
for b in range(int(TOTAL / BAR) + 1):
    t0 = b * BAR
    m = mood_at(t0 + 0.05)
    if m == "silence":
        continue
    ch = PROG[m][b % 4]
    beat = BAR / 4
    pv = dict(quote=0.06, tense=0.05, sad=0.06, warm=0.045, hope=0.05, rise=0.055, triumph=0.07, shock=0.07, gym=0.02)[m]
    add(music, t0, pad([ch[0] - 12] + ch, BAR + 0.9, pv))
    if m == "gym":
        for i in range(6):
            add(music, t0 + i * 0.5, kick(0.28))
            add(music, t0 + i * 0.5 + 0.25, band(noise(0.04), 6000) * np.exp(-T(0.04) * 80) * 0.05)
            add(music, t0 + i * 0.5, band(np.sign(np.sin(2 * np.pi * hz(ch[0] - 12) * T(0.45))), 0, 400) * 0.07 * np.exp(-T(0.45) * 4))
        continue
    if m == "quote":
        add(music, t0, piano(ch[0] + 12, 3.4, 0.07))
        continue
    if m == "shock":
        add(music, t0, piano(ch[0], 3.2, 0.1))
        continue
    if m in ("tense", "sad"):
        for i, n in enumerate([ch[0] + 12, ch[2] + 12] if m == "sad" else [ch[0] + 12]):
            add(music, t0 + i * beat * 2, piano(n, 3, 0.1))
        if m == "tense":
            add(music, t0, kick(0.1))
        continue
    step_ = beat / 2 if m in ("rise", "triumph") else beat
    seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
    k, tt = 0, 0.0
    while tt < BAR - 1e-6:
        add(music, t0 + tt, piano(seq[k % 4] + (12 if m == "triumph" and k % 8 >= 4 else 0), 2.2, 0.09))
        k += 1
        tt += step_
    if m in ("rise", "triumph"):
        for i in range(4):
            add(music, t0 + i * beat, kick(0.2 if m == "triumph" else 0.14))
        add(music, t0, piano(ch[0], 3, 0.12))

ir_len = int(2.2 * SR)
ir = rng.standard_normal(ir_len) * np.exp(-T(2.2) * 2.8)
ir[0] = 6.0
L = 1
while L < N + ir_len:
    L *= 2
wet = np.fft.irfft(np.fft.rfft(music, L) * np.fft.rfft(ir, L), L)[:N]
music = 0.65 * music + 0.35 * norm(wet, np.max(np.abs(music)))
fxw = np.fft.irfft(np.fft.rfft(fx, L) * np.fft.rfft(ir * 0.25, L), L)[:N]
fx = fx + 0.12 * norm(fxw, np.max(np.abs(fx)))

mix = norm(music, 0.55) + fx * 1.4
end = int(TOTAL * SR)
mix = mix[:end]
mix[-3 * SR :] *= np.linspace(1, 0, 3 * SR)
mix = np.tanh(mix * 1.1) * 0.92
with wave.open(f"{root}/public/sm-score.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", round(TOTAL, 2), "s", len([e for s in tl for e in s.get("sfx", [])]), "sfx")
