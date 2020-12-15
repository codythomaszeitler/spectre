import { ViewContext } from "../screens/view.context";
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

    if (before.equals(Spacer.END_OF_CATEGORIES())) {
      throw new Error(
        "Cannot use END OF CATEGORIES constant for before category"
      );
    }

    if (after.equals(Spacer.START_OF_CATEGORIES())) {
      throw new Error(
        "Cannot use START OF CATEGORIES constant for after category"
      );
    }

    this.before = before.copy();
    this.after = after.copy();
  }

  isBefore(category: Category) {
    return this.getBefore().equals(category);
  }

  isAfter(category: Category) {
    return this.getAfter().equals(category);
  }

  getBefore() {
    return this.before.copy();
  }

  getAfter() {
    return this.after.copy();
  }

  isAtBeginning() {
    return this.before.equals(Spacer.START_OF_CATEGORIES());
  }

  isAtEnd() {
    return this.after.equals(Spacer.END_OF_CATEGORIES());
  }

  copy() {
    return new Spacer(this.before, this.after);
  }

  equals(spacer: Spacer) {
    return this.before.equals(spacer.before) && this.after.equals(spacer.after);
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

  static hasSpacerAtBeginning(spacers: Array<Spacer>) {
    if (!spacers) {
      throw new Error("Cannot check hasSpacerAtBeginning without a list");
    }

    let hasSpacerAtBeginning = false;
    for (let i = 0; i < spacers.length; i++) {
      const spacer = spacers[i];
      if (spacer.isAtBeginning()) {
        hasSpacerAtBeginning = true;
        break;
      }
    }

    return hasSpacerAtBeginning;
  }

  static hasSpacerAtEnd(spacers: Array<Spacer>) {
    if (!spacers) {
      throw new Error("Cannot check hasSpacerAtEnd without a list");
    }

    let hasSpacerAtEnd = false;
    for (let i = 0; i < spacers.length; i++) {
      const spacer = spacers[i];
      if (spacer.isAtEnd()) {
        hasSpacerAtEnd = true;
        break;
      }
    }
    return hasSpacerAtEnd;
  }

  static getMissingSpacers(spacers: Array<Spacer>, viewContext: ViewContext) {
    const hasSpacerBetween = (above: Category, below: Category) => {
      const spacer = new Spacer(above, below);

      let hasSpacerBefore = false;
      for (let i = 0; i < spacers.length; i++) {
        if (spacers[i].equals(spacer)) {
          hasSpacerBefore = true;
          break;
        }
      }
      return hasSpacerBefore;
    };

    const getCategoryAbove = (category: Category) => {
      let categoryAbove = null;

      const categoryPosition = viewContext.getOrderFor(category);
      if (categoryPosition === 1) {
        return Spacer.START_OF_CATEGORIES();
      }

      const categories = viewContext.getCategories();
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const currentOrder = viewContext.getOrderFor(category);

        if (currentOrder === categoryPosition - 1) {
          categoryAbove = category;
          break;
        }
      }
      return categoryAbove;
    };

    const getCategoryBelow = (category: Category) => {
      let categoryBelow = null;

      const categories = viewContext.getCategories();

      const categoryPosition = viewContext.getOrderFor(category);
      if (categoryPosition === categories.length) {
        return Spacer.END_OF_CATEGORIES();
      }

      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const currentOrder = viewContext.getOrderFor(category);

        if (currentOrder === categoryPosition + 1) {
          categoryBelow = category;
          break;
        }
      }
      return categoryBelow;
    };

    const missingSpacers = new Array<Spacer>();
    const alreadyCreatedMissingSpacer = (above: Category, below: Category) => {
      const spacer = new Spacer(above, below);

      let alreadyCreatedMissingSpacer = false;
      for (let i = 0; i < missingSpacers.length; i++) {
        const missingSpacer = missingSpacers[i];
        if (missingSpacer.equals(spacer)) {
          alreadyCreatedMissingSpacer = true;
          break;
        }
      }
      return alreadyCreatedMissingSpacer;
    };

    const categories = viewContext.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (viewContext.hasSpacerBefore(category)) {
        const aboveCategory = getCategoryAbove(category);

        if (
          !alreadyCreatedMissingSpacer(aboveCategory, category) &&
          !hasSpacerBetween(aboveCategory, category)
        ) {
          missingSpacers.push(new Spacer(aboveCategory, category));
        }
      }

      if (viewContext.hasSpacerAfter(category)) {
        const belowCategory = getCategoryBelow(category);

        if (
          !alreadyCreatedMissingSpacer(category, belowCategory) &&
          !hasSpacerBetween(category, belowCategory)
        ) {
          missingSpacers.push(new Spacer(category, belowCategory));
        }
      }
    }

    return missingSpacers;
  }
}
