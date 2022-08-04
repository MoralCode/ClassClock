import {
    checkTimeRange,
    getValueIfKeyInList,
    sortClassesByStartTime
} from "../utils/helpers";
import { DateTime } from "luxon";
import { TimeComparisons } from "../utils/enums";
import BellSchedule from "./bellschedule";
import find from 'lodash.find'
import UpdateTimestampedObject from "./updateTimestampedObject";
import Time from "./time";

export default class School extends UpdateTimestampedObject {
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
            DateTime.fromISO(getValueIfKeyInList(["creation_date", "creationDate"], json), { zone: 'utc' }),
            DateTime.fromISO(getValueIfKeyInList(["last_modified", "lastModified"], json), { zone: 'utc' })
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
    private creationDate?: DateTime;

    constructor(
        id: string,
        ownerId: string,
        fullName: string,
        acronym: string,
        endpoint: string,
        timeZone?: string,
        schedules?: BellSchedule[],
        passingPeriodName?: string,
        creationDate?: DateTime,
        lastUpdatedDate?: DateTime
    ) {
        super(lastUpdatedDate)
        this.id = id;
        this.ownerId = ownerId;
        this.endpoint = endpoint;
        this.fullName = fullName;
        this.acronym = acronym;
        this.timeZone = timeZone;
        this.schedules = schedules;
        this.passingPeriodName = passingPeriodName;
        this.creationDate = creationDate;
        
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

    //can also be used as isNoSchoolDay() by checking for undefined
    public getScheduleForDate(date: DateTime) {
        if (this.schedules) {
            for (const schedule of this.schedules) {
                if (schedule.getDate(date)) {
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
    /**
     * Checks whether school is currently "in session", meaning that school is currently happening for the day (aka a time is between the start of the first class and the end of the last class)
     * @param date the time to check
     * @returns true if school is in session, false otherwise
     */
    public isInSession(date: DateTime): boolean {
        const currentSchedule = this.getScheduleForDate(date);
        if (!currentSchedule) {
            return false;
        }

        const sortedClasses = sortClassesByStartTime(currentSchedule.getAllClasses())
        const firstClass = sortedClasses[0]
        const lastClass = sortedClasses[currentSchedule.numberOfClasses()-1]
        return (
            checkTimeRange(
                Time.fromDateTime(date, this.timeZone),
                firstClass.getStartTime(),
                lastClass.getEndTime()
            ) == TimeComparisons.IS_DURING_OR_EXACTLY
        );
    }
}
