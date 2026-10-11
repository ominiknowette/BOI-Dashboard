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
        canvas: "#EAECF0",
        surface: "#FFFFFF",
        ink: "#031312",
        "ink-muted": "#6B7471",
        "ink-subtle": "#9AA3A0",
        border: "#DDE3E0",
        "border-subtle": "#ECEFEF",
        "primary-green": "#038E46",
        "deep-green": "#185744",
        "dark-boi-green": "#064B34",
        "soft-green": "#EAF5EE",
        "gold-accent": "#C8A34A",
        "warning-amber": "#C58B32",
        "risk-red": "#D94A4A",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sidebar: "22px",
        card: "18px",
        tile: "12px",
        control: "8px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(3, 19, 18, 0.04), 0 1px 2px -1px rgba(3, 19, 18, 0.02)",
        sidebar: "0 4px 20px -2px rgba(3, 19, 18, 0.03)",
        dropdown: "0 8px 24px -4px rgba(3, 19, 18, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

