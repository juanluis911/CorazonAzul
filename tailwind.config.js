/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Colores específicos para MenteAzul y TEA
      colors: {
        // Paleta principal de MenteAzul
        'azul-primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Colores de apoyo para autismo/TEA
        'tea-verde': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'tea-naranja': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Colores accesibles y suaves
        'suave': {
          'gris': '#f8fafc',
          'azul': '#e0f2fe',
          'verde': '#f0fdf4',
          'amarillo': '#fffbeb',
          'rosa': '#fdf2f8',
          'purpura': '#faf5ff',
        },
        // Colores para estados emocionales
        'emocion': {
          'feliz': '#fef3c7',
          'triste': '#dbeafe',
          'enojado': '#fecaca',
          'sorprendido': '#e0e7ff',
          'miedo': '#f3e8ff',
          'neutro': '#f1f5f9',
        }
      },
      
      // Tipografía adaptada para accesibilidad
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      // Tamaños de fuente accesibles
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        
        // Tamaños específicos para diferentes necesidades
        'teen': ['1.125rem', { lineHeight: '1.7' }],  // Para adolescentes
        'child': ['1.25rem', { lineHeight: '1.8' }],   // Para niños
        'large-print': ['1.5rem', { lineHeight: '1.8' }], // Para baja visión
      },
      
      // Espaciado mejorado para accesibilidad
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '11': '2.75rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '21': '5.25rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '36': '9rem',
        '44': '11rem',
        '52': '13rem',
        '60': '15rem',
        '68': '17rem',
        '76': '19rem',
        '84': '21rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '144': '36rem',
        '152': '38rem',
        '160': '40rem',
        '168': '42rem',
        '176': '44rem',
        '184': '46rem',
        '192': '48rem',
        '200': '50rem',
      },
      
      // Radios de borde suaves y amigables
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        'full': '9999px',
        
        // Específicos para elementos de juego
        'button': '0.75rem',
        'card': '1rem',
        'modal': '1.5rem',
        'game': '2rem',
      },
      
      // Sombras suaves y accesibles
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        
        // Sombras específicas para elementos interactivos
        'button': '0 4px 14px 0 rgba(0, 118, 255, 0.15)',
        'button-hover': '0 6px 20px rgba(0, 118, 255, 0.23)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'game-piece': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'success': '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
        'warning': '0 4px 14px 0 rgba(251, 146, 60, 0.15)',
        'error': '0 4px 14px 0 rgba(239, 68, 68, 0.15)',
      },
      
      // Animaciones y transiciones suaves
      animation: {
        'none': 'none',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        
        // Animaciones específicas para juegos y TEA
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'success-pop': 'success-pop 0.5s ease-out',
        'error-shake': 'error-shake 0.5s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      // Keyframes para animaciones personalizadas
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'success-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'error-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      
      // Tamaños de pantalla específicos para el proyecto
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        
        // Breakpoints específicos para tablets y dispositivos de terapia
        'tablet': '768px',
        'tablet-lg': '1024px',
        'desktop': '1280px',
        'wide': '1536px',
      },
    },
  },
  plugins: [
    // Plugin para animaciones adicionales
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Utilidades para accesibilidad
        '.focus-visible': {
          outline: '2px solid ' + theme('colors.azul-primary.500'),
          outlineOffset: '2px',
        },
        '.sr-only-focusable': {
          '&:focus': {
            position: 'static',
            width: 'auto',
            height: 'auto',
            padding: 'inherit',
            margin: 'inherit',
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
          },
        },
        
        // Utilidades para reducir movimiento
        '.reduce-motion': {
          '@media (prefers-reduced-motion: reduce)': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
        
        // Utilidades para modo alto contraste
        '.high-contrast': {
          '@media (prefers-contrast: high)': {
            borderWidth: '2px',
            borderColor: theme('colors.gray.900'),
          },
        },
        
        // Utilidades para elementos de juego
        '.game-button': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.button-hover'),
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme('boxShadow.button'),
          },
        },
        
        '.game-card': {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
  
  // Configuración para modo oscuro y otros modos
  darkMode: 'class', // Permite toggle manual del modo oscuro
  
  // Configuración adicional para accesibilidad
  corePlugins: {
    // Mantener todos los plugins core habilitados para máxima flexibilidad
  },
}