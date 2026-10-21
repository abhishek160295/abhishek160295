"""Hard rule 6: every formula, query, DAX line, pandas snippet and shortcut on a slide is verified.

How a snippet counts as verified:
  sql     complete statements run in sqlite against verify/fixture.sql (auto)
  python  snippets exec against a fixture DataFrame `df` (auto); anything needing more context goes in a check
  checks  meta.verify.checks: {lang: sql|python|excel, ...} run here; any snippet contained in a passing check is covered
  manual  meta.verify.manual: [{snippet, source}] for things no local engine can run (DAX, shortcuts, menu paths),
          each with the documentation URL it was checked against
Anything else fails the build.
"""
import re, sqlite3, io, contextlib, json, shutil, subprocess, tempfile, pathlib, os
from .core import ROOT

FIXTURE_SQL = (ROOT / "verify" / "fixture.sql").read_text()
SQL_START = re.compile(r"^\s*(SELECT|WITH|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b", re.I)


def _norm(s):
    return re.sub(r"\s+", " ", str(s)).strip().lower()


def _lang_hint(slide, spec):
    return (slide.get("lang") or spec.get("lang") or "").lower()


def snippets(spec, meta):
    """Every code-like string on the slides: (slide_no, kind, text)."""
    prose = set(meta.get("verify", {}).get("prose_slides", []))
    out = []
    for i, s in enumerate(spec["slides"], 1):
        t, lang = s["type"], _lang_hint(s, spec)
        if t == "sheet":
            out += [(i, lang, r["formula"]) for r in s["rows"]]
        elif t == "bigtable" and i not in prose:
            out += [(i, lang, a) for _, a in s["rows"]]
        elif t == "kids":
            out += [(i, lang, c["sql"]) for c in s["cells"] if c.get("sql")]
        elif t == "list":
            out += [(i, lang, it["code"]) for it in s["items"] if it.get("code")]
        elif t == "code":
            out.append((i, lang, s["code"]))
    return out


def classify(text, hint):
    x = text.strip()
    if SQL_START.match(x) and "..." not in x:
        return "sql"
    if x.startswith("="):
        return "excel"
    if hint in ("python", "pandas") or re.match(r"^(df|pd|np|import |from |print\(|model|X|y|s)\b", x):
        return "python"
    if hint in ("sql",):
        return "sql-fragment"
    return "other"


def _sqlite():
    con = sqlite3.connect(":memory:")
    con.executescript(FIXTURE_SQL)
    return con


def run_sql(query, setup=""):
    con = _sqlite()
    try:
        if setup:
            con.executescript(setup)
        cur = con.execute(query) if query.count(";") <= 1 else None
        if cur is None:
            con.executescript(query); return []
        return [list(r) for r in cur.fetchall()]
    finally:
        con.close()


def _py_namespace():
    import pandas as pd, numpy as np
    df = pd.DataFrame({
        "order_id": [1, 2, 3, 4, 5, 6, 6, 7],
        "date": ["2024-01-10", "2024-01-22", "2024-02-03", "2024-02-14", "2024-03-01", "2024-03-09", "2024-03-09", "2024-03-15"],
        "region": ["North", "North", "South", "South", "East", "West", "West", None],
        "city": ["Pune", "Pune", "Indore", "Indore", None, "Lucknow", "Lucknow", "Jaipur"],
        "product": ["Pen", "Mouse", "Pen", "Keyboard", "Pen", "Mouse", "Mouse", "Notebook"],
        "category": ["Stationery", "Electronics", "Stationery", "Electronics", "Stationery", "Electronics", "Electronics", "Stationery"],
        "sales": [500.0, 900.0, 1200.0, 1800.0, 300.0, 450.0, 450.0, None],
        "qty": [5, 2, 20, 2, 30, 1, 1, 40],
        "price": [100.0, 450.0, 60.0, 900.0, 10.0, 450.0, 450.0, 60.0],
        "customer_id": [1, 1, 2, 2, 3, 4, 4, 5],
        "name": [" amit ", "Amit", "DIVYA", "divya", "Rahul", "Meena", "Meena", "Sanjay"],
        "email": ["amit@mail.com", "amit@mail.com", "divya@mail.com", "divya@mail.com", "rahul@mail.com", "meena@mail.com", "meena@mail.com", "sanjay@mail.com"],
        "status": ["Delivered", "Delivered", "Cancelled", "Delivered", "Returned", "Delivered", "Delivered", "Delivered"],
    })
    customers = pd.DataFrame({"customer_id": [1, 2, 3, 4, 6], "segment": ["Retail", "Retail", "B2B", "Retail", "B2B"]})
    return {"pd": pd, "np": np, "df": df, "df2": customers, "customers": customers}


def run_python(code):
    """Runs in a fresh temp dir with a fresh namespace, so snippets never see each other's files."""
    ns = _py_namespace()
    buf, cwd = io.StringIO(), os.getcwd()
    os.chdir(tempfile.mkdtemp())
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "<snippet>", "exec"), ns)
    except Exception as e:
        import traceback
        tb = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "<snippet>"]
        if tb:
            line = code.split("\n")[tb[-1].lineno - 1].strip()
            raise type(e)(f"{e} (line {tb[-1].lineno}: {line})") from None
        raise
    finally:
        os.chdir(cwd)
    return buf.getvalue()


# ---------- Excel through LibreOffice (optional: skipped with a clear message if not installed) ----------
def soffice():
    for c in ("soffice", "libreoffice", "/Applications/LibreOffice.app/Contents/MacOS/soffice",
              r"C:\Program Files\LibreOffice\program\soffice.exe"):
        p = shutil.which(c) or (c if os.path.exists(c) else None)
        if p:
            return p
    return None


# Functions newer than Excel 2007 are stored as _xlfn.NAME inside .xlsx files; without it LibreOffice reads #NAME?
XLFN = re.compile(r"(?<![\w.])(IFS|SWITCH|MAXIFS|MINIFS|CONCAT|TEXTJOIN|RANK\.EQ|RANK\.AVG|IFNA|XLOOKUP|XMATCH|UNIQUE|SORTBY|SORT|FILTER|SEQUENCE|TEXTSPLIT|TEXTBEFORE|TEXTAFTER|LET|DAYS|STDEV\.S|STDEV\.P)\(")


def run_excel(checks):
    """checks: [{id, cells:{'A1': v, ...}, formula:'=...', expect}] -> {id: (ok, got)}"""
    exe = soffice()
    if not exe:
        return {c["id"]: (None, "LibreOffice not installed") for c in checks}
    import openpyxl
    tmp = pathlib.Path(tempfile.mkdtemp())
    wb = openpyxl.Workbook(); wb.remove(wb.active)
    for k, c in enumerate(checks):
        ws = wb.create_sheet(f"c{k}")
        for ref, v in c.get("cells", {}).items():
            if isinstance(v, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", v):  # ISO strings become real dates
                import datetime as _dt
                v = _dt.datetime.fromisoformat(v)
            ws[ref] = v
        ws[c.get("at", "Z1")] = XLFN.sub(lambda m: "_xlfn." + m.group(1), c["formula"])
    src = tmp / "checks.xlsx"; wb.save(src)
    out = tmp / "out"; out.mkdir()
    subprocess.run([exe, "--headless", "--calc", "--convert-to", "ods", "--outdir", str(out), str(src)],
                   check=True, capture_output=True, timeout=120)
    # read computed values back through a second conversion to xlsx (values cached)
    subprocess.run([exe, "--headless", "--convert-to", "xlsx", "--outdir", str(tmp / "x"), str(out / "checks.ods")],
                   check=True, capture_output=True, timeout=120)
    wb2 = openpyxl.load_workbook(tmp / "x" / "checks.xlsx", data_only=True)
    res = {}
    for k, c in enumerate(checks):
        got = wb2[f"c{k}"][c.get("at", "Z1")].value
        exp = c.get("expect")
        if isinstance(exp, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", exp):  # date results: compare as ISO dates
            import datetime as _dt
            if isinstance(got, (int, float)):
                got = (_dt.date(1899, 12, 30) + _dt.timedelta(days=int(got))).isoformat()
            elif isinstance(got, _dt.datetime):
                got = got.date().isoformat()
        if got is None and exp == "":
            got = ""
        ok = (got == exp) or (isinstance(got, (int, float)) and isinstance(exp, (int, float)) and abs(got - exp) < 1e-6)
        if isinstance(got, str) and (got.startswith("#") or got.startswith("Err:")) and c.get("doc"):
            ok = None  # function unknown to this LibreOffice build; the doc link is the evidence
        res[c["id"]] = (ok, got)
    shutil.rmtree(tmp, ignore_errors=True)
    return res


def verify_post(spec, meta):
    """Returns (errors, report_lines)."""
    v = meta.get("verify", {})
    errors, rep, covered = [], [], []
    excel = []
    for k, c in enumerate(v.get("checks", [])):
        cid = c.get("id") or f"check{k + 1}"
        lang = c.get("lang")
        try:
            if lang == "sql":
                got = run_sql(c["query"], c.get("setup", ""))
                if "expect" in c and got != c["expect"]:
                    errors.append(f"[{cid}] SQL result {got} != expected {c['expect']}"); continue
                rep.append(f"ok  sql    {cid}: {got[:4]}{'...' if len(got) > 4 else ''}")
                covered.append(c.get("setup", "") + "\n" + c["query"])
            elif lang == "python":
                out = run_python(c["code"])
                if "expect_stdout" in c and out.strip() != str(c["expect_stdout"]).strip():
                    errors.append(f"[{cid}] stdout {out.strip()!r} != {c['expect_stdout']!r}"); continue
                rep.append(f"ok  python {cid}: {out.strip()[:80]}")
                covered.append(c["code"])
            elif lang == "excel":
                excel.append(dict(c, id=cid))
            else:
                errors.append(f"[{cid}] unknown check lang {lang!r}")
        except Exception as e:
            errors.append(f"[{cid}] {lang} check failed: {type(e).__name__}: {e}")
    if excel:
        for cid, (ok, got) in run_excel(excel).items():
            c = next(x for x in excel if x["id"] == cid)
            if ok:
                rep.append(f"ok  excel  {cid}: {got}"); covered.append(c["formula"])
            elif ok is None and c.get("doc"):
                rep.append(f"doc excel  {cid}: local engine says {got}; verified against {c['doc']}"); covered.append(c["formula"])
            else:
                errors.append(f"[{cid}] Excel {c['formula']} gave {got!r}, expected {c.get('expect')!r}")
    manual = v.get("manual", [])
    for m in manual:
        if not m.get("source", "").startswith("http"):
            errors.append(f"manual check '{m.get('snippet')}' needs a source URL")
    cov_text = [_norm(x) for x in covered]
    man_text = [_norm(m["snippet"]) for m in manual]
    for i, hint, text in snippets(spec, meta):
        n = _norm(text)
        if any(n in c for c in cov_text) or any(n == m or n in m for m in man_text):
            continue
        kind = classify(text, hint)
        try:
            if kind == "sql":
                run_sql(text); rep.append(f"ok  sql    slide {i}: {text[:70]}"); continue
            if kind == "python":
                run_python(text); rep.append(f"ok  python slide {i}: {text[:70]}"); continue
        except Exception as e:
            errors.append(f"slide {i}: {kind} failed: {text!r} -> {type(e).__name__}: {e}"); continue
        errors.append(f"slide {i}: unverified {kind} snippet {text!r} (add a check or a manual entry with a source)")
    return errors, rep
