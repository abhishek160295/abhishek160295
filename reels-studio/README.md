# Reels studio

Renders stickman reels end to end: picture and SFX from one timeline.

```
node engine/render.js scenes/<date>-<slot>-<name>.js out/<date>-<slot>     # frames -> video
python3 engine/mix.py out/<date>-<slot> ../reels-playbook/sfx             # SFX mix, -16 LUFS, mux
node engine/render.js scenes/<file>.js /tmp/x --preview 0.5,3,8           # still frames for checking
```

- `engine/engine.js`: stickman rig, poses, walk/run cycles, floor reflection, glow, vignette, grain, labels, typewriter text.
- Scenes set `E.groundY = G`, draw with `draw(ctx, t)` and list SFX events (`t`, `s`, `g` dB, `p` semitones, `pan`, `d`, `o`, `duck`, `noduck`).
- `LOG.md`: every concept made so far. Check it before writing a new one.
- Rules: `../reels-playbook/index.html`.
