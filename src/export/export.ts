import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "./exporter";

export class Export {

  exporter : Exporter;

  constructor(exporter : Exporter) {
    this.exporter = exporter;
  }

  export(spectreUser : SpectreUser) {
    let csvContents = '';

    const categories = spectreUser.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const transactions = categories[i].getTransactions();

      for (let j = 0; j < transactions.length; j++) {
        const transaction = transactions[j];
        csvContents += this.exporter.convert(transaction, categories[i]) + "\n";
      }
    }
    return csvContents;
  }
}
