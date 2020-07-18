export class Color {
  hexCode: string;

  constructor(hexCode: string) {
    if (typeof hexCode !== 'string') {
      throw new Error('Cannot build without a hex string');
    }

    this.hexCode = hexCode;
  }

  hex() {
    return this.hexCode;
  }

  copy() {
    return new Color(this.hexCode);
  }

  equals(color: Color) {
    return this.hexCode === color.hexCode;
  }

  darkerBy(factor: number) {
    console.log('we are here');
    console.log(this);
    const redHex = this.getRedHex();
    const greenHex = this.getGreenHex();
    const blueHex = this.getBlueHex();

    const darkerRedHex = Math.floor(redHex / factor);
    const darkerGreenHex = Math.floor(greenHex / factor);
    const darkerBlueHex = Math.floor(blueHex / factor);

    const darkerHexCode = this.concatHexCode(
      darkerRedHex,
      darkerGreenHex,
      darkerBlueHex
    );

    const withPound = "#" + darkerHexCode;
    return new Color(withPound);
  }

  lighterBy(factor: number) {

    const multiplyByFactor = (hexValue : number, factor : number) => {
      const maxHex = 255;

      let lighterHexCode = (hexValue * factor);
      if (lighterHexCode > maxHex) {
        lighterHexCode = maxHex;
      }

      return Math.floor(lighterHexCode);
    }

    const redHex = this.getRedHex();
    const greenHex = this.getGreenHex();
    const blueHex = this.getBlueHex();

    const lighterRexHex = multiplyByFactor(redHex, factor);
    const lighterGreenHex = multiplyByFactor(greenHex, factor);
    const lighterBlueHex = multiplyByFactor(blueHex, factor);

    const lighterHexCode = this.concatHexCode(
      lighterRexHex,
      lighterGreenHex,
      lighterBlueHex
    );

    const withPound = "#" + lighterHexCode;
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
    console.log(this.hexCode);
    return this.hexCode.replace("#", "");
  }

  padAndCapitalizeHex(integer: number) {
    let asHex = integer.toString(16);

    if (asHex.length != 2) {
      asHex = "0" + asHex;
    }

    return asHex.toUpperCase();
  }

  concatHexCode(red: number, green: number, blue: number) {
    const fullHexCode =
      this.padAndCapitalizeHex(red) +
      this.padAndCapitalizeHex(green) +
      this.padAndCapitalizeHex(blue);
    return fullHexCode;
  }
}
