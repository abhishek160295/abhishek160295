"""Weekly insights review (run only when Abhishek asks).

1. Claude in Chrome reads each post's insights page (see prompts/insights_review.md) and saves
   insights/<date>_readings.json: [{shortcode, title, keyword?, views, nonFollowersPct, saves, shares, follows}]
2. python insights_update.py insights/<date>_readings.json
     -> matches readings to post_history by keyword/title, stores them on the posts,
        appends a weekly summary to config/insights.json, refreshes playbook.evidence_oct winners/losers,
        and writes insights/<date>_proposal.json with suggested weeklyRotation changes. Nothing in the rotation changes yet.
3. python insights_update.py --apply insights/<date>_proposal.json   (only after Abhishek approves)
"""
import argparse, json, statistics, pathlib, sys
from engine.core import ROOT, load, save, today_ist, CODE_FORMAT, similar

OUT = ROOT / "insights"


def match(r, hist):
    if r.get("keyword"):
        p = next((p for p in hist if p.get("keyword") == r["keyword"]), None)
        if p: return p
    best = max(hist, key=lambda p: similar(r.get("title", ""), p.get("title", "")), default=None)
    return best if best and similar(r.get("title", ""), best.get("title", "")) >= 0.5 else None


def fmt(r, p):
    return f"{p['title'] if p else r.get('title')} {r['views']:,} / {r['follows']:,} / {r.get('nonFollowersPct', 0):.0f}%"


def review(path):
    rows = json.load(open(path)); hist = load("post_history")
    date = today_ist().isoformat(); OUT.mkdir(exist_ok=True)
    scored = []
    for r in rows:
        p = match(r, hist)
        if p:
            p["insights"] = {k: r.get(k) for k in ("views", "nonFollowersPct", "saves", "shares", "follows")} | {"readOn": date}
        scored.append((r, p))
    save("post_history", hist)
    by_fmt = {}
    for r, p in scored:
        if p: by_fmt.setdefault(p.get("format"), []).append(r)
    table = {f: {"n": len(v), "medViews": statistics.median(x["views"] for x in v), "medFollows": statistics.median(x["follows"] for x in v),
                 "medNonFollowers": statistics.median(x.get("nonFollowersPct", 0) for x in v)} for f, v in by_fmt.items()}
    ranked = sorted(scored, key=lambda t: (t[0]["follows"], t[0]["views"]), reverse=True)
    winners = [fmt(r, p) for r, p in ranked[:10] if r["follows"] >= 20 or r.get("nonFollowersPct", 0) >= 30]
    losers = [fmt(r, p) for r, p in ranked[::-1][:8] if r.get("nonFollowersPct", 0) < 10 and r["follows"] <= 5]
    ins = load("insights")
    ins.setdefault("weeklyReviews", []).append({"date": date, "posts": len(rows), "byFormat": table, "winners": winners, "losers": losers})
    save("insights", ins)
    pb = load("playbook")
    ev = pb["evidence_oct"]
    ev["winners"] = winners + [w for w in ev["winners"] if w not in winners][: max(0, 10 - len(winners))]
    ev["losers"] = losers + [l for l in ev["losers"] if l not in losers][: max(0, 9 - len(losers))]
    ev["period"] = f"{ev['period']} + review {date} ({len(rows)} posts)"
    save("playbook", pb)
    # proposal: shift the weakest rotation format toward the strongest by median follows (kids slot never moves)
    rank = sorted(((f, t) for f, t in table.items() if f in CODE_FORMAT and f != "mega-kids" and t["n"] >= 2),
                  key=lambda x: (x[1]["medFollows"], x[1]["medViews"]))
    prop = {"date": date, "evidence": table, "changes": [], "note": "Review, edit if needed, then: python insights_update.py --apply " + str((OUT / f'{date}_proposal.json').relative_to(ROOT))}
    if len(rank) >= 2 and rank[-1][1]["medFollows"] > 2 * max(1, rank[0][1]["medFollows"]):
        weak, strong = CODE_FORMAT[rank[0][0]], CODE_FORMAT[rank[-1][0]]
        rot = pb["weeklyRotation"]
        for day, row in rot.items():
            if day == "note": continue
            if weak in row and strong not in row:
                i = row.index(weak)
                if i != 2:
                    prop["changes"].append({"day": day, "slot": i + 1, "from": weak, "to": strong,
                                            "why": f"{strong}: median follows {rank[-1][1]['medFollows']} vs {weak}: {rank[0][1]['medFollows']}"})
                    break
    pf = OUT / f"{date}_proposal.json"
    json.dump(prop, open(pf, "w"), indent=1, ensure_ascii=False)
    print(json.dumps({"byFormat": table, "winners": winners, "losers": losers, "proposal": prop["changes"]}, indent=1, ensure_ascii=False))
    print(f"\nProposal saved to {pf.relative_to(ROOT)}. Nothing applied. Approve, then run with --apply.")


def apply(path):
    prop = json.load(open(path)); pb = load("playbook")
    for c in prop["changes"]:
        row = pb["weeklyRotation"][c["day"]]
        assert row[c["slot"] - 1] == c["from"], f"rotation changed since the proposal: {c}"
        assert c["slot"] != 3, "the kids slot never changes"
        row[c["slot"] - 1] = c["to"]
        print(f"{c['day']} s{c['slot']}: {c['from']} -> {c['to']}")
    pb["weeklyRotation"]["note"] += f" | {prop['date']}: insights review applied ({len(prop['changes'])} change(s))."
    save("playbook", pb)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    apply(a.file) if a.apply else review(a.file)
