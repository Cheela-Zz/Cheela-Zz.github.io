import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/*
 * VITE_BASE controls the URL prefix the site is served from.
 *   user site  (cheela.github.io)          ->  "/"          (the default)
 *   project site (cheela.github.io/site/)  ->  "/site/"
 * Set it in .github/workflows/deploy.yml if you use a project site.
 */
const base = process.env.VITE_BASE || '/'

// GitHub Pages has no server-side rewrite. It serves 404.html for any path it
// does not recognise, so shipping a copy of index.html under that name lets
// deep links like /photos/montreal load the app with the URL intact.
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const index = resolve(__dirname, 'dist/index.html')
      if (existsSync(index)) copyFileSync(index, resolve(__dirname, 'dist/404.html'))
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
  build: {
    assetsInlineLimit: 0,
  },
})
