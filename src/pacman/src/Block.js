import { config, DIRECTIONS } from './constants.js'

export class Block {
  constructor(image, x, y, width, height) {
    this.image = image
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.startX = x
    this.startY = y

    this.direction = DIRECTIONS.Right
    this.velocityX = 0
    this.velocityY = 0
  }

  updateDirection(direction) {
    this.direction = direction
    this.updateVelocity()
  }

  updateVelocity() {
    const speed = config.tileSize / 4

    const directionVectors = {
      [DIRECTIONS.Up]: { x: 0, y: -1 },
      [DIRECTIONS.Down]: { x: 0, y: 1 },
      [DIRECTIONS.Left]: { x: -1, y: 0 },
      [DIRECTIONS.Right]: { x: 1, y: 0 },
    }

    const vector = directionVectors[this.direction] ?? { x: 0, y: 0 }

    this.velocityX = vector.x * speed
    this.velocityY = vector.y * speed
  }
}
