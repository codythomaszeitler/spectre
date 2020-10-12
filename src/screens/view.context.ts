import { Category } from "../pojo/category";
import { Color } from "../pojo/color";
import { COLOR_NOT_FOUND } from "../service/scepter.format.csv.importer";

export class ViewContext {
  private categoryColors: Array<CategoryColorDuo>;
  private categoryOrderings: Array<CategoryOrderingDuo>;

  constructor() {
    this.categoryColors = new Array<CategoryColorDuo>();
    this.categoryOrderings = new Array<CategoryOrderingDuo>();
  }

  public hasCategoryViewInfo(category: Category) {
    const categories = this.getCategories();

    let hasCategory = false;
    for (let i = 0; i < categories.length; i++) {
      const inner = categories[i];

      if (inner.equals(category)) {
        hasCategory = true;
        break;
      }
    }
    return hasCategory;
  }

  public getCategories() {
    const categories = [];

    for (let i = 0; i < this.categoryColors.length; i++) {
      const categoryWithColor = this.categoryColors[i];
      categories.push(categoryWithColor.category);
    }

    return categories;
  }

  public getColorFor(category: Category) {
    if (!category) {
      throw new Error("Cannot get a color without a category");
    }

    let foundColor = null;
    for (let i = 0; i < this.categoryColors.length; i++) {
      const categoryWithColor = this.categoryColors[i];

      if (categoryWithColor.hasCategory(category)) {
        foundColor = categoryWithColor.getColor();
        break;
      }
    }

    return foundColor;
  }

  public getOrderFor(category: Category) {
    if (!category) {
      throw new Error("Cannot get a sort ordering without a category");
    }

    let foundOrdering = null;
    for (let i = 0; i < this.categoryOrderings.length; i++) {
      const categoryWithOrdering = this.categoryOrderings[i];

      if (categoryWithOrdering.hasCategory(category)) {
        foundOrdering = categoryWithOrdering.getOrdering();
        break;
      }
    }

    return foundOrdering;
  }

  static Builder = class {
    private building: ViewContext;

    constructor() {
      this.building = new ViewContext();
    }

    public setCategoryColor(category: Category, color: Color) {
      if (!category) {
        throw new Error("Cannot set a category color with a null category");
      }

      if (!color) {
        throw new Error("Cannot set a category color with a null color");
      }

      const alreadySetColor = this.building.getColorFor(category);
      let categoryWithColor = null;
      if (alreadySetColor && !alreadySetColor?.equals(color)) {
        this.removeCategoryColor(category);

        categoryWithColor = new CategoryColorDuo(
          category.copy(),
          COLOR_NOT_FOUND.copy()
        );
        this.building.categoryColors.push(categoryWithColor);
      } else if (!alreadySetColor) {
        categoryWithColor = new CategoryColorDuo(category.copy(), color.copy());
        this.building.categoryColors.push(categoryWithColor);
      }
    }

    private removeCategoryColor(category: Category) {
      this.building.categoryColors = this.building.categoryColors.filter(
        (inner: CategoryColorDuo) => {
          return !category.equals(inner.category);
        }
      );
    }

    public setCategoryOrdering(category: Category, ordering: number) {
      if (!category) {
        throw new Error("Cannot set a sort ordering without a category");
      }

      if (ordering === undefined || ordering === null) {
        throw new Error("Cannot set a sort ordering without an ordering");
      }

      if (ordering < 1) {
        throw new Error(
          "Cannot set a sort ordering that is not positive, tried to set [" +
            category.getName() +
            "] to [" +
            ordering +
            "]"
        );
      }

      const alreadySetOrdering = this.building.getOrderFor(category);

      let categoryWithOrdering = null;
      if (alreadySetOrdering && alreadySetOrdering !== ordering) {
        this.removeCategoryOrdering(category);
        categoryWithOrdering = new CategoryOrderingDuo(category.copy(), 1);
        this.building.categoryOrderings.push(categoryWithOrdering);
      } else if (!alreadySetOrdering) {
        categoryWithOrdering = new CategoryOrderingDuo(
          category.copy(),
          ordering
        );
        this.building.categoryOrderings.push(categoryWithOrdering);
      }
    }

    private removeCategoryOrdering(category: Category) {
      this.building.categoryOrderings = this.building.categoryOrderings.filter(
        (inner: CategoryOrderingDuo) => {
          return !category.equals(inner.category);
        }
      );
    }

    public build() {
      const getMissingOrderings = () => {
        const getMaxElement = (orderings: Array<number>) => {
          return Math.max(...orderings);
        };

        const getOrderingsSorted = () => {
          let orderings = [];
          for (let i = 0; i < this.building.categoryOrderings.length; i++) {
            const categoryWithOrdering = this.building.categoryOrderings[i];
            orderings.push(categoryWithOrdering.getOrdering());
          }
          orderings.sort(function (a, b) {
            return a - b;
          });
          return orderings;
        };

        const generateArray = (minumum: number, maximum: number) => {
          const generated = [];
          for (let i = minumum; i <= maximum; i++) {
            generated.push(i);
          }
          return generated;
        };

        const sorted = getOrderingsSorted();
        const toCheck = generateArray(1, getMaxElement(sorted));

        let missingElements = [];
        for (let i = 0; i < toCheck.length; i++) {
          const element = toCheck[i];
          if (!sorted.includes(element)) {
            missingElements.push(element);
          }
        }
        return missingElements;
      };

      const missing = getMissingOrderings();

      if (missing.length > 0) {
        const asString = JSON.stringify(missing);

        throw new Error(
          "Could not build since there was a gap in ordering " +
            asString +
            " was missing"
        );
      }

      for (let i = 0; i < this.building.categoryOrderings.length; i++) {
        const categoryWithOrdering = this.building.categoryOrderings[i];
        const category = categoryWithOrdering.category;
        const color = this.building.getColorFor(category);

        if (!color) {
          this.setCategoryColor(category, COLOR_NOT_FOUND.copy());
        }
      }

      for (let i = 0; i < this.building.categoryColors.length; i++) {
        const categoryWithColor = this.building.categoryColors[i];
        const category = categoryWithColor.category;
        const ordering = this.building.getOrderFor(category);

        if (!ordering) {
          this.setCategoryOrdering(category, 1);
        }
      }

      return this.building;
    }
  };
}

class CategoryColorDuo {
  category: Category;
  color: Color;

  constructor(category: Category, color: Color) {
    this.category = category.copy();
    this.color = color.copy();
  }

  hasCategory(category: Category) {
    return category.equals(this.category);
  }

  getColor() {
    return this.color.copy();
  }
}

class CategoryOrderingDuo {
  category: Category;
  ordering: number;

  constructor(category: Category, ordering: number) {
    this.category = category.copy();
    this.ordering = ordering;
  }

  hasCategory(category: Category) {
    return category.equals(this.category);
  }

  getOrdering() {
    return this.ordering;
  }
}
