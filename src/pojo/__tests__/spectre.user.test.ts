import { SpectreUser, TransactionCategorizedListener, OnTransactionCategorizedEvent } from "../spectre.user";
import { Category } from "../category";
import { Currency } from "../currency";
import { TransactionDetail } from "../info.line";
import { Transaction } from "../transaction";
import { OnCategoryAddedEvent, CategoryAddedListener } from '../spectre.user';

describe("Spectre User", () => {
  it("should allow a user to categorize a transaction", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    const currency = new Currency(400, "USD");
    const transaction = new Transaction(currency, details);

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

    const transaction = new Transaction(new Currency(400, 'USD'));
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

  it('should emit an event when a new category is added', () => {
    let caughtEvent = null;
    const listener : CategoryAddedListener = {
      onCategoryAdded : function (event : OnCategoryAddedEvent) {
        caughtEvent = event;
      },
    };

    const testObject : SpectreUser = new SpectreUser();
    testObject.addOnCategoryAddedListener(listener);
    const category : Category = new Category('Home');
    testObject.addCategory(category.copy());

    expect(category.copy().equals(caughtEvent.category)).toBe(true);

    caughtEvent = null;
    testObject.removeOnCategoryAddedListener(listener);

    testObject.addCategory(new Category('New'));
    expect(caughtEvent).toBeNull();
  });


  it('should emit an event for a specific category when a transaction is associated to it', () => {

    let caughtEvent = undefined;
    const listener : TransactionCategorizedListener = {
      onTransactionCategorized: (event : OnTransactionCategorizedEvent) => {
        caughtEvent = event;
      }
    };

    const testObject : SpectreUser = new SpectreUser();
    const category : Category = new Category('Home');

    testObject.addCategory(category);

    testObject.addTransactionCategorizedListener(category, listener);
    const transaction = new Transaction(new Currency(400, 'USD'));
    testObject.categorize(transaction, category);

    expect(caughtEvent.transaction).toEqual(transaction);

    caughtEvent = null;
    testObject.removeTransactionCategorizedListener(new Category('TEST'), listener);
    testObject.categorize(transaction, category);
    expect(caughtEvent.transaction).toEqual(transaction);

    testObject.removeTransactionCategorizedListener(category, listener);
    caughtEvent = null;
    testObject.categorize(new Transaction(new Currency(800, 'USD')), category);
    expect(caughtEvent).toBeNull();
  });

  it('should only remove transaction that was categorized', () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const currency = new Currency(400, "USD");
    const transaction = new Transaction(currency);

    for (let i = 0; i < 10; i++) {
      testObject.readyForCategorization(new Transaction(new Currency(400, 'USD')));
    }

    testObject.readyForCategorization(transaction);
    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(10);
  });


  it('should throw an exception if a user tries to categorize a transaction that was not ready', () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const currency = new Currency(400, "USD");
    const transaction = new Transaction(currency);

    let caughtException = null;
    try {
      testObject.categorize(transaction, new Category("Home"));
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe('Must ready transaction for categorization');
  });
});
