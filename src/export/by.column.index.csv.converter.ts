import { CsvImporter } from "./csv.importer";
import { Columns } from "./columns";
import { CsvColumnIndexConfig as CsvColumnIndexConfig } from "./csv.column.index.mapping";
import { TransactionDetail } from "../pojo/info.line";
import { Transaction } from "../pojo/transaction";

export class ByColumnIndexCsvImporter  extends CsvImporter {

    config : CsvColumnIndexConfig;

    constructor(columns : Columns, config : CsvColumnIndexConfig) {
        super(columns);
        this.config = config;
    }


    convert(string : string) {
        const converted = super.convert(string);    

        const details = [];

        const mappings = this.config.getMappings();
        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];

            const detail = converted.getDetailByColumnIndex(mapping.getColumnIndex());
            const changedDetail = new TransactionDetail(detail.getElement(), mapping.getNodeName(), detail.getType());

            details.push(changedDetail);
        }

        return new Transaction(details);
    }

}