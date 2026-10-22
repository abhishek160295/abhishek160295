#!/usr/bin/env bash
# Usage: ./build.sh reel004 [--music]  -> out/reel004.mp4 (1080x1920, 30fps)
# Default is a silent master (add trending audio in-app). --music adds the original soundtrack + SFX.
set -euo pipefail
cd "$(dirname "$0")"; id=$1; mode=${2:-}; mkdir -p out .work
[ -f .work/$id.silent.mp4 ] && [ .work/$id.silent.mp4 -nt reels/$id.js ] && [ .work/$id.silent.mp4 -nt engine.js ] || node render.cjs reels/$id.js .work/$id.silent.mp4
if [ "$mode" = "--music" ]; then
  seed=${id//[!0-9]/}; seed=$((10#$seed))
  node render.cjs reels/$id.js .work/$id.json --info
  python3 audio.py .work/$id.json .work/$id.wav $seed
  ffmpeg -v error -y -i .work/$id.silent.mp4 -i .work/$id.wav -c:v copy -af "alimiter=limit=0.95,loudnorm=I=-7.5:TP=-1:LRA=7" -c:a aac -b:a 192k -ar 44100 -shortest -movflags +faststart out/$id.mp4
else
  # silent AAC track keeps every platform's uploader happy
  ffmpeg -v error -y -i .work/$id.silent.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -c:v copy -c:a aac -b:a 64k -shortest -movflags +faststart out/$id.mp4
fi
echo "built out/$id.mp4"
