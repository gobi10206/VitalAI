/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vital: {
          dark: '#0f172a',
          card: '#1e293b',
          teal: '#0d9488',
          emerald: '#10b981',
          amber: '#f59e0b',
          orange: '#f97316',
          crimson: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
