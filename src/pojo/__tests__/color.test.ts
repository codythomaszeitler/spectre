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
});