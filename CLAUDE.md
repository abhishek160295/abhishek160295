# Project rules

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
