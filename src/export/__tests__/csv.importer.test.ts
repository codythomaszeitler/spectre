import { Columns } from "../columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { CsvExporter } from "../csv.exporter";
import { Currency } from "../../pojo/currency";
import { CsvImporter, unescapeCsvElement } from "../csv.importer";
import { TransactionDetail } from "../../pojo/transaction.detail";

describe("Csv Importer", () => {
  it("should be able to import items into that were exported", () => {
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
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
    ];
    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new CsvImporter();
    testObject.defineIncomingFormat(columns);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(transaction)).toBe(true);
  });

  it("should be able to convert a transaction with extra elements", () => {
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

    const rawString = "$400.00,Test1,Test2,Test3\n";
    const testObject = new CsvImporter();

    const converted = testObject.convert(rawString);

    const details = converted.getDetails();
    expect(details.length).toBe(4);
  });

  it("should be able to unescape csv element without quotations marks", () => {
    const unescaped = unescapeCsvElement("Cody");
    expect(unescaped).toBe("Cody");
  });

  it("should be able to handle when there is no string given", () => {
    const unescaped = unescapeCsvElement("");
    expect(unescaped).toBe("");
  });

  it("should be able to handle when there is a null string given", () => {
    const unescaped = unescapeCsvElement();
    expect(unescaped).toBe("");
  });
});
