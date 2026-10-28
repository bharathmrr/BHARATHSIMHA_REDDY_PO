# Bharathsimha Reddy Putta — Portfolio

Automation, AI & ML Engineer · Generative AI · Agentic AI · Voice AI · Bengaluru, India

A cinematic, scroll-driven single-page portfolio: aurora night sky, cyan → indigo → pink gradient type, glass panels, smooth inertia scrolling (Lenis) and scroll-scrubbed animation (GSAP ScrollTrigger).

## Sections

| # | Section | Scroll effect |
|---|---|---|
| 00 | Intro | Name splits apart and the draggable 3D sphere zooms through as you scroll |
| 01 | About | Pinned statement that lights up word by word |
| 02 | Impact | Stat cards flip up in 3D and count up |
| 03 | Experience | Sticky timeline — scroll or click a role (Jane, Aiqwip, Freelance, EISystems, VaultofCodes) |
| 04 | Projects | Velocity-reactive marquee bands, then five pinned showcases: each opens from a rounded window, the screen swings into place in 3D and steps through product screens as you scroll |
| 05 | More work | Pinned horizontal gallery of 16 systems; cards tilt with scroll speed |
| 06 | Stack | Tool rows that speed up with scrolling (hover to pause) |
| 07 | Education | B.Tech and early career |
| 08 | Contact | Name grows into view; copy-to-clipboard email |

## Files

- `index.html`, `styles.css`, `script.js` — the site (no build step, no frameworks)
- `assets/img/` — product screens for the featured projects
- `assets/js/viz.js` — live drawing components (globe, call transcript, funnel, node canvas…) shared with the motion film
- `assets/vendor/` — GSAP + ScrollTrigger and Lenis, served locally
- `assets/fonts/`, `motion-film/fonts/` — Geist Mono and Inter / Inter Display (SIL OFL)
- `motion-film/` — the code-generated portfolio film, plus the fonts and repo images the site reuses

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Deploys as-is to GitHub Pages, Netlify or Vercel.

## Contact

- Email: bharathreddyget@gmail.com
- GitHub: [github.com/bharathmrr](https://github.com/bharathmrr)
- LinkedIn: [bharathsimha-reddy-putta](https://www.linkedin.com/in/bharathsimha-reddy-putta-a2292a211/)
