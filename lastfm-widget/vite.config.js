import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This app is built independently from the portfolio and its output is
// placed at public/lastfm-now-playing/ so it ships as a self-contained
// static build under that path — no shared bundle, styles, or fonts with
// the portfolio app. See ../src/pages/LastfmNowPlaying.jsx for how it's
// mounted (an iframe pointing at this build).
export default defineConfig({
  plugins: [react()],
  base: '/lastfm-now-playing/',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: '../public/lastfm-now-playing',
    emptyOutDir: true,
  },
})
