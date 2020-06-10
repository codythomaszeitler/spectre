import {Location} from './document.load.service';

export class LocalFileLocation implements Location {

    file : File;
    lines : string[];
    wasRead : boolean;
    startedReadingFile : boolean;
    currentLocation : number;

    constructor(file : File) {
        this.file = file;
        this.lines = [];
        this.startedReadingFile = false;
        this.currentLocation = 0;
        this.wasRead = false;
    }

    async hasNext() {
        if (!this.startedReadingFile) {
            const contents = await this.readFile(this.file);
            this.lines = contents.split('\n');
        }

        return this.wasRead;
    }

    async read() {
        if (!this.startedReadingFile) {
            const contents = await this.readFile(this.file);
            this.lines = contents.split('\n');
        }

        this.wasRead = true;
        return this.lines;
    }

    readFile(file : File) {
        this.startedReadingFile = true;
        return new Promise<string[]>((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = res => {
            resolve(res.target.result);
          };
          reader.onerror = err => reject(err);
      
          reader.readAsText(file);
        });
      }
}