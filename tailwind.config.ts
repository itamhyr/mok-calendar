import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#0A84FF",
        "accent-soft": "#5EB1FF",
        navy: {
          950: "#0A0E17",
          900: "#111826",
          800: "#1A2436",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        xl2: "22px",
        xl3: "28px",
      },
    },
  },
  plugins: [],
};

export default config;
