import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        navy: {
          900: "#0a0f1e",
          950: "#060b15",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-solar": "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #1e1b4b 100%)",
        "gradient-amber": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
