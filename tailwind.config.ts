/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#007BFF", // A vibrant, professional blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6C757D", // A muted gray
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#28A745", // A subtle green for accents/success
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC3545", // A standard red for errors
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F9FA", // A light background gray
          foreground: "#6C757D",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#212529",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#212529",
        },
        // Custom modern palette
        'brand-primary': '#1E3A8A', // Deep blue, professional
        'brand-secondary': '#60A5FA', // Lighter blue accent
        'brand-background': '#F9FAFB', // Light gray background
        'brand-text-dark': '#1F2937', // Dark gray for main text
        'brand-text-light': '#6B7280', // Lighter gray for secondary text
        'brand-border': '#E5E7EB', // Light border color
        'brand-success': '#059669', // Green for success
        'brand-warning': '#F59E0B', // Amber for warnings
        'brand-error': '#EF4444', // Red for errors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
