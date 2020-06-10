import {DocumentLoadService} from '../document.load.service';
import { Location } from "../location";
import {TestLocation} from './test.location';

describe('Document Load Service', () => {
    it('should be able to load a file from a filesystem', async () => {

        const location : Location = new TestLocation(['1', '2', '3']);

        const testObject = new DocumentLoadService(location);
        const data = await testObject.fetchall();

        expect(data.length).toBe(3);
        expect(data).toContainEqual('1');
        expect(data).toContainEqual('2');
        expect(data).toContainEqual('3');
    });
});


