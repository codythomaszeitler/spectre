
export class Columns {
  configuration : Object;
  constructor(configuration : Object) {
    this.configuration = JSON.parse(JSON.stringify(configuration));
  }

  copy() {
    return new Columns(this.configuration);
  }

  getNumColumns() {
    return Object.keys(this.configuration).length;
  }

  getName(columnIndex) {
    this._checkColumnIndex(columnIndex);
    return this.configuration[columnIndex]['name'];
  }

  getType(columnIndex) {
    this._checkColumnIndex(columnIndex);
    return this.configuration[columnIndex]['type'];
  }

  _checkColumnIndex(columnIndex) {
    if (columnIndex >= this.getNumColumns()) {
      throw new Error(
        "[" +
          columnIndex +
          "] was greater than the max index of columns in config, which is [" +
          (this.getNumColumns() - 1) +
          "]"
      );
    }
  }
}
