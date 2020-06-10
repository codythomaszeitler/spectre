import { Location } from "./location";

export class DocumentSaveService {

    location : Location;

    constructor(location : Location) {
        this.location = location;
    }

    async save(contents : string[]) {
        await this.location.write(contents);
    }
}
