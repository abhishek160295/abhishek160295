"""Soundtrack for the 3D film: ElevenLabs narration + processed villain + synthesized epic score."""
import os, sys, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import oaconvolve, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'film'))
import audio as A                       # reuse the instrument/foley synths from the first film
from audio import pluck, piano, pad, kick, snare, hat, thud, tick, beep, heartbeat, noise_sweep, riser, sparks, glitch, \
    slap, rustle, steps, drone, bp, lp, hp, mid, hz

SR = 48000
TOT = 104.0
N = int(TOT * SR)
rng = np.random.default_rng(5)
MUS, SFX, VOX, AMB = [np.zeros((N, 2), np.float32) for _ in range(4)]


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


# ------------------------------------------------------------------ the exact block-landing times (mirror of the JS rng)
def mulberry32(seed):
    st = [seed & 0xffffffff]

    def r():
        s = (st[0] + 0x6D2B79F5) & 0xffffffff
        st[0] = s
        t = ((s ^ (s >> 15)) * (1 | s)) & 0xffffffff
        t = (t + (((t ^ (t >> 7)) * (61 | t)) & 0xffffffff)) & 0xffffffff ^ t
        return ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
    return r


rB = mulberry32(21)
LAND = []
for i in range(40):
    v = [rB() for _ in range(12)]
    LAND.append(30.4 + i * 0.36 + v[6] * 0.12 + 0.55)

# ------------------------------------------------------------------ narration (ElevenLabs take A, split on its silences)
sr, nar = wavfile.read(os.path.join(HERE, 'audio', 'narr_a.wav'))
nar = nar.astype(np.float32) / 32768
if sr != SR:
    nar = resample_poly(nar, SR, sr).astype(np.float32)
SEGS = [(0.0, 4.95, 2.0), (6.5, 9.27, 11.3), (10.3, 13.05, 15.1), (14.8, 22.07, 38.6), (23.86, 25.59, 48.0),
        (26.6, 29.23, 51.0), (30.4, 32.61, 56.4), (34.06, 41.27, 66.0), (43.58, 46.37, 86.4), (47.39, 50.16, 90.8)]
for a, b, at in SEGS:
    x = nar[max(0, int((a - 0.08) * SR)):int((b + 0.12) * SR)].copy()
    f = np.minimum(1, np.minimum(np.arange(len(x)) / (0.03 * SR), (len(x) - np.arange(len(x))) / (0.06 * SR)))
    x *= f
    add(VOX, at - 0.08, x, 1.0)
# presence + gentle compression + a little room
v = VOX[:, 0].copy()
v = v + 0.25 * hp(v, 2500, 2)
env = np.abs(lp(np.abs(v), 8, 2)) + 1e-4
g = np.minimum(1.0, (0.12 / env) ** 0.35)
v = v * g
ir_n = int(1.2 * SR)
ir = rng.normal(0, 1, ir_n) * np.exp(-np.arange(ir_n) / SR * 5.5)
ir = lp(ir, 5000, 2)
wet = oaconvolve(v, ir)[:N] / 70
VOX[:] = np.stack([v + wet * 0.8, v + np.roll(wet, 300) * 0.8], -1)


# ------------------------------------------------------------------ villain (espeak, demon-processed)
def villain(text, speed=105):
    layers = []
    for k, ratio in enumerate((1.0, 0.8, 0.62)):
        p = os.path.join(HERE, 'audio', 'vv_%d.wav' % k)
        subprocess.run(['espeak-ng', '-v', 'en-us+m3', '-s', str(int(speed / ratio)), '-p', '25', '-a', '170', '-w', p, text],
                       check=True)
        s, x = wavfile.read(p)
        x = resample_poly(x.astype(np.float64) / 32768, SR, s)
        x = resample_poly(x, int(round(100 / ratio)), 100)
        layers.append(x)
    L = max(len(x) for x in layers)
    m = np.zeros(L)
    for x, gg in zip(layers, (0.35, 0.8, 0.8)):
        m[:len(x)] += x * gg
    e = lp(np.abs(m), 30, 2)
    y = m + bp(rng.normal(0, 1, L), 1500, 6500) * e * 2.2
    y = bp(np.tanh(y * 2.4) * 0.7, 60, 6500)
    irn = int(3.0 * SR)
    ir2 = lp(rng.normal(0, 1, irn) * np.exp(-np.arange(irn) / SR * 2.0), 3000, 2)
    w = oaconvolve(y, ir2)[:L + irn] / 55
    out = np.zeros(L + irn)
    out[:L] += y
    out[:len(w)] += w[:len(out)] * 0.6
    out /= np.abs(out).max() + 1e-9
    return np.stack([out, np.roll(out, 400) * 0.95], -1).astype(np.float32)


for at, txt in ((22.4, 'Five more minutes.'), (31.0, 'Start Monday.'), (35.0, 'You deserve a break.'), (98.6, 'tomorrow?')):
    add(VOX, at, villain(txt), 0.55)

# ------------------------------------------------------------------ act 1: the void of clocks
add(SFX, 0.0, thud(1.2, 32, 3.0), 0.9)
add(AMB, 0.0, drone(11.5, 1.0), 0.10)
for k in range(220):                                   # swarm of ticking clocks, panned
    add(SFX, rng.uniform(0, 10.5), tick(), rng.uniform(0.05, 0.22), rng.uniform(-1, 1))
for k in range(40):                                    # alarms layering up
    t0 = rng.uniform(1.0, 10.0)
    for j in range(3):
        add(SFX, t0 + j * 0.12, beep(), 0.05 + 0.1 * (t0 / 10), rng.uniform(-1, 1))
add(SFX, 8.8, riser(2.2, 0.3), 0.6)
add(SFX, 11.0, noise_sweep(1.2, 5000, 300, 0.3, up=False), 1.0)
# act 2: bedroom
for lt, nn in ((11.4, 'E4'), (12.6, 'C4'), (14.0, 'A3'), (15.6, 'E4')):
    add(MUS, lt, piano(mid(nn), 3.5, 0.5), 0.22)
add(AMB, 11.0, lp(rng.normal(0, 1, (int(8 * SR), 2)), 300) * 0.05, 1.0)
add(SFX, 15.2, drone(4.0, 1.0), 0.12)
# act 3: the monolith
add(SFX, 19.0, lp(rng.normal(0, 1, int(3.2 * SR)), 140) * np.linspace(0.2, 1, int(3.2 * SR)) * 1.6, 1.0)
add(SFX, 21.6, thud(1.3, 30, 3.0), 1.0)
add(AMB, 19.0, drone(11.0, 1.0), 0.18)
add(SFX, 24.6, riser(1.4, 0.35), 0.7)
add(SFX, 26.0, thud(1.4, 28, 3.5), 1.1)
add(SFX, 26.0, slap(1.0), 0.8)
add(SFX, 26.0, noise_sweep(1.6, 6000, 200, 0.6, up=False), 1.0)
add(SFX, 26.05, glitch(0.25, 0.3), 1.0)
# act 4: the tower of excuses
add(AMB, 30.0, drone(17.5, 1.0), 0.22)
for i, tl in enumerate(LAND):
    add(SFX, tl, thud(0.55, 55 + (i % 5) * 6, 0.9), 0.75, ((i % 6) / 2.5 - 1))
    add(SFX, tl, rustle(0.12, 0.5), 0.5, ((i % 6) / 2.5 - 1))
for k in range(12):
    add(SFX, 38.0 + k * 0.75, heartbeat(), 0.35 + 0.03 * k)
add(MUS, 30.0, pad([hz(mid('A2')), hz(mid('D#3')), hz(mid('A3'))], 17.0, 0.5, 700), 0.6)
# act 5: buried
for k in range(10):
    add(SFX, 47.2 + k * 0.9, heartbeat(), 0.6)
add(AMB, 47.0, drone(9.0, 1.0), 0.12)
# act 6: ignition + explosion
add(MUS, 56.3, pad([hz(mid('C3')), hz(mid('G3')), hz(mid('E4'))], 3.2, 0.5, 2400), 0.7)
add(SFX, 57.2, riser(2.0, 0.45), 0.9)
add(SFX, 59.2, thud(1.6, 26, 4.0), 1.2)
add(SFX, 59.2, slap(1.0), 1.0)
add(SFX, 59.2, sparks(2.2, 0.5), 1.0)
add(SFX, 59.2, noise_sweep(3.0, 7000, 150, 0.7, up=False), 1.0)
for k in range(30):
    add(SFX, 59.4 + rng.uniform(0, 3.5), thud(0.25, 80 + rng.uniform(0, 60), 0.4), 0.4, rng.uniform(-1, 1))
# act 7: the climb (war drums + theme)
BAR = 2.0
PROG = [('A2', ['A3', 'C4', 'E4']), ('F2', ['F3', 'A3', 'C4']), ('C3', ['C4', 'E4', 'G4']), ('G2', ['G3', 'B3', 'D4'])]
MEL = [['E5', None, 'A5', 'G5'], ['F5', None, 'E5', 'C5'], ['G5', None, 'E5', 'C5'], ['D5', 'B4', 'G5', None]]
t = 61.8
k = 0
while t < 84.0:
    bass, ch = PROG[k % 4]
    inten = min(1.0, (t - 61.8) / 10)
    add(MUS, t, pad([hz(mid(n)) for n in ch], BAR + 0.5, 0.5, 1800 + 1800 * inten), 0.55)
    add(MUS, t, pluck(mid(bass), 2.5, 0.4), 0.35)
    for j in range(8):
        tt = t + j * BAR / 8
        add(MUS, tt, pluck(mid(ch[j % 3]) + 12, 1.2, 0.5), 0.07 + 0.05 * inten, 0.4 * ((j % 3) - 1))
        add(SFX, tt, hat(), 0.25 + 0.3 * inten, 0.3)
    for j in (0, 3, 4, 6):                              # taiko-ish pattern
        add(SFX, t + j * BAR / 8, thud(0.6, 60, 0.6), 0.45 + 0.35 * inten)
    add(SFX, t + BAR / 4, snare(), 0.35 * inten)
    add(SFX, t + 3 * BAR / 4, snare(), 0.35 * inten)
    if t > 70:
        for j, nn in enumerate(MEL[k % 4]):
            if nn:
                add(MUS, t + j * BAR / 4, piano(mid(nn), 2.0, 0.6), 0.2)
    t += BAR
    k += 1
add(SFX, 64.5, steps(19.0, 3.0, 0.12, True), 1.0, 0.1)
add(SFX, 82.0, riser(2.2, 0.4), 0.8)
# act 8: summit, triumphant resolve
add(SFX, 84.2, thud(1.0, 40, 3.0), 0.9)
add(MUS, 84.2, pad([hz(mid('C3')), hz(mid('G3')), hz(mid('C4')), hz(mid('E4')), hz(mid('G4'))], 13.0, 0.6, 2600), 0.75)
for j, nn in enumerate(['C3', 'G3', 'C4', 'E4', 'G4', 'C5']):
    add(MUS, 84.2 + j * 0.03, pluck(mid(nn), 6.0, 0.5, 0.998), 0.18)
for lt, nn in ((85.2, 'G5'), (86.2, 'E5'), (87.2, 'C6'), (89.0, 'B5'), (90.8, 'C6')):
    add(MUS, lt, piano(mid(nn), 3.0, 0.55), 0.18)
add(SFX, 85.2, noise_sweep(3.5, 300, 6000, 0.15), 1.0)
# act 9: the sting
add(SFX, 97.35, tick(), 0.8, 0.3)
add(SFX, 97.4, piano(mid('C6'), 0.6, 0.4)[:int(0.3 * SR)], 0.3, 0.3)
sq_n = int(0.35 * SR)
tt = np.arange(sq_n) / SR
squeak = np.sin(2 * np.pi * np.cumsum(900 + 700 * np.sin(tt * 30)) / SR) * np.exp(-tt * 7) * 0.5
add(SFX, 101.2, squeak.astype(np.float32), 0.8, 0.3)
add(SFX, 101.2, thud(0.4, 90, 0.4), 0.6, 0.3)
add(SFX, 101.95, thud(1.0, 38, 2.0), 0.8)
add(MUS, 101.95, pluck(mid('A2'), 2.0, 0.3), 0.3)

# ------------------------------------------------------------------ mix: music/ambience duck under the narrator
irn = int(2.2 * SR)
ir = np.stack([rng.normal(0, 1, irn), rng.normal(0, 1, irn)], -1) * np.exp(-np.arange(irn) / SR * 2.8)[:, None]
ir[:, 0] = lp(ir[:, 0], 4500, 2)
ir[:, 1] = lp(ir[:, 1], 4500, 2)
ir /= 40
mus = MUS + np.stack([oaconvolve(MUS[:, c], ir[:, c])[:N] for c in range(2)], -1) * 0.5
sfx = SFX + np.stack([oaconvolve(SFX[:, c], ir[:, c])[:N] for c in range(2)], -1) * 0.2
venv = np.abs(lp(np.abs(VOX[:, 0]), 4, 2))
duck = 1 - 0.45 * np.clip(venv / (venv.max() * 0.25 + 1e-9), 0, 1)
bed = (mus * 0.85 + sfx + AMB) * duck[:, None]
quiet = np.ones(N, np.float32)                              # comedic silence before the sting
tt = np.arange(N) / SR
quiet[(tt > 97.0) & (tt < 97.3)] = np.linspace(1, 0, int(((tt > 97.0) & (tt < 97.3)).sum()))
mixd = bed * np.where(tt > 97.0, np.where(tt > 97.3, 0.0, quiet), 1.0)[:, None]
mixd[int(97.3 * SR):] = (sfx + mus)[int(97.3 * SR):] * 0.9      # only the sting sounds after the cut
mixd += VOX * 1.6
mixd *= np.clip((TOT - 0.2 - tt) / 0.8, 0, 1)[:, None]
mixd /= np.abs(mixd).max() + 1e-9
mixd *= 0.89
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
wavfile.write(os.path.join(HERE, 'out', 'mix3d.wav'), SR, (mixd * 32767).astype(np.int16))
print('ok', LAND[:3])
