# Inspired Daily — viral checklist (every reel must pass all 10)

1. **Frame 1 hook.** Text and motion on screen at 0.0s. No intro, no logo.
2. **Reads on mute in under 2s.** 1–6 words per line, one idea per scene.
3. **Universal struggle.** Laziness, doubt, comparison, fear, time, people. Something everyone feels.
4. **Literal visual metaphor.** You understand the idea from the picture alone (coal → diamond, 99% bar).
5. **Payoff every scene.** Every 6.4s ends on a twist or transformation, marked with gold glow or a burst.
6. **Contrast built in.** Two paths, before/after, or loser vs winner. The eye compares instantly.
7. **Quotable last line.** Screenshot-worthy. This drives saves and shares, which are the algorithm's fuel.
8. **Loopable.** The reel ends on the final payoff with no outro, so a replay feels natural.
9. **30–35s, 5 scenes.** Dense enough to rewatch, short enough to finish.
10. **Never repeated.** The concept isn't in ledger.json, and it isn't the reference creator's idea.

11. **Title = first scene.** The scene that opens the reel shows exactly what the title and caption promise.
12. **Platform safe zone.** No text or payoff under the right action rail (x>950), the top bar (y<230) or the caption block (y>1560). The engine renders every scene inside a 0.88 safe frame, and `python3 audit.py` must come back clean apart from passing motion.

13. **Sharp type, premium graphics.** Text never has glow, shadow or blur. It is solid and razor-sharp. Graphic glow is subtle (capped) and only on objects. Visual quality must match or beat the reference.

14. **One hook, one payoff.** Max two lines per scene, each on screen 2.5s+. Labels 28px or bigger. One or two props per scene: the picture carries the idea, not the text. Calm motivational tone, no meme gags.

Look: black, white stick figures, one accent per scene (red = struggle, gold = win, green = growth, ice = transformation).
Audio: silent master. Add a trending sound in-app (phonk / epic / emotional piano) at full volume.
Posting: 3 a day at 9am, 2pm and 8pm local, the same file to YouTube Shorts, Reels and TikTok. Pin a question comment.

15. **Max sharpness.** Frames are drawn at 2160x3840 and lanczos-downscaled to a 1080p master (Reels/TikTok) and a 1440p master (YouTube Shorts gets sharper VP9 at 1440p and above). No halo blur on figures or particles. Titles use Inter Display. Ground and lines are high-contrast.
16. **"That's me" hooks.** Write hooks in first person or about a moment the viewer has lived ("Me at 11 PM vs me at 5 AM"). The most relatable scene opens the reel and must match its title.

17. **Zero dead time.** Reels are 25s: five 5-second scenes (`pace: 'fast'`). Hook at 0s, payoff by about 2.6s, and something moves every second (hard cut with a punch-in, constant push and drift, ambient dust, idle motion during holds). No fades to black. `python3 audit.py` must report `DEAD TIME: none` (no still stretch of 0.4s or more).

18. **Reference-level punch.** Every fast scene sets a `cam` box around its action so props fill the frame (titles stay on a fixed text layer). Strokes are 16px, main props are shaded, and every scene has one big physical action (splash, burst, smash, sprint). Targets against the reference bank average (14 reels, see research/reference-bank.md): motion of 1.56 or more, screen fill of about 5.6%, still time of 3.5s or less.

19. **Scorecard ≥ 9.0.** Every reel is scored on research/scorecard.md before shipping, and anything below 9 gets reworked.
20. **Reference #14 devices.** Every reel uses a depth stage (`floor`), at least one typewriter tag or counter for tension (`E.tag`), and a climax beat: a near-miss, others joining, or a counter landing.
21. **Reference fit is a gate.** Every reel must be about discipline, consistency, success or never giving up, told through metaphors in a serious tone, and must build to a climax. Lifestyle, comedy and social stories don't ship, however well they score.
22. **Story format (from Day 6).** This is the reference format. Every reel runs 30–36s and has 4 scenes of about 8–10s. Each scene is a small story with escalation:
    - **Labels:** small caps A vs B labels, about 32px. No sentence headlines.
    - **Palette:** black, white and grey. Gold is used only for the win, and red only for the loss.
    - **Camera:** a slow push. No punch-ins and no dust.
    - **Holds:** the win and the ending are held for 1–2s.
    - **Ending:** the last scene is the emotional peak.
    - **Sound:** each reel names its own sound (an emotional piano or a cinematic track), never "any trending sound".
23. **31 seconds max (from Day 8).** No reel runs past 31.0s. Use 4 scenes of about 7s each, or 3 scenes plus a 9s finale. If a reel runs long, tighten it with `speed` instead of cutting a beat.
24. **Retention first.**
    - **Frame 0:** the action is already moving and the A vs B conflict is on screen, with no intro.
    - **Something new every ~2s:** a fall, a flip, a pop, a bubble or a counter jump. No hold over 0.8s except the final 1s.
    - **Open loop:** a counter or goal is visible from the first second, so the viewer stays to see it land.
    - **Loopable:** the last frame flows back into the first.
25. **Reaction first.** Every reel needs moments people react to:
    - **Wince:** one "ouch" beat per reel, such as a fail or a near-miss.
    - **Satisfying snap:** one payoff beat, such as a flip, a light coming on, a break or a click.
    - **Twist ending:** one line people screenshot and quote.
    - **Comment bait:** the caption ends with a question people answer ("which one are you, 1 or 2?").
    - **Send trigger:** each reel has a "send this to..." trigger.
26. **Motion target from ref #16.** Aim for motion of **1.5 or more**. Ref #16 hits 3.07, the most-moving reel in the bank. Use crowds, throws, flights and several actors moving at once. A reel at 0.6–0.8 is too calm.
27. **Cinematic tools from ref #17.**
    - Use a perspective crowd or track at least once per batch.
    - Use panel cards (rounded frames with tab labels) for A vs B rows.
    - Add one slapstick reaction gag per batch.
    - Crowds of 30 or more figures raise motion the cheapest way.
28. **YouTube Shorts algorithm (from Day 12).** Shorts ranks on viewed vs swiped away, average % viewed (loops push it past 100%), then likes, comments, shares and subs.
    - **Length:** 22–25s, under 30s max. A short length raises % viewed and loops.
    - **Frame 0:** the hook text is on screen and something is already moving. A timely hook ("60 DAYS LEFT IN 2026") works best.
    - **Pacing:** a payoff every 5–6s, so there's never a reason to swipe.
    - **Comments:** the caption asks a 1-or-2 question or a "tag someone" prompt. Pin the same question as the first comment.
    - **Title:** curiosity plus the principle, under 40 characters, ending in #shorts.
    - **Sound:** pick a trending sound in the Shorts editor at low volume, so the visuals still lead.

## Selection bar (3 a day = only the best)
- Draft at least 5 concepts per day and ship only the top 3. The rest go to Reserve.
- Each shipped reel has to be instantly relatable (a moment the viewer has lived) and have a payoff worth a screenshot.
- Every scene: one hook line, one payoff line, one or two props.
- YouTube Shorts: title under 60 characters ending in #shorts; description is 1 line plus 3 hashtags. The loop must be clean, because Shorts rewards rewatches.
- Slot logic: the morning-themed reel at 9am, the emotional or relatable one at 2pm, the late-night or reflective one at 8pm.
