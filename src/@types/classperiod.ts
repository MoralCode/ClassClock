import Time from "./time";
import { checkTimeRange, getValueIfKeyInList } from "../utils/helpers";

export default class ClassPeriod {
    public static fromJson(json: any) {
        const start = getValueIfKeyInList(["startTime", "start_time"], json);
        const end = getValueIfKeyInList(["endTime", "end_time"], json);
        return new ClassPeriod(
            getValueIfKeyInList(["name", "classPeriodName", "class_period_name"], json),
            start instanceof Time ? start : Time.fromString(start),
            end instanceof Time ? end : Time.fromString(end),
            new Date(getValueIfKeyInList(["creationDate", "creation_date"], json))
        );
    }
    private name: string;
    private startTime: Time;
    private endTime: Time;
    private creationDate: Date;

    constructor(name: string, startTime: Time, endTime: Time, creationDate: Date) {
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

    public setStartTime(time: Time) {
        this.startTime = time;
    }

    public getEndTime() {
        return this.endTime;
    }

    public setEndTime(time: Time) {
        this.endTime = time;
    }

    public getDuration() {
        return this.startTime.getTimeDeltaTo(this.endTime);
    }

    public getCreationDate() {
        return this.creationDate;
    }

    //remove me
    public stateForTime(time: Time) {
        return checkTimeRange(time, this.startTime, this.endTime);
    }
}
