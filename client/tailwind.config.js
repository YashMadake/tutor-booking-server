/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          surface: '#12121a',
          elevated: '#1a1a25',
        },
        border: {
          DEFAULT: '#26263a',
          hover: '#3a3a55',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          glow: 'rgba(99, 102, 241, 0.4)',
        },
        text: {
          DEFAULT: '#e5e7eb',
          muted: '#9ca3af',
          dim: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.15)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 50%)',
      },
    },
  },
  plugins: [],
};