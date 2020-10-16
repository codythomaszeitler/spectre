import { DateConverter } from "../date.converter";

describe("Date Converter", () => {
  it("should be able to convert a date of the following form: MM-DD-YYYY HH:mm:ss", () => {
    const testObject = new DateConverter();
    const date = testObject.fromString("07/31/2020 18:31:41");

    expect(date.getFullYear()).toBe(2020);
  });

  it("should be able to convert a date that has a PM attached to it", () => {
    const input = "08/17/2020 03:43:12 PM";

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2020);
  });

  it("should be able to convert a date of the following form: MM-DD-YYYY", () => {
    const testObject = new DateConverter();
    const date = testObject.fromString("07/31/2020");

    expect(date.getFullYear()).toBe(2020);
  });

  it("should be able to convert a date when in ISO format", () => {
    const input = "2020-07-31T18:31:41";

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2020);
    expect(date.getHours()).toBe(18);
  });

  it("should be able to convert a month without leading zeros", () => {
    const input = "4/22/2017";

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2017);
    expect(date.getMonth()).toBe(3);
  });

  it("should be able to convert even if there is only a year", () => {
    const input = "2020";

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2020);
  });

  it("should be able to convert an ISO string into an excel compatible string", () => {
    const input = "2020-07-31T18:31:41";

    const testObject = new DateConverter();
    const asString = testObject.intoString(testObject.fromString(input));

    expect(asString).toBe("07/31/2020 18:31:41");
  });

  it("should be able to convert an ISO date into an excel compatible format when there is only a year given", () => {
    const input = "2020";

    const testObject = new DateConverter();
    const asString = testObject.intoString(testObject.fromString(input));

    expect(asString).toBe("01/01/2020 00:00:00");
  });
});
