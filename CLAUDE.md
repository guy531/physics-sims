# Physics simulations website

Background, user preferences, verified physics numbers and pitfalls: see `HANDOFF.md` (sections 3 and 5 still apply).
Chat with the user in Hebrew. Simulation content for Quantum Physics II is in English; the other courses' simulations will be in Hebrew.

## Layout
```
index.html                         home page (Hebrew, one card per course), rendered by shared/site.js
courses/<slug>/index.html          course catalog page (same tiny template for every course; only data-course differs)
courses/<slug>/<sim>.html          simulations, self-contained except for shared/sim.css + shared/sim.js
shared/catalog.js                  CATALOG: courses (slug, lang, title, number) and their sims; single source for all catalog pages
shared/sim.css, shared/sim.js      common look and helpers for simulations (canvas helpers, theme/notes, playback, frame loop)
shared/site.css, shared/site.js    home and catalog pages
thumbs/<sim>.png                   1600×900 screenshots shown on the catalog cards
```
`catalog.js` is a script (not JSON) so the pages also work when opened directly from disk (file://).

## Adding a simulation
1. Put the page in `courses/<slug>/`, link `../../shared/sim.css` and load `../../shared/sim.js` before the page script.
   The page calls `addColors(...)` for its extra `--c-*` tokens, `initPlayback(S, NT, PERIOD)`, `initThemeNotes()` and `startLoop(panels, readouts)`.
   Hebrew page: `<html lang="he" dir="rtl">` and pass Hebrew texts to `initThemeNotes({...})` / `initPlayback(S, NT, PERIOD, {play, pause})`.
2. Add an entry to that course's `sims` in `shared/catalog.js`.
3. Thumbnail: start the local server (`.claude/launch.json`, "site", port 8765) and run headless Edge:
   `msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,900 --virtual-time-budget=5000 --screenshot=thumbs/<sim>.png "http://localhost:8765/courses/<slug>/<sim>.html?t=0.6"`
   (`?t=0.6` opens the simulation paused at 60% of the run.)

## Open items
- Course numbers: empty `number` fields in `shared/catalog.js`; the user will send them.
- Published: repo https://github.com/guy531/physics-sims (public), GitHub Pages from `main` / root, live at https://guy531.github.io/physics-sims/ .
  Publishing = commit + `git push`; Pages rebuilds in about a minute.
- Google Sites: link/embed instructions given to the user (HANDOFF §6); not yet confirmed done.
