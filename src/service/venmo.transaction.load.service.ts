import { Importer } from "../export/importer";
import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";
import { DocumentLoadService } from "./document.load.service";
import { ColumnEstimation } from "../service/column.estimation";
import { TransactionLoader, getMissingHeaders, CanLoadResult } from "./transaction.loader";
import { ViewContext } from "../screens/view.context";

export class VenmoTransactionLoadService implements TransactionLoader {
  importer: Importer;

  constructor(importer : Importer) {
      this.importer = importer;
  }

  async canLoad(location : RawDataLocation) {
    const missing = await getMissingHeaders(location, this.importer.necessaryColumnHeaders());
    return CanLoadResult.generate(missing);
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

    const viewContextBuilder = new ViewContext.Builder();
    return viewContextBuilder.build();
  }
}
