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

    for (let i = 0; i < this.columns.getNumColumns(); i++) {
      const type = this.columns.getType(i);

      if (type === AMOUNT_TYPE) {
        const converter = new CurrencyConverter();
        const currency = transaction.getAmount();
        converted += escapeCsvElement(converter.toString(currency)) + ",";
      } else if (type === CATEGORY_TYPE) {
        converted += escapeCsvElement(category.getType()) + ",";
      } else {
        converted += escapeCsvElement(transaction.getDetail(type)) + ",";
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
