import { Transaction } from "../pojo/transaction";
import { CATEGORY_TYPE } from "../pojo/category";
import { Columns } from "./columns";
import { Category } from "../pojo/category";
import { Exporter } from "./exporter";
import { DetailConverter } from "./detail.converter";

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
    let length = details.length;
    if (category) {
      length = length + 1;
    }

    for (let i = 0; i < length; i++) {
      if (!this.columns.hasColumn(i)) {
        const detail = details[i];
        if (detail) {
          converted += escapeCsvElement(detail.getElement()) + ',';
        } else {
          converted += escapeCsvElement(category.getType()) + ',';
        }
        continue;
      }

      const type = this.columns.getType(i);
      const name = this.columns.getName(i);

      if (type === CATEGORY_TYPE) {
        converted += escapeCsvElement(category.getType()) + ",";
      } else {
        const converter = new DetailConverter();
        converted += escapeCsvElement(converter.fromDetail(transaction.getDetailByName(name))) + ',';
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
