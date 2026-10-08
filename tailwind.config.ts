import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        acadia: {
          ink: "#17312b",
          leaf: "#2f6f4e",
          moss: "#6b8f47",
          cream: "#f8f5ee",
          sky: "#e7f0ed",
          gold: "#d99f45"
        },
        // Find My Person (app/MyPerson): felt green, cream cards, burnt orange.
        mp: {
          felt: "#173b33",
          "felt-2": "#1d463d",
          "felt-3": "#26594c",
          "felt-line": "#2f6153",
          cream: "#fffbf3",
          "cream-2": "#f7f0e3",
          "cream-3": "#ebe0ce",
          ink: "#1b2420",
          "ink-muted": "#5e6862",
          mist: "#f6f1e7",
          sage: "#a9c0b7",
          ember: "#f07a3a",
          "ember-light": "#ff9a62",
          "ember-deep": "#b84a14",
          "ember-soft": "#fbe7d8",
          heart: "#e0404f"
        },
        // StefanOswald.com (app/(site)): a dark stage, MagicTrickGuy gold, and playing-card ivory and red.
        so: {
          ink: "#0c0b0a",
          coal: "#141210",
          "coal-2": "#1b1916",
          line: "#2b2824",
          "line-2": "#3a3631",
          paper: "#f3eee4",
          mute: "#aaa396",
          dim: "#8c8579",
          gold: "#c9a84c",
          "gold-2": "#e0c374",
          ivory: "#f4efe3",
          "ivory-2": "#e6dfcf",
          red: "#b0232e",
          "card-ink": "#1a1714"
        }
      },
      fontFamily: {
        "mp-display": ["var(--font-fraunces)", "Georgia", "Times New Roman", "serif"],
        "so-display": ["var(--font-so-display)", "Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        "so-sans": [
          "var(--font-so-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ]
      },
      borderRadius: {
        "mp-card": "1.375rem",
        "mp-pill": "999px"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(23, 49, 43, 0.12)",
        "mp-card": "0 20px 45px -25px rgb(0 0 0 / 0.65), 0 2px 6px rgb(0 0 0 / 0.16)",
        "mp-lift": "0 26px 60px -28px rgb(0 0 0 / 0.75), 0 3px 8px rgb(0 0 0 / 0.2)"
      }
    }
  },
  plugins: [
    // Find My Person: hover styles only on devices with a real pointer, so a tap
    // on a phone doesn't leave an answer looking half-picked.
    plugin(({ addVariant }) => addVariant("mp-hover", "@media (hover: hover) { &:hover }")),
    // StefanOswald.com: the same idea for the main site.
    plugin(({ addVariant }) => addVariant("so-hover", "@media (hover: hover) { &:hover }"))
  ]
};

export default config;
