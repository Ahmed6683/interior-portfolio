// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:          "var(--ivory)",
        "ivory-dark":   "var(--ivory-dark)",
        charcoal:       "var(--charcoal)",
        "charcoal-soft":"var(--charcoal-soft)",
        "charcoal-mid": "var(--charcoal-mid)",
        gold:           "var(--gold)",
        "gold-light":   "var(--gold-light)",
        "gold-dark":    "var(--gold-dark)",
        sand:           "var(--sand)",
        "sand-light":   "var(--sand-light)",
        muted:          "var(--muted)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body:    ["var(--font-jost)", "'Cairo'", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
