import { BankConfig } from "../mappings/bank.config";
import { MasterBankConfig } from "../mappings/master.bank.config";
import { MasterBankConfigParser } from "../mappings/master.bank.config.parser";
import { Transaction } from "../pojo/transaction";
import { TransactionDetail } from "../pojo/transaction.detail";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../service/scepter.format.importer";
import { SCEPTER_FORMAT } from "./csv.type";
import { ImporterDecorator } from "./importer.decorator";
import { SCEPTER_CATEGORY_COLOR_COLUMN_NAME, SCEPTER_CATEGORY_ORDERING_COLUMN_NAME } from "./with.view.context.exporter";

export class ScepterCompliantFormatImporter extends ImporterDecorator {
  public convert(item: string) {
    const transaction = super.convert(item);
    const details = transaction.getDetails();

    // So now we have to get the scepter format importer thing

    const scepterFormat = this.getScepterFormatFromMasterConfig();

    const mappings = scepterFormat.getMappings();

    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      const scepterFormatName = mapping.getNodeName();
      const type = mapping.getType();

      if (scepterFormatName === SCEPTER_CATEGORY_COLOR_COLUMN_NAME) {
        continue;
      }
      if (scepterFormatName === SCEPTER_CATEGORY_ORDERING_COLUMN_NAME) {
        continue;
      }
      if (scepterFormatName === SCEPTER_CATEGORY_COLUMN_NAME) {
        continue;
      }

      if (!transaction.hasDetailWithColumnName(scepterFormatName)) {
        details.push(new TransactionDetail("", scepterFormatName, type));
      }
    }

    return new Transaction(details);
  }

  private getScepterFormatFromMasterConfig() {
    const masterConfig = new MasterBankConfigParser(MasterBankConfig);
    return masterConfig.getConfigFor(SCEPTER_FORMAT.get());
  }
}
