import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/patitas-perdidas/', // <--- AGREGA ESTO (Debe ser el nombre de tu repositorio entre barras)
})