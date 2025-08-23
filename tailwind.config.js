/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F5F5F7',
        surface: '#FFFFFF',
        border: '#E6E6EB',
        primary: '#1D1D1F',
        secondary: '#6E6E73',
        accent: '#007AFF',
        danger: '#FF3B30',
        warning: '#FF9F0A',
        success: '#34C759',
      },
    },
  },
  plugins: [],
}