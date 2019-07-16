import Time from "./time";

export interface ISchedule {
    name: string;
    days: number[];
    classes: IPeriod[];
}

export interface IPeriod {
    name: string;
    startTime: Time;
    endTime: Time;
}
