import { RawDataLocation } from "./raw.data.location";

export class DocumentLoadService {
  location: RawDataLocation;
  lines: string[];

  constructor(location: RawDataLocation) {
    this.location = location;
    this.lines = [];
  }

  clean(lines : string[]) {

    return lines.filter(function(line) {
        return line.trim().length !== 0;
    });
  }

  async fetchall() {
    this.lines = [];
    while (await this.location.hasNext()) {
      const loaded = await this.location.read();
      const cleaned = this.clean(loaded);
      this.lines.push(...cleaned);
    }
    return this.lines;
  }
}
