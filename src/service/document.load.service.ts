

export class DocumentLoadService {

    location : Location;
    lines : string[];

    constructor(location : Location) {
        this.location = location;
        this.lines = [];
    }

    async fetchall() {
        this.lines = [];
        while (await this.location.hasNext()) {
            this.lines.push(...await this.location.read());
        }
        return this.lines;
    }
}

export interface Location {
    hasNext : () => Promise<boolean>;
    read : () => Promise<string[]>;
}