import json,wave,numpy as np
rows=[l.rstrip('\n').split('\t') for l in open('script.tsv')]
seg={int(k):v for k,v in json.load(open('vo/lineseg.json')).items()}
anc=[float(x) for x in open('anchors.txt')]
def load(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
A={k:load(f'vo/{k}.wav') for k in ['N1','N2','J','W']}
for i,s in seg.items():  # trim trailing/leading silence
    x=A[s['src']][int(s['a']*44100):int(s['b']*44100)]
    e=np.sqrt(np.convolve(x**2,np.ones(882)/882,'same')); idx=np.where(e>0.12*e.max())[0]
    if len(idx): s['b']=s['a']+idx[-1]/44100+0.08; s['a']=s['a']+max(idx[0]/44100-0.05,0)
END=595.0
T=0.6; tl=[]; sp=[]
for i,r in enumerate(rows):
    s=seg[i]; d=s['b']-s['a']
    vs=anc[i]; ve=anc[i+1] if i+1<len(anc) else END
    newscene= i+1<len(rows) and rows[i+1][0]!=r[0]
    gap=0.75 if newscene else 0.32
    if r[1]!='N' or (i+1<len(rows) and rows[i+1][1]!='N'): gap=max(gap,0.45)
    slot=d+gap
    if i==0: slot+=0.6
    span=ve-vs
    if span/slot<0.75 and i<len(rows)-1: slot=min(span/0.75, slot+1.2)  # breathe a bit instead of freezing
    if i==len(rows)-1: slot+=3.5
    speed=min(max(span/slot,0.75),1.35)
    tl.append(dict(i=i,sp=r[1],src=s['src'],a=s['a'],b=s['b'],vs=vs,ve=ve,T0=T,T1=T+slot,aT=T+(0.6 if i==0 else 0),speed=speed))
    sp.append(span/slot); T+=slot
tl[0]['T0']=0.0
json.dump(tl,open('timeline.json','w'),indent=0)
print('total',round(T,1)); print('fast(trim)>1.35:',[(t['i'],round(x,2)) for t,x in zip(tl,sp) if x>1.35])
print('slow(freeze)<0.75:',[(t['i'],round(x,2)) for t,x in zip(tl,sp) if x<0.75])
