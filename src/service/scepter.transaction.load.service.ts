import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";
import {
  CanLoadResult,
  getMissingHeaders,
  TransactionLoader,
} from "./transaction.loader";
import { ScepterFormatImporter } from "./scepter.format.importer";
import { ColumnEstimation } from "./column.estimation";
import { DocumentLoadService } from "./document.load.service";
import { CATEGORY_NOT_FOUND } from "./scepter.format.csv.importer";
import { ViewContext } from "../screens/view.context";

export class ScepterTransactionLoadService implements TransactionLoader {
  importer: ScepterFormatImporter;

  constructor(importer: ScepterFormatImporter) {
    this.importer = importer;
  }

  async canLoad(location: RawDataLocation) {
    const missing = await getMissingHeaders(
      location,
      this.importer.necessaryColumnHeaders()
    );
    return CanLoadResult.generate(missing);
  }

  async load(scepterUser: SpectreUser, location: RawDataLocation) {
    const viewContextBuilder = new ViewContext.Builder();

    const estimator = new ColumnEstimation();
    const structureOfCsv = await estimator.estimateByLocation(location);
    this.importer.defineIncomingFormat(structureOfCsv);

    const documentLoadService = new DocumentLoadService(location);
    const lines = await documentLoadService.fetchall();

    for (let i = 1; i < lines.length; i++) {
      const scepterTransactionLine = this.importer.convert(lines[i]);
      const transaction = scepterTransactionLine.getTransaction();
      const category = scepterTransactionLine.getCategory();
      const viewContext = scepterTransactionLine.getViewContext();

      if (viewContext.hasCategoryViewInfo(category)) {
        viewContextBuilder.setCategoryColor(
          category,
          viewContext.getColorFor(category)
        );
        viewContextBuilder.setCategoryOrdering(
          category,
          viewContext.getOrderFor(category)
        );

        viewContextBuilder.setHasSpacerBefore(
          category,
          viewContext.hasSpacerBefore(category)
        );
        viewContextBuilder.setHasSpacerAfter(
          category,
          viewContext.hasSpacerAfter(category)
        );
      }

      if (
        !category.equals(CATEGORY_NOT_FOUND) &&
        !scepterUser.hasCategory(category)
      ) {
        scepterUser.addCategory(category);
      }

      scepterUser.readyForCategorization(transaction);

      if (!category.equals(CATEGORY_NOT_FOUND)) {
        scepterUser.categorize(transaction, category);
      }
    }

    return viewContextBuilder.build();
  }
}
