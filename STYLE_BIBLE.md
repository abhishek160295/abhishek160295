# Style bible: the house standard

**Base reference:** "1 MINUTE" (5:00 short). Everything we make starts at this level and goes one step above it. This document is measured from the reference, not guessed.

## 1. What the reference actually is (measured)

| Area | Reference |
|---|---|
| Runtime | 4:59, 67 shots |
| Cutting | Mean shot 4.5 s, median 3.2 s. A fast montage section (0.5–2 s cuts, 37–60 s) against long emotional holds (up to 24 s). |
| Motion | **Every shot moves:** character animation plus camera trucks, pans, cranes and slow pushes. No static frames. |
| Medium | Stylized real 3D: simple low-detail models, soft global lighting with ambient occlusion, real depth of field, fog and atmosphere. |
| Characters | **Pure black silhouettes.** A round head, thick soft limbs and no outline. Only the white eyes act: small eyes with eyelids, plus sometimes a short mouth line. A secondary character is identified by one white accessory (a headband and ponytail). |
| Shots | Wide establishing shot, then over-the-shoulder with a blurred foreground silhouette, close-up, insert (phone alarm, calendar, smartwatch, hands), POV, and running tracking shots. Coverage is like real filmmaking. |
| Colour arc | Colour carries the story: cold grey-blue (failure), autumn gold (transition), wet night with warm lamps (struggle), vivid green and blue sky (payoff). |
| Text: dialogue | Short lines in a comic-style hand font, white on a soft dark blurred pill, placed near the speaker. No voice acting. |
| Text: inner voice | A different colour (orange) and stacked: "Weather's awful. / Too cold. / Tomorrow." |
| Text: quotes | Black card with an elegant serif, centred and small: "Big plans feel better than small steps." Attributed quotes in small caps. |
| Title | Wide-spaced serif caps ("1 MINUTE") with a one-line tagline. |
| Story | One concrete, relatable goal (10K a day), visible failure (an X-filled calendar), a mentor's tiny reframe ("Just one minute a day?"), a habit built through repetition, a test (rain) passed, then a callback to the opening location. |
| Recurring props | A phone alarm (5:30, RUN 10K, SNOOZE), a wall calendar (X's turning into ticks), a smartwatch timer, shoes on the doormat. These props track progress. |
| Audio | Music-led score with sound effects and no continuous narration. -18 LUFS with a 13 LU loudness range, so it's dynamic and cinematic, not crushed. |

## 2. One level up (our standard)

1. **Image:** native 1080p, 24 fps, clean anti-aliasing and real depth of field. Add volumetric light, rain that splashes, wind in the grass, and dust in the light beams.
2. **Acting:** silhouettes with more eye acting (blinks, eyelid shapes, brows made of negative space), breathing, weight shifts and anticipation. Every gesture reads at phone size.
3. **Camera:** we keep their film grammar and add motivated moves: a rack focus on reveals, a handheld micro-drift in tense moments, and match cuts between acts.
4. **Colour script:** a planned palette per act, written down before production, with grading on every shot.
5. **Text system:** the same three layers (dialogue pills, inner voice, serif quotes) with refined timing (a 0.25 s ease in and out, reading speed of about 15 characters per second) and burned-in captions where there's a voice.
6. **Sound (our biggest lift):** a designed score with leitmotifs, plus room tone and foley in every scene: shoes, door chimes, rain, footsteps, a watch beep. Optional narration in a high-quality voice (ElevenLabs on a paid plan, or a voice clone). Mix to -14 LUFS for YouTube, keeping dynamics.
7. **Story craft:** hook in under 5 seconds, a measurable counter or prop that changes, a midpoint test, and an ending that calls back to the opening.

## 3. Production pipeline (how we build it)

- **Engine:** real-time 3D (three.js, rendered headless; see `film3d/`) with soft shadows, ambient occlusion, depth of field, fog, bloom and a grade pass. Each frame is rendered offline and deterministically.
- **Characters:** a reusable silhouette rig (capsule body, sphere head, IK limbs, white eye decals with eyelids) and an accessory system for identity.
- **Sets:** a modular library (store, bedroom, kitchen, street, park, hill) built from simple flat-shaded models, reused across videos.
- **Shots:** a scene list of (name, duration, camera, action) keyed to scene start times, with stills checked before every render.
- **Audio:** score, foley and voice composed per scene, then loudness-normalized.
- **QA before delivery:** a contact sheet of every shot; reading-time and contrast checks on every caption; loudness and true-peak measured.
