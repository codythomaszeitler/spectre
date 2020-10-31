import { CsvExporter } from "../../export/csv.exporter";
import { Category } from "../../pojo/category";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { SpectreUser } from "../../pojo/spectre.user";
import { Transaction } from "../../pojo/transaction";
import { TestLocation } from "./test.location";
import {
  COLOR_NOT_FOUND,
  ScepterFormatCsvImporter,
} from "../scepter.format.csv.importer";
import { ScepterTransactionLoadService } from "../scepter.transaction.load.service";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../scepter.format.importer";
import { Color } from "../../pojo/color";
import {
  SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
  SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
} from "../../export/with.view.context.exporter";
import { getScepterCompliantColumns } from "./scepter.format.csv.importer.test";
import { generateTransactionFor } from "../../export/__tests__/csv.importer.test";

describe("Scepter Transaction Load Service", () => {
  const columns = getScepterCompliantColumns();

  it("should add categories to scepter user when loading in a scepter csv file", async () => {
    const scepterTransaction = new Transaction([
      new TransactionDetail(
        "Test String",
        columns.getName(0),
        columns.getType(0)
      ),
    ]);
    const category = new Category("Test Category");

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);
    const location = new TestLocation([
      exporter.convertColumns(columns),
      exporter.convert(scepterTransaction, category),
      "Uncategorized Transaction",
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

  it("should return a view context that respects the ordering and colors found within the location", async () => {
    const columns = getScepterCompliantColumns();

    const scepterTransaction = generateTransactionFor(columns, [
      {
        name: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
        value: "#111111",
      },
      {
        name: SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
        value: "1",
      },
    ]);
    const anotherTransaction = generateTransactionFor(columns, [
      {
        name: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
        value: "#111111",
      },
      {
        name: SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
        value: "1",
      },
    ]);

    const category = new Category("Test Category");

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);
    const location = new TestLocation([
      exporter.convertColumns(columns),
      exporter.convert(scepterTransaction, category),
      exporter.convert(anotherTransaction, category),
    ]);

    const importer = new ScepterFormatCsvImporter();

    const testObject = new ScepterTransactionLoadService(importer);

    const newScepterUser = new SpectreUser();
    const viewContext = await testObject.load(newScepterUser, location);

    const color = viewContext.getColorFor(category);
    expect(color).toEqual(new Color("#111111"));

    const ordering = viewContext.getOrderFor(category);
    expect(ordering).toBe(1);
  });

  it("should return a default color if there are two conflicting colors in the spreadsheet", async () => {
    const scepterTransaction = generateTransactionFor(columns, [
      {
        name: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
        value: "#111111",
      },
    ]);
    const anotherTransaction = generateTransactionFor(columns, [
      {
        name: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
        value: "#111112",
      },
    ]);

    const category = new Category("Test Category");

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);
    const location = new TestLocation([
      exporter.convertColumns(columns),
      exporter.convert(scepterTransaction, category),
      exporter.convert(anotherTransaction, category),
    ]);

    const importer = new ScepterFormatCsvImporter();

    const testObject = new ScepterTransactionLoadService(importer);

    const newScepterUser = new SpectreUser();
    const viewContext = await testObject.load(newScepterUser, location);

    const color = viewContext.getColorFor(category);
    expect(color).toEqual(COLOR_NOT_FOUND);

    const ordering = viewContext.getOrderFor(category);
    expect(ordering).toBe(1);
  });

  it("should return false and an error message if there are not the necessary headers available", async () => {
    const importer = new ScepterFormatCsvImporter();
    const testObject = new ScepterTransactionLoadService(importer);

    const location = new TestLocation([
      SCEPTER_CATEGORY_COLUMN_NAME + "," + SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
      "TestCategory,#000000",
    ]);

    const result = await testObject.canLoad(location);
    expect(result.canLoad).toBe(false);
    expect(result.errorMessage).toBe(
      "Location did not have headers: [Account,Date,Vendor,Amount,Notes,Ordering]"
    );
  });

  it("should return true and an empty message if there are the necessary headers available", async () => {
    const importer = new ScepterFormatCsvImporter();
    const testObject = new ScepterTransactionLoadService(importer);

    const exporter = new CsvExporter();

    const location = new TestLocation([
      exporter.convertColumns(getScepterCompliantColumns()),
      "TestCategory,#000000",
    ]);

    const result = await testObject.canLoad(location);
    expect(result.canLoad).toBe(true);
    expect(result.errorMessage).toBe("");
  });
});
