import ClassPeriod from "./classperiod";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";

export default class BellSchedule {
    private id: string;
    private name: string;
    private endpoint: string;
    private displayName?: string;
    private dates: Date[];
    private classes: ClassPeriod[];
    private lastUpdatedDate: Date;

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
        if (this.displayName !== undefined) {
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

    public getAllClasses() {
        return this.classes;
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
        for (const classPeriod of this.classes) {
            if (classPeriod.stateForTime(time) === TimeComparisons.IS_DURING_OR_EXACTLY) {
                return classPeriod;
            }
        }
    }
}
