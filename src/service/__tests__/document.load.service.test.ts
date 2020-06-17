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

    it('should be able to generate a columns configuration from a location', async () => {
        const location : Location = new TestLocation(['a,b,c', '1,1,3']);

        const testObject = new DocumentLoadService(location);
        const columns = await testObject.guessColumnsConfig();

        expect(columns.getNumColumns()).toBe(3);
        expect(columns.getName(0)).toBe('column0');
        expect(columns.getType(0)).toBe('string');
        expect(columns.getName(1)).toBe('column1');
        expect(columns.getType(1)).toBe('string');
        expect(columns.getName(2)).toBe('column2');
        expect(columns.getType(2)).toBe('string');
    });

    it('should be able to peek at the first element', async() => {
        const location : Location = new TestLocation(['a,b,c', '1,1,3']);
        const testObject = new DocumentLoadService(location);
        const data = await testObject.peekone();

        expect(data).toBe('a,b,c');
    });
});


