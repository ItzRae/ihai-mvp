/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primaryDarkBlue: "rgb(35, 61, 149)",     // #233d95
          primaryTeal: "rgb(26, 148, 170)",    
          lightTeal: "rgb(147, 205, 219)",    // #1a94aa
          secondaryDarkBlue: "rgb(19, 86, 137)",   // auth hero dark blue
        },
        fontFamily: {
          mont: ["Mont", "ui-sans-serif", "system-ui"],
        },
      },
    },
    plugins: []
  };