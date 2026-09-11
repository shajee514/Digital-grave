import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces — the cemetery at night.
        void: '#050506',
        soil: '#0a0a0c',
        stone: '#121216',
        granite: '#1a1a20',
        moss: '#26262f',
        ash: '#8b8b99',
        bone: '#e8e8ee',

        // State colors — the heart of the product.
        alive: { DEFAULT: '#22e07a', dim: '#0e6b3a', glow: '#22e07a' },
        dead: { DEFAULT: '#ff4d5e', dim: '#7a1f2a', glow: '#ff4d5e' },
        reborn: { DEFAULT: '#a06bff', dim: '#4a2b8a', glow: '#a06bff' },
        legendary: { DEFAULT: '#ffc94d', dim: '#8a6a12', glow: '#ffc94d' },
        ghost: { DEFAULT: '#7fd4ff', dim: '#1f5a7a', glow: '#7fd4ff' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-alive': '0 0 24px -4px rgba(34,224,122,0.45)',
        'glow-dead': '0 0 24px -4px rgba(255,77,94,0.45)',
        'glow-reborn': '0 0 24px -4px rgba(160,107,255,0.45)',
        'glow-legendary': '0 0 24px -4px rgba(255,201,77,0.45)',
        engraved: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.45' },
          '55%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%) translateY(0)', opacity: '0' },
          '20%': { opacity: '0.35' },
          '80%': { opacity: '0.35' },
          '100%': { transform: 'translateX(110%) translateY(-14px)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Celebrity Graveyard: slow drifting fog banks.
        fog: {
          '0%': { transform: 'translateX(-30%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateX(30%)', opacity: '0' },
        },
        // Celebrity Graveyard: bobbing, fading ghosts.
        ghost: {
          '0%,100%': { transform: 'translateY(0) translateX(0)', opacity: '0.35' },
          '25%': { opacity: '0.85' },
          '50%': { transform: 'translateY(-18px) translateX(8px)', opacity: '0.6' },
          '75%': { opacity: '0.85' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
        flicker: 'flicker 4s ease-in-out infinite',
        drift: 'drift 18s linear infinite',
        shimmer: 'shimmer 1.8s infinite',
        fog: 'fog 22s ease-in-out infinite',
        ghost: 'ghost 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
