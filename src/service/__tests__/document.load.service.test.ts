import { DocumentLoadService } from "../document.load.service";
import { Location } from "../location";
import { TestLocation } from "./test.location";

describe("Document Load Service", () => {
  it("should be able to load a file from a filesystem", async () => {
    const location: Location = new TestLocation(["1", "2", "3"]);

    const testObject = new DocumentLoadService(location);
    const data = await testObject.fetchall();

    expect(data.length).toBe(3);
    expect(data).toContainEqual("1");
    expect(data).toContainEqual("2");
    expect(data).toContainEqual("3");
  });

  it("should remove all empty lines when fetchall is called", async () => {
    const location: Location = new TestLocation(["1", "     ", "    \t ", ""]);

    const testObject = new DocumentLoadService(location);
    const loaded = await testObject.fetchall();

    expect(loaded.length).toBe(1);
  });
});
