import json, re, difflib
D = '.'
V2 = json.load(open('timeline2.json'))
import wave as _wave
NBT = ["Right now, on this highway, nothing is moving. Nothing except you.",
       "How did a kid who once saved an ice cream end up here? Let's rewind.",
       "But first, the science says you shouldn't survive this.",
       "You already know what happens next.",
       "She's not here to stop you. She's here to recruit you."]
NBV = [(434.0, 440.4), (249.4, 262.0), (39.0, 41.5), (443.0, 447.5), (584.0, 591.0)]
def _nb():
    W_ = json.load(open('vo/NB_words.json')); aw = [re.sub(r"[^a-z0-9']", '', w['w'].lower()) for w in W_]
    dur = _wave.open('vo/NB.wav').getnframes() / 44100
    starts = []
    for t in NBT:
        first = re.sub(r"[^a-z0-9']", '', t.split()[0].lower())
        j = next(k for k in range(len(aw)) if aw[k] == first and (not starts or W_[k]['t'] > starts[-1]))
        starts.append(W_[j]['t'])
    out = []
    for k, t in enumerate(NBT):
        b = starts[k + 1] - 0.1 if k + 1 < len(NBT) else dur
        out.append(dict(src='NB', a=max(starts[k] - 0.08, 0), b=b, sp='N', scene=0, text=t, anchor=NBV[k][0], vs=NBV[k][0], ve=NBV[k][1], i=100 + k))
    return out
NB = _nb()

CARD, CH = 'card', 'chapter'
ORDER = [
    ('cold', ['B0', 53, 54, 55, 57, 'B1']),
    ('title', [7]),
    (CARD, ('rewind', '6 MONTHS EARLIER', 2.6)),
    (CH, (1, 'THE FIRST SECOND')), ('lines', range(0, 7)),
    (CH, (2, 'THE PHYSICS OF A FROZEN WORLD')), ('lines', ['B2'] + list(range(8, 19))),
    (CH, (3, 'THE RULES')), ('lines', range(19, 26)),
    (CH, (4, 'THE GOOD DAYS')), ('lines', range(26, 33)),
    (CH, (5, 'THE SILENCE')), ('lines', range(33, 40)),
    (CH, (6, 'THE FALL')), ('lines', range(40, 51)),
    (CH, (7, 'FRIDAY')), ('lines', [51, 52, 56, 'B3', 58, 59, 60, 61, 62, 63, 64]),
    (CH, (8, 'THE WOMAN IN THE GRAY COAT')), ('lines', list(range(65, 76)) + ['B4']),
    ('outro', [76]),
]
HOLD = {101: 1.0, 57: 0.8, 5: 1.2, 25: 0.8, 33: 2.5, 36: 1.0, 50: 1.2, 56: 1.0, 68: 1.2, 73: 0.6, 39: 1.0}

# ---- word timings for animated subtitles (script words, ASR timestamps) ----
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
WORDS = {k: json.load(open(f'vo/{k}_words.json')) for k in ['N1', 'N2', 'J', 'W', 'NX', 'WX', 'NB']}
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

import numpy as _np
_x = _np.frombuffer(_wave.open('vo/NB.wav').readframes(10**9), _np.int16).astype(_np.float32) / 32768
for e in NB:
    x = _x[int(e['a'] * 44100):int(e['b'] * 44100)]
    en = _np.sqrt(_np.convolve(x ** 2, _np.ones(882) / 882, 'same')); idx = _np.where(en > 0.12 * en.max())[0]
    e['b'] = e['a'] + idx[-1] / 44100 + 0.08; e['a'] = e['a'] + max(idx[0] / 44100 - 0.05, 0)
entries = []
for kind, val in ORDER:
    if kind in (CARD, CH):
        entries.append(dict(kind=kind, val=val))
    else:
        for i in val:
            e = dict(NB[int(i[1])]) if isinstance(i, str) else dict(V2[i])
            if i == 8: e['vs'] = 41.5
            e['kind'] = kind; e['words'] = word_times(e); entries.append(e)

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
