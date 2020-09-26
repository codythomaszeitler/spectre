export interface RawDataLocation {
    hasNext: () => Promise<boolean>;
    read: () => Promise<string[]>;
    write: (lines : string[]) => Promise<boolean>;
    peek: () => Promise<string>;
}
