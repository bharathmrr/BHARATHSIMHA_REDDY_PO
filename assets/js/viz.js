// Drawing components shared with the motion film (motion-film/lib.js), adapted for live canvases on the site.
const W = 1920, H = 1080;
const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
let ctx = cv.getContext('2d');
const COL = { cy: '#22d3ee', cy2: '#a5f3fc', am: '#fbbf24', rd: '#fb7185', vi: '#a78bfa', gr: '#34d399', wh: '#f8fafc', dim: '#475569', pk: '#f472b6', bl: '#60a5fa' };


// ---------- utils ----------
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - k, 3);
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const hr = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const TAU = Math.PI * 2;
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
const c = k => COL[k] || k;

function font(size, fam = 'Raj', w = 600) { const f = { Orb: 'Orbitron', Raj: 'Rajdhani', STM: '"Share Tech Mono", monospace', DJ: 'sans-serif', In: '"Inter Display", Inter, sans-serif', IT: 'Inter, sans-serif' }[fam]; return `${w} ${size}px ${f}`; }
function txt(s, x, y, o = {}) {
  const { size = 22, fam = 'Raj', w = 600, col = COL.wh, align = 'left', a = 1, sp = 0, base = 'alphabetic', max } = o;
  if (a <= 0 || !s) return 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = font(size, fam, w); ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.letterSpacing = sp + 'px';
  if (max) { let sz = size; while (ctx.measureText(s).width > max && sz > 8) { sz -= 1; ctx.font = font(sz, fam, w); } }
  ctx.fillText(s, x, y); const m = ctx.measureText(s).width; ctx.restore(); return m;
}
function measure(s, size, fam = 'Raj', w = 600, sp = 0) { ctx.save(); ctx.font = font(size, fam, w); ctx.letterSpacing = sp + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
function typed(s, k, cursor = true) { const n = Math.floor(s.length * cl(k)); return s.slice(0, n) + (cursor && k > 0 && k < 1 ? '▌' : ''); }
function wrap(s, maxW, size, fam = 'Raj', w = 600) {
  const words = s.split(' '); const lines = []; let cur = '';
  for (const wd of words) { const tst = cur ? cur + ' ' + wd : wd; if (measure(tst, size, fam, w) > maxW && cur) { lines.push(cur); cur = wd; } else cur = tst; }
  if (cur) lines.push(cur); return lines;
}
function line(x1, y1, x2, y2, col, a = 1, lw = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function circ(x, y, r, col, a = 1, lw = 1, fill = false) { ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (fill) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); } ctx.restore(); }
function arc(x, y, r, a0, a1, col, a = 1, lw = 2) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); }
function hexPath(x, y, r) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const an = Math.PI / 6 + i * Math.PI / 3; const px = x + r * Math.cos(an), py = y + r * Math.sin(an); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
function rect(x, y, w, h, col, a = 1, fill = true, lw = 1) { ctx.save(); ctx.globalAlpha *= a; if (fill) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); } else { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); } ctx.restore(); }

// ---------- offscreen buffers ----------
const mk = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };
const g1 = mk(480, 270), g1x = g1.getContext('2d'), g2 = mk(240, 135), g2x = g2.getContext('2d');

// ---------- background ----------
function background(t, tint = 'cy') {
  const g = ctx.createRadialGradient(W / 2, H * .45, 50, W / 2, H / 2, W * .75);
  g.addColorStop(0, '#06192a'); g.addColorStop(.55, '#030b14'); g.addColorStop(1, '#010306');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const tc = c(tint);
  // perspective floor grid
  ctx.save(); const hz = H * .62;
  for (let i = -24; i <= 24; i++) { const x = W / 2 + i * 140; line(W / 2 + i * 14, hz, x * 1 + (x - W / 2) * 1.2, H, tc, .07); }
  for (let j = 0; j < 14; j++) { const k = ((j + (t * .35) % 1) / 14); const y = hz + (H - hz) * k * k; line(0, y, W, y, tc, .09 * k); }
  ctx.restore();
  // hex field (top)
  for (let i = 0; i < 26; i++) for (let j = 0; j < 7; j++) {
    const x = i * 78 + (j % 2) * 39, y = j * 68 - 20; const id = i * 31 + j * 7;
    const tw = .5 + .5 * Math.sin(t * .8 + hr(id) * TAU);
    ctx.save(); ctx.globalAlpha = .025 + .05 * tw * (1 - j / 7); ctx.strokeStyle = tc; hexPath(x, y, 36); ctx.stroke(); ctx.restore();
  }
  // particles
  ctx.save(); ctx.fillStyle = tc;
  for (let i = 0; i < 160; i++) {
    const sp = 6 + hr(i + 9) * 30; const x = (hr(i) * W + t * sp) % W; const y = (hr(i + 3) * H + Math.sin(t * .3 + i) * 20 + H) % H;
    ctx.globalAlpha = .15 + .45 * hr(i + 5) * (.5 + .5 * Math.sin(t * 2 + i)); const s = 1 + hr(i + 7) * 2; ctx.fillRect(x, y, s, s);
  }
  ctx.restore();
}

// ---------- HUD frame ----------
function corners(x, y, w, h, col, a = 1, L = 22, lw = 2) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  ctx.moveTo(x, y + L); ctx.lineTo(x, y); ctx.lineTo(x + L, y);
  ctx.moveTo(x + w - L, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + L);
  ctx.moveTo(x + w, y + h - L); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - L, y + h);
  ctx.moveTo(x + L, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - L); ctx.stroke(); ctx.restore();
}
function fmtT(t) { const m = Math.floor(t / 60), s = Math.floor(t % 60), f = Math.floor((t % 1) * 24); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`; }
const TICK = ['PYTHON', 'LANGGRAPH', 'FASTAPI', 'RAG', 'DEEPGRAM', 'ZOHO', 'MCP', 'NEXT.JS', 'POSTGRESQL', 'CELERY', 'REDIS', 'DOCKER', 'KUBERNETES', 'WEBRTC', 'LLM', 'AGENTS', 'TENSORFLOW', 'PYTORCH', 'QUANTUM', 'VECTOR DB'];
function hud(t, title, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  corners(24, 24, W - 48, H - 48, COL.cy, .55, 40, 2);
  line(80, 58, W - 80, 58, COL.cy, .18);
  txt('NEXUS', 80, 48, { size: 18, fam: 'Orb', w: 700, col: COL.cy, sp: 4 });
  txt('// PORTFOLIO OS v26.10', 186, 48, { size: 16, fam: 'STM', col: COL.cy2, a: .7 });
  txt(title, W / 2, 48, { size: 16, fam: 'Orb', w: 400, col: COL.wh, align: 'center', sp: 5, a: .85 });
  txt('T+' + fmtT(t), W - 80, 48, { size: 18, fam: 'STM', col: COL.am, align: 'right' });
  // status dot
  circ(W - 250, 42, 5, COL.gr, .6 + .4 * Math.sin(t * 5), 1, true);
  txt('REC', W - 238, 48, { size: 14, fam: 'STM', col: COL.gr, a: .8 });
  // side scales
  for (let i = 0; i < 30; i++) { const y = 140 + ((i * 28 + t * 20) % 840); const L = i % 5 == 0 ? 14 : 6; line(32, y, 32 + L, y, COL.cy, .35); line(W - 32 - L, y, W - 32, y, COL.cy, .35); }
  // bottom ticker
  line(80, H - 58, W - 80, H - 58, COL.cy, .18);
  ctx.save(); ctx.beginPath(); ctx.rect(80, H - 54, W - 160, 26); ctx.clip();
  const str = TICK.map(s => s + '  ◆  ').join(''); const sw = measure(str, 14, 'STM', 400, 2);
  const off = -(t * 60) % sw; for (let k = 0; k < 3; k++) txt(str, 80 + off + k * sw, H - 36, { size: 14, fam: 'STM', col: COL.cy2, sp: 2, a: .55, w: 400 });
  ctx.restore();
  ctx.restore();
}

// ---------- components ----------
function panel(x, y, w, h, title, k, col = COL.cy) {
  if (k <= 0) return;
  const e = eo(k); const ww = w * e;
  ctx.save(); ctx.globalAlpha *= cl(k * 2);
  ctx.fillStyle = rgba(col, .045); ctx.fillRect(x, y, ww, h);
  ctx.fillStyle = rgba('#000000', .25); ctx.fillRect(x, y, ww, h);
  rect(x, y, ww, h, col, .22, false);
  corners(x, y, ww, h, col, .9, 16, 2);
  if (title) { rect(x, y, Math.min(ww, measure(title, 14, 'Orb', 700, 3) + 34), 26, col, .16); txt(title, x + 14, y + 18, { size: 14, fam: 'Orb', w: 700, col, sp: 3, a: cl(k * 3 - 1.5) }); }
  ctx.restore();
}
function core(x, y, r, t, col = COL.cy, k = 1, label) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= cl(k);
  const s = eo(cl(k));
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.1 * s); g.addColorStop(0, rgba(col, .35)); g.addColorStop(.4, rgba(col, .08)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.1 * s, 0, TAU); ctx.fill();
  circ(x, y, r * .18 * s, COL.wh, .9, 1, true); circ(x, y, r * .26 * s, col, .9, 3);
  // segmented rings
  const rings = [[.38, 12, 1.2, 6], [.55, 24, -.6, 3], [.72, 6, .35, 10], [.88, 60, -.2, 2], [1, 3, .12, 2]];
  rings.forEach(([rr, n, sp, lw], i) => {
    const R = r * rr * s, gap = TAU / n;
    for (let j = 0; j < n; j++) { const a0 = t * sp + j * gap; arc(x, y, R, a0, a0 + gap * (i == 3 ? .3 : .7), j % 4 == 0 && i == 1 ? COL.am : col, .75, lw); }
  });
  for (let j = 0; j < 72; j++) { const an = j / 72 * TAU - t * .1; const L = j % 6 == 0 ? 12 : 5; line(x + Math.cos(an) * r * 1.06 * s, y + Math.sin(an) * r * 1.06 * s, x + Math.cos(an) * (r * 1.06 + L) * s, y + Math.sin(an) * (r * 1.06 + L) * s, col, .5); }
  if (label) txt(label, x, y + 10, { size: r * .14, fam: 'Orb', w: 900, col: '#021018', align: 'center', a: s });
  ctx.restore();
}
function lineChart(x, y, w, h, t, seed, col, k = 1, label, speed = 1) {
  if (k <= 0) return;
  for (let i = 0; i <= 4; i++) line(x, y + h * i / 4, x + w, y + h * i / 4, col, .1);
  for (let i = 0; i <= 8; i++) line(x + w * i / 8, y, x + w * i / 8, y + h, col, .06);
  const n = 60, pts = [];
  for (let i = 0; i <= n * cl(k); i++) {
    const u = i / n; const tt = t * speed;
    const v = .5 + .22 * Math.sin(u * 7 + tt + seed) + .12 * Math.sin(u * 19 - tt * 1.7 + seed * 2) + .06 * Math.sin(u * 41 + tt * 3);
    pts.push([x + u * w, y + h * (1 - cl(v, .05, .95))]);
  }
  if (pts.length < 2) return;
  ctx.save(); const gr = ctx.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, rgba(col, .35)); gr.addColorStop(1, rgba(col, 0));
  ctx.beginPath(); ctx.moveTo(pts[0][0], y + h); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[pts.length - 1][0], y + h); ctx.closePath(); ctx.fillStyle = gr; ctx.fill();
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
  const lp = pts[pts.length - 1]; circ(lp[0], lp[1], 5, COL.wh, 1, 1, true); circ(lp[0], lp[1], 10 + 4 * Math.sin(t * 6), col, .7, 1.5);
  ctx.restore();
  if (label) txt(label, x, y - 10, { size: 14, fam: 'STM', col, a: .8, w: 400, sp: 2 });
}
function bars(x, y, w, h, t, n, col, k = 1, seed = 1, labels) {
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const v = .25 + .6 * (.5 + .5 * Math.sin(t * 1.3 + i * 1.7 + seed)) * (.6 + .4 * hr(i + seed));
    const bh = h * v * eo(seg(k, i / n * .5, i / n * .5 + .5));
    const g = ctx.createLinearGradient(0, y + h - bh, 0, y + h); g.addColorStop(0, col); g.addColorStop(1, rgba(col, .15));
    ctx.fillStyle = g; ctx.fillRect(x + i * bw + bw * .18, y + h - bh, bw * .64, bh);
    rect(x + i * bw + bw * .18, y + h - bh, bw * .64, 3, COL.wh, .8);
    if (labels) txt(labels[i], x + i * bw + bw / 2, y + h + 20, { size: 13, fam: 'STM', col: COL.cy2, align: 'center', a: .7, w: 400 });
  }
  line(x, y + h, x + w, y + h, col, .5);
}
function ring(x, y, r, frac, col, t, k = 1, big, small) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= cl(k * 2);
  arc(x, y, r, 0, TAU, col, .15, 10);
  arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * frac * eo(k), col, .95, 10);
  for (let j = 0; j < 40; j++) { const an = j / 40 * TAU + t * .3; line(x + Math.cos(an) * (r + 12), y + Math.sin(an) * (r + 12), x + Math.cos(an) * (r + 17), y + Math.sin(an) * (r + 17), col, .4); }
  arc(x, y, r - 16, t * 1.5, t * 1.5 + 1.2, COL.wh, .5, 2);
  if (big) txt(big, x, y + 9, { size: 28, fam: 'Orb', w: 900, col: COL.wh, align: 'center', max: r * 1.6 });
  if (small) txt(small, x, y + r + 44, { size: 15, fam: 'Orb', w: 700, col, align: 'center', sp: 2, max: r * 2.8 });
  ctx.restore();
}
function radar(x, y, r, labels, vals, k, t, col = COL.cy) {
  const n = labels.length;
  for (let lv = 1; lv <= 5; lv++) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const an = -Math.PI / 2 + i / n * TAU; const rr = r * lv / 5; i ? ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr) : ctx.moveTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } ctx.strokeStyle = rgba(col, .18); ctx.stroke(); }
  for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + i / n * TAU; line(x, y, x + Math.cos(an) * r, y + Math.sin(an) * r, col, .2); txt(labels[i], x + Math.cos(an) * (r + 34), y + Math.sin(an) * (r + 34) + 6, { size: 17, fam: 'Raj', w: 700, col: COL.wh, align: 'center', a: cl(k * 2 - .5) }); }
  ctx.save(); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const an = -Math.PI / 2 + i / n * TAU; const v = vals[i % n] / 100 * eo(k) * (1 + .015 * Math.sin(t * 3 + i)); const px = x + Math.cos(an) * r * v, py = y + Math.sin(an) * r * v; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.fillStyle = rgba(col, .22); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + i / n * TAU; const v = vals[i] / 100 * eo(k); circ(x + Math.cos(an) * r * v, y + Math.sin(an) * r * v, 6, COL.wh, 1, 1, true); }
  const sw = t * 1.2; ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, sw, sw + .5); ctx.closePath(); ctx.fill(); ctx.restore();
}
function neural(x, y, w, h, layers, t, k = 1, col = COL.cy) {
  const pos = layers.map((n, li) => Array.from({ length: n }, (_, i) => [x + w * li / (layers.length - 1), y + h * (i + .5) / n]));
  const vis = cl(k * 1.4);
  for (let li = 0; li < layers.length - 1; li++) for (const a of pos[li]) for (const b of pos[li + 1]) line(a[0], a[1], b[0], b[1], col, .08 * vis);
  // pulses
  for (let p = 0; p < 40; p++) {
    const li = p % (layers.length - 1); const A = pos[li][Math.floor(hr(p) * pos[li].length)]; const B = pos[li + 1][Math.floor(hr(p + 50) * pos[li + 1].length)];
    const u = ((t * .7 + hr(p + 9)) % 1); if (k < .6) continue;
    const px = lerp(A[0], B[0], u), py = lerp(A[1], B[1], u); line(A[0], A[1], px, py, col, .35); circ(px, py, 3, COL.wh, .9, 1, true);
  }
  pos.forEach((L, li) => L.forEach((p, i) => { const act = .5 + .5 * Math.sin(t * 3 + li * 1.3 + i * .9); const s = eo(seg(k, li * .1, li * .1 + .5)); circ(p[0], p[1], 11 * s, col, .9, 2); circ(p[0], p[1], 6 * s * act, li == layers.length - 1 ? COL.am : col, .9, 1, true); }));
}
function pipeline(x, y, w, h, steps, t, k, col) {
  const n = steps.length, rows = n > 7 ? 2 : 1, per = Math.ceil(n / rows);
  const pts = steps.map((s, i) => { const r = Math.floor(i / per), j = i % per; const jj = r % 2 ? per - 1 - j : j; return [x + 70 + (w - 140) * (per == 1 ? .5 : jj / (per - 1)), y + (rows == 1 ? h / 2 - 8 : 46 + r * (h - 134))]; });
  const active = Math.floor((t * .55) % n);
  for (let i = 0; i < n - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; const vis = seg(k, i / n * .7, i / n * .7 + .2);
    if (vis <= 0) continue;
    line(ax, ay, lerp(ax, bx, vis), lerp(ay, by, vis), col, .35, 2);
    for (let q = 0; q < 3; q++) { const u = (t * .6 + q / 3 + i * .13) % 1; if (u < vis) circ(lerp(ax, bx, u), lerp(ay, by, u), 3, COL.wh, .8, 1, true); }
  }
  pts.forEach(([px, py], i) => {
    const vis = eo(seg(k, i / n * .7, i / n * .7 + .25)); if (vis <= 0) return;
    const on = i == active; const done = i < active;
    ctx.save(); ctx.globalAlpha *= vis; hexPath(px, py, 26 * vis); ctx.fillStyle = rgba(on ? COL.am : col, on ? .35 : done ? .2 : .08); ctx.fill(); ctx.strokeStyle = on ? COL.am : col; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    if (on) { circ(px, py, 34 + 6 * Math.sin(t * 8), COL.am, .6, 1.5); }
    txt(String(i + 1).padStart(2, '0'), px, py + 6, { size: 15, fam: 'Orb', w: 700, col: on ? COL.wh : col, align: 'center', a: vis });
    txt(steps[i], px, py + 52, { size: 16, fam: 'Raj', w: 700, col: on ? COL.am : COL.wh, align: 'center', a: vis * (on ? 1 : .8), sp: 1, max: (w - 140) / Math.max(1, per - 1) - 6 });
  });
}
function chips(x, y, w, items, k, col, size = 17) {
  let cx = x, cy = y; const hh = size + 16;
  items.forEach((s, i) => {
    const tw = measure(s, size, 'Raj', 700) + 24; if (cx + tw > x + w) { cx = x; cy += hh + 10; }
    const vis = eo(seg(k, i / items.length * .7, i / items.length * .7 + .3));
    if (vis > 0) { ctx.save(); ctx.globalAlpha *= vis; rect(cx, cy, tw, hh, col, .12); rect(cx, cy, tw, hh, col, .6, false); rect(cx, cy, 3, hh, col, 1); ctx.restore(); txt(s, cx + 13, cy + hh / 2 + size * .35, { size, fam: 'Raj', w: 700, col: COL.wh, a: vis }); }
    cx += tw + 10;
  });
  return cy + hh;
}
function bulletList(x, y, w, items, k, col, size = 23) {
  let yy = y;
  items.forEach((s, i) => {
    const kk = seg(k, i / items.length, (i + .85) / items.length);
    const lines = wrap(s, w - 40, size);
    if (kk > 0) { ctx.save(); ctx.globalAlpha *= cl(kk * 4); hexPath(x + 10, yy - size * .35, 8); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); circ(x + 10, yy - size * .35, 3, col, 1, 1, true); ctx.restore(); }
    const total = lines.join(' ').length; let used = 0;
    lines.forEach((ln, li) => { const lk = cl((kk * total * 1.15 - used) / ln.length); if (lk > 0) txt(typed(ln, lk, li == lines.length - 1 || lk < 1), x + 34, yy + li * (size + 6), { size, fam: 'Raj', w: 600, col: COL.wh, a: .92 }); used += ln.length; });
    yy += lines.length * (size + 6) + 22;
  });
}
function waveform(x, y, w, h, t, col, amp = 1, n = 90) {
  const bw = w / n;
  for (let i = 0; i < n; i++) { const env = Math.sin(i / n * Math.PI); const v = amp * env * (.25 + .75 * Math.abs(Math.sin(t * 7 + i * .5) * Math.sin(t * 2.3 + i * .17))); const bh = h * v; rect(x + i * bw, y + h / 2 - bh / 2, Math.max(1, bw * .55), bh, col, .9); }
}
function globe(x, y, r, t, k, col, pins = []) {
  const N = 700, rot = t * .18; const s = eo(k);
  circ(x, y, r * s, col, .25, 1.5);
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, rgba(col, .12)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * s, 0, TAU); ctx.fill();
  ctx.save(); ctx.fillStyle = col;
  for (let i = 0; i < N; i++) {
    const yy = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - yy * yy), th = i * 2.39996 + rot;
    const px = Math.cos(th) * rad, pz = Math.sin(th) * rad; if (pz < -0.05) continue;
    // fake landmass mask
    const lat = Math.asin(yy), lon = (i * 2.39996) % TAU; const land = Math.sin(lon * 2.2 + 1) * Math.cos(lat * 3) + Math.sin(lon * 5 + lat * 4) * .5;
    ctx.globalAlpha = (land > .1 ? .85 : .18) * (.3 + .7 * pz) * s; const sz = land > .1 ? 2.6 : 1.6;
    ctx.fillRect(x + px * r * s - sz / 2, y - yy * r * s - sz / 2, sz, sz);
  }
  ctx.restore();
  const P3 = (lat, lon) => { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + rot; return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]; };
  const pr = v => [x + v[0] * r * s, y - v[1] * r * s, v[2]];
  const hub = P3(20, 78);
  pins.forEach((pn, i) => {
    const v = P3(pn[0], pn[1]); const sp = pr(v); const vis = seg(k, .3 + i * .05, .5 + i * .05);
    if (vis <= 0) return;
    // arc to hub
    ctx.save(); ctx.beginPath(); for (let u = 0; u <= 1.001; u += .05) { const m = [lerp(v[0], hub[0], u), lerp(v[1], hub[1], u), lerp(v[2], hub[2], u)]; const L = Math.hypot(...m) || 1; const lift = 1 + .25 * Math.sin(u * Math.PI); const q = pr(m.map(z => z / L * lift)); u ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
    ctx.strokeStyle = rgba(COL.am, .5 * vis); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    if (sp[2] > 0) { circ(sp[0], sp[1], 5, COL.am, vis, 1, true); circ(sp[0], sp[1], 8 + ((t * 14 + i * 5) % 22), COL.am, (1 - ((t * 14 + i * 5) % 22) / 22) * vis, 1.5); }
  });
  const hp = pr(hub); if (hp[2] > 0) { circ(hp[0], hp[1], 8, COL.wh, 1, 1, true); circ(hp[0], hp[1], 16, COL.cy, .8, 2); }
}
function bloch(x, y, r, t, k) {
  const s = eo(k);
  circ(x, y, r * s, COL.vi, .7, 2);
  ctx.save(); ctx.strokeStyle = rgba(COL.vi, .45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, r * s, r * .3 * s, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, r * .35 * s * Math.abs(Math.cos(t * .5)) + 1, r * s, 0, 0, TAU); ctx.stroke(); ctx.restore();
  line(x, y - r * 1.2 * s, x, y + r * 1.2 * s, COL.wh, .3); line(x - r * 1.2 * s, y, x + r * 1.2 * s, y, COL.wh, .3);
  txt('|0⟩', x, y - r * 1.25 * s - 8, { size: 26, fam: 'DJ', w: 400, col: COL.wh, align: 'center', a: s });
  txt('|1⟩', x, y + r * 1.25 * s + 30, { size: 26, fam: 'DJ', w: 400, col: COL.wh, align: 'center', a: s });
  const th = 1.0 + .7 * Math.sin(t * .6), ph = t * 1.1;
  const vx = Math.sin(th) * Math.cos(ph), vy = Math.cos(th), vz = Math.sin(th) * Math.sin(ph);
  const px = x + vx * r * s, py = y - vy * r * s + vz * r * .3 * s;
  // trail
  for (let i = 1; i < 30; i++) { const tt = t - i * .05; const th2 = 1.0 + .7 * Math.sin(tt * .6), ph2 = tt * 1.1; const qx = x + Math.sin(th2) * Math.cos(ph2) * r * s, qy = y - Math.cos(th2) * r * s + Math.sin(th2) * Math.sin(ph2) * r * .3 * s; circ(qx, qy, 3, COL.vi, (1 - i / 30) * .7, 1, true); }
  line(x, y, px, py, COL.am, 1, 3); circ(px, py, 8, COL.am, 1, 1, true); circ(px, py, 16, COL.am, .5, 2);
  txt('|ψ⟩', px + 18, py - 14, { size: 24, fam: 'DJ', w: 400, col: COL.am, a: s });
}
function circuit(x, y, w, h, t, k) {
  const q = 4; const gates = [[0, .12, 'H'], [1, .12, 'H'], [2, .22, 'X'], [0, .34, 'C1'], [3, .46, 'H'], [1, .58, 'RZ'], [2, .66, 'C2'], [3, .78, 'Y'], [0, .9, 'M'], [1, .9, 'M'], [2, .9, 'M'], [3, .9, 'M']];
  for (let i = 0; i < q; i++) { const yy = y + h * (i + .5) / q; line(x, yy, x + w * eo(k), yy, COL.vi, .6, 2); txt(`q${i}`, x - 34, yy + 6, { size: 18, fam: 'STM', col: COL.vi, w: 400 }); }
  const cur = x + w * ((t * .15) % 1); line(cur, y, cur, y + h, COL.am, .5, 2);
  gates.forEach(([qi, u, g], i) => {
    const gx = x + w * u, gy = y + h * (qi + .5) / q; if (seg(k, u * .8, u * .8 + .1) <= 0) return; const lit = Math.abs(gx - cur) < 30;
    if (g == 'C1' || g == 'C2') { const ty = y + h * (qi + 1.5) / q; line(gx, gy, gx, ty, COL.vi, .9, 2); circ(gx, gy, 7, COL.vi, 1, 1, true); circ(gx, ty, 14, COL.vi, 1, 2); line(gx - 14, ty, gx + 14, ty, COL.vi, 1, 2); line(gx, ty - 14, gx, ty + 14, COL.vi, 1, 2); return; }
    rect(gx - 22, gy - 22, 44, 44, '#0a0420', 1); rect(gx - 22, gy - 22, 44, 44, lit ? COL.am : COL.vi, lit ? .5 : .25); rect(gx - 22, gy - 22, 44, 44, lit ? COL.am : COL.vi, 1, false, 2);
    txt(g, gx, gy + 7, { size: 18, fam: 'Orb', w: 700, col: COL.wh, align: 'center' });
  });
}
function graphNet(x, y, w, h, t, k, labels, col, hubLabel) {
  const cx = x + w / 2, cy = y + h / 2, n = labels.length;
  const pts = labels.map((l, i) => { const an = i / n * TAU + t * .05; const rr = (i % 2 ? .42 : .34); return [cx + Math.cos(an) * w * rr, cy + Math.sin(an) * h * rr * 1.1]; });
  pts.forEach((p, i) => { const vis = seg(k, i / n * .6, i / n * .6 + .3); if (vis <= 0) return; line(cx, cy, lerp(cx, p[0], vis), lerp(cy, p[1], vis), col, .35, 1.5); const nb = pts[(i + 1) % n]; line(p[0], p[1], nb[0], nb[1], col, .1 * vis);
    for (let q = 0; q < 2; q++) { const u = (t * .5 + q * .5 + i * .17) % 1; const dir = (i + q) % 2; const uu = dir ? u : 1 - u; circ(lerp(cx, p[0], uu), lerp(cy, p[1], uu), 3.5, q ? COL.am : COL.wh, .9 * vis, 1, true); } });
  pts.forEach((p, i) => { const vis = eo(seg(k, i / n * .6 + .2, i / n * .6 + .45)); if (vis <= 0) return; ctx.save(); ctx.globalAlpha *= vis; hexPath(p[0], p[1], 30); ctx.fillStyle = rgba(col, .15); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); txt(labels[i], p[0], p[1] + 50, { size: 16, fam: 'Raj', w: 700, col: COL.wh, align: 'center', a: vis }); circ(p[0], p[1], 6, col, vis, 1, true); });
  core(cx, cy, 62, t, col, k * 1.5); if (hubLabel) txt(hubLabel, cx, cy + 98, { size: 16, fam: 'Orb', w: 700, col: COL.am, align: 'center', sp: 2, a: k });
}

// ---------- project visuals (inside centre panel x,y,w,h) ----------
const V = {
  sheet(x, y, w, h, t, k, col) {
    const cols = 7, rows = 11, cw = (w - 40) / cols, ch = (h - 70) / rows; const sweep = ((t * .25) % 1.3) * rows;
    for (let r = 0; r < rows; r++) for (let cc = 0; cc < cols; cc++) {
      const cx = x + 20 + cc * cw, cy = y + 50 + r * ch; const id = r * 13 + cc * 7; const vis = seg(k, (r + cc) / 18 * .6, (r + cc) / 18 * .6 + .2); if (vis <= 0) continue;
      const dirty = hr(id) < .22; const cleaned = r < sweep;
      rect(cx, cy, cw - 3, ch - 3, r == 0 ? col : dirty && !cleaned ? COL.rd : col, (r == 0 ? .3 : dirty && !cleaned ? .25 : .06) * vis);
      const v = r == 0 ? ['REGION', 'SALES', 'QTY', 'MONTH', 'CUSTOMER', 'MARGIN', 'STATUS'][cc] : dirty && !cleaned ? (hr(id + 1) < .5 ? 'NaN' : '—') : String(Math.floor(hr(id + 2) * 9000 + 100));
      txt(v, cx + 8, cy + ch * .65, { size: 15, fam: 'STM', w: 400, col: r == 0 ? COL.wh : dirty && !cleaned ? COL.rd : COL.cy2, a: vis * .9, max: cw - 14 });
      if (dirty && cleaned && r < sweep && r > sweep - 1.5) rect(cx, cy, cw - 3, ch - 3, COL.gr, .5, false, 2);
    }
    const sy = y + 50 + Math.min(sweep, rows) * ch; if (sweep < rows) { line(x + 20, sy, x + w - 20, sy, COL.gr, .9, 2); rect(x + 20, sy - 14, w - 40, 14, COL.gr, .08); }
  },
  charts(x, y, w, h, t, k, col) { bars(x + 40, y + 70, w * .45, h - 160, t, 7, col, k, 3, ['N', 'S', 'E', 'W', 'C', 'NE', 'SW']); lineChart(x + w * .55, y + 70, w * .4, h - 160, t, 2, COL.am, k, 'TREND', .6); txt('"What are sales trends by region?"', x + w / 2, y + h - 22, { size: 20, fam: 'Raj', w: 600, col: COL.wh, align: 'center', a: k * .8 }); },
  nodes(x, y, w, h, t, k, col) {
    const ns = [['INPUT', .1, .25], ['LOADER', .1, .7], ['EMBED', .35, .7], ['VECTOR DB', .6, .75], ['LLM AGENT', .4, .3], ['TOOLS', .65, .25], ['OUTPUT', .88, .5]];
    const E = [[0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [3, 6]];
    const P = ns.map(n => [x + w * n[1], y + 30 + (h - 60) * n[2]]);
    E.forEach(([a, b], i) => { const vis = seg(k, i * .08, i * .08 + .3); if (vis <= 0) return; const [ax, ay] = P[a], [bx, by] = P[b]; ctx.save(); ctx.globalAlpha *= vis; ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax + 70, ay); ctx.bezierCurveTo(ax + 140, ay, bx - 140, by, bx - 70, by); ctx.stroke(); ctx.restore();
      const u = (t * .5 + i * .2) % 1; const bz = (p0, p1, p2, p3, u) => (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u * u * p2 + u ** 3 * p3; circ(bz(ax + 70, ax + 140, bx - 140, bx - 70, u), bz(ay, ay, by, by, u), 4, COL.wh, vis, 1, true); });
    ns.forEach((n, i) => { const [px, py] = P[i]; const vis = eo(seg(k, i * .07, i * .07 + .3)); if (vis <= 0) return; const run = Math.floor(t * .8) % ns.length == i;
      ctx.save(); ctx.globalAlpha *= vis; rect(px - 70, py - 26, 140, 52, '#04121c', .95); rect(px - 70, py - 26, 140, 52, run ? COL.am : col, run ? .3 : .12); rect(px - 70, py - 26, 140, 52, run ? COL.am : col, 1, false, 2); rect(px - 70, py - 26, 140, 8, run ? COL.am : col, .8); ctx.restore();
      txt(n[0], px, py + 10, { size: 16, fam: 'Orb', w: 700, col: COL.wh, align: 'center', a: vis, max: 126 }); circ(px - 70, py, 5, col, vis, 1, true); circ(px + 70, py, 5, col, vis, 1, true); });
  },
  agents(x, y, w, h, t, k, col) { graphNet(x, y + 10, w, h - 40, t, k, ['PLANNER', 'RETRIEVER', 'TOOLS', 'MEMORY', 'CRITIC', 'EXECUTOR'], col, 'ORCHESTRATOR'); },
  call(x, y, w, h, t, k, col) {
    waveform(x + 30, y + 40, w - 60, 90, t, col, eo(k));
    const L = [['CUSTOMER', 'We need 40 units delivered by next month.'], ['SALES', 'Sure — can I get your email for the quote?'], ['CUSTOMER', "It's procurement@client.example"], ['AI', 'INTENT ▸ purchase · ENTITY ▸ email captured'], ['SALES', 'Sending the onboarding and NDA links now.'], ['AI', 'ACTION ▸ email + NDA link queued'], ['CUSTOMER', 'Also share the KYC checklist please.'], ['AI', 'ACTION ▸ KYC document sent · STATUS ▸ qualified']];
    const shown = Math.floor(t * .45) % (L.length + 2);
    ctx.save(); ctx.beginPath(); ctx.rect(x + 20, y + 150, w - 40, h - 170); ctx.clip();
    for (let i = 0; i < Math.min(shown, L.length); i++) { const yy = y + 180 + (i - Math.max(0, shown - 6)) * 52; const ai = L[i][0] == 'AI'; const lk = i == shown - 1 ? cl((t * .45 % 1) * 2.5) : 1;
      txt(L[i][0], x + 40, yy, { size: 15, fam: 'Orb', w: 700, col: ai ? COL.am : L[i][0] == 'SALES' ? COL.gr : col, sp: 2 });
      if (ai) rect(x + 170, yy - 22, measure(L[i][1], 20, 'STM', 400) * lk + 20, 32, COL.am, .12);
      txt(typed(L[i][1], lk), x + 180, yy, { size: 20, fam: ai ? 'STM' : 'Raj', w: ai ? 400 : 600, col: ai ? COL.am : COL.wh }); }
    ctx.restore();
  },
  hub(x, y, w, h, t, k, col) { graphNet(x, y + 10, w, h - 40, t, k, ['SALESFORCE', 'HUBSPOT', 'ZOHO', 'PIPEDRIVE', 'TWILIO', 'VONAGE', 'RINGCENTRAL', 'DATABASE'], col, 'MCP SERVER'); },
  avatar(x, y, w, h, t, k, col) {
    const cx = x + w / 2, cy = y + h * .42, s = eo(k), talk = .5 + .5 * Math.sin(t * 9) * Math.sin(t * 3.1);
    ctx.save(); ctx.globalAlpha *= s; ctx.fillStyle = col;
    for (let i = 0; i < 520; i++) { const a = hr(i) * TAU, rr = Math.sqrt(hr(i + 1)); const px = Math.cos(a) * rr * 120, py = Math.sin(a) * rr * 160; const d = Math.hypot(px / 120, py / 160); ctx.globalAlpha = s * (.15 + .5 * (1 - d)) * (.7 + .3 * Math.sin(t * 2 + i)); ctx.fillRect(cx + px + Math.sin(t + i) * 1.5, cy + py, 2.2, 2.2); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = rgba(col, .8 * s); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, 125, 168, 0, 0, TAU); ctx.stroke();
    const blink = (t % 4) < .12 ? .15 : 1; ctx.fillStyle = COL.wh; ctx.beginPath(); ctx.ellipse(cx - 45, cy - 30, 16, 7 * blink, 0, 0, TAU); ctx.ellipse(cx + 45, cy - 30, 16, 7 * blink, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy + 70, 34, 4 + 16 * talk, 0, 0, TAU); ctx.strokeStyle = COL.am; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    const sy = (t * 120) % 340; line(cx - 140, cy - 170 + sy, cx + 140, cy - 170 + sy, col, .5, 2);
    corners(cx - 170, cy - 200, 340, 400, col, .7 * s, 30, 2);
    waveform(x + 40, y + h - 90, w - 80, 60, t, COL.am, s * (.4 + .6 * talk));
    txt('● LIVE  ' + fmtT((t * 1) % 1200).slice(0, 5), x + 30, y + 50, { size: 18, fam: 'STM', col: COL.rd, w: 400, a: s });
    txt('LATENCY  LOW', x + w - 30, y + 50, { size: 16, fam: 'STM', col: COL.gr, align: 'right', w: 400, a: s });
  },
  scan(x, y, w, h, t, k, col) {
    const dx = x + w * .5 - 170, dy = y + 40, dw = 340, dh = h - 70; rect(dx, dy, dw, dh, '#e8fbff', .06 * eo(k)); rect(dx, dy, dw, dh, col, .6 * k, false, 2);
    txt('CERTIFICATE OF COMPLIANCE', dx + dw / 2, dy + 40, { size: 15, fam: 'Orb', w: 700, col: COL.wh, align: 'center', a: k });
    for (let i = 0; i < 14; i++) rect(dx + 30, dy + 70 + i * 26, (dw - 60) * (.5 + .5 * hr(i + 3)), 8, COL.cy2, .25 * k);
    const sy = dy + ((t * .3) % 1) * dh; line(dx - 20, sy, dx + dw + 20, sy, COL.gr, .9, 3); rect(dx, sy - 30, dw, 30, COL.gr, .08);
    const boxes = [['CERT NO.', 70, 2], ['EXPIRY DATE', 70 + 26 * 5, 3], ['CONTACT', 70 + 26 * 9, 2], ['SIGNATURE', 70 + 26 * 12, 2]];
    boxes.forEach(([lb, oy, n], i) => { const by = dy + oy - 12; if (sy < by) return; rect(dx + 24, by, dw - 48, 26 * n - 8, COL.am, .9, false, 2); line(dx + dw - 24, by + 10, x + w - 60, y + 90 + i * 90, COL.am, .5); txt(lb, x + w - 55, y + 96 + i * 90, { size: 16, fam: 'Orb', w: 700, col: COL.am, align: 'right' }); txt('✓ EXTRACTED', x + w - 55, y + 118 + i * 90, { size: 14, fam: 'STM', col: COL.gr, align: 'right', w: 400 }); });
    txt('OCR', x + 50, y + 90, { size: 40, fam: 'Orb', w: 900, col, a: k }); txt('DOCUMENT AI', x + 50, y + 116, { size: 16, fam: 'STM', col: COL.cy2, w: 400, a: k });
  },
  checks(x, y, w, h, t, k, col) {
    const items = ['Company registration', 'Tax / GST document', 'Quality certification', 'Bank verification', 'NDA signed', 'Compliance policy', 'Contact verified', 'Supplier created in ERP'];
    items.forEach((s, i) => { const yy = y + 70 + i * ((h - 100) / items.length); const done = (t * .5) % (items.length + 3) > i + 1; const vis = seg(k, i * .08, i * .08 + .3);
      rect(x + 40, yy - 24, w - 80, 38, done ? COL.gr : col, .08 * vis); hexPath(x + 66, yy - 5, 12); ctx.strokeStyle = rgba(done ? COL.gr : col, vis); ctx.lineWidth = 2; ctx.stroke();
      if (done) txt('✓', x + 66, yy + 2, { size: 18, fam: 'DJ', w: 700, col: COL.gr, align: 'center', a: vis });
      txt(s, x + 96, yy + 2, { size: 21, fam: 'Raj', w: 600, col: COL.wh, a: vis }); txt(done ? 'VERIFIED' : 'CHECKING…', x + w - 60, yy + 2, { size: 15, fam: 'STM', w: 400, col: done ? COL.gr : COL.am, align: 'right', a: vis }); });
  },
  contract(x, y, w, h, t, k, col) {
    const dx = x + 40, dy = y + 40, dw = w * .55, dh = h - 70; rect(dx, dy, dw, dh, '#e8fbff', .06 * k); rect(dx, dy, dw, dh, col, .7 * k, false, 2);
    txt('MUTUAL NDA', dx + dw / 2, dy + 42, { size: 22, fam: 'Orb', w: 900, col: COL.wh, align: 'center', a: k });
    for (let i = 0; i < 11; i++) rect(dx + 30, dy + 70 + i * 24, (dw - 60) * (.6 + .4 * hr(i + 11)), 7, COL.cy2, .25 * k);
    const sp = ((t * .2) % 1.4); ctx.save(); ctx.beginPath(); for (let u = 0; u <= cl(sp); u += .01) { const sx = dx + 40 + u * (dw * .6), sy = dy + dh - 60 + Math.sin(u * 22) * 14 * Math.sin(u * 5 + 1) - u * 10; u ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); } ctx.strokeStyle = COL.am; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    line(dx + 30, dy + dh - 34, dx + dw * .7, dy + dh - 34, COL.wh, .4);
    if (sp > 1) { ctx.save(); ctx.translate(dx + dw - 70, dy + dh - 80); ctx.rotate(-.25); const a = cl((sp - 1) * 5); rect(-62, -24, 124, 48, COL.gr, a, false, 3); txt('SIGNED', 0, 10, { size: 24, fam: 'Orb', w: 900, col: COL.gr, align: 'center', a }); ctx.restore(); }
    const st = ['KYC VERIFIED', 'NDA GENERATED', 'TERMS NEGOTIATED', 'E-SIGNATURE', 'ZOHO CRM SYNCED', 'BOOKS PROVISIONED']; st.forEach((s, i) => { const on = (t * .5) % (st.length + 2) > i; txt((on ? '■ ' : '□ ') + s, dx + dw + 40, dy + 40 + i * 54, { size: 19, fam: 'STM', w: 400, col: on ? COL.gr : COL.dim, a: k }); });
  },
  funnel(x, y, w, h, t, k, col) {
    const st = ['APPLIED', 'PARSED', 'AI SCORED', 'ASSESSED', 'AI INTERVIEW', 'SHORTLIST'], n = st.length, sh = (h - 80) / n;
    st.forEach((s, i) => { const top = (1 - i / n * .8) * (w - 120), bot = (1 - (i + 1) / n * .8) * (w - 120); const yy = y + 50 + i * sh; const cx = x + w / 2; const vis = eo(seg(k, i * .1, i * .1 + .3)); if (vis <= 0) return;
      ctx.save(); ctx.globalAlpha *= vis; ctx.beginPath(); ctx.moveTo(cx - top / 2, yy); ctx.lineTo(cx + top / 2, yy); ctx.lineTo(cx + bot / 2, yy + sh - 6); ctx.lineTo(cx - bot / 2, yy + sh - 6); ctx.closePath(); ctx.fillStyle = rgba(i == n - 1 ? COL.am : col, .12 + i * .05); ctx.fill(); ctx.strokeStyle = i == n - 1 ? COL.am : col; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      txt(s, cx, yy + sh / 2 + 6, { size: 18, fam: 'Orb', w: 700, col: COL.wh, align: 'center', a: vis, sp: 2 }); });
    for (let p = 0; p < 26; p++) { const u = (t * .25 + hr(p)) % 1; const lane = (hr(p + 3) - .5) * (1 - u * .8) * (w - 160); const keep = hr(p + 7) > u * .9; if (!keep) continue; circ(x + w / 2 + lane, y + 50 + u * (h - 80), 4, COL.wh, .8 * k, 1, true); }
  },
  grade(x, y, w, h, t, k, col) { radar(x + w * .42, y + h / 2 + 10, Math.min(w, h) * .3, ['CALL QUALITY', 'ENGAGEMENT', 'FOLLOW-UPS', 'OBJECTIONS', 'CLARITY', 'NEXT STEPS'], [86, 78, 92, 70, 88, 81], k, t, col);
    ['GUIDANCE', '▸ Confirm delivery date', '▸ Send pricing sheet', '▸ Book follow-up call'].forEach((s, i) => txt(s, x + w - 30, y + 80 + i * 36, { size: i ? 18 : 16, fam: i ? 'Raj' : 'Orb', w: 700, col: i ? COL.wh : COL.am, align: 'right', a: seg(k, .4 + i * .1, .6 + i * .1) })); },
  mesh(x, y, w, h, t, k, col) { graphNet(x, y + 10, w, h - 40, t, k, ['CUSTOMERS', 'SUPPLIERS', 'PROCUREMENT', 'VENDORS', 'FINANCE', 'LOGISTICS', 'ACCOUNTS', 'MANAGEMENT'], col, 'AI SCM CORE'); },
  ship(x, y, w, h, t, k, col) {
    const ms = ['ORDER', 'PO ISSUED', 'DISPATCHED', 'IN TRANSIT', 'CUSTOMS', 'DELIVERED']; const yy = y + 110; const pr = ((t * .08) % 1);
    line(x + 60, yy, x + w - 60, yy, col, .3, 4); line(x + 60, yy, x + 60 + (w - 120) * pr * eo(k), yy, COL.am, 1, 4);
    ms.forEach((m, i) => { const px = x + 60 + (w - 120) * i / (ms.length - 1); const done = pr >= i / (ms.length - 1); circ(px, yy, 12, done ? COL.am : col, k, 2.5); if (done) circ(px, yy, 6, COL.am, k, 1, true); txt(m, px, yy + (i % 2 ? -26 : 40), { size: 15, fam: 'Orb', w: 700, col: done ? COL.wh : COL.dim, align: 'center', a: k }); });
    const tx = x + 60 + (w - 120) * pr; rect(tx - 14, yy - 9, 28, 18, COL.wh, k);
    lineChart(x + 60, y + 230, w - 120, h - 300, t, 5, col, k, 'LEAD TIME · COST · ETA SIGNAL', .5);
  },
  globe(x, y, w, h, t, k, col) { globe(x + w / 2, y + h / 2 + 10, Math.min(w, h) * .4, t, k, col, [[50, 10], [40, -95], [35, 139], [52, -1], [1, 104], [25, 55], [-23, -46], [48, 2], [37, 127], [-33, 151]]);
    txt('HUB · INDIA', x + 30, y + h - 26, { size: 16, fam: 'STM', w: 400, col: COL.cy2, a: k }); txt('SUPPLIER LEADS ●', x + w - 30, y + h - 26, { size: 16, fam: 'STM', w: 400, col: COL.am, align: 'right', a: k }); },
  score(x, y, w, h, t, k, col) {
    txt('P/N 3214-56 · QTY 4 · AS9120 · DELIVER TO INDIA', x + 30, y + 64, { size: 18, fam: 'STM', w: 400, col: COL.am, a: k });
    const S = [94, 88, 81, 73, 66, 52]; S.forEach((v, i) => { const yy = y + 110 + i * ((h - 140) / S.length); const vis = seg(k, i * .1, i * .1 + .4); const bw = (w * .5) * v / 100 * eo(vis);
      txt('SUPPLIER · ' + String(i + 1).padStart(2, '0'), x + 30, yy + 18, { size: 17, fam: 'Orb', w: 700, col: COL.wh, a: vis });
      rect(x + 230, yy, w * .5, 26, col, .1); rect(x + 230, yy, bw, 26, v > 80 ? COL.gr : v > 65 ? COL.am : COL.rd, .85); txt(String(Math.round(v * eo(vis))), x + 240 + bw, yy + 20, { size: 18, fam: 'Orb', w: 700, col: COL.wh, a: vis });
      const ev = ['CERT ✓', 'P/N ✓', 'PDF ✓', 'CONTACT ✓'].slice(0, 4 - Math.floor(i / 2)); ev.forEach((e, j) => txt(e, x + w - 30 - j * 92, yy + 19, { size: 14, fam: 'STM', w: 400, col: COL.cy2, align: 'right', a: vis * .9 })); });
  },
};

