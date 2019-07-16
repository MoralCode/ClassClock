import Time from "./time";

export class ClassPeriod {
    private name: string;
    private startTime: Time;
    private endTime: Time;

    constructor(name: string, startTime: Time, endTime: Time) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
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
}
