describe('Document Load Service', () => {
    it('should be able to load a file from a filesystem', () => {

        const location : Location = new LocalFileLocation('filepath.txt');

        const testObject = new DocumentLoadService(location);
        const data = testObject.fetchall();
    });
});