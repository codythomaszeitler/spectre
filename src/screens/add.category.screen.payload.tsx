import { ScreenSegmentPayload } from "./screen.segment.payload";
import { Category } from "../pojo/category";
import {Color} from '../pojo/color';

export const ADD_CATEGORY_SCREEN_PAYLOAD_TYPE = 'ADD_CATEGORY_SCREEN_PAYLOAD_TYPE';

export class AddCategoryScreenPayload extends ScreenSegmentPayload { 

    onSuccessfulAdd : (category : Category, color : Color) => void;
    onStopAddCategory : () => void;

    constructor() {
        super();
        this.onSuccessfulAdd = () => {};
        this.onStopAddCategory = () => {};
    }

    setOnSuccessfulAdd(onSuccessfulAdd : (category : Category, color : Color) => void) {
        this.onSuccessfulAdd = onSuccessfulAdd;
    }

    setStopAddCategory( stopAddCategory : () => void) {
        this.onStopAddCategory = stopAddCategory;
    }

    getType() {
        return ADD_CATEGORY_SCREEN_PAYLOAD_TYPE;
    }
}