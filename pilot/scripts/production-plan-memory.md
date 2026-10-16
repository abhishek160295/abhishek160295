# Production plan: What If Your Memory Was 100x Better?

Goal: beat the reference video on every measurable count, inside **8,000 credits**, with every step checked before money or render time is spent.

---

## 0. The scorecard (what "better" means, measured before upload)

| Metric | Reference | Our target | How we check |
|---|---|---|---|
| Average shot length | 3.2 s | **≤ 2.5 s** (~200 shots in 8:30) | ffmpeg scene detect |
| Cuts in the first 30 s | 15 | **≥ 18** | ffmpeg scene detect |
| Heart-stopping moments | several | 1 big (bus) + 7 slow-mo beats | shot list |
| Jokes | light | 1 every 15–20 s | script audit |
| Facts as graphics | mixed | **100%** (labels only, no text blocks) | contact-sheet review |
| Character consistency | stable | one Max model, every shot | contact-sheet review |
| Loudness | −14.3 LUFS | −14 LUFS, voice always clear | ebur128 |
| Retention devices | cliffhangers | open loop + 2 re-hooks + callback ending | script |

If any row fails, it gets fixed before upload. No exceptions.

---

## 1. The big decision: switch from 3D to a 2D cartoon style

| | 3D (episode 1) | **2D vector (new)** |
|---|---|---|
| Look | flat lighting, blank faces | bold outlines, big expressive eyes, like the thumbnail and the channels that are winning |
| Render time (8:30) | ~60+ min on this CPU-only machine | **~15–25 min** (estimate, measured in the test shot) |
| Face acting | hard | easy: eyes, brows and mouth are just shapes |
| Cinematic camera | real | fake-3D with parallax layers, zooms, tilts and orbits, which reads just as well in cartoon style |
| Speed per episode | slow | fast enough for 2–3 videos a week |

**Decision: 2D.** Built in Remotion (the same tool as episode 1) with SVG shapes. No AI video, no credits.

---

## 2. Max, locked forever (production rule 4)

One file, `src/max/Max.tsx`, is the only Max that exists. Every shot uses it.

- **Design:** round black head, big white eyes with pupils, lids and brows, a small mouth, yellow zip jacket, blue jeans, red shoes, thick dark outline. It matches the thumbnail.
- **Rig:** head, eyes (pupils move and blink), brows, 8 mouth shapes; arms and legs bend at elbows and knees.
- **Expressions (10):** smug, happy, shocked, panic, sad, tired, blank (loading), wince, laugh, hollow-eyed.
- **Poses and actions:** stand, walk, run, sit, sleep, point, wave (the gag needs a perfect wave), stumble, hold prop, facepalm.
- **Side characters, same style:** the teacher, Mum, Dave, the memory athlete, the waving woman, and Sir Biscuit the dog.
- **Model sheet:** one image with every expression and pose, approved by you before anything else is built.

---

## 3. Visual kit, built once and reused every episode

**Graphics** (production rule 3: every fact is a picture):
- Animated pieces: a draining glass, a forgetting-curve ski slope, a dial (1x→100x), a loading bar, a counter, a stamp, a split screen, a sieve, a world map with lights, a grid of faces with a "NO MATCH" stamp, a TV stack, a padlock wave, flags slamming in.
- Every piece animates in under 0.5 s with a pop and a sound.

**Camera moves** (cinematic rule):
- Push-in, pull-back, whip pan, low hero angle, Dutch tilt, orbit (fake-3D parallax), and a zoom punch on every beat.
- **Time effects:** speed ramp (fast → slow → snap back), freeze frame with zoom, and slow motion. Episode 1 already proved these work.

**Sets (flat parallax layers):** the bathroom, exam hall, bedroom, pub, street crossing, rooftop at dawn, the brain interior with janitors, and a sepia 1920s office.

**Transitions:** whip pan, match cut, smash cut to black, and a memory-screen wipe.

---

## 4. Voice, at the lowest cost that still sounds great

**A finding that saves the most money:** ElevenLabs' speech tool makes **4 takes by default**, so every line costs 4×. That's likely where much of the 30k went. From now on it's **always 1 take** (`generations_count: 1`).

**Steps:**
1. **Free animatic first.** A silent version timed at narration pace, so you can check look and pace before any voice credits. Cost: 0.
2. **Voice test.** The opening section only, about 450 characters, 1 take. Price estimated and shown to you first. About 450 credits.
3. **Full narration.** Generated once, per section (9 sections), 1 take each. About 5,400 credits.
4. **Fixes.** Only re-do the one bad line and splice it in, never a whole section. Budget about 300 credits.
5. **Word timings with the free `align.py`.** No Scribe; it's accurate to about 0.06 s.

**Voice settings:** same narrator as episode 1, `eleven_v4`, with only a few emotion tags so it sounds natural.

---

## 5. Sound (all free)

- **Music:** reuse episode 1's fun, tense and end tracks. Fun for 0–2:30, tense from 2:30 to 6:40 (with a drop to silence at the bus), and end from 6:40. Ducked under the voice.
- **Sound effects:** reuse 23 existing files (whoosh, bus, tick, pop, slap, scratch, counter, dog, and so on). New ones needed: page flips, a ding, a sad trombone, a crowd cheer and a heartbeat, from free Pixabay or at most 5 generated (about 85 credits).
- **Sound design:** a whoosh on every whip pan, a pop on every graphic, a low hit on every freeze, and a stretched horn plus silence on the bus.
- **Mastering:** the existing `master.sh` brings the mix to −14 LUFS.

---

## 6. Build order, with a checkpoint before every expensive step

| Step | What | You approve | Credits | Time |
|---|---|---|---|---|
| 1 | Max model sheet + 2 side characters | ✅ the look | 0 | ~1 session |
| 2 | **Test shot:** the first 20 s (cold open), fully animated, timed silent | ✅ style, pace, cuts | 0 | ~1 session |
| 3 | Voice test (opening section) | ✅ the voice | ~450 | minutes |
| 4 | Full narration + alignment | ✅ the read | ~5,400 | ~30 min |
| 5 | Build sections 2–9, each checked as a contact sheet (stills) before rendering | spot checks | 0 | 2–3 sessions |
| 6 | Full render (chunked, resumable) | — | 0 | ~15–25 min |
| 7 | QA against the scorecard (section 0) | ✅ the final cut | 0 | ~10 min |
| 8 | Thumbnail: 1 AI image + text in code | ✅ the thumbnail | ~190 | minutes |
| 9 | Upload package: title, description, chapters, pinned facts | ✅ the copy | 0 | minutes |

**Total credits: about 6,400.** That leaves a buffer of about 1,600 under the 8,000 cap. Every spend is estimated first, approved by you, and logged in `pilot/CREDITS.md`.

---

## 7. Shot plan logic (how we hit 2.5 s or less)

- 85 narration lines, each with at least 1 shot, and long lines split into 2–3.
- **Montages** (upside week, sandwiches, languages) run 0.3–0.5 s per shot.
- **Zoom punches** every 2–3 s inside longer shots count as micro-cuts and keep the eye busy.
- **Slow-motion beats** are the only shots allowed to run past 3 s, and they earn it.
- Expected: about 200–230 shots in 8:30, averaging **2.2–2.5 s**.

---

## 8. Retention map (minute by minute)

| Time | Beat | Device |
|---|---|---|
| 0:00 | Toilet textbook, 4-minute exam | joke + payoff |
| 0:30 | "…nearly gets him killed" + bus flash | **open loop** |
| 0:35 | How good is 100x? Glass, ski slope, cards | graphics barrage |
| 1:20 | The upside week, a fast montage | dopamine, speed |
| 2:30 | "The real problem hasn't started yet" | **re-hook 1** |
| 2:40 | Brain janitors, the Wave | callback gag + slow motion |
| 3:30 | The real man (Shereshevsky), faces don't match | surprise science |
| 4:30 | "…on a Tuesday. At a crossing." | **re-hook 2** |
| 4:45 | **Bus near-miss** | heart-stopping set piece |
| 5:30 | Sandwiches, jokes, the jagged rock | emotion + comedy |
| 6:10 | Every memory at once | big visual set piece |
| 6:40 | The sieve, forgetting is a feature | payoff |
| 7:40 | The Wave happens again | callback twist |
| 8:15 | "Where are my keys?" | outro gag |

---

## 9. Risks and how we handle them

| Risk | Plan |
|---|---|
| The 2D style looks cheap | The test shot (step 2) proves it before full build, at no credit cost |
| The voice sounds flat | The voice test (step 3) costs only ~450 credits; tweak tags before the full run |
| Credits run over | 1 take per line, fix single lines only, hard cap logged |
| A render crash or time limit | Chunked, resumable rendering (proven on episode 1) |
| Facts challenged in comments | All sourced in the script; pinned comment ready |

---

## 10. After this episode

The Max rig, graphics kit, sets, sound kit and pipeline are all reusable. Episode 3 needs only a script, a new set or two, a voice and a thumbnail, which makes 2–3 videos a week realistic, the pace that's working for the competitors.
