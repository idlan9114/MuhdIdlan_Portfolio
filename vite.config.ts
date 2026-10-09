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

function serveDecapAdminIndex(): Plugin {
  return {
    name: 'serve-decap-admin-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin/index.html'
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    fullReloadOnVueChange(),
    serveDecapAdminIndex(),
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
