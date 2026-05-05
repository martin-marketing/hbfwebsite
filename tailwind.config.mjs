/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          plum:      '#593D58',
          plumMid:   '#7A5577',
          plumDark:  '#3F2C3E',
          sage:      '#A2A47D',
          sageDark:  '#7A7D5E',
          gold:      '#B87B1E',
          goldLight: '#D4973A',
          tintPlum:  '#F5F0F5',
          tintSage:  '#F2F2EA',
          pageBg:    '#F0ECF0',
          ink:       '#222222',
          inkSoft:   '#141413',
        },
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        'h2':      ['clamp(1.75rem, 3.5vw, 3rem)',  { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'h3':      ['clamp(1.25rem, 2.5vw, 2rem)',   { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        content: '1100px',
      },
      spacing: {
        section: 'clamp(4rem, 8vw, 8rem)',
      },
    },
  },
  plugins: [],
};
