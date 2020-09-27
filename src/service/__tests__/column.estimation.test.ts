import { Transaction } from "../../pojo/transaction";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { ColumnEstimation } from "../column.estimation";
import { TestLocation } from "./test.location";

describe("Column Estimation", () => {
  it("should be able to estimate columns given a location", async () => {
    const location = new TestLocation(["a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation();
    const columns = await testObject.estimateByLocation(location);

    expect(columns.getNumColumns()).toBe(3);
    expect(columns.getName(0)).toBe("a");
    expect(columns.getType(0)).toBe("string");
    expect(columns.getName(1)).toBe("b");
    expect(columns.getType(1)).toBe("string");
    expect(columns.getName(2)).toBe("c");
    expect(columns.getType(2)).toBe("string");
  });

  it('should return only one column if the peeked line does not have the delimiter', async () => {
    const location = new TestLocation(["a", "1"]);
    const testObject = new ColumnEstimation();
    const columns = await testObject.estimateByLocation(location);

    expect(columns.getNumColumns()).toBe(1);
    expect(columns.getName(0)).toBe("a");
    expect(columns.getType(0)).toBe("string");
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

  it('should be able to estimate what the columns look like given a transaction', () => {
    const columnName = 'Test Column Name';

    const transaction = new Transaction([
      new TransactionDetail('Test Detail', columnName, 'String')
    ]);

    const testObject = new ColumnEstimation();
    const estimated = testObject.estimateByTransaction(transaction);

    expect(estimated.hasColumnWithName(columnName)).toBeTruthy();
  });
});
