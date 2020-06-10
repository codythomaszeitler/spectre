import { Category } from "../category";
import { Currency } from "../currency";
import {Transaction } from '../transaction';
import {Timestamp } from '../timestamp';

describe('Category', () => {
    it('should respect equality', () => {
        const a = new Category('A');

        expect(a.equals(a.copy())).toBe(true);

        const b = new Category('B');
        expect(a.equals(b)).toBe(false);
    });

    it('should be able to associate a transaction' , () => {
        const testObject = new Category('Test');
        testObject.associate(new Transaction(new Currency(500, 'USD'), new Timestamp(2019, 1, 1)));

        const transactions = testObject.getTransactions();
        expect(transactions.length).toBe(1);
    });

    it('should return an empty list if there are no associated transactions', () => {
        const testObject = new Category('Test');
        expect(testObject.getTransactions().length).toBe(0);
    });
});