/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1800px',
        '4xl': '2200px',
      },
      fontSize: {
        md: ["16px", "24px"],
      },
      colors: {
        'primary': colors.gray[700],
        'primary-light': colors.gray[600],
        'primary-lighter': colors.gray[100],
        'primary-lightest': colors.gray[50],
        'primary-dark': colors.gray[800],
      }
    },
  },
  plugins: [],
};