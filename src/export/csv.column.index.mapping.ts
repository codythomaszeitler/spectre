
export class CsvColumnIndexConfig {

    mappings : Array<Object>;

    constructor(asJson : Object) {
       this.mappings = asJson.mappings; 
    }

    getMappings() {
        const mappings = this.mappings;
        const converted = [];

        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            converted.push(new CsvColumnIndexMapping(mapping.csvIndex - 1, mapping.nodeFormat));
        }

        return converted;
    }

}

class CsvColumnIndexMapping {

    columnIndex : number;
    nodeFormat : string;

    constructor(columnIndex : number, nodeFormat : string) {
        this.columnIndex = columnIndex;
        this.nodeFormat = nodeFormat;
    }

    getColumnIndex() {
        return this.columnIndex;
    }

    getNodeName() {
        return this.nodeFormat;
    }

}