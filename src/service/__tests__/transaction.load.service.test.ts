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
      importer,
      columns
    );

    const loaded = await testObject.load();
    expect(loaded.length).toBe(1);
    expect(spectreUser.getUncategorized().length).toBe(1);
  });

  it('should be able to load a transaction when the line is has more elements than columns defines', async () => {
    const columns = new Columns({
      0: {
        name : 'default',
        type : 'string'
      },
    }); 

    const importer = new CsvImporter(columns);

    const lines = ['TEST,EXTRA ELEMENT'];
    const location = new TestLocation(lines);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(
      spectreUser, 
      location,
      importer,
      columns
    );

    const loaded  = await testObject.load();
    expect(loaded.length).toBe(1);

    const transaction : Transaction = loaded[0];
    expect(transaction.getDetailByName('default')).toBe('TEST');
    expect(transaction.getDetails().length).toBe(2);
  });
});
