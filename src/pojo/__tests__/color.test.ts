import { Color } from "../color";

describe('Color', () => {
    it('should be able to make a color somewhat darker', () => {
        const testObject = new Color("#FF8000");
        const darker = testObject.darker();

        const expected = new Color('#7F4000');
        expect(expected).toEqual(darker);
    });

    it('should throw an exception if a non hex code is given in constructor', () => {

    });
});