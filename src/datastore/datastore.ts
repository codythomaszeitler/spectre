export class DataStore {
    set(global) {
        this.global = global;
    }

    get() {
        return this.global;
    }
}

const singleton = new DataStore();
export function datastore() {
    return singleton;
}