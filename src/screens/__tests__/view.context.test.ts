import { Category } from "../../pojo/category";
import { Color } from "../../pojo/color";
import { COLOR_NOT_FOUND } from "../../service/scepter.format.csv.importer";
import { ViewContext } from "../view.context";

describe("View Context", () => {
  it("should be able to get the category color when queried", () => {
    const category = new Category("Test");
    const color = new Color("#000000");

    const builder = new ViewContext.Builder();
    builder.setCategoryColor(category, color);
    builder.setCategoryColor(
      new Category("Another Test"),
      new Color("#111111")
    );

    builder.setCategoryOrdering(category, 1);
    builder.setCategoryOrdering(new Category("Another Test"), 1);

    const testObject = builder.build();

    expect(testObject.getColorFor(category.copy())).toEqual(color);
    expect(testObject.getColorFor(new Category("Another Test"))).toEqual(
      new Color("#111111")
    );
  });

  it("should be able to get the sort order of the category", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();
    builder.setCategoryColor(new Category("Test"), new Color("#111111"));
    builder.setCategoryOrdering(category, 1);

    const testObject = builder.build();

    expect(testObject.getOrderFor(category.copy())).toBe(1);
  });

  it("should throw an exception if the given index is 0 or below", () => {
    const builder = new ViewContext.Builder();

    let caughtException = null;
    try {
      builder.setCategoryOrdering(new Category("A"), 0);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot set a sort ordering that is not positive, tried to set [A] to [0]"
    );
  });

  it("should throw an exception if trying to set sort ordering without a category", () => {
    const builder = new ViewContext.Builder();

    let caughtException = null;
    try {
      builder.setCategoryOrdering(null, 0);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot set a sort ordering without a category"
    );
  });

  it("should throw an exception if trying to set a sort ordering without a ordering", () => {
    const builder = new ViewContext.Builder();

    let caughtException = null;
    try {
      builder.setCategoryOrdering(new Category("A"), null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot set a sort ordering without an ordering"
    );
  });

  it("should throw an exception if there is not a color for every ordering and vice versa", () => {
    const builder = new ViewContext.Builder();

    builder.setCategoryColor(new Category("A"), new Color("#111111"));
    builder.setCategoryColor(new Category("C"), new Color("#111111"));

    builder.setCategoryOrdering(new Category("A"), 1);
    builder.setCategoryOrdering(new Category("B"), 2);
    builder.setCategoryOrdering(new Category("C"), 3);

    const testObject = builder.build();

    expect(testObject.getColorFor(new Category("B"))).toEqual(COLOR_NOT_FOUND);
  });

  it("should throw an exception if there is not a ordering for every color and vice versa", () => {
    const builder = new ViewContext.Builder();

    builder.setCategoryColor(new Category("A"), new Color("#111111"));
    builder.setCategoryColor(new Category("B"), new Color("#111111"));
    builder.setCategoryColor(new Category("C"), new Color("#111111"));

    builder.setCategoryOrdering(new Category("A"), 1);
    builder.setCategoryOrdering(new Category("C"), 2);

    const testObject = builder.build();

    expect(testObject.getOrderFor(new Category("B"))).toBe(1);
  });

  it("should return null if the requested category doest not exist within the context", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();
    const testObject = builder.build();

    expect(testObject.getColorFor(category.copy())).toBeNull();
  });

  it("should default to an error color if there are two conflicting colors", () => {
    const category = new Category("Test");
    const color = new Color("#000000");

    const builder = new ViewContext.Builder();
    builder.setCategoryColor(category, color);
    builder.setCategoryColor(category, new Color("#111111"));

    const testObject = builder.build();

    expect(testObject.getColorFor(category)).toEqual(COLOR_NOT_FOUND);
  });

  it("should throw an exception if the given category during building is null", () => {
    const color = new Color("#000000");

    const builder = new ViewContext.Builder();

    let caughtException = null;
    try {
      builder.setCategoryColor(null, color.copy());
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot set a category color with a null category"
    );
  });

  it("should throw an exception if the given color duing building is null", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();

    let caughtException = null;
    try {
      builder.setCategoryColor(category.copy(), null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot set a category color with a null color"
    );
  });

  it("should throw an exception if a falsy category is given to getColorFor", () => {
    const category = new Category("Test");
    const color = new Color("#000000");

    const builder = new ViewContext.Builder();
    builder.setCategoryColor(category, color);
    builder.setCategoryOrdering(category, 1);

    const testObject = builder.build();
    let caughtException = null;
    try {
      testObject.getColorFor(null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot get a color without a category"
    );
  });

  it("should be able to denote if there was a spacer before the category", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();
    builder.setHasSpacerBefore(category, true);

    const testObject = builder.build();

    expect(testObject.hasSpacerBefore(category)).toBe(true);
  });

  it("should be able to denote if there NOT was a spacer before the category", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();

    const testObject = builder.build();

    expect(testObject.hasSpacerBefore(category)).toBe(false);
  });

  it("should return false if a falsy category is given for hasSpacerBefore", () => {
    const builder = new ViewContext.Builder();
    const testObject = builder.build();
    expect(testObject.hasSpacerBefore(null)).toBe(false);
  });

  it("should be able to denote if there was a spacer after the category", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();
    builder.setHasSpacerAfter(category, true);

    const testObject = builder.build();

    expect(testObject.hasSpacerAfter(category)).toBe(true);
  });

  it("should be able to denote if there was NOT a spacer after the category", () => {
    const category = new Category("Test");

    const builder = new ViewContext.Builder();

    const testObject = builder.build();

    expect(testObject.hasSpacerAfter(category)).toBe(false);
  });

  it('should return false if a falsy category is given for hasSpacerAfter', () => {
    const builder = new ViewContext.Builder();
    const testObject = builder.build();
    expect(testObject.hasSpacerAfter(null)).toBe(false);
  });
});
