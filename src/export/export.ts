export class Export {
  constructor(exporter) {
    this.exporter = exporter;
  }

  export(spectreUser) {
    let csvContents = this.exporter.getHeader() + "\n";

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
