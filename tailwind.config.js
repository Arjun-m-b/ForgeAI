/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#08080f',
          surface: '#12121f',
          border: '#1e1e3a',
          accent: '#6366f1',
          'accent-hover': '#4f46e5',
          cyan: '#22d3ee',
          'text-primary': '#f0f0ff',
          'text-secondary': '#8888aa',
          success: '#10b981',
          error: '#ef4444',
        },
        style: {
          medieval: '#8b5cf6',
          cyberpunk: '#22d3ee',
          cartoon: '#f472b6',
          pbr: '#10b981',
          voxel: '#f59e0b',
          scifi: '#6366f1',
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", 'sans-serif'],
        body: ["var(--font-inter)", 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
