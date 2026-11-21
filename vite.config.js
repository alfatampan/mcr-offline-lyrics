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
        start_url: '/mcr-offline-lyrics/',
        scope: '/mcr-offline-lyrics/',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: '/mcr-offline-lyrics/icons/mcr-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/mcr-offline-lyrics/icons/mcr-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,json,ttf}'],
        maximumFileSizeToCacheInBytes: 10485760,
      },
    }),
  ],
})
