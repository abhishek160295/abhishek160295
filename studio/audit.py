# Safe-zone + hook audit for every rendered reel: python3 audit.py (run from studio/)
import subprocess, numpy as np, sys
W,H=1080,1920
def frames(f, fps=4):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f,'-vf',f'fps={fps},format=gray','-f','rawvideo','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.uint8).reshape(-1,H,W)
for n in range(1,9):
    f=f'out/reel{n:03d}.mp4'; fr=frames(f)
    first=frames(f,30)[0]
    hook=(first[300:600]>120).sum()  # title band lit on frame 0?
    issues={}
    for i,im in enumerate(fr):
        t=i/4
        z={'right-rail':im[950:1650,950:]>110,'top-UI':im[:230]>110,'bottom-UI':np.r_[im[1560:]]>110,'left-edge':im[300:1500,:30]>110}
        for k,m in z.items():
            if m.sum()>150: issues.setdefault(k,[]).append(t)
    rng=lambda ts: ', '.join(f'{a:.1f}-{b:.1f}s' for a,b in merge(ts))
    def merge(ts):
        out=[];
        for t in ts:
            if out and t-out[-1][1]<=.3: out[-1][1]=t
            else: out.append([t,t])
        return out
    print(f'reel{n:03d}: frame0 title px={hook}', '; '.join(f'{k}: {rng(v)}' for k,v in issues.items()) or 'clean')
