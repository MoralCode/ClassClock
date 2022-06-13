import School from "./school";
import { school, bellSchedule, schoolJSON, schoolId, schoolEndpoint, schoolName, schoolAcronym, passingPeriodName, schoolTimezone, currentDate, inClass, afterSchoolHours, duringClass, schoolOwnerId, beforeSchoolHours, noSchool, betweenClass } from '../utils/testconstants';
import { DateTime, Duration } from "luxon";

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


describe("School", () => {

    it("should get from JSON", () => {
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

    it("can return date last updated", () => {
        expect(school.lastUpdated()).toEqual(currentDate);
    });

    it("can Test if it has changed since a given date", () => {
        //school was last updated on currentDate
        expect(school.hasChangedSince(currentDate.minus({ hours: 1 }))).toBe(true);
        expect(school.hasChangedSince(currentDate.plus({ hours: 1 }))).toBe(false);
    });

    it("can get schedule for date", () => {
        expect(school.getScheduleForDate(currentDate)).toEqual(
            bellSchedule
        );

        expect(schoolNoSchedules.getScheduleForDate(currentDate)).toBeFalsy();        
    });

    it("can check if it has schedules", () => {
        expect(school.hasSchedules()).toBeTruthy();
        expect(schoolNoSchedules.hasSchedules()).toBeFalsy();
    });

    it("can check if school is in session", () => {
        expect(school.isInSession(inClass)).toBeTruthy();
        expect(school.isInSession(beforeSchoolHours)).toBeFalsy();
        expect(school.isInSession(noSchool)).toBeFalsy();
        expect(school.isInSession(afterSchoolHours)).toBeFalsy();
        expect(school.isInSession(betweenClass)).toBeTruthy();
    });
});
