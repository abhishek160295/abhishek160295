"""Learning reel renderer (1080x1920, 30 fps, silent: add music in the Instagram app).

  python reels/reel.py reels/specs/<name>.json out/reels/<name>

Scene 'trace-list': real Python runs, every executed line is traced, and characters with the list values on their
bellies act it out: compare, swap (hop), the active code line lights up, variables update live, the real stdout
prints at the end. Output: reel.mp4, cover.jpg (for the reel cover), qa.json.

Spec: {title, lang, sub, hook (may use <em>), endline, code, list_var, show_vars[], focus[] (index expressions, e.g. ["j","j + 1"]),
       compare {line_has, a, b, test, op, yes, no} | bubble {line_has, text (python expression -> string)},
       done (expression -> list of finished positions), target_seconds, min_seconds, keyword?}
"""
import asyncio, json, math, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "reels"))
from reeltrace import trace  # noqa: E402
from render import launch, MONO  # noqa: E402

W, H, FPS = 1080, 1920, 30
INTRO, OUTRO = 2.2, 3.6


def _eval(expr, env):
    try:
        return eval(expr, {}, env)
    except Exception:
        return None


def build_timeline(spec):
    events, stdout, lines = trace(spec["code"], spec["list_var"], spec.get("show_vars", []))
    first = next(e for e in events if e["list"] is not None)
    vals = list(first["list"]); n = len(vals)
    ids = list(range(n)); chars = [{"id": k, "v": v} for k, v in enumerate(vals)]
    segs, prev = [], first["list"]
    total_lines = len(events)
    for k, e in enumerate(events[:-1]):
        if e["list"] is None or e["line"] is None:
            continue
        nxt = events[k + 1]["list"] if events[k + 1]["list"] is not None else e["list"]
        text = lines[e["line"] - 1].strip()
        env = dict(e["vars"]); env[spec["list_var"]] = e["list"]
        focus = [_eval(f, env) for f in spec.get("focus", [])]
        focus = [f for f in focus if isinstance(f, int) and 0 <= f < n]
        before = list(ids)
        move = nxt != e["list"]
        if move:  # keep character identity: unchanged slots keep their id, moved values find theirs
            old, new = e["list"], nxt
            if len(new) != n:
                raise ValueError("trace-list scenes need a fixed-length list (no append/pop on the traced list)")
            free = [(p, ids[p]) for p in range(n) if old[p] != new[p]]
            after = list(ids)
            for p in range(n):
                if old[p] != new[p]:
                    q = next((i for i, (pp, cid) in enumerate(free) if old[pp] == new[p]), None)
                    if q is not None:
                        after[p] = free.pop(q)[1]
            # any slot left unmatched kept its character, which now shows a new value (e.g. a running total)
            used = set(after[p] for p in range(n) if old[p] != new[p] and after[p] != ids[p])
            ids = after
        cmp = None
        c = spec.get("compare")
        if c and c["line_has"] in text:
            a, b = _eval(c["a"], env), _eval(c["b"], env)
            res = _eval(c["test"], env)
            cmp = {"a": a, "b": b, "op": c.get("op", ">"), "res": bool(res), "word": c["yes"] if res else c["no"]}
        b = spec.get("bubble")
        if b and b["line_has"] in text and not cmp:
            txt = _eval(b["text"], env)
            if txt is not None:
                cmp = {"text": str(txt)}
        if move:
            dur = 0.62
        elif cmp:
            dur = 0.40
        elif text.startswith(("for ", "while ")):
            dur = 0.12
        else:
            dur = 0.18
        speed = 1.0 - 0.45 * min(1.0, k / max(1, total_lines * 0.7))  # first pass teaches slowly, then it flows
        done = []
        if spec.get("done"):
            r = _eval(spec["done"], dict(env, n=n))
            done = [q for q in (r or []) if isinstance(q, int) and 0 <= q < n]
        segs.append({"line": e["line"], "list": e["list"], "after": nxt, "dur": dur * speed, "order": before, "next": ids if move else before, "move": move,
                     "vars": {a: repr(b) for a, b in e["vars"].items()}, "focus": focus, "cmp": cmp, "out": e["stdout"], "done": done})
        prev = nxt
    body = sum(s["dur"] for s in segs)
    target = spec.get("target_seconds", 30)
    if body > target:
        f = target / body
        for s in segs: s["dur"] *= f
    elif body < spec.get("min_seconds", 0):
        f = spec["min_seconds"] / body
        for s in segs: s["dur"] *= f
    t = INTRO
    for s in segs:
        s["t0"] = t; t += s["dur"]
    final = events[-1]
    allv = [abs(x) for e in events if e["list"] for x in e["list"] if isinstance(x, (int, float))]
    return {"vmax": max(allv) if allv else 1, "chars": chars, "n": n, "segs": segs, "lines": lines, "end": t, "total": t + OUTRO,
            "stdout": stdout.strip(), "final": final["list"], "order_end": ids, "vars_end": {a: repr(b) for a, b in final["vars"].items()}}


PAGE = r"""<!doctype html><html><head><meta charset="utf-8"><style>
__FONTS__
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:Inter,sans-serif;background:#F6F1E7;color:#1B1A17}
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#FCE9D2 0%,#F9E3E6 30%,#E9E6F7 58%,#F6F1E7 100%)}
.sun{position:absolute;left:760px;top:330px;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle,#FFE38A 0 52%,rgba(255,227,138,.0) 70%)}
.hill{position:absolute;border-radius:50%}
.h1{left:-260px;top:560px;width:900px;height:380px;background:#D9E8D0}
.h2{left:420px;top:600px;width:1000px;height:360px;background:#CFE2C4}
.tree{position:absolute;width:0;height:0;border-left:34px solid transparent;border-right:34px solid transparent;border-bottom:110px solid #7DB287}
.tree:after{content:"";position:absolute;left:-6px;top:108px;width:12px;height:22px;background:#9C7A5B}
.ground{position:absolute;left:60px;right:60px;top:880px;height:70px;border-radius:40px;background:#FFFDF8;box-shadow:0 18px 30px -16px rgba(80,50,10,.35);border:3px solid #E7DCC8}
.top{position:absolute;left:70px;right:70px;top:150px;display:flex;justify-content:space-between;align-items:center}
.who{display:flex;align-items:center;gap:14px;font:700 30px Inter}
.who .mono{width:58px;height:58px}
.chip{font:700 24px JBMono;letter-spacing:2px;text-transform:uppercase;border:2.5px solid #1B1A17;border-radius:40px;padding:10px 20px;background:rgba(255,255,255,.7)}
.title{position:absolute;left:70px;right:70px;top:250px}
.title h1{font:400 112px/1 Marker,Kalam,cursive;color:#B3121B;transform:rotate(-1.5deg);transform-origin:left}
.title .sub{display:flex;gap:12px;align-items:center;margin-top:16px;font:600 30px Inter;color:#4A443B}
.title .sub b{font:800 22px JBMono;background:#1B1A17;color:#FFD12E;padding:6px 12px;border-radius:8px;letter-spacing:1px}
.ch{position:absolute;bottom:0;transform-origin:50% 100%}
.body{position:absolute;left:0;bottom:0;width:100%;border-radius:50% 50% 44% 44% / 58% 58% 42% 42%;box-shadow:inset -10px -14px 0 rgba(0,0,0,.10)}
.belly{position:absolute;left:50%;transform:translateX(-50%);bottom:16%;width:64%;height:44%;border-radius:50%;background:#FFFDF6;display:grid;place-items:center;font:800 46px JBMono;color:#1B1A17}
.eye{position:absolute;top:22%;width:24%;height:17%;border-radius:50%;background:#fff}
.eye i{position:absolute;width:55%;height:62%;border-radius:50%;background:#1B1A17;top:22%;left:24%}
.e1{left:18%}.e2{right:18%}
.cheek{position:absolute;top:40%;width:14%;height:7%;border-radius:50%;background:#FF9DA6;opacity:.8}
.k1{left:10%}.k2{right:10%}
.scarf{position:absolute;left:8%;right:8%;top:50%;height:9%;border-radius:10px}
.foot{position:absolute;bottom:-8px;width:28%;height:16px;border-radius:50%;background:#F2994A}
.f1{left:16%}.f2{right:16%}
.lock{position:absolute;left:50%;top:-46px;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:#12755F;color:#fff;display:grid;place-items:center;font:800 24px Inter;box-shadow:0 0 0 4px #fff;opacity:0;transition:none}
.ring{position:absolute;left:50%;bottom:-24px;transform:translateX(-50%);width:120%;height:30px;border-radius:50%;background:radial-gradient(rgba(255,209,46,.85),rgba(255,209,46,0) 70%)}
.cmp{position:absolute;top:452px;left:50%;transform:translateX(-50%);display:flex;gap:16px;align-items:center;font:800 46px JBMono;background:#fff;border:3px solid #1B1A17;border-radius:24px;padding:14px 26px;box-shadow:6px 7px 0 #1B1A17;white-space:nowrap}
.cmp .w{font:800 30px Inter;padding:8px 16px;border-radius:14px}
.cmp .w.y{background:#B3121B;color:#fff}.cmp .w.n{background:#DDF3E6;color:#16603F}
.vars{position:absolute;left:70px;right:70px;top:990px;display:flex;gap:12px;flex-wrap:wrap}
.var{font:700 30px JBMono;background:#fff;border:2.5px solid #1B1A17;border-radius:14px;padding:8px 16px}
.var b{color:#B3121B}
.pass{margin-left:auto;font:700 26px JBMono;color:#4A443B;align-self:center}
.code{position:absolute;left:60px;right:60px;top:1070px;background:#FFFDF8;border:3px solid #1B1A17;border-radius:30px;padding:26px 30px 26px 20px;box-shadow:8px 10px 0 #1B1A17}
.ln{position:relative;display:flex;gap:18px;font:500 31px/1.5 JBMono;min-width:0;overflow:hidden;white-space:pre;color:#2A2622;padding-left:8px;border-radius:10px}
.ln .no{width:34px;text-align:right;color:#B5AC9E;flex:none}
.ln.on{background:linear-gradient(100deg,#FFE15A,#FFD12E)}
.ln.on .no{color:#1B1A17}
.ln.on:before{content:"";position:absolute;left:-26px;top:50%;margin-top:-12px;border:12px solid transparent;border-left:16px solid #B3121B}
.kw{color:#B3121B;font-weight:700}.nm{color:#12755F}.st{color:#1D4E89}.bi{color:#7A3FB0}
.out{position:absolute;left:60px;right:60px;top:1590px;z-index:3;font:700 34px JBMono;background:#1B1A17;color:#FFD12E;border-radius:20px;padding:18px 24px;opacity:0}
.out .p{color:#8E8579}
.intro{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:#F6F1E7;padding:0 80px}
.intro .k{font:800 26px JBMono;letter-spacing:3px;text-transform:uppercase;background:#1B1A17;color:#FFD12E;padding:10px 20px;border-radius:10px}
.intro h2{font:400 150px/1 Marker,Kalam,cursive;color:#B3121B;margin-top:30px;transform:rotate(-2deg)}
.intro p{font:400 52px/1.25 Hand,Kalam,cursive;color:#3F3A33;margin-top:30px;max-width:860px}
.intro p em{font-style:normal;background:linear-gradient(100deg,transparent 2%,#FFE15A 4%,#FFD12E 94%,transparent 97%);background-size:100% 60%;background-position:0 80%;background-repeat:no-repeat;padding:0 6px}
.end{position:absolute;left:70px;right:70px;top:250px;display:flex;flex-direction:column;gap:14px;opacity:0}
.end .big{font:400 96px/1 Marker,Kalam,cursive;color:#B3121B}
.end .row{display:flex;gap:14px;align-items:center;font:800 34px Bricolage}
.end .fol{background:#B3121B;color:#fff;padding:16px 26px;border-radius:40px}
.kwrow{position:absolute;left:60px;right:60px;display:flex;justify-content:center;opacity:0}
.kwrow .kwc{background:#fff;border:3px solid #1B1A17;padding:14px 22px;border-radius:18px;box-shadow:5px 6px 0 #1B1A17;font:700 32px Inter}
.kwrow .kwc b{font:800 32px JBMono;color:#B3121B}
.end .kwc{background:#fff;border:3px solid #1B1A17;padding:14px 22px;border-radius:18px;box-shadow:5px 6px 0 #1B1A17;font:700 30px Inter}
.end .kwc b{font:800 30px JBMono;color:#B3121B}
</style></head><body>
<div class="sky"></div><div class="sun"></div><div class="hill h1"></div><div class="hill h2"></div>
<div class="tree" style="left:90px;top:520px"></div><div class="tree" style="left:180px;top:560px;transform:scale(.8)"></div>
<div class="tree" style="left:880px;top:540px;transform:scale(.9)"></div><div class="tree" style="left:960px;top:580px;transform:scale(.7)"></div>
<div class="ground"></div>
<div class="top"><div class="who">__MONO__<span>thedataguy16</span></div><span class="chip">__LANG__</span></div>
<div class="title" id="title"><h1>__TITLE__</h1><div class="sub"><b>__LANG__</b><span>__SUB__</span></div></div>
<div class="end" id="end"><div class="big">__ENDLINE__</div><div class="row"><span class="fol">Follow @thedataguy16</span></div></div>__KWC__
<div id="stage"></div>
<div class="cmp" id="cmp" style="opacity:0"></div>
<div class="vars" id="vars"></div>
<div class="code" id="code"></div>
<div class="out" id="out"></div>
<div class="intro" id="intro"><span class="k">__LANG__ · watch it run</span><h2>__TITLE__</h2><p>__HOOK__</p></div>
<script>
const T=__TL__;
const COLORS=["#FF8A5B","#5BB8FF","#8E7CFF","#3DC48B","#FFB020","#FF6FA8","#2EC4C9","#B07CFF","#7FCB4A","#F25F5C"];
const SCARF=["#B3121B","#1B1A17","#FFD12E","#12755F","#1D4E89"];
const vmax=T.vmax||1;
const stageW=940, x0=70, base=880;
function slotX(p){const w=stageW/T.n;return x0+w*p+w/2}
function sizeOf(v){const h=150+Math.round((Math.abs(+v)||1)/vmax*150);return {h:h,w:Math.min(stageW/T.n-14,Math.round(h*0.72))}}
const stage=document.getElementById('stage');
const els=T.chars.map((c,k)=>{const s=sizeOf(c.v);const d=document.createElement('div');d.className='ch';d.style.width=s.w+'px';d.style.height=s.h+'px';
  d.innerHTML=`<div class="lock">&#10003;</div><div class="ring" style="opacity:0"></div><div class="foot f1"></div><div class="foot f2"></div><div class="body" style="background:${COLORS[k%COLORS.length]};height:100%"></div>
  <div class="eye e1"><i></i></div><div class="eye e2"><i></i></div><div class="cheek k1"></div><div class="cheek k2"></div>
  <div class="scarf" style="background:${SCARF[k%SCARF.length]}"></div><div class="belly">${c.v}</div>`;stage.appendChild(d);return d});
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function hl(line){let s=esc(line);
  s=s.replace(/("[^"]*"|'[^']*')/g,'<span class="st">$1</span>');
  s=s.replace(/\b(for|in|if|else|elif|while|return|def|and|or|not|break|continue|True|False|None|import|from)\b/g,'<span class="kw">$1</span>');
  s=s.replace(/\b(range|len|print|min|max|sum|sorted|append)\b/g,'<span class="bi">$1</span>');
  s=s.replace(/(?<![\w#])(\d+)(?![\w])/g,'<span class="nm">$1</span>');return s}
const code=document.getElementById('code');
code.innerHTML=T.lines.map((l,i)=>`<div class="ln" data-l="${i+1}"><span class="no">${i+1}</span><span>${hl(l)}</span></div>`).join('');
window.fitCode=(function fitCode(){let fs=31;const c=document.getElementById('code');const lns=[...c.querySelectorAll('.ln')];
  while(fs>18&&lns.some(l=>l.scrollWidth>l.clientWidth+1)){fs-=1;lns.forEach(l=>l.style.fontSize=fs+'px')}
  const o=document.getElementById('out');o.style.top=(c.offsetTop+c.offsetHeight+22)+'px';
  const k=document.getElementById('kwrow');if(k)k.style.top=(c.offsetTop+c.offsetHeight+130)+'px';return fitCode});
window.fitCode();
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function segAt(t){let lo=0,hi=T.segs.length-1;if(t<T.segs[0].t0)return -1;while(lo<hi){const m=(lo+hi+1)>>1;if(T.segs[m].t0<=t)lo=m;else hi=m-1}return lo}
window.setT=function(t){
  const intro=document.getElementById('intro');intro.style.opacity=t<INTRO-0.35?1:Math.max(0,(INTRO-t)/0.35);
  intro.style.transform=`scale(${1+Math.max(0,t-(INTRO-0.35))*0.25})`;
  const k=segAt(t), end=t>=T.end;
  let order, nextO=null, p=0, s=null;
  if(k<0){order=T.segs[0].order}else if(end){order=T.order_end}else{s=T.segs[k];order=s.order;if(s.move){nextO=s.next;p=ease(Math.min(1,(t-s.t0)/s.dur))}}
  const pos={};order.forEach((id,i)=>pos[id]=i);const npos={};if(nextO)nextO.forEach((id,i)=>npos[id]=i);
  const focus=s?s.focus.map(i=>order[i]):[];
  T.chars.forEach((c,id)=>{const el=els[id];const sz=sizeOf(c.v);let x=slotX(pos[id]),y=0,sq=1,rot=0;
    if(nextO&&npos[id]!==pos[id]){const x2=slotX(npos[id]);x=x+(x2-x)*p;y=-Math.sin(Math.PI*p)*170;sq=1+Math.sin(Math.PI*p)*0.06;rot=(x2>slotX(pos[id])?1:-1)*Math.sin(Math.PI*p)*10}
    if(end){const ph=(t-T.end)*6-id*0.5;y=ph>0&&ph<Math.PI?-Math.sin(ph)*90:0}
    const f=focus.indexOf(id);
    const val=end?T.final[T.order_end.indexOf(id)]:(s?(nextO&&p>0.5?s.after[npos[id]]:s.list[pos[id]]):c.v);
    const cur=sizeOf(val);const bl=el.querySelector('.belly');
    if(bl.textContent!=String(val)){bl.textContent=val;el.style.width=cur.w+'px';el.style.height=cur.h+'px'}
    el.style.left=(x-cur.w/2)+'px';el.style.top=(base-cur.h+y)+'px';el.style.transform=`scale(${1/sq},${sq}) rotate(${rot}deg)`;
    el.querySelector('.ring').style.opacity=f>=0?1:0;

    const lockedPos=end?[...Array(T.n).keys()]:(s?s.done:[]);el.querySelector('.lock').style.opacity=lockedPos.includes(pos[id])&&!(nextO&&npos[id]!==pos[id])?1:0;
    const look=f===0?1:f===1?-1:0;el.querySelectorAll('.eye i').forEach(i=>i.style.left=(24+look*16)+'%')});
  document.querySelectorAll('.ln').forEach(l=>l.classList.toggle('on',!!s&&+l.dataset.l===s.line));
  const cmp=document.getElementById('cmp');
  if(s&&s.cmp){cmp.style.opacity=1;cmp.innerHTML=s.cmp.text!==undefined?`<span>${esc(s.cmp.text)}</span>`:`<span>${s.cmp.a} ${s.cmp.op} ${s.cmp.b} ?</span><span class="w ${s.cmp.res?'y':'n'}">${s.cmp.word}</span>`}else if(!(s&&s.move))cmp.style.opacity=0;
  const vars=s?s.vars:(end?T.vars_end:{});
  document.getElementById('vars').innerHTML=Object.entries(vars).map(([a,b])=>`<span class="var">${a} = <b>${b}</b></span>`).join('')+`<span class="pass">${PASS(s)}</span>`;
  const out=document.getElementById('out');
  if(end){out.style.opacity=1;const full=T.stdout,n=Math.min(full.length,Math.floor((t-T.end)*40));out.innerHTML=`<span class="p">&gt;&gt;&gt; </span>${esc(full.slice(0,n))}`}else out.style.opacity=0;
  const e=document.getElementById('end');e.style.opacity=end?Math.min(1,(t-T.end-0.8)/0.4):0;
  const kr=document.getElementById('kwrow');if(kr)kr.style.opacity=end?Math.min(1,Math.max(0,(t-T.end-1.4)/0.4)):0;
  document.getElementById('title').style.opacity=end?Math.max(0,1-(t-T.end)/0.4):1;
};
const INTRO=__INTRO__;
function PASS(s){if(!s)return '';const k=T.segs.indexOf(s);return 'step '+(k+1)+' / '+T.segs.length}
</script></body></html>"""


def page_html(spec, tl):
    sys.path.insert(0, str(ROOT / "renderer"))
    from assets import FONTS_CSS
    kw = spec.get("keyword")
    kwc = f'<div class="kwrow" id="kwrow"><span class="kwc">Comment <b>{kw}</b> and I\'ll DM you the code</span></div>' if kw else ""
    rep = {"__FONTS__": FONTS_CSS, "__MONO__": MONO, "__LANG__": spec.get("lang", "Python"), "__TITLE__": spec["title"],
           "__SUB__": spec.get("sub", ""), "__HOOK__": spec.get("hook", ""), "__ENDLINE__": spec.get("endline", "Sorted. Save it."),
           "__KWC__": kwc, "__TL__": json.dumps(tl), "__INTRO__": str(INTRO)}
    h = PAGE
    for k, v in rep.items():
        h = h.replace(k, v)
    return h


async def render(spec, out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    tl = build_timeline(spec)
    html_ = page_html(spec, tl)
    (out / "scene.html").write_text(html_)
    frames = int(math.ceil(tl["total"] * FPS))
    from playwright.async_api import async_playwright
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out / "reel.mp4")],
                          stdin=subprocess.PIPE)
    async with async_playwright() as p:
        b = await launch(p)
        pg = await b.new_page(viewport={"width": W, "height": H})
        await pg.set_content(html_); await pg.evaluate("document.fonts.ready"); await pg.evaluate("fitCode()")
        cover_t = INTRO + 0.6
        for f in range(frames):
            t = f / FPS
            await pg.evaluate(f"setT({t})")
            ff.stdin.write(await pg.screenshot(type="jpeg", quality=92))
            if abs(t - cover_t) < 0.5 / FPS:
                await pg.screenshot(path=str(out / "cover.jpg"), type="jpeg", quality=94)
        await pg.evaluate("setT(0.3)"); await pg.screenshot(path=str(out / "hook.jpg"), type="jpeg", quality=94)
        await pg.evaluate(f"setT({tl['total'] - 0.2})"); await pg.screenshot(path=str(out / "end.jpg"), type="jpeg", quality=94)
        await b.close()
    ff.stdin.close(); ff.wait()
    qa = {"seconds": round(tl["total"], 1), "steps": len(tl["segs"]), "stdout": tl["stdout"], "final": tl["final"]}
    json.dump(qa, open(out / "qa.json", "w"), indent=1)
    return out / "reel.mp4", qa


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1]))
    mp4, qa = asyncio.run(render(spec, sys.argv[2]))
    print(mp4, qa)
