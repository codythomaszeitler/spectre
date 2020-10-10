import { ImporterDecorator } from "./importer.decorator";
import { Importer } from "../export/importer";
import { Columns } from "../export/columns";
import { STRING_TYPE, TransactionDetail } from "../pojo/transaction.detail";
import { Transaction } from "../pojo/transaction";

export class WithNotesCsvConverter extends ImporterDecorator {
  constructor(importer: Importer) {
    super(importer);
  }

  defineIncomingFormat(columns: Columns) {
    super.defineIncomingFormat(columns);
  }

  convert(item: string) {
    const transaction = super.convert(item);

    const details = transaction.getDetails();
    details.push(new TransactionDetail("", "Notes", STRING_TYPE));

    return new Transaction(details);
  }
}
