import React from "react";
import ReactDOM from "react-dom";
import BellSchedule from "./bellschedule";
import ClassPeriod from "./classperiod";
import Time from "./time";
import { TimeComparisons } from "../utils/enums";
import { classPeriod, className, startTime, endTime, classDuration, beforeClass, afterClass, duringClass, classPeriodJSON, currentDate, classPeriodJSONISO } from "../utils/testconstants";

export const classPeriodJSONObjectTime = {
    name: className,
    startTime,
    endTime,
    creationDate: currentDate
};

describe("ClassPeriod", () => {

    it("can construct from json with standard string times", () => {
        //TODO: the start and end times should be plain HH:MM, not full datetimes

        let constructed = ClassPeriod.fromJson(classPeriodJSON)
        expect(constructed.getName()).toEqual(classPeriod.getName());
        expect(constructed.getDuration()).toEqual(classPeriod.getDuration());
        expect(constructed.getStartTime()).toEqual(classPeriod.getStartTime());
        expect(constructed.getEndTime()).toEqual(classPeriod.getEndTime());
        expect(constructed.getCreationDate()).toEqual(classPeriod.getCreationDate());

    });

    it("can construct from json with standard string times", () => {
        //TODO: the start and end times should be plain HH:MM, not full datetimes

        let constructed = ClassPeriod.fromJson(classPeriodJSONISO)
        expect(constructed.getName()).toEqual(classPeriod.getName());
        expect(constructed.getDuration()).toEqual(classPeriod.getDuration());
        expect(constructed.getStartTime()).toEqual(classPeriod.getStartTime());
        expect(constructed.getEndTime()).toEqual(classPeriod.getEndTime());
        expect(constructed.getCreationDate()).toEqual(classPeriod.getCreationDate());

    });

    it("can construct from json with object times", () => {
        // expect(ClassPeriod.fromJson(classPeriodJSONObjectTime)).toEqual(classPeriod);

        let constructed = ClassPeriod.fromJson(classPeriodJSONObjectTime)
        expect(constructed.getName()).toEqual(classPeriod.getName());
        expect(constructed.getDuration()).toEqual(classPeriod.getDuration());
        expect(constructed.getStartTime()).toEqual(classPeriod.getStartTime());
        expect(constructed.getEndTime()).toEqual(classPeriod.getEndTime());
        expect(constructed.getCreationDate()).toEqual(classPeriod.getCreationDate());

    });

    //gonna assume the constructor works

    it("can get its name", () => {
        expect(classPeriod.getName()).toBe(className);
    });

    it("can get its start time", () => {
        expect(classPeriod.getStartTime()).toBe(startTime);
    });

    it("can get its end time", () => {
        expect(classPeriod.getEndTime()).toBe(endTime);
    });

    it("can get its duration", () => {
        expect(classPeriod.getDuration()).toEqual(classDuration);
    });

    it("can check if a time falls in its range", () => {

        expect(classPeriod.stateForTime(beforeClass)).toBe(TimeComparisons.IS_BEFORE);

        expect(classPeriod.stateForTime(startTime)).toBe(TimeComparisons.IS_DURING_OR_EXACTLY);

        expect(classPeriod.stateForTime(duringClass)).toBe(
            TimeComparisons.IS_DURING_OR_EXACTLY
        );

        expect(classPeriod.stateForTime(endTime)).toBe(TimeComparisons.IS_DURING_OR_EXACTLY);

        expect(classPeriod.stateForTime(afterClass)).toBe(TimeComparisons.IS_AFTER);
    });
});
