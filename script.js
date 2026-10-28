// Portfolio interactions: aurora background, dot sphere, kinetic text, sticky experience & project showcases,
// live visuals (shared with the motion film via assets/js/viz.js), marquees and counters.
(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = y => (window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' }));
    const C = { cy: '#22d3ee', in: '#818cf8', pk: '#f472b6', vi: '#a78bfa', am: '#fbbf24', gr: '#34d399', rd: '#fb7185' };

    // ------------------------------------------------------------------ data
    const EXP = [
        { d: 'JUN 2026 — PRESENT', r: 'Automation, AI & ML Engineer', o: 'Jane', loc: 'Bengaluru · On-site', c: C.cy, ghost: 'JANE',
          pts: ['AI-powered automation for supply chain, customer & vendor onboarding and sales', 'Real-time, full-duplex voice AI with streaming speech-to-text and text-to-speech', 'AI agents that understand business context and execute tasks across systems', 'FastAPI, Celery, Docker and event-driven automation pipelines', 'Zoho CRM, Books & WorkDrive, email and telephony integrations; KYC & document automation'] },
        { d: 'NOV 2025 — MAY 2026', r: 'Generative AI Engineer', o: 'Aiqwip', loc: 'Bengaluru · Full-time', c: C.vi, ghost: 'AIQWIP',
          pts: ['Multimodal AI systems, agentic workflows and automation platforms', 'Autonomous agents with LangGraph, LangChain, MCP and local LLMs (Ollama, llama.cpp)', 'GhostAgent — live conversation intelligence synced to 20+ CRMs', 'Real-time AI medical avatar for candidate training'] },
        { d: 'APR 2024 — OCT 2025', r: 'AI / ML Engineer', o: 'Freelance', loc: 'Remote', c: C.pk, ghost: 'FREELANCE',
          pts: ['Real-world projects across machine learning, deep learning and generative AI', 'Trained, evaluated and deployed models, data pipelines and APIs', 'Built DragAI, AI Data Agent, Graph RAG and AutoDevOps'] },
        { d: 'APR 2025 — MAY 2025', r: 'Data Scientist · Intern', o: 'EISystems Technologies', loc: 'Remote', c: C.gr, ghost: 'EISYSTEMS',
          pts: ['Data collection, cleaning and analysis', 'Predictive models with Python, SQL and ML frameworks'] },
        { d: 'NOV 2023 — DEC 2023', r: 'Web Developer · Intern', o: 'VaultofCodes', loc: 'Remote', c: C.am, ghost: 'VAULT',
          pts: ['Responsive React front-ends with Node.js and Python back-ends', 'Integrated AI features: chatbots and smart recommendations'] },
    ];
    const PROJ = [
        { t: ['AI Supplier', 'Intelligence'], org: 'JANE · OCT 2026', role: 'Team build at Jane · Automation, AI & ML Engineer', c: C.cy, d: 'From a parts request to verified suppliers in minutes. AI extracts part numbers and certifications, searches directories, the web and stock lists, reads supplier sites and PDFs — and scores every lead with evidence.',
          stats: [['Minutes', 'from request to verified suppliers'], ['Evidence', 'linked on every lead'], ['2FA', 'per-company workspaces + audit trail']],
          tech: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'Celery', 'Redis', 'Docker', 'Claude AI'], url: 'ai-supplier-intelligence',
          steps: [['img', 'assets/img/sup1.jpg', 'Request → scored suppliers'], ['img', 'assets/img/sup2.jpg', 'Sourcing dashboard'], ['v', 'globe', 'Live sourcing map']] },
        { t: ['AI Sales Call', 'Engine'], org: 'JANE · AUG 2026', role: 'Team build at Jane · Automation, AI & ML Engineer', c: C.vi, d: 'Click “Call” from the lead sheet. Deepgram transcribes live, AI detects intent and objections, auto-sends onboarding, KYC and NDA links, updates the lead and grades the call.',
          stats: [['1-click', 'call from the lead sheet'], ['Live', 'transcription & intent'], ['Auto', 'emails, KYC & NDA links']],
          tech: ['Python', 'VoIP', 'Deepgram', 'LLMs', 'Zoho CRM'], url: 'ai-sales-call-engine',
          steps: [['img', 'assets/img/sal1.jpg', 'Click-to-call with live AI'], ['img', 'assets/img/sal2.jpg', 'AI grading & coaching'], ['v', 'call', 'Live conversation intelligence']] },
        { t: ['Drag', 'AI'], org: 'OPEN SOURCE · OCT 2025 — FEB 2026', role: 'Personal open-source project · designed & built end to end', c: C.am, d: 'A drag-and-drop canvas to design and deploy multi-agent AI systems — LLMs, RAG, ML/DL and data pipelines in one visual builder with live execution and debugging.',
          stats: [['77+', 'pre-built nodes'], ['4', 'LLM providers'], ['3', 'vector databases']],
          tech: ['React', 'React Flow', 'Tailwind', 'Node.js', 'Python', 'LangChain', 'MongoDB', 'Neo4j'], gh: 'https://github.com/bharathmrr/Agentic-AI-Workflow-DragAI-Edition-',
          steps: [['img', 'assets/img/drag1.jpg', 'Visual workflow builder'], ['img', 'motion-film/img/dragai.png', 'The DragAI identity', 'contain'], ['v', 'agents', 'Multi-agent reasoning']] },
        { t: ['Codely', 'Voice AI'], org: 'OPEN SOURCE · PYTHON', role: 'Personal open-source project · designed & built end to end', c: C.pk, d: '“Code that listens.” A local AI voice assistant: speak naturally and LangGraph agents route your intent to actions — YouTube, Google, WhatsApp and more.',
          stats: [['Local', 'runs on your device'], ['LangGraph', 'intent routing'], ['4+', 'actions out of the box']],
          tech: ['Python', 'LangChain', 'LangGraph', 'Speech-to-Text', 'LLMs'], gh: 'https://github.com/bharathmrr/codely-AI-Voice-assistent-and-control-voice-to-system',
          steps: [['img', 'assets/img/cod1.jpg', 'Speak → route → act'], ['img', 'motion-film/img/codely_arch.png', 'Architecture (from the repo)', 'contain diag'], ['img', 'motion-film/img/codely_graph.png', 'LangGraph routing (from the repo)', 'contain diag']] },
        { t: ['AI Hiring', 'Platform'], org: 'JANE · JUL 2026', role: 'Team build at Jane · Automation, AI & ML Engineer', c: C.gr, d: 'Autonomous recruitment: Zoho Recruit integration, AI resume parsing and scoring, a live duplex AI video interviewer with a digital avatar, and auto-scheduling with Managing Directors.',
          stats: [['20 min', 'live AI video interview'], ['Zoho', 'Recruit integration'], ['Auto', 'summaries & scheduling']],
          tech: ['Python', 'FastAPI', 'Zoho Recruit', 'Deepgram', 'Digital Avatar', 'LLMs'],
          steps: [['img', 'assets/img/hir1.jpg', 'Candidate pipeline'], ['talk', null, 'Live AI interviewer · speaking'], ['v', 'funnel', 'Scoring funnel']] },
    ];
    const MORE = [
        ['WORKFLOW · JANE', 'Supply Chain SaaS', 'AI order analysis, supplier match, RFQs, quotes, POs and live shipment tracking.', 'Zoho CRM · Books · Mail', null, C.gr, null, 'mesh'],
        ['ONBOARDING · JANE', 'Customer Onboarding AI', 'Lead → AI interview → KYC → NDA → negotiation → e-signature → CRM.', '9 connected stages', null, C.am, null, 'contract'],
        ['DOCUMENT AI · JANE', 'Vendor Onboarding AI', 'OCR and document AI verify vendors; humans approve exceptions.', '12 workflow stages', null, C.cy, null, 'scan'],
        ['VOICE AI · AIQWIP', 'AI Medical Avatar', 'A real-time talking avatar for medical candidate training.', 'STT → LLM → TTS', null, C.gr, null, 'avatar'],
        ['CONVERSATION AI · AIQWIP', 'GhostAgent · DataRipple', 'Live sales-call intelligence with MCP tools and compliance checks.', '20+ CRMs', null, C.vi, null, 'hub'],
        ['MULTI-AGENT', 'AI-MCP Orchestrator', 'ChatGPT-style system with LangGraph routing and Gemini 2.0 Flash.', '17+ MCP tools', 'Drag.ai-mcp-chatbbot', C.cy, null, 'agents'],
        ['TEXT-TO-SQL', 'LangGraph SQL Assistant', 'Check → rewrite → execute → answer, on a local Ollama LLM.', 'Self-correcting', 'langgraph_with-sql_agents', C.vi, 'motion-film/img/sql_graph.png'],
        ['MLOPS', 'MLflow Insurance Prediction', 'Experiment tracking, model artifacts and deployment to AWS S3.', 'MLflow · S3', 'Mlflow-project-insurence-prediction', C.gr, 'motion-film/img/mlflow_cm.png'],
        ['DEFI · RISK', 'Wallet Risk Scoring', 'Borrow, repay and health-factor data turned into a 0–1000 risk score.', 'From scratch', 'Wallet-Risk-Scoring-From-Scratch', C.pk, 'motion-film/img/wallet_scores.png'],
        ['KNOWLEDGE GRAPHS', 'Agentic Graph RAG', 'Documents → OCR → knowledge graph, with multi-LLM querying.', 'As a service', 'agentic-graph-rag-as-a-service', C.vi, null, 'graph'],
        ['DEVOPS', 'AutoDevOps', 'Plain English to Terraform, Kubernetes and Ansible, with security scans.', 'NL → IaC', 'AutoDevOps-LLM-Powered-Infrastructure-Orchestration', C.gr, null, 'pipeA'],
        ['AGENTS', 'BuildPilot', 'Idea to deployable MVP with LangGraph agents and FastMCP.', '4 agents', 'BuildPilot-Agentic-MVP-Generator-with-MCP', C.am, null, 'pipeB'],
        ['FINTECH', 'AI Debt Recovery Agent', 'Chat, SMS, email and voice with compliance guardrails and RAG.', 'Multi-channel', 'Debt-recovery-agent', C.rd, null, 'wave'],
        ['ANALYTICS', 'AI Data Agent', 'Ask any Excel file a question; answers come back as charts.', 'Ollama + Gemma 2', 'AI-Data-Agent', C.cy, null, 'charts'],
        ['COMPUTER VISION', 'Real-Time Emotion Detection', 'MediaPipe Face Mesh and a CNN on live camera.', 'Live webcam', 'emotion_detection_live_camera', C.pk, null, 'neural'],
        ['PRODUCTIVITY', 'FlowMind', 'AI LifeOS — tasks, calendars and meetings in natural language.', 'Grok LLM', 'FlowMind', C.in, null, 'line'],
    ];
    const STACK = [
        [['AI & Agents', C.cy], 'LangGraph', 'LangChain', 'Model Context Protocol', 'FastMCP', 'RAG', 'Claude API', 'Gemini', 'OpenAI', 'Ollama', 'llama.cpp', 'Hugging Face', 'Prompt engineering'],
        [['ML & Vision', C.vi], 'PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'MediaPipe', 'CNN + LSTM', 'MLflow', 'DVC', 'Pandas', 'NumPy', 'OCR', 'PyMuPDF'],
        [['Backend & Data', C.pk], 'Python', 'FastAPI', 'Flask', 'Django', 'Celery', 'Redis', 'PostgreSQL', 'MongoDB', 'Neo4j', 'SQLite', 'SQLAlchemy', 'WebSockets'],
        [['Voice & Real-time', C.am], 'Deepgram', 'Whisper', 'WebRTC', 'VoIP', 'Twilio', 'Vonage', 'RingCentral', 'STT / TTS', 'AI avatars', 'Full-duplex voice'],
        [['Cloud & Web', C.gr], 'Docker', 'Kubernetes', 'AWS', 'OpenTelemetry', 'GitHub Actions', 'React', 'Next.js', 'TypeScript', 'Tailwind', 'Zoho CRM', 'Zoho Books', 'Salesforce'],
    ];
    const FOCUS = ['Generative AI', 'Agentic AI', 'Voice AI', 'Enterprise automation', 'Multi-agent systems', 'RAG', 'Computer vision', 'MLOps', 'Human-in-the-loop', 'Document AI', 'CRM integrations'];

    // ------------------------------------------------------------------ background: aurora + stars
    const bg = $('#bg'), bx = bg.getContext('2d'); let BW, BH;
    const stars = Array.from({ length: 160 }, (_, i) => [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random()]);
    function sizeBg() { BW = bg.width = innerWidth * DPR * .6; BH = bg.height = innerHeight * DPR * .6; }
    function drawBg(t) {
        bx.fillStyle = '#04050b'; bx.fillRect(0, 0, BW, BH);
        const sp = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
        [[.22 + .07 * Math.sin(t * .07), .3 + .1 * Math.cos(t * .05) - sp * .1, C.cy, .15], [.8 + .05 * Math.cos(t * .06), .65 + .08 * Math.sin(t * .08), C.vi, .13], [.5 + .25 * Math.sin(t * .04 + sp * 3), .98, C.pk, .08]].forEach(([x, y, c, a]) => {
            const g = bx.createRadialGradient(x * BW, y * BH, 0, x * BW, y * BH, BW * .5); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); bx.fillStyle = g; bx.fillRect(0, 0, BW, BH);
        });
        bx.fillStyle = '#fff';
        stars.forEach(([x, y, z], i) => { const d = (z + t * .012) % 1, f = .3 + d * 1.6, px = BW / 2 + x * BW * .55 * f, py = BH / 2 + y * BH * .55 * f; if (px < 0 || px > BW || py < 0 || py > BH) return; bx.globalAlpha = .1 + .5 * d * (.6 + .4 * Math.sin(t * 2 + i)); const s = (.6 + d * 1.6) * DPR * .6; bx.fillRect(px, py, s, s); });
        bx.globalAlpha = 1;
    }

    // ------------------------------------------------------------------ dot sphere
    function makeSphere(cv, { drag = false, n = 1100, speed = .12 } = {}) {
        const c2 = cv.getContext('2d'); let S, rx = -.3, ry = 0, vy = speed * .01, vx = 0, dragging = false, lx = 0, ly = 0;
        const pts = Array.from({ length: n }, (_, i) => { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; return [Math.cos(th) * r, y, Math.sin(th) * r]; });
        const size = () => { S = cv.width = cv.height = Math.round(cv.getBoundingClientRect().width * DPR); };
        if (drag) {
            const down = e => { dragging = true; const p = e.touches ? e.touches[0] : e; lx = p.clientX; ly = p.clientY; };
            const move = e => { if (!dragging) return; const p = e.touches ? e.touches[0] : e; vy = (p.clientX - lx) * .0035; vx = (p.clientY - ly) * .0035; lx = p.clientX; ly = p.clientY; };
            cv.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', () => dragging = false);
        }
        size(); addEventListener('resize', size);
        return t => {
            if (!S) return; ry += vy; rx += vx; if (!dragging) { vy += (speed * .01 - vy) * .02; vx *= .94; rx += (-.3 - rx) * .01; }
            c2.clearRect(0, 0, S, S); const R = S * .34, cx = S / 2, cy = S / 2;
            const cyx = Math.cos(ry), syx = Math.sin(ry), cxx = Math.cos(rx), sxx = Math.sin(rx);
            for (const [x, y, z] of pts) {
                const x1 = x * cyx - z * syx, z1 = x * syx + z * cyx, y2 = y * cxx - z1 * sxx, z2 = y * sxx + z1 * cxx;
                const f = (z2 + 1.6) / 2.6, u = (x1 + 1) / 2;
                c2.fillStyle = u < .5 ? mix(C.cy, C.in, u * 2) : mix(C.in, C.pk, (u - .5) * 2);
                c2.globalAlpha = .12 + .8 * Math.pow((z2 + 1) / 2, 1.6); const s = (1 + 1.6 * f) * DPR;
                c2.fillRect(cx + x1 * R - s / 2, cy + y2 * R - s / 2, s, s);
            }
            c2.globalAlpha = 1;
            [[1.28, .3, .25, C.cy], [1.42, .36, -.18, C.vi], [1.6, .42, .12, C.pk]].forEach(([k, e, sp, col], i) => {
                c2.save(); c2.translate(cx, cy); c2.rotate(t * sp + i); c2.strokeStyle = rgba(col, .35); c2.lineWidth = 1.2 * DPR; c2.beginPath(); c2.ellipse(0, 0, R * k, R * k * e, 0, 0, Math.PI * 2); c2.stroke();
                const a = t * (.6 + i * .2); c2.fillStyle = col; c2.globalAlpha = .9; c2.beginPath(); c2.arc(Math.cos(a) * R * k, Math.sin(a) * R * k * e, 3.2 * DPR, 0, Math.PI * 2); c2.fill(); c2.restore();
            });
        };
    }
    const hexRGB = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
    const mix = (a, b, k) => { const A = hexRGB(a), B = hexRGB(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };

    // ------------------------------------------------------------------ split text
    function splitText() {
        $$('[data-split]').forEach(el => {
            const words = el.textContent.trim().split(/\s+/); el.textContent = ''; let i = 0;
            words.forEach((w, wi) => { const ws = document.createElement('span'); ws.className = 'w'; [...w].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; c.style.setProperty('--i', i++); ws.appendChild(c); }); el.appendChild(ws); if (wi < words.length - 1) el.appendChild(document.createTextNode(' ')); });
        });
    }
    function gradSplits() {
        $$('.split.grad').forEach(el => {
            const r = el.getBoundingClientRect(), cs = $$('.c', el); if (!cs.length) return;
            const left = Math.min(...cs.map(c => c.getBoundingClientRect().left)), right = Math.max(...cs.map(c => c.getBoundingClientRect().right)); const gw = Math.max(1, right - left);
            cs.forEach(c => { c.style.setProperty('--gw', gw + 'px'); c.style.setProperty('--gx', -(c.getBoundingClientRect().left - left) + 'px'); });
        });
    }

    // ------------------------------------------------------------------ build: experience
    const expSec = $('#exp'), expList = $('#exp-list'), expCard = $('#exp-card');
    const fill = document.createElement('span'); fill.className = 'fill'; expList.appendChild(fill);
    EXP.forEach((e, i) => { const li = document.createElement('li'); li.style.setProperty('--c', e.c); li.innerHTML = `<div class="d mono">${e.d}</div><div class="r">${e.r}</div><div class="o">${e.o}</div>`; li.onclick = () => gotoExp(i); expList.appendChild(li); });
    let expIdx = -1;
    function showExp(i) {
        if (i === expIdx) return; expIdx = i; const e = EXP[i];
        $$('li', expList).forEach((li, j) => li.classList.toggle('on', j === i));
        const lis = $$('li', expList); fill.style.height = (lis[i].offsetTop + 16 - 14) + 'px';
        expCard.style.setProperty('--c', e.c); expCard.dataset.ghost = e.ghost;
        expCard.innerHTML = `<div class="anim"><div class="meta mono">${e.d} &nbsp;·&nbsp; ${e.loc.toUpperCase()}</div><h3>${e.o}</h3><div class="role">${e.r}</div><ul>${e.pts.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
    }
    const mobile = () => innerWidth <= 900;
    function sizeExp() { expSec.style.height = mobile() ? 'auto' : (100 + EXP.length * 55) + 'vh'; }
    function gotoExp(i) { if (mobile()) return showExp(i); const top = expSec.offsetTop + (i + .5) / EXP.length * (expSec.offsetHeight - innerHeight); go(top); }

    // ------------------------------------------------------------------ build: bands
    $$('[data-band]').forEach(el => { const w = el.dataset.band; el.innerHTML = Array(8).fill(`<span>${w} ·</span>`).join(''); });

    // ------------------------------------------------------------------ build: project showcases
    const projWrap = $('#projects'); const projState = [];
    PROJ.forEach((p, pi) => {
        const sec = document.createElement('section'); sec.className = 'proj'; sec.id = 'p' + (pi + 1); sec.dataset.label = '03 — PROJECTS'; sec.style.setProperty('--c', p.c);
        const link = p.gh ? `<a class="plink" href="${p.gh}" target="_blank" rel="noopener">↗ github.com/bharathmrr/${p.gh.split('/').pop().slice(0, 34)}</a>` : `<span class="plink" style="color:var(--sub)">◆ Enterprise platform · private</span>`;
        sec.innerHTML = `<div class="proj-sticky"><div class="proj-grid">
            <div class="ptext"><div class="pghost">${String(pi + 1).padStart(2, '0')}</div>
                <div class="peyebrow mono">PROJECT ${String(pi + 1).padStart(2, '0')} / ${String(PROJ.length).padStart(2, '0')}</div>
                <h3 class="ptitle">${p.t[0]}<br><em>${p.t[1]}</em></h3>
                <div class="porg mono">${p.org}</div>${p.role ? `<div class="prole">${p.role}</div>` : ''}
                <p class="pdesc">${p.d}</p>
                <div class="pstats">${p.stats.map(s => `<div class="pstat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
                <div class="chips">${p.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>${link}</div>
            <div class="pvis"><div class="device"><div class="dev-bar"><i></i><i></i><i></i><span class="mono">${p.t.join(' ')} — live</span>${p.steps.some(s => s[0] === 'talk') ? '<button class="snd mono" type="button">🔊 SOUND ON</button>' : ''}</div>
                <div class="screen"><canvas width="820" height="560"></canvas>${p.steps.map((s, si) => s[0] === 'img' ? `<div class="simg ${s[3] || ''}" data-s="${si}"><img src="${s[1]}" alt="${s[2]}" loading="lazy"></div>` : '').join('')}<div class="caption"></div><span class="concept mono">CONCEPT UI · ILLUSTRATIVE DATA</span></div></div>
                <div class="steps">${p.steps.map((s, si) => `<button class="step" data-s="${si}">0${si + 1}<span class="lbl">${s[2].toUpperCase()}</span></button>`).join('')}</div></div>
        </div></div>`;
        projWrap.appendChild(sec);
        const st = { sec, p, cv: $('canvas', sec), cap: $('.caption', sec), step: -1, since: 0, visible: false };
        $$('.step', sec).forEach(b => b.onclick = () => { const i = +b.dataset.s; if (mobile()) return setStep(st, i); go(sec.offsetTop + (i + .5) / p.steps.length * (sec.offsetHeight - innerHeight)); });
        projState.push(st);
        const snd = $('.snd', sec); if (snd) snd.onclick = () => { talk.sound = !talk.sound; snd.textContent = talk.sound ? '🔊 SOUND ON' : '🔇 SOUND OFF'; snd.classList.toggle('off', !talk.sound); if (talk.on) { talk.blocked = false; sayLine(); } };
    });
    function setStep(st, i) {
        if (st.step === i) return; st.step = i; st.since = performance.now() / 1000; const s = st.p.steps[i];
        $$('.step', st.sec).forEach((b, j) => b.classList.toggle('on', j === i));
        $$('.simg', st.sec).forEach(el => el.classList.toggle('on', +el.dataset.s === i));
        st.cv.classList.toggle('on', s[0] !== 'img');
        if (s[0] === 'talk') startTalk(st); else if (talk.st === st) stopTalk();
        st.cap.textContent = `${i + 1} · ${s[2]}`; st.sec.querySelector('.concept').classList.toggle('on', s[0] === 'img' && s[1].startsWith('assets/img/')); st.cap.style.opacity = s[0] === 'talk' ? 0 : '';
    }
    // ------------------------------------------------------------------ talking AI interviewer (round face + real speech)
    const TALK_LINES = [
        "Hi, I'm the AI interviewer. Thanks for joining today.",
        "Walk me through how you would make a RAG pipeline reliable in production.",
        "Nice. How would you keep a real-time voice agent's latency low?",
        "Great answers. I'll share your summary and schedule the next round."
    ];
    const talk = { st: null, on: false, line: 0, text: '', start: 0, char: 0, pulse: 0, speaking: false, blocked: false, sound: true, sim: true, timer: 0 };
    const synth = window.speechSynthesis; let voice = null;
    const pickVoice = () => { if (!synth) return; const vs = synth.getVoices(); voice = vs.find(v => /en-IN/i.test(v.lang)) || vs.find(v => /Google UK English Female|Samantha|Google US English|Microsoft (Aria|Jenny)/i.test(v.name)) || vs.find(v => /^en/i.test(v.lang)) || null; };
    if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
    const nowS = () => performance.now() / 1000;
    function nextLine() { clearTimeout(talk.timer); talk.timer = setTimeout(() => { if (!talk.on) return; talk.line++; sayLine(); }, 1400); }
    function simRun() { clearTimeout(talk.timer); talk.sim = true; const left = talk.text.length / 15 - (nowS() - talk.start); talk.timer = setTimeout(nextLine, Math.max(0, left * 1000)); }
    function sayLine() {
        if (!talk.on) return; clearTimeout(talk.timer);
        const text = TALK_LINES[talk.line % TALK_LINES.length];
        talk.text = text; talk.start = nowS(); talk.char = 0; talk.speaking = false; talk.sim = true;
        if (!synth || !talk.sound || talk.blocked) return simRun();
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text); if (voice) { u.voice = voice; u.lang = voice.lang; } u.rate = 1; u.pitch = 1.05;
        u.onstart = () => { if (talk.text !== text) return; clearTimeout(talk.timer); talk.speaking = true; talk.sim = false; talk.start = nowS(); };
        u.onboundary = e => { if (talk.text !== text) return; talk.char = e.charIndex + (e.charLength || 0); talk.pulse = 1; };
        u.onend = () => { if (talk.text !== text) return; talk.speaking = false; talk.char = text.length; nextLine(); };
        u.onerror = e => { if (talk.text !== text || e.error === 'interrupted' || e.error === 'canceled') return; talk.speaking = false; talk.blocked = e.error === 'not-allowed'; simRun(); };
        synth.speak(u);
        setTimeout(() => { if (talk.on && talk.text === text && !talk.speaking && talk.sim) { talk.blocked = true; talk.start = nowS(); simRun(); } }, 1500);
    }
    function startTalk(st) { if (talk.on && talk.st === st) return; talk.st = st; if (!st.visible) return; talk.on = true; talk.line = 0; sayLine(); }
    function stopTalk() { talk.on = false; clearTimeout(talk.timer); if (synth) synth.cancel(); talk.speaking = false; }
    const unlock = () => { if (talk.on && talk.blocked && talk.sound) { talk.blocked = false; sayLine(); } };
    addEventListener('pointerdown', unlock, { passive: true }); addEventListener('keydown', unlock);
    addEventListener('pagehide', () => synth && synth.cancel());
    document.addEventListener('visibilitychange', () => { if (document.hidden && talk.on) stopTalk(); });

    const FACE = Array.from({ length: 1300 }, (_, i) => { const r = Math.sqrt((i + .5) / 1300), a = i * 2.39996; return [Math.cos(a) * r, Math.sin(a) * r]; });
    function drawTalk(c, t, k, col) {
        const cx = 410, cy = 222, R = 140 * (.7 + .3 * (1 - Math.pow(1 - k, 3)));
        const el = nowS() - talk.start;
        const chars = !talk.on ? 0 : talk.sim ? Math.min(talk.text.length, el * 15) : Math.max(talk.char, Math.min(talk.text.length, el * 13));
        const active = talk.on && (talk.speaking || (talk.sim && chars < talk.text.length));
        talk.pulse *= .9;
        const env = active ? (.25 + .75 * Math.abs(Math.sin(t * 17)) * (.55 + .45 * Math.sin(t * 4.3))) * (.7 + .3 * talk.pulse) : .04 + .03 * Math.sin(t * 2);
        // glow
        let g = c.createRadialGradient(cx, cy, 0, cx, cy, 300); g.addColorStop(0, rgba(col, .22 + .15 * env)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, 820, 560);
        // rotating rings
        c.save(); c.translate(cx, cy);
        [[R + 52, 18, t * .4, .55], [R + 74, 6, -t * .25, .35]].forEach(([rr, n, rot, a]) => { c.strokeStyle = rgba(col, a); c.lineWidth = 2; for (let i = 0; i < n; i++) { const a0 = rot + i / n * Math.PI * 2; c.beginPath(); c.arc(0, 0, rr, a0, a0 + Math.PI * 2 / n * .62); c.stroke(); } });
        c.strokeStyle = rgba(col, .25); c.lineWidth = 1; for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2 + t * .1, L = i % 5 ? 4 : 10; c.beginPath(); c.moveTo(Math.cos(a) * (R + 92), Math.sin(a) * (R + 92)); c.lineTo(Math.cos(a) * (R + 92 + L), Math.sin(a) * (R + 92 + L)); c.stroke(); }
        // radial voice bars
        for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2; const v = env * (.35 + .65 * Math.abs(Math.sin(i * .9 + t * 9) * Math.cos(i * .37 - t * 5))); const r0 = R + 14, r1 = r0 + 4 + v * 34; c.strokeStyle = i % 2 ? col : '#f472b6'; c.globalAlpha = .45 + .5 * v; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); c.stroke(); }
        c.globalAlpha = 1;
        // round holographic face: dot sphere
        for (const [x, y] of FACE) { const z = Math.sqrt(Math.max(0, 1 - x * x - y * y)); const jit = env * 2.2 * Math.sin(t * 20 + x * 30); c.fillStyle = x < 0 ? col : '#a78bfa'; c.globalAlpha = .08 + .55 * z; c.fillRect(x * R + jit - 1.2, y * R - 1.2, 2.4, 2.4); }
        c.globalAlpha = 1; c.strokeStyle = rgba(col, .9); c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = rgba(col, .25); c.lineWidth = 1; c.beginPath(); c.arc(0, 0, R * .82, 0, Math.PI * 2); c.stroke();
        // eyes (blink)
        const blink = (t % 4.2) < .14 ? .12 : 1; c.fillStyle = '#ffffff'; c.shadowColor = col; c.shadowBlur = 18;
        [-1, 1].forEach(sx => { c.beginPath(); c.ellipse(sx * R * .34, -R * .2, R * .13, R * .055 * blink, 0, 0, Math.PI * 2); c.fill(); });
        // mouth — opens with the voice
        const mh = 3 + env * R * .2; c.shadowBlur = 22; c.strokeStyle = '#f472b6'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, R * .42, R * .26, mh, 0, 0, Math.PI * 2); c.stroke();
        c.fillStyle = rgba('#f472b6', .18 + .3 * env); c.fill(); c.shadowBlur = 0;
        c.restore();
        // labels
        c.font = '600 15px Inter, sans-serif'; c.textBaseline = 'alphabetic';
        c.fillStyle = '#fb7185'; c.fillText('● LIVE  AI INTERVIEWER', 24, 38);
        c.textAlign = 'right'; c.fillStyle = active ? col : '#64748b'; c.fillText(active ? (talk.speaking ? 'SPEAKING ◖◗' : 'CAPTIONS') : 'LISTENING …', 796, 38); c.textAlign = 'left';
        // caption
        if (talk.on && talk.text) {
            const shown = talk.text.slice(0, Math.floor(chars)); c.font = '600 21px Inter, sans-serif';
            const words = shown.split(' '), lines = []; let cur = ''; words.forEach(w => { const tt = cur ? cur + ' ' + w : w; if (c.measureText(tt).width > 640 && cur) { lines.push(cur); cur = w; } else cur = tt; }); if (cur) lines.push(cur);
            c.fillStyle = 'rgba(6,9,20,.78)'; c.strokeStyle = rgba(col, .6); c.lineWidth = 1.5; c.beginPath(); c.roundRect(70, 420, 680, 84, 14); c.fill(); c.stroke();
            c.fillStyle = '#f8fafc'; lines.slice(-2).forEach((l, i) => c.fillText(l, 92, 454 + i * 30));
        }
        if (talk.on && talk.blocked && talk.sound) {
            c.font = '700 15px Inter, sans-serif'; const msg = '🔊  Click anywhere to hear me speak'; const w = c.measureText(msg).width + 36;
            const pa = .75 + .25 * Math.sin(t * 4); c.globalAlpha = pa; c.fillStyle = rgba(col, .2); c.strokeStyle = col; c.beginPath(); c.roundRect(410 - w / 2, 516, w, 34, 17); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(msg, 410, 538); c.textAlign = 'left'; c.globalAlpha = 1;
        }
    }

    PROJ.forEach((_, i) => setStep(projState[i], 0));
    function drawDevice(st, t) {
        const s = st.p.steps[st.step], c2 = st.cv.getContext('2d'), k = clamp((t - st.since) / 2.6);
        c2.setTransform(1, 0, 0, 1, 0, 0); c2.fillStyle = '#070b16'; c2.fillRect(0, 0, 820, 560);
        if (s[0] === 'img') return;
        const prev = ctx; ctx = c2;
        try {
            ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 820, 560); ctx.clip();
            if (s[0] === 'v') V[s[1]](0, -10, 820, 570, t, k, st.p.c);
            else if (s[0] === 'pipe') { pipeline(10, 120, 800, 260, s[1], t, k, st.p.c); lineChart(70, 420, 680, 80, t, 2, st.p.c, k, '', .8); }
            else if (s[0] === 'talk') drawTalk(c2, t, k, st.p.c);
            else if (s[0] === 'wave') { waveform(60, 120, 700, 200, t, st.p.c, .4 + .6 * k); s[1].forEach((w, i) => txt(w, 160 + i * 250, 400, { size: 26, fam: 'Orb', w: 700, col: i === Math.floor(t * .8) % 3 ? COL.wh : st.p.c, align: 'center', sp: 4 })); }
            ctx.restore();
        } finally { ctx = prev; }
    }

    // ------------------------------------------------------------------ build: more, stack, focus
    $('#more-grid').innerHTML = MORE.map(([cat, t, d, foot, gh, c, img, art], i) => `<article class="mcard" style="--c:${c}"><span class="num">${String(i + 1).padStart(2, '0')}</span><div class="cat mono">${cat}</div><h4>${t}</h4><p>${d}</p><div class="art">${img ? `<img src="${img}" alt="${t}" loading="lazy">` : `<canvas width="720" height="300" data-art="${art}" data-col="${c}"></canvas>`}</div><div class="foot mono"><span>${foot}</span>${gh ? `<a href="https://github.com/bharathmrr/${gh}" target="_blank" rel="noopener">CODE ↗</a>` : '<span style="color:var(--mut)">PRIVATE</span>'}</div></article>`).join('');
    $('#stack-rows').innerHTML = STACK.map((row, i) => { const [cat, col] = row[0]; const items = `<span class="schip cat" style="--c:${col}"><b>${cat}</b>${row[1]}</span>` + row.slice(2).map(s => `<span class="schip">${s}</span>`).join(''); return `<div class="srow ${i % 2 ? 'rev' : ''}" style="--d:${44 + i * 6}s"><div class="strack">${items}${items}${items}${items}</div></div>`; }).join('');
    const f = FOCUS.map(s => `<span class="chip">${s}</span>`).join(''); $('#focus-track').innerHTML = f + f + f;

    // ------------------------------------------------------------------ reveal, counters
    splitText();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); if (e.target.dataset.count !== undefined) count(e.target); io.unobserve(e.target); } }), { threshold: .15 });
    $$('.reveal, [data-split]').forEach(el => io.observe(el));
    $$('[data-count]').forEach(el => io.observe(el));
    function count(el) { const v = +el.dataset.count, t0 = performance.now(); (function tick(now) { const k = clamp((now - t0) / 1600), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(v * e); if (k < 1) requestAnimationFrame(tick); })(t0); }
    setTimeout(() => $$('#hero [data-split], #hero .reveal').forEach(el => el.classList.add('in')), 150);

    // ------------------------------------------------------------------ nav, progress, section index
    const nav = $('#nav'), prog = $('#progress'), idx = $('#nav-index');
    $('#nav-toggle').onclick = () => nav.classList.toggle('open');
    $$('#nav-links a').forEach(a => a.onclick = () => nav.classList.remove('open'));
    const secs = $$('main section[data-label]');
    function onScroll() {
        const y = scrollY; nav.classList.toggle('scrolled', y > 40);
        prog.style.width = (y / Math.max(1, document.body.scrollHeight - innerHeight) * 100) + '%';
        let cur = secs[0]; for (const s of secs) if (s.offsetTop <= y + innerHeight * .4) cur = s;
        idx.textContent = cur.dataset.label;
        const key = cur.id.startsWith('p') && cur.classList.contains('proj') ? 'featured' : cur.id;
        $$('#nav-links a').forEach(a => a.classList.toggle('active', a.dataset.sec === key));
        if (!mobile()) {
            const k = clamp((y - expSec.offsetTop) / Math.max(1, expSec.offsetHeight - innerHeight));
            showExp(Math.min(EXP.length - 1, Math.floor(k * EXP.length)));
            projState.forEach(st => { const kk = clamp((y - st.sec.offsetTop) / Math.max(1, st.sec.offsetHeight - innerHeight)); setStep(st, Math.min(st.p.steps.length - 1, Math.floor(kk * st.p.steps.length))); });
        }
        projState.forEach(st => { const r = st.sec.getBoundingClientRect(); st.visible = r.bottom > 0 && r.top < innerHeight; });
        if (talk.st && !talk.st.visible && talk.on) stopTalk();
        else if (talk.st && talk.st.visible && !talk.on && talk.st.p.steps[talk.st.step][0] === 'talk') startTalk(talk.st);
    }
    if (mobile()) showExp(0);
    addEventListener('scroll', onScroll, { passive: true });

    // ------------------------------------------------------------------ rotator, copy
    const lines = ['Beyond the chatbox.', 'AI that understands context.', 'Talks to real business systems.', 'And gets the work done.'];
    let li = 0; setInterval(() => { const r = $('#rot'); r.classList.add('out'); setTimeout(() => { li = (li + 1) % lines.length; r.textContent = lines[li]; r.classList.remove('out'); }, 450); }, 3200);
    $('#copy-email').onclick = async e => { const em = e.currentTarget.dataset.email; try { await navigator.clipboard.writeText(em); $('#copy-label').textContent = 'COPIED'; } catch { location.href = 'mailto:' + em; } setTimeout(() => $('#copy-label').textContent = 'COPY', 1800); };

    // ------------------------------------------------------------------ main loop
    const LITE = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
    const sphere1 = makeSphere($('#sphere'), { drag: true, n: LITE ? 650 : 1200 }), sphere2 = makeSphere($('#sphere2'), { n: LITE ? 450 : 900, speed: .08 });
    const heroSec = $('#hero'), contactSec = $('#contact');
    const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    let frameN = 0;
    function frame(now) {
        const t = now / 1000;
        if (document.hidden) { requestAnimationFrame(frame); return; }
        if (LITE && (frameN = (frameN + 1) % 2)) { requestAnimationFrame(frame); return; }
        drawBg(t);
        if (onScreen(heroSec)) sphere1(t);
        if (onScreen(contactSec)) sphere2(t);
        projState.forEach(st => { if (st.visible) drawDevice(st, t); });
        if (!REDUCED) requestAnimationFrame(frame);
    }
    function resize() { sizeBg(); sizeExp(); onScroll(); }
    addEventListener('resize', resize);
    resize();
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { gradSplits(); onScroll(); });
    addEventListener('resize', gradSplits);
    requestAnimationFrame(frame);
    if (REDUCED) { projState.forEach(st => drawDevice(st, 10)); }
})();

// ====================================================================== scroll engine (Lenis + GSAP ScrollTrigger)
(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- static art for the gallery cards (drawn once with the film's components)
    const ART = {
        mesh: (c, col) => graphNet(0, -10, 720, 320, 4, 1, ['CUSTOMERS', 'SUPPLIERS', 'FINANCE', 'LOGISTICS', 'ZOHO', 'MGMT'], col, ''),
        contract: (c, col) => V.contract(0, -40, 720, 380, 6, 1, col),
        scan: (c, col) => V.scan(0, -30, 720, 360, 3, 1, col),
        avatar: (c, col) => { waveform(40, 90, 640, 120, 3, col, 1); },
        hub: (c, col) => graphNet(0, -10, 720, 320, 2, 1, ['SALESFORCE', 'HUBSPOT', 'ZOHO', 'TWILIO', 'VONAGE', 'DB'], col, ''),
        agents: (c, col) => graphNet(0, -10, 720, 320, 5, 1, ['ROUTER', 'MEMORY', 'TOOLS', 'GEMINI', 'SEARCH', 'FILES'], col, ''),
        graph: (c, col) => graphNet(0, -10, 720, 320, 7, 1, ['DOCS', 'OCR', 'ENTITIES', 'LLM', 'QUERY', 'GRAPH'], col, ''),
        pipeA: (c, col) => pipeline(0, 60, 720, 180, ['ENGLISH', 'PARSE', 'TERRAFORM', 'K8S', 'SCAN'], 2, 1, col),
        pipeB: (c, col) => pipeline(0, 60, 720, 180, ['RESEARCH', 'PLAN', 'ARCHITECT', 'DEVELOP', 'MVP'], 3, 1, col),
        wave: (c, col) => waveform(40, 60, 640, 180, 5, col, 1),
        charts: (c, col) => bars(60, 40, 600, 200, 2, 10, col, 1, 4),
        neural: (c, col) => neural(60, 30, 600, 240, [4, 7, 7, 5], 4, 1, col),
        line: (c, col) => lineChart(40, 50, 640, 200, 3, 3, col, 1, '', .8),
    };
    function drawArt() {
        $$('canvas[data-art]').forEach(cv => {
            const c2 = cv.getContext('2d'); c2.fillStyle = '#070b16'; c2.fillRect(0, 0, 720, 300);
            const prev = ctx; ctx = c2; try { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 720, 300); ctx.clip(); ART[cv.dataset.art](c2, cv.dataset.col); ctx.restore(); } catch (e) { } finally { ctx = prev; }
        });
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(drawArt);
    $$('.mcard .art img').forEach(im => { if (/sql_graph/.test(im.src)) im.style.objectFit = 'contain'; });

    // --- manifesto words
    const man = $('#man-text');
    if (man) { const words = man.textContent.trim().split(/\s+/); man.innerHTML = words.map(w => `<span class="mw">${w}</span>`).join(' '); }
    const mws = $$('.mw');
    const HOT = /^(agents|context,|real|systems|real-world|tasks\.|voice|AI|beyond|chatbox\.)$/;

    if (!window.gsap || !window.ScrollTrigger || REDUCED) {
        mws.forEach(w => w.classList.add('lit'));
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('js-gsap');

    // --- Lenis smooth scrolling, driven by GSAP's ticker
    const lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const el = $(a.getAttribute('href')); if (!el) return; e.preventDefault(); lenis.scrollTo(el, { duration: 1.6, offset: 0 }); }));

    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
        // HERO — the name splits apart, sphere zooms through
        const hero = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=90%', scrub: 1, pin: true, pinSpacing: true } });
        hero.fromTo('.hero-name .solid', { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: -28, yPercent: -40, opacity: 0, ease: 'none' }, 0)
            .fromTo('.hero-name .light', { xPercent: 0, yPercent: 0, opacity: 1 }, { xPercent: 28, yPercent: 40, opacity: 0, ease: 'none' }, 0)
            .fromTo('.kicker, .hero-role, .hero-tags, .hero-rot, .hero-cta', { y: 0, opacity: 1 }, { y: -80, opacity: 0, ease: 'none', immediateRender: false }, 0)
            .to('#sphere', { scale: 2.4, opacity: 0, ease: 'power1.in' }, 0)
            .to('.hero-foot', { opacity: 0, ease: 'none' }, 0);

        // MANIFESTO — light words one by one
        ScrollTrigger.create({ trigger: '#about', start: 'top 60%', end: 'bottom bottom', scrub: true, onUpdate: self => {
            const n = Math.round(self.progress * mws.length * 1.05);
            mws.forEach((w, i) => { w.classList.toggle('lit', i < n); w.classList.toggle('hot', i < n && HOT.test(w.textContent)); });
        } });
        gsap.fromTo('.man-text', { scale: .92, opacity: .6 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'top top', scrub: true } });

        // IMPACT — cards flip up in 3D
        gsap.set('.impact-grid', { perspective: 1200 });
        gsap.fromTo('.icard', { rotateX: -70, y: 140, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, y: 0, opacity: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.impact-grid', start: 'top 92%', end: 'top 45%', scrub: 1 } });
        gsap.fromTo('#impact .h2', { x: -60 }, { x: 0, ease: 'none', scrollTrigger: { trigger: '#impact', start: 'top bottom', end: 'top 30%', scrub: true } });

        // EXPERIENCE — ghost word drifts
        ScrollTrigger.create({ trigger: '#exp', start: 'top top', end: 'bottom bottom', onUpdate: s => $('#exp-card').style.setProperty('--drift', (s.progress * -220) + 'px') });

        // PROJECTS — each showcase zooms in from a rounded window, screen swings into place
        $$('.proj').forEach(sec => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: 1 } });
            tl.fromTo($('.proj-sticky', sec), { clipPath: 'inset(14% 10% 14% 10% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
              .fromTo($('.device', sec), { rotateY: -38, rotateX: 14, scale: .72, z: -200 }, { rotateY: -9, rotateX: 3, scale: 1, z: 0, ease: 'none' }, 0)
              .fromTo($('.ptext', sec), { x: -120, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, .2)
              .fromTo($('.pghost', sec), { yPercent: 60 }, { yPercent: 0, ease: 'none' }, 0);
            gsap.to($('.device', sec), { rotateY: 6, rotateX: -2, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 1 } });
            gsap.to($('.pghost', sec), { yPercent: -80, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true } });
            gsap.to($('.proj-grid', sec), { scale: .9, opacity: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'bottom 110%', end: 'bottom 40%', scrub: true } });
        });

        // MORE — pinned horizontal gallery with 3D card swing
        const track = $('#more-grid'), cards = $$('.mcard', track), tot = cards.length;
        $('#more-tot').textContent = String(tot).padStart(2, '0');
        const dist = () => track.scrollWidth - innerWidth;
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#more', start: 'top top', end: () => '+=' + dist(), pin: '.more-pin', scrub: 1, invalidateOnRefresh: true, onUpdate: s => {
            $('#more-bar').style.width = (s.progress * 100) + '%';
            $('#more-cur').textContent = String(Math.min(tot, 1 + Math.floor(s.progress * tot))).padStart(2, '0');
            tilt.target = gsap.utils.clamp(-14, 14, s.getVelocity() / 160);
        } } });
        const tilt = { target: 0, cur: 0 };
        const setRY = gsap.quickSetter(cards, 'rotateY', 'deg'), setSK = gsap.quickSetter(cards, 'skewX', 'deg');
        gsap.ticker.add(() => { tilt.target *= .88; tilt.cur += (tilt.target - tilt.cur) * .12; setRY(-tilt.cur); setSK(tilt.cur * .2); });
    });

    // BANDS & STACK — continuous marquees that speed up and reverse with scroll velocity
    const loops = [];
    const loop = (el, dur, rev) => gsap.fromTo(el, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: dur, ease: 'none', repeat: -1 });
    $$('.band-track').forEach((el, i) => loops.push({ tw: loop(el, 26 + i * 6, i % 2 === 1) }));
    $$('.strack').forEach((el, i) => loops.push({ tw: loop(el, 46 + i * 6, i % 2 === 1), row: el.parentElement }));
    loops.forEach(l => { if (l.row) { l.row.addEventListener('mouseenter', () => l.hover = true); l.row.addEventListener('mouseleave', () => l.hover = false); } });
    let boost = 0;
    ScrollTrigger.create({ onUpdate: s => { boost = gsap.utils.clamp(-6, 6, s.getVelocity() / 300); } });
    gsap.ticker.add(() => { boost *= .92; loops.forEach(l => { const base = l.hover ? 0 : 1; l.tw.timeScale(base + Math.abs(boost)); }); });
    gsap.fromTo('.band-outline', { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '#featured', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.band-fill', { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: '#featured', start: 'top bottom', end: 'bottom top', scrub: true } });

    // CONTACT — name grows into view
    gsap.fromTo('.contact-name', { scale: .7, letterSpacing: '0.08em', opacity: .3 }, { scale: 1, letterSpacing: '-0.035em', opacity: 1, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.fromTo('#sphere2', { scale: .5 }, { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    addEventListener('load', () => ScrollTrigger.refresh());
})();
