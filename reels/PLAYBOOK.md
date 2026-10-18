# Playbook

These rules come from the 14 reference reels (`reference-analysis.md`). Every reel follows them.

## Visual rules

**Pattern DNA (distilled from all 14 references; don't copy any single one)**

Every reel must hit **at least 6 of these 8**. Check them before rendering.

1. **People in it (11/14 refs):** a figure (stick or solid neon) doing a familiar action, so viewers see themselves.
2. **Same start, different choice (10/14):** 2 or 3 rows, or 2 paths, start identical and diverge because of one behaviour. Rows run in sync so the difference is obvious.
3. **Everyday object as the metaphor (12/14):** bow, cart, hoop, rock, book, phone, battery, door. Instantly recognisable, no explaining.
4. **Labels do the hook (9/14):** short row labels ("QUITS AT 99" / "HITS 100") are on screen from frame 0, so the contrast is the hook. At most one small top line.
5. **Text budget:** at most 3 text elements on screen at once and at most 4 phrase changes in the whole reel. Small (26 to 46px), clean, medium weight. No paragraphs, no infographic counters unless the number *is* the story.
6. **A twist or near-miss (8/14):** the expected winner loses, the "almost" moment (99, 1 hit away), or the invisible becomes visible.
7. **Calm, polished motion:** smooth easing, continuous loop-friendly motion, no harsh full-screen flashes. The payoff gets one accent glow plus a small burst.
8. **Premium finish:** black or charcoal background, a glossy floor with soft reflections (`reflect()`), faint ambient streaks (`ambient()`), neon-core strokes (`neon()`), and one accent colour that carries the meaning (green or gold = right, red = wrong).

Length 10 to 14s: setup on screen at 0s, divergence by about 3s, payoff around 70 to 80% of the way through, hold, loop.

- Pure black, 1080x1920, 30fps, 9 to 13 seconds.
- The scene is on screen at frame 0. Never open on black or a title card.
- **Hook at frame 0 (always):** the labels and the setup are fully visible on the first frame. An optional small top line can pose the question ("Both start with 5% energy.").
- White line art plus **one** meaning colour: green `#2BFF88` = right path, red `#FF2D55` = wrong path. Gold, blue and violet are for variety, one per reel.
- Glow only on what matters at that moment. Everything else stays flat white or dim.
- Labels: 1 to 3 words, uppercase, tracked out. Max one payoff sentence, typed in at the end.
- All content between y=300 and y=1450 (Instagram's header and caption cover the rest).
- End by holding on the payoff, then a 0.25s fade so the loop restarts cleanly.

## Story structures (rotate them)

1. **Split comparison:** 2 or 3 rows, same situation, different behaviour, different result. The winning row lands last with green glow and a burst.
2. **Percentage ladder:** 92% / 7% / 1%, or a crowd of dots where most drop out. Shows rarity.
3. **Curve or math:** a live-drawn graph with a counter (compounding, plateau, the dip, J-curve).
4. **Transformation:** one object changes as a behaviour repeats (square to circle, seed to tree, empty bar to full).
5. **Portal conveyor:** an endless stream of identical figures walks through an object that transforms them (book makes golden people, phone makes frazzled ones). It loops seamlessly by design.
6. **Metaphor line:** one sentence typed over a single symbolic animation (bow and arrow, iceberg, bamboo).

## Timing

- 0 to 0.5s: setup visible, motion starts.
- 0.5 to 7s: both paths play. Make the wrong path look winning early so there's a twist.
- 7 to 8.5s: payoff. The winner glows and the loser dims.
- 8.5 to 10s: payoff line types in. Hold, then loop.

## Viral rubric (ship only at 9/10 or higher)

Score each item 0 to 2 and add them up. If a reel scores lower than 9, rework it.

1. **Hook in 1s:** the frame-0 picture alone makes someone stop and want to know what happens.
2. **Twist:** an expectation flips (the early leader loses, the invisible becomes visible, a number explodes).
3. **Payoff clarity:** the message lands with the sound off and without reading the caption.
4. **Share or save trigger:** it says something people want to send to a friend or identify with.
5. **Loop and polish:** 9 to 13s, clean motion, no overlaps, the ending flows back into the start.

## Captions

Line 1 restates the contrast as a punchy two-liner. Then one insight line. End with a question, a "save this" or a "tag someone". Short sentences, no emoji spam, 6 to 8 hashtags.

## Posting

- 2 per day: about 7:30 AM and 7:30 PM in your audience's timezone. Check Insights after 2 weeks and adjust.
- Add a trending **instrumental** audio in the Instagram app at upload, at low to mid volume. Trending audio is a reach lever; files are exported silent so you can pick each day's trend. Use `--music file.mp3` to bake a track in instead.
- Use the cover jpg as the reel cover so the grid stays consistent.
- Reply to every comment in the first hour.
