export class Columns {
  constructor(configuration) {
    const checkConfiguration = () => {
      for (let key in configuration) {
        let keyCount = 0;
        for (let innerKey in configuration[key]) {
          keyCount++;
        }
        if (keyCount !== 1) {
          throw new Error(
            "There were [" +
              keyCount +
              "] keys under the index [" +
              key +
              "], there must only be one"
          );
        }
      }
    };

    checkConfiguration();
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

    const nameToType = this.configuration[columnIndex];

    let name = null;
    for (let key in nameToType) {
      name = key;
    }
    return name;
  }

  getType(columnIndex) {
    this._checkColumnIndex(columnIndex);

    const nameToType = this.configuration[columnIndex];

    let type = null;
    for (let key in nameToType) {
      type = nameToType[key];
    }
    return type;
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
