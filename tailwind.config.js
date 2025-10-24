/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1B5E20',
        'primary-dark': '#103E14',
        secondary: '#FFD54F',
        accent: '#33691E',
        neutral: '#F4F7F3',
      },
    },
  },
  plugins: [],
};
