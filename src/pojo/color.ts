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

  equals(color: Color) {
    return this.hexCode === color.hexCode;
  }

  darkerBy(factor: number) {
    const redHex = this.getRedHex();
    const greenHex = this.getGreenHex();
    const blueHex = this.getBlueHex();

    const darkerRedHex = Math.floor(redHex / factor);
    const darkerGreenHex = Math.floor(greenHex / factor);
    const darkerBlueHex = Math.floor(blueHex / factor);

    const darkerHexCode = this.contactHexCode(
      darkerRedHex,
      darkerGreenHex,
      darkerBlueHex
    );

    const withPound = "#" + darkerHexCode;
    return new Color(withPound);
  }

  lighterBy(factor: number) {
    const redHex = this.getRedHex();
    const greenHex = this.getGreenHex();
    const blueHex = this.getBlueHex();

    const lighterRexHex = Math.floor(redHex * factor);
    const lighterGreenHex = Math.floor(greenHex * factor);
    const lighterBlueHex = Math.floor(blueHex * factor);

    const lighterHexCode = this.contactHexCode(
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
    return this.hexCode.replace("#", "");
  }

  padAndCapitalizeHex(integer: number) {
    let asHex = integer.toString(16);

    if (asHex.length != 2) {
      asHex = "0" + asHex;
    }

    return asHex.toUpperCase();
  }

  contactHexCode(red: number, green: number, blue: number) {
    const fullHexCode =
      this.padAndCapitalizeHex(red) +
      this.padAndCapitalizeHex(green) +
      this.padAndCapitalizeHex(blue);
    return fullHexCode;
  }
}
