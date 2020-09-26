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
    while (await location.hasNext()) {
      const lines = await location.read();
      for (let i = 0; i < lines.length; i++) {
        const transactionAndCategory = this.importer.convert(lines[i]);
        const transaction = transactionAndCategory.getTransaction();
        const category = transactionAndCategory.getCategory();

        if (!scepterUser.hasCategory(category)) {
          scepterUser.addCategory(category);
        }

        scepterUser.readyForCategorization(transaction);
        scepterUser.categorize(transaction, category);
      }
    }
  }
}
