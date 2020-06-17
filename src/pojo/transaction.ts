import { TransactionDetail } from "./info.line";

export const AMOUNT_TYPE = "Amount";

export class Transaction {

  details : TransactionDetail[];
  id : number;

  constructor(otherInfo : TransactionDetail[]) {
    this.details = otherInfo.slice();
    this.id = -1;
  }

  isCategorized() {
    return this.id !== -1;
  }

  copy() {
    const transaction = new Transaction(this.details);
    transaction.id = this.id;
    return transaction;
  }

  getDetails() {
    const copied = [];
    for (let i = 0; i < this.details.length; i++) {
      copied.push(this.details[i].copy());
    }
    return copied;
  }

  getDetailByName(name : string) {
    let raw = null;

    for (let i = 0; i < this.details.length; i++) {
      const detail = this.details[i].getColumnName();
      if (this.details[i].getColumnName() === name) {
        raw = this.details[i].getElement();
        break;
      }
    }

    return raw;
  }


  equals(transaction : Transaction) {
    const areDetailsEquivalent = (aDetails : TransactionDetail[], bDetails : TransactionDetail[]) => {
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

    let idsEquivalent = this.id === transaction.id;

    return (
      areDetailsEquivalent(this.details, transaction.details) &&
      idsEquivalent
    );
  }
}
