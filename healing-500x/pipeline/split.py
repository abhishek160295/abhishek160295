import numpy as np,wave,sys,json
def load(p):
    w=wave.open(p);a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768;return a,w.getframerate()
def segs(p,n):
    a,sr=load(p);h=int(sr*0.02);m=len(a)//h
    e=20*np.log10(np.sqrt((a[:m*h].reshape(m,h)**2).mean(1))+1e-9)
    sil=e<-42;runs=[];i=0
    while i<m:
        if sil[i]:
            j=i
            while j<m and sil[j]:j+=1
            if i>0 and j<m: runs.append((j-i,i,j))
            i=j
        else:i+=1
    runs=sorted(sorted(runs,reverse=True)[:n-1],key=lambda r:r[1])
    # speech bounds per segment
    nz=np.where(~sil)[0]; out=[];start=nz[0]
    for L,i,j in runs: out.append((start*0.02,i*0.02)); start=j
    out.append((start*0.02,(nz[-1]+1)*0.02))
    return out
if __name__=='__main__':
    for f,n in [('J',11),('L',13),('W',3)]:
        s=segs(f'{f}.wav',n); print(f,[(round(a,2),round(b-a,2)) for a,b in s])
