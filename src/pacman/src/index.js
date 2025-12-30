import { Block } from './Block.js'
import { config, DIRECTIONS } from './constants.js'
import { isRectangleCollision, loadImages } from './utils.js'

let context
let board

const { rowCount, colCount, tileSize } = config

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

  document.addEventListener('keyup', movePlayer)
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

const KEY_TO_DIRECTION = {
  ArrowUp: DIRECTIONS.Up,
  KeyW: DIRECTIONS.Up,
  ArrowDown: DIRECTIONS.Down,
  KeyS: DIRECTIONS.Down,
  ArrowLeft: DIRECTIONS.Left,
  KeyA: DIRECTIONS.Left,
  ArrowRight: DIRECTIONS.Right,
  KeyD: DIRECTIONS.Right,
}

function movePlayer(e) {
  const direction = KEY_TO_DIRECTION[e.code]
  player.updateDirection(direction, walls)
}

function move() {
  player.x += player.velocityX
  player.y += player.velocityY

  for (const wall of walls.values()) {
    if (isRectangleCollision(player, wall)) {
      player.x -= player.velocityX
      player.y -= player.velocityY
      break
    }
  }
}

function update() {
  move()
  draw()
  setTimeout(update, 50)
}

function draw() {
  context.clearRect(0, 0, boardWidth, boardHeight)

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
    for (let col = 0; col < TILE_MAP[row].length; col++) {
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
