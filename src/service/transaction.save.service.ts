import { SpectreUser } from "../pojo/spectre.user";
import { Exporter } from "../export/exporter";
import { Location } from "../service/location";
import { DocumentSaveService } from "./document.save.service";
import { Columns } from "../export/columns";
import { CATEGORY_TYPE } from "../pojo/category";

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

    const transactions = spectreUser.getTransactions();

    let largestColumnCount = 0;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const details = transaction.getDetails();

      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        const columnName = detail.getColumnName();

        if (columnsConfig[j]) {
          const currentColumnName = columnsConfig[j]["name"];
          if (!currentColumnName.includes(columnName)) {
            columnsConfig[j]["name"] = currentColumnName + '|' + columnName
          }
        } else {
          columnsConfig[j] = {
           name : columnName, 
           type : 'string'
          }
        }
      }

      if (largestColumnCount < details.length) {
        largestColumnCount = details.length;
      }
    }

    columnsConfig[largestColumnCount] = {
      name : 'Category',
      type : CATEGORY_TYPE
    }

    return new Columns(columnsConfig);
  }
}
