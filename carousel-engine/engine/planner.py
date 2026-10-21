"""Day planner: weekly rotation -> 4 slot briefs that already respect the freshness rules.

The planner decides WHAT each slot is (format, tool/topic/pair, style, layout, hook family, evidence).
The writer (Claude) decides the words. Validation re-checks everything before anything is saved.
"""
import datetime as dt, json, re
from .core import (load, history, window, live, days_between, SLOTS, KIDS_SLOT, STYLES, LAYOUTS,
                   FORMAT_CODE, PROVEN, RETIRED_CODES, weekday, DAYS, title_template)

NOTES_TOOLS = ["Excel", "SQL", "Power BI", "Python", "pandas"]


def _is_role_vs(p):
    return p.get("format") == "vs-split" and (p.get("hookType") == "role-vs" or "analyst" in (p.get("title") or "").lower())


def _retired(label, pb):
    txt = " ".join(r for r in pb["freshnessRules"] if r.startswith("RETIRED")).lower()
    code = FORMAT_CODE.get(label, label)
    return code in RETIRED_CODES or label.lower() in txt


def freshness_break(label, d, hist, pb, taken):
    """Return a reason string if putting `label` on date d would break a rule, else None."""
    if label in taken:
        return f"{label} already used today"
    if _retired(label, pb):
        return f"{label} is RETIRED in freshnessRules"
    wk = live(window(hist, d, 7))
    if label == "roadmap/plan":
        n = sum(1 for p in wk if p.get("format") == "plan")
        if n >= 2:
            return f"Roadmap/plan max 2 per week: already {n} in the last 7 days"
    if label == "ROLE VS":
        n = sum(1 for p in wk if _is_role_vs(p))
        if n >= 5:
            return f"ROLE VS max 5 per week: already {n} in the last 7 days"
        if not pick_role_pair(d, pb):
            return "ROLE VS: every queued pair was used in the last 60 days"
    return None


def evidence_winners(pb):
    """evidence_oct winners mapped to formats we may still post, best first."""
    out = []
    for w in pb["evidence_oct"]["winners"]:
        lw = w.lower()
        if lw.startswith("kids") or "reel" in lw or "excel vs power bi" in lw:
            continue  # kids has its own slot; reels banned; tool-vs-tool retired
        if "split da vs" in lw:
            out.append(("ROLE VS", w))
        elif any(k in lw for k in ("shortcut", "cheat sheet", "one-liners")):
            out.append(("BIG-NUMBER CHEAT SHEET", w))
        elif "top 10" in lw:
            out.append(("proven interview list", w))
    for w in pb["evidence_week1"]["rows"]:
        if "45-day roadmap" in w:
            out.append(("roadmap/plan", w))
        if w.startswith("16 SQL problems"):
            out.append(("proven interview list", w.split(";")[0]))
    return out


def swap_for(label, reason, d, hist, pb, taken):
    for fmt, ev in evidence_winners(pb):
        if fmt != label and not freshness_break(fmt, d, hist, pb, taken):
            return fmt, f"Swapped from {label}: {reason}. Closest evidence_oct winner instead: {ev}."
    for fmt in PROVEN:
        if fmt != label and not freshness_break(fmt, d, hist, pb, taken):
            return fmt, f"Swapped from {label}: {reason}. Next proven format."
    raise RuntimeError(f"no format left for slot ({label}: {reason})")


# ---------- topic pickers ----------
def _base(topic):
    return re.sub(r"\s*part\s*\d.*$", "", topic, flags=re.I).strip().lower()


def pick_kids_topic(d, pb, hist, exclude=()):
    kr = pb["kidsRules"]
    done = {x["topic"].lower(): x["date"] for x in kr["done"]}
    rejected = {t.lower() for t in kr.get("rejectedTopics", [])}
    recent_titles = " ".join((p.get("title") or "").lower() for p in window(hist, d, kr.get("noRepeatDays", 60)))
    for t in kr["queue"]:
        if t in exclude:
            continue
        lt, base = t.lower(), _base(t)
        if lt in done and days_between(d, done[lt]) <= kr.get("noRepeatDays", 60):
            continue
        if lt in rejected or base in rejected:
            continue
        if "part 2" in lt or "part 3" in lt:
            first = done.get(base) or next((v for k, v in done.items() if k.startswith(base.split()[0])), None)
            if first and days_between(d, first) < kr.get("partTwoAfterDays", 21):
                continue
        elif base in done and days_between(d, done[base]) <= 60:
            continue
        if f"explain {base}" in recent_titles:
            continue
        return t
    return None


def pick_role_pair(d, pb, exclude=()):
    used = {x["pair"].lower(): x["date"] for x in pb["roleVs"]["used"]}
    for pair in pb["roleVs"]["queue"]:
        if pair in exclude:
            continue
        if pair.lower() in used and days_between(d, used[pair.lower()]) <= 60:
            continue
        return pair
    return None


def _lru(tools, used, avoid):
    last = {}
    for u in used:
        last[u["tool"]] = max(last.get(u["tool"], ""), u["date"])
    cands = [t for t in tools if t not in avoid]
    return sorted(cands, key=lambda t: (last.get(t, ""), tools.index(t)))[0]


def pick_cheat_tool(d, pb, avoid=()):
    cs = pb["cheatSheet"]
    yday = (d - dt.timedelta(days=1)).isoformat()
    yday_tools = {u["tool"] for u in cs["used"] if u["date"] == yday}
    return _lru(cs["tools"], cs["used"], set(avoid) | yday_tools)


def pick_notes_tool(d, pb, avoid=()):
    return _lru(NOTES_TOOLS, pb["notesDrop"]["used"], set(avoid))


# ---------- styling ----------
MEGA_LIKE = {"BIG-NUMBER CHEAT SHEET", "NOTES DROP", "KIDS (big tool/role)", "ROLE VS"}


def style_layout(label, slot, d, hist, used_styles, used_layouts):
    if label in MEGA_LIKE:
        return "paper", "editorial"
    yday = (d - dt.timedelta(days=1)).isoformat()
    y = next((p for p in hist if p.get("date") == yday and p.get("slot") == slot and p.get("status") != "rejected"), {})
    st = next(s for s in STYLES if s != "paper" and s not in used_styles and s != y.get("style"))
    ly = next(l for l in LAYOUTS if l != "editorial" and l not in used_layouts and l != y.get("layout"))
    return st, ly


def hook_for(label, eng, used_hooks):
    for h in eng["formatHooks"].get(label, ["big-list"]):
        if h not in used_hooks:
            return h
    return eng["formatHooks"][label][0]


PILLAR = {"BIG-NUMBER CHEAT SHEET": "Skills", "NOTES DROP": "Skills", "KIDS (big tool/role)": "Kids",
          "ROLE VS": "Career", "proven interview list": "Interview", "roadmap/plan": "Roadmap"}


def pick_hooks(label, pb, used_today=()):
    """Cover A family + cover B mechanic from playbook.hookBank, least recently used first."""
    hb = pb.get("hookBank")
    if not hb:
        return None, None
    last = {}
    for u in hb.get("usage", []):
        for k in (u.get("family"), u.get("mechanic")):
            if k: last[k] = max(last.get(k, ""), u["date"])
    fams = [f for f in hb["families"] if f["status"] != "locked" and label in f["formats"] and f["id"] not in used_today]
    fams = fams or [f for f in hb["families"] if f["status"] != "locked" and label in f["formats"]]
    fam = sorted(fams, key=lambda f: (last.get(f["id"], ""), f["status"] != "proven"))[0] if fams else None
    mechs = [m for m in hb["coverBMechanics"] if m["formats"] == "all" or label in m["formats"]]
    if label == "KIDS (big tool/role)":
        mechs = [m for m in mechs if m["id"] in ("simple-explainer", "comment-line", "save-before")]
    mech = sorted(mechs, key=lambda m: (m["id"] in used_today, last.get(m["id"], ""), m["id"] != "simple-explainer"))[0] if mechs else None
    return fam, mech


def brief_for(label, slot, d, hist, pb, eng, taken_topics, used_hooks, used_styles, used_layouts, why_prefix=""):
    st, ly = style_layout(label, slot, d, hist, used_styles, used_layouts)
    b = {"slot": slot, "slotTime": SLOTS[slot], "rotation": label, "format": FORMAT_CODE[label],
         "pillar": PILLAR[label], "style": st, "layout": ly, "hookType": hook_for(label, eng, used_hooks),
         "evidence": eng["formatEvidence"][label], "why": (why_prefix + " " if why_prefix else "") + eng["formatEvidence"][label]}
    fam, mech = pick_hooks(label, pb, used_hooks)
    if fam:
        b["hookFamily"] = fam["id"]
        b["hookA"] = {"family": fam["name"], "why": fam["why"], "patterns": fam["examples"]}
    if mech:
        b["coverBMechanic"] = mech["id"]
        b["hookB"] = {"mechanic": mech["id"], "how": mech["how"], "example": mech["example"]}
    if fam or mech:
        used_hooks.extend(x["id"] for x in (fam, mech) if x)
    if label == "KIDS (big tool/role)":
        t = pick_kids_topic(d, pb, hist, exclude=taken_topics.get("kids", ()))
        if not t:
            raise RuntimeError("kidsRules.queue is exhausted: add big tools/roles to the queue")
        b["topic"] = t
        b["brief"] = (f"Kids series. marker_cover title exactly \"How I'd explain<br>{t}<br>to a 5-year-old\" (shorten the topic for the cover if long), "
                      "2 kids slides x 6 cells (term, kid <=22 words from an Indian kid's day, sql = REAL syntax 1-2 short lines, emoji = 1-2 Noto emoji), "
                      "mascot assets/mascot.jpg on both kids slides, then cta 'Now teach<br>a ~friend~.'. style paper, format mega-kids.")
    elif label == "ROLE VS":
        pair = pick_role_pair(d, pb, exclude=taken_topics.get("pair", ()))
        b["topic"] = pair
        b["brief"] = (f"ROLE VS split on the career pair '{pair}'. marker_cover 'X<br>vs<br>Y' + 5-7 split slides (what they do, tools, a normal day, output, maths, "
                      "entry route for freshers, skills asked) + cta. No salaries, no invented stats. Vary the title template vs the last 3 days.")
    elif label == "BIG-NUMBER CHEAT SHEET":
        tool = pick_cheat_tool(d, pb, avoid=taken_topics.get("tool", ()))
        b["topic"] = tool
        b["brief"] = (f"Mega paper cheat sheet on {tool}. Odd/large number 25-60 in the title ('the only X cheat sheet you need', 'N X that pay you forever', "
                      "'N X you will use at work'). Never 'Top 10'. marker_cover + 2-3 sheet/bigtable pages + cta. Every row verified.")
    elif label == "NOTES DROP":
        tool = pick_notes_tool(d, pb, avoid=taken_topics.get("tool", ()))
        b["topic"] = tool
        b["brief"] = (f"Real notes PDF on {tool}: 15-25 notes pages (sheet/bigtable pages, paper style). spec.preview_pages = 8 so the post shows cover + first 8 pages + cta; "
                      "the PDF keeps every page. CTA and caption state the real page count. Vary the title template (recent: 'Complete X Notes', 'X for Data Analysis notes').")
    elif label == "proven interview list":
        tool = pick_cheat_tool(d, pb, avoid=taken_topics.get("tool", ()))
        b["topic"] = tool
        b["brief"] = (f"Big interview list on {tool}: 15-30 numbered items with real answers/code (list slides, max 2 code items or 3 text items per slide, "
                      "code lines <= 38 chars), cover with art + badge + cover_alt with a different hook.")
    elif label == "roadmap/plan":
        b["topic"] = "data analyst plan"
        b["brief"] = "Time-boxed plan: cover + timeline slides (2 phases each) + table + cta. Real tasks only."
    return b


def plan_day(d, write=True):
    pb, eng, hist = load("playbook"), load("engine"), history()
    wd = weekday(d)
    row = pb["weeklyRotation"][wd]
    taken, notes, slots = [], [], []
    taken_topics = {"tool": [], "kids": [], "pair": []}
    used_hooks, used_styles, used_layouts = [], [], []
    if "proven interview list" in row:
        used_hooks.append("big-list")  # the interview list owns big-list that day
    for i, label in enumerate(row, 1):
        why_prefix = ""
        if i == KIDS_SLOT:
            label = "KIDS (big tool/role)"  # kids never swaps (hard rule 4)
        else:
            r = freshness_break(label, d, hist, pb, taken)
            if r:
                new, why_prefix = swap_for(label, r, d, hist, pb, taken)
                notes.append(f"s{i}: {why_prefix}")
                label = new
        if label == "proven interview list" and "big-list" in used_hooks:
            used_hooks.remove("big-list")
        b = brief_for(label, i, d, hist, pb, eng, taken_topics, used_hooks, used_styles, used_layouts, why_prefix)
        taken.append(label)
        if label in ("BIG-NUMBER CHEAT SHEET", "NOTES DROP", "proven interview list"):
            taken_topics["tool"].append(b["topic"])
        used_hooks.append(b["hookType"]); used_styles.append(b["style"]); used_layouts.append(b["layout"])
        slots.append(b)
    plan = {"date": d.isoformat(), "weekday": wd, "slots": slots, "swaps": notes, "banned": banned(d, hist)}
    if write:
        out = DAYS / d.isoformat(); out.mkdir(parents=True, exist_ok=True)
        json.dump(plan, open(out / "plan.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    return plan


def banned(d, hist):
    w60 = window(hist, d, 60)
    w3 = live(window(hist, d, 3))
    return {
        "titles_last_60_days": sorted({p["title"] for p in w60 if p.get("title")}),
        "rejected_titles_any_time": sorted({p["title"] for p in hist if p.get("status") == "rejected" and p.get("title")}),
        "title_templates_last_3_days": sorted({title_template(p["title"]) for p in w3 if p.get("title")}),
        "keywords_used": sorted({p["keyword"] for p in hist if p.get("keyword")}),
    }
