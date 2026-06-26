import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Especifica el directorio de salida
  },
  base: '/',  // Asegúrate de definir el base correctamente
  server: {
    host: true, // Esto permite acceder desde tu IP local (ej. desde tu celular)
    port: 5173, // Opcional: puedes definir el puerto o dejar que use el predeterminado
  },
});
