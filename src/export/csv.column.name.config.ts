
export class CsvColumnNameConfig {

    mappings : Array<Object>;

    constructor(asJson : Object) {
       this.mappings = asJson.mappings; 
    }

    getMappings() {
        const mappings = this.mappings;
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