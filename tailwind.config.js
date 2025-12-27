/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          salmon: '#FF8B8B',  // Color del botón PERDÍ (rojo suave)
          menta: '#84DCC6',   // Color del botón ENCONTRÉ (verde menta)
          text: '#2D3436',    // Gris oscuro para textos principales
          gray: '#A0A0A0',    // Gris claro para textos secundarios e iconos
          bg: '#F8F9FA',      // Fondo gris muy claro de la app
          active: '#E67E22',  // Color naranja oscuro para el ícono activo del menú
          phone: '#1A1A1A',   // Color del borde del teléfono (negro casi puro)
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)', // Sombra muy suave para las tarjetas
      }
    },
  },
  plugins: [],
}