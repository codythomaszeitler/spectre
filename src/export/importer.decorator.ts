import { Transaction } from "../pojo/transaction";
import { Columns } from "./columns";
import { Importer } from "./importer";

export class ImporterDecorator implements Importer {

    importer? : Importer;

    constructor(importer? : Importer) {
        this.importer = importer;
    }

    defineIncomingFormat(columns: Columns) {
        if (this.importer) {
            this.importer.defineIncomingFormat(columns);
        }
    }

    convert(item: string) {
        if (!this.importer) {
            return new Transaction([]);
        }

        return this.importer.convert(item);
    }

    necessaryColumnHeaders() {
        if (!this.importer) {
            return new Array<string>();
        }

        return this.importer.necessaryColumnHeaders();
    }
}