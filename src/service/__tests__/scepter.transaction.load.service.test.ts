import { CsvExporter } from "../../export/csv.exporter";
import { Category } from "../../pojo/category";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { SpectreUser } from "../../pojo/spectre.user";
import { Transaction } from "../../pojo/transaction";
import { TestLocation } from "./test.location";
import { Columns } from "../../export/columns";
import { ScepterFormatCsvImporter } from "../scepter.format.csv.importer";

describe('Scepter Transaction Load Service', () => {

    it('should add columns to scepter user when loading in a scepter csv file', async () => {
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

        // I'm not really even sure what columns means here...
        // Which columns is this representing?
        // Columns is representing the imported data header.
        const importer = new ScepterFormatCsvImporter(columns);
        const testObject = new ScepterTransactionLoadService(
            importer
        );

        const newScepterUser = new SpectreUser();
        await testObject.load(newScepterUser, location);

        expect(newScepterUser.getCategories().length).toBe(1);
    });
});