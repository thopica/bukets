import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        'shot-clock': ['Seven Segment', 'monospace'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '24px' }],
        'small': ['14px', { lineHeight: '20px' }],
        'micro': ['12px', { lineHeight: '16px' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        orange: {
          DEFAULT: "hsl(var(--orange))",
          hover: "hsl(var(--orange-hover))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          bright: "hsl(var(--gold-bright))",
          foreground: "hsl(var(--accent-gold-foreground))",
        },
        timerWarning: "hsl(var(--timer-warning))",
        warning: {
          DEFAULT: "hsl(var(--timer-warning))",
          dark: "hsl(var(--warning-dark))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
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
          muted: "hsl(var(--card-muted))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          foreground: "hsl(var(--success-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        badge: {
          lavender: "hsl(var(--badge-lavender))",
          text: "hsl(var(--badge-text))",
        },
        nav: {
          DEFAULT: "hsl(var(--nav-default))",
          hover: "hsl(var(--nav-hover))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          onDark: "hsl(var(--text-on-dark))",
        },
        icon: {
          muted: "hsl(var(--icon-muted))",
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
      },
      borderRadius: {
        'button': 'var(--radius-button)',
        'card': 'var(--radius-card)',
        'input': 'var(--radius-input)',
        'small': 'var(--radius-small)',
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'elevated': 'var(--shadow-elevated)',
        'floating': 'var(--shadow-floating)',
        'pressed': 'var(--shadow-pressed)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        "shake-horizontal": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-8px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(8px)" }
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" }
        },
        "score-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "correct-answer": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.05) rotate(0.5deg)" },
          "50%": { transform: "scale(1.05) rotate(-0.5deg)" },
          "75%": { transform: "scale(1.05) rotate(0.5deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "green-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 217, 165, 0)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(0, 217, 165, 0.6)" },
        },
        "red-flash": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(255, 71, 87, 0.2)" },
        },
        "score-fly-up": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-30px) scale(0.8)", opacity: "0" },
        },
        "pulse-urgency": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "pulse-urgency-fast": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "count-up": {
          "0%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "0.85" },
        },
        "spring-bounce": {
          "0%": { transform: "scale(0.97)", opacity: "0.8" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.15s ease-in",
        "scale-in": "scale-in 0.15s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "bounce-in": "bounce-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "shake": "shake 0.3s ease-in-out",
        "shake-horizontal": "shake-horizontal 1.5s ease-in-out",
        "spring-bounce": "spring-bounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "scale-pulse": "scale-pulse 0.4s ease-in-out",
        "score-bounce": "score-bounce 0.3s ease-out",
        "correct-answer": "correct-answer 0.5s ease-out",
        "green-glow": "green-glow 0.3s ease-out",
        "red-flash": "red-flash 0.2s ease-out",
        "score-fly-up": "score-fly-up 0.6s ease-out forwards",
        "pulse-urgency": "pulse-urgency 1s ease-in-out infinite",
        "pulse-urgency-fast": "pulse-urgency-fast 0.5s ease-in-out infinite",
        "flicker": "flicker 0.3s ease-in-out",
        "count-up": "count-up 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "confetti": "confetti 0.8s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
