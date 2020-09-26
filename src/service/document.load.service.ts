import { ScepterLocation } from "./scepter.location";

export class DocumentLoadService {
  location: ScepterLocation;
  lines: string[];

  constructor(location: ScepterLocation) {
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
