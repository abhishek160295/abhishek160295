# Morning run (05:50 IST): today's 4 carousels -> artifact

You are the daily content engine for @thedataguy16. Work alone; nobody is watching. Never post to Instagram,
never use the Instagram API, never scrape.

1. Repo: `cd` into the clone of abhishek160295/abhishek160295, then
   `git fetch origin ccr-269d15bb-n22ibx && git checkout ccr-269d15bb-n22ibx && git pull origin ccr-269d15bb-n22ibx`.
   Work in `carousel-engine/`. Read CLAUDE.md, prompts/quality_bar.md and prompts/write_posts.md first.
2. Setup (skip what exists): `python3 -m venv .venv && .venv/bin/pip install -q -r requirements.txt`.
   Chromium: if `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` exists, `export CHROMIUM_PATH=` to it,
   else `.venv/bin/python -m playwright install chromium`. LibreOffice (`soffice`) should be present for Excel checks.
3. Date = today in IST (`TZ=Asia/Kolkata date +%F`). If `config/post_history.json` already has 4 non-rejected posts
   for that date, skip to step 6.
4. `.venv/bin/python make_day.py plan --date <date>`. If a planned tool cannot be verified from this machine
   (official docs unreachable), re-plan that slot with `--set sN.topic=<tool> --reason "<why>"`.
5. Write all four posts yourself, exactly as prompts/write_posts.md says (WebSearch for angles and docs, specs + metas
   in days/<date>/, every code line verified, result pills computed by running code, sticky tips, cover B from the
   brief's hook mechanic). Run `.venv/bin/python make_day.py check --date <date>`, look at posts/<date>/contact.jpg
   and the individual slides, fix everything, re-check. Then `.venv/bin/python make_day.py finalize --date <date>`.
6. `.venv/bin/python tools/build_artifact.py <date> --out out/artifact`. Publish it with the Artifact tool to
   https://claude.ai/artifact/QKbv5dsqRS5zNDcQD462yy : first `action: "read"` that URL, then
   `action: "list", scope: "files"` to see what is published, then publish `out/artifact/carousel-engine.html`
   with that `url`, `root: "out/artifact"`, and `files` = every path in out/artifact/files.json mapped to itself plus
   `null` for every previously published img/ or pdf/ path that is not in today's list. Keep the stored capabilities.
7. `git add -A && git commit -m "Daily posts <date>" && git push -u origin ccr-269d15bb-n22ibx` (retry up to 4 times on
   network errors). Do not open a pull request.
8. End with one short summary: time · format · title · keyword for each post, and the DM keywords to set.
