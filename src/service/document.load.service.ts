

export class DocumentLoadService {

    location : Location;

    constructor(location : Location) {
        this.location = location;
    }

    async fetchall() {
        objects = [];
        while (this.location.hasNext()) {
            objects.push(...this.location.read());
        }
        return objects;
    }
}

export interface Location {
    hasNext : () => boolean;
    read : () => [];
}