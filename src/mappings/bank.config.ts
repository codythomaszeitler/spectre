
export class BankConfig {

    asJson : Object;

    constructor(asJson : Object) {
       this.asJson = JSON.parse(JSON.stringify(asJson));
    }

    getName() {
        return this.asJson.name;
    }

    getFilePath() {
        return this.asJson.imageFilePath;
    }

    getMappings() {
        const mappings = this.asJson.mappings;
        const converted = [];

        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            converted.push(new CsvColumnNameMapping(mapping.csvHeaderName, mapping.nodeFormatName));
        }

        return converted;
    }
}

class CsvColumnNameMapping {

    columnHeaderName : string;
    nodeFormat : string;

    constructor(columnHeaderName : string, nodeFormat : string) {
        this.columnHeaderName = columnHeaderName;
        this.nodeFormat = nodeFormat;
    }

    getColumnHeader() {
        return this.columnHeaderName;
    }

    getNodeName() {
        return this.nodeFormat;
    }

}