"""Run a real Python snippet and record every executed line with the list it works on and chosen variables.
The reel animation is driven only by this trace, so what people see is what the code actually does."""
import sys, io, contextlib, copy


def trace(code, list_var, show_vars=(), max_events=4000):
    events, out = [], io.StringIO()
    lines = code.split("\n")

    def snap(frame, lineno):
        loc = frame.f_locals
        lst = loc.get(list_var)
        events.append({
            "line": lineno,
            "list": copy.deepcopy(lst) if isinstance(lst, list) else None,
            "vars": {k: copy.deepcopy(loc[k]) for k in show_vars if k in loc and isinstance(loc[k], (int, float, bool, str))},
            "stdout": out.getvalue(),
        })
        if len(events) > max_events:
            raise RuntimeError("trace too long: use a smaller input")

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<reel>":
            return tracer
        if event == "line":
            snap(frame, frame.f_lineno)
        return tracer

    g = {"__name__": "__reel__"}
    with contextlib.redirect_stdout(out):
        sys.settrace(tracer)
        try:
            exec(compile(code, "<reel>", "exec"), g)
        finally:
            sys.settrace(None)
    # state after the last line ran
    events.append({"line": None, "list": copy.deepcopy(g.get(list_var)), "vars": {k: g[k] for k in show_vars if k in g and isinstance(g[k], (int, float, bool, str))},
                   "stdout": out.getvalue()})
    return events, out.getvalue(), lines
