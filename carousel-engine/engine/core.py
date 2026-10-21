"""Paths, config IO, IST dates and history helpers shared by every script."""
import json, os, pathlib, datetime as dt, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config"
DAYS = ROOT / "days"        # specs + metas written per day: days/<date>/s1.spec.json, s1.meta.json
POSTS = ROOT / "posts"      # rendered output: posts/<date>/<slug>/slide_XX.jpg + carousel.pdf
LOGS = ROOT / "logs"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))

SLOTS = {1: "08:30", 2: "10:30", 3: "19:00", 4: "21:00"}
KIDS_SLOT = 3
STYLES = ["ember", "mist", "terracotta", "paper"]
LAYOUTS = ["cards", "grid", "editorial", "notebook"]

# rotation label -> post.format stored in history
FORMAT_CODE = {
    "BIG-NUMBER CHEAT SHEET": "mega",
    "NOTES DROP": "notes-drop",
    "KIDS (big tool/role)": "mega-kids",
    "ROLE VS": "vs-split",
    "proven interview list": "list",
    "roadmap/plan": "plan",
}
CODE_FORMAT = {v: k for k, v in FORMAT_CODE.items()}
# Formats the replacer may swap in (all proven, none retired)
PROVEN = ["BIG-NUMBER CHEAT SHEET", "NOTES DROP", "ROLE VS", "proven interview list", "roadmap/plan"]
RETIRED_CODES = {"analogy", "flowchart", "glossary", "myth-fact", "versus", "practice-pack", "reel-scroll",
                 "prompt-sheet", "get-hired", "mistakes", "challenge", "quiz", "jd-teardown"}


def now_ist():
    return dt.datetime.now(IST)


def today_ist():
    return now_ist().date()


def parse_date(s):
    return dt.date.fromisoformat(s) if s else today_ist()


def weekday(d):
    return d.strftime("%a")


def load(name):
    return json.load(open(CONFIG / f"{name}.json", encoding="utf-8"))


def save(name, data):
    p = CONFIG / f"{name}.json"
    tmp = p.with_suffix(".tmp")
    json.dump(data, open(tmp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    os.replace(tmp, p)


def history():
    return load("post_history")


def days_between(a, b):
    return (dt.date.fromisoformat(str(a)) - dt.date.fromisoformat(str(b))).days


def window(hist, d, days):
    """Posts dated within the `days` days before d (excluding d)."""
    return [p for p in hist if p.get("date") and 0 < days_between(d, p["date"]) <= days]


def live(posts):
    """Posts that went or will go out (rejected ones don't count against freshness)."""
    return [p for p in posts if p.get("status") != "rejected"]


def norm_title(t):
    t = re.sub(r"\(.*?\)", "", t or "").lower()
    return re.sub(r"[^a-z0-9 ]+", " ", t).split()


def title_template(t):
    """Shape of a title with numbers and tool names masked, to catch 'same template twice in 3 days'."""
    tools = r"\b(sql|excel|power bi|powerbi|python|pandas|dax|power query|tableau|statistics|data analyst|analyst)\b"
    t = re.sub(r"\(.*?\)", "", (t or "").lower())
    t = re.sub(tools, "X", t)
    t = re.sub(r"\d+", "N", t)
    return re.sub(r"\s+", " ", t).strip()


def similar(a, b):
    """Jaccard on content words: 0..1."""
    stop = {"the", "a", "an", "to", "you", "your", "in", "of", "for", "and", "every", "i", "d", "s", "it", "with", "need", "only", "that", "will",
            # fixed series wording (kids / role vs) says nothing about the topic
            "how", "explain", "5", "year", "old", "cartoon", "vs", "or", "data", "analyst", "split", "pages", "mega", "sheet", "notes", "pdf", "page"}
    x, y = set(norm_title(a)) - stop, set(norm_title(b)) - stop
    return len(x & y) / max(1, len(x | y))


def log(msg, fh=None):
    line = f"[{now_ist():%Y-%m-%d %H:%M:%S} IST] {msg}"
    print(line, flush=True)
    if fh: fh.write(line + "\n"); fh.flush()


def open_log(kind):
    LOGS.mkdir(exist_ok=True)
    return open(LOGS / f"{now_ist():%Y-%m-%d}_{kind}.log", "a", encoding="utf-8")


def python_exe():
    v = ROOT / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    return str(v if v.exists() else sys.executable)
