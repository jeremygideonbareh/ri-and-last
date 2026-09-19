import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Served from GitHub Pages at /ri-and-last/
export default defineConfig({
  base: '/ri-and-last/',
  plugins: [react(), tailwindcss()],
})
