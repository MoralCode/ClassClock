import BellSchedule from "./bellschedule";
import { bellSchedule as schedule, bellScheduleJSON, classPeriod, bellScheduleEndpoint, bellScheduleName, bellScheduleDisplayName, bellScheduleId, startTime, beforeClass, duringClass, endTime, afterClass, bellScheduleClasses } from "../utils/testconstants";
import { DateTime } from "luxon";

describe("BellSchedule", () => {

    it("should get from JSON", () => {
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
            DateTime.fromISO("2019-07-28T07:37:50.634").toUTC(),
            DateTime.fromISO("2019-07-29T07:38:10.979").toUTC(),
            DateTime.fromISO("2019-07-23T07:38:28.263").toUTC()
        ]);
    });

    it("can return its classes", () => {
        expect(schedule.getAllClasses()).toEqual(bellScheduleClasses);
    });

    it("can get the correct number of classes", () => {
        expect(schedule.numberOfClasses()).toEqual([classPeriod].length);
    });

    it("can return date last updated", () => {
        expect(schedule.lastUpdated()).toEqual(DateTime.fromISO("2019-07-28T07:37:50.634").toUTC());
    });

    it("can test if it has changed since a given date", () => {
        expect(schedule.hasChangedSince(DateTime.fromISO("2019-07-28T07:07:50.634").toUTC())).toBeTruthy();
        expect(schedule.hasChangedSince(DateTime.fromISO("2019-07-28T08:07:50.634").toUTC())).toBeFalsy();
    });

    it("can get a class period for a given time", () => {
        //before
        expect(schedule.getClassPeriodForTime(beforeClass)).toBeFalsy();

        //exactly start
        expect(schedule.getClassPeriodForTime(startTime)).toEqual(classPeriod);

        //middle
        expect(schedule.getClassPeriodForTime(duringClass)).toEqual(classPeriod);

        //exactly end
        expect(schedule.getClassPeriodForTime(endTime)).toEqual(classPeriod);
        
        //after
        expect(schedule.getClassPeriodForTime(afterClass)).toBeFalsy();
    });
});
