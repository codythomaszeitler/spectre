
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

    getTypeFor(columnHeaderName : string) {
        let type = null;

        const mappings = this.getMappings();
        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            if (mapping.getColumnHeader() === columnHeaderName) {
                type = mapping.getType();
            }
        }
        return type;
    }

    getMappings() {
        const mappings = this.asJson.mappings;
        const converted = [];

        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            converted.push(new CsvColumnNameMapping(mapping.csvHeaderName, mapping.nodeFormatName, mapping.type));
        }

        return converted;
    }
}

class CsvColumnNameMapping {

    columnHeaderName : string;
    nodeFormat : string;
    type : string;

    constructor(columnHeaderName : string, nodeFormat : string, type: string) {
        this.columnHeaderName = columnHeaderName;
        this.nodeFormat = nodeFormat;
        this.type = type;
    }

    getColumnHeader() {
        return this.columnHeaderName;
    }

    getNodeName() {
        return this.nodeFormat;
    }

    getType() {
        return this.type;
    }
}