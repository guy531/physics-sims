# Handoff: Interactive Physics Simulations Website

This file hands the project over to a new Claude Code session in a new folder.
It sums up what was built so far, the decisions made, the user's preferences and the plan.
**Suggested use:** copy this file into the new project folder as `CLAUDE.md` (or `docs/HANDOFF.md` with a pointer from `CLAUDE.md`).

---

## 1. Goal

A website of interactive physics simulations for students, organized by **course**.
Each course has a **catalog page** of simulations that run in the browser (sliders, graphs, animations).
The user teaches several courses; Quantum Physics II (Open University of Israel) is the first.
The site must also be reachable from the user's existing personal site on Google Sites (`https://sites.google.com/view/guy-amit/bio`).

## 2. What exists today

Two finished simulations, built and tested in the first session. They live in this Google Drive folder:

`G:\My Drive\Physics\Open university\Quantum 2\Simulations\`

| File | Topic |
|---|---|
| `td-perturbation-two-level.html` | Time-dependent perturbation theory, driven few-level system (2–6 levels) |
| `fermi-golden-rule.html` | Fermi's golden rule: decay of a discrete state into a quasi-continuum |

Each file is self-contained: plain HTML + CSS + vanilla JS, drawing on `<canvas>`, no build step.
The only external dependency is KaTeX from jsDelivr for the theory formulas. Without internet the formulas show as raw TeX, and the simulation still works.
The two pages link to each other in their headers.

### 2.1 `td-perturbation-two-level.html`

- **Model:** levels |1⟩…|N⟩ (N = 2–6) with frequencies ω_n1 = E_n − E_1, all adjustable by slider. The system starts in |1⟩.
  - Perturbation V(t) = V₀ g(t) cos ωt.
  - The coupling pattern can be: neighbours only (ladder), ladder with √n (harmonic-oscillator x), or all pairs.
  - Units: ħ = 1; the default two-level system has ω₂₁ = 1.
- **Envelope g(t):**
  - Switched on at t_on with a sin² ramp of length T (T = 0 is sudden).
  - Or a Gaussian pulse centred at t_max/2 with width τ.
- **Exact solution:** RK4 in the interaction picture, `i ċ_n = Σ_m V_nm(t) e^{iω_nm t} c_m`.
- **First order:** `c_n^(1) = −i∫ V_n1 e^{iω_n1 t'} dt'`, integrated with Simpson on the same points. It only reaches levels coupled directly to |1⟩.
- **Two-level extra:** the optional Rabi (RWA) formula, shown for N = 2 with a sudden switch-on only.
- **Panels:**
  1. P_n(t) for all excited levels (exact solid, first order dashed), with a V(t) strip below.
  2. Animated level diagram: disc area ∝ population, dashed ring for first order, stacked ħω arrows for multi-photon transitions.
  3. Complex-plane amplitude of the target level.
  4. Line shape P_target(ω) at the current time. Computed in chunks in the background (one full run per ω) so the page stays responsive.
- **Controls:**
  - Presets: weak resonant, off resonance, strong drive, constant V sudden/adiabatic, sudden/slow pulse, π-pulse.
  - Multi-level presets: two lines, 3-level ladder, anharmonic ladder, two-photon resonance, harmonic oscillator.
  - Playback: play/pause, restart, time scrub, speed.
  - Readouts with a badge saying whether first order is accurate.
- **Verified numbers:**
  - π-pulse: P₂ = 0.997.
  - Sudden constant V: P oscillates up to 4V₀²/ω₀². Adiabatic switch-on: P → V₀²/ω₀² with no oscillation.
  - Harmonic oscillator: Poisson populations with n̄ = (V₀t/2)², and P₂^(1) = n̄.
  - 3-level ladder: P₃ reaches 1 while first order gives 0.
  - Two-photon resonance: 98% transfer to |3⟩.

### 2.2 `fermi-golden-rule.html`

- **Model:** a discrete state |a⟩ (E = 0) coupled with strength g (rotating-wave approximation) to N equally spaced levels in a band of width W centred at 1.
  - Spacing δ, density of states ρ = 1/δ, drive frequency ω.
  - Golden-rule rate Γ = 2πg²ρ.
- **Exact solution:** in the rotating frame H is time independent with an "arrowhead" structure.
  - Eigenvalues are roots of λ = Σ g²/(λ − Δ_k), found by bisection between poles; the eigenvectors follow analytically.
  - So any time t is computed exactly and instantly.
- **Panels:**
  1. Survival P_a(t): exact, first order, 1 − Γt, e^{−Γt}. Optional log axis.
  2. Level diagram with a population bar per band level.
  3. Final-state distribution |c_k|²: sinc² in first order versus a Lorentzian of width Γ.
  4. Instantaneous decay rate.
- **Readouts:** ρ, Γ, 1/Γ, t_H = 2πρ, and a regime badge checking δ ≪ Γ ≪ W.
- **Verified:** normalization to 1e-15, P_a(1/Γ) ≈ e⁻¹, recurrence at t_H, no decay when ω is outside the band.

## 3. User preferences and conventions

- **Language:** all file content (UI, code, comments, docs) in **English**. Chat with the user in **Hebrew**.
- **Readability:** canvas font constant `FS = 14`, body text 16 px. The user found 12 px too small and 15–17 px too big.
- **One-screen layout:** the main graph and all lower panels must be visible together without scrolling.
  - Canvas heights are derived from `--avail: calc(100vh − 200px)`.
  - The sidebar is sticky and scrolls on its own.
  - Explanatory captions are hidden by default behind a "Show notes" button.
- **Theme:** a light/dark toggle button in the header. Colours are CSS tokens on `:root` with a `:root[data-theme="dark"]` override, and the canvas reads them via `getComputedStyle`.
  - Shared localStorage keys: `tdpt-theme`, `tdpt-notes`. Always wrap localStorage in try/catch.
- **Labels:** never show underscores like `P_b` or `t_max`.
  - On canvas, use the `rich()` helper for real sub- and superscripts.
  - In HTML, use `<sub>`.
  - Inside `<option>`, use Unicode subscripts (tₘₐₓ, tₒₙ), because options cannot hold HTML.
- **Page structure:** header (title + intro, nav links, Notes and Theme buttons), sidebar (Presets, parameter cards, Playback, Readouts + badge), main area (graphs), then a **Theory** section with KaTeX and a **"Things to try"** list for students.
- **Verification:**
  - Open each page in the browser, check the console for errors, take a screenshot at about 1900×950.
  - Check the physics numerically against analytic results, and report the numbers to the user.
- **Software:** if missing software would help (git, Node, …), propose installing it rather than building a workaround.

## 4. Shared code (candidates for `shared/`)

Both pages duplicate these pieces. Move them into shared files when building the site:

- **Canvas helpers:** `setup(cv)` (HiDPI), `niceTicks`, `fmt`, `axes(ctx,w,h,{xmin,xmax,ymin,ymax,xlabel,ylabel,log})`, `clip`, `poly` (skips NaN), `legend`, `vline`, `hline`, `rich` (sub/superscript text).
- **Theme and notes:** `readColors()` and the theme/notes toggles.
- **Frame loop:** schedules `requestAnimationFrame` first, clamps `dt ≥ 0` and the index to [0, NT], skips any canvas narrower or shorter than 60 px, and wraps each draw in try/catch.
- **Playback:** play/pause, restart, scrub, speed, spacebar.
- **CSS:** tokens, card layout, sidebar, one-screen sizing.

## 5. Pitfalls already hit

- `Math.exp(-(x)**2)` is a **SyntaxError** in JS. Write `-((x)**2)`.
- A `<label>` with `display:flex; justify-content:space-between` splits text that contains `<sub>`. Wrap the text in a `<span>`.
- A canvas inside a CSS grid column can grow wider than the card. Give grid children `min-width:0`.
- The first `requestAnimationFrame` timestamp can be earlier than `performance.now()` read at load. A negative dt then gives index −1, which crashes the readouts.
- A canvas with zero size during a resize gives a negative `arc` radius, which throws and used to stop the animation loop.
- Heavy loops (a line shape needs about 100 full ODE runs) must be chunked with `setTimeout` and cancelled by a job counter. Otherwise the UI freezes for seconds.
- In the Claude desktop browser pane, local `file://` pages render as snapshots and timers are throttled when the pane is hidden. Animation speed there is not representative.

## 6. Plan for the website (agreed direction, nothing built yet)

- **Hosting:** GitHub Pages, free, for example `https://<github-user>.github.io/<repo>/`. Netlify and Cloudflare Pages are alternatives.
- **Repository layout:**
  ```
  index.html                 ← home: one card per course
  courses/<course-slug>/index.html   ← catalog for that course
  courses/<course-slug>/<sim>.html
  shared/sim.css, shared/sim.js      ← common look and helpers
  thumbs/<sim>.png
  catalog.json               ← single source for all catalog pages
  ```
- **`catalog.json` sketch:**
  ```json
  {"courses":[{"slug":"quantum-2","title":"Quantum Physics II","sims":[
    {"file":"td-perturbation-two-level.html","title":"Time-Dependent Perturbation Theory",
     "summary":"Driven few-level system: exact vs. first order","topic":"Time-dependent perturbation theory",
     "thumb":"thumbs/td-perturbation.png"}]}]}
  ```
  The catalog pages render from this file, so adding a simulation means one file plus one JSON entry.
- **Thumbnails:** screenshot each simulation automatically with the browser tool.
- **Google Sites integration:** Google Sites cannot host HTML files.
  1. Add a "Simulations" page to the menu with a link to the site.
  2. Embed the catalog with Insert → Embed → By URL, which shows it as an iframe.
  3. Have catalog cards open each simulation in a **new tab**, because a full simulation is too big for an iframe in Sites.
- **Working across computers (decided):** the project folder, including the git repository, lives in **Google Drive**, so the user can switch between the desktop PC and a laptop.
  - The user works on **one computer at a time**. They never work on the project on two computers at once.
  - **Rule:** before switching computers, wait until Drive has finished syncing. Before starting work, check that `git status` looks sane.
  - Drive conflict copies such as `index (1)` or `HEAD (1)` inside `.git` are the warning sign. If they appear, stop and repair the repository; if needed, re-clone from GitHub.
  - GitHub holds the safe copy and the live site: commit often and `git push` at the end of each work session.
  - If simultaneous work on two computers is ever needed, move to this setup: work files in Drive, plus a separate local clone used only for publishing (copy, then `git push`).

## 7. Open decisions (ask the user)

1. Which courses go on the site, and what are their display names (Hebrew or English, course numbers)?
2. Public or private? GitHub Pages on a free account is public.
3. Language of the catalog UI: English like the simulations, or Hebrew.
4. Repository and site name.

## 8. Setup the user must do

- Create a GitHub account. The user does this themself; Claude does not create accounts.
- Install Git (and optionally the GitHub CLI `gh`) on each computer. Check with `git --version` and offer to install if it is missing.

## 9. Suggested first steps for the new session

1. Create the repo structure from §6 in the new project folder in Google Drive and run `git init`.
2. Copy the two simulations from the Drive path in §2 into `courses/quantum-2/`.
3. Extract the shared code (§4) into `shared/` and make both simulations use it. Check that each one still looks and behaves the same.
4. Build `index.html` and the course catalog page from `catalog.json`, with theme and notes matching the simulations.
5. Take thumbnails and verify everything in the browser.
6. After the user has a GitHub account: create the repo, push, enable Pages, and give the user the URL plus Google Sites embed instructions.

### Opening prompt for the new Claude Code session
> Read `HANDOFF.md` (copied from `G:\My Drive\Physics\Open university\Quantum 2\Simulations\HANDOFF.md`). We are building the physics-simulations website described there. Start with §9. Ask me the open decisions in §7 before you name or publish anything.
