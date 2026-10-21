import json, sys, subprocess, numpy as np, time
D, srcv, out = sys.argv[1], sys.argv[2], sys.argv[3]
lim = float(sys.argv[4]) if len(sys.argv) > 4 else None
sys.path.insert(0, D); import patches

FPS = 24; W, H = 1920, 1080
tl = json.load(open(f'{D}/timeline.json'))
T = tl[-1]['T1'] if lim is None else lim
nout = int(T * FPS)

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', srcv, '-vf', f'scale={W}:{H}:flags=lanczos', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE, bufsize=W * H * 3 * 2)
grade = 'eq=contrast=1.05:saturation=1.10:gamma=0.98,vignette=angle=PI/5:mode=forward'
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-i', f'{D}/mix.m4a', '-map', '0:v', '-map', '1:a', '-vf', grade, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
                        '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'copy', '-shortest', out], stdin=subprocess.PIPE)

cur_idx, cur = -1, None
def frame_at(idx):
    global cur_idx, cur
    while cur_idx < idx:
        b = dec.stdout.read(W * H * 3)
        if len(b) < W * H * 3: return cur
        cur = np.frombuffer(b, np.uint8).reshape(H, W, 3); cur_idx += 1
    return cur

k = 0; t0 = time.time()
for n in range(nout):
    Tn = (n + 0.5) / FPS
    while k < len(tl) - 1 and Tn >= tl[k]['T1']: k += 1
    s = tl[k]
    t = s['vs'] + (Tn - s['T0']) * (s['ve'] - s['vs']) / (s['T1'] - s['T0'])
    fr = frame_at(int(t * FPS)).copy()
    patches.apply(fr, t)
    enc.stdin.write(fr.tobytes())
    if n % 480 == 0: print(n, nout, f'{time.time() - t0:.0f}s', flush=True)
enc.stdin.close(); enc.wait(); dec.kill(); print('done', flush=True)
