import { Transaction } from "../../pojo/transaction";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { DATE_TYPE } from "../../transaction.detail.converter/date.converter";
import { WithMonthIndexExporter } from "../with.month.index.exporter";

describe("With Month Index Exporter", () => {
  it("should be able to add a month index with a transaction with a valid date", () => {
    // const testObject = new WithMonthIndexExporter();

    // const transaction = new Transaction([
    //   new TransactionDetail("9/10/2020", "Date", DATE_TYPE),
    // ]);
    // const exported = testObject.convert(transaction);
    // expect(exported).toBe('"9/10/2020","9"');
  });
});
