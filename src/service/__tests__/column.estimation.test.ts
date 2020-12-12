import { ExporterDecorator } from "../../export/exporter.decorator";
import { Category } from "../../pojo/category";
import { SpectreUser } from "../../pojo/spectre.user";
import { Transaction } from "../../pojo/transaction";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { ColumnEstimation } from "../column.estimation";
import { TestLocation } from "./test.location";
import {STRING_TYPE} from "../../pojo/transaction.detail";

describe("Column Estimation", () => {
  it("should be able to estimate columns given a location", async () => {
    const location = new TestLocation(["a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation();
    const columns = await testObject.estimateByLocation(location);

    expect(columns.getNumColumns()).toBe(3);
    expect(columns.getName(0)).toBe("a");
    expect(columns.getType(0)).toBe(STRING_TYPE);
    expect(columns.getName(1)).toBe("b");
    expect(columns.getType(1)).toBe(STRING_TYPE);
    expect(columns.getName(2)).toBe("c");
    expect(columns.getType(2)).toBe(STRING_TYPE);
  });

  it('should return only one column if the peeked line does not have the delimiter', async () => {
    const location = new TestLocation(["a", "1"]);
    const testObject = new ColumnEstimation();
    const columns = await testObject.estimateByLocation(location);

    expect(columns.getNumColumns()).toBe(1);
    expect(columns.getName(0)).toBe("a");
    expect(columns.getType(0)).toBe(STRING_TYPE);
  });

  it('should throw an exception if a null location is given during construction', async () => {

    const testObject = new ColumnEstimation();
    let caughtException = null;
    try {
      await testObject.estimateByLocation(null);
    } catch (e) {
        caughtException = e;
    }

    expect(caughtException.message).toBe('Cannot create estimation without a location');
  });

  it("should throw an exception if the first line is null during peek", async () => {
    const location = new TestLocation([null, "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation();

    let caughtException = null;
    try {
      await testObject.estimateByLocation(location);
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });

  it("should throw an exception if the first line is undefined during peek", async () => {
    const location = new TestLocation([undefined, "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation();

    let caughtException = null;
    try {
      await testObject.estimateByLocation(location);
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });

  it("should throw an exception if the first line is empty during peek", async () => {
    const location = new TestLocation(["", "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation();

    let caughtException = null;
    try {
      await testObject.estimateByLocation(location);
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
      "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });

  it('should be able to make a set of columns be able to keep up with all transactions', () => {
    const testObject = new ColumnEstimation();

    const columnName = 'Test Column Name';

    const transaction = new Transaction([
      new TransactionDetail('Test Detail', columnName, 'String')
    ]); 
    const anotherTransaction = new Transaction([
      new TransactionDetail('Test Detail', 'Another Column Name', 'String')
    ]); 

    const duplicateTransaction = new Transaction([
      new TransactionDetail('Test Detail', columnName, 'String')
    ]); 

    const scepterUser = new SpectreUser();

    const category = new Category('a');
    scepterUser.addCategory(category);

    scepterUser.readyForCategorization(transaction);
    scepterUser.readyForCategorization(anotherTransaction);
    scepterUser.readyForCategorization(duplicateTransaction);

    scepterUser.categorize(transaction, category);
    scepterUser.categorize(anotherTransaction, category);
    scepterUser.categorize(duplicateTransaction, category);

    const estimated = testObject.estimateBySpectreUser(scepterUser);

    expect(estimated.getNumColumns()).toBe(3);

    expect(estimated.getName(0)).toBe(columnName);
    expect(estimated.getName(1)).toBe('Another Column Name');

  });
});
