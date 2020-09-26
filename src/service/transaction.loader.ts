import { SpectreUser } from "../pojo/spectre.user";
import { RawDataLocation } from "./raw.data.location";

export interface TransactionLoader {
    load: (scepterUser : SpectreUser, location : RawDataLocation) => Promise<void>;
}