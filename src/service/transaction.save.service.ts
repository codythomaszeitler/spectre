import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "../export/exporter";
import { RawDataLocation } from "./raw.data.location";
import { DocumentSaveService } from "./document.save.service";
import { ColumnEstimation } from "./column.estimation";

export class TransactionSaveService {

  exporter: Exporter;

  constructor(
    exporter: Exporter
  ) {
    this.exporter = exporter;
  }

  async save(scepterUser : SpectreUser, location : RawDataLocation) {

    const estimator = new ColumnEstimation();
    const structureOfCsv = estimator.estimateBySpectreUser(scepterUser);
    this.exporter.defineOutgoingFormat(structureOfCsv);

    let converted = [this.exporter.convertColumns(structureOfCsv) + '\n'];

    const categories = scepterUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const transactions = scepterUser.getTransactionsFor(category);
        for (let j = 0; j < transactions.length; j++) {
            const transaction = transactions[j].copy();

            const asString = this.exporter.convert(transaction, category); 
            converted.push(asString + '\n');
        }
    }

    const documentSaveService = new DocumentSaveService(location);
    await documentSaveService.save(converted);
  }

  // This function should go through every transaction and ensure that the
  // exported 
  static generateCompliantColumns(spectreUser : SpectreUser) {
    const estimator = new ColumnEstimation();
    return estimator.estimateBySpectreUser(spectreUser);
  }
}
