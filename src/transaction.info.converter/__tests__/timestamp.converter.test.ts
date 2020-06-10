import {TimestampConverter} from '../timestamp.converter';
import {Timestamp} from '../../pojo/timestamp';

describe('Timestamp Converter', () => {

    it('should convert from timestamp to string', () => {
        const testObject = new TimestampConverter();

        const asString = testObject.toString(new Timestamp(2019, 'January', 1));
        expect(asString).toBe('2019 January 1');
    });
});