import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { Columns } from "../export/columns";
import { ViewContext } from "../screens/view.context";

export interface ScepterFormatImporter {
  defineIncomingFormat: (columns: Columns) => void;
  convert: (item: string) => ScepterFormattedLine;
}

export const SCEPTER_CATEGORY_COLUMN_NAME = "Category";

export class ScepterFormattedLine {
  transaction: Transaction;
  category: Category;
  viewContext : ViewContext;

  constructor(transaction: Transaction, category: Category, viewContext : ViewContext) {
    this.transaction = transaction.copy();
    this.category = category.copy();
    this.viewContext = viewContext;
  }

  getTransaction() {
    return this.transaction.copy();
  }

  getCategory() {
    return this.category.copy();
  }

  getViewContext() {
    return this.viewContext;
  }
}
