import { TransactionDetail } from "../pojo/info.line";
import { CurrencyConverter } from "../transaction.info.converter/currency.converter";
import { AMOUNT_TYPE } from "../pojo/transaction";

export class DetailConverter {

    fromDetail(detail : TransactionDetail) {

        if (!detail) {
            throw new Error('Cannot convert a null detail');
        }

        let element = detail.getElement();
        if (detail.getType() === AMOUNT_TYPE) {
            const converter = new CurrencyConverter();
            element = converter.fromString(element);
        }
        return element;
    }
}
