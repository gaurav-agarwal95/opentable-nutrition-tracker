import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base must match the GitHub Pages repo path: https://<user>.github.io/<repo>/
export default defineConfig({
  base: '/opentable-nutrition-tracker/',
  plugins: [react()],
})
