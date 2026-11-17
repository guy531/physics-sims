# Physics simulations website

Background, user preferences, verified physics numbers and pitfalls: see `HANDOFF.md` (sections 3 and 5 still apply).
Chat with the user in Hebrew. Simulation content for Quantum Physics II is in English; the other courses' simulations will be in Hebrew.

## Layout
```
index.html                         the only index page (Hebrew): a card per course listing direct links to its simulations
courses/<slug>/<sim>.html          simulations, self-contained except for shared/sim.css + shared/sim.js
shared/catalog.js                  CATALOG: courses (slug, lang, title, number) and their sims (file, title, summary)
shared/sim.css, shared/sim.js      common look and helpers (canvas helpers, theme switch/notes, playback, frame loop)
shared/site.css, shared/site.js    the home page
```
The user asked for a simple site: no per-course pages and no thumbnails (both were tried and removed).
Visual style follows the user's study-planner site (https://guy531.github.io/study-planner/): warm neutrals, teal accent,
Assistant + JetBrains Mono, slider theme switch.
`catalog.js` is a script (not JSON) so the pages also work when opened directly from disk (file://).

## Adding a simulation
1. Put the page in `courses/<slug>/`, link `../../shared/sim.css` and load `../../shared/sim.js` before the page script.
   The page calls `addColors(...)` for its extra `--c-*` tokens, `initPlayback(S, NT, PERIOD)`, `initThemeNotes()` and `startLoop(panels, readouts)`.
   Hebrew page: `<html lang="he" dir="rtl">` and pass Hebrew texts to `initThemeNotes({...})` / `initPlayback(S, NT, PERIOD, {play, pause})`.
2. Add an entry to that course's `sims` in `shared/catalog.js`.
3. Check it: local server from `.claude/launch.json` ("site", port 8765). Screenshots of the whole page with headless Edge:
   `msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1900,950 --virtual-time-budget=5000 --screenshot=<file>.png "http://localhost:8765/courses/<slug>/<sim>.html?t=0.6"`
   (`?t=0.6` opens the simulation paused at 60% of the run; `--blink-settings=preferredColorScheme=1` forces light.)

## Open items
- Published: repo https://github.com/guy531/physics-sims (public), GitHub Pages from `main` / root, live at https://guy531.github.io/physics-sims/ .
  Publishing = commit + `git push`; Pages rebuilds in about a minute.
- Google Sites: link/embed instructions given to the user (HANDOFF §6); not yet confirmed done.
