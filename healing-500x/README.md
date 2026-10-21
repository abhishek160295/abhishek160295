# What If Your Body Healed 500X Faster?

Remaster of the original 100X episode: 360p → 1080p, full re-voice and re-score, and every on-screen timer, counter and caption recalculated for 500X healing.

## What changed

| | 100X original | 500X remaster |
|---|---|---|
| Resolution | 640×360 | 1920×1080 (Real-ESRGAN anime-video model, then Lanczos) |
| Cut closes | 90 sec | 18 sec |
| Bone knits / lock window | 5 min | 60 sec |
| Bleeding stops | 2 sec | under 0.4 sec |
| Muscles rebuild | 20 sec | 4 sec |
| Splinter rejected | 20 sec | 4 sec |
| Fever peak | 41 °C | 42 °C |
| Heart rate | 180 BPM | 220 BPM |
| Sweat-through | 3 min | 40 sec |
| Rescue agony | 4 min | 48 sec |
| Gym pushups | 500 | 1,000 |
| Calories per broken bone | 4,000 | 4,000, now burned in one minute |

All countdown badges (4:52, 4:23, 3:48 …) are rescaled to the 60-second window.

## Audio

- Narrator: Ra McQueen (cinematic). Jay: Jordan. Leo: VALF. Agent: Lauren B. All ElevenLabs v4.
- Two original score cues (ElevenLabs Music), ducked under dialogue.
- Bone crack, joint click, ratchet, shimmer and whoosh SFX, plus a rain bed for the storm sequence.
- Master at −14 LUFS, −1 dBTP.

## Pipeline

```
pipeline/upscale.py   AI upscale (CPU, AMX bf16)
pipeline/split.py     cuts character takes into lines
pipeline/mix.py       VO placement, music, ducking, SFX → mix.f32
pipeline/patches.py   500X graphics patches (inpaint + redraw)
pipeline/render.py    retimes picture to the new VO, applies patches, grade, encode
pipeline/script.tsv   line-by-line script (speaker-tagged)
pipeline/timeline.json  per-line source span → new slot mapping
```

Full narration: [SCRIPT.md](SCRIPT.md).
