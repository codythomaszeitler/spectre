import { Currency } from "./currency";
import { Category } from "./category";
import { Transaction, AMOUNT_TYPE } from "./transaction";

export class SpectreUser {
  categories: Category[];
  uncategorized: Transaction[];

  onCategoryAddedListeners: CategoryAddedListener[];
  currentOnCategoryAddedListenerId: number;

  onTransactionCategorizedListeners: TransactionCategorizationListenerMapping[];
  onTransactionUncategorizedListeners: TransactionUncategorizedListener[];

  currentTransactionReadyForCategorizationListenerId: number;
  currentListenerId: number;

  currentTransactionId: number;

  constructor() {
    this.categories = [];
    this.uncategorized = [];

    this.transactionReadyForCategorizationListeners = [];
    this.currentTransactionReadyForCategorizationListenerId = 0;

    this.onCategoryAddedListeners = [];
    this.currentOnCategoryAddedListenerId = 0;

    this.onTransactionCategorizedListeners = [];
    this.currentListenerId = 0;

    this.onTransactionUncategorizedListeners = [];

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
    listener.__transactionReadyForCategorizationListenerId = this
      .currentTransactionReadyForCategorizationListenerId++;
  }

  removeTransactionReadyForCategorizationListener(listener) {
    this.transactionReadyForCategorizationListeners = this.transactionReadyForCategorizationListeners.filter(
      function (inner) {
        return (
          listener.__transactionReadyForCategorizationListenerId !==
          inner.__transactionReadyForCategorizationListenerId
        );
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
    const getListeners = () => {
      const listeners = [];
      for (let i = 0; i < this.onTransactionCategorizedListeners.length; i++) {
        const mapping = this.onTransactionCategorizedListeners[i];
        if (mapping.category.equals(category)) {
          listeners.push(mapping.listener);
        }
      }
      return listeners;
    };

    if (!transaction.isCategorized()) {
      throw new Error("Must ready transaction for categorization");
    }

    this.uncategorized = this.uncategorized.filter(function (inner) {
      return !inner.equals(transaction);
    });

    const found = this._getCategory(category);
    found.associate(transaction);

    const listeners = getListeners();
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].onTransactionCategorized(
        new OnTransactionCategorizedEvent(found.copy(), transaction)
      );
    }
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
    listener.__currentTransactionCategorizedListenerId = this.currentListenerId;
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

    for (let i = 0; i < this.onTransactionUncategorizedListeners.length; i++) {
      this.onTransactionUncategorizedListeners[i].onTransactionUncategorized(
        new OnTransactionUncategorizedEvent(category, transaction)
      );
    }
  }

  addTransactionUncategorizedListener(listener : TransactionUncategorizedListener) {
    this.onTransactionUncategorizedListeners.push(listener);
    listener.__id = this.currentListenerId;
    this.currentListenerId++;
  }

  removeTransactionUncategorizedListener(listener : TransactionUncategorizedListener) {
    this.onTransactionUncategorizedListeners = this.onTransactionUncategorizedListeners.filter(function(inner) {
      return inner.__id !== listener.__id;
    });
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
  onTransactionUncategorized: (event : OnTransactionUncategorizedEvent) => void;
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
    const areListenerEquals =
      this.listener.__currentTransactionCategorizedListenerId ===
      mapping.listener.__currentTransactionCategorizedListenerId;
    return areCategoryEquals && areListenerEquals;
  }
}
