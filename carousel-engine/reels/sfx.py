"""Original sound for learning reels, synthesised in code (no samples, nothing copyrighted).

A quiet marimba-style music bed plus effects locked to the reel timeline:
compare = two notes pitched by the two values (bigger = higher), swap = spring jump + landing thud + stamp pop,
keep = soft tick, locked-in = bell, value change = bloop, intro = whoosh + pop, ending = the final list played
as a melody, confetti sparkle and typing clicks.
"""
import wave
import numpy as np

SR = 44100
PENTA = [0, 2, 4, 7, 9]  # major pentatonic: every pair of notes sounds fine together


def _t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, a=0.004, d=0.25):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def tone(freq, sec, d=0.25, harm=((1, 1.0),), a=0.004):
    t = _t(sec)
    w = sum(amp * np.sin(2 * np.pi * freq * h * t) for h, amp in harm)
    return w * env(len(t), a, d)


def marimba(freq, sec=0.6, d=0.22):
    return tone(freq, sec, d, ((1, 1.0), (4, 0.25), (9.9, 0.06)), a=0.002)


def bell(freq, sec=1.2):
    return tone(freq, sec, 0.45, ((1, 1.0), (2.76, 0.45), (5.4, 0.2)), a=0.001)


def noise(sec, seed=0):
    return np.random.default_rng(seed).uniform(-1, 1, int(SR * sec))


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def sweep(f0, f1, sec, d=0.3):
    t = _t(sec); f = np.geomspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(len(t), 0.003, d)


def thud(sec=0.25):
    t = _t(sec); f = np.geomspace(140, 55, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07)


def whoosh(sec=1.0, rise=True, seed=1):
    n = noise(sec, seed); t = _t(sec)
    shape = (t / sec) ** 2 if rise else np.exp(-t / 0.2)
    hp = n - lowpass(n, 900)
    return hp * shape * 0.6


def click(seed):
    n = noise(0.012, seed); return (n - lowpass(n, 2500)) * env(len(n), 0.0005, 0.004)


def note_freq(rank, base=392.0):  # G4 upward on the pentatonic scale
    octave, step = divmod(rank, len(PENTA))
    return base * 2 ** ((PENTA[step] + 12 * octave) / 12)


def music_bed(total, bpm=100, seed=3):
    """Soft I-V-vi-IV loop: bass on the beat, marimba arpeggio on eighths, shaker off-beats."""
    out = np.zeros(int(SR * (total + 1)))
    beat = 60 / bpm
    prog = [(261.63, [0, 4, 7, 12]), (196.00, [0, 4, 7, 12]), (220.00, [0, 3, 7, 12]), (174.61, [0, 4, 7, 12])]
    t, k = 0.0, 0
    while t < total:
        root, chord = prog[(k // 4) % 4]
        i = int(t * SR)
        b = tone(root / 2, beat * 0.95, 0.35, ((1, 1.0), (2, 0.3)), a=0.01) * 0.55
        out[i:i + len(b)] += b[: len(out) - i]
        for e in range(2):  # eighth-note arpeggio
            j = int((t + e * beat / 2) * SR)
            f = root * 2 ** (chord[(k * 2 + e) % 4] / 12)
            m = marimba(f, 0.5, 0.18) * 0.28
            out[j:j + len(m)] += m[: max(0, len(out) - j)]
        s = int((t + beat / 2) * SR)
        sh = (lambda n: (n - lowpass(n, 5000)) * env(len(n), 0.002, 0.03))(noise(0.08, seed + k)) * 0.18
        out[s:s + len(sh)] += sh[: max(0, len(out) - s)]
        t += beat; k += 1
    fade = int(SR * 1.2)
    out[int(total * SR) - fade:int(total * SR)] *= np.linspace(1, 0, fade)
    out[int(total * SR):] = 0
    return out


def build(tl, intro, out_wav):
    total = tl["total"]
    track = np.zeros(int(SR * (total + 1)))

    def put(sig, at, gain=1.0):
        i = int(at * SR)
        if i >= len(track) or i < 0: return
        n = min(len(sig), len(track) - i)
        track[i:i + n] += sig[:n] * gain

    vals = sorted({v for s in tl["segs"] for v in (s["list"] or []) if isinstance(v, (int, float))} | set(x for x in tl["final"] if isinstance(x, (int, float))))
    rank = {v: k for k, v in enumerate(vals)}
    f = lambda v: note_freq(min(rank.get(v, 0), 14))

    # intro: whoosh up into the title, pop as it lands
    put(whoosh(1.0), 0.0, 0.5)
    put(sweep(500, 1400, 0.12, 0.08), 0.9, 0.35)
    put(bell(1046.5, 1.0), 1.0, 0.18)
    prev_done = set()
    for k, s in enumerate(tl["segs"]):
        t0, dur = s["t0"], s["dur"]
        c = s.get("cmp")
        if c and "a" in c:
            put(marimba(f(c["a"]), 0.35, 0.12), t0, 0.5)
            put(marimba(f(c["b"]), 0.35, 0.12), t0 + min(0.09, dur * 0.3), 0.5)
            if not c["res"]:
                put(click(k) * 3, t0 + dur * 0.6, 0.25)
        elif c and "text" in c:
            put(marimba(880, 0.3, 0.1), t0, 0.35)
        moved = s["move"] and s["order"] != s["next"]
        changed = s["move"] and not moved
        if moved:
            put(sweep(260, 900, 0.22, 0.12), t0 + dur * 0.18, 0.45)        # spring jump
            put(thud(), t0 + dur * 0.86, 0.9)                              # landing
            put((lambda n: (n - lowpass(n, 1200)) * env(len(n), 0.001, 0.05))(noise(0.15, k)), t0 + dur * 0.86, 0.35)  # dust
            put(sweep(700, 1500, 0.08, 0.05), t0 + dur * 0.12, 0.3)        # stamp pop
        if changed:
            put(sweep(300, 760, 0.25, 0.14), t0 + dur * 0.45, 0.45)        # bloop: a value grew
        done = set(s.get("done", []))
        if done - prev_done and k > 0:
            put(bell(1567.98), t0 + 0.05, 0.22)
        prev_done = done
        if not c and not s["move"] and k % 3 == 0:
            put(click(k + 99), t0, 0.12)                                   # quiet tick as code advances
    # ending: final list as a melody, sparkle, typing clicks
    end = tl["end"]
    for j, v in enumerate(tl["final"]):
        put(marimba(f(v), 0.6, 0.25), end + 0.05 + j * 0.11, 0.55)
    put(bell(2093.0, 1.6), end + 0.05 + len(tl["final"]) * 0.11, 0.25)
    for j in range(40):
        put(bell(2400 + (j * 397) % 1800, 0.25) * 0.4, end + 0.1 + j * 0.035, 0.08)
    for j in range(min(len(tl["stdout"]), 60)):
        put(click(500 + j), end + j / 45, 0.2)

    bed = music_bed(total)[: len(track)] * 0.32
    mix = bed + track
    mix[: int(SR * 0.6)] *= np.linspace(0.3, 1, int(SR * 0.6))
    peak = np.max(np.abs(mix)) or 1
    mix = np.tanh(mix / peak * 1.4) * 0.89                                  # gentle limiter
    stereo = np.stack([mix, np.concatenate([mix[40:], np.zeros(40)])], 1)    # tiny width
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(str(out_wav), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    return out_wav
