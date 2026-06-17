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
        tccNavy: '#1F3352',
        tccDarkNavy: '#071427',
        tccDeepBlack: '#020b17',
        tccGold: '#cd9b2c',
        tccLightGold: '#e0b249',
        tccMutedGold: 'rgba(205, 155, 44, 0.45)',
        tccLightBg: '#f7f4f0',
        tccMutedGray: '#6B6B6B',
        tccBorder: '#E5E5E5'
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
