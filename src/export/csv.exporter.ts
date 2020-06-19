import { AMOUNT_TYPE, TIMESTAMP_TYPE, Transaction } from "../pojo/transaction";
import { CATEGORY_TYPE } from "../pojo/category";
import { CurrencyConverter } from "../transaction.info.converter/currency.converter";
import { Columns } from "./columns";
import { Category } from "../pojo/category";
import { Exporter } from "./exporter";

export class CsvExporter implements Exporter {
  columns: Columns;

  constructor(columns: Columns) {
    this.columns = columns.copy();
  }

  getHeader() {
    let header = "";
    const columnCount = this.columns.getNumColumns();
    for (let i = 0; i < columnCount; i++) {
      if (i === columnCount - 1) {
        header += escapeCsvElement(this.columns.getName(i));
      } else {
        header += escapeCsvElement(this.columns.getName(i)) + ",";
      }
    }
    return header;
  }

  convert(transaction: Transaction, category?: Category) {
    let converted = "";

    const details = transaction.getDetails();
    for (let i = 0; i < details.length; i++) {
      if (!this.columns.hasColumn(i)) {
        const detail = details[i];
        converted += escapeCsvElement(detail.getElement()) + ',';
        continue;
      }

      const type = this.columns.getType(i);
      const name = this.columns.getName(i);

      if (type === AMOUNT_TYPE) {
        const converter = new CurrencyConverter();
        const currency = transaction.getDetailByName(name);
        converted += escapeCsvElement(converter.toString(currency)) + ",";
      } else if (type === CATEGORY_TYPE) {
        converted += escapeCsvElement(category.getType()) + ",";
      } else {
        converted += escapeCsvElement(transaction.getDetailByName(name)) + ",";
      }
    }

    let withoutLastComma = converted.substring(0, converted.length - 1);
    return withoutLastComma;
  }
}

export function escapeCsvElement(raw : string) {
  const asCsv = '"' + raw + '"';
  return asCsv;
}
