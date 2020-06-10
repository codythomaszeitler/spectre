import { DocumentSaveService, FileWriter } from "../document.save.service";

describe('Document Save Service', () => {

    it('should be able to write the filename and contents to a file', async () => {
        let written : File = new File([], '');
        const writer : FileWriter = {
            async write(file : File) {
                written = file;
            }
        };

        const testString = 'Hi! This is a test!';

        const testObject = new DocumentSaveService(writer);
        await testObject.save('testfile.txt', testString);

        expect(written.name).toBe('testfile.txt');
        expect(written.size).toBe(testString.length);
    });
}); 