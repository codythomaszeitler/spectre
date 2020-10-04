import { CsvImporter } from "./csv.importer";
import { Columns } from "./columns";
import { TransactionDetail } from "../pojo/transaction.detail";
import { Transaction } from "../pojo/transaction";
import { BankConfig } from "../mappings/bank.config";
import { ColumnEstimation } from "../service/column.estimation";

export class ByColumnNameCsvImporter  extends CsvImporter {

    config : BankConfig;

    constructor(config : BankConfig) {
        super();
        this.config = config;
    }

    defineIncomingFormat(columns : Columns) {
        columns = this.alignColumnsWithTypesFromConfig(columns);
        super.defineIncomingFormat(columns);
    }

    alignColumnsWithTypesFromConfig(columns : Columns) {
        for (let i = 0; i < columns.getNumColumns(); i++) {
            if (columns.hasColumn(i)) {
                const type = this.config.getTypeFor(columns.getName(i));
                if (type) {
                    columns.setType(i, type);
                }
            }
        }
        return columns;
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