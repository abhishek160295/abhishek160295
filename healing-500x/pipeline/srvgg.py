import torch,torch.nn as nn,torch.nn.functional as F
class SRVGG(nn.Module):
    def __init__(s,nf=64,nc=16,up=4):
        super().__init__(); s.up=up
        b=[nn.Conv2d(3,nf,3,1,1),nn.PReLU(nf)]
        for _ in range(nc): b+= [nn.Conv2d(nf,nf,3,1,1),nn.PReLU(nf)]
        b+=[nn.Conv2d(nf,3*up*up,3,1,1)]; s.body=nn.ModuleList(b); s.ps=nn.PixelShuffle(up)
    def forward(s,x):
        o=x
        for m in s.body:o=m(o)
        return s.ps(o)+F.interpolate(x,scale_factor=s.up,mode='nearest')
def load(p):
    m=SRVGG(); sd=torch.load(p,map_location='cpu'); sd=sd.get('params',sd); m.load_state_dict(sd); return m.eval()
