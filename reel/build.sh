#!/usr/bin/env bash
# Full rebuild: picture -> score -> mux -> contact sheet
set -euo pipefail
cd "$(dirname "$0")"
node render.mjs                       # out/video_silent.mp4 + out/events.json
python3 audio.py                      # out/score.wav (synced to events.json)
ffmpeg -y -loglevel error -i out/video_silent.mp4 -i out/score.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -t 15 \
  -movflags +faststart ../geometric_aha_reel.mp4
# contact sheet: one frame per beat
node render.mjs --stills 12,60,105,150,176,195,228,255,276,300,330,372,410,449 >/dev/null
ffmpeg -y -loglevel error -pattern_type glob -i 'out/stills/frame_*.png' \
  -vf "scale=360:640,tile=7x2:padding=8:margin=8:color=0x111111" -frames:v 1 ../contact_sheet.png
echo "done -> ../geometric_aha_reel.mp4"
