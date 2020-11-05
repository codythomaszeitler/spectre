import { SpectreUser } from "../pojo/spectre.user";
import { ViewContext } from "../screens/view.context";
import { ColumnEstimation } from "./column.estimation";
import { RawDataLocation } from "./raw.data.location";

export interface TransactionLoader {
  canLoad: (location: RawDataLocation) => Promise<CanLoadResult>;
  load: (
    scepterUser: SpectreUser,
    location: RawDataLocation
  ) => Promise<ViewContext>;
}

export const getMissingHeaders = async (
  location: RawDataLocation,
  headers: Array<string>
) => {
  const columnEstimation = new ColumnEstimation();
  const columns = await columnEstimation.estimateByLocation(location);

  const isMissingColumnHeader = (header: string) => {
    let isMissingColumnHeader = true;
    for (let i = 0; i < columns.getNumColumns(); i++) {
      if (columns.getName(i) === header) {
        isMissingColumnHeader = false;
        break;
      }
    }
    return isMissingColumnHeader;
  };

  const missingColumnHeaders = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];

    if (isMissingColumnHeader(header)) {
      missingColumnHeaders.push(header);
    }
  }
  return missingColumnHeaders;
};

export class CanLoadResult {
  canLoad: boolean;
  errorMessage: string;
  missingHeaders : Array<string>;

  constructor(canLoad: boolean, errorMessage: string, missingHeaders : Array<string>) {
    this.canLoad = canLoad;
    this.errorMessage = errorMessage;
    this.missingHeaders = missingHeaders.slice();
  }

  static generate(missing: Array<string>) {
    const canLoad = missing.length === 0;

    let errorMessage = "";
    if (!canLoad) {
      errorMessage =
        "Location did not have headers: [" + missing.join(",") + "]";
    }

    return new CanLoadResult(canLoad, errorMessage, missing);
  }
}
