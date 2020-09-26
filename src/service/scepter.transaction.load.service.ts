import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";
import { TransactionLoader } from "./transaction.loader";
import { ScepterFormatImporter } from "./scepter.format.importer";

export class ScepterTransactionLoadService implements TransactionLoader {
  importer: ScepterFormatImporter;

  constructor(importer: ScepterFormatImporter) {
    this.importer = importer;
  }

  async load(scepterUser: SpectreUser, location: RawDataLocation) {
    const transactions = null;




  }
}
