import { ASSET_PATHS } from './constants.js'

export async function loadImages() {
  const entries = await Promise.all(
    Object.entries(ASSET_PATHS).map(async ([key, src]) => [
      key,
      await loadImage(src),
    ])
  )

  return Object.fromEntries(entries)
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}
