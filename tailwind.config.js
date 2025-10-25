/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.tsx"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paleta de colores AXIA SmartPark
        axia: {
          // Negro principal
          black: '#0F1115',
          // Gris oscuro (para fondos de cards)
          'dark-gray': '#1F2937',
          'darkGray': '#2C2C2C',
          // Gris medio
          gray: '#8C8C8C',
          // Gris claro (para textos secundarios)
          'gray-light': '#9CA3AF',
          'gray-dark': '#374151',
          // Blanco
          white: '#FFFFFF',
          // Verde principal
          green: '#006B54',
          // Verde lima (accent)
          lime: '#A3E636',
          // Púrpura principal
          purple: '#780BB7',
          // Azul principal
          blue: '#093774',
        },
                
        // Estados y alertas usando tus colores
        success: '#268D65',
        warning: '#f59e0b',
        error: '#dc2626',
        info: '#093774',
        
        // Colores específicos para parking
        parking: {
          available: '#268D65',   // Verde de tu paleta
          occupied: '#dc2626',    // Rojo
          reserved: '#f59e0b',    // Amarillo
          disabled: '#8C8C8C',    // Gris de tu paleta
        }
      },
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Fuentes personalizadas 
      fontFamily: {
        'primary': ['Inter-Regular', 'sans-serif'],
        'primaryBold': ['Inter-SemiBold', 'sans-serif'],
        'secondary': ['Poppins-Bold', 'sans-serif'],
        'secondaryMedium': ['Poppins-Medium', 'sans-serif'],
      },
      // Bordes redondeados personalizados
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Sombras personalizadas
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}