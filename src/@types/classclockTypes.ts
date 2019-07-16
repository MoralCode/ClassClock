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
    private hours: number;
    private minutes: number;
    private seconds?: number;

    constructor(hours: number, minutes: number, seconds?: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
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

    public get_valid_time(): Time {
        return new Time(
            this.hours % 24,
            this.minutes % 60,
            this.seconds !== undefined ? this.seconds % 60 : undefined
        );
    }
}
