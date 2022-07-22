import School from "./school";
import { school, bellSchedule, schoolJSON, schoolId, schoolEndpoint, schoolName, schoolAcronym, passingPeriodName, schoolTimezone, currentDate, inClass, afterSchoolHours, duringClass, schoolOwnerId, beforeSchoolHours, noSchool, betweenClass } from '../utils/testconstants';
import { DateTime, Duration } from "luxon";
import Time from "./time";

const schoolNoSchedules = new School(
    schoolId,
    schoolOwnerId,
    schoolName,
    schoolAcronym,
    schoolEndpoint,
    schoolTimezone,
    [],
    passingPeriodName,
    currentDate,
    currentDate
);

const thisTime: Time = Time.fromTime(9, 31, 41);
const thisTimeUTC: Time = Time.fromISO("2022-06-16T09:31:41Z");
const preTime: Time = Time.fromTime(5, 18, 43);
const postTime: Time = Time.fromTime(13, 44, 39);

describe("School", () => {

    it("should get from JSON", () => {
        //TODO: the start and end times should be plain HH:MM, not full datetimes
        expect(
            School.fromJson(schoolJSON)
        ).toEqual(school);
    });

    //assuming constructor works, although maybe it could be tested against the fromJSON method?

    it("can return identifier", () => {
        expect(school.getIdentifier()).toBe(schoolId);
    });

    it("can return API endpoint", () => {
        expect(school.getEndpoint()).toBe(schoolEndpoint);
    });

    it("can return schedules", () => {
        expect(school.getSchedules()).toEqual([bellSchedule]);
    });

    it("can return name", () => {
        expect(school.getName()).toBe(schoolName);
    });

    it("can return acronym", () => {
        expect(school.getAcronym()).toBe(schoolAcronym);
    });

    it("can return passing time name", () => {
        expect(school.getPassingTimeName()).toBe(passingPeriodName);
    });

    it("can return timezone", () => {
        expect(school.getTimezone()).toBe(schoolTimezone);
    });

    it("can return creation date", () => {
        expect(school.getCreationDate()).toEqual(currentDate);
    });

    //these cases already covered by tests for a class they extend
    // it("can return date last updated", () => {
    //     expect(school.lastUpdated()).toEqual(currentDate);
    // });

    // it("can Test if it has changed since a given date", () => {
    //     //school was last updated on currentDate
    //     expect(school.hasChangedSince(currentDate.minus({ hours: 1 }))).toBe(true);
    //     expect(school.hasChangedSince(currentDate.plus({ hours: 1 }))).toBe(false);

    //     expect(school.hasChangedSince(DateTime.fromISO("2019-07-28T07:07:50.634", { zone: schoolTimezone }))).toBe(true);
    //     // "2019-07-28T07:37:50.634"
    //     expect(school.hasChangedSince(DateTime.fromISO("2019-07-28T08:07:50.635", { zone: schoolTimezone }))).toBe(false);
    // });

    it("can get schedule for date", () => {
        expect(school.getScheduleForDate(currentDate)).toEqual(
            bellSchedule
        );

        expect(schoolNoSchedules.getScheduleForDate(currentDate)).toBe(null);        
    });

    it("can check if it has schedules", () => {
        expect(school.hasSchedules()).toBe(true);
        expect(schoolNoSchedules.hasSchedules()).toBe(false);
    });

    it("can check if school is in session", () => {
        expect(thisTime.isAfter(preTime)).toBe(true); 
        expect(school.isInSession(inClass)).toBe(true);
        expect(school.isInSession(beforeSchoolHours)).toBe(false);
        expect(school.isInSession(noSchool)).toBe(false);
        expect(school.isInSession(afterSchoolHours)).toBe(false);
        expect(school.isInSession(betweenClass)).toBe(true);
    });
});
