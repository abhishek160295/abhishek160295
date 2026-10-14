"""Render one 15 s chunk (360 frames) straight into libx264."""
import sys, os, subprocess
import scenes as S
from engine import W, H, FPS

CH = 360
n = int(sys.argv[1])
os.makedirs('chunks', exist_ok=True)
a, b = n * CH, min((n + 1) * CH, S.NFRAMES)
out = 'chunks/c%03d.mp4' % n
p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H),
                      '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
                      '-pix_fmt', 'yuv420p', out + '.tmp.mp4'], stdin=subprocess.PIPE)
for fi in range(a, b):
    p.stdin.write(S.render(fi).tobytes())
p.stdin.close()
assert p.wait() == 0
os.replace(out + '.tmp.mp4', out)
open('chunks/c%03d.done' % n, 'w').close()
