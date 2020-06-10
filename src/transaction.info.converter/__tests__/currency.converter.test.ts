import {CurrencyConverter} from '../currency.converter';
import {Currency} from '../../pojo/currency';

describe('Currency Converter', () => {
    it('should be able to convert a currency to string', () => {
        const testObject = new CurrencyConverter();

        const converted = testObject.toString(new Currency(4000, 'USD'));
        expect(converted).toBe('$4,000.00');
    });
});