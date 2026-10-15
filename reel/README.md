# Geometric Aha Reel

**"You are not stuck. You are repeating the same pattern."**
15 s · 1080×1920 · 30 fps · 450 frames · H.264 + AAC

Output: [`../geometric_aha_reel.mp4`](../geometric_aha_reel.mp4) · Scenes: [`../contact_sheet.png`](../contact_sheet.png)

## Story
| Time | Beat | Picture |
|---|---|---|
| 0–3 s | Hook | A white circle shoots from the centre of a square maze, hits the wall, snaps back. Every time. — *WHY ARE YOU STILL STUCK?* |
| 3–6 s | Pattern | The maze turns 90° (and looks exactly the same). Loops speed up, trails get longer, and every neighbouring cell starts running the same loop. — *SAME HABITS. / SAME RESULTS.* |
| 6–10 s | Aha | Hard freeze. The sound cuts out. A short breath in, then a pull-back shows the maze was one square repeated forever. One electric-blue line cuts through the walls, and the circle leaves along it. — *CHANGE THE PATTERN.* |
| 10–13 s | Transformation | The grid comes apart. Concentric rings bloom from the circle, and the orbiting dots form a pendulum wave. — *CHANGE YOUR LIFE.* |
| 13–15 s | Payoff | The dots slow to a stop in one vertical line. Circle, triangle, square and axis lock into a single mark, which holds to the end. — *ONE DIFFERENT CHOICE.* |

## Files
- `src/scene.js` – the whole film. A deterministic canvas renderer: `renderFrame(f)` depends only on the frame number. It has cubic-Bézier easing, back-easing for anticipation and overshoot, squash on impact, motion trails, and camera drift.
- `src/index.html` – live preview. Open it in a browser; Space plays or pauses and the slider scrubs.
- `render.mjs` – headless Chromium (Playwright) draws the frames and streams the PNGs straight into FFmpeg. It also exports `out/events.json`.
- `audio.py` – the original score, synthesised in numpy: drone, synced wall impacts, riser, freeze drop, glass-bell breakthrough, whoosh, C-major pad, ring plucks and a final chord.
- `build.sh` – full rebuild.

## Rerender
Needs Node 18+, Playwright with Chromium, Python 3 with numpy, and FFmpeg.
```bash
cd reel
./build.sh                                # video + score + mux + contact sheet
node render.mjs --stills 0,180,449        # individual frames → out/stills/
```
Timing lives in `T` and `CAPTIONS` at the top of `src/scene.js`. The score reads `events.json`, so retiming the picture moves the sound with it.

Font: Inter Display Bold (SIL OFL), bundled in `fonts/`.
