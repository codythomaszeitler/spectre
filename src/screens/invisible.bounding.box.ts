export class InvisibleBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(pageX: number, pageY: number, width: number, height: number) {
    if (width < 1) {
      throw new Error(
        "Cannot create a bounding box with a non-positive width [" + width + "]"
      );
    }

    if (height < 1) {
      throw new Error(
        "Cannot create a bounding box with a non-positive height [" + height + "]"
      );
    }

    this.x = pageX;
    this.y = pageY;
    this.width = width;
    this.height = height;
  }

  copy() {
      return new InvisibleBoundingBox(this.x, this.y, this.width, this.height);
  }

  intersects(box: InvisibleBoundingBox) {
    return (
      this.x < box.x + box.width &&
      this.x + this.width > box.x &&
      this.y < box.y + box.height &&
      this.y + this.height > box.y
    );
  }
}
