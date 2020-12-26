import {
    checkTimeRange,
    getValueIfKeyInList,
    sortClassesByStartTime
} from "../utils/helpers";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import BellSchedule from "./bellschedule";
import find from 'lodash.find'

export default class School {
    public static fromJson(json: any) {
        const schedules = getValueIfKeyInList(["schedules"], json);
        return new School(
            getValueIfKeyInList(["id", "identifier"], json),
            getValueIfKeyInList(["ownerId", "owner_id"], json),
            getValueIfKeyInList(["name", "fullName", "full_name"], json),
            getValueIfKeyInList(["acronym"], json),
            getValueIfKeyInList(["endpoint"], json),
            getValueIfKeyInList(["timezone"], json),
            schedules
                ? schedules.map((schedule: any) => BellSchedule.fromJson(schedule))
                : undefined,
            getValueIfKeyInList(["alternate_freeperiod_name", "passingPeriodName"], json),
            getValueIfKeyInList(["creation_date", "creationDate"], json),
            getValueIfKeyInList(["last_modified", "lastModified"], json)
        );
    }

    private id: string;
    private ownerId: string;
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
        ownerId: string,
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
        this.ownerId = ownerId;
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

    public getOwnerIdentifier(): string {
        return this.ownerId;
    }

    public getEndpoint() {
        return this.endpoint;
    }

    public getSchedules() {
        return this.schedules;
    }

    public getSchedule(id: string) {
        if (!this.schedules){
            return
        } else {
            return find(this.schedules, schedule => { return schedule.getIdentifier() === id; });
        }
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
        return this.lastUpdatedDate;
    }

    public hasChangedSince(date: Date) {
        if (this.lastUpdatedDate !== undefined) {
            return date.getTime() < this.lastUpdatedDate.getTime();
        } else {
            return undefined;
        }
    }

    //can also be used as isNoSchoolDay() by checking for undefined
    public getScheduleForDate(date: Date) {
        if (this.schedules) {
            for (const schedule of this.schedules) {
                if (
                    schedule
                        .getDates()
                        .map((d: Date) => d.toDateString())
                        .includes(date.toDateString())
                ) {
                    return schedule;
                }
            }
            return null; //no schedule today
        }
        return; // no schedules defined
    }

    //remove
    public hasSchedules() {
        return this.schedules !== undefined && this.schedules.length > 0;
    }

    //change input to a time
    //seems like te current schedule depends on this
    public isInSession(date: Date, toLocalTime = false) {
        const currentTime = Time.fromDate(date, toLocalTime);
        const currentSchedule = this.getScheduleForDate(date);
        if (!currentSchedule) {
            return false;
        }

        const sortedClasses = sortClassesByStartTime(currentSchedule.getAllClasses())
        const firstClass = sortedClasses[0]
        const lastClass = sortedClasses[currentSchedule.numberOfClasses()]
        return (
            checkTimeRange(
                currentTime,
                firstClass.getStartTime(),
                lastClass.getEndTime()
            ) == TimeComparisons.IS_DURING_OR_EXACTLY
        );
    }
}
