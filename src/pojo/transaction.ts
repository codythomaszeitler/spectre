export const AMOUNT_TYPE = "Amount";
export const TIMESTAMP_TYPE = "When";

export class Transaction {
  constructor(amount, when, otherInfo) {
    this.amount = amount.copy();
    
    if (when) {
        this.when = when.copy();
    }

    this.details = [];
    if (otherInfo) {
      this.details = otherInfo.slice();
    }
  }

  copy() {
    return new Transaction(this.amount, this.when, this.details);
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

  getWhen() {
    return this.when.copy();
  }

  equals(transaction) {
    const areDetailsEquivalent = (aDetails, bDetails) => {
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
    let whenEquivalent = this.getWhen().equals(transaction.getWhen());

    return (
      currenciesEquivalent &&
      whenEquivalent &&
      areDetailsEquivalent(this.details, transaction.details)
    );
  }
}
