import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep config minimal and compatible with Vite 5 to avoid esbuild issues
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    cors: {
      origin: '*',
      credentials: true,
    },
    // Allow our preview host domains
    allowedHosts: ['.modal.host', 'localhost', '127.0.0.1'],
  },
})
