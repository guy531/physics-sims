/* The list of courses and simulations shown on the home page.
   Adding a simulation = put the .html file in courses/<slug>/ and add one entry to that course's "sims".
   lang: "en" (left to right) or "he" (right to left) for the course's entry and its simulations.
   number: Open University course number (shown next to the title when filled in). */
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
          "summary": "A driven few-level system (2–6 levels): exact solution vs. first-order perturbation theory, Rabi oscillations, sudden vs. adiabatic switching, multi-photon transitions."
        },
        {
          "file": "fermi-golden-rule.html",
          "title": "Fermi's Golden Rule",
          "summary": "Decay of a discrete state into a quasi-continuum: exact dynamics vs. first order, the golden-rule rate, exponential decay, Lorentzian line shape and recurrences."
        }
      ]
    },
    { "slug": "analytical-em",        "lang": "he", "title": "אלקטרומגנטיות אנליטית", "number": "", "sims": [] },
    { "slug": "statistical-mechanics", "lang": "he", "title": "מכניקה סטטיסטית",       "number": "", "sims": [] },
    { "slug": "thermodynamics",        "lang": "he", "title": "תרמודינמיקה",           "number": "", "sims": [] },
    { "slug": "physics-fundamentals",  "lang": "he", "title": "יסודות הפיסיקה",        "number": "", "sims": [] }
  ]
};
