import { ScreenSegmentPayload } from "./screen.segment.payload";
import { Spacer } from "../pojo/spacer";

export const SPACER_PAYLOAD_TYPE = 'SPACER_PAYLOAD_TYPE';

export class SpacerScreenSegmentPayload extends ScreenSegmentPayload {

    getType() {
        return SPACER_PAYLOAD_TYPE;
    }
}