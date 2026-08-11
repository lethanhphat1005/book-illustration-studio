/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          orange: '#ff6a00',
          rose: '#f43f5e',
          purple: '#9333ea',
          glass: 'rgba(255, 255, 255, 0.7)',
        }
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}