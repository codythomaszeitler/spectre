import { SpectreUser } from "../pojo/spectre.user";
import { ScepterLocation } from "./scepter.location";

export interface TransactionLoader {
    load: (scepterUser : SpectreUser, location : ScepterLocation) => Promise<void>;
}