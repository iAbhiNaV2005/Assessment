/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#FBF9FA',
          dark: '#141017',
        },
        surface: {
          light: '#F3EEF1',
          dark: '#1C1621',
          card: {
            light: 'rgba(255, 255, 255, 0.75)',
            dark: 'rgba(28, 22, 33, 0.75)'
          }
        },
        ink: {
          DEFAULT: '#221A20',
          dark: '#EEE6EA',
          muted: '#6E6069',
          'muted-dark': '#A99DA5',
        },
        plum: {
          50: '#FBF4F8',
          100: '#F5E6F0',
          200: '#EBD0E3',
          300: '#DCB0CF',
          400: '#C787B6',
          500: '#AE639B',
          600: '#90477D',
          700: '#753564',
          800: '#5C2B4E',
          900: '#4B2440',
          950: '#2A1124',
        },
        rule: {
          light: '#E2D9DE',
          dark: '#33293A',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)',
        'glass-lg': '0 16px 48px -8px rgba(0, 0, 0, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      },
    },
  },
  plugins: [],
}
