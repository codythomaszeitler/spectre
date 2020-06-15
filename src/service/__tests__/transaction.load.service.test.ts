import { TestLocation } from "./test.location";
import { Transaction, AMOUNT_TYPE } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { SpectreUser } from "../../pojo/spectre.user";
import { Columns } from "../../export/columns";
import { CsvExporter } from "../../export/csv.exporter";
import { CsvImporter } from "../../export/csv.importer";
import {TransactionLoadService} from '../transaction.load.service';
import { TransactionDetail } from "../../pojo/info.line";

describe("Transaction Load Service", () => {
  it("should be able to load transactions from a location", async () => {
    const columns = new Columns({
      0: {
        Amount: AMOUNT_TYPE,
      },
    });

    const details = [TransactionDetail.withCurrency(new Currency(400))];
    const transaction = new Transaction(details);
    const exporter = new CsvExporter(columns);
    const importer = new CsvImporter(columns);

    const items = [exporter.convert(transaction)];

    const location = new TestLocation(items);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(
      spectreUser,
      location,
      importer
    );

    const loaded = await testObject.load();
    expect(loaded.length).toBe(1);
    expect(spectreUser.getUncategorized().length).toBe(1);
  });
});
