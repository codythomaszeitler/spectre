import { RawDataLocation } from "./raw.data.location";
import { Columns, nameKey, columnNameDelimeter } from "../export/columns";
import { SpectreUser } from "../pojo/spectre.user";
import { CATEGORY_TYPE } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "./scepter.format.importer";
import {
  SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
  SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
} from "../export/with.view.context.exporter";
import { COLOR_TYPE } from "../pojo/color";

export class ColumnEstimation {
  async estimateByLocation(location: RawDataLocation): Promise<Columns> {
    if (!location) {
      throw new Error("Cannot create estimation without a location");
    }

    const header = await location.peek();
    if (header.trim().length === 0) {
      throw new Error(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
      );
    }

    const headerSegments = header.split(",");

    let config: Object = {};
    for (let i = 0; i < headerSegments.length; i++) {
      config[i] = {
        name: headerSegments[i],
        type: this.getTypeFromColumnName(headerSegments[i]),
      };
    }
    return new Columns(config);
  }

  private getTypeFromColumnName(columnName: string) {
    let type;
    if (columnName === SCEPTER_CATEGORY_COLUMN_NAME) {
      type = CATEGORY_TYPE;
    } else if (columnName === SCEPTER_CATEGORY_COLOR_COLUMN_NAME) {
      type = COLOR_TYPE;
    } else if (columnName === SCEPTER_CATEGORY_ORDERING_COLUMN_NAME) {
      type = "number";
    } else {
      type = "string";
    }

    return type;
  }


  estimateBySpectreUser(spectreUser: SpectreUser) {
    const columnsConfig: any = {};

    const addCategoryColumn = (largestIndex : number) => {

      columnsConfig[largestIndex] = {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      };
    };

    const columnNames = new Set();

    const transactions = spectreUser.getTransactions();
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      const details = transaction.getDetails();

      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        columnNames.add(detail.getColumnName());
      }
    }

    let i = 0;
    columnNames.forEach((value) => {
      columnsConfig[i] = {
        name: value,
        type: "string",
      };

      i++;
    });

    addCategoryColumn(i);

    return new Columns(columnsConfig);
  }
}
