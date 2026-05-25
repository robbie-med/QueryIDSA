import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1220",
          800: "#16213a",
          700: "#1f2c4a",
          200: "#c7d2e6",
          100: "#e6ecf7",
        },
        accent: {
          500: "#2563eb",
          600: "#1d4ed8",
          400: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
