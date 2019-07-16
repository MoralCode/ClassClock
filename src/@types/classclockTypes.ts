export interface School {
    fullName: string;
    shortName: string;
    timeZone: string;
    schedules: Schedule[];
    passingPeriodName: string;
}

export interface Schedule {
    name: string;
    days: number[];
    classes: Period[];
}

export interface Period {
    name: string;
    startTime: Time;
    endTime: Time;
}

export class Time {

    public static fromMilliseconds(milliseconds: number): Time {

        const hours = Math.floor(milliseconds / 1000 / 60 / 60);
        milliseconds -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(milliseconds / 1000 / 60);
        milliseconds -= minutes * 1000 * 60;
        const seconds = Math.floor(milliseconds / 1000);
        milliseconds -= seconds * 1000;

        return new Time(hours, minutes, seconds)
    }

    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor(hours: number, minutes: number, seconds?: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds || 0;
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
        const hoursDiff = this.hours - otherTime.getHours();
        const minutesDiff = this.minutes - otherTime.getMinutes();
        const secondsDiff = this.seconds - otherTime.getSeconds();

        return hoursDiff * 60 * 60 * 1000 + minutesDiff * 60 * 1000 + secondsDiff * 1000;
    }

    public get_valid_time(): Time {
        return new Time(
            this.hours % 24,
            this.minutes % 60,
            this.seconds !== undefined ? this.seconds % 60 : undefined
        );
    }
}
