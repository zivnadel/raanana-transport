module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#21a362',
        secondary: '#ef4444',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
