"""Original score, synthesised in numpy and driven by the picture.

- Motivation is sonified: its pitch literally follows the yellow curve,
  then dives on the crash and turns into a heart-monitor flatline.
- Discipline is a steady pulse: one soft kick + pluck per day (per bounce).
- The time-lapse year becomes a rising tone that tracks 1.01^day.
- Overtake = impact + bell. Day 365 = final chord.
Reads out/events.json, writes out/score.wav (48 kHz stereo, 15.000 s).
"""
import json, os, wave
import numpy as np

SR, DUR = 48000, 15.0
N = int(SR * DUR)
ROOT = os.path.dirname(os.path.abspath(__file__))
EV = json.load(open(os.path.join(ROOT, "out", "events.json")))
t = np.arange(N) / SR
rng = np.random.default_rng(11)
mix = np.zeros((N, 2))


def filt(x, lo=None, hi=None, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi:
        X /= np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        X /= np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, len(x))


def ss(a, b):
    k = np.clip((t - a) / (b - a), 0, 1)
    return k * k * (3 - 2 * k)


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.414
    mix[i:i + len(sig), 1] += sig * gain * r * 1.414


def frame_curve(key):
    v = np.array([p[key] for p in EV["perFrame"]], float)
    ft = np.arange(len(v)) / EV["fps"]
    return np.interp(t, ft, v)


m = frame_curve("m")
d = frame_curve("d")
x = frame_curve("x")
CR, FL, OV, ST, MG = EV["crash"], EV["flatline"], EV["over"], EV["stop"], EV["merge"]

# ---------------------------------------------------------------- 1. motivation lead (sonified curve)
f_m = 233.0 * 2 ** (np.clip(m, -300, 420) / 300.0)
ph = 2 * np.pi * np.cumsum(f_m) / SR
lead = np.zeros(N)
for h, g in [(1, 1), (2, 0.45), (3, 0.28), (4, 0.15), (5, 0.08)]:
    lead += g * np.sin(h * ph + 0.15 * np.sin(2 * np.pi * 5.2 * t))
lead = filt(lead, hi=2600)
alive = (1 - ss(CR - 0.1, FL)) * ss(0, 0.08)
lead *= alive * (0.75 + 0.25 * np.clip(m / 300, -1, 1))
mix[:, 0] += lead * 0.075
mix[:, 1] += np.roll(lead, 240) * 0.075
# hype shimmer
n = int(1.4 * SR); xx = np.arange(n) / SR
sh = sum(np.sin(2 * np.pi * f * xx + i) for i, f in enumerate([1318.5, 1760, 2637]))
sh *= np.sin(np.pi * np.clip(xx / 1.4, 0, 1)) ** 2
place(sh, EV["hype"] - 0.7, 0.03)
# crash: boom + pitch dive noise
n = int(1.6 * SR); xx = np.arange(n) / SR
boom = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-xx / 0.25) + 32) / SR) * np.exp(-xx / 0.45)
place(boom, CR - 0.05, 0.6)
place(filt(rng.standard_normal(n), lo=200, hi=1800) * np.exp(-xx / 0.3), CR - 0.05, 0.12)
# flatline — heart monitor
flat = np.sin(2 * np.pi * 987.8 * t) * ss(FL, FL + 0.08) * (1 - ss(MG - 0.6, MG + 0.2))
mix += flat[:, None] * 0.045

# ---------------------------------------------------------------- 2. discipline pulse (one per day)
last = -1.0
for i, at in enumerate(EV["landings"]):
    if at > ST + 0.05:
        break
    gap = at - last
    if gap < 0.085:                       # time-lapse: thin the hits, the tone takes over
        continue
    dens = np.clip((0.6 - gap) / 0.5, 0, 1)
    last = at
    n = int(0.4 * SR); xx = np.arange(n) / SR
    kick = np.sin(2 * np.pi * np.cumsum(110 * np.exp(-xx / 0.03) + 48) / SR) * np.exp(-xx / 0.13)
    pl_f = 392.0 * 2 ** (min(1.5, np.log(1.01 ** (i + 1)) / np.log(37.8) * 1.5))
    pluck = (np.sin(2 * np.pi * pl_f * xx) + 0.3 * np.sin(4 * np.pi * pl_f * xx)) * np.exp(-xx / 0.11)
    g = 1 - 0.75 * dens
    place(0.85 * kick * (1 - 0.6 * dens) + 0.22 * pluck, at, 0.42 * g, pan=0.18 if i % 2 else -0.18)

# ---------------------------------------------------------------- 3. compounding tone (rises with 1.01^day)
lvl = np.log(np.maximum(x, 1)) / np.log(37.8)                     # 0 → 1 over the year
f_g = 110 * 2 ** (lvl * 3)
phg = 2 * np.pi * np.cumsum(f_g) / SR
grow = np.zeros(N)
for h, g in [(1, 1), (1.5, 0.5), (2, 0.5), (3, 0.25), (4, 0.18)]:
    grow += g * np.sin(h * phg + h)
grow = filt(grow, hi=3200)
genv = ss(MG - 0.2, MG + 1.6) * (1 - ss(ST - 0.15, ST + 0.1))
mix[:, 0] += grow * genv * 0.06
mix[:, 1] += np.roll(grow, 360) * genv * 0.06
air = filt(rng.standard_normal(N), lo=1500, hi=9000) * (ss(MG + 0.5, OV) * (1 - ss(OV, OV + 0.2)))
mix += air[:, None] * 0.05

# ---------------------------------------------------------------- 4. overtake
n = int(3 * SR); xx = np.arange(n) / SR
hit = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-xx / 0.12) + 40) / SR) * np.exp(-xx / 0.6)
bell = sum(g * np.sin(2 * np.pi * 1174.7 * r * xx) * np.exp(-xx / dd)
           for r, g, dd in [(1, 1, 1.4), (2.0, 0.45, 0.9), (2.76, 0.3, 0.6), (5.4, 0.15, 0.3)])
place(hit, OV, 0.55)
place(bell * np.minimum(1, xx / 0.002), OV, 0.10, pan=0.2)
place(filt(rng.standard_normal(int(0.4 * SR)), lo=2000) * np.exp(-np.arange(int(0.4 * SR)) / SR / 0.05), OV, 0.12)

# ---------------------------------------------------------------- 5. bed + arrival chord
bed = np.zeros(N)
for f0, g in [(55, 0.6), (82.4, 0.3), (110, 0.25)]:
    bed += g * np.sin(2 * np.pi * f0 * t + 0.2 * np.sin(2 * np.pi * 0.3 * t))
bed *= ss(0, 0.3) * (0.7 + 0.3 * ss(MG, OV))
mix += bed[:, None] * 0.06
n = N - int(ST * SR); xx = np.arange(n) / SR
chord = np.zeros(n)
for f0, g in [(55, 0.7), (110, 0.5), (220, 0.35), (277.18, 0.3), (329.63, 0.3), (440, 0.2), (659.26, 0.12)]:
    chord += g * np.sin(2 * np.pi * f0 * xx) * np.exp(-xx / 3)
chord *= np.minimum(1, xx / 0.02)
place(chord, ST, 0.2)
ding = sum(g * np.sin(2 * np.pi * 1760 * r * xx) * np.exp(-xx / dd) for r, g, dd in [(1, 1, 1.8), (2.0, 0.35, 1.0), (3.0, 0.15, 0.5)])
place(ding * np.minimum(1, xx / 0.002), ST, 0.07, pan=-0.15)

# ---------------------------------------------------------------- reverb + master
L = int(2.4 * SR); xi = np.arange(L) / SR
wet = np.zeros_like(mix)
for c in range(2):
    ir = filt(np.random.default_rng(50 + c).standard_normal(L), hi=5500) * np.exp(-xi / 0.5)
    ir[: int(0.015 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    wet[:, c] = np.fft.irfft(np.fft.rfft(mix[:, c], N + L) * np.fft.rfft(ir, N + L), N + L)[:N]
out = mix + 0.28 * wet
for c in range(2):
    out[:, c] = filt(out[:, c], lo=28)
out = np.tanh(out / np.max(np.abs(out)) * 1.3) / np.tanh(1.3) * 10 ** (-1 / 20)
out[: int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))[:, None]
out[-int(0.35 * SR):] *= np.linspace(1, 0, int(0.35 * SR))[:, None]
pcm = (out * 32767).astype("<i2")
with wave.open(os.path.join(ROOT, "out", "score.wav"), "wb") as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(pcm.tobytes())
print(f"score -> out/score.wav {len(pcm) / SR:.3f}s")
