
export const columnNameDelimeter = '|';
export const nameKey = 'name';

export class Columns {
  configuration : any;
  constructor(configuration : any) {
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
    return this.configuration[columnIndex][nameKey];
  }

  getType(columnIndex : number) {
    this._checkColumnIndex(columnIndex);
    return this.configuration[columnIndex]['type'];
  }

  hasColumn(columnIndex : number) {
    return (columnIndex in this.configuration);
  }

  hasColumnWithName(columnName : string) {
    let hasColumnWithName = false;
    for (let i = 0; i < this.getNumColumns(); i++) {
      if (columnName === this.configuration[i]['name']) {
        hasColumnWithName = true;
        break;
      }
    }

    return hasColumnWithName;
  }

  _checkColumnIndex(columnIndex : number) {
    if (!this.hasColumn(columnIndex)) {
      throw new Error(
        "Column [" + columnIndex + "] does not exist"
      );
    }
  }
}
