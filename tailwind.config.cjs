/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1DB954',
          hover: '#1ED760',
        },
        app: {
          bg: '#121212',
          surface: '#181818',
          hover: '#282828',
          border: '#282828',
          muted: '#B3B3B3',
          text: '#FFFFFF',
          fg: '#121212',
          focus: '#3b82f6',
        },
      },
      boxShadow: {
        card: '0 4px 14px rgba(0,0,0,0.25)',
        soft: '0 2px 8px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
