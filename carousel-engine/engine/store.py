"""SQLite store behind the local approval desk. post_history.json stays the long-term record;
every status/cover change made in the desk is written to both."""
import sqlite3, json
from .core import ROOT, load, save, now_ist

DB = ROOT / "desk" / "desk.db"
STATUSES = ("draft", "approved", "rejected", "posted")


def connect():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.execute("""CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY, date TEXT, slot TEXT, slotTime TEXT, status TEXT,
        coverChoice TEXT DEFAULT 'a', data TEXT, updatedAt TEXT)""")
    return con


def upsert(post):
    with connect() as con:
        con.execute("""INSERT INTO posts (id,date,slot,slotTime,status,coverChoice,data,updatedAt) VALUES (?,?,?,?,?,?,?,?)
            ON CONFLICT(id) DO UPDATE SET date=excluded.date, slot=excluded.slot, slotTime=excluded.slotTime,
            status=excluded.status, coverChoice=excluded.coverChoice, data=excluded.data, updatedAt=excluded.updatedAt""",
                    (post["id"], post["date"], str(post["slot"]), post.get("slotTime"), post.get("status", "draft"),
                     post.get("coverChoice", "a"), json.dumps(post, ensure_ascii=False), now_ist().isoformat()))


def posts(date=None):
    with connect() as con:
        q = "SELECT * FROM posts" + (" WHERE date=?" if date else "") + " ORDER BY date DESC, slotTime"
        rows = con.execute(q, (date,) if date else ()).fetchall()
    out = []
    for r in rows:
        p = json.loads(r["data"]); p.update(status=r["status"], coverChoice=r["coverChoice"]); out.append(p)
    return out


def _sync_history(pid, **fields):
    h = load("post_history")
    for p in h:
        if p.get("id") == pid:
            p.update(fields)
    save("post_history", h)


def set_status(pid, status):
    if status not in STATUSES:
        raise ValueError(status)
    extra = {"postedAt": now_ist().isoformat()} if status == "posted" else {}
    if status == "rejected":
        extra.update(rejectedAt=now_ist().isoformat(), noReplace=False)
    with connect() as con:
        r = con.execute("SELECT data FROM posts WHERE id=?", (pid,)).fetchone()
        if not r:
            raise KeyError(pid)
        d = json.loads(r["data"]); d.update(status=status, **extra)
        con.execute("UPDATE posts SET status=?, data=?, updatedAt=? WHERE id=?", (status, json.dumps(d, ensure_ascii=False), now_ist().isoformat(), pid))
    _sync_history(pid, status=status, **extra)


def set_cover(pid, choice):
    if choice not in ("a", "b"):
        raise ValueError(choice)
    with connect() as con:
        con.execute("UPDATE posts SET coverChoice=?, updatedAt=? WHERE id=?", (choice, now_ist().isoformat(), pid))
    _sync_history(pid, coverChoice=choice)


def sync_from_history():
    """Pull statuses that changed in post_history.json (e.g. hand edits) into the desk."""
    h = {p["id"]: p for p in load("post_history") if p.get("id")}
    with connect() as con:
        for r in con.execute("SELECT id, status FROM posts").fetchall():
            hp = h.get(r["id"])
            if hp and hp.get("status") and hp["status"] != r["status"]:
                con.execute("UPDATE posts SET status=? WHERE id=?", (hp["status"], r["id"]))


def bootstrap_from_history():
    """Fresh clone or deleted db: load every engine-built post (ones with rendered slides) into the desk."""
    with connect() as con:
        have = {r["id"] for r in con.execute("SELECT id FROM posts").fetchall()}
    n = 0
    for p in load("post_history"):
        if p.get("id") and p.get("slides") and p["id"] not in have:
            upsert(p); n += 1
    return n


def set_fields(pid, **fields):
    with connect() as con:
        r = con.execute("SELECT data FROM posts WHERE id=?", (pid,)).fetchone()
        if not r:
            raise KeyError(pid)
        d = json.loads(r["data"]); d.update(fields)
        con.execute("UPDATE posts SET data=?, updatedAt=? WHERE id=?", (json.dumps(d, ensure_ascii=False), now_ist().isoformat(), pid))
    _sync_history(pid, **fields)
