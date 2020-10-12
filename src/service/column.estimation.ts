import { RawDataLocation } from "./raw.data.location";
import { Columns, nameKey, columnNameDelimeter } from "../export/columns";
import { SpectreUser } from "../pojo/spectre.user";
import { CATEGORY_TYPE } from "../pojo/category";
import { Transaction } from "../pojo/transaction";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "./scepter.format.importer";
import { SCEPTER_CATEGORY_COLOR_COLUMN_NAME, SCEPTER_CATEGORY_ORDERING_COLUMN_NAME } from "../export/with.view.context.exporter";
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
        type: this.getTypeFromColumnName(headerSegments[i])
      };
    }
    return new Columns(config);
  }

  private getTypeFromColumnName(columnName : string) {
    let type;
    if (columnName === SCEPTER_CATEGORY_COLUMN_NAME) {
      type = CATEGORY_TYPE;
    } else if (columnName === SCEPTER_CATEGORY_COLOR_COLUMN_NAME) {
      type = COLOR_TYPE;
    } else if (columnName === SCEPTER_CATEGORY_ORDERING_COLUMN_NAME) {
      type = 'number';
    } else { 
      type = "string";
    }

    return type;
  }

  estimateByTransaction(transaction: Transaction) {
    const columnsConfig = {};
    this._ensureColumnSupportsTransaction(transaction, columnsConfig);
    return new Columns(columnsConfig);
  }

  estimateBySpectreUser(spectreUser: SpectreUser) {
    const columnsConfig: any = {};

    const addCategoryColumn = () => {
      const getLargestColumnCount = () => {
        const transactions = spectreUser.getTransactions();

        let largestColumnCount = 0;
        for (let i = 0; i < transactions.length; i++) {
          const details = transactions[i].getDetails();
          if (details.length > largestColumnCount) {
            largestColumnCount = details.length;
          }
        }
        return largestColumnCount;
      };
      columnsConfig[getLargestColumnCount()] = {
        name: "Category",
        type: CATEGORY_TYPE,
      };
    };

    const transactions = spectreUser.getTransactions();
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      this._ensureColumnSupportsTransaction(transaction, columnsConfig);
    }

    addCategoryColumn();

    return new Columns(columnsConfig);
  }

  _ensureColumnSupportsTransaction = (
    transaction: Transaction,
    columnsConfig: any
  ) => {
    const addOrAppendColumnName = (columnIndex: number, columnName: string) => {
      if (columnsConfig[columnIndex]) {
        const currentColumnName = columnsConfig[columnIndex][nameKey];
        if (!currentColumnName.includes(columnName)) {
          columnsConfig[columnIndex][nameKey] =
            currentColumnName + columnNameDelimeter + columnName;
        }
      } else {
        columnsConfig[columnIndex] = {
          name: columnName,
          type: "string",
        };
      }
    };

    const details = transaction.getDetails();
    for (let j = 0; j < details.length; j++) {
      const detail = details[j];
      const columnName = detail.getColumnName();

      addOrAppendColumnName(j, columnName);
    }
  };
}
