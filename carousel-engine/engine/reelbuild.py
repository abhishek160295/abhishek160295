"""Check + render one learning reel (days/<date>/<sid>.reel.json + <sid>.meta.json)."""
import asyncio, json, re, shutil, sys
from .core import ROOT, DAYS, POSTS, load
from .validate import DASHES, EMOJI, CTA_2

sys.path.insert(0, str(ROOT / "reels"))
CTA_REEL = "Follow @thedataguy16 and comment {kw}. I'll DM you the code."


def lint_reel(spec, meta, brief, hist, day_metas):
    E, W = [], []
    for k in ("title", "slug", "caption", "hashtags", "keyword", "why"):
        if not meta.get(k):
            E.append(f"meta.{k} missing")
    if E:
        return E, W
    kw = meta["keyword"]
    code = spec.get("code", "").split("\n")
    if len(code) > 14: E.append(f"reel code has {len(code)} lines (max 14)")
    for l in code:
        if len(l) > 58: E.append(f"reel code line over 58 chars: {l!r}")
    if spec.get("keyword") != kw: E.append("spec.keyword must equal meta.keyword")
    if not re.fullmatch(r"[A-Z0-9]{4,12}", kw): E.append("keyword must be 4-12 capital letters/digits")
    if kw in {p.get("keyword") for p in hist if p.get("id") != meta.get("id")}: E.append(f"keyword {kw} already used")
    if sum(1 for m in day_metas if m.get("keyword") == kw) > 1: E.append(f"keyword {kw} used twice today")
    hype = load("engine")["hypeWords"]
    for name, t in [("caption", meta["caption"]), ("title", spec.get("title", "")), ("sub", spec.get("sub", "")),
                    ("hook", spec.get("hook", "")), ("endline", spec.get("endline", ""))]:
        if DASHES.search(t): E.append(f"em/en dash in {name}")
        if EMOJI.search(t): E.append(f"emoji in {name}")
        for w in hype:
            if re.search(r"(?<![a-z])" + re.escape(w) + r"(?![a-z])", t.lower()): E.append(f"hype word '{w}' in {name}")
    lines = [l for l in meta["caption"].strip().split("\n") if l.strip()]
    if len(lines) < 3 or lines[-2].strip() != CTA_REEL.format(kw=kw) or lines[-1].strip() != CTA_2:
        E.append(f"caption must end with:\n  {CTA_REEL.format(kw=kw)}\n  {CTA_2}")
    elif not 1 <= len(lines) - 2 <= 3:
        E.append("caption body must be 1-3 short lines")
    tags = meta["hashtags"].split() if isinstance(meta["hashtags"], str) else meta["hashtags"]
    if not 5 <= len(tags) <= 6: E.append("hashtags: 5-6 tags")
    if brief.get("topic") and brief["topic"].lower().split()[0] not in (spec.get("title", "") + meta["title"]).lower():
        W.append(f"title does not mention the planned topic '{brief['topic']}'")
    return E, W


def check_reel(date, sid, brief, hist, day_metas):
    import reel as R
    d = DAYS / date
    spec = json.load(open(d / f"{sid}.reel.json", encoding="utf-8"))
    meta = json.load(open(d / f"{sid}.meta.json", encoding="utf-8"))
    meta.setdefault("id", f"{date}-{sid}")
    res = {"sid": sid, "errors": [], "warnings": [], "verify": [], "spec": spec, "meta": meta, "kind": "reel"}
    e, w = lint_reel(spec, meta, brief, hist, day_metas)
    res["errors"] += e; res["warnings"] += w
    out = POSTS / date / meta["slug"]
    if out.exists(): shutil.rmtree(out)
    try:
        mp4, qa = asyncio.run(R.render(spec, out))
    except Exception as ex:
        res["errors"].append(f"reel code/render failed: {type(ex).__name__}: {ex}")
        res.update(out=str(out), files=[], pdf=None, pages=0)
        return res
    res["verify"].append(f"ok  python reel code ran: {len(qa['stdout'])} chars of output -> {qa['stdout'][:60]}")
    if spec.get("expect_stdout") is not None and qa["stdout"] != str(spec["expect_stdout"]).strip():
        res["errors"].append(f"real output {qa['stdout']!r} != spec.expect_stdout {spec['expect_stdout']!r}")
    if not 12 <= qa["seconds"] <= 40: res["errors"].append(f"reel is {qa['seconds']} s (keep it 12-40 s)")
    for k, f in enumerate(["hook.jpg", "cover.jpg", "end.jpg"], 1):
        shutil.copy(out / f, out / f"frame_{k:02d}.jpg")
    (out / "scene.html").unlink(missing_ok=True)
    res.update(out=str(out), files=[str(out / f"frame_{k:02d}.jpg") for k in (1, 2, 3)], pdf=None, pages=0,
               video=str(mp4), cover=str(out / "cover.jpg"), seconds=qa["seconds"])
    return res
