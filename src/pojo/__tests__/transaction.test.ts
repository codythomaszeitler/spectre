import {Transaction, AMOUNT_TYPE} from '../transaction';
import {Currency} from '../currency';
import {STRING_TYPE, TransactionDetail} from '../transaction.detail';

describe('Transaction', () => {
    it('should return false when transactions do not have the same details', () => {

        const aDetails = [];
        aDetails.push(new TransactionDetail('Test', 'TestColumnName', 'TypeADetails'));
        const a = new Transaction(aDetails);

        const bDetails = [];
        bDetails.push(new TransactionDetail('Test', 'TestColumnName', 'TypeBDetails'));
        const b = new Transaction(bDetails);

        expect(a.equals(b)).toBe(false);
    });

    it('should be able to check if a transaction has the given column names', () => {

        const testObject = new Transaction([
            new TransactionDetail('Test', 'TestColumn1', STRING_TYPE),
            new TransactionDetail('Test', 'TestColumn2', STRING_TYPE),
        ]);

        const headersToCheck = ['TestColumn1', 'TestColumn2'];
        expect(testObject.hasDetailWithColumnName(headersToCheck)).toBe(true);
    });

    it('should be able to check if a transaction has the given column name', () => {
        const testObject = new Transaction([
            new TransactionDetail('Test', 'TestColumn1', STRING_TYPE),
        ]);

        const headersToCheck = ['TestColumn1'];
        expect(testObject.hasDetailWithColumnName(headersToCheck)).toBe(true);
        expect(testObject.hasDetailWithColumnName('TestColumn1')).toBe(true);
    });

    it('should return false if there is one additional header that is not in the transaction', () => {
        const testObject = new Transaction([
            new TransactionDetail('Test', 'TestColumn1', STRING_TYPE),
        ]);

        const headersToCheck = ['TestColumn1', 'TestColumn2'];
        expect(testObject.hasDetailWithColumnName(headersToCheck)).toBe(false);
    });

    it('should return false if there is an empty array given to hasDetailWithColumnName', () => {
        const testObject = new Transaction([
            new TransactionDetail('Test', 'TestColumn1', STRING_TYPE),
        ]);

        const headersToCheck = new Array<string>();
        expect(testObject.hasDetailWithColumnName(headersToCheck)).toBe(false);
    });
});