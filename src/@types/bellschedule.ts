import { IPeriod } from "./interfaces";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import { checkTimeRange } from "../utils/helpers";

export default class BellSchedule {
    private name: string;
    private dates: Date[];
    private classes: IPeriod[];

    constructor(name: string, dates: Date[], classes: IPeriod[]) {
        this.name = name;
        this.dates = dates;
        this.classes = classes;
    }

    public getName() {
        return this.name;
    }

    public getDates() {
        return this.dates;
    }

    public getAllClasses() {
        return this.classes;
    }

    public getClassPeriodForTime(time: Time) {
        for (const classPeriod in this.classes) {
            if (this.classes.hasOwnProperty(classPeriod)) {
                return checkTimeRange(
                    time,
                    classPeriod.startTime,
                    classPeriod.endTime
                ) === TimeComparisons.IS_DURING_OR_EXACTLY
                    ? classPeriod
                    : undefined;
            }
        }
    }
}
