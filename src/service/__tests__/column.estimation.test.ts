import { ColumnEstimation } from "../column.estimation";
import { TestLocation } from "./test.location";

describe("Column Estimation", () => {
  it("should be able to estimate columns given a location", async () => {
    const location = new TestLocation(["a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation(location);
    const columns = await testObject.estimate();

    expect(columns.getNumColumns()).toBe(3);
    expect(columns.getName(0)).toBe("column0");
    expect(columns.getType(0)).toBe("string");
    expect(columns.getName(1)).toBe("column1");
    expect(columns.getType(1)).toBe("string");
    expect(columns.getName(2)).toBe("column2");
    expect(columns.getType(2)).toBe("string");
  });

  it('should return only one column if the peeked line does not have the delimiter', async () => {
    const location = new TestLocation(["a", "1"]);
    const testObject = new ColumnEstimation(location);
    const columns = await testObject.estimate();

    expect(columns.getNumColumns()).toBe(1);
    expect(columns.getName(0)).toBe("column0");
    expect(columns.getType(0)).toBe("string");
  });

  it('should throw an exception if a null location is given during construction', async () => {

    let caughtException = null;
    try {
        new ColumnEstimation(null);
    } catch (e) {
        caughtException = e;
    }

    expect(caughtException.message).toBe('Cannot create estimation without a location');
  });

  it("should throw an exception if the first line is null during peek", async () => {
    const location = new TestLocation([null, "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation(location);

    let caughtException = null;
    try {
      await testObject.estimate();
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });

  it("should throw an exception if the first line is undefined during peek", async () => {
    const location = new TestLocation([undefined, "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation(location);

    let caughtException = null;
    try {
      await testObject.estimate();
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });

  it("should throw an exception if the first line is empty during peek", async () => {
    const location = new TestLocation(["", "a,b,c", "1,1,3"]);
    const testObject = new ColumnEstimation(location);

    let caughtException = null;
    try {
      await testObject.estimate();
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
      "Location returned an empty line during a peek, cannot parse column from an empty string"
    );
  });
});
