"""Mix a scene's SFX timeline into a stereo track and mux it with the rendered video.

python3 mix.py <out-basename> <sfx_dir>
Event keys: t (start s), s (sound name), g (dB), p (semitones), pan (-1..1),
d (play length s; loops the source if longer), o (source offset s), fi/fo (fades s), duck ([t0, t1] dips everything else).
"""
import sys, json, wave, subprocess, os
import numpy as np

SR = 48000
base, sfx_dir = sys.argv[1], sys.argv[2]
meta = json.load(open(base + ".sfx.json"))
dur = meta["duration"]
cache = {}


def load(name):
    if name not in cache:
        with wave.open(os.path.join(sfx_dir, name + ".wav")) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
        cache[name] = x
    return cache[name]


def pitch(x, semis):
    if not semis:
        return x
    r = 2 ** (semis / 12)
    idx = np.arange(0, len(x) - 1, r)
    return np.interp(idx, np.arange(len(x)), x)


out = np.zeros((int(SR * (dur + 0.5)), 2))
duck = np.ones(len(out))
for e in meta["sfx"]:
    if "duck" in e:
        a, b = (int(v * SR) for v in e["duck"])
        ramp = int(0.05 * SR)
        duck[a:b] = np.minimum(duck[a:b], 0.08)
        duck[max(0, a - ramp):a] = np.minimum(duck[max(0, a - ramp):a], np.linspace(1, 0.08, a - max(0, a - ramp)))
        continue
    x = pitch(load(e["s"]), e.get("p", 0))
    x = x[int(e.get("o", 0) * SR):]
    if "d" in e:
        n = int(e["d"] * SR)
        reps = int(np.ceil(n / len(x)))
        x = np.tile(x, reps)[:n]
    x = x * 10 ** (e.get("g", 0) / 20)
    fi, fo = int(e.get("fi", 0.003) * SR), int(e.get("fo", 0.01) * SR)
    x = x.copy()
    if fi: x[:fi] *= np.linspace(0, 1, min(fi, len(x)))[: len(x[:fi])]
    if fo: x[-fo:] *= np.linspace(1, 0, min(fo, len(x)))[-len(x[-fo:]):]
    pan = e.get("pan", 0)
    lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    i = int(e["t"] * SR)
    j = min(len(out), i + len(x))
    seg = x[: j - i]
    if e.get("noduck"):
        out[i:j, 0] += seg * lg * 1.414 / duck[i:j].clip(0.08)
        out[i:j, 1] += seg * rg * 1.414 / duck[i:j].clip(0.08)
    else:
        out[i:j, 0] += seg * lg * 1.414
        out[i:j, 1] += seg * rg * 1.414
out *= duck[:, None]
out = out[: int(SR * dur)]
peak = np.max(np.abs(out)) or 1
out = out / peak * 0.9
with wave.open(base + ".sfx.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", base + ".video.mp4", "-i", base + ".sfx.wav",
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
                "-shortest", base + ".mp4"], check=True)
print("mixed", base + ".mp4")
