import {DateTime} from "luxon";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
Object.freeze(months);

export class Timestamp {
  constructor(year, month, day, hour=0, minute=0, second=0, millisecond=0) {
    if (!year) {
      throw new Error("Cannot create a timestamp without a year");
    }

    if (month === undefined || month === null) {
      throw new Error("Cannot create a timestamp without a month");
    }

    month = this.parseMonthFromInteger(month);

    if (!months.includes(this.properlyCapitalizeMonth(month))) {
      throw new Error("The given month [" + month + "] is not a real month");
    }

    if (!day) {
      throw new Error("Cannot create a timestamp without a day");
    }

    this.year = year;
    this.month = this.properlyCapitalizeMonth(month);
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;
  }

  parseMonthFromInteger(monthIndex) {
    if (typeof monthIndex === "string") {
      return monthIndex;
    }

    if (monthIndex < 1 || monthIndex > 12) {
      throw new Error(
        "The given month index [" + monthIndex + "] is not within [1-12]"
      );
    }

    monthIndex--;

    return months[monthIndex];
  }

  toString() {
    const luxonDateTime = DateTime.fromJSDate(this.toDate());
    return luxonDateTime.toString();
  }

  equals(object) {
    if (!object) {
      return false;
    }

    const areYearsEqual = this.getYear() === object.getYear();
    const areMonthsEqual = this.getMonth() === object.getMonth();
    const areDaysEqual = this.getDay() === object.getDay();
    const areHoursEqual = this.getHour() === object.getHour();
    const areMinutesEqual = this.getMinute() === object.getMinute();
    const areSecondsEqual = this.getSecond() === object.getSecond();
    const areMillisecondsEqual = this.getMillisecond() === object.getMillisecond();

    return (
      areYearsEqual &&
      areMonthsEqual &&
      areDaysEqual &&
      areHoursEqual &&
      areMinutesEqual &&
      areSecondsEqual &&
      areMillisecondsEqual
    );
  }

  startOfDay() {
    return new Timestamp(this.year, this.month, this.day);
  }

  endOfDay() {
    return new Timestamp(this.year, this.month, this.day, 23, 59, 59, 999);
  }

  copy() {
    return new Timestamp(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }

  properlyCapitalizeMonth(month) {
    const capitalizeFirstLetter = s => {
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let lowercase = month.toLowerCase();
    return capitalizeFirstLetter(lowercase);
  }

  getYear() {
    return this.year;
  }

  getMonth() {
    return this.month;
  }

  getDay() {
    return this.day;
  }

  getHour() {
    return this.hour;
  }

  getMinute() {
    return this.minute;
  }

  getSecond() {
    return this.second;
  }
  
  getMillisecond() {
    return this.millisecond;
  }

  isBefore(comparison) {
    const thisDate = this.toDate();
    const comparisonDate = comparison.toDate();

    return thisDate.getTime() <= comparisonDate.getTime();
  }

  isAfter(comparison) {
    const thisDate = this.toDate();
    const comparisonDate = comparison.toDate();

    return thisDate.getTime() >= comparisonDate.getTime();
  }

  static fromDate(date) {
    return new Timestamp(
      date.getFullYear(),
      months[date.getMonth()],
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  toDate() {
    return new Date(
      this.year,
      this.getMonthIndex(this.month),
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond
    );
  }

  getMonthIndex(month) {
    return months.indexOf(month);
  }

  getPreviousDayOfWeek(dayOfWeek) {
    let current = DateTime.fromJSDate(this.toDate());

    while (current.weekdayLong !== dayOfWeek) {
      current = current.minus({
        days : 1
      });
      if (current.weekdayLong === dayOfWeek) {
        break;
      }
    }

    const timestamp = Timestamp.fromDate(current.toJSDate());
    timestamp.hour = 0;
    timestamp.minute = 0;
    timestamp.second = 0;
    timestamp.millisecond = 0;
    return timestamp;
  }

  static today() {
    const todayAsDate = new Date();

    const timestamp = new Timestamp(
      todayAsDate.getFullYear(),
      months[todayAsDate.getMonth()],
      todayAsDate.getDate(),
      todayAsDate.getHours(),
      todayAsDate.getMinutes(),
      todayAsDate.getSeconds(),
      todayAsDate.getMilliseconds()
    );

    return timestamp;
  }
}
