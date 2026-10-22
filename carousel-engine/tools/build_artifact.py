"""Build the daily review artifact page for one date from post_history + rendered posts.

  python tools/build_artifact.py [YYYY-MM-DD] [--out DIR]

Writes DIR/carousel-engine.html (from desk/artifact_template.html) plus DIR/img/*.jpg and DIR/pdf/*.pdf.
Publish it with Claude's Artifact tool to the same URL every morning (see prompts/morning_artifact.md).
"""
import argparse, json, pathlib, shutil, sys, datetime as dt
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from engine.core import load, today_ist, DAYS
from engine.verify import snippets

FMT = {"mega": "Big-number cheat sheet", "notes-drop": "Notes drop", "mega-kids": "Kids · explain like I'm 5", "vs-split": "Role vs role",
       "list": "Interview list", "plan": "Roadmap", "reel": "Learning reel"}


def build(date, out):
    out = pathlib.Path(out); (out / "img").mkdir(parents=True, exist_ok=True); (out / "pdf").mkdir(exist_ok=True)
    for old in list((out / "img").glob("*")) + list((out / "pdf").glob("*")):
        old.unlink()
    posts = sorted([p for p in load("post_history") if p.get("date") == date and p.get("kind", "carousel") == "carousel" and p.get("status") != "rejected"],
                   key=lambda p: p["slotTime"])
    if not posts:
        raise SystemExit(f"no posts for {date}: run make_day.py first")
    data, checked = [], 0
    for p in posts:
        slides = []
        for i, s in enumerate(p["slides"], 1):
            n = f"img/{p['slug']}_{i:02d}.jpg"; shutil.copy(ROOT / s["path"], out / n); slides.append(n)
        alt = None
        if p.get("coverAlt"):
            alt = f"img/{p['slug']}_cover_b.jpg"; shutil.copy(ROOT / p["coverAlt"]["path"], out / alt)
        pdf = f"pdf/{p['slug']}.pdf"; shutil.copy(ROOT / p["pdf"]["path"], out / pdf)
        data.append({"id": p["id"], "slug": p["slug"], "time": p["slotTime"], "format": p["format"], "fmtLabel": FMT.get(p["format"], p["format"]),
                     "title": p["title"], "keyword": p["keyword"], "caption": p["caption"], "hashtags": p["hashtags"], "why": p["why"],
                     "pages": p["pdf"]["pages"], "pdf": pdf, "slides": slides, "alt": alt, "hookAlt": (p.get("coverAlt") or {}).get("hook", "")})
        sid = p["id"].split(f"{date}-")[1]
        try:
            spec = json.load(open(DAYS / date / f"{sid}.spec.json")); meta = json.load(open(DAYS / date / f"{sid}.meta.json"))
            checked += len(snippets(spec, meta)) + sum(1 for c in meta.get("verify", {}).get("checks", []) if c.get("lang") == "sql")
        except FileNotFoundError:
            pass
    d = dt.date.fromisoformat(date)
    rep = {"__DATA__": json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), "__DATELABEL__": d.strftime("%A %-d %B"),
           "__NPOSTS__": str(len(data)), "__NSLIDES__": str(sum(len(x["slides"]) for x in data)),
           "__NPAGES__": str(sum(x["pages"] for x in data)), "__NCHECKED__": str(checked)}
    h = (ROOT / "desk" / "artifact_template.html").read_text()
    for k, v in rep.items():
        h = h.replace(k, v)
    (out / "carousel-engine.html").write_text(h)
    files = sorted(str(f.relative_to(out)) for f in out.rglob("*") if f.is_file() and f.suffix in (".jpg", ".pdf"))
    (out / "files.json").write_text(json.dumps([{"path": f} for f in files]))
    return out / "carousel-engine.html", files


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("date", nargs="?")
    ap.add_argument("--out", default=str(ROOT / "out" / "artifact"))
    a = ap.parse_args()
    page, files = build(a.date or today_ist().isoformat(), a.out)
    print(page); print(f"{len(files)} files")
