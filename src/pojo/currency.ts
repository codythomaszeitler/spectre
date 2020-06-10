import Dinero from "dinero.js";

export class Currency {

  amount : number;
  location : String;

  constructor(amount : number, location : String) {
    this.amount = amount;
    this.location = location;
  }

  add(currency : Currency) {
    const resultDinero = this._toDinero(this).add(this._toDinero(currency));
    return new Currency(resultDinero.toUnit(), resultDinero.getCurrency());
  }

  _toDinero(currency : Currency) {
    return Dinero({
      amount : currency.amount * 100,
      currency: currency.location,
    });
  }

  toString() {
    const asDinero = this._toDinero(this);
    return asDinero.toFormat('$0,0.00');
  }

  copy() {
    return new Currency(this.amount, this.location);
  }

  equals(currency : Currency) {
    const amountsEqual = this.amount === currency.amount;
    const locationEqual = this.location === this.location;

    return amountsEqual && locationEqual;
  }
}
