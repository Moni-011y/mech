/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D1117",
        surface: "#161B22",
        "surface-elevated": "#20262E",
        steel: "#7D8790",
        "text-primary": "#E6EDF3",
        "text-secondary": "#9DA7B0",
        accent: "#16B8A6",
        "accent-bright": "#2DD4BF",
        border: "#30363D",
      },
    },
  },
  plugins: [],
};

