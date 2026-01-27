import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

const dynamicRoutes = [
  '/about',
  '/privacy-policy',
  '/terms-of-use',
  '/login'
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://my-lesson-plan-app.netlify.app',
      dynamicRoutes
    })
  ],
})
