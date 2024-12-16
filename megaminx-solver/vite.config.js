import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}) 