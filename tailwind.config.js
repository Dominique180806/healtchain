/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#221669', // Bleu royal
        secondary: '#1b8763',
      },
    },
  },
  plugins: [],
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'scale(0.95)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
    },
  }
}

