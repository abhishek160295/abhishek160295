"""Schedule the engine in IST: make_day 05:50, replace_rejected 11:50 and 16:50.

  python tools/install_schedule.py            write the files + print the exact commands
  python tools/install_schedule.py --install  also run them (Mac: launchctl, Windows: schtasks)
  python tools/install_schedule.py --remove   unload / delete the jobs

IST times are converted to this computer's local time zone (they stay the same if the machine is on IST).
Every run appends to logs/<date>_<job>.log; launchd/Task Scheduler output also goes to logs/scheduler.log.
"""
import argparse, datetime as dt, os, pathlib, platform, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
JOBS = [("make_day", "make_day.py", "05:50"), ("replace_1150", "replace_rejected.py", "11:50"), ("replace_1650", "replace_rejected.py", "16:50")]
LABEL = "com.thedataguy16.{}"


def local_time(hhmm):
    h, m = map(int, hhmm.split(":"))
    t = dt.datetime.now(IST).replace(hour=h, minute=m, second=0, microsecond=0)
    return t.astimezone().strftime("%H:%M")


def mac(install, remove):
    agents = pathlib.Path.home() / "Library" / "LaunchAgents"
    out = ROOT / "schedule"; out.mkdir(exist_ok=True)
    py = ROOT / ".venv" / "bin" / "python"
    cmds = []
    for name, script, ist in JOBS:
        hh, mm = map(int, local_time(ist).split(":"))
        label = LABEL.format(name)
        # login shell so `claude` (npm global) is on PATH
        shell = f'cd "{ROOT}" && "{py}" {script} >> logs/scheduler.log 2>&1'
        plist = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>{label}</string>
  <key>ProgramArguments</key><array><string>/bin/zsh</string><string>-lc</string><string>{shell}</string></array>
  <key>StartCalendarInterval</key><dict><key>Hour</key><integer>{hh}</integer><key>Minute</key><integer>{mm}</integer></dict>
  <key>WorkingDirectory</key><string>{ROOT}</string>
  <key>StandardOutPath</key><string>{ROOT}/logs/scheduler.log</string>
  <key>StandardErrorPath</key><string>{ROOT}/logs/scheduler.log</string>
</dict></plist>
"""
        f = out / f"{label}.plist"; f.write_text(plist)
        dest = agents / f.name
        if remove:
            cmds += [f'launchctl bootout gui/$(id -u) "{dest}"', f'rm "{dest}"']
        else:
            cmds += [f'cp "{f}" "{dest}"', f'launchctl bootout gui/$(id -u) "{dest}" 2>/dev/null; launchctl bootstrap gui/$(id -u) "{dest}"']
        print(f"{label}: {ist} IST = {hh:02d}:{mm:02d} local")
    return cmds


def windows(install, remove):
    out = ROOT / "schedule"; out.mkdir(exist_ok=True)
    py = ROOT / ".venv" / "Scripts" / "python.exe"
    cmds = []
    for name, script, ist in JOBS:
        bat = out / f"run_{name}.cmd"
        bat.write_text(f'@echo off\r\ncd /d "{ROOT}"\r\n"{py}" {script} >> logs\\scheduler.log 2>&1\r\n')
        tn = f"DataGuy {name}"
        if remove:
            cmds.append(f'schtasks /Delete /TN "{tn}" /F')
        else:
            cmds.append(f'schtasks /Create /TN "{tn}" /TR "\\"{bat}\\"" /SC DAILY /ST {local_time(ist)} /F')
        print(f"{tn}: {ist} IST = {local_time(ist)} local")
    return cmds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--install", action="store_true")
    ap.add_argument("--remove", action="store_true")
    a = ap.parse_args()
    (ROOT / "logs").mkdir(exist_ok=True)
    sysname = platform.system()
    if sysname == "Darwin":
        cmds = mac(a.install, a.remove)
    elif sysname == "Windows":
        cmds = windows(a.install, a.remove)
    else:
        print("Linux: add these to `crontab -e` (times in local time):")
        for name, script, ist in JOBS:
            h, m = local_time(ist).split(":")
            print(f'{int(m)} {int(h)} * * * cd "{ROOT}" && .venv/bin/python {script} >> logs/scheduler.log 2>&1')
        return
    print("\nCommands:" if not (a.install or a.remove) else "\nRunning:")
    for c in cmds:
        print("  " + c)
        if a.install or a.remove:
            subprocess.run(c, shell=True)


if __name__ == "__main__":
    sys.exit(main())
