"""Original score for the reel — synthesised from scratch with numpy.

Reads out/events.json (exported by the renderer) so every impact, the freeze,
the breakthrough and the final alignment land on the exact frame.
Writes out/score.wav (48 kHz, stereo, 15.000 s).
"""
import json, os, wave
import numpy as np

SR = 48000
DUR = 15.0
N = int(SR * DUR)
ROOT = os.path.dirname(os.path.abspath(__file__))
EV = json.load(open(os.path.join(ROOT, "out", "events.json")))
rng = np.random.default_rng(7)
t = np.arange(N) / SR


def env(a, d, length):
    n = int(length * SR)
    x = np.arange(n) / SR
    e = np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
    return e


def place(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(sig), 0] += sig * gain * l * 1.414
    buf[i:i + len(sig), 1] += sig * gain * r * 1.414




def lp_fft(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X /= np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))


def hp_fft(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, len(x))


def smooth(x0, x1, a, b):
    k = np.clip((t - a) / (b - a), 0, 1)
    k = k * k * (3 - 2 * k)
    return x0 + (x1 - x0) * k


mix = np.zeros((N, 2))
F = EV["freeze"]

# ---------------------------------------------------------------- 1. tense drone (0 → freeze)
drone = np.zeros(N)
for f0, g in [(55.0, 0.5), (55.0 * 1.4983, 0.22), (110.3, 0.16), (82.2, 0.12)]:
    ph = 2 * np.pi * f0 * t + 0.3 * np.sin(2 * np.pi * 0.21 * t)
    drone += g * (np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph))
drone *= 0.55 + 0.45 * np.sin(2 * np.pi * 0.5 * t) ** 2          # breathing
drone *= smooth(0, 1, 0.0, 0.25) * smooth(1, 1.35, 3.0, 5.9)
drone[t >= F] = 0
fade = np.clip((F - t) / 0.004, 0, 1)                            # hard cut, click-free
drone *= np.where(t < F, fade, 0)
mix[:, 0] += drone * 0.16
mix[:, 1] += drone * 0.16

# ticking clock — the loop counting itself (accelerates with the attempts)
for i, at in enumerate(EV["launches"]):
    n = int(0.03 * SR)
    x = np.arange(n) / SR
    click = np.sin(2 * np.pi * 2400 * x) * np.exp(-x / 0.004)
    place(mix, click, at, 0.05, pan=-0.3 if i % 2 else 0.3)

# ---------------------------------------------------------------- 2. wall impacts (synced)
for i, at in enumerate(EV["hits"]):
    n = int(0.5 * SR)
    x = np.arange(n) / SR
    pitch = 70 * np.exp(-x / 0.05) + 48
    thump = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-x / 0.12)
    snap = hp_fft(rng.standard_normal(n), 2500) * np.exp(-x / 0.012)
    tone = np.sin(2 * np.pi * (330 + 22 * (i % 4)) * x) * np.exp(-x / 0.08)
    g = 0.42 + 0.25 * min(1, i / 10)
    place(mix, 0.9 * thump + 0.18 * snap + 0.12 * tone, at, g, pan=[0.25, -0.1, -0.25, 0.1][i % 4])

# ---------------------------------------------------------------- 3. riser into the freeze
riser = hp_fft(rng.standard_normal(N), 900)
riser = lp_fft(riser, 6000)
riser *= smooth(0, 1, 3.6, F) ** 2.2
riser[t >= F] = 0
riser *= np.where(t < F, np.clip((F - t) / 0.004, 0, 1), 0)
mix[:, 0] += riser * 0.11
mix[:, 1] += riser * 0.11 * 0.9

# ---------------------------------------------------------------- 4. the freeze — sub thump, then silence
n = int(1.2 * SR)
x = np.arange(n) / SR
sub = np.sin(2 * np.pi * np.cumsum(45 * np.exp(-x / 0.4) + 30) / SR) * np.exp(-x / 0.35)
place(mix, sub, F, 0.55)
tail = lp_fft(rng.standard_normal(n), 400) * np.exp(-x / 0.25) * 0.4
place(mix, tail, F, 0.2)

# ---------------------------------------------------------------- 5. zoom-out — airy reverse swell
z0, z1 = EV["zoom"], EV["breakthrough"]
air = lp_fft(hp_fft(rng.standard_normal(N), 300), 3500)
shape = np.where((t >= z0) & (t < z1 + 0.05), np.clip((t - z0) / (z1 - z0), 0, None) ** 2.5, 0)
shape = np.clip(shape, 0, 1)
mix[:, 0] += air * shape * 0.10
mix[:, 1] += np.roll(air, 211) * shape * 0.10
pad_q = np.zeros(N)
for f0 in [220.0, 329.6]:
    pad_q += np.sin(2 * np.pi * f0 * t + 0.4 * np.sin(2 * np.pi * 4 * t))
mix[:, 0] += pad_q * shape * 0.025
mix[:, 1] += pad_q * shape * 0.025

# ---------------------------------------------------------------- 6. breakthrough — glass bell + shimmer
B = EV["breakthrough"]
n = int(4.0 * SR)
x = np.arange(n) / SR
bell = np.zeros(n)
for ratio, g, d in [(1, 1, 1.6), (2.01, 0.5, 1.1), (2.76, 0.32, 0.8), (5.4, 0.18, 0.4), (8.93, 0.08, 0.25)]:
    bell += g * np.sin(2 * np.pi * 784 * ratio * x) * np.exp(-x / d)
bell *= np.minimum(1, x / 0.002)
place(mix, bell, B, 0.13, pan=0.15)
# sharp crack / tear
crack = hp_fft(rng.standard_normal(int(0.35 * SR)), 1800) * env(0.001, 0.06, 0.35)
place(mix, crack, B, 0.22)
# shimmer that follows the line out
sh = np.zeros(n)
for k, f0 in enumerate([1568, 2349, 3136, 2093]):
    sh += np.sin(2 * np.pi * f0 * x + k) * (0.5 + 0.5 * np.sin(2 * np.pi * (5 + k) * x))
sh *= np.minimum(1, x / 0.2) * np.exp(-x / 1.2)
place(mix, sh, B + 0.05, 0.012, pan=-0.2)

# ---------------------------------------------------------------- 7. escape — whoosh
E0 = EV["escape"]
n = int(1.8 * SR)
x = np.arange(n) / SR
w = rng.standard_normal(n)
w = lp_fft(hp_fft(w, 200), 2500)
we = np.sin(np.pi * np.clip(x / 1.5, 0, 1)) ** 2
place(mix, w * we, E0 + 0.1, 0.16, pan=0.2)

# ---------------------------------------------------------------- 8. resolution — warm major pad
R0 = EV["rings"][0]
chord = [130.81, 196.0, 261.63, 329.63, 392.0, 587.33]          # C major add9, open voicing
pad = np.zeros((N, 2))
for k, f0 in enumerate(chord):
    for det, side in [(-0.25, 0), (0.25, 1)]:
        ph = 2 * np.pi * (f0 + det * (1 + k * 0.3)) * t
        v = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
        pad[:, side] += v / (1 + k * 0.35)
padenv = smooth(0, 1, R0 - 0.3, R0 + 1.6) * smooth(1, 0.0, 14.4, 15.0)
pad *= padenv[:, None] * (0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t))[:, None]
mix += pad * 0.035

# ring births — pentatonic plucks rising with each circle
penta = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66]
for i, at in enumerate(EV["rings"]):
    n = int(1.6 * SR)
    x = np.arange(n) / SR
    p = (np.sin(2 * np.pi * penta[i] * x) + 0.3 * np.sin(4 * np.pi * penta[i] * x)) * env(0.003, 0.45, 1.6)
    place(mix, p, at, 0.07, pan=-0.6 + 1.2 * i / 6)

# ---------------------------------------------------------------- 9. alignment — final chord & low bloom
A = EV["align"]
n = int(DUR * SR - A * SR)
x = np.arange(n) / SR
fin = np.zeros(n)
for f0, g in [(65.41, 0.6), (130.81, 0.5), (261.63, 0.35), (392.0, 0.25), (659.25, 0.16), (1046.5, 0.08)]:
    fin += g * np.sin(2 * np.pi * f0 * x) * np.exp(-x / 2.5)
fin *= np.minimum(1, x / 0.01)
place(mix, fin, A, 0.16)
bell2 = np.zeros(n)
for ratio, g, d in [(1, 1, 2.0), (2.0, 0.4, 1.2), (3.01, 0.2, 0.7)]:
    bell2 += g * np.sin(2 * np.pi * 1046.5 * ratio * x) * np.exp(-x / d)
place(mix, bell2 * np.minimum(1, x / 0.003), A, 0.07, pan=-0.1)

# ---------------------------------------------------------------- reverb (stereo convolution)
ir_len = int(2.6 * SR)
xi = np.arange(ir_len) / SR
irs = []
for s in (1, 2):
    noise = np.random.default_rng(100 + s).standard_normal(ir_len)
    ir = lp_fft(noise, 5000) * np.exp(-xi / 0.55)
    ir[: int(0.012 * SR)] = 0
    irs.append(ir / np.sqrt(np.sum(ir ** 2)))
wet = np.zeros_like(mix)
L = N + ir_len
for c in range(2):
    wet[:, c] = np.fft.irfft(np.fft.rfft(mix[:, c], L) * np.fft.rfft(irs[c], L), L)[:N]
# the freeze is a true drop: duck the reverb wash so silence is silence
duck = 1 - smooth(0, 0.85, F, F + 0.08) + smooth(0, 0.85, EV["zoom"] - 0.2, EV["zoom"] + 0.6)
out = mix + wet * 0.32 * duck[:, None]

# ---------------------------------------------------------------- master
for c in range(2):
    out[:, c] = hp_fft(out[:, c], 28)
peak = np.max(np.abs(out))
out = np.tanh(out / peak * 1.25) / np.tanh(1.25)                  # gentle soft-clip glue
out *= 10 ** (-1.0 / 20)                                         # -1 dBFS ceiling
fi = int(0.01 * SR)
out[:fi] *= np.linspace(0, 1, fi)[:, None]
out[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR))[:, None]

pcm = (out * 32767).astype("<i2")
path = os.path.join(ROOT, "out", "score.wav")
with wave.open(path, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm.tobytes())
print("score ->", path, f"{len(pcm)/SR:.3f}s")
