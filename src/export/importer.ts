import { Columns } from "../export/columns";

export interface Importer {
  defineIncomingFormat: (columns: Columns) => void;
  convert: (item: string) => Object;
}
