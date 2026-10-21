# @thedataguy16 carousel engine

Instagram carousels for data-analytics freshers (tier 2/3 India, ~82K followers). Owner: Abhishek. He approves in the
desk and uploads by hand from his phone with music. Commenters get the PDF by DM; the PDF ends with the 90-Day System page.

## Hard rules (never break)
1. 4 carousels a day: s1 08:30, s2 10:30, s3 19:00 KIDS, s4 21:00 (IST). No reels of any kind: no scripts, scroll videos, reel kits.
2. Light themes only: ember, mist, terracotta, paper. Never theme "ink", no dark panels.
3. No Canva or AI images. Kids pictures are Noto Color Emoji only (cell.emoji).
4. KIDS ("explain it like I'm 5") every day at 19:00, big tools/roles from playbook.kidsRules.queue only. No repeat within 60 days;
   a part 2 is allowed after 21 days. A failed or rejected kids post is fixed or replaced by another kids post, never another format.
5. Never use a format listed as RETIRED in playbook.freshnessRules.
6. Every formula, SQL query, DAX line, pandas snippet and shortcut is verified (make_day.py check runs SQL in sqlite,
   Python/pandas/sklearn, Excel in LibreOffice; DAX/shortcuts need an official doc URL you actually read).
7. Never invent statistics; label illustrative examples. Never mention the product price.
8. Voice: direct senior friend, plain Indian-English. No hype words, no em-dashes, no emojis on normal slides. Must read human.
9. Caption: 1-3 short lines, then exactly
   `Follow @thedataguy16 and comment <KEYWORD>. I'll DM you the full <N>-page PDF.`
   `Want the complete 90-day system? Link in bio.`
10. Instagram safety: never the Instagram API, never scrape, never enter credentials.

Content must also clear prompts/quality_bar.md (tested result on every formula row, sample data, decision slides).

## Map
- render.py: renderer (slide types in its header). `python render.py spec.json outdir --pdf`
- make_day.py: plan -> Claude writes (prompts/write_posts.md) -> check -> finalize -> desk -> notification
- engine/: planner (rotation + freshness), validate (rules), verify (runs code), build (render/QA/history), store (desk SQLite)
- days/<date>/: plan.json, sN.spec.json, sN.meta.json, check_report.txt | posts/<date>/<slug>/: slides, cover_b, carousel.pdf
- desk_server.py + desk/index.html: local approval desk | replace_rejected.py | insights_update.py + prompts/insights_review.md
- config/: engine.json, playbook.json (rotation, rules, kids/roleVs/cheatSheet/notesDrop state), insights.json, post_history.json
