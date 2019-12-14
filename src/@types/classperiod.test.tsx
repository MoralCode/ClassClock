import React from "react";
import ReactDOM from "react-dom";
import BellSchedule from "./bellschedule";
import ClassPeriod from "./classperiod";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";

const currentDate = new Date("2019-07-28T07:37:50.634Z");

const name = "First Period";

const startTime = new Time(8, 25);
const endTime = new Time(9, 55);

const classPeriodA = new ClassPeriod(name, startTime, endTime, currentDate);

describe("ClassPeriod", () => {

    it("gets from json", () => {
        expect(
            ClassPeriod.fromJson({
                name: "First Period",
                startTime: "08:25",
                endTime: "09:55",
                creationDate: "2019-07-28T07:37:50.634Z"
            })
        ).toEqual(classPeriodA);
    });

    //gonna assume the constructor works

    it("can get its name", () => {
        expect(classPeriodA.getName()).toBe(name);
    });

    it("can get its start time", () => {
        expect(classPeriodA.getStartTime()).toBe(startTime);
    });

    it("can get its end time", () => {
        expect(classPeriodA.getEndTime()).toBe(endTime);
    });

    it("can get its duration", () => {
        expect(classPeriodA.getDuration()).toEqual(new Time(1, 30));
    });

    it("can check if a time falls in its range", () => {

        expect(classPeriodA.stateForTime(new Time(8, 0))).toBe(TimeComparisons.IS_BEFORE);

        expect(classPeriodA.stateForTime(startTime)).toBe(TimeComparisons.IS_DURING_OR_EXACTLY);

        expect(classPeriodA.stateForTime(endTime)).toBe(TimeComparisons.IS_DURING_OR_EXACTLY);

        expect(classPeriodA.stateForTime(new Time(10, 0))).toBe(TimeComparisons.IS_AFTER);
    });
});
