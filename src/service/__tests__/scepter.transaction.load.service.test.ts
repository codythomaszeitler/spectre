import { CsvExporter } from "../../export/csv.exporter";
import { Category, CATEGORY_TYPE } from "../../pojo/category";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { SpectreUser } from "../../pojo/spectre.user";
import { Transaction } from "../../pojo/transaction";
import { TestLocation } from "./test.location";
import { Columns } from "../../export/columns";
import { ScepterFormatCsvImporter } from "../scepter.format.csv.importer";
import { ScepterTransactionLoadService } from "../scepter.transaction.load.service";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../scepter.format.importer";

describe("Scepter Transaction Load Service", () => {
  it("should add categories to scepter user when loading in a scepter csv file", async () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
    });

    const scepterTransaction = new Transaction([
      new TransactionDetail("Test String", columns.getName(0), columns.getType(0)),
    ]);
    const category = new Category("Test Category");

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);
    const location = new TestLocation([
      exporter.convertColumns(columns),
      exporter.convert(scepterTransaction, category),
      "Uncategorized Transaction"
    ]);

    const importer = new ScepterFormatCsvImporter();

    const testObject = new ScepterTransactionLoadService(importer);

    const newScepterUser = new SpectreUser();
    await testObject.load(newScepterUser, location);

    const categories = newScepterUser.getCategories();
    expect(categories.length).toBe(1);

    const newlyAddedCategory = categories[0];
    expect(newlyAddedCategory.getName()).toBe(category.getName());

    const uncategorized = newScepterUser.getUncategorized();
    expect(uncategorized.length).toBe(1);
  });
});
