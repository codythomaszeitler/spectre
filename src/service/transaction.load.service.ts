import { SpectreUser } from "../pojo/spectre.user";
import { Importer } from "../export/importer";
import { Location } from "./location";
import { DocumentLoadService } from "./document.load.service";

export class TransactionLoadService {
  spectreUser: SpectreUser;
  location: Location;
  importer: Importer;

  numLinesLoaded : number;

  constructor(
    spectreUser: SpectreUser,
    location: Location,
    importer: Importer
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
    const columns = await loadService.guessColumnsConfig();

    let lines = await loadService.fetchall();

    const transactions = [];
    for (let i = 0; i < lines.length; i++) {
        const transaction = this.importer.convert(lines[i], columns);
        transactions.push(transaction);

        this.spectreUser.readyForCategorization(transaction);
    }

    this.numLinesLoaded = lines.length;

    return transactions;
  }
}
