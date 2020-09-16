import { Currency } from "./currency";
import { AMOUNT_TYPE } from "./transaction";
import { CurrencyConverter } from "../transaction.info.converter/currency.converter";

export class TransactionDetail {
  detail: string;
  columnName: string;
  type: string;

  constructor(detail: string, columnName: string, type: string) {
    this.detail = detail;
    this.columnName = columnName;
    this.type = type;
  }

  static withCurrency(currency: Currency, columnName: string) {
    const converter = new CurrencyConverter();

    const detail = new TransactionDetail(
      converter.toString(currency),
      columnName,
      AMOUNT_TYPE
    );
    return detail;
  }

  copy() {
    return new TransactionDetail(this.detail, this.columnName, this.type);
  }

  equals(transactionDetail: TransactionDetail) {
    return this.detail === transactionDetail.detail && this.type === transactionDetail.type;
  }

  getElement() {
    return this.detail;
  }

  getColumnName() {
    return this.columnName;
  }

  getType() {
    return this.type;
  }
}
