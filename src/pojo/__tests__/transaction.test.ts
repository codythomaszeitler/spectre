import {Transaction} from '../transaction';
import {Timestamp} from '../timestamp';
import {Currency} from '../currency';
import {TransactionDetail} from '../info.line';

describe('Transaction', () => {
    it('should return false when transactions do not have the same details', () => {

        const aDetails = [];
        aDetails.push(new TransactionDetail('Test', 'TypeADetails'));
        const a = new Transaction(new Currency(500, 'USD'), aDetails);

        const bDetails = [];
        bDetails.push(new TransactionDetail('Test', 'TypeBDetails'));
        const b = new Transaction(new Currency(500, 'USD'), bDetails);

        expect(a.equals(b)).toBe(false);
    });
});