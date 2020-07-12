import { Category } from "./category";

export class Spacer {
  before: Category;
  after: Category;

  constructor(before: Category, after: Category) {
    if (!before) {
      throw new Error("Cannot create a spacer with a null before category");
    }

    if (!after) {
      throw new Error("Cannot create a spacer with a null after category");
    }

    this.before = before.copy();
    this.after = after.copy();
  }

  copy() {
    return new Spacer(this.before, this.after);
  }

  static START_OF_CATEGORIES() {
    return new Category("___UNIQUE STRING FOR START OF CATEGORIES___");
  }

  static END_OF_CATEGORIES() {
    return new Category("___UNIQUE STRING FOR END OF CATEGORIES___");
  }

  static containsSpacerBefore(spacers: Spacer[], category: Category) {
    if (!spacers) {
        throw new Error(
          "Cannot check spacer location from a falsy list of spacers"
        );
      }

    if (!category) {
      return false;
    }

    let containsSpacerBefore = false;

    for (let i = 0; i < spacers.length; i++) {
      const spacer = spacers[i];

      if (spacer.after.equals(category)) {
        containsSpacerBefore = true;
        break;
      }
    }

    return containsSpacerBefore;
  }

  static containsSpacerAfter(spacers: Spacer[], category: Category) {
    if (!spacers) {
      throw new Error(
        "Cannot check spacer location from a falsy list of spacers"
      );
    }

    if (!category) {
      return false;
    }

    let containsSpacerAfter = false;

    for (let i = 0; i < spacers.length; i++) {
      const spacer = spacers[i];

      if (spacer.before.equals(category)) {
        containsSpacerAfter = true;
        break;
      }
    }

    return containsSpacerAfter;
  }
}
