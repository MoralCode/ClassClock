import BellSchedule from "./bellschedule";
import { bellSchedule as schedule, bellScheduleJSON, classPeriod, bellScheduleEndpoint, bellScheduleName, bellScheduleDisplayName, bellScheduleId, startTimeDT, beforeClassDT, duringClassDT, endTimeDT, afterClassDT, bellScheduleClasses, schoolTimezone } from "../utils/testconstants";
import { DateTime } from "luxon";

describe("BellSchedule", () => {

    it("should get from JSON", () => {
        //TODO: the start and end times should be plain HH:MM, not full datetimes

        expect(
            BellSchedule.fromJson(bellScheduleJSON)
        ).toEqual(schedule);
    });

    it("can get its identifier", () => {
        expect(schedule.getIdentifier()).toBe(bellScheduleId);
    });

    it("can get its name", () => {
        expect(schedule.getName()).toEqual(bellScheduleName);
    });

    it("can return API endpoint", () => {
        expect(schedule.getEndpoint()).toBe(bellScheduleEndpoint);
    });


    it("can get its dates", () => {
        expect(schedule.getDates()).toEqual([
            DateTime.fromISO("2019-07-28T07:37:50.634", {locale: "en-US"}).toUTC(),
            DateTime.fromISO("2019-07-29T07:38:10.979", {locale: "en-US"}).toUTC(),
            DateTime.fromISO("2019-07-23T07:38:28.263", {locale: "en-US"}).toUTC()
        ]);
    });

    it("can return its classes", () => {
        expect(schedule.getAllClasses()).toEqual(bellScheduleClasses);
    });

    it("can get the correct number of classes", () => {
        expect(schedule.numberOfClasses()).toEqual([classPeriod].length);
    });

    //these cases already covered by tests for a class they extend
    // it("can return date last updated", () => {
    //     expect(schedule.lastUpdated()).toEqual(DateTime.fromISO("2019-07-28T07:37:50.634", {zone: schoolTimezone}).toUTC());
    // });

    // it("can test if it has changed since a given date", () => {
    //     expect(schedule.hasChangedSince(DateTime.fromISO("2019-07-28T07:07:50.634", {zone: schoolTimezone}).toUTC())).toBe(true);
    //     expect(schedule.hasChangedSince(DateTime.fromISO("2019-07-28T08:07:50.634", {zone: schoolTimezone}).toUTC())).toBe(false);
    // });

    it("can get a class period for a given time", () => {
        //before
        expect(schedule.getClassPeriodForTime(beforeClassDT)).toBeUndefined();

        //exactly start
        expect(schedule.getClassPeriodForTime(startTimeDT)).toEqual(classPeriod);

        //middle
        expect(schedule.getClassPeriodForTime(duringClassDT)).toEqual(classPeriod);

        //exactly end
        expect(schedule.getClassPeriodForTime(endTimeDT)).toEqual(classPeriod);
        
        //after
        expect(schedule.getClassPeriodForTime(afterClassDT)).toBeUndefined();
    });
});
