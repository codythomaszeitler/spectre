import { DocumentSaveService } from "../document.save.service";
import { TestLocation } from "./test.location";

describe("Document Save Service", () => {
  it("should be able to write the filename and contents to a file", async () => {
    const writer : TestLocation = new TestLocation([]);

    const testString = "Hi! This is a test!";

    const testObject = new DocumentSaveService(writer);
    await testObject.save([testString]);

    expect(writer.written.length).toBe(1);
    expect(writer.written[0]).toBe(testString);
  });
});
