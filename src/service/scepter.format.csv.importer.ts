import { Columns } from "../export/columns";
import { CsvImporter } from "../export/csv.importer";
import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import {
  ScepterFormatImporter,
  ScepterFormattedLine,
  SCEPTER_CATEGORY_COLUMN_NAME
} from "./scepter.format.importer";

export class ScepterFormatCsvImporter implements ScepterFormatImporter {
  columns: Columns;

  constructor() {
    this.columns = new Columns({});
  }

  defineIncomingFormat(columns : Columns) {
    this.columns = columns.copy();
  }

  convert(item: string) {
    const csvImporter = new CsvImporter();
    csvImporter.defineIncomingFormat(this.columns);

    const transactionWithCategory = csvImporter.convert(item);

    const details = transactionWithCategory.getDetails();
    const detailsForConversion = [];
    for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        if (detail.getColumnName() !== SCEPTER_CATEGORY_COLUMN_NAME) {
            detailsForConversion.push(detail);
        }
    }

    let category = null;
    for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        if (detail.getColumnName() === SCEPTER_CATEGORY_COLUMN_NAME) {
            category = new Category(detail.getElement());
        }
    }

    return new ScepterFormattedLine(new Transaction(detailsForConversion), category);
  }



  // convert: (item: string) => ScepterFormatLine;
}
