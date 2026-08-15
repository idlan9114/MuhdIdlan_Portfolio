import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'

function fullReloadOnVueChange(): Plugin {
  return {
    name: 'full-reload-on-vue-change',
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.vue')) {
        return
      }

      server.ws.send({
        type: 'full-reload',
        path: '*',
      })

      return []
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    fullReloadOnVueChange(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
