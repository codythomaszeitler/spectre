import { ImporterDecorator } from "./importer.decorator";
import { Columns } from "./columns";
import { STRING_TYPE, TransactionDetail } from "../pojo/transaction.detail";
import { Transaction } from "../pojo/transaction";
import { Importer } from "./importer";

export class WithStaticValueCsvConveter extends ImporterDecorator {
  columnName: string;
  value: string;

  constructor(columnName: string, value: string, importer?: Importer) {
    super(importer);

    this.columnName = columnName;
    this.value = value;
  }

  defineIncomingFormat(columns: Columns) {
    super.defineIncomingFormat(columns);
  }

  necessaryColumnHeaders() {
    const headers = super.necessaryColumnHeaders();
    return headers;
  }

  convert(item: string) {
    const transaction = super.convert(item);

    const details = transaction.getDetails();
    details.push(
      new TransactionDetail(this.value, this.columnName, STRING_TYPE)
    );
    return new Transaction(details);
  }
}
