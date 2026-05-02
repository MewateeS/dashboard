/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0c0e10",
        surface: "#141820",
        raised: "#1c2230",
        border: "#252d3a",
        yellowBright: "#FFE135",
        greenBright: "#39FF6A",
        amberBright: "#FF8C32",
        emberGlow: "#FF4D1A",
        smoke: "#8896a8",
        white: "#e8edf2",
        "green-dim": "#1a3a2a",
        "green-mid": "#2d5a3c",
        "amber-dim": "#3a2a1a",
        ash: "#2a2e35",
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
