/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif JP"', '"Source Han Serif SC"', '"SimSun"', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Noto Serif JP"', 'serif'],
      },
      colors: {
        'anemoi-bg': 'var(--color-bg)',
        'anemoi-text': 'var(--color-text)',
        'anemoi-muted': 'var(--color-muted)',
        'anemoi-accent': 'var(--color-accent)',
        'anemoi-deep': 'var(--color-deep)',
        'anemoi-lavender': 'var(--color-lavender)',
        'anemoi-warm': 'var(--color-warm)',
        'anemoi-ivory': 'var(--color-ivory)',
        'anemoi-sky': 'var(--color-sky)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
        'petal-fall': 'petalFall 12s linear infinite',
        'petal-drift': 'petalDrift 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) translateX(30px) rotate(360deg)', opacity: '0' },
        },
        petalDrift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
