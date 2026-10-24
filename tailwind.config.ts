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
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7F7F4",
          subtle: "#F0F1EB",
          elevated: "#FFFFFF",
        },
        charcoal: {
          DEFAULT: "#20231F",
          secondary: "#62665F",
          muted: "#85877F",
          border: "#E3E5DE",
          divider: "#D4D8CF",
          50: "#F7F7F4",
          100: "#F0F1EB",
          200: "#E3E5DE",
          300: "#D4D8CF",
          400: "#85877F",
          500: "#62665F",
          600: "#494C45",
          700: "#323530",
          800: "#20231F",
          900: "#141613",
        },
        olive: {
          DEFAULT: "#344B3B",
          hover: "#293D30",
          active: "#202F25",
          selected: "#E8EEE7",
          subtle: "#F0F3ED",
          ring: "#526B57",
          50: "#F0F3ED",
          100: "#E8EEE7",
          200: "#D2DDD0",
          300: "#A9BEA5",
          400: "#759770",
          500: "#526B57",
          600: "#3E5844",
          700: "#344B3B",
          800: "#293D30",
          900: "#202F25",
          950: "#131C16",
        },
        status: {
          success: {
            text: "#23734D",
            bg: "#E8F4EC",
          },
          warning: {
            text: "#925C0B",
            bg: "#FBF1DB",
          },
          error: {
            text: "#B42332",
            bg: "#FBEAEC",
          },
          info: {
            text: "#496785",
            bg: "#EAF0F6",
          },
          neutral: {
            text: "#62665F",
            bg: "#F0F1ED",
          },
        },
        chart: {
          primary: "#344B3B",
          secondary: "#8A9C85",
          tertiary: "#A77B51",
          fourth: "#687B8D",
          neutral: "#A6AAA1",
          grid: "#E3E5DE",
          axis: "#62665F",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Source Serif 4", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
