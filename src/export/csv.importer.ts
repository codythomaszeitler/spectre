import { AMOUNT_TYPE, Transaction } from "../pojo/transaction";
import { CurrencyConverter } from "../transaction.info.converter/currency.converter";
import { Columns } from "./columns";
import { TransactionDetail } from "../pojo/info.line";
import {Importer} from './importer';

export class CsvImporter implements Importer {

    columns : Columns;

    constructor(columns : Columns) {
        this.columns = columns.copy();
    }

    convert(string : string) {
        let details = [];

        const splits = string.split(',');
        for (let i = 0; i < splits.length; i++) {
            const columnName = this.columns.getName(i);

            if (!columnName) {
                const split = unescapeCsvElement(splits[i]);
                const detail = new TransactionDetail(split, 'noConfig' + i, 'string');
                details.push(detail);
            } else if (this.columns.getType(i) === AMOUNT_TYPE) {
                const split = unescapeCsvElement(splits[i]);

                const converter = new CurrencyConverter();
                const amount = converter.fromString(split);
                details.push(TransactionDetail.withCurrency(amount, columnName));
            } else {
                const split = unescapeCsvElement(splits[i]);
                const detail = new TransactionDetail(split, columnName, this.columns.getType(i));
                details.push(detail);
            }
        }

        return new Transaction(details);
      }
}

export function unescapeCsvElement(element : string) {
    if (!element) {
        return '';
    }
    return element.split('"').join('');
}