import { CategoryColors } from "../css/styles";
import { Columns } from "../export/columns";
import { CsvImporter } from "../export/csv.importer";
import {
  SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
  SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
} from "../export/with.view.context.exporter";
import { Category } from "../pojo/category";
import { Color } from "../pojo/color";
import { Transaction } from "../pojo/transaction";
import { ViewContext } from "../screens/view.context";
import {
  ScepterFormatImporter,
  ScepterFormattedLine,
  SCEPTER_CATEGORY_COLUMN_NAME,
} from "./scepter.format.importer";

export const CATEGORY_NOT_FOUND = new Category(
  "_______CATEGORY NOT FOUND_______"
);
export const COLOR_NOT_FOUND = new Color('#96E3F3');
export const ORDERING_NOT_FOUND = 1;

export class ScepterFormatCsvImporter implements ScepterFormatImporter {
  columns: Columns;

  constructor() {
    this.columns = new Columns({});
  }

  defineIncomingFormat(columns: Columns) {
    // TODO it feels like this should have a check to ensure that
    // the column structure that we have is in line with scepter format
    // looks like.
    this.columns = columns.copy();
  }

  convert(item: string) {
    const csvImporter = new CsvImporter();
    csvImporter.defineIncomingFormat(this.columns);

    const transactionWithCategory = csvImporter.convert(item);

    const category = this.getCategoryFromDetail(transactionWithCategory);

    const viewConextBuilder = new ViewContext.Builder();

    viewConextBuilder.setCategoryColor(
      category,
      this.getColorFromDetail(transactionWithCategory)
    );
    viewConextBuilder.setCategoryOrdering(
      category,
      this.getOrderingFromDetail(transactionWithCategory)
    );

    return new ScepterFormattedLine(
      new Transaction(this.getNonCategoryDetails(transactionWithCategory)),
      category,
      viewConextBuilder.build()
    );
  }

  getNonCategoryDetails(transaction: Transaction) {
    const detailsForConversion = [];

    const details = transaction.getDetails();
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (
        detail.getColumnName() !== SCEPTER_CATEGORY_COLUMN_NAME &&
        detail.getColumnName() !== SCEPTER_CATEGORY_COLOR_COLUMN_NAME &&
        detail.getColumnName() !== SCEPTER_CATEGORY_ORDERING_COLUMN_NAME
      ) {
        detailsForConversion.push(detail);
      }
    }
    return detailsForConversion;
  }

  getCategoryFromDetail(transaction: Transaction) {
    const details = transaction.getDetails();

    let category = CATEGORY_NOT_FOUND;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (detail.getColumnName() === SCEPTER_CATEGORY_COLUMN_NAME) {
        category = detail.asGivenType();
      }
    }
    return category;
  }

  getColorFromDetail(transaction: Transaction) {
    const details = transaction.getDetails();

    let color = COLOR_NOT_FOUND;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (detail.getColumnName() === SCEPTER_CATEGORY_COLOR_COLUMN_NAME) {
        color = detail.asGivenType();
      }
    }
    return color;
  }

  getOrderingFromDetail(transaction: Transaction) {
    const details = transaction.getDetails();

    let ordering = ORDERING_NOT_FOUND;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (detail.getColumnName() === SCEPTER_CATEGORY_ORDERING_COLUMN_NAME) {
        ordering = detail.asGivenType();
      }
    }
    return ordering;
  }
}
