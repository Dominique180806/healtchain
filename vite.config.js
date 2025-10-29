import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Permet d'importer avec '@/...' au lieu de '../../'
    },
  },
  server: {
    port: 5173,          // Port fixe
    open: false,         // NE PAS ouvrir le navigateur automatiquement (pour éviter spawn EPERM)
    proxy: {
      // Proxy vers le backend Node.js si nécessaire
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  define: {
    'process.env': {},   // Évite l'erreur "process is not defined" dans React
  },
});
