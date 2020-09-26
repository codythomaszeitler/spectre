import { SpectreUser } from "../pojo/spectre.user";

export interface TransactionLoader {
    load: (scepterUser : SpectreUser, location : Location) => Promise<void>;
}