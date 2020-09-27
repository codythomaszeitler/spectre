import { Transaction } from "../pojo/transaction";
import { Category } from "../pojo/category";
import { Columns } from "../export/columns";

export interface Exporter {
    defineOutgoingFormat: (columns : Columns) => void;
    convert: (transaction: Transaction, category? : Category) => string;
}