import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,   // Ensure it matches the exposed port in the Dockerfile
    host: '0.0.0.0',  // This allows the server to be accessed externally (e.g., from Docker container)
  },
});
