# Reel Studio

This repo makes Instagram reels for a minimal mindset animation page (black canvas, glowing line art, one idea in about 10s). The owner posts 2 reels a day. When they ask for reels ("make today's reels", "2 new reels", "make one on X"), do the whole thing without asking questions.

## Workflow for each request

1. Read `reels/ideas/log.md` so you don't repeat a topic or visual metaphor, then `reels/ideas/backlog.md` for candidates.
2. Pick or invent ideas. Default to 2 per request (morning + evening): one split comparison plus one from a different structure. Rules are in `reels/PLAYBOOK.md`.
3. Write each scene as `reels/scenes/NNN-slug.js`, numbering after the highest existing file. Reuse the toolkit in `reels/engine/lib.js` (figures, poses, glow, text, flags, curves, bursts). If an idea needs a new prop or pose, add it to `lib.js` so later reels can use it.
4. Render a quick preview: `cd reels && node engine/render.mjs NNN-slug --fast`
5. QA: open `reels/output/NNN-slug-sheet.jpg` and full-size crops of key frames. Check for overlaps, text outside y=300..1450, poses that read badly, and an unclear payoff. Fix and re-render until it's clean.
6. Final render without `--fast`. It writes `output/NNN-slug.mp4`, `-cover.jpg` and `.txt` (caption + hashtags).
7. Send the owner each mp4 and cover with SendUserFile and paste the caption in chat.
8. Add the ideas to `reels/ideas/log.md`, remove them from the backlog, commit and push.

`reels/output/` is gitignored: renders can be rebuilt from scenes. Run `npm install` in `reels/` first in a fresh container.

Brand handle: `reels/brand.json` `handle` (empty = no watermark).
