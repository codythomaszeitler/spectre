import { Timestamp } from "../pojo/timestamp";

export class TimestampConverter {
    toString(timestamp : Timestamp) {
        return timestamp.getYear() + ' ' + timestamp.getMonth() + ' ' + timestamp.getDay();
    }

    fromString(string : string) {
        return new Timestamp(2010, 1, 1);
    }
}