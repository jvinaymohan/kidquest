/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(255 249 240 / <alpha-value>)",
        primary: "rgb(255 107 53 / <alpha-value>)",
        secondary: "rgb(78 205 196 / <alpha-value>)",
        accent: "rgb(255 230 109 / <alpha-value>)",
        success: "rgb(107 203 119 / <alpha-value>)",
        error: "rgb(255 107 107 / <alpha-value>)",
        ink: "rgb(45 48 71 / <alpha-value>)",
        history: "rgb(212 160 23 / <alpha-value>)",
        geography: "rgb(42 157 143 / <alpha-value>)",
        music: "rgb(155 93 229 / <alpha-value>)",
        math: "rgb(58 134 255 / <alpha-value>)",
        gk: "rgb(251 133 0 / <alpha-value>)",
        trivia: "rgb(230 57 70 / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
      borderRadius: {
        chunky: "1.25rem",
        pill: "9999px",
      },
      boxShadow: {
        chunky: "4px 4px 0px rgba(0,0,0,0.15)",
        chunkyLg: "6px 6px 0px rgba(0,0,0,0.15)",
        chunkyXl: "8px 8px 0px rgba(0,0,0,0.18)",
        chunkySm: "2px 2px 0px rgba(0,0,0,0.15)",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1.2s ease-in-out infinite",
        pop: "pop 0.4s ease-out",
        floaty: "floaty 3s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
