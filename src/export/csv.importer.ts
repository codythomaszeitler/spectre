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
        let amount = null;
        let timestamp = null;
        let details = [];

        const splits = string.split(',');
        for (let i = 0; i < this.columns.getNumColumns(); i++) {

            if (this.columns.getType(i) === AMOUNT_TYPE) {
                const split = unescapeCsvElement(splits[i]);

                const converter = new CurrencyConverter();
                amount = converter.fromString(split);
            } else {
                const split = unescapeCsvElement(splits[i]);
                const detail = new TransactionDetail(split, this.columns.getType(i));
                details.push(detail);
            }
        }

        return new Transaction(amount, details);
      }
}

export function unescapeCsvElement(element : string) {
    return element.split('"').join('');
}