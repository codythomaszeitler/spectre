import { TransactionDetail } from "../../pojo/transaction.detail";
import { AMOUNT_TYPE } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import {DetailConverter} from '../detail.converter';

describe('Converter Factory', () => {
    it('should be able to convert a currency from a transaction detail with AMOUNT TYPE', () => {
        const detail = new TransactionDetail('$400.00', 'columnName', AMOUNT_TYPE); 

        const factory = new DetailConverter();
        const currency = factory.fromDetail(detail);

        const expected = new Currency(400);
        expect(expected.equals(currency)).toBe(true);
    });

    it('should be able to parse a string element from a transaction', () => {
        const detail = new TransactionDetail('abcd', 'columnName', 'string');

        const testObject = new DetailConverter();
        const rawString = testObject.fromDetail(detail);

        expect(rawString).toBe(detail.getElement());
    });

    it('should throw an exception if the detail is null', () => {
        const testObject = new DetailConverter();

        let caughtException = null;
        try {
            testObject.fromDetail(null);
        } catch (e) {
            caughtException = e;
        }
        expect(caughtException.message).toBe('Cannot convert a null detail');
    });
});