import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows connections from any IP address on the local network
    port: 5000       // Make sure this matches your port
  }
})
