import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "../export/exporter";
import { RawDataLocation } from "./scepter.location";
import { DocumentSaveService } from "./document.save.service";
import { ColumnEstimation } from "./column.estimation";

export class TransactionSaveService {
  spectreUser: SpectreUser;
  location: RawDataLocation;
  exporter: Exporter;

  constructor(
    spectreUser: SpectreUser,
    location: RawDataLocation,
    exporter: Exporter
  ) {
    this.spectreUser = spectreUser;
    this.location = location;
    this.exporter = exporter;
  }

  async save() {

    let converted = [];

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const transactions = this.spectreUser.getTransactionsFor(category);
        for (let j = 0; j < transactions.length; j++) {
            const transaction = transactions[j].copy();

            const asString = this.exporter.convert(transaction, category); 
            converted.push(asString + '\n');
        }
    }

    const documentSaveService = new DocumentSaveService(this.location);
    await documentSaveService.save(converted);
  }

  static generateCompliantColumns(spectreUser : SpectreUser) {
    const estimator = new ColumnEstimation();
    return estimator.estimateBySpectreUser(spectreUser);
  }
}
