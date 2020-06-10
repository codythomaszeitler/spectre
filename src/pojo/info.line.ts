export class TransactionDetail {

    detail : String;
    type : String;

    constructor(detail : String, type : String) {
        this.detail = detail;
        this.type = type;
    }

    copy() {
        return new TransactionDetail(this.detail, this.type);
    }

    equals(transactionDetail : TransactionDetail) {
        return this.detail === transactionDetail.detail && this.type === transactionDetail.type;
    }

    getDetail() {
        return this.detail;
    }

    getType() {
        return this.type;
    }
}