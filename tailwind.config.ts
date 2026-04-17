import type { Config } from "tailwindcss";

/**
 * DESIGN TOKENS — "Argile & Eucalyptus"
 *
 * Palette assumée : rose argile + vert eucalyptus + beige lin + chocolat profond.
 * Jamais de blanc pur. Toutes les teintes sont chaudes, poudrées, tactiles.
 * Adresse : jeunes mères en reconstruction post-partum (28–42 ans).
 * Émotion : douceur, permission de ralentir, sororité, féminité assumée.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Core palette
          argile:       "#C7907A", // rose argile — accent principal
          argileDeep:   "#A06D58", // argile brûlée — CTA secondaires, liens
          argileSoft:   "#EBD1C3", // argile laiteuse — fonds, overlays
          eucalyptus:   "#8FA59B", // vert eucalyptus — second accent
          eucalyptusDeep: "#5E7A71", // eucalyptus profond — accents sombres
          eucalyptusSoft: "#CFD9D3", // eucalyptus poudré — fonds
          lin:          "#ECE4D3", // lin — surface secondaire
          linPale:      "#F6F0E3", // lin pâle — surface cards
          ivoire:       "#FBF5EB", // ivoire tiède — fond global (jamais blanc)
          chocolat:     "#3C2A22", // chocolat profond — texte principal
          chocolatSoft: "#6B4F42", // chocolat doux — texte secondaire
          fumee:        "#9A8A80", // fumée — texte tertiaire
          divider:      "#D9CCB8", // fin divider chaud

          // Legacy aliases — ne surtout pas casser les autres pages
          rose: "#C7907A",
          terracotta: "#A06D58",
          roseLight: "#EBD1C3",
          dark: "#3C2A22",
          ivory: "#FBF5EB",
          nude: "#EBD1C3",
          taupe: "#9A8A80",
          sage: "#8FA59B",
          beige: "#ECE4D3"
        }
      },
      fontFamily: {
        display: ['"Boska"', "Georgia", "ui-serif", "serif"],
        serif: ['"Boska"', "Georgia", "ui-serif", "serif"],
        sans: ['"General Sans"', "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["clamp(3.25rem, 8vw, 6.75rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 4.75rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.022em" }]
      },
      letterSpacing: {
        widest2: "0.22em"
      },
      boxShadow: {
        // Colored shadows — never pure black
        soft:  "0 30px 60px -30px rgba(160, 109, 88, 0.30)",
        card:  "0 12px 36px -18px rgba(60, 42, 34, 0.15)",
        argile: "0 24px 60px -20px rgba(199, 144, 122, 0.45)",
        euca:  "0 24px 60px -20px rgba(143, 165, 155, 0.40)"
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
        xl4: "2.5rem",
        xl5: "3rem",
        blob1: "62% 38% 55% 45% / 50% 60% 40% 50%",
        blob2: "38% 62% 45% 55% / 60% 40% 60% 40%",
        blob3: "55% 45% 38% 62% / 42% 55% 45% 58%"
      },
      keyframes: {
        "rise-in": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "reveal-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "marquee": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "blob-morph": {
          "0%, 100%": { borderRadius: "62% 38% 55% 45% / 50% 60% 40% 50%", transform: "rotate(0deg) scale(1)" },
          "33%":      { borderRadius: "38% 62% 45% 55% / 60% 40% 60% 40%", transform: "rotate(8deg) scale(1.03)" },
          "66%":      { borderRadius: "55% 45% 38% 62% / 42% 55% 45% 58%", transform: "rotate(-6deg) scale(0.98)" }
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%":      { transform: "translateY(-20px) translateX(10px)" }
        }
      },
      animation: {
        "rise-in":   "rise-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "reveal-up": "reveal-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "fade-in":   "fade-in 1.4s ease-out both",
        "marquee":   "marquee 60s linear infinite",
        "blob":      "blob-morph 18s ease-in-out infinite",
        "float":     "float-slow 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
