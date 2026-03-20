import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-purple": "hsl(var(--accent-purple))",
        "accent-cyan": "hsl(var(--accent-cyan))",
        "accent-emerald": "hsl(var(--accent-emerald))",
        "accent-amber": "hsl(var(--accent-amber))",
        "accent-rose": "hsl(var(--accent-rose))",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1.25rem",
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "apple": "var(--shadow-card)",
        "apple-hover": "var(--shadow-card-hover)",
        "glow-blue": "0 0 60px -12px hsla(224, 76%, 48%, 0.3)",
        "glow-purple": "0 0 60px -12px hsla(262, 83%, 58%, 0.3)",
      },
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        "250": "250ms",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "stroke-draw": {
          "to": { strokeDashoffset: "0" },
        },
        "spin-slow": {
          "to": { transform: "rotate(360deg)" },
        },
        "grow-up": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "dot-pulse": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        "orb-float-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
        },
        "orb-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-25px, 20px) scale(0.95)" },
          "66%": { transform: "translate(20px, -10px) scale(1.05)" },
        },
        "orb-float-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(15px, 25px) scale(1.03)" },
          "66%": { transform: "translate(-30px, -15px) scale(0.97)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "stroke-draw": "stroke-draw 1.5s ease-out forwards",
        "spin-slow": "spin-slow 8s linear infinite",
        "grow-up": "grow-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "fade-in-scale": "fade-in-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        "dot-pulse": "dot-pulse 1.5s ease-in-out infinite",
        "orb-float-1": "orb-float-1 8s ease-in-out infinite",
        "orb-float-2": "orb-float-2 10s ease-in-out infinite",
        "orb-float-3": "orb-float-3 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
