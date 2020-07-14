import { ScreenSegmentPayload } from "./screen.segment.payload";

export const LINE_BREAK_TYPE = 'LINE BREAK TYPE';

export class LineBreakScreenSegmentPayload extends ScreenSegmentPayload {

    constructor() {
        super();
    }

    getType() {
        return LINE_BREAK_TYPE;
    }
}