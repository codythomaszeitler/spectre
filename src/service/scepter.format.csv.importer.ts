import { Columns } from "../export/columns";
import { CsvImporter } from "../export/csv.importer";
import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import {
  ScepterFormatImporter,
  ScepterFormatLine,
  SCEPTER_CATEGORY_COLUMN_NAME
} from "./scepter.format.importer";

export class ScepterFormatCsvImporter implements ScepterFormatImporter {
  columns: Columns;

  constructor(columns: Columns) {
    this.columns = columns;
  }

  convert(item: string) {
    const csvImporter = new CsvImporter(this.columns);

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

    return new ScepterFormatLine(new Transaction(detailsForConversion), category);
  }



  // convert: (item: string) => ScepterFormatLine;
}
