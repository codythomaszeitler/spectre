import { Location } from "./location";
import FileSaver from "file-saver";

export class LocalFileLocation implements Location {
  file: File;
  lines: string[];
  wasRead: boolean;
  startedReadingFile: boolean;

  constructor(file: File) {
    this.file = file;
    this.lines = [];
    this.startedReadingFile = false;
    this.wasRead = true;
  }

  async hasNext() {
    if (!this.startedReadingFile) {
      const contents = await this.readFile(this.file);
      this.lines = contents.split("\n");
    }

    return this.wasRead;
  }

  async peek() {
    const contents = await this.readFile(this.file);
    this.lines = contents.split("\n");
    return this.lines[0];
  }

  async read() {
    if (!this.startedReadingFile) {
      const contents = await this.readFile(this.file);
      this.lines = contents.split("\n");
    }

    this.wasRead = false;
    return this.lines.slice(1);
  }

  readFile(file: File) {
    this.startedReadingFile = true;
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsText(file);
    });
  }

  async write(lines: string[]) {
    var file = new File(lines, this.file.name, { type: "text/plain;charset=utf-8" });
    await FileSaver.saveAs(file);

    return true;
  }
}
