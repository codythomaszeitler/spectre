import { RawDataLocation } from "./scepter.location";

export class DocumentSaveService {

    location : RawDataLocation;

    constructor(location : RawDataLocation) {
        this.location = location;
    }

    async save(contents : string[]) {
        await this.location.write(contents);
    }
}
