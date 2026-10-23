# Quality bar (every post, every day)

A post ships only if a fresher from a tier 2/3 city would save it **and** send it to a friend.
Score each draft 1-10 on the six lines below. Anything under 8 gets rewritten before `make_day.py check`.

1. **Hook names a real pain or payoff.** "38 Python lines that do your boring office work" beats "Python cheat sheet".
   The cover sub is the promise in plain words ("Copy, run, go home on time"). No vague hooks like "Must know", "Important".
   Owner, 23 Oct: keep this earlier style (number + payoff title over 2-3 lines with <br>, sub line, slide previews).
   Short punchy hook-only covers did not work.
2. **Proof on the page.** Every formula, query or line shows what it returns on sample data (`result` on sheet rows:
   `=VLOOKUP(E2,A2:C4,2,FALSE) → Ravi`). The result is the verified value from the check, never typed from memory.
3. **Real work, not syllabus.** Every row says when you'd use it at a job ("Combine 12 monthly files", not "pd.concat").
   Use Indian context people live in: MIS reports, GST, sales by region, Pune/Indore/Lucknow, offer letters, campus drives.
4. **One step past the obvious.** Each post carries at least 3 things a beginner would not find on the first Google page
   (XLOOKUP last match, IFERROR vs IFNA, `keep=False` in duplicated, Value Filters on pivots).
5. **Decision help.** Comparisons end with "Pick X if..." and show the same task done both ways (the real query each role writes).
   Notes and cheat sheets end with practice tasks or interview answers.
6. **Voice.** A senior friend talking: short sentences, plain Indian-English, "you". No hype, no em-dashes, no emojis
   outside kids pictures, no invented numbers. Illustrative examples are labelled "example".

Caption: line 1 is the pain in under 90 characters, line 2 the payoff, optional line 3 a nudge. Then the CTA lines.
Never open with "Here are", "In this post", "Check out", "Do you want", "Are you".
