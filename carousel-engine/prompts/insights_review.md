# Weekly insights review (run only when Abhishek asks)

Uses Claude in Chrome on Abhishek's own logged-in Chrome. Normal page views only. Never the Instagram API,
never scraping tools, never typing a password. If a login or checkpoint page appears, stop and tell him.

1. Open https://www.instagram.com/thedataguy16/ and collect the shortcodes of the last 7 days of posts
   (the part after /p/ in each post link). Scroll slowly; wait 5-10 seconds between pages.
2. For each shortcode run `python tools/media_id.py <shortcode>` to get the insights URL
   (shortcode is base64url; media id = BigInt of the digits): https://www.instagram.com/insights/media/<id>/
3. Open each insights URL one at a time, wait for it to load fully, and read: Views, Non-followers %,
   Saves, Shares, Follows. Wait 20-40 seconds before the next post. Max ~30 posts per session.
4. Save insights/<YYYY-MM-DD>_readings.json:
   [{"shortcode": "...", "title": "<cover title>", "keyword": "<comment keyword if visible in caption>",
     "views": 0, "nonFollowersPct": 0, "saves": 0, "shares": 0, "follows": 0}]
5. Run `python insights_update.py insights/<date>_readings.json` and show Abhishek the summary and the proposal.
6. Only after he approves: `python insights_update.py --apply insights/<date>_proposal.json`.
