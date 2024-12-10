import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(1rem)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' }
        },
        'loading': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'toast-in': {
          '0%': { 
            opacity: '0',
            transform: 'translate(-50%, -20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, 0)'
          }
        },
        'bounce-mini': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-2px)' },
          '40%, 80%': { transform: 'translateX(2px)' }
        },
        'gradient-slow': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0.5'
          }
        },
        'shine': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'toast-in': 'toast-in 0.3s ease-out forwards',
        'bounce-mini': 'bounce-mini 1s ease-in-out infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'gradient-slow': 'gradient-slow 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',
      }
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
      },
      'loading': {
        '0%': { transform: 'translateX(-100%)' },
        '50%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(-100%)' }
      },
      'fadeIn': {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' }
      },
      'toast-in': {
        '0%': { transform: 'translateY(-100%) translateX(-50%) scale(0.9)', opacity: '0' },
        '100%': { transform: 'translateY(0) translateX(-50%) scale(1)', opacity: '1' },
      },
      'gradient': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
      },
      'bounce-mini': {
        '0%, 100%': { transform: 'translateY(-10%)' },
        '50%': { transform: 'translateY(0)' },
      },
      'shake': {
        '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
        '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
        '30%, 50%, 70%': { transform: 'translate3d(-2px, 0, 0)' },
        '40%, 60%': { transform: 'translate3d(2px, 0, 0)' },
      },
      'shine': {
        '0%': { backgroundPosition: '200% center' },
        '100%': { backgroundPosition: '-200% center' },
      },
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
        },
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(var(--primary-rgb), 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(var(--primary-rgb), 0.2)',
          },
        },
      })
    },
    require('daisyui')
  ],
} satisfies Config;
