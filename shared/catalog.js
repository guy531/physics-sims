/* The list of courses and simulations shown on the home page, in display order.
   Adding a simulation = put the .html file in courses/<slug>/ and add one entry to that course's "sims".
   lang: "en" (left to right) or "he" (right to left) for the course's entry and its simulations.
   number: Open University course number (shown next to the title). */
const CATALOG = {
  "courses": [
    { "slug": "physics-fundamentals",  "lang": "he", "title": "יסודות הפיסיקה",          "number": "20125", "sims": [] },
    { "slug": "thermodynamics",        "lang": "he", "title": "תרמודינמיקה לפיסיקאים",    "number": "20482", "sims": [] },
    { "slug": "statistical-mechanics", "lang": "he", "title": "פיסיקה סטטיסטית",          "number": "20314", "sims": [] },
    { "slug": "analytical-em",         "lang": "he", "title": "אלקטרומגנטיות אנליטית",    "number": "20589", "sims": [] },
    {
      "slug": "quantum-2",
      "lang": "en",
      "title": "Quantum Physics II",
      "number": "20955",
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
    }
  ]
};
