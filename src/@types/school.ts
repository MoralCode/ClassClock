import { checkTimeRange } from "../utils/helpers";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import BellSchedule from "./bellschedule";

export default class School {
    public static fromJsonApi(json: any) {
        return new School(
            json.id,
            json.attributes.full_name,
            json.attributes.acronym,
            json.links.self,
            "LA",
            json.attributes.schedules
                ? [
                      json.attributes.schedules.map((schedule: any) =>
                          BellSchedule.fromJsonApi(schedule)
                      )
                  ]
                : undefined,
            json.attributes.alternate_freeperiod_name,
            json.attributes.creation_date,
            json.attributes.last_modified
        );
    }

    public static fromState(json: any) {
        return new School(
            json.id,
            json.fullName,
            json.acronym,
            json.endpoint,
            json.timezone,
            json.schedules,
            json.passingPeriodName,
            json.creationDate,
            json.lastUpdatedDate
        );
    }
    private id: string;
    private endpoint?: string;
    private fullName: string;
    private acronym: string;
    private timeZone?: string;
    private schedules?: BellSchedule[];
    private passingPeriodName?: string;
    private creationDate?: Date;
    private lastUpdatedDate?: Date;

    constructor(
        id: string,
        fullName: string,
        acronym: string,
        endpoint: string,
        timeZone?: string,
        schedules?: BellSchedule[],
        passingPeriodName?: string,
        creationDate?: Date,
        lastUpdatedDate?: Date
    ) {
        this.id = id;
        this.endpoint = endpoint;
        this.fullName = fullName;
        this.acronym = acronym;
        this.timeZone = timeZone;
        this.schedules = schedules;
        this.passingPeriodName = passingPeriodName;
        this.creationDate = creationDate;
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public getIdentifier(): string {
        return this.id;
    }

    public getEndpoint() {
        return this.endpoint;
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

    public getCreationDate() {
        return this.creationDate;
    }

    public lastUpdated() {
        return this.lastUpdated;
    }

    public hasChangedSince(date: Date) {
        if (this.lastUpdatedDate !== undefined) {
            return date.getTime() - this.lastUpdatedDate.getTime() > 0;
        } else {
            return undefined;
        }
    }

    //can also be used as isNoSchoolDay() by checking for undefined
    public getScheduleForDate(date: Date) {
        if (this.schedules !== undefined) {
            for (const schedule of this.schedules) {
                if (schedule.getDates().includes(date)) {
                    return schedule;
                }
            }
        } else {
            return undefined;
        }
    }

    public hasSchedules() {
        return this.schedules !== undefined;
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
                currentSchedule.getAllClasses()[0].getStartTime(),
                currentSchedule
                    .getAllClasses()
                    [currentSchedule.numberOfClasses()].getEndTime()
            ) === TimeComparisons.IS_DURING_OR_EXACTLY
        );
    }
}
