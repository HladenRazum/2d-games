let context
let board
const rowCount = 21
const colCount = 19
const tileSize = 32
const boardWidth = colCount * tileSize
const boardHeight = rowCount * tileSize

const ASSET_PATHS = {
  wall: './wall.png',
  ghostBlue: './blueGhost.png',
  ghostOrange: './orangeGhost.png',
  ghostPink: './pinkGhost.png',
  ghostRed: './redGhost.png',
  pacmanUp: './pacmanUp.png',
  pacmanDown: './pacmanDown.png',
  pacmanLeft: './pacmanLeft.png',
  pacmanRight: './pacmanRight.png',
}

const images = {}

window.onload = async () => {
  board = document.getElementById('board')
  board.height = boardHeight
  board.width = boardWidth
  context = board.getContext('2d')

  await loadImages()
  console.log('✅ Images loaded')
}

/** Utilities **/
async function loadImages() {
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
