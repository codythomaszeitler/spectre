import { Importer } from "../export/importer";
import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";
import { DocumentLoadService } from "./document.load.service";
import { ColumnEstimation } from "../service/column.estimation";
import { TransactionLoader } from "./transaction.loader";

export class VenmoTransactionLoadService implements TransactionLoader {
  importer: Importer;

  constructor(importer : Importer) {
      this.importer = importer;
  }

  async load(scepterUser: SpectreUser, location: RawDataLocation) {
    const estimator = new ColumnEstimation();
    const structureOfCsv = await estimator.estimateByLocation(location);
    this.importer.defineIncomingFormat(structureOfCsv);

    const loadService = new DocumentLoadService(location);
    let lines = await loadService.fetchall();

    for (let i = 2; i < lines.length - 1; i++) {
      const transaction = this.importer.convert(lines[i]);
      scepterUser.readyForCategorization(transaction);
    }
  }
}
