import { Transaction } from "../pojo/transaction";
import { CATEGORY_TYPE } from "../pojo/category";
import { Columns, columnNameDelimeter } from "./columns";
import { Category } from "../pojo/category";
import { Exporter } from "./exporter";
import { ExporterDecorator } from "./exporter.decorator";

export class CsvExporter extends ExporterDecorator {
  columns: Columns;

  constructor(exporter?: Exporter) {
    super(exporter);
    this.columns = new Columns({});
  }

  defineOutgoingFormat(columns: Columns) {
    super.defineOutgoingFormat(columns);
    this.columns = columns.copy();
  }

  convertColumns(columns: Columns) {
    let converted = "";

    const getMinIndex = () => {
      let minIndex = 1000000000;
      for (let i = 0; i < columns.getNumColumns(); i++) {
        if (columns.hasColumn(i)) {
          if (i < minIndex) {
            minIndex = i;
          }
        }
      }
      return minIndex;
    };

    const getMaxIndex = () => {
      let maxIndex = -1;
      for (let i = columns.getNumColumns(); i >= 0; i--) {
        if (columns.hasColumn(i)) {
          if (i > maxIndex) {
            maxIndex = i;
          }
        }
      }
      return maxIndex;
    };

    for (let i = getMinIndex(); i <= getMaxIndex(); i++) {
      if (!columns.hasColumn(i)) {
        converted += ",noConfig" + i;
        continue;
      }

      if (i === 0) {
        converted = columns.getName(i);
      } else {
        converted = converted + "," + columns.getName(i);
      }
    }
    return converted + super.convertColumns(columns);
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
      const name = this.columns.getName(i);

      if (type === CATEGORY_TYPE) {
        converted += escapeCsvElement(category.getName()) + ",";
      } else if (!name) {
        converted += ",";
      } else {
        if (containsColumnName([name])) {
          converted +=
            escapeCsvElement(transaction.getDetailByName(name).getElement()) +
            ",";
        } else {
          converted += ",";
        }
      }
    }

    const fullString = converted + super.convert(transaction, category);
    return removeCommaAtEnd(fullString);
  }
}

export function removeCommaAtEnd(toRemoveFrom: string) {
  let withoutLastComma = toRemoveFrom.substring(0, toRemoveFrom.length - 1);
  return withoutLastComma;
}

export function escapeCsvElement(raw: string) {
  const asCsv = '"' + raw + '"';
  return asCsv;
}
