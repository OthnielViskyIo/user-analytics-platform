import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'UserAnalytics',
      fileName: 'analytics',
      formats: ['iife'],
    },
    minify: 'terser',
  },
})
