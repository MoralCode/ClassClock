import { DateTime } from "luxon";
import { checkTimeRange, getValueIfKeyInList } from "../utils/helpers";
import Time from "./time";

export default class ClassPeriod {
    public static fromJson(json: any) {
        const start = getValueIfKeyInList(["startTime", "start_time"], json);
        const end = getValueIfKeyInList(["endTime", "end_time"], json);
        return new ClassPeriod(
            getValueIfKeyInList(["name", "classPeriodName", "class_period_name"], json),
            Time.fromString(start),
            Time.fromString(end),
            DateTime.fromISO(getValueIfKeyInList(["creationDate", "creation_date"], json), {zone: 'utc'})
        );
    }
    private name: string;
    private startTime: Time;
    private endTime: Time;
    private creationDate: DateTime;

    constructor(name: string, startTime: Time, endTime: Time, creationDate: DateTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.creationDate = creationDate;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getStartTime(): Time  {
        return this.startTime;
    }

    public setStartTime(time: Time) {
        this.startTime = time;
    }

    public getEndTime(): Time {
        return this.endTime;
    }

    public setEndTime(time: Time) {
        this.endTime = time;
    }

    public getDuration(): Time {
        return this.startTime.getTimeDeltaTo(this.endTime);
    }

    public getCreationDate(): DateTime {
        return this.creationDate;
    }

    //remove me
    public stateForTime(time: Time) {
        return checkTimeRange(time, this.startTime, this.endTime);
    }
}


