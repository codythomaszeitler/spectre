import {Transaction} from '../pojo/transaction';

export const CATEGORY_TYPE = 'Category';

export class Category {

    type : string;
    transactions : Transaction[];

    constructor(type : string) {
        this.type = type;
        this.transactions = [];
    }

    getType() {
        return this.type;
    }

    associate(transaction : Transaction) {
        this.transactions.push(transaction.copy());
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