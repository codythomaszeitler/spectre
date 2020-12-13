import { Category } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { DATE_TYPE } from "../transaction.detail.converter/date.converter";
import { Columns } from "./columns";
import { escapeCsvElement } from "./csv.exporter";
import { ExporterDecorator } from "./exporter.decorator";

export const SCEPTER_MONTH_INDEX_COLUMN_NAME = "Month";

export class WithMonthIndexExporter extends ExporterDecorator {
  constructor(exporter?: ExporterDecorator) {
    super(exporter);
  }

  defineOutgoingFormat(columns: Columns): void {
    super.defineOutgoingFormat(columns);
  }

  convertColumns(columns: Columns): string {
    return (
      super.convertColumns(columns) +
      "," +
      SCEPTER_MONTH_INDEX_COLUMN_NAME
    );
  }

  convert(transaction: Transaction, category?: Category): string {
    const getDateDetails = () => {
      const details = transaction.getDetails();

      const foundDetails = [];
      for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        if (detail.getType() === DATE_TYPE) {
          foundDetails.push(detail.copy());
        }
      }
      return foundDetails;
    };

    const dateDetails = getDateDetails();
    let monthIndex = 0;
    if (dateDetails.length !== 0) {
      const dateDetail = dateDetails[0];

      const javascriptDate = dateDetail.asGivenType();
      monthIndex = javascriptDate.getMonth() + 1;
    }

    return (
      super.convert(transaction, category) + escapeCsvElement(monthIndex.toString()) + ","
    );
  }
}
