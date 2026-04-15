import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          rose: "#C8825B",
          terracotta: "#B56A45",
          roseLight: "#E9A87C",
          dark: "#2E2A27",
          ivory: "#FBF7F4",
          nude: "#F9E7E1",
          taupe: "#7A6B63",
          sage: "#A8B5A0",
          beige: "#D4B896",
          divider: "#E5DDD7"
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }]
      },
      boxShadow: {
        soft: "0 8px 30px rgba(46, 42, 39, 0.06)",
        card: "0 2px 12px rgba(46, 42, 39, 0.05)"
      },
      borderRadius: {
        xl2: "0.75rem"
      }
    }
  },
  plugins: []
};

export default config;
