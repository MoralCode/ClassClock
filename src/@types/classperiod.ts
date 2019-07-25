import Time from "./time";
import { checkTimeRange, getValueIfKeyInList } from "../utils/helpers";

export default class ClassPeriod {
    public static fromJson(json: any) {
        return new ClassPeriod(
            getValueIfKeyInList(["name", "classPeriodName", "class_period_name"], json),
            Time.fromString(getValueIfKeyInList(["startTime", "start_time"], json)),
            Time.fromString(getValueIfKeyInList(["endTime", "end_time"], json)),
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

    public getStartTime() {
        return this.startTime;
    }

    public getEndTime() {
        return this.endTime;
    }

    public getDuration() {
        return this.startTime.getTimeDeltaTo(this.endTime);
    }

    public stateForTime(time: Time) {
        return checkTimeRange(time, this.startTime, this.endTime);
    }
}
