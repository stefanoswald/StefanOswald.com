import type { Config } from "tailwindcss";

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
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(23, 49, 43, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
