You are writing carousel posts for @thedataguy16. Read CLAUDE.md first: its hard rules override everything.
Then read prompts/quality_bar.md. Score every draft against it and rewrite anything under 8/10 before checking.

Date: {{DATE}} (IST). Mode: {{MODE}}. Write these slot ids: {{SLOTS}}.

1. Read days/{{DATE}}/plan.json. For each slot id, the brief there (slots[] by slot number, or replacements[<id>]) fixes the
   format, tool/topic/pair, style, layout, hook family and evidence. Do not change those. `banned` lists titles, templates
   and keywords you may not reuse. For a replacement, `avoid` lists the topic and angle of the rejected post: pick a clearly different one.
   Hooks: brief.hookA names the hook family for cover A (patterns to adapt, never copy a title) and brief.hookB the
   mechanic for spec.cover_alt (set cover_alt.hook to the mechanic id). playbook.hookBank.avoid is banned.
2. Read config/playbook.json (formats, kidsRules, hookRules, ctaRule) and config/engine.json (designRules, productRule) and one
   matching example in examples/ for the spec shape. Read render.py's header for slide types.
3. Use WebSearch (2-4 searches per post) for a fresh angle: what freshers in India are asking about this tool/role right now,
   current official docs for any shortcut or function. Prefer official docs (learn.microsoft.com, support.microsoft.com,
   docs.python.org, pandas.pydata.org, scikit-learn.org, sqlite.org). Put the URLs you relied on in meta.sources.
4. For each slot id write two files (sheet rows: add "result" = the verified value, and a "data" line describing the sample cells):
   days/{{DATE}}/<id>.spec.json  renderer spec. Set style and layout from the brief. Mascot path: assets/mascot.jpg.
   days/{{DATE}}/<id>.meta.json  {title, slug, caption, hashtags (5-6, one string), keyword (new, 4-12 A-Z0-9),
       hookType, pillar, why ("Proven: ..." copy brief.evidence, plus any swap note), sources:[{title,url}],
       coverAlt hook in spec.cover_alt.hook if you add a second cover, illustrative:true if any example is made up,
       verify:{checks:[...], manual:[...], prose_slides:[...]}}
   Caption = 1-3 short lines, then exactly:
       Follow @thedataguy16 and comment <KEYWORD>. I'll DM you the full <N>-page PDF.
       Want the complete 90-day system? Link in bio.
   N = the PDF page count printed by the check (cover + every page + product + cta).
5. Verification (hard rule 6). Use the table/column names in verify/fixture.sql for SQL and the fixture DataFrame `df` in
   engine/verify.py for pandas. Complete SQL statements and pandas lines are run automatically. For anything else add a check:
     {"id","lang":"sql","setup","query","expect"} | {"id","lang":"python","code"(with asserts)} |
     {"id","lang":"excel","cells":{"A1":..},"formula":"=...","expect":..,"doc":"<url if LibreOffice lacks the function>"}
   DAX, menu paths and keyboard shortcuts go in manual:[{snippet, source:<official doc URL>}] only after you read that page.
   Bigtables whose answer column is plain English: list their slide numbers in prose_slides.
6. Run: python make_day.py check --date {{DATE}} --slots <ids>
   Fix every ERROR. Then open posts/{{DATE}}/contact.jpg and the individual slides with Read and look for overflow, bad
   wrapping, emoji on two lines, tiny text, two slides that look the same, or a slide that clashes with the rest. Fix the
   specs and run the check one more time. Stop when the check prints no ERROR lines.
Do not edit config/, render.py or engine/. Do not touch other days. Never post, never open Instagram.
