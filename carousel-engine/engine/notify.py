"""Desktop notification on Mac (osascript), Windows (PowerShell toast) or Linux (notify-send). Never fails the run."""
import platform, subprocess, shutil


def notify(title, body):
    try:
        s = platform.system()
        if s == "Darwin":
            esc = lambda x: x.replace("\\", "\\\\").replace('"', '\\"')
            subprocess.run(["osascript", "-e", f'display notification "{esc(body)}" with title "{esc(title)}" sound name "Glass"'], timeout=10)
        elif s == "Windows":
            ps = ("[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null;"
                  "$t = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02);"
                  "$x = $t.GetElementsByTagName('text'); $x.Item(0).AppendChild($t.CreateTextNode($env:N_TITLE)) > $null;"
                  "$x.Item(1).AppendChild($t.CreateTextNode($env:N_BODY)) > $null;"
                  "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Carousel Engine').Show([Windows.UI.Notifications.ToastNotification]::new($t))")
            import os
            subprocess.run(["powershell", "-NoProfile", "-Command", ps], env={**os.environ, "N_TITLE": title, "N_BODY": body}, timeout=20)
        elif shutil.which("notify-send"):
            subprocess.run(["notify-send", title, body], timeout=10)
    except Exception as e:
        print(f"(notification skipped: {e})")


def post_lines(posts):
    return "\n".join(f"{p['slotTime']} · {p['format']} · {p['title']} · {p['keyword']}" for p in sorted(posts, key=lambda p: p["slotTime"]))


def dm_reminder(posts):
    kws = ", ".join(p["keyword"] for p in posts)
    return f"Set DM auto-replies for: {kws}"
