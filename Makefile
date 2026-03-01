fonts: ./assets/FormaDJRMicro-Regular.woff2

./assets/FormaDJRMicro-Regular.woff2:
	rm -f -- ./fonts/FormaDJRMicro-Regular.ttf.ttf
	rm -f -- ./fonts/FormaDJRMicro-Regular.ttf.ttx
	rm -f -- ./fonts/FormaDJRMicro-Regular.ttf.woff
	rm -f -- ./fonts/FormaDJRMicro-Regular.ttf.subset.woff2
	fonttools subset ./fonts/FormaDJRMicro-Regular.ttf --unicodes-file="latin-ext.txt" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,onum,pnum,smcp,c2sc,frac,lnum,tnum,subs,sups"
	ttx ./fonts/FormaDJRMicro-Regular.subset.ttf
	ttx --flavor woff2 ./fonts/FormaDJRMicro-Regular.subset.ttx -o $@
