export class Color {
  hexCode: string;

  constructor(hexCode: string) {
    this.hexCode = hexCode;
  }

  hex() {
    return this.hexCode;
  }

  copy() {
    return new Color(this.hexCode);
  }
}
