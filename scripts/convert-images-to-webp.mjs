import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.resolve('src/assets/image')
const outputDir = path.resolve('src/assets/image-optimized')
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg'])

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...await findImages(fullPath))
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (entry.isFile() && supportedExtensions.has(ext)) {
      files.push(fullPath)
    }
  }

  return files
}

function getOutputPath(filePath) {
  const relativePath = path.relative(sourceDir, filePath)
  const parsedPath = path.parse(relativePath)
  return path.join(outputDir, parsedPath.dir, `${parsedPath.name}.webp`)
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const images = await findImages(sourceDir)
let originalBytes = 0
let optimizedBytes = 0

for (const imagePath of images) {
  const outputPath = getOutputPath(imagePath)
  await mkdir(path.dirname(outputPath), { recursive: true })

  await sharp(imagePath)
    .rotate()
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath)

  const [sourceInfo, outputInfo] = await Promise.all([
    stat(imagePath),
    stat(outputPath),
  ])

  originalBytes += sourceInfo.size
  optimizedBytes += outputInfo.size

  const relativeInput = path.relative(process.cwd(), imagePath)
  const relativeOutput = path.relative(process.cwd(), outputPath)
  console.log(`${relativeInput} -> ${relativeOutput}`)
}

const savedBytes = originalBytes - optimizedBytes
const savedPercent = originalBytes > 0
  ? ((savedBytes / originalBytes) * 100).toFixed(1)
  : '0.0'

console.log('')
console.log(`Converted ${images.length} images to WebP.`)
console.log(`Original: ${formatBytes(originalBytes)}`)
console.log(`WebP:     ${formatBytes(optimizedBytes)}`)
console.log(`Saved:    ${formatBytes(savedBytes)} (${savedPercent}%)`)
