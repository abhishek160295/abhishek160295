#!/usr/bin/env bash
# Full rebuild: picture -> score -> mux -> contact sheet
set -euo pipefail
cd "$(dirname "$0")"
node render.mjs
python3 audio.py
ffmpeg -y -loglevel error -i out/video_silent.mp4 -i out/score.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -t 15 \
  -movflags +faststart ../discipline_compounds_reel.mp4
rm -rf out/stills
node render.mjs --stills 15,95,140,215,262,300,320,345,420,449 >/dev/null
ffmpeg -y -loglevel error -pattern_type glob -i 'out/stills/frame_*.png' \
  -vf "scale=360:640,tile=5x2:padding=8:margin=8:color=0x111111" -frames:v 1 ../discipline_contact_sheet.png
echo "done -> ../discipline_compounds_reel.mp4"
