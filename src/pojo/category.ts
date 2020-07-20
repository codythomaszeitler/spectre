import {Transaction} from '../pojo/transaction';

export const CATEGORY_TYPE = 'Category';

export class Category {

    type : string;
    transactions : Transaction[];

    constructor(type : string) {
        if (!type) {
            throw new Error('Cannot build a category with a falsy type string');
        }

        if (type.trim().length === 0) {
            throw new Error('Must give a value that is not just empty space');
        }

        this.type = type.trim();
        this.transactions = [];
    }

    getType() {
        return this.type;
    }

    associate(transaction : Transaction) {
        this.transactions.push(transaction.copy());
    }

    unassociate(transaction : Transaction) {
        this.transactions = this.transactions.filter(function (inner) {
            return !transaction.equals(inner);
        });
    }

    getTransactions() {
        const copied = [];
        for (let i = 0; i < this.transactions.length; i++) {
            copied.push(this.transactions[i].copy());
        }
        return copied;
    }

    equals(category : Category) {
        return this.type === category.type;
    }

    copy() {
        const category = new Category(this.type);
        for (let i = 0; i < this.transactions.length; i++) {
            category.associate(this.transactions[i]);
        }

        return category;
    }
}