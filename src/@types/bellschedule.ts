import ClassPeriod from "./classperiod";
import { DateTime } from "luxon";
import { TimeComparisons } from "../utils/enums";
import { getValueIfKeyInList, sortClassesByStartTime } from "../utils/helpers";
import UpdateTimestampedObject from "./updateTimestampedObject";
import Time from "./time";

export default class BellSchedule extends UpdateTimestampedObject {
    public static fromJson(json: any) {
        return new BellSchedule(
            getValueIfKeyInList(["id", "identifier"], json),
            getValueIfKeyInList(["name", "full_name", "fullName"], json),
            getValueIfKeyInList(["endpoint"], json),
            getValueIfKeyInList(["dates"], json).map((date: string) => DateTime.fromISO(date).toUTC()),
            getValueIfKeyInList(["classes", "meeting_times"], json).map(
                (meetingTime: any) => ClassPeriod.fromJson(meetingTime)
            ),
            DateTime.fromISO(getValueIfKeyInList(["last_modified", "lastModified"], json), { zone: 'utc' }),
            getValueIfKeyInList(["display_name"], json),
        );
    }

    private id: string;
    private name: string;
    private endpoint: string;
    private displayName?: string;
    private dates: DateTime[];
    private classes: ClassPeriod[];
    private color?: string;

    constructor(
        id: string,
        name: string,
        endpoint: string,
        dates: DateTime[],
        classes: ClassPeriod[],
        lastUpdatedDate: DateTime,
        displayName?: string
    ) {
        super(lastUpdatedDate)
        this.id = id;
        this.name = name;
        this.endpoint = endpoint;
        this.displayName = displayName;
        this.dates = dates;
        this.classes = classes;
    
    }

    public getIdentifier() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

     public setName(name: string) {
        this.name = name;
    }

    public setDisplayName(name: string) {
        this.displayName = name;
    }

    public getDisplayName() {
        if (this.displayName) {
            return this.displayName;
        } else {
            return this.name;
        }
    }

    public getEndpoint() {
        return this.endpoint;
    }

    public getDates() {
        return this.dates;
    }

    /**returns the actual date object from the schedule that has the same date as
     * the provided object.
     * used for checking if a schedule has a particular date as well as correcting 
     * inaccuracies due to incorrect milliseconds .etc.
     * 
     */
    public getDate(date: DateTime) {
        for (const scheduleDate of this.getDates()) {
            if (scheduleDate.hasSame(date, "day")) {
                return scheduleDate;
            }
        }
        return;
    }

    public addDate(date: DateTime) {
        this.dates.push(date);
    }
    
    public removeDate(date: DateTime) {
        const actualDate = this.getDate(date);
        if (!actualDate){
            return false;
        }
        const index = this.dates.indexOf(actualDate);
        return this.dates.splice(index, 1)[0];
    }

    public getAllClasses() {
        return this.classes;
    }

    public getClassPeriodForTime(time: DateTime, schoolTimezone:string) {
        for (const classPeriod of sortClassesByStartTime(this.classes)) {
            if (classPeriod.stateForTime(Time.fromDateTime(time, schoolTimezone)) === TimeComparisons.IS_DURING_OR_EXACTLY) {
                return classPeriod;
            }
        }
        return;
    }

    public getClassStartingAfter(time: DateTime, schoolTimezone: string) {
        for (const classPeriod of sortClassesByStartTime(this.classes)) {
            if (classPeriod.stateForTime(Time.fromDateTime(time, schoolTimezone)) === TimeComparisons.IS_BEFORE) {
                return classPeriod;
            }
        }
        return;
    }

    //it would be better to call this last class index or drop the -1
    public numberOfClasses() {
        return this.classes.length - 1;
    }

    public addClass(classPeriod: ClassPeriod) {
        this.classes.push(classPeriod);
    }

    public removeClass(classPeriod: ClassPeriod) {
        const index = this.classes.indexOf(classPeriod);
        if (!index) {
            console.warn("attempt to remove nonexistent class period")
            return;
        }
        return this.classes.splice(index, 1)[0];
    }

    public getColor(){
        return this.color;
    }

    public setColor(color: string) {
        this.color = color;
    }

}
