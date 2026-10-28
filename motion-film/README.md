# Portfolio Motion Film

A ~5-minute motion-graphics portfolio film, generated entirely from code. Every frame is drawn on an HTML canvas, captured frame-by-frame with Playwright, and encoded with ffmpeg. The soundtrack is synthesised in Python.

**Watch:** [`portfolio-film.mp4`](portfolio-film.mp4) — also embedded in the *Showreel* section of the portfolio site.

## What's in the film

| Time | Scene |
|---|---|
| 0:00 | Cold open — kinetic typography: *Beyond the chatbox* |
| 0:14 | Name reveal |
| 0:26 | About me + numbers (78 repos · 10 AI platforms · 2+ years · CGPA 8.62) |
| 0:48 | Experience — Jane, Aiqwip, Freelance, EISystems, VaultofCodes, B.Tech |
| 1:42 | Enterprise AI platforms (8 systems, each with a live 3D device mock-up) |
| 2:50 | Open source — github.com/bharathmrr |
| 2:58 | Featured repos with **real images from the repos**: DragAI, Codely, LangGraph SQL Assistant, MLflow Insurance Prediction, DeFi Wallet Risk Scoring |
| 3:48 | Rapid-fire: AI-MCP Orchestrator, Agentic Graph RAG, AutoDevOps, BuildPilot, Debt Recovery Agent, AI Data Agent, Emotion Detection, FlowMind |
| 4:20 | Toolkit sphere |
| 4:32 | Portfolio site + contact |

## Files

| File | Purpose |
|---|---|
| `data.js` | All the content — profile, experience, projects, repos. **Edit this to update the film.** |
| `film.js` | Scenes, kinetic type, 3D image cards, transitions, compositing. `render(t)` is deterministic. |
| `lib.js` | Shared drawing components (charts, globe, neural net, pipelines, device visuals). |
| `film.html` | Canvas page. Open it in a browser for a live (non-exported) preview; add `?t=120` to jump. |
| `render.js` | Frame-accurate renderer for a frame range → H.264 segment. |
| `audio.py` | 120 BPM synthesised score, synced to every cut (needs `numpy`). |
| `build.sh` | Full pipeline: parallel render → score → mux → 2-pass encode under 100 MB → poster. |
| `img/` | Real images taken from the repositories, plus portfolio-site screenshots. |

## Build it yourself

Requirements: Node 18+, Python 3 with `numpy`, ffmpeg.

```bash
cd motion-film
npm install
npx playwright install chromium
WORKERS=4 ./build.sh        # → portfolio-film.mp4 + poster.jpg
```

To change the film, edit `data.js` (text, projects, dates) or swap images in `img/`, then run `./build.sh` again.

Fonts: Inter / Inter Display (SIL Open Font License, see `fonts/LICENSE-Inter.txt`), Orbitron, Rajdhani and Share Tech Mono via `@fontsource`.
