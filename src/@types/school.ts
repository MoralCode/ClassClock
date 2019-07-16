import { checkTimeRange } from "../utils/helpers";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import BellSchedule from "./bellschedule";

export default class School {
    private fullName: string;
    private acronym: string;
    private timeZone: string;
    private schedules: BellSchedule[];
    private passingPeriodName: string;
    private lastUpdatedDate: Date;

    constructor(
        fullName: string,
        acronym: string,
        timeZone: string,
        schedules: BellSchedule[],
        passingPeriodName: string,
        lastUpdatedDate: Date
    ) {
        this.fullName = fullName;
        this.acronym = acronym;
        this.timeZone = timeZone;
        this.schedules = schedules;
        this.passingPeriodName = passingPeriodName;
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public getSchedules() {
        return this.schedules;
    }
    public getName() {
        return this.fullName;
    }
    public getAcronym() {
        return this.acronym;
    }
    public getPassingTimeName() {
        return this.passingPeriodName;
    }
    public getTimezone() {
        return this.timeZone;
    }

    public lastUpdated() {
        return this.lastUpdated;
    }
    //can also be used as isNoSchoolDay() by checking for undefined
    public getScheduleForDate(date: Date) {
        for (const schedule in this.schedules) {
            if (this.schedules.hasOwnProperty(schedule)) {
                if (schedule.dates.includes(date)) {
                    return schedule;
                }
            }
        }
    }

    public isInSession(date: Date) {
        const currentTime = Time.fromDate(date);
        const currentSchedule = this.getScheduleForDate(date);

        if (currentSchedule === undefined) {
            return undefined;
        }
        return (
            checkTimeRange(
                currentTime,
                currentSchedule.classes[0].startTime,
                currentSchedule.classes[currentSchedule.classes.length - 1].endTime
            ) === TimeComparisons.IS_DURING_OR_EXACTLY
        );
    }
}
