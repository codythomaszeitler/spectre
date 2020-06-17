import { Location } from "./location";
import { Columns } from "../export/columns";

export class DocumentLoadService {
  location: Location;
  lines: string[];

  constructor(location: Location) {
    this.location = location;
    this.lines = [];
  }

  async guessColumnsConfig() {
    const header = await this.peekone();
    const headerSegments = header.split(",");

    let config : Object = {};
    for (let i = 0; i < headerSegments.length; i++) {
      config[i] = {
        name: "column" + i,
        type: "string"
      };
    }
    return new Columns(config);
  }

  async peekone() {
    const lines = await this.location.peek();
    return await lines;
  }

  async fetchall() {
    this.lines = [];
    while (await this.location.hasNext()) {
      this.lines.push(...(await this.location.read()));
    }
    return this.lines;
  }
}
