import {Transaction} from '../pojo/transaction';

export class ProcessingLine {

    transactions : Transaction[];

    constructor() {
        this.transactions = [];
    }

    enqueue(transaction : Transaction) {
        this.transactions.push(transaction.copy());
    }

    dequeue() {
        if (this.transactions.length === 0) {
            return null;
        }

        const transaction = this.transactions.shift();
        return transaction;
    }
}