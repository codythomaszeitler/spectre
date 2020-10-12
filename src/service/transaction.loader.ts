import { SpectreUser } from "../pojo/spectre.user";
import { ViewContext } from "../screens/view.context";
import { RawDataLocation } from "./raw.data.location";

export interface TransactionLoader {
    load: (scepterUser : SpectreUser, location : RawDataLocation) => Promise<ViewContext>;
}