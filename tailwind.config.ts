import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
    animation: {
      'fade-in': 'fade-in 0.2s ease-out',
      'scale-up': 'scale-up 0.2s ease-out',
      'check-mark': 'check-mark 0.4s ease-out',
      'pulse-slow': 'pulse-slow 2s ease-in-out infinite'
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      },
      'scale-up': {
        '0%': { transform: 'scale(0.8)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      },
      'check-mark': {
        '0%': { transform: 'scale(0.5)', opacity: '0' },
        '50%': { transform: 'scale(1.2)' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      },
      'pulse-slow': {
        '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
        '50%': { transform: 'scale(1.1)', opacity: '0.2' }
      }
    }
  },
  plugins: [ 
    // 添加自定义工具类来隐藏滚动条
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    },
    require('daisyui')
  ],
} satisfies Config;
