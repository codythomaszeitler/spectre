import { Currency } from "./currency";
import { Timestamp } from "./timestamp";
import { TransactionDetail } from "./info.line";

export const AMOUNT_TYPE = "Amount";
export const TIMESTAMP_TYPE = "When";

export class Transaction {

  amount : Currency;
  when? : Timestamp;
  details? : TransactionDetail[];

  constructor(amount : Currency, otherInfo? : TransactionDetail[]) {
    this.amount = amount.copy();
    
    this.details = [];
    if (otherInfo) {
      this.details = otherInfo.slice();
    }
  }

  copy() {
    return new Transaction(this.amount, this.details);
  }

  getDetails() {
    const copied = [];
    for (let i = 0; i < this.details.length; i++) {
      copied.push(this.details[i].copy());
    }
    return copied;
  }

  getDetail(type) {
    let raw = null;

    for (let i = 0; i < this.details.length; i++) {
      if (this.details[i].getType() === type) {
        raw = this.details[i].getDetail();
        break;
      }
    }

    return raw;
  }

  getAmount() {
    return this.amount.copy();
  }

  equals(transaction) {
    const areDetailsEquivalent = (aDetails, bDetails) => {
      if (aDetails.length !== bDetails.length) {
        return false;
      }


      let equivalent = true;
      for (let i = 0; i < aDetails.length; i++) {
        let foundMatch = false;
        for (let j = 0; j < bDetails.length; j++) {
          if (aDetails[i].equals(bDetails[j])) {
            foundMatch = true;
            break;
          }
        }
        if (!foundMatch) {
          equivalent = false;
          break;
        }
      }
      return equivalent;
    };

    let currenciesEquivalent = this.getAmount().equals(transaction.getAmount());

    return (
      currenciesEquivalent &&
      areDetailsEquivalent(this.details, transaction.details)
    );
  }
}
