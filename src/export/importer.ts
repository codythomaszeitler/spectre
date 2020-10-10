import { Columns } from "../export/columns";
import { Transaction } from "../pojo/transaction";

export interface Importer {
  defineIncomingFormat: (columns: Columns) => void;
  convert: (item: string) => Transaction;
}
