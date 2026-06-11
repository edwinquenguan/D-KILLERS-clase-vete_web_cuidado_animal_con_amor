/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a7a1a',
          dark:    '#145c14',
          light:   '#e8f5e8',
        },
      },
    },
  },
  plugins: [],
};
