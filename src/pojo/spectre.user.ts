import {Currency} from './currency';

export class SpectreUser {

    constructor() {
        this.categories = [];
        this.uncategorized = [];

        this.transactionReadyForCategorizationListeners = [];
        this.currentTransactionReadyForCategorizationListenerId = 0;
    }

    getCategories() {
        const copied = [];
        for (let i = 0; i < this.categories.length; i++) {
            copied.push(this.categories[i].copy());
        }
        return copied;
    }

    getTransactionsFor(category) {
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

    readyForCategorization(transaction) {

        this.uncategorized.push(transaction.copy());

        for (let i = 0; i < this.transactionReadyForCategorizationListeners.length; i++) {
            const listener = this.transactionReadyForCategorizationListeners[i];
            listener.onTransactionReadyForCategorization({
                transaction : transaction.copy()
            });
        }
    }

    addTransactionReadyForCategorizationListener(listener) {
        this.transactionReadyForCategorizationListeners.push(listener);
        listener.__transactionReadyForCategorizationListenerId = this.currentTransactionReadyForCategorizationListenerId++;
    }

    removeTransactionReadyForCategorizationListener(listener) {
        this.transactionReadyForCategorizationListeners = this.transactionReadyForCategorizationListeners.filter(function(inner) {
            return listener.__transactionReadyForCategorizationListenerId !== inner.__transactionReadyForCategorizationListenerId;
        });
    }


    addCategory(category) {
        this.categories.push(category.copy());
    }

    categorize(transaction, category) {
        
        this.uncategorized = this.uncategorized.filter(function(inner) {
            return !inner.equals(transaction);
        });

        const found = this._getCategory(category);
        found.associate(transaction);

    }

    rollup(category) {
        const found = this._getCategory(category);

        const transactions = found.getTransactions();
        let computed = new Currency(0, 'USD');

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const currency = transaction.getAmount();

            computed = computed.add(currency);
        }

        return computed;
    }

    _getCategory(category) {
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