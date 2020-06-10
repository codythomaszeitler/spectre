import { Location } from "../location";

export class TestLocation implements Location {
  items: string[];
  parsed: string[];
  written: string[];

  constructor(items: string[]) {
    this.items = items.slice();
    this.parsed = [];
    this.written = [];
  }

  async hasNext() {
    return this.items.length !== 0;
  }

  async read() {
    this.parsed = [];
    const item = this.items.pop();
    if (item) {
      this.parsed.push(item);
    }

    return this.parsed;
  }

  async write(lines: string[]) {
    this.written = lines;
    return true;
  }
}
