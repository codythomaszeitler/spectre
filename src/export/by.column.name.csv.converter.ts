import { CsvImporter } from "./csv.importer";
import { Columns } from "./columns";
import { TransactionDetail } from "../pojo/info.line";
import { Transaction } from "../pojo/transaction";
import { BankConfig } from "../mappings/bank.config";

export class ByColumnNameCsvImporter  extends CsvImporter {

    config : BankConfig;

    constructor(columns : Columns, config : BankConfig) {
        super(columns);
        this.config = config;
    }


    convert(string : string) {
        const converted = super.convert(string);    

        /*
         This transaction should have all of the columsn that are found within the config.
        */

        const details = [];

        const mappings = this.config.getMappings();
        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];
            if (!converted.hasDetailWithColumnName(mapping.getColumnHeader())) {
                throw new Error('Imported CSV did not have the following column: ' + mapping.getColumnHeader());
            }
        }

        for (let i = 0; i < mappings.length; i++) {
            const mapping = mappings[i];

            const detail = converted.getDetailByName(mapping.getColumnHeader());
            const changedDetail = new TransactionDetail(detail.getElement(), mapping.getNodeName(), detail.getType());

            details.push(changedDetail);
        }

        return new Transaction(details);
    }

}