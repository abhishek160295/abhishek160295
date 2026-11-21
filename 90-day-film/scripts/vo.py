"""Cut the raw VO take into phrases, tighten tempo, place them on the 12.9s timeline, and write SRT."""
import subprocess, json
T=1.12
# (raw_start, raw_end, place_at, caption)
SEG=[(0.00,1.105,0.35,"He had a degree..."),(1.455,2.713,1.40,"...but no skills."),
(3.068,4.27,2.60,"So he built himself"),(4.454,5.528,3.70,"in 90 days."),
(5.91,6.418,4.75,"Excel."),(6.79,7.507,5.30,"SQL."),(7.85,8.353,6.00,"Python."),
(8.686,9.404,6.98,"Power BI."),(9.71,10.231,7.70,"Tableau."),(10.485,10.962,8.25,"GitHub."),
(11.491,14.02,9.00,"Your career doesn't need a perfect start."),(14.354,15.472,11.35,"It needs a plan.")]
inp=[];flt=[]
for i,(a,b,at,_) in enumerate(SEG):
    flt.append(f"[0:a]atrim={a}:{b+0.04},asetpts=PTS-STARTPTS,atempo={T},afade=t=out:st={(b-a)/T-0.03:.3f}:d=0.04,adelay={int(at*1000)}|{int(at*1000)}[s{i}]")
flt.append("".join(f"[s{i}]" for i in range(len(SEG)))+f"amix=inputs={len(SEG)}:normalize=0,apad=whole_dur=12.9,atrim=0:12.9,loudnorm=I=-16:TP=-1.5[out]")
subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-i","public/audio/vo_raw.mp3","-filter_complex",";".join(flt),"-map","[out]","-ar","48000","-ac","2","public/audio/vo.wav"],check=True)
def ts(s): h=int(s//3600);m=int(s%3600//60);return f"{h:02}:{m:02}:{s%60:06.3f}".replace('.',',')
with open("deliverables/captions.srt","w") as f:
    for i,(a,b,at,c) in enumerate(SEG,1): f.write(f"{i}\n{ts(at)} --> {ts(at+(b-a)/T)}\n{c}\n\n")
json.dump([{"at":at,"end":round(at+(b-a)/T,3),"text":c} for a,b,at,c in SEG],open("src/captions.json","w"),indent=1)
print("vo ok")
