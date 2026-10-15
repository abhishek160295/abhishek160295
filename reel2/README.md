# Discipline Compounds

**Motivation starts it. Discipline finishes it.**
15 s · 1080×1920 · 30 fps · 450 frames · H.264 + AAC

Output: [`../discipline_compounds_reel.mp4`](../discipline_compounds_reel.mp4) · Scenes: [`../discipline_contact_sheet.png`](../discipline_contact_sheet.png)

## Story
| Time | Beat |
|---|---|
| 0–2.4 s | *WHICH ONE GETS YOU THERE?* Two live traces scroll: a chaotic amber MOTIVATION line and a steady blue DISCIPLINE bounce. |
| 2.7–4 s | *MOTIVATION SPIKES.* A hype peak. ENERGY reads 99% and the frame glows amber. |
| 4.4–6 s | *THEN IT CRASHES.* A dive below zero, then a flatline. Energy drains to 1%. |
| 6.5–8.7 s | *DISCIPLINE JUST SHOWS UP.* The same small arc every day. The STREAK counter ticks with each landing. |
| 9–10.3 s | *SAME SMALL ARC. EVERY. SINGLE. DAY.* The two panels merge into one chart. Time-lapse through a full year: each bounce is a day and each day is 1% better. |
| 10.4 s | *UNTIL IT PASSES EVERY PEAK.* Discipline crosses "Motivation's best day". |
| 12.6–15 s | *MOTIVATION STARTS IT. / DISCIPLINE FINISHES IT.* The counter lands on DAY 365 · **37.8×** (1.01³⁶⁵). Hold. |

Every number is real. The curve is `200·(1.01^day − 1)` plus a 70 px daily arc, and the counter is `1.01^day`.

## Files
- `src/scene.js` – the deterministic canvas renderer (`renderFrame(f)`).
- `src/index.html` – browser preview with play and scrub.
- `render.mjs` – headless Chromium sends the frames straight into FFmpeg and exports `out/events.json`.
- `audio.py` – the original score. Motivation's pitch follows its curve, then becomes a flatline beep. Discipline gets one kick per day, the compounding gets a rising tone, the overtake gets an impact, and day 365 gets a final chord.
- `build.sh` – full rebuild.

## Rerender
```bash
cd reel2 && ./build.sh
```
Needs Node 18+, Playwright with Chromium, Python 3 with numpy, and FFmpeg. Timing is set in `CAP`, `MERGE`, `T_RAMP` and `T_BRAKE` in `src/scene.js`. The score follows automatically.
