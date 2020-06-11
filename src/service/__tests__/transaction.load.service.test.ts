import { TestLocation } from "./test.location";
import { Transaction, AMOUNT_TYPE } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { SpectreUser } from "../../pojo/spectre.user";
import { Columns } from "../../export/columns";
import { CsvExporter } from "../../export/csv.exporter";
import {CsvImporter} from '../../export/csv.importer';

describe("Transaction Load Service", () => {
  it("should be able to load transactions from a location", async () => {
    const columns = new Columns({
      0: {
        Amount: AMOUNT_TYPE,
      },
    });

    const transaction = new Transaction(new Currency(400, "USD"));
    const exporter = new CsvExporter(columns);
    const importer = new CsvImporter(columns);

    const items = [exporter.convert(transaction)];

    const location = new TestLocation(items);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(spectreUser, location, converter);

    await testObject.load();

    expect(spectreUser.getUncategorized().length).toBe(1);
  });
});
