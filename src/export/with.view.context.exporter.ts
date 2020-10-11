import { Exporter } from "./exporter";
import { ExporterDecorator } from "./exporter.decorator";
import { Columns } from "./columns";
import { Transaction } from "../pojo/transaction";
import { Category } from "../pojo/category";
import { ViewContext } from "../screens/view.context";
import { escapeCsvElement } from "../export/csv.exporter";

export class WithViewContextExporter extends ExporterDecorator {
  viewContext: ViewContext;

  constructor(viewContext: ViewContext, exporter?: Exporter) {
    super(exporter);
    this.viewContext = viewContext;
  }

  convertColumns(columns: Columns) {
    return super.convertColumns(columns) + ",Ordering,Color";
  }

  defineOutgoingFormat(columns: Columns) {
    if (this.exporter) {
      this.exporter.defineOutgoingFormat(columns);
    }
  }

  convert(transaction: Transaction, category?: Category) {
    const color = this.viewContext.getColorFor(category);
    const ordering = this.viewContext.getOrderFor(category);

    return super.convert(transaction, category) + escapeCsvElement(ordering) + "," + escapeCsvElement(color?.hex()) + ",";
  }
}
