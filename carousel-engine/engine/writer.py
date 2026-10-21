"""Hands the day's plan to Claude Code (headless) to research, write, verify and visually check the specs.
Claude edits files in days/<date>/ and runs `python make_day.py check`; Python then re-checks before saving."""
import shutil, subprocess, os
from .core import ROOT, DAYS

TOOLS = "Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Bash(python:*),Bash(python3:*),Bash(.venv/bin/python:*),Bash(.venv\\Scripts\\python:*)"


def claude_exe():
    return os.environ.get("CLAUDE_BIN") or shutil.which("claude")


def write_with_claude(date, sids, mode="day", log=print, timeout=60 * 60):
    exe = claude_exe()
    if not exe:
        raise RuntimeError("Claude Code CLI not found. Install it (npm i -g @anthropic-ai/claude-code) or set CLAUDE_BIN.")
    tpl = (ROOT / "prompts" / "write_posts.md").read_text(encoding="utf-8")
    prompt = tpl.replace("{{DATE}}", date).replace("{{SLOTS}}", ", ".join(sids)).replace("{{MODE}}", mode)
    out = DAYS / date / f"claude_{mode}.txt"
    log(f"claude: writing {', '.join(sids)} for {date} (transcript: {out.relative_to(ROOT)})")
    with open(out, "w", encoding="utf-8") as fh:
        r = subprocess.run([exe, "-p", prompt, "--allowedTools", TOOLS, "--permission-mode", "acceptEdits"],
                           cwd=ROOT, stdout=fh, stderr=subprocess.STDOUT, timeout=timeout)
    if r.returncode != 0:
        raise RuntimeError(f"claude exited with {r.returncode}; see {out}")
