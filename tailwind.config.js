/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        primary: "#000000",
        secondary: "#F7A346",
        tertiary: "#99a0a3",
        border: "#1a2e35",
        background: "#ffffff",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
