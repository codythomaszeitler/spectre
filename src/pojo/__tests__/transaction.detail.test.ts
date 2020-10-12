import { TransactionDetail } from "../transaction.detail";
import { DATE_TYPE } from "../../transaction.detail.converter/date.converter";

describe("Transaction Detail", () => {
  it("should be able to transition from string into date", () => {
    const testObject = new TransactionDetail(
      "01/10/2010",
      "Test Column Name",
      DATE_TYPE
    );
    const date = testObject.asGivenType();
    expect(date.getFullYear()).toBe(2010);
    expect(testObject.getElement()).toBe("01/10/2010 00:00:00");
  });

  it("should be able to transition from ISO into scepter date format", () => {
    const testObject = new TransactionDetail(
      "2020-07-31T18:31:41",
      "Test Column Name",
      DATE_TYPE
    );
    expect(testObject.getElement()).toBe("07/31/2020 18:31:41");
  });

  it("should throw an exception if the conversion into the underlying object does not work on construction", () => {
    let caughtException = null;
    try {
      new TransactionDetail(
        "This is a garbage date",
        "Test Column Name",
        DATE_TYPE
      );
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Could not convert [This is a garbage date] into a date"
    );
  });
});
