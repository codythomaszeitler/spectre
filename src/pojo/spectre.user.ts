import { Currency } from "./currency";
import { Category } from "./category";
import { Transaction, AMOUNT_TYPE } from "./transaction";

export class SpectreUser {
  categories: Category[];
  uncategorized: Transaction[];

  onCategoryAddedListeners: CategoryAddedListener[];

  onTransactionCategorizedListeners: TransactionCategorizationListenerMapping[];
  onTransactionUncategorizedListeners: TransactionUncategorizedListener[];

  currentListenerId: number;
  currentTransactionId: number;

  constructor() {
    this.categories = [];
    this.uncategorized = [];

    this.transactionReadyForCategorizationListeners = [];
    this.onCategoryAddedListeners = [];
    this.onTransactionCategorizedListeners = [];
    this.onTransactionUncategorizedListeners = [];
    this.currentListenerId = 0;

    this.currentTransactionId = 0;
  }

  getCategories() {
    const copied = [];
    for (let i = 0; i < this.categories.length; i++) {
      copied.push(this.categories[i].copy());
    }
    return copied;
  }

  getTransactionsFor(category: Category) {
    const found = this._getCategory(category);
    return found.getTransactions();
  }

  getUncategorized() {
    const copied = [];
    for (let i = 0; i < this.uncategorized.length; i++) {
      copied.push(this.uncategorized[i].copy());
    }

    return copied;
  }

  readyForCategorization(transaction: Transaction) {
    transaction.id = this.currentTransactionId;
    this.currentTransactionId++;
    this.uncategorized.push(transaction.copy());

    for (
      let i = 0;
      i < this.transactionReadyForCategorizationListeners.length;
      i++
    ) {
      const listener = this.transactionReadyForCategorizationListeners[i];
      listener.onTransactionReadyForCategorization({
        transaction: transaction.copy(),
      });
    }
  }

  addTransactionReadyForCategorizationListener(listener) {
    this.transactionReadyForCategorizationListeners.push(listener);
    listener.__id = this.currentListenerId;
    this.currentListenerId++;
  }

  removeTransactionReadyForCategorizationListener(listener) {
    this.transactionReadyForCategorizationListeners = this.transactionReadyForCategorizationListeners.filter(
      function (inner) {
        return listener.__id !== inner.__id;
      }
    );
  }

  addCategory(category: Category) {
    this.categories.push(category.copy());

    for (let i = 0; i < this.onCategoryAddedListeners.length; i++) {
      this.onCategoryAddedListeners[i].onCategoryAdded(
        new OnCategoryAddedEvent(category.copy())
      );
    }
  }

  addOnCategoryAddedListener(listener: CategoryAddedListener) {
    this.onCategoryAddedListeners.push(listener);
    listener.__onCategoryAddedListenerId = this.currentOnCategoryAddedListenerId;
  }

  removeOnCategoryAddedListener(listener: CategoryAddedListener) {
    this.onCategoryAddedListeners = this.onCategoryAddedListeners.filter(
      function (inner) {
        return (
          listener.__onCategoryAddedListenerId !==
          inner.__onCategoryAddedListenerId
        );
      }
    );
  }

  categorize(transaction: Transaction, category: Category) {
    if (!transaction.isCategorized()) {
      throw new Error("Must ready transaction for categorization");
    }

    this.uncategorized = this.uncategorized.filter(function (inner) {
      return !inner.equals(transaction);
    });

    const found = this._getCategory(category);
    found.associate(transaction);

    const listeners = this._getListenersForCategory(
      this.onTransactionCategorizedListeners,
      category
    );
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].onTransactionCategorized(
        new OnTransactionCategorizedEvent(found.copy(), transaction)
      );
    }
  }

  _getListenersForCategory(mappings, category) {
    const listeners = [];
    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      if (mapping.category.equals(category)) {
        listeners.push(mapping.listener);
      }
    }
    return listeners;
  }

  addTransactionCategorizedListener(
    category: Category,
    listener: TransactionCategorizedListener
  ) {
    const mapping = new TransactionCategorizationListenerMapping(
      category,
      listener
    );
    this.onTransactionCategorizedListeners.push(mapping);
    listener.__id = this.currentListenerId;
    this.currentListenerId++;
  }

  removeTransactionCategorizedListener(
    category: Category,
    listener: TransactionCategorizedListener
  ) {
    const removeCheck = new TransactionCategorizationListenerMapping(
      category,
      listener
    );

    this.onTransactionCategorizedListeners = this.onTransactionCategorizedListeners.filter(
      function (mapping) {
        return !removeCheck.equals(mapping);
      }
    );
  }

  uncategorize(transaction: Transaction, category: Category) {
    const found = this._getCategory(category);
    found.unassociate(transaction);

    this.uncategorized.splice(0, 0, transaction.copy());

    const listeners = this._getListenersForCategory(
      this.onTransactionUncategorizedListeners,
      category
    );
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].onTransactionUncategorized(
        new OnTransactionUncategorizedEvent(category, transaction)
      );
    }
  }

  addTransactionUncategorizedListener(
    category: Category,
    listener: TransactionUncategorizedListener
  ) {
    const mapping = new TransactionCategorizationListenerMapping(
      category,
      listener
    );
    this.onTransactionUncategorizedListeners.push(mapping);
    listener.__id = this.currentListenerId;
    this.currentListenerId++;
  }

  removeTransactionUncategorizedListener(
    category: Category,
    listener: TransactionUncategorizedListener
  ) {
    const removeCheck = new TransactionCategorizationListenerMapping(
      category,
      listener
    );

    this.onTransactionUncategorizedListeners = this.onTransactionUncategorizedListeners.filter(
      function (mapping) {
        return !removeCheck.equals(mapping);
      }
    );
  }

  rollup(category: Category, type: string) {
    const found = this._getCategory(category);

    const transactions = found.getTransactions();
    let computed = new Currency(0, "USD");

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const currency = transaction.getDetail(type);

      computed = computed.add(currency);
    }

    return computed;
  }

  _getCategory(category: Category) {
    let found = null;

    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].equals(category)) {
        found = this.categories[i];
        break;
      }
    }

    return found;
  }
}

export interface CategoryAddedListener {
  onCategoryAdded: (event: OnCategoryAddedEvent) => void;
}

export class OnCategoryAddedEvent {
  category: Category;

  constructor(category: Category) {
    this.category = category.copy();
  }
}

export interface TransactionCategorizedListener {
  onTransactionCategorized: (event: OnTransactionCategorizedEvent) => void;
}

export class OnTransactionCategorizedEvent {
  category: Category;
  transaction: Transaction;

  constructor(category: Category, transaction: Transaction) {
    this.category = category.copy();
    this.transaction = transaction.copy();
  }
}

export interface TransactionUncategorizedListener {
  onTransactionUncategorized: (event: OnTransactionUncategorizedEvent) => void;
}

export class OnTransactionUncategorizedEvent {
  category: Category;
  transaction: Transaction;

  constructor(category: Category, transaction: Transaction) {
    this.category = category.copy();
    this.transaction = transaction.copy();
  }
}

class TransactionCategorizationListenerMapping {
  category: Category;
  listener: TransactionCategorizedListener;

  constructor(category: Category, listener: TransactionCategorizedListener) {
    this.category = category.copy();
    this.listener = listener;
  }

  equals(mapping: TransactionCategorizationListenerMapping) {
    const areCategoryEquals = this.category.equals(mapping.category);
    const areListenerEquals = this.listener.__id === mapping.listener.__id;
    return areCategoryEquals && areListenerEquals;
  }
}
