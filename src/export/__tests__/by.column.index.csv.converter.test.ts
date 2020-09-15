import { Columns } from "../columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { Currency } from "../../pojo/currency";
import { TransactionDetail } from "../../pojo/info.line";
import { CsvColumnIndexConfig } from "../csv.column.index.mapping";
import { ByColumnIndexCsvImporter } from "../by.column.index.csv.converter";
import { CsvExporter } from "../csv.exporter";

describe("By Column Index Csv Converter", () => {
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

    /*
     Okay.
     Basically we are going to map from the incoming CSV with an index,
     into the node format.

     So the CSV that is going to be imported is going to look as follows:
    */

    const details = [
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
    ];

    const byColumnIndexMapping = new CsvColumnIndexConfig({
      mappings: [
        {
          csvIndex: 2,
          nodeFormat: "Test",
        },
      ],
    });

    const transaction = new Transaction(details);

    const exporter = new CsvExporter(columns);
    const testObject = new ByColumnIndexCsvImporter(
      columns,
      byColumnIndexMapping
    );

    const expected = new Transaction([
      new TransactionDetail("This is a detail", "Test", "Test1Type"),
    ]);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(expected)).toBe(true);
  });
});
