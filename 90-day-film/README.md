# The 90-Day Career Transformation (12.9s cut)

A vertical 1080×1920, 30 fps film for THE DATA GUY: zero skills → data analyst in 90 days.

## Deliverables (`deliverables/`)
- `THE_DATA_GUY_90_DAYS_13s.mp4`: final master, 12.9s, H.264 + AAC, −14 LUFS, faststart
- `thumbnail.jpg`: before/after split cover
- `captions.srt`: captions timed to the voiceover
- `voiceover_script.md`: the VO lines with timings and what's on screen

## Structure
| Scene | Time | File |
|---|---|---|
| Hook: "90 days" | 0.0–1.4 | `src/scenes/Opening.tsx` → `Hook` |
| Pain: rejections, zero counters | 1.4–2.6 | `Pain` |
| Push into the eyes: "So he built himself. In 90 days." | 2.6–4.7 | `Built` |
| Excel · SQL · Python · Statistics · Power BI · Tableau · Git/GitHub | 4.7–8.85 | `src/scenes/Skills.tsx` |
| Logos orbit and fuse, office, interview update, offer | 8.85–11.3 | `src/scenes/Payoff.tsx` → `Ecosystem` |
| "It needs a plan." Brand, CTA | 11.3–12.9 | `Finale` |

All timings live in `src/timeline.ts`. The reusable animation pieces (logo arrival, particle burst, perspective grid, glass panels, skill titles, flashes, grain) are in `src/components/fx.tsx`. The 90-day HUD is in `src/components/Hud.tsx`.

## Assets
- **Logos** (`public/logos/`): unmodified official marks from open-source icon sets: Iconify `logos` (Power BI, Tableau, Python, NumPy, pandas, Matplotlib, seaborn, Git, GitHub, PostgreSQL), Iconify `vscode-icons` (Excel) and Devicon (Microsoft SQL Server). SQL itself is shown as a generic database cylinder next to two engines, so it isn't presented as one company's product. Statistics has no logo.
- **Protagonist** (`public/img/`): two generated stills with the same identity (dark bedroom, then the office), cropped to 9:16.
- **Audio** (`public/audio/`): `vo.wav` is cut and timed by `scripts/vo.py`. `score.wav` is the procedural score and sound effects (heartbeat, typing, risers, bass hits, logo activations, pulse bed) from `scripts/sfx.py`.

## Rebuild
```bash
npm install
python3 scripts/sfx.py public/audio/score.wav     # optional: regenerate score
npx remotion studio src/index.ts                    # live preview / edit
npx remotion render src/index.ts DataGuy90 out/render.mp4 --crf=16
npx remotion still  src/index.ts Thumbnail deliverables/thumbnail.jpg --image-format=jpeg
ffmpeg -i out/render.mp4 -c:v copy -af loudnorm=I=-14:TP=-1 -c:a aac -b:a 256k -movflags +faststart deliverables/THE_DATA_GUY_90_DAYS_13s.mp4
```
In a sandbox without Chrome, add `--browser-executable=<path to chrome-headless-shell>`.

## Compliance
The offer letter is a labelled dramatisation ("fictional employer · results vary"). No job guarantee is stated or implied.
