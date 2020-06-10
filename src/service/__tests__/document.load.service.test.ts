import {Location, DocumentLoadService} from '../document.load.service';

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


class TestLocation implements Location {
   
    items : string[];

    constructor(items : string[]) {
        this.items = items.slice();
    }

    hasNext() {
        return this.items.length !== 0;
    }

    read() {
        const array = [];
        array.push(this.items.pop());
        return array;
    }
}