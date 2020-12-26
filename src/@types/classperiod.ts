import { DateTime, Interval } from "luxon";
import { checkTimeRange, getValueIfKeyInList } from "../utils/helpers";

export default class ClassPeriod {
    public static fromJson(json: any) {
        const start = getValueIfKeyInList(["startTime", "start_time"], json);
        const end = getValueIfKeyInList(["endTime", "end_time"], json);
        return new ClassPeriod(
            getValueIfKeyInList(["name", "classPeriodName", "class_period_name"], json),
            start instanceof DateTime ? start : DateTime.fromISO(start),
            end instanceof DateTime ? end : DateTime.fromISO(end),
            DateTime.fromISO(getValueIfKeyInList(["creationDate", "creation_date"], json))
        );
    }
    private name: string;
    private startTime: DateTime;
    private endTime: DateTime;
    private creationDate: DateTime;

    constructor(name: string, startTime: DateTime, endTime: DateTime, creationDate: DateTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.creationDate = creationDate;
    }

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getStartTime() {
        return this.startTime;
    }

    public setStartTime(time: DateTime) {
        this.startTime = time;
    }

    public getEndTime() {
        return this.endTime;
    }

    public setEndTime(time: DateTime) {
        this.endTime = time;
    }

    public getDuration() {
        return Interval.fromDateTimes(this.startTime, this.endTime);
    }

    public getCreationDate() {
        return this.creationDate;
    }

    //remove me
    public stateForTime(time: DateTime) {
        return checkTimeRange(time, this.startTime, this.endTime);
    }
}
