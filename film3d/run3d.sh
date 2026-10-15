#!/bin/bash
# Resumable 3D render: 13 chunks of 192 frames (8 s), 4 browsers in parallel.
cd "$(dirname "$0")"
mkdir -p chunks
TOTAL=2496
for i in $(seq 0 12); do
  a=$((i*192)); b=$(( (i+1)*192 < TOTAL ? (i+1)*192 : TOTAL ))
  f=chunks/c$(printf %02d $i).mp4
  [ -f $f.done ] || echo "$a $b $f"
done | xargs -P 4 -L 1 sh -c 'node render3d.mjs $0 $1 $2 >> chunks/log.txt 2>&1'
touch chunks/ALL.done
