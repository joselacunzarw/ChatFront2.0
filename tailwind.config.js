/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004A87',
          light: '#0066CC',
          dark: '#003A6B'
        },
        secondary: {
          DEFAULT: '#F39200',
          light: '#FFB84D',
          dark: '#CC7A00'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}