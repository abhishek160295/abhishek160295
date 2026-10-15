# THE 5 A.M. WAR: a 3D short about discipline

**1:44 · 1080p · 24 fps · -14 LUFS**

## How it's made

- **3D:** rendered frame by frame from three.js in headless Chromium (Playwright), using `web/film.html`. It has physically lit materials, soft shadows, image-based lighting from RoomEnvironment, Unreal bloom, and a custom grade pass (film grain, vignette, chromatic aberration).
- **Narration:** ElevenLabs text-to-speech in the "Don" movie-trailer voice (`audio/narr_a.mp3`), split on its silences into ten lines.
- **Villain voice:** espeak-ng, processed into a demonic voice (pitched layers, a whisper layer, saturation and a long reverb).
- **Score and sound design:** synthesized in numpy and scipy (`audio3d.py`). Every falling excuse block's impact is synced to its exact landing time by mirroring the JavaScript random number generator in Python.

## Rebuild

```
(cd web && python3 -m http.server 8765 &)
cp -r node_modules/three web/three
setsid nohup bash run3d.sh &     # resumable chunk renderer
python3 audio3d.py && bash finish3d.sh
```
