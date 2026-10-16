"""Free word timings: split each voice file on silence, spread the known script words over speech time.
Usage: python3 align.py vo/sections.json public/ep/vo%02d.mp3 out.json   (same shape as Scribe words.json)"""
import json, re, subprocess, sys

def speech_spans(path, db=-35, gap=0.12):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=n={db}dB:d={gap}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    dur = float(re.search(r'Duration: (\d+):(\d+):([\d.]+)', log).groups()[2]) + 60 * float(re.search(r'Duration: (\d+):(\d+)', log).group(2))
    ss = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    spans, t = [], 0.0
    for a, b in zip(ss, se + [dur] * (len(ss) - len(se))):
        if a > t + 0.02: spans.append((t, a))
        t = b
    if dur > t + 0.02: spans.append((t, dur))
    return spans

def align(text, spans):
    words = re.sub(r'\[[^\]]*\]', ' ', text).split()
    # weight ~ spoken length; numbers read longer
    wt = [len(re.sub(r'[^\w]', '', w)) + 1.5 + (4 if re.search(r'\d', w) else 0) for w in words]
    W, S = len(words), len(spans)
    rate = sum(wt) / sum(b - a for a, b in spans)
    cum = [0.0]
    for k in wt: cum.append(cum[-1] + k)
    brk = [bool(re.search(r'[.,?!;:\u2026-]$', w)) for w in words]
    # DP: give each silence-separated span a contiguous run of words; prefer breaks at punctuation
    INF = float('inf')
    best = [[INF] * (W + 1) for _ in range(S + 1)]; back = [[0] * (W + 1) for _ in range(S + 1)]
    best[0][0] = 0.0
    for si in range(1, S + 1):
        d = spans[si - 1][1] - spans[si - 1][0]
        for j in range(1, W + 1):
            for i in range(max(0, j - 60), j):
                if best[si - 1][i] == INF: continue
                c = best[si - 1][i] + ((cum[j] - cum[i]) / rate - d) ** 2 / max(d, 0.3) + (0 if j == W or brk[j - 1] else 0.6)
                if c < best[si][j]: best[si][j], back[si][j] = c, i
    cuts, j = [W], W
    for si in range(S, 0, -1):
        j = back[si][j]; cuts.append(j)
    cuts.reverse()
    out = []
    for si, (a, b) in enumerate(spans):
        i0, i1 = cuts[si], cuts[si + 1]
        tw = cum[i1] - cum[i0] or 1
        for k in range(i0, i1):
            out.append({'text': words[k], 'type': 'word', 'start': round(a + (cum[k] - cum[i0]) / tw * (b - a), 3),
                        'end': round(a + (cum[k + 1] - cum[i0]) / tw * (b - a), 3)})
    return out

if __name__ == '__main__':
    secs = json.load(open(sys.argv[1]))
    res = [align(s['text'], speech_spans(sys.argv[2] % (i + 1))) for i, s in enumerate(secs)]
    json.dump({'words': res}, open(sys.argv[3], 'w'))
