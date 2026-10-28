// Renders frames [start, end) of film.html to an H.264 segment, frame-accurately.
// usage: node render.js <startFrame> <endFrame> <out.mp4>
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const [a, b, out] = [+process.argv[2], +process.argv[3], process.argv[4]]; const FPS = 24;
(async () => {
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/film.html'); await p.evaluate(() => loadAll()); await p.waitForTimeout(300);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = a; f < b; f += 6) {
    const n = Math.min(6, b - f);
    const arr = await p.evaluate(([f, n, FPS]) => { const r = []; for (let i = 0; i < n; i++) r.push(frameJPEG((f + i) / FPS, .92).split(',')[1]); return r; }, [f, n, FPS]);
    for (const d of arr) if (!ff.stdin.write(Buffer.from(d, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - a) % 480 < 6) console.log(out, f, '/', b, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close(); console.log('DONE', out);
})();
