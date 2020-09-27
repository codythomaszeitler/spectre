import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { Columns } from "../export/columns";

export interface ScepterFormatImporter {
  defineIncomingFormat: (columns: Columns) => void;
  convert: (item: string) => ScepterFormattedLine;
}

export const SCEPTER_CATEGORY_COLUMN_NAME = "Category";

export class ScepterFormattedLine {
  transaction: Transaction;
  category: Category;

  constructor(transaction: Transaction, category: Category) {
    this.transaction = transaction.copy();
    this.category = category.copy();
  }

  getTransaction() {
    return this.transaction.copy();
  }

  getCategory() {
    return this.category.copy();
  }
}
