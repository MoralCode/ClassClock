import { DateTime, Duration } from "luxon";

/**
 * A representation of a Time without an associated date.
 * This is used to simplify the JSON data since the same time ranges for a class
 * often apply to multiple days.
 * 
 * The "standard" way to represent it in serialized/JSON form is as a series of
 * Two or three, colon-separated, two-digit numbers representing a 24-hour time.
 * examples: 09:35:00, 13:30:00, 09:35, 13:30
 * 
 * Times in this standard format should be considered to be in the timezone of
 * the school that they are part of.
 * 
 * A Time object should always represent this standard form of the
 *
 * @export
 * @class Time
 */
export default class Time {

    private duration: Duration;
    
    constructor(duration: Duration) {
        this.duration = duration
    }

    public get hours() {
        return this.duration.hours
    }

    public get minutes() {
        return this.duration.minutes
    }

    public get seconds() {
        return this.duration.seconds
    }

    /**
     * Create a time instance from the number of milliseconds since the beginning of the day.
     *
     * @static
     * @param {number} milliseconds the number of milliseconds since the beginning of the day
     * @returns {Time}
     * @memberof Time
     */
    public static fromMilliseconds(milliseconds: number): Time {
        return new Time(Duration.fromMillis(milliseconds).shiftTo("hours", "minutes", "seconds"));
    }

    //Deprecated
    // public static fromJSDate(date: Date, toLocalTime=false) {
    //     if (toLocalTime) {
    //         return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), 'local');
    //     } else {
    //         return new Time(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 'utc');
    //     }
    // }

    public static fromISO(time: string) {
        return new Time(Duration.fromISO(time))
    }

    /**
     * Create a time instance from the JSON-serialized data produced by `toJSON()`
     * @param time a time value represented as a string in standard format to deserialize to a Time Object 
     * @returns a n instance of Time representing the same time
     */
    public static fromJson(time: string) {
        const parts = time.split(":");
        if (parts.length < 2 || parts.length > 3) {
            //TODO: error here
        }
        return Time.fromTime(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10),
            parts.length === 3 ? parseInt(parts[2], 10) : undefined
        );
    }

    public static fromString(time: string) {
        // const smalltime = DateTime.fromFormat(time, "H:mm")
        // const bigtime = DateTime.fromISO(time)
        // if (smalltime.isValid) {
        //     return Time.fromDateTime(smalltime)// .toUTC()
        // } else if (bigtime.isValid) {
        //     return Time.fromDateTime(bigtime)// .toUTC()
        // }

        const parts = time.split(":");
        if (parts.length < 2 || parts.length > 3) {
            //TODO: error here
        }
        return Time.fromTime(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10),
            parts.length === 3 ? parseInt(parts[2], 10) : undefined
        );
    }

    /**
     * Create a Time from the time portion of the given DateTime 
     * @param time the DateTime
     * @returns a Time object
     */
    public static fromDateTime(time: DateTime, schoolTimezone: string) {
        time = time.setZone(schoolTimezone)

        return new Time(time.diff(time.startOf('day')).shiftTo("hours", "minutes", "seconds"))
    }

    public static fromTime(hours: number, minutes: number, seconds?: number): Time {
        // super()
        // why do we need timezone,
        //is storing the time as a DateTime internally just super overkill?
        // probably to allow conversion later?
        let timeObj = {
            hour: Math.abs((hours || 0) % 24),
            minute: Math.abs((minutes || 0) % 60),
            second: Math.abs((seconds || 0) % 60)
        }
        return new Time(Duration.fromObject(timeObj).shiftTo("hours", "minutes", "seconds"))
    }

    public getMillisecondsTo(otherTime: Time): number {        
        return otherTime.duration.minus(this.duration).toMillis()
    }

    public isBefore(time:Time): boolean {
        return this.duration < time.duration
    }

    public isAfter(time: Time): boolean {
        return this.duration > time.duration
    }

    public isEqualTo(time: Time): boolean {
        return this.duration == time.duration
    }

    public getTimeDeltaTo(otherTime: Time): Time {
        return Time.fromMilliseconds(Math.abs(this.getMillisecondsTo(otherTime)??0));
    }

    public toString(excludeSeconds = false, use24HourTime = true) {
        const seconds = excludeSeconds ? "" : ":ss"
        const format = "hh:mm" + seconds
        let meridiem = ""
        let duration = this.duration
        
        if (!use24HourTime && duration.hours > 12) {
            duration = duration.minus(Duration.fromObject({ hours: 12 }))
            meridiem = "PM"
        } else {
            meridiem = "AM"
        }

        return duration.toFormat(format) + ((use24HourTime)? "" : " " + meridiem);
    }

    /**
     * Convert this datetime into a formatted string.
     * Leaving values at the defaults should generate a "standard" string with
     * three parts
     * @param excludeSeconds whether to exclude the seconds values, default false.
     * @param use24HourTime whether to use 24 hour time or 12 hour time. Default true.
     * @returns a string representing the current time
     */
    public getFormattedString(excludeSeconds = false, use24HourTime = false) {
        return this.toString(excludeSeconds, use24HourTime)
    }

    /** 
     * Returns the standard HH:mm:ss representation of a time object as a string for serializing.
     * 
     * this overrides the automatic serialization of Time Objects and makes them return a string and not a plain object (which is more annoying to parse back in and would require an extra factory method)
     */
    public toJSON(): string {
        return this.duration.toFormat("hh:mm:ss");
    }

    /**
     * take this time interval and add it onto a concrete date time
     * @param date the DateTime to add this time interval too
     * @returns a new DateTime representing the input time plus the duration represented by this time.
     */
    public onto(date: DateTime): DateTime {
        return date.plus(this.duration)
    }
}
