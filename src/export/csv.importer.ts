import { Transaction } from "../pojo/transaction";
import { Columns } from "./columns";
import { STRING_TYPE, TransactionDetail } from "../pojo/transaction.detail";
import { ImporterDecorator } from "./importer.decorator";
import { Importer } from "./importer";
import { split } from "./csv.line.splitter";

export class CsvImporter extends ImporterDecorator {
  columns: Columns;

  constructor(importer?: Importer) {
    super(importer);
    this.columns = new Columns({});
  }

  defineIncomingFormat(columns: Columns) {
    this.columns = columns.copy();
    super.defineIncomingFormat(columns);
  }

  convert(string: string) {
    const transaction = super.convert(string);

    let details = transaction.getDetails();
    if (!string) {
      return new Transaction(this.getDefaultDetails());
    }

    const splits =  split(string);
    details.push(...this.convertDetailsFoundInLine(splits));
    details.push(...this.convertDetailsNotFoundInLine(splits));

    return new Transaction(details);
  }

  getDefaultDetails() {
    const details = [];
    const numColumns = this.columns.getNumColumns();
    for (let i = 0; i < numColumns; i++) {
      if (this.columns.hasColumn(i)) {
        details.push(
          new TransactionDetail(
            "",
            this.columns.getName(i),
            this.columns.getType(i)
          )
        );
      }
    }
    return details;
  }

  convertDetailsFoundInLine(splits: Array<string>) {
    const details = [];
    for (let i = 0; i < splits.length; i++) {
      const element = getElement(i, splits);
      const split = unescapeCsvElement(element);
      const detail = new TransactionDetail(
        split,
        this.getColumnNameIfExists(this.columns, i),
        this.getColumnTypeIfExists(this.columns, i)
      );
      details.push(detail);
    }
    return details;
  }

  convertDetailsNotFoundInLine(splits: Array<string>) {
    const details = [];
    for (let i = splits.length; i < this.columns.getNumColumns(); i++) {
      const detail = new TransactionDetail(
        "",
        this.getColumnNameIfExists(this.columns, i),
        this.getColumnTypeIfExists(this.columns, i)
      );
      details.push(detail);
    }
    return details;
  }

  getColumnNameIfExists(columns: Columns, index: number) {
    if (!columns.hasColumn(index)) {
      return "noConfig" + index;
    }

    return columns.getName(index);
  }

  getColumnTypeIfExists(columns: Columns, index: number) {
    if (!columns.hasColumn(index)) {
      return STRING_TYPE;
    }

    return columns.getType(index);
  }
}

function getElement(index: number, strings: Array<string>) {
  if (index > strings.length) {
    return "";
  } else {
    return strings[index];
  }
}

export function unescapeCsvElement(element: string) {
  if (!element) {
    return "";
  }
  return element.split('"').join("");
}
