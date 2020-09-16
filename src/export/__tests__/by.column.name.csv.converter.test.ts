import { Columns } from "../columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { TransactionDetail } from "../../pojo/info.line";
import { CsvColumnNameConfig } from "../csv.column.name.config";
import { CsvExporter } from "../csv.exporter";
import { ByColumnNameCsvImporter } from "../by.column.name.csv.converter";

describe("By Column Name Csv Converter", () => {
  it("should be able to convert into a specific csv format", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
      2: {
        name: "Test2Type",
        type: "Test2Type",
      },
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
    ];

    const byColumnIndexMapping = new CsvColumnNameConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter(columns);
    const testObject = new ByColumnNameCsvImporter(
      columns,
      byColumnIndexMapping
    );

    const expected = new Transaction([
      new TransactionDetail("This is another detail", "Test", "Test2Type"),
    ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });

  it("should be able to convert into a specific csv format using two mappings", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
      2: {
        name: "Test2Type",
        type: "Test2Type",
      },
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
    ];

    const byColumnIndexMapping = new CsvColumnNameConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
        {
          csvHeaderName: "Test1Type",
          nodeFormatName: "OtherTest",
        }
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter(columns);
    const testObject = new ByColumnNameCsvImporter(
      columns,
      byColumnIndexMapping
    );

    const expected = new Transaction([
      new TransactionDetail("This is another detail", "Test", "Test2Type"),
      new TransactionDetail("This is a detail", "OtherTest", "Test1Type"),
    ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });

  it('should throw an exception if there is no matching column in the imported data', () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      }
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
    ];

    const byColumnIndexMapping = new CsvColumnNameConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter(columns);
    const testObject = new ByColumnNameCsvImporter(
      columns,
      byColumnIndexMapping
    );

    let caughtException = null;
    try {
        testObject.convert(exporter.convert(transaction));
    } catch (e) {
        caughtException = e;
    }
    
    expect(caughtException.message).toBe('Imported CSV did not the following column: Test2Type');
  });

  it('should be able to handle the transaction not having an element, while the columns do have it', () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      }
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
    ];

    const byColumnIndexMapping = new CsvColumnNameConfig({
      mappings: [
        {
          csvHeaderName: "Test1Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter(columns);
    const testObject = new ByColumnNameCsvImporter(
      columns,
      byColumnIndexMapping
    );

    const expected = new Transaction([
        new TransactionDetail("", "Test", "Test1Type"),
      ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });
});
