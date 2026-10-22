import sys,json,wave,numpy as np,sherpa_onnx as so
M=sys.argv[1]; wav=sys.argv[2]; out=sys.argv[3]
r=so.OfflineRecognizer.from_transducer(encoder=f'{M}/encoder-epoch-99-avg-1.int8.onnx',decoder=f'{M}/decoder-epoch-99-avg-1.onnx',joiner=f'{M}/joiner-epoch-99-avg-1.int8.onnx',tokens=f'{M}/tokens.txt',num_threads=4,decoding_method='greedy_search')
w=wave.open(wav);sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
# chunk at quiet points ~15s
h=int(0.02*sr);e=np.sqrt((a[:len(a)//h*h].reshape(-1,h)**2).mean(1))
cuts=[0];i=0
while True:
    lo=cuts[-1]+int(10/0.02);hi=cuts[-1]+int(20/0.02)
    if hi>=len(e):break
    cuts.append(lo+int(np.argmin(e[lo:hi])))
cuts.append(len(e))
words=[]
for c0,c1 in zip(cuts[:-1],cuts[1:]):
    s=r.create_stream(); s.accept_waveform(sr,a[c0*h:c1*h]); r.decode_stream(s); res=s.result
    t0=c0*0.02; cur=None
    for tok,ts in zip(res.tokens,res.timestamps):
        if tok.startswith(('▁',' ')) or cur is None:
            if cur: words.append(cur)
            cur={'w':tok.replace('▁','').strip(),'t':round(t0+ts,2)}
        else: cur['w']+=tok
    if cur: words.append(cur)
json.dump(words,open(out,'w'))
# print as lines grouped by pauses
line=[];last=0
for x in words:
    if line and x['t']-last>0.7: print(f"[{line[0]['t']:.1f}] "+' '.join(y['w'] for y in line).lower()); line=[]
    line.append(x);last=x['t']
print(f"[{line[0]['t']:.1f}] "+' '.join(y['w'] for y in line).lower())
