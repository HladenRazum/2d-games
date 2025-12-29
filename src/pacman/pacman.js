let context
let board
const rowCount = 21
const colCount = 19
const tileSize = 32
const boardWidth = colCount * tileSize
const boardHeight = rowCount * tileSize

const images = {}

window.onload = async () => {
  board = document.getElementById('board')
  board.height = boardHeight
  board.width = boardWidth
  context = board.getContext('2d')

  Object.assign(images, await loadImages())
  console.log('✅ Images loaded')

  drawBoard()

  update()
}

// TODO: try this out
const ASSETS = {
  Wall: {
    name: 'wall',
    path: './assets/wall.png',
    tileKey: 'w',
  },
}

const ASSET_PATHS = {
  wall: './assets/wall.png',
  ghostBlue: './assets/blueGhost.png',
  ghostOrange: './assets/orangeGhost.png',
  ghostPink: './assets/pinkGhost.png',
  ghostRed: './assets/redGhost.png',
  pacmanUp: './assets/pacmanUp.png',
  pacmanDown: './assets/pacmanDown.png',
  pacmanLeft: './assets/pacmanLeft.png',
  pacmanRight: './assets/pacmanRight.png',
}

const TILE_MAP = [
  'xxxxxxxxxxxxxxxxxxx',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'x                 x',
  'xxxxxxxxxxxxxxxxxxx',
]

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

function update() {
  draw()
}

function draw() {
  console.log(images)
  context.drawImage(images.pacmanUp, 200, 200, 32, 32)
}

function drawBoard() {
  for (let row = 0; row < TILE_MAP.length; row++) {
    for (let col = 0; col < TILE_MAP[col].length; col++) {
      const x = col * tileSize
      const y = row * tileSize
      const char = TILE_MAP[row][col]

      if (char === 'x') {
        const wall = new Block(images.wall, x, y, tileSize, tileSize)
        // TODO: Add wall to walls entities
      }
    }
  }
}

class Block {
  constructor(image, x, y, w, h) {
    this.image = image
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.startX = x
    this.startY = y
  }

  draw() {}
}
