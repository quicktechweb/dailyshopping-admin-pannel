import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // allow network access
    port: 5173,      // optional, default port
    strictPort: false // use another port if 5173 is busy
  }
})
