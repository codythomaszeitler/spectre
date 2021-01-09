import {
  CATEGORY_NOT_FOUND,
  ScepterFormatCsvImporter,
} from "../scepter.format.csv.importer";
import { CATEGORY_TYPE } from "../../pojo/category";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../scepter.format.importer";
import { Columns } from "../../export/columns";
import { STRING_TYPE, TransactionDetail } from "../../pojo/transaction.detail";
import { DATE_TYPE } from "../../transaction.detail.converter/date.converter";
import { AMOUNT_TYPE } from "../../pojo/transaction";
import {
  SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
  SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
  SCEPTER_CATEGORY_SPACER_COLUMN_NAME,
} from "../../export/with.view.context.exporter";
import { COLOR_TYPE } from "../../pojo/color";

export function getScepterCompliantColumns() {
  return SCEPTER_COMPLIANT_COLUMNS.copy();
}

const SCEPTER_COMPLIANT_COLUMNS = new Columns({
  0: {
    name: "Account",
    type: STRING_TYPE,
  },
  1: {
    name: "Date",
    type: DATE_TYPE,
  },
  2: {
    name: "Vendor",
    type: STRING_TYPE,
  },
  3: {
    name: "Amount",
    type: AMOUNT_TYPE,
  },
  4: {
    name: "Notes",
    type: STRING_TYPE,
  },
  5: {
    name: SCEPTER_CATEGORY_COLUMN_NAME,
    type: CATEGORY_TYPE,
  },
  6: {
    name: SCEPTER_CATEGORY_ORDERING_COLUMN_NAME,
    type: "number",
  },
  7: {
    name: SCEPTER_CATEGORY_COLOR_COLUMN_NAME,
    type: COLOR_TYPE,
  },
  8: {
    name: SCEPTER_CATEGORY_SPACER_COLUMN_NAME,
    type: STRING_TYPE,
  },
});

describe("Scepter Format Csv Importer", () => {
  it("should be able to handle when a category is not found on the line with lack of commas", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert("Test Transaction");

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        .equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);
  });

  it("should be able to handle when a category is not found on the line with no element in area", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert("Test Transaction,");

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        .equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);
  });

  it("should be able to handle when a category is not found in the middle of two others", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert(
      "Test Transaction,,Another Test Transaction"
    );

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        .equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransationDetail = new TransactionDetail(
      "Another Test Transaction",
      SCEPTER_COMPLIANT_COLUMNS.getName(2),
      SCEPTER_COMPLIANT_COLUMNS.getType(2)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(2))
        .equals(anotherTransationDetail)
    ).toBe(true);
  });

  it("should return a transaction with all empty details if an undefined string is given", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert();

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        ?.equals(expectedTransactionDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(2),
      SCEPTER_COMPLIANT_COLUMNS.getType(2)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(2))
        .equals(anotherTransactionDetail)
    ).toBe(true);
  });

  it("should return a transaction with all empty details if an null string is given", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert(null);

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        .equals(expectedTransactionDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(2),
      SCEPTER_COMPLIANT_COLUMNS.getType(2)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(2))
        .equals(anotherTransactionDetail)
    ).toBe(true);
  });

  it("should return a transaction with all empty details if an empty string is given", () => {
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(SCEPTER_COMPLIANT_COLUMNS);
    const transactionAndCategory = testObject.convert(null);

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(0),
      SCEPTER_COMPLIANT_COLUMNS.getType(0)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(0))
        .equals(expectedTransactionDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail(
      "",
      SCEPTER_COMPLIANT_COLUMNS.getName(2),
      SCEPTER_COMPLIANT_COLUMNS.getType(2)
    );
    expect(
      transaction
        .getDetailByName(SCEPTER_COMPLIANT_COLUMNS.getName(2))
        .equals(anotherTransactionDetail)
    ).toBe(true);
  });
});
