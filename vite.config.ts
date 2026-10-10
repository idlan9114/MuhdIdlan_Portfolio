import { fileURLToPath, URL } from 'node:url'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

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
  const uploadsRoot = fileURLToPath(new URL('./public/uploads', import.meta.url))
  const publicRoot = fileURLToPath(new URL('./public', import.meta.url))

  const isInside = (root: string, target: string) => {
    const rel = relative(root, target)
    return rel === '' || (!rel.startsWith('..') && !resolve(rel).startsWith('..'))
  }

  const safeUploadPath = (publicPath: string) => {
    const normalized = publicPath
      .split('?')[0]
      .split('#')[0]
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^public\/uploads\/?/, 'uploads/')
      .replace(/^uploads$/, 'uploads/')

    if (!normalized.startsWith('uploads/')) {
      throw new Error('Media path must stay inside public/uploads')
    }

    const target = resolve(publicRoot, normalized)

    if (!isInside(uploadsRoot, target)) {
      throw new Error('Media path must stay inside public/uploads')
    }

    return target
  }

  const walkUploads = (dir = uploadsRoot) => {
    const entries = readdirSync(dir, { withFileTypes: true })
    const folders: string[] = []
    const files: Array<{ name: string; path: string; url: string; folder: string; type: string }> = []

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relPath = relative(uploadsRoot, fullPath).split(sep).join('/')

      if (entry.isDirectory()) {
        folders.push(relPath)
        const child = walkUploads(fullPath)
        folders.push(...child.folders)
        files.push(...child.files)
        continue
      }

      if (entry.isFile()) {
        const urlPath = `/uploads/${relPath}`
        files.push({
          name: entry.name,
          path: `public${urlPath}`,
          url: urlPath,
          folder: dirname(relPath) === '.' ? '' : dirname(relPath).replace(/\\/g, '/'),
          type: extname(entry.name).replace('.', '').toLowerCase(),
        })
      }
    }

    return { folders, files }
  }

  return {
    name: 'serve-decap-admin-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin') {
          res.statusCode = 302
          res.setHeader('Location', '/admin/')
          res.end()
          return
        }

        if (req.url === '/admin/') {
          req.url = '/admin/index.html'
        }

        if (req.url === '/admin/config.yml') {
          const configPath = fileURLToPath(new URL('./public/admin/config.yml', import.meta.url))
          const productionConfig = readFileSync(configPath, 'utf8')
          const localConfig = productionConfig.replace(
            /backend:\r?\n  name: git-gateway\r?\n  branch: main/,
            'backend:\n  name: proxy\n  proxy_url: http://localhost:8081/api/v1\n  branch: main',
          ).replace(
            'show_preview_links: false',
            'show_preview_links: false\n\nmedia_library:\n  name: folder-aware-local',
          )

          res.setHeader('Content-Type', 'text/yaml')
          res.end(localConfig)
          return
        }

        if (req.url?.startsWith('/admin/media-api/list')) {
          try {
            const media = walkUploads()

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(media))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to list media' }))
          }

          return
        }

        if (req.url?.startsWith('/admin/media-api/upload') && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body) as { folder?: string; name?: string; dataUrl?: string }

              if (!payload.name || !payload.dataUrl) {
                throw new Error('Missing upload filename or data')
              }

              const safeName = payload.name.replace(/[^\w.\- ]+/g, '-')
              const folder = (payload.folder ?? '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
              const publicPath = `uploads/${folder ? `${folder}/` : ''}${safeName}`
              const target = safeUploadPath(publicPath)
              const base64 = payload.dataUrl.split(',')[1]

              if (!base64) {
                throw new Error('Upload data is invalid')
              }

              mkdirSync(dirname(target), { recursive: true })
              writeFileSync(target, Buffer.from(base64, 'base64'))

              const relPath = relative(uploadsRoot, target).split(sep).join('/')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ path: `public/uploads/${relPath}`, url: `/uploads/${relPath}` }))
            } catch (error) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to upload media' }))
            }
          })

          return
        }

        if (req.url?.startsWith('/admin/media-api/folder') && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body) as { parent?: string; name?: string }

              if (!payload.name) {
                throw new Error('Missing folder name')
              }

              const safeName = payload.name
                .trim()
                .replace(/\\/g, '/')
                .replace(/^\/+|\/+$/g, '')
                .split('/')
                .map(part => part.replace(/[^\w.\- ]+/g, '-').trim())
                .filter(Boolean)
                .join('/')

              if (!safeName) {
                throw new Error('Folder name is invalid')
              }

              const parent = (payload.parent ?? '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
              const publicPath = `uploads/${parent ? `${parent}/` : ''}${safeName}`
              const target = safeUploadPath(publicPath)

              mkdirSync(target, { recursive: true })

              const relPath = relative(uploadsRoot, target).split(sep).join('/')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ folder: relPath }))
            } catch (error) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to create folder' }))
            }
          })

          return
        }

        if (req.url?.startsWith('/admin/media-api/delete') && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body) as { path?: string }

              if (!payload.path) {
                throw new Error('Missing media path')
              }

              rmSync(safeUploadPath(payload.path), { force: true })

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch (error) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to delete media' }))
            }
          })

          return
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
