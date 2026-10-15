"""English .srt for every on-screen line, straight from the scene table."""
import sys
import scenes as S


def ts(x):
    ms = int(round(x * 1000))
    return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)


rows = []
for sc in S.SCENES:
    for (t0, t1, s, kind) in sc.subs:
        if kind == 'card' and s.startswith('TIMES HE'):
            pass
        t1 = max(t1, t0 + 0.9)
        rows.append((sc.start + t0, sc.start + t1, s.replace('…', '...')))
B = S.BYNAME
rows.append((0.3, 3.9, 'TIMES HE STARTED OVER: 47'))
rows.append((B['12_question'].start + 10.0, B['12_question'].start + 12.0, 'DAYS MAYA FELT LIKE RUNNING: 9 / 212'))
rows.append((B['16_montage'].start + 0.1, B['16_montage'].start + 2.0, 'DAY 1'))
rows.append((B['16_montage'].start + S.STARTS[6] + 0.55, B['16_montage'].start + S.STARTS[6] + 1.2, 'TIMES HE STARTED OVER: 48?'))
rows.append((B['16_montage'].start + S.STARTS[17], B['16_montage'].start + 23.0, 'DAY 180'))
rows.append((B['17_wall'].start + 5.6, B['17_wall'].start + 6.4, 'DAY 181'))
rows.sort()
with open(sys.argv[1], 'w') as fh:
    for i, (a, b, s) in enumerate(rows, 1):
        fh.write('%d\n%s --> %s\n%s\n\n' % (i, ts(a), ts(b), s))
print(len(rows), 'cues')
