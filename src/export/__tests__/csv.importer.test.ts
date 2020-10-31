import { Columns } from "../columns";
import { AMOUNT_TYPE, Transaction } from "../../pojo/transaction";
import { CsvExporter } from "../csv.exporter";
import { Currency } from "../../pojo/currency";
import { CsvImporter, unescapeCsvElement } from "../csv.importer";
import { TransactionDetail } from "../../pojo/transaction.detail";
import { DATE_TYPE } from "../../transaction.detail.converter/date.converter";
import { CATEGORY_TYPE } from "../../pojo/category";
import { COLOR_TYPE } from "../../pojo/color";
import { COLOR_NOT_FOUND } from "../../service/scepter.format.csv.importer";

export function generateTransactionFor(columns: Columns, overrides?: any) {
  const getDefaultElementFor = (type: string) => {
    let defaultElement;
    if (type === DATE_TYPE) {
      defaultElement = "08/17/2020 03:43:12 PM";
    } else if (type === CATEGORY_TYPE) {
      defaultElement = "Defaulted Test Category";
    } else if (type === AMOUNT_TYPE) {
      defaultElement = "$50.00";
    } else if (type === COLOR_TYPE) {
      defaultElement = COLOR_NOT_FOUND.hex();
    } else if (type === "number") {
      defaultElement = "1";
    } else {
      defaultElement = "Test String";
    }
    return defaultElement;
  };

  const containsOverride = (overrides: any, name: string) => {
    let containsOverride = false;
    for (let i = 0; i < overrides.length; i++) {
      if (overrides[i]["name"] === name) {
        containsOverride = true;
        break;
      }
    }
    return containsOverride;
  };

  const getOverride = (overrides: any, name: string) => {
    let override = null;
    for (let i = 0; i < overrides.length; i++) {
      if (overrides[i]["name"] === name) {
        override = overrides[i]["value"];
        break;
      }
    }
    return override;
  };

  if (!overrides) {
    overrides = [];
  }

  const details = [];

  for (let i = 0; i < columns.getNumColumns(); i++) {
    let name = columns.getName(i);
    const type = columns.getType(i);

    let element;
    if (containsOverride(overrides, name)) {
      element = getOverride(overrides, name);
    } else {
      element = getDefaultElementFor(type);
    }

    details.push(new TransactionDetail(element, name, type));
  }

  return new Transaction(details);
}

describe("Csv Importer", () => {
  it("should be able to import items into that were exported", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
      2: {
        name: "Test2Type",
        type: "Test2Type",
      },
    });

    const details = [
      new TransactionDetail("This is a detail", "Test1Type", "Test1Type"),
      new TransactionDetail("This is another detail", "Test2Type", "Test2Type"),
      TransactionDetail.withCurrency(new Currency(400), "Amount"),
    ];
    const transaction = new Transaction(details);

    const exporter = new CsvExporter();
    exporter.defineOutgoingFormat(columns);

    const testObject = new CsvImporter();
    testObject.defineIncomingFormat(columns);

    const converted = testObject.convert(exporter.convert(transaction));
    expect(converted.equals(transaction)).toBe(true);
  });

  it("should be able to convert a transaction with extra elements", () => {
    const rawString = "$400.00,Test1,Test2,Test3\n";
    const testObject = new CsvImporter();

    const converted = testObject.convert(rawString);

    const details = converted.getDetails();
    expect(details.length).toBe(4);
  });

  it("should return all default values for each element if null string is given", () => {
    const columns = new Columns({
      0: {
        name: "Amount",
        type: AMOUNT_TYPE,
      },
      1: {
        name: "Test1Type",
        type: "Test1Type",
      },
      2: {
        name: "Test2Type",
        type: "Test2Type",
      },
    });

    const testObject = new CsvImporter();
    testObject.defineIncomingFormat(columns);

    const transaction = testObject.convert(null);

    expect(
      transaction.getDetailsByColumnName(columns.getName(0)).length
    ).toEqual(1);
    expect(
      transaction.getDetailsByColumnName(columns.getName(1)).length
    ).toEqual(1);
    expect(
      transaction.getDetailsByColumnName(columns.getName(2)).length
    ).toEqual(1);

    const defaultedAmountDetail = transaction.getDetailsByColumnName(
      columns.getName(0)
    )[0];
    expect(defaultedAmountDetail.getElement()).toBe("");

    const defaultedTest1TypeDetail = transaction.getDetailsByColumnName(
      columns.getName(1)
    )[0];
    expect(defaultedTest1TypeDetail.getElement()).toBe("");

    const defaultedTest2TypeDetail = transaction.getDetailsByColumnName(
      columns.getName(2)
    )[0];
    expect(defaultedTest2TypeDetail.getElement()).toBe("");
  });

  it("should be able to unescape csv element without quotations marks", () => {
    const unescaped = unescapeCsvElement("Cody");
    expect(unescaped).toBe("Cody");
  });

  it("should be able to handle when there is no string given", () => {
    const unescaped = unescapeCsvElement("");
    expect(unescaped).toBe("");
  });

  it("should be able to handle when there is a null string given", () => {
    const unescaped = unescapeCsvElement();
    expect(unescaped).toBe("");
  });
});
