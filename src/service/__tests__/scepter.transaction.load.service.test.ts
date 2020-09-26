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

    const scepterUser = new SpectreUser();

    const scepterTransaction = new Transaction([
      new TransactionDetail("Test String", "TestColumn", "String"),
    ]);

    const category = new Category("Test Category");
    scepterUser.addCategory(category);
    scepterUser.readyForCategorization(scepterTransaction);
    scepterUser.categorize(scepterTransaction, category);

    const exporter = new CsvExporter(columns);

    const location = new TestLocation([
      exporter.convert(scepterTransaction, category),
    ]);

    // I'm not really even sure what columns means here...
    // Which columns is this representing?
    // Columns is representing the imported data header.
    const importer = new ScepterFormatCsvImporter(columns);
    const testObject = new ScepterTransactionLoadService(importer);

    const newScepterUser = new SpectreUser();
    await testObject.load(newScepterUser, location);

    const categories = newScepterUser.getCategories();
    expect(categories.length).toBe(1);

    const newlyAddedCategory = categories[0];
    expect(newlyAddedCategory.getName()).toBe(category.getName());
  });
});
