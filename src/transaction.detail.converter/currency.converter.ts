import { Currency } from "../pojo/currency";

export class CurrencyConverter {

    toString(currency : Currency) {
        return currency.toString();
    }

    fromString(string : string) {
        return Currency.fromString(string);
    }
}