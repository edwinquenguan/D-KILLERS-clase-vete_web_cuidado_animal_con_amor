/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2c7a7b',
          dark: '#285e61',
        },
        portal: {
          50:  '#fdf6ec',
          100: '#fce8cc',
          500: '#e07c27',
          600: '#c96a18',
          700: '#a85512',
        },
      },
    },
  },
  plugins: [],
};
