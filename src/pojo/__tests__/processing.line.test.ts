import { Transaction } from "../transaction";
import { TransactionDetail } from "../info.line";
import { Currency } from "../currency";
import { ProcessingLine } from "../processing.line";

describe("Processing Line", () => {
  it("should be able to get the next transaction", () => {
    const details = [TransactionDetail.withCurrency(new Currency(400))];
    const transaction = new Transaction(details);

    const testObject = new ProcessingLine();

    testObject.enqueue(transaction);

    expect(testObject.dequeue().equals(transaction)).toBe(true);
  });

  it('should be able to get the first transaction even if multiple are in queue', () => {

    const testObject = new ProcessingLine();
    for (let i = 0; i < 10; i++) {
        const transaction = new Transaction([TransactionDetail.withCurrency(new Currency(i))]);
        testObject.enqueue(transaction);
    }

    const transaction = new Transaction([TransactionDetail.withCurrency(new Currency(0))]);
    expect(testObject.dequeue().equals(transaction)).toBe(true);
  });

  it('should return null if there are no more transactions in queue', () => {
    const testObject = new ProcessingLine();

    expect(testObject.dequeue()).toBeNull();
  });
});
