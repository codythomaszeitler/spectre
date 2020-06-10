import {Currency} from '../currency';

describe('Currency', () => {
    it('should be able to add two USD currencies together', () => {
        const a = new Currency(400, 'USD');
        const b = new Currency(200, 'USD');

        const c = a.add(b);

        expect(c.equals(new Currency(600, 'USD'))).toBe(true);
    });

    it('should be able to add a negative and postive currencies together', () => {
        const a = new Currency(200, 'USD');
        const b = new Currency(-200, 'USD');

        const c = a.add(b);

        expect(c.equals(new Currency(0, 'USD'))).toBe(true);
    });

    it('should be able to add with cents on each', () => {
        const a = new Currency(200.25, 'USD');
        const b = new Currency(200.25, 'USD');

        const c = a.add(b);

        expect(c.equals(new Currency(400.50, 'USD'))).toBe(true); 
    });

    it('should be able to copy', () => {
        const a = new Currency(200.25, 'USD');
        const copy = a.copy();

        expect(a.equals(copy)).toBe(true);
        expect(copy.equals(a)).toBe(true);
    });
});