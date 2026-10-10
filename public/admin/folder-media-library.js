(function () {
  const API = '/admin/media-api'
  const imageTypes = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg'])

  let handleInsertRef = null
  let state = {
    visible: false,
    currentFolder: '',
    files: [],
    folders: [],
    imagesOnly: false,
    allowMultiple: false,
    selected: new Set(),
  }

  const styles = `
    .folder-media-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(17, 24, 39, 0.62);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .folder-media-backdrop.is-open {
      display: flex;
    }

    .folder-media {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      width: min(1180px, calc(100vw - 48px));
      height: min(740px, calc(100vh - 48px));
      overflow: hidden;
      border-radius: 8px;
      background: #f8fafc;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.3);
    }

    .folder-media__sidebar {
      overflow: auto;
      border-right: 1px solid #d8dee9;
      background: #eef2f7;
      padding: 16px;
    }

    .folder-media__main {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    .folder-media__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #d8dee9;
      padding: 16px 20px;
    }

    .folder-media__title {
      margin: 0;
      color: #24313f;
      font-size: 22px;
      font-weight: 700;
    }

    .folder-media__path {
      margin-top: 4px;
      color: #687385;
      font-size: 13px;
    }

    .folder-media__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .folder-media button,
    .folder-media label {
      border: 0;
      border-radius: 5px;
      background: #e5e9f0;
      color: #26323f;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      padding: 9px 13px;
    }

    .folder-media button:hover,
    .folder-media label:hover {
      background: #d8dee9;
    }

    .folder-media button.primary {
      background: #2f3d40;
      color: #fff;
    }

    .folder-media button.danger {
      background: #ffe4e6;
      color: #e11d48;
    }

    .folder-media button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .folder-media__folder {
      display: block;
      width: 100%;
      margin-bottom: 6px;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .folder-media__folder.is-active {
      background: #2f6feb;
      color: #fff;
    }

    .folder-media__body {
      overflow: auto;
      padding: 20px;
    }

    .folder-media__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 14px;
    }

    .folder-media__card {
      overflow: hidden;
      border: 2px solid transparent;
      border-radius: 7px;
      background: #fff;
      cursor: pointer;
      text-align: left;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
    }

    .folder-media__card.is-selected {
      border-color: #2f6feb;
      box-shadow: 0 0 0 3px rgba(47, 111, 235, 0.2);
    }

    .folder-media__thumb {
      display: flex;
      height: 116px;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #f4f6f8 25%, #fff 25%, #fff 50%, #f4f6f8 50%, #f4f6f8 75%, #fff 75%);
      background-size: 20px 20px;
    }

    .folder-media__thumb img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .folder-media__file-icon {
      color: #4b5563;
      font-size: 42px;
      font-weight: 800;
    }

    .folder-media__name {
      overflow: hidden;
      padding: 10px;
      color: #607084;
      font-size: 13px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .folder-media__empty {
      margin-top: 120px;
      color: #607084;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
    }

    .folder-media__error {
      display: none;
      margin: 0 20px;
      border-radius: 5px;
      background: #fee2e2;
      color: #b91c1c;
      padding: 10px 12px;
    }

    .folder-media__error:not(:empty) {
      display: block;
    }

    .folder-media input[type="file"] {
      display: none;
    }
  `

  function createModal() {
    if (document.querySelector('.folder-media-backdrop')) return

    const style = document.createElement('style')
    style.textContent = styles
    document.head.appendChild(style)

    const root = document.createElement('div')
    root.className = 'folder-media-backdrop'
    root.innerHTML = `
      <section class="folder-media" role="dialog" aria-modal="true" aria-label="Media assets">
        <aside class="folder-media__sidebar">
          <button class="folder-media__folder is-active" data-folder="">/ uploads</button>
          <div data-folders></div>
        </aside>
        <main class="folder-media__main">
          <header class="folder-media__header">
            <div>
              <h2 class="folder-media__title">Media assets</h2>
              <div class="folder-media__path" data-path>/uploads</div>
            </div>
            <div class="folder-media__actions">
              <label>
                Upload
                <input type="file" data-upload multiple />
              </label>
              <button data-new-folder>New folder</button>
              <button data-delete class="danger" disabled>Delete</button>
              <button data-insert class="primary" disabled>Choose selected</button>
              <button data-close>Close</button>
            </div>
          </header>
          <p class="folder-media__error" data-error></p>
          <div class="folder-media__body">
            <div class="folder-media__grid" data-grid></div>
            <div class="folder-media__empty" data-empty>No assets found.</div>
          </div>
        </main>
      </section>
    `

    root.addEventListener('click', event => {
      if (event.target === root) hide()
    })

    root.querySelector('[data-close]').addEventListener('click', hide)
    root.querySelector('[data-insert]').addEventListener('click', insertSelected)
    root.querySelector('[data-delete]').addEventListener('click', deleteSelected)
    root.querySelector('[data-new-folder]').addEventListener('click', createFolder)
    root.querySelector('[data-upload]').addEventListener('change', uploadFiles)

    document.body.appendChild(root)
  }

  function setError(message) {
    document.querySelector('[data-error]').textContent = message || ''
  }

  async function fetchMedia() {
    const response = await fetch(`${API}/list`)
    if (!response.ok) throw new Error('Unable to load media assets')
    const data = await response.json()
    state.files = data.files || []
    state.folders = data.folders || []
  }

  function currentFiles() {
    return state.files
      .filter(file => file.folder === state.currentFolder)
      .filter(file => !state.imagesOnly || imageTypes.has(file.type))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  function renderFolders() {
    const wrap = document.querySelector('[data-folders]')
    const active = state.currentFolder
    wrap.innerHTML = ''

    state.folders
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .forEach(folder => {
        const button = document.createElement('button')
        button.className = `folder-media__folder${folder === active ? ' is-active' : ''}`
        button.type = 'button'
        button.dataset.folder = folder
        button.textContent = `/${folder}`
        button.addEventListener('click', () => {
          state.currentFolder = folder
          state.selected.clear()
          render()
        })
        wrap.appendChild(button)
      })

    document.querySelector('[data-folder=""]').classList.toggle('is-active', active === '')
  }

  function renderFiles() {
    const grid = document.querySelector('[data-grid]')
    const empty = document.querySelector('[data-empty]')
    const files = currentFiles()

    grid.innerHTML = ''
    empty.style.display = files.length ? 'none' : 'block'

    files.forEach(file => {
      const card = document.createElement('button')
      card.type = 'button'
      card.className = `folder-media__card${state.selected.has(file.url) ? ' is-selected' : ''}`
      card.innerHTML = `
        <div class="folder-media__thumb">
          ${imageTypes.has(file.type)
            ? `<img src="${file.url}" alt="">`
            : `<span class="folder-media__file-icon">${file.type || 'file'}</span>`}
        </div>
        <div class="folder-media__name" title="${file.name}">${file.name}</div>
      `
      card.addEventListener('click', () => {
        if (!state.allowMultiple) state.selected.clear()

        if (state.selected.has(file.url)) {
          state.selected.delete(file.url)
        } else {
          state.selected.add(file.url)
        }

        renderFiles()
        renderActions()
      })
      grid.appendChild(card)
    })
  }

  function renderActions() {
    const hasSelection = state.selected.size > 0
    document.querySelector('[data-insert]').disabled = !hasSelection
    document.querySelector('[data-delete]').disabled = !hasSelection
    document.querySelector('[data-path]').textContent = `/uploads${state.currentFolder ? `/${state.currentFolder}` : ''}`
  }

  function render() {
    renderFolders()
    renderFiles()
    renderActions()
  }

  function folderFromConfig(config) {
    const mediaFolder = String(config && config.media_folder ? config.media_folder : '')
      .replace(/\\/g, '/')
      .replace(/^\/?public\/uploads\/?/, '')
      .replace(/^\/+|\/+$/g, '')

    return mediaFolder
  }

  async function open(options) {
    createModal()
    setError('')
    state.visible = true
    state.imagesOnly = !!options.imagesOnly
    state.allowMultiple = options.allowMultiple !== false
    state.selected = new Set()
    state.currentFolder = folderFromConfig(options.config)

    try {
      await fetchMedia()
      document.querySelector('.folder-media-backdrop').classList.add('is-open')
      render()
    } catch (error) {
      setError(error.message || 'Unable to open media library')
      document.querySelector('.folder-media-backdrop').classList.add('is-open')
    }
  }

  function hide() {
    const root = document.querySelector('.folder-media-backdrop')
    if (root) root.classList.remove('is-open')
    state.visible = false
  }

  function insertSelected() {
    const selected = Array.from(state.selected)
    if (!selected.length || !handleInsertRef) return

    handleInsertRef(state.allowMultiple && selected.length > 1 ? selected : selected[0])
    hide()
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  async function uploadFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return

    setError('')

    try {
      for (const file of files) {
        const dataUrl = await readFileAsDataUrl(file)
        const response = await fetch(`${API}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder: state.currentFolder,
            name: file.name,
            dataUrl,
          }),
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error || `Unable to upload ${file.name}`)
        }
      }

      await fetchMedia()
      render()
    } catch (error) {
      setError(error.message || 'Unable to upload media')
    }
  }

  async function createFolder() {
    const name = window.prompt('New folder name')
    if (!name) return

    setError('')

    try {
      const response = await fetch(`${API}/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: state.currentFolder,
          name,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Unable to create folder')
      }

      const payload = await response.json()
      state.currentFolder = payload.folder || state.currentFolder
      state.selected.clear()
      await fetchMedia()
      render()
    } catch (error) {
      setError(error.message || 'Unable to create folder')
    }
  }

  async function deleteSelected() {
    const selected = Array.from(state.selected)
    if (!selected.length) return
    if (!window.confirm(`Delete ${selected.length} selected asset${selected.length > 1 ? 's' : ''}?`)) return

    setError('')

    try {
      for (const url of selected) {
        const response = await fetch(`${API}/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: url }),
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.error || `Unable to delete ${url}`)
        }
      }

      state.selected.clear()
      await fetchMedia()
      render()
    } catch (error) {
      setError(error.message || 'Unable to delete media')
    }
  }

  window.FolderAwareLocalMediaLibrary = {
    name: 'folder-aware-local',
    init: async ({ handleInsert }) => {
      handleInsertRef = handleInsert

      return {
        show: open,
        hide,
        enableStandalone: () => true,
      }
    },
  }

  if (window.CMS) {
    window.CMS.registerMediaLibrary(window.FolderAwareLocalMediaLibrary)
  }
})()
