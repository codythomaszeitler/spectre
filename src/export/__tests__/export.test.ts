import { Columns } from "../columns";
import { Export } from "../export";
import { CsvExporter } from "../csv.exporter";
import { Transaction, AMOUNT_TYPE, TIMESTAMP_TYPE} from "../../pojo/transaction";
import { TransactionDetail } from "../../pojo/info.line";
import { SpectreUser } from "../../pojo/spectre.user";
import { Category, CATEGORY_TYPE } from "../../pojo/category";
import { Currency } from "../../pojo/currency";

describe("Export", () => {
  it("should be able to export a category from a into string format", () => {
    const columns = new Columns({
      0: {
        Bank: "Bank",
      },
      1: {
        Business: "Business",
      },
      2: {
        Amount: AMOUNT_TYPE,
      },
      3: {
        Category: CATEGORY_TYPE,
      },
    });

    const spectreUser = new SpectreUser();
    spectreUser.addCategory(new Category("TEST"));

    const details = [];
    details.push(new TransactionDetail("TestBank", "Bank"));
    details.push(new TransactionDetail("TestBusiness", "Business"));
    const transaction = new Transaction(
      new Currency(400, "USD"),
      details
    );

    spectreUser.readyForCategorization(transaction);
    spectreUser.categorize(transaction, new Category("TEST"));

    const testObject = new Export(new CsvExporter(columns));
    const csvContents = testObject.export(spectreUser).split("\n");
    expect(csvContents[0]).toBe('"Bank","Business","Amount","Category"');
    expect(csvContents[1]).toBe(
      '"TestBank","TestBusiness","$400.00","TEST"'
    );
  });
});
