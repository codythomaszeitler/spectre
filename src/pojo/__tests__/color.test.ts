import { Color } from "../color";

describe('Color', () => {
    it('should be able to make a color somewhat darker', () => {
        const testObject = new Color("#FF8000");
        const darker = testObject.darkerBy(2);

        const expected = new Color('#7F4000');
        expect(expected).toEqual(darker);
    });

    it('should be able to make a color somewhat lighter', () => {
        const testObject = new Color('#7F4000');

        const lighter = testObject.lighterBy(2);
        const expected = new Color("#FE8000");

        expect(expected).toEqual(lighter);
    });

    it('should limit itself to max of FFFFFF if making lighter', () => {
        const testObject = new Color('#858585');

        const maxOutLighter = testObject.lighterBy(2);
        const expected = new Color('#FFFFFF');

        expect(expected).toEqual(maxOutLighter);
    });

    it('should be able to handle factors that are decimals', () => {
        const testObject = new Color('#858585');

        const lighter = testObject.lighterBy(1.2);
        const expected = new Color('#9F9F9F');
        expect(expected).toEqual(lighter);
    });
});