import { CsvType } from "../../../export/csv.type";
import {
  CsvToImport,
  OnCsvFileSelectedEvent,
  OnCsvFileSelectedListener,
  OnCsvTypeSelectedEvent,
  OnCsvTypeSelectedListener,
} from "../csv.to.import";

describe("Csv To Import", () => {
  it("should be able to set the file path", () => {
    const testObject = new CsvToImport();

    const mockFile = createMockFile("Test Filename");
    testObject.setImportFile(mockFile);

    expect(testObject.getImportFile().name).toBe(mockFile.name);
  });

  it("should emit an event when the file is set", () => {
    const testObject = new CsvToImport();

    let caughtEvent = null;
    const listener: OnCsvFileSelectedListener = {
      onCsvFileSeleted: (event: OnCsvFileSelectedEvent) => {
        caughtEvent = event;
      },
    };

    testObject.addOnCsvFileSelectedListener(listener);

    const mockFile = createMockFile("Test Filename");
    testObject.setImportFile(mockFile);

    expect(caughtEvent).toBeTruthy();

    caughtEvent = null;
    testObject.removeOnCsvFileSelectedListener(listener);
    testObject.setImportFile(mockFile);
    expect(caughtEvent).toBeFalsy();
  });

  it("should throw an exception if a null file is given", () => {
    const testObject = new CsvToImport();

    let caughtException = null;
    try {
      testObject.setImportFile(null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe("Cannot set with a falsy file");
  });

  it("should be able to set the csv file type", () => {
    const testObject = new CsvToImport();

    testObject.setCsvType(new CsvType("Test"));

    expect(testObject.getCsvType()).toEqual(new CsvType("Test"));
  });

  it("should emit an event when the csv file type is set", () => {
    const testObject = new CsvToImport();

    let caughtEvent = null;
    const listener: OnCsvTypeSelectedListener = {
      onCsvTypeSeleted: (event: OnCsvTypeSelectedEvent) => {
        caughtEvent = event;
      },
    };

    testObject.addOnCsvTypeSelectedListener(listener);

    testObject.setCsvType(new CsvType("Test"));
    expect(caughtEvent).toBeTruthy();

    caughtEvent = null;
    testObject.removeOnCsvTypeSelectedListener(listener);
    testObject.setCsvType(new CsvType("Test Again"));
    expect(caughtEvent).toBeFalsy();
  });

  it("should throw an exception if the csv type is null", () => {
    const testObject = new CsvToImport();

    let caughtException = null;
    try {
      testObject.setCsvType(null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe("Cannot set with a falsy csv type");
  });

  function createMockFile(filename: string) {
    return new File([""], filename, { type: "text/html" });
  }
});
