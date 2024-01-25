/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['pastel', 'night', 'forest', 'retro', 'coffee', 'acid', 'bumblebee', 'sunset', 'autumn', 'winter', 'dracula']
  }
};
