import { STRING_TYPE } from "../../pojo/transaction.detail";
import { Columns } from "../columns";
import { CsvImporter } from "../csv.importer";
import { ScepterCompliantFormatImporter } from "../scepter.compliant.format.importer";
import { MasterBankConfig } from "../../mappings/master.bank.config";
import { SCEPTER_CATEGORY_COLOR_COLUMN_NAME, SCEPTER_CATEGORY_ORDERING_COLUMN_NAME } from "../with.view.context.exporter";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../../service/scepter.format.importer";

describe("Scetper Compliant Format Importer", () => {
  it("should be able to add all details to match scetper format", () => {

    const testObject = new CsvImporter(new ScepterCompliantFormatImporter());

    const columns = new Columns({
      0: {
        name: "Vendor",
        type: STRING_TYPE,
      },
    });
    testObject.defineIncomingFormat(columns);
    const transaction = testObject.convert('"TestVendor"');

    expect(transaction.hasDetailWithColumnName('Account')).toBeTruthy();
    expect(transaction.hasDetailWithColumnName('Date')).toBeTruthy();
    expect(transaction.hasDetailWithColumnName('Vendor')).toBeTruthy();
    expect(transaction.hasDetailWithColumnName('Amount')).toBeTruthy();
    expect(transaction.hasDetailWithColumnName('Notes')).toBeTruthy();
    expect(transaction.hasDetailWithColumnName(SCEPTER_CATEGORY_COLOR_COLUMN_NAME)).toBeFalsy();
    expect(transaction.hasDetailWithColumnName(SCEPTER_CATEGORY_COLUMN_NAME)).toBeFalsy();
    expect(transaction.hasDetailWithColumnName(SCEPTER_CATEGORY_ORDERING_COLUMN_NAME)).toBeFalsy();
  });
});
