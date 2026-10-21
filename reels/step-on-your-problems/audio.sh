#!/bin/sh
# drone -> 10 rising thuds (one per landing) -> sunrise chord -> impact on headline
ffmpeg -v error -y -f lavfi -i "aevalsrc='\
min(t/2\,1)*(1-0.7*between(t\,7.6\,8.05))*(1-max(0\,(t-12.2)/0.8))*(0.15*sin(2*PI*55*t)+0.09*sin(2*PI*82.5*t)+0.05*sin(2*PI*110.4*t))\
+between(t\,2\,7.4)*(0.6*sin(2*PI*(58+7*floor((t-2)/0.5))*mod(t-2\,0.5))*exp(-mod(t-2\,0.5)*16)+0.18*(random(0)*2-1)*exp(-mod(t-2\,0.5)*38))\
+between(t\,6.7\,8.0)*min((t-6.7)/1.2\,1)*0.035*(sin(2*PI*220*t)+sin(2*PI*277.18*t)+sin(2*PI*329.63*t))\
+gte(t\,8.05)*(0.7*sin(2*PI*44*(t-8.05))*exp(-(t-8.05)*2.6)+0.2*(random(0)*2-1)*exp(-(t-8.05)*11)\
+0.08*(sin(2*PI*880*(t-8.05))+0.6*sin(2*PI*1318.5*(t-8.05)))*exp(-(t-8.05)*1.3)\
+0.045*(sin(2*PI*220*t)+sin(2*PI*329.63*t)+sin(2*PI*440*t)+sin(2*PI*554.37*t))*exp(-(t-8.05)*0.5))*(1-max(0\,(t-12.3)/0.7))\
':s=48000:d=13" -af "aecho=0.8:0.5:60|140|300:0.28|0.2|0.12,lowpass=f=9000,alimiter=limit=0.9" -ac 2 "$1"
