/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
// console.log(colors)
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,tsx}",
    "./formkit.config.js", // Para que ahora también se compilen las clases en este archivo
    "./node_modules/vue-tailwind-datepicker/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.indigo
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

