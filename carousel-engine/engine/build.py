"""check: lint + verify + render + layout QA + contact sheet for a day's specs (nothing saved to history).
finalize: re-check, then append to post_history.json, update playbook state and load the desk."""
import asyncio, json, pathlib, sys, shutil
from .core import ROOT, DAYS, POSTS, load, save, history, now_ist, SLOTS
from .validate import lint
from .verify import verify_post
from . import store

sys.path.insert(0, str(ROOT))
import render as R  # noqa: E402
sys.path.insert(0, str(ROOT / "tools"))
from contact_sheet import sheet  # noqa: E402

MIN_FONT = 16  # px on a 1080 slide; below this text is hard to read on a phone


def plan_of(date):
    return json.load(open(DAYS / date / "plan.json", encoding="utf-8"))


def briefs(plan):
    out = {f"s{b['slot']}": b for b in plan["slots"]}
    out.update(plan.get("replacements", {}))
    return out


def load_post(date, sid):
    d = DAYS / date
    return (json.load(open(d / f"{sid}.spec.json", encoding="utf-8")),
            json.load(open(d / f"{sid}.meta.json", encoding="utf-8")))


def outdir(date, meta):
    return POSTS / date / meta["slug"]


def check_one(date, sid, brief, plan, day_metas, hist):
    spec, meta = load_post(date, sid)
    meta.setdefault("id", f"{date}-{sid}")  # so a re-check never clashes with this post's own history entry
    res = {"sid": sid, "errors": [], "warnings": [], "verify": []}
    spec.setdefault("style", brief["style"]); spec.setdefault("layout", brief["layout"])
    pages = R.page_count(spec)
    res["pages"] = pages
    brief = dict(brief, banned=plan["banned"])
    e, w = lint(spec, meta, brief, pages, day_metas, hist)
    res["errors"] += e; res["warnings"] += w
    ve, vr = verify_post(spec, meta)
    res["errors"] += ve; res["verify"] = vr
    out = outdir(date, meta)
    if out.exists():
        shutil.rmtree(out)
    files, pdf = asyncio.run(R.render_post(spec, out, pdf=True))
    qa = json.load(open(out / "qa.json"))
    for q in qa:
        tag = f"slide {q['slide']} ({q['type']})"
        if q["overflow"]: res["errors"].append(f"{tag}: text overflows the slide")
        if q["emojiWrap"]: res["errors"].append(f"{tag}: emoji wraps to a second line in cells {q['emojiWrap']}")
        if q["clipped"]: res["errors"].append(f"{tag}: clipped text: {q['clipped'][:3]}")
        if q["minFont"] < MIN_FONT: res["warnings"].append(f"{tag}: smallest text {q['minFont']:.0f}px, consider fewer rows")
        if q["shrinks"] >= 6: res["warnings"].append(f"{tag}: auto-shrunk {q['shrinks']}x, consider splitting")
    from pypdf import PdfReader
    real = len(PdfReader(pdf).pages)
    if real != pages:
        res["errors"].append(f"PDF has {real} pages, expected {pages}")
    res.update(files=files, pdf=pdf, out=str(out), spec=spec, meta=meta)
    return res


def check_day(date, sids=None, log=print):
    plan, hist = plan_of(date), history()
    bs = briefs(plan)
    sids = sids or [s for s in bs if (DAYS / date / f"{s}.spec.json").exists()]
    metas = [json.load(open(DAYS / date / f"{s}.meta.json")) for s in bs if (DAYS / date / f"{s}.meta.json").exists()]
    results, lines = [], []
    for sid in sids:
        r = check_one(date, sid, bs[sid], plan, metas, hist)
        results.append(r)
        lines.append(f"== {sid} {bs[sid]['slotTime']} {bs[sid]['rotation']} :: {r['meta']['title']} [{r['pages']}-page PDF, {len(r['files'])} post slides]")
        lines += [f"  ERROR {x}" for x in r["errors"]] + [f"  warn  {x}" for x in r["warnings"]] + [f"  {x}" for x in r["verify"]]
    cs = POSTS / date / "contact.jpg"
    sheet(cs, [r["out"] for r in results])
    lines.append(f"contact sheet: {cs.relative_to(ROOT)}")
    rep = "\n".join(lines)
    (DAYS / date / "check_report.txt").write_text(rep)
    log(rep)
    return results


def _rel(p):
    return str(pathlib.Path(p).resolve().relative_to(ROOT)).replace("\\", "/")


def to_post(date, sid, brief, r, eng):
    meta, spec = r["meta"], r["spec"]
    out = pathlib.Path(r["out"])
    slot = brief["slot"]
    post = {
        "id": f"{date}-{sid}", "date": date, "slot": slot, "slotTime": brief["slotTime"], "kind": "carousel",
        "status": "draft", "format": brief["format"], "layout": spec.get("layout"), "style": spec.get("style"),
        "hookType": meta["hookType"], "pillar": meta.get("pillar") or brief["pillar"], "slug": meta["slug"],
        "title": meta["title"], "caption": meta["caption"],
        "hashtags": meta["hashtags"] if isinstance(meta["hashtags"], str) else " ".join(meta["hashtags"]),
        "keyword": meta["keyword"], "why": meta["why"], "music": eng.get("music", "search 'anime', pick from top 10"),
        "topic": brief.get("topic"), "slides": [{"path": _rel(f), "url": "/files/" + _rel(f)} for f in r["files"]],
        "pdf": {"path": _rel(r["pdf"]), "url": "/files/" + _rel(r["pdf"]), "name": f"{meta['slug']}.pdf", "pages": r["pages"]},
        "spec": f"days/{date}/{sid}.spec.json", "sources": meta.get("sources", []), "createdAt": now_ist().isoformat(),
    }
    if (out / "cover_b.jpg").exists():
        post["coverAlt"] = {"path": _rel(out / "cover_b.jpg"), "url": "/files/" + _rel(out / "cover_b.jpg"),
                            "hook": (spec.get("cover_alt") or {}).get("hook", "")}
        post["coverChoice"] = "a"
    if brief.get("replaces"):
        post["replaces"] = brief["replaces"]
    for k in ("hookFamily", "coverBMechanic"):
        if brief.get(k):
            post[k] = brief[k]
    return post


def record_playbook(posts):
    pb = load("playbook")
    if "hookBank" in pb:
        ids = {p["id"] for p in posts}
        pb["hookBank"]["usage"] = [u for u in pb["hookBank"].get("usage", []) if u.get("post") not in ids] + [
            {"date": p["date"], "post": p["id"], "family": p.get("hookFamily"), "mechanic": p.get("coverBMechanic")}
            for p in posts if p.get("hookFamily") or p.get("coverBMechanic")]
    for p in posts:
        t, d = p.get("topic"), p["date"]
        if p["format"] == "mega-kids" and t:
            kr = pb["kidsRules"]
            if t in kr["queue"]: kr["queue"].remove(t)
            kr["done"] = [x for x in kr["done"] if x["topic"] != t] + [{"topic": t, "date": d, "keyword": p["keyword"]}]
        elif p["format"] == "vs-split" and t:
            rv = pb["roleVs"]
            if t in rv["queue"]: rv["queue"].remove(t); rv["queue"].append(t)  # back of the line after 60 days
            rv["used"] = [x for x in rv["used"] if not (x["pair"] == t and x["date"] == d)] + [{"pair": t, "date": d, "keyword": p["keyword"]}]
        elif p["format"] == "mega" and t:
            pb["cheatSheet"]["used"] = [x for x in pb["cheatSheet"]["used"] if x["date"] != d] + [{"tool": t, "date": d, "title": p["title"]}]
        elif p["format"] == "notes-drop" and t:
            pb["notesDrop"]["used"] = [x for x in pb["notesDrop"]["used"] if x["date"] != d] + [{"tool": t, "date": d, "title": p["title"], "pages": p["pdf"]["pages"]}]
    save("playbook", pb)


def unrecord_kids(topic):
    """A rejected kids topic goes back to the front of the queue (it was never published)."""
    pb = load("playbook"); kr = pb["kidsRules"]
    kr["done"] = [x for x in kr["done"] if x["topic"] != topic]
    if topic not in kr["queue"]: kr["queue"].insert(0, topic)
    save("playbook", pb)


def finalize(date, sids=None, log=print):
    results = check_day(date, sids, log)
    bad = [r for r in results if r["errors"]]
    if bad:
        raise SystemExit(f"finalize blocked: {len(bad)} post(s) still have errors (see days/{date}/check_report.txt)")
    plan, eng = plan_of(date), load("engine")
    bs = briefs(plan)
    posts = [to_post(date, r["sid"], bs[r["sid"]], r, eng) for r in results]
    hist = history()
    ids = {p["id"] for p in posts}
    keep = {p["id"]: p for p in hist if p.get("id") in ids}
    for p in posts:  # re-finalizing keeps decisions already taken in the desk
        if p["id"] in keep:
            p["status"] = keep[p["id"]].get("status", "draft")
            p["coverChoice"] = keep[p["id"]].get("coverChoice", p.get("coverChoice"))
    hist = [p for p in hist if p.get("id") not in ids] + posts
    for p in posts:
        if p.get("replaces"):
            for q in hist:
                if q.get("id") == p["replaces"]:
                    q["replacedBy"] = p["id"]
                    store_post = next((x for x in store.posts(q["date"]) if x["id"] == q["id"]), None)
                    if store_post:
                        store_post["replacedBy"] = p["id"]; store.upsert(store_post)
    save("post_history", hist)
    record_playbook(posts)
    for p in posts:
        store.upsert(p)
    return posts
