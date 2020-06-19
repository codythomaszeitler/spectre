import { SpectreUser } from "../pojo/spectre.user";
import { Importer } from "../export/importer";
import { Location } from "./location";
import { DocumentLoadService } from "./document.load.service";
import { Columns } from "../export/columns";

export class TransactionLoadService {
  spectreUser: SpectreUser;
  location: Location;
  importer: Importer;
  columns : Columns;

  numLinesLoaded : number;

  constructor(
    spectreUser: SpectreUser,
    location: Location,
    importer: Importer,
  ) {
    this.spectreUser = spectreUser;
    this.location = location;
    this.importer = importer;
    this.numLinesLoaded = 0;
  }

  getNumLinesLoaded() {
    return this.numLinesLoaded;
  }

  async load() {
    const loadService = new DocumentLoadService(this.location);

    const before = this.spectreUser.getUncategorized().length;
    let lines = await loadService.fetchall();

    const transactions = [];
    for (let i = 0; i < lines.length; i++) {
        const transaction = this.importer.convert(lines[i]);
        transactions.push(transaction);

        this.spectreUser.readyForCategorization(transaction);
    }

    this.numLinesLoaded = this.spectreUser.getUncategorized().length - before;

    return transactions;
  }
}
