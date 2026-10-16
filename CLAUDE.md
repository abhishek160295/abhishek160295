# Project rules

## Production rules (owner's notes, apply to every episode)

1. **Quirky script.** Running gags, a sarcastic narrator who argues with Max, absurd comparisons, callback jokes, and at least one joke every 20 s. Never textbook tone.
2. **More cuts.** Target an average shot of **2.5 s or less** (reference: 3.2 s), and 12+ cuts in the first 30 s. Every sentence gets a new visual (cut, angle change, zoom punch or insert). Check with ffmpeg scene detect before delivery. Real cuts only: never fake pace with timed zoom snaps; camera re-frames glide (~0.4 s ease) and only on sentence breaks.
3. **Graphics over text.** Every fact becomes a picture: a gauge, a race, a size comparison, an icon pile, a filling bar, a before/after split, a map. Text only as a 1–3 word label on the graphic. No tables or paragraphs on screen.
4. **One stable character.** Max looks the same in every shot and every episode: round black head, big white expressive eyes, yellow jacket, blue jeans, red shoes. One model sheet. Change the design only if the owner approves, and then everywhere.
5. **Balance: never rushed, never unclear.** One idea per shot. Key facts stay up until the line ends plus 0.5 s. Cut on phrase breaks. Rhythm is fast, fast, then breathe, with a calm 2–3 s hold after every burst or set piece. Test with 30 random freeze frames (each readable in 1 s) and a sound-off phone watch.
6. **Cinematics:** speed ramps, freeze frames, low hero angles, Dutch tilts, whip pans and orbits, saved for payoff beats (about 6–8 slow-motion moments per episode), not everywhere.
7. **Soft sound effects.** Effects support the picture, never sting the ear: high-passed, low-passed at ~7.5 kHz, compressed and levelled to −26 LUFS (`public/mem/sfx/`), played well under the voice. No shrill or piercing hits.
8. **Topic formula** (from Ifverse / Jeremy Bearimy data): one human ability × a number ("What If Your X Was 10x…"). Brain abilities trending. New topic each video, no Part 2. Thumbnail: 2 words, white plus yellow, one big face, one object, dark background.

## ElevenLabs credit budget (hard rule)

- Cap: **8,000 credits per episode**, all-in. Never exceed without the owner saying yes in that session.
- Before ANY paid call: run it with `estimate_only` first, then ask the owner with the number. No silent spends, ever.
- Keep a running tally in `pilot/CREDITS.md` (date, what, credits). Check it before each spend.

### Where credits go and the cheap way

| Item | Old cost (50x ep) | Rule now |
|---|---|---|
| Voice (TTS) | ~10k per full pass, several passes | Lock the script first. Test ONE section, then generate the rest once. Re-do only the broken line, never a whole section. |
| Word timings (Scribe) | 2,907 | Do NOT use Scribe. Use free `pilot/align.py` (silence-split against the known script). |
| Music | ~4,800 | Reuse `pilot/public/ep/music-*.mp3` or free YouTube Audio Library / Pixabay tracks the owner downloads. No new music generation. |
| SFX | ~385 | Reuse `pilot/public/ep/sfx/`. Generate only a missing one, max 5 per episode. |
| Thumbnail art | ~760 (4 images) | `generations_count: 1` (~190). Text goes on in code (`pilot/thumb_overlay.py`). |
| AI video | not used | Not used. |

Target spend per episode: voice ~5–7k + thumbnail ~190 + few SFX ≈ **under 8k**.
Cheapest of all: the owner records the voice; then the only paid item is the thumbnail.
