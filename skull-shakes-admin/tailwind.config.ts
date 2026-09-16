import type { Config } from "tailwindcss";



const config: Config = {

  darkMode: "class",

  content: [

    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

  ],

  theme: {

    extend: {

      colors: {

        background: "#0a0a0a",

        surface: "#111111",

        border: "#1f1f1f",

        foreground: "#f5f5f5",

        accent: {

          DEFAULT: "#7c3aed",

          foreground: "#ffffff",

          50: "#f5f3ff",

          100: "#ede9fe",

          200: "#ddd6fe",

          300: "#c4b5fd",

          400: "#a78bfa",

          500: "#8b5cf6",

          600: "#7c3aed",

          700: "#6d28d9",

          800: "#5b21b6",

          900: "#4c1d95",

        },

        muted: {

          DEFAULT: "#1a1a1a",

          foreground: "#a1a1aa",

        },

        destructive: {

          DEFAULT: "#ef4444",

          foreground: "#ffffff",

        },

        card: {

          DEFAULT: "#111111",

          foreground: "#f5f5f5",

        },

        popover: {

          DEFAULT: "#111111",

          foreground: "#f5f5f5",

        },

        primary: {

          DEFAULT: "#7c3aed",

          foreground: "#ffffff",

        },

        secondary: {

          DEFAULT: "#1a1a1a",

          foreground: "#f5f5f5",

        },

        input: "#1f1f1f",

        ring: "#7c3aed",

      },

      fontFamily: {

        sans: ["Inter", "sans-serif"],

      },

      borderRadius: {

        lg: "0.75rem",

        md: "0.5rem",

        sm: "0.25rem",

      },

    },

  },

  plugins: [require("tailwindcss-animate")],

};



export default config;
