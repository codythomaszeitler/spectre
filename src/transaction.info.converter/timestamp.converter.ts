
export class TimestampConverter {
    toString(timestamp) {
        return timestamp.getYear() + ' ' + timestamp.getMonth() + ' ' + timestamp.getDay();
    }
}