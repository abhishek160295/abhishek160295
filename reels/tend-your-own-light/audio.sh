#!/bin/sh
# Synthesized score: low drone -> rising A-major pad -> silence suck -> impact + bell -> resolve
ffmpeg -v error -y -f lavfi -i "aevalsrc='\
min(t/3\,1)*(1-0.9*between(t\,13.2\,13.6))*(1-max(0\,(t-15.2)/0.8))*(0.16*sin(2*PI*55*t)+0.10*sin(2*PI*82.5*t)+0.06*sin(2*PI*110.3*t)+0.03*sin(2*PI*164.8*t))\
+between(t\,8\,13.25)*min((t-8)/3.5\,1)*0.035*(sin(2*PI*220*t)+sin(2*PI*277.18*t)+sin(2*PI*329.63*t)+0.6*sin(2*PI*440.4*t))\
+gte(t\,13.6)*(0.7*sin(2*PI*42*(t-13.6))*exp(-(t-13.6)*2.6)+0.22*(random(0)*2-1)*exp(-(t-13.6)*11)\
+0.09*(sin(2*PI*880*(t-13.6))+0.6*sin(2*PI*1318.5*(t-13.6)))*exp(-(t-13.6)*1.3)\
+0.045*(sin(2*PI*220*t)+sin(2*PI*329.63*t)+sin(2*PI*440*t)+sin(2*PI*554.37*t))*exp(-(t-13.6)*0.7))*(1-max(0\,(t-15.3)/0.7))\
':s=48000:d=16" -af "aecho=0.8:0.55:70|150|320:0.3|0.22|0.15,lowpass=f=9000,alimiter=limit=0.9" -ac 2 "$1"
