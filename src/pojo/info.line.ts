import { Currency } from "./currency";
import { AMOUNT_TYPE } from "./transaction";

export class TransactionDetail {

    detail : String;
    type : String;
    currency : Currency;

    constructor(detail : String, type : String) {
        this.detail = detail;
        this.type = type;
        this.currency = new Currency(0);
    }

    static withCurrency(currency : Currency) {
        const detail = new TransactionDetail('', AMOUNT_TYPE);
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

    getDetail() {
        if (!this.detail) {
            return this.currency;
        } else {
            return this.detail;
        }
    }

    getType() {
        return this.type;
    }
}