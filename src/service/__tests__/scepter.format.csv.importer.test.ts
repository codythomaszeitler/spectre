import {
  CATEGORY_NOT_FOUND,
  ScepterFormatCsvImporter,
} from "../scepter.format.csv.importer";
import { CATEGORY_TYPE } from "../../pojo/category";
import { SCEPTER_CATEGORY_COLUMN_NAME } from "../scepter.format.importer";
import { Columns } from "../../export/columns";
import { TransactionDetail } from "../../pojo/transaction.detail";

describe("Scepter Format Csv Importer", () => {
  it("should be able to handle when a category is not found on the line with lack of commas", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
    });

    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert("Test Transaction");

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      columns.getName(0),
      columns.getType(0)
    );
    expect(
      transaction.getDetailByName(columns.getName(0)).equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);
  });

  it("should be able to handle when a category is not found on the line with no element in area", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
    });

    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert("Test Transaction,");

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      columns.getName(0),
      columns.getType(0)
    );
    expect(
      transaction.getDetailByName(columns.getName(0)).equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);
  });

  it("should be able to handle when a category is not found in the middle of two others", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
      2: {
        name: "Another Test Column",
        type: "String",
      },
    });

    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert(
      "Test Transaction,,Another Test Transaction"
    );

    const transaction = transactionAndCategory.getTransaction();

    const transationDetail = new TransactionDetail(
      "Test Transaction",
      columns.getName(0),
      columns.getType(0)
    );
    expect(
      transaction.getDetailByName(columns.getName(0)).equals(transationDetail)
    ).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransationDetail = new TransactionDetail(
      "Another Test Transaction",
      columns.getName(2),
      columns.getType(2)
    );
    expect(
      transaction
        .getDetailByName(columns.getName(2))
        .equals(anotherTransationDetail)
    ).toBe(true);
  });

  it("should return a transaction with all empty details if an undefined string is given", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
      2: {
        name: "Another Test Column",
        type: "String",
      },
    });
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert();

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail('', columns.getName(0), columns.getType(0));
    expect(transaction.getDetailByName(columns.getName(0))?.equals(expectedTransactionDetail)).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail('', columns.getName(2), columns.getType(2));
    expect(transaction.getDetailByName(columns.getName(2)).equals(anotherTransactionDetail)).toBe(true);
  });

  it("should return a transaction with all empty details if an null string is given", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
      2: {
        name: "Another Test Column",
        type: "String",
      },
    });
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert(null);

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail('', columns.getName(0), columns.getType(0));
    expect(transaction.getDetailByName(columns.getName(0)).equals(expectedTransactionDetail)).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail('', columns.getName(2), columns.getType(2));
    expect(transaction.getDetailByName(columns.getName(2)).equals(anotherTransactionDetail)).toBe(true);
  });

  it("should return a transaction with all empty details if an empty string is given", () => {
    const columns = new Columns({
      0: {
        name: "TestColumn",
        type: "String",
      },
      1: {
        name: SCEPTER_CATEGORY_COLUMN_NAME,
        type: CATEGORY_TYPE,
      },
      2: {
        name: "Another Test Column",
        type: "String",
      },
    });
    const testObject = new ScepterFormatCsvImporter();

    testObject.defineIncomingFormat(columns);
    const transactionAndCategory = testObject.convert(null);

    const transaction = transactionAndCategory.getTransaction();

    const expectedTransactionDetail = new TransactionDetail('', columns.getName(0), columns.getType(0));
    expect(transaction.getDetailByName(columns.getName(0)).equals(expectedTransactionDetail)).toBe(true);

    const category = transactionAndCategory.getCategory();
    expect(category.equals(CATEGORY_NOT_FOUND)).toBe(true);

    const anotherTransactionDetail = new TransactionDetail('', columns.getName(2), columns.getType(2));
    expect(transaction.getDetailByName(columns.getName(2)).equals(anotherTransactionDetail)).toBe(true);
  });
});
