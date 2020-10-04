import { Currency } from "./currency";
import { AMOUNT_TYPE } from "./transaction";
import { CurrencyConverter } from "../transaction.detail.converter/currency.converter";
import { DateConverter } from "../transaction.detail.converter/date.converter";

export const STRING_TYPE = 'String';

export class TransactionDetail {
  detail: string;
  columnName: string;
  type: string;

  constructor(detail: string, columnName: string, type: string) {
    this.detail = detail;
    this.columnName = columnName;
    this.type = type;

    this.ensureConversionCanTakePlace();
  }

  ensureConversionCanTakePlace() {
    this.getElement();
    this.asGivenType();
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
    return (
      this.detail === transactionDetail.detail &&
      this.type === transactionDetail.type
    );
  }

  getElement() {
    let element = null;
    if (this.type === "Date") {
      const dateConverter = new DateConverter();
      element = dateConverter.intoString(dateConverter.fromString(this.detail));
    } else {
      element = this.detail;
    }

    return element;
  }

  getColumnName() {
    return this.columnName;
  }

  getType() {
    return this.type;
  }

  asGivenType() {
    let asGivenType = null;
    if (this.type === "Date") {
      const dateConverter = new DateConverter();
      asGivenType = dateConverter.fromString(this.detail);
    } else if (this.type === STRING_TYPE) {
      asGivenType = this.detail;
    }

    return asGivenType;
  }
}
