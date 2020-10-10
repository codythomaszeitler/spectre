import { ScreenSegmentPayload } from "./screen.segment.payload";
import { Category } from "../pojo/category";
import { Color } from "../pojo/color";
import { OnCategoryPressed } from "./category.screen";

export const CATEGORY_PAYLOAD_TYPE = "CATEGORY_PAYLOAD_TYPE";

export class CategoryScreenSegmentPayload extends ScreenSegmentPayload {
  category: Category;
  color: Color;
  isCategorizationMode: boolean;
  onPress: (event: OnCategoryPressed) => void;
  onColorChange : (Category : Category, color :Color) => void;

  constructor(category: Category) {
    super();
    this.category = category.copy();
    this.color = new Color("00000000");
    this.isCategorizationMode = false;
    this.onPress = function (event: OnCategoryPressed) {};
    this.onColorChange = () => {};
  }

  setColor(color: Color) {
    this.color = color;
    return this;
  }

  setCategorizationMode(isCategorizationMode: boolean) {
    this.isCategorizationMode = isCategorizationMode;
    return this;
  }

  setOnPress(onPress: (event: OnCategoryPressed) => void) {
    this.onPress = onPress;
    return this;
  }

  setOnColorChange(onColorChange : (category : Category, color : Color) => void) {
    this.onColorChange = onColorChange;
    return this;
  }

  getUniqueKey() {
    return this.category.getName() + ' ' + this.color.hex();
  }

  getType() {
    return CATEGORY_PAYLOAD_TYPE;
  }
}
