import {
  CsvType,
  RAW_FORMAT,
  SCEPTER_FORMAT,
  VENMO_FORMAT,
} from "../export/csv.type";
import { MasterBankConfigParser } from "../mappings/master.bank.config.parser";
import { MasterBankConfig } from "../mappings/master.bank.config";
import { ScepterTransactionLoadService } from "./scepter.transaction.load.service";
import { ScepterFormatCsvImporter } from "./scepter.format.csv.importer";
import { TransactionLoadService } from "./transaction.load.service";
import { ByColumnNameCsvImporter } from "../export/by.column.name.csv.converter";
import { CsvImporter } from "../export/csv.importer";
import { VenmoTransactionLoadService } from "./venmo.transaction.load.service";
import { RawDataLocation } from "./raw.data.location";
import { WithStaticValueCsvImporter } from "../export/with.static.value.csv.importer";
import { ScepterCompliantFormatImporter } from "../export/scepter.compliant.format.importer";

export class TransactionLoaderFactory {
  create(csvType: CsvType, location: RawDataLocation) {
    const masterMappingInfo = new MasterBankConfigParser(MasterBankConfig);
    const config = masterMappingInfo.getConfigFor(csvType.get());

    if (!config) {
      throw new Error(
        "There was no configuration found for [" + csvType.get() + "]"
      );
    }

    let service = null;

    if (csvType.equals(SCEPTER_FORMAT)) {
      service = new ScepterTransactionLoadService(
        new ScepterFormatCsvImporter()
      );
    } else if (csvType.equals(VENMO_FORMAT)) {
      service = new VenmoTransactionLoadService(
        new ByColumnNameCsvImporter(
          config,
          new WithStaticValueCsvImporter("Account", location.getFileName())
        )
      );
    } else if (csvType.equals(RAW_FORMAT)) {
      service = new TransactionLoadService(new CsvImporter());
    } else {
      service = new TransactionLoadService(
        new ScepterCompliantFormatImporter(
          new ByColumnNameCsvImporter(
            config,
            new WithStaticValueCsvImporter("Account", location.getFileName())
          )
        )
      );
    }

    return service;
  }
}
