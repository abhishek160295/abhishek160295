#!/usr/bin/env bash
# Usage: ./master.sh in.mp4 out.mp4  — gentle compression + two-pass loudnorm to -14 LUFS / -1.5 dBTP
set -euo pipefail
in=$1; out=$2
pre="acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2"
m=$(ffmpeg -hide_banner -i "$in" -af "$pre,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$m" | grep "\"$1\"" | grep -oE '\-?[0-9.]+' ; }
ffmpeg -y -hide_banner -loglevel error -i "$in" -c:v copy \
  -af "$pre,loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k "$out"
ffmpeg -hide_banner -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I:|Peak:)'
