import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg))",
        foreground: "rgb(var(--text))",
        
        // Design system color tokens
        primary: {
          DEFAULT: "rgb(var(--primary))",
          50: "rgb(var(--primary-50))",
          100: "rgb(var(--primary-100))",
          200: "rgb(var(--primary-200))",
          300: "rgb(var(--primary-300))",
          400: "rgb(var(--primary-400))",
          500: "rgb(var(--primary-500))",
          600: "rgb(var(--primary-600))",
          700: "rgb(var(--primary-700))",
          800: "rgb(var(--primary-800))",
          900: "rgb(var(--primary-900))",
          950: "rgb(var(--primary-950))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          50: "rgb(var(--secondary-50))",
          100: "rgb(var(--secondary-100))",
          200: "rgb(var(--secondary-200))",
          300: "rgb(var(--secondary-300))",
          400: "rgb(var(--secondary-400))",
          500: "rgb(var(--secondary-500))",
          600: "rgb(var(--secondary-600))",
          700: "rgb(var(--secondary-700))",
          800: "rgb(var(--secondary-800))",
          900: "rgb(var(--secondary-900))",
          950: "rgb(var(--secondary-950))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          50: "rgb(var(--accent-50))",
          100: "rgb(var(--accent-100))",
          200: "rgb(var(--accent-200))",
          300: "rgb(var(--accent-300))",
          400: "rgb(var(--accent-400))",
          500: "rgb(var(--accent-500))",
          600: "rgb(var(--accent-600))",
          700: "rgb(var(--accent-700))",
          800: "rgb(var(--accent-800))",
          900: "rgb(var(--accent-900))",
          950: "rgb(var(--accent-950))",
        },
        
        // Semantic colors
        success: "rgb(var(--success))",
        warning: "rgb(var(--warning))",
        error: "rgb(var(--error))",
        info: "rgb(var(--info))",
        
        // Surface and layout colors
        surface: "rgb(var(--surface))",
        "surface-elevated": "rgb(var(--surface-elevated))",
        bg: "rgb(var(--bg))",
        
        // Text colors
        text: "rgb(var(--text))",
        "text-secondary": "rgb(var(--text-secondary))",
        "text-muted": "rgb(var(--text-muted))",
        "secondary-text": "rgb(var(--text-secondary))",
        
        // Border and input colors
        border: "rgb(var(--border))",
        "border-muted": "rgb(var(--border-muted))",
        input: "rgb(var(--surface))",
        ring: "rgb(var(--primary))",
        
        // Legacy compatibility
        muted: {
          DEFAULT: "rgb(var(--text-muted))",
          foreground: "rgb(var(--text-secondary))",
        },
        destructive: {
          DEFAULT: "rgb(var(--error))",
          foreground: "white",
        },
        
        // Chart colors for data visualization
        chart: {
          1: "rgb(var(--primary))",
          2: "rgb(var(--accent))",
          3: "rgb(var(--warning))",
          4: "rgb(var(--info))",
          5: "rgb(var(--error))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;