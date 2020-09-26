import { SpectreUser } from "../pojo/spectre.user";
import { TransactionLoadService } from "./transaction.load.service";
import { Importer } from "../export/importer";
import { Location } from "./location";

export class ScepterTransactionLoadService extends TransactionLoadService {
  constructor(
    scepterUser: SpectreUser,
    location: Location,
    importer: Importer
  ) {
    super(scepterUser, location, importer);
  }

  async load() {
      const transactions = 
  }
}
