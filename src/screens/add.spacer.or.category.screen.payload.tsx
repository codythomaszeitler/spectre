import { ScreenSegmentPayload } from "./screen.segment.payload";

export const ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE = 'ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE';

export class AddSpacerOrCategoryScreenPayload extends ScreenSegmentPayload {

    onSpacerAddPress : () => void;
    onCategoryAddPress : () => void;

    constructor() {
        super();
        this.onSpacerAddPress = () => {};
        this.onCategoryAddPress = () => {};
    }

    setOnSpacerAddPress(onSpacerAddPress : () => void) {
        this.onSpacerAddPress = onSpacerAddPress;
        return this;
    }

    setOnCategoryAddPress(onCateoryAddPress : () => void) {
        this.onCategoryAddPress = onCateoryAddPress;
        return this;
    }

    getUniqueKey() {
        return ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE;
    }

    getType() {
        return ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE;
    }
}