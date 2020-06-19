
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

  getName(columnIndex : number) {
    this._checkColumnIndex(columnIndex);
    return this.configuration[columnIndex]['name'];
  }

  getType(columnIndex : number) {
    this._checkColumnIndex(columnIndex);
    return this.configuration[columnIndex]['type'];
  }

  hasColumn(columnIndex : number) {
    return (columnIndex in this.configuration);
  }

  _checkColumnIndex(columnIndex : number) {
    if (!this.hasColumn(columnIndex)) {
      throw new Error(
        "Column [" + columnIndex + "] does not exist"
      );
    }
  }
}
