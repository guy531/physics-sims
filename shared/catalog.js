/* Single source for the home page and all course catalog pages.
   Adding a simulation = put the .html file in courses/<slug>/ and add one entry to that course's "sims".
   lang: "en" (left to right) or "he" (right to left) for the course page and its simulations.
   number: Open University course number (shown next to the title when filled in).
   thumb: path from the site root; leave "" to show a placeholder. */
const CATALOG = {
  "courses": [
    {
      "slug": "quantum-2",
      "lang": "en",
      "title": "Quantum Physics II",
      "number": "",
      "sims": [
        {
          "file": "td-perturbation-two-level.html",
          "title": "Time-Dependent Perturbation Theory",
          "summary": "A driven few-level system (2–6 levels): exact solution vs. first-order perturbation theory, Rabi oscillations, sudden vs. adiabatic switching, multi-photon transitions.",
          "topic": "Time-dependent perturbation theory",
          "thumb": "thumbs/td-perturbation-two-level.png"
        },
        {
          "file": "fermi-golden-rule.html",
          "title": "Fermi's Golden Rule",
          "summary": "Decay of a discrete state into a quasi-continuum: exact dynamics vs. first order, the golden-rule rate, exponential decay, Lorentzian line shape and recurrences.",
          "topic": "Time-dependent perturbation theory",
          "thumb": "thumbs/fermi-golden-rule.png"
        }
      ]
    },
    { "slug": "analytical-em",        "lang": "he", "title": "אלקטרומגנטיות אנליטית", "number": "", "sims": [] },
    { "slug": "statistical-mechanics", "lang": "he", "title": "מכניקה סטטיסטית",       "number": "", "sims": [] },
    { "slug": "thermodynamics",        "lang": "he", "title": "תרמודינמיקה",           "number": "", "sims": [] },
    { "slug": "physics-fundamentals",  "lang": "he", "title": "יסודות הפיסיקה",        "number": "", "sims": [] }
  ]
};
