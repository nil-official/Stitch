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
        'primary-900': colors.gray[900],
        'primary-800': colors.gray[800],
        'primary-700': colors.gray[700],
        'primary-600': colors.gray[600],
        'primary-500': colors.gray[500],
        'primary-400': colors.gray[400],
        'primary-300': colors.gray[300],
        'primary-200': colors.gray[200],
        'primary-100': colors.gray[100],
        'primary-50': colors.gray[50],
        'success-900': colors.green[900],
        'success-800': colors.green[800],
        'success-700': colors.green[700],
        'success-600': colors.green[600],
        'success-500': colors.green[500],
        'success-400': colors.green[400],
        'success-300': colors.green[300],
        'success-200': colors.green[200],
        'success-100': colors.green[100],
        'success-50': colors.green[50],
        'error-900': colors.red[900],
        'error-800': colors.red[800],
        'error-700': colors.red[700],
        'error-600': colors.red[600],
        'error-500': colors.red[500],
        'error-400': colors.red[400],
        'error-300': colors.red[300],
        'error-200': colors.red[200],
        'error-100': colors.red[100],
        'error-50': colors.red[50],
      }
    },
  },
  plugins: [],
};