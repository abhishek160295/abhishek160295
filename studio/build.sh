#!/usr/bin/env bash
# Usage: ./build.sh reel009 [--music]
#  -> out/reel009.mp4       1080x1920 (Reels / TikTok)
#  -> out/reel009.1440.mp4  1440x2560 (YouTube Shorts; triggers sharper VP9 processing)
# Frames are drawn at 2160x3840 and lanczos-downscaled, so every edge is supersampled.
set -euo pipefail
cd "$(dirname "$0")"; id=$1; mode=${2:-}; mkdir -p out .work
m=.work/$id.silent.mp4
[ -f $m ] && [ $m -nt reels/$id.js ] && [ $m -nt engine.js ] || SCALE=2 node render.cjs reels/$id.js $m
mux() { # $1 video in, $2 out
  if [ "$mode" = "--music" ]; then
    seed=${id//[!0-9]/}; seed=$((10#$seed))
    [ -f .work/$id.wav ] || { node render.cjs reels/$id.js .work/$id.json --info; python3 audio.py .work/$id.json .work/$id.wav $seed; }
    ffmpeg -v error -y -i $1 -i .work/$id.wav -c:v copy -af "alimiter=limit=0.95,loudnorm=I=-7.5:TP=-1:LRA=7" -c:a aac -b:a 192k -ar 44100 -shortest -movflags +faststart $2
  else
    ffmpeg -v error -y -i $1 -f lavfi -i anullsrc=r=44100:cl=stereo -c:v copy -c:a aac -b:a 64k -shortest -movflags +faststart $2
  fi
}
mux $m out/$id.mp4
[ -f .work/$id.silent.1440.mp4 ] && mux .work/$id.silent.1440.mp4 out/$id.1440.mp4
echo "built out/$id.mp4"
