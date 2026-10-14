#!/bin/bash
# Concat chunks, loudnorm the mix to -14 LUFS / -1 dBTP, mux, then make the delivery copy.
set -e
cd "$(dirname "$0")"
rm -f out/finish.ok
ls chunks/c*.mp4 | grep -v tmp | sort | sed "s|^|file '$PWD/|;s|$|'|" > chunks/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i chunks/list.txt -c copy out/video.mp4
J=$(ffmpeg -hide_banner -i out/mix.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i out/mix.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=192000,alimiter=limit=0.7:attack=1:release=80:level=0,lowpass=f=15500:poles=2,volume=0.3dB,aresample=48000" -ar 48000 out/mix_norm.wav
ffmpeg -y -loglevel error -i out/video.mp4 -i out/mix_norm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -cutoff 16000 -shortest -movflags +faststart out/Discipline_1080p_master.mp4
ffmpeg -y -loglevel error -i out/Discipline_1080p_master.mp4 -c:v libx264 -preset veryfast -crf 25 -pix_fmt yuv420p -c:a copy -movflags +faststart out/Discipline_1080p.mp4
touch out/finish.ok
