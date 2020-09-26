import { ScepterLocation } from "./scepter.location";

export class DocumentSaveService {

    location : ScepterLocation;

    constructor(location : ScepterLocation) {
        this.location = location;
    }

    async save(contents : string[]) {
        await this.location.write(contents);
    }
}
