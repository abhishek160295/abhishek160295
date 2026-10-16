# Project handoff: "What If" animated explainer channel

## Goal
Make YouTube "What if" videos better than the reference: Ifology, "What If You Were 10x Faster?" (10:19).

## Rules from the user
- Ask before spending any connector credits (ElevenLabs etc.).
- No greetings or filler. Keep it concise and high quality. Copy meant for pasting should read as human-written, not AI.

## Reference teardown (done)
- 10:19 runtime, ~1,920 words, ~186 wpm, 195 cuts (one every ~3.2 s), audio at −17.4 LUFS (quiet; target −14).
- Visuals: 3D toon-shaded scenes plus 2D navy line-art stick-figure explainer cards for the numbers. Characters have black-sphere heads with eyes only, so no lip-sync is needed.
- Structure: gag cold open → rules plus a setup ("brain stays normal, it matters later") → numbers vs Usain Bolt → comedy skit → one real study → power-fantasy montage → problems escalate (air, shoes, food) → real problem (stopping and turning) → cheetah solution → restrained-power rescue ("slowest rescue ever recorded") → shared-universe crossover (Project IF team) → villain cliffhanger → comment prompt and subscribe CTA.
- Their mistakes and gaps (our edge):
  - "Faster than most race cars" is false (F1 tops 320+ km/h).
  - Drag power scales with v³, not v², so it's 1,000x. At 250 km/h that's ~49 kW (~66 hp), about 135,000 kcal for a 200 km day. They claimed 14,000.
  - Downhill braking is ignored in the rescue scene.
  - Joint and contact forces aren't covered.
  - Audio is too quiet; captions are basic.
- Their numbers that check out: 14 m reaction gap, 300 m stopping distance, 1 km+ turn diameter, 100 m in 1.44 s, sound barrier at ~50x.

## Assets
- Transcript (ElevenLabs Scribe, word timestamps): https://elevenlabs.io/app/flows/1O1o7A44T272K3QnWW8h
- About 3,404 credits spent on that transcription.

## Capability verdict
- Can beat them on: script, science, ElevenLabs VO and character voices, SFX, 2D motion graphics (Remotion), captions, thumbnails (Canva/Figma).
- Can't fully match: consistent 3D character animation. The plan is a hybrid: a Remotion backbone plus AI video shots for hero moments.
- The full ElevenLabs connector (image/video/music) is now added as ELEVEN_LABS_FULL.

## 3D test shot (done, no credits)
- `pilot/` is a Remotion + three.js project. Toon-shaded 3D character "Max", built in code so it stays consistent in every shot, plus a track scene, dust and shockwave effects, word-pop captions and a navy line-art stat card.
- Output: `pilot/out/test-shot.mp4` (10 s, 1080p30).
- Render cost here: ~0.4 s per frame on 4 CPUs with SwiftShader, so a 10-min episode takes ~1 h.
- Render: `npx remotion render src/index.ts TestShot out/test-shot.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --gl=swiftshader --concurrency=4`

## Demo with audio (done)
- `pilot/out/demo-final.mp4`: 12.6 s, voiceover (ElevenLabs eleven_v4, voice "Eddie"), SFX, and captions retimed to the VO. Loudness is −13.6 LUFS, peak −1.4 dBTP.
- Credits: ~823 (4 VO takes at 189 each, 4 SFX at ~17 each). The ElevenLabs flow is dvJCWrJehohD2N4xbyel.
- Take 1 is used. Takes 2–4 are in `pilot/public/audio` as alternates. The ambience SFX came back only 0.5 s, so `amb.wav` is synthesized brown noise.
- Pricing found: music runs ~1,500 credits per take, which is expensive. Use sparingly.
- Master: ffmpeg compressor plus two-pass loudnorm to −14 LUFS (see the commit for the command).

## Next step
1. User gives the topic.
2. Write the script.
3. Show estimated credit costs (VO, SFX, music, AI hero shots) and get approval.
4. Build a 60-second pilot with natural-sounding VO.
