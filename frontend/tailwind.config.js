/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "300px", // Customize the width for `xs`
      },
    },
  },
  darkMode: 'class', // Add this line to enable dark mode using the 'class' strategy
  plugins: [],
}
