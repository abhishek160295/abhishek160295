#!/usr/bin/env bash
# Usage: ./build.sh day001  -> out/day001.mp4 (1080x1920, 30fps, original soundtrack)
set -euo pipefail
cd "$(dirname "$0")"; id=$1; seed=${id//[!0-9]/}; seed=$((10#$seed)); mkdir -p out .work
node render.cjs reels/$id.js .work/$id.json --info
python3 audio.py .work/$id.json .work/$id.wav $seed
node render.cjs reels/$id.js .work/$id.silent.mp4
ffmpeg -v error -y -i .work/$id.silent.mp4 -i .work/$id.wav -c:v copy -af "alimiter=limit=0.95,loudnorm=I=-7.5:TP=-1:LRA=7" -c:a aac -b:a 192k -ar 44100 -shortest -movflags +faststart out/$id.mp4
echo "built out/$id.mp4"
