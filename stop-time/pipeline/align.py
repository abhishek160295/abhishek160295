import json,re,difflib,wave
norm=lambda s:re.sub(r"[^a-z0-9' ]",' ',re.sub(r'\[.*?\]','',s).lower().replace('-',' ')).split()
rows=[l.rstrip('\n').split('\t') for l in open('script.tsv')]
groups={'N1':[i for i,r in enumerate(rows) if r[1]=='N' and int(r[0])<=5],'N2':[i for i,r in enumerate(rows) if r[1]=='N' and int(r[0])>5],
        'J':[i for i,r in enumerate(rows) if r[1]=='J'],'W':[i for i,r in enumerate(rows) if r[1]=='W']}
out={}
for src,idx in groups.items():
    W=json.load(open(f'vo/{src}_words.json')); aw=[re.sub(r"[^a-z0-9']",'',w['w'].lower()) for w in W]
    dur=wave.open(f'vo/{src}.wav').getnframes()/44100
    toks=[];owner=[]
    for li in idx:
        t=norm(rows[li][2]); toks+=t; owner+=[li]*len(t)
    sm=difflib.SequenceMatcher(None,toks,aw,autojunk=False); m={}
    for a,b,n in sm.get_matching_blocks():
        for k in range(n): m[a+k]=b+k
    starts={}
    for k,li in enumerate(owner):
        if k in m and li not in starts: starts[li]=W[m[k]]['t']
    miss=[li for li in idx if li not in starts]
    if miss: print('MISSING',src,miss)
    for j,li in enumerate(idx):
        s=starts[li]-0.08
        e=(starts[idx[j+1]]-0.1) if j+1<len(idx) else dur
        out[li]=dict(src=src,a=max(s,0),b=e)
json.dump(out,open('vo/lineseg.json','w'))
for li in sorted(out)[:8]: print(li,rows[li][2][:40],round(out[li]['a'],2),round(out[li]['b'],2))
