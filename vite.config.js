import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-server fix: page files (About.jsx, Donate.jsx, …) sit in the project root, and macOS
// ignores capitalization in file names, so loading /about directly made Vite serve About.jsx's
// source instead of the site. Browser page loads (Accept: text/html, no file extension) now
// always get index.html, and React Router shows the right page. Production builds are unaffected.
const pageRequestsGetTheSite = {
  name: 'page-requests-get-the-site',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = (req.url || '').split('?')[0]
      if (req.method === 'GET' && req.headers.accept?.includes('text/html') && !path.extname(url) && !url.startsWith('/@')) {
        req.url = '/index.html'
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), pageRequestsGetTheSite],
})
