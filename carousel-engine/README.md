# @thedataguy16 carousel engine

Four carousels and one learning reel a day, researched and written by Claude Code, verified by code, rendered locally,
approved by you in a local desk. Kids series every day at 19:00, learning reel at 20:00.

## The daily learning reel
`reels/reel.py` runs real Python, traces every line, and turns the trace into a 15-35 s vertical video: characters with
the numbers on their bellies compare, swap and change value while the matching code line lights up, variables update
live, and the real output prints at the end. Silent on purpose: add music in Instagram. Topics come from
`playbook.reelRules.queue` (basics to data science, no repeat in 60 days). Try one:
`python reels/reel.py reels/specs/bubble_sort.json out/reels/bubble`

## Daily routine (2 minutes)

| When (IST) | What happens | You do |
|---|---|---|
| 05:50 | `make_day.py` plans, writes, verifies, renders 4 posts, notifies you | Open the desk, approve or reject |
| Any time you reject | The desk counts down 20 minutes (`engine.json` → `replaceAfterMinutes`), then builds a replacement on its own. Buttons: **Replace now** or **Keep rejected** (no replacement) | Approve the replacement |
| 11:50, 16:50 | `replace_rejected.py` safety net for anything still rejected without a replacement (skips "Keep rejected") | |
| Before each slot | | Pick cover A/B, download slides (zip), copy caption, post with music, set the DM reply for the keyword, mark posted |

```bash
python desk_server.py                 # desk at http://127.0.0.1:8765 (keep it running: it also runs auto-replace)
python desk_server.py --lan           # same desk on your phone over home Wi-Fi; it prints a private link with a key
```

## Setup (once)

**Mac**
```bash
cd carousel-engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install chromium
brew install --cask font-noto-color-emoji libreoffice    # emoji for kids pictures, Excel formula checks
npm install -g @anthropic-ai/claude-code && claude      # log in once
```

**Windows (PowerShell)**
```powershell
cd carousel-engine
py -m venv .venv; .venv\Scripts\activate
pip install -r requirements.txt
python -m playwright install chromium
winget install TheDocumentFoundation.LibreOffice
npm install -g @anthropic-ai/claude-code; claude
```
Noto Color Emoji: download NotoColorEmoji.ttf from fonts.google.com/noto/specimen/Noto+Color+Emoji and install it.
(Linux: `sudo apt install fonts-noto-color-emoji libreoffice-calc`.)

Check the renderer: `python render.py examples/kids_powerbi.json out/kids --pdf`

## Scheduling (IST, converted to your clock automatically)

```bash
python tools/install_schedule.py              # writes the jobs and prints the exact commands
python tools/install_schedule.py --install    # installs them
python tools/install_schedule.py --remove     # removes them
```
- **Mac (launchd):** creates `~/Library/LaunchAgents/com.thedataguy16.{make_day,replace_1150,replace_1650}.plist` and runs
  `launchctl bootstrap gui/$(id -u) <plist>`. If the Mac was asleep at 05:50, launchd runs the job when it wakes.
- **Windows (Task Scheduler):** creates tasks `DataGuy make_day`, `DataGuy replace_1150`, `DataGuy replace_1650` with
  `schtasks /Create ... /SC DAILY /ST <local time>`. Tick "Run task as soon as possible after a scheduled start is missed"
  in each task's Settings tab if the laptop sleeps.

Every run logs to `logs/<date>_make_day.log` / `logs/<date>_replace.log` (+ `logs/scheduler.log`). The notification lists
`time · format · title · keyword` and reminds you which DM keywords to set.

## Commands

| Command | What it does |
|---|---|
| `python make_day.py` | Full day for today (IST): plan, Claude writes, check, finalize, desk, notification |
| `python make_day.py --date 2026-10-22` | Same for another date |
| `python make_day.py plan --date D` | Only the plan (`days/D/plan.json`): formats, topics, swaps and why |
| `python make_day.py plan --date D --set s1.topic=Excel --reason "..."` | Override a slot by hand (logged in `why`) |
| `python make_day.py check --date D [--slots s1,s2]` | Lint + verify + render + layout QA + contact sheet, saves nothing |
| `python make_day.py finalize --date D` | Re-check, then save to history, playbook state and desk |
| `python make_day.py --no-write --date D` | Finalize specs you wrote yourself (interactive Claude session) |
| `python replace_rejected.py [--date D] [--plan-only]` | Replace rejected posts of the day |
| `python render.py spec.json outdir --pdf` | Render any spec |
| `python tools/contact_sheet.py out.jpg dir1 dir2` | Contact sheet of rendered posts |
| `python insights_update.py insights/D_readings.json` | Weekly review (see below) |

## What every post is checked for before it reaches you
- **Rules:** light style only, no retired formats, no repeat title/angle in 60 days or rejected angles, title template not
  used in 3 days, unique keyword, exact caption CTA with the real PDF page count, 5-6 hashtags, no em-dashes, no emoji
  outside kids pictures, no hype words, no price, no "Top 10", no unsourced stats in captions.
- **Code:** every SQL statement runs in sqlite (`verify/fixture.sql`), every pandas/Python line runs, every Excel formula is
  computed in LibreOffice, and the green result pill on the slide must equal the computed value. Excel 365-only functions,
  DAX and shortcuts need the official doc URL in `meta.verify.manual` / `doc`.
- **Layout:** overflow, clipped text, emoji wrapping, tiny text, PDF page count.
- **Quality bar:** `prompts/quality_bar.md` (results on formula rows, sample data, "Pick X if..." on comparisons, sharp hook).

## Hook bank
`playbook.json → hookBank` holds 7 hook families (pain + payoff, before day one, the round itself, decision settler,
notes as proof, kids topic, identity) and 5 cover-B mechanics (comment line, save before, sticker number, one sharp fact,
simple explainer), plus an avoid list. The planner gives every slot the least recently used family for cover A and a
different mechanic for cover B, and logs usage, so the weekly insights review can show which ones bring follows.
`identity` stays locked until you add your real story to `storyFacts` and set its status to `test`.

## The planner
Reads today's IST weekday row from `playbook.weeklyRotation` (s3 is always KIDS). Checks the last 7 days:
roadmap/plan max 2 a week, ROLE VS max 5 a week and never the same pair in 60 days, cheat sheet never the same tool two days
running, retired formats. A slot that would break a rule is swapped for the closest `evidence_oct` winner, and `why` says so.
Kids topics come from `playbook.kidsRules.queue` (60-day no-repeat, part 2 after 21 days); used topics, ROLE VS pairs,
cheat-sheet tools and notes tools are recorded back in `playbook.json` when a day is finalized.

## Weekly insights review (only when you ask)
Ask Claude Code (with Claude in Chrome connected to your logged-in Chrome): *"Run the insights review in
prompts/insights_review.md"*. It opens each post's insights page slowly (shortcode -> media id via `tools/media_id.py`),
reads Views, Non-followers, Saves, Shares, Follows, then runs `python insights_update.py insights/<date>_readings.json`.
That updates `insights.json` and `evidence_oct` and writes a proposal. Nothing in the rotation changes until you approve and run
`python insights_update.py --apply insights/<date>_proposal.json`.

## Sample day
`2026-10-21` is in the desk as 4 drafts: Python office cheat sheet (08:30), Excel notes 18 pages / 21-page PDF (10:30),
Machine Learning for a 5-year-old (19:00), Data Analyst vs Product Analyst (21:00). Contact sheet: `posts/2026-10-21/contact.jpg`.
