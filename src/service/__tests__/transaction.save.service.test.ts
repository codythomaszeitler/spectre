import { SpectreUser } from "../../pojo/spectre.user";
import { TestLocation } from "./test.location";
import { CsvExporter } from "../../export/csv.exporter";
import { Columns } from "../../export/columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { DocumentLoadService } from "../document.load.service";
import { Category } from "../../pojo/category";
import { Currency } from "../../pojo/currency";
import { TransactionSaveService } from "../transaction.save.service";
import { Location } from "../location";
import { TransactionDetail } from "../../pojo/info.line";

describe("Transaction Save Service", () => {
  it("should write all categorized transactions to the given location", async () => {
    const columns = new Columns({
      0: {
        Amount: AMOUNT_TYPE,
      },
    });

    const spectreUser = new SpectreUser();
    const category = new Category("Test");
    spectreUser.addCategory(category);

    for (let i = 0; i < 10; i++) {
      const details = [TransactionDetail.withCurrency(new Currency(400))];
      const transaction = new Transaction(details);
      spectreUser.readyForCategorization(transaction);
      spectreUser.categorize(transaction, category);
    }

    const location = new TestLocation([]);
    const exporter = new CsvExporter(columns);

    const testObject = new TransactionSaveService(
      spectreUser,
      location,
      exporter
    );

    await testObject.save();

    const loadDocument = new DocumentLoadService(location);
    const lines = await loadDocument.fetchall();
    expect(lines.length).toBe(10);
  });

});
