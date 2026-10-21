"""Local approval desk: python desk_server.py  ->  http://127.0.0.1:8765

Day-wise queue sorted by slot time. Approve / reject / posted, copy caption, copy keyword,
download all slides as a zip (with the chosen cover first), download the PDF, pick cover A or B.
Reads and writes desk/desk.db; every change is mirrored into config/post_history.json.
Listens on localhost only.
"""
import io, json, mimetypes, re, sys, zipfile, argparse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote
from engine.core import ROOT
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
            extra = {"Content-Disposition": f'attachment; filename="{f.parent.name}.pdf"'} if f.suffix == ".pdf" and "dl=1" in self.path else None
            return self._send(200, f.read_bytes(), mimetypes.guess_type(f.name)[0] or "application/octet-stream", extra)
        self._send(404, {"error": "not found"})

    def do_POST(self):
        path = urlparse(self.path).path
        n = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(n) or b"{}")
        m = re.fullmatch(r"/api/posts/([\w-]+)/(status|cover)", path)
        if not m:
            return self._send(404, {"error": "not found"})
        try:
            if m.group(2) == "status":
                store.set_status(m.group(1), body.get("status"))
            else:
                store.set_cover(m.group(1), body.get("choice"))
        except (KeyError, ValueError) as e:
            return self._send(400, {"error": str(e)})
        self._send(200, {"ok": True})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8765)
    a = ap.parse_args()
    n = store.bootstrap_from_history()
    if n:
        print(f"Loaded {n} posts from config/post_history.json into the desk")
    srv = ThreadingHTTPServer(("127.0.0.1", a.port), H)
    print(f"Desk running at http://127.0.0.1:{a.port}  (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    sys.exit(main())
