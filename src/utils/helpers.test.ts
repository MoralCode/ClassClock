
import {
    getValueIfKeyInList,
    sortClassesByStartTime,
    getTimeStateForDateAtSchool,
    checkTimeRange
} from "./helpers";
import ClassPeriod from "../@types/classperiod";
import { classPeriod2, classPeriod, beforeSchoolHours, school, betweenClass, inClass, noSchool, afterSchoolHours, bellScheduleClasses, duringClass as duringClassDate, startTime as startTimeDate, endTime as endTimeDate, startTime2 as startTime2Date, beforeClass as beforeClassDate, endTime2 as endTime2Date, afterClass as afterClassDate } from "./testconstants";
import { TimeStates, TimeComparisons } from "./enums";
import Time from "../@types/time";

const startTime = Time.fromDateTime(startTimeDate)
const endTime = Time.fromDateTime(endTimeDate)
const startTime2 = Time.fromDateTime(startTime2Date)
const endTime2 = Time.fromDateTime(endTime2Date)

const duringClass = Time.fromDateTime(duringClassDate)
const beforeClass = Time.fromDateTime(beforeClassDate)
const afterClass = Time.fromDateTime(afterClassDate)
test("get value if key in list", () => {
    const object1 = { value1: "foo" };
    const object2 = { value_1: "foo" };
    const list = ["value_1", "value1"];

    expect(getValueIfKeyInList(list, object1)).toBe("foo");
    expect(getValueIfKeyInList(list, object2)).toBe("foo");
    expect(getValueIfKeyInList(["doesNotExist"], object1)).toBeFalsy();
});

//ignoring getCurrentDate

test("sort classes by start time", () => {
    expect(sortClassesByStartTime(bellScheduleClasses.reverse())[0]).toEqual(bellScheduleClasses[0]);
    expect(sortClassesByStartTime(bellScheduleClasses.reverse())[1]).toEqual(bellScheduleClasses[1]);
    expect(sortClassesByStartTime(bellScheduleClasses.reverse())[0].getName()).toEqual("First Period");
});


test("get time states for given date and school", () => {
    expect(getTimeStateForDateAtSchool(beforeSchoolHours, school)).toBe(
        TimeStates.OUTSIDE_SCHOOL_HOURS
    );

    expect(getTimeStateForDateAtSchool(noSchool, school)).toBe(
        TimeStates.DAY_OFF
    );

    expect(getTimeStateForDateAtSchool(betweenClass, school)).toBe(
        TimeStates.SCHOOL_IN_CLASS_OUT
    );

    expect(getTimeStateForDateAtSchool(inClass, school)).toBe(
        TimeStates.CLASS_IN_SESSION
    );

    expect(getTimeStateForDateAtSchool(afterSchoolHours, school)).toBe(
        TimeStates.OUTSIDE_SCHOOL_HOURS
    );
    
});

test("check time range", () => {

    expect(checkTimeRange(duringClass, startTime, endTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(duringClass, endTime, startTime2)).toBe(
        TimeComparisons.IS_BEFORE
    );

    expect(checkTimeRange(beforeClass, startTime, endTime2)).toBe(
        TimeComparisons.IS_BEFORE
    );

    expect(checkTimeRange(startTime, startTime, endTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(endTime, startTime, endTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(afterClass, startTime, endTime)).toBe(
        TimeComparisons.IS_AFTER
    );

    expect(checkTimeRange(afterClass, startTime, endTime2)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );
});

test("check time range with start and end swapped", () => {

    expect(checkTimeRange(duringClass, endTime, startTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(duringClass, startTime2, endTime)).toBe(
        TimeComparisons.IS_BEFORE
    );

    expect(checkTimeRange(beforeClass, endTime2, startTime)).toBe(
        TimeComparisons.IS_BEFORE
    );

    expect(checkTimeRange(startTime, endTime, startTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(endTime, endTime, startTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );

    expect(checkTimeRange(afterClass, endTime, startTime)).toBe(
        TimeComparisons.IS_AFTER
    );

    expect(checkTimeRange(afterClass, endTime2, startTime)).toBe(
        TimeComparisons.IS_DURING_OR_EXACTLY
    );
});