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

export interface Time {
    hours: number;
    minutes: number;
    seconds?: number;
}
