"""Audio for the 10 s sample: narrator line + score + foley, -14 LUFS."""
import os, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'film'))
from audio import pluck, piano, pad, thud, tick, noise_sweep, rustle, steps, lp, hp, bp, mid, hz
SR = 48000
N = int(10.0 * SR)
mix = np.zeros((N, 2), np.float32)
rng = np.random.default_rng(1)


def add(t, x, g=1.0, pan=0.0):
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], -1)
    i = int(t * SR); j = min(N, i + len(x))
    mix[i:j] += x[:j - i] * g


# narrator (ElevenLabs take, first line)
sr, nar = wavfile.read(os.path.join(HERE, '..', 'film3d', 'audio', 'narr_a.wav'))
nar = nar.astype(np.float32) / 32768
nar = nar[:int(5.0 * sr)]
nar *= np.minimum(1, (len(nar) - np.arange(len(nar))) / (0.05 * sr))
add(0.6, nar, 1.0)
voice = np.abs(mix[:, 0]).copy()

bed = np.zeros((N, 2), np.float32)
def badd(t, x, g=1.0, pan=0.0):
    global mix
    keep = mix.copy(); mix[:] = 0; add(t, x, g, pan); bed[:] += mix; mix[:] = keep

# alarm bell: inharmonic metal partials, trilled
n = int(1.4 * SR); tt = np.arange(n) / SR
bell = sum(a * np.sin(2 * np.pi * f * tt) for f, a in ((2300, 1), (3170, 0.6), (4120, 0.35), (5600, 0.2)))
bell *= (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 16 * tt))) * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
badd(0.75, hp(bell, 1500, 2).astype(np.float32), 0.05, 0.5)
# sleepy pad -> wake
badd(0.0, pad([hz(mid('C3')), hz(mid('G3')), hz(mid('E4'))], 2.3, 0.5, 900), 0.6)
for t0, nn in ((0.1, 'E4'), (0.9, 'G4'), (1.6, 'C5')):
    badd(t0, piano(mid(nn), 2.0, 0.4), 0.10)
# cut 1: paper whoosh + stamp
badd(2.05, noise_sweep(0.25, 600, 6000, 0.25), 1.0)
badd(2.15, thud(0.9, 50, 1.2), 0.55)
badd(2.15, rustle(0.15, 0.5), 0.6)
badd(2.6, noise_sweep(0.45, 3000, 9000, 0.06), 1.0, -0.2)
# cut 2 into the hill: swell + gentle march
badd(3.62, noise_sweep(0.3, 500, 5000, 0.22), 1.0)
badd(3.75, pad([hz(mid('A2')), hz(mid('E3')), hz(mid('C4')), hz(mid('E4'))], 6.3, 0.5, 1800), 0.55)
for k, nn in enumerate(['A4', 'C5', 'E5', 'D5', 'C5', 'E5', 'G5', 'A5']):
    badd(3.8 + k * 0.62, pluck(mid(nn), 1.6, 0.45), 0.10, 0.3 * (k % 3 - 1))
for k in range(6):
    badd(3.8 + k * 1.0, thud(0.25, 70, 0.4), 0.30)
badd(3.75, steps(2.2, 2.0, 0.12), 1.0, -0.3)
badd(7.75, steps(0.7, 2.0, 0.12), 1.0, -0.2)
badd(8.35, thud(1.0, 55, 1.3), 0.6)
badd(8.35, rustle(0.12, 0.5), 0.6)
for k in range(5):                                   # dawn birds
    t0 = 4.5 + k * 0.9 + rng.uniform(0, 0.3)
    n = int(0.12 * SR); tt = np.arange(n) / SR
    chirp = np.sin(2 * np.pi * np.cumsum(3200 + 1600 * np.sin(tt * 60)) / SR) * np.sin(np.pi * tt / tt[-1])
    badd(t0, chirp.astype(np.float32), 0.03, rng.uniform(-0.8, 0.8))
# duck the bed under the voice
env = np.abs(lp(voice, 5, 2))
duck = 1 - 0.5 * np.clip(env / (env.max() * 0.3), 0, 1)
out = mix + bed * duck[:, None]
out *= np.clip((10.0 - np.arange(N) / SR) / 0.4, 0, 1)[:, None]
out /= np.abs(out).max() + 1e-9
wavfile.write(os.path.join(HERE, 'out', 'mix.wav'), SR, (out * 0.89 * 32767).astype(np.int16))
print('audio ok')
