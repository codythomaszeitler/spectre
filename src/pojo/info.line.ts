import { Currency } from "./currency";
import { AMOUNT_TYPE } from "./transaction";
import { CurrencyConverter } from "../transaction.info.converter/currency.converter";

export class TransactionDetail {

    detail : string;
    columnName : string;
    type : string;
    currency : Currency;

    constructor(detail : string, columnName : string, type : string) {
        this.detail = detail;
        this.columnName = columnName;
        this.type = type;
        this.currency = new Currency(NaN);
    }

    static withCurrency(currency : Currency, columnName : string) {
        const converter = new CurrencyConverter();

        const detail = new TransactionDetail(converter.toString(currency), columnName, AMOUNT_TYPE);
        detail.currency = currency.copy();
        return detail;
    }

    copy() {
        return new TransactionDetail(this.detail, this.type);
    }

    equals(transactionDetail : TransactionDetail) {
        const areDetailsEquivalent = () => {
            let areDetailsEquivalent = false;
            if (this.type === AMOUNT_TYPE && transactionDetail.type === AMOUNT_TYPE) {
                areDetailsEquivalent = this.currency.equals(transactionDetail.currency);
            } else {
                areDetailsEquivalent = this.detail === transactionDetail.detail;
            }
            return areDetailsEquivalent;
        }

        return areDetailsEquivalent() && this.type === transactionDetail.type;
    }

    getElement() {
        if (this.currency.equals(new Currency(NaN))) {
            return this.detail;
        } else {
            return this.currency;
        }
    }

    getColumnName() {
        return this.columnName;
    }

    getType() {
        return this.type;
    }
}