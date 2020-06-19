import { Location } from "./location";
import { Columns } from "../export/columns";

export class DocumentLoadService {
  location: Location;
  lines: string[];

  constructor(location: Location) {
    this.location = location;
    this.lines = [];
  }

  async fetchall() {
    this.lines = [];
    while (await this.location.hasNext()) {
      this.lines.push(...(await this.location.read()));
    }
    return this.lines;
  }
}
