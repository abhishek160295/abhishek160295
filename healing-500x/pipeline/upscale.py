import sys,subprocess,numpy as np,torch,time
sys.path.insert(0,sys.argv[1]); from srvgg import load
src,dst,mp=sys.argv[2],sys.argv[3],sys.argv[4]
torch.set_num_threads(4); m=load(mp).to(memory_format=torch.channels_last)
W,H=640,360
dec=subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','2560x1440','-r','24','-i','-',
 '-vf','scale=1920:1080:flags=lanczos','-c:v','libx264','-preset','medium','-crf','14','-pix_fmt','yuv420p',dst],stdin=subprocess.PIPE)
n=0;t0=time.time()
while True:
    b=dec.stdout.read(W*H*3)
    if len(b)<W*H*3:break
    x=torch.from_numpy(np.frombuffer(b,np.uint8).reshape(H,W,3).copy()).permute(2,0,1)[None].float().div(255).contiguous(memory_format=torch.channels_last)
    with torch.inference_mode(), torch.autocast('cpu',dtype=torch.bfloat16):
        y=m(x)
    y=y.float().clamp(0,1).mul(255).round().byte()[0].permute(1,2,0).contiguous().numpy()
    enc.stdin.write(y.tobytes()); n+=1
    if n%240==0: print(n, f'{time.time()-t0:.0f}s',flush=True)
enc.stdin.close(); enc.wait(); print('done',n,flush=True)
