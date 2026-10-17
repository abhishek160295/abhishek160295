# Reel Studio

This repo makes Instagram reels for a minimal mindset animation page (black canvas, glowing line art, one idea in about 10s). When the owner asks for a reel, make **exactly 1 reel** and do the whole thing without asking questions.

## Owner rules (non-negotiable)

- 1 reel per request. Always a brand-new topic and a new visual metaphor, never a remix of a logged one.
- Viral bar: score the concept and the finished render against the rubric in `reels/PLAYBOOK.md`. Ship only at **9/10 or higher**. If it scores lower, change the idea or the animation and re-render. Never ship below 9.
- Chat output is minimal: send the mp4 and the cover, then the caption in a code block. No explanations, plans, tables or extra advice.

## Workflow for each request

1. Read `reels/ideas/log.md` so you don't repeat a topic or visual metaphor, then `reels/ideas/backlog.md` for candidates.
2. Invent or pick the single strongest idea, rotating structures across requests. Rules and the viral rubric are in `reels/PLAYBOOK.md`.
3. Write each scene as `reels/scenes/NNN-slug.js`, numbering after the highest existing file. Reuse the toolkit in `reels/engine/lib.js` (figures, poses, glow, text, flags, curves, bursts). If an idea needs a new prop or pose, add it to `lib.js` so later reels can use it.
4. Render a quick preview: `cd reels && node engine/render.mjs NNN-slug --fast`
5. QA: open `reels/output/NNN-slug-sheet.jpg` and full-size crops of key frames. Check for overlaps, text outside y=300..1450, poses that read badly, and an unclear payoff. Fix and re-render until it's clean.
6. Final render without `--fast`. It writes `output/NNN-slug.mp4`, `-cover.jpg` and `.txt` (caption + hashtags).
7. Send the mp4 and cover with SendUserFile, then reply with only the caption in a code block.
8. Add the ideas to `reels/ideas/log.md`, remove them from the backlog, commit and push.

`reels/output/` is gitignored: renders can be rebuilt from scenes. Run `npm install` in `reels/` first in a fresh container.

Brand handle: `reels/brand.json` `handle` (empty = no watermark).
