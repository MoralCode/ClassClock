import ClassPeriod from "./classperiod";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import { getValueIfKeyInList, sortClassesByStartTime } from "../utils/helpers";
import { parse, isSameDay } from "date-fns";

export default class BellSchedule {
    public static fromJson(json: any) {
        return new BellSchedule(
            getValueIfKeyInList(["id", "identifier"], json),
            getValueIfKeyInList(["name", "full_name", "fullName"], json),
            getValueIfKeyInList(["endpoint"], json),
            getValueIfKeyInList(["dates"], json).map((date: string) => parse(date)),
            getValueIfKeyInList(["classes", "meeting_times"], json).map(
                (meetingTime: any) => ClassPeriod.fromJson(meetingTime)
            ),
            getValueIfKeyInList(["lastModified", "last_modified"], json)
            //display name
        );
    }

    private id: string;
    private name: string;
    private endpoint: string;
    private displayName?: string;
    private dates: Date[];
    private classes: ClassPeriod[];
    private lastUpdatedDate: Date;
    private color?: string;

    constructor(
        id: string,
        name: string,
        endpoint: string,
        dates: Date[],
        classes: ClassPeriod[],
        lastUpdatedDate: Date,
        displayName?: string
    ) {
        this.id = id;
        this.name = name;
        this.endpoint = endpoint;
        this.displayName = displayName;
        this.dates = dates;
        this.classes = classes;
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public getIdentifier() {
        return this.id;
    }

    public getName() {
        return this.name;
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
    public getDate(date: Date) {
        for (const scheduleDate of this.getDates()) {
            if (isSameDay(scheduleDate, date)) {
                return scheduleDate;
            }
        }
        return;
    }

    public addDate(date: Date) {
        this.dates.push(date);
    }
    
    public removeDate(date: Date) {
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

    public getColor(){
        return this.color;
    }

    public setColor(color: string) {
        this.color = color;
    }

    public numberOfClasses() {
        return this.classes.length - 1;
    }

    public lastUpdated() {
        return this.lastUpdatedDate;
    }

    public hasChangedSince(date: Date) {
        return date.getTime() - this.lastUpdatedDate.getTime() > 0;
    }

    public getClassPeriodForTime(time: Time) {
        for (const classPeriod of sortClassesByStartTime(this.classes)) {
            if (classPeriod.stateForTime(time) === TimeComparisons.IS_DURING_OR_EXACTLY) {
                return classPeriod;
            }
        }
        return;
    }
}
