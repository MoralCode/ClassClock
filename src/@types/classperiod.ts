import Time from "./time";
import { checkTimeRange } from "../utils/helpers";

export default class ClassPeriod {
    public static fromJson(json: any) {
        return new ClassPeriod(
            json.name,
            Time.fromString(json.start_time),
            Time.fromString(json.end_time),
            new Date(json.creation_date)
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
