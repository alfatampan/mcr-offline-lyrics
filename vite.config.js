import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mcr-offline-lyrics/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['data/mcr-lyrics-complete.json'],
      manifest: {
        name: 'MCR Offline Lyrics',
        short_name: 'MCR Lyrics',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,json,ttf}'],
        maximumFileSizeToCacheInBytes: 10485760,
      },
    }),
  ],
})
