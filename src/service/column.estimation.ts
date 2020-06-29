import { Location } from "../service/location";
import { Columns } from "../export/columns";

export class ColumnEstimation {

  async estimate(location : Location) {
    if (!location) {
      throw new Error('Cannot create estimation without a location');
    }

    const header = await location.peek();
    if (header.trim().length === 0) {
      throw new Error(
        "Location returned an empty line during a peek, cannot parse column from an empty string"
      );
    }

    const headerSegments = header.split(",");

    let config: Object = {};
    for (let i = 0; i < headerSegments.length; i++) {
      config[i] = {
        name: "column" + i,
        type: "string",
      };
    }
    return new Columns(config);
  }
}
