import FileSaver from 'file-saver';


export class DocumentSaveService {

    writer : FileWriter;

    constructor(writer? : FileWriter) {
        if (!writer) {
            this.writer = new DownloadIntoBrowser();
        } else {
            this.writer = writer;
        }
    }

    async save(name : string, contents : string) {
        var file = new File([contents], name, {type: "text/plain;charset=utf-8"});
        await this.writer.write(file);
    }
}

class DownloadIntoBrowser implements FileWriter {
    async write(file : File) {
        await FileSaver.saveAs(file);
    }
}

export interface FileWriter {
    write : (file : File) => void;
}