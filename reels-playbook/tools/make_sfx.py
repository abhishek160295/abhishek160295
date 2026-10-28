"""Synthesise the stickman-reel SFX kit from scratch (numpy only, no samples).

Run: python3 make_sfx.py [out_dir]
Every sound is built from oscillators, noise and envelopes, so the kit is
100% original and royalty-free.
"""
import sys, os, wave
import numpy as np

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "sfx")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def noise(d):
    return rng.standard_normal(int(SR * d))


def spec_filter(x, fn):
    """Shape a signal in the frequency domain: fn(freqs) -> gain."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * fn(f), len(x))


def lp(x, fc, order=2):
    return spec_filter(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))


def hp(x, fc, order=2):
    return spec_filter(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order)))


def bp(x, fc, q):
    bw = fc / q
    return spec_filter(x, lambda f: np.exp(-0.5 * ((f - fc) / bw) ** 2))


def env(n, a=0.002, d=0.2, curve=4.0):
    tt = np.arange(n) / SR
    att = np.clip(tt / max(a, 1e-5), 0, 1)
    dec = np.exp(-curve * np.maximum(tt - a, 0) / max(d, 1e-5))
    return att * dec


def fade(x, fi=0.003, fo=0.02):
    n = len(x)
    a, b = int(SR * fi), int(SR * fo)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def mix(*sigs):
    """Sum signals of different lengths."""
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs:
        out[: len(x)] += x
    return out


def place(total, events):
    """Mix (offset_seconds, signal, gain) events into one buffer."""
    out = np.zeros(int(SR * total))
    for off, sig, g in events:
        i = int(off * SR)
        j = min(len(out), i + len(sig))
        out[i:j] += sig[: j - i] * g
    return out


def save(name, x, peak=0.89):
    x = np.asarray(x, dtype=float)
    x = fade(x.copy())
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    pcm = (x * 32767).astype("<i2")
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def sine_sweep(f0, f1, d, curve="exp"):
    tt = t(d)
    if curve == "exp":
        f = f0 * (f1 / f0) ** (tt / d)
    else:
        f = np.linspace(f0, f1, len(tt))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---------- building blocks ----------
def click(freq=3200, d=0.03, q=3):
    n = noise(d) * env(int(SR * d), 0.0005, d * 0.25, 5)
    return bp(n, freq, q) + 0.4 * np.sin(2 * np.pi * freq * t(d)) * env(int(SR * d), 0.0003, d * 0.15, 6)


def thud(freq=70, d=0.35):
    tt = t(d)
    f = freq * (1 + 1.5 * np.exp(-tt * 40))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.001, d * 0.5, 5)
    grit = lp(noise(d), 900) * env(len(tt), 0.0005, 0.04, 6) * 0.6
    return body + grit


def brick():
    d = 0.22
    knock = bp(noise(d), 850, 2.2) * env(int(SR * d), 0.0005, 0.06, 6)
    tone = np.sin(2 * np.pi * 410 * t(d)) * env(int(SR * d), 0.0005, 0.05, 6) * 0.5
    grit = hp(noise(d), 3000) * env(int(SR * d), 0.0005, 0.015, 6) * 0.3
    return knock + tone + grit + 0.5 * thud(95, d)


def step(soft=False):
    d = 0.12
    s = lp(noise(d), 700 if soft else 1400) * env(int(SR * d), 0.002, 0.05, 5)
    return s + 0.6 * thud(80, d)


def whoosh(d=0.45, f0=400, f1=2600):
    n = noise(d)
    tt = t(d)
    shape = np.sin(np.pi * tt / d) ** 2
    # sweep a band-pass by summing short windows
    out = np.zeros_like(n)
    hop = int(SR * 0.02)
    win = np.hanning(hop * 2)
    for i in range(0, len(n) - hop * 2, hop):
        fc = f0 * (f1 / f0) ** (i / len(n))
        seg = bp(n[i : i + hop * 2] * win, fc, 1.6)
        out[i : i + hop * 2] += seg
    return out * shape


# ---------- the kit ----------
def build():
    # UI / text
    save("ui_text_pop", click(2600, 0.05, 2.5) + 0.6 * np.sin(2 * np.pi * 1320 * t(0.05)) * env(int(SR * 0.05), 0.001, 0.02))
    letters = [(i * 0.055, click(3800 + rng.integers(-300, 300), 0.025, 4), 0.8 + 0.2 * rng.random()) for i in range(14)]
    save("ui_typewriter_line", place(0.95, letters))
    save("ui_label_tick", click(5200, 0.02, 5))
    tt = t(0.6)
    save("ui_reveal_chime", sum(np.sin(2 * np.pi * f * tt) * env(len(tt), 0.004, 0.45, 4) / (k + 1) for k, f in enumerate([880, 1318.5, 1760])))

    # Transitions / impacts
    save("tr_whoosh_soft", whoosh(0.5, 300, 1800))
    save("tr_whoosh_fast", whoosh(0.28, 600, 4000))
    rt = t(2.2)
    riser = noise(2.2)
    riser = spec_filter(riser, lambda f: np.exp(-0.5 * ((f - 2500) / 2000) ** 2)) * (rt / 2.2) ** 2.5
    riser += 0.4 * sine_sweep(110, 880, 2.2) * (rt / 2.2) ** 2
    save("tr_riser_2s", riser)
    dt = t(1.4)
    drop = np.sin(2 * np.pi * np.cumsum(45 * (1 + 2 * np.exp(-dt * 6))) / SR) * env(len(dt), 0.002, 1.0, 3)
    save("tr_sub_drop", drop + 0.3 * lp(noise(1.4), 200) * env(len(dt), 0.001, 0.3, 5))
    save("tr_impact_hit", thud(55, 0.9) + 0.5 * hp(noise(0.9), 2500) * env(int(SR * 0.9), 0.0005, 0.08, 6))

    # Build / brick reel
    save("build_brick_place", brick())
    seq = [(i * 0.16 + rng.random() * 0.02, brick(), 0.7 + 0.3 * rng.random()) for i in range(12)]
    save("build_brick_stack_fast", place(2.2, seq))
    lt = t(0.18)
    save("build_level_tap", np.sin(2 * np.pi * 2900 * lt) * env(len(lt), 0.0003, 0.12, 5) + 0.5 * click(6000, 0.18, 6))
    save("build_scrape_adjust", bp(noise(0.6), 1800, 3) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t(0.6))) * np.hanning(int(SR * 0.6)))

    # Morning routine reel
    at = t(1.6)
    beep = np.sign(np.sin(2 * np.pi * 2048 * at)) * 0.35
    gate = ((at % 0.4) < 0.08) | (((at % 0.4) > 0.12) & ((at % 0.4) < 0.2))
    save("morning_alarm_beep", lp(beep * gate, 6000), peak=0.45)
    save("morning_snooze_tap", click(1500, 0.06, 2) + 0.5 * thud(160, 0.06))
    sz = place(3.0, [(rng.random() * 2.9, click(5000 + rng.integers(-2000, 2000), 0.012, 3), rng.random()) for _ in range(260)])
    save("morning_pan_sizzle", sz + 0.25 * bp(noise(3.0), 4500, 1.2))
    sh = bp(noise(3.0), 3500, 0.8) + 0.4 * bp(noise(3.0), 900, 1.5)
    save("morning_shower_loop", sh)
    save("morning_door_close", mix(thud(90, 0.5), 0.4 * click(2200, 0.05, 2)))
    walk = place(2.4, [(i * 0.5, step(), 1.0) for i in range(5)])
    save("morning_footsteps_walk", walk)
    run = place(2.0, [(i * 0.27, step(True), 0.9) for i in range(7)])
    save("morning_footsteps_rush", run)
    save("morning_tick_timer", place(2.0, [(i * 0.5, click(4200, 0.02, 6), 1.0) for i in range(4)]))

    # Ball / discipline reel
    def bounce(h):
        d = 0.18
        tt = t(d)
        return np.sin(2 * np.pi * np.cumsum(180 + 400 * h * np.exp(-tt * 30)) / SR) * env(len(tt), 0.001, 0.08, 6) * h + 0.3 * h * click(1200, d, 2)
    times, h, off = [], 1.0, 0.0
    for gap in [0.62, 0.45, 0.32, 0.22, 0.15, 0.1, 0.07, 0.05]:
        times.append((off, bounce(h), 1.0)); off += gap; h *= 0.7
    save("ball_bounce_dying", place(off + 0.3, times))
    save("ball_bounce_steady", place(2.6, [(i * 0.42, bounce(0.9), 1.0) for i in range(6)]))

    # Crowd / cliff reel
    md = 4.0
    mt = t(md)
    murmur = sum(bp(noise(md), fc, 2.0) * (0.6 + 0.4 * np.sin(2 * np.pi * (1.3 + k * 0.7) * mt + k)) for k, fc in enumerate([300, 520, 750, 1100]))
    save("crowd_march_murmur", murmur + place(md, [(i * 0.38, step(True), 0.7) for i in range(10)]))
    save("crowd_fall_whistle", sine_sweep(1400, 300, 1.1) * np.linspace(1, 0.2, int(SR * 1.1)), peak=0.5)
    ft = t(1.4)
    save("crowd_distant_thud", lp(thud(60, 1.4), 400) * 0.8 + lp(noise(1.4), 250) * env(len(ft), 0.01, 0.6, 4) * 0.4)
    save("crowd_blindfold_rip", hp(noise(0.25), 1500) * env(int(SR * 0.25), 0.01, 0.2, 3))

    # Diving reel
    bt = t(0.7)
    boing = np.sin(2 * np.pi * (220 + 40 * np.sin(2 * np.pi * 14 * bt)) * bt) * env(len(bt), 0.002, 0.5, 4)
    save("dive_board_spring", boing + 0.4 * thud(120, 0.7))
    sp = t(1.2)
    splash = hp(noise(1.2), 600) * env(len(sp), 0.004, 0.5, 4) + 0.6 * thud(70, 1.2)
    drops = place(1.2, [(0.15 + rng.random() * 0.9, np.sin(2 * np.pi * np.cumsum(np.linspace(900, 2200, 2000)) / SR) * env(2000, 0.001, 0.02, 5), 0.15) for _ in range(40)])
    save("dive_splash", splash + drops)
    save("dive_water_ambience_loop", lp(noise(4.0), 500) * 0.6 + 0.2 * bp(noise(4.0), 1500, 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t(4.0))))
    save("dive_hesitate_shuffle", place(1.6, [(0.0, step(True), 0.6), (0.35, step(True), 0.5), (0.9, step(True), 0.6), (1.2, step(True), 0.4)]))

    # Climb reel
    save("climb_grip", place(0.5, [(0, hp(noise(0.12), 1200) * env(int(SR * 0.12), 0.003, 0.06, 4), 1), (0.08, step(True), 0.5)]))
    save("climb_pebbles_fall", place(1.5, [(rng.random() * 1.2, click(2500 + rng.integers(-1200, 1200), 0.04, 3), 0.3 + rng.random() * 0.7) for _ in range(18)]))
    ft2 = t(2.0)
    flutter = bp(noise(2.0), 900, 1.2) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * ft2 + 2 * np.sin(2 * np.pi * 0.8 * ft2))))
    save("climb_flag_flutter", flutter)
    save("climb_stream_pour", bp(noise(2.0), 2200, 1.5) * (0.7 + 0.3 * np.sin(2 * np.pi * 11 * ft2)) * np.hanning(int(SR * 2.0)) ** 0.3)

    # Umbrella / weather reel
    rain = hp(noise(5.0), 800) * 0.35 + place(5.0, [(rng.random() * 4.95, click(3000 + rng.integers(-1500, 1500), 0.02, 2), rng.random()) for _ in range(900)])
    save("weather_rain_loop", rain)
    tht = t(4.0)
    thunder = lp(noise(4.0), 180) * env(len(tht), 0.08, 2.5, 3) + 0.5 * lp(noise(4.0), 900) * env(len(tht), 0.002, 0.25, 5)
    save("weather_thunder", thunder)
    ht = t(3.0)
    heat = sum(np.sin(2 * np.pi * f * ht + k) for k, f in enumerate([55, 110.4, 164.7])) * 0.3 + 0.15 * bp(noise(3.0), 3000, 4) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * ht))
    save("weather_heat_drone", heat * np.hanning(len(ht)) ** 0.2, peak=0.6)
    wind = bp(noise(4.0), 500, 1.0) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t(4.0)))
    save("weather_dry_wind", wind)
    gulps = place(1.4, [(i * 0.42, np.sin(2 * np.pi * np.cumsum(np.linspace(260, 140, int(SR * 0.12))) / SR) * env(int(SR * 0.12), 0.01, 0.08, 4) + 0.3 * lp(noise(0.12), 600) * env(int(SR * 0.12), 0.005, 0.05, 5), 1.0) for i in range(3)])
    save("weather_drink_gulps", gulps)
    save("weather_umbrella_open", place(0.6, [(0, hp(noise(0.25), 1500) * np.hanning(int(SR * 0.25)), 0.8), (0.22, mix(thud(140, 0.3), click(1800, 0.05, 2)), 1)]))

    # Laugh (formant-synth "ha ha", stylised to fit the stickman world)
    def ha(f0=210, d=0.16):
        tt = t(d)
        glott = (np.sign(np.sin(2 * np.pi * f0 * (1 - 0.15 * tt / d) * tt)) + 1) / 2
        voiced = spec_filter(glott - glott.mean(), lambda f: np.exp(-0.5 * ((f - 800) / 90) ** 2) + 0.6 * np.exp(-0.5 * ((f - 1250) / 110) ** 2) + 0.3 * np.exp(-0.5 * ((f - 2600) / 160) ** 2))
        breath = bp(noise(d), 1100, 1.5) * env(len(tt), 0.002, 0.04, 4) * 0.6
        return (voiced * env(len(tt), 0.02, d * 0.6, 3) + breath)
    save("crowd_ha_ha_mock", place(1.3, [(i * 0.2, ha(230 - i * 8), 1 - i * 0.1) for i in range(5)]))

    # Emotional beats
    hb = place(2.4, [(i * 0.8, thud(50, 0.2), 1.0) for i in range(3)] + [(i * 0.8 + 0.18, thud(45, 0.2), 0.7) for i in range(3)])
    save("beat_heartbeat", lp(hb, 300))
    save("beat_tension_tick", place(2.0, [(i * 0.25, click(1800 if i % 2 else 2400, 0.03, 4), 1) for i in range(8)]))


if __name__ == "__main__":
    build()
    print("ok", len(os.listdir(OUT)), "files ->", os.path.abspath(OUT))
