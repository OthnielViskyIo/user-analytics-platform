import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UserAnalyticsSDK',
      fileName: 'user-analytics-sdk',
      formats: ['es', 'cjs'],
    },
  },
})
