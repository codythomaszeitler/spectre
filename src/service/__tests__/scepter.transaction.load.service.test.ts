import { CsvExporter } from "../../export/csv.exporter";
import { CsvImporter } from "../../export/csv.importer";
import { Category } from "../../pojo/category";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { SpectreUser } from "../../pojo/spectre.user";
import { Transaction } from "../../pojo/transaction";
import { TransactionLoadService } from "../transaction.load.service";
import { TestLocation } from "./test.location";
import { Columns } from "../../export/columns";

describe('Scepter Transaction Load Service', () => {

    it('should add columns when loading in a scepter csv file', async () => {
        const columns = new Columns({
            0: {
              name : 'TestColumn',
              type : 'String' 
            },
            1 : { 
              name : 'ScepterCategory',
              type : 'ScepterCategory'
            }
          });

        const scepterUser = new SpectreUser();
        
        const scepterTransaction = new Transaction([
            new TransactionDetail('Test String', 'TestColumn', 'String')
        ]);

        const category = new Category('Test Category');
        scepterUser.addCategory(category);
        scepterUser.readyForCategorization(scepterTransaction);
        scepterUser.categorize(scepterTransaction, category);

        const exporter = new CsvExporter(columns);

        const location = new TestLocation([exporter.convert(scepterTransaction, category)]);
        const importer = new CsvImporter(columns);
        const testObject = new ScepterTransactionLoadService(
            scepterUser,
            location,
            importer
        );

        await testObject.load();

        expect(scepterUser.getCategories().length).toBe(1);
    });
});