import { Block } from './Block.js'
import { config, DIRECTIONS } from './constants.js'
import {
  getRandomDirection,
  isRectangleCollision,
  loadImages,
} from './utils.js'

// TODO:
const PLAYER_MODES = {
  NORMAL: 'normal',
  INVULNERABLE: 'invlulnerable',
}

let context
let board
let playerMode = PLAYER_MODES.NORMAL
let numLifes = 2
let isGameOver = numLifes <= 0
let isPlaying = true

const { rowCount, colCount, tileSize } = config

const boardWidth = colCount * tileSize
const boardHeight = rowCount * tileSize
const playerStartingPosition = { x: boardWidth / 2, y: boardHeight / 2 }

const walls = new Set()
const enemies = new Set()
const food = new Set()
let player

const images = {}
const assetsMap = {}

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
  const DIRECTION_TO_PACMAN_IMAGE = {
    [DIRECTIONS.Up]: images.pacmanUp,
    [DIRECTIONS.Down]: images.pacmanDown,
    [DIRECTIONS.Left]: images.pacmanLeft,
    [DIRECTIONS.Right]: images.pacmanRight,
  }

  const direction = KEY_TO_DIRECTION[e.code]
  player.updateDirection(direction, walls)
  player.image = DIRECTION_TO_PACMAN_IMAGE[direction] || player.image
}

// Wrap the map vertically
// If we exit the map from the one side, we teleport to the other side
function wrapEntity(e) {
  if (e.x + e.width < 0) {
    e.x = boardWidth
  } else if (e.x > boardWidth) {
    e.x = -e.width
  }
}

function move() {
  player.x += player.velocityX
  player.y += player.velocityY

  wrapEntity(player)

  for (const wall of walls.values()) {
    if (isRectangleCollision(player, wall)) {
      player.x -= player.velocityX
      player.y -= player.velocityY
      break
    }
  }

  for (const enemy of enemies.values()) {
    enemy.x += enemy.velocityX
    enemy.y += enemy.velocityY

    wrapEntity(enemy)

    for (const wall of walls.values()) {
      if (isRectangleCollision(enemy, wall)) {
        enemy.x -= enemy.velocityX
        enemy.y -= enemy.velocityY

        enemy.direction = getRandomDirection(DIRECTIONS)
        enemy.updateVelocity()
        break
      }

      if (isRectangleCollision(enemy, player)) {
        if (playerMode === PLAYER_MODES.NORMAL) {
          player.x = playerStartingPosition.xl
          player.y = playerStartingPosition.y
          numLifes--
          // TODO: Restart the level
        } else if (playerMode === PLAYER_MODES.INVULNERABLE) {
          // Increase the score
          enemies.delete(enemy)
        }
        return
      }
    }
  }
}

function update() {
  if (!isPlaying) return

  isGameOver = numLifes <= 0

  move()
  draw()

  if (!isGameOver) {
    setTimeout(update, 50)
  } else {
    showScore()
  }
}

function showScore() {
  context.fillStyle = '#70704c6d'
  context.fillRect(0, 0, boardWidth, boardHeight)

  context.fillStyle = '#0911efff'
  context.fillRect(100, 200, boardWidth - 200, 200)

  context.fillStyle = '#ddf601ff'
  context.font = 'bold 32px monospace'
  context.fillText('Game Over!', 150, 250)

  context.font = 'normal 52px monospace'
  context.fillText('Score: 3000', 150, 300)
}

function draw() {
  context.clearRect(0, 0, boardWidth, boardHeight)

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

  // Draw the player
  context.drawImage(
    player.image,
    player.x,
    player.y,
    player.width,
    player.height
  )
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

  for (const enemy of enemies.values()) {
    enemy.direction = getRandomDirection(DIRECTIONS)
    enemy.updateVelocity()
  }

  document.addEventListener('keyup', movePlayer)
}
