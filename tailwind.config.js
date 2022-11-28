/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'title':'Raleway',
        'body': 'Roboto'
      },
      colors: {
        'nps-darkGreen': '#16411A',
        'nps-lightGreen': '#297A31',
        'nps-darkBrown': '#99542C',
        'nps-lightBrown': '#EF8549'
      },
      screens: {
        xs: '525px',
        mobile: '375px'
      }
    },
  },
  plugins: [],
}
