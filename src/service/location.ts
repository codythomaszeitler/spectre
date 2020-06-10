export interface Location {
    hasNext: () => Promise<boolean>;
    read: () => Promise<string[]>;
    write: (lines : string[]) => Promise<boolean>;
}
