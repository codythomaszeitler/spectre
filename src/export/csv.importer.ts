import { AMOUNT_TYPE, Transaction } from "../pojo/transaction";
import { CurrencyConverter } from "../transaction.detail.converter/currency.converter";
import { Columns } from "./columns";
import { TransactionDetail } from "../pojo/transaction.detail";
import { ImporterDecorator } from "./importer.decorator";
import { Importer } from "./importer";

export class CsvImporter extends ImporterDecorator {
  columns: Columns;

  constructor(importer? : Importer) {
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
      return new Transaction(details);
    }

    const splits = string.split(",");
    for (let i = 0; i < splits.length; i++) {
      if (!this.columns.hasColumn(i)) {
        const split = unescapeCsvElement(splits[i]);
        const detail = new TransactionDetail(split, "noConfig" + i, "string");
        details.push(detail);
      } else if (this.columns.getType(i) === AMOUNT_TYPE) {
        const columnName = this.columns.getName(i);
        const split = unescapeCsvElement(splits[i]);

        const converter = new CurrencyConverter();
        const amount = converter.fromString(split);
        details.push(TransactionDetail.withCurrency(amount, columnName));
      } else {
        const columnName = this.columns.getName(i);
        const split = unescapeCsvElement(splits[i]);
        const detail = new TransactionDetail(
          split,
          columnName,
          this.columns.getType(i)
        );
        details.push(detail);
      }
    }

    return new Transaction(details);
  }
}

export function unescapeCsvElement(element: string) {
  if (!element) {
    return "";
  }
  return element.split('"').join("");
}
