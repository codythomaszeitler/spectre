import { ScreenSegmentPayload } from "./screen.segment.payload";

export const SPACER_PAYLOAD_TYPE = 'SPACER_PAYLOAD_TYPE';

export class SpacerScreenSegmentPayload extends ScreenSegmentPayload {

    uniqueKey : string;

    constructor(uniqueKey : string) {
        super();
        this.uniqueKey = uniqueKey;
    }

    getUniqueKey() {
        return this.uniqueKey;
    }

    getType() {
        return SPACER_PAYLOAD_TYPE;
    }
}