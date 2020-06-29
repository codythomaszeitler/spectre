import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "../export/exporter";
import { Location } from "../service/location";
import { DocumentSaveService } from "./document.save.service";
import { Columns, columnNameDelimeter, nameKey } from "../export/columns";
import { CATEGORY_TYPE } from "../pojo/category";
import {Transaction} from '../pojo/transaction';

export class TransactionSaveService {
  spectreUser: SpectreUser;
  location: Location;
  exporter: Exporter;

  constructor(
    spectreUser: SpectreUser,
    location: Location,
    exporter: Exporter
  ) {
    this.spectreUser = spectreUser;
    this.location = location;
    this.exporter = exporter;
  }

  async save() {

    let converted = [];

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const transactions = this.spectreUser.getTransactionsFor(category);
        for (let j = 0; j < transactions.length; j++) {
            const transaction = transactions[j].copy();

            const asString = this.exporter.convert(transaction, category); 
            converted.push(asString + '\n');
        }
    }

    const documentSaveService = new DocumentSaveService(this.location);
    await documentSaveService.save(converted);
  }

  static generateCompliantColumns(spectreUser : SpectreUser) {
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
