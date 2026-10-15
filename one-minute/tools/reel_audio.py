"""Builds the reel soundtrack: matching slices of the film mix, whooshes on every cut, a hit on the end card."""
import json, subprocess, sys, wave
import numpy as np

SR = 32000
root = sys.argv[1]
segs = json.load(open(f"{root}/src/sm/reel.json"))
frames = json.load(open(f"{root}/tools/sm-frames.json"))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{root}/public/sm-score.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                     capture_output=True, check=True).stdout
film = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
rng = np.random.default_rng(3)

def band(x, lo=0, hi=None):
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(fr)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(fr, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (fr / hi) ** 4)
    return np.fft.irfft(X * m, len(x))

def whoosh():
    d = 0.32
    t = np.arange(int(d * SR)) / SR
    x = band(rng.standard_normal(len(t)), 500, 5000) * np.sin(np.pi * t / d) ** 2
    return x / np.max(np.abs(x)) * 0.22

def hit():
    t = np.arange(int(1.6 * SR)) / SR
    f = 40 + 60 * np.exp(-t * 9)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2) * 0.6

total = sum(round(s["len"] * 30) for s in segs)
out = np.zeros(int(total / 30 * SR) + SR)
pos = 0
for i, s in enumerate(segs):
    n = int(round(s["len"] * 30) / 30 * SR)
    if s.get("end"):
        tail = film[-int(6 * SR):][:n] * 0.9
        out[pos:pos + len(tail)] += tail
        h = hit()
        out[pos:pos + len(h)] += h[: len(out) - pos]
    else:
        a = int((frames[s["id"]][0] / 30 + s["from"]) * SR)
        sl = film[a:a + n].copy()
        fl = int(0.01 * SR)
        sl[:fl] *= np.linspace(0, 1, fl)
        sl[-fl:] *= np.linspace(1, 0, fl)
        out[pos:pos + len(sl)] += sl * 1.15
    if i > 0:
        w = whoosh()
        st = max(0, pos - int(0.16 * SR))
        out[st:st + len(w)] += w
    pos += n
out = out[:pos]
out[-int(0.6 * SR):] *= np.linspace(1, 0.4, int(0.6 * SR))
out = np.tanh(out * 1.2) * 0.92
with wave.open(f"{root}/public/reel-audio.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("ok", round(pos / SR, 2), "s")
