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
        'primary-light-1x': colors.gray[400],
        'primary-light-2x': colors.gray[300],
        'primary-light-3x': colors.gray[200],
        'primary-lighter': colors.gray[100],
        'primary-lightest': colors.gray[50],
        'primary-dark': colors.gray[800],
        'success': colors.green[600],
        'error': colors.red[700],
        'error-light': colors.red[600],
      }
    },
  },
  plugins: [],
};