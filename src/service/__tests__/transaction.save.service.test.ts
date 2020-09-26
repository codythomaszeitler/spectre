import { SpectreUser } from "../../pojo/spectre.user";
import { TestLocation } from "./test.location";
import { CsvExporter, escapeCsvElement } from "../../export/csv.exporter";
import { Columns } from "../../export/columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { DocumentLoadService } from "../document.load.service";
import { Category, CATEGORY_TYPE } from "../../pojo/category";
import { Currency } from "../../pojo/currency";
import { TransactionSaveService } from "../transaction.save.service";
import { TransactionDetail } from "../../pojo/transaction.detail";

describe("Transaction Save Service", () => {
  it("should write all categorized transactions to the given location", async () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Category",
        type: CATEGORY_TYPE,
      },
    });

    const spectreUser = new SpectreUser();
    const category = new Category("Test");
    spectreUser.addCategory(category);

    for (let i = 0; i < 10; i++) {
      const details = [
        TransactionDetail.withCurrency(new Currency(400), columns.getName(0)),
      ];
      const transaction = new Transaction(details);
      spectreUser.readyForCategorization(transaction);
      spectreUser.categorize(transaction, category);
    }

    const location = new TestLocation([]);
    const exporter = new CsvExporter(columns);

    const testObject = new TransactionSaveService(
      spectreUser,
      location,
      exporter
    );

    await testObject.save();

    const loadDocument = new DocumentLoadService(location);
    const lines = await loadDocument.fetchall();
    expect(lines.length).toBe(10);
  });

  it("should write all categorized transactions to the given location using the generated columns", async () => {
    const spectreUser = new SpectreUser();
    const category = new Category("Test");

    const firstTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
    ]);

    const secondTransation = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "noConfig4", "string"),
    ]);

    const thirdTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "noConfig4", "string"),
    ]);

    spectreUser.addCategory(category);
    spectreUser.readyForCategorization(firstTransaction);
    spectreUser.readyForCategorization(secondTransation);
    spectreUser.readyForCategorization(thirdTransaction);

    spectreUser.categorize(firstTransaction, category);
    spectreUser.categorize(secondTransation, category);
    spectreUser.categorize(thirdTransaction, category);

    const location = new TestLocation([]);
    const exporter = new CsvExporter(
      TransactionSaveService.generateCompliantColumns(spectreUser)
    );

    const testObject = new TransactionSaveService(
      spectreUser,
      location,
      exporter
    );

    await testObject.save();

    const loadDocument = new DocumentLoadService(location);
    const lines = await loadDocument.fetchall();
    expect(lines.length).toBe(3);

    expect(lines[0]).toBe(
      '"test1","test2",,,' + escapeCsvElement(category.getName()) + '\n'
    );
    expect(lines[1]).toBe(
      '"test1","test2","test3","test4",' + escapeCsvElement(category.getName()) + '\n'
    );
    expect(lines[2]).toBe(
      '"test1","test2","test3","test4",' + escapeCsvElement(category.getName()) + '\n'
    );
  });

  it("should write all categorized transactions to the given location using the generated columns", async () => {
    const spectreUser = new SpectreUser();
    const category = new Category("Test");

    const firstTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
    ]);

    const secondTransation = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "different", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "noConfig4", "string"),
    ]);

    const thirdTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "onceagain", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "nothere", "string"),
    ]);

    spectreUser.addCategory(category);
    spectreUser.readyForCategorization(firstTransaction);
    spectreUser.readyForCategorization(secondTransation);
    spectreUser.readyForCategorization(thirdTransaction);

    spectreUser.categorize(firstTransaction, category);
    spectreUser.categorize(secondTransation, category);
    spectreUser.categorize(thirdTransaction, category);

    const location = new TestLocation([]);
    const exporter = new CsvExporter(
      TransactionSaveService.generateCompliantColumns(spectreUser)
    );

    const testObject = new TransactionSaveService(
      spectreUser,
      location,
      exporter
    );

    await testObject.save();

    const loadDocument = new DocumentLoadService(location);
    const lines = await loadDocument.fetchall();
    expect(lines.length).toBe(3);

    expect(lines[0]).toBe(
      '"test1","test2",,,' + escapeCsvElement(category.getName()) + '\n'
    );
    expect(lines[1]).toBe(
      '"test1","test2","test3","test4",' + escapeCsvElement(category.getName()) + '\n'
    );
    expect(lines[2]).toBe(
      '"test1","test2","test3","test4",' + escapeCsvElement(category.getName()) + '\n'
    );
  });

  it("should ensure that the category is in the same column for all transaction even if num elements differ", () => {
    const spectreUser = new SpectreUser();
    const category = new Category("Test");

    const firstTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
    ]);

    const secondTransation = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "noConfig4", "string"),
    ]);

    spectreUser.addCategory(category);
    spectreUser.readyForCategorization(firstTransaction);
    spectreUser.readyForCategorization(secondTransation);

    spectreUser.categorize(firstTransaction, category);
    spectreUser.categorize(secondTransation, category);

    const columns = TransactionSaveService.generateCompliantColumns(
      spectreUser
    );
    expect(columns.getName(4)).toBe(CATEGORY_TYPE);
    expect(columns.getName(0)).toBe("noConfig1");
    expect(columns.getName(1)).toBe("noConfig2");
    expect(columns.getName(2)).toBe("noConfig3");
    expect(columns.getName(3)).toBe("noConfig4");
  });

  it("should combine the column names if column names are different", () => {
    const spectreUser = new SpectreUser();
    const category = new Category("Test");

    const firstTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "noConfig2", "string"),
    ]);

    const secondTransation = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "different", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "noConfig4", "string"),
    ]);

    const thirdTransaction = new Transaction([
      new TransactionDetail("test1", "noConfig1", "string"),
      new TransactionDetail("test2", "onceagain", "string"),
      new TransactionDetail("test3", "noConfig3", "string"),
      new TransactionDetail("test4", "nothere", "string"),
    ]);

    spectreUser.addCategory(category);
    spectreUser.readyForCategorization(firstTransaction);
    spectreUser.readyForCategorization(secondTransation);
    spectreUser.readyForCategorization(thirdTransaction);

    spectreUser.categorize(firstTransaction, category);
    spectreUser.categorize(secondTransation, category);
    spectreUser.categorize(thirdTransaction, category);

    const columns = TransactionSaveService.generateCompliantColumns(
      spectreUser
    );
    expect(columns.getName(4)).toBe(CATEGORY_TYPE);
    expect(columns.getName(0)).toBe("noConfig1");
    expect(columns.getName(1)).toBe("noConfig2|different|onceagain");
    expect(columns.getName(2)).toBe("noConfig3");
    expect(columns.getName(3)).toBe("noConfig4|nothere");
  });
});
