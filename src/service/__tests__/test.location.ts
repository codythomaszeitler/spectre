import { RawDataLocation} from "../raw.data.location";

export class TestLocation implements RawDataLocation {
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
    const item = this.items.shift();
    if (item) {
      this.parsed.push(item);
    }

    return this.parsed;
  }

  async peek() {
    const copy = [...this.items];

    let peeked = copy.shift();
    if (!peeked) {
      peeked = '';
    } 

    return peeked;
  }

  async write(lines: string[]) {
    this.items.push(...lines);
    this.written = lines;
    return true;
  }
}
