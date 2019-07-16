import { ISchedule } from "./interfaces";

export default class School {
    fullName: string;
    shortName: string;
    timeZone: string;
    schedules: ISchedule[];
    passingPeriodName: string;
}
