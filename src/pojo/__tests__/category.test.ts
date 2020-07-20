import { Category } from "../category";
import { Currency } from "../currency";
import {Transaction } from '../transaction';
import { TransactionDetail } from "../info.line";

describe('Category', () => {
    it('should respect equality', () => {
        const a = new Category('A');

        expect(a.equals(a.copy())).toBe(true);

        const b = new Category('B');
        expect(a.equals(b)).toBe(false);
    });

    it('should be able to associate a transaction' , () => {
        const testObject = new Category('Test');
        testObject.associate(new Transaction([TransactionDetail.withCurrency(new Currency(500))]));

        const transactions = testObject.getTransactions();
        expect(transactions.length).toBe(1);
    });

    it('should be able to unassociate a transaction', () => {
        const testObject = new Category('Test');
        testObject.associate(new Transaction([TransactionDetail.withCurrency(new Currency(500))]));
        testObject.unassociate(new Transaction([TransactionDetail.withCurrency(new Currency(500))]));

        const transactions = testObject.getTransactions();
        expect(transactions.length).toBe(0);
    });

    it('should return an empty list if there are no associated transactions', () => {
        const testObject = new Category('Test');
        expect(testObject.getTransactions().length).toBe(0);
    });

    it('should throw an exception if an empty category type is given', () => {
        let caughtException = null;
        try {
            new Category('    '); 
        } catch (e) {
            caughtException = e;
        }

        expect(caughtException.message).toBe('Must give a value that is not just empty space');
    });

    it('should trim off empty white space around the given type', () => {
        const testObject = new Category('     a    ');
        expect(testObject.getType()).toBe('a');
    });

    it('should throw an exception if a falsy type is given', () => {
        let caughtException = null;
        try {
            new Category(null);
        } catch (e) {
            caughtException = e;
        }

        expect(caughtException.message).toBe('Cannot build a category with a falsy type string');
    });
});