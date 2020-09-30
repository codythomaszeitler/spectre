export class CsvType {

    type : string;

    constructor(type : string) {
        this.type = type;
    }

    get() {
        return this.type;
    }

    equals(csvType : CsvType) {
        return this.type === csvType.type;
    }
}

export const SCEPTER_FORMAT = new CsvType('Scepter');
export const RAW_FORMAT = new CsvType('Raw');