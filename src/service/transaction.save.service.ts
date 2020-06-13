import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "../export/exporter";
import { Location } from "../service/location";
import { DocumentSaveService } from "./document.save.service";

export class TransactionSaveService {
  spectreUser: SpectreUser;
  location: Location;
  exporter: Exporter;

  constructor(
    spectreUser: SpectreUser,
    location: Location,
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
            converted.push(asString + ',' + category.getType() + '\n');
        }
    }

    const documentSaveService = new DocumentSaveService(this.location);
    await documentSaveService.save(converted);
  }
}