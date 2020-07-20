import {Transaction, AMOUNT_TYPE} from '../transaction';
import {Currency} from '../currency';
import {TransactionDetail} from '../info.line';

describe('Transaction', () => {
    it('should return false when transactions do not have the same details', () => {

        const aDetails = [];
        aDetails.push(new TransactionDetail('Test', 'TestColumnName', 'TypeADetails'));
        aDetails.push(TransactionDetail.withCurrency(new Currency(500)));

        const a = new Transaction(aDetails);

        const bDetails = [];
        bDetails.push(new TransactionDetail('Test', 'TestColumnName', 'TypeBDetails'));
        bDetails.push(TransactionDetail.withCurrency(new Currency(500)));

        const b = new Transaction(bDetails);

        expect(a.equals(b)).toBe(false);
    });

});