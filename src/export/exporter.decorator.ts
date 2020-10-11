import { Transaction } from "../pojo/transaction";
import { Columns } from "./columns";
import { Category } from "../pojo/category";
import { Exporter } from "./exporter";

export class ExporterDecorator implements Exporter {

    exporter : Exporter;

    constructor(exporter? : Exporter) {
        this.exporter = exporter;
    }
    
    convertColumns(columns : Columns) {
        if (this.exporter) {
            return this.exporter.convertColumns(columns);
        } else {
            return "";
        }
    }

    defineOutgoingFormat(columns: Columns) {
        if (this.exporter) {
            this.exporter.defineOutgoingFormat(columns);
        }
    }

    convert(transaction : Transaction, category? : Category) {
        if (this.exporter) {
            return this.exporter.convert(transaction, category);
        } else {
            return "";
        }
    }
}