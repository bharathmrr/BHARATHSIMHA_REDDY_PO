#!/usr/bin/env bash
# Full pipeline: render video in parallel workers, synthesise the score, mux, and compress under GitHub's 100 MB limit.
set -euo pipefail
cd "$(dirname "$0")"
WORKERS=${WORKERS:-2}; FPS=24
TOTAL=$(node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage();await p.goto('file://'+process.cwd()+'/film.html');console.log(Math.round(await p.evaluate(()=>TOTAL)*$FPS));await b.close();})()")
echo "frames: $TOTAL"; mkdir -p build; : > build/list.txt
for ((w=0; w<WORKERS; w++)); do a=$((TOTAL*w/WORKERS)); b=$((TOTAL*(w+1)/WORKERS)); node render.js $a $b build/seg$w.mp4 & echo "file seg$w.mp4" >> build/list.txt; done; wait
python3 audio.py && mv score2.wav build/score.wav
ffmpeg -loglevel error -y -f concat -safe 0 -i build/list.txt -c copy build/video.mp4
ffmpeg -loglevel error -y -i build/video.mp4 -c:v libx264 -preset slow -b:v 2300k -pass 1 -an -f mp4 /dev/null
ffmpeg -loglevel error -y -i build/video.mp4 -i build/score.wav -map 0:v -map 1:a -c:v libx264 -preset slow -b:v 2300k -pass 2 -c:a aac -b:a 160k -movflags +faststart -shortest portfolio-film.mp4
ffmpeg -loglevel error -y -ss 16 -i portfolio-film.mp4 -frames:v 1 -q:v 3 poster.jpg
ls -lh portfolio-film.mp4
