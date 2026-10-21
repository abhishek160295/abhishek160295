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


THEMES = {  # all light (owner rule): sky stops, sun, clouds, 3 ridge layers, trees, floor, particles
    "dawn": {"sky": ["#FFE3C2", "#FDD9DE", "#E6DDF7", "#DCE9F7"], "sun": "#FFE08A", "cloud": "#FFFFFF",
             "ridge": ["#E3D3F2", "#CFC1EA", "#BBD9C7"], "trees": True, "tree": [None, "#A4C9B0", "#7FB592"],
             "floor": ["#F3EEF8", "#F7F1E6"], "groundTop": "linear-gradient(180deg,#FFFFFF,#F2ECFA)", "groundSide": "#D9CDEB",
             "particle": "#FFFFFF", "dust": "#E8DDF5", "drift": 1, "fall": 0.2},
    "snow": {"sky": ["#DCEBFF", "#E9E4FA", "#F4EEFA", "#EAF2FB"], "sun": "#FFF1B8", "cloud": "#FFFFFF",
             "ridge": ["#D3DDF2", "#BFCBEA", "#E7EEF9"], "trees": True, "tree": [None, "#93A9D6", "#6F8FC4"],
             "floor": ["#F2F6FC", "#FFFFFF"], "groundTop": "linear-gradient(180deg,#FFFFFF,#EAF1FB)", "groundSide": "#C9D6EE",
             "particle": "#FFFFFF", "dust": "#DCE6F6", "drift": 0.6, "fall": 1.6},
    "meadow": {"sky": ["#FFF2CF", "#E8F6E1", "#DDF1F0", "#F4F8EC"], "sun": "#FFE070", "cloud": "#FFFFFF",
               "ridge": ["#CDE6C7", "#B4DBB0", "#9ECF9E"], "trees": True, "tree": [None, "#86C08A", "#5FA867"],
               "floor": ["#EEF6E6", "#F7F4EA"], "groundTop": "linear-gradient(180deg,#FFFDF5,#EEF5E2)", "groundSide": "#C9DDB8",
               "particle": "#FFF6C8", "dust": "#E6EED6", "drift": 1.2, "fall": -0.3},
}


def page_html(spec, tl):
    sys.path.insert(0, str(ROOT / "renderer"))
    from assets import FONTS_CSS
    import datetime as dt
    kw = spec.get("keyword")
    kwc = f'<div class="kwrow" id="kwrow"><span class="kwc">Comment <b>{kw}</b> and I\'ll DM you the code</span></div>' if kw else ""
    theme = spec.get("theme") or list(THEMES)[dt.date.today().toordinal() % len(THEMES)]
    rep = {"__FONTS__": FONTS_CSS, "__MONO__": MONO, "__LANG__": spec.get("lang", "Python"), "__TITLE__": spec["title"],
           "__SUB__": spec.get("sub", ""), "__HOOK__": spec.get("hook", ""), "__ENDLINE__": spec.get("endline", "Now you know."),
           "__KWC__": kwc, "__TL__": json.dumps(tl), "__INTRO__": str(INTRO), "__THEME__": json.dumps(THEMES[theme])}
    h = (ROOT / "reels" / "scene.html").read_text()
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
