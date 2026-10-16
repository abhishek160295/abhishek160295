#!/usr/bin/env bash
# Renders Episode50x in resumable chunks, then concatenates to out/ep50x-raw.mp4
set -u
cd "$(dirname "$0")"
TOTAL=$(npx tsx -e "import {TOTAL_FRAMES} from './src/ep/timing'; console.log(TOTAL_FRAMES)")
CH=1500
mkdir -p out/chunks
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
[ -d out/bundle ] || npx remotion bundle src/index.ts --out-dir out/bundle > out/chunks/bundle.log 2>&1
i=0
for ((s=0; s<TOTAL; s+=CH)); do
  e=$((s+CH-1)); [ $e -ge $TOTAL ] && e=$((TOTAL-1))
  f=$(printf "out/chunks/c%02d.mp4" $i)
  if [ ! -s "$f" ]; then
    echo "chunk $i frames $s-$e start $(date +%T)" >> out/chunks/progress.log
    npx remotion render out/bundle Episode50x "$f.tmp.mp4" --frames=$s-$e --browser-executable=$B --gl=swiftshader --concurrency=4 --crf=18 --timeout=120000 --log=error >> out/chunks/render.log 2>&1 && mv "$f.tmp.mp4" "$f"
    echo "chunk $i done $(date +%T)" >> out/chunks/progress.log
  fi
  i=$((i+1))
done
ls out/chunks/c*.mp4 | grep -v tmp | sed "s|^|file '$PWD/|; s|$|'|" > out/chunks/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/chunks/list.txt -c copy out/ep50x-raw.mp4 && echo "ALL DONE $(date +%T)" >> out/chunks/progress.log
