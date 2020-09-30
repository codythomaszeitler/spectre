import { RawDataLocation } from "./raw.data.location";
import FileSaver from "file-saver";
import { readString } from 'react-papaparse'


export class LocalFileLocation implements RawDataLocation {
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

  async isEmpty() {
    const contents = await this.readFile(this.file);
    return contents.trim().length === 0;
  }

  async hasNext() {
    this.lines = await this.readFileAsArray(this.file);
    return this.wasRead;
  }

  async peek() {
    await this.readFileAsArray(this.file);
    return this.lines[0];
  }

  async read() {
    const lines = await this.readFileAsArray(this.file);

    this.wasRead = false;
    return lines.slice(0);
  }

  async readFileAsArray(file : File) {
    if (this.lines.length !== 0) {
      return this.lines;
    }

    const lines = [];
    const contents = await this.readFile(file);
    const asPapaParse = readString(contents);
    for (let i = 0; i < asPapaParse.data.length; i++) {
      const papaParseArray = asPapaParse.data[i];
      const line = papaParseArray.join();
      lines.push(line);
    }

    this.lines = lines;
    return lines;
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
