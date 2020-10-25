import { Columns } from "../columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { STRING_TYPE, TransactionDetail } from "../../pojo/transaction.detail";
import { BankConfig } from "../../mappings/bank.config";
import { CsvExporter } from "../csv.exporter";
import { ByColumnNameCsvImporter } from "../by.column.name.csv.converter";

describe("By Column Name Csv Converter", () => {
  it("should be able to convert into a specific csv format", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: STRING_TYPE,
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
      new TransactionDetail("First Detail", "Amount", STRING_TYPE),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
    ];

    const byColumnIndexMapping = new BankConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new ByColumnNameCsvImporter(byColumnIndexMapping);
    testObject.defineIncomingFormat(columns);

    const expected = new Transaction([
      new TransactionDetail("This is another detail", "Test", "Test2Type"),
    ]);

    const asString = exporter.convert(transaction);
    const converted = testObject.convert(asString);
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

    const byColumnIndexMapping = new BankConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
        {
          csvHeaderName: "Test1Type",
          nodeFormatName: "OtherTest",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new ByColumnNameCsvImporter(byColumnIndexMapping);
    testObject.defineIncomingFormat(columns);

    const expected = new Transaction([
      new TransactionDetail("This is another detail", "Test", "Test2Type"),
      new TransactionDetail("This is a detail", "OtherTest", "Test1Type"),
    ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });

  it("should throw an exception if there is no matching column in the imported data", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
    ];

    const byColumnIndexMapping = new BankConfig({
      mappings: [
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new ByColumnNameCsvImporter(byColumnIndexMapping);

    let caughtException = null;
    try {
      testObject.convert(exporter.convert(transaction));
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Imported CSV did not have the following column: Test2Type"
    );
  });

  it("should be able to handle the transaction not having an element, while the columns do have it", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
    });

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
    ];

    const byColumnIndexMapping = new BankConfig({
      mappings: [
        {
          csvHeaderName: "Test1Type",
          nodeFormatName: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new ByColumnNameCsvImporter(byColumnIndexMapping);
    testObject.defineIncomingFormat(columns);

    const expected = new Transaction([
      new TransactionDetail("", "Test", "Test1Type"),
    ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });

  it("should be able to concatenate two columns into one", () => {
    const columns = new Columns({
      0: {
        name: "Test0Type",
        type: STRING_TYPE,
      },
      1: {
        name: "Test1Type",
        type: STRING_TYPE,
      },
      2: {
        name: "Test2Type",
        type: STRING_TYPE,
      },
      3 : {
        name : "Test3Type",
        type : STRING_TYPE
      }
    });

    const byColumnIndexMapping = new BankConfig({
      mappings: [
        {
          csvHeaderName: "Test1Type",
          nodeFormatName: "Test",
          type: STRING_TYPE,
        },
        {
          csvHeaderName: "Test2Type",
          nodeFormatName: "Test",
          type: STRING_TYPE,
        },
      ],
    });

    const testObject = new ByColumnNameCsvImporter(byColumnIndexMapping);
    testObject.defineIncomingFormat(columns);

    const transaction = testObject.convert("Z,A,B,C");
    const details = transaction.getDetailsByColumnName("Test");
    assertOneDetailContainsElement(details, "A");
    assertOneDetailContainsElement(details, "B");
  });

  function assertOneDetailContainsElement(
    details: Array<TransactionDetail>,
    element: string
  ) {
    let oneDetailContainsElement = false;

    for (let i = 0; i < details.length; i++) {
      if (details[i].getElement() === element) {
        oneDetailContainsElement = true;
        break;
      }
    }

    expect(oneDetailContainsElement).toBeTruthy();
  }
});
