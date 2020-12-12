import { Transaction } from "../../pojo/transaction";
import { STRING_TYPE, TransactionDetail } from "../../pojo/transaction.detail";
import { DATE_TYPE } from "../../transaction.detail.converter/date.converter";
import { Columns } from "../columns";
import { SCEPTER_MONTH_INDEX_COLUMN_NAME, WithMonthIndexExporter } from "../with.month.index.exporter";

describe("With Month Index Exporter", () => {
  it("should be able to add a month index with a transaction with a valid date", () => {
    const testObject = new WithMonthIndexExporter();

    const transaction = new Transaction([
      new TransactionDetail("9/10/2020", "Date", DATE_TYPE),
    ]);
    const exported = testObject.convert(transaction);
    expect(exported).toBe('"9",');
  });

  it('should return 0 if there is no date found within the transaction', () => {
    const testObject = new WithMonthIndexExporter();

    const transaction = new Transaction([
      new TransactionDetail("Not a date", "String", STRING_TYPE),
    ]);
    const exported = testObject.convert(transaction);
    expect(exported).toBe('"0",');
  });

  it('should add the month index column name to the header of the csv', () => {
    const testObject = new WithMonthIndexExporter();

    const csvHeader = testObject.convertColumns(new Columns({}));
    expect(csvHeader).toBe('"' + SCEPTER_MONTH_INDEX_COLUMN_NAME + '",');
  });
});
