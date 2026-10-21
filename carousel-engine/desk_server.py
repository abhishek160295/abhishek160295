"""Local approval desk: python desk_server.py  ->  http://127.0.0.1:8765

Day-wise queue sorted by slot time. Approve / reject / posted, copy caption, copy keyword,
download all slides as a zip (with the chosen cover first), download the PDF, pick cover A or B.
Reads and writes desk/desk.db; every change is mirrored into config/post_history.json.
Listens on localhost only.
"""
import io, json, mimetypes, re, sys, zipfile, argparse, subprocess, threading, time, datetime as dt
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
from engine.core import ROOT, load, now_ist, python_exe, LOGS
from engine import store

PAGE = ROOT / "desk" / "index.html"
SERVE = [ROOT / "posts"]  # only rendered output is served


def slides_for(p):
    sl = [s["path"] for s in p.get("slides", [])]
    if p.get("coverChoice") == "b" and p.get("coverAlt") and sl:
        sl[0] = p["coverAlt"]["path"]
    return sl


class H(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="application/json", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode()
        elif isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path in ("/", "/index.html"):
            return self._send(200, PAGE.read_bytes(), "text/html; charset=utf-8")
        if path == "/api/posts":
            store.sync_from_history()
            return self._send(200, store.posts())
        if path == "/api/auto":
            return self._send(200, {"replaceAfterMinutes": load("engine").get("replaceAfterMinutes", 20), "running": AUTO.status()})
        m = re.fullmatch(r"/api/posts/([\w-]+)/slides\.zip", path)
        if m:
            p = next((x for x in store.posts() if x["id"] == m.group(1)), None)
            if not p:
                return self._send(404, {"error": "no such post"})
            buf = io.BytesIO()
            with zipfile.ZipFile(buf, "w", zipfile.ZIP_STORED) as z:
                for i, f in enumerate(slides_for(p), 1):
                    z.write(ROOT / f, f"{p['slug']}_{i:02d}.jpg")
            return self._send(200, buf.getvalue(), "application/zip",
                              {"Content-Disposition": f'attachment; filename="{p["date"]}_{p["slug"]}_slides.zip"'})
        if path.startswith("/files/"):
            f = (ROOT / path[len("/files/"):]).resolve()
            if not any(str(f).startswith(str(d.resolve())) for d in SERVE) or not f.is_file():
                return self._send(404, {"error": "not found"})
            ctype = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
            extra = {"Accept-Ranges": "bytes"}
            if "dl=1" in self.path:
                extra["Content-Disposition"] = f'attachment; filename="{f.parent.name}{f.suffix}"'
            data = f.read_bytes()
            rng = re.fullmatch(r"bytes=(\d*)-(\d*)", self.headers.get("Range") or "")
            if rng and (rng.group(1) or rng.group(2)):  # Safari needs byte ranges to play video
                a = int(rng.group(1)) if rng.group(1) else len(data) - int(rng.group(2))
                b = int(rng.group(2)) if rng.group(1) and rng.group(2) else len(data) - 1
                b = min(b, len(data) - 1)
                extra["Content-Range"] = f"bytes {a}-{b}/{len(data)}"
                return self._send(206, data[a:b + 1], ctype, extra)
            return self._send(200, data, ctype, extra)
        self._send(404, {"error": "not found"})

    def do_POST(self):
        path = urlparse(self.path).path
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        m = re.fullmatch(r"/api/posts/([\w-]+)/(status|cover|replace-now|keep-rejected)", path)
        if not m:
            return self._send(404, {"error": "not found"})
        try:
            pid, act = m.group(1), m.group(2)
            if act == "status":
                store.set_status(pid, body.get("status"))
            elif act == "cover":
                store.set_cover(pid, body.get("choice"))
            elif act == "keep-rejected":
                store.set_fields(pid, noReplace=True)
            else:
                store.set_fields(pid, noReplace=False, rejectedAt="2000-01-01T00:00:00+05:30")  # due now
                AUTO.kick()
        except (KeyError, ValueError) as e:
            return self._send(400, {"error": str(e)})
        self._send(200, {"ok": True})


class AutoReplacer:
    """Every 30 s: a rejected post with no replacement, older than engine.replaceAfterMinutes and not marked
    'keep rejected', starts replace_rejected.py for its date (one run per date at a time)."""
    def __init__(self):
        self.running = {}  # date -> Popen
        self.ev = threading.Event()

    def kick(self):
        self.ev.set()

    def status(self):
        return {d: p.poll() is None for d, p in self.running.items()}

    def loop(self):
        while True:
            try:
                self.tick()
            except Exception as e:
                print("auto-replace:", e)
            self.ev.wait(30); self.ev.clear()

    def tick(self):
        delay = dt.timedelta(minutes=load("engine").get("replaceAfterMinutes", 20))
        now = now_ist()
        due = set()
        for p in store.posts():
            if p.get("status") != "rejected" or p.get("replacedBy") or p.get("noReplace") or not p.get("rejectedAt"):
                continue
            if now - dt.datetime.fromisoformat(p["rejectedAt"]) >= delay:
                due.add(p["date"])
        for date in due:
            proc = self.running.get(date)
            if proc and proc.poll() is None:
                continue
            print(f"auto-replace: starting replace_rejected.py --date {date}")
            self.running[date] = subprocess.Popen([python_exe(), "replace_rejected.py", "--date", date], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)  # it writes logs/<date>_replace.log itself


AUTO = AutoReplacer()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8765)
    a = ap.parse_args()
    n = store.bootstrap_from_history()
    if n:
        print(f"Loaded {n} posts from config/post_history.json into the desk")
    threading.Thread(target=AUTO.loop, daemon=True).start()
    srv = ThreadingHTTPServer(("127.0.0.1", a.port), H)
    print(f"Desk running at http://127.0.0.1:{a.port}  (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    sys.exit(main())
