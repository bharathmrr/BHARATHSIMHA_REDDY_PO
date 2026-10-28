// Portfolio motion-graphics film v2 — cinematic kinetic typography, glass UI, 3D image cards.
// render(t) is deterministic: the same t always draws the same frame.
const MAIN = ctx;
const IMG = {};
const offA = mk(W, H), offB = mk(W, H), devC = mk(820, 560);
const GRAD = ['#22d3ee', '#818cf8', '#f472b6'];

// ---------- helpers ----------
function withCtx(c2, fn) { const o = ctx; ctx = c2; try { fn(); } finally { ctx = o; } }
function gradText(x, y, w, cols = GRAD) { const g = ctx.createLinearGradient(x, y, x + w, y); cols.forEach((cc, i) => g.addColorStop(i / (cols.length - 1), cc)); return g; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// kinetic per-character text. style: 'rise' (mask rise), 'fade', 'scale'
function kin(s, x, y, lt, o = {}) {
  const { size = 60, fam = 'In', w = 800, col = COL.wh, align = 'left', st = 0, stag = .025, dur = .55, out = 1e9, outDur = .4, sp = 0, grad = false, style = 'rise', a = 1, stroke = false } = o;
  if (lt < st || a <= 0) return 0;
  ctx.save(); ctx.font = font(size, fam, w); ctx.letterSpacing = sp + 'px'; ctx.textBaseline = 'alphabetic';
  const total = ctx.measureText(s).width; let x0 = align == 'center' ? x - total / 2 : align == 'right' ? x - total : x;
  const fillS = grad ? gradText(x0, y, total, grad === true ? GRAD : grad) : col;
  if (style == 'rise') { ctx.beginPath(); ctx.rect(x0 - 40, y - size * 1.15, total + 80, size * 1.45); ctx.clip(); }
  let acc = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]; const cx = x0 + ctx.measureText(acc).width; acc += ch;
    if (ch == ' ') continue;
    const k = eo(seg(lt, st + i * stag, st + i * stag + dur)); if (k <= 0) continue;
    const ko = eio(seg(lt, out + i * stag * .5, out + i * stag * .5 + outDur)); if (ko >= 1) continue;
    let dy = 0, al = a, sc = 1;
    if (style == 'rise') { dy = (1 - k) * size * 1.1 - ko * size * 1.1; al = a; }
    else if (style == 'fade') { dy = (1 - k) * size * .35 - ko * size * .3; al = a * k * (1 - ko); }
    else if (style == 'scale') { sc = .4 + .6 * k; al = a * k * (1 - ko); dy = -ko * size * .3; }
    ctx.globalAlpha = al; ctx.fillStyle = fillS; ctx.strokeStyle = fillS;
    if (sc != 1) { ctx.save(); ctx.translate(cx, y + dy); ctx.scale(sc, sc); stroke ? ctx.strokeText(ch, 0, 0) : ctx.fillText(ch, 0, 0); ctx.restore(); }
    else stroke ? (ctx.lineWidth = 2, ctx.strokeText(ch, cx, y + dy)) : ctx.fillText(ch, cx, y + dy);
  }
  ctx.restore(); return total;
}
function glass(x, y, w, h, k = 1, col = COL.cy, r = 22) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= cl(k);
  rr(x, y, w, h, r); const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, 'rgba(255,255,255,0.075)'); g.addColorStop(1, 'rgba(255,255,255,0.02)'); ctx.fillStyle = g; ctx.fill();
  const b = ctx.createLinearGradient(x, y, x + w, y + h); b.addColorStop(0, rgba(col, .75)); b.addColorStop(.5, 'rgba(255,255,255,0.08)'); b.addColorStop(1, rgba(col, .35)); ctx.strokeStyle = b; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}
function pill(s, x, y, col, k = 1, size = 20) {
  if (k <= 0) return 0; const w = measure(s, size, 'IT', 600) + 30, h = size + 18;
  ctx.save(); ctx.globalAlpha *= cl(k); ctx.translate(0, (1 - eo(k)) * 14);
  rr(x, y, w, h, h / 2); ctx.fillStyle = rgba(col, .14); ctx.fill(); ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  txt(s, x + 15, y + h / 2 + size * .36, { size, fam: 'IT', w: 600, col: COL.wh, a: cl(k) }); return w;
}
function pills(items, x, y, maxW, lt, st, col, size = 20) { let cx = x, cy = y; items.forEach((s, i) => { const w = measure(s, size, 'IT', 600) + 30; if (cx + w > x + maxW) { cx = x; cy += size + 30; } pill(s, cx, cy, col, seg(lt, st + i * .08, st + i * .08 + .4), size); cx += w + 12; }); }
function label(s, x, y, lt, st, col = COL.cy, align = 'left') { const k = seg(lt, st, st + .5); if (k <= 0) return; const w = measure(s, 17, 'STM', 400, 4); const lx = align == 'left' ? x : x - w - 46; line(lx, y - 6, lx + 34 * eo(k), y - 6, col, k, 2); txt(s, lx + 46, y, { size: 17, fam: 'STM', w: 400, col, sp: 4, a: k }); }
function counter(v, k, dec) { const x = v * eo(k); return dec ? x.toFixed(2) : String(Math.round(x)); }
// 3D-tilted image (perspective by vertical strips)
function persp(img, cx, cy, w, h, ry, k = 1, frame = true, col = COL.cy, zoom = 1) {
  if (k <= 0 || !img) return; const N = 90, D = 1600; const iw = img.width, ih = img.height;
  const sw = iw / zoom, sh = ih / zoom, sx0 = (iw - sw) / 2, sy0 = (ih - sh) / 2;
  const P = u => { const X = (u - .5) * w; const Z = X * Math.sin(ry); const f = D / (D + Z); return [cx + X * Math.cos(ry) * f, f]; };
  ctx.save(); ctx.globalAlpha *= cl(k);
  // shadow glow
  const [lx, lf] = P(0), [rx, rf] = P(1);
  ctx.save(); ctx.globalAlpha *= .5; const g = ctx.createRadialGradient(cx, cy + h * .1, 10, cx, cy + h * .1, w * .75); g.addColorStop(0, rgba(col, .35)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(cx - w, cy - h, w * 2, h * 2); ctx.restore();
  if (frame) { ctx.beginPath(); ctx.moveTo(lx - 10 * lf, cy - (h / 2 + 46) * lf); ctx.lineTo(rx + 10 * rf, cy - (h / 2 + 46) * rf); ctx.lineTo(rx + 10 * rf, cy + (h / 2 + 10) * rf); ctx.lineTo(lx - 10 * lf, cy + (h / 2 + 10) * lf); ctx.closePath(); ctx.fillStyle = 'rgba(15,18,32,0.92)'; ctx.fill(); ctx.strokeStyle = rgba(col, .55); ctx.lineWidth = 1.5; ctx.stroke();
    [COL.rd, COL.am, COL.gr].forEach((cc, i) => { const [px, pf] = P(.03 + i * .025); circ(px, cy - (h / 2 + 24) * pf, 6 * pf, cc, .9, 1, true); }); }
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N; const [x0, f0] = P(u0), [x1] = P(u1); const f = f0;
    ctx.drawImage(img, sx0 + u0 * sw, sy0, sw / N + .5, sh, x0, cy - h / 2 * f, x1 - x0 + .8, h * f);
  }
  // light sweep
  ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.moveTo(lx, cy - h / 2 * lf); ctx.lineTo(rx, cy - h / 2 * rf); ctx.lineTo(rx, cy + h / 2 * rf); ctx.lineTo(lx, cy + h / 2 * lf); ctx.closePath(); ctx.clip();
  const sw2 = ctx.createLinearGradient(lx, cy - h, rx, cy + h); const p = ((performance.now ? 0 : 0) + (cx * .0)); sw2.addColorStop(0, 'rgba(255,255,255,0)'); sw2.addColorStop(.48, 'rgba(255,255,255,0)'); sw2.addColorStop(.5, 'rgba(255,255,255,0.10)'); sw2.addColorStop(.52, 'rgba(255,255,255,0)'); ctx.fillStyle = sw2; ctx.fillRect(lx, cy - h, rx - lx, h * 2);
  ctx.restore();
}
function wordSphere(cx, cy, R, words, t, k, size = 26) {
  const n = words.length, ry = t * .25, rx = .35 * Math.sin(t * .2);
  const pts = words.map((w, i) => { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; let x = Math.cos(th) * r, z = Math.sin(th) * r; const x2 = x * Math.cos(ry) - z * Math.sin(ry), z2 = x * Math.sin(ry) + z * Math.cos(ry); const y2 = y * Math.cos(rx) - z2 * Math.sin(rx), z3 = y * Math.sin(rx) + z2 * Math.cos(rx); return [x2, y2, z3, w, i]; }).sort((a, b) => a[2] - b[2]);
  pts.forEach(([x, y, z, w, i]) => { const f = (z + 2) / 3; const vis = seg(k, i / n * .6, i / n * .6 + .4); txt(w, cx + x * R * eo(k), cy + y * R * eo(k), { size: size * (.6 + .5 * f), fam: 'IT', w: z > 0 ? 700 : 500, col: z > .3 ? COL.wh : [COL.cy, COL.vi, COL.pk][i % 3], align: 'center', a: vis * (.2 + .8 * f) }); });
}
function monogram(cx, cy, r, t, k) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= cl(k);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * (.3 + i * .15) * (i % 2 ? -1 : 1)); ctx.strokeStyle = GRAD[i]; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, r * (1 + i * .18) * eo(k), r * (.35 + i * .08) * eo(k), 0, 0, TAU); ctx.stroke(); const an = t * 2 + i * 2; circ(Math.cos(an) * r * (1 + i * .18), Math.sin(an) * r * (.35 + i * .08), 5, GRAD[i], 1, 1, true); ctx.restore(); }
  ctx.restore();
}

// ---------- background ----------
const STARS = Array.from({ length: 150 }, (_, i) => [hr(i) * 2 - 1, hr(i + 1) * 2 - 1, hr(i + 2)]);
function bg(t, tint = 'cy') {
  MAIN.fillStyle = '#04050b'; MAIN.fillRect(0, 0, W, H);
  const blobs = [[.25 + .08 * Math.sin(t * .07), .3 + .06 * Math.cos(t * .05), COL[tint] || COL.cy, .16], [.78 + .06 * Math.cos(t * .06), .65 + .07 * Math.sin(t * .08), COL.vi, .14], [.5 + .2 * Math.sin(t * .04), .95, COL.pk, .08]];
  blobs.forEach(([bx, by, cc, a]) => { const g = MAIN.createRadialGradient(bx * W, by * H, 0, bx * W, by * H, W * .45); g.addColorStop(0, rgba(cc, a)); g.addColorStop(1, rgba(cc, 0)); MAIN.fillStyle = g; MAIN.fillRect(0, 0, W, H); });
  MAIN.save(); MAIN.fillStyle = '#ffffff';
  STARS.forEach(([x, y, z], i) => { const d = ((z + t * .015) % 1); const f = .3 + d * 1.6; const px = W / 2 + x * W * .55 * f, py = H / 2 + y * H * .55 * f; if (px < 0 || px > W || py < 0 || py > H) return; MAIN.globalAlpha = .12 + .5 * d * (.6 + .4 * Math.sin(t * 2 + i)); const s = .8 + d * 1.8; MAIN.fillRect(px, py, s, s); });
  MAIN.restore();
  // horizon grid
  MAIN.save(); MAIN.strokeStyle = 'rgba(129,140,248,0.05)'; MAIN.lineWidth = 1; const hz = H * .7;
  for (let i = -16; i <= 16; i++) { MAIN.beginPath(); MAIN.moveTo(W / 2 + i * 30, hz); MAIN.lineTo(W / 2 + i * 260, H); MAIN.stroke(); }
  for (let j = 0; j < 9; j++) { const kk = (j + (t * .25) % 1) / 9; const y = hz + (H - hz) * kk * kk; MAIN.globalAlpha = kk; MAIN.beginPath(); MAIN.moveTo(0, y); MAIN.lineTo(W, y); MAIN.stroke(); }
  MAIN.restore();
}

// ---------- scenes ----------
const SC = []; let TT = 0;
function scene(name, dur, fn, o = {}) { SC.push({ name, t0: TT, dur, fn, tr: o.tr || 'zoom', tint: o.tint || 'cy' }); TT += dur; }

// 1 · COLD OPEN
scene('open', 14, (lt, t) => {
  // particles converge into a ring
  ctx.save(); for (let i = 0; i < 260; i++) { const an = hr(i) * TAU + t * .05, k = eio(seg(lt, hr(i + 1) * 2, 3 + hr(i + 1) * 2)); const R0 = 1400 + hr(i + 2) * 600, R1 = 330 + Math.sin(i * 3.1) * 14; const r = lerp(R0, R1, k) * (1 + .02 * Math.sin(t * 2 + i)); const x = W / 2 + Math.cos(an) * r, y = H / 2 + Math.sin(an) * r * .42; ctx.globalAlpha = .25 + .6 * k * (1 - seg(lt, 12.5, 14)); ctx.fillStyle = GRAD[i % 3]; ctx.fillRect(x, y, 2.4, 2.4); } ctx.restore();
  const flash = Math.exp(-Math.pow((lt - 1.2) * 3, 2)); circ(W / 2, H / 2, 6 + 60 * flash, COL.wh, .9 * flash, 1, true);
  kin('BEYOND THE CHATBOX.', W / 2, H / 2 + 30, lt, { size: 104, w: 900, align: 'center', st: 1.6, out: 5.2, sp: -1 });
  kin('AI THAT UNDERSTANDS CONTEXT,', W / 2, H / 2 - 40, lt, { size: 70, w: 800, align: 'center', st: 5.8, out: 9.4, col: COL.wh });
  kin('TALKS TO REAL BUSINESS SYSTEMS', W / 2, H / 2 + 60, lt, { size: 70, w: 800, align: 'center', st: 6.6, out: 9.5, col: COL.cy2 });
  kin('AND GETS THE WORK DONE.', W / 2, H / 2 + 45, lt, { size: 132, w: 900, align: 'center', st: 9.9, out: 13.3, grad: true, sp: -2 });
}, { tr: 'zoom' });

// 2 · NAME
scene('name', 12, (lt, t) => {
  monogram(W / 2, H / 2 - 20, 520, t, seg(lt, 0, 2) * (1 - seg(lt, 11, 12)));
  label('PORTFOLIO · 2026', W / 2 - 520, 300, lt, .3, COL.cy);
  kin(ME.first, W / 2, H / 2 - 20, lt, { size: 190, w: 900, align: 'center', st: .4, stag: .045, dur: .8, grad: true, sp: -4, out: 11.2 });
  kin(ME.last, W / 2, H / 2 + 140, lt, { size: 120, w: 300, align: 'center', st: 1.2, stag: .04, dur: .8, col: COL.wh, sp: 18, out: 11.3 });
  const lk = eo(seg(lt, 2, 3.2)) * (1 - seg(lt, 11, 11.8)); line(W / 2 - 700 * lk, H / 2 + 200, W / 2 + 700 * lk, H / 2 + 200, COL.wh, .25, 1);
  kin(ME.role.toUpperCase(), W / 2, H / 2 + 270, lt, { size: 34, fam: 'IT', w: 600, align: 'center', st: 2.6, style: 'fade', stag: .015, sp: 6, col: COL.cy2, out: 11.1 });
  kin(ME.role2 + '   ·   ' + ME.place, W / 2, H / 2 + 320, lt, { size: 24, fam: 'IT', w: 500, align: 'center', st: 3.4, style: 'fade', stag: .01, sp: 3, col: '#94a3b8', out: 11.2 });
}, { tr: 'light', tint: 'vi' });

// 3 · ABOUT
scene('about', 22, (lt, t) => {
  const A = lt < 10.5;
  if (lt < 11) {
    label('ABOUT ME', 140, 250, lt, .2, COL.pk);
    kin('I design AI agents that', 140, 360, lt, { size: 68, w: 700, st: .5, out: 10, stag: .018 });
    kin('understand business context,', 140, 450, lt, { size: 68, w: 700, st: 1.1, out: 10.05, stag: .018, grad: true });
    kin('interact with real systems', 140, 540, lt, { size: 68, w: 700, st: 1.7, out: 10.1, stag: .018 });
    kin('and execute real-world tasks.', 140, 630, lt, { size: 68, w: 700, st: 2.3, out: 10.15, stag: .018 });
    kin('Voice AI · automation · agentic workflows · production backends', 142, 720, lt, { size: 26, fam: 'IT', w: 500, st: 3.6, style: 'fade', stag: .006, col: '#94a3b8', out: 10.2 });
    ctx.save(); ctx.globalAlpha = 1 - seg(lt, 10, 11); wordSphere(1460, 520, 290, ME.sphere, t, seg(lt, .5, 3.5), 25); ctx.restore();
  } else {
    const l2 = lt - 11; label('IN NUMBERS', W / 2, 250, l2, .1, COL.cy, 'center');
    ME.stats.forEach(([v, lab, suf], i) => { const x = 150 + i * 420, y = 360, k = seg(l2, .3 + i * .25, 1.1 + i * .25), ko = seg(l2, 10.2, 11); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = 1 - ko; ctx.translate(0, (1 - eo(k)) * 60 - ko * 40); glass(x, y, 380, 380, k, GRAD[i % 3]);
      ring(x + 190, y + 160, 96, cl(eo(seg(l2, .5 + i * .25, 3 + i * .25))), GRAD[i % 3], t + i, k);
      txt(counter(v, seg(l2, .5 + i * .25, 3 + i * .25), v % 1 != 0) + suf, x + 190, y + 182, { size: 66, fam: 'In', w: 900, col: COL.wh, align: 'center' });
      txt(lab, x + 190, y + 330, { size: 21, fam: 'IT', w: 700, col: '#cbd5e1', align: 'center', sp: 3 }); ctx.restore(); });
  }
}, { tr: 'slide', tint: 'pk' });

// 4 · EXPERIENCE
scene('experience', 54, (lt, t) => {
  // intro title 0-3
  if (lt < 3.4) { kin('EXPERIENCE', W / 2, H / 2 + 60, lt, { size: 220, w: 900, align: 'center', st: 0, stag: .04, grad: true, sp: -6, out: 2.8 }); kin('FROM INTERN TO ENTERPRISE AI', W / 2, H / 2 + 140, lt, { size: 26, fam: 'IT', w: 600, align: 'center', st: .8, style: 'fade', sp: 8, col: COL.cy2, out: 2.7 }); return; }
  let acc = 3, idx = 0; for (let i = 0; i < EXP.length; i++) { if (lt >= acc && lt < acc + EXP[i].dur) { idx = i; break; } acc += EXP[i].dur; if (i == EXP.length - 1) idx = i; }
  const e = EXP[idx], l = lt - acc, D = e.dur, col = COL[e.col];
  // rail
  const rx = 150, ry0 = 230, ry1 = 880; line(rx, ry0, rx, ry1, COL.wh, .12, 2);
  const prog = cl((lt - 3) / 51); line(rx, ry0, rx, lerp(ry0, ry1, idx / (EXP.length - 1)), col, .9, 3);
  EXP.forEach((x, i) => { const y = lerp(ry0, ry1, i / (EXP.length - 1)), on = i == idx, done = i < idx; circ(rx, y, on ? 13 : 8, on ? col : done ? COL.wh : '#334155', 1, 1, true); if (on) circ(rx, y, 22 + 5 * Math.sin(t * 5), col, .6, 2); txt(x.co, rx + 34, y + 7, { size: on ? 22 : 18, fam: 'IT', w: on ? 800 : 600, col: on ? COL.wh : '#64748b', sp: 2 }); txt(x.date.split(' — ')[0], rx + 34, y + 30, { size: 14, fam: 'STM', w: 400, col: on ? col : '#475569', sp: 1 }); });
  // giant outline company name behind
  ctx.save(); ctx.globalAlpha = .07 * seg(l, 0, 1) * (1 - seg(l, D - .6, D)); ctx.font = font(300, 'In', 900); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.letterSpacing = '-6px'; ctx.textAlign = 'right'; ctx.strokeText(e.co, W - 60 - l * 12, 1010); ctx.restore();
  const X = 560, out = D - .55;
  label(e.date, X, 270, l, .1, col);
  kin(e.role, X, 380, l, { size: e.role.length > 24 ? 74 : 86, w: 800, st: .2, stag: .015, out, sp: -1 });
  kin(e.co, X, 470, l, { size: 54, w: 900, st: .5, stag: .03, out, grad: [col, COL.wh], sp: 4 });
  kin(e.loc, X + 4, 520, l, { size: 24, fam: 'IT', w: 500, st: .8, style: 'fade', stag: .008, out, col: '#94a3b8' });
  e.pts.forEach((p, i) => { const st = 1.3 + i * .55; const k = seg(l, st, st + .5) * (1 - seg(l, out, out + .4)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - eo(seg(l, st, st + .5))) * 40, 0); rr(X, 568 + i * 66, 6, 40, 3); ctx.fillStyle = col; ctx.fill(); txt(p, X + 28, 598 + i * 66, { size: 29, fam: 'IT', w: 500, col: '#e2e8f0' }); ctx.restore(); });
  ctx.save(); ctx.globalAlpha = 1 - seg(l, out, out + .4); pills(e.tags, X, 850, 1250, l, 2.4, col, 20); ctx.restore();
}, { tr: 'iris', tint: 'cy' });

// 5 · PLATFORMS
function renderDevice(fnName, t, k, col) {
  const c2 = devC.getContext('2d'); c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, 820, 560);
  c2.fillStyle = '#070b16'; c2.fillRect(0, 0, 820, 560);
  withCtx(c2, () => { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 820, 560); ctx.clip(); V[fnName](0, -10, 820, 570, t, k, col); ctx.restore(); });
  return devC;
}
scene('platforms', 68, (lt, t) => {
  if (lt < 4) { label('BUILT AT JANE & AIQWIP', W / 2, 380, lt, .1, COL.am, 'center'); kin('ENTERPRISE AI', W / 2, H / 2 + 40, lt, { size: 170, w: 900, align: 'center', st: .2, stag: .035, grad: true, sp: -4, out: 3.4 }); kin('PLATFORMS', W / 2, H / 2 + 170, lt, { size: 120, w: 200, align: 'center', st: .6, stag: .05, sp: 30, out: 3.5 }); return; }
  const i = Math.min(7, Math.floor((lt - 4) / 8)), l = lt - 4 - i * 8, p = PLAT[i], col = COL[p.col], out = 7.45;
  const side = i % 2 == 0; const LX = side ? 130 : 1040, DX = side ? 1290 : 640;
  txt(String(i + 1).padStart(2, '0') + ' / 08', LX - 4, 215, { size: 30, fam: 'In', w: 900, col: rgba(col, .9 * seg(l, 0, .6) * (1 - seg(l, out, 8))), sp: 4 });
  label(p.org + '  ·  ' + p.date, LX, 270, l, .1, col);
  const words = p.t.split(' '); let line1 = '', line2 = ''; words.forEach(w => { (measure(line1 + ' ' + w, 76, 'In', 800) < 720 && !line2) ? line1 = (line1 ? line1 + ' ' : '') + w : line2 = (line2 ? line2 + ' ' : '') + w; });
  kin(line1, LX, 400, l, { size: 76, w: 800, st: .2, stag: .02, out, sp: -1 }); if (line2) kin(line2, LX, 485, l, { size: 76, w: 800, st: .4, stag: .02, out, grad: [col, COL.wh], sp: -1 });
  wrap(p.d, 700, 29, 'IT', 500).forEach((ln, j) => kin(ln, LX + 2, (line2 ? 570 : 490) + j * 42, l, { size: 29, fam: 'IT', w: 500, st: .9 + j * .15, style: 'fade', stag: .005, out, col: '#cbd5e1' }));
  ctx.save(); ctx.globalAlpha = 1 - seg(l, out, out + .4); pills(p.tech, LX, line2 ? 720 : 640, 740, l, 1.6, col, 19); ctx.restore();
  const dk = seg(l, .3, 1.4) * (1 - seg(l, out - .1, 8)); const dev = renderDevice(p.v, t, seg(l, .8, 4), col);
  const ry = (side ? -.32 : .32) + (side ? 1 : -1) * .1 * eo(seg(l, 0, 7));
  persp(dev, DX, 545 + (1 - eo(dk)) * 80, 820 * .92, 560 * .92, ry, dk, true, col);
}, { tr: 'slide', tint: 'am' });

// 6 · GITHUB INTRO
scene('github', 8, (lt, t) => {
  // repo wall in perspective
  ctx.save(); for (let r = 0; r < 9; r++) { const y = 120 + r * 105, sp = (r % 2 ? 1 : -1) * (40 + r * 6); ctx.globalAlpha = .1 + .05 * (r % 3); for (let j = 0; j < 9; j++) { const name = REPOS[(r * 7 + j) % REPOS.length]; const x = ((j * 380 + lt * sp + r * 90) % 3420 + 3420) % 3420 - 380; rr(x, y, 350, 64, 12); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.stroke(); txt(name, x + 20, y + 41, { size: 20, fam: 'STM', w: 400, col: COL.cy2, max: 310 }); } } ctx.restore();
  const k = seg(lt, .2, 1.4); ctx.save(); ctx.globalAlpha = k * (1 - seg(lt, 7.3, 8)); const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 700); g.addColorStop(0, 'rgba(4,5,11,0.95)'); g.addColorStop(1, 'rgba(4,5,11,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  kin('OPEN SOURCE', W / 2, H / 2 - 30, lt, { size: 150, w: 900, align: 'center', st: .3, stag: .035, grad: true, sp: -3, out: 7.4 });
  kin(counter(78, seg(lt, .8, 3.2)) + ' REPOSITORIES', W / 2, H / 2 + 70, lt, { size: 46, fam: 'IT', w: 700, align: 'center', st: .8, style: 'fade', stag: 0, sp: 10, col: COL.wh, out: 7.4 });
  kin('github.com/bharathmrr', W / 2, H / 2 + 130, lt, { size: 30, fam: 'STM', w: 400, align: 'center', st: 1.4, style: 'fade', stag: .02, col: COL.cy, out: 7.5 });
}, { tr: 'light', tint: 'vi' });

// 7 · FEATURED REPOS (real images)
scene('featured', 50, (lt, t) => {
  const i = Math.min(4, Math.floor(lt / 10)), l = lt - i * 10, f = FEAT[i], col = COL[f.col], out = 9.45, side = i % 2 == 0;
  const LX = side ? 120 : 1080, IX = side ? 1300 : 640;
  label('GITHUB · FEATURED ' + (i + 1) + '/5', LX, 250, l, .1, col);
  kin('bharathmrr/' + f.repo, LX, 300, l, { size: 20, fam: 'STM', w: 400, st: .3, style: 'fade', stag: .006, col: '#64748b', out });
  let fs = 92; while (measure(f.t, fs, 'In', 900) > 740) fs -= 2;
  kin(f.t, LX, 400, l, { size: fs, w: 900, st: .3, stag: .025, out, grad: [col, COL.wh], sp: -1 });
  kin(f.sub, LX + 2, 460, l, { size: 30, fam: 'IT', w: 500, st: .7, style: 'fade', stag: .008, out, col: '#cbd5e1' });
  f.pts.forEach((p, j) => { const st = 1.2 + j * .45, k = seg(l, st, st + .5) * (1 - seg(l, out, out + .4)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate((1 - eo(seg(l, st, st + .5))) * (side ? -40 : 40), 0); circ(LX + 8, 540 + j * 64, 6, col, 1, 1, true); txt(p, LX + 30, 549 + j * 64, { size: 27, fam: 'IT', w: 500, col: '#e2e8f0', max: 700 }); ctx.restore(); });
  ctx.save(); ctx.globalAlpha = 1 - seg(l, out, out + .4); pills(f.tech, LX, 760, 720, l, 2.4, col, 19); ctx.restore();
  const im = IMG[f.img]; const dk = seg(l, .2, 1.3) * (1 - seg(l, out - .1, 10)); if (!im) return;
  const maxW = f.img2 ? 640 : 760, maxH = 560; let w = maxW, h = w * im.height / im.width; if (h > maxH) { h = maxH; w = h * im.width / im.height; }
  const ry = (side ? -.3 : .3) * (1 - .45 * eo(seg(l, 0, 9))); const zoom = 1 + .06 * seg(l, 0, 10);
  persp(im, IX + (f.img2 ? (side ? -60 : 60) : 0), 540 + (1 - eo(dk)) * 90, w, h, ry, dk, true, col, zoom);
  if (f.img2) { const i2 = IMG[f.img2]; let w2 = 300, h2 = w2 * i2.height / i2.width; if (h2 > 420) { h2 = 420; w2 = h2 * i2.width / i2.height; } const k2 = seg(l, 1.4, 2.4) * (1 - seg(l, out - .1, 10)); persp(i2, IX + (side ? 330 : -330), 600 + (1 - eo(k2)) * 80, w2, h2, side ? -.45 : .45, k2, true, COL.wh); }
}, { tr: 'zoom', tint: 'vi' });

// 8 · RAPID FIRE
const RV = {
  agents: (x, y, w, h, t, k, c) => graphNet(x, y, w, h, t, k, ['ROUTER', 'MEMORY', 'TOOLS', 'GEMINI', 'SEARCH', 'FILES'], c, 'MCP'),
  graph: (x, y, w, h, t, k, c) => graphNet(x, y, w, h, t, k, ['DOCS', 'OCR', 'ENTITIES', 'RELATIONS', 'LLM', 'QUERY'], c, 'GRAPH'),
  term: (x, y, w, h, t, k, c) => { const L = ['$ autodevops "3 web servers behind a load balancer on AWS"', '> parsing intent ............ ok', '> generating terraform ...... main.tf', '> generating k8s manifests .. deploy.yaml', '> security scan ............. passed', '> git commit -m "infra: add web tier"']; L.forEach((s, i) => txt(typed(s, seg(k * 4, i * .5, i * .5 + .6)), x + 20, y + 60 + i * 52, { size: 22, fam: 'STM', w: 400, col: i == 0 ? COL.wh : c })); },
  pipe: (x, y, w, h, t, k, c) => pipeline(x - 40, y + 80, w + 80, 200, ['RESEARCH', 'PLAN', 'ARCHITECT', 'DEVELOP', 'MVP'], t, k, c),
  wave: (x, y, w, h, t, k, c) => { waveform(x, y + 60, w, 180, t, c, k); ['CHAT', 'SMS', 'EMAIL', 'VOICE'].forEach((s, i) => pill(s, x + i * 150, y + 300, c, seg(k, i * .15, i * .15 + .4))); },
  bars: (x, y, w, h, t, k, c) => bars(x, y + 30, w, h - 80, t, 9, c, k, 4),
  neural: (x, y, w, h, t, k, c) => neural(x, y + 10, w, h - 40, [4, 7, 7, 5, 7], t, k, c),
  line: (x, y, w, h, t, k, c) => lineChart(x, y + 30, w, h - 70, t, 3, c, k, '', .8),
};
scene('rapid', 32, (lt, t) => {
  const i = Math.min(7, Math.floor(lt / 4)), l = lt - i * 4, r = RAPID[i], col = COL[r.col], out = 3.55;
  txt(String(i + 1).padStart(2, '0') + ' / 08', 130, 300, { size: 22, fam: 'STM', w: 400, col, a: seg(l, 0, .3) * (1 - seg(l, out, 4)) });
  kin(r.t, 130, 470, l, { size: r.t.length > 20 ? 86 : 112, w: 900, st: .05, stag: .015, dur: .4, out, outDur: .3, sp: -2, grad: [COL.wh, col] });
  kin(r.s, 134, 545, l, { size: 32, fam: 'IT', w: 500, st: .35, style: 'fade', stag: .004, out, col: '#cbd5e1' });
  ctx.save(); ctx.globalAlpha = 1 - seg(l, out, 4); glass(1180, 300, 620, 470, seg(l, .1, .5), col); ctx.beginPath(); ctx.rect(1180, 300, 620, 470); ctx.clip(); RV[r.v](1220, 330, 540, 410, t, seg(l, .2, 2.2), col); ctx.restore();
  const sw = seg(l, 0, .35); if (sw > 0 && sw < 1) rect(0, 0, W, H, col, .12 * (1 - sw));
}, { tr: 'slide', tint: 'cy' });

// 9 · TOOLKIT
scene('toolkit', 12, (lt, t) => {
  wordSphere(W / 2, H / 2 + 30, 360, ME.sphere.concat(['Pandas', 'SQL', 'Hugging Face', 'Tiptap', 'OpenTelemetry', 'Twilio']), t * 1.4, seg(lt, 0, 2.5) * (1 - seg(lt, 11.2, 12)), 30);
  kin('THE TOOLKIT', W / 2, 190, lt, { size: 64, w: 900, align: 'center', st: .2, stag: .03, grad: true, sp: 8, out: 11.2 });
}, { tr: 'iris', tint: 'vi' });

// 10 · SITE + OUTRO
scene('outro', 20, (lt, t) => {
  if (lt < 7) {
    kin('EXPLORE THE FULL PORTFOLIO', W / 2, 190, lt, { size: 48, w: 800, align: 'center', st: .1, stag: .02, sp: 6, out: 6.5 });
    const k = seg(lt, .2, 1.3) * (1 - seg(lt, 6.4, 7)); const a = IMG.site_hero, b = IMG.site_projects; const mix = seg(lt, 3.2, 4);
    ctx.save(); ctx.globalAlpha = 1 - mix; persp(a, W / 2, 620, 1150, 719, -.18 + .12 * eo(seg(lt, 0, 7)), k, true, COL.cy); ctx.restore();
    ctx.save(); ctx.globalAlpha = mix; persp(b, W / 2, 620, 1150, 719, -.18 + .12 * eo(seg(lt, 0, 7)), k, true, COL.cy); ctx.restore();
    return;
  }
  const l = lt - 7; monogram(W / 2, 330, 260, t, seg(l, 0, 1.5) * (1 - seg(l, 11, 13)));
  txt(ME.initials, W / 2, 360, { size: 96, fam: 'In', w: 900, col: COL.wh, align: 'center', a: seg(l, .2, 1.2) * (1 - seg(l, 11, 13)), sp: 10 });
  kin("LET'S BUILD WHAT'S NEXT.", W / 2, 600, l, { size: 92, w: 900, align: 'center', st: .8, stag: .025, grad: true, sp: -2, out: 11.4 });
  kin(ME.first + ' ' + ME.last, W / 2, 680, l, { size: 34, fam: 'IT', w: 700, align: 'center', st: 1.8, style: 'fade', stag: .01, sp: 10, out: 11.5 });
  [ME.email, ME.github, ME.linkedin].forEach((s, i) => kin(s, W / 2, 770 + i * 50, l, { size: 28, fam: 'STM', w: 400, align: 'center', st: 2.6 + i * .3, style: 'fade', stag: .006, col: [COL.am, COL.cy2, COL.cy2][i], out: 11.6 }));
}, { tr: 'zoom', tint: 'cy' });

const TOTAL = TT;

// ---------- compositing & transitions ----------
const TR = .45;
function drawScene(s, t) { s.fn(t - s.t0, t); }
function render(t) {
  ctx = MAIN; MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1; MAIN.globalCompositeOperation = 'source-over';
  let i = SC.findIndex(s => t >= s.t0 && t < s.t0 + s.dur); if (i < 0) i = SC.length - 1;
  const cur = SC[i]; bg(t, cur.tint);
  const drift = (fn) => { const z = 1 + .015 * Math.sin(t * .13); MAIN.save(); MAIN.setTransform(z, 0, 0, z, W / 2 * (1 - z) + Math.sin(t * .21) * 8, H / 2 * (1 - z) + Math.cos(t * .17) * 5); fn(); MAIN.restore(); };
  // transition window around boundary b = start of SC[j]
  let j = -1; if (i + 1 < SC.length && t > SC[i + 1].t0 - TR) j = i + 1; else if (i > 0 && t < cur.t0 + TR) j = i;
  if (j < 0) { drift(() => drawScene(cur, t)); }
  else {
    const A = SC[j - 1], B = SC[j], k = cl((t - (B.t0 - TR)) / (2 * TR)), e = eio(k);
    const ax = offA.getContext('2d'), bxx = offB.getContext('2d');
    [ax, bxx].forEach(c2 => { c2.setTransform(1, 0, 0, 1, 0, 0); c2.globalAlpha = 1; c2.clearRect(0, 0, W, H); });
    withCtx(ax, () => drawScene(A, Math.min(t, B.t0 - 1e-3))); withCtx(bxx, () => drawScene(B, Math.max(t, B.t0)));
    const type = B.tr; MAIN.save();
    if (type == 'zoom') { let z = 1 + e * .35; MAIN.globalAlpha = 1 - e; MAIN.drawImage(offA, W / 2 - W * z / 2, H / 2 - H * z / 2, W * z, H * z); z = .8 + .2 * e; MAIN.globalAlpha = e; MAIN.drawImage(offB, W / 2 - W * z / 2, H / 2 - H * z / 2, W * z, H * z); }
    else if (type == 'slide') { const d = W * e; MAIN.globalAlpha = 1 - e * .6; MAIN.drawImage(offA, -d, 0); MAIN.globalAlpha = 1; MAIN.drawImage(offB, W - d, 0); for (let s = 0; s < 6; s++) { MAIN.globalAlpha = .08 * Math.sin(k * Math.PI); MAIN.drawImage(offB, W - d + (s + 1) * 40, 0); } }
    else if (type == 'iris') { MAIN.globalAlpha = 1 - e * .7; MAIN.drawImage(offA, 0, 0); MAIN.globalAlpha = 1; const R = e * 1200; MAIN.save(); MAIN.beginPath(); MAIN.arc(W / 2, H / 2, R, 0, TAU); MAIN.clip(); MAIN.drawImage(offB, 0, 0); MAIN.restore(); MAIN.strokeStyle = rgba(COL.cy, 1 - e); MAIN.lineWidth = 6; MAIN.beginPath(); MAIN.arc(W / 2, H / 2, R, 0, TAU); MAIN.stroke(); }
    else { /* light */ MAIN.globalAlpha = 1 - e; MAIN.drawImage(offA, 0, 0); MAIN.globalAlpha = e; MAIN.drawImage(offB, 0, 0); const x = lerp(-600, W + 600, k); const g = MAIN.createLinearGradient(x - 300, 0, x + 300, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(200,230,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); MAIN.globalAlpha = 1; MAIN.globalCompositeOperation = 'lighter'; MAIN.fillStyle = g; MAIN.fillRect(0, 0, W, H); }
    MAIN.restore();
  }
  ctx = MAIN;
  // bloom + vignette
  g1x.clearRect(0, 0, 480, 270); g1x.drawImage(cv, 0, 0, 480, 270); g2x.clearRect(0, 0, 240, 135); g2x.drawImage(g1, 0, 0, 240, 135);
  MAIN.save(); MAIN.globalCompositeOperation = 'lighter'; MAIN.globalAlpha = .22; MAIN.drawImage(g1, 0, 0, W, H); MAIN.globalAlpha = .26; MAIN.drawImage(g2, 0, 0, W, H); MAIN.restore();
  MAIN.drawImage(vig, 0, 0);
  if (t < .8) rect(0, 0, W, H, '#000', 1 - t / .8);
  if (t > TOTAL - 2.5) rect(0, 0, W, H, '#000', seg(t, TOTAL - 2.5, TOTAL));
}
window.render = render; window.TOTAL = TOTAL; window.SCENES = SC.map(s => [s.name, s.t0, s.dur]);
window.loadAll = async () => {
  const L = ['700 20px Orb', '900 20px Orb', '400 20px Orb', '600 20px Raj', '700 20px Raj', '400 20px STM', '900 20px "Inter Display"', '800 20px "Inter Display"', '700 20px "Inter Display"', '300 20px "Inter Display"', '200 20px "Inter Display"', '500 20px Inter', '600 20px Inter', '700 20px Inter'];
  await Promise.all(L.map(f => document.fonts.load(f, 'AZaz09')));
  const names = ['dragai', 'dragai_logo', 'mlflow_cm', 'sql_graph', 'chat_graph', 'codely_arch', 'codely_graph', 'wallet_scores', 'site_hero', 'site_projects', 'site_experience'];
  await Promise.all(names.map(n => new Promise(r => { const im = new Image(); im.onload = () => { IMG[n] = im; r(); }; im.onerror = r; im.src = 'img/' + n + '.png'; })));
  return Object.keys(IMG).length;
};
window.frameJPEG = (t, q = .92) => { render(t); return cv.toDataURL('image/jpeg', q); };
