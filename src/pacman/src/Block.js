export class Block {
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
