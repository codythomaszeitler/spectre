import { DateTime } from 'luxon';

export const DATE_TYPE = 'Date';

export class DateConverter {

    fromString(input : string) {

        let jsDate = null;
        if (this.isIsoTimeFormat(input)) {
            const dt = DateTime.fromISO(input);
            jsDate = dt.toJSDate();
        } else {
            const properFormat = input.split('/').join('-'); 
            const dt = DateTime.fromFormat(properFormat, 'MM-dd-yyyy');

            if (!dt.isValid) {
                throw new Error('Could not convert [' + input + '] into a date');
            }

            jsDate = dt.toJSDate();
        }

        return jsDate;
    }

    isIsoTimeFormat(input : string) {
        const dt = DateTime.fromISO(input);
        return dt.isValid;
    }

    intoString(date : Date) {
        const luxonDatetime = DateTime.fromJSDate(date);

        const paddedMonth = this.padToTwo("" + luxonDatetime.month);
        const paddedDay = this.padToTwo("" + luxonDatetime.day);
        const year = luxonDatetime.year;

        return paddedMonth + '/' + paddedDay + '/' + year;
    }

    padToTwo(input : string) {
        if (input.length == 1) {
            input = '0' + input;
        }
        return input;

    }
}