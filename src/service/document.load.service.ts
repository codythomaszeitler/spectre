import { Location } from "./location";

export class DocumentLoadService {
  location: Location;
  lines: string[];

  constructor(location: Location) {
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
