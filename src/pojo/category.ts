export const CATEGORY_TYPE = 'Category';

export class Category {

    constructor(type) {
        this.type = type;
        this.transactions = [];
    }

    getType() {
        return this.type;
    }

    associate(transaction) {
        this.transactions.push(transaction.copy());
    }

    getTransactions() {
        const copied = [];
        for (let i = 0; i < this.transactions.length; i++) {
            copied.push(this.transactions[i].copy());
        }
        return copied;
    }

    equals(category) {
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