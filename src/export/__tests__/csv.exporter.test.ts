import { CsvExporter } from "../csv.exporter";
import { Columns } from "../columns";
import { Transaction } from "../../pojo/transaction";
import { TransactionDetail } from "../../pojo/info.line";
import { Category } from "../../pojo/category";

describe("Csv Exporter", () => {
  it("should be able to export a transaction that doesnt fit the columns given", () => {
    const columns = new Columns({
      0: {
        name: "default",
        type: "string",
      },
    });

    const testObject = new CsvExporter(columns);

    const transaction = new Transaction([
      new TransactionDetail("TEST0", columns.getName(0), columns.getType(0)),
      new TransactionDetail("TEST1", "noConfig1", "string"),
      new TransactionDetail("TEST2", "noConfig2", "string"),
    ]);

    const converted = testObject.convert(transaction);
    expect(converted).toBe('"TEST0","TEST1","TEST2"');
  });

  it("should should append category to the end if no category specified in columns", () => {
    const columns = new Columns({
      0: {
        name: "default",
        type: "string",
      },
    });

    const testObject = new CsvExporter(columns);

    const transaction = new Transaction([
      new TransactionDetail("TEST0", columns.getName(0), columns.getType(0)),
      new TransactionDetail("TEST1", "noConfig1", "string"),
      new TransactionDetail("TEST2", "noConfig2", "string"),
    ]);

    const converted = testObject.convert(transaction, new Category('Home'));
    expect(converted).toBe('"TEST0","TEST1","TEST2","Home"');
  });
});
