import { ScreenSegmentPayload } from "./screen.segment.payload";

export const LINE_BREAK_TYPE = 'LINE BREAK TYPE';

export class LineBreakScreenSegmentPayload extends ScreenSegmentPayload {

    uniqueKey : string;

    constructor(uniqueKey : string) {
        super();
        this.uniqueKey = uniqueKey;
    }

    getUniqueKey() {
        return this.uniqueKey;
    }

    getType() {
        return LINE_BREAK_TYPE;
    }
}