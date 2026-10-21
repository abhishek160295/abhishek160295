"""Daily generator for @thedataguy16: 4 carousels for one IST date.

  python make_day.py [--date YYYY-MM-DD]          plan -> Claude writes + checks -> finalize -> desk -> notification
  python make_day.py plan     [--date D]          only write days/<D>/plan.json
  python make_day.py check    [--date D] [--slots s1,s2]   lint + verify + render + QA + contact sheet (saves nothing)
  python make_day.py finalize [--date D]          re-check, append to post_history.json, update playbook, load the desk
  --no-write   skip the Claude step (specs already written by hand or in an interactive session)
"""
import argparse, json, sys, traceback
from engine.core import parse_date, open_log, log, DAYS
from engine.planner import plan_day
from engine.notify import notify, post_lines, dm_reminder


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", nargs="?", default="run", choices=["run", "plan", "check", "finalize"])
    ap.add_argument("--date")
    ap.add_argument("--slots")
    ap.add_argument("--no-write", action="store_true")
    ap.add_argument("--set", action="append", default=[], help="override a brief field, e.g. s1.topic=Python (needs --reason)")
    ap.add_argument("--reason", default="")
    a = ap.parse_args()
    d = parse_date(a.date); date = d.isoformat()
    sids = a.slots.split(",") if a.slots else None
    fh = open_log("make_day")
    L = lambda m: log(m, fh)

    if a.cmd == "plan" or (a.cmd == "run" and not (DAYS / date / "plan.json").exists()):
        p = plan_day(d)
        L(f"plan {date} ({p['weekday']}): " + " | ".join(f"s{s['slot']} {s['slotTime']} {s['rotation']} [{s.get('topic')}]" for s in p["slots"]))
        for o in a.set:
            key, val = o.split("=", 1); sid, field = key.split(".", 1)
            b = next(x for x in p["slots"] if f"s{x['slot']}" == sid)
            b["_planned"] = b.get(field)
            note = f"{sid}: {field} {b.get(field)!r} -> {val!r} by hand. {a.reason}".strip()
            b[field] = val; b["why"] = b["why"] + " " + note
            if field == "topic" and b.get("brief"):
                b["brief"] = b["brief"].replace(str(b.get("_planned", "")), val)
            p["swaps"].append(note)
        if a.set:
            json.dump(p, open(DAYS / date / "plan.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        for s in p["swaps"]:
            L("swap " + s)
        if a.cmd == "plan":
            return
    if a.cmd == "check":
        from engine.build import check_day
        rs = check_day(date, sids, L)
        sys.exit(1 if any(r["errors"] for r in rs) else 0)

    from engine.build import finalize
    if a.cmd == "run" and not a.no_write:
        from engine.writer import write_with_claude
        plan = json.load(open(DAYS / date / "plan.json"))
        write_with_claude(date, sids or [f"s{s['slot']}" for s in plan["slots"]] + (["r1"] if plan.get("reel") else []), "day", L)
    posts = finalize(date, sids, L)
    L(f"finalized {len(posts)} posts for {date}")
    body = post_lines(posts) + "\n" + dm_reminder(posts)
    L(body)
    notify(f"{len(posts)} carousels ready for {date}", body)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        fh = open_log("make_day")
        log("FAILED: " + "".join(traceback.format_exception(e)), fh)
        notify("make_day failed", str(e)[:200])
        sys.exit(1)
