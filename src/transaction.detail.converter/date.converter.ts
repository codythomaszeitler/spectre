import { DateTime } from "luxon";

export const DATE_TYPE = "Date";

export class DateConverter {
  fromString(input: string) {
    console.log(input);
    if (!input || input.trim().length === 0) {
      console.log('we got into here in date converter');
      return new Date(1970, 0, 1, 0, 0, 0, 0);
    }

    let jsDate = null;
    if (this.isIsoTimeFormat(input)) {
      const dt = DateTime.fromISO(input);
      jsDate = dt.toJSDate();
    } else {
      const properFormat = input.split("/").join("-");
      const dt = DateTime.fromFormat(properFormat, "M-d-y H:m:s");

      if (!dt.isValid) {
        const longerDt = DateTime.fromFormat(properFormat, "M-d-y tt");
        if (!longerDt.isValid) {
          const shorterDt = DateTime.fromFormat(properFormat, "M-d-y");

          if (!shorterDt.isValid) {
            throw new Error("Could not convert [" + input + "] into a date");
          } else {
            jsDate = shorterDt.toJSDate();
          }
        } else {
          jsDate = longerDt.toJSDate();
        }
      } else {
          jsDate = dt.toJSDate();
      }
    }

    return jsDate;
  }

  isIsoTimeFormat(input: string) {
    const dt = DateTime.fromISO(input);
    return dt.isValid;
  }

  intoString(date: Date) {
    const luxonDatetime = DateTime.fromJSDate(date);

    const paddedMonth = this.padToTwo("" + luxonDatetime.month);
    const paddedDay = this.padToTwo("" + luxonDatetime.day);
    const year = luxonDatetime.year;

    const paddedHours = this.padToTwo("" + luxonDatetime.hour);
    const paddedMinutes = this.padToTwo("" + luxonDatetime.minute);
    const paddedSeconds = this.padToTwo("" + luxonDatetime.second);

    return (
      paddedMonth +
      "/" +
      paddedDay +
      "/" +
      year +
      " " +
      paddedHours +
      ":" +
      paddedMinutes +
      ":" +
      paddedSeconds
    );
  }

  padToTwo(input: string) {
    if (input.length == 1) {
      input = "0" + input;
    }
    return input;
  }
}
