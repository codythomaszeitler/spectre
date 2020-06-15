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
});