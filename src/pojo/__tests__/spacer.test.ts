import { ViewContext } from "../../screens/view.context";
import { Category } from "../category";
import { Spacer } from "../spacer";

describe("Spacer", () => {
  let spacer: Spacer;

  let spacers: Array<Spacer>;
  let beforeCategorization: Category;
  let afterCategorization: Category;

  beforeEach(() => {
    beforeCategorization = new Category("Before");
    afterCategorization = new Category("After");
    spacer = new Spacer(beforeCategorization, afterCategorization);
    spacers = [];
    spacers.push(spacer);
  });

  it("should be able to tell if a spacer is needed between two categories", () => {
    expect(Spacer.containsSpacerBefore(spacers, afterCategorization)).toBe(
      true
    );
    expect(Spacer.containsSpacerBefore(spacers, beforeCategorization)).toBe(
      false
    );

    expect(Spacer.containsSpacerAfter(spacers, beforeCategorization)).toBe(
      true
    );
    expect(Spacer.containsSpacerAfter(spacers, afterCategorization)).toBe(
      false
    );
  });

  it("should be able to tell if a spacer is needed at the beginning of the collection using containsSpacerBefore", () => {
    const beginningSpacer = new Spacer(
      Spacer.START_OF_CATEGORIES(),
      afterCategorization
    );
    spacers = [];
    spacers.push(beginningSpacer);

    expect(Spacer.containsSpacerBefore(spacers, afterCategorization)).toBe(
      true
    );
  });

  it("should be able to tell if a spacer is needed at the end of the collection using containsSpacerAfter", () => {
    const endSpencer = new Spacer(
      beforeCategorization,
      Spacer.END_OF_CATEGORIES()
    );
    spacers = [];
    spacers.push(endSpencer);

    expect(Spacer.containsSpacerAfter(spacers, beforeCategorization)).toBe(
      true
    );
  });

  it("should be able to tell if a spacer is needed at the beginning of the collection using hasSpacerAtBeginning", () => {
    const beginning = new Spacer(
      Spacer.START_OF_CATEGORIES(),
      afterCategorization
    );
    spacers.push(beginning);

    expect(Spacer.hasSpacerAtBeginning(spacers)).toBe(true);
  });

  it("should be able to tell if a spacer is not needed at the beginning of the collection using hasSpacerAtBeginning", () => {
    expect(Spacer.hasSpacerAtBeginning(spacers)).toBe(false);
  });

  it("should return false if given an empty list to hasSpacerAtBeginning", () => {
    expect(Spacer.hasSpacerAtBeginning([])).toBe(false);
  });

  it("should be able to tell if a spacer is needed at the end using hasSpacerAtEnd", () => {
    const end = new Spacer(beforeCategorization, Spacer.END_OF_CATEGORIES());
    spacers.push(end);

    expect(Spacer.hasSpacerAtEnd(spacers)).toBe(true);
  });

  it("should be able to tell if a spacer is not needed at the end using hasSpacerAtEnd", () => {
    expect(Spacer.hasSpacerAtEnd(spacers)).toBe(false);
  });

  it("should return false if an empty list is given to hasSpacerAtEnd", () => {
    expect(Spacer.hasSpacerAtEnd([])).toBe(false);
  });

  it("should throw an exception if a falsy list of spacers is given to hasSpacerAtBeginning", () => {
    let caughtException = null;

    try {
      Spacer.hasSpacerAtBeginning(null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot check hasSpacerAtBeginning without a list"
    );
  });

  it("should throw an exception if a falsy list of spacers is given to hasSpacerAtEnd", () => {
    let caughtException = null;

    try {
      Spacer.hasSpacerAtEnd(null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot check hasSpacerAtEnd without a list"
    );
  });

  it("should return false if the category is empty for containsSpacerBefore", () => {
    expect(Spacer.containsSpacerBefore(spacers, null)).toBe(false);
  });

  it("should return false if the category is empty for containsSpacerAfter", () => {
    expect(Spacer.containsSpacerAfter(spacers, null)).toBe(false);
  });

  it("should return false if spacers are empty for before call", () => {
    const category = new Category("Test");
    const spacers = Array<Spacer>();
    expect(Spacer.containsSpacerBefore(spacers, category)).toBe(false);
  });

  it("should return false if spacers are empty for after call", () => {
    const category = new Category("Test");
    const spacers = Array<Spacer>();
    expect(Spacer.containsSpacerAfter(spacers, category)).toBe(false);
  });

  it("should throw an exception if a null before category is given", () => {
    let caughtException = null;
    try {
      new Spacer(null, afterCategorization);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot create a spacer with a null before category"
    );
  });

  it("should throw an exception if a null after category is given", () => {
    let caughtException = null;
    try {
      new Spacer(beforeCategorization, null);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot create a spacer with a null after category"
    );
  });

  it("should throw an exception for contains space after if a falsy spacers is given", () => {
    let caughtException = null;
    try {
      Spacer.containsSpacerAfter(null, beforeCategorization);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot check spacer location from a falsy list of spacers"
    );
  });

  it("should throw an exception for contains space before if a falsy spacers is given", () => {
    let caughtException = null;
    try {
      Spacer.containsSpacerBefore(null, afterCategorization);
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot check spacer location from a falsy list of spacers"
    );
  });

  it("should throw an exception if the END OF CATEGORIES is given for before", () => {
    let caughtException = null;
    try {
      new Spacer(Spacer.END_OF_CATEGORIES(), afterCategorization);
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
      "Cannot use END OF CATEGORIES constant for before category"
    );
  });

  it("should throw an exception if the START OF CATEGORIES is given for after", () => {
    let caughtException = null;
    try {
      new Spacer(beforeCategorization, Spacer.START_OF_CATEGORIES());
    } catch (e) {
      caughtException = e;
    }
    expect(caughtException.message).toBe(
      "Cannot use START OF CATEGORIES constant for after category"
    );
  });

  it("should be able to tell you if there should be a category between two categories", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerAfter(beforeCategorization, true);
    builder.setHasSpacerBefore(afterCategorization, true);

    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const missing = Spacer.getMissingSpacers([], builder.build());
    expect(missing.length).toBe(1);

    const missingSpacer = missing[0];
    expect(missingSpacer).toEqual(
      new Spacer(beforeCategorization, afterCategorization)
    );
  });

  it("should be able to tell if there should be a spacer added at the very start", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerBefore(beforeCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);

    const missing = Spacer.getMissingSpacers([], builder.build());
    expect(missing.length).toBe(1);

    const missingSpacer = missing[0];
    expect(missingSpacer).toEqual(
      new Spacer(Spacer.START_OF_CATEGORIES(), beforeCategorization)
    );
  });

  it("should be able to tell if there should be a spacer added at the very end", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerAfter(afterCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const missing = Spacer.getMissingSpacers([], builder.build());
    expect(missing.length).toBe(1);

    const missingSpacer = missing[0];
    expect(missingSpacer).toEqual(
      new Spacer(afterCategorization, Spacer.END_OF_CATEGORIES())
    );
  });

  it("should be able to create above, between, and below spacers at the same time", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerBefore(beforeCategorization, true);
    builder.setHasSpacerAfter(afterCategorization, true);
    builder.setHasSpacerBefore(afterCategorization, true);
    builder.setHasSpacerAfter(beforeCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const missing = Spacer.getMissingSpacers([], builder.build());
    expect(missing.length).toBe(3);

    expect(
      containsSpacer(
        missing,
        new Spacer(Spacer.START_OF_CATEGORIES(), beforeCategorization)
      )
    ).toBe(true);
    expect(
      containsSpacer(
        missing,
        new Spacer(beforeCategorization, afterCategorization)
      )
    ).toBe(true);
    expect(
      containsSpacer(
        missing,
        new Spacer(afterCategorization, Spacer.END_OF_CATEGORIES())
      )
    ).toBe(true);
  });

  it("should be able to ignore spacers that already have been made in the middle", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerBefore(beforeCategorization, true);
    builder.setHasSpacerAfter(afterCategorization, true);
    builder.setHasSpacerBefore(afterCategorization, true);
    builder.setHasSpacerAfter(beforeCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const alreadyCreated = [
      new Spacer(beforeCategorization, afterCategorization),
    ];
    const missing = Spacer.getMissingSpacers(alreadyCreated, builder.build());
    expect(missing.length).toBe(2);

    expect(
      containsSpacer(
        missing,
        new Spacer(Spacer.START_OF_CATEGORIES(), beforeCategorization)
      )
    ).toBe(true);
    expect(
      containsSpacer(
        missing,
        new Spacer(afterCategorization, Spacer.END_OF_CATEGORIES())
      )
    ).toBe(true);
  });

  it("should be able to ignore spacers that already have been made at the beginning", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerBefore(beforeCategorization, true);
    builder.setHasSpacerAfter(afterCategorization, true);
    builder.setHasSpacerBefore(afterCategorization, true);
    builder.setHasSpacerAfter(beforeCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const alreadyCreated = [
      new Spacer(Spacer.START_OF_CATEGORIES(), beforeCategorization),
    ];
    const missing = Spacer.getMissingSpacers(alreadyCreated, builder.build());
    expect(missing.length).toBe(2);

    expect(
      containsSpacer(
        missing,
        new Spacer(beforeCategorization, afterCategorization)
      )
    ).toBe(true);
    expect(
      containsSpacer(
        missing,
        new Spacer(afterCategorization, Spacer.END_OF_CATEGORIES())
      )
    ).toBe(true);
  });

  it("should be able to ignore spacers already made at the end", () => {
    const builder = new ViewContext.Builder();

    builder.setHasSpacerBefore(beforeCategorization, true);
    builder.setHasSpacerAfter(afterCategorization, true);
    builder.setHasSpacerBefore(afterCategorization, true);
    builder.setHasSpacerAfter(beforeCategorization, true);
    builder.setCategoryOrdering(beforeCategorization, 1);
    builder.setCategoryOrdering(afterCategorization, 2);

    const missing = Spacer.getMissingSpacers(
      [new Spacer(afterCategorization, Spacer.END_OF_CATEGORIES())],
      builder.build()
    );
    expect(missing.length).toBe(2);

    expect(
      containsSpacer(
        missing,
        new Spacer(Spacer.START_OF_CATEGORIES(), beforeCategorization)
      )
    ).toBe(true);
    expect(
      containsSpacer(
        missing,
        new Spacer(beforeCategorization, afterCategorization)
      )
    ).toBe(true);
  });

  function containsSpacer(spacers: Array<Spacer>, spacer: Spacer) {
    let containsSpacer = false;
    for (let i = 0; i < spacers.length; i++) {
      const inner = spacers[i];
      if (inner.equals(spacer)) {
        containsSpacer = true;
        break;
      }
    }

    return containsSpacer;
  }
});
