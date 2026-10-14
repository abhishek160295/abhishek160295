#!/bin/bash
# Resumable chunk renderer: skips chunks that already have a .done marker.
cd "$(dirname "$0")"
N=$(python3 -c "import scenes as S;print((S.NFRAMES+359)//360)")
for i in $(seq 0 $((N-1))); do
  [ -f chunks/c$(printf %03d $i).done ] || echo $i
done | xargs -P 4 -I{} sh -c 'python3 render.py {} >> chunks/log.txt 2>&1'
touch chunks/ALL.done
