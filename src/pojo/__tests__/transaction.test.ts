import { Transaction } from "../transaction";
import { TransactionDetail } from "../transaction.detail";

describe("Transaction", () => {
  it("should return false when transactions do not have the same details", () => {
    const aDetails = [];
    aDetails.push(
      new TransactionDetail("Test", "TestColumnName", "TypeADetails")
    );
    const a = new Transaction(aDetails);

    const bDetails = [];
    bDetails.push(
      new TransactionDetail("Test", "TestColumnName", "TypeBDetails")
    );
    const b = new Transaction(bDetails);

    expect(a.equals(b)).toBe(false);
  });
});
