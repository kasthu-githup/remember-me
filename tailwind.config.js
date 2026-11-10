/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#080808',
          secondary: '#151515',
          card: '#191919',
          cardHover: '#222222',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D76E',
          dark: '#AA820A',
          muted: 'rgba(212, 175, 55, 0.15)',
          border: 'rgba(212, 175, 55, 0.28)',
          glow: 'rgba(212, 175, 55, 0.4)',
        },
        luxury: {
          text: '#FFFFFF',
          secondary: '#B8B8B8',
          muted: '#7A7A7A',
        }
      },
      fontSize: {
        'main-head': ['26px', { lineHeight: '34px', fontWeight: '800' }],
        'section-head': ['21px', { lineHeight: '28px', fontWeight: '700' }],
        'card-head': ['17px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'nav': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'btn': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'input': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px -2px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 0 25px -4px rgba(212, 175, 55, 0.35)',
        'gold-card': '0 8px 30px -6px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(212, 175, 55, 0.2)',
        'gold-card-hover': '0 12px 35px -4px rgba(0, 0, 0, 0.95), 0 0 2px 1px rgba(245, 215, 110, 0.4)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.25)', boxShadow: '0 0 15px -3px rgba(212, 175, 55, 0.2)' },
          '50%': { borderColor: 'rgba(245, 215, 110, 0.55)', boxShadow: '0 0 25px 0px rgba(212, 175, 55, 0.45)' },
        }
      }
    },
  },
  plugins: [],
}
