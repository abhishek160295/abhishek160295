import json, re, difflib
D = '.'
V2 = json.load(open('timeline2.json'))

CARD, CH = 'card', 'chapter'
ORDER = [
    ('cold', [53, 54, 55, 57]),
    ('title', [7]),
    (CARD, ('rewind', '6 MONTHS EARLIER', 2.6)),
    (CH, (1, 'THE FIRST SECOND')), ('lines', range(0, 7)),
    (CH, (2, 'THE PHYSICS OF A FROZEN WORLD')), ('lines', range(8, 19)),
    (CH, (3, 'THE RULES')), ('lines', range(19, 26)),
    (CH, (4, 'THE GOOD DAYS')), ('lines', range(26, 33)),
    (CH, (5, 'THE SILENCE')), ('lines', range(33, 40)),
    (CH, (6, 'THE FALL')), ('lines', range(40, 51)),
    (CH, (7, 'FRIDAY')), ('lines', [51, 52, 56, 58, 59, 60, 61, 62, 63, 64]),
    (CH, (8, 'THE WOMAN IN THE GRAY COAT')), ('lines', range(65, 76)),
    ('outro', [76]),
]
HOLD = {57: 2.2, 5: 1.2, 25: 0.8, 33: 2.5, 36: 1.0, 50: 1.2, 56: 1.0, 68: 1.2, 73: 0.6, 39: 1.0}

# ---- word timings for animated subtitles (script words, ASR timestamps) ----
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
WORDS = {k: json.load(open(f'vo/{k}_words.json')) for k in ['N1', 'N2', 'J', 'W', 'NX', 'WX']}
def word_times(s):
    text = re.sub(r'\[.*?\]\s*', '', s['text'])
    disp = text.split()
    aw = [w for w in WORDS[s['src']] if s['a'] - 0.3 <= w['t'] <= s['b'] + 0.2]
    a_n = [norm(w['w']) for w in aw]
    d_n = [norm(t.replace('-', '')) for t in disp]
    m = {}
    for a, b, n in difflib.SequenceMatcher(None, d_n, a_n, autojunk=False).get_matching_blocks():
        for k in range(n): m[a + k] = aw[b + k]['t'] - s['a']
    # first-part matches for hyphenated / merged words
    for k, t in enumerate(d_n):
        if k in m: continue
        for j, x in enumerate(a_n):
            if x and t.startswith(x) and (k == 0 or (k - 1 in m and aw[j]['t'] - s['a'] > m[k - 1])):
                m[k] = aw[j]['t'] - s['a']; break
    dur = s['b'] - s['a']; out = []
    for k, t in enumerate(disp):
        if k in m: out.append(m[k]); continue
        prev = next((m[j] for j in range(k - 1, -1, -1) if j in m), 0.0)
        nxt = next(((j, m[j]) for j in range(k + 1, len(disp)) if j in m), (len(disp), dur))
        out.append(prev + (nxt[1] - prev) * (1 / (nxt[0] - k + 1)))
    for k in range(1, len(out)): out[k] = max(out[k], out[k - 1] + 0.05)
    return list(zip(disp, out))

entries = []
for kind, val in ORDER:
    if kind in (CARD, CH):
        entries.append(dict(kind=kind, val=val))
    else:
        for i in val:
            e = dict(V2[i]); e['kind'] = kind; e['words'] = word_times(e); entries.append(e)

T = 0.4; tl = []
for n, e in enumerate(entries):
    if e['kind'] == CARD:
        dur = e['val'][2]; tl.append(dict(e, T0=T, T1=T + dur)); T += dur; continue
    if e['kind'] == CH:
        dur = 2.4; tl.append(dict(e, T0=T, T1=T + dur)); T += dur; continue
    d = e['b'] - e['a']
    nxt = entries[n + 1] if n + 1 < len(entries) else None
    gap = 0.35 if e['kind'] == 'cold' else (0.9 if (nxt is None or nxt.get('kind') in (CARD, CH)) else 0.5)
    if e['sp'] != 'N' or (nxt and nxt.get('sp') not in (None, 'N')): gap = max(gap, 0.65)
    gap += HOLD.get(e['i'], 0)
    if e['kind'] == 'title': gap = 2.2
    slot = d + gap
    if e['kind'] == 'outro': slot += 4.0
    span = e['ve'] - e['vs']
    if span / slot < 0.75 and e['kind'] not in ('title', 'outro'): slot = min(span / 0.75, slot + 1.0)
    speed = min(max(span / slot, 0.75), 1.35)
    lead = 0.25 if e['kind'] == 'title' else 0.0
    tl.append(dict(e, T0=T, T1=T + slot, aT=T + lead, speed=speed)); T += slot
json.dump(tl, open('timeline3.json', 'w'), indent=0)
print('total', round(T, 1), 'entries', len(tl))
