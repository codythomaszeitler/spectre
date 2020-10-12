import { DateConverter } from "../date.converter";

describe("Date Converter", () => {
  it("should be able to convert a date of the following form: MM-DD-YYYY", () => {
    const testObject = new DateConverter();
    const date = testObject.fromString("07/31/2020 18:31:41");

    expect(date.getFullYear()).toBe(2020);
  });

  it('should be able to convert a date when in ISO format', () => {
    const input = '2020-07-31T18:31:41';

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2020);
    expect(date.getHours()).toBe(18);
  });

  it('should be able to convert even if there is only a year', () => {
    const input = '2020';

    const testObject = new DateConverter();
    const date = testObject.fromString(input);

    expect(date.getFullYear()).toBe(2020);
  });

  it('should be able to convert an ISO string into an excel compatible string', () => {
    const input = '2020-07-31T18:31:41';

    const testObject = new DateConverter();
    const asString = testObject.intoString(testObject.fromString(input));

    expect(asString).toBe('07/31/2020 18:31:41');
  });

  it('should be able to convert an ISO date into an excel compatible format when there is only a year given', () => {
    const input = '2020';

    const testObject = new DateConverter();
    const asString = testObject.intoString(testObject.fromString(input));

    expect(asString).toBe('01/01/2020 00:00:00');
  });

});
