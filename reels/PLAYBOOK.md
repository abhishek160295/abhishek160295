# Playbook

These rules come from the 10 reference reels (`reference-analysis.md`). Every reel follows them.

## Visual rules

**Reference look (match the reference reels):**
- One big hero object, centred, filling 50 to 70% of the width. No infographic layouts, no big bold counters.
- Neon-tube strokes: coloured bloom plus a white-hot core (`neon()` in lib.js).
- Faint blurred streaks drifting in the background (`ambient()`).
- Text is one medium-weight sentence (46px) centred above the object around y=400. It changes phrase by phrase (`captionSeq()`). Never put text on top of the object.
- Glossy floor reflections under figures and objects (`reflect()`).
- Live counters beside the action for "almost" stories (99 in red, 100 in bright white).
- Alternate between pure black and the charcoal variant (`bg: 'charcoal'` in the scene) with gold accents, so the grid doesn't look repetitive.
- Payoffs can be destructive: progressive cracks, then a shatter into particles (`shatter()`).

- Pure black, 1080x1920, 30fps, 9 to 13 seconds.
- The scene is on screen at frame 0. Never open on black or a title card.
- **Hook line at frame 0 (always):** the first phrase of the top sentence (medium weight, 46px, white, around y=400), fully visible from the first frame and never typed in. It must create a question the animation answers ("This plant does nothing for 4 years."). Fade it out only if the payoff needs the space.
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
5. **Metaphor line:** one sentence typed over a single symbolic animation (bow and arrow, iceberg, bamboo).

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
