import { RawDataLocation } from "./raw.data.location";

export class DocumentSaveService {

    location : RawDataLocation;

    constructor(location : RawDataLocation) {
        this.location = location;
    }

    async save(contents : string[]) {
        await this.location.write(contents);
    }
}
