"""Lint a post (spec + meta) against the hard rules before it is rendered or saved."""
import re, json, unicodedata
from .core import load, title_template, similar, STYLES, RETIRED_CODES

CTA_1 = "Follow @thedataguy16 and comment {kw}. I'll DM you the full {n}-page PDF."
CTA_2 = "Want the complete 90-day system? Link in bio."
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍]")
DASHES = re.compile("[—–]")
PRICE = re.compile(r"(₹|\bRs\.?\s?\d|\bINR\b|\bprice\b|\bpriced\b|\bdiscount\b|\boffer price\b|/-)", re.I)
META_REQUIRED = ["title", "slug", "caption", "hashtags", "keyword", "hookType", "pillar", "why"]


def _texts(spec, skip_emoji_fields=True):
    """All visible strings in a spec, with their path."""
    out = []
    def walk(x, path):
        if isinstance(x, dict):
            for k, v in x.items():
                if skip_emoji_fields and k in ("emoji", "mascot", "img"):
                    continue
                walk(v, f"{path}.{k}")
        elif isinstance(x, list):
            for i, v in enumerate(x):
                walk(v, f"{path}[{i}]")
        elif isinstance(x, str):
            out.append((path, x))
    walk(spec, "spec")
    return out


def _plain(s):
    return re.sub(r"<br>|~|\*\*", " ", s)


def lint(spec, meta, brief, pages, day_metas=(), hist=()):
    """Returns (errors, warnings). pages = real PDF page count from the renderer."""
    eng = load("engine")
    E, W = [], []
    for k in META_REQUIRED:
        if not meta.get(k):
            E.append(f"meta.{k} missing")
    if E:
        return E, W
    kw = meta["keyword"]
    fmt = brief["format"]

    # ---- style (rule 2) ----
    if spec.get("style") not in STYLES:
        E.append(f"spec.style must be one of {STYLES}")
    blob = json.dumps(spec).lower()
    if '"ink"' in blob or '"theme": "dark"' in blob:
        E.append("dark theme found (ink/dark). Light themes only")
    if fmt in RETIRED_CODES or (meta.get("format") or fmt) in RETIRED_CODES:
        E.append(f"format {fmt} is RETIRED")

    # ---- structure ----
    sl = spec["slides"]
    if sl[-1]["type"] != "cta" or sl[-1].get("keyword") != kw:
        E.append("last slide must be a cta whose keyword equals meta.keyword")
    if fmt in ("mega", "notes-drop", "mega-kids", "vs-split") and sl[0]["type"] != "marker_cover":
        E.append("this format starts with a marker_cover")
    if fmt in ("list", "plan") and sl[0]["type"] == "cover" and not (sl[0].get("art") and sl[0].get("badge")):
        E.append("non-mega covers need art and badge")
    if fmt == "mega-kids":
        kids = [s for s in sl if s["type"] == "kids"]
        if len(kids) != 2 or any(len(s["cells"]) != 6 for s in kids):
            E.append("kids post = exactly 2 kids slides x 6 cells")
        if "5-year-old" not in sl[0]["title"]:
            E.append("kids cover must read 'How I'd explain <X> to a 5-year-old'")
        for s in kids:
            if not s.get("mascot"):
                E.append("kids slide missing mascot")
            for c in s["cells"]:
                if len(c["kid"].split()) > 22:
                    E.append(f"kids cell '{c['term']}': {len(c['kid'].split())} words (max 22)")
                if not c.get("emoji") or c.get("img"):
                    E.append(f"kids cell '{c['term']}': picture must be Noto emoji, no images")
                elif len([ch for ch in c["emoji"] if unicodedata.category(ch) == "So"]) > 2:
                    E.append(f"kids cell '{c['term']}': max 2 emoji")
                if not c.get("sql"):
                    E.append(f"kids cell '{c['term']}': needs the real syntax line")
    if fmt == "notes-drop":
        body = [s for s in sl[1:] if s["type"] != "cta"]
        if not 15 <= len(body) <= 25:
            E.append(f"notes drop needs 15-25 notes pages, has {len(body)}")
        if not 7 <= int(spec.get("preview_pages", 0)) <= 8:
            E.append("notes drop: set spec.preview_pages to 7 or 8")
    if fmt == "vs-split":
        n = sum(1 for s in sl if s["type"] == "split")
        if not 5 <= n <= 7:
            E.append(f"ROLE VS needs 5-7 split slides, has {n}")
    for s in sl:
        if s["type"] == "list":
            code_items = [it for it in s["items"] if it.get("code")]
            if len(code_items) > 2 or len(s["items"]) > (2 if code_items else 3):
                E.append(f"list slide '{s.get('title')}': max 3 text items or 2 code items")
            for it in code_items:
                for line in it["code"].split("\n"):
                    if len(line) > 38:
                        E.append(f"code line over 38 chars: {line!r}")

    # ---- voice (rule 8) ----
    hype = [w for w in eng["hypeWords"]]
    texts = _texts(spec) + [("meta.caption", meta["caption"]), ("meta.title", meta["title"])]
    for path, t in texts:
        if DASHES.search(t):
            E.append(f"em/en dash in {path}: {t[:60]!r}")
        if EMOJI.search(t):
            E.append(f"emoji outside kids pictures in {path}: {t[:60]!r}")
        low = _plain(t).lower()
        for w in hype:
            if re.search(r"(?<![a-z])" + re.escape(w) + r"(?![a-z])", low):
                E.append(f"hype word '{w}' in {path}")
        if (path.startswith("meta") or path.startswith(f"spec.slides[{len(sl) - 1}]")) and PRICE.search(t):
            E.append(f"price/discount mention in {path}: {t[:60]!r}")
        if re.search(r"\btop\s*10\b", low):
            E.append(f"'Top 10' wording is retired ({path})")
    if re.search(r"\b\d{1,3}%|\b\d+ out of \d+\b", meta["caption"]) and not meta.get("statSource"):
        E.append("caption has a statistic without meta.statSource (never invent stats)")

    # ---- caption + CTA (rule 9) ----
    cap = meta["caption"].strip().split("\n")
    lines = [l for l in cap if l.strip()]
    want1, want2 = CTA_1.format(kw=kw, n=pages), CTA_2
    if len(lines) < 3 or lines[-2].strip() != want1 or lines[-1].strip() != want2:
        E.append(f"caption must end with:\n  {want1}\n  {want2}")
    elif not 1 <= len(lines) - 2 <= 3:
        E.append(f"caption body must be 1-3 short lines, has {len(lines) - 2}")
    for l in lines[:-2]:
        if len(l) > 140:
            W.append(f"caption line is long ({len(l)} chars)")
    m = re.findall(r"(\d+)-page", " ".join(t for _, t in _texts(sl[-1])))
    if any(int(x) != pages for x in m):
        E.append(f"CTA slide says {m} pages, PDF has {pages}")
    if fmt == "notes-drop" and str(pages) not in json.dumps(sl[-1]):
        E.append(f"notes drop CTA must state the real page count ({pages})")
    tags = meta["hashtags"].split() if isinstance(meta["hashtags"], str) else meta["hashtags"]
    if not 5 <= len(tags) <= 6 or not all(t.startswith("#") for t in tags):
        E.append("hashtags: 5-6 tags, each starting with #")

    # ---- keyword ----
    if not re.fullmatch(r"[A-Z0-9]{4,12}", kw):
        E.append("keyword must be 4-12 capital letters/digits")
    used = {p.get("keyword") for p in hist if p.get("id") != meta.get("id")}
    if kw in used:
        E.append(f"keyword {kw} already used")
    if sum(1 for m2 in day_metas if m2.get("keyword") == kw) > 1:  # day_metas includes this post once
        E.append(f"keyword {kw} used twice today")

    # ---- freshness (titles/angles) ----
    b = brief.get("banned", {})
    for t in b.get("titles_last_60_days", []) + b.get("rejected_titles_any_time", []):
        if similar(meta["title"], t) >= 0.6:
            E.append(f"title too close to a recent/rejected post: '{t}'")
    if fmt != "mega-kids" and title_template(meta["title"]) in b.get("title_templates_last_3_days", []):
        E.append("title template used in the last 3 days")
    if not meta["why"].startswith("Proven:") and "Proven:" not in meta["why"]:
        E.append("why must cite 'Proven: <evidence number>'")
    if fmt == "vs-split" and brief.get("topic"):
        a, c = [x.strip().lower() for x in brief["topic"].split(" vs ")]
        if a.split()[-1] not in blob or c.split()[-1] not in blob:
            E.append(f"ROLE VS must cover the planned pair: {brief['topic']}")
    # ---- quality bar (prompts/quality_bar.md) ----
    if sl[0]["type"] == "marker_cover":  # v5: the cover is the hook and nothing else
        words = len(_plain(sl[0]["title"]).split())
        if words > 10:
            W.append(f"cover hook is {words} words; 10 or fewer stops the scroll better")
        if sl[0].get("sub"):
            W.append("cover sub line is ignored: covers show only the hook")
    first = lines[0].strip().lower() if lines else ""
    if re.match(r"(here are|here's|in this post|check out|do you want|are you|want to learn|did you know)", first):
        E.append("caption line 1 opens generically; lead with the pain")
    if len(lines[0]) > 90 if lines else False:
        W.append("caption line 1 is over 90 characters")
    for s in sl:
        if s["type"] == "sheet":
            code_rows = [r for r in s["rows"] if r["formula"].lstrip().startswith(("=", "SELECT", "WITH"))]
            if code_rows and sum(1 for r in code_rows if r.get("result") not in (None, "")) < 0.8 * len(code_rows):
                E.append(f"sheet '{s.get('ribbon') or s['title']}': show the tested result on formula rows (quality bar 2)")
    if fmt == "vs-split":
        heads = " ".join((s.get("top", {}).get("head") or "") for s in sl if s["type"] == "split").lower()
        if "pick" not in heads:
            E.append("ROLE VS needs a 'Pick X if...' decision slide (quality bar 5)")
        if not any(re.search(r"\b(select|from|group by)\b", json.dumps(s).lower()) for s in sl if s["type"] == "split"):
            E.append("ROLE VS needs the same task shown both ways (quality bar 5)")
    if meta.get("illustrative") and "illustrative" not in blob and "example" not in blob:
        E.append("illustrative example must be labelled on the slide")
    return E, W
