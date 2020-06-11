import { Columns } from "../columns";
import {
  AMOUNT_TYPE,
  Transaction,
  TIMESTAMP_TYPE,
} from "../../pojo/transaction";
import { CsvExporter } from "../csv.exporter";
import { Currency } from "../../pojo/currency";
import { Timestamp } from "../../pojo/timestamp";
import { CsvImporter } from "../csv.importer";
import { TransactionDetail } from "../../pojo/info.line";

describe("Csv Importer", () => {
  it("should be able to import items into that were exported", () => {
    const columns = new Columns({
      0: {
        Amount: AMOUNT_TYPE,
      },
      1: {
        Timestamp: TIMESTAMP_TYPE,
      },
      2: {
        Test1Type: "Test1Type",
      },
      3: {
        Test2Type: "Test2Type",
      },
    });

    const details = [
      new TransactionDetail("This is a detail", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type"),
    ];
    const transaction = new Transaction(
      new Currency(400, "USD"),
      new Timestamp(2010, 1, 1),
      details
    );

    const exporter = new CsvExporter(columns);
    const testObject = new CsvImporter(columns);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(transaction)).toBe(true);
  });
});
