import { Location } from "../service/location";
import { Columns, nameKey, columnNameDelimeter } from "../export/columns";
import { SpectreUser } from "../pojo/spectre.user";
import {CATEGORY_TYPE} from '../pojo/category';

export class ColumnEstimation {

  async estimateByLocation(location : Location) : Promise<Columns> {
    if (!location) {
      throw new Error('Cannot create estimation without a location');
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
        type: "string",
      };
    }
    return new Columns(config);
  }

  estimateBySpectreUser(spectreUser: SpectreUser) {
    const columnsConfig = {};

    const ensureColumnSupportsTransaction = (transaction : Transaction) => {
      const addOrAppendColumnName = (columnIndex : number, columnName : string) => {
        if (columnsConfig[columnIndex]) {
          const currentColumnName = columnsConfig[columnIndex][nameKey];
          if (!currentColumnName.includes(columnName)) {
            columnsConfig[columnIndex][nameKey] = currentColumnName + columnNameDelimeter + columnName
          }
        } else {
          columnsConfig[columnIndex] = {
           name : columnName, 
           type : 'string'
          }
        }
      }

      const details = transaction.getDetails();
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        const columnName = detail.getColumnName();

        addOrAppendColumnName(j, columnName);
      }
    }

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
      }
      columnsConfig[getLargestColumnCount()] = {
        name : 'Category',
        type : CATEGORY_TYPE
      }
    }

    const transactions = spectreUser.getTransactions();
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      ensureColumnSupportsTransaction(transaction);
    }

    addCategoryColumn();

    return new Columns(columnsConfig);
  }
}
