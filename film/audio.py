"""Soundtrack: Karplus-Strong guitar, additive piano, pads, drone, foley, villain voice.
Every cue is keyed to scene starts from scenes.SCENES."""
import os, subprocess, functools
import numpy as np
from scipy.signal import lfilter, butter, sosfilt, oaconvolve, resample_poly
from scipy.io import wavfile
import scenes as S

SR = 48000
TOT = S.TOTAL + 1.0
N = int(TOT * SR)
rng = np.random.default_rng(42)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')


def T(name, lt):
    """Absolute time of a cue written in the scene's own (original) local time.
    Retimed scenes map through (off, speed); cues outside the played window are dropped (-100)."""
    sc = S.BYNAME[name]
    if sc.retime:
        off, sp = sc.retime
        lt = (lt - off) / sp
        if lt < -0.05 or lt > sc.dur + 0.3:
            return -100.0
    return sc.start + lt


def TC(name, lt):
    """Like T but clamps into the scene window (for beds and drones)."""
    sc = S.BYNAME[name]
    if sc.retime:
        off, sp = sc.retime
        lt = (lt - off) / sp
    return sc.start + clamp(lt, 0.0, sc.dur)


def ST(name):
    return S.BYNAME[name].start


def DUR(name):
    return S.BYNAME[name].dur


def clamp(v, a, b):
    return a if v < a else b if v > b else v


def bus():
    return np.zeros((N, 2), np.float32)


MUS, SFX, DRN, VOX, AMB = bus(), bus(), bus(), bus(), bus()


def add(b, t, x, g=1.0, pan=0.0):
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], -1)
    i = int(t * SR)
    if i >= N or i + len(x) <= 0:
        return
    j = min(N, i + len(x))
    s = max(0, -i)
    b[max(0, i):j] += x[s:j - i] * g


def bp(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x, axis=0)


def lp(x, f, order=4):
    return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x, axis=0)


def hp(x, f, order=4):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x, axis=0)


def env(n, a=0.005, r=0.1):
    e = np.ones(n, np.float32)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def mid(s):
    n = NOTE[s[0]]
    k = 1
    if s[1] == '#':
        n += 1
        k = 2
    elif s[1] == 'b':
        n -= 1
        k = 2
    return 12 * (int(s[k:]) + 1) + n


# ------------------------------------------------------------------ instruments
@functools.lru_cache(None)
def pluck(m, dur=2.5, bright=0.5, decay=0.996):
    f = hz(m)
    n = int(dur * SR)
    P = max(2, int(round(SR / f)))
    ex = np.zeros(n)
    burst = rng.uniform(-1, 1, P)
    burst = lfilter([bright, 1 - bright], [1], burst)
    ex[:P] = burst
    a = np.zeros(P + 2)
    a[0] = 1
    a[P] = -decay / 2
    a[P + 1] = -decay / 2
    y = lfilter([1], a, ex)
    y = lp(y, min(9000, f * 14), 2)
    y *= env(n, 0.002, 0.3)
    return (y / (np.abs(y).max() + 1e-9)).astype(np.float32)


@functools.lru_cache(None)
def piano(m, dur=3.0, vel=0.7):
    f = hz(m)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > 12000:
            break
        y += (1 / k ** 1.3) * np.sin(2 * np.pi * fk * t + k) * np.exp(-t * (0.9 + k * 0.55) * (f / 300) ** 0.3)
    hammer = rng.normal(0, 1, int(0.01 * SR)) * np.linspace(1, 0, int(0.01 * SR)) * 0.2
    y[:len(hammer)] += hammer
    y *= env(n, 0.003, 0.4) * vel
    return (y / (np.abs(y).max() + 1e-9) * vel).astype(np.float32)


def pad(freqs, dur, g=0.2, cutoff=1400):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f in freqs:
        for d in (-0.12, 0.0, 0.13):
            ph = rng.uniform(0, 1)
            y += 2 * ((t * f * (1 + d / 100) + ph) % 1) - 1
    y = lp(y, cutoff, 2) / (len(freqs) * 3)
    e = np.minimum(1, np.minimum(t / min(1.5, dur / 3), (dur - t) / min(1.5, dur / 3)))
    return (y * e * g).astype(np.float32)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)).astype(np.float32)


def snare():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    y = bp(rng.normal(0, 1, n), 1200, 7000) * np.exp(-t * 18) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)
    return (y * 0.7).astype(np.float32)


def hat():
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return (hp(rng.normal(0, 1, n), 7000) * np.exp(-t * 70) * 0.35).astype(np.float32)


def thud(g=1.0, low=48, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = low + 60 * np.exp(-t * 14)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4)
    y += lp(rng.normal(0, 1, n), 300) * np.exp(-t * 22) * 0.6
    return (y * g).astype(np.float32)


def tick():
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 160) + hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 220) * 0.5
    return (y * 0.5).astype(np.float32)


def beep():
    n = int(0.11 * SR)
    t = np.arange(n) / SR
    y = np.sign(np.sin(2 * np.pi * 2050 * t)) * 0.25 * env(n, 0.003, 0.01)
    return lp(y, 6000).astype(np.float32)


def heartbeat():
    def thump(n_, f0):
        t = np.arange(n_) / SR
        return np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 6)) / SR) * np.exp(-t * 14)
    a = thump(int(0.3 * SR), 70)
    b = thump(int(0.35 * SR), 58) * 0.75
    y = np.zeros(int(0.9 * SR))
    y[:len(a)] += a
    o = int(0.24 * SR)
    y[o:o + len(b)] += b
    return lp(y, 200).astype(np.float32)


def noise_sweep(dur, f0, f1, g=0.4, up=True):
    n = int(dur * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    seglen = 2048
    for i in range(0, n, seglen):
        u = i / n
        fc = f0 * (f1 / f0) ** u
        out[i:i + seglen] = bp(x[i:i + seglen + 0], max(40, fc * 0.7), min(SR / 2 - 100, fc * 1.4), 2)[:len(out[i:i + seglen])]
    e = (np.linspace(0, 1, n) ** 2) if up else np.linspace(1, 0, n) ** 1.5
    return (out * e * g).astype(np.float32)


def riser(dur, g=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / dur) ** 2) / SR) * (t / dur) ** 2 * 0.3
    return (noise_sweep(dur, 300, 6000, 0.6) + s * g).astype(np.float32)


def sparks(dur=0.6, g=0.4):
    n = int(dur * SR)
    y = np.zeros(n)
    for k in range(60):
        i = int(rng.uniform(0, 1) ** 1.8 * (n - 400))
        y[i:i + 300] += rng.normal(0, 1, 300) * np.exp(-np.arange(300) / 40) * rng.uniform(0.3, 1)
    y = hp(y, 2500)
    return (y * np.linspace(1, 0.2, n) * g).astype(np.float32)


def glitch(dur=0.35, g=0.4):
    n = int(dur * SR)
    y = np.zeros(n)
    i = 0
    while i < n:
        L = int(rng.uniform(0.01, 0.05) * SR)
        f = rng.uniform(80, 3000)
        tt = np.arange(L) / SR
        y[i:i + L] = (np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + rng.normal(0, 0.4, L))[:len(y[i:i + L])]
        i += L
    y = np.round(y * 6) / 6
    return (y * g * env(n, 0.002, 0.03)).astype(np.float32)


def slap(g=0.8):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    y = bp(rng.normal(0, 1, n), 800, 5000) * np.exp(-t * 60) + 0.6 * np.sin(2 * np.pi * 110 * t) * np.exp(-t * 30)
    return (y * g).astype(np.float32)


def rustle(dur, g=0.3):
    n = int(dur * SR)
    x = bp(rng.normal(0, 1, n), 1500, 8000)
    e = np.abs(lp(rng.normal(0, 1, n), 18)) * 6
    return (x * e * g).astype(np.float32)


def steps(dur, rate=1.7, g=0.25, run=False):
    out = np.zeros(int(dur * SR) + SR)
    k = 0.0
    while k < dur:
        n = int(0.09 * SR)
        t = np.arange(n) / SR
        y = lp(rng.normal(0, 1, n), 900 if not run else 1400) * np.exp(-t * 45) + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 50) * 0.5
        i = int(k * SR)
        out[i:i + n] += y * rng.uniform(0.7, 1)
        k += 1 / (rate * 2)
    return (out * g).astype(np.float32)


def doorbell():
    return (np.concatenate([piano(mid('E5'), 0.7, 0.5)[:int(0.45 * SR)], piano(mid('C5'), 1.6, 0.5)]) * 0.6)


def rain_bed(dur, g=0.18):
    n = int(dur * SR)
    x = rng.normal(0, 1, (n, 2))
    y = bp(x, 400, 9000, 2) * 0.5 + lp(x, 500, 2) * 0.4
    drops = np.zeros((n, 2))
    for k in range(int(dur * 40)):
        i = rng.integers(0, n - 200)
        drops[i:i + 200, rng.integers(0, 2)] += rng.normal(0, 1, 200) * np.exp(-np.arange(200) / 20)
    y = y + hp(drops, 2000) * 0.6
    e = np.minimum(1, np.minimum(np.arange(n) / SR / 0.8, (n - np.arange(n)) / SR / 0.8))[:, None]
    return (y * e * g).astype(np.float32)


def crowd(dur, g=0.12):
    n = int(dur * SR)
    y = np.zeros(n)
    for k in range(6):
        src = rng.normal(0, 1, n)
        f = rng.uniform(300, 900)
        mod = np.abs(lp(rng.normal(0, 1, n), 4)) * 5
        y += bp(src, f, f * 2.2, 2) * mod
    return (y * g * env(n, 0.5, 0.5)).astype(np.float32)


def drone(dur, g=0.4):
    """Dissonant tritone (A1 + D#2) with slow beating: marks the villain."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f, a in ((55.0, 1.0), (77.78, 0.8), (110.3, 0.35), (155.0, 0.3), (233.2, 0.12)):
        y += a * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.13 * t))
    y += 0.15 * bp(rng.normal(0, 1, n), 60, 220, 2)
    y = np.tanh(y * 0.8) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.5 * t))
    return (y * g).astype(np.float32)


# ------------------------------------------------------------------ villain voice
def villain_voice(text):
    tmp = os.path.join(OUT, 'vv_%d.wav')
    layers = []
    base_speed = 118
    for k, ratio in enumerate((1.0, 0.82, 0.66)):
        p = tmp % k
        subprocess.run(['espeak-ng', '-v', 'en-us+m3', '-s', str(int(base_speed / ratio)), '-p', '30', '-a', '180',
                        '-w', p, text], check=True)
        sr, x = wavfile.read(p)
        x = x.astype(np.float64) / 32768
        x = resample_poly(x, SR, sr)                      # to 48k
        up = int(round(100 / ratio))
        x = resample_poly(x, up, 100)                     # slower -> lower pitch
        layers.append(x)
    L = max(len(x) for x in layers)
    mixv = np.zeros(L)
    for x, g in zip(layers, (0.45, 0.8, 0.7)):
        mixv[:len(x)] += x * g
    e = lp(np.abs(mixv), 30, 2)
    whisper = bp(rng.normal(0, 1, L), 1500, 6500) * e * 1.6
    y = mixv + whisper
    y = np.tanh(y * 2.6) * 0.7
    y = bp(y, 70, 7000)
    ir_n = int(3.2 * SR)
    ir = rng.normal(0, 1, ir_n) * np.exp(-np.arange(ir_n) / SR * 2.2)
    ir = lp(ir, 3500, 2)
    ir[0] = 0
    wet = oaconvolve(y, ir)[:L + ir_n] / 60
    out = np.zeros(L + ir_n)
    out[:L] += y
    out[:len(wet)] += wet[:len(out)] * 0.55
    out /= np.abs(out).max() + 1e-9
    st = np.stack([out, np.roll(out, 240) * 0.96], -1)
    return st.astype(np.float32), L / SR


# ------------------------------------------------------------------ music
PROG = [('A2', ['A3', 'C4', 'E4', 'A4']), ('F2', ['F3', 'A3', 'C4', 'F4']), ('C3', ['C4', 'E4', 'G4', 'C5']),
        ('G2', ['G3', 'B3', 'D4', 'G4'])]
MEL = [['A4', None, 'C5', 'E5'], ['F5', 'E5', 'C5', None], ['G4', None, 'C5', 'E5'], ['D5', None, 'B4', 'G4']]


def music(t0, t1, stage, g=1.0, bar=2.0, drums=False, melody=False, strum=False):
    """Fill [t0,t1) with the theme at a given density."""
    t = t0
    k = 0
    while t < t1 - 0.05:
        bass, notes = PROG[k % 4]
        if stage >= 1:
            add(MUS, t, pluck(mid(bass) , 3.0, 0.4), 0.30 * g, -0.1)
        if stage == 0:
            for j, nn in enumerate((notes[0], notes[2])):
                tt = t + j * bar / 2
                if tt < t1:
                    add(MUS, tt, pluck(mid(nn), 2.5, 0.35), 0.16 * g, 0.2 * (j - 0.5))
        elif not strum:
            seq = [notes[0], notes[1], notes[2], notes[3], notes[2], notes[1], notes[2], notes[3]]
            for j, nn in enumerate(seq):
                tt = t + j * bar / 8
                if tt < t1:
                    add(MUS, tt, pluck(mid(nn), 2.0, 0.45), 0.13 * g, 0.3 * ((j % 4) / 3 - 0.5))
        else:
            for beat, dn in ((0, 1), (0.75, -1), (1.0, -1), (1.5, 1)):
                tt = t + beat * bar / 2
                if tt >= t1:
                    continue
                order = notes if dn > 0 else notes[::-1]
                for j, nn in enumerate([bass] + order):
                    add(MUS, tt + j * 0.011, pluck(mid(nn) + (12 if j == 0 else 0), 1.8, 0.55), 0.09 * g, 0.25 * (j / 4 - 0.5))
        if stage >= 2:
            add(MUS, t, pad([hz(mid(n)) for n in notes[:3]], bar + 0.6, 0.5), 0.5 * g)
        if melody:
            for j, nn in enumerate(MEL[k % 4]):
                if nn and t + j * bar / 4 < t1:
                    add(MUS, t + j * bar / 4, piano(mid(nn), 2.2, 0.6), 0.22 * g, 0.15)
        if drums:
            for j in range(8):
                tt = t + j * bar / 8
                if tt >= t1:
                    break
                add(SFX, tt, hat(), 0.5 * g, 0.3)
            add(SFX, t, kick(), 0.6 * g)
            add(SFX, t + bar / 2, snare(), 0.35 * g)
        t += bar
        k += 1


def build():
    os.makedirs(OUT, exist_ok=True)
    # ---------------------------------------------------------- music map
    music(T('01_wall', 2.6), T('02b_promise', 3.4), 0, 0.8)
    music(T('03_snooze', 2.0), ST('05_tuesday'), 0, 0.7)
    music(ST('05_tuesday'), ST('09_night'), 1, 0.65)
    for lt, nn in ((6.8, 'E4'), (7.6, 'C4'), (10.6, 'A3')):
        add(MUS, T('09_night', lt), piano(mid(nn), 3.0, 0.5), 0.25)
    add(MUS, T('10_dawn', 0), pad([hz(mid('A2')), hz(mid('E3')), hz(mid('C4'))], 8.2, 0.4, 900), 0.6)
    for lt, nn in ((1.0, 'E5'), (3.0, 'C5'), (5.0, 'B4')):
        add(MUS, T('10_dawn', lt), piano(mid(nn), 3.0, 0.4), 0.15)
    music(T('12_question', 1.3), T('12_question', 12.0), 1, 0.55)
    add(MUS, T('12_question', 8.1), pad([hz(mid('C3')), hz(mid('G3')), hz(mid('E4'))], 4.5, 0.5), 0.6)
    add(MUS, T('13_cards', 0.0), pad([hz(mid('A2')), hz(mid('E3')), hz(mid('A3'))], 5.6, 0.5, 700), 0.6)
    add(MUS, T('13_cards', 5.6), pad([hz(mid('F2')), hz(mid('C3')), hz(mid('A3'))], 6.6, 0.5, 900), 0.7)
    music(T('14_again', 7.3), T('16_montage', 0.0), 1, 0.85, melody=False)
    add(MUS, T('14_again', 7.3), pad([hz(mid('A2')), hz(mid('E3')), hz(mid('C4'))], 2.8, 0.5), 0.5)
    music(T('16_montage', 0.0), T('16_montage', S.STARTS[17]), 2, 0.9, drums=True, strum=True)
    music(T('16_montage', S.STARTS[17]), T('17_wall', 0.0), 2, 1.0, strum=True, melody=True)
    music(T('17_wall', 0.0), T('18_passon', 0.0), 2, 0.75, melody=True)
    music(T('18_passon', 0.0), T('19_hill', 0.0), 1, 0.7)
    add(MUS, T('18_passon', 0), pad([hz(mid('A2')), hz(mid('C3')), hz(mid('E3'))], 14.0, 0.4, 1000), 0.5)
    music(T('19_hill', 0.0), T('20_title', 0.0), 2, 1.0, strum=True, melody=True)
    for j, nn in enumerate(['C3', 'G3', 'C4', 'E4', 'G4', 'C5']):
        add(MUS, T('20_title', 0.15) + j * 0.03, pluck(mid(nn), 6.0, 0.5, 0.998), 0.16)
    add(MUS, T('20_title', 0.15), pad([hz(mid('C3')), hz(mid('E3')), hz(mid('G3')), hz(mid('C4'))], 6.8, 0.5), 0.6)
    add(MUS, T('20_title', 2.6), piano(mid('E5'), 3.0, 0.6), 0.2)
    add(MUS, T('21_loop', 2.4), pluck(mid('A2'), 2.0, 0.3), 0.25)

    # ---------------------------------------------------------- drone: follows villain presence & size
    pres = [('02_reveal', 0, 3.5, 1.0), ('03_snooze', 1.3, 7.2, 0.5), ('04_research', 0.8, 8.0, 0.5),
            ('05_tuesday', 3.7, 8.9, 0.6), ('06_earned', 0.8, 7.6, 0.5), ('07_draft', 2.2, 7.2, 0.6),
            ('08_plan', 0.4, 5.0, 0.6), ('08_plan', 5.5, 9.9, 0.7), ('09_night', 0.5, 13, 1.0), ('10_dawn', 0, 8, 0.1),
            ('11_shadow', 1.2, 7.4, 0.35), ('11_shadow', 7.3, 10, 0.5), ('12_question', 0, 10.4, 0.35),
            ('14_again', 0.3, 7.3, 0.9), ('14_again', 7.3, 9.2, 0.35), ('16_montage', 0, S.STARTS[17], 0.12),
            ('18_passon', 0.5, 10.3, 0.25)]
    # the villain rising out of a shadow / sinking back in
    rises = [('03_snooze', 1.3), ('04_research', 0.8), ('05_tuesday', 3.7), ('06_earned', 0.8), ('07_draft', 2.2),
             ('08_plan', 0.4), ('08_plan', 5.5), ('09_night', 0.5), ('11_shadow', 1.2), ('11_shadow', 7.3),
             ('14_again', 0.3), ('18_passon', 0.5)]
    sinks = [('03_snooze', 6.6), ('04_research', 7.4), ('05_tuesday', 8.3), ('06_earned', 7.0), ('07_draft', 6.6),
             ('08_plan', 9.3), ('11_shadow', 6.7), ('12_question', 9.6), ('14_again', 8.6), ('18_passon', 9.4)]
    for name, lt in rises:
        add(SFX, T(name, lt) - 0.35, noise_sweep(0.5, 150, 2500, 0.25), 1.0, 0.2)
        add(SFX, T(name, lt) + 0.12, thud(0.35, 45, 1.0), 0.6)
    for name, lt in sinks:
        add(SFX, T(name, lt), noise_sweep(0.6, 2500, 120, 0.2, up=False), 1.0, 0.2)
        add(SFX, T(name, lt) + 0.1, sparks(0.6, 0.12), 1.0, 0.3)
    # transitions
    for sc in S.SCENES:
        tr = S.TRANS.get(sc.name)
        if not tr:
            continue
        kind, d = tr
        if kind == 'whip':
            add(SFX, sc.start - 0.05, noise_sweep(d + 0.15, 400, 7000, 0.45), 1.0, 0.0)
        elif kind == 'zoom':
            add(SFX, sc.start - 0.1, riser(d + 0.1, 0.25), 0.6)
            add(SFX, sc.start + d * 0.5, thud(0.3, 70, 0.4), 0.5)
        elif kind == 'flash':
            add(SFX, sc.start, thud(0.8, 50, 1.2), 0.7)
            add(SFX, sc.start, sparks(0.4, 0.3), 1.0)
        elif kind == 'glitch':
            add(SFX, sc.start, glitch(d, 0.35), 1.0)
    # kinetic type: soft ticks per word, letter drops on the title
    for k in range(7):
        add(SFX, T('13_cards', 0.5 + k * 0.17), tick(), 0.18, 0.0)
    for k in range(10):
        add(SFX, T('20_title', 0.12 + k * 0.05), tick(), 0.2, -0.4 + k * 0.08)
    add(SFX, T('20_title', 2.8), thud(0.6, 55, 1.0), 0.5)
    add(SFX, T('02_reveal', 2.1), tick(), 0.2)
    for name, lt in [('03_snooze', 2.6), ('04_research', 1.6), ('05_tuesday', 4.6), ('06_earned', 1.4), ('07_draft', 2.9),
                     ('08_plan', 6.0)]:
        add(SFX, T(name, lt), slap(0.35), 0.5, 0.0)
    for name, a, b, lvl in pres:
        if lvl <= 0:
            continue
        ta, tb = TC(name, a), TC(name, b)
        if tb - ta < 0.2:
            continue
        d = drone(tb - ta + 0.6, 1.0)
        n = len(d)
        e = np.minimum(1, np.minimum(np.arange(n) / SR / 0.6, (n - np.arange(n)) / SR / 0.6))
        add(DRN, ta, d * e, 0.22 * lvl)

    # ---------------------------------------------------------- HUD ticks from scene tick data
    for sc in S.SCENES:
        for tt in S.tick_times(sc):
            add(SFX, sc.start + tt, tick(), 0.45, -0.6)
    add(SFX, T('03_snooze', 0.15), noise_sweep(0.85, 6000, 400, 0.25, up=False), 1.0, -0.4)
    for k in range(18):
        add(SFX, T('03_snooze', 0.15) + k * 0.047, tick(), 0.25, -0.6)

    # ---------------------------------------------------------- foley per scene
    # hook: slap, rip-back, the 47 slam, the counter landing
    add(SFX, T('01_wall', 0.12), slap(1.0), 0.9, 0.2)
    add(SFX, T('01_wall', 0.12), thud(0.9, 55, 1.2), 0.8)
    add(SFX, T('01_wall', 0.3), noise_sweep(0.7, 6000, 300, 0.4, up=False), 1.0)
    add(SFX, T('01_wall', 0.85), thud(1.1, 38, 2.5), 0.9)
    add(SFX, T('01_wall', 0.85), sparks(0.5, 0.25), 1.0)
    add(SFX, T('01_wall', 2.2), noise_sweep(0.5, 500, 5000, 0.2), 1.0, -0.6)
    add(SFX, T('01_wall', 2.7), tick(), 0.7, -0.6)
    add(SFX, T('01_wall', 1.0), tick(), 0.3, 0.6)
    # villain addresses the viewer
    add(SFX, T('02_reveal', 0.0), thud(1.0, 40, 2.5), 0.7)
    add(SFX, T('02_reveal', 0.8), noise_sweep(0.6, 1500, 6000, 0.12), 1.0, 0.2)
    add(SFX, T('02_reveal', 2.7), noise_sweep(0.8, 1500, 6000, 0.12), 1.0, -0.2)
    add(SFX, T('02_reveal', 2.6), riser(2.2, 0.15), 0.5)
    for k in range(13):
        add(SFX, T('02b_promise', 0.15 + k * 0.1 + (0.0 if k < 7 else 0.1)), tick(), 0.15, 0.0)
    add(SFX, T('02b_promise', 0.45), thud(0.4, 60, 0.8), 0.5)
    for k in range(int(2.6 / 0.25)):
        if k % 4 < 3:
            add(SFX, T('03_snooze', 0.0) + k * 0.25, beep(), 0.5, 0.5)
    add(SFX, T('03_snooze', 2.5), tick(), 0.8, 0.5)
    add(SFX, T('03_snooze', 4.4), noise_sweep(1.6, 400, 4000, 0.15), 1.0)
    for k in range(6):
        add(SFX, T('03_snooze', 6.0) + k * 0.25, beep(), 0.5, 0.5)
    add(SFX, T('03_snooze', 6.1), thud(0.6, 70, 0.6), 0.7)
    add(SFX, T('03_snooze', 6.1), sparks(0.2, 0.0), 0)
    add(SFX, T('04_research', 3.0), noise_sweep(4.0, 300, 3000, 0.08), 1.0)
    add(SFX, T('04_research', 8.7), noise_sweep(0.6, 500, 5000, 0.35), 1.0, 0.6)
    add(AMB, ST('05_tuesday'), rain_bed(DUR('05_tuesday') + 0.3, 0.22), 1.0)
    add(AMB, ST('05_tuesday'), crowd(DUR('05_tuesday'), 0.05), 1.0, 0.6)
    add(SFX, T('05_tuesday', 0), steps(3.4, 1.6, 0.2), 1.0, -0.2)
    add(SFX, T('05_tuesday', 6.4), steps(2.6, 1.4, 0.16), 1.0, -0.4)
    add(SFX, T('05_tuesday', 4.4), thud(0.3, 60, 0.8), 0.4)
    add(AMB, ST('06_earned'), lp(rng.normal(0, 1, int(2.2 * SR)), 120) * 0.08, 1.0, -0.6)
    add(SFX, T('06_earned', 3.2), doorbell(), 0.5, 0.7)
    add(SFX, T('06_earned', 3.6), steps(1.7, 1.8, 0.18), 1.0, 0.3)
    add(SFX, T('06_earned', 4.9), noise_sweep(0.6, 300, 1200, 0.1), 1.0, 0.7)
    for lt in (5.45, 6.3):
        add(SFX, T('07_draft', lt), tick(), 0.6, 0.2)
    add(SFX, T('07_draft', 6.4), noise_sweep(0.5, 4000, 300, 0.2, up=False), 1.0)
    add(SFX, ST('08_plan'), rustle(3.0, 0.05), 1.0, -0.2)
    add(SFX, T('08_plan', 5.0), thud(0.8, 45, 1.5), 0.6)
    add(AMB, T('08_plan', 5.0), lp(rng.normal(0, 1, int(2 * SR)), 2000) * 0.015, 1.0, 0.4)
    add(SFX, T('08_plan', 5.75), noise_sweep(0.6, 1500, 6000, 0.12), 1.0, 0.3)
    # low point
    add(AMB, T('09_night', 0), rain_bed(13.0, 0.18), 1.0)
    for k in range(9):
        add(SFX, T('09_night', 0.2) + k * 0.95 if k < 2 else T('09_night', 6.3) + (k - 2) * 1.0, heartbeat(), 0.55)
    # twist
    add(AMB, T('10_dawn', 0), lp(rng.normal(0, 1, (int(8 * SR), 2)), 600) * 0.03, 1.0)
    add(SFX, T('10_dawn', 0), steps(4.4, 1.3, 0.15), 1.0, -0.3)
    add(SFX, T('11_shadow', 1.5), thud(0.35, 70, 0.6), 0.5, 0.4)
    add(SFX, T('11_shadow', 5.0), rustle(1.2, 0.05), 1.0, 0.4)
    add(SFX, T('11_shadow', 6.6), steps(2.0, 2.6, 0.18, True), 1.0, 0.6)
    add(SFX, T('11_shadow', 7.6), noise_sweep(0.5, 600, 6000, 0.3), 1.0, -0.5)
    add(SFX, T('11_shadow', 8.1), glitch(1.9, 0.18), 1.0, -0.4)
    add(SFX, T('12_question', 0), steps(1.2, 2.6, 0.16, True), 1.0, 0.5)
    for k in range(int(12 / 1.3) + 1):
        add(SFX, T('12_question', k * 1.3), glitch(0.18, 0.15), 1.0, -0.5)
    add(SFX, T('12_question', 9.6), glitch(0.45, 0.35), 1.0, -0.7)
    add(SFX, T('12_question', 10.0), piano(mid('E6'), 2.0, 0.5), 0.15, -0.7)
    add(SFX, T('12_question', 10.8), steps(1.2, 2.6, 0.16, True), 1.0, 0.6)
    # cards
    add(SFX, T('12_question', 9.8), riser(2.2, 0.3), 0.5)
    add(SFX, T('13_cards', 0.5), thud(0.7, 42, 2.0), 0.6)
    add(SFX, T('13_cards', 5.6), thud(1.0, 38, 3.0), 0.8)
    # the turn
    for k in range(int(1.6 / 0.25)):
        if k % 4 < 3:
            add(SFX, T('14_again', 0.0) + k * 0.25, beep(), 0.5, 0.5)
    add(SFX, T('14_again', 1.55), tick(), 0.8, 0.5)
    for k in range(5):
        add(SFX, T('14_again', 5.3) + k * 0.42, heartbeat()[:int(0.3 * SR)], 0.6)
    add(SFX, T('14_again', 6.3), riser(1.0, 0.3), 0.5)
    add(SFX, T('14_again', 7.3), thud(1.0, 50, 1.5), 0.8)
    add(SFX, T('14_again', 7.3), sparks(0.8, 0.5), 1.0, 0.5)
    add(SFX, T('14_again', 7.3), rustle(0.6, 0.15), 1.0)
    add(SFX, T('15_rules', 1.4), thud(0.3, 80, 0.4), 0.6)
    for i in range(28):
        ta = 0.3 + i * 0.1 + (0.25 if i > 8 else 0)
        if i == 8:
            add(SFX, T('15_rules', 3.5 + ta), thud(0.7, 60, 0.6), 0.6)
        else:
            add(SFX, T('15_rules', 3.5 + ta), tick(), 0.25, 0.3)
    # montage
    for i, st in enumerate(S.STARTS):
        t0 = T('16_montage', st)
        add(SFX, t0, kick(), 0.5)
        if S.LINES[i]:
            add(SFX, t0 + 0.05, noise_sweep(0.25, 300, 1800, 0.12), 1.0, 0.3)
            add(SFX, t0 + S.HIT, sparks(0.6, 0.55), 1.0, 0.1)
            add(SFX, t0 + S.HIT, thud(0.25, 90, 0.3), 0.5)
        if i == 5:
            add(SFX, t0 + 0.25, thud(0.9, 55, 0.8), 0.7)
        if i == 6:
            add(SFX, t0 + S.HIT + 0.1, glitch(0.6, 0.3), 1.0, -0.6)
        if i == 2:
            add(AMB, t0, rain_bed(1.0, 0.18), 1.0)
        if i == 4:
            add(AMB, t0, crowd(1.0, 0.1), 1.0)
    add(SFX, T('16_montage', S.STARTS[17] - 0.2), riser(0.6, 0.3), 0.5)
    add(SFX, T('16_montage', S.STARTS[17]), thud(0.8, 45, 2.5), 0.6)
    # payoff
    add(SFX, T('17_wall', 0.9), rustle(2.2, 0.22), 1.0, -0.2)
    add(SFX, T('17_wall', 3.6), rustle(1.5, 0.06), 1.0, 0.3)
    add(SFX, T('17_wall', 5.6), slap(), 0.8, 0.3)
    add(SFX, T('17_wall', 5.6), piano(mid('A5'), 2.5, 0.6), 0.2, 0.3)
    add(AMB, T('18_passon', 0), crowd(14.0, 0.04), 1.0)
    add(SFX, T('18_passon', 2.0), steps(3.4, 1.6, 0.18), 1.0, -0.4)
    add(SFX, T('18_passon', 8.6), rustle(0.3, 0.2), 1.0, 0.3)
    add(SFX, T('18_passon', 9.4), sparks(1.4, 0.25), 1.0, 0.4)
    add(SFX, T('18_passon', 10.7), thud(0.4, 70, 0.4), 0.6, 0.3)
    add(AMB, T('19_hill', 0), lp(rng.normal(0, 1, (int(8 * SR), 2)), 900) * 0.025, 1.0)
    add(SFX, T('20_title', 0.15), thud(0.9, 40, 3.0), 0.6)
    add(SFX, T('20_title', 0.6), noise_sweep(0.7, 800, 7000, 0.25), 1.0)
    add(SFX, T('21_loop', 1.2), glitch(0.55, 0.3), 1.0)

    # ---------------------------------------------------------- villain speaks (exactly twice)
    lines = [('09_night', 2.9, "You're just not built for this."), ('14_again', 2.7, 'Just start Monday.')]
    silence = []
    for name, lt, txt in lines:
        v, dur = villain_voice(txt)
        add(VOX, T(name, lt), v, 0.9)
        silence.append((T(name, lt) - 1.0, T(name, lt), T(name, lt) + dur, T(name, lt) + dur + 1.0))
        print('voice', txt, round(dur, 2))
    silence.append((T('11_shadow', 0.0) - 0.15, T('11_shadow', 0.0), T('11_shadow', 0.0), T('11_shadow', 1.5)))

    # ---------------------------------------------------------- mix
    ir_n = int(2.4 * SR)
    ir = np.stack([rng.normal(0, 1, ir_n), rng.normal(0, 1, ir_n)], -1) * np.exp(-np.arange(ir_n) / SR * 2.6)[:, None]
    ir[:, 0] = lp(ir[:, 0], 4000, 2)
    ir[:, 1] = lp(ir[:, 1], 4000, 2)
    ir /= 40
    mus = MUS + np.stack([oaconvolve(MUS[:, c], ir[:, c])[:N] for c in range(2)], -1) * 0.5
    sfx = SFX + np.stack([oaconvolve(SFX[:, c], ir[:, c])[:N] for c in range(2)], -1) * 0.18
    bed = mus * 0.9 + sfx * 1.0 + DRN * 1.0 + AMB * 1.0
    m = np.ones(N, np.float32)
    tt = np.arange(N) / SR
    for (a, b, c, d) in silence:
        # fade bed out before a, keep silent until d, fade back
        g = np.ones(N, np.float32)
        g[(tt >= a) & (tt < d)] = 0
        fi = (tt >= a - 0.4) & (tt < a)
        g[fi] = 1 - (tt[fi] - (a - 0.4)) / 0.4
        fo = (tt >= d) & (tt < d + 0.6)
        g[fo] = (tt[fo] - d) / 0.6
        m = np.minimum(m, g)
    mixd = bed * m[:, None] + VOX
    fade = np.minimum(1, (TOT - 0.6 - tt) / 0.4).clip(0, 1)
    mixd *= fade[:, None]
    mixd /= np.abs(mixd).max() + 1e-9
    mixd *= 0.89
    p = os.path.join(OUT, 'mix.wav')
    wavfile.write(p, SR, (mixd[:int(S.TOTAL * SR)] * 32767).astype(np.int16))
    print('wrote', p, S.TOTAL)


if __name__ == '__main__':
    build()
