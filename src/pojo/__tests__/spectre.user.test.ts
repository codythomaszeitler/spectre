import { SpectreUser } from "../spectre.user";
import { Category } from "../category";
import { Timestamp } from "../timestamp";
import { Currency } from "../currency";
import { TransactionDetail } from "../info.line";
import { Transaction } from "../transaction";

describe("Spectre User", () => {
  it("should allow a user to categorize a transaction", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    const timestamp = new Timestamp("January", 1, 2019);
    const currency = new Currency(400, "USD");
    const transaction = new Transaction(currency, timestamp, details);

    testObject.readyForCategorization(transaction);
    expect(testObject.getUncategorized().length).toBe(1);

    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(0);

    const outputCurrency = testObject.rollup(new Category("Home"));
    expect(outputCurrency).toEqual(new Currency(400, "USD"));
  });

  it("should emit an event when a transaction is ready to be categorized", () => {
    let caughtEvent = null;
    const listener = {
      onTransactionReadyForCategorization: function (event) {
        caughtEvent = event;
      },
    };

    const testObject = new SpectreUser();
    testObject.addTransactionReadyForCategorizationListener(listener);

    const transaction = new Transaction(new Currency(400, 'USD'), new Timestamp(2010,1,1));
    testObject.readyForCategorization(transaction);

    expect(testObject.getUncategorized().length).toBe(1);
    testObject.getUncategorized().pop();
    expect(testObject.getUncategorized().length).toBe(1);

    expect(caughtEvent).not.toBeNull();
    expect(caughtEvent.transaction).toEqual(transaction);

    testObject.removeTransactionReadyForCategorizationListener(listener);
    caughtEvent = null;
    testObject.readyForCategorization(transaction);
    expect(caughtEvent).toBeNull();
  });
});
