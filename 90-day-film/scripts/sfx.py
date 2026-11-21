"""Procedural score + SFX for the 12.9s cut. Writes public/audio/score.wav (48k stereo)."""
import numpy as np, wave, sys
SR=48000; DUR=12.9; N=int(SR*DUR); t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(7)
def add(sig,start,gain=1.0,pan=0.0):
    s=int(start*SR); e=min(N,s+len(sig)); sig=sig[:e-s]*gain
    L[s:e]+=sig*(1-pan)/1; R[s:e]+=sig*(1+pan)/1
def env(n,a=0.005,d=0.3):
    x=np.arange(n)/SR; return np.minimum(1,x/a)*np.exp(-x/d)
def heartbeat(at):
    for o,g in((0,1),(0.22,0.7)):
        n=int(0.35*SR);x=np.arange(n)/SR
        add(np.sin(2*np.pi*(55-20*x)*x)*env(n,0.004,0.09),at+o,0.9*g)
def boom(at,g=1.0):
    n=int(1.6*SR);x=np.arange(n)/SR
    f=38+80*np.exp(-x*9); ph=2*np.pi*np.cumsum(f)/SR
    s=np.tanh(2.2*np.sin(ph))*env(n,0.003,0.55)
    s+=rng.normal(0,1,n)*env(n,0.001,0.04)*0.5
    add(s,at,g)
def tick(at,g=0.25,f=2400):
    n=int(0.03*SR);add(np.sin(2*np.pi*f*np.arange(n)/SR)*env(n,0.0005,0.006)+rng.normal(0,.3,n)*env(n,.0005,.004),at,g,rng.uniform(-.4,.4))
def whoosh(at,d=0.45,g=0.5):
    n=int(d*SR);x=np.linspace(0,1,n);w=rng.normal(0,1,n)
    # crude band sweep via moving average of varying width
    out=np.zeros(n);acc=0
    k=(np.sin(np.pi*x)**2)
    s=np.convolve(w,np.ones(12)/12,'same')
    add((w-s)*k*0.6+s*k,at,g,0.0)
def activate(at,f0=440,g=0.35):
    n=int(0.5*SR);x=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f0*m*x*(1+0.4*x))/m for m in (1,1.5,2,3))
    add(s*env(n,0.004,0.18),at,g)
def riser(at,d,g=0.4):
    n=int(d*SR);x=np.arange(n)/SR
    f=200+1800*(x/d)**2; s=np.sin(2*np.pi*np.cumsum(f)/SR)*0.4+rng.normal(0,1,n)*0.3
    add(s*(x/d)**2,at,g)
# --- pad / music bed ---
def pad(f,start,end,g):
    s=int(start*SR);e=int(end*SR);x=np.arange(e-s)/SR
    v=sum(np.sin(2*np.pi*f*m*x+m)*a for m,a in((1,1),(2,.35),(3,.15),(1.005,.8)))
    fade=np.minimum(1,np.minimum(x/0.4,(x[-1]-x)/0.4))
    L[s:e]+=v*fade*g; R[s:e]+=np.roll(v,90)*fade*g
pad(55,0,4.7,0.05)                      # dark tension
for f in(110,164.8,220): pad(f,4.5,9.0,0.035)   # electronic bed
for f in(130.8,196,261.6,329.6): pad(f,8.8,12.9,0.045)  # resolution (C major)
# pulse 120bpm during montage
for i in range(int((8.85-4.7)/0.25)):
    at=4.7+i*0.25; n=int(0.12*SR);x=np.arange(n)/SR
    add(np.sin(2*np.pi*55*x)*env(n,0.002,0.05),at,0.35 if i%2==0 else 0.18)
    tick(at+0.125,0.08,6000)
# --- timeline cues (seconds) ---
heartbeat(0.05); heartbeat(0.9)
for i in range(18): tick(0.3+i*0.07,0.12)          # typing
riser(1.5,1.1,0.35); boom(2.6,1.0); boom(3.7,0.5)                  # "SO HE BUILT HIMSELF"
cues=[4.70,5.25,5.95,6.45,6.95,7.65,8.20]                    # logo arrivals
for k,c in enumerate(cues): whoosh(c-0.25,0.4,0.45); activate(c,330*2**(k/6),0.3)
riser(8.3,0.55,0.3); boom(8.85,0.9)                   # ecosystem / offer
activate(10.2,660,0.22); boom(11.3,0.75)              # plan / brand
mix=np.stack([L,R],1)
fo=int(0.3*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
mix/=np.max(np.abs(mix))*1.12
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok')
