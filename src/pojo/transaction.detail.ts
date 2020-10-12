import { Currency } from "./currency";
import { AMOUNT_TYPE } from "./transaction";
import { CurrencyConverter } from "../transaction.detail.converter/currency.converter";
import { DateConverter } from "../transaction.detail.converter/date.converter";
import {
  SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
  SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
} from "../export/with.view.context.exporter";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../service/scepter.format.importer";
import { Color, COLOR_TYPE } from "./color";
import { Category, CATEGORY_TYPE } from "./category";
import { CATEGORY_NOT_FOUND } from "../service/scepter.format.csv.importer";

export const STRING_TYPE = "String";

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


  // This was supposed to be the function that exports something as a string
  getElement() {
    let element = null;
    if (this.type === "Date") {
      const dateConverter = new DateConverter();
      element = dateConverter.intoString(dateConverter.fromString(this.detail));
    } else if (this.type == "Color") {
      element = this.asGivenType().hex();
    } else if (this.type === "Category") {
      element = this.asGivenType().getName();
    } else if (this.type === "number") {
      element = this.detail;
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
    } else if (this.type === CATEGORY_TYPE) {
      if (!this.detail) {
        asGivenType = CATEGORY_NOT_FOUND;
      } else {
        asGivenType = new Category(this.detail);
      }

    } else if (this.type === COLOR_TYPE) {
      asGivenType = new Color(this.detail);
    } else if (this.type === 'number') {
      asGivenType = parseInt(this.detail);
    }

    return asGivenType;
  }
}
