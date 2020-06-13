import { Transaction } from "../pojo/transaction";
import { Category } from "../pojo/category";

export interface Exporter {
    convert: (transaction: Transaction, category? : Category) => string;
}