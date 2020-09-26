import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";

export interface ScepterFormatImporter {
    convert : (item : string) => ScepterFormatLine;
}

export const SCEPTER_CATEGORY_COLUMN_NAME = 'Category';

export class ScepterFormatLine {

    transaction : Transaction;
    category : Category;

    constructor(transaction : Transaction, category : Category) {
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