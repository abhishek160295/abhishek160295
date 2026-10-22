import json,re,difflib,wave
rows=[l.rstrip('\n').split('\t') for l in open('script.tsv')]
anc=[float(x) for x in open('anchors.txt')]
old={int(k):v for k,v in json.load(open('vo/lineseg.json')).items()}
norm=lambda s:re.sub(r"[^a-z0-9' ]",' ',re.sub(r'\[.*?\]','',s).lower().replace('-',' ')).split()
def align(src,lines):
    W=json.load(open(f'vo/{src}_words.json')); aw=[re.sub(r"[^a-z0-9']",'',w['w'].lower()) for w in W]
    dur=wave.open(f'vo/{src}.wav').getnframes()/44100
    toks=[];own=[]
    for k,l in enumerate(lines): t=norm(l); toks+=t; own+=[k]*len(t)
    m={}
    for a,b,n in difflib.SequenceMatcher(None,toks,aw,autojunk=False).get_matching_blocks():
        for j in range(n): m[a+j]=b+j
    st={}
    for j,k in enumerate(own):
        if j in m and k not in st: st[k]=W[m[j]]['t']
    assert len(st)==len(lines),(src,st)
    return [dict(src=src,a=max(st[k]-0.08,0),b=(st[k+1]-0.1 if k+1<len(lines) else dur)) for k in range(len(lines))]
NX=["And there's one thing the rules can't explain.","Except, sometimes, they're not where you left them.","At least, that's what you think.",
    "Then one night, there's a list on your desk. Things to take. In your handwriting. You don't remember writing it.",
    "But the silence is already there. Someone stopped it first.","And one second later, they skip again. Someone has been following you through the silence.","She looks sixty."]
WX=["I've been in here with you since the cafeteria.","I was fourteen the first time I stopped the world. I'm twenty-six.",
    "Every hour in here is an hour of your life. I've spent thirty-four years in the silence. Friday's crash? I froze it. I needed to see what you'd do."]
nx=align('NX',NX); wx=align('WX',WX)
def O(i,anchor=None,**kw):
    d=dict(old[i]); d.update(sp=rows[i][1],scene=int(rows[i][0]),text=rows[i][2],anchor=anchor if anchor is not None else anc[i]); d.update(kw); return d
def X(seg,sp,scene,text,anchor,**kw):
    d=dict(seg); d.update(sp=sp,scene=scene,text=text,anchor=anchor); d.update(kw); return d
L=[O(i) for i in range(0,7)]+[O(7,title=1)]+[O(i) for i in range(8,24)]
L[1]['freeze']=0.0; L[15]['freeze']=1.5
L+=[O(24,172.0),X(nx[0],'N',4,NX[0],182.0)]
L+=[O(i) for i in range(25,33)]
L+=[X(nx[1],'N',6,NX[1],281.0),O(33,296.5),X(nx[2],'N',6,NX[2],300.5)]
L+=[O(i) for i in range(34,43)]
L+=[X(nx[3],'N',7,NX[3],389.0),O(43,393.5)]
L+=[O(i) for i in range(44,48)]
L+=[O(48,438.0,freeze=-0.3),X(nx[4],'N',8,NX[4],440.5),O(49,443.0)]
L+=[O(i) for i in range(50,58)]
p=O(58,513.0); p['b']=129.4; p['text']="But someone else is studying that footage. Every time you stop time, every camera in town skips the exact same frame."
L+=[p,X(nx[5],'N',9,NX[5],517.5,map=1)]
L+=[O(59),O(60),O(61,559.5,freeze=1.4),O(62,571.0),O(63,575.5),O(64,579.5)]
L+=[X(wx[0],'W',10,WX[0],581.5),X(wx[1],'W',10,WX[1],583.5),X(nx[6],'N',10,NX[6],586.0),X(wx[2],'W',10,WX[2],587.0),O(65,591.0),O(66,593.2,last=1)]
for k in range(1,len(L)): assert L[k]['anchor']>L[k-1]['anchor'],(k,L[k]['text'])
json.dump(L,open('script2.json','w'),indent=0); print(len(L),'lines')
