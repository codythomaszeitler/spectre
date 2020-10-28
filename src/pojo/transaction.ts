import { TransactionDetail } from "./transaction.detail";

export const AMOUNT_TYPE = "Amount";

export class Transaction {
  /*
   Are these necessary sorted?
   The answer is yes. 
  */
  details: TransactionDetail[];
  id: number;

  constructor(otherInfo: TransactionDetail[]) {
    this.details = otherInfo.slice();
    this.id = -1;
  }

  getDetailByColumnIndex(columnIndex: number) {
    return this.details[columnIndex];
  }

  isCategorized() {
    return this.id !== -1;
  }

  copy() {
    const transaction = new Transaction(this.getDetails());
    transaction.id = this.id;
    return transaction;
  }

  getNumDetails() {
    const details = this.getDetails();
    return details.length;
  }

  getDetails() {
    const copied = [];
    for (let i = 0; i < this.details.length; i++) {
      copied.push(this.details[i].copy());
    }
    return copied;
  }

  hasDetailWithColumnName(columnName: string) {
    const checkForColumn = (columnToCheckFor: string) => {
      let hasDetailWithColumnName = false;
      for (let i = 0; i < this.details.length; i++) {
        if (this.details[i].getColumnName() === columnToCheckFor) {
          hasDetailWithColumnName = true;
          break;
        }
      }
      return hasDetailWithColumnName;
    };

    return checkForColumn(columnName);
  }

  //   TODO This function is deprecated, remove at some point.
  getDetailByName(name: string) {
    let raw = null;

    const assertOnlyOneMatchingColumnName = () => {
      let count = 0;
      for (let i = 0; i < this.details.length; i++) {
        if (this.details[i].getColumnName() === name) {
          count = count + 1;
        }
      }

      const numAllowedColumns = 1;
      if (count > numAllowedColumns) {
        throw new Error(
          "Tried to call getDetailByName when there was more than one element "
        );
      }
    };

    assertOnlyOneMatchingColumnName();

    for (let i = 0; i < this.details.length; i++) {
      if (this.details[i].getColumnName() === name) {
        raw = this.details[i];
        break;
      }
    }

    return raw;
  }

  getDetailsByColumnName(columnName: string) {
    const details = [];
    for (let i = 0; i < this.details.length; i++) {
      if (this.details[i].getColumnName() === columnName) {
        details.push(this.details[i].copy());
      }
    }
    return details;
  }

  getElementByColumnName(columnName: string) {
    let element = null;

    for (let i = 0; i < this.details.length; i++) {
      const detail = this.details[i];
      if (detail.getColumnName() === columnName) {
        element = detail.getElement();
      }
    }

    return element;
  }

  equals(transaction: Transaction) {
    const areDetailsEquivalent = (
      aDetails: TransactionDetail[],
      bDetails: TransactionDetail[]
    ) => {
      if (aDetails.length !== bDetails.length) {
        return false;
      }

      let equivalent = true;
      for (let i = 0; i < aDetails.length; i++) {
        let foundMatch = false;
        for (let j = 0; j < bDetails.length; j++) {
          const aDetail = aDetails[i];
          const bDetail = bDetails[j];

          if (aDetail.equals(bDetail)) {
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
      areDetailsEquivalent(this.details, transaction.details) && idsEquivalent
    );
  }
}
