import { RawDataLocation } from "./raw.data.location";
import FileSaver from "file-saver";
import { readCsv, split } from "../export/csv.line.splitter";

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

  getFileName() {
    return this.file.name;
  }

  async isEmpty() {
    const contents = await this.readFile(this.file);
    // @ts-ignore
    return contents.trim().length === 0;
  }

  async hasNext() {
    this.lines = await this.readFileAsArray(this.file);
    return this.wasRead;
  }

  async peek() {
    await this.readFileAsArray(this.file);
    // @ts-ignore
    return split(this.lines[0]).join();
  }

  async read() {
    const lines = await this.readFileAsArray(this.file);

    this.wasRead = false;
    return lines.slice(0);
  }

  async readFileAsArray(file: File) {
    if (this.lines.length !== 0) {
      return this.lines;
    }

    const contents = await this.readFile(file);
    // @ts-ignore
    const lines = readCsv(contents);

    this.lines = lines;
    return lines;
  }

  readFile(file: File) {
    this.startedReadingFile = true;
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        // @ts-ignore
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
