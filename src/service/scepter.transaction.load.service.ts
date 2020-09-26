import { SpectreUser } from "../pojo/spectre.user";
import { TransactionLoadService } from "./transaction.load.service";
import { Importer } from "../export/importer";
import { ScepterLocation } from "./scepter.location";

export class ScepterTransactionLoadService extends TransactionLoadService {
  constructor(
    scepterUser: SpectreUser,
    location: ScepterLocation,
    importer: Importer
  ) {
    super(scepterUser, location, importer);
  }

  async load() {
      const transactions = 
  }
}
