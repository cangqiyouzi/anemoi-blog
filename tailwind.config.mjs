/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

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
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};
