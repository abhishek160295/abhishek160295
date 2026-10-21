"""Replace today's rejected posts (runs 11:50 and 16:50 IST).

For every post rejected today without a replacement, plan a new carousel for the same slot:
  - a different proven format and a clearly different topic (kids stays kids, hard rule 4: new topic, same format)
  - linked both ways (replaces / replacedBy) and a new keyword
Then Claude writes it, the build re-checks it, and it lands in the desk as a draft.

  python replace_rejected.py [--date D] [--no-write] [--plan-only]
"""
import argparse, json, sys, traceback
from engine.core import parse_date, open_log, log, DAYS, load, save, history, live, PROVEN, FORMAT_CODE, CODE_FORMAT
from engine.planner import (plan_day, brief_for, freshness_break, evidence_winners, pick_kids_topic, banned)
from engine.notify import notify, post_lines, dm_reminder


def pending_rejections(date, hist):
    return [p for p in hist if p.get("date") == date and p.get("status") == "rejected" and not p.get("replacedBy") and not p.get("noReplace")]


def pick_format(rej, d, hist, pb, taken):
    """Closest proven winner that is not the rejected format and breaks no rule today."""
    order = [f for f, _ in evidence_winners(pb)] + PROVEN
    seen = []
    for f in order:
        if f in seen:
            continue
        seen.append(f)
        if FORMAT_CODE[f] == rej["format"] or f == "KIDS (big tool/role)":
            continue
        if not freshness_break(f, d, hist, pb, taken):
            return f
    raise RuntimeError(f"no proven format left to replace {rej['id']}")


def plan_replacements(d, L=print):
    date = d.isoformat()
    pf = DAYS / date / "plan.json"
    plan = json.load(open(pf)) if pf.exists() else plan_day(d)
    hist, pb, eng = history(), load("playbook"), load("engine")
    todo = pending_rejections(date, hist)
    plan.setdefault("replacements", {})
    resume = [_sid_for(plan, p["id"]) for p in todo if _sid_for(plan, p["id"])]  # planned earlier, not finalized yet
    todo = [p for p in todo if not _sid_for(plan, p["id"])]
    for sid in resume:
        L(f"resume {sid} (replaces {plan['replacements'][sid]['replaces']})")
    if not todo:
        return plan, resume
    today_live = [p for p in live(hist) if p.get("date") == date]
    taken = [CODE_FORMAT.get(p["format"]) for p in today_live if CODE_FORMAT.get(p.get("format"))]
    topics = {"tool": [p.get("topic") for p in hist if p.get("date") == date], "kids": [], "pair": []}
    hooks = [p.get("hookType") for p in today_live]
    new = []
    for rej in todo:
        slot = rej["slot"]
        n = 1 + sum(1 for k in plan["replacements"] if k.startswith(f"s{slot}-r"))
        sid = f"s{slot}-r{n}"
        if rej["format"] == "mega-kids":
            label = "KIDS (big tool/role)"
            kr = pb["kidsRules"]  # owner said no to this topic: never offer it again
            if rej.get("topic") and rej["topic"] not in kr.setdefault("rejectedTopics", []):
                kr["rejectedTopics"].append(rej["topic"])
            kr["done"] = [x for x in kr["done"] if not (x["topic"] == rej.get("topic") and x["date"] == date)]
            save("playbook", pb)
            topics["kids"] = [rej.get("topic")]
            why = f"Replaces {rej['id']} (kids slot stays kids, new topic)."
        else:
            label = pick_format(rej, d, hist, pb, taken)
            why = f"Replaces {rej['id']} ({rej['format']}, '{rej['title']}'): different proven format."
        b = brief_for(label, slot, d, hist, pb, eng, topics, hooks, [], [], why)
        if label == "KIDS (big tool/role)" and b.get("topic") == rej.get("topic"):
            b["topic"] = pick_kids_topic(d, pb, hist, exclude=[rej.get("topic")])
        b.update(replaces=rej["id"], avoid={"title": rej["title"], "topic": rej.get("topic"), "format": rej["format"],
                                            "keyword": rej.get("keyword")})
        plan["replacements"][sid] = b
        taken.append(label); hooks.append(b["hookType"])
        if b.get("topic"):
            topics["tool"].append(b["topic"])
        new.append(sid)
        L(f"replace {rej['id']} ({rej['format']}: {rej['title']}) -> {sid}: {label} [{b.get('topic')}]")
    plan["banned"] = banned(d, hist)
    json.dump(plan, open(pf, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    return plan, resume + new


def _sid_for(plan, rej_id):
    return next((k for k, b in plan.get("replacements", {}).items() if b.get("replaces") == rej_id), None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date")
    ap.add_argument("--no-write", action="store_true", help="specs already written; just check + finalize")
    ap.add_argument("--plan-only", action="store_true")
    a = ap.parse_args()
    d = parse_date(a.date); date = d.isoformat()
    fh = open_log("replace")
    L = lambda m: log(m, fh)
    plan, sids = plan_replacements(d, L)
    if not sids:
        L(f"no rejected posts waiting for a replacement on {date}")
        return
    if a.plan_only:
        return
    if not a.no_write:
        from engine.writer import write_with_claude
        write_with_claude(date, sids, "replace", L)
    from engine.build import finalize
    posts = finalize(date, sids, L)
    body = post_lines(posts) + "\n" + dm_reminder(posts)
    L(body)
    notify(f"{len(posts)} replacement carousel(s) for {date}", body)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        log("FAILED: " + "".join(traceback.format_exception(e)), open_log("replace"))
        notify("replace_rejected failed", str(e)[:200])
        sys.exit(1)
