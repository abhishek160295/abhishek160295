import json,wave,numpy as np
L=json.load(open('script2.json'))
def load(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
A={k:load(f'vo/{k}.wav') for k in ['N1','N2','J','W','NX','WX']}
for s in L:
    x=A[s['src']][int(s['a']*44100):int(s['b']*44100)]
    e=np.sqrt(np.convolve(x**2,np.ones(882)/882,'same')); idx=np.where(e>0.12*e.max())[0]
    s['b']=s['a']+idx[-1]/44100+0.08; s['a']=s['a']+max(idx[0]/44100-0.05,0)
HOLD={"You scoop it back":1.5,"But the frozen world is strange":3.0,"He laughs it off":1.5,"Today, you open the truck":4.5,
      "Someone stopped it first":1.5,"someone says your name":1.5,"She looks sixty":0.8,"At least, that's what you think":1.2}
END=595.0; T=0.6; out=[]
for i,s in enumerate(L):
    d=s['b']-s['a']; vs=s['anchor']; ve=L[i+1]['anchor'] if i+1<len(L) else END
    nxt=L[i+1] if i+1<len(L) else None
    gap=1.6 if (nxt and nxt['scene']!=s['scene']) else 0.55
    if s['sp']!='N' or (nxt and nxt['sp']!='N'): gap=max(gap,0.7)
    gap+=sum(v for k,v in HOLD.items() if k in s['text'])
    slot=d+gap+(0.6 if i==0 else 0); span=ve-vs
    if span/slot<0.75 and nxt: slot=min(span/0.75,slot+1.2)
    if s.get('last'): slot+=3.5
    speed=min(max(span/slot,0.75),1.35)
    out.append(dict(s,i=i,vs=vs,ve=ve,T0=T,T1=T+slot,aT=T+(0.6 if i==0 else 0),speed=speed)); T+=slot
out[0]['T0']=0.0
json.dump(out,open('timeline2.json','w'),indent=0); print('total',round(T,1))
