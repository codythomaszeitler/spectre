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

  equals(color : Color) {
    return this.hexCode === color.hexCode;
  }

  darker() {
    const toPaddedHex = (integer: number) => {
      let asHex = integer.toString(16);

      if (asHex.length != 2) {
        asHex = "0" + asHex;
      }

      return asHex.toUpperCase();
    };

    const redHex = this.getRedHex();
    const greenHex = this.getGreenHex();
    const blueHex = this.getBlueHex();

    const darkerRedHex = Math.floor(redHex / 2);
    const darkerGreenHex = Math.floor(greenHex / 2);
    const darkerBlueHex = Math.floor(blueHex / 2);

    const darkerHexCode =
      toPaddedHex(darkerRedHex) +
      toPaddedHex(darkerGreenHex) +
      toPaddedHex(darkerBlueHex);

    const withPound = '#' + darkerHexCode;
    return new Color(withPound);
  }

  getRedHex() {
    const hexString = this.withoutStartingPound().substr(0, 2);
    return parseInt(hexString, 16);
  }

  getGreenHex() {
    const hexString = this.withoutStartingPound().substr(2, 2);
    return parseInt(hexString, 16);
  }

  getBlueHex() {
    const hexString = this.withoutStartingPound().substr(4, 2);
    return parseInt(hexString, 16);
  }

  withoutStartingPound() {
    return this.hexCode.replace("#", "");
  }
}
