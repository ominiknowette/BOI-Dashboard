import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        boi: {
          green: "#0B6B4F",
          "green-deep": "#0B4738",
          ink: "#17352D",
          gold: "#C59A32",
          "gold-light": "#F8F3E6",
          bg: "#F5F7F5",
          surface: "#FFFFFF",
          text: "#17201C",
          "text-muted": "#667169",
          border: "#DDE5DF",
          "border-subtle": "#EBEFEA",
          selected: "#EDF5F1",
          error: "#B33A3A",
          warning: "#A66B13",
        },
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
      },
      maxWidth: {
        canvas: "1440px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 71, 56, 0.04), 0 1px 2px -1px rgba(11, 71, 56, 0.04)",
        dropdown: "0 4px 16px -2px rgba(11, 71, 56, 0.08), 0 2px 6px -1px rgba(11, 71, 56, 0.04)",
        dialog: "0 12px 32px -4px rgba(11, 71, 56, 0.12), 0 4px 12px -2px rgba(11, 71, 56, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
