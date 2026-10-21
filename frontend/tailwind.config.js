/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0e17',
          card: '#111827',
          cardHover: '#172033',
          border: '#1e293b',
          muted: '#94a3b8',
          accent: '#06b6d4',      // cyan
          accentHover: '#0891b2',
          glow: 'rgba(6, 182, 212, 0.15)',
          red: '#f43f5e',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#10b981',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'danger-glow': '0 0 20px -5px rgba(244, 63, 94, 0.3)',
      }
    },
  },
  plugins: [],
}
