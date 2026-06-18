import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        tccNavy: '#17120c',
        tccDarkNavy: '#0a0806',
        tccDeepBlack: '#030303',
        tccGold: '#f7c600',
        tccLightGold: '#fff1a8',
        tccMutedGold: 'rgba(247, 198, 0, 0.45)',
        tccLightBg: '#14110d',
        tccMutedGray: '#a8a29a',
        tccBorder: 'rgba(255, 255, 255, 0.14)'
      },
      fontFamily: {
        sans: ['Outfit', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        body: ['Outfit', 'Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
