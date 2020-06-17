import { Columns } from "../columns";

describe("Csv Exporter", () => {
  let testObject;
  beforeEach(() => {
    testObject = new Columns({
      0: {
        name : 'Bank',  
        type : "BankType",
      },
      1: {
        name : 'Business',
        type : 'BusinessType',
      },
      2: {
        name : 'Amount',
        type : 'AmountType',
      },
      3: {
        name : 'When',
        type : 'WhenType',
      },
    });
  });

  it("should be able to get the number of columns", () => {
    expect(testObject.getNumColumns()).toBe(4);
  });

  it("should be able to get the column name given an index", () => {
    expect(testObject.getName(0)).toBe("Bank");
    expect(testObject.getName(1)).toBe("Business");
    expect(testObject.getName(2)).toBe("Amount");
    expect(testObject.getName(3)).toBe("When");
  });

  it("should be able to get the column type given an index", () => {
    expect(testObject.getType(0)).toBe("BankType");
    expect(testObject.getType(1)).toBe("BusinessType");
    expect(testObject.getType(2)).toBe("AmountType");
    expect(testObject.getType(3)).toBe("WhenType");
  });


  it("should throw an exception if the index is out of bounds on getName", () => {
    let caughtException = null;
    try {
      testObject.getName(4);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "[4] was greater than the max index of columns in config, which is [3]"
    );
  });

  it("should throw an exception if the index is out of bounds on getType", () => {
    let caughtException = null;
    try {
      testObject.getType(4);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "[4] was greater than the max index of columns in config, which is [3]"
    );
  });
});
