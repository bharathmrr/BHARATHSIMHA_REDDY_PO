// Motion layer: cinematic intro, custom cursor, magnetic buttons, 3D tilt, text decoding, section sweeps,
// glitch transitions, velocity skew, floating parallax shapes, click sparks and a footer marquee.
(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TOUCH = matchMedia('(hover: none), (pointer: coarse)').matches;
    const G = window.gsap;
    const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEF0123456789';

    // ------------------------------------------------------------------ text decode / scramble
    function scramble(el, to, dur = .9) {
        if (!el || REDUCED) { if (el) el.textContent = to; return; }
        el.__scr && cancelAnimationFrame(el.__scr);
        const from = el.textContent, len = Math.max(from.length, to.length), t0 = performance.now();
        const q = Array.from({ length: len }, (_, i) => ({ a: from[i] || '', b: to[i] || '', s: Math.random() * .4, e: .35 + Math.random() * .55 }));
        el.__lock = true;
        (function tick(now) {
            const k = (now - t0) / (dur * 1000); let out = '';
            for (const c of q) { if (k >= c.e) out += c.b; else if (k >= c.s) out += c.b === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]; else out += c.a; }
            el.textContent = out;
            if (k < 1) el.__scr = requestAnimationFrame(tick); else { el.textContent = to; el.__lock = false; }
        })(t0);
    }
    window.__scramble = scramble;

    // ------------------------------------------------------------------ 1. cinematic intro
    function intro() {
        const root = document.documentElement;
        if (!root.classList.contains('has-intro')) return;
        const pre = document.createElement('div'); pre.id = 'preloader';
        pre.innerHTML = `<div class="pl-panels">${'<i></i>'.repeat(6)}</div>
            <div class="pl-core">
                <svg class="pl-ring" viewBox="0 0 160 160" aria-hidden="true"><defs><linearGradient id="plg" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#818cf8"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs><circle class="trk" cx="80" cy="80" r="72"/><circle class="arc" cx="80" cy="80" r="72"/></svg>
                <div class="pl-mark">BRP</div>
                <div class="pl-count mono"><span id="pl-n">000</span><small>%</small></div>
                <div class="pl-sub mono" id="pl-sub">INITIALISING</div>
            </div>
            <div class="pl-meta mono"><span>BHARATHSIMHA REDDY PUTTA</span><span>PORTFOLIO · 2026</span></div>`;
        document.body.appendChild(pre);
        if (window.__lenis) window.__lenis.stop();
        const n = $('#pl-n', pre), arc = $('.arc', pre), sub = $('#pl-sub', pre), C = 2 * Math.PI * 72;
        arc.style.strokeDasharray = C; arc.style.strokeDashoffset = C;
        const words = ['INITIALISING', 'LOADING AGENTS', 'WARMING VOICE AI', 'CONNECTING SYSTEMS', 'READY'];
        let loaded = document.readyState === 'complete'; addEventListener('load', () => loaded = true);
        const t0 = performance.now(), MIN = 1900; let wi = -1;
        (function tick(now) {
            const el = Math.max(0, now - t0), k = Math.min(1, el / MIN) * (loaded ? 1 : .92);
            const e = 1 - Math.pow(1 - k, 2.2), v = Math.round(e * 100);
            n.textContent = String(v).padStart(3, '0'); arc.style.strokeDashoffset = C * (1 - e);
            const w = Math.max(0, Math.min(words.length - 1, Math.floor(e * (words.length - .01)))); if (w !== wi) { wi = w; scramble(sub, words[w], .45); }
            if (v < 100 || !loaded) requestAnimationFrame(tick); else setTimeout(exit, 250);
        })(t0);
        function exit() {
            const done = () => { pre.remove(); root.classList.remove('has-intro'); if (window.__lenis) window.__lenis.start(); dispatchEvent(new Event('intro:done')); window.ScrollTrigger && ScrollTrigger.refresh(); };
            if (!G) return done();
            const tl = G.timeline({ onComplete: done });
            tl.to('.pl-core', { scale: 1.6, opacity: 0, filter: 'blur(10px)', duration: .55, ease: 'power3.in' })
              .to('.pl-meta', { opacity: 0, y: -20, duration: .3 }, 0)
              .to('.pl-panels i', { yPercent: -100, duration: .9, stagger: .06, ease: 'expo.inOut' }, .3)
              .from('.nav', { y: -60, opacity: 0, duration: .8, ease: 'power3.out' }, .9)
              .from('#sphere', { scale: .4, opacity: 0, duration: 1.4, ease: 'expo.out' }, .7);
            setTimeout(() => dispatchEvent(new Event('intro:reveal')), 750);
        }
    }
    intro();
    addEventListener('intro:reveal', () => document.documentElement.classList.remove('has-intro'));
    addEventListener('intro:reveal', () => dispatchEvent(new Event('intro:done')), { once: true });

    // ------------------------------------------------------------------ 2. custom cursor + magnetic
    if (!TOUCH && !REDUCED) {
        const dot = document.createElement('div'), ring = document.createElement('div');
        dot.className = 'cur-dot'; ring.className = 'cur-ring'; ring.innerHTML = '<span></span>';
        document.body.append(dot, ring); document.documentElement.classList.add('has-cursor');
        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
        addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
        (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
        const label = $('span', ring);
        const LABELS = [['#sphere', 'DRAG'], ['.device', 'VIEW'], ['.mcard', 'OPEN'], ['.reel', 'PLAY'], ['.exp-list li', 'SELECT'], ['.srow', 'PAUSE']];
        addEventListener('pointerover', e => {
            const t = e.target; let lab = '';
            for (const [sel, l] of LABELS) if (t.closest(sel)) { lab = l; break; }
            ring.classList.toggle('label', !!lab); label.textContent = lab;
            ring.classList.toggle('hover', !lab && !!t.closest('a, button, .step, .chip, .schip'));
        });
        addEventListener('pointerdown', () => ring.classList.add('down')); addEventListener('pointerup', () => ring.classList.remove('down'));
        document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = 0; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = ''; });

        // magnetic elements
        $$('.hbtn, .nav-cv, .cbtn, .brand, .step, .snd, .nav-links a').forEach(el => {
            el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left - r.width / 2) * .32, y = (e.clientY - r.top - r.height / 2) * .38; el.style.transform = `translate(${x}px,${y}px)`; });
            el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        });

        // 3D tilt + glare on cards
        const tilt = (el, max = 9) => {
            el.classList.add('tilt');
            el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%'); el.style.setProperty('--rx', ((.5 - py) * max) + 'deg'); el.style.setProperty('--ry', ((px - .5) * max) + 'deg'); el.classList.add('tilting'); });
            el.addEventListener('pointerleave', () => { el.classList.remove('tilting'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
        };
        $$('.ecard, .exp-card').forEach(el => tilt(el, 7));
        $$('.icard').forEach(el => { const inner = el; inner.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%'); el.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%'); }); el.classList.add('glare'); });
        const glareLater = () => $$('.mcard').forEach(el => { if (el.__g) return; el.__g = 1; el.classList.add('glare'); el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%'); el.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%'); }); });
        glareLater(); setTimeout(glareLater, 1500);

        // click sparks
        const COLS = ['#22d3ee', '#818cf8', '#f472b6', '#fbbf24'];
        addEventListener('pointerdown', e => {
            for (let i = 0; i < 12; i++) {
                const s = document.createElement('i'); s.className = 'spark'; const a = i / 12 * Math.PI * 2 + Math.random() * .4, d = 40 + Math.random() * 50;
                s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${COLS[i % 4]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
                document.body.appendChild(s); setTimeout(() => s.remove(), 750);
            }
        });

        // hero pointer parallax
        if (G) {
            const hx = G.quickTo('.hero-inner', 'x', { duration: 1, ease: 'power3' }), hy = G.quickTo('.hero-inner', 'y', { duration: 1, ease: 'power3' });
            const sx = G.quickTo('#sphere', 'x', { duration: 1.4, ease: 'power3' }), sy = G.quickTo('#sphere', 'y', { duration: 1.4, ease: 'power3' });
            $('#hero').addEventListener('pointermove', e => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5; hx(nx * 26); hy(ny * 18); sx(nx * -50); sy(ny * -36); });
        }
    }

    // ------------------------------------------------------------------ 3. floating parallax shapes
    if (!REDUCED) {
        const layer = document.createElement('div'); layer.className = 'floaters'; layer.setAttribute('aria-hidden', 'true');
        const SHAPES = [
            '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="url(#fg)" stroke-width="2"/></svg>',
            '<svg viewBox="0 0 100 100"><polygon points="50,6 94,86 6,86" fill="none" stroke="url(#fg)" stroke-width="2"/></svg>',
            '<svg viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="10" fill="none" stroke="url(#fg)" stroke-width="2"/></svg>',
            '<svg viewBox="0 0 100 100"><path d="M50 10v80M10 50h80" stroke="url(#fg)" stroke-width="3" stroke-linecap="round"/></svg>',
            '<svg viewBox="0 0 100 100"><polygon points="50,4 92,28 92,72 50,96 8,72 8,28" fill="none" stroke="url(#fg)" stroke-width="2"/></svg>',
        ];
        const defs = '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="fg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#818cf8"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs></svg>';
        const items = Array.from({ length: TOUCH ? 6 : 12 }, (_, i) => ({ x: (i * 37 % 100), y: (i * 61 % 100), s: 26 + (i * 13 % 46), d: .15 + (i % 5) * .12, r: i * 47 % 360, sp: (i % 2 ? 1 : -1) * (6 + i % 4 * 4) }));
        layer.innerHTML = defs + items.map((f, i) => `<i style="left:${f.x}vw;width:${f.s}px;height:${f.s}px;opacity:${.12 + f.d * .35}">${SHAPES[i % SHAPES.length]}</i>`).join('');
        document.body.appendChild(layer);
        const els = $$('i', layer); let last = 0;
        (function loop(now) {
            const y = scrollY, t = now / 1000, H = innerHeight + 200;
            if (now - last > 30) { last = now; els.forEach((el, i) => { const f = items[i]; const py = (((f.y / 100) * H - y * f.d) % H + H) % H - 100; el.style.transform = `translate3d(0,${py}px,0) rotate(${f.r + t * f.sp}deg)`; }); }
            requestAnimationFrame(loop);
        })(0);
    }

    if (REDUCED || !G || !window.ScrollTrigger) return;
    G.registerPlugin(ScrollTrigger);

    // ------------------------------------------------------------------ 4. headings wipe in, eyebrows decode
    G.utils.toArray('.h2, .h1, .contact-lead').forEach(h => {
        G.fromTo(h, { clipPath: 'inset(0% 0% 100% 0%)', y: 70, skewY: 5 }, { clipPath: 'inset(0% 0% -20% 0%)', y: 0, skewY: 0, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 55%', scrub: 1 } });
    });
    $$('.eyebrow').forEach(el => {
        const txt = el.textContent.trim(); if (!txt) return;
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el, txt, 1.1) });
    });
    $$('.band-caption, .hint, .man-foot span').forEach(el => { const txt = el.textContent; ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => { if (!el.children.length) scramble(el, txt, 1.2); } }); });

    // ------------------------------------------------------------------ 5. section sweeps + decoding section index
    const sweep = document.createElement('div'); sweep.className = 'sweep'; document.body.appendChild(sweep);
    const idx = $('#nav-index'); let lastLabel = idx ? idx.textContent : '';
    if (idx) new MutationObserver(() => {
        if (idx.__lock) return; const now = idx.textContent; if (now === lastLabel) return;
        lastLabel = now; scramble(idx, now, .7);
        if (scrollY > innerHeight * .5) { G.killTweensOf(sweep); G.fromTo(sweep, { xPercent: -110, opacity: 1 }, { xPercent: 110, duration: 1.1, ease: 'power3.inOut', onComplete: () => G.set(sweep, { opacity: 0 }) }); }
    }).observe(idx, { childList: true, characterData: true, subtree: true });

    // ------------------------------------------------------------------ 6. velocity skew on content blocks
    const skewTargets = $$('.impact-grid, .edu-grid, .stack-rows, .more-head, .exp-head, .contact-btns, .band-caption');
    let skew = 0;
    ScrollTrigger.create({ onUpdate: s => { const v = G.utils.clamp(-7, 7, s.getVelocity() / -260); if (Math.abs(v) > Math.abs(skew)) skew = v; } });
    G.ticker.add(() => { skew *= .9; const v = Math.abs(skew) < .02 ? 0 : skew; skewTargets.forEach(el => el.style.transform = v ? `skewY(${v.toFixed(2)}deg)` : ''); });

    // ------------------------------------------------------------------ 7. glitch on project step change, wipe on role change
    $$('.proj').forEach(sec => {
        const screen = $('.screen', sec); let prev = -1;
        new MutationObserver(() => { const on = $$('.step', sec).findIndex(b => b.classList.contains('on')); if (on === prev) return; if (prev !== -1) { screen.classList.remove('glitch'); void screen.offsetWidth; screen.classList.add('glitch'); setTimeout(() => screen.classList.remove('glitch'), 520); } prev = on; })
            .observe($('.steps', sec), { attributes: true, subtree: true, attributeFilter: ['class'] });
        G.fromTo($('.ptitle', sec), { letterSpacing: '0.12em', opacity: .2 }, { letterSpacing: '-0.03em', opacity: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top top', scrub: true } });
    });
    const card = $('#exp-card');
    if (card) new MutationObserver(() => { const h = $('h3', card); if (h && !h.__done) { h.__done = 1; const t = h.textContent; scramble(h, t, .8); } }).observe(card, { childList: true });

    // ------------------------------------------------------------------ 8. footer marquee
    const foot = $('.footer');
    if (foot) {
        const big = document.createElement('div'); big.className = 'foot-marquee'; big.setAttribute('aria-hidden', 'true');
        big.innerHTML = `<div class="fm-track">${'<span>BHARATHSIMHA REDDY PUTTA ✦ </span>'.repeat(6)}</div>`;
        foot.before(big);
        const tw = G.to($('.fm-track', big), { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
        ScrollTrigger.create({ trigger: big, start: 'top bottom', end: 'bottom top', onUpdate: s => tw.timeScale(1 + Math.min(8, Math.abs(s.getVelocity()) / 250)) });
        G.fromTo(big, { opacity: 0, y: 80 }, { opacity: 1, y: 0, ease: 'power3.out', scrollTrigger: { trigger: big, start: 'top bottom', end: 'top 70%', scrub: true } });
    }

    // ------------------------------------------------------------------ 9. stats & chips pop
    G.utils.toArray('.chips .chip, .pills span').forEach(c => G.from(c, { scale: .6, opacity: 0, duration: .5, ease: 'back.out(2)', scrollTrigger: { trigger: c, start: 'top 95%', once: true } }));
    G.utils.toArray('.ecard').forEach((c, i) => G.from(c, { y: 120, rotateX: -35, opacity: 0, transformPerspective: 1000, duration: 1.1, ease: 'expo.out', delay: i * .08, clearProps: 'transform', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
    G.from('.contact-btns .cbtn', { y: 50, opacity: 0, stagger: .08, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.contact-btns', start: 'top 92%', once: true } });
})();
