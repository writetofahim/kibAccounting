/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily:{
      'sans': ['Nunito', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          '100':"#7695EA",
          '200':"#5D82EA",
          '300':"#426EE7",
          '400':"#2C5DE6",
          '500':"#1A50E7",
        },
        secondary: "red",
      },
    },
  },
  plugins: [],
};
