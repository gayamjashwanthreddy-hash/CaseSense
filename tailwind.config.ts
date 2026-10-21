import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#1e3a5f",
          900: "#0f2038",
          950: "#091424",
        },
        midnight: {
          DEFAULT: "#080E18",
          50: "#182234",
          100: "#152236",
          200: "#10233D",
          800: "#080E18",
          900: "#050910",
        },
        brand: {
          midnight: "#080E18",
          deep: "#10233D",
          surface: "#152236",
          inst: "#3678D4",
          ice: "#8DBAFF",
          teal: "#3E9E96",
          warm: "#F5F7FA",
          neutral: "#EDF1F5",
          muted: "#AEBBCD",
        },
        aicte: {
          blue: "#1e40af",
          dark: "#0f172a",
          border: "#e2e8f0",
          card: "#ffffff",
          muted: "#64748b",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
