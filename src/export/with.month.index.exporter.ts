import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { Columns } from "./columns";
import { ExporterDecorator } from "./exporter.decorator";

// export const 

export class WithMonthIndexExporter extends ExporterDecorator {
  constructor(exporter?: ExporterDecorator) {
    super(exporter);
  }

  defineOutgoingFormat(columns: Columns): void {
    super.defineOutgoingFormat(columns);
  }

  convertColumns(columns: Columns): string {
    return super.convertColumns(columns);
  }

  convert(transaction: Transaction, category?: Category): string {
    return super.convert(transaction);
  }
}
