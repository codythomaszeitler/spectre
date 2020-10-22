import { TestLocation } from "./test.location";
import { Transaction, AMOUNT_TYPE } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { SpectreUser } from "../../pojo/spectre.user";
import { Columns } from "../../export/columns";
import { CsvExporter } from "../../export/csv.exporter";
import { CsvImporter } from "../../export/csv.importer";
import { TransactionLoadService } from "../transaction.load.service";
import { STRING_TYPE, TransactionDetail } from "../../pojo/transaction.detail";
import { ByColumnNameCsvImporter } from "../../export/by.column.name.csv.converter";
import { BankConfig } from "../../mappings/bank.config";

describe("Transaction Load Service", () => {
  it("should be able to load transactions from a location", async () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
    ];
    const transaction = new Transaction(details);
    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);
    const importer = new CsvImporter();
    importer.defineIncomingFormat(columns);

    const items = [
      exporter.convertColumns(columns),
      exporter.convert(transaction),
    ];

    const location = new TestLocation(items);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(importer);

    await testObject.load(spectreUser, location);

    const loaded = spectreUser.getUncategorized();
    expect(loaded.length).toBe(1);
    expect(spectreUser.getUncategorized().length).toBe(1);
  });

  it("should be able to load a transaction when the line has more elements than columns defines", async () => {
    const columns = new Columns({
      0: {
        name: "default",
        type: "string",
      },
    });

    const importer = new CsvImporter();
    importer.defineIncomingFormat(columns);

    const lines = ["default", "TEST,EXTRA ELEMENT"];
    const location = new TestLocation(lines);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(importer);

    await testObject.load(spectreUser, location);

    const loaded = spectreUser.getUncategorized();
    expect(loaded.length).toBe(1);

    const transaction: Transaction = loaded[0];
    expect(transaction.getElementByColumnName("default")).toBe("TEST");
    expect(transaction.getElementByColumnName("noConfig1")).toBe(
      "EXTRA ELEMENT"
    );
    expect(transaction.getDetails().length).toBe(2);
  });

  it("should be able to load a transaction when there are gaps in the columns definition", async () => {
    const columns = new Columns({
      0: {
        name: "default0",
        type: "string",
      },
      2: {
        name: "default2",
        type: "string",
      },
    });

    const importer = new CsvImporter();
    importer.defineIncomingFormat(columns);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const lines = [exporter.convertColumns(columns), "TEST,ELEMENT1,ELEMENT2"];
    const location = new TestLocation(lines);
    const spectreUser = new SpectreUser();
    const testObject = new TransactionLoadService(importer);

    await testObject.load(spectreUser, location);

    const loaded = spectreUser.getUncategorized();
    expect(loaded.length).toBe(1);

    const transaction: Transaction = loaded[0];
    expect(transaction.getElementByColumnName("default0")).toBe("TEST");
    expect(transaction.getElementByColumnName("noConfig1")).toBe("ELEMENT1");
    expect(transaction.getElementByColumnName("default2")).toBe("ELEMENT2");
    expect(transaction.getDetails().length).toBe(3);
  });

  it('should return true and an empty error message if the location is able to be loaded', async () => {
    const bankConfig = new BankConfig({
      name : 'USBank-Saving',
      mappings : [
        {
          csvHeaderName : 'TestCsvName',
          nodeFormatNamde : 'TestNodeName',
          type : STRING_TYPE
        }
      ]
    });

    const importer = new ByColumnNameCsvImporter(bankConfig);
    const testObject = new TransactionLoadService(importer);

    const location = new TestLocation([
      'TestCsvName',
      'These are contents'
    ]);

    const result = await testObject.canLoad(location);
    expect(result.canLoad).toBe(true);
    expect(result.errorMessage).toBe('');
  });

  it('should return false and an error message if the necessary columns are not in the location', async () => {

    const bankConfig = new BankConfig({
      name : 'USBank-Saving',
      mappings : [
        {
          csvHeaderName : 'TestCsvName',
          nodeFormatNamde : 'TestNodeName',
          type : STRING_TYPE
        }
      ]
    });

    const importer = new ByColumnNameCsvImporter(bankConfig);
    const testObject = new TransactionLoadService(importer);

    const location = new TestLocation([
      'NotTestCsvName',
      'These are contents'
    ]);

    const result = await testObject.canLoad(location);
    expect(result.canLoad).toBe(false);
    expect(result.errorMessage).toBe('Location did not have headers: [TestCsvName]');
  });
});
