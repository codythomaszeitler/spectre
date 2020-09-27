import { Transaction } from "../pojo/transaction";
import { CATEGORY_TYPE } from "../pojo/category";
import { Columns, columnNameDelimeter } from "./columns";
import { Category } from "../pojo/category";
import { Exporter } from "./exporter";
import { DetailConverter } from "./detail.converter";

export class CsvExporter implements Exporter {
  columns: Columns;

  constructor() {
    this.columns = new Columns({});
  }

  defineOutgoingFormat(columns : Columns) {
    this.columns = columns.copy();
  }

  convertColumns(columns : Columns) {
    let converted = '';
    for (let i = 0; i < columns.getNumColumns(); i++) {
      if (i === 0) {
        converted = columns.getName(i);
      } else {
        converted = converted + ',' + columns.getName(i);
      }
    }
    return converted;
  }

  convert(transaction: Transaction, category?: Category) {
    const containsColumnName = (columnNames: string[]) => {
      let hasColumnName = false;
      for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        if (transaction.hasDetailWithColumnName(columnName)) {
          hasColumnName = true;
          break;
        }
      }
      return hasColumnName;
    };

    const getMatchingColumnName = (columnNames: string[]) => {
      let matchingColumnName = null;

      for (let i = 0; i < columnNames.length; i++) {
        if (transaction.hasDetailWithColumnName(columnNames[i])) {
          matchingColumnName = columnNames[i];
          break;
        }
      }
      return matchingColumnName;
    };

    let converted = "";

    const details = transaction.getDetails();
    let length = this.columns.getNumColumns();

    for (let i = 0; i < length; i++) {
      if (!this.columns.hasColumn(i)) {
        const detail = details[i];
        if (detail) {
          converted += escapeCsvElement(detail.getElement()) + ",";
        } else {
          converted += escapeCsvElement(category.getName()) + ",";
        }
        continue;
      }

      const type = this.columns.getType(i);
      const nameOrNames = this.columns.getName(i);

      if (type === CATEGORY_TYPE) {
        converted += escapeCsvElement(category.getName()) + ",";
      } else if (!nameOrNames) {
        converted += ",";
      } else {
        const columnNames = nameOrNames.split(columnNameDelimeter);
        if (containsColumnName(columnNames)) {
          const matchingColumnName = getMatchingColumnName(columnNames);
          const converter = new DetailConverter();
          converted +=
            escapeCsvElement(
              converter.fromDetail(
                transaction.getDetailByName(matchingColumnName)
              )
            ) + ",";
        } else {
          converted += ",";
        }
      }
    }

    return removeCommaAtEnd(converted);
  }
}

export function removeCommaAtEnd(toRemoveFrom : string) {
    let withoutLastComma = toRemoveFrom.substring(0, toRemoveFrom.length - 1);
    return withoutLastComma;
}

export function escapeCsvElement(raw: string) {
  const asCsv = '"' + raw + '"';
  return asCsv;
}
