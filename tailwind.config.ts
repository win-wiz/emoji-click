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
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
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
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'toast-in': {
          '0%': { 
            transform: 'translateY(-100%) translateX(-50%) scale(0.9)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0) translateX(-50%) scale(1)',
            opacity: '1'
          }
        },
        'bounce-mini': {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' }
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-2px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(2px, 0, 0)' }
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
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.2' }
        },
        'shine': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        'slideDown': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseGradient: {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'left center',
            'opacity': '0.8'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
            'opacity': '1'
          }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        spinnerRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spinnerRotateReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        spinnerDash: {
          '0%': { 'stroke-dasharray': '1, 150', 'stroke-dashoffset': '0' },
          '50%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-35' },
          '100%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-124' },
        },
        innerCircleColors: {
          '0%': {
            backgroundColor: '#f472b6',
            transform: 'scale(0.8) translateZ(0)',
            opacity: '0.8',
          },
          '12.5%': {
            backgroundColor: '#f472b6',
            transform: 'scale(1) translateZ(0)',
            opacity: '0.7',
          },
          '16.66%': {
            backgroundColor: '#f472b6',
            transform: 'scale(1.2) translateZ(0)',
            opacity: '0.6',
          },
          '33.33%': {
            backgroundColor: '#60a5fa',
            transform: 'scale(1) translateZ(0)',
            opacity: '0.7',
          },
          '45.83%': {
            backgroundColor: '#60a5fa',
            transform: 'scale(0.8) translateZ(0)',
            opacity: '0.8',
          },
          '50%': {
            backgroundColor: '#60a5fa',
            transform: 'scale(1) translateZ(0)',
            opacity: '0.7',
          },
          '66.66%': {
            backgroundColor: '#34d399',
            transform: 'scale(1.2) translateZ(0)',
            opacity: '0.6',
          },
          '79.16%': {
            backgroundColor: '#34d399',
            transform: 'scale(1) translateZ(0)',
            opacity: '0.7',
          },
          '83.33%': {
            backgroundColor: '#34d399',
            transform: 'scale(0.8) translateZ(0)',
            opacity: '0.8',
          },
          '100%': {
            backgroundColor: '#f472b6',
            transform: 'scale(0.8) translateZ(0)',
            opacity: '0.8',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scale-up': 'scale-up 0.2s ease-out',
        'check-mark': 'check-mark 0.4s ease-out',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'toast-in': 'toast-in 0.3s ease-out forwards',
        'bounce-mini': 'bounce-mini 1s ease-in-out infinite',
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'gradient-slow': 'gradient-slow 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',
        'slideDown': 'slideDown 0.2s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulseGradient': 'pulseGradient 3s ease-in-out infinite',
        'scaleUp': 'scaleUp 0.6s ease-out forwards',
        'spinnerRotate': 'spinnerRotate 3s linear infinite',
        'spinnerRotateReverse': 'spinnerRotateReverse 4s linear infinite',
        'spinnerDash': 'spinnerDash 1.5s ease-in-out infinite',
        'innerCircleColors': 'innerCircleColors 6s ease-in-out infinite',
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
    require('tailwindcss-animate'),
    require('daisyui')
  ],
} satisfies Config;
