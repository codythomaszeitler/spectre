import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";
import { TransactionLoader } from "./transaction.loader";
import { ScepterFormatImporter } from "./scepter.format.importer";
import { ColumnEstimation } from "./column.estimation";
import { DocumentLoadService } from "./document.load.service";

export class ScepterTransactionLoadService implements TransactionLoader {
  importer: ScepterFormatImporter;

  constructor(importer: ScepterFormatImporter) {
    this.importer = importer;
  }

  async load(scepterUser: SpectreUser, location: RawDataLocation) {
    const estimator = new ColumnEstimation();
    const structureOfCsv = await estimator.estimateByLocation(location);
    this.importer.defineIncomingFormat(structureOfCsv);

    const documentLoadService = new DocumentLoadService(location);
    const lines = await documentLoadService.fetchall();

    for (let i = 1; i < lines.length; i++) {
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
