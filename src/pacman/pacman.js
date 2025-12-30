let context
let board
const rowCount = 21
const colCount = 19
const tileSize = 32
const boardWidth = colCount * tileSize
const boardHeight = rowCount * tileSize

const walls = new Set()
const enemies = new Set()
const food = new Set()
let player

const images = {}
const assetsMap = {}

window.onload = async () => {
  board = document.getElementById('board')
  board.height = boardHeight
  board.width = boardWidth
  context = board.getContext('2d')

  Object.assign(images, await loadImages())
  Object.assign(assetsMap, {
    X: {
      image: images.wall,
      target: walls,
    },
    o: {
      image: images.ghostOrange,
      target: enemies,
    },
    p: {
      image: images.ghostPink,
      target: enemies,
    },
    r: {
      image: images.ghostRed,
      target: enemies,
    },
    b: {
      image: images.ghostBlue,
      target: enemies,
    },
  })

  drawBoard()
  update()
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
  'XXXXXXXXXXXXXXXXXXX',
  'X        X        X',
  'X XX XXX X XXX XX X',
  'X                 X',
  'X XX X XXXXX X XX X',
  'X    X       X    X',
  'XXXX XXXX XXXX XXXX',
  'OOOX X       X XOOO',
  'XXXX X XXrXX X XXXX',
  'O       bpo       O',
  'XXXX X XXXXX X XXXX',
  'OOOX X       X XOOO',
  'XXXX X XXXXX X XXXX',
  'X        X        X',
  'X XX XXX X XXX XX X',
  'X  X     P     X  X',
  'XX X X XXXXX X X XX',
  'X    X   X   X    X',
  'X XXXXXX X XXXXXX X',
  'X                 X',
  'XXXXXXXXXXXXXXXXXXX',
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
  // Draw the player
  context.drawImage(
    player.image,
    player.x,
    player.y,
    player.width,
    player.height
  )

  // Draw the enemies
  for (const enemy of Array.from(enemies)) {
    context.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height)
  }

  // Draw the walls
  for (const wall of Array.from(walls)) {
    context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height)
  }

  // Draw food
  context.fillStyle = '#ffffff'
  for (const f of food.values()) {
    context.fillRect(f.x, f.y, f.width, f.height)
  }
}

function drawBoard() {
  for (let row = 0; row < TILE_MAP.length; row++) {
    for (let col = 0; col < TILE_MAP[col].length; col++) {
      const x = col * tileSize
      const y = row * tileSize
      const char = TILE_MAP[row][col]

      if (char === 'P') {
        player = new Block(images.pacmanRight, x, y, tileSize, tileSize)
        continue
      }

      if (char === ' ') {
        const f = new Block(null, x + 14, y + 14, 4, 4)
        food.add(f)
      }

      const handler = assetsMap[char]
      if (!handler) continue

      const entity = new Block(handler.image, x, y, tileSize, tileSize)
      handler.target.add(entity)
    }
  }
}

class Block {
  constructor(image, x, y, width, height) {
    this.image = image
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.startX = x
    this.startY = y
  }
}
