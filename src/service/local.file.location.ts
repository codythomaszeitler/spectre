import {Location} from './document.load.service';

export class LocalFileLocation implements Location {

    file : File;
    lines : string[];
    startedReadingFile : boolean;
    currentLocation : number;

    constructor(file : File) {
        this.file = file;
        this.lines = [];
        this.startedReadingFile = false;
        this.currentLocation = 0;
    }

    async hasNext() {
        if (!this.startedReadingFile) {
            this.lines = await this.readFile(this.file);
        }

        return this.lines.length !== (this.currentLocation - 1);
    }

    async read() {
        if (!this.startedReadingFile) {
            this.lines = await this.readFile(this.file);
        }

        this.currentLocation = this.lines.length - 1;
        return this.lines.slice(); 
    }

    readFile(file : File) {
        this.startedReadingFile = true;
        return new Promise<string[]>((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = res => {
              console.log(res);
            resolve(res.target.result);
          };
          reader.onerror = err => reject(err);
      
          reader.readAsText(file);
        });
      }
}