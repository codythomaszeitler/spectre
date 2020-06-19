import {
  SpectreUser,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
} from "../spectre.user";
import { Category } from "../category";
import { Currency } from "../currency";
import { TransactionDetail } from "../info.line";
import { Transaction, AMOUNT_TYPE } from "../transaction";
import { OnCategoryAddedEvent, CategoryAddedListener } from "../spectre.user";

describe("Spectre User", () => {
  it.skip("should allow a user to rollup a transaction", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    details.push(TransactionDetail.withCurrency(new Currency(400)));
    const transaction = new Transaction(details);

    testObject.readyForCategorization(transaction);
    expect(testObject.getUncategorized().length).toBe(1);

    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(0);

    const outputCurrency = testObject.rollup(new Category("Home"), AMOUNT_TYPE);
    expect(outputCurrency).toEqual(new Currency(400, "USD"));
  });

  it("should be able to undo a categorization", () => {
    let caughtEvent = null;
    let listener = {
      onTransactionUncategorized: function (event: OnTransactionUnassociated) {
        caughtEvent = event;
      },
    };

    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    let details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    details.push(TransactionDetail.withCurrency(new Currency(400)));
    let transaction = new Transaction(details);

    testObject.readyForCategorization(transaction);
    expect(testObject.getUncategorized().length).toBe(1);

    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(0);

    testObject.addTransactionUncategorizedListener(
      new Category("Home"),
      listener
    );
    testObject.uncategorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(1);
    expect(testObject.getTransactionsFor(new Category("Home")).length).toBe(0);

    expect(caughtEvent.transaction.equals(transaction)).toBe(true);
    expect(caughtEvent.category.equals(new Category("Home"))).toBe(true);

    caughtEvent = null;

    details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    details.push(TransactionDetail.withCurrency(new Currency(400)));

    transaction = new Transaction(details);
    testObject.readyForCategorization(transaction);
    testObject.categorize(transaction, new Category("Home"));

    testObject.removeTransactionUncategorizedListener(
      new Category("Home"),
      listener
    );
    testObject.uncategorize(transaction, new Category("Home"));
    expect(caughtEvent).toBeNull();
  });

  it("should put the most recent uncategorized transaction at the next transaction", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const details = [];
    details.push(new TransactionDetail("Chase cc0392", "Bank"));
    details.push(new TransactionDetail("JAPANESE STEAKHOUSE", "Business"));
    details.push(TransactionDetail.withCurrency(new Currency(400)));
    const transaction = new Transaction(details);

    testObject.readyForCategorization(transaction);
    expect(testObject.getUncategorized().length).toBe(1);

    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(0);

    const otherTransaction = new Transaction([
      TransactionDetail.withCurrency(new Currency(400)),
    ]);
    testObject.readyForCategorization(otherTransaction);

    testObject.uncategorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized()[0].equals(transaction)).toBe(true);
    expect(testObject.getUncategorized().length).toBe(2);
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

    const details = [TransactionDetail.withCurrency(new Currency(400))];
    const transaction = new Transaction(details);
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

  it("should emit an event when a new category is added", () => {
    let caughtEvent = null;
    const listener: CategoryAddedListener = {
      onCategoryAdded: function (event: OnCategoryAddedEvent) {
        caughtEvent = event;
      },
    };

    const testObject: SpectreUser = new SpectreUser();
    testObject.addOnCategoryAddedListener(listener);
    const category: Category = new Category("Home");
    testObject.addCategory(category.copy());

    expect(category.copy().equals(caughtEvent.category)).toBe(true);

    caughtEvent = null;
    testObject.removeOnCategoryAddedListener(listener);

    testObject.addCategory(new Category("New"));
    expect(caughtEvent).toBeNull();
  });

  it("should emit an event for a specific category when a transaction is associated to it", () => {
    let caughtEvent = undefined;
    const listener: TransactionCategorizedListener = {
      onTransactionCategorized: (event: OnTransactionCategorizedEvent) => {
        caughtEvent = event;
      },
    };

    const testObject: SpectreUser = new SpectreUser();
    const category: Category = new Category("Home");

    testObject.addCategory(category);

    testObject.addTransactionCategorizedListener(category, listener);
    const transaction = new Transaction([
      TransactionDetail.withCurrency(new Currency(400)),
    ]);
    testObject.readyForCategorization(transaction);
    testObject.categorize(transaction, category);

    expect(caughtEvent.transaction).toEqual(transaction);

    caughtEvent = null;
    testObject.removeTransactionCategorizedListener(
      new Category("TEST"),
      listener
    );
    testObject.categorize(transaction, category);
    expect(caughtEvent.transaction).toEqual(transaction);

    testObject.removeTransactionCategorizedListener(category, listener);
    caughtEvent = null;

    const newTransaction = new Transaction([
      TransactionDetail.withCurrency(new Currency(800)),
    ]);
    testObject.readyForCategorization(newTransaction);
    testObject.categorize(newTransaction, category);
    expect(caughtEvent).toBeNull();
  });

  it("should only remove transaction that was categorized", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const currency = new Currency(400, "USD");
    const transaction = new Transaction([
      TransactionDetail.withCurrency(new Currency(400)),
    ]);

    for (let i = 0; i < 10; i++) {
      testObject.readyForCategorization(
        new Transaction([TransactionDetail.withCurrency(new Currency(400))])
      );
    }

    testObject.readyForCategorization(transaction);
    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(10);
  });

  it("should be able to delete a category without transactions", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));
    testObject.removeCategory(new Category("Home"));

    expect(testObject.getCategories().length).toBe(0);
  });

  it("should be able to delete a category with transactions", () => {

    let caughtEvent = null;
    const listener = {
      onCategoryRemoved: function(event : OnCategoryRemovedEvent) {
        caughtEvent = event;
      }
    }

    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const details = [];
    details.push(new TransactionDetail("Test", "Test"));
    const transaction = new Transaction(details);

    testObject.readyForCategorization(transaction);
    testObject.categorize(transaction, new Category("Home"));
    expect(testObject.getUncategorized().length).toBe(0);

    testObject.addCategoryRemovedListener(listener);
    testObject.removeCategory(new Category("Home"));

    expect(testObject.getUncategorized().length).toBe(1);
    expect(caughtEvent.category.equals(new Category('Home'))).toBe(true);
    caughtEvent = null;

    testObject.removeCategoryRemovedListener(listener);
    testObject.addCategory(new Category('Test'));
    testObject.removeCategory(new Category('Test'));

    expect(caughtEvent).toBeNull();
  });

  it("should throw an exception if you try to delete a category that does not exist", () => {
    const testObject = new SpectreUser();

    let caughtException = null;
    try {
      testObject.removeCategory(new Category("Home"));
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot remove a category that does not exist [Home]"
    );
  });

  it("should throw an exception if a user tries to categorize a transaction that was not ready", () => {
    const testObject = new SpectreUser();
    testObject.addCategory(new Category("Home"));

    const currency = new Currency(400, "USD");
    const transaction = new Transaction([
      TransactionDetail.withCurrency(currency),
    ]);

    let caughtException = null;
    try {
      testObject.categorize(transaction, new Category("Home"));
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
      "Must ready transaction for categorization"
    );
  });

  it('should throw an exception if two categories are added with the same name', () => {
    const testObject = new SpectreUser();

    testObject.addCategory(new Category('Home'));

    let caughtException = null;
    try {
      testObject.addCategory(new Category('Home'));
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe('Category [Home] was alredy added');
  });

  it('should throw an exception if trying to categorize against something that dne', () => {

    const testObject = new SpectreUser();
    const transaction = new Transaction([new TransactionDetail('TEST', 'A')]);

    testObject.readyForCategorization(transaction);

    let caughtException = null;
    try {
      testObject.categorize(transaction, new Category('Home'));
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe('[Home] category was not registered in user');
  });
});
