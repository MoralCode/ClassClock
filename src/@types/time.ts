export default class Time {
    public static fromMilliseconds(milliseconds: number): Time {
        const hours = Math.floor(milliseconds / 1000 / 60 / 60);
        milliseconds -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(milliseconds / 1000 / 60);
        milliseconds -= minutes * 1000 * 60;
        const seconds = Math.floor(milliseconds / 1000);
        milliseconds -= seconds * 1000;

        return new Time(hours, minutes, seconds);
    }

    public static fromDate(date: Date, toLocalTime=false) {
        if (toLocalTime) {
            return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
        } else {
            return new Time(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }
    }

    public static fromString(time: string) {
        const parts = time.split(":");
        if (parts.length < 2 || parts.length > 3) {
            //error
        }
        return new Time(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10),
            parts.length === 3 ? parseInt(parts[2], 10) : undefined
        );
    }

    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor(hours: number, minutes: number, seconds?: number) {
        this.hours = Math.abs(hours % 24);
        this.minutes = Math.abs(minutes % 60);
        this.seconds = Math.abs((seconds || 0 )% 60);
    }

    public getHours() {
        return this.hours;
    }
    public getMinutes() {
        return this.minutes;
    }
    public getSeconds() {
        return this.seconds;
    }
    public getMillisecondsTo(otherTime: Time) {
        const hoursDiff = otherTime.getHours() - this.hours;
        const minutesDiff = otherTime.getMinutes() - this.minutes;
        const secondsDiff = otherTime.getSeconds() - this.seconds;

        return hoursDiff * 60 * 60 * 1000 + minutesDiff * 60 * 1000 + secondsDiff * 1000;
    }
    public getTimeDeltaTo(otherTime: Time) {
        return Time.fromMilliseconds(Math.abs(this.getMillisecondsTo(otherTime)));
    }
    public toString(excludeSeconds = false, use24HourTime = true) {
        const hours = use24HourTime ? this.hours: this.hours % 12;


        let stringified =
            hours.toString().padStart(2, "0") +
            ":" +
            this.minutes.toString().padStart(2, "0");

        if (!excludeSeconds) {
            stringified += ":" + this.seconds.toString().padStart(2, "0");
        }

        return stringified;
    }

    public isAM() {
        return this.hours < 12 && this.minutes < 60 && this.seconds < 60;
    }

    public getFormattedString(excludeSeconds = false, use24HourTime = false) {
        const ending = this.isAM() ? " AM" : " PM";
        return this.toString(excludeSeconds, use24HourTime) + (use24HourTime ? "" : ending);
    }

    //this overrides the automatic serialization of Time Objects and makes them return a string and not a plain object (which is more annoying to parse back in and rwould require an extra factory method)
    public toJSON() {
        return this.toString();
    }
}
